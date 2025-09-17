import { Header } from '@/components/header'
import {
  getProviderTrainings,
  updateProviderTrainings,
} from '@/lib/api/providerTrainings'
import { handleStatusCodes } from '@/lib/api/client'
import {
  ProviderTrainingResponseSchema,
  ProviderTrainingUpdateRequestSchema,
} from '@/lib/schemas'
import { translations } from '@/translations/text'
import { useText } from '@/translations/wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { ResourceLink } from '../components/resource-link'
import { ResourceSection } from '../components/resource-section'
import { useProviderContext } from '../wrapper'

export function ResourcesPage() {
  const context = useRouter().options.context
  const queryClient = useQueryClient()
  const { providerInfo } = useProviderContext()
  const text = useText()
  const t = translations.provider.resources

  // Fetch training data
  const { data: trainingData } = useQuery({
    queryKey: ['providerTrainings'],
    queryFn: async () => {
      const res = await getProviderTrainings(context)
      handleStatusCodes(context, res)
      const data = await res.json()
      return ProviderTrainingResponseSchema.parse(data)
    },
  })

  // Update training mutation
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

  // Calculate completed sections
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
    <div className="mx-auto mb-5 max-w-4xl p-3 sm:p-5">
      {/* Page Header */}
      <Header Tag="h1" className="mb-6 text-center text-2xl sm:text-4xl">
        {text(t.pageTitle)}
      </Header>

      {/* Introduction */}
      <div className="space-y-4 sm:space-y-6">
        <p className="text-sm sm:text-base">{text(t.welcome)}</p>
        <p className="text-sm sm:text-base">{text(t.keyStep)}</p>
        <p className="font-bold text-sm sm:text-base">{text(t.pleaseNote)}</p>
        <p className="font-bold text-sm sm:text-base">
          {text(t.readCarefully)}
        </p>

        {/* Training Overview */}
        <div className="mt-6 sm:mt-8">
          <Header className="mb-4 text-xl sm:text-3xl">
            {text(t.trainingOverviewTitle)}
          </Header>
          <p className="text-sm sm:text-base">
            {text(t.trainingOverviewDescription)}
          </p>
        </div>

        {/* Training Sections */}
        <div className="space-y-6">
          <ResourceSection
            title={text(t.section1.title)}
            sectionId="cpr_online_training_completed_at"
            isCompleted={
              completedSections.includes('cpr_online_training_completed_at') ||
              providerInfo.cprCertified === true
            }
            onToggleCompletion={() => {}}
            isReadOnly
          >
            {providerInfo.cprCertified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">
                  ✓ You are already CPR certified - no additional training
                  required.
                </p>
              </div>
            ) : (
              <>
                <p>
                  <strong>{text(t.section1.estimatedTime)}</strong>
                </p>
                <p>{text(t.section1.description)}</p>
              </>
            )}
            <div>
              <p className="font-bold mb-3">
                {text(t.section1.cprInstructions)}
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  {providerInfo.cprTrainingLink ? (
                    <>
                      {text(t.section1.goToLink)}{' '}
                      <ResourceLink href={providerInfo.cprTrainingLink}>
                        {providerInfo.cprTrainingLink}
                      </ResourceLink>
                    </>
                  ) : (
                    <>
                      {text(t.section1.noCprLink)}{' '}
                      <ResourceLink href="mailto:support@capcolorado.org">
                        support@capcolorado.org
                      </ResourceLink>
                    </>
                  )}
                </li>
                <li>{text(t.section1.enterInfo)}</li>
                <li>
                  {text(t.section1.passwordReset)}{' '}
                  <ResourceLink href="https://www.redcrosslearningcenter.org">
                    https://www.redcrosslearningcenter.org
                  </ResourceLink>{' '}
                  {text(t.section1.selectLogin)}
                </li>
                <li>{text(t.section1.completeCourse)}</li>
                <li>
                  {text(t.section1.shareCertificate)}{' '}
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

          {/* Section 2: Child Safety Module */}
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

          {/* Section 3: Safe Sleep for Infants */}
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

          {/* Section 4: Home Safety & Injury Prevention */}
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
