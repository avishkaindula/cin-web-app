import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Leaf,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Globe,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Climate Intelligence Network
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Contact
            </Link>
            <ThemeToggle />
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Gamify Climate Action,{" "}
              <span className="text-green-600">Make Real Impact</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the best global network where organizations create meaningful
              climate tasks, users earn points for environmental action, and
              together we build a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/organization-signup">Join as Organization</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Empowering Climate Action Through Technology
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>For Organizations</CardTitle>
                <CardDescription>
                  Create meaningful climate tasks and engage communities in
                  environmental action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Design custom climate challenges</li>
                  <li>• Recruit and manage members</li>
                  <li>• Offer rewards and recognition</li>
                  <li>• Track community impact</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Users</CardTitle>
                <CardDescription>
                  Complete tasks, earn points, and make a measurable difference
                  in climate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Join climate-focused challenges</li>
                  <li>• Submit photos and data</li>
                  <li>• Earn points and badges</li>
                  <li>• Compete on global leaderboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle>For Admins</CardTitle>
                <CardDescription>
                  Powerful tools to manage, validate, and analyze climate data
                  and community engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Validate user submissions</li>
                  <li>• Manage organizations</li>
                  <li>• Analyze impact metrics</li>
                  <li>• Oversee platform health</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Create Tasks
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Organizations design climate-focused tasks and challenges
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Complete & Submit
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Users complete tasks and submit photos, surveys, and
                observations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Validate & Reward
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Admins validate submissions and award points to users
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 dark:bg-amber-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Global leaderboards track collective climate impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Global Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                12,847
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Tasks Completed
              </div>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                156
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Active Organizations
              </div>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                2.4M
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Points Awarded
              </div>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                89,432
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Data Points Collected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="font-bold">Climate Intelligence Network</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering global climate action through gamification and
                community engagement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/organization-signup"
                    className="hover:text-white"
                  >
                    Join as Organization
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@climate.network</li>
                <li>+94 (71) 123-4567</li>
                <li>Colombo, Sri Lanka</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 Climate Intelligence Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
