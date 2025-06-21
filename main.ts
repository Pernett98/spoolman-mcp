/// <reference types="node" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { VendorSchema } from "./schemas/vendor";
import {
  FilamentSchema,
  AddFilamentSchema,
  UpdateFilamentSchema,
  FilamentSearchParamsSchema,
  DeleteFilamentParamsSchema,
} from "./schemas/filament";

const server = new McpServer({
  name: "Spoolman",
  version: "",
  port: 3002,
  host: "localhost",
});

// Set the default Spoolman API base URL, allowing override via environment variable
const SPOOLMAN_API_URL =
  process.env.SPOOLMAN_URL || "http://localhost:7912/api/v1";

server.tool(
  "getHealth",
  "Get the health of the Spoolman instance",
  {},
  async () => {
    const url = `${SPOOLMAN_API_URL}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch health: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Create the backup tool
server.tool("triggerBackup", "Triggers a database backup.", {}, async () => {
  const url = `${SPOOLMAN_API_URL}/backup`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Failed to trigger backup: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
});

// Create the add filament tool
server.tool(
  "addFilament",
  "Add a new filament.",
  AddFilamentSchema.shape,
  async (params) => {
    const url = `${SPOOLMAN_API_URL}/filament`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`Failed to add filament: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Create the get filament tool
server.tool(
  "getFilament",
  "Get a specific filament.",
  { filament_id: z.number() },
  async ({ filament_id }) => {
    const url = `${SPOOLMAN_API_URL}/filament/${filament_id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get filament: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Create the update filament tool
server.tool(
  "updateFilament",
  "Update a filament.",
  UpdateFilamentSchema.shape,
  async (params) => {
    const { filament_id, ...body } = params;
    const url = `${SPOOLMAN_API_URL}/filament/${filament_id}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to update filament: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Create the filament tool
server.tool(
  "getFilaments",
  "Get a list of filaments that matches the search query",
  FilamentSearchParamsSchema,
  async (params) => {
    const queryParams = new URLSearchParams();
    if (params.vendor_name)
      queryParams.append("vendor.name", params.vendor_name);
    if (params.vendor_id) queryParams.append("vendor.id", params.vendor_id);
    if (params.name) queryParams.append("name", params.name);
    if (params.material) queryParams.append("material", params.material);
    if (params.article_number)
      queryParams.append("article_number", params.article_number);
    if (params.color_hex) queryParams.append("color_hex", params.color_hex);
    if (params.color_similarity_threshold)
      queryParams.append(
        "color_similarity_threshold",
        params.color_similarity_threshold.toString()
      );
    if (params.external_id)
      queryParams.append("external_id", params.external_id);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());
    const url = `${SPOOLMAN_API_URL}/filament?${queryParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch filaments: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Create the delete filament tool
server.tool(
  "deleteFilament",
  "Delete a filament.",
  DeleteFilamentParamsSchema.shape,
  async ({ filament_id }) => {
    const url = `${SPOOLMAN_API_URL}/filament/${filament_id}`;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Failed to delete filament: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
    };
  }
);

// Set up the stdio transport and connect
const transport = new StdioServerTransport();
server.connect(transport);
