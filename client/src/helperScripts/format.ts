export function formatMs(ms: number): string {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms - minutes * 60000) / 1000);

    return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}
