import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import axios, { AxiosPromise } from 'axios';
import {Message} from "discord.js";

dotenv.config();

interface Labels {
    insult: boolean,
    toxicity: boolean,
    severe_toxicity: boolean,
    threat: boolean
};

interface ToxicityResults {
    results: Labels,
    filteredSentence: string
};

bootstrapBot();

async function assessToxicity(sentence: string): Promise<ToxicityResults> {
    const toxicityResult = await axios.post(process.env.TOXICITY_API, {
        sentence
    });
    return {...toxicityResult.data};
}

async function kickUser(msg: Message): Promise<boolean> {
    const member = await msg.mentions.members.first();
    member.kick();
    return member.kickable;
}

function isMsgToxic(results: Labels): boolean {
    return Object.keys(results).some(label => results[label] === true);
}

function displayKickMessage(msg: Message): void {
    const { author, channel } = msg;
    channel.send(`Should I kick ${author}? Enter \"!kick ${author}\" to kick them.`)
}

function bootstrapBot() {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    })

    client.on('message', async (msg) => {
        const { author, channel, content, mentions } = msg;

        if (author.bot) {
            return;
        }

        if ( content.includes('!kick') ) {
            const faultyUser = mentions.members.first();
            console.log(`Kicking ${faultyUser}!`);
            if ( await kickUser(msg) ) {
                channel.send(`${faultyUser} was kicked!`)
            }
            return;
        }

        const { results } = await assessToxicity(content.toLowerCase());

        console.log(content);

        if (isMsgToxic(results)) {
            channel.send(`${author} said \"${content}\" which is pretty toxic!`);
            displayKickMessage(msg);
        } else {
            console.log(`${content} is not considered toxic.`);
        }
    })

    client.login(process.env.TOKEN);
}
