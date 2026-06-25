const board = document.getElementById("puzzle-board");
const shuffleBtn = document.getElementById("shuffle-btn");
let draggedPiece = null;
let selectedPiece = null;
let seconds = 0;
let timerInterval = null;
let timerStarted = false;

let GRID_SIZE = 4;
const difficultyButtons =
    document.querySelectorAll(".difficulty-btn");

function createPuzzle(){

    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${GRID_SIZE}, 1fr)`;

    board.style.gridTemplateRows =
        `repeat(${GRID_SIZE}, 1fr)`;

    for(let row = 0; row < GRID_SIZE; row++){

        for(let col = 0; col < GRID_SIZE; col++){

            const piece = document.createElement("div");

            piece.classList.add("piece");

            piece.style.backgroundImage =
                `url('${IMAGE_URL}')`;

            piece.style.backgroundSize =
                `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`;

            piece.style.backgroundPosition =
                `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`;
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.dataset.id = row * GRID_SIZE + col;
            piece.dataset.currentId = row * GRID_SIZE + col;
            piece.draggable = true;
            piece.addEventListener("dragstart", () => {
                draggedPiece = piece;
            });

            piece.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            piece.addEventListener("drop", () => {

                if(draggedPiece === piece) return;

                const draggedPos = draggedPiece.style.backgroundPosition;
                const targetPos = piece.style.backgroundPosition;

                draggedPiece.style.backgroundPosition = targetPos;
                piece.style.backgroundPosition = draggedPos;

                const draggedId = draggedPiece.dataset.currentId;
                const targetId = piece.dataset.currentId;

                draggedPiece.dataset.currentId = targetId;
                piece.dataset.currentId = draggedId;

                checkWin();
            });
            piece.addEventListener("click", () => {

                if(!selectedPiece){

                    selectedPiece = piece;
                    piece.classList.add("selected");

                    return;
                }

                if(selectedPiece === piece){

                    piece.classList.remove("selected");
                    selectedPiece = null;

                    return;
                }

                const selectedPos = selectedPiece.style.backgroundPosition;
                const targetPos = piece.style.backgroundPosition;

                selectedPiece.style.backgroundPosition = targetPos;
                piece.style.backgroundPosition = selectedPos;

                const selectedId = selectedPiece.dataset.currentId;
                const targetId = piece.dataset.currentId;

                selectedPiece.dataset.currentId = targetId;
                piece.dataset.currentId = selectedId;

                selectedPiece.classList.remove("selected");
                selectedPiece = null;

                checkWin();

            });


            board.appendChild(piece);
        }
    }
}
createPuzzle();

function resetGame(){

    clearInterval(timerInterval);

    seconds = 0;
    timerStarted = false;

    document.querySelector(".timer").textContent =
        "⏱️ 00:00";

    document.getElementById("win-popup").style.display =
        "none";

    selectedPiece = null;

}

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        difficultyButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

       GRID_SIZE = parseInt(button.dataset.size);

       resetGame();

       board.style.gridTemplateColumns =
            `repeat(${GRID_SIZE}, 1fr)`;

        board.style.gridTemplateRows =
            `repeat(${GRID_SIZE}, 1fr)`;

        createPuzzle();

    });

});

function shufflePieces(){

    const pieces = Array.from(board.children);

    pieces.sort(() => Math.random() - 0.5);

    board.innerHTML = "";
    

    pieces.forEach(piece => {
        board.appendChild(piece);
    });

}
shuffleBtn.addEventListener("click", () => {

    shufflePieces();

    startTimer();

});

function checkWin(){

    const pieces = document.querySelectorAll(".piece");

    let solved = true;

    pieces.forEach(piece => {

        if(piece.dataset.id !== piece.dataset.currentId){
            solved = false;
        }

    });

    if(solved){

        clearInterval(timerInterval);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        document.getElementById("final-time").textContent =
            `Solved in ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        launchConfetti();
        document.getElementById("win-popup").style.display = "flex";

    }

}

function startTimer(){

    if(timerStarted) return;

    timerStarted = true;

    timerInterval = setInterval(() => {

        seconds++;

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        document.querySelector(".timer").textContent =
            `⏱️ ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    }, 1000);

}

const playAgainBtn = document.getElementById("play-again-btn");

playAgainBtn.addEventListener("click", () => {

    resetGame();
    createPuzzle();

});

function launchConfetti(){

    const container =
        document.getElementById("confetti-container");

    const colors = [
        "#8B5CF6",
        "#3B82F6",
        "#EC4899",
        "#10B981",
        "#F59E0B"
    ];

    for(let i = 0; i < 120; i++){

        const confetti =
            document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left =
            Math.random() * 100 + "%";

        confetti.style.background =
            colors[Math.floor(
                Math.random() * colors.length
            )];

        confetti.style.animationDelay =
            Math.random() * 2 + "s";

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);

    }

}