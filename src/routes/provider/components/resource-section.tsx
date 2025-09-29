import { Header } from '@/components/header'
import { Checkbox } from '@/components/ui/checkbox'
import { WhiteCard } from '@/components/white-card'
import { ProviderTrainingResponseSchema } from '@/lib/schemas'
import { translations } from '@/translations/text'
import { useText } from '@/translations/wrapper'
import * as Popover from '@radix-ui/react-popover'
import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { z } from 'zod'

type TrainingSection = keyof z.infer<typeof ProviderTrainingResponseSchema>

type ResourceSectionProps = PropsWithChildren<{
  title: string
  sectionId: TrainingSection
  isCompleted: boolean
  onToggleCompletion: (sectionId: TrainingSection) => void
  isReadOnly?: boolean
}>

export function ResourceSection({
  title,
  sectionId,
  isCompleted,
  onToggleCompletion,
  isReadOnly = false,
  children,
}: ResourceSectionProps) {
  const text = useText()
  const t = translations.provider.resources
  const [showTooltip, setShowTooltip] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isCompleted)

  // Auto-collapse/expand when completion status changes
  React.useEffect(() => {
    setIsCollapsed(isCompleted)
  }, [isCompleted])

  const handleCheckboxChange = () => {
    if (!isReadOnly) {
      onToggleCompletion(sectionId)
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Checkbox classes
  const checkboxClassName = `
    opacity-100 disabled:!opacity-100 transition-all duration-200 w-5 h-5 sm:w-6 sm:h-6
    ${isReadOnly ? 'cursor-not-allowed ' : 'cursor-pointer hover:scale-110'}
    ${isCompleted ? 'data-[state=checked]:bg-primary data-[state=checked]:border-primary' : ''}
  `.trim()

  const checkboxWrapperClassName = `
    p-2 rounded-lg transition-all duration-200
    ${!isReadOnly && !isCompleted ? 'bg-tertiary-background border-2 border-tertiary-background' : ''}
    ${isReadOnly && !isCompleted ? 'hover:bg-gray-50' : ''}
  `.trim()

  return (
    <WhiteCard
      className={`p-4 sm:p-6 transition-all duration-300 border-2 ${
        isCompleted
          ? 'border-primary shadow-sm shadow-quaternary'
          : 'border-transparent hover:shadow-md'
      }`}
    >
      <div>
        {/* Header row with checkbox and title */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Checkbox column */}
          <div className="flex flex-col items-center relative">
            {isReadOnly ? (
              // Read-only checkbox with tooltip
              <Popover.Root open={showTooltip && !isCompleted}>
                <Popover.Trigger asChild>
                  <div
                    className={checkboxWrapperClassName}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <Checkbox
                      id={sectionId}
                      checked={isCompleted}
                      disabled={isReadOnly}
                      className={checkboxClassName}
                    />
                  </div>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95"
                    sideOffset={5}
                  >
                    <div className="max-w-[200px]">{text(t.cprTooltip)}</div>
                    <Popover.Arrow className="fill-gray-900" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            ) : (
              // Interactive checkbox
              <div className={checkboxWrapperClassName}>
                <Checkbox
                  id={sectionId}
                  checked={isCompleted}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isReadOnly}
                  className={checkboxClassName}
                />
              </div>
            )}

            {/* "Check when done" hint - only show when expanded and not completed */}
            {!isCompleted && !isReadOnly && !isCollapsed && (
              <div className="hidden sm:flex absolute top-full mt-1 flex-col items-center">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-tertiary-background" />
                <span className="text-[10px] text-tertiary font-medium text-center whitespace-nowrap">
                  {text(t.checkWhenDone)}
                </span>
              </div>
            )}
          </div>

          {/* Title and collapse controls */}
          <div
            className="flex-1 flex items-center gap-2 cursor-pointer select-none py-2"
            onClick={toggleCollapse}
          >
            <button
              className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
              )}
            </button>
            <Header Tag="h3" className="flex-1 my-0 text-base sm:text-2xl">
              {title}
            </Header>
            {isCompleted && (
              <span className="hidden sm:inline text-primary text-sm font-medium">
                ✓ {text(t.completed)}
              </span>
            )}
          </div>
        </div>

        {/* Collapsible content */}
        <div
          className={`space-y-4 transition-all duration-300 ${
            isCollapsed
              ? 'max-h-0 overflow-hidden opacity-0'
              : 'max-h-[2000px] opacity-100 mt-4 ml-0 sm:ml-20'
          } ${isCompleted ? 'opacity-75' : ''}`}
        >
          {children}
        </div>
      </div>
    </WhiteCard>
  )
}
