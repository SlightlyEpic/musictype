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
    const bars = 30;
    
    let barWidth: number;
    let dataArray = new Uint8Array(bufferLength);
    let canvas: any;
    
    s.setup = () => {
        canvas = s.createCanvas(props.width, props.height);
        canvas.parent(document.getElementById("containerSph"));
        

        barWidth = canvas.width / bufferLength;

        s.drawingContext.save();
    }
    
    s.draw = () => {
        props.analyzer.getByteFrequencyData(dataArray);
        

        s.drawingContext.restore();
        s.clear();
        s.drawingContext.save();

        const startCircle = 15;
        const endCircle = Math.min(startCircle + dots, props.analyzer.frequencyBinCount);
        const startBar = 0;
        const endBar = Math.min(startCircle + bars, props.analyzer.frequencyBinCount);

        const c1 = [0, 0, 255];
        const c2 = [255, 0, 0];
        
        let currX = (startBar - endBar) * barWidth / 2;
        let barHeight;

        
        // console.log(currX, barWidth);
        // console.log(s.frameRate())
        
        s.translate(canvas.width / 2, canvas.height / 2);
        
        s.beginShape();
        s.stroke(255);
        s.strokeWeight(10);
        let clipPath = new Path2D();
        for (let i = startCircle; i < endCircle; i++) {
            barHeight = dataArray[i] * ((i - startCircle) < 3 ? 0.6 + ((i - startCircle) / 10) : 1);

            let r = 100 + barHeight * 0.75;
            let theta = 2 * Math.PI * (((i - startCircle) / (endCircle - startCircle)) - 0.25);
            
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);
            
            s.vertex(x, y);
            clipPath.lineTo(x * 0.9, y * 0.9);            
        }
        s.noFill();
        s.stroke(255);
        s.endShape(s.CLOSE);

        clipPath.closePath();
        s.drawingContext.clip(clipPath);
        
        s.stroke(254);
        s.strokeWeight(1);
        for(let i = startBar; i < endBar; i++) {
            barHeight = dataArray[i] * Math.abs(Math.sin((i - startBar) * Math.PI * 0.9 / (endBar - startBar))) * 2;

            const red = ((c2[0] - c1[0]) * (i - startBar) / (endBar - startBar) + c1[0]) * (Math.min(0.9, barHeight / 100) + 0.1);
            const green = ((c2[1] - c1[1]) * (i - startBar) / (endBar - startBar) + c1[1]) * (Math.min(0.9, barHeight / 100) + 0.1);
            const blue = ((c2[2] - c1[2]) * (i - startBar) / (endBar - startBar) + c1[2]) * (Math.min(0.9, barHeight / 100) + 0.1);

            s.fill(red, green, blue);
            // s.noFill();
            s.rect(currX, -barHeight / 2, barWidth, barHeight + 10);

            currX += barWidth;
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
