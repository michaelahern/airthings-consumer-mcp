#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport, getDefaultEnvironment } from '@modelcontextprotocol/sdk/client/stdio.js';

const clientId = process.env.AIRTHINGS_CLIENT_ID;
const clientSecret = process.env.AIRTHINGS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    console.error('Please set the AIRTHINGS_CLIENT_ID and AIRTHINGS_CLIENT_SECRET environment variables.');
    process.exit(1);
}

const transport = new StdioClientTransport({
    command: 'node',
    args: ['./bin/server.js'],
    env: {
        AIRTHINGS_CLIENT_ID: clientId,
        AIRTHINGS_CLIENT_SECRET: clientSecret,
        ...getDefaultEnvironment()
    }
});

const client = new Client(
    {
        name: 'Airthings Client',
        version: '1.0.0'
    }
);

await client.connect(transport);

const tools = await client.listTools();
console.log(tools);

const airthings = await client.callTool({
    name: 'airthings'
});
console.log(airthings);
