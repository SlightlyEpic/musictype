export type lrcTimedArray = Array<[seconds: number, lyric: string]>;
export type lyricsJson = {
    lyrics: {
        syncType: string,
        lines: Array<{ startTimeMs: string, words: string, endTimeMs: string }>
    }
};

export type songMetadata = {
    name: string,
    length: number,
    songURL: string,
    lyricsURL: string,
    imageURL: string | null
};

export async function fetchLrc(src: string): Promise<string> {
    return (await fetch(src)).text();
}

export async function fetchJson(src: string): Promise<lyricsJson> {
    return (await fetch(src)).json();
}

export async function fetchJsonExternal(src: string): Promise<lyricsJson> {
    return (await fetch(src)).json();
}

export function lrcToTimedArray(plaintext: string): lrcTimedArray {
    return plaintext
    .split("\n")
    .filter(line => line[0] != '@')
    .map(line => [(parseInt(line.slice(1, 3)) * 60 + parseFloat(line.slice(4, 9))) * 1000, line.slice(10)]);
}

export function jsonToTimedArray(json: lyricsJson): lrcTimedArray {
    return json.lyrics.lines.map(v => [parseInt(v.startTimeMs), v.words]);
}

export function getImageURL(plaintext: string): string | null {
    if(plaintext.trimStart()[0] != '@') return null;
    return plaintext.trimStart().split('\n', 2)[0].split(' ', 2)[1];
}
