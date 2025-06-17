import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Download, ExternalLink, MessageCircle } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      category: "Learning Materials",
      icon: BookOpen,
      items: [
        {
          title: "Complete User Guide",
          description: "Comprehensive guide covering all Reflect features and best practices.",
          type: "PDF Guide",
          link: "#",
        },
        {
          title: "Video Tutorial Series",
          description: "Step-by-step video tutorials for getting the most out of Reflect.",
          type: "Video Course",
          link: "#",
        },
        {
          title: "Thinking Methodologies",
          description: "Learn proven thinking frameworks and how to apply them in Reflect.",
          type: "Article Series",
          link: "#",
        },
      ],
    },
    {
      category: "Templates & Examples",
      icon: Download,
      items: [
        {
          title: "Note Templates",
          description: "Pre-built templates for different types of notes and thinking exercises.",
          type: "Template Pack",
          link: "#",
        },
        {
          title: "Project Planning Templates",
          description: "Structured templates for project planning and management.",
          type: "Template Pack",
          link: "#",
        },
        {
          title: "Research Templates",
          description: "Templates designed for academic and professional research.",
          type: "Template Pack",
          link: "#",
        },
      ],
    },
    {
      category: "Community",
      icon: Users,
      items: [
        {
          title: "Reflect Community Forum",
          description: "Connect with other users, share tips, and get help from the community.",
          type: "Forum",
          link: "#",
        },
        {
          title: "Discord Server",
          description: "Join our Discord for real-time discussions and community support.",
          type: "Chat",
          link: "#",
        },
        {
          title: "User Showcase",
          description: "See how other users are leveraging Reflect for their thinking and work.",
          type: "Gallery",
          link: "#",
        },
      ],
    },
    {
      category: "Developer Resources",
      icon: ExternalLink,
      items: [
        {
          title: "API Documentation",
          description: "Complete API reference for integrating with Reflect.",
          type: "Documentation",
          link: "#",
        },
        {
          title: "Plugin Development Guide",
          description: "Learn how to create custom plugins and extensions for Reflect.",
          type: "Guide",
          link: "#",
        },
        {
          title: "Integration Examples",
          description: "Sample code and examples for common integrations.",
          type: "Code Examples",
          link: "#",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Resources &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Support</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to master Reflect and become a better thinker. From tutorials to templates, we've got
            you covered.
          </p>
        </div>

        <div className="space-y-12">
          {resources.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center mb-6">
                <category.icon className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">{category.category}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <Card
                    key={itemIndex}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                        <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">{item.type}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 mb-4">{item.description}</CardDescription>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-purple-600 hover:border-purple-600"
                      >
                        Access Resource <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of Reflect. Choose the option that works best for
              you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-white">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Get instant help from our support team during business hours.
                </CardDescription>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-white">Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Browse our comprehensive help articles and FAQs.
                </CardDescription>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white w-full">
                  Browse Articles
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-white">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Connect with other users and get help from the community.
                </CardDescription>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white w-full">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
