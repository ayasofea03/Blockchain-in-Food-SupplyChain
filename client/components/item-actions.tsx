"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react"

interface Item {
  sku: number
  name: string
  state: number
  originFarmer: string
  processor: string
  retailer: string
  consumer: string
  price: string
}

interface ItemActionsProps {
  items: Item[]
  contract: any
  account: string | null
  isConnected: boolean
  onSuccess: () => void
  getStateColor: (state: number) => string
  getStateName: (state: number) => string
}

export function ItemActions({
  items,
  contract,
  account,
  isConnected,
  onSuccess,
  getStateColor,
  getStateName,
}: ItemActionsProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [sellPrice, setSellPrice] = useState<{ [key: number]: string }>({})
  const [error, setError] = useState("")

  const handleAction = async (action: string, sku: number, price?: string) => {
    if (!contract || !isConnected) {
      setError("Please connect your wallet first")
      return
    }

    const loadingKey = `${action}-${sku}`
    setLoading((prev) => ({ ...prev, [loadingKey]: true }))
    setError("")

    try {
      let tx
      switch (action) {
        case "process":
          tx = await contract.processItem(sku)
          break
        case "package":
          tx = await contract.packageItem(sku)
          break
        case "sell":
          if (!price) {
            setError("Please enter a price")
            return
          }
          // Convert price to wei (assuming price is in ETH)
          const { ethers } = await import("ethers")
          const priceInWei = ethers.parseEther(price)
          tx = await contract.sellItem(sku, priceInWei)
          break
        case "buy":
          const item = items.find((i) => i.sku === sku)
          if (!item) return
          const { ethers: ethers2 } = await import("ethers")
          const priceInWei2 = ethers2.parseEther(item.price)
          tx = await contract.buyItem(sku, { value: priceInWei2 })
          break
        case "confirm":
          tx = await contract.confirmDelivery(sku)
          break
        default:
          throw new Error("Unknown action")
      }

      await tx.wait()
      onSuccess()
      alert(`Action ${action} completed successfully!`)
    } catch (error: any) {
      console.error(`Error ${action}:`, error)
      setError(error.message || `Failed to ${action} item`)
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const canPerformAction = (item: Item, action: string) => {
    if (!account) return false

    switch (action) {
      case "process":
        return item.state === 0 && item.originFarmer.toLowerCase() === account.toLowerCase()
      case "package":
        return item.state === 1
      case "sell":
        return item.state === 2
      case "buy":
        return item.state === 3
      case "confirm":
        return item.state === 4 && item.consumer.toLowerCase() === account.toLowerCase()
      default:
        return false
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect your wallet to manage items</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {items.map((item) => (
          <Card key={item.sku}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>SKU: {item.sku}</CardDescription>
                </div>
                <Badge className={getStateColor(item.state)}>{getStateName(item.state)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {/* Process Item */}
                {canPerformAction(item, "process") && (
                  <Button
                    onClick={() => handleAction("process", item.sku)}
                    disabled={loading[`process-${item.sku}`]}
                    size="sm"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {loading[`process-${item.sku}`] ? "Processing..." : "Process Item"}
                  </Button>
                )}

                {/* Package Item */}
                {canPerformAction(item, "package") && (
                  <Button
                    onClick={() => handleAction("package", item.sku)}
                    disabled={loading[`package-${item.sku}`]}
                    size="sm"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {loading[`package-${item.sku}`] ? "Packaging..." : "Package Item"}
                  </Button>
                )}

                {/* Sell Item */}
                {canPerformAction(item, "sell") && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="Price in ETH"
                      value={sellPrice[item.sku] || ""}
                      onChange={(e) => setSellPrice((prev) => ({ ...prev, [item.sku]: e.target.value }))}
                      className="w-32"
                    />
                    <Button
                      onClick={() => handleAction("sell", item.sku, sellPrice[item.sku])}
                      disabled={loading[`sell-${item.sku}`] || !sellPrice[item.sku]}
                      size="sm"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {loading[`sell-${item.sku}`] ? "Listing..." : "Sell Item"}
                    </Button>
                  </div>
                )}

                {/* Buy Item */}
                {canPerformAction(item, "buy") && (
                  <Button onClick={() => handleAction("buy", item.sku)} disabled={loading[`buy-${item.sku}`]} size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {loading[`buy-${item.sku}`] ? "Buying..." : `Buy for ${item.price} ETH`}
                  </Button>
                )}

                {/* Confirm Delivery */}
                {canPerformAction(item, "confirm") && (
                  <Button
                    onClick={() => handleAction("confirm", item.sku)}
                    disabled={loading[`confirm-${item.sku}`]}
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading[`confirm-${item.sku}`] ? "Confirming..." : "Confirm Delivery"}
                  </Button>
                )}
              </div>

              {/* Item Details */}
              <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">Farmer:</span>{" "}
                  {item.originFarmer ? `${item.originFarmer.slice(0, 6)}...${item.originFarmer.slice(-4)}` : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Price:</span> {item.price} ETH
                </p>
                <p>
                  <span className="font-medium">Processor:</span>{" "}
                  {item.processor ? `${item.processor.slice(0, 6)}...${item.processor.slice(-4)}` : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Consumer:</span>{" "}
                  {item.consumer ? `${item.consumer.slice(0, 6)}...${item.consumer.slice(-4)}` : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
