import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addToWaitlist } from './lib/supabase'

// Modal component
const LaunchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold mb-3">Coming Soon!</h3>
          <p className="text-white/60 mb-6">
            Slouch is not available yet. Sign up for early access and be the first to know when we launch.
          </p>
          <a 
            href="#waitlist"
            onClick={onClose}
            className="block w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </div>
  )
}

// FAQ Item component with collapse animation
const FaqItem = ({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) => (
  <div className="border-b border-white/10 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left group"
    >
      <h3 className="font-semibold pr-4 group-hover:text-emerald-400 transition-colors">{question}</h3>
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl backdrop-blur-sm border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-500/20 border-emerald-500/50 rotate-180' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'text-emerald-400' : 'text-white/40'}`} 
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
        <p className="text-white/50 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  </div>
)

// Logo component
const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <img src="/slouch-logo.png" alt="Slouch" className={className} />
)

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showLaunchModal, setShowLaunchModal] = useState(false)

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const result = await addToWaitlist(email, honeypot)
    
    if (result.success) {
      setSubmitted(true)
    } else if (result.error === 'already_exists') {
      setSubmitError('Oops! This email is already on the list 🎉')
    } else {
      setSubmitError(result.error || 'Something went wrong')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] animate-pulse delay-500"></div>
      </div>

      {/* Glass Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-white/[0.02] border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 group">
            <Logo className="w-11 h-11" />
            <span className="font-semibold text-lg tracking-tight">Slouch</span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-white hover:text-emerald-400 transition-colors hidden sm:block">Features</a>
            <a href="#pricing" className="text-sm text-white hover:text-emerald-400 transition-colors hidden sm:block">Pricing</a>
            <button 
              onClick={() => setShowLaunchModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-white/70">Now in private beta</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                Fix your posture with
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  just your webcam
                </span>
              </h1>
              
              <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-lg">
                AI-powered posture correction that runs entirely in your browser. 
                No wearables. No apps to install. Just open a tab and sit better.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => setShowLaunchModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold text-base hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Launch App
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <a 
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white font-medium px-6 py-4 transition-colors"
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
                {[
                  { value: '$0', label: 'hardware needed' },
                  { value: '100%', label: 'private & local' },
                  { value: '2 weeks', label: 'to see results' },
                ].map((stat, i) => (
                  <div key={i} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                    <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-white">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="lg:pl-4">
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
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-white mb-6">Built with technology from</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Google MediaPipe', 'TensorFlow.js', 'WebGL', 'React'].map((tech, i) => (
              <div key={i} className="px-4 py-2 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            Your body pays the price for<br />every hour you ignore it
          </h2>
          <p className="text-white/50 text-lg mb-16 max-w-2xl mx-auto">
            The average remote worker spends 10+ hours slouched over a screen. 
            The damage compounds silently until pain becomes impossible to ignore.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { 
                icon: '😣',
                title: 'Chronic Pain', 
                desc: 'Neck, back, and shoulder pain that worsens each year without intervention' 
              },
              { 
                icon: '😴',
                title: 'Energy Drain', 
                desc: 'Slouching compresses your lungs, reducing oxygen and killing your focus' 
              },
              { 
                icon: '😶',
                title: 'Poor Presence', 
                desc: 'Bad posture makes you appear less confident in meetings and on video calls' 
              },
            ].map((item, i) => (
              <div key={i} className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              How Slouch works
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Three simple steps. No downloads, no hardware, no complicated setup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Open & Calibrate', 
                desc: 'Visit slouch.app, allow camera access, sit up straight, and click calibrate. Done in 10 seconds.',
                gradient: 'from-emerald-400 to-emerald-500'
              },
              { 
                step: '02', 
                title: 'Work as usual', 
                desc: 'Slouch runs silently in a browser tab. Our AI tracks your posture in real-time using pose detection.',
                gradient: 'from-cyan-400 to-cyan-500'
              },
              { 
                step: '03', 
                title: 'Get gentle nudges', 
                desc: 'When you slouch, you get a gentle reminder. No annoying sounds, just visual cues.',
                gradient: 'from-violet-400 to-violet-500'
              },
            ].map((item, i) => (
              <div key={i} className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-black font-bold text-lg mb-6 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-white/40 leading-relaxed">{item.desc}</p>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'All AI processing happens locally. Your webcam feed never leaves your device.' },
              { icon: '⚡', title: 'Zero Hardware', desc: 'No $80 wearable to charge or lose. Your webcam is all you need.' },
              { icon: '🧠', title: 'Habit Building', desc: 'Gentle nudges create muscle memory. Most users improve in 2 weeks.' },
              { icon: '💻', title: 'Cross-Platform', desc: 'Works on Mac, Windows, Linux, and Chromebooks. Any modern browser.' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Daily and weekly reports show your posture improving over time.' },
              { icon: '🔕', title: 'Non-Intrusive', desc: 'Soft visual nudges, not jarring alarms. Corrects without disrupting flow.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Slouch vs. Wearables
            </h2>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-5 text-white/40 font-medium"></th>
                  <th className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-xl border-2 border-emerald-400/50 flex items-center justify-center">
                      <Logo className="w-10 h-10" />
                    </div>
                    <div className="font-semibold">Slouch</div>
                  </th>
                  <th className="p-5 text-center text-white/40">
                    <div className="font-medium">Upright GO</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['Price', 'From $4/mo', '$79 one-time'],
                  ['Hardware needed', 'None', 'Wearable device'],
                  ['Setup time', '10 seconds', '5+ minutes'],
                  ['Can lose/forget it', 'No', 'Yes'],
                  ['Charging required', 'No', 'Yes'],
                  ['Works in browser', 'Yes', 'No'],
                  ['Privacy', '100% local', 'Cloud sync'],
                ].map(([feature, slouch, other], i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/50">{feature}</td>
                    <td className="p-4 text-center text-emerald-400 font-medium">{slouch}</td>
                    <td className="p-4 text-center text-white/30">{other}</td>
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
            <p className="text-white/50 text-lg">
              Early access members lock in 50% off forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Pro */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
              <div className="text-emerald-400 font-medium mb-2">Pro</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">$4</span>
                <span className="text-white/30 line-through text-lg">$8</span>
                <span className="text-white/30">/month</span>
              </div>
              <p className="text-white/40 text-sm mb-6">Perfect for individuals</p>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited sessions',
                  'Real-time posture tracking',
                  'Visual & audio alerts',
                  'Sensitivity presets',
                  'Session statistics',
                  '100% private & local'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a 
                href="#waitlist"
                className="block w-full py-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium text-center hover:bg-white/10 transition-all"
              >
                Join Waitlist
              </a>
            </div>

            {/* Pro+ */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-3xl p-8 shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="text-emerald-400 font-medium mb-2">Pro+</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-white/30 line-through text-lg">$18</span>
                <span className="text-white/30">/month</span>
              </div>
              <p className="text-white/40 text-sm mb-6">For power users & professionals</p>
              <ul className="space-y-4 mb-8">
                {[
                  'Everything in Pro',
                  'Detailed analytics dashboard',
                  'Weekly posture reports',
                  'Posture score trends over time',
                  'Multiple profiles (work, gaming)',
                  'Custom sounds & alert styles',
                  'Break reminders with exercises',
                  'Priority support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a 
                href="#waitlist"
                className="block w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
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
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl rounded-3xl"></div>
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
                <Logo className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
                Get early access
              </h2>
              <p className="text-white/50 mb-8">
                Be first in line. Early members get 50% off Pro forever.
              </p>

              {submitted ? (
                <div className="backdrop-blur-sm bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">You're on the list!</h3>
                  <p className="text-white/50 text-sm">We'll email you when Slouch is ready.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field - hidden from humans, bots will fill it */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    className="absolute opacity-0 h-0 w-0 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                  />
                  {submitError && (
                    <p className={`text-sm ${submitError.includes('already') ? 'text-emerald-400' : 'text-red-400'}`}>{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Waitlist →'}
                  </button>
                </form>
              )}

              <p className="text-white/30 text-xs mt-6">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Frequently asked questions
          </h2>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
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
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-sm text-white">Slouch</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white">
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <a href="https://twitter.com/omarnassar" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Twitter</a>
          </div>
          <div className="text-sm text-white">
            © 2026 Slouch
          </div>
        </div>
      </footer>

      {/* Gradient animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>

      {/* Launch Modal */}
      <LaunchModal isOpen={showLaunchModal} onClose={() => setShowLaunchModal(false)} />
    </div>
  )
}

export default App
