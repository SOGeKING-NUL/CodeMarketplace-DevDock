"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/connect-wallet";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
//ppap
  if (!mounted) return null;
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Buy and Sell <span className="text-primary">Code</span> on the
                Blockchain
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                A decentralized marketplace for developers to monetize their
                code and for users to purchase quality projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <ConnectWallet />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative lg:h-[500px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50" />
              <div className="relative z-10 bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6 w-full max-w-lg shadow-xl">
                <pre className="text-xs md:text-sm overflow-auto p-4 rounded bg-muted">
                  <code>{`// Purchase code from the marketplace
function purchaseCode(uint256 _listingId) {
  // Smart contract interaction
  const tx = await contract.purchaseCode(_listingId, {
    value: ethers.parseEther(price)
  });
  
  // Wait for confirmation
  await tx.wait();
  
  // Access granted!
  console.log("Code purchased successfully!");
}`}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why Choose OpenCode?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground max-w-[800px] mx-auto"
            >
              A secure, transparent, and efficient way to buy and sell code.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Code</h3>
              <p className="text-muted-foreground">
                Browse through verified projects with deployed demos and GitHub
                repositories.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Transactions</h3>
              <p className="text-muted-foreground">
                Purchase code with cryptocurrency in a single transaction, no
                middlemen involved.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Blockchain Security
              </h3>
              <p className="text-muted-foreground">
                All transactions and ownership records are secured by blockchain
                technology.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-3xl p-8 md:p-12 shadow-lg border border-border"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Share Your Code?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                List your projects on OpenCode and start earning
                cryptocurrency for your work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/create-listing">Create Listing</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
