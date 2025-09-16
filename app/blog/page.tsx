import Link from "next/link"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"

const posts = [
  {
    slug: "streamlining-hr-operations",
    title: "Streamlining HR Operations with Technology",
    excerpt: "Discover how modern HR technology can simplify your HR processes and improve compliance.",
    date: "2024-04-01",
    author: "Ahmad Razak"
  },
  {
    slug: "malaysian-labor-laws",
    title: "Understanding Malaysian Labor Laws",
    excerpt: "A comprehensive guide to key labor laws every Malaysian business should know.",
    date: "2024-03-15",
    author: "Siti Nurhaliza"
  },
  {
    slug: "employee-wellness-programs",
    title: "The Importance of Employee Wellness Programs",
    excerpt: "How wellness programs can boost employee satisfaction and productivity.",
    date: "2024-02-28",
    author: "Mohd Faizal"
  }
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Insights, news, and tips on HR management and Malaysian business compliance
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </section>

      {/* Blog Posts List */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
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
