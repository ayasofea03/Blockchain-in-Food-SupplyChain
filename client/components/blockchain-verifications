"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ExternalLink, Copy, CheckCircle, AlertTriangle } from "lucide-react"

interface BlockchainVerificationProps {
  products: any[]
}

export function BlockchainVerification({ products }: BlockchainVerificationProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Blockchain Verification Center
          </CardTitle>
          <CardDescription>Immutable records and cryptographic proof of food supply chain data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-800">Verified Products</p>
              <p className="text-2xl font-bold text-green-900">2,847</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-800">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-900">18,429</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-800">Pending Verification</p>
              <p className="text-2xl font-bold text-purple-900">12</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>
                    Product ID: {product.id} | Batch: {product.batchNumber}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {product.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={
                      product.blockchainNetwork === "Ethereum"
                        ? "border-purple-200 text-purple-700"
                        : product.blockchainNetwork === "Polygon"
                          ? "border-indigo-200 text-indigo-700"
                          : "border-yellow-200 text-yellow-700"
                    }
                  >
                    {product.blockchainNetwork}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Smart Contract Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Smart Contract
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-gray-700">{product.smartContract}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(product.smartContract)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h4 className="font-semibold mb-3">Blockchain Transaction History</h4>
                  <div className="space-y-2">
                    {product.journey.map((step: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{step.stage}</p>
                          <p className="text-xs text-gray-600">{step.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs text-gray-500">{step.blockHash}</p>
                          <div className="flex gap-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => copyToClipboard(step.blockHash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs h-6">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify on Explorer
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Contract
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Export Proof
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
