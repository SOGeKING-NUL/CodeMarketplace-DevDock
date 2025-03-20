"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import { ExternalLink, Github, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { contractABI } from "@/lib/contract-abi"
import { contractAddress } from "@/lib/utils"

const address = contractAddress 

type Listing = {
  id: number
  seller: string
  title: string
  description: string
  deployedProjectUrl: string
  price: string
  isActive: boolean
  githubRepoLink?: string
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const { ethereum } = window as any
        if (ethereum) {
          const ethersProvider = new ethers.BrowserProvider(ethereum)

          const accounts = await ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }

          const signer = await ethersProvider.getSigner()
          const codeMarketplace = new ethers.Contract(address, contractABI, signer)
          setContract(codeMarketplace)

          fetchListing(codeMarketplace)
          checkIfPurchased(codeMarketplace, accounts[0])
        } else {
          // If no ethereum object, use a read-only provider
          const readOnlyProvider = new ethers.JsonRpcProvider("https://ethereum-goerli.publicnode.com")

          const codeMarketplace = new ethers.Contract(address, contractABI, readOnlyProvider)
          setContract(codeMarketplace)

          fetchListing(codeMarketplace)
        }
      } catch (error) {
        console.error("Error initializing provider:", error)
        setLoading(false)
        // For demo purposes, show mock data if contract interaction fails
        setMockListing()
      }
    }

    initializeProvider()
  }, [params.id])

  const fetchListing = async (contractInstance: ethers.Contract) => {
    try {
      const listingData = await contractInstance.getListingDetails(params.id)

      setListing({
        id: Number(listingData[0]),
        seller: listingData[1],
        title: listingData[2],
        description: listingData[3],
        deployedProjectUrl: listingData[4],
        price: ethers.formatEther(listingData[5]),
        isActive: listingData[6],
      })

      setLoading(false)
    } catch (error) {
      console.error("Error fetching listing:", error)
      setLoading(false)
      // For demo purposes, show mock data if contract interaction fails
      setMockListing()
    }
  }

  const checkIfPurchased = async (contractInstance: ethers.Contract, userAddress: string) => {
    if (!userAddress) return

    try {
      const hasAccess = await contractInstance.hasAccess(params.id, userAddress)
      setPurchased(hasAccess)

      if (hasAccess) {
        const githubLink = await contractInstance.getGithubRepoLink(params.id)
        setListing((prev) => (prev ? { ...prev, githubRepoLink: githubLink } : null))
      }
    } catch (error) {
      console.error("Error checking purchase status:", error)
    }
  }

  const setMockListing = () => {
    setListing({
      id: Number(params.id),
      seller: "0x1234567890123456789012345678901234567890",
      title: "E-commerce Platform with Next.js",
      description:
        "A complete e-commerce solution built with Next.js, Tailwind CSS, and Stripe integration. This project includes user authentication, product catalog, shopping cart, checkout process with Stripe, order management, and admin dashboard. The codebase is well-structured, fully responsive, and follows best practices for performance and SEO.",
      deployedProjectUrl: "https://example.com/demo1",
      price: "0.5",
      isActive: true,
      githubRepoLink: purchased ? "https://github.com/example/e-commerce-platform" : undefined,
    })
  }

  const purchaseCode = async () => {
    if (!contract || !listing) return

    try {
      setPurchasing(true)
      setError(null)

      const { ethereum } = window as any
      if (!ethereum) {
        setError("Please install MetaMask to make purchases")
        setPurchasing(false)
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])

      const tx = await contract.purchaseCode(listing.id, {
        value: ethers.parseEther(listing.price),
      })

      await tx.wait()

      setPurchased(true)
      const githubLink = await contract.getGithubRepoLink(listing.id)
      setListing((prev) => (prev ? { ...prev, githubRepoLink: githubLink } : null))

      setPurchasing(false)
    } catch (error: any) {
      console.error("Error purchasing code:", error)
      setError(error.message || "Error purchasing code. Please try again.")
      setPurchasing(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-8" />

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-2" />
              <Skeleton className="h-4 w-3/6 mb-8" />
            </div>

            <div>
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-8">The listing you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <Badge variant="outline" className="mr-4">
              {listing.price} ETH
            </Badge>
            <span>
              By {listing.seller.substring(0, 6)}...{listing.seller.substring(listing.seller.length - 4)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose dark:prose-invert max-w-none mb-8">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {purchased && (
              <Alert className="mb-6 border-green-500">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Purchase Successful</AlertTitle>
                <AlertDescription>
                  You now have access to this code. You can access the GitHub repository below.
                </AlertDescription>
              </Alert>
            )}

            {purchased && listing.githubRepoLink && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">GitHub Repository</h3>
                <Button asChild variant="outline" className="gap-2">
                  <a href={listing.githubRepoLink} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    View Repository
                  </a>
                </Button>
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Preview</h3>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <a href={listing.deployedProjectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Price</h3>
                  <p className="text-2xl font-bold">{listing.price} ETH</p>
                </div>

                {!purchased ? (
                  <Button className="w-full" onClick={purchaseCode} disabled={purchasing || !account}>
                    {purchasing ? "Processing..." : "Purchase Code"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Already Purchased
                  </Button>
                )}

                {!account && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Connect your wallet to make a purchase
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

