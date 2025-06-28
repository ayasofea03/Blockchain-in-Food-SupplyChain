"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Package,
  User,
  MapPin,
  DollarSign,
  Shield,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  Building,
  Truck,
  ShoppingCart,
} from "lucide-react"

interface ParticipantAction {
  participant: string
  timestamp: number
  action: string
  role: string
  name?: string
}

interface Item {
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

interface ItemDetailModalProps {
  item: Item | null
  isOpen: boolean
  onClose: () => void
  getStateColor: (state: number) => string
  getStateName: (state: number) => string
}

export function ItemDetailModal({ item, isOpen, onClose, getStateColor, getStateName }: ItemDetailModalProps) {
  if (!item) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const getStateIcon = (state: number) => {
    switch (state) {
      case 0:
        return <Package className="h-4 w-4" />
      case 1:
        return <CheckCircle className="h-4 w-4" />
      case 2:
        return <Shield className="h-4 w-4" />
      case 3:
        return <DollarSign className="h-4 w-4" />
      case 4:
        return <User className="h-4 w-4" />
      case 5:
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return <User className="h-4 w-4 text-green-600" />
      case "processor":
        return <Building className="h-4 w-4 text-blue-600" />
      case "retailer":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "consumer":
        return <ShoppingCart className="h-4 w-4 text-orange-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return "bg-green-100 text-green-800"
      case "processor":
        return "bg-blue-100 text-blue-800"
      case "retailer":
        return "bg-purple-100 text-purple-800"
      case "consumer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStateDescription = (state: number) => {
    switch (state) {
      case 0:
        return "Item has been harvested from the farm"
      case 1:
        return "Item has been processed and prepared"
      case 2:
        return "Item has been packaged and ready for sale"
      case 3:
        return "Item is listed for sale in the marketplace"
      case 4:
        return "Item has been sold to a consumer"
      case 5:
        return "Item has been delivered to the consumer"
      default:
        return "Unknown state"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-6 w-6 text-green-600" />
            {item.name}
            <Badge className={getStateColor(item.state)}>
              {getStateIcon(item.state)}
              <span className="ml-1">{getStateName(item.state)}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>SKU: {item.sku} | Complete Supply Chain Tracking & Participant Details</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Item Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Item Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">SKU</p>
                    <p className="text-lg font-semibold">{item.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="text-lg font-semibold text-green-600">{item.price} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Owner</p>
                    <p className="text-sm font-mono text-gray-700">
                      {item.currentOwner ? `${item.currentOwner.slice(0, 8)}...${item.currentOwner.slice(-6)}` : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStateColor(item.state)}>
                      {getStateIcon(item.state)}
                      <span className="ml-1">{getStateName(item.state)}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{getStateDescription(item.state)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Blockchain Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Smart Contract</p>
                    <p className="font-mono text-sm break-all">0xBD200d74B150cF29F77B2bCd80D910a93946BbDC</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Network</p>
                    <Badge variant="outline" className="text-sm">
                      Ganache (Chain ID: 1337)
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => copyToClipboard("0xBD200d74B150cF29F77B2bCd80D910a93946BbDC")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Contract
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Supply Chain Participants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Supply Chain Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Origin Farmer */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-green-800">Origin Farmer</p>
                        <p className="text-sm text-green-600 font-mono">
                          {item.originFarmer
                            ? `${item.originFarmer.slice(0, 8)}...${item.originFarmer.slice(-6)}`
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                    {item.originFarmer && (
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.originFarmer)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Processor */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          <Building className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-blue-800">Processor</p>
                        <p className="text-sm text-blue-600 font-mono">
                          {item.processor && item.processor !== "0x0000000000000000000000000000000000000000"
                            ? `${item.processor.slice(0, 8)}...${item.processor.slice(-6)}`
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                    {item.processor && item.processor !== "0x0000000000000000000000000000000000000000" && (
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.processor)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Retailer */}
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          <Truck className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-purple-800">Retailer</p>
                        <p className="text-sm text-purple-600 font-mono">
                          {item.retailer && item.retailer !== "0x0000000000000000000000000000000000000000"
                            ? `${item.retailer.slice(0, 8)}...${item.retailer.slice(-6)}`
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                    {item.retailer && item.retailer !== "0x0000000000000000000000000000000000000000" && (
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.retailer)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Consumer */}
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-orange-100 text-orange-800">
                          <ShoppingCart className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-orange-800">Consumer</p>
                        <p className="text-sm text-orange-600 font-mono">
                          {item.consumer && item.consumer !== "0x0000000000000000000000000000000000000000"
                            ? `${item.consumer.slice(0, 8)}...${item.consumer.slice(-6)}`
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                    {item.consumer && item.consumer !== "0x0000000000000000000000000000000000000000" && (
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.consumer)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Journey & History */}
          <div className="space-y-6">
            {/* Supply Chain Journey */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Supply Chain Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.history && item.history.length > 0 ? (
                    <div className="space-y-3">
                      {item.history.map((action, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={getRoleColor(action.role)}>
                                {getRoleIcon(action.role)}
                              </AvatarFallback>
                            </Avatar>
                            {index < item.history!.length - 1 && <div className="w-px h-8 bg-gray-300 mt-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="bg-white border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm">{action.action}</p>
                                <Badge className={getRoleColor(action.role)} variant="outline">
                                  {action.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {action.name || `${action.participant.slice(0, 6)}...${action.participant.slice(-4)}`}
                              </p>
                              <p className="text-xs text-gray-500">{new Date(action.timestamp).toLocaleString()}</p>
                              <p className="text-xs font-mono text-gray-400 mt-1">
                                {action.participant.slice(0, 8)}...{action.participant.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No history available</p>
                    </div>
                  )}
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
