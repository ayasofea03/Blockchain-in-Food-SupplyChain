"use client"

import { useState, useEffect, useCallback } from "react"

// Your deployed contract address on Ganache
const CONTRACT_ADDRESS = "0xBD200d74B150cF29F77B2bCd80D910a93946BbDC"

// Enhanced FoodSupplyChain contract ABI with participant tracking
const CONTRACT_ABI = [
  "function harvestItem(string memory _name) public",
  "function processItem(uint256 _sku) public",
  "function packageItem(uint256 _sku) public",
  "function sellItem(uint256 _sku, uint256 _price) public",
  "function buyItem(uint256 _sku) public payable",
  "function confirmDelivery(uint256 _sku) public",
  "function fetchItem(uint256 _sku) public view returns (uint256, string memory, uint8, address, address, address, address, uint256)",
  "function skuCount() public view returns (uint256)",
  // Additional functions for participant tracking
  "function getItemHistory(uint256 _sku) public view returns (address[], uint256[], string[])",
  "function getParticipantRole(address _participant) public view returns (string memory)",
  "function registerParticipant(address _participant, string memory _role, string memory _name) public",
]

interface FoodItem {
  sku: number
  name: string
  state: number
  originFarmer: string
  processor: string
  retailer: string
  consumer: string
  price: string
  // Enhanced tracking
  history?: ParticipantAction[]
  currentOwner?: string
}

interface ParticipantAction {
  participant: string
  timestamp: number
  action: string
  role: string
  name?: string
}

interface Participant {
  address: string
  role: string
  name: string
  businessName?: string
  registeredAt: string
  email?: string
  phone?: string
  location?: string
}

