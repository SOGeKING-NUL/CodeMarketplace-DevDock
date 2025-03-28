import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 md:px-6 py-8 md:py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">CM</span>
              </div>
              <span className="font-bold text-xl">OpenCode</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A decentralized marketplace for developers to monetize their code and for users to purchase quality
              projects.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/create-listing" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Code
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
  <h3 className="font-semibold text-lg mb-4">Connect</h3>
  <div className="flex space-x-4">
  <Link href="https://linktr.ee/thisisunit13" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
    <span className="text-green-500 hover:text-green-700 transition-colors">
      Visit Linktree
    </span>
  </Link>
</div>

</div>

        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OpenCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

