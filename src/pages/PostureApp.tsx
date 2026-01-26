import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'
import { useAuth } from '../context/AuthContext'

type PostureStatus = 'good' | 'bad' | 'warning' | 'calibrating' | 'no-person'
type Sensitivity = 'easy' | 'medium' | 'hard'

interface PostureMetrics {
  shoulderWidth: number
  shoulderHipRatio: number
  shoulderAngle: number
  noseToShoulderY: number
}

const SENSITIVITY_CONFIG = {
  easy: {
    shoulderWidthThreshold: 0.08,
    shoulderHipThreshold: 0.06,
    angleThreshold: 6,
    noseThreshold: 0.05,
    sustainedMs: 5000,
    label: 'Relaxed',
    description: '5 second grace period'
  },
  medium: {
    shoulderWidthThreshold: 0.05,
    shoulderHipThreshold: 0.04,
    angleThreshold: 4,
    noseThreshold: 0.035,
    sustainedMs: 3000,
    label: 'Balanced',
    description: '3 second grace period'
  },
  hard: {
    shoulderWidthThreshold: 0.03,
    shoulderHipThreshold: 0.025,
    angleThreshold: 2.5,
    noseThreshold: 0.02,
    sustainedMs: 2000,
    label: 'Strict',
    description: '2 second grace period'
  }
}

