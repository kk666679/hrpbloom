import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Target, Eye, Users, Award, Heart, Shield } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About HRMS Malaysia
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Empowering Malaysian businesses with innovative HR solutions since 2018
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-12 w-12 text-blue-600 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  To simplify HR management for Malaysian businesses by providing comprehensive, compliant, and user-friendly solutions that enhance productivity and employee satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="h-12 w-12 text-green-600 mr-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  To be the leading HR technology provider in Malaysia, setting the standard for digital HR transformation and compliance excellence across all industries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Our Story
            </h2>
            <div className="text-left space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              <p>
                Founded in 2018, HRMS Malaysia was born from the recognition that Malaysian businesses needed a comprehensive HR solution that understood local compliance requirements and cultural nuances.
              </p>
              <p>
                Our founders, a team of HR professionals and technology experts, experienced firsthand the challenges of managing HR operations in Malaysia's dynamic business environment. They saw how traditional methods were inefficient, error-prone, and often non-compliant with local regulations.
              </p>
              <p>
                This inspired us to create a platform that combines cutting-edge technology with deep understanding of Malaysian employment laws, EPF, SOCSO, and tax regulations. Today, we serve hundreds of businesses across various industries, from startups to large enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Compliance First",
                description: "We prioritize regulatory compliance in everything we build, ensuring our clients are always protected."
              },
              {
                icon: <Heart className="h-8 w-8 text-red-600" />,
                title: "People-Centric",
                description: "We believe great HR technology should enhance the employee experience and support business growth."
              },
              {
                icon: <Award className="h-8 w-8 text-yellow-600" />,
                title: "Excellence",
                description: "We strive for excellence in our products, services, and customer support, continuously improving our offerings."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The experts behind HRMS Malaysia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pn. Aziyah Salwa",
                position: "CEO & Co-Founder",
                bio: "Former HR Practioner with 30+ years experience in Malaysian employment law and HR technology.",
                image: "/placeholder-user.jpg"
              },
              {
                name: "Siti Nurhaliza",
                position: "CTO & Co-Founder",
                bio: "Technology leader with expertise in enterprise software development and compliance systems.",
                image: "/placeholder-user.jpg"
              },
              {
                name: "Mohd Faizal",
                position: "Head of Compliance",
                bio: "Certified HR professional specializing in Malaysian labor laws and statutory compliance.",
                image: "/placeholder-user.jpg"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              HRMS Malaysia by Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Businesses Served" },
              { number: "50K+", label: "Employees Managed" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
