import Link from "next/link"

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" aria-label="Go to homepage" className="flex items-center">
              <img
                src="https://oq1gkkfo4q0hj5xi.public.blob.vercel-storage.com/images/Sleek%20Flat%20Design%20Logo%20in%20Blue%20and%20Green_20250918_023037_0000.svg"
                alt="HRPBLooM Logo"
                className="h-8 w-8"
              />
            </Link>
            <Link
              href="/"
              className="text-gray-900 dark:text-white hover:text-primary transition-colors font-medium"
              aria-label="Go to homepage"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
