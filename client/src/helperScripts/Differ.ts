export function diffLine(original: string, modified: string): string {
    const min = Math.min(original.length, modified.length);
    const max = Math.max(original.length, modified.length);

    let colour = '';

    let i;
    for(i = 0; i < min; i++) {
        if(original[i] == modified[i]) colour += 'g';
        else colour += 'r';
    }

    // for(; i < max; i++) {
    //     colour += 'r';
    // }

    return colour;
}

export function groupIslands(diff: string): Array<[string, number]> {
    let i = 0;
    let groups: Array<[string, number]> = [];
    let currGroup = 1;
    diff += '='

    while(i < diff.length - 1) {
        while(diff[i] == diff[i + 1]) {
            currGroup++;
            i++;
        }

        groups.push([diff[i], currGroup])
        i++;
        currGroup = 1;
    }

    return groups;
}

export function formatStringUsingDiffIslands(s: string, islands: Array<[string, number]>): string {
    let curr = 0;
    let out = '';

    for(let i = 0; i < islands.length; i++) {
        out += islands[i][0] == 'r' ? '<span class="text-rose-500">' : '<span class="text-green-500">'
        out += s.slice(curr, curr + islands[i][1]);
        out += '</span>'
        curr += islands[i][1];
    }

    out += s.slice(curr);

    return out;
}

const newlines = '\n'.repeat(10);
export function getFormatted(target: Array<string>, actual: Array<string>, minLines: number): string {
    if(!target || !target.length || !actual || !actual.length) return newlines.slice(0, minLines);

    // console.log(`Recieved act:\n"${actual.join('\n')}"`)
    // console.log(`Recieved tar:\n"${target.join('\n')}"`)

    let diffLines = actual.map((v, i) => diffLine(target[i], v));
    let islandDiffLines = diffLines.map(groupIslands);
    let formatted = islandDiffLines.map((v, i) => formatStringUsingDiffIslands(target[i], v));
    let concatanated = formatted.concat(target.slice(formatted.length));
    if(concatanated.length < minLines) concatanated = concatanated.concat(new Array(minLines + 1 - concatanated.length));

    // console.log(`diff: ${diffLines.join('\n')}`);
    // console.log(`islands: ${islandDiffLines.join('\n')}`);
    // console.log(`Formatted: ${formatted.join('\n')}`);
    return concatanated.join('\n');
}
