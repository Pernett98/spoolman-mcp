import { z } from "zod";
import { sortPattern } from "./sortPattern";

export const VendorSchema = z.object({
  id: z.number(),
  registered: z.string(),
  name: z.string().max(64),
  comment: z.string(),
  empty_spool_weight: z.number().min(0),
  filament_count: z.number(),
  material_count: z.number(),
  spool_count: z.number(),
  extra: z.record(z.string()),
});

export const VendorSearchParamsSchema = {
  name: z.string().optional(),
  external_id: z.string().optional(),
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

export const AddVendorSchema = z.object({
  name: z.string().max(64),
  comment: z.string().max(1024).optional(),
  empty_spool_weight: z.number().min(0).optional(),
  external_id: z.string().max(256).optional(),
  extra: z.record(z.string()).optional(),
});

export const UpdateVendorSchema = z.object({
  vendor_id: z.number(),
  name: z.string().max(64).optional(),
  comment: z.string().max(1024).optional(),
  empty_spool_weight: z.number().min(0).optional(),
  external_id: z.string().max(256).optional(),
  extra: z.record(z.string()).optional(),
});

export const DeleteVendorParamsSchema = z.object({
  vendor_id: z.number(),
});