export default function PostureApp() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const animationFrameRef = useRef<number>(0)
  const calibrationRef = useRef<PostureMetrics | null>(null)
  const isRunningRef = useRef(false)

  const showSkeletonRef = useRef(true)
  const soundEnabledRef = useRef(true)
  const isCalibratedRef = useRef(false)
  const sensitivityRef = useRef<Sensitivity>('medium')
  const lastNotificationRef = useRef<number>(0)
  const lastStatusRef = useRef<PostureStatus>('calibrating')
  
  const badPostureStartRef = useRef<number | null>(null)
  const isInBadPostureRef = useRef(false)

  const [isLoading, setIsLoading] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [postureStatus, setPostureStatus] = useState<PostureStatus>('calibrating')
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [slouches, setSlouches] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [sensitivity, setSensitivity] = useState<Sensitivity>('medium')
  const [debugInfo, setDebugInfo] = useState('')
  const [warningProgress, setWarningProgress] = useState(0)

  useEffect(() => { showSkeletonRef.current = showSkeleton }, [showSkeleton])
  useEffect(() => { soundEnabledRef.current = soundEnabled }, [soundEnabled])
  useEffect(() => { isCalibratedRef.current = isCalibrated }, [isCalibrated])
  useEffect(() => { sensitivityRef.current = sensitivity }, [sensitivity])

  const playNotificationSound = useCallback(() => {
    if (!soundEnabledRef.current) return
    
    const now = Date.now()
    if (now - lastNotificationRef.current < 3000) return
    lastNotificationRef.current = now

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 520
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      console.log('Audio not available')
    }
  }, [])

  useEffect(() => {
    async function initPoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        })

        poseLandmarkerRef.current = poseLandmarker
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize PoseLandmarker:', error)
        setIsLoading(false)
      }
    }

    initPoseLandmarker()

    return () => {
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!cameraActive) return
    const interval = setInterval(() => {
      setSessionTime(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [cameraActive])

  const calculatePostureMetrics = (landmarks: any[]): PostureMetrics | null => {
    const nose = landmarks[0]
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]

    if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return null
    }

    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) + 
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    )

    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2
    const hipMidY = (leftHip.y + rightHip.y) / 2

    const shoulderHipRatio = (shoulderMidY - hipMidY)

    const shoulderAngle = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * (180 / Math.PI)

    const noseToShoulderY = nose.y - shoulderMidY

    return {
      shoulderWidth,
      shoulderHipRatio,
      shoulderAngle: Math.abs(shoulderAngle),
      noseToShoulderY
    }
  }

  const analyzePosture = (currentMetrics: PostureMetrics): { isBad: boolean, debug: string } => {
    const baseline = calibrationRef.current
    if (!baseline) return { isBad: false, debug: 'No baseline' }

    const config = SENSITIVITY_CONFIG[sensitivityRef.current]

    const shoulderWidthDiff = (baseline.shoulderWidth - currentMetrics.shoulderWidth) / baseline.shoulderWidth
    const shoulderHipDiff = Math.abs(currentMetrics.shoulderHipRatio - baseline.shoulderHipRatio)
    const angleDiff = Math.abs(currentMetrics.shoulderAngle - baseline.shoulderAngle)

    const debug = `W: ${(shoulderWidthDiff * 100).toFixed(1)}% | L: ${(shoulderHipDiff * 100).toFixed(1)}% | T: ${angleDiff.toFixed(1)}°`

    const isBad = (
      shoulderWidthDiff > config.shoulderWidthThreshold ||
      shoulderHipDiff > config.shoulderHipThreshold ||
      angleDiff > config.angleThreshold
    )

    return { isBad, debug }
  }

  const detectPose = useCallback(() => {
    if (!isRunningRef.current) return
    if (!videoRef.current || !canvasRef.current || !poseLandmarkerRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }
    if (videoRef.current.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const startTimeMs = performance.now()
    const results = poseLandmarkerRef.current.detectForVideo(video, startTimeMs)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    let currentStatus: PostureStatus = 'no-person'
    let debugText = 'No person'
    let progress = 0

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0]
      const mirroredLandmarks = landmarks.map(l => ({ ...l, x: 1 - l.x }))

      if (showSkeletonRef.current) {
        const drawingUtils = new DrawingUtils(ctx)
        drawingUtils.drawLandmarks(mirroredLandmarks, {
          radius: 3,
          color: '#06b6d4',
          fillColor: '#06b6d450'
        })
        drawingUtils.drawConnectors(mirroredLandmarks, PoseLandmarker.POSE_CONNECTIONS, {
          color: '#06b6d430',
          lineWidth: 2
        })
      }

      const metrics = calculatePostureMetrics(landmarks)
      
      if (metrics) {
        if (!isCalibratedRef.current) {
          currentStatus = 'calibrating'
          debugText = 'Awaiting calibration'
        } else {
          const result = analyzePosture(metrics)
          debugText = result.debug

          const config = SENSITIVITY_CONFIG[sensitivityRef.current]
          const now = Date.now()

          if (result.isBad) {
            if (badPostureStartRef.current === null) {
              badPostureStartRef.current = now
            }
            
            const elapsed = now - badPostureStartRef.current
            progress = Math.min(100, (elapsed / config.sustainedMs) * 100)

            if (elapsed >= config.sustainedMs) {
              currentStatus = 'bad'
              if (!isInBadPostureRef.current) {
                isInBadPostureRef.current = true
                setSlouches(s => s + 1)
                playNotificationSound()
              }
            } else {
              currentStatus = 'warning'
            }
          } else {
            badPostureStartRef.current = null
            isInBadPostureRef.current = false
            currentStatus = 'good'
            progress = 0
          }
        }
      }
    }

    setDebugInfo(debugText)
    setWarningProgress(progress)
    
    if (currentStatus !== lastStatusRef.current) {
      lastStatusRef.current = currentStatus
      setPostureStatus(currentStatus)
    }

    animationFrameRef.current = requestAnimationFrame(detectPose)
  }, [playNotificationSound])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
        isRunningRef.current = true
        animationFrameRef.current = requestAnimationFrame(detectPose)
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      alert('Camera access is required. Please allow camera access and refresh.')
    }
  }

  const stopCamera = () => {
    isRunningRef.current = false
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setCameraActive(false)
    setIsCalibrated(false)
    isCalibratedRef.current = false
    calibrationRef.current = null
    setPostureStatus('calibrating')
    lastStatusRef.current = 'calibrating'
    badPostureStartRef.current = null
    isInBadPostureRef.current = false
  }

  const calibrate = () => {
    if (!videoRef.current || !poseLandmarkerRef.current) return

    const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, performance.now())
    
    if (results.landmarks && results.landmarks.length > 0) {
      const metrics = calculatePostureMetrics(results.landmarks[0])
      if (metrics) {
        calibrationRef.current = metrics
        setIsCalibrated(true)
        isCalibratedRef.current = true
        setPostureStatus('good')
        lastStatusRef.current = 'good'
        badPostureStartRef.current = null
        isInBadPostureRef.current = false
      }
    } else {
      alert('Could not detect your pose. Make sure you are visible in the camera.')
    }
  }

  const recalibrate = () => {
    calibrationRef.current = null
    setIsCalibrated(false)
    isCalibratedRef.current = false
    setPostureStatus('calibrating')
    lastStatusRef.current = 'calibrating'
    setSlouches(0)
    badPostureStartRef.current = null
    isInBadPostureRef.current = false
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusConfig = () => {
    switch (postureStatus) {
      case 'good': return { 
        icon: '✓', 
        text: 'Perfect Posture', 
        gradient: 'from-emerald-400 to-cyan-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/20'
      }
      case 'warning': return { 
        icon: '!', 
        text: 'Correcting...', 
        gradient: 'from-amber-400 to-orange-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/20'
      }
      case 'bad': return { 
        icon: '↑', 
        text: 'Sit Up Straight', 
        gradient: 'from-red-400 to-pink-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/20'
      }
      case 'calibrating': return { 
        icon: '◎', 
        text: 'Ready to Calibrate', 
        gradient: 'from-slate-400 to-slate-300',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        glow: 'shadow-slate-500/20'
      }
      default: return { 
        icon: '?', 
        text: 'No Person Detected', 
        gradient: 'from-slate-400 to-slate-300',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        glow: 'shadow-slate-500/20'
      }
    }
  }

  const status = getStatusConfig()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Red overlay when slouching */}
      {postureStatus === 'bad' && isCalibrated && (
        <div className="fixed inset-0 bg-red-500/10 pointer-events-none z-40 animate-pulse" />
      )}

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img src={`${import.meta.env.BASE_URL}slouch-logo.png`} alt="Slouch" className="w-11 h-11" />
            <span className="text-xl font-semibold tracking-tight">Slouch</span>
          </a>
          
          <div className="flex items-center gap-6">
            {cameraActive && (
              <>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono">{formatTime(sessionTime)}</span>
                </div>
                <div className="relative group">
                  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-help">
                    <span className="text-white/40">Nudges</span>
                    <span className="ml-2 font-semibold">{slouches}</span>
                  </div>
                  <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Times you were reminded to sit up straight
                  </div>
                </div>
              </>
            )}
            
            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-black">
                  {user?.email?.[0].toUpperCase() || '?'}
                </div>
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-slate-800 border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                <div className="px-4 py-2 border-b border-white/10">
                  <div className="text-xs text-white/40">Signed in as</div>
                  <div className="text-sm text-white truncate">{user?.email}</div>
                </div>
                <button
                  onClick={async () => {
                    await signOut()
                    navigate('/')
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Status Card */}
          <div className={`mb-8 p-8 rounded-3xl backdrop-blur-xl ${status.bg} border ${status.border} shadow-2xl ${status.glow} transition-all duration-500`}>
            <div className="flex items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${status.gradient} flex items-center justify-center text-2xl font-bold shadow-lg`}>
                {status.icon}
              </div>
              <div>
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${status.gradient} bg-clip-text text-transparent`}>
                  {status.text}
                </h2>
                {isCalibrated && (
                  <p className="text-sm text-white/40 font-mono mt-1">{debugInfo}</p>
                )}
              </div>
            </div>
            
            {/* Warning progress */}
            {postureStatus === 'warning' && (
              <div className="mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-100 rounded-full"
                  style={{ width: `${warningProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Video Section */}
          <div className="relative">
            {/* Glass video container */}
            <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <div className="aspect-video relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      </div>
                      <p className="text-white/60">Loading AI Model...</p>
                    </div>
                  </div>
                ) : !cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Enable Camera</h3>
                      <p className="text-white/40 mb-6 text-sm">Your video never leaves this device. All AI processing happens locally in your browser.</p>
                      <button
                        onClick={startCamera}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl font-semibold text-black hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                      >
                        Start Session
                      </button>
                    </div>
                  </div>
                ) : null}
                
                <video ref={videoRef} className="hidden" playsInline muted />
                <canvas
                  ref={canvasRef}
                  className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
                />
              </div>

              {/* Floating controls overlay */}
              {cameraActive && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center justify-between">
                    {/* Left: Calibration */}
                    <div>
                      {!isCalibrated ? (
                        <button
                          onClick={calibrate}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl font-semibold text-black hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                        >
                          Calibrate Posture
                        </button>
                      ) : (
                        <button
                          onClick={recalibrate}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm transition-all"
                        >
                          Recalibrate
                        </button>
                      )}
                    </div>

                    {/* Center: Sensitivity */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10">
                      {(['easy', 'medium', 'hard'] as Sensitivity[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSensitivity(level)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            sensitivity === level
                              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {SENSITIVITY_CONFIG[level].label}
                        </button>
                      ))}
                    </div>

                    {/* Right: Quick toggles */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSkeleton(!showSkeleton)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          showSkeleton ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'bg-white/10 text-white/40 border border-white/10 hover:text-white'
                        }`}
                        title="Toggle skeleton"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          soundEnabled ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-white/10 text-white/40 border border-white/10 hover:text-white'
                        }`}
                        title="Toggle sound"
                      >
                        {soundEnabled ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12l-4-4H4V10h4l4-4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={stopCamera}
                        className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30 transition-all"
                        title="Stop session"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature cards */}
          {!cameraActive && (
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              {[
                { icon: '🔒', title: '100% Private', desc: 'All AI runs locally in your browser. Your video never leaves your device.' },
                { icon: '🎯', title: 'Smart Detection', desc: 'Tracks your torso alignment, not head movement. Look at other screens freely.' },
                { icon: '⚡', title: 'Real-time Feedback', desc: 'Get gentle nudges when you slouch, with adjustable sensitivity levels.' },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
