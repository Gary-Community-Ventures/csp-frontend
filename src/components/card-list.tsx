import { Fragment, type ReactNode } from 'react'
import { Separator } from './ui/separator'

type CardListProps = {
  items: ReactNode[]
}

export function CardList({ items }: CardListProps) {
  return (
    <ul className="bg-white rounded-3xl px-5">
      {items.map((item, index) => (
        <Fragment key={index}>
          <li className="py-5">{item}</li>
          {index !== items.length - 1 && <Separator />}
        </Fragment>
      ))}
    </ul>
  )
}
