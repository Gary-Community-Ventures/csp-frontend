import { Header } from '@/components/header'
import { getProviderTrainings } from '@/lib/api/providerTrainings'
import { ProviderTrainingResponseSchema } from '@/lib/schemas'
import { translations } from '@/translations/text'
import { useText, Text } from '@/translations/wrapper'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ResourceSection } from '../components/resource-section'
import { useProviderContext } from '../wrapper'
import { ExternalLink } from '@/components/external-link'
import type { PropsWithChildren } from 'react'

type ResourceLinkProps = PropsWithChildren<{
  href: string
}>

export function ResourceLink({ href, children }: ResourceLinkProps) {
  return (
    <ExternalLink href={href} className="font-bold text-primary underline">
      {children}
    </ExternalLink>
  )
}

// Define the PDIS courses with their field names and translation keys
const pdisCourses = [
  { key: 'pdis_first_aid_cpr', fieldName: 'pdis_first_aid_cpr_completed_at' },
  {
    key: 'pdis_standard_precautions',
    fieldName: 'pdis_standard_precautions_completed_at',
  },
  {
    key: 'pdis_preventing_child_abuse',
    fieldName: 'pdis_preventing_child_abuse_completed_at',
  },
  {
    key: 'pdis_infant_safe_sleep',
    fieldName: 'pdis_infant_safe_sleep_completed_at',
  },
  {
    key: 'pdis_emergency_preparedness',
    fieldName: 'pdis_emergency_preparedness_completed_at',
  },
  {
    key: 'pdis_injury_prevention',
    fieldName: 'pdis_injury_prevention_completed_at',
  },
  {
    key: 'pdis_preventing_shaken_baby',
    fieldName: 'pdis_preventing_shaken_baby_completed_at',
  },
  {
    key: 'pdis_recognizing_impact_of_bias',
    fieldName: 'pdis_recognizing_impact_of_bias_completed_at',
  },
  {
    key: 'pdis_medication_administration_part_one',
    fieldName: 'pdis_medication_administration_part_one_completed_at',
  },
] as const

export function ResourcesPage() {
  const context = useRouter().options.context
  const { providerInfo } = useProviderContext()
  const text = useText()
  const t = translations.provider.resources

  // Fetch training data (must be called before conditional logic)
  const { data: trainingData } = useQuery({
    queryKey: ['providerTrainings'],
    queryFn: async () => {
      const data = await getProviderTrainings(context)
      return ProviderTrainingResponseSchema.parse(data)
    },
    enabled: providerInfo.type !== 'center', // Only fetch if not a center
  })

  // Calculate completed sections
  const completedSections = useMemo(() => {
    if (!trainingData) return []
    return Object.entries(trainingData)
      .filter(([, value]) => value !== null)
      .map(([key]) => key)
  }, [trainingData])

  // Only show resources page for FFN (Family, Friend, Neighbor)
  if (providerInfo.type !== 'ffn') {
    return (
      <div className="mx-auto mb-5 max-w-4xl p-3 sm:p-5">
        <Header Tag="h1" className="mb-6 text-center text-2xl sm:text-4xl">
          <Text text={t.title} />
        </Header>
        <div className="text-center">
          <p className="text-lg">
            <Text text={t.centerNotRequired} />
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-5 max-w-4xl p-3 sm:p-5">
      {/* Page Header */}
      <Header Tag="h1" className="mb-6 text-center text-2xl sm:text-3xl">
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

        {/* Training Sections */}
        <div className="space-y-6">
          {/* CPR Section */}
          <div className="mt-6 sm:mt-8">
            <Header className="mb-4 text-xl sm:text-2xl">
              {text(t.redCrossTitle)}
            </Header>
          </div>
          {/* CPR Training */}
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

          {/* PDIS Section */}
          <div className="mt-6 sm:mt-8">
            <Header className="mb-4 text-xl sm:text-2xl">
              {text(t.pdisTrainingTitle)}
            </Header>
            <p className="text-sm sm:text-base">
              {text(t.pdisTrainingDescription)}
            </p>
            <div className="bg-[#B8C9BE]/20 border border-primary/20 rounded-lg p-4 mb-6 mt-2 sm:mt-4">
              <p className="font-bold mb-3 text-black">
                {text(t.pdisSection.instructions.title)}
              </p>
              <div className="whitespace-pre-line text-sm text-black">
                {text(t.pdisSection.instructions.steps)}
              </div>
            </div>
          </div>

          {/* Individual PDIS Course Sections */}
          {pdisCourses.map((course, index) => {
            const courseTranslations =
              t.pdisSection.courses[
                course.key as keyof typeof t.pdisSection.courses
              ]

            return (
              <ResourceSection
                key={course.key}
                title={`${text(t.pdisSection.course)} ${index + 1}: ${text(courseTranslations.title)}`}
                sectionId={course.fieldName as any}
                isCompleted={completedSections.includes(course.fieldName)}
                onToggleCompletion={() => {}}
                isReadOnly
              >
                <div className="space-y-4">
                  <p className="text-sm sm:text-base">
                    {text(t.pdisSection.courseInstructions.clickHere)}
                  </p>

                  <div className="pl-4">
                    <ResourceLink href={text(courseTranslations.url)}>
                      {text(t.pdisSection.courseInstructions.openCourse)}
                    </ResourceLink>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-900">
                      <strong>
                        {text(t.pdisSection.courseInstructions.afterCompletion)}
                      </strong>{' '}
                      <span className="font-semibold">
                        support@capcolorado.org
                      </span>
                    </p>
                    {index === pdisCourses.length - 1 && (
                      <p className="text-sm text-amber-800 mt-2 italic">
                        {text(t.pdisSection.courseInstructions.reminder)}
                      </p>
                    )}
                  </div>
                </div>
              </ResourceSection>
            )
          })}
        </div>
      </div>
    </div>
  )
}
