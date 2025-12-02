function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function saveBoard() {
    const data = {};
    document.querySelectorAll('.column').forEach((col) => {
        const colName = col.dataset.column;
        data[colName] = [];
        col.querySelectorAll('.card').forEach((card) => {
            data[colName].push({
                id: card.dataset.id,
                title: card.querySelector('.card-content').innerText,
                color: card.style.backgroundColor,
            });
        });
    });
    localStorage.setItem('kanbanBoard', JSON.stringify(data));
}

function loadBoard() {
    const data = JSON.parse(localStorage.getItem('kanbanBoard') || '{}');
    for (let colName in data) {
        const column = document.querySelector(
            `.column[data-column="${colName}"] .cards`
        );
        data[colName].forEach((cardData) => {
            const card = createCard(
                cardData.title,
                cardData.color,
                cardData.id
            );
            column.appendChild(card);
        });
        updateCount(colName);
    }
}

function createCard(title, color = getRandomColor(), id = generateId()) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = color;
    card.dataset.id = id;

    card.innerHTML = `
    <div class="card-content" contenteditable="true">${title}</div>
    <div class="card-buttons">
      <button class="left">&larr;</button>
      <button class="right">&rarr;</button>
      <button class="color">C</button>
      <button class="remove">x</button>
    </div>
  `;

    card.querySelector('.remove').addEventListener('click', () => {
        const parentColumn = card.closest('.column');
        card.remove();
        updateCount(parentColumn.dataset.column);
        saveBoard();
    });

    card.querySelector('.left').addEventListener('click', () =>
        moveCard(card, -1)
    );
    card.querySelector('.right').addEventListener('click', () =>
        moveCard(card, 1)
    );
    card.querySelector('.color').addEventListener('click', () => {
        card.style.backgroundColor = getRandomColor();
        saveBoard();
    });

    card.querySelector('.card-content').addEventListener('input', () =>
        saveBoard()
    );

    return card;
}

function getColumnIndex(column) {
    return Array.from(document.querySelectorAll('.column')).indexOf(column);
}

function moveCard(card, direction) {
    const columns = Array.from(document.querySelectorAll('.column'));
    const currentColumn = card.closest('.column');
    const currentIndex = getColumnIndex(currentColumn);
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= columns.length) return;

    const newColumn = columns[newIndex].querySelector('.cards');
    newColumn.appendChild(card);
    updateCount(currentColumn.dataset.column);
    updateCount(newColumn.parentElement.dataset.column);
    saveBoard();
}

function updateCount(columnName) {
    const column = document.querySelector(
        `.column[data-column="${columnName}"]`
    );
    const count = column.querySelectorAll('.card').length;
    column.querySelector('.count').innerText = count;
}

function updateCountForParent(card) {
    const parentColumn = card.closest('.column');
    updateCount(parentColumn.dataset.column);
}

document.querySelectorAll('.column').forEach((column) => {
    const colName = column.dataset.column;
    const cardsContainer = column.querySelector('.cards');

    column.querySelector('.add-card-btn').addEventListener('click', () => {
        const title = 'Nowa karta';
        const card = createCard(title);
        cardsContainer.appendChild(card);
        updateCount(colName);
        saveBoard();
    });

    column.querySelector('.color-column-btn').addEventListener('click', () => {
        column.querySelectorAll('.card').forEach((card) => {
            card.style.backgroundColor = getRandomColor();
        });
        saveBoard();
    });

    column.querySelector('.sort-column-btn').addEventListener('click', () => {
        const sorted = Array.from(cardsContainer.children).sort((a, b) =>
            a
                .querySelector('.card-content')
                .innerText.localeCompare(
                    b.querySelector('.card-content').innerText
                )
        );
        sorted.forEach((card) => cardsContainer.appendChild(card));
        saveBoard();
    });
});

loadBoard();
