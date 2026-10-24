import { useEffect } from 'react'
import { gsap } from 'gsap'

/** Presentation only. Observe lazy-loaded pages without changing their markup or state. */
export function VisualEffects() {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', (context) => {
      const headings = new Map<Element, gsap.core.Tween | null>()
      const root = document.getElementById('main-content')
      if (!root) return
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target
            if (!entry.isIntersecting) {
              headings.get(target)?.pause()
              continue
            }
            const existing = headings.get(target)
            if (existing) {
              existing.resume()
              continue
            }
            context.add(() => {
              const tween = gsap.to(target, {
                y: -2,
                duration: 3.2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              })
              headings.set(target, tween)
            })
          }
        },
        { threshold: 0.2 },
      )
      const scan = () => {
        headings.forEach((tween, element) => {
          if (!element.isConnected) {
            tween?.revert()
            observer.unobserve(element)
            headings.delete(element)
          }
        })
        root
          .querySelectorAll('.page-intro h1, .section-heading h2, .cta-banner h2, .hero-copy h1')
          .forEach((element) => {
            if (headings.has(element)) return
            headings.set(element, null)
            observer.observe(element)
          })
      }
      scan()
      const mutations = new MutationObserver(scan)
      mutations.observe(root, { childList: true, subtree: true })
      let active: HTMLElement | null = null
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const target = (event.target as Element).closest<HTMLElement>(
          '.student-stat, .room-card, .blog-card, .cta-banner, .popular-card, .filter-panel, .room-search, .room-category-tabs, .student-directory',
        )
        if (active && active !== target) active.classList.remove('light-active')
        active = target
        if (!target) return
        const rect = target.getBoundingClientRect()
        target.style.setProperty('--light-x', `${event.clientX - rect.left}px`)
        target.style.setProperty('--light-y', `${event.clientY - rect.top}px`)
        target.classList.add('light-active')
      }
      const leave = () => {
        active?.classList.remove('light-active')
        active = null
      }
      root.addEventListener('pointermove', move, { passive: true })
      root.addEventListener('pointerleave', leave)
      return () => {
        observer.disconnect()
        mutations.disconnect()
        root.removeEventListener('pointermove', move)
        root.removeEventListener('pointerleave', leave)
        leave()
        root.querySelectorAll<HTMLElement>('[style]').forEach((element) => {
          element.style.removeProperty('--light-x')
          element.style.removeProperty('--light-y')
        })
      }
    })
    return () => media.revert()
  }, [])
  return null
}
