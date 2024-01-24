// javascript
let isRestarted = false;
let startFromZero = false;
let hasBlackJack = false;
let hasNoChips = false;
let cards = [];


// Message, Cards, Sum, Player elements
let messageEl = document.getElementById("messageEl");
let cardsNum = document.getElementById('cardsNum');
let sumTotal = document.getElementById('sumTotal');
let playerEl = document.getElementById('playerEl');
let initialBetAmount = 20;
let betAmount = initialBetAmount;
let intialChipsAmount = 100;


let player = {
    name: "Per",
    chips: intialChipsAmount
}

function updatePlayerChips(amount=0){
    player.chips = amount;
    playerEl.textContent = player.name + ": R" + player.chips;
}

updatePlayerChips(player.chips);

// Random Numbers Array | Generate random numbers between 1 and 13
let randomNumberArr = function () {
    let count = cards.length;
    let number = Math.floor(Math.random() * 13) + 1;
    number = (number == 1)? 11 : ((number > 10)? 10 : number); // Change 1 to 11 and change 11, 12, and 13 to 10
    if(count < 2){
        cards = Array(number, number);
    }
    else {
        cards.push(number);
    }
    return cards;
};

// Start Game and New Cards Buttons
let startGameBtn = document.getElementById("startGameBtn");

let createStartBtn = function () {
    if(startGameBtn === (undefined || null)){
        let gameStartBtn = document.createElement("button");
        gameStartBtn.id = "gameStartBtn";
        gameStartBtn.textContent = "START GAME";
        sumTotal.after(gameStartBtn);
        startGameBtn = gameStartBtn;
        hasNoChips = false;
        
        startGameBtn.addEventListener("click", function (e) {
            if(startFromZero){
                cards = [];
                cardsNum.textContent = "Cards: 0 0";
                sumTotal.textContent = "Sum: 0";
                startGame();
                // startFromZero = false;
            }
            else{startGame();}
        });

        return startGameBtn;
    }
    else {return startGameBtn;}
}
createStartBtn();

let restartGameBtn = document.getElementById("restartGameBtn");
let createRestartGameBtn = function () {
    if(restartGameBtn === (undefined || null)){
        let restartBtn = document.createElement("button");
        restartBtn.id = "restartGameBtn";
        restartBtn.textContent = "RESTART GAME";
        sumTotal.after(restartBtn);
        restartGameBtn = restartBtn;
        hasNoChips = false;
        
        restartGameBtn.addEventListener("click", function (e) {
            if(startFromZero){
                cards = [];
                cardsNum.textContent = "Cards: 0 0";
                sumTotal.textContent = "Sum: 0";
                // startGame();
                // startFromZero = false;
                console.log(restartGameBtn.id);
                drawCards();
            }
            else{drawCards();}
        });

        return restartGameBtn;
    }
    else {return restartGameBtn;}
}

let newCardsBtn = document.getElementById("newCardsBtn");
let createNewCardsBtn = function () {
    if(newCardsBtn === (undefined || null)){
        let drawCardsBtn = document.createElement("button");
        drawCardsBtn.id = "newCardsBtn";
        drawCardsBtn.textContent = "NEW CARD";
        (startGameBtn !== (undefined || null))? startGameBtn.after(drawCardsBtn) : sumTotal.after(drawCardsBtn);
        newCardsBtn = drawCardsBtn;
        
        newCardsBtn.addEventListener("click", function (e) {
            drawCards();
        });
        
        return newCardsBtn;
    }
    else{return newCardsBtn;}
}

// START GAME BUTTON AND FUNCTIONS
// Check if Start Button exists. If it exist, return Button Typeof
// Create a Start Game Button if the Start Game Button does not exist


let startGame = function (){
    let remainingChips = player.chips - betAmount;
    updatePlayerChips(remainingChips);
    betEl.textContent = "Bet: " + betAmount;
    createNewCardsBtn();
    startGameBtn.replaceWith(createNewCardsBtn());
    drawCards();
}

// startGame();

let drawCards = function (){
    randomNumberArr(); // Generate random number and initiate cards array
    let chipsAmount = parseInt(player.chips);
    let drawnCards = '';
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
        drawnCards += cards[i] + ' ';
        total = Math.floor(total + cards[i]); // Adding card number to the total of drawn cards
    }
    
        
    let message = "Want to play a round?";
    
    if(betAmount >= 20){
        // console.log(drawnCards + ' | ' + total);
        let num1 = cards[0];
        let num2 = cards[1];
        // let total = Math.floor(num1 + num2);
        cardsNum.textContent = "Cards: " + drawnCards;
        sumTotal.textContent = "Sum: " + total;
        
        let blackJackAmount = Math.floor(chipsAmount + Math.floor(betAmount * 3));
        
        if(total <= 20 && chipsAmount >= betAmount){
            message = "Do you want to draw a new card?"
            // console.log("Try Again:" + ' ' + total + ' | ' + cards);
        }
        else if (total === 21) {
            updatePlayerChips(blackJackAmount);
        
            message = "You've got Blackjack";
            hasBlackJack = true;
            newCardsBtn.replaceWith(createStartBtn());
            startGameBtn.textContent = "START GAME";
            // console.log("Wooooowwwwww You Won!");
        }
        else {
            if(chipsAmount === 0){
                betAmount = 0;
                hasNoChips = true;
                startFromZero = true;
                newCardsBtn.replaceWith(createRestartGameBtn());
                console.log("You have R" + chipsAmount + " in Chips. | " + restartGameBtn.id);
            }
            else {
                message = "You're out of the game."
                startFromZero = true;
                newCardsBtn.replaceWith(createStartBtn());
                startGameBtn.textContent = "CONTINUE";
                hasNoChips = false;
                console.log("ChipsAmount: " + chipsAmount + " | " + betAmount);
            }
        }
        
    }
    else {
        let makeBtn = document.createElement("button");
        restartGameBtn.replaceWith(createStartBtn());
        startGameBtn.textContent = "START GAME";
        console.log("Game Over " + startGameBtn.id);
        startFromZero = false;
        hasNoChips = false;
        betEl.textContent = "Bet: 0";
        betAmount = initialBetAmount;
        updatePlayerChips(intialChipsAmount);
        isRestarted = true;
    }
    messageEl.textContent = message;
    hasBlackJack = false;
}

