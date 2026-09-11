import { useRef } from 'react'
import SectionHeading from '@/components/SectionHeading'
import BrandedMarker from '@/components/experience/BrandedMarker'
import JourneyPath from '@/components/experience/JourneyPath'
import MilestoneCard from '@/components/experience/MilestoneCard'
import MobileBrandedMarker from '@/components/experience/MobileBrandedMarker'
import MobileJourneyCard from '@/components/experience/MobileJourneyCard'
import MobileJourneyRail from '@/components/experience/MobileJourneyRail'
import TabletJourneyPath from '@/components/experience/TabletJourneyPath'
import TabletMilestoneCard from '@/components/experience/TabletMilestoneCard'
import {
  JOURNEY_MILESTONES,
  MILESTONE_CARD_POSITIONS_DESKTOP,
  MILESTONE_CARD_POSITIONS_TABLET,
} from '@/components/experience/journey-config'
import { useExperienceJourney } from '@/hooks/use-experience-journey'
import { useMobileExperienceJourney } from '@/hooks/use-mobile-experience-journey'
import { useTabletExperienceJourney } from '@/hooks/use-tablet-experience-journey'
import { useDeviceKind } from '@/hooks/use-device-kind'
import { useAppReady } from '@/contexts/AppReadyContext'

function ExperienceHeading() {
  return (
    <SectionHeading
      label="Experience"
      title="Journey & Milestones"
      description="A guided path through the milestones that shaped my craft."
      align="center"
      className="mb-0"
    />
  )
}

export default function ExperiencePinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const { device, reducedMotion } = useDeviceKind()
  const appReady = useAppReady()

  const scrollEnabled = !reducedMotion && appReady

  useExperienceJourney(desktopPinRef, scrollEnabled && device === 'desktop')
  useTabletExperienceJourney(tabletPinRef, scrollEnabled && device === 'tablet')
  useMobileExperienceJourney(mobilePinRef, scrollEnabled && device === 'mobile')

  return (
    <section id="experience" className="relative w-full overflow-x-clip border-t border-cyber-fg/5 bg-cyber-bg">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,184,255,0.06)_0%,transparent_60%)]"
        aria-hidden
      />

      {device === null ? (
        <div className="h-[100dvh] bg-cyber-bg" aria-hidden />
      ) : device === 'mobile' ? (
        scrollEnabled ? (
          <div
            ref={mobilePinRef}
            className="experience-pin relative flex h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg"
          >
            <div className="relative z-30 shrink-0 px-5 pb-2 pt-16">
              <ExperienceHeading />
            </div>

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[520px] flex-1 px-3 pb-8">
              <div className="relative w-14 shrink-0">
                <div className="absolute inset-y-6 left-1/2 w-px">
                  <MobileJourneyRail />
                  <MobileBrandedMarker mode="rail" />
                </div>
              </div>

              <div className="relative min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-visible">
                {JOURNEY_MILESTONES.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-1"
                  >
                    <MobileJourneyCard milestone={milestone} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full bg-cyber-bg px-5 pb-16 pt-20">
            <ExperienceHeading />
            <div className="relative mx-auto mt-8 max-w-[520px]">
              <div className="absolute inset-y-2 left-[18px] w-px">
                <MobileJourneyRail staticVisible />
              </div>
              <ol className="flex flex-col gap-5 pl-12">
                {JOURNEY_MILESTONES.map((milestone, index) => (
                  <li key={milestone.id}>
                    <MobileJourneyCard
                      milestone={milestone}
                      index={index}
                      staticVisible
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )
      ) : device === 'tablet' ? (
        <div ref={tabletPinRef} className="experience-pin relative flex h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-8 pb-2 pt-20">
            <ExperienceHeading />
          </div>

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center px-6 pb-8">
            <div className="relative mx-auto h-full min-h-0 w-full max-w-[920px]">
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
        <div ref={desktopPinRef} className="experience-pin relative flex h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-4 pb-2 pt-20 lg:px-12">
            <ExperienceHeading />
          </div>

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 pb-8 lg:px-12">
            <div className="relative mx-auto h-full min-h-0 w-full max-w-7xl">
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