export function useContract(account: string | null, isConnected: boolean) {
  const [contract, setContract] = useState<any>(null)
  const [items, setItems] = useState<FoodItem[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(false)
  const [skuCount, setSkuCount] = useState(0)
  const [error, setError] = useState<string>("")
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [contractSetup, setContractSetup] = useState(false)

  useEffect(() => {
    if (!isConnected || !account) {
      setContract(null)
      setItems([])
      setParticipants([])
      setSkuCount(0)
      setError("")
      setContractSetup(false)
      return
    }

    initContract()
  }, [account, isConnected])

  const initContract = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask not found")
      }

      const { ethers } = await import("ethers")
      const provider = new ethers.BrowserProvider(window.ethereum)

      const network = await provider.getNetwork()
      setNetworkInfo({
        name: network.name === "unknown" ? "Ganache" : network.name,
        chainId: network.chainId.toString(),
      })

      console.log("Connected to network:", {
        name: network.name === "unknown" ? "Ganache" : network.name,
        chainId: network.chainId.toString(),
      })

      if (network.chainId.toString() !== "1337") {
        setError(`Wrong network! Please connect to Ganache (Chain ID: 5777). Currently on Chain ID: ${network.chainId}`)
        return
      }

      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        throw new Error(`Invalid contract address format: ${CONTRACT_ADDRESS}`)
      }

      const signer = await provider.getSigner()

      const code = await provider.getCode(CONTRACT_ADDRESS)
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${CONTRACT_ADDRESS}. Make sure Ganache is running and the contract is deployed.`,
        )
      }

      console.log("Contract found at address:", CONTRACT_ADDRESS)

      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
      setError("")
      setContractSetup(true)

      console.log("Contract initialized successfully")
    } catch (err: any) {
      console.error("Error initializing contract:", err)
      setError(err.message || "Failed to initialize contract")
      setContract(null)
      setContractSetup(false)
    }
  }

  const getParticipantInfo = useCallback(async (address: string) => {
    // Get participant info from localStorage (registration data)
    try {
      const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const participant = registrations.find((reg: any) => reg.walletAddress.toLowerCase() === address.toLowerCase())

      if (participant) {
        return {
          address: address,
          role: participant.role,
          name: participant.name,
          businessName: participant.businessName,
          registeredAt: participant.registeredAt,
        }
      }

      return {
        address: address,
        role: "Unknown",
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        registeredAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error getting participant info:", error)
      return {
        address: address,
        role: "Unknown",
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        registeredAt: new Date().toISOString(),
      }
    }
  }, [])

  const loadParticipantsFromStorage = useCallback(() => {
    try {
      const registrations = JSON.parse(localStorage.getItem("supplyChainRegistrations") || "[]")
      const participantDetails: Participant[] = registrations.map((reg: any) => ({
        address: reg.walletAddress,
        role: reg.role,
        name: reg.name,
        businessName: reg.businessName,
        registeredAt: reg.registeredAt,
        email: reg.email,
        phone: reg.phone,
        location: reg.location,
      }))
      setParticipants(participantDetails)
      console.log("Loaded participants from storage:", participantDetails)
    } catch (error) {
      console.error("Error loading participants from storage:", error)
    }
  }, [])

  const refreshItems = useCallback(async () => {
    if (!contract) {
      console.log("No contract available for refreshing items")
      // Still load participants from storage even if no contract
      loadParticipantsFromStorage()
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Calling skuCount()...")

      const count = await contract.skuCount()
      const totalCount = Number(count)
      setSkuCount(totalCount)

      console.log("skuCount() returned:", totalCount)

      if (totalCount === 0) {
        console.log("No items found in contract")
        setItems([])
        // Still load participants from storage
        loadParticipantsFromStorage()
        return
      }

      const itemsArray: FoodItem[] = []
      const participantSet = new Set<string>()

      for (let i = 1; i <= totalCount; i++) {
        try {
          console.log(`Fetching item ${i}...`)
          const item = await contract.fetchItem(i)

          console.log(`Item ${i} data:`, item)

          const [sku, name, state, originFarmer, processor, retailer, consumer, price] = item

          const { ethers } = await import("ethers")
          const priceInEth = price && price.toString() !== "0" ? ethers.formatEther(price) : "0"

          // Collect all participants
          const participants = [originFarmer, processor, retailer, consumer].filter(
            (addr) => addr && addr !== "0x0000000000000000000000000000000000000000",
          )
          participants.forEach((addr) => participantSet.add(addr))

          // Get current owner based on state
          let currentOwner = originFarmer
          if (state >= 4 && consumer !== "0x0000000000000000000000000000000000000000") {
            currentOwner = consumer
          } else if (state >= 3 && retailer !== "0x0000000000000000000000000000000000000000") {
            currentOwner = retailer
          } else if (state >= 1 && processor !== "0x0000000000000000000000000000000000000000") {
            currentOwner = processor
          }

          // Create history based on current state and participants
          const history: ParticipantAction[] = []

          if (originFarmer && originFarmer !== "0x0000000000000000000000000000000000000000") {
            const farmerInfo = await getParticipantInfo(originFarmer)
            history.push({
              participant: originFarmer,
              timestamp: Date.now() - (totalCount - i) * 86400000, // Mock timestamps
              action: "Harvested",
              role: farmerInfo.role,
              name: farmerInfo.name,
            })
          }

          if (state >= 1 && processor && processor !== "0x0000000000000000000000000000000000000000") {
            const processorInfo = await getParticipantInfo(processor)
            history.push({
              participant: processor,
              timestamp: Date.now() - (totalCount - i) * 86400000 + 3600000,
              action: "Processed",
              role: processorInfo.role,
              name: processorInfo.name,
            })
          }

          if (state >= 2) {
            const packagerInfo = await getParticipantInfo(processor || originFarmer)
            history.push({
              participant: processor || originFarmer,
              timestamp: Date.now() - (totalCount - i) * 86400000 + 7200000,
              action: "Packaged",
              role: packagerInfo.role,
              name: packagerInfo.name,
            })
          }

          if (state >= 3 && retailer && retailer !== "0x0000000000000000000000000000000000000000") {
            const retailerInfo = await getParticipantInfo(retailer)
            history.push({
              participant: retailer,
              timestamp: Date.now() - (totalCount - i) * 86400000 + 10800000,
              action: "Listed for Sale",
              role: retailerInfo.role,
              name: retailerInfo.name,
            })
          }

          if (state >= 4 && consumer && consumer !== "0x0000000000000000000000000000000000000000") {
            const consumerInfo = await getParticipantInfo(consumer)
            history.push({
              participant: consumer,
              timestamp: Date.now() - (totalCount - i) * 86400000 + 14400000,
              action: "Purchased",
              role: consumerInfo.role,
              name: consumerInfo.name,
            })
          }

          if (state >= 5 && consumer && consumer !== "0x0000000000000000000000000000000000000000") {
            const consumerInfo = await getParticipantInfo(consumer)
            history.push({
              participant: consumer,
              timestamp: Date.now() - (totalCount - i) * 86400000 + 18000000,
              action: "Delivery Confirmed",
              role: consumerInfo.role,
              name: consumerInfo.name,
            })
          }

          itemsArray.push({
            sku: Number(sku),
            name: name || `Item ${i}`,
            state: Number(state),
            originFarmer: originFarmer || "",
            processor: processor || "",
            retailer: retailer || "",
            consumer: consumer || "",
            price: priceInEth,
            history: history,
            currentOwner: currentOwner,
          })
        } catch (itemError: any) {
          console.error(`Error fetching item ${i}:`, itemError)
        }
      }

      setItems(itemsArray)

      // Load all participants from storage (not just from blockchain interactions)
      loadParticipantsFromStorage()

      console.log("Successfully fetched items:", itemsArray)
    } catch (err: any) {
      console.error("Error refreshing items:", err)

      if (err.message.includes("could not decode result data")) {
        setError("Contract method call failed. Check if the contract ABI matches your deployed contract.")
      } else if (err.message.includes("call revert exception")) {
        setError("Contract call reverted. The contract might not be deployed correctly.")
      } else {
        setError(err.message || "Failed to fetch items from contract")
      }
    } finally {
      setLoading(false)
    }
  }, [contract, getParticipantInfo, loadParticipantsFromStorage])

  useEffect(() => {
    if (contract) {
      refreshItems()
    }
  }, [contract, refreshItems])

  const testConnection = useCallback(async () => {
    if (!contract) {
      console.log("No contract to test")
      return false
    }

    try {
      console.log("Testing contract connection...")

      const address = await contract.getAddress()
      console.log("Contract address:", address)

      const count = await contract.skuCount()
      console.log("Contract skuCount:", count.toString())

      return true
    } catch (err) {
      console.error("Contract test failed:", err)
      return false
    }
  }, [contract])

  return {
    contract,
    items,
    participants,
    loading,
    refreshItems,
    loadParticipantsFromStorage,
    skuCount,
    error,
    networkInfo,
    testConnection,
    contractSetup,
    getParticipantInfo,
  }
}
