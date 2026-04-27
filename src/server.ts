#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AirthingsClient, RemoteControlMode, SensorUnits } from 'airthings-consumer-api';
import type { RemoteControlState } from 'airthings-consumer-api';
import { z } from 'zod';
import { readFileSync } from 'node:fs';

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

const packageJson = readFileSync(new URL('../package.json', import.meta.url), 'utf8');
const packageInfo = JSON.parse(packageJson);

const server = new McpServer({
    name: 'Airthings',
    version: packageInfo.version,
    description: 'A Model Context Protocol (MCP) server for Airthings air quality monitoring devices.'
});

server.tool(
    'airthings',
    'Get information about my Airthings air quality monitoring devices and their current sensor readings.',
    async () => {
        const devices = await client.getDevices();
        const sensors = await client.getSensors(SensorUnits.Imperial);

        const lines: string[] = [];
        devices.devices.forEach((d) => {
            lines.push(`${d.name} is an Airthings ${d.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`
                + ` with serial number ${d.serialNumber} that supports the following air quality sensors: ${d.sensors.join(', ')}.`);

            const sensorData = sensors.results.find(r => r.serialNumber === d.serialNumber);
            if (sensorData && sensorData.recorded) {
                lines.push(`Current air quality sensor readings for ${d.name}:`);
                sensorData.sensors.forEach((s) => {
                    lines.push(`- ${s.sensorType}: ${s.value}${s.unit}`);
                });
            }
            else {
                lines.push(`No current readings are available for ${d.name}.`);
            }

            lines.push('');
        });

        return {
            content: [{
                type: 'text',
                text: lines.join('\n')
            }]
        };
    }
);

server.tool(
    'airthings-remote-control-get',
    'Get the current remote control state of an Airthings Renew air purifier.',
    {
        serialNumber: z.string().describe('The serial number of the Renew device')
    },
    async ({ serialNumber }) => {
        const state = await client.getRemoteControl(serialNumber);

        let text = `Mode: ${state.mode}`;
        if (state.fanSpeed !== undefined) {
            text += `\nFan Speed: ${state.fanSpeed}`;
        }

        return {
            content: [{
                type: 'text' as const,
                text
            }]
        };
    }
);

server.tool(
    'airthings-remote-control-set',
    'Set the remote control mode of an Airthings Renew air purifier. Available modes: OFF, AUTO, SLEEP, BOOST, MANUAL. Fan speed (1-5) is required for MANUAL mode.',
    {
        serialNumber: z.string().describe('The serial number of the Renew device'),
        mode: z.nativeEnum(RemoteControlMode).describe('The operational mode to set'),
        fanSpeed: z.number().min(1).max(5).optional().describe('Fan speed level (1-5), required for MANUAL mode')
    },
    async ({ serialNumber, mode, fanSpeed }) => {
        const state: RemoteControlState = { mode };
        if (fanSpeed !== undefined) {
            state.fanSpeed = fanSpeed;
        }

        await client.setRemoteControl(serialNumber, state);

        let text = `Successfully set ${serialNumber} to ${mode} mode`;
        if (fanSpeed !== undefined) {
            text += ` at fan speed ${fanSpeed}`;
        }
        text += '.';

        return {
            content: [{
                type: 'text' as const,
                text
            }]
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);
