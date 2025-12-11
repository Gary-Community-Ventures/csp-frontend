import { useProviderContext } from '../wrapper'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { ExternalLink } from '@/components/external-link'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function ResourcesPage() {
  const { providerInfo } = useProviderContext()
  const t = translations.provider.resources

  // Only show for FFN providers
  if (providerInfo.type !== 'ffn' && providerInfo.type !== 'lhb') {
    return (
      <div className="p-5">
        <section>
          <Header>
            <Text text={t.notAvailable.title} />
          </Header>
          <WhiteCard>
            <p>
              <Text text={t.notAvailable.message} />
            </p>
          </WhiteCard>
        </section>
      </div>
    )
  }

  return (
    <div className="p-5">
      <section>
        <Header>
          <span className="flex items-center gap-2">
            <span role="img" aria-label="money">
              {t.header.emoji}
            </span>
            <Text text={t.header.title} />
          </span>
        </Header>
        <WhiteCard>
          <div className="space-y-4">
            <p className="font-semibold">
              <Text text={t.intro.paragraph1} />
            </p>

            <p>
              <Text text={t.intro.paragraph2} />
            </p>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.qualify.title} />
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <Text text={t.qualify.requirement1} />
                </li>
                <li>
                  <Text text={t.qualify.requirement2} />
                </li>
                <li>
                  <Text text={t.qualify.requirement3} />
                </li>
                <li>
                  <Text text={t.qualify.requirement4} />
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.steps.title} />
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <Text text={t.steps.step1.part1} />{' '}
                  <ExternalLink
                    href="https://www.coloradoshinespdis.com/s/pdislogin"
                    className="text-primary underline"
                  >
                    <Text text={t.steps.step1.pdisLink} />
                  </ExternalLink>{' '}
                  <Text text={t.steps.step1.part2} />
                </li>
                <li>
                  <Text text={t.steps.step2} />
                </li>
                <li>
                  <Text text={t.steps.step3.part1} />{' '}
                  <ExternalLink
                    href="https://tax.colorado.gov/sites/tax/files/documents/DR1217_2025.pdf"
                    className="text-primary underline"
                  >
                    <Text text={t.steps.step3.formLink} />
                  </ExternalLink>
                  <Text text={t.steps.step3.part2} />
                </li>
              </ol>
            </div>

            <div>
              <p>
                <span className="font-semibold">
                  <Text text={t.learnMore.title} />
                </span>{' '}
                <ExternalLink
                  href="https://cdec.colorado.gov/care-worker-tax-credit"
                  className="text-primary underline"
                >
                  <Text text={t.learnMore.officialInfo} />
                </ExternalLink>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                <Text text={t.freeTaxHelp.title} />
              </h3>
              <ul className="space-y-1">
                <li>
                  <ExternalLink
                    href="https://www.getaheadcolorado.org/"
                    className="text-primary underline"
                  >
                    <Text text={t.freeTaxHelp.getAheadColorado} />
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://taxhelpco.org/"
                    className="text-primary underline"
                  >
                    <Text text={t.freeTaxHelp.taxHelpColorado} />
                  </ExternalLink>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              <Text text={t.questions.part1} />{' '}
              <ExternalLink
                href="https://cdec.colorado.gov/care-worker-tax-credit"
                className="text-primary underline"
              >
                <Text text={t.questions.cdecLink} />
              </ExternalLink>{' '}
              <Text text={t.questions.part2} />
            </p>
          </div>
        </WhiteCard>
      </section>
    </div>
  )
}
