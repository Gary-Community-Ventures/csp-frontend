import { MyFriendBenSection } from '@/components/myfriendben-section'
import { PathwaysSection } from '@/components/pathways-section'
import { translations } from '@/translations/text'

export function FamilyResourcesPage() {
  return (
    <div className="p-5 space-y-6">
      <MyFriendBenSection />

      <section>
        <PathwaysSection translations={translations.pathways.familyResources} />
      </section>
    </div>
  )
}
