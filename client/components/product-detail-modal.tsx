"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Thermometer, Shield, Download, QrCode, Leaf, AlertTriangle, CheckCircle } from "lucide-react"

interface ProductDetailModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {product.name}
            {product.verified ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Product ID: {product.id} | Batch: {product.batchNumber} | Network: {product.blockchainNetwork}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Origin Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                Origin Details
              </h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p>
                  <span className="font-medium">Farm:</span> {product.origin.farm}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {product.origin.location}
                </p>
                <p>
                  <span className="font-medium">Farmer:</span> {product.origin.farmer}
                </p>
                <p>
                  <span className="font-medium">Coordinates:</span> {product.origin.coordinates}
                </p>
              </div>
            </div>

            {/* Current Conditions */}
            <div>
              <h3 className="font-semibold mb-3">Current Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-lg font-bold text-blue-700">{product.temperature}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-cyan-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-lg font-bold text-cyan-700">{product.humidity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold mb-3">Certifications & Standards</h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div>
              <h3 className="font-semibold mb-3">Environmental Impact</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Carbon Footprint</span>
                  <span className="text-sm font-bold text-green-700">{product.carbonFootprint}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium">Expiry Date</span>
                  <span className="text-sm font-bold">{product.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Supply Chain Journey */}
            <div>
              <h3 className="font-semibold mb-3">Blockchain Supply Chain Journey</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {product.journey.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          index === product.journey.length - 1 ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></div>
                      {index < product.journey.length - 1 && <div className="w-px h-8 bg-gray-300 mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="bg-white border rounded-lg p-3">
                        <p className="font-medium text-sm">{step.stage}</p>
                        <p className="text-sm text-gray-600">{step.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.timestamp}</p>
                        <p className="text-xs font-mono text-gray-400 mt-2">Block: {step.blockHash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Information */}
            <div>
              <h3 className="font-semibold mb-3">Blockchain Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Smart Contract Address:</p>
                  <p className="font-mono text-sm break-all">{product.smartContract}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Blockchain Network:</p>
                  <Badge variant="outline" className="text-sm">
                    {product.blockchainNetwork}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify on Chain
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Certificate
                  </Button>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div>
              <h3 className="font-semibold mb-3">Consumer Verification</h3>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">QR Code for consumer verification</p>
                <Button variant="outline" size="sm">
                  Generate QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
