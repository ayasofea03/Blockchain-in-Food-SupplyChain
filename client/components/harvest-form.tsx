"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Loader2, CheckCircle, AlertCircle } from "lucide-react"

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
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contract || !isConnected || !account) {
      setError("Please connect your wallet and ensure contract is loaded")
      return
    }

    if (!itemName.trim()) {
      setError("Please enter an item name")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Harvesting item:", itemName)
      console.log("Contract:", contract)
      console.log("Account:", account)

      // Call the harvestItem function
      const tx = await contract.harvestItem(itemName.trim())
      console.log("Transaction sent:", tx.hash)

      setSuccess(`Transaction sent! Hash: ${tx.hash}`)

      // Wait for transaction to be mined
      console.log("Waiting for transaction to be mined...")
      const receipt = await tx.wait()
      console.log("Transaction mined:", receipt)

      if (receipt.status === 1) {
        setSuccess(`✅ Successfully harvested "${itemName}"! Transaction confirmed.`)
        setItemName("")

        // Wait a moment then refresh the items
        setTimeout(() => {
          console.log("Calling onSuccess to refresh items...")
          onSuccess()
        }, 1000)
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err: any) {
      console.error("Error harvesting item:", err)

      if (err.message.includes("user rejected")) {
        setError("Transaction was rejected by user")
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees")
      } else if (err.message.includes("execution reverted")) {
        setError("Contract execution failed. Check if you have permission to harvest.")
      } else {
        setError(err.message || "Failed to harvest item")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please connect your wallet to harvest items</AlertDescription>
      </Alert>
    )
  }

  if (!contract) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Contract not loaded. Please check your connection to Ganache network.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Harvest New Item
        </CardTitle>
        <CardDescription>
          Create a new food item on the blockchain. This will be recorded as harvested by your wallet address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              placeholder="e.g., Organic Tomatoes, Fresh Apples, etc."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !itemName.trim()} className="bg-green-600 hover:bg-green-700">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Harvesting...
                </>
              ) : (
                <>
                  <Leaf className="h-4 w-4 mr-2" />
                  Harvest Item
                </>
              )}
            </Button>

            {itemName && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setItemName("")
                  setError("")
                  setSuccess("")
                }}
                disabled={loading}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p>
              <strong>Note:</strong> After harvesting, the item will appear in your "My Items" tab with status
              "Harvested". You can then track its progress through the supply chain.
            </p>
            <p className="mt-1">
              <strong>Your Address:</strong> <code className="text-xs">{account}</code>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
