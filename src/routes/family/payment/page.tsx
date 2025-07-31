import { Calendar } from '@/components/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCareDay, deleteCareDay, getMonthAllocation, submitCareDays, updateCareDay, getPaymentRate, createPaymentRate } from '@/lib/requests';
import { allocatedCareDaySchema } from '@/lib/schemas';
import { formatAmount } from '@/lib/currency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { paymentRoute } from '../routes';
import { useFamilyContext } from '../wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PaymentPage() {
  const { providerId } = paymentRoute.useParams();
  const { selectedChildInfo } = useFamilyContext();
  const { context } = paymentRoute.useRouteContext();
  const [date, setDate] = React.useState(new Date());
  const queryClient = useQueryClient();
  const [halfDayRate, setHalfDayRate] = React.useState('');
  const [fullDayRate, setFullDayRate] = React.useState('');

  const { data: allocation, isLoading: isLoadingAllocation } = useQuery({
    queryKey: ['allocation', selectedChildInfo.id, providerId, date.getMonth() + 1, date.getFullYear()],
    queryFn: () => getMonthAllocation(context, selectedChildInfo.id, providerId, date.getMonth() + 1, date.getFullYear()),
    enabled: !!selectedChildInfo.id && !!providerId && !!context,
  });

  const { data: paymentRate, isLoading: isLoadingPaymentRate, isError: isErrorPaymentRate } = useQuery({
    queryKey: ['paymentRate', providerId, selectedChildInfo.id],
    queryFn: () => getPaymentRate(context, providerId, selectedChildInfo.id),
    enabled: !!providerId && !!selectedChildInfo.id && !!context,
    retry: (failureCount) => {
      return failureCount < 3; // Retry other errors up to 3 times
    },
  });

  const { mutate: createCareDayMutation } = useMutation({
    mutationFn: (variables: { type: 'Full Day' | 'Half Day', date: string }) => {
      if (!allocation) return Promise.reject(new Error('Allocation not loaded'));
      return createCareDay(context, allocation.id, providerId, variables.date, variables.type)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] });
    },
  });

  const { mutate: updateCareDayMutation } = useMutation({
    mutationFn: (variables: { careDayId: number, type: 'Full Day' | 'Half Day' }) =>
      updateCareDay(context, variables.careDayId, variables.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] });
    },
  });

  const { mutate: deleteCareDayMutation } = useMutation({
    mutationFn: (careDayId: number) => deleteCareDay(context, careDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] });
    },
  });

  const { mutate: submitCareDaysMutation } = useMutation({
    mutationFn: () => submitCareDays(context, selectedChildInfo.id, providerId, date.getMonth() + 1, date.getFullYear()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] });
    },
  });

  const { mutate: createPaymentRateMutation } = useMutation({
    mutationFn: (variables: { halfDayRateCents: number, fullDayRateCents: number }) =>
      createPaymentRate(context, providerId, selectedChildInfo.id, variables.halfDayRateCents, variables.fullDayRateCents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRate'] });
      toast.success('Payment rate set successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to set payment rate: ${error.message}`);
    },
  });

  const handleDayTypeChange = (day: z.infer<typeof allocatedCareDaySchema> | null | undefined, type: 'Full Day' | 'Half Day' | 'none', selectedDate: Date) => {
    if (type === 'none') {
      if (day) {
        deleteCareDayMutation(day.id);
      }
    } else if (day) {
      updateCareDayMutation({ careDayId: day.id, type });
    } else {
      createCareDayMutation({ type, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleSetPaymentRate = () => {
    const half = parseFloat(halfDayRate) * 100;
    const full = parseFloat(fullDayRate) * 100;

    if (isNaN(half) || isNaN(full) || half <= 0 || full <= 0) {
      toast.error('Please enter valid positive numbers for both rates.');
      return;
    }
    createPaymentRateMutation({ halfDayRateCents: half, fullDayRateCents: full });
  };

  if (isLoadingAllocation || isLoadingPaymentRate || !context) {
    return <div>Loading...</div>;
  }

  if (isErrorPaymentRate || !paymentRate) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Set Payment Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Before you can manage care days, please set the payment rates for this child and provider.</p>
          <div className="space-y-2">
            <Label htmlFor="halfDayRate">Half Day Rate (USD)</Label>
            <Input
              id="halfDayRate"
              type="number"
              value={halfDayRate}
              onChange={(e) => setHalfDayRate(e.target.value)}
              placeholder="e.g., 25.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDayRate">Full Day Rate (USD)</Label>
            <Input
              id="fullDayRate"
              type="number"
              value={fullDayRate}
              onChange={(e) => setFullDayRate(e.target.value)}
              placeholder="e.g., 50.00"
            />
          </div>
          <Button onClick={handleSetPaymentRate} className="w-full">
            Set Rates
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dollars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(allocation?.allocation_cents || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Dollars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(allocation?.used_cents || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Dollars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(allocation?.remaining_cents || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Half Day Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(paymentRate?.half_day_rate_cents || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Day Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(paymentRate?.full_day_rate_cents || 0)}</div>
          </CardContent>
        </Card>
      </div>
      {allocation && (
        <Calendar
          allocation={allocation}
          onDateChange={setDate}
          onSubmit={submitCareDaysMutation}
          onDayTypeChange={handleDayTypeChange}
        />
      )}
    </div>
  );
}