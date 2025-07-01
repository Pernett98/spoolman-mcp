/// <reference types="node" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  VendorSchema,
  VendorSearchParamsSchema,
  AddVendorSchema,
  UpdateVendorSchema,
  DeleteVendorParamsSchema,
} from "./schemas/vendor";
import {
  FilamentSchema,
  AddFilamentSchema,
  UpdateFilamentSchema,
  FilamentSearchParamsSchema,
  DeleteFilamentParamsSchema,
} from "./schemas/filament";
import {
  SpoolSchema,
  FindSpoolParamsSchema,
  AddSpoolSchema,
  UpdateSpoolSchema,
  DeleteSpoolParamsSchema,
} from "./schemas/spool";
import pino from "pino";

const logger = pino(pino.destination("app.log"));

const server = new McpServer({
  name: "Spoolman",
  version: "",
  port: 3002,
  host: "localhost",
});

logger.info("Starting Spoolman MCP server...");

// Set the default Spoolman API base URL, allowing override via environment variable
const SPOOLMAN_API_URL = `${
  process.env.SPOOLMAN_URL || "http://localhost:7912"
}/api/v1`;

logger.info(SPOOLMAN_API_URL);

function logToolCall(toolName: string, params: any) {
  logger.info({ tool: toolName, params }, `Tool called: ${toolName}`);
}
function logToolError(toolName: string, error: any) {
  logger.error({ tool: toolName, error }, `Error in tool: ${toolName}`);
}

server.tool(
  "getHealth",
  "Get the health of the Spoolman instance",
  {},
  async (params) => {
    logToolCall("getHealth", params);
    try {
      const url = `${SPOOLMAN_API_URL}/health`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch health: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("getHealth", error);
      throw error;
    }
  }
);

