"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, AlertCircle } from "lucide-react"

interface HarvestFormProps {
  contract: any
  account: string | null
  isConnected: boolean
  onSuccess: () => void
}

export function HarvestForm({ contract, account, isConnected, onSuccess }: HarvestFormProps) {
  const [itemName, setItemName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contract || !isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!itemName.trim()) {
      setError("Please enter an item name")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Harvesting item:", itemName)
      const tx = await contract.harvestItem(itemName)
      console.log("Transaction sent:", tx.hash)

      await tx.wait()
      console.log("Transaction confirmed")

      setItemName("")
      onSuccess()
      alert("Item harvested successfully!")
    } catch (error: any) {
      console.error("Error harvesting item:", error)
      setError(error.message || "Failed to harvest item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Harvest New Item
        </CardTitle>
        <CardDescription>Create a new food item on the blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Organic Apples"
              disabled={loading || !isConnected}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading || !isConnected} className="w-full">
            {loading ? "Harvesting..." : "Harvest Item"}
          </Button>

          {!isConnected && <p className="text-sm text-gray-500 text-center">Connect your wallet to harvest items</p>}
        </form>
      </CardContent>
    </Card>
  )
}
