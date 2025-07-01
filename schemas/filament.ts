import { z } from "zod";
import { VendorSchema } from "./vendor";
import { sortPattern } from "./sortPattern";

export const FilamentSchema = z.object({
  id: z.number(),
  registered: z.string(),
  name: z.string().max(64),
  vendor: VendorSchema,
  material: z.string().max(64),
  price: z.number().min(0),
  density: z.number().gt(0),
  diameter: z.number().gt(0),
  weight: z.number().gt(0),
  spool_weight: z.number().min(0),
  article_number: z.string().max(64),
  comment: z.string(),
  settings_extruder_temp: z.number(),
  settings_bed_temp: z.number(),
  color_hex: z.string(),
  extra: z.record(z.string()),
});

export const AddFilamentSchema = z.object({
  name: z.string().max(64).optional(),
  vendor_id: z.number().optional(),
  material: z.string().max(64).optional(),
  price: z.number().min(0).optional(),
  density: z.number().gt(0),
  diameter: z.number().gt(0),
  weight: z.number().gt(0).optional(),
  spool_weight: z.number().min(0).optional(),
  article_number: z.string().max(64).optional(),
  comment: z.string().optional(),
  settings_extruder_temp: z.number().optional(),
  settings_bed_temp: z.number().optional(),
  color_hex: z.string().optional(),
  extra: z.record(z.string()).optional(),
});

export const UpdateFilamentSchema = z.object({
  filament_id: z.number(),
  name: z.string().max(64).optional(),
  vendor_id: z.number().optional(),
  material: z.string().max(64).optional(),
  price: z.number().min(0).optional(),
  density: z.number().gt(0).optional(),
  diameter: z.number().gt(0).optional(),
  weight: z.number().gt(0).optional(),
  spool_weight: z.number().min(0).optional(),
  article_number: z.string().max(64).optional(),
  comment: z.string().optional(),
  settings_extruder_temp: z.number().optional(),
  settings_bed_temp: z.number().optional(),
  color_hex: z.string().optional(),
  multi_color_hexes: z.string().optional(),
  multi_color_direction: z.string().optional(),
  external_id: z.string().optional(),
  extra: z.record(z.string()).optional(),
});

export const FilamentSearchParamsSchema = {
  vendor_name: z.string().optional(),
  vendor_id: z.string().optional(),
  name: z.string().optional(),
  material: z.string().optional(),
  article_number: z.string().optional(),
  color_hex: z.string().optional(),
  color_similarity_threshold: z.number().min(0).max(100).optional(),
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

export const DeleteFilamentParamsSchema = z.object({
  filament_id: z.number(),
});
