"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, Truck, ShoppingCart, Plus, Trash2, Upload, Download, CheckCircle } from "lucide-react"

interface BulkRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ParticipantData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  businessName: string
  businessType: string
  licenseNumber: string
  role: string
  location: {
    country: string
    state: string
    city: string
    zipCode: string
  }
  walletAddress: string
}

export function BulkRegistrationModal({ isOpen, onClose, onSuccess }: BulkRegistrationModalProps) {
  const [participants, setParticipants] = useState<ParticipantData[]>([])
  const [loading, setLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState("farmer")

  const roles = [
    { id: "farmer", title: "Farmer", icon: User, color: "text-green-600" },
    { id: "processor", title: "Processor", icon: Building, color: "text-blue-600" },
    { id: "retailer", title: "Retailer", icon: Truck, color: "text-purple-600" },
    { id: "consumer", title: "Consumer", icon: ShoppingCart, color: "text-orange-600" },
  ]

  const generateSampleData = (role: string, count = 5) => {
    const sampleData: ParticipantData[] = []

    for (let i = 1; i <= count; i++) {
      const id = `${role}-${Date.now()}-${i}`
      let participant: ParticipantData

      switch (role) {
        case "farmer":
          participant = {
            id,
            name: `Farmer ${i}`,
            email: `farmer${i}@farm.com`,
            phone: `+1-555-${1000 + i}`,
            address: `${i} Farm Road, Rural Area`,
            businessName: `Green Valley Farm ${i}`,
            businessType: "organic-farm",
            licenseNumber: `FARM-${2024}-${String(i).padStart(3, "0")}`,
            role: "farmer",
            location: {
              country: "Malaysia",
              state: "Selangor",
              city: `Farm City ${i}`,
              zipCode: `4${String(i).padStart(4, "0")}`,
            },
            walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          }
          break

        case "processor":
          participant = {
            id,
            name: `Processor ${i}`,
            email: `processor${i}@processing.com`,
            phone: `+1-555-${2000 + i}`,
            address: `${i} Industrial Street, Processing Zone`,
            businessName: `Food Processing Plant ${i}`,
            businessType: "food-processing",
            licenseNumber: `PROC-${2024}-${String(i).padStart(3, "0")}`,
            role: "processor",
            location: {
              country: "Malaysia",
              state: "Johor",
              city: `Processing City ${i}`,
              zipCode: `8${String(i).padStart(4, "0")}`,
            },
            walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          }
          break

        case "retailer":
          participant = {
            id,
            name: `Retailer ${i}`,
            email: `retailer${i}@retail.com`,
            phone: `+1-555-${3000 + i}`,
            address: `${i} Market Street, Commercial Area`,
            businessName: `Fresh Market ${i}`,
            businessType: "supermarket",
            licenseNumber: `RET-${2024}-${String(i).padStart(3, "0")}`,
            role: "retailer",
            location: {
              country: "Malaysia",
              state: "Kuala Lumpur",
              city: `Retail City ${i}`,
              zipCode: `5${String(i).padStart(4, "0")}`,
            },
            walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          }
          break

        case "consumer":
          participant = {
            id,
            name: `Consumer ${i}`,
            email: `consumer${i}@email.com`,
            phone: `+1-555-${4000 + i}`,
            address: `${i} Residential Street, Suburb`,
            businessName: "",
            businessType: "",
            licenseNumber: "",
            role: "consumer",
            location: {
              country: "Malaysia",
              state: "Penang",
              city: `Consumer City ${i}`,
              zipCode: `1${String(i).padStart(4, "0")}`,
            },
            walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          }
          break

        default:
          continue
      }

      sampleData.push(participant)
    }

    return sampleData
  }

  const addNewParticipant = () => {
    const newParticipant: ParticipantData = {
      id: `${currentRole}-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      address: "",
      businessName: "",
      businessType: "",
      licenseNumber: "",
      role: currentRole,
      location: {
        country: "",
        state: "",
        city: "",
        zipCode: "",
      },
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    }
    setParticipants([...participants, newParticipant])
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const updateParticipant = (id: string, field: string, value: string) => {
    setParticipants(
      participants.map((p) => {
        if (p.id === id) {
          if (field.includes(".")) {
            const [parent, child] = field.split(".")
            return {
              ...p,
              [parent]: {
                ...p[parent as keyof ParticipantData],
                [child]: value,
              },
            }
          }
          return { ...p, [field]: value }
        }
        return p
      }),
    )
  }

  const loadSampleData = () => {
    const farmers = generateSampleData("farmer", 10)
    const processors = generateSampleData("processor", 5)
    const retailers = generateSampleData("retailer", 8)
    const consumers = generateSampleData("consumer", 15)

    setParticipants([...farmers, ...processors, ...retailers, ...consumers])
  }

  const handleSubmit = async () => {
    if (participants.length === 0) {
      alert("Please add at least one participant")
      return
    }

    setLoading(true)

    try {
      // Simulate registration process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get existing registrations
      const existingRegistrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")

      // Add new participants
      const newRegistrations = participants.map((participant) => ({
        walletAddress: participant.walletAddress,
        role: participant.role,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        address: participant.address,
        businessName: participant.businessName,
        businessType: participant.businessType,
        licenseNumber: participant.licenseNumber,
        description: `${participant.role} registered via bulk registration`,
        location: participant.location,
        registeredAt: new Date().toISOString(),
      }))

      // Merge with existing (remove duplicates by wallet address)
      const allRegistrations = [...existingRegistrations]
      newRegistrations.forEach((newReg) => {
        const existingIndex = allRegistrations.findIndex((reg) => reg.walletAddress === newReg.walletAddress)
        if (existingIndex >= 0) {
          allRegistrations[existingIndex] = newReg
        } else {
          allRegistrations.push(newReg)
        }
      })

      localStorage.setItem("supplyChainRegistrations", JSON.stringify(allRegistrations))

      console.log(`Successfully registered ${participants.length} participants`)
      alert(`✅ Successfully registered ${participants.length} participants!`)

      setParticipants([])
      onSuccess() // Call the success callback
      onClose()
    } catch (error) {
      console.error("Bulk registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(participants, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `participants-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const roleParticipants = participants.filter((p) => p.role === currentRole)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Participant Registration</DialogTitle>
          <DialogDescription>Register multiple farmers, processors, retailers, and consumers at once</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={loadSampleData} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Load Sample Data (38 participants)
            </Button>
            <Button onClick={exportData} variant="outline" disabled={participants.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={addNewParticipant} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New {currentRole}
            </Button>
          </div>

          {/* Role Tabs */}
          <div className="flex space-x-2 border-b">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  currentRole === role.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <role.icon className={`h-4 w-4 inline mr-2 ${role.color}`} />
                {role.title}s ({participants.filter((p) => p.role === role.id).length})
              </button>
            ))}
          </div>

          {/* Participants List */}
          <div className="space-y-4">
            {roleParticipants.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No {currentRole}s added yet</p>
                <Button onClick={addNewParticipant} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First {currentRole}
                </Button>
              </div>
            ) : (
              roleParticipants.map((participant, index) => (
                <Card key={participant.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {currentRole} #{index + 1}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => removeParticipant(participant.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={participant.name}
                            onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={participant.email}
                            onChange={(e) => updateParticipant(participant.id, "email", e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={participant.phone}
                            onChange={(e) => updateParticipant(participant.id, "phone", e.target.value)}
                            placeholder="+1-555-0000"
                          />
                        </div>
                      </div>

                      {/* Business Info */}
                      {currentRole !== "consumer" && (
                        <div className="space-y-3">
                          <div>
                            <Label>{currentRole === "farmer" ? "Farm Name" : "Business Name"} *</Label>
                            <Input
                              value={participant.businessName}
                              onChange={(e) => updateParticipant(participant.id, "businessName", e.target.value)}
                              placeholder={currentRole === "farmer" ? "Farm name" : "Business name"}
                            />
                          </div>
                          <div>
                            <Label>Business Type</Label>
                            <Select
                              onValueChange={(value) => updateParticipant(participant.id, "businessType", value)}
                              value={participant.businessType}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {currentRole === "farmer" && (
                                  <>
                                    <SelectItem value="organic-farm">Organic Farm</SelectItem>
                                    <SelectItem value="conventional-farm">Conventional Farm</SelectItem>
                                    <SelectItem value="greenhouse">Greenhouse</SelectItem>
                                    <SelectItem value="livestock">Livestock Farm</SelectItem>
                                    <SelectItem value="dairy">Dairy Farm</SelectItem>
                                  </>
                                )}
                                {currentRole === "processor" && (
                                  <>
                                    <SelectItem value="food-processing">Food Processing Plant</SelectItem>
                                    <SelectItem value="packaging">Packaging Facility</SelectItem>
                                    <SelectItem value="meat-processing">Meat Processing</SelectItem>
                                    <SelectItem value="dairy-processing">Dairy Processing</SelectItem>
                                  </>
                                )}
                                {currentRole === "retailer" && (
                                  <>
                                    <SelectItem value="supermarket">Supermarket</SelectItem>
                                    <SelectItem value="grocery-store">Grocery Store</SelectItem>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                    <SelectItem value="distributor">Food Distributor</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>License Number</Label>
                            <Input
                              value={participant.licenseNumber}
                              onChange={(e) => updateParticipant(participant.id, "licenseNumber", e.target.value)}
                              placeholder="License/registration number"
                            />
                          </div>
                        </div>
                      )}

                      {/* Location Info */}
                      <div className="space-y-3">
                        <div>
                          <Label>Country *</Label>
                          <Input
                            value={participant.location.country}
                            onChange={(e) => updateParticipant(participant.id, "location.country", e.target.value)}
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input
                            value={participant.location.state}
                            onChange={(e) => updateParticipant(participant.id, "location.state", e.target.value)}
                            placeholder="State/Province"
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value={participant.location.city}
                            onChange={(e) => updateParticipant(participant.id, "location.city", e.target.value)}
                            placeholder="City"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium">Wallet Address</Label>
                      <p className="text-sm font-mono text-gray-600 mt-1">{participant.walletAddress}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          {participants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roles.map((role) => {
                    const count = participants.filter((p) => p.role === role.id).length
                    return (
                      <div key={role.id} className="text-center">
                        <role.icon className={`h-8 w-8 ${role.color} mx-auto mb-2`} />
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-sm text-gray-600">{role.title}s</p>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold">Total: {participants.length} participants</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || participants.length === 0}>
            {loading ? "Registering..." : `Register ${participants.length} Participants`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
