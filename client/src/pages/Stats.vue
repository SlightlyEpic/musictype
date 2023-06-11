<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import '@styles/base.css';

import { ref, Ref, computed, onMounted, nextTick, h } from 'vue';
import { attempt, analysis, _emptyAnalysis, _randomAnalysis, analyze } from '@helperScripts/statAnalyzer';
import { wait } from '@/helperScripts/wait';

const emit = defineEmits<{ backToMenu: [] }>();

let barScale = ref(0);

let currentlyShowing: Ref<analysis> = ref(_emptyAnalysis);
currentlyShowing.value = _emptyAnalysis;

let sortedMisses = computed(() => {
    return new Array(...currentlyShowing.value.misses).sort((a, b) => a[1] > b[1] ? 1 : -1);
})

function show(attempt: attempt) {
    showAnalysis(analyze(attempt));
    console.log('aaaaaaa');
}

// Resolves after all animations are complete
async function showAnalysis(analysis: analysis) {
    // idk this gives enough time to vue to first render _emptyAnalysis so that
    // when currentlyShowing is changed the bars growing animation shows up properly
    await wait(50);

    // If its not _emptyAnalysis
    if(currentlyShowing.value.song.length !== 0 && barScale.value !== 0) {
        barScale.value = 0;
        await wait(2000);
    }
    currentlyShowing.value = analysis;
    barScale.value = 100;

    await wait(2000);
}

function backToMenu() {
    currentlyShowing.value = _emptyAnalysis;
    emit('backToMenu');
}

function getHeightPercent(entry: [string, number]): number {
    return entry[1] * 100 / (currentlyShowing.value.misses.get(currentlyShowing.value.mostMissed)! + 1)
}

// onMounted(async () => {
//     await wait(0);
//     await showAnalysis(_randomAnalysis());
//     await showAnalysis(_randomAnalysis());
//     await showAnalysis(_randomAnalysis());
// })

defineExpose({ show });
</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="fixed left-8 top-6 text-2xl cursor-pointer" @click="backToMenu">← Back</div>
        <div class="w-3/4 text-t-lightest text-4xl xl:text-6xl 2xl:text-7xl justify-self-start">Statistics</div>
        <div class="w-3/4 h-1 bg-t-light"></div>
        <div class="w-3/4 h-1/2 flex flex-row items-end">
            <div class="w-full transition-all duration-[2s] flex flex-row items-end justify-items-start" :style="`height: ${barScale}%`">
                <div v-for="entry in sortedMisses" :key="entry[0]"
                class="max-w-lg bg-t-light flex-grow flex-shrink -ml-[2px] border-2 border-t-lightest min-h-[1.5rem] text-center
                t-bar hover:bg-t-dark" 
                :style="`height: ${getHeightPercent(entry)}%`">{{ entry[0] }} {{ entry[1] }}</div>
            </div>
        </div>
        <div class="w-3/4 h-fit flex flex-col justify-start pt-4">
            <div class="text-xl flex flex-row items-center">
                <div class="w-3/12">Accuracy Overall</div>
                <span class="h-full w-1/12 pr-2 text-start overflow-clip whitespace-nowrap">{{ `${Math.floor(currentlyShowing.accuracyOverall)}%` + ' ——————————————' }}</span>
                <div class="w-8/12 h-1/2 bg-t-darker rounded-full overflow-clip flex flex-row text-xs"><div class="h-full transition-all duration-1000 bg-t-light" :style="`width: ${currentlyShowing.accuracyOverall}%`"></div></div>
            </div>
            <div class="text-xl flex flex-row items-center">
                <div class="w-3/12">Accuracy Typed</div>
                <span class="h-full w-1/12 pr-2 text-start overflow-clip whitespace-nowrap">{{ `${Math.floor(currentlyShowing.accuracyTyped)}%` + ' ——————————————' }}%</span>
                <div class="w-8/12 h-1/2 bg-t-darker rounded-full overflow-clip"><div class="h-full transition-all duration-1000 bg-t-light" :style="`width: ${currentlyShowing.accuracyTyped}%`"></div></div>
            </div>
            <div class="text-xl flex flex-row items-center">
                <div class="w-3/12">Total misses: </div>
                <div ref="totalMissesRef" class="w-1/12 text-white text-start pr-2 whitespace-pre-wrap">{{ currentlyShowing.totalMisses.toString().padEnd(3)  }}</div>
            </div>
            <div class="text-xl flex flex-row items-center">
                <div class="w-3/12">Most missed Character: </div>
                <div ref="mostMissedRef" class="w-1/12 text-start text-white pr-2 whitespace-pre-wrap">{{ currentlyShowing.mostMissed.padEnd(3) }}</div>
            </div>
            <div class="text-xl flex flex-row items-center">
                <div class="w-3/12">Song: </div>
                <div ref="mostMissedRef" class="w-9/12 text-start text-white pr-2 whitespace-pre-wrap">{{ currentlyShowing.song.name }}</div>
            </div>
        </div>
    </div>
</template>

<style>
@tailwind components;

@layer components {
    .t-bar {
        transition: hight 3s ease, background-color 150ms ease, border-color 150ms ease;
    }

    .t-bar:hover {
        transition: height 3s ease;
    }
}
</style>
