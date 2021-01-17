import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import '@tensorflow/tfjs-node';
import * as toxicity from '@tensorflow-models/toxicity';

const TOXIC_LABELS = ["insult", "toxicity", "severe_toxicity", "threat"];

export const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
        const threshold = 0.9;
        const content = req.body;
        const { sentence, whitelist } = content;
        let filteredSentence = sentence;
        context.log(`Gauging toxicity of \"${sentence}\" ${whitelist ? `while excluding those words \"${whitelist}\"` : ''}`)

        if ( whitelist ) {
            filteredSentence = filterSentence(sentence, whitelist);
        }

        const model = await toxicity.load(threshold, TOXIC_LABELS);
        const predictions = await model.classify(filteredSentence);
        const results = parsePredictions(predictions);

        context.res = {
            body: {
                results,
                filteredSentence
            }
        };
}

function filterSentence(sentence, whitelist) {
    return sentence.split(' ').filter(word => {
        return !whitelist.includes(word);
    }).join(' ');
}

function parsePredictions(predictions) {
    return Object.keys(predictions).reduce((prev, cur, idx) => {
        return {...prev, [TOXIC_LABELS[idx]]: predictions[cur].results[0].match};
    }, {});
}
