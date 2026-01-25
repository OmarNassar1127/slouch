import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/slouch-logo.png" alt="Slouch" className="w-9 h-9" />
            <span className="font-semibold text-lg tracking-tight">Slouch</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-slate-500 text-sm mb-12">Last updated: January 2025</p>

          <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>This Privacy Policy describes how Slouch ("we," "us," or "our") collects, uses, and shares information in connection with your use of our website and services (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
              <p>This policy applies to users worldwide and is designed to comply with applicable privacy laws including, but not limited to, the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), the California Privacy Rights Act (CPRA), the UK Data Protection Act, Brazil's LGPD, Canada's PIPEDA, Australia's Privacy Act, and other applicable international privacy regulations.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">2.1 Information You Provide</h3>
              <p>We may collect information you voluntarily provide, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address (when joining our waitlist or creating an account)</li>
                <li>Payment information (processed by third-party payment processors)</li>
                <li>Communications you send to us</li>
              </ul>

              <h3 className="text-lg font-medium text-white mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <p>We may automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>IP address (which may be anonymized)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-white mb-2 mt-4">2.3 Webcam Data — Local Processing Only</h3>
              <p className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"><strong className="text-emerald-400">IMPORTANT:</strong> Slouch processes webcam data <strong>entirely locally on your device</strong>. Your webcam feed is processed using client-side AI technology (TensorFlow.js/MediaPipe) running in your browser. <strong>We do not collect, store, transmit, access, or have any ability to view your webcam footage, images, video data, or any biometric information derived therefrom.</strong> All pose detection and posture analysis occurs exclusively on your device and never leaves your browser.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent where required)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Legal Bases for Processing (GDPR)</h2>
              <p>For users in the European Economic Area (EEA), United Kingdom, and Switzerland, we process personal data based on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contractual necessity:</strong> To perform our contract with you</li>
                <li><strong>Legitimate interests:</strong> For our legitimate business purposes</li>
                <li><strong>Consent:</strong> Where you have given explicit consent</li>
                <li><strong>Legal obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Information Sharing</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service providers:</strong> Who assist in operating our Service (hosting, analytics, payment processing)</li>
                <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With your consent:</strong> When you have given permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer data internationally, we implement appropriate safeguards including Standard Contractual Clauses approved by relevant authorities, and ensure adequate protection as required by applicable law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p>We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When determining retention periods, we consider the amount, nature, and sensitivity of the information, potential risks, and applicable legal requirements.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdraw consent:</strong> Withdraw previously given consent</li>
                <li><strong>Lodge a complaint:</strong> File a complaint with a supervisory authority</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@slouch.app. We will respond within the timeframes required by applicable law.</p>
              
              <h3 className="text-lg font-medium text-white mb-2 mt-4">8.1 California Residents (CCPA/CPRA)</h3>
              <p>California residents have additional rights including the right to know what personal information is collected, the right to delete, the right to opt-out of sales (we do not sell data), and the right to non-discrimination. To submit a request, contact privacy@slouch.app.</p>
              
              <h3 className="text-lg font-medium text-white mb-2 mt-4">8.2 Do Not Track</h3>
              <p>We currently do not respond to "Do Not Track" signals as there is no consistent industry standard for compliance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to collect information and improve the Service. You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.</p>
              <p>Types of cookies we may use:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference cookies:</strong> Remember your settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Data Security</h2>
              <p>We implement reasonable technical and organizational measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security and are not responsible for unauthorized access resulting from circumstances beyond our reasonable control.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Children's Privacy</h2>
              <p>The Service is not intended for children under 16 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately at privacy@slouch.app, and we will take steps to delete such information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Third-Party Links and Services</h2>
              <p>The Service may contain links to third-party websites or integrate third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the revised policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Contact Us</h2>
              <p>For privacy-related questions, requests, or complaints, contact us at:</p>
              <p className="mt-2">
                Email: privacy@slouch.app<br />
                Subject: Privacy Inquiry
              </p>
              <p className="mt-4">For users in the EEA, you also have the right to lodge a complaint with your local data protection authority.</p>
            </section>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/slouch-logo.png" alt="Slouch" className="w-7 h-7" />
            <span className="font-medium text-slate-400">Slouch</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="text-slate-300">Privacy</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          </div>
          <div className="text-slate-500 text-sm">© 2025 Slouch</div>
        </div>
      </footer>
    </div>
  )
}
