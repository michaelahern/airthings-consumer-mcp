# Airthings Consumer MCP Server

[![npm](https://badgen.net/npm/v/airthings-consumer-mcp)](https://www.npmjs.com/package/airthings-consumer-mcp)
[![node](https://badgen.net/npm/node/airthings-consumer-mcp)](https://www.npmjs.com/package/airthings-consumer-mcp)
[![downloads](https://badgen.net/npm/dt/airthings-consumer-mcp)](https://www.npmjs.com/package/airthings-consumer-mcp)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/michaelahern/airthings-consumer-mcp)

A Model Context Protocol (MCP) server for Airthings air quality monitoring devices.

## Components

### Tools: airthings



### Claude Desktop

[claude_desktop_config.json](https://modelcontextprotocol.io/quickstart/user)

```json
{
  "mcpServers": {
    "airthings": {
      "command": "npx",
      "args": ["-y", "airthings-consumer-mcp"],
      "env": {
        "AIRTHINGS_CLIENT_ID": "[AIRTHINGS_CLIENT_ID]",
        "AIRTHINGS_CLIENT_SECRET": "[AIRTHINGS_CLIENT_SECRET]"
      }
    }
  }
}
```
