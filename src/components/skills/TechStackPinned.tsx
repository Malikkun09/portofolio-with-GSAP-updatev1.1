import { useRef } from 'react'
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
import { usePinnedScene } from '@/hooks/use-pinned-scene'

export default function TechStackPinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const { device, scrollEnabled } = usePinnedScene()

  useTechStackScroll(desktopPinRef, scrollEnabled && device === 'desktop')
  useTabletTechStackScroll(tabletPinRef, scrollEnabled && device === 'tablet')
  useMobileTechStackScroll(mobilePinRef, scrollEnabled && device === 'mobile')

  return (
    <section id="skills" className="relative w-full overflow-x-clip border-t border-cyber-fg/5 bg-cyber-bg">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(0,184,255,0.08)_0%,transparent_58%)]"
        aria-hidden
      />

      {device === null ? (
        <div className="min-h-[100dvh] bg-cyber-bg" aria-hidden />
      ) : device === 'mobile' ? (
        <div
          ref={mobilePinRef}
          className="tech-stack-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-5 pb-3 pt-20">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="A vertical journey through the tools I build with."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-md min-h-0 flex-1 items-center px-5 pb-14">
            <div className="relative w-full">
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
          className="tech-stack-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-8 pb-2 pt-24">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="Energy from the hub — each spoke lights a discipline."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl min-h-0 flex-1 items-center justify-center px-8 pb-10">
            <div className="relative mx-auto aspect-square w-[min(100%,calc(100dvh-12rem))] max-w-[620px]">
              <TabletTechStackConnector staticVisible={!scrollEnabled} />

              <div className="relative z-20 grid h-full w-full grid-cols-2 grid-rows-2 gap-10">
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
          className="tech-stack-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
        >
          <div className="relative z-30 shrink-0 px-4 pb-2 pt-24 lg:px-12">
            <SectionHeading
              label="Skills"
              title="Tech Stack"
              description="Scroll to fire each spoke — the hub routes energy into every discipline."
              align="center"
              className="mb-0 lg:mb-1"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-6 lg:px-12">
            <div className="tech-stack-field relative mx-auto aspect-square w-[min(100%,calc(100dvh-12.5rem))] max-w-[760px]">
              <TechStackConnector staticVisible={!scrollEnabled} />

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
