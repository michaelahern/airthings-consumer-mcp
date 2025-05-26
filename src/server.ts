import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AirthingsClient, SensorUnits } from 'airthings-consumer-api';

const clientId = process.env.AIRTHINGS_CLIENT_ID;
const clientSecret = process.env.AIRTHINGS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    console.error('Please set the AIRTHINGS_CLIENT_ID and AIRTHINGS_CLIENT_SECRET environment variables.');
    process.exit(1);
}

const client = new AirthingsClient({
    clientId: clientId,
    clientSecret: clientSecret
});

const server = new McpServer({
    name: 'Airthings',
    version: '1.0.0',
    description: 'A Model Context Protocol (MCP) server for Airthings air quality monitoring devices.'
});

server.tool(
    'airthings',
    'Get information about my Airthings air quality monitoring devices and their current sensor readings.',
    async () => {
        const devices = await client.getDevices();
        const sensors = await client.getSensors(SensorUnits.Imperial);

        let text = '';
        devices.devices.forEach((d) => {
            text += `${d.name} is an Airthings ${d.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`
                + ` with serial number ${d.serialNumber} that supports the following air quality sensors: ${d.sensors.join(', ')}.\n`;

            const sensorData = sensors.results.find(r => r.serialNumber === d.serialNumber);
            if (sensorData && sensorData.recorded) {
                text += `Current air quality sensor readings for ${d.name}:\n`;
                sensorData.sensors.forEach((s) => {
                    text += `- ${s.sensorType}: ${s.value}${s.unit}\n`;
                });
            }
            else {
                text += `No current readings are available for ${d.name}.\n`;
            }

            text += '\n';
        });

        return {
            content: [{
                type: 'text',
                text: text
            }]
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);
