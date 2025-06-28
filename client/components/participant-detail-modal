"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Building,
  Truck,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Copy,
  ExternalLink,
  Shield,
  CheckCircle,
} from "lucide-react"

interface Participant {
  address: string
  role: string
  name: string
  businessName?: string
  registeredAt: string
  email?: string
  phone?: string
  location?: {
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  businessType?: string
  licenseNumber?: string
  description?: string
}

interface ParticipantDetailModalProps {
  participant: Participant | null
  isOpen: boolean
  onClose: () => void
}

export function ParticipantDetailModal({ participant, isOpen, onClose }: ParticipantDetailModalProps) {
  if (!participant) return null

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return <User className="h-6 w-6 text-green-600" />
      case "processor":
        return <Building className="h-6 w-6 text-blue-600" />
      case "retailer":
        return <Truck className="h-6 w-6 text-purple-600" />
      case "consumer":
        return <ShoppingCart className="h-6 w-6 text-orange-600" />
      default:
        return <User className="h-6 w-6 text-gray-600" />
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const getRolePermissions = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return [
          { action: "Harvest Items", allowed: true },
          { action: "Process Items", allowed: true },
          { action: "View Supply Chain", allowed: true },
        ]
      case "processor":
        return [
          { action: "Process Items", allowed: true },
          { action: "Package Items", allowed: true },
          { action: "View Supply Chain", allowed: true },
        ]
      case "retailer":
        return [
          { action: "Sell Items", allowed: true },
          { action: "Manage Inventory", allowed: true },
          { action: "View Supply Chain", allowed: true },
        ]
      case "consumer":
        return [
          { action: "Buy Items", allowed: true },
          { action: "Confirm Delivery", allowed: true },
          { action: "View Product History", allowed: true },
        ]
      default:
        return []
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getRoleIcon(participant.role)}
            {participant.name}
            <Badge className={getRoleColor(participant.role)}>
              <span className="capitalize">{participant.role}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>Detailed information about this supply chain participant</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal/Business Info */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {participant.role === "consumer" ? "Personal Information" : "Business Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className={`${getRoleColor(participant.role)} text-2xl`}>
                      {getRoleIcon(participant.role)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold">{participant.name}</p>
                  </div>

                  {participant.businessName && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {participant.role === "farmer" ? "Farm Name" : "Business Name"}
                      </p>
                      <p className="text-lg font-semibold">{participant.businessName}</p>
                    </div>
                  )}

                  {participant.businessType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Business Type</p>
                      <p className="text-sm text-gray-700 capitalize">{participant.businessType.replace("-", " ")}</p>
                    </div>
                  )}

                  {participant.licenseNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">License Number</p>
                      <p className="text-sm text-gray-700">{participant.licenseNumber}</p>
                    </div>
                  )}

                  {participant.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-sm text-gray-700">{participant.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {participant.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{participant.email}</p>
                    </div>
                  </div>
                )}

                {participant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{participant.phone}</p>
                    </div>
                  </div>
                )}

                {participant.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">
                        {[participant.location.city, participant.location.state, participant.location.country]
                          .filter(Boolean)
                          .join(", ")}
                        {participant.location.zipCode && ` ${participant.location.zipCode}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Registered</p>
                    <p className="text-sm text-gray-600">
                      {new Date(participant.registeredAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Blockchain & Permissions */}
          <div className="space-y-6">
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
                    <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                    <p className="font-mono text-sm break-all">{participant.address}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => copyToClipboard(participant.address)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Address
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Network</p>
                    <Badge variant="outline" className="text-sm">
                      Ganache (Chain ID: 1337)
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registration Status</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Verified</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Role Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRolePermissions(participant.role).map((permission, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{permission.action}</span>
                      <Badge className={permission.allowed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {permission.allowed ? "✓ Allowed" : "✗ Not Allowed"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Role:</strong> {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This participant can perform actions specific to their role in the supply chain.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Items Interacted</span>
                    <span className="text-sm text-gray-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Transactions</span>
                    <span className="text-sm text-gray-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Activity</span>
                    <span className="text-sm text-gray-600">Registration</span>
                  </div>
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
