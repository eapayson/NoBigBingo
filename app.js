document.addEventListener('DOMContentLoaded', function () {
    const letters = ['B', 'I', 'N', 'G', 'O'];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function computeFontSize() {
        for(const element of document.querySelectorAll(".bingo-cell__text")){
            var size = parseInt(getComputedStyle(element).getPropertyValue('font-size'));
            const parentWidth = parseInt(getComputedStyle(element.parentElement).getPropertyValue('width'))
            while(element.offsetWidth > (parentWidth - 8)) {
                element.style.fontSize = (size/16) + "rem"
                size -= 1
            }
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
				if (index == 12) {
					// cell.textContent = "FREE SPACE"
                    cell.innerHTML = '<p class="bingo-cell__text">FREE SPACE</p>'
				}
				else {
					if (items[index].startsWith("Graphic ")) {
						const remainingStr = items[index].substring("Graphic ".length);
						const imgElement = document.createElement('img');
						imgElement.src = remainingStr;
						cell.appendChild(imgElement);
					}
					else {
						cell.innerHTML = '<p class="bingo-cell__text">' + items[index] + '</p>'
					}
				}
                cell.addEventListener('click', toggleColor);
                row.appendChild(cell);
            }

            cardContent.appendChild(row);
        }
        computeFontSize();
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
