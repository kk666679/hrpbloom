import Link from "next/link"
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company Info */}
          <div className="space-y-8">
          <div className="flex items-center">
            <img
              src="https://oq1gkkfo4q0hj5xi.public.blob.vercel-storage.com/images/Sleek%20Flat%20Design%20Logo%20in%20Blue%20and%20Green_20250918_023037_0000.svg"
              alt="HRPBLooM Logo"
              className="h-8 w-8"
            />
          </div>
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
            Complete Human Resource Management System designed for Malaysian businesses with built-in EPF, SOCSO, and tax compliance.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              admin@hrpbloom.com
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 mr-2" />
              +60 12-314 3082
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              Kuala Lumpur, Malaysia
            </div>
          </div>
        </div>

          {/* Navigation */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm leading-5 text-gray-600 dark:text-gray-300">
            &copy; 2025 HRPBLooM Malaysia. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {navigation.social.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
