<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import { songMetadata } from '@/helperScripts/lrcHelper';
import { formatMs } from '@/helperScripts/format';

let props = defineProps<{ data: songMetadata }>();
</script>

<template>
<div class="flex flex-row cursor-pointer h-24 transition-all duration-75 hover:ring-4 hover:ring-t-lightest">
    <img v-if="props.data.imageURL" :src="props.data.imageURL" class="aspect-square h-24 p-2 rounded-2xl overflow-hidden">
    <div class="flex flex-col w-3/5 text-start">
        <div class="text-white text-3xl font-light h-3/5 pl-4 flex flex-col justify-end">{{ props.data.name }}</div>
        <div class="text-t-lightest text-lg h-2/5 pl-4 justify-center">{{ formatMs(props.data.length) }}</div>
    </div>
    <div class="flex flex-col flex-grow text-xl text-left justify-center">⭐⭐⭐</div>
</div>
</template>
