<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import '@styles/base.css';

import { ref, nextTick } from 'vue';
import type { songMetadata } from '@helperScripts/lrcHelper';

import Menu from '@pages/Menu.vue';
import Player from '@pages/Player.vue';
import Stats from '@pages/Stats.vue';
import { attempt } from '@helperScripts/statAnalyzer';

enum State { Menu = 0, Player = 1, Stats = 2 };

let songs = ref<songMetadata[]>([]);
let currentlyPlaying = ref<songMetadata>();
let currentState= ref<State>(State.Menu);

let playerRef = ref<InstanceType<typeof Player> | null>(null);
let statsRef = ref<InstanceType<typeof Stats> | null>(null);

fetch('/api/getSongMetadata')
.then(res => res.json())
.then((res: { [key: string]: songMetadata }) => songs.value = Object.values(res))
.catch(console.error);

function play(song: songMetadata) {
    currentlyPlaying.value = song
    currentState.value = State.Player;
    nextTick()
    .then(playerRef.value?.start);
}

function backToMenu() {
    currentlyPlaying.value = undefined;
    currentState.value = State.Menu;
}

function showStats(attempt: attempt) {
    currentState.value = State.Stats;
    statsRef.value!.show(attempt);
}
</script>

<template>
    <div v-show="currentState === State.Menu" class="h-full w-full">
        <Menu @play="play"></Menu>
    </div>

    <div v-show="currentState === State.Player" class="flex flex-col w-full h-full items-center place-content-center">
        <Player ref="playerRef" :data="currentlyPlaying" @backToMenu="backToMenu" @showStats="showStats"></Player>
    </div>

    <div v-show="currentState === State.Stats" class="w-full h-full">
        <Stats ref="statsRef" @backToMenu="backToMenu"></Stats>
    </div>
</template>
