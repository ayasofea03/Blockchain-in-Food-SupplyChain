"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building, Truck, ShoppingCart, MapPin, Calendar, Copy, Eye, Search, Filter, Users } from "lucide-react"

interface Participant {
  address: string
  role: string
  name: string
  businessName?: string
  registeredAt: string
  email?: string
  phone?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
}

interface ParticipantsTrackerProps {
  participants: Participant[]
  onViewParticipant: (participant: Participant) => void
}

export function ParticipantsTracker({ participants, onViewParticipant }: ParticipantsTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return <User className="h-4 w-4 text-green-600" />
      case "processor":
        return <Building className="h-4 w-4 text-blue-600" />
      case "retailer":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "consumer":
        return <ShoppingCart className="h-4 w-4 text-orange-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "farmer":
        return "bg-green-100 text-green-800"
      case "processor":
        return "bg-blue-100 text-blue-800"
      case "retailer":
        return "bg-purple-100 text-purple-800"
      case "consumer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Address copied to clipboard!")
  }

  // Filter participants
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.businessName && participant.businessName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = roleFilter === "all" || participant.role.toLowerCase() === roleFilter

    const matchesLocation =
      locationFilter === "all" ||
      (participant.location?.state && participant.location.state.toLowerCase().includes(locationFilter.toLowerCase()))

    return matchesSearch && matchesRole && matchesLocation
  })

  // Get statistics
  const roleStats = participants.reduce(
    (acc, participant) => {
      const role = participant.role.toLowerCase()
      acc[role] = (acc[role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Get unique locations
  const uniqueLocations = Array.from(new Set(participants.map((p) => p.location?.state).filter(Boolean))).sort()

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{roleStats.farmer || 0}</p>
            <p className="text-sm text-gray-600">Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{roleStats.processor || 0}</p>
            <p className="text-sm text-gray-600">Processors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{roleStats.retailer || 0}</p>
            <p className="text-sm text-gray-600">Retailers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{roleStats.consumer || 0}</p>
            <p className="text-sm text-gray-600">Consumers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, address, or business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="farmer">Farmers</SelectItem>
                <SelectItem value="processor">Processors</SelectItem>
                <SelectItem value="retailer">Retailers</SelectItem>
                <SelectItem value="consumer">Consumers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                Showing {filteredParticipants.length} of {participants.length} participants
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Participants</CardTitle>
          <CardDescription>All registered participants in the food supply chain network</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {participants.length === 0 ? "No participants found" : "No participants match your filters"}
              </p>
              <p className="text-sm text-gray-500">
                {participants.length === 0
                  ? "Participants will appear here as they interact with items"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={getRoleColor(participant.role)}>
                          {getRoleIcon(participant.role)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                          <Badge className={getRoleColor(participant.role)}>
                            {getRoleIcon(participant.role)}
                            <span className="ml-1 capitalize">{participant.role}</span>
                          </Badge>
                        </div>
                        {participant.businessName && (
                          <p className="text-sm text-gray-600 mb-1">{participant.businessName}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="font-mono">{`${participant.address.slice(0, 6)}...${participant.address.slice(-4)}`}</span>
                          </div>
                          {participant.location?.state && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {participant.location.state}, {participant.location.country}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(participant.registeredAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {participant.email && <p className="text-sm text-gray-500 mt-1">📧 {participant.email}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(participant.address)}
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onViewParticipant(participant)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
