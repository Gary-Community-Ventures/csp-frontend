import { ExternalLink } from '@/components/external-link'
import { Header } from '@/components/header'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { WhiteCard } from '@/components/white-card'
import {
  getProviderTrainings,
  updateProviderTrainings,
} from '@/lib/api/providerTrainings'
import { handleStatusCodes } from '@/lib/api/client'
import {
  ProviderTrainingResponseSchema,
  ProviderTrainingUpdateRequestSchema,
} from '@/lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import { useProviderContext } from '../wrapper'
import { z } from 'zod'
import { toast } from 'sonner'
import { useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import * as Popover from '@radix-ui/react-popover'

type ResourceLinkProps = PropsWithChildren<{
  href: string
}>

function ResourceLink({ href, children }: ResourceLinkProps) {
  return (
    <ExternalLink href={href} className="font-bold text-primary underline">
      {children}
    </ExternalLink>
  )
}

type ResourceSectionProps = PropsWithChildren<{
  title: string
  sectionId: keyof z.infer<typeof ProviderTrainingResponseSchema>
  isCompleted: boolean
  onToggleCompletion: (
    sectionId: keyof z.infer<typeof ProviderTrainingUpdateRequestSchema>
  ) => void
  isReadOnly?: boolean
}>

function ResourceSection({
  title,
  sectionId,
  isCompleted,
  onToggleCompletion,
  isReadOnly = false,
  children,
}: ResourceSectionProps) {
  const text = useText()
  const t = translations.provider.resources
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <WhiteCard
      className={`p-6 transition-all duration-300 border-2 ${
        isCompleted
          ? 'border-green-500 shadow-sm shadow-green-100'
          : 'border-transparent hover:shadow-md'
      }`}
    >
      <div className="flex gap-4">
        {/* Checkbox column */}
        <div className="flex flex-col items-center pt-1">
          {isReadOnly ? (
            <Popover.Root open={showTooltip}>
              <Popover.Trigger asChild>
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    !isCompleted ? 'hover:bg-gray-50' : ''
                  }`}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Checkbox
                    id={sectionId}
                    checked={isCompleted}
                    disabled={isReadOnly}
                    className={`transition-all duration-200 w-6 h-6 cursor-not-allowed opacity-50 ${
                      isCompleted
                        ? 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
                        : ''
                    }`}
                  />
                </div>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={5}
                >
                  <div className="max-w-[200px]">{text(t.cprTooltip)}</div>
                  <Popover.Arrow className="fill-gray-900" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <div
              className={`p-2 rounded-lg transition-all duration-200 ${
                !isCompleted ? 'bg-amber-50 border-2 border-amber-200' : ''
              }`}
            >
              <Checkbox
                id={sectionId}
                checked={isCompleted}
                onCheckedChange={() =>
                  onToggleCompletion(
                    sectionId as keyof z.infer<
                      typeof ProviderTrainingUpdateRequestSchema
                    >
                  )
                }
                disabled={isReadOnly}
                className={`transition-all duration-200 w-6 h-6 cursor-pointer hover:scale-110 ${
                  isCompleted
                    ? 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
                    : ''
                }`}
              />
            </div>
          )}
          {!isCompleted && !isReadOnly && (
            <div className="mt-2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-amber-200"></div>
              <span className="text-[10px] text-amber-700 font-medium mt-1">
                {text(t.checkWhenDone)}
              </span>
            </div>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Header Tag="h3">{title}</Header>
            {isCompleted && (
              <span className="text-green-600 text-sm font-medium">
                ✓ {text(t.completed)}
              </span>
            )}
          </div>
          <div className={`space-y-4 ${isCompleted ? 'opacity-75' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </WhiteCard>
  )
}

export function ResourcesPage() {
  const context = useRouter().options.context
  const queryClient = useQueryClient()
  const { providerInfo } = useProviderContext()
  const text = useText()
  const t = translations.provider.resources

  const { data: trainingData } = useQuery({
    queryKey: ['providerTrainings'],
    queryFn: async () => {
      const res = await getProviderTrainings(context)
      handleStatusCodes(context, res)
      const data = await res.json()
      return ProviderTrainingResponseSchema.parse(data)
    },
  })

  const { mutate: updateTraining } = useMutation({
    mutationFn: async (
      variables: z.infer<typeof ProviderTrainingUpdateRequestSchema>
    ) => {
      const res = await updateProviderTrainings(context, variables)
      handleStatusCodes(context, res)
      const data = await res.json()
      return ProviderTrainingResponseSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['providerTrainings'], data)
      toast.success(text(t.toastSuccess))
    },
  })

  const completedSections = useMemo(() => {
    if (!trainingData) return []
    return Object.entries(trainingData)
      .filter(([, value]) => value !== null)
      .map(([key]) => key)
  }, [trainingData])

  const handleToggleCompletion = (
    sectionId: keyof z.infer<typeof ProviderTrainingUpdateRequestSchema>
  ) => {
    const isCompleted = completedSections.includes(sectionId)
    updateTraining({ [sectionId]: !isCompleted })
  }

  return (
    <div className="mx-auto mb-5 max-w-4xl p-5">
      <Header Tag="h1" className="mb-6 text-center">
        {text(t.pageTitle)}
      </Header>

      <div className="space-y-6">
        <p>{text(t.welcome)}</p>

        <p>{text(t.keyStep)}</p>

        <p className="font-bold">{text(t.pleaseNote)}</p>

        <p className="font-bold">{text(t.readCarefully)}</p>

        <div className="mt-8">
          <Header className="mb-4">{text(t.trainingOverviewTitle)}</Header>
          <p>{text(t.trainingOverviewDescription)}</p>
        </div>

        <div className="space-y-6">
          <ResourceSection
            title={text(t.section1.title)}
            sectionId="cpr_online_training_completed_at"
            isCompleted={completedSections.includes(
              'cpr_online_training_completed_at'
            )}
            onToggleCompletion={handleToggleCompletion}
            isReadOnly
          >
            <p>
              <strong>{text(t.section1.estimatedTime)}</strong>
            </p>
            <p>{text(t.section1.description)}</p>
            <div>
              <p className="font-bold mb-3">
                {text(t.section1.cprInstructions)}
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  {providerInfo.cprTrainingLink ? (
                    <strong>
                      {text(t.section1.goToLink)}{' '}
                      <ResourceLink href={providerInfo.cprTrainingLink}>
                        {providerInfo.cprTrainingLink}
                      </ResourceLink>
                    </strong>
                  ) : (
                    <strong>
                      {text(t.section1.noCprLink)}{' '}
                      <ResourceLink href="mailto:support@capcolorado.org">
                        support@capcolorado.org
                      </ResourceLink>
                    </strong>
                  )}
                </li>
                <li>
                  <strong>{text(t.section1.enterInfo)}</strong>
                </li>
                <li>
                  <strong>
                    {text(t.section1.passwordReset)}{' '}
                    <ResourceLink href="https://www.redcrosslearningcenter.org">
                      https://www.redcrosslearningcenter.org
                    </ResourceLink>
                    {text(t.section1.selectLogin)}
                  </strong>
                </li>
                <li>
                  <strong>{text(t.section1.completeCourse)}</strong>
                </li>
                <li>
                  <strong>{text(t.section1.shareCertificate)}</strong>{' '}
                  {text(t.section1.certificateDescription)}
                </li>
                <li>
                  <strong>{text(t.section1.important)}</strong>{' '}
                  {text(t.section1.emailCopy)}{' '}
                  <strong>support@capcolorado.org</strong>{' '}
                  {text(t.section1.emailCopyReason)}
                </li>
              </ul>
            </div>
          </ResourceSection>

          <ResourceSection
            title={text(t.section2.title)}
            sectionId="child_safety_module_training_completed_at"
            isCompleted={completedSections.includes(
              'child_safety_module_training_completed_at'
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>{text(t.section2.estimatedTime)}</strong>
            </p>
            <p>{text(t.section2.description)}</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{text(t.section2.overviewLink)}</strong>{' '}
                <ResourceLink href={text(t.section2.overviewUrl)}>
                  {text(t.section2.overviewUrl)}
                </ResourceLink>
                <ul className="mt-2 list-none">
                  <li className="italic">
                    {text(t.section2.clickInstruction)}
                  </li>
                </ul>
              </li>
            </ul>
            <div className="ml-6">
              <p className="font-bold mb-2">{text(t.section2.topicsTitle)}</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>{text(t.section2.abusiveHeadTrauma)}</strong>
                </li>
                <li>
                  <strong>{text(t.section2.childAbuse)}</strong>
                </li>
                <li>
                  <strong>{text(t.section2.childDevelopment)}</strong>
                </li>
                <li>
                  <strong>{text(t.section2.medicationAdmin)}</strong>
                </li>
                <li>
                  <strong>{text(t.section2.foodAllergies)}</strong>
                </li>
              </ul>
            </div>
          </ResourceSection>

          <ResourceSection
            title={text(t.section3.title)}
            sectionId="safe_sleep_for_infants_training_completed_at"
            isCompleted={completedSections.includes(
              'safe_sleep_for_infants_training_completed_at'
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>{text(t.section3.estimatedTime)}</strong>
            </p>
            <p>{text(t.section3.description)}</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{text(t.section3.nihResources)}</strong>
                <ul className="mt-2 list-none space-y-1">
                  <li>
                    <strong>{text(t.section3.link)}</strong>{' '}
                    <ResourceLink href={text(t.section3.nihUrl)}>
                      {text(t.section3.nihUrl)}
                    </ResourceLink>
                  </li>
                  <li>
                    <strong>{text(t.section3.estimatedTimeReading)}</strong>
                    <ul className="list-disc space-y-1 pl-6 mt-2">
                      <li>
                        <strong>{text(t.section3.reducingRisk)}</strong>
                      </li>
                      <li>
                        <strong>{text(t.section3.backSleeping)}</strong>
                      </li>
                      <li>
                        <strong>{text(t.section3.environment)}</strong>
                      </li>
                      <li>
                        <strong>{text(t.section3.tummyTime)}</strong>
                      </li>
                      <li>
                        <strong>{text(t.section3.faq)}</strong>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </ResourceSection>

          <ResourceSection
            title={text(t.section4.title)}
            sectionId="home_safety_and_injury_prevention_training_completed_at"
            isCompleted={completedSections.includes(
              'home_safety_and_injury_prevention_training_completed_at'
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>{text(t.section4.estimatedTime)}</strong>
            </p>
            <p>{text(t.section4.description)}</p>
            <div className="ml-6">
              <p className="font-bold mb-2">{text(t.section4.topicsTitle)}</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <ResourceLink href="https://headstart.gov/publication/injury-prevention-starts-home">
                    {text(t.section4.injuryPrevention)}
                  </ResourceLink>
                  <strong>{text(t.section4.timeEstimate)}</strong>
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/publication/poisoning-prevention-home-safety-tip-sheet">
                    {text(t.section4.poisoningPrevention)}
                  </ResourceLink>
                  <strong>{text(t.section4.timeEstimate)}</strong>
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/publication/home-safety">
                    {text(t.section4.homeSafety)}
                  </ResourceLink>
                  <strong>{text(t.section4.timeEstimate)}</strong>
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/physical-health/article/health-tips-families-series">
                    {text(t.section4.healthTips)}
                  </ResourceLink>
                  <strong>{text(t.section4.timeEstimate)}</strong>
                </li>
              </ul>
            </div>
          </ResourceSection>
        </div>
      </div>
    </div>
  )
}
