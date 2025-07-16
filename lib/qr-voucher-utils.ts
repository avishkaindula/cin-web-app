import QRCode from 'qrcode'
import crypto from 'crypto'

export interface VoucherQRData {
  id: string
  voucherId: number
  value: number
  expiryDate: string
  signature: string
  issueDate: string
}

// Secret key for signing vouchers (in production, this should be an environment variable)
const VOUCHER_SECRET = 'cin-voucher-secret-2025'

// Generate a secure signature for voucher data
export function generateVoucherSignature(data: Omit<VoucherQRData, 'signature'>): string {
  const payload = `${data.id}:${data.voucherId}:${data.value}:${data.expiryDate}:${data.issueDate}`
  return crypto
    .createHmac('sha256', VOUCHER_SECRET)
    .update(payload)
    .digest('hex')
    .substring(0, 16) // Use first 16 characters for shorter QR codes
}

// Verify voucher signature
export function verifyVoucherSignature(data: VoucherQRData): boolean {
  const expectedSignature = generateVoucherSignature({
    id: data.id,
    voucherId: data.voucherId,
    value: data.value,
    expiryDate: data.expiryDate,
    issueDate: data.issueDate
  })
  return expectedSignature === data.signature
}

// Generate a unique voucher ID
export function generateVoucherId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `VCH-${timestamp}-${randomStr}`.toUpperCase()
}

// Create voucher QR data
export function createVoucherQRData(
  voucherId: number,
  value: number,
  validityDays: number = 180
): VoucherQRData {
  const now = new Date()
  const expiryDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000)
  
  const voucherData: Omit<VoucherQRData, 'signature'> = {
    id: generateVoucherId(),
    voucherId,
    value,
    expiryDate: expiryDate.toISOString(),
    issueDate: now.toISOString()
  }
  
  const signature = generateVoucherSignature(voucherData)
  
  return {
    ...voucherData,
    signature
  }
}

// Generate QR code as data URL
export async function generateVoucherQRCode(voucherData: VoucherQRData): Promise<string> {
  try {
    const qrData = JSON.stringify(voucherData)
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#92400e', // amber-700
        light: '#fffbeb'  // amber-50
      },
      width: 256
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// Validate voucher QR data
export interface VoucherValidationResult {
  isValid: boolean
  status: 'valid' | 'expired' | 'invalid_signature' | 'malformed'
  data?: VoucherQRData
  message: string
}

export function validateVoucherQRData(qrCodeData: string): VoucherValidationResult {
  try {
    // Parse the QR code data
    const data: VoucherQRData = JSON.parse(qrCodeData)
    
    // Check if all required fields are present
    if (!data.id || !data.voucherId || !data.value || !data.expiryDate || !data.signature || !data.issueDate) {
      return {
        isValid: false,
        status: 'malformed',
        message: 'QR code data is incomplete or malformed'
      }
    }
    
    // Verify signature
    if (!verifyVoucherSignature(data)) {
      return {
        isValid: false,
        status: 'invalid_signature',
        data,
        message: 'Voucher signature is invalid - this voucher may be counterfeit'
      }
    }
    
    // Check expiry date
    const now = new Date()
    const expiryDate = new Date(data.expiryDate)
    
    if (expiryDate < now) {
      return {
        isValid: false,
        status: 'expired',
        data,
        message: `Voucher expired on ${expiryDate.toLocaleDateString()}`
      }
    }
    
    return {
      isValid: true,
      status: 'valid',
      data,
      message: 'Voucher is valid and ready to use'
    }
    
  } catch (error) {
    return {
      isValid: false,
      status: 'malformed',
      message: 'Invalid QR code format'
    }
  }
}

// Generate a complete voucher with QR code
export async function generateCompleteVoucher(
  voucherId: number,
  value: number,
  validityDays: number = 180
) {
  const voucherData = createVoucherQRData(voucherId, value, validityDays)
  const qrCodeDataURL = await generateVoucherQRCode(voucherData)
  
  return {
    voucherData,
    qrCodeDataURL,
    qrCodeString: JSON.stringify(voucherData)
  }
}
