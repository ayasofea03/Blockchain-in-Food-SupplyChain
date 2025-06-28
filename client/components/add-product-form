"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf } from "lucide-react"

interface AddProductFormProps {
  isOpen: boolean
  onClose: () => void
}

export function AddProductForm({ isOpen, onClose }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    origin: {
      farm: "",
      location: "",
      farmer: "",
      coordinates: "",
    },
    destination: "",
    description: "",
    certifications: [] as string[],
    blockchainNetwork: "",
    temperature: "",
    humidity: "",
    expiryDate: "",
    batchNumber: "",
  })

  const certificationOptions = [
    "USDA Organic",
    "Fair Trade",
    "Non-GMO",
    "Grass-Fed",
    "Hormone-Free",
    "Wild Caught",
    "MSC Certified",
    "Sustainable",
    "Kosher",
    "Halal",
    "USDA Prime",
    "Free Range",
    "Cage Free",
  ]

  const blockchainNetworks = ["Ethereum", "Polygon", "Binance Smart Chain", "Hyperledger Fabric"]

  const foodCategories = ["Produce", "Meat", "Seafood", "Dairy", "Grains", "Beverages", "Processed Foods"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would call your blockchain backend API
    console.log("Adding product to blockchain:", formData)
    onClose()
  }

  const handleCertificationChange = (certification: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certification],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c !== certification),
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <Leaf className="h-5 w-5 text-green-500" />
            Add Product to Blockchain
          </DialogTitle>
          <DialogDescription>
            Register a new food product on the blockchain for complete supply chain tracking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
                placeholder="e.g., PROD-2024-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Origin Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Origin Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farm">Farm/Producer Name *</Label>
                <Input
                  id="farm"
                  value={formData.origin.farm}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      origin: { ...prev.origin, farm: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="farmer">Farmer/Producer *</Label>
                <Input
                  id="farmer"
                  value={formData.origin.farmer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      origin: { ...prev.origin, farmer: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.origin.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      origin: { ...prev.origin, location: e.target.value },
                    }))
                  }
                  placeholder="City, State/Country"
                  required
                />
              </div>
              <div>
                <Label htmlFor="coordinates">GPS Coordinates</Label>
                <Input
                  id="coordinates"
                  value={formData.origin.coordinates}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      origin: { ...prev.origin, coordinates: e.target.value },
                    }))
                  }
                  placeholder="lat, lng"
                />
              </div>
            </div>
          </div>

          {/* Blockchain Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Blockchain Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="network">Blockchain Network *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, blockchainNetwork: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blockchain network" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockchainNetworks.map((network) => (
                      <SelectItem key={network} value={network.toLowerCase().replace(/\s+/g, "-")}>
                        {network}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="Final destination"
                />
              </div>
            </div>
          </div>

          {/* Storage Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Storage Temperature</Label>
              <Input
                id="temperature"
                value={formData.temperature}
                onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value }))}
                placeholder="e.g., 2°C"
              />
            </div>
            <div>
              <Label htmlFor="humidity">Storage Humidity</Label>
              <Input
                id="humidity"
                value={formData.humidity}
                onChange={(e) => setFormData((prev) => ({ ...prev, humidity: e.target.value }))}
                placeholder="e.g., 85%"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Detailed product description..."
            />
          </div>

          {/* Certifications */}
          <div>
            <Label>Certifications & Standards</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-32 overflow-y-auto">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formData.certifications.includes(cert)}
                    onCheckedChange={(checked) => handleCertificationChange(cert, checked as boolean)}
                  />
                  <Label htmlFor={cert} className="text-sm">
                    {cert}
                  </Label>
                </div>
              ))}
            </div>
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Add to Blockchain
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
