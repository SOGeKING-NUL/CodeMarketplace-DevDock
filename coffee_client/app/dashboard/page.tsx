"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ethers } from "ethers"
import { Edit, ExternalLink, ShoppingBag, Code, AlertCircle, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { contractABI } from "@/lib/contract-abi"

// Contract address would be provided by the user
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

type Listing = {
  id: number
  seller: string
  title: string
  description: string
  deployedProjectUrl: string
  githubRepoLink?: string
  price: string
  isActive: boolean
}

export default function DashboardPage() {
  const [account, setAccount] = useState<string | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [purchasedListings, setPurchasedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const { ethereum } = window as any
        if (!ethereum) {
          setError("Please install MetaMask to view your dashboard")
          setLoading(false)
          return
        }

        const accounts = await ethereum.request({ method: "eth_accounts" })
        if (accounts.length === 0) {
          setError("Please connect your wallet to view your dashboard")
          setLoading(false)
          return
        }

        setAccount(accounts[0])

        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()

        const codeMarketplace = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
        setContract(codeMarketplace)

        fetchListings(codeMarketplace, accounts[0])
      } catch (error) {
        console.error("Error initializing provider:", error)
        setLoading(false)
        // For demo purposes, show mock data if contract interaction fails
        setMockData()
      }
    }

    initializeProvider()
  }, [])

  const fetchListings = async (contractInstance: ethers.Contract, userAddress: string) => {
    try {
      const listingIds = await contractInstance.getAllListingIds()

      const listingPromises = listingIds.map(async (id: bigint) => {
        const listing = await contractInstance.getListingDetails(id)
        const hasAccess = await contractInstance.hasAccess(id, userAddress)

        let githubRepoLink
        if (hasAccess) {
          githubRepoLink = await contractInstance.getGithubRepoLink(id)
        }

        return {
          id: Number(listing[0]),
          seller: listing[1],
          title: listing[2],
          description: listing[3],
          deployedProjectUrl: listing[4],
          githubRepoLink,
          price: ethers.formatEther(listing[5]),
          isActive: listing[6],
          hasAccess,
        }
      })

      const fetchedListings = await Promise.all(listingPromises)

      setMyListings(fetchedListings.filter((listing) => listing.seller.toLowerCase() === userAddress.toLowerCase()))

      setPurchasedListings(
        fetchedListings.filter(
          (listing) => listing.seller.toLowerCase() !== userAddress.toLowerCase() && listing.hasAccess,
        ),
      )

      setLoading(false)
    } catch (error) {
      console.error("Error fetching listings:", error)
      setLoading(false)
      // For demo purposes, show mock data if contract interaction fails
      setMockData()
    }
  }

  const setMockData = () => {
    setMyListings([
      {
        id: 1,
        seller: "0x1234567890123456789012345678901234567890",
        title: "E-commerce Platform with Next.js",
        description: "A complete e-commerce solution built with Next.js, Tailwind CSS, and Stripe integration.",
        deployedProjectUrl: "https://example.com/demo1",
        githubRepoLink: "https://github.com/example/e-commerce-platform",
        price: "0.5",
        isActive: true,
      },
      {
        id: 2,
        seller: "0x1234567890123456789012345678901234567890",
        title: "NFT Marketplace Template",
        description: "A ready-to-use NFT marketplace template with minting, listing, and trading functionality.",
        deployedProjectUrl: "https://example.com/demo2",
        githubRepoLink: "https://github.com/example/nft-marketplace",
        price: "0.8",
        isActive: false,
      },
    ])

    setPurchasedListings([
      {
        id: 3,
        seller: "0x2345678901234567890123456789012345678901",
        title: "DeFi Dashboard",
        description: "A comprehensive DeFi dashboard for tracking investments, yields, and portfolio performance.",
        deployedProjectUrl: "https://example.com/demo3",
        githubRepoLink: "https://github.com/example/defi-dashboard",
        price: "0.65",
        isActive: true,
      },
    ])
  }

  const toggleListingStatus = async (listingId: number, currentStatus: boolean) => {
    if (!contract) return

    try {
      const tx = await contract.updateListing(listingId, !currentStatus, 0)
      await tx.wait()

      setMyListings((prev) =>
        prev.map((listing) => (listing.id === listingId ? { ...listing, isActive: !currentStatus } : listing)),
      )
    } catch (error) {
      console.error("Error toggling listing status:", error)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-8" />

          <Skeleton className="h-12 w-64 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="py-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <div className="max-w-md mx-auto text-center">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings and view your purchased code.</p>
        </div>

        <Tabs defaultValue="my-listings" className="mb-8">
          <TabsList>
            <TabsTrigger value="my-listings" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Purchased Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-listings">
            {myListings.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {myListings.map((listing) => (
                  <motion.div key={listing.id} variants={fadeIn} transition={{ duration: 0.5 }}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant={listing.isActive ? "default" : "secondary"}>
                            {listing.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <span>{listing.price} ETH</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{listing.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.deployedProjectUrl && (
                            <Button asChild variant="outline" size="sm" className="gap-1">
                              <a href={listing.deployedProjectUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Demo
                              </a>
                            </Button>
                          )}
                          <Button asChild variant="outline" size="sm" className="gap-1">
                            <a href={listing.githubRepoLink} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3" />
                              Repo
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant={listing.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleListingStatus(listing.id, listing.isActive)}
                        >
                          {listing.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <Link href={`/edit-listing/${listing.id}`}>
                            <Edit className="h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
                <p className="text-muted-foreground mb-6">You haven't created any listings yet.</p>
                <Button asChild>
                  <Link href="/create-listing">Create a Listing</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchased">
            {purchasedListings.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {purchasedListings.map((listing) => (
                  <motion.div key={listing.id} variants={fadeIn} transition={{ duration: 0.5 }}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                        <CardDescription>Purchased for {listing.price} ETH</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{listing.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.deployedProjectUrl && (
                            <Button asChild variant="outline" size="sm" className="gap-1">
                              <a href={listing.deployedProjectUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Demo
                              </a>
                            </Button>
                          )}
                          <Button asChild variant="outline" size="sm" className="gap-1">
                            <a href={listing.githubRepoLink} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3" />
                              Repository
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/marketplace/${listing.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Purchases Found</h3>
                <p className="text-muted-foreground mb-6">You haven't purchased any code yet.</p>
                <Button asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

