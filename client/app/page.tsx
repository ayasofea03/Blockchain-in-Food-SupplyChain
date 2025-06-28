"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Package,
  Users,
  Shield,
  Leaf,
  Wallet,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  UserPlus,
  UsersIcon,
} from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { ItemsList } from "@/components/items-list"
import { HarvestForm } from "@/components/harvest-form"
import { ItemActions } from "@/components/item-actions"
import { useWeb3 } from "@/lib/use-web3"
import { useContract } from "@/lib/use-contract"
import { ItemDetailModal } from "@/components/item-detail-modal"
import { RegistrationModal } from "@/components/registration-modal"
import { BulkRegistrationModal } from "@/components/bulk-registration-modal"
import { UserProfile } from "@/components/user-profile"
import { ParticipantsTracker } from "@/components/participants-tracker"
// Import the new ParticipantDetailModal
import { ParticipantDetailModal } from "@/components/participant-detail-modal"

export default function BlockchainFoodSupplyChain() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showBulkRegistration, setShowBulkRegistration] = useState(false)

  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3()
  const {
    contract,
    items,
    participants,
    loading,
    refreshItems,
    skuCount,
    error,
    networkInfo,
    testConnection,
    contractSetup,
  } = useContract(account, isConnected)

  const stats = [
    { title: "Total Items on Chain", value: skuCount?.toString() || "0", icon: Package, change: "+12%" },
    {
      title: "Contract Status",
      value: contract ? "Connected" : "Not Connected",
      icon: Shield,
      change: contract ? "✓" : "✗",
    },
    { title: "Active Participants", value: participants?.length?.toString() || "0", icon: Users, change: "+15%" },
    {
      title: "Network",
      value: networkInfo ? `${networkInfo.name} (${networkInfo.chainId})` : "Unknown",
      icon: Wallet,
      change: "Active",
    },
  ]

  const getStateColor = (state: number) => {
    switch (state) {
      case 0:
        return "bg-yellow-100 text-yellow-800" // Harvested
      case 1:
        return "bg-blue-100 text-blue-800" // Processed
      case 2:
        return "bg-purple-100 text-purple-800" // Packaged
      case 3:
        return "bg-green-100 text-green-800" // ForSale
      case 4:
        return "bg-orange-100 text-orange-800" // Sold
      case 5:
        return "bg-gray-100 text-gray-800" // Delivered
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStateName = (state: number) => {
    const states = ["Harvested", "Processed", "Packaged", "For Sale", "Sold", "Delivered"]
    return states[state] || "Unknown"
  }

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toString().includes(searchQuery),
  )

  const handleTestConnection = async () => {
    try {
      const result = await testConnection()
      if (result) {
        alert("✅ Contract connection test successful!")
      } else {
        alert("❌ Contract connection test failed. Check console for details.")
      }
    } catch (err) {
      console.error("Test connection error:", err)
      alert("❌ Error testing connection")
    }
  }

  const handleBulkRegistrationSuccess = () => {
    // Refresh participants data
    refreshItems()
    // Also refresh participants from storage
    if (typeof refreshItems === "function") {
      refreshItems()
    }
  }

  // Add a function to handle registration success
  const handleRegistrationSuccess = () => {
    refreshItems()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600 mr-2" />
                <Leaf className="h-8 w-8 text-green-500 mr-3" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blockchain Food Supply Chain</h1>
                <p className="text-sm text-gray-600">Decentralized Food Traceability System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by item name or SKU..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isConnected && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRegistration(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkRegistration(true)}>
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Bulk Register
                  </Button>
                </div>
              )}
              <WalletConnection
                account={account}
                isConnected={isConnected}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Alert */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                Please connect your MetaMask wallet to Ganache network (Chain ID: 1337) to interact with the blockchain
              </p>
            </div>
          </div>
        )}

        {/* Contract Connected Successfully */}
        {isConnected && contractSetup && !error && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">
                ✅ Successfully connected to FoodSupplyChain contract at{" "}
                <code className="bg-green-100 px-2 py-1 rounded text-sm">0xBD20...BbDC</code>
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Contract Error:</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                {error.includes("Wrong network") && (
                  <div className="mt-3 text-sm text-red-600">
                    <p className="font-medium">To connect to Ganache:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Open MetaMask</li>
                      <li>Click on network dropdown</li>
                      <li>Add Network → Add network manually</li>
                      <li>
                        Network Name: <code>Ganache</code>
                      </li>
                      <li>
                        RPC URL: <code>http://127.0.0.1:7545</code>
                      </li>
                      <li>
                        Chain ID: <code>1337</code>
                      </li>
                      <li>
                        Currency Symbol: <code>ETH</code>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 text-green-600" />
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

        {/* Debug Panel */}
        {isConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Contract Information</CardTitle>
              <CardDescription>Your deployed FoodSupplyChain contract details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button onClick={refreshItems} disabled={loading} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {loading ? "Loading..." : "Refresh Items"}
                    </Button>
                    <Button onClick={handleTestConnection} variant="outline">
                      Test Connection
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Contract Address:</strong>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">0xBD200d74B150cF29F77B2bCd80D910a93946BbDC</code>
                  </p>
                  <p>
                    <strong>Network:</strong> {networkInfo?.name || "Unknown"} (Chain ID: {networkInfo?.chainId || "?"})
                  </p>
                  <p>
                    <strong>Your Account:</strong>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
                    </code>
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={contract ? "text-green-600" : "text-red-600"}>
                      {contract ? "✅ Connected" : "❌ Not Connected"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="items">All Items</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="harvest">Harvest New</TabsTrigger>
            <TabsTrigger value="manage">Manage Items</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Food Items on Blockchain</CardTitle>
                <CardDescription>
                  All food items tracked through the supply chain with smart contract verification
                </CardDescription>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Total Items: {skuCount}</p>
                  <Button onClick={refreshItems} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ItemsList
                  items={filteredItems}
                  loading={loading}
                  onItemSelect={setSelectedItem}
                  getStateColor={getStateColor}
                  getStateName={getStateName}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsTracker participants={participants} onViewParticipant={setSelectedParticipant} />
          </TabsContent>

          <TabsContent value="harvest">
            <Card>
              <CardHeader>
                <CardTitle>Harvest New Item</CardTitle>
                <CardDescription>Create a new food item on the blockchain (Farmer only)</CardDescription>
              </CardHeader>
              <CardContent>
                <HarvestForm contract={contract} account={account} isConnected={isConnected} onSuccess={refreshItems} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Items</CardTitle>
                <CardDescription>Process, package, sell, buy, and confirm delivery of items</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemActions
                  items={filteredItems}
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

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your supply chain network profile and role</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile
                  account={account}
                  isConnected={isConnected}
                  onEditProfile={() => setShowRegistration(true)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Items Harvested</span>
                      <span className="text-sm text-green-600">{items.filter((item) => item.state >= 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Items Processed</span>
                      <span className="text-sm text-blue-600">{items.filter((item) => item.state >= 1).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Items For Sale</span>
                      <span className="text-sm text-purple-600">{items.filter((item) => item.state === 3).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Items Delivered</span>
                      <span className="text-sm text-gray-600">{items.filter((item) => item.state === 5).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Participant Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Farmers</span>
                      <span className="text-sm text-green-600">
                        {participants.filter((p) => p.role.toLowerCase() === "farmer").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Processors</span>
                      <span className="text-sm text-blue-600">
                        {participants.filter((p) => p.role.toLowerCase() === "processor").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Retailers</span>
                      <span className="text-sm text-purple-600">
                        {participants.filter((p) => p.role.toLowerCase() === "retailer").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Consumers</span>
                      <span className="text-sm text-orange-600">
                        {participants.filter((p) => p.role.toLowerCase() === "consumer").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ItemDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          getStateColor={getStateColor}
          getStateName={getStateName}
        />

        <RegistrationModal
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          account={account}
          isConnected={isConnected}
          onSuccess={handleRegistrationSuccess}
        />

        <BulkRegistrationModal
          isOpen={showBulkRegistration}
          onClose={() => setShowBulkRegistration(false)}
          onSuccess={handleBulkRegistrationSuccess}
        />
        {/* Add the ParticipantDetailModal to the modals section at the bottom */}
        <ParticipantDetailModal
          participant={selectedParticipant}
          isOpen={!!selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      </div>
    </div>
  )
}
