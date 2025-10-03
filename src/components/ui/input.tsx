import * as React from 'react'

import { cn } from '@/lib/utils'

const PLACEHOLDER_TRANSLATE_CLASSED =
  'transision-all duration-200 peer-focus:-translate-x-2 peer-focus:-translate-y-7 peer-focus:scale-80 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-x-2 peer-[:not(:placeholder-shown):not(:focus)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-80'

type PlaceholderProps = {
  placeholderClassName?: string
  floatingLabel?: boolean
}

function Input({
  className,
  placeholderClassName,
  type,
  id: idParam,
  placeholder,
  floatingLabel = false,
  ...props
}: React.ComponentProps<'input'> & PlaceholderProps) {
  const randomId = React.useId()
  const id = idParam ?? randomId

  return (
    <span className="relative">
      <input
        id={id}
        type={type}
        data-slot="input"
        onFocus={(e) => e.target.select()}
        placeholder={floatingLabel ? '' : placeholder}
        className={cn(
          'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] peer',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
      {floatingLabel && (
        <label
          htmlFor={id}
          className={cn(
            'absolute top-1/2 left-3 -translate-y-1/2 max-w-10/12 text-sm text-muted-foreground select-none pointer-events-none bg-white px-1',
            PLACEHOLDER_TRANSLATE_CLASSED,
            placeholderClassName
          )}
        >
          {placeholder}
        </label>
      )}
    </span>
  )
}

export { Input }
