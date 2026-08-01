import { useEffect, useRef, useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import TechStackConnector from '@/components/skills/TechStackConnector'
import TechStackGroup from '@/components/skills/TechStackGroup'
import MobileTechStackGroup from '@/components/skills/MobileTechStackGroup'
import MobileTechStackTrack from '@/components/skills/MobileTechStackTrack'
import TabletTechStackConnector from '@/components/skills/TabletTechStackConnector'
import TabletTechStackGroup from '@/components/skills/TabletTechStackGroup'
import { TECH_STACK_GROUPS } from '@/components/skills/tech-stack-config'
import { useTechStackScroll } from '@/hooks/use-tech-stack-scroll'
import { useMobileTechStackScroll } from '@/hooks/use-mobile-tech-stack-scroll'
import { useTabletTechStackScroll } from '@/hooks/use-tablet-tech-stack-scroll'
import { useAppReady } from '@/contexts/AppReadyContext'

type DeviceKind = 'mobile' | 'tablet' | 'desktop'

function resolveDevice(width: number): DeviceKind {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export default function TechStackPinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const [device, setDevice] = useState<DeviceKind | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const appReady = useAppReady()

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

  const scrollEnabled = !reducedMotion && appReady

  useTechStackScroll(desktopPinRef, scrollEnabled && device === 'desktop', false)
  useTabletTechStackScroll(tabletPinRef, scrollEnabled && device === 'tablet')
  useMobileTechStackScroll(mobilePinRef, scrollEnabled && device === 'mobile')

  return (
    <section id="skills" className="relative w-full overflow-x-clip border-t border-cyber-fg/5 bg-cyber-bg">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(0,184,255,0.07)_0%,transparent_58%)]"
        aria-hidden
      />

      {device === null ? (
        <div className="min-h-[100dvh] bg-cyber-bg" aria-hidden />
      ) : device === 'mobile' ? (
        <div
          ref={mobilePinRef}
          className="tech-stack-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-5 pb-4 pt-20">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="A vertical journey through the tools I build with."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md flex-1 px-5 pb-16">
            <div className="relative">
              <MobileTechStackTrack staticVisible={!scrollEnabled} />
              <div className="relative space-y-10 py-6">
                {TECH_STACK_GROUPS.map((group) => (
                  <MobileTechStackGroup
                    key={group.id}
                    group={group}
                    staticVisible={!scrollEnabled}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : device === 'tablet' ? (
        <div
          ref={tabletPinRef}
          className="tech-stack-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-8 pb-4 pt-24">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="A central hub routing through each discipline."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-8 pb-12">
            <div className="relative mx-auto aspect-square w-full max-w-[680px]">
              <TabletTechStackConnector staticVisible={!scrollEnabled} />

              <div className="relative z-20 grid h-full w-full grid-cols-2 grid-rows-2 gap-12">
                {TECH_STACK_GROUPS.map((group) => (
                  <TabletTechStackGroup
                    key={group.id}
                    group={group}
                    staticVisible={!scrollEnabled}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={desktopPinRef}
          className="tech-stack-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-4 pb-4 pt-24 lg:px-12">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="Scroll to trace the circuit — each node activates as the path reaches it."
              align="center"
              className="mb-0 lg:mb-1"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-10 sm:px-6 lg:px-12">
            <div className="tech-stack-field relative mx-auto aspect-[4/3] w-full max-w-5xl sm:aspect-[16/11] lg:max-w-6xl">
              <TechStackConnector isMobile={false} staticVisible={!scrollEnabled} />

              {TECH_STACK_GROUPS.map((group) => (
                <TechStackGroup
                  key={group.id}
                  group={group}
                  isMobile={false}
                  staticVisible={!scrollEnabled}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
