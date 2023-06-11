<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import '@styles/base.css';

import { nextTick, onMounted, ref } from 'vue';

import VisualizerBars from '@cmp/VisualizerBars.vue';
import LyricsInput from '@cmp/LyricsInput.vue';
import { songMetadata } from '@helperScripts/lrcHelper';
import { formatMs } from '@helperScripts/format';
import { attempt } from '@/helperScripts/statAnalyzer';

let props = defineProps<{ data: songMetadata | undefined }>();
let emit = defineEmits<{
    started: [],
    finished: [],
    backToMenu: [],
    showStats: [data: attempt]
}>();

let lyricsInputRef = ref<InstanceType<typeof LyricsInput> | null>(null);
let visualizerRef = ref<InstanceType<typeof VisualizerBars> | null>(null);

let audio: HTMLAudioElement;
let audioCtx: AudioContext;
let audioSource: MediaElementAudioSourceNode;
// let analyser = ref<AnalyserNode>();
let analyser: AnalyserNode;

let started = ref(false);
let timeRemaining = ref<number>(0);
let timerInterval: ReturnType<typeof setInterval>;

async function start() {    
    audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = props.data!.songURL;

    audioCtx = new window.AudioContext();
    audioSource = audioCtx.createMediaElementSource(audio);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;

    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    visualizerRef.value?.updateAnalyzer(analyser);

    timeRemaining.value = props.data!.length;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if(timeRemaining.value > 250) timeRemaining.value -= 250;
        else if(timeRemaining.value > 0) timeRemaining.value = 0;
        else {
            clearInterval(timerInterval);
            showStats();
        }
    }, 250);

    started.value = true;
    emit('started');

    audio.play();
    audioCtx.resume();
    if(lyricsInputRef.value) {
        lyricsInputRef.value.start(props.data!.lyricsURL);
        await nextTick();
        lyricsInputRef.value.setFocus();
    }
}

async function stop() {
    started.value = false;
    clearInterval(timerInterval);
    if(audioCtx.state !== 'closed') audioCtx.close();
    audioSource.disconnect();
    analyser?.disconnect();
    lyricsInputRef.value?.stop();
    timeRemaining.value = 0;
}

async function stopAndQuit() {
    await stop();
    emit('backToMenu');
}

function showStats() {
    if(!lyricsInputRef.value || !lyricsInputRef.value.inputHandler || !props.data) return;
    stop();
    emit('showStats', {
        targetText: lyricsInputRef.value.inputHandler.targetLines.join('\n'),
        actualText: lyricsInputRef.value.inputHandler.actualLines.join('\n'),
        timeTaken: props.data.length,
        song: props.data
    });
}

defineExpose({ start });
</script>

<template>
<div id="container" v-show="started" class="flex flex-row items-center place-content-center h-full w-full">
    <div class="fixed left-8 top-6 text-2xl cursor-pointer" @click="stopAndQuit">← Back</div>
    <div class="flex flex-col items-center place-content-start h-full">
        <VisualizerBars ref="visualizerRef" v-if="started" :analyzer="analyser" :width="1200" :height="500" class="flex-shrink-0 mb-10"></VisualizerBars>

        <LyricsInput ref="lyricsInputRef" :cursor="false" class="w-4/5 h-fit"></LyricsInput>
        <div class="w-[70%] pt-10">{{ formatMs(timeRemaining) }}</div>
        <!-- <div class="w-[70%] pt-10">Time: {{ timeRemaining }}</div> -->
        <div v-if="props.data" class="w-[70%] rounded-full bg-t-dark h-2 overflow-clip">
            <div class="h-full bg-t-lightest" :style="`width: ${(1 - timeRemaining / props.data.length) * 100}%`"></div>
        </div>
        <div v-if="props.data" class="flex flex-row w-[70%] justify-between pt-2">
            <div class="w-full h-full">Now playing: <span class="text-white">{{ props.data.name }}</span></div>
            <div class="w-full h-full text-end cursor-pointer" @click="showStats">End Attempt →</div>
        </div>
    </div>
</div>
<!-- <button v-if="!started" @click="start" class="w-32 h-32 rounded-xl bg-t-light">Start</button> -->
</template>
