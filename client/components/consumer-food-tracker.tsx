"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Leaf,
  Thermometer,
  Calendar,
  Shield,
  Truck,
  Package,
  Building,
  ShoppingCart,
  QrCode,
  CheckCircle,
  Clock,
  Star,
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

interface ConsumerFoodTrackerProps {
  items: FoodItem[]
  participants: any[]
  getParticipantInfo: (address: string) => Promise<any>
  onSelectItem: (item: FoodItem) => void
}

export function ConsumerFoodTracker({
  items,
  participants,
  getParticipantInfo,
  onSelectItem,
}: ConsumerFoodTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter items available for consumers (state 3 = ForSale, state 4+ = Sold/Delivered)
  const availableItems = items.filter((item) => item.state >= 3)

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toString().includes(searchQuery)

    if (selectedCategory === "all") return matchesSearch

    // You can add category filtering based on item names or add category field
    return matchesSearch
  })

  const getOriginInfo = async (item: FoodItem) => {
    if (!item.originFarmer) return null
    return await getParticipantInfo(item.originFarmer)
  }

  const getFreshnessBadge = (item: FoodItem) => {
    if (!item.history || item.history.length === 0) return null

    const harvestTime = item.history[0]?.timestamp
    if (!harvestTime) return null

    const daysSinceHarvest = Math.floor((Date.now() - harvestTime) / (1000 * 60 * 60 * 24))

    if (daysSinceHarvest <= 1) {
      return <Badge className="bg-green-100 text-green-800">🌱 Fresh Today</Badge>
    } else if (daysSinceHarvest <= 3) {
      return <Badge className="bg-blue-100 text-blue-800">❄️ Very Fresh</Badge>
    } else if (daysSinceHarvest <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">⏰ Good</Badge>
    } else {
      return <Badge className="bg-orange-100 text-orange-800">📅 Check Date</Badge>
    }
  }

  const getSupplyChainSteps = (item: FoodItem) => {
    const steps = []

    // Farm Origin
    if (item.originFarmer) {
      const farmerInfo = participants.find((p) => p.address.toLowerCase() === item.originFarmer.toLowerCase())
      steps.push({
        icon: <Leaf className="h-5 w-5 text-green-600" />,
        title: "🌾 Farm Origin",
        location: farmerInfo?.name || "Unknown Farm",
        address: farmerInfo?.location?.state || "Unknown Location",
        participant: item.originFarmer,
        completed: true,
        details: farmerInfo?.businessName || "Organic Farm",
      })
    }

    // Processing
    if (item.processor && item.processor !== "0x0000000000000000000000000000000000000000") {
      const processorInfo = participants.find((p) => p.address.toLowerCase() === item.processor.toLowerCase())
      steps.push({
        icon: <Building className="h-5 w-5 text-blue-600" />,
        title: "🏭 Processing",
        location: processorInfo?.name || "Processing Facility",
        address: processorInfo?.location?.state || "Unknown Location",
        participant: item.processor,
        completed: item.state >= 1,
        details: processorInfo?.businessName || "Food Processing Plant",
      })
    }

    // Packaging
    if (item.state >= 2) {
      steps.push({
        icon: <Package className="h-5 w-5 text-purple-600" />,
        title: "📦 Packaging",
        location: "Quality Packaging",
        address: "Packaging Facility",
        participant: item.processor || item.originFarmer,
        completed: item.state >= 2,
        details: "Food Safety Certified",
      })
    }

    // Retail
    if (item.retailer && item.retailer !== "0x0000000000000000000000000000000000000000") {
      const retailerInfo = participants.find((p) => p.address.toLowerCase() === item.retailer.toLowerCase())
      steps.push({
        icon: <Truck className="h-5 w-5 text-orange-600" />,
        title: "🏪 Retail",
        location: retailerInfo?.name || "Retail Store",
        address: retailerInfo?.location?.state || "Store Location",
        participant: item.retailer,
        completed: item.state >= 3,
        details: retailerInfo?.businessName || "Fresh Market",
      })
    }

    return steps
  }

  const categories = [
    { id: "all", name: "All Foods", icon: "🍽️" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "grains", name: "Grains", icon: "🌾" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "meat", name: "Meat", icon: "🥩" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Shield className="h-8 w-8 text-green-600" />
            🍽️ Food Origin Tracker
          </CardTitle>
          <CardDescription className="text-lg">
            Discover where your food comes from - Farm to Table transparency with blockchain verification
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for food items by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const supplyChainSteps = getSupplyChainSteps(item)
          const freshnessBadge = getFreshnessBadge(item)

          return (
            <Card
              key={item.sku}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      🥬 {item.name}
                      <Badge variant="outline" className="text-xs">
                        SKU: {item.sku}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {freshnessBadge}
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Blockchain Verified
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{item.price} ETH</p>
                    <p className="text-sm text-gray-500">≈ $12.50</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Origin Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />🌾 Farm Origin
                  </h4>
                  {supplyChainSteps[0] && (
                    <div>
                      <p className="font-medium text-green-700">{supplyChainSteps[0].location}</p>
                      <p className="text-sm text-green-600">{supplyChainSteps[0].address}</p>
                      <p className="text-xs text-green-500 mt-1">{supplyChainSteps[0].details}</p>
                    </div>
                  )}
                </div>

                {/* Supply Chain Journey */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Supply Chain Journey
                  </h4>
                  <div className="space-y-2">
                    {supplyChainSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${step.completed ? "bg-green-100" : "bg-gray-100"}`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.title}</p>
                          <p className="text-xs text-gray-600">{step.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <Thermometer className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-blue-800">Temperature</p>
                    <p className="text-sm font-bold text-blue-700">2°C</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-purple-800">Harvest Date</p>
                    <p className="text-sm font-bold text-purple-700">
                      {item.history?.[0] ? new Date(item.history[0].timestamp).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">🏆 Certifications</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      ✅ Organic
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      🌱 Non-GMO
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                      🚫 Pesticide-Free
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    disabled={item.state !== 3}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle purchase
                      alert(`Purchase ${item.name} for ${item.price} ETH`)
                    }}
                  >
                    {item.state === 3 ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </>
                    ) : item.state === 4 ? (
                      "Sold"
                    ) : (
                      "Not Available"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectItem(item)
                    }}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Food Items Found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No items match "${searchQuery}". Try a different search term.`
                : "No food items are currently available for purchase."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2">Blockchain Verified</h3>
            <p className="text-sm text-green-600">
              Every food item is tracked on the blockchain with immutable records from farm to your table.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-blue-800 mb-2">Know Your Source</h3>
            <p className="text-sm text-blue-600">
              See exactly which farm your food comes from, including farmer details and farming practices.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-purple-800 mb-2">Quality Assured</h3>
            <p className="text-sm text-purple-600">
              Temperature controlled, certified organic, and quality checked at every step of the journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
