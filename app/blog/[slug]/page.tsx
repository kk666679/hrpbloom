import Link from "next/link"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  content: string
  date: string
  author: string
}

// Mock data - in a real app, this would come from a CMS or database
const getPost = (slug: string): BlogPost | null => {
  const posts: BlogPost[] = [
    {
      slug: "streamlining-hr-operations",
      title: "Streamlining HR Operations with Technology",
      content: `
        <p>In today's fast-paced business environment, HR departments are under increasing pressure to do more with less. Technology has become an essential tool for streamlining HR operations and improving efficiency.</p>

        <h2>The Challenges of Manual HR Processes</h2>
        <p>Traditional HR management often involves numerous manual processes that are time-consuming and prone to errors. From employee onboarding to payroll processing, these manual tasks can consume significant resources and lead to compliance issues.</p>

        <h2>How Technology Can Help</h2>
        <p>Modern HR technology solutions offer comprehensive tools that automate routine tasks, ensure compliance, and provide valuable insights into workforce management.</p>

        <h3>Key Benefits:</h3>
        <ul>
          <li>Reduced administrative workload</li>
          <li>Improved accuracy and compliance</li>
          <li>Better data-driven decision making</li>
          <li>Enhanced employee experience</li>
        </ul>

        <h2>Choosing the Right HR Technology</h2>
        <p>When selecting HR technology, it's important to consider your organization's specific needs, scalability, and integration capabilities with existing systems.</p>

        <p>HRMS Malaysia offers a comprehensive solution designed specifically for Malaysian businesses, with built-in compliance features and local expertise.</p>
      `,
      date: "2024-04-01",
      author: "Ahmad Razak"
    },
    {
      slug: "malaysian-labor-laws",
      title: "Understanding Malaysian Labor Laws",
      content: `
        <p>Malaysian labor laws provide a comprehensive framework for employment relationships in the country. Understanding these laws is crucial for businesses to ensure compliance and maintain good employee relations.</p>

        <h2>Key Legislation</h2>
        <p>The Employment Act 1955 is the primary legislation governing employment in Malaysia, covering aspects such as working hours, rest days, and termination procedures.</p>

        <h2>Important Considerations</h2>
        <p>Businesses must be aware of minimum wage requirements, EPF contributions, and other statutory obligations to avoid penalties and legal issues.</p>

        <h3>Essential Compliance Areas:</h3>
        <ul>
          <li>Employment contracts</li>
          <li>Working hours and overtime</li>
          <li>Leave entitlements</li>
          <li>Termination procedures</li>
          <li>Safety and health requirements</li>
        </ul>

        <p>Our HRMS system is designed to help businesses stay compliant with Malaysian labor laws through automated processes and built-in compliance checks.</p>
      `,
      date: "2024-03-15",
      author: "Siti Nurhaliza"
    },
    {
      slug: "employee-wellness-programs",
      title: "The Importance of Employee Wellness Programs",
      content: `
        <p>Employee wellness programs have become increasingly important in today's workplace. These programs not only improve employee health and satisfaction but also contribute to better business outcomes.</p>

        <h2>Benefits of Wellness Programs</h2>
        <p>Well-designed wellness initiatives can lead to reduced absenteeism, improved productivity, and higher employee retention rates.</p>

        <h2>Key Components</h2>
        <p>Effective wellness programs typically include physical health, mental health support, work-life balance initiatives, and health education.</p>

        <h3>Program Elements:</h3>
        <ul>
          <li>Health screenings and check-ups</li>
          <li>Mental health support services</li>
          <li>Fitness and wellness activities</li>
          <li>Work-life balance policies</li>
          <li>Health education and awareness</li>
        </ul>

        <p>Investing in employee wellness is not just good for employees—it's good for business. Companies that prioritize wellness often see improved morale, productivity, and overall performance.</p>
      `,
      date: "2024-02-28",
      author: "Mohd Faizal"
    }
  ]

  return posts.find(post => post.slug === slug) || null
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogPost({ params }: PageProps) {
  const post = getPost(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <PublicHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
