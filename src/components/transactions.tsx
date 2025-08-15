import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { useLanguageContext, Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useMemo } from 'react'
import { useFormatDate } from '@/lib/dates'

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
  const formatDate = useFormatDate()

  if (transactions.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
          <p className="text-lg font-semibold mb-2">
            <Text text={translations.general.emptyState.noTransactionsTitle} />
          </p>
          <p className="text-sm">
            <Text
              text={translations.general.emptyState.noTransactionsDescription}
            />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={transactions.map((transaction) => (
        <div className="flex justify-between">
          <div>
            <strong className="text-lg">{transaction.name}</strong>
            <div className="text-muted-foreground text-sm">
              {formatDate(transaction.date)}
            </div>
          </div>
          <TransactionAmount amount={transaction.amount} />
        </div>
      ))}
    />
  )
}
