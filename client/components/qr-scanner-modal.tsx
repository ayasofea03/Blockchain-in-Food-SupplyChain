"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Search, Camera, Smartphone, AlertCircle } from "lucide-react"

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanResult: (sku: string) => void
}

export function QRScannerModal({ isOpen, onClose, onScanResult }: QRScannerModalProps) {
  const [manualSku, setManualSku] = useState("")
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual")

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualSku.trim()) {
      onScanResult(manualSku.trim())
      setManualSku("")
      onClose()
    }
  }

  const simulateQRScan = () => {
    // Simulate scanning a QR code - in real app, this would use camera
    const sampleSkus = ["1", "2", "3", "4", "5"]
    const randomSku = sampleSkus[Math.floor(Math.random() * sampleSkus.length)]
    onScanResult(randomSku)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan Food QR Code
          </DialogTitle>
          <DialogDescription>
            Scan the QR code on your food package to see its complete journey from farm to table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === "camera" ? "default" : "outline"}
              onClick={() => setScanMode("camera")}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera Scan
            </Button>
            <Button
              variant={scanMode === "manual" ? "default" : "outline"}
              onClick={() => setScanMode("manual")}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </div>

          {scanMode === "camera" ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Camera scanner would appear here</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Smartphone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Position QR code within frame</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">Demo Mode: Camera not available</p>
                  </div>
                </div>

                <Button onClick={simulateQRScan} className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Simulate QR Scan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sku">Enter Product SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="e.g., 1, 2, 3..."
                  value={manualSku}
                  onChange={(e) => setManualSku(e.target.value)}
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-1">Find the SKU number on your food package or receipt</p>
              </div>

              <Button type="submit" className="w-full" disabled={!manualSku.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Track Food Origin
              </Button>
            </form>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Scan QR code on food packaging</li>
                <li>• Or enter the SKU number manually</li>
                <li>• View complete farm-to-table journey</li>
                <li>• Verify authenticity on blockchain</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
