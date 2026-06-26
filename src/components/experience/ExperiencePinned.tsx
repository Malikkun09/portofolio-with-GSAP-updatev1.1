import { useEffect, useRef, useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import BrandedMarker from '@/components/experience/BrandedMarker'
import JourneyPath from '@/components/experience/JourneyPath'
import MilestoneCard from '@/components/experience/MilestoneCard'
import MobileBrandedMarker from '@/components/experience/MobileBrandedMarker'
import MobileHorizontalMilestoneCard from '@/components/experience/MobileHorizontalMilestoneCard'
import MobileJourneyPath from '@/components/experience/MobileJourneyPath'
import TabletJourneyPath from '@/components/experience/TabletJourneyPath'
import TabletMilestoneCard from '@/components/experience/TabletMilestoneCard'
import {
  JOURNEY_MILESTONES,
  MILESTONE_CARD_POSITIONS_DESKTOP,
  MILESTONE_CARD_POSITIONS_MOBILE,
  MILESTONE_CARD_POSITIONS_TABLET,
} from '@/components/experience/journey-config'
import { useExperienceJourney } from '@/hooks/use-experience-journey'
import { useMobileExperienceJourney } from '@/hooks/use-mobile-experience-journey'
import { useTabletExperienceJourney } from '@/hooks/use-tablet-experience-journey'

type DeviceKind = 'mobile' | 'tablet' | 'desktop'

function resolveDevice(width: number): DeviceKind {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

const PIN_BASE_CLASS =
  'experience-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-black'

export default function ExperiencePinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const [device, setDevice] = useState<DeviceKind | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setDevice(resolveDevice(window.innerWidth))
      setReducedMotion(motionMq.matches)
    }
    update()
    window.addEventListener('resize', update)
    motionMq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  const scrollEnabled = !reducedMotion

  // Each hook is gated by `enabled` AND only mounts its layout for the current
  // device. Because the layout is conditionally rendered below (only ONE of
  // mobile/tablet/desktop is ever in the DOM at a time), there is exactly one
  // ScrollTrigger per section — no conflicts, no measuring of hidden elements.
  useExperienceJourney(desktopPinRef, scrollEnabled && device === 'desktop')
  useTabletExperienceJourney(tabletPinRef, scrollEnabled && device === 'tablet')
  useMobileExperienceJourney(mobilePinRef, scrollEnabled && device === 'mobile')

  return (
    <section id="experience" className="relative w-full overflow-x-clip border-t border-white/5 bg-cyber-black">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,184,255,0.06)_0%,transparent_60%)]"
        aria-hidden
      />

      {/* Mount guard — render a placeholder until the device is resolved.
          This prevents a flash of wrong layout and ensures GSAP measures a
          correctly-sized element when the device-specific layout mounts. */}
      {device === null ? (
        <div className="min-h-[100dvh] bg-cyber-black" aria-hidden />
      ) : device === 'mobile' ? (
        /* ===================== MOBILE (<768px) ===================== */
        <div ref={mobilePinRef} className={PIN_BASE_CLASS}>
          <div className="relative z-30 shrink-0 px-5 pb-2 pt-20">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center px-3 pb-8">
            {/* Horizontal journey field — all 4 cards fit in viewport */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
              <MobileJourneyPath staticVisible={!scrollEnabled} />

              {JOURNEY_MILESTONES.map((milestone, index) => (
                <MobileHorizontalMilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  position={MILESTONE_CARD_POSITIONS_MOBILE[index]}
                  index={index}
                  staticVisible={!scrollEnabled}
                />
              ))}

              <MobileBrandedMarker mode="path" staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      ) : device === 'tablet' ? (
        /* ===================== TABLET (768–1023px) ===================== */
        <div ref={tabletPinRef} className={PIN_BASE_CLASS}>
          <div className="relative z-30 shrink-0 px-8 pb-4 pt-24">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-8 pb-12">
            <div className="relative mx-auto aspect-[5/3] w-full max-w-[760px]">
              <TabletJourneyPath staticVisible={!scrollEnabled} />

              {JOURNEY_MILESTONES.map((milestone, index) => (
                <TabletMilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  position={MILESTONE_CARD_POSITIONS_TABLET[index]}
                  index={index}
                  staticVisible={!scrollEnabled}
                />
              ))}

              <BrandedMarker staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      ) : (
        /* ===================== DESKTOP (≥1024px) ===================== */
        <div ref={desktopPinRef} className={PIN_BASE_CLASS}>
          <div className="relative z-30 shrink-0 px-4 pb-4 pt-24 lg:px-12">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-10 lg:px-12">
            <div className="relative mx-auto aspect-[2/1] w-full max-w-6xl">
              <JourneyPath staticVisible={!scrollEnabled} />

              {JOURNEY_MILESTONES.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  index={index}
                  position={MILESTONE_CARD_POSITIONS_DESKTOP[index]}
                  staticVisible={!scrollEnabled}
                />
              ))}

              <BrandedMarker staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
