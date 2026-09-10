import { useRef, type ComponentType } from 'react'
import SectionHeading from '@/components/SectionHeading'
import BrandedMarker from '@/components/experience/BrandedMarker'
import JourneyPath from '@/components/experience/JourneyPath'
import MilestoneCard, { type MilestoneCardSize } from '@/components/experience/MilestoneCard'
import MobileBrandedMarker from '@/components/experience/MobileBrandedMarker'
import MobileJourneyPath from '@/components/experience/MobileJourneyPath'
import TabletJourneyPath from '@/components/experience/TabletJourneyPath'
import { JOURNEY_MILESTONES } from '@/components/experience/journey-config'
import { useExperienceJourney } from '@/hooks/use-experience-journey'
import { useMobileExperienceJourney } from '@/hooks/use-mobile-experience-journey'
import { useTabletExperienceJourney } from '@/hooks/use-tablet-experience-journey'
import { usePinnedScene } from '@/hooks/use-pinned-scene'
import { cn } from '@/lib/utils'

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

function RailNode({ index, staticVisible }: { index: number; staticVisible: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span
        data-journey-node={index}
        className="relative flex h-3 w-3 items-center justify-center rounded-full border border-cyber-blue/45 bg-cyber-bg"
        style={{ opacity: staticVisible ? 1 : 0.45 }}
      >
        <span
          data-journey-node-dot={index}
          className="h-1.5 w-1.5 rounded-full bg-cyber-blue"
          style={{ opacity: staticVisible ? 1 : 0 }}
        />
      </span>
    </div>
  )
}

function JourneyStage({
  Path,
  Marker,
  size,
  gapClass,
  railClass,
  staticVisible,
}: {
  Path: ComponentType<{ staticVisible?: boolean }>
  Marker: ComponentType<{ staticVisible?: boolean }>
  size: MilestoneCardSize
  gapClass: string
  railClass: string
  staticVisible: boolean
}) {
  return (
    <div className="flex h-full min-h-0 w-full">
      <div className={cn('relative z-30 shrink-0', railClass)}>
        <Path staticVisible={staticVisible} />
        <div className={cn('relative z-10 flex h-full flex-col py-1', gapClass)}>
          {JOURNEY_MILESTONES.map((milestone, index) => (
            <RailNode key={milestone.id} index={index} staticVisible={staticVisible} />
          ))}
        </div>
        <Marker staticVisible={staticVisible} />
      </div>

      <div className={cn('relative z-20 flex min-w-0 flex-1 flex-col py-1', gapClass)}>
        {JOURNEY_MILESTONES.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
            size={size}
            staticVisible={staticVisible}
          />
        ))}
      </div>
    </div>
  )
}

export default function ExperiencePinned() {
  const desktopPinRef = useRef<HTMLDivElement>(null)
  const tabletPinRef = useRef<HTMLDivElement>(null)
  const mobilePinRef = useRef<HTMLDivElement>(null)
  const { device, scrollEnabled } = usePinnedScene()
  const staticVisible = !scrollEnabled

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
          <div className="relative z-30 shrink-0 px-4 pb-1 pt-14">
            <ExperienceHeading showDescription={false} />
          </div>
          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-lg flex-1 px-3 pb-4">
            <JourneyStage
              Path={MobileJourneyPath}
              Marker={MobileBrandedMarker}
              size="mobile"
              gapClass="gap-2"
              railClass="w-10"
              staticVisible={staticVisible}
            />
          </div>
        </div>
      ) : device === 'tablet' ? (
        <div ref={tabletPinRef} className="experience-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-6 pb-1 pt-12">
            <ExperienceHeading showDescription={false} />
          </div>
          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-3xl flex-1 px-5 pb-5">
            <JourneyStage
              Path={TabletJourneyPath}
              Marker={BrandedMarker}
              size="tablet"
              gapClass="gap-2"
              railClass="w-12"
              staticVisible={staticVisible}
            />
          </div>
        </div>
      ) : (
        <div ref={desktopPinRef} className="experience-pin relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-cyber-bg">
          <div className="relative z-30 shrink-0 px-4 pb-1 pt-20 lg:px-12">
            <ExperienceHeading showDescription />
          </div>
          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 px-6 pb-6 lg:px-10">
            <JourneyStage
              Path={JourneyPath}
              Marker={BrandedMarker}
              size="desktop"
              gapClass="gap-3 lg:gap-4"
              railClass="w-12 lg:w-14"
              staticVisible={staticVisible}
            />
          </div>
        </div>
      )}
    </section>
  )
}
