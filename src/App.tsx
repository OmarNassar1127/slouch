import { useState } from 'react'

// FAQ Item component with collapse animation
const FaqItem = ({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) => (
  <div className="border-b border-slate-800 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left group"
    >
      <h3 className="font-semibold pr-4 group-hover:text-emerald-400 transition-colors">{question}</h3>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-500 border-emerald-500 rotate-180' : 'group-hover:border-slate-500'}`}>
        <svg 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'text-white' : 'text-slate-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    <div 
      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}
    >
      <div className="overflow-hidden">
        <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  </div>
)

// Logo component - using generated image
const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <img src="/slouch-logo.png" alt="Slouch" className={className} />
)

// Animated spine illustration for hero
const SpineIllustration = () => (
  <div className="relative w-full max-w-md mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-3xl rounded-full"></div>
    <svg viewBox="0 0 400 500" className="w-full relative z-10">
      <defs>
        <linearGradient id="spineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      
      {/* Person silhouette - good posture */}
      <g className="animate-pulse" style={{ animationDuration: '3s' }}>
        {/* Head */}
        <circle cx="200" cy="80" r="40" fill="#1e293b" stroke="url(#spineGrad)" strokeWidth="3"/>
        {/* Spine dots */}
        {[140, 180, 220, 260, 300, 340].map((y, i) => (
          <circle key={i} cx="200" cy={y} r="8" fill="url(#spineGrad)" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}/>
        ))}
        {/* Spine line */}
        <path d="M200 120 L200 360" stroke="url(#spineGrad)" strokeWidth="4" strokeDasharray="8 8"/>
        {/* Shoulders */}
        <path d="M120 160 Q200 140 280 160" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" fill="none"/>
        {/* Body outline */}
        <path d="M140 160 L130 320 L170 480 M260 160 L270 320 L230 480" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" fill="none"/>
      </g>
      
      {/* Checkmark indicator */}
      <g transform="translate(300, 60)">
        <circle cx="0" cy="0" r="30" fill="#10b981"/>
        <path d="M-12 0 L-4 8 L12 -8" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
    </svg>
  </div>
)

