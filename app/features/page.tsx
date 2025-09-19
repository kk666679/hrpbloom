import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Calendar, FileText, Shield, Building, CheckCircle, ArrowRight, Zap, BarChart3, Lock, Globe } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Employee Management",
      description: "Complete employee lifecycle management from onboarding to offboarding.",
      benefits: [
        "NRIC validation and verification",
        "Department and role organization",
        "Employee profile management",
        "Bulk import/export capabilities",
        "Custom fields and metadata"
      ],
      visual: "/placeholder.jpg",
      category: "Core HR"
    },
    {
      icon: <DollarSign className="h-12 w-12 text-green-600" />,
      title: "Payroll & Compliance",
      description: "Automated payroll processing with full Malaysian compliance built-in.",
      benefits: [
        "EPF and SOCSO calculations",
        "Progressive tax computation",
        "Overtime and allowance management",
        "Payroll reporting and analytics",
        "Multi-currency support"
      ],
      visual: "/placeholder.jpg",
      category: "Finance"
    },
    {
      icon: <Calendar className="h-12 w-12 text-purple-600" />,
      title: "Leave Management",
      description: "Comprehensive leave tracking with approval workflows and balance management.",
      benefits: [
        "Malaysian leave types support",
        "Automated balance calculations",
        "Approval workflow automation",
        "Leave calendar integration",
        "Annual leave carry-forward"
      ],
      visual: "/placeholder.jpg",
      category: "Time & Attendance"
    },
    {
      icon: <FileText className="h-12 w-12 text-orange-600" />,
      title: "Document Management",
      description: "Secure document storage and management for all employee-related files.",
      benefits: [
        "Encrypted file storage",
        "Document versioning",
        "Access control and permissions",
        "Bulk document operations",
        "Integration with employee profiles"
      ],
      visual: "/placeholder.jpg",
      category: "Documents"
    },
    {
      icon: <Shield className="h-12 w-12 text-red-600" />,
      title: "Role-Based Security",
      description: "Multi-level access control ensuring data security and privacy compliance.",
      benefits: [
        "Admin, HR, Manager, Employee roles",
        "Granular permissions",
        "Audit logging",
        "Data encryption",
        "GDPR compliance"
      ],
      visual: "/placeholder.jpg",
      category: "Security"
    },
    {
      icon: <Building className="h-12 w-12 text-indigo-600" />,
      title: "Malaysian Compliance",
      description: "Built specifically for Malaysian businesses with local statutory requirements.",
      benefits: [
        "EPF/SOCSO integration",
        "Tax compliance automation",
        "Employment Act adherence",
        "Local reporting standards",
        "Regulatory updates"
      ],
      visual: "/placeholder.jpg",
      category: "Compliance"
    }
  ]

  const categories = ["All", "Core HR", "Finance", "Time & Attendance", "Documents", "Security", "Compliance"]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for Modern HR
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover how our comprehensive feature set can transform your HR operations
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{feature.category}</Badge>
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle className="text-2xl mb-4">{feature.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" size="sm">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Features?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with Malaysian businesses in mind, our features deliver real value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Data-Driven Insights",
                description: "Get actionable insights from your HR data with comprehensive reporting and analytics."
              },
              {
                icon: <Lock className="h-8 w-8 text-green-600" />,
                title: "Enterprise Security",
                description: "Bank-level security with end-to-end encryption and compliance with international standards."
              },
              {
                icon: <Globe className="h-8 w-8 text-purple-600" />,
                title: "Local Expertise",
                description: "Deep understanding of Malaysian employment laws and business practices built into every feature."
              }
            ].map((highlight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{highlight.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{highlight.description}</p>
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
            Ready to Experience These Features?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start your free trial today and see how our features can transform your HR operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/pricing">
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
