import { uid, randomHsl } from './helpers.js';

export class Store {
    constructor() {
        const saved = localStorage.getItem('shapes-app');
        this.state = saved ? JSON.parse(saved) : { shapes: [] };
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    notify() {
        localStorage.setItem('shapes-app', JSON.stringify(this.state));
        this.subscribers.forEach((fn) => fn(this.state));
    }

    addShape(type) {
        const id = uid();
        this.state.shapes.push({
            id,
            type,
            color: randomHsl(),
        });
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        this.notify();
    }

    recolor(type, colorFn) {
        this.state.shapes
            .filter((s) => s.type === type)
            .forEach((s) => {
                s.color = colorFn();
            });
        this.notify();
    }

    countSquares() {
        return this.state.shapes.filter((s) => s.type === 'square').length;
    }

    countCircles() {
        return this.state.shapes.filter((s) => s.type === 'circle').length;
    }
}

export const store = new Store();
