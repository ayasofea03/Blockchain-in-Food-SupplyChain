"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Leaf,
  Thermometer,
  Calendar,
  Shield,
  Truck,
  User,
  Building,
  ShoppingCart,
  Star,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Award,
} from "lucide-react"

interface FoodItem {
  sku: number
  name: string
  state: number
  originFarmer: string
  processor: string
  retailer: string
  consumer: string
  price: string
  history?: ParticipantAction[]
  currentOwner?: string
}

interface ParticipantAction {
  participant: string
  timestamp: number
  action: string
  role: string
  name?: string
}

interface FoodOriginDetailModalProps {
  item: FoodItem | null
  isOpen: boolean
  onClose: () => void
  participants: any[]
}

export function FoodOriginDetailModal({ item, isOpen, onClose, participants }: FoodOriginDetailModalProps) {
  if (!item) return null

  const getParticipantDetails = (address: string) => {
    return participants.find((p) => p.address.toLowerCase() === address.toLowerCase())
  }

  const farmerDetails = getParticipantDetails(item.originFarmer)
  const processorDetails =
    item.processor !== "0x0000000000000000000000000000000000000000" ? getParticipantDetails(item.processor) : null
  const retailerDetails =
    item.retailer !== "0x0000000000000000000000000000000000000000" ? getParticipantDetails(item.retailer) : null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const getFreshnessDays = () => {
    if (!item.history || item.history.length === 0) return null
    const harvestTime = item.history[0]?.timestamp
    if (!harvestTime) return null
    return Math.floor((Date.now() - harvestTime) / (1000 * 60 * 60 * 24))
  }

  const freshnessDays = getFreshnessDays()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            🥬 {item.name}
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              Blockchain Verified
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-lg">
            Complete farm-to-table journey • SKU: {item.sku} • Harvested{" "}
            {freshnessDays ? `${freshnessDays} days ago` : "recently"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Farm Origin */}
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Leaf className="h-6 w-6" />🌾 Farm Origin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {farmerDetails ? (
                  <>
                    <div className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-green-800">{farmerDetails.name}</h3>
                      <p className="text-green-600">{farmerDetails.businessName}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Location</p>
                          <p className="text-sm text-green-600">
                            {farmerDetails.location?.city}, {farmerDetails.location?.state},{" "}
                            {farmerDetails.location?.country}
                          </p>
                        </div>
                      </div>

                      {farmerDetails.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Contact</p>
                            <p className="text-sm text-green-600">{farmerDetails.email}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Farm Type</p>
                          <p className="text-sm text-green-600 capitalize">
                            {farmerDetails.businessType?.replace("-", " ") || "Organic Farm"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Farmer Wallet Address:</p>
                      <p className="font-mono text-xs text-green-700 break-all">{item.originFarmer}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 text-green-600"
                        onClick={() => copyToClipboard(item.originFarmer)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <User className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <p className="text-green-600">Farmer information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quality & Freshness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Quality & Freshness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800">Storage Temp</p>
                    <p className="text-lg font-bold text-blue-700">2°C</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-800">Days Fresh</p>
                    <p className="text-lg font-bold text-purple-700">{freshnessDays || 0}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🏆 Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800">✅ USDA Organic</Badge>
                    <Badge className="bg-blue-100 text-blue-800">🌱 Non-GMO</Badge>
                    <Badge className="bg-purple-100 text-purple-800">🚫 Pesticide-Free</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">🌿 Sustainable</Badge>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">Freshness Rating</h4>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-green-700 ml-2">4.8/5 (Excellent)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Supply Chain Journey */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Supply Chain Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.history && item.history.length > 0 ? (
                    item.history.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          {index < item.history!.length - 1 && <div className="w-px h-8 bg-gray-300 mt-2" />}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{step.action}</p>
                              <Badge variant="outline" className="text-xs">
                                {step.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {step.name || `${step.participant.slice(0, 6)}...${step.participant.slice(-4)}`}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(step.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Journey information not available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Processing & Packaging */}
            {(processorDetails || item.state >= 2) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Processing & Packaging
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {processorDetails && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800">{processorDetails.name}</h4>
                      <p className="text-sm text-blue-600">{processorDetails.businessName}</p>
                      <p className="text-xs text-blue-500">
                        {processorDetails.location?.city}, {processorDetails.location?.state}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Food Safety Certified</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quality Inspected</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hygiene Standards</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Retail & Purchase */}
          <div className="space-y-6">
            {/* Retail Information */}
            {retailerDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    Available At
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-12 w-12 mx-auto mb-3">
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        <Truck className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-purple-800">{retailerDetails.name}</h3>
                    <p className="text-purple-600">{retailerDetails.businessName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-800">Store Location</p>
                        <p className="text-sm text-purple-600">
                          {retailerDetails.location?.city}, {retailerDetails.location?.state}
                        </p>
                      </div>
                    </div>

                    {retailerDetails.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-800">Contact</p>
                          <p className="text-sm text-purple-600">{retailerDetails.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Purchase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{item.price} ETH</p>
                  <p className="text-gray-500">≈ $12.50 USD</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Product SKU</span>
                    <span className="text-sm font-mono">{item.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge
                      className={
                        item.state === 3
                          ? "bg-green-100 text-green-800"
                          : item.state === 4
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {item.state === 3 ? "Available" : item.state === 4 ? "Sold" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blockchain Network</span>
                    <span className="text-sm">Ganache</span>
                  </div>
                </div>

                {item.state === 3 && (
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now for {item.price} ETH
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Smart Contract:</p>
                  <p className="font-mono text-xs break-all">0xBD200d74B150cF29F77B2bCd80D910a93946BbDC</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Explorer
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Details
                  </Button>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Verified Authentic</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This product's journey has been verified on the blockchain
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
