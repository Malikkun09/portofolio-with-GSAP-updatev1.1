import { useRef } from 'react'
import SectionHeading from '@/components/SectionHeading'
import BrandedMarker from '@/components/experience/BrandedMarker'
import JourneyPath from '@/components/experience/JourneyPath'
import MilestoneCard from '@/components/experience/MilestoneCard'
import MobileMilestoneCard from '@/components/experience/MobileHorizontalMilestoneCard'
import MobileBrandedMarker from '@/components/experience/MobileBrandedMarker'
import MobileJourneyPath from '@/components/experience/MobileJourneyPath'
import TabletJourneyPath from '@/components/experience/TabletJourneyPath'
import TabletMilestoneCard from '@/components/experience/TabletMilestoneCard'
import { JOURNEY_MILESTONES } from '@/components/experience/journey-config'
import { useExperienceJourney } from '@/hooks/use-experience-journey'
import { useMobileExperienceJourney } from '@/hooks/use-mobile-experience-journey'
import { useTabletExperienceJourney } from '@/hooks/use-tablet-experience-journey'
import { usePinnedScene } from '@/hooks/use-pinned-scene'

function ExperienceHeading({ showDescription }: { showDescription: boolean }) {
  return (
    <SectionHeading
      label="Experience"
      title="Journey & Milestones"
      description={
        showDescription
          ? 'A guided path through the milestones that shaped my craft.'
          : undefined
      }
      align="center"
      compact
      className="mb-0"
    />
  )
}

export default function ExperiencePinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const { device, scrollEnabled } = usePinnedScene()

  useExperienceJourney(desktopPinRef, scrollEnabled && device === 'desktop')
  useTabletExperienceJourney(tabletPinRef, scrollEnabled && device === 'tablet')
  useMobileExperienceJourney(mobilePinRef, scrollEnabled && device === 'mobile')

  return (
    <section id="experience" className="relative w-full overflow-x-clip border-t border-cyber-fg/5 bg-cyber-bg">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,184,255,0.07)_0%,transparent_62%)]"
        aria-hidden
      />

      {device === null ? (
        <div className="min-h-[100dvh] bg-cyber-bg" aria-hidden />
      ) : device === 'mobile' ? (
        <div ref={mobilePinRef} className="experience-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-5 pb-1 pt-16">
            <ExperienceHeading showDescription={false} />
          </div>

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-lg flex-1 px-4 pb-5">
            <div className="relative h-full w-full">
              <MobileJourneyPath staticVisible={!scrollEnabled} />

              <div className="relative z-20 flex h-full flex-col gap-2.5 py-1 pl-12">
                {JOURNEY_MILESTONES.map((milestone, index) => (
                  <MobileMilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    staticVisible={!scrollEnabled}
                  />
                ))}
              </div>

              <MobileBrandedMarker mode="path" staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      ) : device === 'tablet' ? (
        <div ref={tabletPinRef} className="experience-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-8 pb-1 pt-16">
            <ExperienceHeading showDescription={false} />
          </div>

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-3xl flex-1 px-6 pb-6">
            <div className="relative h-full w-full">
              <TabletJourneyPath staticVisible={!scrollEnabled} />

              <div className="relative z-20 flex h-full flex-col gap-3 py-1 pl-14">
                {JOURNEY_MILESTONES.map((milestone, index) => (
                  <TabletMilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    staticVisible={!scrollEnabled}
                  />
                ))}
              </div>

              <BrandedMarker staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      ) : (
        <div ref={desktopPinRef} className="experience-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-4 pb-1 pt-20 lg:px-12">
            <ExperienceHeading showDescription />
          </div>

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 px-6 pb-6 lg:px-10">
            <div className="relative h-full w-full">
              <JourneyPath staticVisible={!scrollEnabled} />

              <div className="relative z-20 flex h-full flex-col gap-3 py-1 pl-16 lg:gap-4 lg:pl-[4.75rem]">
                {JOURNEY_MILESTONES.map((milestone, index) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    staticVisible={!scrollEnabled}
                  />
                ))}
              </div>

              <BrandedMarker staticVisible={!scrollEnabled} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
