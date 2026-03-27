import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Terms of Service | RailJee',
  description: 'Terms of Service for RailJee, the bilingual departmental promotional exam preparation platform for Indian Railway employees.',
};

export default async function TermsOfServicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-[#faf9f7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-700">Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Terms of Service</h1>
          <p className="text-stone-500 text-sm">Last updated: March 6, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10 text-stone-700 text-sm sm:text-base leading-relaxed">

            {/* Intro banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 sm:p-6">
              <p className="text-stone-700">
                Welcome to <strong className="text-stone-900">RailJee</strong>. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>
            </div>

            <Section title="1. Acceptance of Terms">
              <p>
                By creating an account or using RailJee in any way, you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be legally bound by them. RailJee is designed for Indian Railway employees preparing for departmental promotional examinations. If you do not agree to these Terms, please do not use the platform.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>RailJee is an online preparation platform built exclusively for Indian Railway departmental promotional examinations. The platform provides:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Practice tests and mock exams based on authentic departmental promotional exam papers across Civil, Mechanical, Electrical, Commercial, Personnel, Operating, and S&amp;T</li>
                <li>Department specific study materials and authentic previous year papers with zone and year metadata</li>
                <li>Performance analytics and a personal statistics dashboard</li>
                <li>Bilingual content in both Hindi and English</li>
              </ul>
              <p className="mt-3">
                RailJee is not affiliated with Indian Railways, the Railway Board, or any government body. The platform is an independent preparation resource. We reserve the right to modify, suspend, or discontinue any part of the service at any time, with or without notice.
              </p>
            </Section>

            <Section title="3. User Accounts">
              <ul className="list-disc pl-5 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
                <li>You must notify us immediately at <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a> if you suspect any unauthorized use of your account.</li>
                <li>Each individual may maintain only one account. Creating multiple accounts for the same person is not permitted.</li>
                <li>You must provide accurate and complete information when registering. Providing false information may result in account termination.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </Section>

            <Section title="4. Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Copy, distribute, reproduce, or republish exam questions, answers, or any content from RailJee without prior written permission.</li>
                <li>Use automated tools, bots, crawlers, or scripts to access, scrape, or harvest data from the platform.</li>
                <li>Attempt to reverse engineer, decompile, disassemble, or tamper with any part of the platform.</li>
                <li>Share your account credentials with any other person.</li>
                <li>Use the platform for any commercial purpose, including selling access or content derived from RailJee.</li>
                <li>Use the platform for any unlawful purpose or in violation of applicable laws.</li>
                <li>Interfere with the proper functioning of the platform or degrade the experience for other users.</li>
                <li>Upload or transmit viruses, malware, or any harmful or disruptive code.</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with any organization.</li>
              </ul>
            </Section>

            <Section title="5. Intellectual Property">
              <p>
                All content on RailJee, including but not limited to exam questions, answers, study materials, graphics, logos, interface design, and underlying software, is owned by or licensed to RailJee and is protected under applicable Indian intellectual property laws.
              </p>
              <p className="mt-3">
                You are granted a limited, personal, non-exclusive, non-transferable, revocable license to access and use the platform solely for your own individual exam preparation. This license does not include any right to reproduce, distribute, modify, publicly display, or create derivative works from any content on the platform.
              </p>
              <p className="mt-3">
                Any unauthorized use of RailJee content will result in immediate termination of your access and may result in legal action.
              </p>
            </Section>

            <Section title="6. Exam Content and Accuracy">
              <p>
                RailJee curates and organizes content based on authentic departmental promotional exam papers from various Indian Railway zones. While we take care to ensure accuracy, we do not guarantee that all content is error free, complete, or current at all times.
              </p>
              <p className="mt-3">
                The platform is intended as a supplementary preparation resource only. For official and authoritative information regarding departmental promotional examinations, always refer to official communications from Indian Railways, your Railway Zone, or the Railway Board. RailJee is not responsible for any discrepancy between platform content and official examination material.
              </p>
              <p className="mt-3">
                If you identify an error in any question or answer, please report it to us at <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a> so we can review and correct it promptly.
              </p>
            </Section>

            <Section title="7. Subscriptions and Payments">
              <p>
                Certain features of RailJee may be offered under a paid subscription plan. Where applicable, the following terms apply:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Subscription fees are stated clearly at the time of purchase and are charged in Indian Rupees (INR).</li>
                <li>Payments are processed through secure third party payment providers. RailJee does not store your payment card details.</li>
                <li>Subscriptions are non-transferable and may not be shared across accounts.</li>
                <li>We reserve the right to change subscription pricing with advance notice to existing subscribers.</li>
                <li>Refund requests must be submitted within 7 days of payment to <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a> and will be reviewed on a case by case basis.</li>
              </ul>
            </Section>

            <Section title="8. Disclaimer of Warranties">
              <p>
                RailJee is provided on an <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis, without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>The service will be uninterrupted, timely, secure, or error free.</li>
                <li>Any specific examination result will be achieved through use of this platform.</li>
                <li>The content is complete, accurate, or current at all times.</li>
                <li>The platform will meet your specific preparation requirements.</li>
              </ul>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, RailJee, its founders, team members, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the platform. This includes but is not limited to loss of data, loss of exam opportunity, or failure to succeed in any departmental examination.
              </p>
              <p className="mt-3">
                In no event shall RailJee&apos;s total liability to you exceed the amount paid by you, if any, for access to the platform in the three months preceding the claim.
              </p>
            </Section>

            <Section title="10. Third Party Links and Services">
              <p>
                The platform may contain links to third party websites, resources, or services that are not owned or controlled by RailJee. These links are provided for convenience only. RailJee has no control over, and accepts no responsibility for, the content, privacy practices, or terms of any third party sites. We encourage you to review the terms and privacy policies of any third party sites you visit.
              </p>
            </Section>

            <Section title="11. Privacy and Data">
              <p>
                Your use of RailJee is also governed by our{' '}
                <Link href="/privacy-policy" className="text-orange-600 hover:underline">Privacy Policy</Link>,
                which is incorporated into these Terms by reference. By using the platform, you consent to the collection and use of your information as described in the Privacy Policy.
              </p>
              <p className="mt-3">
                Exam attempt data and performance statistics are stored locally in your browser and on our servers to power your stats dashboard. You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>.
              </p>
            </Section>

            <Section title="12. Termination">
              <p>
                We may suspend or terminate your access to RailJee at our sole discretion, without prior notice, if we have reason to believe you have violated these Terms or engaged in conduct that is harmful to the platform, other users, or third parties. Upon termination, your right to access and use the platform ceases immediately.
              </p>
              <p className="mt-3">
                You may request account deletion at any time by emailing <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>. We will process your request within 48 hours.
              </p>
            </Section>

            <Section title="13. Changes to These Terms">
              <p>
                We reserve the right to update or modify these Terms at any time. When we do, we will revise the &ldquo;Last updated&rdquo; date at the top of this page. For significant changes, we may also notify registered users by email or via a notice on the platform.
              </p>
              <p className="mt-3">
                Your continued use of RailJee after any changes are posted constitutes your acceptance of the revised Terms. If you do not agree to the updated Terms, you should stop using the platform and may request account deletion.
              </p>
            </Section>

            <Section title="14. Governing Law and Dispute Resolution">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any dispute, claim, or controversy arising out of or relating to these Terms or your use of RailJee shall first be attempted to be resolved through good faith negotiation by contacting us at <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>.
              </p>
              <p className="mt-3">
                If the dispute cannot be resolved informally, it shall be subject to the exclusive jurisdiction of the competent courts located in India.
              </p>
            </Section>

            <Section title="15. Contact Us">
              <p>If you have any questions, concerns, or requests regarding these Terms of Service, please reach out to us:</p>
              <div className="mt-4 bg-stone-50 border border-stone-100 rounded-xl p-5">
                <p className="font-semibold text-stone-900 mb-1">RailJee</p>
                <p className="text-stone-600 text-sm">
                  Email:{' '}
                  <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">
                    railjee.official@gmail.com
                  </a>
                </p>
                <p className="text-stone-500 text-xs mt-2">We aim to respond to all queries within 48 hours.</p>
              </div>
            </Section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
