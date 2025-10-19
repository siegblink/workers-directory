export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using WorkerDir, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              WorkerDir provides a platform connecting service workers with
              customers. You agree to use the service only for lawful purposes
              and in accordance with these Terms.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You must be at least 18 years old to use this service</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>You agree to provide accurate and complete information</li>
              <li>
                You will not use the service for any illegal or unauthorized
                purpose
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. Failure to
              do so constitutes a breach of the Terms, which may result in
              immediate termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Payments and Credits
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Credits purchased on WorkerDir are non-refundable except as
              required by law. All transactions are processed securely through
              our payment partners. Workers receive payment after successful job
              completion, minus our platform fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Cancellation Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Cancellation policies vary by worker. Please review the specific
              worker's cancellation policy before booking. Generally,
              cancellations made 24 hours before the scheduled service may
              receive a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              WorkerDir acts as a platform connecting workers and customers. We
              are not responsible for the quality of services provided by
              workers or disputes between users. Our liability is limited to the
              amount paid for the specific transaction in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through the
              platform. Continued use of the service after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at
              support@workerdir.com
            </p>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: December 2024
          </p>
        </div>
      </div>
    </div>
  );
}
