<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import { ref } from 'vue';
import * as lrc from '@helperScripts/lrcHelper';

let lrcFile: lrc.lrcTimedArray;

let prevLyrics = ref<Array<string>>([]);
let currentLyric = ref("");

let currIndex = -1;
let startTime: ReturnType<typeof Date.now>;
let lastUpdateTime: ReturnType<typeof Date.now>;
let pauseTime: ReturnType<typeof Date.now>;
let scrollerTimeout: ReturnType<typeof setInterval> | null = null;
let paused = false;

const emit = defineEmits(['newLyric'])

async function nextLyric() {
    if(++currIndex == lrcFile.length || paused) return;

    if(currentLyric.value) prevLyrics.value.push(currentLyric.value);
    if(prevLyrics.value.length > 3) prevLyrics.value.shift();
    currentLyric.value = lrcFile[currIndex][1];
    emit('newLyric', lrcFile[currIndex][1]);

    lastUpdateTime = Date.now();

    scrollerTimeout = setTimeout(nextLyric, lrcFile[currIndex + 1][0] - lastUpdateTime + startTime);
}

async function start(name: string) {
    if(!lrcFile) lrcFile = lrc.lrcToTimedArray(await lrc.fetchLrc(name));

    prevLyrics.value = [];
    currIndex = -1;
    startTime = Date.now();
    // lastUpdateTime = Date.now();
    clearInterval(scrollerTimeout!);
    scrollerTimeout = null;

    scrollerTimeout = setTimeout(nextLyric, lrcFile[0][0]);
}

function pause() {
    console.log('Paused');
    paused = true;
    pauseTime = Date.now();
    clearTimeout(scrollerTimeout!);
    scrollerTimeout = null;
}

function resume() {
    if(!scrollerTimeout) scrollerTimeout = setTimeout(nextLyric, lrcFile[currIndex][0] - pauseTime + startTime);
}

defineExpose({ start, resume, pause, currIndex });
</script>

<template>
<div id="containerLyrics" class="inline-flex flex-col justify-start place-items-center h-fit w-full">
    <div ref="prevLyricsRef" class="text-t-light text-center whitespace-pre-line flex-grow-0 w-full">{{ prevLyrics.join('\n') }}</div>
    <div ref="currentLyricRef" class="text-t-lightest flex-grow-0 text-center w-full">{{ currentLyric }}</div>
</div>
</template>
