import { familyTranslations } from './sections/family'
import { providerTranslations } from './sections/provider'
import { generalTranslations } from './sections/general'
import { inviteTranslations } from './sections/invite'

export const translations = {
  family: familyTranslations,
  provider: providerTranslations,
  general: generalTranslations,
  invite: inviteTranslations,
} as const
