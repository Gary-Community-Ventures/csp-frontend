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
import { useMemo } from 'react'
import { useProviderContext } from '../wrapper'
import { z } from 'zod'
import { toast } from 'sonner'
import { useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'

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
  
  return (
    <WhiteCard>
      <div className="flex items-center justify-between">
        <Header Tag="h3">{title}</Header>
        <div className="flex items-center space-x-2 group">
          <div className="flex items-center justify-center w-5 h-5">
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
              className={`transition-all duration-200 ${!isReadOnly ? 'cursor-pointer hover:scale-110' : ''}`}
            />
          </div>
          <Label 
            htmlFor={sectionId} 
            className={`text-sm font-medium transition-colors duration-200 ${!isReadOnly ? 'cursor-pointer group-hover:text-primary' : 'cursor-not-allowed opacity-50'}`}
          >
            <div className="relative h-5 min-w-[120px]">
              <span className={`absolute inset-0 transition-all duration-300 ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                {text(t.completed)}
              </span>
              <span className={`absolute inset-0 transition-all duration-300 ${!isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                {text(t.markAsComplete)}
              </span>
            </div>
          </Label>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
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
