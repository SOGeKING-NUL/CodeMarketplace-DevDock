"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { contractABI } from "@/lib/contract-abi"

// Contract address would be provided by the user
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

export default function CreateListingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deployedProjectUrl: "",
    githubRepoLink: "",
    price: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!formData.title.trim()) return setError("Title is required")
    if (!formData.description.trim()) return setError("Description is required")
    if (!formData.githubRepoLink.trim()) return setError("GitHub repository link is required")
    if (!formData.price.trim()) return setError("Price is required")

    try {
      const priceInEth = Number.parseFloat(formData.price)
      if (isNaN(priceInEth) || priceInEth <= 0) {
        return setError("Price must be a positive number")
      }

      setSubmitting(true)

      const { ethereum } = window as any
      if (!ethereum) {
        setError("Please install MetaMask to create a listing")
        setSubmitting(false)
        return
      }

      await ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)

      const tx = await contract.createListing(
        formData.title,
        formData.description,
        formData.deployedProjectUrl,
        formData.githubRepoLink,
        ethers.parseEther(formData.price),
      )

      await tx.wait()

      setSuccess(true)
      setSubmitting(false)

      // Redirect to marketplace after successful submission
      setTimeout(() => {
        router.push("/marketplace")
      }, 2000)
    } catch (error: any) {
      console.error("Error creating listing:", error)
      setError(error.message || "Error creating listing. Please try again.")
      setSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create a Listing</h1>
          <p className="text-muted-foreground">Share your code with the world and earn cryptocurrency.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Provide information about your code project.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your listing has been created successfully! Redirecting to marketplace...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., E-commerce Platform with Next.js"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your code project in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deployedProjectUrl">Deployed Project URL (Optional)</Label>
                <Input
                  id="deployedProjectUrl"
                  name="deployedProjectUrl"
                  placeholder="https://your-demo-site.com"
                  value={formData.deployedProjectUrl}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">Provide a link where buyers can preview your project.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubRepoLink">GitHub Repository Link</Label>
                <Input
                  id="githubRepoLink"
                  name="githubRepoLink"
                  placeholder="https://github.com/yourusername/your-repo"
                  value={formData.githubRepoLink}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This will only be visible to users who purchase your code.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (ETH)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.5"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-spin" />
                    Creating Listing...
                  </span>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

