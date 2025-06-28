"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut } from "lucide-react"

interface WalletConnectionProps {
  account: string | null
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnection({ account, isConnected, onConnect, onDisconnect }: WalletConnectionProps) {
  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Wallet className="h-3 w-3 mr-1" />
            Connected
          </Badge>
          <div className="text-sm">
            <p className="font-mono text-gray-600">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ""}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </>
      ) : (
        <Button onClick={onConnect}>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
