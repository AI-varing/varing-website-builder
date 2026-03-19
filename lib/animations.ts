'use client'

import { useEffect, useRef, useState } from 'react'
import type React from 'react'

/* Intersection Observer — fires once */
export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

/* Fade-up on scroll */
export function useFadeUp(delay = 0) {
  const [ref, inView] = useInView(0.1)
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.85s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.85s ${delay}s cubic-bezier(.22,1,.36,1)`,
    } as React.CSSProperties,
  }
}

/* Slide-from-right on scroll */
export function useFadeFromRight(delay = 0) {
  const [ref, inView] = useInView(0.1)
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(44px)',
      transition: `opacity 0.85s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.85s ${delay}s cubic-bezier(.22,1,.36,1)`,
    } as React.CSSProperties,
  }
}

/* Slide-from-left on scroll */
export function useFadeFromLeft(delay = 0) {
  const [ref, inView] = useInView(0.1)
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-44px)',
      transition: `opacity 0.85s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.85s ${delay}s cubic-bezier(.22,1,.36,1)`,
    } as React.CSSProperties,
  }
}

/* Typewriter effect */
export function useTypewriter(text: string, speed = 38) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

/* JS-driven marquee using requestAnimationFrame */
export function useMarquee(speed: number, reverse = false) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cancelledRef = useRef(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    const el = trackRef.current
    if (!el) return

    let pos = 0
    let prev = 0
    let raf = 0

    const tick = (now: number) => {
      if (cancelledRef.current) return
      if (!pausedRef.current) {
        const dt = prev ? Math.min(now - prev, 50) : 16
        const halfW = el.scrollWidth / 2
        if (halfW > 0) {
          if (reverse) {
            pos += speed * dt / 1000
            if (pos >= halfW) pos -= halfW
          } else {
            pos -= speed * dt / 1000
            if (pos <= -halfW) pos += halfW
          }
          el.style.transform = `translateX(${pos}px)`
        }
      }
      prev = now
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(() => {
      if (!cancelledRef.current) raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelledRef.current = true
      cancelAnimationFrame(raf)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMouseEnter = () => { pausedRef.current = true }
  const onMouseLeave = () => { pausedRef.current = false }

  return { trackRef, onMouseEnter, onMouseLeave }
}
