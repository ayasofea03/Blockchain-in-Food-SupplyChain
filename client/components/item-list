"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Eye } from "lucide-react"

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

interface ItemsListProps {
  items: Item[]
  loading: boolean
  onItemSelect: (item: Item | null) => void
  getStateColor: (state: number) => string
  getStateName: (state: number) => string
}

export function ItemsList({ items, loading, onItemSelect, getStateColor, getStateName }: ItemsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading items from blockchain...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No items found on the blockchain</p>
          <p className="text-sm text-gray-500">Harvest your first item to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.sku} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <Badge className={getStateColor(item.state)}>{getStateName(item.state)}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">SKU:</span> {item.sku}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> {item.price} ETH
                  </p>
                  <p>
                    <span className="font-medium">Farmer:</span>{" "}
                    {item.originFarmer ? `${item.originFarmer.slice(0, 6)}...${item.originFarmer.slice(-4)}` : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Consumer:</span>{" "}
                    {item.consumer ? `${item.consumer.slice(0, 6)}...${item.consumer.slice(-4)}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" size="sm" onClick={() => onItemSelect(item)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
