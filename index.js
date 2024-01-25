// Javascript code to handles various game states, including winning, losing, blackjacks, and betting options.

// Track game state and player actions.
let isRestarted = false;
let startFromZero = false;
let hasBlackJack = false;
let hasCashOut = false;
let hasNoChips = false;
let cards = []; // Stores the player's current cards.


// Message, Cards, Sum, Player elements, initial amounts
let messageEl = document.getElementById("messageEl"); // Displays messages to the player.
let cardsNum = document.getElementById('cardsNum'); // Shows the player's current cards.
let sumTotal = document.getElementById('sumTotal'); // Displays the sum of the player's cards.
let playerEl = document.getElementById('playerEl'); // Shows the player's name and chips.
let increaseBetBtn = document.getElementById('increaseBet');
let decreaseBetBtn = document.getElementById('decreaseBet');
let blackJackAmount = 0; // Stores the winning amount for a blackjack.
let initialBetAmount = 20; // Start the player's bet.
let betAmount = initialBetAmount; // Stores the bet amount
let intialChipsAmount = 100; // Stores the player's initial chips value.

// Player object containing player information (name and chips).
let player = {
    name: "Player 1",
    chips: intialChipsAmount
}

// Updates the player's chip count and displays it on the screen.
function updatePlayerChips(amount=0){
    player.chips = amount;
    playerEl.textContent = player.name + ": R" + player.chips;
}

updatePlayerChips(player.chips);

// Random Numbers Array | Generate random numbers between 1 and 13
// Adjusts card values to match blackjack rules (aces are 11, face cards are 10).
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

/** Create and manage the game buttons to control game actions **/
// Main button to start the game
let startGameBtn = document.getElementById("startGameBtn");

let createStartBtn = function () {
    if(startGameBtn === (undefined || null)){ // Check if button exists
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

// Restart button to restart the game
let restartGameBtn = document.getElementById("restartGameBtn");
let createRestartGameBtn = function () {
    if(restartGameBtn === (undefined || null)){ // Check if button exists
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

// Button to draw a new card
let newCardsBtn = document.getElementById("newCardsBtn");
let createNewCardsBtn = function () {
    if(newCardsBtn === (undefined || null)){ // Check if button exists
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

/** Game functions **/

// Initializes a new game, handling bets and chip updates.
let startGame = function (){
    let remainingChips = player.chips - betAmount;
    updatePlayerChips(remainingChips);
    betEl.textContent = "Bet: R" + betAmount;
    createNewCardsBtn();
    startGameBtn.replaceWith(createNewCardsBtn());
    drawCards();
}

// Draws new cards, calculates scores, and displays game state.
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
        
        if(total <= 20){
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
        let makeButton = (document.querySelector('button').id == 'newCardsBtn')? newCardsBtn : restartGameBtn;
        makeButton.replaceWith(createStartBtn());
        startGameBtn.textContent = "START GAME";
        removeDisabledAttr();
        startFromZero = false;
        hasNoChips = false;
        betEl.textContent = "Bet: R0";
        betAmount = initialBetAmount;
        updatePlayerChips(intialChipsAmount);
    }
    messageEl.textContent = message;
    addEmojiSpan(messageEl);
}

// Removes the disabled attribute from a button.
let removeDisabledAttr = function(){
    const btn = document.querySelector('button');
    if(btn.hasAttribute("disabled")){btn.removeAttribute("disabled");}
}

// Adds an emoji to the message element if the message contains "lost".
let addEmojiSpan = function (messageEl) {
    const messageContent = messageEl.textContent.toLowerCase();
    const emojiSpan = document.createElement("span");
    if(messageContent.includes("lost")){
        emojiSpan.textContent = '😟';
        messageEl.insertBefore(emojiSpan, messageEl.firstChild);
    }
}

// Buttons to adjust the bet amount.
if(increaseBetBtn !== (undefined || null)){
    betAmount = parseInt(betAmount) - parseInt(betAmount);
    increaseBetBtn.addEventListener("click", function (e) {
        if(parseInt(betAmount) < parseInt(player.chips)){
            betAmount = (parseInt(betAmount) == 0)? (parseInt(initialBetAmount) + parseInt(betAmount)) : (betAmount + 10);
            betEl.textContent = "Bet: R" + betAmount;
        }
    });
}
if(decreaseBetBtn !== (undefined || null)){
    betAmount = parseInt(betAmount) - parseInt(betAmount);
    decreaseBetBtn.addEventListener("click", function (e) {
        if(parseInt(betAmount) > initialBetAmount){
            betAmount = (parseInt(betAmount) == 0)? (parseInt(betAmount) - parseInt(initialBetAmount)) : (betAmount - 10);
            betEl.textContent = "Bet: R" + betAmount;
        }
    });
}