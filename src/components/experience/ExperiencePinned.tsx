import { useRef } from 'react'
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
import { usePinnedScene } from '@/hooks/use-pinned-scene'

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
        <div ref={mobilePinRef} className="experience-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-5 pb-2 pt-20">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full min-h-0 flex-1 items-center justify-center px-3 pb-8">
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
        <div ref={tabletPinRef} className="experience-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-8 pb-2 pt-24">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl min-h-0 flex-1 items-center justify-center px-8 pb-10">
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
        <div ref={desktopPinRef} className="experience-pin relative flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-4 pb-2 pt-24 lg:px-12">
            <SectionHeading
              label="Experience"
              title="Journey & Milestones"
              description="A guided path through the milestones that shaped my craft."
              align="center"
              className="mb-0"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl min-h-0 flex-1 items-center justify-center px-4 pb-8 lg:px-12">
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
