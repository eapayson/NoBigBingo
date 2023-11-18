document.addEventListener('DOMContentLoaded', function () {
    const letters = ['B', 'I', 'N', 'G', 'O'];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateBingoCard(items) {
        shuffle(items);
        const cardContent = document.getElementById('card-content');
        cardContent.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('bingo-row');

            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                const index = i * 5 + j;
                cell.textContent = index;//items[index];
                cell.addEventListener('click', toggleColor);
                row.appendChild(cell);
            }

            cardContent.appendChild(row);
        }
    }

    function toggleColor() {
        this.classList.toggle('clicked');
    }

    // Load items from a text file
    fetch('items.txt')
        .then(response => response.text())
        .then(data => {
            const items = data.split('\n').filter(item => item.trim() !== '');
            generateBingoCard(items);
        })
        .catch(error => console.error('Error loading items:', error));
});
