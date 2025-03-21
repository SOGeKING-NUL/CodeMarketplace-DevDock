"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "@/lib/contract-abi";
import { contractAddress } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const address = contractAddress;

interface Listing {
  id: number;
  seller: string;
  title: string;
  description: string;
  deployedProjectUrl: string;
  githubRepoLink: string;
  price: string;
  isActive: boolean;
}

const CodeListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();

  const fetchListings = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(address, contractABI, provider);

      const listingCounter = await contract.listingCounter();

      const allListings: Listing[] = [];
      for (let i = 1; i <= listingCounter; i++) {
        const listing = await contract.listings(i);

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
          });
        }
      }
      setListings(allListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(
        "Failed to fetch listings. Please make sure your wallet is connected and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchListings(true);
  };

  // Handle purchase
  const handlePurchase = async (listingId: number, priceInEth: string) => {
    try {
      if (!(window as any).ethereum) {
        throw new Error(
          "MetaMask not found! Please install MetaMask and try again."
        );
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []); // Ensure wallet is connected
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, contractABI, signer);

      // Convert price back to wei for transaction
      const priceInWei = ethers.parseEther(priceInEth);

      // Send transaction
      const txResponse = await contract.purchaseCode(listingId, {
        value: priceInWei,
      });
      await txResponse.wait(); // Wait for transaction to be mined

      // Show success notification
      setNotification({
        type: "success",
        message: "Purchase successful! Redirecting to dashboard...",
      });

      // Redirect to dashboard's purchased code section
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error during purchase:", err);
      let errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again.";

      // Show error notification
      setNotification({ type: "error", message: errorMessage });
    }
  };

  // Truncate ethereum address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Use effect to fetch listings when component mounts
  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Code Listings</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading || refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type === "success" ? "default" : "destructive"}
          className="mb-6"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {notification.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
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
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">
            No listings available
          </h3>
          <p className="text-muted-foreground">
            Check back later or refresh to see new listings
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{listing.title}</CardTitle>
                  <Badge variant="secondary">{listing.price} ETH</Badge>
                </div>
                <CardDescription>
                  By {truncateAddress(listing.seller)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {listing.description}
                </p>
              </CardContent>
              {/* Full-width Buttons */}
              <CardFooter className="flex flex-col gap-3 pt-4">
                {/* Demo Button */}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a
                    href={`${
                      listing.deployedProjectUrl.startsWith("http")
                        ? listing.deployedProjectUrl
                        : `https://${listing.deployedProjectUrl}`
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo
                  </a>
                </Button>

                {/* Buy Now Button */}
                <Button
                  size="sm"
                  onClick={() => handlePurchase(listing.id, listing.price)}
                  className="w-full"
                >
                  BUY NOW
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeListings;
