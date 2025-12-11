import { store } from './store.js';
import { randomHsl } from './helpers.js';

const board = document.getElementById('board');
const cntSquares = document.getElementById('cntSquares');
const cntCircles = document.getElementById('cntCircles');

const addSquareBtn = document.getElementById('addSquare');
const addCircleBtn = document.getElementById('addCircle');
const recolorSquaresBtn = document.getElementById('recolorSquares');
const recolorCirclesBtn = document.getElementById('recolorCircles');

addSquareBtn.addEventListener('click', () =>
    store.addShape('square', randomHsl())
);

addCircleBtn.addEventListener('click', () =>
    store.addShape('circle', randomHsl())
);

recolorSquaresBtn.addEventListener('click', () =>
    store.recolor('square', randomHsl)
);

recolorCirclesBtn.addEventListener('click', () =>
    store.recolor('circle', randomHsl)
);

board.addEventListener('click', (e) => {
    const el = e.target.closest('.shape');
    if (!el) return;

    const id = el.dataset.id;
    store.removeShape(id);
});

function render(state) {
    const existingIds = new Set(
        [...board.querySelectorAll('.shape')].map((el) => el.dataset.id)
    );

    state.shapes.forEach((shape) => {
        if (!existingIds.has(shape.id)) {
            const el = document.createElement('div');
            el.className = `shape ${shape.type}`;
            el.style.backgroundColor = shape.color;
            el.dataset.id = shape.id;
            board.appendChild(el);
        }
    });

    state.shapes.forEach((shape) => {
        const el = board.querySelector(`[data-id="${shape.id}"]`);
        if (el) {
            el.style.backgroundColor = shape.color;
        }
    });

    board.querySelectorAll('.shape').forEach((el) => {
        if (!state.shapes.some((s) => s.id === el.dataset.id)) {
            el.remove();
        }
    });

    cntSquares.textContent = store.countSquares();
    cntCircles.textContent = store.countCircles();
}

store.subscribe(render);

render(store.state);
