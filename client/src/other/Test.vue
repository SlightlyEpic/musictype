<script setup lang="ts">
import '@styles/base.css';
import 'tailwindcss/tailwind.css';

import VisualizerBars from '@cmp/VisualizerBars.vue';
import VisualizerSphere from '@cmp/VisualizerSphere.vue';
import VisualizerMix from '@cmp/VisualizerMix.vue';
import LyricsScroller from '@cmp/LyricsScroller.vue';

let audio = new Audio();
// audio.src = `/audio/${prompt('Song:')}.mp3`;
audio.src = '/audio/PlayingGod.mp3';

const audioCtx = new window.AudioContext();
let audioSource = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);

function play() {
    audio.play();
    audioCtx.resume();
}

function pause() {
    audio.pause();
}
</script>

<template>
<div class="flex flex-col  w-screen items-center">
    <button v-on:click="play">Play</button>
    <button v-on:click="pause">Pause</button>

    <div class="inline-flex h-fit">
        <VisualizerBars :analyzer="analyser" :width="1200" :height="800"
        class="absolute left-0 top-20"></VisualizerBars>
        <!-- <VisualizerSphere :analyzer="analyser" :width="1200" :height="800"
        class="absolute left-0 top-20"></VisualizerSphere> -->

        <!-- <VisualizerMix :analyzer="analyser" :width="1200" :height="800"
        class="absolute left-0 top-20"></VisualizerMix> -->

        <!-- <LyricsScroller></LyricsScroller> -->
    </div>
</div>
</template>
