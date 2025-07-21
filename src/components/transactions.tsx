import { CardList } from '@/components/card-list'
import { useMemo } from 'react'

type TransactionAmountProps = {
  amount: number
}

function TransactionAmount({ amount }: TransactionAmountProps) {
  const formattedAmount = useMemo(() => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }, [amount])

  const className = useMemo(() => {
    let className = 'font-bold'

    if (amount < 0) {
      className += ' text-red-500'
    } else if (amount > 0) {
      className += ' text-green-500'
    }
    return className
  }, [amount])

  return (
    <span className={className}>
      {amount > 0 ? '+' : ''}
      {formattedAmount}
    </span>
  )
}

export type TransationsListProps = {
  transactions: {
    name: string
    amount: number
    date: Date
  }[]
}

export function TransactionsList({ transactions }: TransationsListProps) {
  return (
    <CardList
      items={transactions.map((transaction) => (
        <div className="flex justify-between">
          <div>
            <strong className="text-lg">{transaction.name}</strong>
            <div className="text-muted-foreground text-sm">
              {transaction.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <TransactionAmount amount={transaction.amount} />
        </div>
      ))}
    />
  )
}
