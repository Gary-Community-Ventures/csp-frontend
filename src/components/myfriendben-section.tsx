import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { ExternalLink } from '@/components/external-link'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Button } from '@/components/ui/button'

const MYFRIENDBEN_URL = 'https://screener.myfriendben.org/co/step-1'
const MYFRIENDBEN_TRACKING_ID = 'myfriendben_get_started'

export function MyFriendBenSection() {
  const t = translations.myFriendBen.resources

  return (
    <section>
      <Header id="myfriendben" className="scroll-mt-24">
        <Text text={t.title} />
      </Header>
      <WhiteCard>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/mfb_log.png"
              alt="MyFriendBen"
              className="h-16 object-contain"
            />
          </div>

          <p>
            <Text text={t.description} />
          </p>

          <div className="pt-2">
            <Button asChild>
              <ExternalLink
                href={MYFRIENDBEN_URL}
                trackingId={MYFRIENDBEN_TRACKING_ID}
              >
                <Text text={t.getStarted} />
              </ExternalLink>
            </Button>
          </div>
        </div>
      </WhiteCard>
    </section>
  )
}
