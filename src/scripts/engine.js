const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card_image"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
};

const pathImg = "./src/assets/icons/";
const cardData = [
    { id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        WinOf:[1],
        LoseOf:[2]
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf:[2],
        LoseOf:[0]
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: "./src/assets/icons/exodia.png",
        WinOf:[0],
        LoseOf:[1]
    }
];

const playerSides = {
    player1: "player_cards",
    computer: "computer_cards"
};


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");

    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    cardImage.addEventListener("mouseover", () => {
        drawSelectCard(IdCard);
    });
    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    // state.fieldCards.player.src = cardData[cardId].img;
    // state.fieldCards.computer.src = cardData[computerCardId].img;
    animateCardImage(state.fieldCards.player, cardData[cardId].img);
    
    setTimeout(() => { // dá um leve atraso na animação da jogada do computador
        animateCardImage(state.fieldCards.computer, cardData[computerCardId].img);
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 500));

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function checkDuelResults(cardId, computerCardId) {
    let duelResults = "Draw";

    let playerCard = cardData[cardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Win";
        state.score.playerScore++;
        await playAudio(duelResults);
        //
        // adiciona um título no centro da tela quando vence
        //
        // const resultTitle = document.createElement("h1");
        // resultTitle.classList.add("winTitle"); // Adiciona a classe
        // resultTitle.innerText = "Venceu!";
        // await document.body.appendChild(resultTitle);
    } 

    if (playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Lose";
        state.score.computerScore++;
        await playAudio(duelResults);
        //
        // adiciona um título no centro da tela quando perde
        //
        // resultTitle = document.createElement("h1");
        // resultTitle.classList.add("winTitle"); // Adiciona a classe
        // resultTitle.innerText = "Perdeu!";
        // await document.body.appendChild(resultTitle);
    }
    console.log(duelResults);
    return duelResults;

    
}

async function removeAllCardsImages() {
    let cards = document.querySelector("#computer_cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector("#player_cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    // state.cardSprites.avatar.src = cardData[index].img;
    //
    // transição com animação - o state acima precisa ser comentado
    //
    const avatar = state.cardSprites.avatar;
    avatar.style.transition = "opacity 0.05s, transform 0.3s, scale 0.3s";
    avatar.style.opacity = 0;
    avatar.style.scale = 1.5;
    avatar.style.transform = "rotatez(15deg)"; // inicia com rotação
    setTimeout(() => {
        avatar.src = cardData[index].img;
        avatar.style.opacity = 1;
        avatar.style.scale = 1;
        avatar.style.transform = "rotateY(0deg)"; // volta ao normal
        
    }, 200);
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const IdCard = await getRandomCardId()
        const cardImage = await createCardImage(IdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage);
    }
};


async function resetDuel() {
    state.cardSprites.avatar.scr = "";
    state.fieldCards.player.src = "";
    state.fieldCards.computer.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";


    // const elemento = document.querySelector('.winTitle');
    // if (elemento) {
    //  elemento.remove();
    // }

    init();
}
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function animateCardImage(imgCard, newCard) { // função de animação para as cartas do fieldSet
    imgCard.style.transition = "opacity 0.2s, transform 0.3s";
    imgCard.style.opacity = 0;
    imgCard.style.transform = "rotateZ(15deg) scale(1.2)";
    setTimeout(() => {
        imgCard.src = newCard;
        imgCard.style.opacity = 1;
        imgCard.style.transform = "rotateZ(0deg) scale(1)";
    }, 200);
}

function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
    bgm.volume = 0.1; // volume em 20%
};



init();