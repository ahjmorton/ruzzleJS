'use strict';

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const wordlist = {};
const markov = {};

function cleanAndSplit(input) {
    return input.toLowerCase().trim().replace(/\W/g, '').split(/\s+/g);
}

function shouldAdd(input) {
    return input && input.length > 1 && !(input in wordlist);
}

rl.on('line', (line) => {
    const inputs = cleanAndSplit(line);
    inputs.forEach((input) => {
        if(shouldAdd(input)) {
            wordlist[input] = null;
            for(let i = 0; i < input.length - 1; i++) {
                const j = i + 1;
                const base = input[i];
                const next = input[j];
                if(!(base in markov)) {
                    markov[base] = {};
                }
                const frequencies = markov[base];
                if(!(next in frequencies)) {
                    frequencies[next] = 0;
                }
                frequencies[next]++;
            }
        }
    });
});

function frequenciesToProb(markov) {
    const result = {};
    for(const base in markov) {
        const frequencies = markov[base];
        let total = 0; 
        for(const next in frequencies) {
            total += frequencies[next];
        }
        const baseProbabilities = {};
        for(const next in frequencies) {
             baseProbabilities[next] = frequencies[next] / total;
        }
        result[base] =  baseProbabilities;
    }
    return result;
}

rl.on('close', () => {
    const result = {
        wordlist,
        markov : frequenciesToProb(markov)
    }
    console.log(JSON.stringify(result));
});

