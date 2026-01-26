import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={`${import.meta.env.BASE_URL}slouch-logo.png`} alt="Slouch" className="w-9 h-9" />
            <span className="font-semibold text-lg tracking-tight">Slouch</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-slate-500 text-sm mb-12">Last updated: January 2025</p>

          <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
            
            <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
              <p className="text-amber-400 font-semibold mb-2">IMPORTANT NOTICE — PLEASE READ CAREFULLY</p>
              <p className="text-amber-200/90">These Terms of Service contain important provisions including a binding arbitration clause, class action waiver, limitation of liability, disclaimer of warranties, and a no-refund policy. By using Slouch, you agree to be bound by these terms. If you do not agree, do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using the Slouch website, application, or services (collectively, the "Service"), you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and all applicable laws and regulations. These Terms constitute a legally binding agreement between you and Slouch ("Company," "we," "us," or "our").</p>
              <p>We reserve the right to modify these Terms at any time without prior notice. Changes become effective immediately upon posting. Your continued use of the Service after any modifications constitutes acceptance of the revised Terms. It is your responsibility to review these Terms periodically.</p>
              <p>If you are using the Service on behalf of an organization, you represent and warrant that you have authority to bind that organization to these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Service Description</h2>
              <p>Slouch provides AI-powered posture monitoring software that operates through your web browser using your device's webcam. The Service uses machine learning technology to analyze posture and provide feedback.</p>
              <p className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <strong className="text-red-400">CRITICAL DISCLAIMER:</strong> The Service is provided for <strong>informational, educational, and general wellness purposes only</strong>. Slouch is <strong>NOT a medical device, medical software, healthcare service, or diagnostic tool</strong>. The Service has not been evaluated, cleared, or approved by the FDA, CE, TGA, Health Canada, or any other regulatory body for any medical purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. No Medical Advice — Critical Warning</h2>
              <p className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-200/90">
                <strong>THE SERVICE DOES NOT PROVIDE MEDICAL ADVICE.</strong> All content, features, and functionality are for informational purposes only and are not intended to be a substitute for professional medical advice, diagnosis, or treatment. The Service is not designed to diagnose, treat, cure, mitigate, or prevent any disease, condition, or health problem.
              </p>
              <p className="mt-4"><strong>YOU MUST:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always seek the advice of a qualified physician, physical therapist, chiropractor, or other qualified healthcare provider before starting any posture correction program or making any changes based on information from the Service</li>
                <li>Never disregard professional medical advice or delay seeking it because of something you have seen or learned from the Service</li>
                <li>Immediately consult a healthcare professional if you experience any pain, discomfort, or adverse symptoms while using the Service</li>
                <li>Understand that posture analysis provided by the Service may be inaccurate and should not be relied upon for any health-related decisions</li>
              </ul>
              <p className="mt-4">If you have or suspect you have a medical condition, or are experiencing pain or discomfort, consult your healthcare provider before using the Service. The Company is not responsible for any health problems that may result from your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Disclaimer of Warranties</h2>
              <p className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                THE SERVICE IS PROVIDED ON AN "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, OR STATUTORY.
              </p>
              <p className="mt-4">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT</li>
                <li>WARRANTIES ARISING FROM COURSE OF DEALING, COURSE OF PERFORMANCE, OR TRADE USAGE</li>
                <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS</li>
                <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF ANY CONTENT, INFORMATION, OR RESULTS OBTAINED THROUGH THE SERVICE</li>
                <li>WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS</li>
                <li>WARRANTIES REGARDING POSTURE IMPROVEMENT, HEALTH OUTCOMES, OR ANY OTHER RESULTS</li>
                <li>WARRANTIES THAT ANY ERRORS OR DEFECTS WILL BE CORRECTED</li>
              </ul>
              <p className="mt-4">YOU ACKNOWLEDGE THAT YOU USE THE SERVICE ENTIRELY AT YOUR OWN RISK. ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION AND RISK.</p>
              <p className="mt-4">Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you. In such cases, our warranties will be limited to the maximum extent permitted by applicable law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
              <p className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SLOUCH, ITS PARENT COMPANIES, SUBSIDIARIES, AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES.
              </p>
              <p className="mt-4">This includes, without limitation, damages for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loss of profits, revenue, goodwill, or business opportunities</li>
                <li>Loss of data or data breach</li>
                <li>Personal injury or property damage</li>
                <li>Pain and suffering or emotional distress</li>
                <li>Cost of substitute goods or services</li>
                <li>Business interruption</li>
                <li>Any other intangible losses</li>
              </ul>
              <p className="mt-4">This limitation applies regardless of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The legal theory (contract, tort, negligence, strict liability, or otherwise)</li>
                <li>Whether we were advised of the possibility of such damages</li>
                <li>Whether the damages were foreseeable</li>
                <li>Whether any limited remedy fails of its essential purpose</li>
              </ul>
              <p className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <strong className="text-amber-400">MAXIMUM LIABILITY CAP:</strong> IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE SERVICE EXCEED THE GREATER OF: (A) THE AMOUNT YOU ACTUALLY PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED US DOLLARS (USD $100.00).
              </p>
              <p className="mt-4">Some jurisdictions do not allow limitations on incidental or consequential damages, so the above limitations may not apply to you. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Assumption of Risk</h2>
              <p>You expressly acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Physical activities, including posture correction, involve inherent risks of injury</li>
                <li>You are solely responsible for your physical condition and any injury or damage you may sustain</li>
                <li>You have consulted with a healthcare professional before using the Service (or assume full responsibility if you have not)</li>
                <li>You voluntarily assume all risks, known and unknown, associated with using the Service</li>
                <li>The posture analysis provided may be inaccurate, and you should not rely solely on the Service for any health or posture decisions</li>
                <li>You are responsible for ensuring your environment is safe when using the Service</li>
              </ul>
              <p className="mt-4">YOU HEREBY RELEASE, WAIVE, AND DISCHARGE THE COMPANY FROM ANY AND ALL LIABILITY, CLAIMS, DEMANDS, ACTIONS, OR CAUSES OF ACTION ARISING OUT OF OR RELATED TO ANY LOSS, DAMAGE, OR INJURY THAT MAY BE SUSTAINED BY YOU WHILE USING THE SERVICE.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Slouch, its parent companies, subsidiaries, affiliates, officers, directors, employees, agents, partners, suppliers, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to reasonable attorneys' fees and legal costs) arising from or related to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights, including intellectual property, privacy, or publicity rights</li>
                <li>Your violation of any applicable law, rule, or regulation</li>
                <li>Any content you submit or transmit through the Service</li>
                <li>Any claim that your use of the Service caused damage to a third party</li>
                <li>Any dispute between you and any third party</li>
              </ul>
              <p className="mt-4">We reserve the right, at your expense, to assume the exclusive defense and control of any matter subject to indemnification by you. You agree to cooperate fully with our defense of any such claim.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Payment Terms and No Refund Policy</h2>
              <p className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <strong className="text-red-400 text-lg">ALL SALES ARE FINAL — NO REFUNDS</strong>
              </p>
              <p className="mt-4"><strong>8.1 No Refunds.</strong> BY PURCHASING ANY SUBSCRIPTION, PRODUCT, OR SERVICE, YOU ACKNOWLEDGE AND AGREE THAT ALL SALES ARE FINAL AND NON-REFUNDABLE. NO REFUNDS, CREDITS, OR EXCHANGES WILL BE PROVIDED UNDER ANY CIRCUMSTANCES, INCLUDING BUT NOT LIMITED TO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dissatisfaction with the Service</li>
                <li>Failure to use or access the Service</li>
                <li>Technical issues, bugs, or service interruptions</li>
                <li>Incompatibility with your device, browser, or webcam</li>
                <li>Change of mind or circumstances</li>
                <li>Accidental purchase</li>
                <li>Duplicate purchase</li>
                <li>Failure to cancel before renewal</li>
                <li>Disagreement with these Terms or any policies</li>
                <li>Any other reason whatsoever</li>
              </ul>
              <p className="mt-4"><strong>8.2 Subscription Billing.</strong> Paid subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date. You are responsible for cancelling your subscription if you do not wish to be charged. Cancellation will take effect at the end of the current billing period, and no partial refunds will be provided for unused time.</p>
              <p className="mt-4"><strong>8.3 Price Changes.</strong> We reserve the right to change our prices at any time. Price changes for existing subscribers will be communicated in advance as required by applicable law.</p>
              <p className="mt-4"><strong>8.4 Chargebacks.</strong> If you initiate a chargeback or payment dispute, we reserve the right to immediately terminate your access to the Service and pursue all available legal remedies. You agree to pay all costs associated with collecting any amounts owed, including reasonable attorneys' fees.</p>
              <p className="mt-4 text-sm text-slate-400">Note: If mandatory consumer protection laws in your jurisdiction require refunds in certain circumstances, this policy shall be limited to the minimum refund rights required by law, and only to the extent legally required. We encourage you to understand the Service before purchasing.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Dispute Resolution and Arbitration</h2>
              <p className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <strong className="text-amber-400">PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS</strong>
              </p>
              
              <p className="mt-4"><strong>9.1 Informal Resolution.</strong> Before initiating any formal dispute resolution, you agree to first contact us at legal@slouch.app to attempt to resolve any dispute informally. We will attempt to resolve the dispute within 30 days.</p>
              
              <p className="mt-4"><strong>9.2 Binding Arbitration.</strong> If we cannot resolve the dispute informally, any dispute, claim, or controversy arising out of or relating to these Terms or the Service shall be resolved by binding arbitration, rather than in court. The arbitration shall be conducted by a single arbitrator in accordance with the rules of the arbitration body applicable in your jurisdiction:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>United States:</strong> American Arbitration Association (AAA) Consumer Arbitration Rules</li>
                <li><strong>European Union/UK:</strong> London Court of International Arbitration (LCIA) Rules</li>
                <li><strong>Other jurisdictions:</strong> International Chamber of Commerce (ICC) Arbitration Rules</li>
              </ul>
              
              <p className="mt-4"><strong>9.3 Class Action Waiver.</strong> YOU AND THE COMPANY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, REPRESENTATIVE, OR CONSOLIDATED ACTION. The arbitrator may not consolidate more than one person's claims and may not preside over any class, representative, or collective proceeding.</p>
              
              <p className="mt-4"><strong>9.4 Opt-Out.</strong> You may opt out of this arbitration agreement by sending written notice to legal@slouch.app within 30 days of first accepting these Terms. If you opt out, you and the Company agree to resolve disputes in the courts specified in Section 10.</p>
              
              <p className="mt-4"><strong>9.5 Exceptions.</strong> Notwithstanding the above, either party may bring an individual action in small claims court for disputes within the court's jurisdiction, and either party may seek injunctive relief in any court of competent jurisdiction.</p>
              
              <p className="mt-4 text-sm text-slate-400">Note: Some jurisdictions do not allow arbitration agreements or class action waivers in consumer contracts. If you are in such a jurisdiction, this section may not apply to you to the extent prohibited by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Governing Law and Jurisdiction</h2>
              <p>These Terms shall be governed by and construed in accordance with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>For users in the European Union:</strong> The laws of the Netherlands, without regard to conflict of law principles. Subject to Section 9, exclusive jurisdiction shall be in the courts of Amsterdam, Netherlands.</li>
                <li><strong>For users in the United Kingdom:</strong> The laws of England and Wales. Subject to Section 9, exclusive jurisdiction shall be in the courts of London, England.</li>
                <li><strong>For users in the United States:</strong> The laws of the State of Delaware, without regard to conflict of law principles. Subject to Section 9, exclusive jurisdiction shall be in the federal and state courts of Delaware.</li>
                <li><strong>For users in all other jurisdictions:</strong> The laws of the Netherlands, without regard to conflict of law principles. Subject to Section 9, exclusive jurisdiction shall be in the courts of Amsterdam, Netherlands.</li>
              </ul>
              <p className="mt-4">You consent to personal jurisdiction in the applicable courts and waive any objection to venue or forum non conveniens.</p>
              <p className="mt-4 text-sm text-slate-400">Note: If mandatory consumer protection laws in your jurisdiction grant you specific legal rights that cannot be waived, those rights shall apply to the extent required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Termination</h2>
              <p>We reserve the right to suspend or terminate your access to the Service at any time, for any reason or no reason, with or without notice, and without liability to you. Grounds for termination may include, but are not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these Terms</li>
                <li>Conduct that we believe is harmful to other users, the Company, or third parties</li>
                <li>Suspected fraudulent, abusive, or illegal activity</li>
                <li>Non-payment or payment disputes</li>
                <li>Request by law enforcement or government agencies</li>
                <li>Discontinuation or modification of the Service</li>
                <li>Technical or security issues</li>
              </ul>
              <p className="mt-4">Upon termination, all rights granted to you under these Terms will immediately cease. Sections that by their nature should survive termination shall survive, including but not limited to: Disclaimer of Warranties, Limitation of Liability, Indemnification, Arbitration, and Governing Law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Intellectual Property</h2>
              <p>The Service and all content, features, and functionality (including but not limited to text, graphics, logos, icons, images, audio, video, software, and code) are owned by the Company or its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
              <p className="mt-4">You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes only. You may not copy, modify, distribute, sell, lease, or create derivative works of any part of the Service without our prior written consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service</li>
                <li>Impersonate any person or entity</li>
                <li>Transmit any malicious code or harmful content</li>
                <li>Violate the rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Third-Party Services</h2>
              <p>The Service may contain links to or integrate with third-party websites, services, or content. We do not control, endorse, or assume responsibility for any third-party content or services. Your use of third-party services is at your own risk and subject to their terms and policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">15. Force Majeure</h2>
              <p>We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, government actions, strikes, labor disputes, pandemics, internet or telecommunications failures, or any other force majeure event.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">16. Severability</h2>
              <p>If any provision of these Terms is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions. The unenforceable provision shall be modified to the minimum extent necessary to make it enforceable while preserving the parties' original intent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">17. Entire Agreement</h2>
              <p>These Terms, together with our Privacy Policy and any other legal notices or agreements published by us on the Service, constitute the entire agreement between you and the Company regarding the Service. These Terms supersede all prior agreements, understandings, representations, and warranties, both written and oral, regarding the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">18. Waiver</h2>
              <p>No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">19. Assignment</h2>
              <p>You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties and their successors and permitted assigns.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">20. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2">
                Email: legal@slouch.app<br />
                Subject: Terms of Service Inquiry
              </p>
            </section>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}slouch-logo.png`} alt="Slouch" className="w-7 h-7" />
            <span className="font-medium text-slate-400">Slouch</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span className="text-slate-300">Terms</span>
          </div>
          <div className="text-slate-500 text-sm">© 2025 Slouch</div>
        </div>
      </footer>
    </div>
  )
}
