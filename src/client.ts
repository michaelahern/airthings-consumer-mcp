import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport, getDefaultEnvironment } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
    command: 'node',
    args: ['./lib/server.js'],
    // env: {
    //     AIRTHINGS_CLIENT_ID: process.env.AIRTHINGS_CLIENT_ID ?? '',
    //     AIRTHINGS_CLIENT_SECRET: process.env.AIRTHINGS_CLIENT_SECRET ?? '',
    //     PATH: process.env.PATH ?? ''
    // },
    env: getDefaultEnvironment()
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
