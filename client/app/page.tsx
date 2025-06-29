"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Package,
  Users,
  Shield,
  Leaf,
  Wallet,
  AlertCircle,
  CheckCircle,
  UserPlus,
  UsersIcon,
  QrCode,
  LogIn,
} from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { useWeb3 } from "@/lib/use-web3"
import { useContract } from "@/lib/use-contract"
import { ItemDetailModal } from "@/components/item-detail-modal"
import { RegistrationModal } from "@/components/registration-modal"
import { BulkRegistrationModal } from "@/components/bulk-registration-modal"
import { ParticipantDetailModal } from "@/components/participant-detail-modal"
import { QRScannerModal } from "@/components/qr-scanner-modal"
import { FoodOriginDetailModal } from "@/components/food-origin-detail-modal"
import { LoginModal } from "@/components/login-modal"
import { AuthProvider } from "@/components/auth-provider"
import { useAuth } from "@/lib/use-auth"
import { RoleBasedDashboard } from "@/components/role-based-dashboard"

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showBulkRegistration, setShowBulkRegistration] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [selectedFoodItem, setSelectedFoodItem] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3()
  const { user, isAuthenticated, login } = useAuth()
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

  // Check if user is registered
  const checkUserRegistration = () => {
    if (!isConnected || !account) return false

    const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
    return registrations.some(
      (reg: any) => reg.walletAddress && reg.walletAddress.toLowerCase() === account.toLowerCase(),
    )
  }

  const isUserRegistered = checkUserRegistration()

  // Show login modal if connected but not authenticated and is registered
  useEffect(() => {
    if (isConnected && !isAuthenticated && isUserRegistered) {
      setShowLogin(true)
    }
  }, [isConnected, isAuthenticated, isUserRegistered])

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

  const handleBulkRegistrationSuccess = () => {
    refreshItems()
  }

  const handleRegistrationSuccess = () => {
    refreshItems()
    // Check if user should be auto-logged in after registration
    if (isConnected && account) {
      const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const userProfile = registrations.find(
        (reg: any) => reg.walletAddress && reg.walletAddress.toLowerCase() === account.toLowerCase(),
      )
      if (userProfile) {
        login({
          ...userProfile,
          loginMethod: "wallet",
          loginTime: new Date().toISOString(),
        })
      }
    }
  }

  const handleQRScanResult = (sku: string) => {
    const item = items.find((item) => item.sku.toString() === sku)
    if (item) {
      setSelectedFoodItem(item)
    } else {
      alert(`No food item found with SKU: ${sku}`)
    }
  }

  const handleLogin = (userProfile: any) => {
    login(userProfile)
    setShowLogin(false)
  }

  // FIXED: Close all modals when one opens to prevent overlapping
  const handleOpenModal = (modalType: string) => {
    // Close all other modals first
    setSelectedItem(null)
    setSelectedParticipant(null)
    setSelectedFoodItem(null)
    setShowRegistration(false)
    setShowBulkRegistration(false)
    setShowQRScanner(false)
    setShowLogin(false)

    // Then open the requested modal
    switch (modalType) {
      case "registration":
        setShowRegistration(true)
        break
      case "bulkRegistration":
        setShowBulkRegistration(true)
        break
      case "qrScanner":
        setShowQRScanner(true)
        break
      case "login":
        setShowLogin(true)
        break
    }
  }

  // If not authenticated, show welcome screen
  if (!isAuthenticated) {
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
                {isConnected && isUserRegistered && (
                  <Button onClick={() => handleOpenModal("login")} className="bg-blue-600 hover:bg-blue-700">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Dashboard
                  </Button>
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
          {/* Welcome Section */}
          <div className="text-center py-16">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <Shield className="h-16 w-16 text-green-600" />
                <Leaf className="h-16 w-16 text-green-500" />
                <Package className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Blockchain Food Supply Chain</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A decentralized platform for complete food traceability from farm to table. Connect your wallet and login
              to access your role-based dashboard.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              {!isConnected ? (
                <Button onClick={connectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet to Get Started
                </Button>
              ) : !isUserRegistered ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Wallet Connected!</p>
                    <p className="text-gray-600">Please register your account to continue</p>
                  </div>
                  <Button
                    onClick={() => handleOpenModal("registration")}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Register Your Account
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleOpenModal("login")} size="lg" className="bg-green-600 hover:bg-green-700">
                  <LogIn className="h-5 w-5 mr-2" />
                  Login to Dashboard
                </Button>
              )}
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Farmers</h3>
                  <p className="text-sm text-green-600">
                    Harvest and track your produce from farm to market with blockchain verification.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800 mb-2">Processors</h3>
                  <p className="text-sm text-blue-600">
                    Process and package food items while maintaining complete supply chain transparency.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-800 mb-2">Retailers</h3>
                  <p className="text-sm text-purple-600">
                    Sell verified food products with complete origin and quality information.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-800 mb-2">Consumers</h3>
                  <p className="text-sm text-orange-600">
                    Discover where your food comes from and verify its authenticity with QR codes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Connection Alert */}
          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">
                  Please connect your MetaMask wallet to Ganache network (Chain ID: 1337) to access the platform
                </p>
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
        </div>

        {/* Modals - FIXED: Only one modal can be open at a time */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          account={account}
          isConnected={isConnected}
        />

        <RegistrationModal
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          account={account}
          isConnected={isConnected}
          onSuccess={handleRegistrationSuccess}
        />
      </div>
    )
  }

  // If authenticated, show role-based dashboard
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
              {isConnected && user?.role !== "consumer" && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleOpenModal("registration")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                  <Button variant="outline" onClick={() => handleOpenModal("bulkRegistration")}>
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
              </div>
            </div>
          </div>
        )}

        {/* Role-Based Dashboard */}
        <RoleBasedDashboard
          items={items}
          participants={participants}
          contract={contract}
          account={account}
          isConnected={isConnected}
          loading={loading}
          refreshItems={refreshItems}
          onItemSelect={setSelectedItem}
          onParticipantSelect={setSelectedParticipant}
          onShowRegistration={() => handleOpenModal("registration")}
          onShowQRScanner={() => handleOpenModal("qrScanner")}
          onSelectFoodItem={setSelectedFoodItem}
          getStateColor={getStateColor}
          getStateName={getStateName}
        />

        {/* Modals - FIXED: Only one modal can be open at a time */}
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

        <ParticipantDetailModal
          participant={selectedParticipant}
          isOpen={!!selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />

        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScanResult={handleQRScanResult}
        />

        <FoodOriginDetailModal
          item={selectedFoodItem}
          isOpen={!!selectedFoodItem}
          onClose={() => setSelectedFoodItem(null)}
          participants={participants}
        />
      </div>
    </div>
  )
}

export default function BlockchainFoodSupplyChain() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
