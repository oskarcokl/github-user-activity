#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { exit } from 'process';

type UserActivityData = {
    type: string; // change to enum
    repo: {
        name: string;
    };
};

const endpoint = (userName: string) => `https://api.github.com/users/${userName}/events/public`;

function main(args: string[]) {
async function main(args: string[]) {
    const username = args[0];

    if (typeof username === 'undefined') {
        printHelpMessage();
        console.error('ERROR: No username provided');
        exit(1);
    }

    const parsedData: { [key: string]: any } = {};

    try {
        const res = await fetch(endpoint(username));
        const data = (await res.json()) as UserActivityData[];
        data.forEach((event) => {
            if (!parsedData[event.type]) parsedData[event.type] = [];

            parsedData[event.type].push(event);
        });
        writeFileSync('dump.json', JSON.stringify(data), { flag: 'w+' });
    } catch (error) {
        // handle fetch error
    }
}

const helpMessage = `
You can use this script to view a users github activity

Usage:
    github-activity.js <user-name>
`;
function printHelpMessage() {
    console.log(helpMessage);
}

main(process.argv.slice(2, process.argv.length));
