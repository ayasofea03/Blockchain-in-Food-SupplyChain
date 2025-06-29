"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Building,
  Truck,
  ShoppingCart,
  Leaf,
  Package,
  Users,
  BarChart3,
  LogOut,
  MapPin,
  Mail,
  Phone,
  Calendar,
  QrCode,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/lib/use-auth"
import { ItemsList } from "@/components/items-list"
import { HarvestForm } from "@/components/harvest-form"
import { ItemActions } from "@/components/item-actions"
import { ParticipantsTracker } from "@/components/participants-tracker"
import { UserProfile } from "@/components/user-profile"
import { ConsumerFoodTracker } from "@/components/consumer-food-tracker"

interface RoleBasedDashboardProps {
  items: any[]
  participants: any[]
  contract: any
  account: string | null
  isConnected: boolean
  loading: boolean
  refreshItems: () => void
  onItemSelect: (item: any) => void
  onParticipantSelect: (participant: any) => void
  onShowRegistration: () => void
  onShowQRScanner: () => void
  onSelectFoodItem: (item: any) => void
  getStateColor: (state: number) => string
  getStateName: (state: number) => string
}

export function RoleBasedDashboard({
  items,
  participants,
  contract,
  account,
  isConnected,
  loading,
  refreshItems,
  onItemSelect,
  onParticipantSelect,
  onShowRegistration,
  onShowQRScanner,
  onSelectFoodItem,
  getStateColor,
  getStateName,
}: RoleBasedDashboardProps) {
  const { user, logout, canAccess } = useAuth()

  if (!user) return null

  const roleIcons = {
    farmer: <User className="h-5 w-5" />,
    processor: <Building className="h-5 w-5" />,
    retailer: <Truck className="h-5 w-5" />,
    consumer: <ShoppingCart className="h-5 w-5" />,
  }

  const roleColors = {
    farmer: "bg-green-100 text-green-800",
    processor: "bg-blue-100 text-blue-800",
    retailer: "bg-purple-100 text-purple-800",
    consumer: "bg-orange-100 text-orange-800",
  }

  // Filter items based on role - FIXED: Farmers can now see their items
  const getFilteredItems = () => {
    if (user.role.toLowerCase() === "farmer") {
      // Farmers see items where they are the origin farmer
      const farmerItems = items.filter((item) => {
        const itemFarmer = item.originFarmer?.toLowerCase()
        const userAccount = account?.toLowerCase()
        console.log("Filtering farmer items:", { itemFarmer, userAccount, match: itemFarmer === userAccount })
        return itemFarmer === userAccount
      })
      console.log("Farmer filtered items:", farmerItems)
      return farmerItems
    }
    return items
  }

  const filteredItems = getFilteredItems()

  // Get role-specific stats
  const getRoleStats = () => {
    const role = user.role.toLowerCase()

    switch (role) {
      case "farmer":
        const myItems = items.filter((item) => item.originFarmer?.toLowerCase() === account?.toLowerCase())
        return [
          { title: "My Items", value: myItems.length.toString(), icon: Package, change: "+5%" },
          {
            title: "Harvested",
            value: myItems.filter((item) => item.state >= 0).length.toString(),
            icon: Leaf,
            change: "+12%",
          },
          {
            title: "In Process",
            value: myItems.filter((item) => item.state >= 1 && item.state < 3).length.toString(),
            icon: Building,
            change: "+8%",
          },
          {
            title: "Sold",
            value: myItems.filter((item) => item.state >= 4).length.toString(),
            icon: ShoppingCart,
            change: "+15%",
          },
        ]

      case "processor":
        return [
          { title: "Total Items", value: items.length.toString(), icon: Package, change: "+12%" },
          {
            title: "To Process",
            value: items.filter((item) => item.state === 0).length.toString(),
            icon: Building,
            change: "+8%",
          },
          {
            title: "Processed",
            value: items.filter((item) => item.state >= 1).length.toString(),
            icon: Package,
            change: "+15%",
          },
          { title: "Participants", value: participants.length.toString(), icon: Users, change: "+10%" },
        ]

      case "retailer":
        return [
          { title: "Total Items", value: items.length.toString(), icon: Package, change: "+12%" },
          {
            title: "For Sale",
            value: items.filter((item) => item.state === 3).length.toString(),
            icon: ShoppingCart,
            change: "+8%",
          },
          {
            title: "Sold",
            value: items.filter((item) => item.state >= 4).length.toString(),
            icon: Truck,
            change: "+15%",
          },
          { title: "Participants", value: participants.length.toString(), icon: Users, change: "+10%" },
        ]

      case "consumer":
        const availableItems = items.filter((item) => item.state === 3) // Only items for sale
        return [
          { title: "Available to Buy", value: availableItems.length.toString(), icon: Package, change: "+12%" },
          { title: "Verified Items", value: items.length.toString(), icon: Package, change: "+100%" },
          {
            title: "Fresh Items",
            value: availableItems.filter((item) => item.state === 3).length.toString(),
            icon: Leaf,
            change: "+8%",
          },
          {
            title: "Suppliers",
            value: participants.filter((p) => p.role !== "consumer").length.toString(),
            icon: Users,
            change: "+5%",
          },
        ]

      default:
        return []
    }
  }

  const stats = getRoleStats()

  // Get available tabs based on role
  const getAvailableTabs = () => {
    const tabs = []

    // Farmers get "My Items" tab instead of "All Items"
    if (user.role.toLowerCase() === "farmer") {
      tabs.push({ value: "my-items", label: "My Items" })
    } else if (canAccess("all-items")) {
      tabs.push({ value: "items", label: "All Items" })
    }

    if (canAccess("participants")) {
      tabs.push({ value: "participants", label: "Participants" })
    }

    if (canAccess("consumer-tracker")) {
      tabs.push({ value: "consumer", label: "🍽️ Food Tracker" })
    }

    if (canAccess("harvest")) {
      tabs.push({ value: "harvest", label: "Harvest New" })
    }

    if (canAccess("manage-items")) {
      tabs.push({ value: "manage", label: "Manage Items" })
    }

    if (canAccess("profile")) {
      tabs.push({ value: "profile", label: "Profile" })
    }

    if (canAccess("analytics")) {
      tabs.push({ value: "analytics", label: "Analytics" })
    }

    return tabs
  }

  const availableTabs = getAvailableTabs()

  // Handle successful harvest - force refresh
  const handleHarvestSuccess = () => {
    console.log("Harvest successful, refreshing items...")
    refreshItems()
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                  {roleIcons[user.role.toLowerCase() as keyof typeof roleIcons]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
                <CardDescription className="text-lg flex items-center gap-2">
                  <Badge className={roleColors[user.role.toLowerCase() as keyof typeof roleColors]}>
                    {roleIcons[user.role.toLowerCase() as keyof typeof roleIcons]}
                    <span className="ml-1 capitalize">{user.role}</span>
                  </Badge>
                  {user.businessName && <span>• {user.businessName}</span>}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={refreshItems} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Loading..." : "Refresh"}
              </Button>
              {user.role.toLowerCase() === "consumer" && (
                <Button onClick={onShowQRScanner} className="bg-blue-600 hover:bg-blue-700" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
              )}
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {user.location.city}, {user.location.state}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Joined {new Date(user.registeredAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debug Info for Farmers */}
      {user.role.toLowerCase() === "farmer" && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>
                Your Address: <code>{account}</code>
              </p>
              <p>Total Items in Contract: {items.length}</p>
              <p>Your Items: {filteredItems.length}</p>
              <p>
                Items Details: {filteredItems.map((item) => `${item.name} (SKU: ${item.sku})`).join(", ") || "None"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue={availableTabs[0]?.value} className="space-y-6">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* My Items Tab (Farmers) */}
        {user.role.toLowerCase() === "farmer" && (
          <TabsContent value="my-items">
            <Card>
              <CardHeader>
                <CardTitle>My Harvested Items</CardTitle>
                <CardDescription>Items you have harvested and their current status in the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemsList
                  items={filteredItems}
                  loading={loading}
                  onItemSelect={onItemSelect}
                  getStateColor={getStateColor}
                  getStateName={getStateName}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* All Items Tab (Processors, Retailers) */}
        {canAccess("all-items") && (
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>All Food Items on Blockchain</CardTitle>
                <CardDescription>All food items tracked through the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemsList
                  items={items}
                  loading={loading}
                  onItemSelect={onItemSelect}
                  getStateColor={getStateColor}
                  getStateName={getStateName}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Participants Tab */}
        {canAccess("participants") && (
          <TabsContent value="participants">
            <ParticipantsTracker participants={participants} onViewParticipant={onParticipantSelect} />
          </TabsContent>
        )}

        {/* Consumer Food Tracker Tab */}
        {canAccess("consumer-tracker") && (
          <TabsContent value="consumer">
            <ConsumerFoodTracker
              items={items.filter((item) => item.state >= 3)} // Only show items that are for sale or sold
              participants={participants}
              getParticipantInfo={async (address) => {
                const participant = participants.find((p) => p.address?.toLowerCase() === address.toLowerCase())
                return participant || { address, role: "Unknown", name: "Unknown" }
              }}
              onSelectItem={onSelectFoodItem}
            />
          </TabsContent>
        )}

        {/* Harvest Tab (Farmers only) */}
        {canAccess("harvest") && (
          <TabsContent value="harvest">
            <HarvestForm
              contract={contract}
              account={account}
              isConnected={isConnected}
              onSuccess={handleHarvestSuccess}
            />
          </TabsContent>
        )}

        {/* Manage Items Tab */}
        {canAccess("manage-items") && (
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Items</CardTitle>
                <CardDescription>
                  {user.role.toLowerCase() === "farmer"
                    ? "Track the progress of your harvested items"
                    : "Process, package, sell, buy, and confirm delivery of items"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemActions
                  items={user.role.toLowerCase() === "farmer" ? filteredItems : items}
                  contract={contract}
                  account={account}
                  isConnected={isConnected}
                  onSuccess={refreshItems}
                  getStateColor={getStateColor}
                  getStateName={getStateName}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Profile Tab */}
        {canAccess("profile") && (
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your supply chain network profile and role</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile account={account} isConnected={isConnected} onEditProfile={onShowRegistration} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Analytics Tab */}
        {canAccess("analytics") && (
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {user.role.toLowerCase() === "farmer" ? "Farm Analytics" : "Supply Chain Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.role.toLowerCase() === "farmer" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Harvested</span>
                          <span className="text-sm text-green-600">
                            {filteredItems.filter((item) => item.state >= 0).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Processed</span>
                          <span className="text-sm text-blue-600">
                            {filteredItems.filter((item) => item.state >= 1).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Sold</span>
                          <span className="text-sm text-purple-600">
                            {filteredItems.filter((item) => item.state >= 4).length}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Harvested</span>
                          <span className="text-sm text-green-600">
                            {items.filter((item) => item.state >= 0).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Processed</span>
                          <span className="text-sm text-blue-600">
                            {items.filter((item) => item.state >= 1).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items For Sale</span>
                          <span className="text-sm text-purple-600">
                            {items.filter((item) => item.state === 3).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Items Delivered</span>
                          <span className="text-sm text-gray-600">
                            {items.filter((item) => item.state === 5).length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Network Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Farmers</span>
                      <span className="text-sm text-green-600">
                        {participants.filter((p) => p.role?.toLowerCase() === "farmer").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Processors</span>
                      <span className="text-sm text-blue-600">
                        {participants.filter((p) => p.role?.toLowerCase() === "processor").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Retailers</span>
                      <span className="text-sm text-purple-600">
                        {participants.filter((p) => p.role?.toLowerCase() === "retailer").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Consumers</span>
                      <span className="text-sm text-orange-600">
                        {participants.filter((p) => p.role?.toLowerCase() === "consumer").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
