document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 5;
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function computeFontSize() {
        for(const element of document.querySelectorAll(".bingo-cell__text")){
            var size = parseInt(getComputedStyle(element).getPropertyValue('font-size'));
            const parentWidth = parseInt(getComputedStyle(element.parentElement).getPropertyValue('width'));
            const parentHeight = parseInt(getComputedStyle(element.parentElement).getPropertyValue('height'))
            while((element.offsetWidth > (parentWidth - 8)) || (element.offsetHeight > (parentHeight - 8))) {
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
                    cell.innerHTML = '<p class="bingo-cell__text bingo-cell__free-space">FREE SPACE</p>'
				}
				else {
					if (items[index].startsWith("Graphic ")) {
						const remainingStr = "assets/" + items[index].substring("Graphic ".length);
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
        initCanvas();
    }

    function toggleColor() {
        this.classList.toggle('clicked');
    }

    const invisCanvas = document.getElementById('invisCanvas');
    const invisContext = invisCanvas.getContext('2d');

    const lineCanvas = document.getElementById('lineCanvas');
    const lineContext = lineCanvas.getContext('2d');

    function initCanvas() {
        const bingoCardElement = document.getElementById('bingo-card');
        const h = bingoCardElement.clientHeight;
        const w = bingoCardElement.clientWidth;

		invisCanvas.setAttribute('width', w.toString());
		invisCanvas.setAttribute('height', h.toString());
		lineCanvas.setAttribute('width', w.toString());
		lineCanvas.setAttribute('height', h.toString());
    }
    function checkWinConditions() {
		if(checkRows() || checkColumns() || checkDiagTopLeftBotRight() || checkDiagBotRightTopLeft()) {
			if(checkRows()) {
				console.log('row win');
			}
			else if(checkColumns()) {
				console.log('col win');
			}
			else if(checkDiagTopLeftBotRight() || checkDiagBotRightTopLeft()){
				console.log('diag win');
			}
			console.log('winner winner flavorless chicken dinner!');
		}
	}

	function checkRows() {
		const rows = document.querySelectorAll('.bingo-row');
		return Array.from(rows).some(row => row.querySelectorAll('.clicked').length === gridSize);
	}

	function checkColumns() {
        for (let j = 0; j < gridSize; j++) {
            const column = document.querySelectorAll('.bingo-cell:nth-child(' + gridSize + 'n + ' + (j + 1) + ')');
            if (Array.from(column).every(cell => cell.classList.contains('clicked'))) {
                return true;
            }
        }
        return false;
    }

    function checkDiagTopLeftBotRight() {
    	const rows = document.querySelectorAll('.bingo-row')
    	const tlbr = []; //top left to bottom right

    	rows.forEach((row, index) => {
    		const nthItem = row.querySelectorAll(`.bingo-cell:nth-child(${index + 1})`);
    		tlbr.push(nthItem);
    	});

        return (
            Array.from(tlbr).every(cell => {
            	return cell[0].classList.contains('clicked');
            })
        );
    }

	function checkDiagBotRightTopLeft() {
    	const rows = document.querySelectorAll('.bingo-row')
    	const bltr = [];

    	rows.forEach((row, index) => {
    		const nthItem = row.querySelectorAll(`.bingo-cell:nth-child(${gridSize - (index)})`);
    		bltr.push(nthItem);
    	});

        return (
            Array.from(bltr).every(cell => {
            	return cell[0].classList.contains('clicked');
            })
        );
    }

	invisibleCanvas.addEventListener('click', handleInvisibleCanvasClick);
	
	function handleInvisibleCanvasClick(event) {
        const rect = invisibleCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top - headerHeight;
        const cellSize = canvas.width / gridSize;
        const columnIndex = Math.floor(x / cellSize);
        const rowIndex = Math.floor(y / cellSize);

        const cell = document.querySelector(`.bingo-row:nth-child(${rowIndex + 1}) .bingo-cell:nth-child(${columnIndex + 1})`);
		//console.log('calculated row/col: ', (rowIndex + 1),(columnIndex + 1))
        if (cell) {
            toggleCell(cell);
            checkWinConditions();
        }
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
