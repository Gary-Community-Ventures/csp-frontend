import { PathwaysSection } from '@/components/pathways-section'
import { translations } from '@/translations/text'

export function FamilyResourcesPage() {
  return (
    <div className="p-5">
      <section>
        <PathwaysSection translations={translations.pathways.familyResources} />
      </section>
    </div>
  )
}
