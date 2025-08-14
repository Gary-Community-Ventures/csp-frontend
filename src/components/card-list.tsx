import { Fragment, type ReactNode } from 'react'
import { Separator } from './ui/separator'
import { WhiteCard } from './white-card'

type CardListProps = {
  items: ReactNode[]
}

export function CardList({ items }: CardListProps) {
  return (
    <WhiteCard Tag="ul" className="py-0">
      {items.map((item, index) => (
        <Fragment key={index}>
          <li className="py-5">{item}</li>
          {index !== items.length - 1 && <Separator />}
        </Fragment>
      ))}
    </WhiteCard>
  )
}
