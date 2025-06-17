import type React from "react"
import Link from "next/link"
import {
  BookOpen,
  Brain,
  Zap,
  Search,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  Briefcase,
  Database,
  GraduationCap,
  Play,
  Video,
  MessageSquare,
} from "lucide-react"

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-white/90 backdrop-blur-md border-r shadow-lg overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Documentation</h2>
      </div>
      <nav className="px-2">
        <div className="space-y-1">
          {/* Getting Started */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Getting Started</h3>
            <Link
              href="/docs"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <BookOpen className="mr-3 h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/docs/quick-start"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Zap className="mr-3 h-4 w-4" />
              Quick Start
            </Link>
            <Link
              href="/docs/installation"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Settings className="mr-3 h-4 w-4" />
              Installation
            </Link>
            <Link
              href="/docs/core-concepts"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Brain className="mr-3 h-4 w-4" />
              Core Concepts
            </Link>
          </div>

          {/* Features */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Features</h3>
            <Link
              href="/docs/note-taking"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <FileText className="mr-3 h-4 w-4" />
              Note Taking
            </Link>
            <Link
              href="/docs/ai-assistant"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Brain className="mr-3 h-4 w-4" />
              AI Assistant
            </Link>
            <Link
              href="/docs/connections"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Zap className="mr-3 h-4 w-4" />
              Connections
            </Link>
            <Link
              href="/docs/search"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Search className="mr-3 h-4 w-4" />
              Search
            </Link>
            <Link
              href="/docs/templates"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <FileText className="mr-3 h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/docs/integrations"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Settings className="mr-3 h-4 w-4" />
              Integrations
            </Link>
          </div>

          {/* Advanced */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Advanced</h3>
            <Link
              href="/docs/keyboard-shortcuts"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Zap className="mr-3 h-4 w-4" />
              Keyboard Shortcuts
            </Link>
            <Link
              href="/docs/api"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Settings className="mr-3 h-4 w-4" />
              API Reference
            </Link>
          </div>

          {/* Guides */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guides</h3>
            <Link
              href="/docs/guides"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <BookOpen className="mr-3 h-4 w-4" />
              All Guides
            </Link>
            <Link
              href="/docs/daily-journaling"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Calendar className="mr-3 h-4 w-4" />
              Daily Journaling
            </Link>
            <Link
              href="/docs/project-management"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Briefcase className="mr-3 h-4 w-4" />
              Project Management
            </Link>
            <Link
              href="/docs/research"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Search className="mr-3 h-4 w-4" />
              Research
            </Link>
            <Link
              href="/docs/knowledge-base"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Database className="mr-3 h-4 w-4" />
              Knowledge Base
            </Link>
          </div>

          {/* Learning */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Learning</h3>
            <Link
              href="/docs/learning-resources"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <GraduationCap className="mr-3 h-4 w-4" />
              Learning Resources
            </Link>
            <Link
              href="/docs/video-tutorials"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Play className="mr-3 h-4 w-4" />
              Video Tutorials
            </Link>
            <Link
              href="/docs/webinars"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <Video className="mr-3 h-4 w-4" />
              Webinars
            </Link>
          </div>

          {/* Support */}
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
            <Link
              href="/docs/troubleshooting"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              Troubleshooting
            </Link>
            <Link
              href="/docs/faq"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              FAQ
            </Link>
            <Link
              href="/docs/support"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-700"
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              Get Support
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  )
}
