import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  hours: z.number().min(1, "Hours must be greater than 0"),
  providerId: z.number().refine((val) => val !== 0, { message: "Provider is required" }),
});