// Browser mockup component
const BrowserMockup = () => (
  <div className="relative mx-auto max-w-2xl">
    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-2xl rounded-3xl"></div>
    <div className="relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-slate-700 rounded-lg px-4 py-1.5 text-sm text-slate-400 max-w-xs mx-auto">
            slouch.app
          </div>
        </div>
      </div>
      {/* App preview */}
      <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="font-semibold text-white">Slouch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-emerald-400">Monitoring</span>
          </div>
        </div>
        <div className="aspect-video bg-slate-700/50 rounded-xl flex items-center justify-center border border-slate-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <SpineIllustration />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">Posture Score</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
            </div>
            <span className="text-emerald-400 font-semibold">92%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqItems = [
    { 
      q: 'Is my webcam footage stored or sent anywhere?', 
      a: 'No. All AI processing runs locally in your browser using TensorFlow.js. Your webcam feed is never recorded, stored, or transmitted. We literally cannot see your video.' 
    },
    { 
      q: 'What cameras and browsers are supported?', 
      a: 'Any webcam works — built-in, USB, or phone-as-webcam. We support Chrome, Edge, and Firefox on desktop. Safari support is coming soon.' 
    },
    { 
      q: 'Can I use Slouch during video calls?', 
      a: 'Yes! Slouch runs in a separate tab and works alongside Zoom, Meet, Teams, or any other video call app.' 
    },
    { 
      q: 'How does this compare to Upright GO?', 
      a: 'Upright GO is a $79 wearable you stick to your back. Slouch uses your existing webcam — nothing to buy, charge, or lose. Same result, zero friction.' 
    },
    { 
      q: 'How quickly will I see results?', 
      a: 'Most users report noticeable improvement in 1-2 weeks. The key is consistency — even 30 minutes of monitored work per day builds lasting muscle memory.' 
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Gradient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo className="w-9 h-9" />
            <span className="font-semibold text-lg tracking-tight">Slouch</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Features</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Pricing</a>
            <a 
              href="#waitlist" 
              className="bg-white text-slate-900 font-medium px-5 py-2 rounded-full text-sm hover:bg-slate-100 transition-colors"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-slate-300">Now in private beta</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                Fix your posture with
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  just your webcam
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                AI-powered posture correction that runs entirely in your browser. 
                No wearables. No apps to install. Just open a tab and sit better.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a 
                  href="#waitlist"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-full text-base hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
                >
                  Join the Waitlist
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a 
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white font-medium px-6 py-4 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  See how it works
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-2xl font-bold text-white">$0</div>
                  <div className="text-sm text-slate-500">hardware needed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-slate-500">private & local</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">2 weeks</div>
                  <div className="text-sm text-slate-500">to see results</div>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="lg:pl-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
                <img 
                  src="/hero-image.png" 
                  alt="AI posture tracking visualization" 
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Trust */}
      <section className="py-12 px-6 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-6">Built with technology from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-slate-400 font-semibold">Google MediaPipe</div>
            <div className="text-slate-400 font-semibold">TensorFlow.js</div>
            <div className="text-slate-400 font-semibold">WebGL</div>
            <div className="text-slate-400 font-semibold">React</div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            Your body pays the price for<br />every hour you ignore it
          </h2>
          <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">
            The average remote worker spends 10+ hours slouched over a screen. 
            The damage compounds silently until pain becomes impossible to ignore.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Chronic Pain', 
                desc: 'Neck, back, and shoulder pain that worsens each year without intervention' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Energy Drain', 
                desc: 'Slouching compresses your lungs, reducing oxygen and killing your focus' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: 'Poor Presence', 
                desc: 'Bad posture makes you appear less confident in meetings and on video calls' 
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-800 rounded-xl text-slate-400 mb-5">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              How Slouch works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Three simple steps. No downloads, no hardware, no complicated setup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Open & Calibrate', 
                desc: 'Visit slouch.app, allow camera access, sit up straight, and click calibrate. Done in 10 seconds.',
                color: 'from-emerald-500 to-emerald-600'
              },
              { 
                step: '02', 
                title: 'Work as usual', 
                desc: 'Slouch runs silently in a browser tab. Our AI tracks your posture in real-time using pose detection.',
                color: 'from-cyan-500 to-cyan-600'
              },
              { 
                step: '03', 
                title: 'Get gentle nudges', 
                desc: 'When you slouch, your screen softly blurs until you correct your position. No annoying sounds.',
                color: 'from-violet-500 to-violet-600'
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-sm mb-6`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: '🔒', 
                title: 'Privacy First', 
                desc: 'All AI processing happens locally. Your webcam feed never leaves your device.' 
              },
              { 
                icon: '⚡', 
                title: 'Zero Hardware', 
                desc: 'No $80 wearable to charge or lose. Your webcam is all you need.' 
              },
              { 
                icon: '🧠', 
                title: 'Habit Building', 
                desc: 'Gentle nudges create muscle memory. Most users improve in 2 weeks.' 
              },
              { 
                icon: '💻', 
                title: 'Cross-Platform', 
                desc: 'Works on Mac, Windows, Linux, and Chromebooks. Any modern browser.' 
              },
              { 
                icon: '📊', 
                title: 'Progress Tracking', 
                desc: 'Daily and weekly reports show your posture improving over time.' 
              },
              { 
                icon: '🔕', 
                title: 'Non-Intrusive', 
                desc: 'Soft screen blur, not jarring alarms. Corrects without disrupting flow.' 
              },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Slouch vs. Wearables
            </h2>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-5 text-slate-400 font-medium"></th>
                  <th className="p-5 text-center">
                    <Logo className="w-6 h-6 mx-auto mb-1" />
                    <span className="font-semibold">Slouch</span>
                  </th>
                  <th className="p-5 text-center text-slate-400">
                    <span className="font-medium">Upright GO</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['Price', '$4/mo', '$79 one-time'],
                  ['Hardware needed', 'None', 'Wearable device'],
                  ['Setup time', '10 seconds', '5+ minutes'],
                  ['Can lose/forget it', 'No', 'Yes'],
                  ['Charging required', 'No', 'Yes'],
                  ['Works in browser', 'Yes', 'No'],
                  ['Privacy', '100% local', 'Cloud sync'],
                ].map(([feature, slouch, other], i) => (
                  <tr key={i} className="border-b border-slate-800/50 last:border-0">
                    <td className="p-4 text-slate-400">{feature}</td>
                    <td className="p-4 text-center text-emerald-400 font-medium">{slouch}</td>
                    <td className="p-4 text-center text-slate-500">{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 text-lg">
              Early access members lock in 50% off forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8">
              <div className="text-slate-400 font-medium mb-2">Free</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Basic posture detection', 'Screen blur alerts', '3 sessions per day', 'Browser-based'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 border border-slate-700 rounded-xl text-slate-400 font-medium hover:border-slate-600 hover:text-white transition-colors">
                Coming Soon
              </button>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                EARLY ACCESS
              </div>
              <div className="text-emerald-400 font-medium mb-2">Pro</div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">$4</span>
                <span className="text-slate-400 line-through text-lg">$8</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Free', 'Unlimited sessions', 'Posture analytics & trends', 'Custom alert sensitivity', 'Break reminders', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a 
                href="#waitlist"
                className="block w-full py-3 bg-white text-slate-900 font-semibold rounded-xl text-center hover:bg-slate-100 transition-colors"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center">
            <Logo className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
              Get early access
            </h2>
            <p className="text-slate-400 mb-8">
              Be first in line. Early members get 50% off Pro forever.
            </p>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">You're on the list!</h3>
                <p className="text-slate-400 text-sm">We'll email you when Slouch is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-slate-900 font-semibold px-6 py-4 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Join the Waitlist →
                </button>
              </form>
            )}

            <p className="text-slate-500 text-xs mt-6">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Frequently asked questions
          </h2>

          <div>
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7" />
            <span className="font-medium text-slate-400">Slouch</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="https://twitter.com/omarnassar" className="hover:text-slate-300 transition-colors">Twitter</a>
          </div>
          <div className="text-slate-500 text-sm">
            © 2025 Slouch
          </div>
        </div>
      </footer>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default App
