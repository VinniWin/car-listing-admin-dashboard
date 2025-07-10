import { z } from "zod";

export const StatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const listingSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  pricePerDay: z
    .number()
    .min(0, { message: "Price per day must be a positive number" }),
  submittedBy: z.string(),
  submittedAt: z.string(),
  status: StatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  adminId: z.string().nullable(),
});

export type TListing = z.infer<typeof listingSchema>;
