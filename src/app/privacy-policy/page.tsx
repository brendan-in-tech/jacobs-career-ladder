'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4 text-gray-700">Effective Date: {new Date().toLocaleDateString()}</p>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-700">Jacob's Ladder (“we”, “us”, or “our”) is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li><b>Account Information:</b> When you sign up, we collect your email address and authentication details via Google or email/password.</li>
            <li><b>Job Application Data:</b> Information you enter about job applications, companies, positions, and notes.</li>
            <li><b>Email Events:</b> Data imported from your Gmail account (if you connect it), such as job-related emails and metadata.</li>
            <li><b>Usage Data:</b> We may collect anonymized analytics about how you use the app to improve our services.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>To provide and improve our job application tracking and Gmail integration services.</li>
            <li>To authenticate you and keep your account secure.</li>
            <li>To allow you to export or delete your data at any time.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li><b>We do not sell your data.</b></li>
            <li>We do not share your personal information with third parties except as required by law or to provide our core services (e.g., Google for authentication and Gmail integration).</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Data Export & Deletion</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>You can export all your data in JSON format from the Settings page at any time.</li>
            <li>You can delete your account and all associated data from the Settings page. Data marked for deletion will be permanently removed after 30 days.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>When you delete your account, your data is marked for deletion and scheduled for permanent removal after 30 days.</li>
            <li>Some data (such as job applications and email events) may be retained for up to 1 year for compliance or technical reasons, after which it is automatically deleted.</li>
            <li>We use automated processes (Firestore TTL) to enforce these retention periods.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Security</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>We use industry-standard security practices, including encrypted connections (HTTPS), secure authentication, and regular security reviews.</li>
            <li>Your data is stored securely in Google Cloud Firestore.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>You have the right to access, export, or delete your data at any time.</li>
            <li>You may contact us at <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a> for any privacy-related questions or requests.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Changes to This Policy</h2>
          <p className="text-gray-700">We may update this policy from time to time. We will notify you of any significant changes via the app or email.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
          <p className="text-gray-700">If you have any questions about this policy, please contact us at <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a>.</p>
        </section>
      </div>
    </div>
  );
} 