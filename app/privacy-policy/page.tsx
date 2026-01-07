import { Header } from "@/components/header"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Nano Banana ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
              This Privacy Policy describes how we collect, use, and share your personal information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Account information (email address, name)</li>
              <li>Payment information (processed securely by our payment processors)</li>
              <li>User content (images and prompts you upload or generate)</li>
              <li>Communication data (when you contact support)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Providing and maintaining our Service</li>
              <li>Processing your payments</li>
              <li>Improving and personalizing user experience</li>
              <li> communicating with you about updates and support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. 
              However, please note that no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 font-semibold">
              Email: <a href="mailto:nanobanana@lghuang.xyz" className="text-primary hover:underline">nanobanana@lghuang.xyz</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

