document.addEventListener('DOMContentLoaded', function () {
    const letters = ['B', 'I', 'N', 'G', 'O'];
	const gridSize = 5;
	
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
				if (index == 12) {
					cell.textContent = "FREE SPACE"
				}
				else {
					if (items[index].startsWith("Graphic ")) {
						const remainingStr = "assets/" + items[index].substring("Graphic ".length);
						const imgElement = document.createElement('img');
						imgElement.src = remainingStr;
						cell.appendChild(imgElement);
					}
					else {
						cell.textContent = items[index];
					}
				}
                row.appendChild(cell);
            }

            cardContent.appendChild(row);
        }
		initCanvas()
    }

    function toggleCell(cell) {
        cell.classList.toggle('clicked');
		const allCells = document.querySelectorAll('.bingo-cell');
		const cellIndex = Array.from(allCells).indexOf(cell);
    }

    // Load items from a text file
    fetch('items.txt')
        .then(response => response.text())
        .then(data => {
            const items = data.split('\n').filter(item => item.trim() !== '');
            generateBingoCard(items);
        })
        .catch(error => console.error('Error loading items:', error));
	
	const invisibleCanvas = document.getElementById('invisibleCanvas');
	const invisibleContext = invisibleCanvas.getContext('2d');
	
	const canvas = document.getElementById('myCanvas');
	const context = canvas.getContext('2d');
	
	const headerElement = document.querySelector('.header-row');
	const headerHeight = headerElement.clientHeight;
	
	function initCanvas() {
		const bingoCardElement = document.getElementById('bingo-card');
		const totalHeight = bingoCardElement.clientHeight;
		const totalWidth = bingoCardElement.clientWidth;
		
		canvas.setAttribute('width', totalWidth.toString());
		canvas.setAttribute('height', totalHeight.toString());
		invisibleCanvas.setAttribute('width', totalWidth.toString());
		invisibleCanvas.setAttribute('height', totalHeight.toString());
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
    	const rows = document.querySelectorAll('.bingo-row:not(.header-row)')
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
    	const rows = document.querySelectorAll('.bingo-row:not(.header-row)')
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
        // Implement logic to map (x, y) to the corresponding grid cell
        // For simplicity, let's assume the grid is evenly spaced
        const cellSize = canvas.width / gridSize;
        const columnIndex = Math.floor(x / cellSize);
        const rowIndex = Math.floor(y / cellSize);

        // Toggle the corresponding cell on the visible grid
        const cell = document.querySelector(`.bingo-row:nth-child(${rowIndex + 1}) .bingo-cell:nth-child(${columnIndex + 1})`);
		//console.log('calculated row/col: ', (rowIndex + 1),(columnIndex + 1))
        if (cell) {
            toggleCell(cell);
            checkWinConditions();
        }
    }
});
