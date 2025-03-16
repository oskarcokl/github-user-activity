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

    console.log(`Output:`);
    Object.keys(parsedData).forEach((key) => {
        switch (key) {
            case 'WatchEvent':
                parsedData[key].forEach((userEvent: UserActivityData) =>
                    console.log(`- Watched ${userEvent.repo.name}`)
                );
                break;
            case 'PushEvent':
                const commitsToRepos: { [key: string]: number } = {};
                parsedData[key].forEach((userEvent: UserActivityData) => {
                    const repo = userEvent.repo.name;
                    if (!commitsToRepos[repo]) commitsToRepos[repo] = 0;
                    commitsToRepos[repo]++;
                });

                Object.keys(commitsToRepos).forEach((repo) =>
                    console.log(`- Pushed ${commitsToRepos[repo]} commits to ${repo}`)
                );

                break;
            case 'PullRequestEvent':
                break;
            case 'CreateEvent':
                break;

            default:
                console.error(`Event type not supported ${key}`);
                break;
        }
    });
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
