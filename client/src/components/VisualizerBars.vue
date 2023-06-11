<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import { onMounted } from 'vue';

// @ts-ignore because p5 typings do not work :|
import p5 from 'p5';

const props = defineProps<{ analyzer: AnalyserNode, width: number, height: number }>();

let analyzer = props.analyzer;

const script = (sketch: any) => {
    const s = sketch;
    
    const bufferLength = analyzer.frequencyBinCount;
    
    let barWidth: number;
    let dataArray = new Uint8Array(bufferLength);
    let canvas: any;
    
    s.setup = () => {
        canvas = s.createCanvas(props.width, props.height);
        canvas.parent(document.getElementById("containerBars"));
        

        barWidth = canvas.width / bufferLength;
        
        s.frameRate(60);
    }
    
    s.draw = () => {  
        analyzer.getByteFrequencyData(dataArray);
        
        // s.background(0);

        // This is framerate dependent but i cba
        // s.fill(`rgba(0, 0, 0, 0.05)`);
        // s.rect(0, 0, canvas.width, canvas.height);

        s.clear();
        
        const start = 0;
        const end = Math.min(start + 45, analyzer.frequencyBinCount);
        
        let currX = (canvas.width - (end - start) * barWidth) / 2;
        let barHeight;

        s.noFill();
        for (let i = start; i < end; i++) {
            barHeight = dataArray[i] * Math.abs(Math.sin((i - start + 1) * Math.PI * 0.9 / (end - start + 1))) * 2;
            // barHeight = (i - start) * 500 / (end - start);
            
            // const red = Math.abs(Math.sin(barHeight / 120)) * 200 + 30;
            // const green =  Math.abs(Math.sin(barHeight / 150)) * 100;
            // const blue = Math.abs(Math.sin(barHeight / 90)) * 200 + 30;
            
            const c1 = [0, 0, 255];
            const c2 = [255, 0, 0];
            
            const red = ((c2[0] - c1[0]) * (i - start) / (end - start) + c1[0]) * (Math.min(0.9, barHeight / 100) + 0.1);
            const green = ((c2[1] - c1[1]) * (i - start) / (end - start) + c1[1]) * (Math.min(0.9, barHeight / 100) + 0.1);
            const blue = ((c2[2] - c1[2]) * (i - start) / (end - start) + c1[2]) * (Math.min(0.9, barHeight / 100) + 0.1);

            if(barHeight > 10) s.stroke(255);
            else s.noStroke();

            // if(barHeight > 10) s.fill(red, green, blue);
            // else s.noFill();

            s.fill(red, green, blue);

            s.rect(currX, (canvas.height - barHeight) - 10, barWidth-1, barHeight + 10/*, 5, 5, 5, 5*/);

            currX += barWidth;
        }
    }
}

onMounted(() => {
    new p5(script);
});

function updateAnalyzer(newAnalyzer: AnalyserNode) {
    analyzer = newAnalyzer;
}

defineExpose({ updateAnalyzer });
</script>

<template>
    <div id="containerBars"></div>
</template>
