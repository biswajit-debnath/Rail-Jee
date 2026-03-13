import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Privacy Policy | RailJee',
  description: 'Privacy Policy for RailJee, the bilingual departmental promotional exam preparation platform for Indian Railway employees.',
};

export default async function PrivacyPolicyPage() {
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
            <span className="text-stone-700">Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Privacy Policy</h1>
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
                At <strong className="text-stone-900">RailJee</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform for Indian Railway departmental promotional exam preparation. Please read this policy carefully before using the service.
              </p>
            </div>

            <Section title="1. Information We Collect">
              <SubSection title="1.1 Information You Provide">
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Account Information:</strong> Your name, email address, and profile photo when you register using Google OAuth or email and password.</li>
                  <li><strong>Profile Data:</strong> Any optional profile details you choose to add after registration.</li>
                  <li><strong>Support Communications:</strong> Any information you provide when you contact us by email, including the content of your message.</li>
                </ul>
              </SubSection>
              <SubSection title="1.2 Information Collected Automatically">
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Exam Activity:</strong> Your selected answers, scores, time taken per question, and exam attempt records to power your personal statistics dashboard.</li>
                  <li><strong>Local Storage Data:</strong> Exam attempt history is stored in your browser&apos;s local storage so your progress is preserved across sessions without requiring a server round trip.</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, and session duration to help us understand how the platform is used and where we can improve.</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and IP address collected for security purposes and to ensure platform compatibility.</li>
                </ul>
              </SubSection>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>To create and manage your account and authenticate your identity.</li>
                <li>To display your exam history, scores, and performance statistics on your dashboard.</li>
                <li>To improve our question bank, study materials, and overall platform experience.</li>
                <li>To send important service related notifications such as password resets or account alerts.</li>
                <li>To detect, investigate, and prevent unauthorized access or fraudulent activity.</li>
                <li>To analyze platform usage patterns and fix technical issues.</li>
                <li>To comply with applicable legal obligations under Indian law.</li>
              </ul>
              <p className="mt-4">
                We do <strong>not</strong> sell, rent, or trade your personal information to any third party for marketing or commercial purposes.
              </p>
            </Section>

            <Section title="3. Data Storage and Retention">
              <p>
                Your account data and exam records are stored securely on servers managed by Supabase, our database and authentication provider. Data is encrypted at rest and in transit using industry standard TLS encryption.
              </p>
              <p className="mt-3">
                Exam attempt data is also stored in your browser&apos;s local storage for fast, offline access to your stats. This data remains on your device until you clear your browser storage or request account deletion.
              </p>
              <p className="mt-3">
                We retain your personal data for as long as your account is active. If you request account deletion, we will remove your personal data within 48 hours. Aggregated and anonymized usage data may be retained for platform improvement purposes.
              </p>
            </Section>

            <Section title="4. Third Party Services">
              <p>
                RailJee relies on the following trusted third party services to operate. Each of these providers has their own privacy practices which we encourage you to review:
              </p>
              <ul className="list-disc pl-5 space-y-3 mt-3">
                <li>
                  <strong>Supabase:</strong> Used for authentication and secure database storage. Your account data and exam records are stored on Supabase infrastructure hosted within secure data centers. See the{' '}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Supabase Privacy Policy</a>.
                </li>
                <li>
                  <strong>Google OAuth:</strong> If you choose to sign in with Google, Google provides us with your name, email address, and profile photo. We do not receive your Google password. See the{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Google Privacy Policy</a>.
                </li>
              </ul>
              <p className="mt-3">
                We do not share your personal data with any third party beyond what is required to operate these core services.
              </p>
            </Section>

            <Section title="5. Cookies and Local Storage">
              <p>
                RailJee uses the following types of browser storage:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Session Cookies:</strong> Used to maintain your authenticated login session. These are essential for the platform to function and are automatically cleared when you sign out or your session expires.</li>
                <li><strong>Local Storage:</strong> Used to store your exam attempt history and language preference on your device. This allows your stats and progress to load instantly without a network request.</li>
              </ul>
              <p className="mt-3">
                We do not use advertising cookies, third party tracking cookies, or any cookies for remarketing purposes.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>
                As a user of RailJee, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Access:</strong> You may request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> You may request that we correct any inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> You may request deletion of your account and all associated personal data.</li>
                <li><strong>Portability:</strong> You may request your data in a structured, machine readable format.</li>
                <li><strong>Withdrawal of Consent:</strong> You may stop using the platform at any time and request that we cease processing your data.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>.
                We will respond to all requests within 48 hours.
              </p>
            </Section>

            <Section title="7. Data Security">
              <p>
                We implement appropriate technical and organizational safeguards to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These include encrypted data transmission, access controls on our database, and regular security reviews.
              </p>
              <p className="mt-3">
                While we take every reasonable precaution, no method of transmission over the internet is completely secure. We encourage you to use a strong, unique password for your account and to sign out after using the platform on shared devices.
              </p>
            </Section>

            <Section title="8. Users Below 18">
              <p>
                RailJee is designed for Indian Railway employees who are at least 18 years of age. We do not knowingly collect personal information from anyone under the age of 18. If we become aware that a user under 18 has registered on the platform, we will promptly delete their account and associated data. If you believe a minor has created an account, please contact us at{' '}
                <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>.
              </p>
            </Section>

            <Section title="9. Links to Other Websites">
              <p>
                The platform may include links to external websites or resources for reference purposes, such as official Railway Board notifications or zone websites. These external sites are not operated by RailJee and we have no control over their content or privacy practices. We are not responsible for the privacy policies of any linked third party sites and encourage you to review their policies before sharing any information with them.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make updates, we will revise the date at the top of this page. For significant changes, we may also notify registered users by email.
              </p>
              <p className="mt-3">
                Your continued use of RailJee after any updates to this policy constitutes your acceptance of the revised terms. If you disagree with the updated policy, you may stop using the platform and request account deletion.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have any questions, concerns, or requests related to this Privacy Policy or the handling of your personal data, please reach out to us:
              </p>
              <div className="mt-4 bg-stone-50 border border-stone-100 rounded-xl p-5">
                <p className="font-semibold text-stone-900 mb-1">RailJee</p>
                <p className="text-stone-600 text-sm">
                  Email:{' '}
                  <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">
                    railjee.official@gmail.com
                  </a>
                </p>
                <p className="text-stone-500 text-xs mt-2">We aim to respond to all privacy related queries within 48 hours.</p>
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-stone-800 mb-1">{title}</h3>
      {children}
    </div>
  );
}
