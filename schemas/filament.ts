import { z } from "zod";
import { VendorSchema } from "./vendor";

export const FilamentSchema = z.object({
  id: z.number(),
  registered: z.string(),
  name: z.string().max(64).nullable(),
  vendor: VendorSchema.nullable(),
  material: z.string().max(64).nullable(),
  price: z.number().min(0).nullable(),
  density: z.number().gt(0),
  diameter: z.number().gt(0),
  weight: z.number().gt(0).nullable(),
  spool_weight: z.number().min(0).nullable(),
  article_number: z.string().max(64).nullable(),
  comment: z.string().nullable(),
  settings_extruder_temp: z.number().nullable(),
  settings_bed_temp: z.number().nullable(),
  color_hex: z.string().nullable(),
  extra: z.record(z.string()).nullable(),
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
  vendor_id: z.number().optional().nullable(),
  material: z.string().max(64).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  density: z.number().gt(0).optional().nullable(),
  diameter: z.number().gt(0).optional().nullable(),
  weight: z.number().gt(0).optional().nullable(),
  spool_weight: z.number().min(0).optional().nullable(),
  article_number: z.string().max(64).optional().nullable(),
  comment: z.string().optional().nullable(),
  settings_extruder_temp: z.number().optional().nullable(),
  settings_bed_temp: z.number().optional().nullable(),
  color_hex: z.string().optional().nullable(),
  multi_color_hexes: z.string().optional().nullable(),
  multi_color_direction: z.string().optional().nullable(),
  external_id: z.string().optional().nullable(),
  extra: z.record(z.string()).optional().nullable(),
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
  sort: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
};

export const DeleteFilamentParamsSchema = z.object({
  filament_id: z.number(),
});
