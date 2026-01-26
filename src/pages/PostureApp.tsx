import { useEffect, useRef, useState, useCallback } from 'react'
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'

type PostureStatus = 'good' | 'bad' | 'warning' | 'calibrating' | 'no-person'
type Sensitivity = 'easy' | 'medium' | 'hard'

interface PostureMetrics {
  shoulderWidth: number      // Distance between shoulders (hunching reduces this)
  shoulderHipRatio: number   // Vertical alignment of shoulders to hips
  shoulderAngle: number      // How level the shoulders are
  noseToShoulderY: number    // Vertical distance nose to shoulder midpoint
}

// Sensitivity presets: thresholds + time delay before alerting
const SENSITIVITY_CONFIG = {
  easy: {
    shoulderWidthThreshold: 0.08,   // 8% reduction in shoulder width
    shoulderHipThreshold: 0.06,     // 6% change in shoulder-hip alignment
    angleThreshold: 6,              // 6 degrees
    noseThreshold: 0.05,            // 5% nose drop
    sustainedMs: 5000,              // 5 seconds before alert
    label: 'Easy',
    description: 'Generous tolerance, alerts after 5 seconds'
  },
  medium: {
    shoulderWidthThreshold: 0.05,
    shoulderHipThreshold: 0.04,
    angleThreshold: 4,
    noseThreshold: 0.035,
    sustainedMs: 3000,
    label: 'Medium',
    description: 'Balanced sensitivity, alerts after 3 seconds'
  },
  hard: {
    shoulderWidthThreshold: 0.03,
    shoulderHipThreshold: 0.025,
    angleThreshold: 2.5,
    noseThreshold: 0.02,
    sustainedMs: 2000,
    label: 'Hard',
    description: 'Strict posture tracking, alerts after 2 seconds'
  }
}

