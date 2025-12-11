export function randomHsl() {
    const h = Math.floor(Math.random() * 360);
    const s = 70;
    const l = 70;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function uid() {
    return crypto.randomUUID();
}
