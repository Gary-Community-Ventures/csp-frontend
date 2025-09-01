import { useState, useEffect, useCallback } from 'react'
import { useMatch } from '@tanstack/react-router'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useProviderContext } from '../wrapper'
import { toast } from 'sonner'
import { CreditCard, Building2 } from 'lucide-react'
import {
  getPaymentSettings,
  updatePaymentMethod,
  initializePaymentMethod,
  type PaymentSettingsResponse,
  type PaymentMethodUpdateRequest,
  type PaymentMethodInitializeRequest,
} from '@/lib/api/paymentSettings'

export function PaymentSettingsPage() {
  const { context } = useMatch({ from: '__root__' })
  const [paymentSettings, setPaymentSettings] =
    useState<PaymentSettingsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'ach' | null>(
    null
  )
  const { providerInfo } = useProviderContext()

  const loadPaymentSettings = useCallback(async () => {
    if (!providerInfo.isPaymentEnabled) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const settings = await getPaymentSettings(context)
      setPaymentSettings(settings)
      setSelectedMethod(settings.payment_method as 'card' | 'ach' | null)
    } catch (error) {
      console.error('Failed to load payment settings:', error)
      toast.error(translations.provider.paymentSettings.failedToLoad.en)
    } finally {
      setLoading(false)
    }
  }, [context, providerInfo.isPaymentEnabled])

  useEffect(() => {
    loadPaymentSettings()
  }, [loadPaymentSettings])

  const handleUpdatePaymentMethod = async () => {
    if (!selectedMethod || !paymentSettings) return

    try {
      setUpdating(true)

      // Determine if this is an initialization (first-time setup) or an update (switching)
      const isInitializing =
        selectedMethod === 'card'
          ? !paymentSettings.card.available
          : !paymentSettings.ach.available

      if (isInitializing) {
        // Use initialize endpoint for first-time setup
        const initRequest: PaymentMethodInitializeRequest = {
          payment_method: selectedMethod,
        }

        const result = await initializePaymentMethod(context, initRequest)
        toast.success(result.message)

        // Show additional info if invite was sent for ACH
        if (result.invite_sent_to) {
          toast.success(`Invitation sent to ${result.invite_sent_to}`)
        }
      } else {
        // Use update endpoint for switching between configured methods
        const updateRequest: PaymentMethodUpdateRequest = {
          payment_method: selectedMethod,
        }

        await updatePaymentMethod(context, updateRequest)
        toast.success(
          translations.provider.paymentSettings.paymentMethod.updateSuccess.en
        )
      }

      await loadPaymentSettings()
    } catch (error) {
      console.error('Failed to update payment method:', error)
      toast.error(
        translations.provider.paymentSettings.paymentMethod.updateError.en
      )
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string | null, available: boolean) => {
    // If no ID available, not configured yet
    if (!available) {
      return (
        <Badge variant="outline">
          <Text
            text={translations.provider.paymentSettings.status.notConfigured}
          />
        </Badge>
      )
    }

    // If status is null, it means configured but status unknown
    if (status === null) {
      return (
        <Badge variant="outline">
          <Text
            text={translations.provider.paymentSettings.status.notConfigured}
          />
        </Badge>
      )
    }

    // If status is Active
    if (status === 'Active') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Text text={translations.provider.paymentSettings.status.active} />
        </Badge>
      )
    }

    // If status is Invited
    if (status === 'Invited') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Text text={translations.provider.paymentSettings.status.invited} />
        </Badge>
      )
    }

    // Any other status means not available
    return (
      <Badge variant="destructive">
        <Text
          text={translations.provider.paymentSettings.status.notAvailable}
        />
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-5">
        <Header>
          <Text text={translations.provider.paymentSettings.title} />
        </Header>
        <WhiteCard>
          <div className="flex items-center justify-center py-8">
            <Text text={translations.provider.paymentSettings.loading} />
          </div>
        </WhiteCard>
      </div>
    )
  }

  if (!providerInfo.isPaymentEnabled) {
    return (
      <div className="p-5">
        <Header>
          <Text text={translations.provider.paymentSettings.title} />
        </Header>
        <WhiteCard>
          <div className="text-center py-8 text-amber-600">
            <Text text={translations.provider.paymentSettings.disabled} />
          </div>
        </WhiteCard>
      </div>
    )
  }

  if (!paymentSettings) {
    return (
      <div className="p-5">
        <Header>
          <Text text={translations.provider.paymentSettings.title} />
        </Header>
        <WhiteCard>
          <div className="text-center py-8 text-red-600">
            <Text text={translations.provider.paymentSettings.failedToLoad} />
          </div>
        </WhiteCard>
      </div>
    )
  }

  const hasChanges = selectedMethod !== paymentSettings.payment_method
  const canUpdate = hasChanges && selectedMethod && paymentSettings.chek_user_id

  const isInitializing =
    selectedMethod &&
    (selectedMethod === 'card'
      ? !paymentSettings.card.available
      : !paymentSettings.ach.available)

  return (
    <div className="p-5 space-y-6">
      <Header>
        <Text text={translations.provider.paymentSettings.title} />
      </Header>

      {/* Current Status */}
      <WhiteCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            <Text
              text={translations.provider.paymentSettings.paymentStatus.title}
            />
          </h3>
          {paymentSettings.is_payable ? (
            <div className="flex items-center gap-2">
              <div className="size-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                <Text
                  text={
                    translations.provider.paymentSettings.paymentStatus
                      .configured
                  }
                />
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-2 bg-amber-500 rounded-full"></div>
              <span className="text-amber-700 font-medium">
                <Text
                  text={
                    translations.provider.paymentSettings.paymentStatus
                      .notConfigured
                  }
                />
              </span>
            </div>
          )}
        </div>
      </WhiteCard>

      {/* Payment Method Selection */}
      <WhiteCard>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            <Text
              text={translations.provider.paymentSettings.paymentMethod.title}
            />
          </h3>

          {!paymentSettings.chek_user_id && (
            <div className="text-amber-600 bg-amber-50 p-3 rounded-md">
              <Text
                text={
                  translations.provider.paymentSettings.paymentMethod
                    .setupRequired
                }
              />
            </div>
          )}

          <RadioGroup
            value={selectedMethod || ''}
            onValueChange={(value) =>
              setSelectedMethod(value as 'card' | 'ach')
            }
            className="space-y-4"
          >
            {/* Virtual Card Option */}
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem
                value="card"
                id="card"
                disabled={!paymentSettings.chek_user_id}
              />
              <div className="flex-1">
                <label
                  htmlFor="card"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <CreditCard className="size-6 text-blue-600" />
                  <div>
                    <div className="font-medium">
                      <Text
                        text={
                          translations.provider.paymentSettings.paymentMethod
                            .virtualCard.title
                        }
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <Text
                        text={
                          translations.provider.paymentSettings.paymentMethod
                            .virtualCard.description
                        }
                      />
                    </div>
                  </div>
                </label>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(
                    paymentSettings.card.status,
                    paymentSettings.card.available
                  )}
                </div>
              </div>
            </div>

            {/* ACH/DirectPay Option */}
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem
                value="ach"
                id="ach"
                disabled={!paymentSettings.chek_user_id}
              />
              <div className="flex-1">
                <label
                  htmlFor="ach"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Building2 className="size-6 text-green-600" />
                  <div>
                    <div className="font-medium">
                      <Text
                        text={
                          translations.provider.paymentSettings.paymentMethod
                            .ach.title
                        }
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <Text
                        text={
                          translations.provider.paymentSettings.paymentMethod
                            .ach.description
                        }
                      />
                    </div>
                  </div>
                </label>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(
                    paymentSettings.ach.status,
                    paymentSettings.ach.available
                  )}
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Update Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpdatePaymentMethod}
              disabled={!canUpdate}
              loading={updating}
            >
              <Text
                text={
                  isInitializing
                    ? translations.provider.paymentSettings.paymentMethod
                        .initializeButton
                    : translations.provider.paymentSettings.paymentMethod
                        .updateButton
                }
              />
            </Button>
          </div>

          {/* Show Chek setup message when selecting unconfigured option */}
          {selectedMethod &&
            paymentSettings.chek_user_id &&
            ((selectedMethod === 'card' && !paymentSettings.card.available) ||
              (selectedMethod === 'ach' && !paymentSettings.ach.available)) && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <Text
                    text={
                      translations.provider.paymentSettings.paymentMethod
                        .chekSetupMessage
                    }
                  />
                </p>
              </div>
            )}
        </div>
      </WhiteCard>
    </div>
  )
}
