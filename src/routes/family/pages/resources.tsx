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

export function FamilyResourcesPage() {
  const t = translations.family.resources

  return (
    <div className="p-5">
      <section>
        <Header>
          <Text text={t.header.title} />
        </Header>
        <WhiteCard>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.intro.title} />
              </h3>
              <p>
                <Text text={t.intro.description} />
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.downloadApp.title} />
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <ExternalLink
                    href={EXTERNAL_URLS.appStore}
                    className="text-primary underline"
                  >
                    <Text text={t.downloadApp.appStore} />
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href={EXTERNAL_URLS.googlePlay}
                    className="text-primary underline"
                  >
                    <Text text={t.downloadApp.googlePlay} />
                  </ExternalLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.learnMore.title} />
              </h3>
              <p>
                <ExternalLink
                  href={EXTERNAL_URLS.website}
                  className="text-primary underline"
                >
                  <Text text={t.learnMore.websiteLink} />
                </ExternalLink>
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.support.title} />
              </h3>
              <p className="mb-3">
                <Text text={t.support.description} />
              </p>
              <ExternalLink
                href={EXTERNAL_URLS.scheduling}
                className="text-primary underline"
              >
                <Text text={t.support.scheduleCall} />
              </ExternalLink>
            </div>
          </div>
        </WhiteCard>
      </section>
    </div>
  )
}
