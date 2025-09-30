import { Header } from '@/components/header'
import { Text, type TranslatableText } from '@/translations/wrapper'
import { Button } from '@/components/ui/button'
import { Link, type LinkProps } from '@tanstack/react-router'
import { WhiteCard } from '@/components/white-card'
import { translations } from '@/translations/text'

type InviteConfirmationProps = {
  email: string
  phone: string
  backLinkProps: LinkProps
  backLinkText: TranslatableText
}

export function InviteConfirmation({
  email,
  phone,
  backLinkProps,
  backLinkText,
}: InviteConfirmationProps) {
  const t = translations.general.inviteConfirmation

  return (
    <section className="p-5">
      <Header Tag="h1" className="py-5">
        <Text text={t.header} />
      </Header>
      <WhiteCard className="flex flex-col gap-3 p-5 text-center">
        <p>
          <Text text={t.successMessage} />
        </p>
        <p>
          <span className="font-bold">
            <Text text={t.emailLabel} />
          </span>{' '}
          {email}
        </p>
        {phone !== '' && (
          <p>
            <span className="font-bold">
              <Text text={t.phoneLabel} />
            </span>{' '}
            {phone}
          </p>
        )}
        <p className="mt-10">
          <Text text={t.inviteeNextStep} />
        </p>
      </WhiteCard>
      <Button className="w-full mt-10" asChild>
        <Link {...backLinkProps}>
          <Text text={backLinkText} />
        </Link>
      </Button>
    </section>
  )
}
