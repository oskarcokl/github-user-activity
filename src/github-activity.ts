#!/usr/bin/env node

import { exit } from 'process';

const endpoint = (userName: string) => `https://api.github.com/users/${userName}/events/public`;

function main(args: string[]) {
    const username = args[0];

    if (typeof username === 'undefined') {
        printHelpMessage();
        console.error('ERROR: No username provided');
        exit(1);
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
