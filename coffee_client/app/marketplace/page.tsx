"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { contractABI } from "@/lib/contract-abi"
import { contractAddress } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Github, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const address = contractAddress

interface Listing {
  id: number
  seller: string
  title: string
  description: string
  deployedProjectUrl: string
  githubRepoLink: string
  price: string
  isActive: boolean
}

const CodeListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const fetchListings = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const contract = new ethers.Contract(address, contractABI, provider)

      const listingCounter = await contract.listingCounter()

      const allListings: Listing[] = []
      for (let i = 1; i <= listingCounter; i++) {
        const listing = await contract.listings(i)

        if (listing.isActive) {
          allListings.push({
            id: Number(listing.id),
            seller: listing.seller,
            title: listing.title,
            description: listing.description,
            deployedProjectUrl: listing.deployedProjectUrl,
            githubRepoLink: listing.githubRepoLink,
            price: ethers.formatEther(listing.price),
            isActive: listing.isActive,
          })
        }
      }
      setListings(allListings)
    } catch (error) {
      console.error("Error fetching listings:", error)
      setError("Failed to fetch listings. Please make sure your wallet is connected and try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchListings(true)
  }

  // Truncate ethereum address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Use effect to fetch listings when component mounts
  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Code Listings</h1>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading || refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No listings available</h3>
          <p className="text-muted-foreground">Check back later or refresh to see new listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{listing.title}</CardTitle>
                  <Badge variant="secondary">{listing.price} ETH</Badge>
                </div>
                <CardDescription className="text-sm">By {truncateAddress(listing.seller)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">{listing.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-4">
                <div className="flex gap-2 w-full">
                  <Button asChild variant="outline" className="flex-1">
                    <a href={listing.deployedProjectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                </div>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CodeListings

