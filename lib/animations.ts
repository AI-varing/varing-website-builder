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
/* Parallax — rAF-driven translateY based on scroll position */
export function useParallax(speed = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const yRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let raf = 0
    const tick = () => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const vp = window.innerHeight / 2
        yRef.current = (center - vp) * speed
        el.style.transform = `translateY(${yRef.current}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  return ref
}

/* Text reveal — word-by-word or line-by-line on scroll */
export function useTextReveal(mode: 'word' | 'line' = 'word') {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView] = useInView(0.15)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (inView) setRevealed(true)
  }, [inView])

  const wrapText = (text: string) => {
    const units = mode === 'word' ? text.split(/\s+/) : text.split('\n')
    return units.map((unit, i) => ({
      text: unit,
      style: {
        display: mode === 'word' ? 'inline-block' : 'block',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ${i * 0.08}s cubic-bezier(.22,1,.36,1), transform 0.7s ${i * 0.08}s cubic-bezier(.22,1,.36,1)`,
        marginRight: mode === 'word' ? '0.3em' : 0,
      } as React.CSSProperties,
    }))
  }

  return { containerRef, wrapText, revealed }
}

/* Stagger reveal — for card grids.
 * Wraps useInView with a mount-time failsafe: if the IntersectionObserver
 * hasn't fired within 1.2s (e.g. headless puppeteer rendering, certain
 * fast-scroll sequences past a tall container), force visible so the cards
 * never get permanently stuck at opacity 0. /advisory had a 1200px black
 * void where the services grid should have been because of this exact
 * failure mode. */
export function useStaggerReveal(delay = 0.1) {
  const [ref, inView] = useInView(0.08)
  const [failsafe, setFailsafe] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setFailsafe(true), 1200)
    return () => clearTimeout(t)
  }, [])
  const visible = inView || failsafe
  const getItemStyle = (i: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)',
    transition: `opacity 0.75s ${i * delay}s cubic-bezier(.22,1,.36,1), transform 0.75s ${i * delay}s cubic-bezier(.22,1,.36,1)`,
  })
  return { ref, inView: visible, getItemStyle }
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
