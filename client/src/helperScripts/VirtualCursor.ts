import { ref, reactive } from 'vue';

export class DiffedInput {
    targetLines: Array<string>;
    actualLines: Array<string> = [''];
    cursorLine = 0;
    cursorPos = 0;

    constructor(lines: Array<string> = []) {
        this.targetLines = reactive(lines);
        
        // setInterval(() => {
        //     console.log(`Actual:\n"${this.actualLines.join('\n')}"`)
        // }, 1000);
    }

    get currentLineLength(): number {
        return this.cursorLine < this.targetLines.length ? this.targetLines[this.cursorLine].length : 0;
    }

    addLine(line: string) {
        this.targetLines.push(line);
    }

    nextLine() {
        if(this.cursorLine === this.targetLines.length - 1) return;

        this.cursorLine++;
        if(this.cursorLine >= this.actualLines.length) this.actualLines.push('');
        this.cursorPos = this.actualLines[this.cursorLine].length;
    }

    previousLine() {
        if(this.cursorLine== 0) return;
        this.cursorLine--;
        this.cursorPos = this.actualLines[this.cursorLine].length;
    }

    type(char: string) {
        if(this.cursorPos === this.currentLineLength || this.targetLines[this.cursorLine][this.cursorPos] === ' ') return;
        
        this.actualLines[this.cursorLine] += char;
        this.cursorPos++;
    }

    space() {
        if(this.cursorPos === this.currentLineLength) {
            this.nextLine();
            return;
        }

        while(this.cursorPos < this.currentLineLength && this.targetLines[this.cursorLine][this.cursorPos] != ' ') {
            this.actualLines[this.cursorLine] += ' ';
            this.cursorPos++;
        }

        if(this.cursorPos === this.currentLineLength) {
            this.nextLine();
        } else {
            this.actualLines[this.cursorLine] += ' ';
            this.cursorPos++;    
        }
    }

    enter() {
        if(this.cursorPos === this.targetLines[this.cursorLine].length) this.nextLine();
    }

    backspace() {
        if(this.cursorPos === 0) {
            this.previousLine();
            return;
        }

        if(this.actualLines[this.cursorLine][this.cursorPos - 1] === ' ') {
            while(this.cursorPos > 0 && this.actualLines[this.cursorLine][this.cursorPos - 1] === ' ') {
                this.cursorPos--;
            }
            this.actualLines[this.cursorLine] = this.actualLines[this.cursorLine].slice(0, this.cursorPos);
        } else {
            this.cursorPos--;
            this.actualLines[this.cursorLine] = this.actualLines[this.cursorLine].slice(0, this.cursorPos);
        }
    }

    deleteLastWord() {
        if(this.cursorPos === 0) {
            this.previousLine();
            return;
        }

        while(this.cursorPos > 0 && this.actualLines[this.cursorLine][this.cursorPos - 1] === ' ') {
            this.cursorPos--;
        }

        while(this.cursorPos > 0 && this.actualLines[this.cursorLine][this.cursorPos - 1] !== ' ') {
            this.cursorPos--;
        }

        this.actualLines[this.cursorLine] = this.actualLines[this.cursorLine].slice(0, this.cursorPos);
    }

    forceUpdate() {
        // lil hack
        this.cursorPos++;
        this.cursorPos--;
    }
}

export class RestrictedDiffedInput extends DiffedInput {
    maxLines: number;
    topMostLine: number = -1;
    relativeCursorLine = 0;

    constructor(maxLines: number, lines: Array<string> = []) {
        super(lines);
        this.maxLines = maxLines;
    }

    addLine(line: string): void {
        this.targetLines.push(line);
        
        if(this.targetLines.length > this.maxLines) {
            while(this.cursorLine < this.targetLines.length - this.maxLines) {
                this.nextLine();
            }

            this.relativeCursorLine = this.maxLines - (this.targetLines.length - this.cursorLine);
        } else {
            this.relativeCursorLine = this.cursorLine;
        }
    }

    nextLine() {
        if(this.cursorLine === this.targetLines.length - 1) return;

        this.cursorLine++;
        this.relativeCursorLine++;
        if(this.cursorLine >= this.actualLines.length) this.actualLines.push('');
        this.cursorPos = this.actualLines[this.cursorLine].length;
    }

    backspace(): void {
        if(this.relativeCursorLine !== 0 || this.cursorPos !== 0) super.backspace();
    }

    deleteLastWord(): void {
        if(this.relativeCursorLine !== 0 || this.cursorPos != 0) super.deleteLastWord();
    }
}
