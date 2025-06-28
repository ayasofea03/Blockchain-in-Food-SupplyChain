"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Building, Truck, ShoppingCart, Edit, MapPin, Phone, Mail, Calendar } from "lucide-react"

interface UserProfileProps {
  account: string | null
  isConnected: boolean
  onEditProfile: () => void
}

export function UserProfile({ account, isConnected, onEditProfile }: UserProfileProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (account && isConnected) {
      loadUserProfile()
    } else {
      setUserProfile(null)
      setLoading(false)
    }
  }, [account, isConnected])

  const loadUserProfile = () => {
    try {
      const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const profile = registrations.find((reg: any) => reg.walletAddress === account)
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "farmer":
        return <User className="h-5 w-5 text-green-600" />
      case "processor":
        return <Building className="h-5 w-5 text-blue-600" />
      case "retailer":
        return <Truck className="h-5 w-5 text-purple-600" />
      case "consumer":
        return <ShoppingCart className="h-5 w-5 text-orange-600" />
      default:
        return <User className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
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

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to view profile</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Profile Found</h3>
          <p className="text-gray-600 mb-4">You haven't registered in the supply chain network yet.</p>
          <Button onClick={onEditProfile}>Register Now</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {getRoleIcon(userProfile.role)}
              </div>
              <div>
                <CardTitle className="text-xl">{userProfile.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge className={getRoleColor(userProfile.role)}>
                    {getRoleIcon(userProfile.role)}
                    <span className="ml-1 capitalize">{userProfile.role}</span>
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={onEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
              </div>
            </div>
            {userProfile.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{userProfile.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">
                  {[userProfile.location.city, userProfile.location.state, userProfile.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
            {userProfile.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-gray-600">{userProfile.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        {userProfile.role !== "consumer" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {userProfile.role === "farmer" ? "Farm Information" : "Business Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">{userProfile.role === "farmer" ? "Farm Name" : "Business Name"}</p>
                <p className="text-sm text-gray-600">{userProfile.businessName}</p>
              </div>
              {userProfile.businessType && (
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-gray-600 capitalize">{userProfile.businessType.replace("-", " ")}</p>
                </div>
              )}
              {userProfile.licenseNumber && (
                <div>
                  <p className="text-sm font-medium">License Number</p>
                  <p className="text-sm text-gray-600">{userProfile.licenseNumber}</p>
                </div>
              )}
              {userProfile.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-gray-600">{userProfile.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Blockchain Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blockchain Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-sm text-gray-600 font-mono break-all">{userProfile.walletAddress}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Registered</p>
                <p className="text-sm text-gray-600">{new Date(userProfile.registeredAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userProfile.role === "farmer" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Harvest Items</span>
                    <Badge className="bg-green-100 text-green-800">✓ Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Process Items</span>
                    <Badge className="bg-green-100 text-green-800">✓ Allowed</Badge>
                  </div>
                </>
              )}
              {userProfile.role === "processor" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Process Items</span>
                    <Badge className="bg-blue-100 text-blue-800">✓ Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Package Items</span>
                    <Badge className="bg-blue-100 text-blue-800">✓ Allowed</Badge>
                  </div>
                </>
              )}
              {userProfile.role === "retailer" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sell Items</span>
                    <Badge className="bg-purple-100 text-purple-800">✓ Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manage Inventory</span>
                    <Badge className="bg-purple-100 text-purple-800">✓ Allowed</Badge>
                  </div>
                </>
              )}
              {userProfile.role === "consumer" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buy Items</span>
                    <Badge className="bg-orange-100 text-orange-800">✓ Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirm Delivery</span>
                    <Badge className="bg-orange-100 text-orange-800">✓ Allowed</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
