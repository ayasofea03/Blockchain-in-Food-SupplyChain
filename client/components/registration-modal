"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building, Truck, ShoppingCart, AlertCircle, CheckCircle } from "lucide-react"

// Add onSuccess prop to the interface
interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  account: string | null
  isConnected: boolean
  onSuccess?: () => void
}

// Update the component function signature
export function RegistrationModal({ isOpen, onClose, account, isConnected, onSuccess }: RegistrationModalProps) {
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    businessName: "",
    businessType: "",
    licenseNumber: "",
    description: "",
    location: {
      country: "",
      state: "",
      city: "",
      zipCode: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      icon: User,
      description: "Agricultural producer who harvests food items",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "processor",
      title: "Processor",
      icon: Building,
      description: "Food processing facility that transforms raw materials",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "retailer",
      title: "Retailer",
      icon: Truck,
      description: "Distribution and retail business selling to consumers",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "consumer",
      title: "Consumer",
      icon: ShoppingCart,
      description: "End consumer purchasing food products",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  // Update the handleSubmit function to call onSuccess
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !account) {
      alert("Please connect your wallet first")
      return
    }

    if (!selectedRole) {
      alert("Please select a role")
      return
    }

    setLoading(true)

    try {
      // Simulate registration process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would:
      // 1. Store registration data in database
      // 2. Possibly register on blockchain if needed
      // 3. Send verification email
      // 4. Create user profile

      const registrationData = {
        walletAddress: account,
        role: selectedRole,
        ...formData,
        registeredAt: new Date().toISOString(),
      }

      // Store in localStorage for demo purposes
      const existingRegistrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const updatedRegistrations = existingRegistrations.filter((reg: any) => reg.walletAddress !== account)
      updatedRegistrations.push(registrationData)
      localStorage.setItem("supplyChainRegistrations", JSON.stringify(updatedRegistrations))

      console.log("Registration successful:", registrationData)
      setRegistered(true)

      // Call onSuccess callback to refresh data
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedRole("")
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      businessName: "",
      businessType: "",
      licenseNumber: "",
      description: "",
      location: {
        country: "",
        state: "",
        city: "",
        zipCode: "",
      },
    })
    setRegistered(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (registered) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Registration Successful!
            </DialogTitle>
            <DialogDescription>You have been successfully registered in the supply chain network.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-800 mb-2">Welcome to the Network!</h3>
              <p className="text-sm text-green-600">
                Your registration as a <strong>{selectedRole}</strong> has been completed.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your wallet address has been registered</li>
                <li>• You can now participate in the supply chain</li>
                <li>• Start by {selectedRole === "farmer" ? "harvesting items" : "managing your role"}</li>
                <li>• Check your profile in the dashboard</li>
              </ul>
            </div>

            <Button onClick={handleClose} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for Supply Chain Network</DialogTitle>
          <DialogDescription>Join the blockchain food supply chain network as a verified participant</DialogDescription>
        </DialogHeader>

        {!isConnected && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">Please connect your wallet to register</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <Label className="text-base font-semibold">Select Your Role</Label>
            <p className="text-sm text-gray-600 mb-4">Choose your role in the food supply chain</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.id
                      ? `${role.borderColor} ${role.bgColor} border-2`
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <role.icon className={`h-6 w-6 ${role.color} mt-1`} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{role.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        {selectedRole === role.id && (
                          <Badge className="mt-2 bg-green-100 text-green-800">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedRole && (
            <>
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Physical Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              {selectedRole !== "consumer" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">
                        {selectedRole === "farmer" ? "Farm Name" : "Business Name"} *
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRole === "farmer" && (
                            <>
                              <SelectItem value="organic-farm">Organic Farm</SelectItem>
                              <SelectItem value="conventional-farm">Conventional Farm</SelectItem>
                              <SelectItem value="greenhouse">Greenhouse</SelectItem>
                              <SelectItem value="livestock">Livestock Farm</SelectItem>
                              <SelectItem value="dairy">Dairy Farm</SelectItem>
                            </>
                          )}
                          {selectedRole === "processor" && (
                            <>
                              <SelectItem value="food-processing">Food Processing Plant</SelectItem>
                              <SelectItem value="packaging">Packaging Facility</SelectItem>
                              <SelectItem value="meat-processing">Meat Processing</SelectItem>
                              <SelectItem value="dairy-processing">Dairy Processing</SelectItem>
                              <SelectItem value="beverage">Beverage Manufacturing</SelectItem>
                            </>
                          )}
                          {selectedRole === "retailer" && (
                            <>
                              <SelectItem value="supermarket">Supermarket</SelectItem>
                              <SelectItem value="grocery-store">Grocery Store</SelectItem>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="distributor">Food Distributor</SelectItem>
                              <SelectItem value="online-retailer">Online Retailer</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">License/Registration Number</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                        placeholder="Business license or registration number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.location.country}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, country: e.target.value },
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.location.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, state: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.location.zipCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, zipCode: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  {selectedRole === "farmer" ? "Farm Description" : "Business Description"}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder={`Tell us about your ${selectedRole === "farmer" ? "farm" : "business"}...`}
                />
              </div>

              {/* Wallet Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Wallet Information</h4>
                <p className="text-sm text-gray-600 mb-2">Your wallet address will be registered for this role:</p>
                <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
                  {account || "Not connected"}
                </code>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isConnected || !selectedRole}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
