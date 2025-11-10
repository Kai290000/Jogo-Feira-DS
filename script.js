let pontuacaoX = 0;
let pontuacaoO = 0;
let empates = 0;

// 1. Variáveis de Estado
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score-board'); 

// Array que representa o tabuleiro: 0-8. ' ' = vazio.
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // O jogador 'X' começa
let gameActive = true; // O jogo está em andamento?

// Padrões de vitória (índices no array gameBoard)
const winningConditions = [
    [0, 1, 2], // Linhas
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Colunas
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonais
    [2, 4, 6]
];

// FUNÇÃO CHAVE: Atualiza o HTML com a pontuação
function updateScoreDisplay() {
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `Placar: X: ${pontuacaoX}  |  O: ${pontuacaoO}  |  Empate: ${empates}`;
    } else {
        console.warn("Elemento 'score-board' `não encontrado no HTML. A pontuação não será exibida.");
    }
}

// 2. Funções do Jogo

// NOVO: Trata o clique em uma célula
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    // Pega o índice da célula que foi clicada
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-index')
    );

    // 1. Verifica se a célula já foi jogada OU se o jogo não está ativo
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return; 
    }

    // 2. Procede com o movimento
    handlePlayerMove(clickedCell, clickedCellIndex);
    checkResult(); // 3. Verifica o resultado após o movimento
}

// NOVO: Executa o movimento, atualizando o tabuleiro lógico e visual
function handlePlayerMove(cell, index) {
    // Atualiza o tabuleiro lógico (array)
    gameBoard[index] = currentPlayer;
    
    // Atualiza o tabuleiro visual (HTML)
    cell.innerHTML = currentPlayer;
    // Adiciona uma classe para estilizar (usando CSS para .x e .o)
    cell.classList.add(currentPlayer.toLowerCase()); 
}

// Verifica se houve um vencedor ou um empate
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; 
        }
        
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `O Jogador ${currentPlayer} Venceu! 🎉`;
        gameActive = false; 
        
        // INCREMENTA A PONTUAÇÃO
        if (currentPlayer === 'X') {
            pontuacaoX++;
        } else {
            pontuacaoO++;
        }
        updateScoreDisplay(); 
        
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        empates++;
        statusDisplay.innerHTML = `Empate! 🤝`;
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

// Troca o jogador atual
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `Vez do Jogador ${currentPlayer}`;
}

// Reinicia o jogo (mantém o placar)
function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = `Vez do Jogador ${currentPlayer}`;
    
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('x', 'o');
    });
    
    updateScoreDisplay();
}

// 3. Listeners de Eventos

// Adiciona um listener de clique a cada célula
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Adiciona um listener de clique ao botão de reiniciar
restartButton.addEventListener('click', restartGame);

// CHAMADA INICIAL: Exibe o placar 0 | 0 ao carregar a página
updateScoreDisplay();