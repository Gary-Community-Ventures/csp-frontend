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
    sectionId: keyof z.infer<typeof ProviderTrainingUpdateRequestSchema>,
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
  return (
    <WhiteCard>
      <div className="flex items-center justify-between">
        <Header Tag="h3">{title}</Header>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={sectionId}
            checked={isCompleted}
            onCheckedChange={() =>
              onToggleCompletion(
                sectionId as keyof z.infer<
                  typeof ProviderTrainingUpdateRequestSchema
                >,
              )
            }
            disabled={isReadOnly}
          />
          <Label htmlFor={sectionId} className="text-sm font-medium">
            Mark as Complete
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
      variables: z.infer<typeof ProviderTrainingUpdateRequestSchema>,
    ) => {
      const res = await updateProviderTrainings(context, variables)
      handleStatusCodes(context, res)
      const data = await res.json()
      return ProviderTrainingResponseSchema.parse(data)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['providerTrainings'], data)
      toast.success('Training status updated')
    },
  })

  const completedSections = useMemo(() => {
    if (!trainingData) return []
    return Object.entries(trainingData)
      .filter(([, value]) => value !== null)
      .map(([key]) => key)
  }, [trainingData])

  const handleToggleCompletion = (
    sectionId: keyof z.infer<typeof ProviderTrainingUpdateRequestSchema>,
  ) => {
    const isCompleted = completedSections.includes(sectionId)
    updateTraining({ [sectionId]: !isCompleted })
  }

  return (
    <div className="mx-auto mb-5 max-w-4xl p-5">
      <Header Tag="h1" className="mb-6 text-center">
        Childcare Affordability Pilot (CAP) Training Module
      </Header>

      <div className="space-y-6">
        <p>
          Welcome to the Childcare Affordability Pilot (CAP)! We're thrilled to
          have you join us. This small invite-only test is all about supporting
          you as you provide vital care to children in Colorado.
        </p>

        <p>
          A key step to fully participate in the CAP program and{' '}
          <strong>receive payments from families</strong> is to complete
          mandatory health and safety training. We've put together a series of
          online videos and readings that you can access from home.
        </p>

        <p className="font-bold">
          Please note: All training outlined below must be completed PRIOR TO
          FORMAL APPROVAL into the Childcare Affordability Pilot (CAP).
        </p>

        <p className="font-bold">
          Please read these instructions carefully, especially about the CPR
          training, as it has a unique process.
        </p>

        <div className="mt-8">
          <Header className="mb-4">Your Training Overview</Header>
          <p>
            We've organized your training into four main sections. Please
            complete these in the order they are presented, as they build upon
            important knowledge for providing the best care.
          </p>
        </div>

        <div className="space-y-6">
          <ResourceSection
            title="Section 1: Adult, Child, and Baby First Aid/CPR/AED Online"
            sectionId="cpr_online_training_completed_at"
            isCompleted={completedSections.includes(
              'cpr_online_training_completed_at',
            )}
            onToggleCompletion={handleToggleCompletion}
            isReadOnly
          >
            <p>
              <strong>Estimated Time:</strong> Approximately 3 hours, 50 minutes
            </p>
            <p>
              This training is vital for knowing how to respond in a medical
              emergency. For the CAP small invite-only test, you will complete
              the online portion of this course to fulfill the requirement.
            </p>
            <div>
              <p className="font-bold mb-3">
                Instructions for CPR Training (PLEASE READ CAREFULLY):
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  {providerInfo.cprTrainingLink ? (
                    <strong>
                      Go to this link:{' '}
                      <ResourceLink href={providerInfo.cprTrainingLink}>
                        {providerInfo.cprTrainingLink}
                      </ResourceLink>
                    </strong>
                  ) : (
                    <strong>
                      No CPR training link available. Please contact{' '}
                      <ResourceLink href="mailto:support@capcolorado.org">
                        support@capcolorado.org
                      </ResourceLink>
                    </strong>
                  )}
                </li>
                <li>
                  <strong>
                    Enter name, email address and phone number.{' '}
                    <em>
                      Do not change the auto-populated voucher number on the
                      registration page.
                    </em>
                  </strong>
                </li>
                <li>
                  <strong>
                    You will receive an email to reset their password. If an
                    email isn't received, navigate to{' '}
                    <ResourceLink href="https://www.redcrosslearningcenter.org">
                      https://www.redcrosslearningcenter.org
                    </ResourceLink>
                    , select "Login" and then select "Forgot Password".
                  </strong>
                </li>
                <li>
                  <strong>Access and complete the online course.</strong>
                </li>
                <li>
                  <strong>Share Your Certificate:</strong> Once you have
                  successfully completed the online course, you will receive a
                  completion certificate or confirmation.
                </li>
                <li>
                  <strong>IMPORTANT:</strong> Please email a copy (photo or
                  scan) of your completed certificate to:{' '}
                  <strong>support@capcolorado.org</strong> as soon as you
                  receive it. This is essential for verifying your training for
                  CAP approval.
                </li>
              </ul>
            </div>
          </ResourceSection>

          <ResourceSection
            title="Section 2: Child Safety Module (Videos)"
            sectionId="child_safety_module_training_completed_at"
            isCompleted={completedSections.includes(
              'child_safety_module_training_completed_at',
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>Estimated Time:</strong> Approximately 40 minutes (total
              for all resources in this section)
            </p>
            <p>
              This module provides critical information on keeping children
              safe.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Overview Link:</strong>{' '}
                <ResourceLink href="https://headstart.gov/safety-practices/article/child-safety">
                  https://headstart.gov/safety-practices/article/child-safety
                </ResourceLink>
                <ul className="mt-2 list-none">
                  <li className="italic">
                    From this page, click on each topic below to view the
                    specific video or resource.
                  </li>
                </ul>
              </li>
            </ul>
            <div className="ml-6">
              <p className="font-bold mb-2">Topics & Estimated Times:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Abusive Head Trauma (Video):</strong> ~6 minutes
                </li>
                <li>
                  <strong>Child Abuse and Maltreatment (Video):</strong> ~7
                  minutes
                </li>
                <li>
                  <strong>Child Development (Video):</strong> ~7 minutes
                </li>
                <li>
                  <strong>Medication Administration (Video):</strong> ~7
                  minutes
                </li>
                <li>
                  <strong>Food Allergies (Video):</strong> ~7 minutes
                </li>
              </ul>
            </div>
          </ResourceSection>

          <ResourceSection
            title="Section 3: Safe Sleep for Infants (Videos & Readings)"
            sectionId="safe_sleep_for_infants_training_completed_at"
            isCompleted={completedSections.includes(
              'safe_sleep_for_infants_training_completed_at',
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>Estimated Time:</strong> Approximately 30 minutes
            </p>
            <p>
              Learn vital information to ensure a safe sleep environment for
              infants and reduce risks.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>
                  NIH Safe to Sleep® Campaign Resources (Readings):
                </strong>
                <ul className="mt-2 list-none space-y-1">
                  <li>
                    <strong>Link:</strong>{' '}
                    <ResourceLink href="https://safetosleep.nichd.nih.gov/safe-sleep">
                      https://safetosleep.nichd.nih.gov/safe-sleep
                    </ResourceLink>
                  </li>
                  <li>
                    <strong>Estimated Time:</strong> ~20-30 minutes:
                    <ul className="list-disc space-y-1 pl-6 mt-2">
                      <li>
                        <strong>Reducing Risk</strong>
                      </li>
                      <li>
                        <strong>Back Sleeping</strong>
                      </li>
                      <li>
                        <strong>
                          Environment (safe cribs, no loose bedding)
                        </strong>
                      </li>
                      <li>
                        <strong>Tummy Time</strong> (for development, while not
                        sleep-related, often covered with SIDS)
                      </li>
                      <li>
                        <strong>FAQ</strong>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </ResourceSection>

          <ResourceSection
            title="Section 4: Home Safety & Injury Prevention (Readings)"
            sectionId="home_safety_and_injury_prevention_training_completed_at"
            isCompleted={completedSections.includes(
              'home_safety_and_injury_prevention_training_completed_at',
            )}
            onToggleCompletion={handleToggleCompletion}
          >
            <p>
              <strong>Estimated Time:</strong> Approximately 45 minutes - 1 hour
            </p>
            <p>
              Ensure the care environment is safe and free from common hazards.
            </p>
            <div className="ml-6">
              <p className="font-bold mb-2">Topics & Estimated Times:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <ResourceLink href="https://headstart.gov/publication/injury-prevention-starts-home">
                    Injury Prevention Starts at Home
                  </ResourceLink>
                  <strong>:</strong> ~10-15 minutes
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/publication/poisoning-prevention-home-safety-tip-sheet">
                    Poisoning Prevention Home Safety Tip Sheet
                  </ResourceLink>
                  <strong>:</strong> ~10-15 minutes
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/publication/home-safety">
                    Home Safety
                  </ResourceLink>
                  <strong>:</strong> ~10-15 minutes
                </li>
                <li>
                  <ResourceLink href="https://headstart.gov/physical-health/article/health-tips-families-series">
                    Health Tips for Families Series
                  </ResourceLink>
                  <strong>:</strong> ~10-15 minutes
                </li>
              </ul>
            </div>
          </ResourceSection>
        </div>
      </div>
    </div>
  )
}