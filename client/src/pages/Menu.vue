<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import '@styles/base.css';

import { ref } from 'vue';
import type { songMetadata } from '@helperScripts/lrcHelper';

import SongWidget from '@cmp/SongWidget.vue';

const emit = defineEmits<{ play: [song: songMetadata] }>();

let songs = ref<songMetadata[]>([]);

fetch('/api/getSongMetadata')
.then(res => res.json())
.then((res: { [key: string]: songMetadata }) => songs.value = Object.values(res))
.catch(console.error);
</script>

<template>
        <div class="flex flex-row h-full w-full place-content-center">
            <div class="flex flex-col h-full place-content-center w-1/2 p-10 text-center">
                <div class="text-t-darkest font-barlow text-shadow-white font-semibold text-6xl xl:text-8xl 2xl:text-9xl">Welcome to</div>
                <div class="text-white font-barlow font-semibold text-6xl xl:text-8xl 2xl:text-9xl">musictype.</div>
                <div class="text-pink-400 font-barlow font-semibold whitespace-pre text-6xl text-shadow-pink-600 xl:text-8xl 2xl:text-9xl flex flex-row place-content-center"><span id="thing"></span> a song</div>
            </div>
            <div class="flex flex-col h-3/5 w-1/2 p-1 text-center overflow-y-auto place-self-center" :class="{ 'justify-center': !songs.length }">
                <div v-show="songs.length === 0" class="text-white font-barlow text-6xl justify-self-center">Loading</div>
                <SongWidget v-if="songs.length !== 0" v-for="song in songs" :data="song" class="rounded-xl" @click="() => emit('play', song)"></SongWidget>
            </div>
        </div>
</template>

<style>
@tailwind components;

@layer components {
    #thing {
        @apply h-[3.75rem] relative overflow-hidden whitespace-pre-wrap border-b-4 border-pink-400
    }

    #thing:after {
        height: 100%;
        content: "Pick\A\AType\A\APick";
        position: relative;
        top: 0px;
        animation: cycleText1 5s cubic-bezier(0.65, 0, 0, 1) infinite;
    }

    @media (min-width: 1280px) {
        #thing { @apply h-24; }
        #thing:after { animation-name: cycleText2; }
    }

    @media (min-width: 1536px) {
        #thing { @apply h-32; }
        #thing:after { animation-name: cycleText3; }
    }

    @keyframes cycleText1 {
        0% { top: 0px; }
        50% { top: -120px; }
        100% { top: -240px; }
    }

    @keyframes cycleText2 {
        0% { top: 0px; }
        50% { top: -192px; }
        100% { top: -384px; }
    }

    @keyframes cycleText3 {
        0% { top: 0px; }
        50% { top: -256px; }
        100% { top: -512px; }
    }

}
</style>