// Create the backup tool
server.tool(
  "triggerBackup",
  "Triggers a database backup.",
  {},
  async (params) => {
    logToolCall("triggerBackup", params);
    try {
      const url = `${SPOOLMAN_API_URL}/backup`;
      const response = await fetch(url, { method: "POST" });
      if (!response.ok) {
        throw new Error(`Failed to trigger backup: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("triggerBackup", error);
      throw error;
    }
  }
);

// Create the add filament tool
server.tool(
  "addFilament",
  "Add a new filament.",
  AddFilamentSchema.shape,
  async (params) => {
    logToolCall("addFilament", params);
    try {
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
    } catch (error) {
      logToolError("addFilament", error);
      throw error;
    }
  }
);

// Create the get filament tool
server.tool(
  "getFilament",
  "Get a specific filament.",
  { filament_id: z.number() },
  async (params) => {
    logToolCall("getFilament", params);
    try {
      const url = `${SPOOLMAN_API_URL}/filament/${params.filament_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to get filament: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("getFilament", error);
      throw error;
    }
  }
);

// Create the update filament tool
server.tool(
  "updateFilament",
  "Update a filament.",
  UpdateFilamentSchema.shape,
  async (params) => {
    logToolCall("updateFilament", params);
    try {
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
    } catch (error) {
      logToolError("updateFilament", error);
      throw error;
    }
  }
);

// Create the filament tool
server.tool(
  "getFilaments",
  "Get a list of filaments that matches the search query",
  FilamentSearchParamsSchema,
  async (params) => {
    logToolCall("getFilaments", params);
    try {
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
    } catch (error) {
      logToolError("getFilaments", error);
      throw error;
    }
  }
);

// Create the delete filament tool
server.tool(
  "deleteFilament",
  "Delete a filament.",
  DeleteFilamentParamsSchema.shape,
  async (params) => {
    logToolCall("deleteFilament", params);
    try {
      const url = `${SPOOLMAN_API_URL}/filament/${params.filament_id}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete filament: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("deleteFilament", error);
      throw error;
    }
  }
);

// Create the get vendors tool
server.tool(
  "getVendors",
  "Get a list of vendors that matches the search query",
  VendorSearchParamsSchema,
  async (params) => {
    logToolCall("getVendors", params);
    try {
      const queryParams = new URLSearchParams();
      if (params.name) queryParams.append("name", params.name);
      if (params.external_id)
        queryParams.append("external_id", params.external_id);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.offset) queryParams.append("offset", params.offset.toString());
      const url = `${SPOOLMAN_API_URL}/vendor?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("getVendors", error);
      throw error;
    }
  }
);

// Create the add vendor tool
server.tool(
  "addVendor",
  "Add a new vendor.",
  AddVendorSchema.shape,
  async (params) => {
    logToolCall("addVendor", params);
    try {
      const url = `${SPOOLMAN_API_URL}/vendor`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`Failed to add vendor: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("addVendor", error);
      throw error;
    }
  }
);

// Create the get vendor tool
server.tool(
  "getVendor",
  "Get a specific vendor by ID.",
  { vendor_id: z.number() },
  async (params) => {
    logToolCall("getVendor", params);
    try {
      const url = `${SPOOLMAN_API_URL}/vendor/${params.vendor_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to get vendor: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("getVendor", error);
      throw error;
    }
  }
);

// Create the update vendor tool
server.tool(
  "updateVendor",
  "Update a vendor.",
  UpdateVendorSchema.shape,
  async (params) => {
    logToolCall("updateVendor", params);
    try {
      const { vendor_id, ...body } = params;
      const url = `${SPOOLMAN_API_URL}/vendor/${vendor_id}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("updateVendor", error);
      throw error;
    }
  }
);

// Create the delete vendor tool
server.tool(
  "deleteVendor",
  "Delete a vendor.",
  DeleteVendorParamsSchema.shape,
  async (params) => {
    logToolCall("deleteVendor", params);
    try {
      const url = `${SPOOLMAN_API_URL}/vendor/${params.vendor_id}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete vendor: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("deleteVendor", error);
      throw error;
    }
  }
);

// Create the find spools tool
server.tool(
  "findSpools",
  "Find spools matching the search criteria.",
  FindSpoolParamsSchema,
  async (params) => {
    logToolCall("findSpools", params);
    try {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      }
      const url = `${SPOOLMAN_API_URL}/spool?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to find spools: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("findSpools", error);
      throw error;
    }
  }
);

// Create the add spool tool
server.tool(
  "addSpool",
  "Add a new spool.",
  AddSpoolSchema.shape,
  async (params) => {
    logToolCall("addSpool", params);
    try {
      const url = `${SPOOLMAN_API_URL}/spool`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`Failed to add spool: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("addSpool", error);
      throw error;
    }
  }
);

// Create the get spool tool
server.tool(
  "getSpool",
  "Get a specific spool by ID.",
  { spool_id: z.number() },
  async ({ spool_id }) => {
    logToolCall("getSpool", { spool_id });
    try {
      const url = `${SPOOLMAN_API_URL}/spool/${spool_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to get spool: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("getSpool", error);
      throw error;
    }
  }
);

// Create the update spool tool
server.tool(
  "updateSpool",
  "Update a spool.",
  UpdateSpoolSchema.shape,
  async (params) => {
    logToolCall("updateSpool", params);
    try {
      const { spool_id, ...body } = params;
      const url = `${SPOOLMAN_API_URL}/spool/${spool_id}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to update spool: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("updateSpool", error);
      throw error;
    }
  }
);

// Create the delete spool tool
server.tool(
  "deleteSpool",
  "Delete a spool.",
  DeleteSpoolParamsSchema.shape,
  async ({ spool_id }) => {
    logToolCall("deleteSpool", { spool_id });
    try {
      const url = `${SPOOLMAN_API_URL}/spool/${spool_id}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete spool: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      logToolError("deleteSpool", error);
      throw error;
    }
  }
);

// Set up the stdio transport and connect
const transport = new StdioServerTransport();
logger.info("Connecting stdio transport...");
server.connect(transport);
logger.info("Spoolman MCP server started and ready.");
