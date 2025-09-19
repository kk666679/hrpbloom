import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "RM 99",
      description: "Essential HR features for small businesses",
      features: [
        "Employee management",
        "Leave tracking",
        "Basic payroll processing",
        "Document storage",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "RM 299",
      description: "Advanced features for growing businesses",
      features: [
        "All Basic features",
        "Automated payroll & compliance",
        "Role-based security",
        "Advanced reporting",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom integrations",
        "On-site training",
        "24/7 support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business needs
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                  <p className="text-xl font-semibold text-primary">{plan.price}</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={plan.popular ? "/signup" : plan.name === "Enterprise" ? "/contact" : "/signup"}>
                      {plan.cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
