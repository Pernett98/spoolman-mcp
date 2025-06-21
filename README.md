# Spoolman MCP

A Model Context Protocol (MCP) server for integrating with the [Spoolman](https://github.com/Donkie/Spoolman) REST API. This project exposes Spoolman filament management features as MCP tools, making it easy to automate, inspect, and manage filament data programmatically.

## Features

- CRUD operations for filaments (add, get, update, delete, search)
- Health and backup tools for the Spoolman instance
- Modular Zod schemas for type safety and validation
- Easily configurable API endpoint via environment variable

## Project Structure

```
spoolman-mcp/
  main.ts                # MCP server entry point and tool definitions
  schemas/
    filament.ts          # Filament-related Zod schemas
    vendor.ts            # Vendor-related Zod schemas
  package.json           # Project metadata and dependencies
  README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm (latest version)

### Installation

```bash
pnpm install
```

### Usage

By default, the MCP server will connect to the Spoolman API at `http://localhost:7912/api/v1`.

To override the Spoolman API URL, set the `SPOOLMAN_URL` environment variable:

```bash
SPOOLMAN_URL=http://localhost:7912/api/v1 pnpm start
```

Start the MCP server:

```bash
pnpm start
```

## MCP Tools

| Tool Name      | Description                             |
| -------------- | --------------------------------------- |
| getHealth      | Get the health of the Spoolman instance |
| triggerBackup  | Triggers a database backup              |
| addFilament    | Add a new filament                      |
| getFilament    | Get a specific filament by ID           |
| updateFilament | Update a filament by ID                 |
| getFilaments   | Search for filaments                    |
| deleteFilament | Delete a filament by ID                 |

## Environment Variables

- `SPOOLMAN_URL`: (optional) Override the default Spoolman API base URL.

## Development

- All Zod schemas are organized by entity in the `schemas/` directory.
- Tool logic is in `main.ts`.
- Use camelCase for all tool names.

## License

ISC
