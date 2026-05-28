import { useEffect, useRef } from 'react'
import { Camera, Geometry, Mesh, Program, Renderer } from 'ogl'
import './Particles.css'

interface ParticlesProps {
  alphaParticles?: boolean
  cameraDistance?: number
  className?: string
  disableRotation?: boolean
  particleBaseSize?: number
  particleColors?: string[]
  particleCount?: number
  particleHoverFactor?: number
  particleSpread?: number
  pixelRatio?: number
  sizeRandomness?: number
  speed?: number
}

const defaultColors = ['#ffffff', '#ffffff', '#ffffff']

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace(/^#/, '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized
  const int = Number.parseInt(value, 16)

  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform vec2 uPointer;
  uniform float uHoverFactor;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28318 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28318 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28318 * random.y) * mix(0.1, 1.5, random.z);

    vec2 toParticle = mPos.xy - uPointer;
    float pointerDistance = max(length(toParticle), 0.001);
    float pointerInfluence = smoothstep(3.0, 0.0, pointerDistance);
    mPos.xy += normalize(toParticle) * pointerInfluence * uHoverFactor;

    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5)) / max(0.5, length(mvPos.xyz) * 0.18);
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uAlphaParticles;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float distanceToCenter = length(uv - vec2(0.5));
    float circle = smoothstep(0.5, 0.36, distanceToCenter);

    if (circle < 0.01) {
      discard;
    }

    float alpha = mix(1.0, circle, uAlphaParticles);
    gl_FragColor = vec4(vColor, alpha * circle);
  }
`

function Particles({
  alphaParticles = true,
  cameraDistance = 20,
  className = '',
  disableRotation = false,
  particleBaseSize = 180,
  particleColors = defaultColors,
  particleCount = 200,
  particleHoverFactor = 0.35,
  particleSpread = 10,
  pixelRatio = 1.5,
  sizeRandomness = 1,
  speed = 0.1,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      depth: false,
      dpr: Math.min(window.devicePixelRatio, pixelRatio),
    })
    const { gl } = renderer
    const canvas = gl.canvas
    const camera = new Camera(gl, { fov: 15 })
    const colors = particleColors.length > 0 ? particleColors : defaultColors
    const positions = new Float32Array(particleCount * 3)
    const randoms = new Float32Array(particleCount * 4)
    const colorData = new Float32Array(particleCount * 3)

    gl.clearColor(0, 0, 0, 0)
    canvas.className = 'particles_canvas'
    container.appendChild(canvas)
    camera.position.set(0, 0, cameraDistance)

    for (let index = 0; index < particleCount; index += 1) {
      const i3 = index * 3
      const i4 = index * 4
      const color = hexToRgb(colors[index % colors.length])

      positions[i3] = Math.random() * 2 - 1
      positions[i3 + 1] = Math.random() * 2 - 1
      positions[i3 + 2] = Math.random() * 2 - 1
      randoms[i4] = Math.random()
      randoms[i4 + 1] = Math.random()
      randoms[i4 + 2] = Math.random()
      randoms[i4 + 3] = Math.random()
      colorData[i3] = color[0]
      colorData[i3 + 1] = color[1]
      colorData[i3 + 2] = color[2]
    }

    const geometry = new Geometry(gl, {
      color: { data: colorData, size: 3 },
      position: { data: positions, size: 3 },
      random: { data: randoms, size: 4 },
    })
    const program = new Program(gl, {
      depthTest: false,
      fragment,
      transparent: true,
      uniforms: {
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        uBaseSize: { value: particleBaseSize },
        uHoverFactor: { value: particleHoverFactor },
        uPointer: { value: [999, 999] },
        uSizeRandomness: { value: sizeRandomness },
        uSpread: { value: particleSpread },
        uTime: { value: 0 },
      },
      vertex,
    })
    const mesh = new Mesh(gl, { geometry, mode: gl.POINTS, program })
    let animationFrame = 0
    let lastTime = performance.now()

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }

    const updatePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * particleSpread
      pointerRef.current.y = -((event.clientY - rect.top) / rect.height - 0.5) * particleSpread
    }

    const clearPointer = () => {
      pointerRef.current.x = 999
      pointerRef.current.y = 999
    }

    const render = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      program.uniforms.uTime.value += delta * 0.001 * speed

      if (!disableRotation) {
        mesh.rotation.x += 0.00008 * delta * speed
        mesh.rotation.y += 0.00012 * delta * speed
      }

      program.uniforms.uPointer.value = [pointerRef.current.x, pointerRef.current.y]

      renderer.render({ camera, scene: mesh })
      animationFrame = requestAnimationFrame(render)
    }

    resize()
    animationFrame = requestAnimationFrame(render)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', updatePointer)
    window.addEventListener('pointerleave', clearPointer)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('pointerleave', clearPointer)
      canvas.remove()
    }
  }, [
    alphaParticles,
    cameraDistance,
    disableRotation,
    particleBaseSize,
    particleColors,
    particleCount,
    particleHoverFactor,
    particleSpread,
    pixelRatio,
    sizeRandomness,
    speed,
  ])

  return <div className={`particles ${className}`} ref={containerRef} aria-hidden="true" />
}

export default Particles
