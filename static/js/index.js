const playBtn = document.querySelector(".play-btn");
const playerInput = document.getElementById("player-name");
const error = document.getElementById("name-error");
const puzzleLinks = document.querySelectorAll(".puzzle-link");

function showError(){

    error.classList.add("show");
    playerInput.classList.add("input-error");

    setTimeout(() => {

        error.classList.remove("show");
        playerInput.classList.remove("input-error");

    }, 2500);

}

function validateName(){

    const name = playerInput.value.trim();

    if(name === ""){

        showError();
        return false;

    }

    localStorage.setItem("playerName", name);

    return true;

}

playBtn.addEventListener("click", () => {

    if(!validateName()) return;

    document.getElementById("puzzles")
        .scrollIntoView({
            behavior:"smooth"
        });

});

puzzleLinks.forEach(link => {

    link.addEventListener("click", (e) => {

        if(!validateName()){

            e.preventDefault();
            return;

        }

    });

});