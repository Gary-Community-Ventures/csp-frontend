import { cn } from '@/lib/utils'

type FromErrorMessageProps = {
  error: string | undefined
  className?: string
}
export function FormErrorMessage({ error, className }: FromErrorMessageProps) {
  if (error === undefined) {
    return null
  }

  return <p className={cn('text-red-500 text-sm mt-1', className)}>{error}</p>
}
