import { songMetadata } from "@helperScripts/lrcHelper"

export type attempt = {
    targetText: string,
    actualText: string,
    timeTaken: number,
    song: songMetadata
};

export type analysis = {
    accuracyOverall: number,
    accuracyTyped: number,
    totalMisses: number,
    misses: Map<string, number>,
    mostMissed: string,
    song: songMetadata
};

export const _emptyAnalysis: analysis = {
    accuracyOverall: 0,
    accuracyTyped: 0,
    totalMisses: 0,
    misses: new Map(Object.entries(new Array(26).fill(0).reduce((a, v, i) => {
        a[String.fromCharCode(i + 97)] = 0;
        return a;
    }, {}))),
    mostMissed: 'a',
    song: {
        name: 'Something',
        length: 0,
        imageURL: '',
        lyricsURL: '',
        songURL: ''
    }
};

export const _randomAnalysis: () => analysis = () => {
    let a = structuredClone(_emptyAnalysis);
    a.misses = new Map(Object.entries(new Array(26).fill(0).reduce((a, v, i) => {
        a[String.fromCharCode(i + 97)] = Math.floor(Math.random() * 10);
        return a;
    }, {})))
    for(let entry of a.misses) {
        a.totalMisses += entry[1];
        if(entry[1] > a.misses.get(a.mostMissed)!) a.mostMissed = entry[0];
    }
    a.accuracyTyped = Math.random() * 100;
    a.accuracyOverall = Math.random() * 100;
    a.song.length = Math.floor(Math.random() * 10000);
    return a;
};

export function analyze(data: attempt): analysis {
    let analysis: analysis = structuredClone(_emptyAnalysis);

    const targetText = data.targetText;
    const actualText = data.actualText;
    const typedLetterCount = actualText.length;
    let letterCountTarget = 0;
    let letterCountActual = 0;
    
    let i: number;
    for(i = 0; i < typedLetterCount; i++) {
        if(targetText[i] === ' ' || targetText[i] === '\n') continue;
        if(targetText[i] !== actualText[i]) {
            analysis.totalMisses++;
            analysis.misses.set(targetText[i].toLowerCase(), (analysis.misses.has(targetText[i].toLowerCase()) ? analysis.misses.get(targetText[i].toLowerCase()) : 0)! + 1);
        }
        letterCountActual++;
    }

    letterCountTarget = letterCountActual
    for(; i < targetText.length; i++) {
        if(targetText[i] !== ' ' && targetText[i] !== '\n') letterCountTarget++;
    }

    analysis.accuracyOverall =  (1 - (analysis.totalMisses / (letterCountTarget + 1))) * 100;
    analysis.accuracyTyped = (1 - (analysis.totalMisses / (letterCountActual + 1))) * 100;
    for(let entry of analysis.misses) {
        if(entry[1] > analysis.misses.get(analysis.mostMissed)!) analysis.mostMissed = entry[0];
    }
    analysis.song = data.song;

    return analysis;
}

export function getSnarkyCommentFromAnalysis(analysis: analysis): string {
    // TODO
    return '';
}
