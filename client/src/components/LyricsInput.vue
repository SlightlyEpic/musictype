<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import LyricsEE from '@cmp/LyricsEE.vue';
import { RestrictedDiffedInput } from '@helperScripts/VirtualCursor';
import { getFormatted } from '@helperScripts/Differ';

const props = defineProps<{ cursor: boolean }>();

const validKeyRegex = /^[a-z0-9,.'"?!:;()-]$/i;
const spaces = new Array(100).fill(' ').join('');
const newlines = new Array(6).fill('\n').join('');

let vinput = ref<RestrictedDiffedInput>();

let cursorDivRef = ref<HTMLDivElement | null>(null);
let lyricsWrapperRef = ref<HTMLDivElement | null>(null);
let lyricsEERef = ref<InstanceType<typeof LyricsEE> | null>(null);
let diffedLyricsRef = ref<HTMLDivElement | null>(null);
let inputWrapperRef = ref<HTMLDivElement | null>(null);
let frozen = false;

let cursorText = computed(() => {
    if(!vinput.value) return '\n\n\n\n';
    return newlines.slice(0, vinput.value.relativeCursorLine) + 
        spaces.slice(0, vinput.value.cursorPos) + 
        '|' + 
        spaces.slice(0, vinput.value.currentLineLength - vinput.value.cursorPos);
})

let diffText = computed(() => {
    if(!vinput.value) return '';
    return getFormatted(
        vinput.value.targetLines.slice(
            vinput.value.cursorLine - vinput.value.relativeCursorLine, 
            vinput.value.cursorLine + (vinput.value.maxLines - vinput.value.relativeCursorLine)
        ),
        vinput.value.actualLines.slice(
            vinput.value.cursorLine - vinput.value.relativeCursorLine, 
            vinput.value.cursorLine + (vinput.value.maxLines - vinput.value.relativeCursorLine)
        ),
        4
    );
})

onMounted(() => {
    new ResizeObserver(entries => {
        cursorDivRef.value!.style.height = `${Math.max(...entries.map(e => e.target.clientHeight))}px`;
        // cursorDivRef.value!.style.width = diffedLyricsRef.value!.style.width = `${Math.max(...entries.map(e => e.target.clientWidth))}px`;
    }).observe(lyricsWrapperRef.value as Element);


    inputWrapperRef.value!.onblur = () => inputWrapperRef.value!.focus();
});

function keydownHandler(ev: KeyboardEvent) {
    if(frozen || !vinput.value) return;

    if(ev.key == 'Tab') ev.preventDefault();
    else if(ev.ctrlKey && ev.key == 'Backspace') {
        vinput.value.deleteLastWord();
    }
    else if(ev.key == 'Backspace') {
        vinput.value.backspace();
    }
    else if(ev.key == ' ') {
        vinput.value.space();
    }
    else if(ev.key == 'Enter') {
        vinput.value.enter();
    }
    else if(validKeyRegex.test(ev.key.toLowerCase())) {
        vinput.value.type(ev.key);
    }
}

let i = 0;
function addLyric(lyric: string) {
    // if(++i > 5) lyricsScrollerRef.value?.pause();
    vinput.value!.addLine(lyric);
    vinput.value!.forceUpdate();
}

const start = (src: string) => {
    vinput.value = new RestrictedDiffedInput(4);
    return lyricsEERef.value?.start(src);
}
const pause = () => lyricsEERef.value?.pause();
const resume = () => lyricsEERef.value?.resume();
const stop = () => lyricsEERef.value?.stop();
const setFocus = () => {
    if(inputWrapperRef.value) {
        inputWrapperRef.value.focus();
    }
}

defineExpose({
    inputHandler: vinput,
    start, pause, resume, stop, setFocus
});

</script>

<template>
<div ref="inputWrapperRef" class="relative focus:outline-none" @keydown="keydownHandler" tabindex="0">
    <div ref="cursorDivRef" class="absolute left-0 w-full top-0 pointer-events-none whitespace-pre-wrap text-2xl font-agave text-center">{{ cursorText }}</div>
    <div ref="diffedLyricsRef" class="float-right h-fit w-full left-0 top-0 pointer-events-none whitespace-pre-wrap text-2xl font-agave text-center" v-html="diffText"></div>
    <div ref="lyricsWrapperRef" class="flex flex-col justify-items-start">
        <LyricsEE ref="lyricsEERef" @new-lyric="addLyric" class="hidden w-full text-2xl shadow-lbar"></LyricsEE>
    </div>
</div>
</template>
