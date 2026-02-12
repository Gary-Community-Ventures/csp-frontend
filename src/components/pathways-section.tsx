import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { ExternalLink } from '@/components/external-link'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

const EXTERNAL_URLS = {
  appStore:
    'https://apps.apple.com/us/app/pathways-org-baby-milestones/id1630421307',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.pathwaysapp',
  website: 'https://pathways.org/mobile-app',
  scheduling:
    'https://meetings-na2.hubspot.com/james-lukens/cap-pathways-support-call',
}

const TRACKING_IDS = {
  appStore: 'pathways_app_store',
  googlePlay: 'pathways_google_play',
  website: 'pathways_website',
  scheduling: 'pathways_scheduling',
}

type PathwaysSectionProps = {
  translations:
    | typeof translations.pathways.familyResources
    | typeof translations.pathways.providerResources
}

export function PathwaysSection({ translations: t }: PathwaysSectionProps) {
  return (
    <>
      <Header>
        <Text text={t.title} />
      </Header>
      <WhiteCard>
        <div className="space-y-6">
          <p className="font-semibold">
            <Text text={t.intro.headline} />
          </p>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              <Text text={t.whatIsIt.title} />
            </h3>
            <p className="mb-3">
              <ExternalLink
                href={EXTERNAL_URLS.website}
                trackingId={TRACKING_IDS.website}
                className="text-primary underline"
              >
                <Text text={t.whatIsIt.pathwaysLink} />
              </ExternalLink>{' '}
              <Text text={t.whatIsIt.descriptionAfterLink} />
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Text text={t.whatIsIt.benefit1} />
              </li>
              <li>
                <Text text={t.whatIsIt.benefit2} />
              </li>
              <li>
                <Text text={t.whatIsIt.benefit3} />
              </li>
              <li>
                <Text text={t.whatIsIt.benefit4} />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              <Text text={t.whyTry.title} />
            </h3>
            <p>
              <Text text={t.whyTry.description} />
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              <Text text={t.tryPathways.title} />
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p className="mb-2">
                  <Text text={t.tryPathways.downloadTitle} />
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <ExternalLink
                      href={EXTERNAL_URLS.appStore}
                      trackingId={TRACKING_IDS.appStore}
                      className="text-primary underline"
                    >
                      <Text text={t.tryPathways.appStore} />
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink
                      href={EXTERNAL_URLS.googlePlay}
                      trackingId={TRACKING_IDS.googlePlay}
                      className="text-primary underline"
                    >
                      <Text text={t.tryPathways.googlePlay} />
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink
                      href={EXTERNAL_URLS.website}
                      trackingId={TRACKING_IDS.website}
                      className="text-primary underline"
                    >
                      <Text text={t.tryPathways.websiteLink} />
                    </ExternalLink>
                  </li>
                </ul>
              </li>
              <li>
                <Text text={t.tryPathways.step1} />
              </li>
              <li>
                <Text text={t.tryPathways.step2} />
              </li>
              <li>
                <Text text={t.tryPathways.step3} />
              </li>
            </ol>
          </div>

          <p className="text-sm text-gray-600">
            <Text text={t.followUp} />
          </p>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-lg mb-2">
              <Text text={t.support.title} />
            </h3>
            <ExternalLink
              href={EXTERNAL_URLS.scheduling}
              trackingId={TRACKING_IDS.scheduling}
              className="text-primary underline"
            >
              <Text text={t.support.scheduleCall} />
            </ExternalLink>
          </div>
        </div>
      </WhiteCard>
    </>
  )
}
