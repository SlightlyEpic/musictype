<script setup lang="ts">
import 'tailwindcss/tailwind.css';
import { onMounted } from 'vue';

// @ts-ignore because p5 typings do not work :|
import p5 from 'p5';

const props = defineProps<{ analyzer: AnalyserNode, width: number, height: number }>();

const script = (sketch: any) => {
    const s = sketch;
    
    props.analyzer.fftSize = 128;
    const bufferLength = props.analyzer.frequencyBinCount;
    const dots = 25;
    
    let barWidth: number;
    let dataArray = new Uint8Array(bufferLength);
    let canvas: any;
    
    s.setup = () => {
        canvas = s.createCanvas(props.width, props.height);
        canvas.parent(document.getElementById("containerSph"));
        

        barWidth = canvas.width / bufferLength;

        s.frameRate(60);
    }
    
    s.draw = () => {
        props.analyzer.getByteFrequencyData(dataArray);
        
        // s.background(0);
        s.clear();

        const start = 15;
        const end = Math.min(start + dots, props.analyzer.frequencyBinCount);
        
        let currX = (canvas.width - (end - start) * barWidth) / 2;
        let barHeight;

        s.translate(canvas.width / 2, canvas.height / 2);
        s.beginShape();
        for (let i = start; i < end; i++) {
            barHeight = dataArray[i] * ((i - start) < 3 ? 0.6 + ((i - start) / 10) : 1);

            let r = 100 + barHeight * 0.75;
            let theta = 2 * Math.PI * ((i - start) / (end - start)) - (Math.PI  / 2);

            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);

            let lineX = x * 0.8;
            let lineY = y * 0.8;

            const red = Math.abs(Math.sin(barHeight / 45)) * 200 + 30;
            const green =  Math.abs(Math.sin(barHeight / 60)) * 200 + 30;
            const blue = Math.abs(Math.sin(barHeight / 75) * 230) + 30;

            s.fill(red, green, blue);
            s.circle(x, y, 20);
            s.vertex(lineX, lineY);

            s.line(lineX, lineY, x * 0.9, y * 0.9);

            currX += barWidth;
        }
        s.stroke(255);
        s.noFill();
        s.endShape(s.CLOSE);

        for(let i = start; i < end; i++) {

        }
    }
}

onMounted(() => {
    new p5(script);
});
</script>

<template>
    <div id="containerSph"></div>
</template>
