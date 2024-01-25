// javascript
let isRestarted = false;
let startFromZero = false;
let hasBlackJack = false;
let hasCashOut = false;
let hasNoChips = false;
let cards = [];


// Message, Cards, Sum, Player elements
let messageEl = document.getElementById("messageEl");
let cardsNum = document.getElementById('cardsNum');
let sumTotal = document.getElementById('sumTotal');
let playerEl = document.getElementById('playerEl');
let increaseBetBtn = document.getElementById('increaseBet');
let decreaseBetBtn = document.getElementById('decreaseBet');
let blackJackAmount = 0;
let initialBetAmount = 20;
let betAmount = initialBetAmount;
let intialChipsAmount = 100;


let player = {
    name: "Player 1",
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
            if(hasBlackJack === false && hasCashOut === false){
                if(startFromZero){
                    cards = [];
                    cardsNum.textContent = "Cards: 0 0";
                    sumTotal.textContent = "Sum: 0";
                    startGame();
                }
                else{startGame();}
            }
            if(hasCashOut && hasBlackJack){
                // blackJackAmount = Math.floor(chipsAmount + winAmount);
                updatePlayerChips(blackJackAmount);
                hasBlackJack = false;
                hasCashOut = false;
                startGameBtn.removeAttribute("class");
                startGameBtn.textContent = "START GAME";
            }
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
        restartBtn.textContent = "RESTART";
        sumTotal.after(restartBtn);
        restartGameBtn = restartBtn;
        hasNoChips = false;
        messageEl.setAttribute('class', 'lostTxt');
        
        restartGameBtn.addEventListener("click", function (e) {
            if(startFromZero){
                cards = [];
                cardsNum.textContent = "Cards: 0 0";
                sumTotal.textContent = "Sum: 0";
                drawCards();
            }
            else{drawCards();}
            messageEl.removeAttribute('class', 'lostTxt;');
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
        let num1 = cards[0];
        let num2 = cards[1];
        
        cardsNum.textContent = "Cards: " + drawnCards;
        sumTotal.textContent = "Sum: " + total;

        let winAmount = Math.floor(betAmount * 3);
        
        if(total <= 20 && chipsAmount >= betAmount){
            message = "Do you want to draw a new card?";
        }
        else if (total === 21) {
            blackJackAmount = Math.floor(chipsAmount + winAmount);
            message = "You've got Blackjack";
            hasBlackJack = true;
            newCardsBtn.replaceWith(createStartBtn());

            startGameBtn.setAttribute("disabled", true);
            
            let countBy = winAmount / 20;
            countBy = (countBy <= 1)? 1 : countBy;
            let winningAmount = 0;

            let countAmount = function () {
                if(winningAmount < winAmount){
                    winningAmount++;
                    startGameBtn.textContent = "YOU WON " + winningAmount;
                    requestAnimationFrame(countAmount);
                    if(winningAmount == winAmount){
                        startGameBtn.setAttribute("class", "won");
                        startGameBtn.textContent = "CASHOUT " + winAmount;
                        hasCashOut = true;
                        removeDisabledAttr();
                    }
                }
            }
            countAmount();
        }
        else {
            message = "You're out of the game.";
            if(chipsAmount === 0){
                messageEl.setAttribute('class', 'lostTxt');
                message = " You LOST";
                betAmount = 0;
                hasNoChips = true;
                startFromZero = true;
                newCardsBtn.replaceWith(createRestartGameBtn());
            }
            else {
                startFromZero = true;
                newCardsBtn.replaceWith(createStartBtn());
                startGameBtn.textContent = "BET AGAIN";
                removeDisabledAttr();
                hasNoChips = false;
            }
        }
        
    }
    else {
        restartGameBtn.replaceWith(createStartBtn());
        startGameBtn.textContent = "START GAME";
        removeDisabledAttr();
        startFromZero = false;
        hasNoChips = false;
        betEl.textContent = "Bet: 0";
        betAmount = initialBetAmount;
        updatePlayerChips(intialChipsAmount);
    }
    messageEl.textContent = message;
    addEmojiSpan(messageEl);
}

let removeDisabledAttr = function(){
    const btn = document.querySelector('button');
    if(btn.hasAttribute("disabled")){btn.removeAttribute("disabled");}
}

let addEmojiSpan = function (messageEl) {
    const messageContent = messageEl.textContent.toLowerCase();
    const emojiSpan = document.createElement("span");
    if(messageContent.includes("lost")){
        emojiSpan.textContent = '😟';
        messageEl.insertBefore(emojiSpan, messageEl.firstChild);
    }
}

if(increaseBetBtn !== (undefined || null)){
    betAmount = parseInt(betAmount) - parseInt(betAmount);
    increaseBetBtn.addEventListener("click", function (e) {
        betAmount = (parseInt(betAmount) == 0)? (parseInt(initialBetAmount) + parseInt(betAmount)) : (betAmount + 1);
        betEl.textContent = "Bet: " + betAmount;
        console.log(betAmount);
    });
}
if(decreaseBetBtn !== (undefined || null)){
    betAmount = parseInt(betAmount) - parseInt(betAmount);
    decreaseBetBtn.addEventListener("click", function (e) {
        betAmount = parseInt(betAmount) - parseInt(betAmount);
        betEl.textContent = "Bet: " + betAmount;
        console.log(betAmount);
    });
}