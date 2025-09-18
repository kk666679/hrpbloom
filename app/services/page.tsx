import Link from "next/link"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, TrendingUp, Heart, CheckCircle, ArrowRight, Users, DollarSign, Award, Clock, Star } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: <Briefcase className="h-16 w-16 text-blue-600" />,
      title: "HR Consulting",
      subtitle: "Strategic HR guidance for business growth",
      description: "Expert HR consulting services tailored for Malaysian businesses. From policy development to compliance audits, we help you build a robust HR foundation that supports your organizational goals.",
      benefits: [
        "Custom HR policy development",
        "Compliance audits and gap analysis",
        "Organizational structure optimization",
        "Performance management systems",
        "Change management support",
        "HR training and development programs"
      ],
      features: ["On-site consulting", "Remote support", "Documentation delivery", "Implementation assistance"],
      pricing: "Starting from RM 500/month",
      popular: false
    },
    {
      icon: <TrendingUp className="h-16 w-16 text-green-600" />,
      title: "Payroll Outsourcing",
      subtitle: "Complete payroll management solutions",
      description: "Full-service payroll outsourcing with guaranteed accuracy and compliance. Handle all aspects of payroll processing while we manage the complexities of EPF, SOCSO, and tax calculations.",
      benefits: [
        "Automated payroll processing",
        "EPF/SOCSO compliance",
        "Tax calculation and filing",
        "Payroll reporting and analytics",
        "Employee payslip generation",
        "Year-end tax optimization"
      ],
      features: ["Monthly processing", "Compliance updates", "24/7 support", "Audit-ready reports"],
      pricing: "RM 50/employee/month",
      popular: true
    },
    {
      icon: <Heart className="h-16 w-16 text-purple-600" />,
      title: "Employee Wellness",
      subtitle: "Enhancing employee satisfaction and retention",
      description: "Comprehensive employee wellness programs designed to boost morale, reduce turnover, and create a positive workplace culture. From mental health support to work-life balance initiatives.",
      benefits: [
        "Mental health and wellness programs",
        "Work-life balance initiatives",
        "Employee engagement surveys",
        "Recognition and rewards systems",
        "Stress management workshops",
        "Health and fitness programs"
      ],
      features: ["Custom program design", "Employee assessments", "Workshop facilitation", "Progress tracking"],
      pricing: "Custom pricing",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Professional HR Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Comprehensive HR solutions to support your business growth and employee success
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12">
            {services.map((service, index) => (
              <Card key={index} className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                {service.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2">
                    <Star className="inline h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                )}
                <div className="lg:flex">
                  <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center">
                    {service.icon}
                  </div>
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-3xl mb-2">{service.title}</CardTitle>
                        <p className="text-lg text-primary font-medium">{service.subtitle}</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {service.pricing}
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{service.description}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {service.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our expert HR services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-12 w-12 text-blue-600" />,
                title: "Expert Team",
                description: "Certified HR professionals with deep Malaysian market expertise and international best practices."
              },
              {
                icon: <Award className="h-12 w-12 text-green-600" />,
                title: "Proven Results",
                description: "Track record of successful implementations across various industries with measurable outcomes."
              },
              {
                icon: <Clock className="h-12 w-12 text-purple-600" />,
                title: "Fast Implementation",
                description: "Quick deployment and onboarding process to get you up and running in minimal time."
              }
            ].map((reason, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {reason.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{reason.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, effective approach to delivering exceptional HR services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Consultation", description: "We assess your needs and goals" },
              { step: "2", title: "Planning", description: "Custom solution design and roadmap" },
              { step: "3", title: "Implementation", description: "Seamless deployment and training" },
              { step: "4", title: "Support", description: "Ongoing optimization and assistance" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
              </div>
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
            Let's discuss how our services can help your business thrive. Get a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="tel:+6 012-314 3082">Call Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
