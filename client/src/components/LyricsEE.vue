<script setup lang="ts">
import * as lrc from '@helperScripts/lrcHelper';

let lrcFile: lrc.lrcTimedArray;

let currIndex = -1;
let startTime: ReturnType<typeof Date.now>;
let lastUpdateTime: ReturnType<typeof Date.now>;
let pauseTime: ReturnType<typeof Date.now>;
let scrollerTimeout: ReturnType<typeof setInterval> | null = null;
let paused = false;

const emit = defineEmits<{ newLyric: [lyric: string] }>();

async function nextLyric() {
    if(paused) return;
    if(++currIndex === lrcFile.length) return;
    
    emit('newLyric', lrcFile[currIndex][1]);
    
    lastUpdateTime = Date.now();

    if(currIndex + 1 === lrcFile.length) return;
    scrollerTimeout = setTimeout(nextLyric, lrcFile[currIndex + 1][0] - lastUpdateTime + startTime);
}

async function start(src: string) {
    lrcFile = lrc.lrcToTimedArray(await lrc.fetchLrc(src));

    currIndex = -1;
    startTime = Date.now();
    clearInterval(scrollerTimeout!);
    scrollerTimeout = null;

    scrollerTimeout = setTimeout(nextLyric, lrcFile[0][0]);
}

function pause() {
    paused = true;
    pauseTime = Date.now();
    clearTimeout(scrollerTimeout!);
    scrollerTimeout = null;
}

function stop() {
    clearInterval(scrollerTimeout!);
    paused = false;
    currIndex = -1;
}

function resume() {
    if(!scrollerTimeout) scrollerTimeout = setTimeout(nextLyric, lrcFile[currIndex][0] - pauseTime + startTime);
}

defineExpose({ start, resume, stop, pause, currIndex });
</script>

<template>
</template>
