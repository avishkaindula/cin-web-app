"use client";

import { useState } from "react";
import {
  Scanner,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  Settings,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess?: (result: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [tracker, setTracker] = useState<string>("centerText");
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanResult, setLastScanResult] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const getTracker = () => {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  };

  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
      const scannedText = detectedCodes[0].rawValue;
      setLastScanResult(scannedText);
      setScanStatus("success");
      setError("");

      // Pause scanning temporarily
      setIsScanning(false);

      toast({
        title: "QR Code Scanned Successfully",
        description: `Scanned: ${scannedText.substring(0, 50)}${
          scannedText.length > 50 ? "..." : ""
        }`,
      });

      try {
        // Call the parent's onScanSuccess callback
        onScanSuccess?.(scannedText);

        // Keep scanning paused - user can manually resume or reset
      } catch (err: any) {
        console.error("Error processing scan result:", err);
        setError("Failed to process scan result");
        setScanStatus("error");
        onScanError?.(err.message || "Failed to process scan result");

        // Keep scanning paused - user can manually resume or reset
      }
    }
  };

  const handleError = (error: any) => {
    // Handle different types of errors more gracefully
    let errorMessage = "Scanner error occurred";
    let toastTitle = "Scanner Error";
    let toastDescription = "An error occurred while scanning";

    if (error?.message) {
      const message = error.message.toLowerCase();

      if (
        message.includes("permission") ||
        message.includes("denied") ||
        message.includes("dismissed")
      ) {
        errorMessage = "Camera permission is required to use the scanner";
        toastTitle = "Camera Permission Required";
        toastDescription =
          "Please allow camera access to scan QR codes. You can enable this in your browser settings.";
      } else if (
        message.includes("not found") ||
        message.includes("no camera")
      ) {
        errorMessage = "No camera found on this device";
        toastTitle = "Camera Not Available";
        toastDescription =
          "No camera was detected. Please ensure your device has a camera and try again.";
      } else if (message.includes("not supported")) {
        errorMessage = "Camera access is not supported in this browser";
        toastTitle = "Browser Not Supported";
        toastDescription =
          "Please try using a modern browser like Chrome, Firefox, or Safari.";
      } else {
        errorMessage = error.message;
        toastDescription = error.message;
      }
    }

    setError(errorMessage);
    setScanStatus("error");
    onScanError?.(errorMessage);

    toast({
      variant: "destructive",
      title: toastTitle,
      description: toastDescription,
    });
  };

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    setScanStatus(isScanning ? "idle" : "scanning");
    setError("");
  };

  const resetScanner = () => {
    setLastScanResult("");
    setError("");
    setScanStatus("scanning");
    setIsScanning(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
          <Camera className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
        <CardDescription className="text-sm lg:text-base">
          Scan voucher QR codes to verify and manage vouchers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Controls */}
        <div className="flex justify-center">
          {/* Tracker Selection */}
          <div className="space-y-2 w-full max-w-xs">
            <label className="text-sm font-medium flex items-center gap-2 justify-center">
              <Settings className="h-4 w-4" />
              Scanner Style:
            </label>
            <select
              value={tracker}
              onChange={(e) => setTracker(e.target.value)}
              className="w-full p-2 border rounded-md text-sm lg:text-base"
            >
              <option value="centerText">Center Text</option>
              <option value="outline">Outline</option>
              <option value="boundingBox">Bounding Box</option>
              <option value="">No Tracker</option>
            </select>
          </div>
        </div>

        {/* Scanner Status */}
        {isScanning && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Scanner is active. Point your camera at a QR code to scan.
            </AlertDescription>
          </Alert>
        )}

        {/* Video Feed */}
        <div className="relative rounded-lg overflow-hidden border">
          {error?.toLowerCase().includes("permission") ? (
            <div className="h-96 flex items-center justify-center bg-gray-100 text-gray-500">
              <div className="text-center space-y-2">
                <Camera className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">Camera permission required</p>
                <p className="text-xs">
                  Please allow camera access to continue
                </p>
              </div>
            </div>
          ) : (
            <Scanner
              formats={[
                "qr_code",
                "micro_qr_code",
                "rm_qr_code",
                "maxi_code",
                "pdf417",
                "aztec",
                "data_matrix",
                "matrix_codes",
                "dx_film_edge",
                "databar",
                "databar_expanded",
                "codabar",
                "code_39",
                "code_93",
                "code_128",
                "ean_8",
                "ean_13",
                "itf",
                "linear_codes",
                "upc_a",
                "upc_e",
              ]}
              constraints={{
                facingMode: { ideal: "environment" }, // Prefer back camera
              }}
              onScan={handleScan}
              onError={handleError}
              styles={{
                container: {
                  height: "400px",
                  width: "100%",
                  borderRadius: "0.5rem",
                },
              }}
              components={{
                onOff: true,
                torch: true,
                zoom: true,
                finder: true,
                tracker: getTracker(),
              }}
              allowMultiple={false}
              scanDelay={1000}
              paused={!isScanning}
            />
          )}

          {/* Status Overlay */}
          {scanStatus !== "idle" && (
            <div className="absolute top-2 left-2 right-2 lg:top-4 lg:left-4 lg:right-4">
              <Badge
                variant={
                  scanStatus === "success"
                    ? "default"
                    : scanStatus === "error"
                    ? "destructive"
                    : "secondary"
                }
                className="flex items-center gap-2 justify-center py-2"
              >
                {scanStatus === "scanning" && <Camera className="h-4 w-4" />}
                {scanStatus === "success" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {scanStatus === "error" && <XCircle className="h-4 w-4" />}
                {scanStatus === "scanning" && "Ready to scan..."}
                {scanStatus === "success" && "QR Code detected!"}
                {scanStatus === "error" && "Scanner error"}
              </Badge>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{error}</p>
                {error.toLowerCase().includes("permission") && (
                  <div className="text-sm">
                    <p>
                      <strong>To fix this:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        Refresh this page and click "Allow" when prompted for
                        camera access
                      </li>
                      <li>
                        Or check your browser's address bar for a camera icon
                        and enable permissions
                      </li>
                      <li>
                        In Chrome: Click the camera icon in the address bar and
                        select "Allow"
                      </li>
                      <li>
                        In Safari: Go to Safari → Settings → Websites → Camera
                        and allow access
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Last Scan Result */}
        {lastScanResult && (
          <Alert>
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="break-words overflow-wrap-anywhere">
              <strong>Last scanned:</strong>
              <div className="mt-1 font-mono text-xs bg-muted p-2 rounded border max-h-20 overflow-y-auto">
                {lastScanResult}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={toggleScanning}
            variant={isScanning ? "destructive" : "default"}
            className="w-full sm:w-auto"
            disabled={error?.toLowerCase().includes("permission")}
          >
            {isScanning ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Pause Scanning
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </>
            )}
          </Button>

          <Button
            onClick={resetScanner}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            {error?.toLowerCase().includes("permission")
              ? "Try Again"
              : "Reset"}
          </Button>

          {error?.toLowerCase().includes("permission") && (
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Allow camera permission when prompted for the scanner to work
            </li>
            <li>Point the camera at a QR code within the scanning area</li>
            <li>The scanner will automatically detect and process QR codes</li>
            <li>Use the scanner style dropdown to change the visual overlay</li>
            <li>
              On mobile devices, the back camera will be used automatically
            </li>
            <li>
              If permission is denied, refresh the page and allow camera access
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