export default function PostureApp() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const animationFrameRef = useRef<number>(0)
  const calibrationRef = useRef<PostureMetrics | null>(null)
  const isRunningRef = useRef(false)

  // Refs for animation loop
  const showSkeletonRef = useRef(true)
  const soundEnabledRef = useRef(true)
  const isCalibratedRef = useRef(false)
  const sensitivityRef = useRef<Sensitivity>('medium')
  const lastNotificationRef = useRef<number>(0)
  const lastStatusRef = useRef<PostureStatus>('calibrating')
  
  // Sustained bad posture tracking
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
  const [warningProgress, setWarningProgress] = useState(0) // 0-100% progress to alert

  // Sync state to refs
  useEffect(() => { showSkeletonRef.current = showSkeleton }, [showSkeleton])
  useEffect(() => { soundEnabledRef.current = soundEnabled }, [soundEnabled])
  useEffect(() => { isCalibratedRef.current = isCalibrated }, [isCalibrated])
  useEffect(() => { sensitivityRef.current = sensitivity }, [sensitivity])

  // Play notification sound
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
      
      oscillator.frequency.value = 440
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      console.log('Audio not available')
    }
  }, [])

  // Initialize MediaPipe
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

  // Session timer
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

    // Shoulder width (normalized) - key metric for hunching
    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) + 
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    )

    // Shoulder midpoint
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2

    // Hip midpoint
    const hipMidX = (leftHip.x + rightHip.x) / 2
    const hipMidY = (leftHip.y + rightHip.y) / 2

    // Shoulder-to-hip vertical ratio (detects forward lean)
    const shoulderHipRatio = (shoulderMidY - hipMidY)

    // Shoulder angle (tilt)
    const shoulderAngle = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * (180 / Math.PI)

    // Nose to shoulder Y distance
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

    // Calculate differences (focus on torso metrics)
    const shoulderWidthDiff = (baseline.shoulderWidth - currentMetrics.shoulderWidth) / baseline.shoulderWidth
    const shoulderHipDiff = Math.abs(currentMetrics.shoulderHipRatio - baseline.shoulderHipRatio)
    const angleDiff = Math.abs(currentMetrics.shoulderAngle - baseline.shoulderAngle)
    const noseDiff = currentMetrics.noseToShoulderY - baseline.noseToShoulderY

    const debug = `Width: ${(shoulderWidthDiff * 100).toFixed(1)}% | Lean: ${(shoulderHipDiff * 100).toFixed(1)}% | Tilt: ${angleDiff.toFixed(1)}°`

    // Bad posture = shoulders hunched (width decreased) OR forward lean OR uneven shoulders
    // We're NOT checking head position as primary metric anymore
    const isBad = (
      shoulderWidthDiff > config.shoulderWidthThreshold ||  // Shoulders hunched inward
      shoulderHipDiff > config.shoulderHipThreshold ||      // Leaning forward
      angleDiff > config.angleThreshold                      // Uneven shoulders
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

    // Draw video frame (mirrored)
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

      // Mirror landmarks for drawing
      const mirroredLandmarks = landmarks.map(l => ({ ...l, x: 1 - l.x }))

      // Draw skeleton
      if (showSkeletonRef.current) {
        const drawingUtils = new DrawingUtils(ctx)
        drawingUtils.drawLandmarks(mirroredLandmarks, {
          radius: 4,
          color: '#10b981',
          fillColor: '#10b98180'
        })
        drawingUtils.drawConnectors(mirroredLandmarks, PoseLandmarker.POSE_CONNECTIONS, {
          color: '#10b98150',
          lineWidth: 2
        })
      }

      // Calculate metrics
      const metrics = calculatePostureMetrics(landmarks)
      
      if (metrics) {
        if (!isCalibratedRef.current) {
          currentStatus = 'calibrating'
          debugText = 'Please calibrate'
        } else {
          const result = analyzePosture(metrics)
          debugText = result.debug

          const config = SENSITIVITY_CONFIG[sensitivityRef.current]
          const now = Date.now()

          if (result.isBad) {
            // Start or continue tracking bad posture
            if (badPostureStartRef.current === null) {
              badPostureStartRef.current = now
            }
            
            const elapsed = now - badPostureStartRef.current
            progress = Math.min(100, (elapsed / config.sustainedMs) * 100)

            if (elapsed >= config.sustainedMs) {
              // Sustained bad posture - trigger alert
              currentStatus = 'bad'
              if (!isInBadPostureRef.current) {
                isInBadPostureRef.current = true
                setSlouches(s => s + 1)
                playNotificationSound()
              }
            } else {
              // Building up to alert
              currentStatus = 'warning'
            }
          } else {
            // Good posture - reset tracking
            badPostureStartRef.current = null
            isInBadPostureRef.current = false
            currentStatus = 'good'
            progress = 0
          }
        }
      }
    }

    // Update state
    setDebugInfo(debugText)
    setWarningProgress(progress)
    
    if (currentStatus !== lastStatusRef.current) {
      lastStatusRef.current = currentStatus
      setPostureStatus(currentStatus)
    }

    // Draw border indicator
    const statusColor = currentStatus === 'good' ? '#10b981' : 
                       currentStatus === 'bad' ? '#ef4444' : 
                       currentStatus === 'warning' ? '#f59e0b' : '#6b7280'
    ctx.strokeStyle = statusColor
    ctx.lineWidth = 10
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)

    // Draw warning progress bar if in warning state
    if (currentStatus === 'warning' && progress > 0) {
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(5, canvas.height - 15, (canvas.width - 10) * (progress / 100), 10)
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
        console.log('Calibrated with:', metrics)
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

  const getStatusMessage = () => {
    switch (postureStatus) {
      case 'good': return 'Great posture! Keep it up!'
      case 'warning': return 'Posture slipping...'
      case 'bad': return 'Sit up straight!'
      case 'calibrating': return 'Sit with good posture, then click Calibrate'
      case 'no-person': return 'No person detected'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Full screen red overlay when slouching */}
      {postureStatus === 'bad' && isCalibrated && (
        <div className="fixed inset-0 bg-red-500/20 pointer-events-none z-40 animate-pulse" />
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm relative z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="/slouch-logo.png" alt="Slouch" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Slouch
            </span>
          </a>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>⏱️ {formatTime(sessionTime)}</span>
            <span>🔔 {slouches} nudges</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Banner */}
          <div className={`mb-6 p-6 rounded-xl text-center transition-all ${
            postureStatus === 'good' 
              ? 'bg-emerald-500/20 border-2 border-emerald-500' 
              : postureStatus === 'bad' 
                ? 'bg-red-500/30 border-2 border-red-500 animate-pulse' 
                : postureStatus === 'warning'
                  ? 'bg-amber-500/20 border-2 border-amber-500'
                  : 'bg-slate-500/20 border-2 border-slate-500/50'
          }`}>
            <div className="text-5xl mb-3">
              {postureStatus === 'good' ? '✅' : 
               postureStatus === 'bad' ? '🚨' : 
               postureStatus === 'warning' ? '⚠️' : '⏳'}
            </div>
            <div className={`text-2xl font-bold ${
              postureStatus === 'good' ? 'text-emerald-400' : 
              postureStatus === 'bad' ? 'text-red-400' : 
              postureStatus === 'warning' ? 'text-amber-400' : 'text-slate-400'
            }`}>
              {getStatusMessage()}
            </div>
            
            {/* Warning progress bar */}
            {postureStatus === 'warning' && (
              <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="h-full bg-amber-500 transition-all duration-100"
                  style={{ width: `${warningProgress}%` }}
                />
              </div>
            )}
            
            {isCalibrated && (
              <div className="text-xs text-slate-500 mt-2 font-mono">{debugInfo}</div>
            )}
          </div>

          {/* Sensitivity Selector */}
          {cameraActive && (
            <div className="mb-6 flex justify-center">
              <div className="inline-flex bg-slate-800 rounded-lg p-1">
                {(['easy', 'medium', 'hard'] as Sensitivity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSensitivity(level)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      sensitivity === level
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {SENSITIVITY_CONFIG[level].label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {cameraActive && (
            <p className="text-center text-xs text-slate-500 mb-6">
              {SENSITIVITY_CONFIG[sensitivity].description}
            </p>
          )}

          {/* Video Container */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 aspect-video mb-6">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading AI model...</p>
                </div>
              </div>
            ) : !cameraActive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 mb-4">Camera access required for posture detection</p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Enable Camera
                  </button>
                </div>
              </div>
            ) : null}
            
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-contain ${!cameraActive ? 'hidden' : ''}`}
            />
          </div>

          {/* Controls */}
          {cameraActive && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {!isCalibrated ? (
                <button
                  onClick={calibrate}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-bold text-lg hover:opacity-90 transition animate-pulse"
                >
                  🎯 Calibrate Good Posture
                </button>
              ) : (
                <button
                  onClick={recalibrate}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
                >
                  🔄 Recalibrate
                </button>
              )}

              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  showSkeleton ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                🦴 {showSkeleton ? 'Skeleton On' : 'Skeleton Off'}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  soundEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {soundEnabled ? '🔔 Sound On' : '🔕 Sound Off'}
              </button>

              <button
                onClick={stopCamera}
                className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-medium transition"
              >
                ⏹️ Stop
              </button>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <h3 className="text-emerald-400 font-medium mb-2">🔒 100% Private</h3>
              <p className="text-sm text-slate-400">All AI runs in your browser. No video ever leaves your device.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <h3 className="text-emerald-400 font-medium mb-2">🎯 How to Use</h3>
              <p className="text-sm text-slate-400">1. Sit up straight<br/>2. Click Calibrate<br/>3. Work normally — we'll alert if you slouch!</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <h3 className="text-emerald-400 font-medium mb-2">💡 Smart Detection</h3>
              <p className="text-sm text-slate-400">Tracks your torso, not head movement. Looking at other screens won't trigger alerts.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
