import { z } from "zod";
import { sortPattern } from "./sortPattern";

export const SpoolSchema = z.object({
  id: z.number(),
  registered: z.string(),
  filament_id: z.number(),
  remaining_weight: z.number().min(0).optional(),
  used_weight: z.number().min(0),
  location: z.string().max(256).optional(),
  lot_nr: z.string().max(64).optional(),
  comment: z.string().optional(),
  archived: z.boolean().optional(),
  extra: z.record(z.string()).optional(),
  first_used: z.string().optional(),
  last_used: z.string().optional(),
});

export const FindSpoolParamsSchema = {
  "filament.name": z.string().optional(),
  "filament.id": z.string().optional(),
  "filament.material": z.string().optional(),
  "filament.vendor.name": z.string().optional(),
  "filament.vendor.id": z.string().optional(),
  location: z.string().optional(),
  lot_nr: z.string().optional(),
  allow_archived: z.boolean().optional(),
  sort: z
    .string()
    .regex(
      sortPattern,
      'Sort must be a comma-separated list of "field:direction" (asc|desc) pairs'
    )
    .optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
};

export const AddSpoolSchema = z.object({
  filament_id: z.number(),
  remaining_weight: z.number().min(0).optional(),
  used_weight: z.number().min(0).optional(),
  location: z.string().max(256).optional(),
  lot_nr: z.string().max(64).optional(),
  comment: z.string().optional(),
  archived: z.boolean().optional(),
  extra: z.record(z.string()).optional(),
  first_used: z.string().optional(),
  last_used: z.string().optional(),
});

export const UpdateSpoolSchema = z.object({
  spool_id: z.number(),
  filament_id: z.number().optional(),
  price: z.number().min(0).optional(),
  remaining_weight: z.number().min(0).optional(),
  used_weight: z.number().min(0).optional(),
  location: z.string().max(256).optional(),
  lot_nr: z.string().max(64).optional(),
  comment: z.string().optional(),
  archived: z.boolean().optional(),
  extra: z.record(z.string()).optional(),
});

export const DeleteSpoolParamsSchema = z.object({
  spool_id: z.number(),
});
