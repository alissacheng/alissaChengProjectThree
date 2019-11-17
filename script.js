const gameApp = {};

//Create a Deck of Cards
const suits = ["♣", "♦", "♥", "♠"];

const ranks = [ "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const deck = []; 

function newDeck() {
    for(i=0; i< suits.length; i++){

        for(x=0; x< ranks.length; x++){
            let weight = parseInt(ranks[x]);
    
            if(ranks[x] === "J" || ranks[x] === "Q" || ranks[x] === "K"){
                weight = 10;
            }else if(ranks[x] === "A"){
                weight = 11;
            };
            
            let card = {rank:ranks[x], suit: suits[i], weight: weight};
            deck.push(card);
        }
    }
}

//Create Players
const playerOneHand = [];
const playerTwoHand = [];

const players = [];

players[0] = {name: "Player One", hand: playerOneHand, score: 0, money: 20};
players[1] = {name: "Player Two", hand: playerTwoHand, score: 0, money: 20};

//Player One Goes First
let currentPlayer = 0

//Shuffle Deck

function shuffleDeck(){

    for (i=0;i<1200;i++){
        let ranNumber = Math.floor(Math.random()*deck.length);
        let ranNumberTwo = Math.floor(Math.random()*deck.length);
    
        let temp = deck[ranNumber]
        deck[ranNumber] = deck[ranNumberTwo];
        deck[ranNumberTwo] = temp
    }
}

//Deal Cards
function dealCards(){
    for(i=0; i<2; i++){
        playerOneHand.push(deck[deck.length - 1]);
        deck.pop();
        playerTwoHand.push(deck[deck.length - 1]);
        deck.pop();
    };

    //If a player gets two aces dealt to them
    for(i=0; i<players.length; i++){
        if(players[i].hand[0].weight+players[i].hand[1].weight>21){
            players[i].hand[0].weight = 1;
        }
    };

    displayCards();
};

//Hit Me Button
$(".hit-me").on("click", function(){
    hitMe();
})

function hitMe() {
    players[currentPlayer].hand.push(deck[deck.length - 1]);
    deck.pop();

    calculate();
    displayCards();

    //if a player goes over 21
     if(players[currentPlayer].score > 21 && players[1].score !== 21 && players[0].score !== 21){
        $(".banner").text(`You Went Over 21. ${players[currentPlayer].name} Loses!`);

        players[currentPlayer].money -=4;
        players[1].money+=2;
        players[0].money+=2;
        gameOver();

    }else if(players[0].score > 21 && players[1].score === 21){
        $(".banner").text("Player 2: BLACKJACK! 🏆");
        players[0].money -= 4;
        players[1].money += 4;
        gameOver();
    }else if(players[1].score > 21 && players[0].score === 21){
        $(".banner").text("Player 1: BLACKJACK! 🏆");
        players[1].money -= 4;
        players[0].money += 4;
        gameOver();
    }

    displayMoney();
};

//Stay Button
$(".stay").on("click", function stay(){

    if(currentPlayer !== players.length-1){
        currentPlayer += 1;
        $(".banner").text("Player Two's Turn");
    }else{
        final();
    };
});

//End of round
function final(){

    calculate();
    gameOver();

    if(players[0].score === players[1].score && players[0].score < 21){
        $(".banner").text("Push!");
    }else if(players[0].score > players[1].score && players[0].score < 21){
        $(".banner").text("Player One Wins!");
        players[1].money -= 2;
        players[0].money += 2;
    }else if (players[1].score < 21 && players[0].score !== 21){
        $(".banner").text("Player Two Wins!");
        players[0].money -= 2;
        players[1].money += 2;
    };

    blackjack();
    displayMoney();
}

//Calculate Score
function calculate(){

    players[0].score = 0;
    players[1].score = 0;

    for(i=0; i<playerOneHand.length; i++){
        players[0].score += playerOneHand[i].weight;
    };

    for(i=0; i<playerTwoHand.length; i++){
        players[1].score += playerTwoHand[i].weight;
    };

    ace();
}

//Turn the weight of an ace from 11 to 1 if hand goes over 21
function ace(){
    for (i=0; i < players[currentPlayer].hand.length; i++){
        if(players[currentPlayer].score>21 && players[currentPlayer].hand[i].weight === 11){
            players[currentPlayer].hand[i].weight = 1;
            players[currentPlayer].score -= 10;
        }
    }
}

//BlackJack!
function blackjack(){
    if(players[0].score === 21 && players[1].score === 21){
        $(".banner").text("TWO BLACKJACKS, TWO WINNERS! 🏆🏆");
    }else if(players[0].score === 21 && players[1].score !== 21){
        $(".banner").text("Player 1: BLACKJACK! 🏆");
        players[1].money -= 4;
        players[0].money += 4;
    }else if(players[1].score === 21 && players[0].score !== 21){
        $(".banner").text("Player 2: BLACKJACK! 🏆");
        players[0].money -= 4;
        players[1].money += 4;
    }
}


//Display Cards
function displayCards (){

    $(".hand").empty();
//player one
    for(i=0; i<playerOneHand.length; i++){
        let card = `
        <div class="card">
            <div class="container">
                <p>${playerOneHand[i].rank}</p>
                <p class="suit">${playerOneHand[i].suit}</p>
            </div>
            <h2>${playerOneHand[i].suit}</h2>
        </div>`

        if(playerOneHand[i].suit === "♦" || playerOneHand[i].suit === "♥"){
            card = `
            <div class="card">
                <div class="container">
                    <p class="rank"><span>${playerOneHand[i].rank}</span></p>
                    <p class="suit"><span>${playerOneHand[i].suit}</span></p>
                </div>
                <h2><span>${playerOneHand[i].suit}</span></h2>
            </div>`
        }
        $(".player-one .hand").append(card);
    };
//player two
    for(i=0; i<playerTwoHand.length; i++){
        let card = 
            `<div class="card">
                <div class="container">
                    <p>${playerTwoHand[i].rank}</p>
                    <p class="suit">${playerTwoHand[i].suit}</p>
                </div>
                <h2>${playerTwoHand[i].suit}</h2>
            </div>`
        if(playerTwoHand[i].suit === "♦" || playerTwoHand[i].suit === "♥"){
            card = 
            `<div class="card">
                <div class="container">
                    <p><span>${playerTwoHand[i].rank}</span></p>
                    <p><span>${playerTwoHand[i].suit}</span></p>
                </div>
                <h2><span>${playerTwoHand[i].suit}</span></h2>
            </div>`
        }
        $(".player-two .hand").append(card);
    }
};

    //click cards to show
    
$(".hand").on("click", "div", function(){
    $(this).toggleClass("clicked");
});


function displayMoney() {
//player one
    for(i=0; i<playerOneHand.length; i++){
        let money = `<div><p>$ ${players[0].money}</p></div>`
        $(".player-one .money").html(money);
    };
//player two
    for(i=0; i<playerTwoHand.length; i++){
        let money = `<div><p>$ ${players[1].money}</p></div>`
        $(".player-two .money").html(money);
    };

    moneyCheck();
};

//Check if game is over
function moneyCheck (){

    for(i=0; i<players.length;i++){
        if(players[i].money === 0){
            alert(`${players[i].name} owes $40!!!`);
            $(".new-round").attr("disabled", true);
        };
    };
};

//game over disables hit me and stay buttons
const gameOver = function () {
    $(".hit-me").attr("disabled", true);
    $(".stay").attr("disabled", true);
}

gameApp.init = function (){
    newDeck();
    shuffleDeck();
    dealCards();
    displayMoney();
};

$(".new-round").on("click", function(){
    players[0].hand.length = 0;
    players[1].hand.length = 0;
    deck.length = 0;
    currentPlayer = 0;
    $(".hit-me").attr("disabled", false);
    $(".stay").attr("disabled", false);
    $(".banner").text("Player One Goes First")
    gameApp.init();
})

$(function() {
    gameApp.init();
});
