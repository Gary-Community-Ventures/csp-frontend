import { useState, useEffect, useCallback } from 'react'
import { useMatch } from '@tanstack/react-router'
import { Header } from '@/components/header'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CreditCard, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { 
  getPaymentSettings, 
  updatePaymentMethod, 
  type PaymentSettingsResponse,
  type PaymentMethodUpdateRequest 
} from '@/lib/api/paymentSettings'

export function PaymentSettingsPage() {
  const { context } = useMatch({ from: '__root__' })
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'ach' | null>(null)

  const loadPaymentSettings = useCallback(async () => {
    try {
      setLoading(true)
      const settings = await getPaymentSettings(context)
      setPaymentSettings(settings)
      setSelectedMethod(settings.payment_method as 'card' | 'ach' | null)
    } catch (error) {
      console.error('Failed to load payment settings:', error)
      toast.error('Failed to load payment settings')
    } finally {
      setLoading(false)
    }
  }, [context])

  useEffect(() => {
    loadPaymentSettings()
  }, [loadPaymentSettings])

  const handleUpdatePaymentMethod = async () => {
    if (!selectedMethod || !paymentSettings) return

    try {
      setUpdating(true)
      const request: PaymentMethodUpdateRequest = {
        payment_method: selectedMethod
      }
      
      await updatePaymentMethod(context, request)
      toast.success('Payment method updated successfully')
      await loadPaymentSettings()
    } catch (error) {
      console.error('Failed to update payment method:', error)
      toast.error('Failed to update payment method')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string | null, available: boolean) => {
    if (!available) {
      return <Badge variant="outline">Not Available</Badge>
    }
    if (status === 'Active') {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
    }
    return <Badge variant="destructive">Not Active</Badge>
  }

  const getValidationMessage = () => {
    if (!paymentSettings?.validation) return null
    
    if (paymentSettings.validation.is_valid) {
      return (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="size-5" />
          <span>{paymentSettings.validation.message}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-md">
          <AlertCircle className="size-5" />
          <span>{paymentSettings.validation.message}</span>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="p-5">
        <Header>Payment Settings</Header>
        <WhiteCard>
          <div className="flex items-center justify-center py-8">
            Loading payment settings...
          </div>
        </WhiteCard>
      </div>
    )
  }

  if (!paymentSettings) {
    return (
      <div className="p-5">
        <Header>Payment Settings</Header>
        <WhiteCard>
          <div className="text-center py-8 text-red-600">
            Failed to load payment settings. Please try again.
          </div>
        </WhiteCard>
      </div>
    )
  }

  const hasChanges = selectedMethod !== paymentSettings.payment_method
  const canUpdate = hasChanges && selectedMethod && 
    ((selectedMethod === 'card' && paymentSettings.card.available) ||
     (selectedMethod === 'ach' && paymentSettings.ach.available))

  return (
    <div className="p-5 space-y-6">
      <Header>Payment Settings</Header>

      {/* Current Status */}
      <WhiteCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Status</h3>
          {getValidationMessage()}
          {paymentSettings.payable ? (
            <div className="text-green-700">✅ Ready to receive payments</div>
          ) : (
            <div className="text-red-700">❌ Not ready to receive payments</div>
          )}
        </div>
      </WhiteCard>

      {/* Payment Method Selection */}
      <WhiteCard>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Payment Method</h3>
          
          <RadioGroup 
            value={selectedMethod || ''} 
            onValueChange={(value) => setSelectedMethod(value as 'card' | 'ach')}
            className="space-y-4"
          >
            {/* Virtual Card Option */}
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem 
                value="card" 
                id="card"
                disabled={!paymentSettings.card.available}
              />
              <div className="flex-1">
                <label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                  <CreditCard className="size-6 text-blue-600" />
                  <div>
                    <div className="font-medium">Virtual Card</div>
                    <div className="text-sm text-gray-600">
                      Receive payments via virtual card
                    </div>
                  </div>
                </label>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(paymentSettings.card.status, paymentSettings.card.available)}
                  {paymentSettings.card.id && (
                    <span className="text-xs text-gray-500">ID: {paymentSettings.card.id}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ACH/DirectPay Option */}
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem 
                value="ach" 
                id="ach"
                disabled={!paymentSettings.ach.available}
              />
              <div className="flex-1">
                <label htmlFor="ach" className="flex items-center gap-3 cursor-pointer">
                  <Building2 className="size-6 text-green-600" />
                  <div>
                    <div className="font-medium">ACH/Direct Pay</div>
                    <div className="text-sm text-gray-600">
                      Receive payments via ACH bank transfer
                    </div>
                  </div>
                </label>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(paymentSettings.ach.status, paymentSettings.ach.available)}
                  {paymentSettings.ach.id && (
                    <span className="text-xs text-gray-500">ID: {paymentSettings.ach.id}</span>
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
              Update Payment Method
            </Button>
          </div>
        </div>
      </WhiteCard>

      {/* Additional Info */}
      <WhiteCard>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div>Provider ID: {paymentSettings.provider_id}</div>
            {paymentSettings.chek_user_id && (
              <div>Chek User ID: {paymentSettings.chek_user_id}</div>
            )}
            {paymentSettings.payment_method_updated_at && (
              <div>
                Last Updated: {new Date(paymentSettings.payment_method_updated_at).toLocaleString()}
              </div>
            )}
            {paymentSettings.last_sync && (
              <div>
                Last Sync: {new Date(paymentSettings.last_sync).toLocaleString()}
              </div>
            )}
            {paymentSettings.needs_refresh && (
              <div className="text-amber-600">⚠️ Payment status needs refresh</div>
            )}
          </div>
        </div>
      </WhiteCard>
    </div>
  )
}