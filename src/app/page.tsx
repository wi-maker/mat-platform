import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Wrench, BellRing, Bot } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold">MAT Platform</span>
        </div>
        <div className="space-x-2">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Intelligent Maintenance for Modern Africa
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
              MAT is your all-in-one platform for managing assets, receiving smart maintenance suggestions, and never missing a service appointment again.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/auth/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Login to Your Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Everything You Need, All in One Place</h2>
              <p className="text-gray-500 mt-2">From your car to your generator, we've got you covered.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Car className="h-10 w-10 text-orange-500" />}
                title="Asset Management"
                description="Keep a detailed record of all your valuable assets, from purchase date to service history, all in a beautiful and intuitive interface."
              />
              <FeatureCard
                icon={<Bot className="h-10 w-10 text-orange-500" />}
                title="AI Recommendations"
                description="Leverage the power of AI to get smart, proactive maintenance suggestions tailored specifically to your assets and usage patterns."
              />
              <FeatureCard
                icon={<BellRing className="h-10 w-10 text-orange-500" />}
                title="Maintenance Reminders"
                description="Set custom reminders for oil changes, filter replacements, and more. Get timely alerts so you never miss an important service date."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MAT Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">{icon}</div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}