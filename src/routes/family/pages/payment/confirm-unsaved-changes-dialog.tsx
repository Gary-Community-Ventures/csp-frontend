import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { translations } from '@/translations/text'
import { useText } from '@/translations/wrapper'

import { useBlocker } from '@tanstack/react-router'

interface ConfirmUnsavedChangesDialogProps {
  blocker: ReturnType<typeof useBlocker>
}

export function ConfirmUnsavedChangesDialog({
  blocker,
}: ConfirmUnsavedChangesDialogProps) {
  const t = translations.family.paymentPage
  const text = useText()

  if (blocker.status !== 'blocked') return null

  return (
    <Dialog
      open={blocker.status === 'blocked'}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          blocker.reset?.()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text(t.unsavedChangesBlocker)}</DialogTitle>
          <DialogDescription>
            {text(t.unsavedChangesBlockerDescription)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              blocker.reset()
            }}
          >
            {text(t.stayButton)}
          </Button>
          <Button
            onClick={() => {
              blocker.proceed()
            }}
          >
            {text(t.leaveButton)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
