"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/layout/footer"
import { Building, Users, Calendar, DollarSign, FileText, Shield, CheckCircle, Star, ArrowRight, Briefcase, TrendingUp, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Complete HR Management for
                <span className="text-primary"> Malaysian Businesses</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Streamline your HR operations with our comprehensive system featuring built-in EPF, SOCSO, and tax compliance for Malaysian standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link href="/pricing">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern HR
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently and compliantly
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            {[
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Employee Management",
                description: "Complete employee lifecycle management with NRIC validation, department organization, and role-based access control.",
                benefit: "Save 40% on administrative time"
              },
              {
                icon: <DollarSign className="h-8 w-8 text-green-600" />,
                title: "Payroll & Compliance",
                description: "Automated payroll processing with Malaysian EPF, SOCSO, and progressive tax calculations built-in.",
                benefit: "100% compliance guaranteed"
              },
              {
                icon: <Calendar className="h-8 w-8 text-purple-600" />,
                title: "Leave Management",
                description: "Comprehensive leave tracking with Malaysian leave types, approval workflows, and balance management.",
                benefit: "Reduce leave disputes by 60%"
              },
              {
                icon: <FileText className="h-8 w-8 text-orange-600" />,
                title: "Document Management",
                description: "Secure document storage for employee files, contracts, certificates, and compliance documents.",
                benefit: "Organize all HR documents digitally"
              },
              {
                icon: <Shield className="h-8 w-8 text-red-600" />,
                title: "Role-Based Security",
                description: "Multi-level access control with Admin, HR, Manager, and Employee roles for data security and privacy.",
                benefit: "Enterprise-grade security"
              },
              {
                icon: <Building className="h-8 w-8 text-indigo-600" />,
                title: "Malaysian Compliance",
                description: "Built specifically for Malaysian businesses with local statutory requirements and compliance features.",
                benefit: "Tailored for Malaysian market"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-sm text-green-600 font-medium">{feature.benefit}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive HR solutions to support your business growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="h-12 w-12 text-blue-600" />,
                title: "HR Consulting",
                description: "Expert guidance on HR policies, compliance, and best practices tailored for Malaysian businesses.",
                benefits: ["Policy Development", "Compliance Audits", "Training Programs"]
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-green-600" />,
                title: "Payroll Outsourcing",
                description: "Full-service payroll management including EPF, SOCSO, and tax calculations with guaranteed accuracy.",
                benefits: ["Automated Processing", "Tax Compliance", "Monthly Reports"]
              },
              {
                icon: <Heart className="h-12 w-12 text-purple-600" />,
                title: "Employee Wellness",
                description: "Programs designed to enhance employee satisfaction, retention, and overall workplace wellness.",
                benefits: ["Wellness Programs", "Mental Health Support", "Work-Life Balance"]
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by businesses across Malaysia for reliable HR management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Lim",
                position: "HR Director, TechCorp Malaysia",
                content: "HRMS Malaysia has transformed our HR operations. The compliance features are outstanding and have saved us countless hours.",
                rating: 5
              },
              {
                name: "Ahmad Hassan",
                position: "CEO, Manufacturing Plus",
                content: "The payroll automation is a game-changer. No more manual calculations or compliance worries. Highly recommended!",
                rating: 5
              },
              {
                name: "Lisa Wong",
                position: "Operations Manager, Retail Chain Sdn Bhd",
                content: "Employee management has never been easier. The system is intuitive and the support team is excellent.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of Malaysian businesses already using HRMS Malaysia for efficient, compliant HR management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
