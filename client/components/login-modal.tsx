"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Wallet, Mail, User, Building, Truck, ShoppingCart, AlertCircle } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: any) => void
  account: string | null
  isConnected: boolean
}

export function LoginModal({ isOpen, onClose, onLogin, account, isConnected }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<"wallet" | "email">("wallet")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const demoCredentials = [
    { email: "farmer1@farm.com", password: "farmer123", role: "Farmer", name: "John Smith" },
    { email: "processor1@processing.com", password: "processor123", role: "Processor", name: "Sarah Johnson" },
    { email: "retailer1@retail.com", password: "retailer123", role: "Retailer", name: "Mike Chen" },
    { email: "consumer1@email.com", password: "consumer123", role: "Consumer", name: "Emma Davis" },
  ]

  const handleWalletLogin = async () => {
    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Check if wallet is registered
      const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const userProfile = registrations.find(
        (reg: any) => reg.walletAddress && reg.walletAddress.toLowerCase() === account.toLowerCase(),
      )

      if (!userProfile) {
        setError("Wallet not registered. Please register your account first.")
        setLoading(false)
        return
      }

      // Login successful
      onLogin({
        ...userProfile,
        loginMethod: "wallet",
        loginTime: new Date().toISOString(),
      })

      onClose()
    } catch (err) {
      setError("Failed to login with wallet")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Check demo credentials
      const credential = demoCredentials.find((cred) => cred.email === email && cred.password === password)

      if (!credential) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      // Login successful
      onLogin({
        name: credential.name,
        email: credential.email,
        role: credential.role,
        businessName: `${credential.name}'s ${credential.role} Business`,
        loginMethod: "email",
        loginTime: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
      })

      onClose()
    } catch (err) {
      setError("Failed to login")
    } finally {
      setLoading(false)
    }
  }

  const roleFeatures = {
    Farmer: ["Harvest new items", "Track item progress", "View farm analytics", "Manage profile"],
    Processor: ["Process items", "View all items", "Manage participants", "Processing analytics"],
    Retailer: ["Sell items", "Manage inventory", "View participants", "Retail analytics"],
    Consumer: ["Track food origin", "Scan QR codes", "View certifications", "Purchase items"],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Login to Your Dashboard</DialogTitle>
          <DialogDescription>Choose your preferred login method to access your role-based dashboard</DialogDescription>
        </DialogHeader>

        <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "wallet" | "email")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Login
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Authentication
                </CardTitle>
                <CardDescription>Login using your connected MetaMask wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Connected Wallet:</p>
                  <p className="text-sm font-mono text-gray-600">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
                  </p>
                </div>

                <Button onClick={handleWalletLogin} disabled={!isConnected || loading} className="w-full" size="lg">
                  {loading ? "Logging in..." : "Login with Wallet"}
                </Button>

                {!isConnected && (
                  <p className="text-sm text-gray-600 text-center">
                    Please connect your MetaMask wallet to use this login method
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Authentication
                </CardTitle>
                <CardDescription>Login using your email and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleEmailLogin} disabled={loading} className="w-full" size="lg">
                  {loading ? "Logging in..." : "Login with Email"}
                </Button>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Credentials</CardTitle>
                <CardDescription>Use these credentials to test different roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoCredentials.map((cred, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={
                            cred.role === "Farmer"
                              ? "bg-green-100 text-green-800"
                              : cred.role === "Processor"
                                ? "bg-blue-100 text-blue-800"
                                : cred.role === "Retailer"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                          }
                        >
                          {cred.role === "Farmer" && <User className="h-3 w-3 mr-1" />}
                          {cred.role === "Processor" && <Building className="h-3 w-3 mr-1" />}
                          {cred.role === "Retailer" && <Truck className="h-3 w-3 mr-1" />}
                          {cred.role === "Consumer" && <ShoppingCart className="h-3 w-3 mr-1" />}
                          {cred.role}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{cred.name}</p>
                      <p className="text-xs text-gray-600 mb-2">{cred.email}</p>
                      <p className="text-xs text-gray-500">Password: {cred.password}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                        onClick={() => {
                          setEmail(cred.email)
                          setPassword(cred.password)
                        }}
                      >
                        Use Credentials
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Role Information */}
        <Card>
          <CardHeader>
            <CardTitle>What Each Role Can Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(roleFeatures).map(([role, features]) => (
                <div key={role} className="space-y-2">
                  <h4 className="font-medium text-sm">{role}</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
