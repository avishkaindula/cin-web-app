"use client"

import { useState } from 'react'
import { QRScanner } from '@/components/qr-scanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Calendar, Users, QrCode } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface EventAttendee {
  id: string
  userId: string
  userName: string
  userEmail: string
  scannedAt: Date
  eventId: string
  status: 'checked_in' | 'already_checked_in' | 'not_registered' | 'invalid_qr' | 'malformed'
}

interface MockEvent {
  id: string
  name: string
  date: string
  location: string
  registeredCount: number
  checkedInCount: number
}

// Mock events data - in real app this would come from your database
const mockEvents: MockEvent[] = [
  {
    id: "evt_1",
    name: "Community Tree Planting Drive",
    date: "2025-01-20",
    location: "Central Park",
    registeredCount: 45,
    checkedInCount: 12
  },
  {
    id: "evt_2", 
    name: "Ocean Cleanup Workshop",
    date: "2025-01-25",
    location: "Beach Front Center",
    registeredCount: 30,
    checkedInCount: 8
  },
  {
    id: "evt_3",
    name: "Sustainable Living Seminar",
    date: "2025-02-01", 
    location: "Community Hall",
    registeredCount: 60,
    checkedInCount: 0
  }
]

export default function ScanEventQRPage() {
  const { activeOrganization } = useAuth()
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [scannedAttendees, setScannedAttendees] = useState<EventAttendee[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const selectedEvent = mockEvents.find(event => event.id === selectedEventId)

  const handleScanSuccess = async (qrData: string) => {
    if (!selectedEventId) {
      toast({
        variant: "destructive",
        title: "No Event Selected",
        description: "Please select an event before scanning QR codes",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      // Parse QR data - expecting user check-in QR format
      let userData: any
      
      try {
        userData = JSON.parse(qrData)
      } catch (parseError) {
        const attendee: EventAttendee = {
          id: `scan_${Date.now()}`,
          userId: 'unknown',
          userName: 'Unknown User',
          userEmail: 'unknown@example.com',
          scannedAt: new Date(),
          eventId: selectedEventId,
          status: 'malformed'
        }

        setScannedAttendees(prev => [attendee, ...prev])
        
        toast({
          variant: "destructive",
          title: "Invalid QR Code Format",
          description: "The QR code is not in the expected format for event check-in",
        })
        return
      }
      
      // Validate QR data structure
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid QR data structure')
      }

      // Initialize status and user info
      let status: EventAttendee['status'] = 'invalid_qr'
      let userName = 'Unknown User'
      let userEmail = 'unknown@example.com'
      let userId = 'unknown'
      
      // Check if this is a valid event check-in QR
      if (userData.type === 'event_checkin' && userData.userId) {
        userId = userData.userId
        
        // Check if user is already checked in for this event
        const alreadyCheckedIn = scannedAttendees.some(
          attendee => attendee.userId === userData.userId && 
                     attendee.eventId === selectedEventId &&
                     attendee.status === 'checked_in'
        )
        
        if (alreadyCheckedIn) {
          status = 'already_checked_in'
          userName = userData.name || `User ${userData.userId.substring(0, 8)}`
          userEmail = userData.email || `user${userData.userId.substring(0, 4)}@example.com`
        } else {
          // Mock registration check - in real app this would check your database
          const isRegistered = Math.random() > 0.2 // 80% chance of being registered for demo
          
          if (isRegistered) {
            status = 'checked_in'
            userName = userData.name || `User ${userData.userId.substring(0, 8)}`
            userEmail = userData.email || `user${userData.userId.substring(0, 4)}@example.com`
          } else {
            status = 'not_registered'
            userName = userData.name || 'Unregistered User'
            userEmail = userData.email || 'unregistered@example.com'
          }
        }
      }

      const attendee: EventAttendee = {
        id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        userId,
        userName,
        userEmail,
        scannedAt: new Date(),
        eventId: selectedEventId,
        status
      }

      setScannedAttendees(prev => [attendee, ...prev])

      // Show appropriate toast message with better error handling
      const statusValue = status as EventAttendee['status']
      switch (statusValue) {
        case 'checked_in':
          toast({
            title: "✅ Check-in Successful",
            description: `${userName} has been checked in to the event`,
          })
          break
        case 'already_checked_in':
          toast({
            variant: "destructive",
            title: "Already Checked In", 
            description: `${userName} was already checked in earlier`,
          })
          break
        case 'not_registered':
          toast({
            variant: "destructive",
            title: "Not Registered",
            description: `${userName} is not registered for this event`,
          })
          break
        case 'invalid_qr':
          toast({
            variant: "destructive",
            title: "Invalid QR Code",
            description: "This QR code is not valid for event check-in",
          })
          break
        case 'malformed':
          toast({
            variant: "destructive",
            title: "Malformed QR Code",
            description: "The QR code format is not recognized",
          })
          break
      }
    } catch (error) {
      console.error('Error processing scanned QR:', error)
      
      // Create an error entry for tracking
      const errorAttendee: EventAttendee = {
        id: `error_${Date.now()}`,
        userId: 'error',
        userName: 'Processing Error',
        userEmail: 'error@system.com',
        scannedAt: new Date(),
        eventId: selectedEventId,
        status: 'invalid_qr'
      }

      setScannedAttendees(prev => [errorAttendee, ...prev])
      
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to process the scanned QR code. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleScanError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: error,
    })
  }

  const getStatusColor = (status: EventAttendee['status']) => {
    switch (status) {
      case 'checked_in': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'already_checked_in': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'not_registered': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'invalid_qr': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'malformed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: EventAttendee['status']) => {
    switch (status) {
      case 'checked_in': return <CheckCircle className="h-4 w-4" />
      case 'already_checked_in': return <CheckCircle className="h-4 w-4" />
      case 'not_registered': return <XCircle className="h-4 w-4" />
      case 'invalid_qr': return <XCircle className="h-4 w-4" />
      case 'malformed': return <XCircle className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: EventAttendee['status']) => {
    switch (status) {
      case 'checked_in': return 'Checked In'
      case 'already_checked_in': return 'Already Checked In'
      case 'not_registered': return 'Not Registered'
      case 'invalid_qr': return 'Invalid QR'
      case 'malformed': return 'Malformed'
      default: return 'Unknown'
    }
  }

  const checkedInCount = scannedAttendees.filter(
    attendee => attendee.eventId === selectedEventId && attendee.status === 'checked_in'
  ).length

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Event QR Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Scan participant QR codes to mark event attendance for {activeOrganization?.name}
        </p>
      </div>

      {/* Event Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Event</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event to scan for..." />
            </SelectTrigger>
            <SelectContent>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEvent && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                {selectedEvent.name}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Date:</span>
                  <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Location:</span>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Registered:</span>
                  <p className="font-medium">{selectedEvent.registeredCount} people</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Checked In:</span>
                  <p className="font-medium">{selectedEvent.checkedInCount + checkedInCount} people</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Scanner */}
      {selectedEventId && (
        <QRScanner 
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <Alert>
          <AlertDescription>
            Processing check-in...
          </AlertDescription>
        </Alert>
      )}

      {/* Scan History for Selected Event */}
      {selectedEventId && scannedAttendees.filter(a => a.eventId === selectedEventId).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Today's Check-ins</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scannedAttendees
              .filter(attendee => attendee.eventId === selectedEventId)
              .map((attendee, index) => (
              <div key={`${attendee.id}-${attendee.scannedAt.getTime()}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(attendee.status)}>
                      {getStatusIcon(attendee.status)}
                      <span className="ml-1">{getStatusText(attendee.status)}</span>
                    </Badge>
                    <div>
                      <p className="font-medium">{attendee.userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{attendee.userEmail}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Scanned at {attendee.scannedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {index < scannedAttendees.filter(a => a.eventId === selectedEventId).length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>How to Check In Participants</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Select the event you're checking people in for</li>
            <li>Ask participants to show their event QR code</li>
            <li>Click "Start Scanning" and point the camera at their QR code</li>
            <li>The system will automatically check them in if they're registered</li>
            <li>Monitor the check-in list below to track attendance</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded">
            <p className="text-sm"><strong>Note:</strong> Only registered participants can be checked in. If someone isn't registered, they'll need to register first or check with event organizers.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
