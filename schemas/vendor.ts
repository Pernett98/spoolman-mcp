import { z } from "zod";

export const VendorSchema = z.object({
  id: z.number(),
  registered: z.string(),
  name: z.string().max(64),
  comment: z.string().nullable(),
  empty_spool_weight: z.number().min(0).nullable(),
  filament_count: z.number(),
  material_count: z.number(),
  spool_count: z.number(),
  extra: z.record(z.string()).nullable(),
});
