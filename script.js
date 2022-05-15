const game = {
    cards: {
        char: ["red", "green", "mustard"], //, "plum", "peacock", "white"],
        weapon: ["candle-stick", "dagger", "leadpipe"], //, "leadpipe", "revolver", "rope", "wrench"],
        room: ["kitchen", "hall", "study"], //, "lounge","library","diningroom"],
    },
    envelope: [],
    deck: [],
    accusation: [],
    numberOfPlayers: 3,
    players: [],
    roomRoll: [[1,2],[3,4],[5,6]],
    showCards: [],
}

const currentPlayer = {
  //* keep track of current player's data
  currentPlayerTurn: 0,
  currentPlayerRoll: 0,
  currentSuspicion: {
    char: "",
    weapon: "",
    room: "",
  },
  cardShown: "",
  cardShownBy: "",
};

const cardsOnHand = {};
const possibleCards = [];

const pickMurderCards = () => { //* to select the three cards randomly
    const cards = game.cards
    let suspect = cards.char[Math.floor(Math.random() * (cards.char.length - 1))]
    let weapon = cards.weapon[Math.floor(Math.random() * (cards.weapon.length - 1))]
    let room = cards.room[Math.floor(Math.random() * (cards.room.length - 1))]
    game.envelope = [suspect, weapon, room];
    console.log("envelope", game.envelope);
    cards.char.filter((card) => card !== suspect).map((item) => game.deck.push(item))
    cards.weapon.filter((card) => card !== weapon).map((item) => game.deck.push(item))
    cards.room.filter((card) => card !== room).map((item) => game.deck.push(item))
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      };
      shuffle(game.deck);
      console.log("deck", game.deck);
};

const generatePlayers = () => { //* create players 
    for (let i = 0; i < game.numberOfPlayers; i++) {
        game.players.push(`player${i}`)
        cardsOnHand[`player${i}`] = [];
        possibleCards[i] = [[],[],[]];
    }
    console.log("possibleCards", possibleCards)
}

const distributeDeck = () => { //* split cards according to num of players
    const num = game.deck.length / game.numberOfPlayers //* only if able to split equally..
    for (let i = 0; i < game.numberOfPlayers; i++) {
        for (let j = 0; j < num; j++) {
            const card = game.deck.pop();
            cardsOnHand[`player${i}`].push(card);
        }
    }
    const app = document.createElement("div")
    app.className = "app"
    const div = document.createElement("div")
    div.className = "cardsOnHand"
    app.appendChild(div)
    document.querySelector(".container").appendChild(app)
    for(let i = 0; i < cardsOnHand["player0"].length; i++) { //* display my own cards
        const card = document.createElement("div")
        card.className = "cardsOnHand-indiv"
        const h5 = document.createElement("h5")
        h5.className = "center"
        h5.textContent = cardsOnHand[`player0`][i]
        div.appendChild(card)
        card.appendChild(h5)
    }
    console.log("cardsOnHand",cardsOnHand)
    splitCards();
}

const splitCards = () => { 
    for(let i = 1; i< game.numberOfPlayers; i++) {
        const key = Object.keys(game.cards);
        for (let j = 0; j < key.length; j++) {
            const arr = game.cards[key[j]]
            const playercards = cardsOnHand[`player${i}`]
            arr.forEach((card) => {
                const result = playercards.every((cardB) => {
                    return card !== cardB;
                })
                if (result) {
                    possibleCards[i][j].push(card);
                }
            })
        }
    }
}


const dice = () => { //* only for player0
  const div = document.createElement("div");
  div.className = "diceroll";
  const button = document.createElement("button");
  button.className = "diceroll-btn";
  button.textContent = "roll dice";
  document.querySelector(".app").appendChild(div);
  const rollText = document.createElement("h5");
  rollText.className = "rollText";
  const rollRoom = document.createElement("h5");
  rollRoom.className = "rollRoom";
  div.appendChild(button);
  div.appendChild(rollText);
  div.appendChild(rollRoom);
  button.addEventListener("click", playerActions);
};

const playerActions = () => {
    switch(game.players[0]) {
        case "player0":
           rollDice();
           document.querySelector(".diceroll-btn").classList.add("isHidden")
           confirmSuspect()
           break;
        case "player1":
            document.getElementById("continue-btn").disabled = true
            if(document.querySelectorAll(".continue-suspect").length === 1) {
              document.querySelector(".continue-suspect").classList.remove("isHidden")
              document.getElementById("continue-suspect").disabled = false
            }
        rollDice();
            break;
        case "player2":
            rollDice();
            document.getElementById("continue-btn").disabled = true
            break;
    }
}

const rollDice = () => {
    currentPlayer.currentPlayerRoll = Math.ceil(Math.random() * 6);
    document.querySelector(".rollText").textContent = `${game.players[0]} rolled a ${currentPlayer.currentPlayerRoll}`;
    for(let i = 0; i < game.cards.room.length; i++) {
        let arr = game.roomRoll[i]
        for (let j = 0; j < arr.length; j++) {
            if (currentPlayer.currentPlayerRoll === game.roomRoll[i][j]) {
                currentPlayer.currentSuspicion.room = game.cards.room[i]
                document.querySelector(".rollRoom").textContent = `${game.players[0]} is in ${currentPlayer.currentSuspicion.room}`
            }
        }
    }   
    if (game.players[0] === "player0") {
      if (document.querySelectorAll(".continue-suspect").length === 1) {
        document.querySelector(".continue-suspect").classList.add("isHidden")
        document.getElementById("continue-btn").disabled = true
      }
      suspect()} else {
        if(document.querySelectorAll (".continue-suspect").length === 0)
        {const button = document.createElement("button")
        document.querySelector(".diceroll").appendChild(button)
        button.textContent = "continue"
        button.setAttribute("id","continue-suspect")
        button.className = "continue-suspect"} 
        else {
            // if (document.querySelector(".continue-suspect").classList.contains("isHidden")){
            //     document.querySelector(".continue-suspect").classList.toggle("isHidden")
            // }
            document.getElementById("continue-suspect").disabled = false;
        }
        document.querySelector(".continue-suspect").addEventListener("click", () => {
          document.getElementById("continue-suspect").disabled = true;
          document.getElementById("continue-btn").disabled = false;
          comSuspect()}
          )
    }

}

const suspect = () => { //* create cards for player to select for suspicion
  if (document.querySelectorAll(".suspect").length === 0) {
    const suspect = document.createElement("div");
    suspect.className = "suspect";
    document.querySelector(".app").appendChild(suspect);
    const keys = Object.keys(game.cards);
    for (let i = 0; i < keys.length - 1; i++) {
      for (let j = 0; j < game.cards[keys[i]].length; j++) {
        const div = document.createElement("div");
        div.className = `suspect-${[keys[i]]}`;
        const h5 = document.createElement("h5");
        h5.className = "center";
        h5.textContent = game.cards[keys[i]][j];
        div.addEventListener("click", () => {
          div.classList.toggle(`suspect-${[keys[i]]}selected`);
          if (div.classList.contains(`suspect-${[keys[i]]}selected`)) {
            div.style.border = `2px solid red`;
          } else {
            div.style.border = "";
          }
        });
        div.appendChild(h5);
        document.querySelector(".suspect").appendChild(div);
      }
    }
  } else { document.querySelector(".suspect").classList.remove("isHidden")
  } 
};

const confirmSuspect = () => {
  if (document.querySelectorAll(".confirmsuspect-btn").length === 0) {
    const div = document.createElement("div");
    div.className = "confirmsuspect";
    const button = document.createElement("button");
    button.textContent = "confirm suspect";
    button.className = "confirmsuspect-btn";
    document.querySelector(".suspect").appendChild(div)
    div.appendChild(button);
    const suspicionbox = document.createElement("div");
    suspicionbox.className = "suspicionbox";
    document.querySelector(".app").appendChild(suspicionbox);
    const h5 = document.createElement("h5");
    h5.className = "suspect-query";
    const results = document.createElement("h5");
    results.className = "suspect-results";
    suspicionbox.appendChild(h5);
    suspicionbox.appendChild(results);
    const continuebtn = document.createElement("button")
    continuebtn.className = "continue-btn"
    continuebtn.classList.add("isHidden")
    continuebtn.setAttribute("id", "continue-btn")
    continuebtn.textContent = "next player"
    suspicionbox.appendChild(continuebtn)
    const accusebtn = document.createElement("button")
    accusebtn.className = "accuse-btn"
    accusebtn.textContent = "accuse?"
    suspicionbox.appendChild(accusebtn)
  }
handleClick()
document.querySelector(".continue-btn").addEventListener("click", 
  nextPlayer)
document.querySelector(".accuse-btn").addEventListener("click", () => {
    if (document.querySelectorAll(".wincontainer").length === 0) {
        accuseFinal()
    }
})
};


const handleClick = () => {
  document
    .querySelector(".confirmsuspect-btn")
    .addEventListener("click", () => {
      if (
        document.querySelectorAll(".suspect-charselected").length === 1 &&
        document.querySelectorAll(".suspect-weaponselected").length === 1
      ) {
        document.getElementById("continue-btn").disabled = false;
        currentPlayer.currentSuspicion.char = document.querySelector(
          ".suspect-charselected"
        ).textContent;
        currentPlayer.currentSuspicion.weapon = document.querySelector(
          ".suspect-weaponselected"
        ).textContent;
        document.querySelector(".suspect").classList.add("isHidden");
        document.querySelector(
          ".suspect-query"
        ).textContent = `you suspect ${currentPlayer.currentSuspicion.char} killed with a ${currentPlayer.currentSuspicion.weapon} in the ${currentPlayer.currentSuspicion.room}!`;
        checkOther();
        document.querySelector(
          ".suspect-results"
        ).textContent = `${currentPlayer.cardShownBy} has the ${currentPlayer.cardShown} card`;
        if (document.querySelector(".continue-btn").classList.contains("isHidden")) {
            document.querySelector(".continue-btn").classList.toggle("isHidden")
        }
      } else {
        alert(
          "sry you only can choose one weapon & one character to suspect!!!"
        );
      }
    });
};

const nextPlayer = () => {

    const element = game.players.shift();
    game.players.push(element);
    console.log("playerTurn",currentPlayer.currentPlayerTurn)
    console.log("game.players", game.players)
    document.querySelector(".rollText").textContent = "";
    document.querySelector(".rollRoom").textContent = "";
    document.querySelector(".suspect-query").textContent = "";
    document.querySelector(".suspect-results").textContent = "";

    if (game.players[0] === "player0") {
        currentPlayer.currentPlayerTurn = 0;
        playerActions()
    } else if (game.players[0] === "player1") {
        document.querySelector(".continue-btn").classList.toggle("isHidden")
        currentPlayer.currentPlayerTurn = 1;
        playerActions()
    } else {
        document.querySelector(".continue-suspect").classList.remove("isHidden")
        currentPlayer.currentPlayerTurn = 2
        playerActions()
    }
    // console.log("currentPlayerTurn",currentPlayer.currentPlayerTurn)
}

const checkOther = () => {
    const suspicion = currentPlayer.currentSuspicion
    const keys = Object.keys(suspicion)
    if (game.players[0] === "player0") {
    for (let i = 1; i < game.players.length; i++) {
        const checkDeck = cardsOnHand[game.players[i]]
        for (let j = 0; j < keys.length; j++) {
            for (let k = 0; k < checkDeck.length; k++) {
                if (suspicion[keys[j]] === checkDeck[k]) {
                    currentPlayer.cardShown = checkDeck[k]
                    currentPlayer.cardShownBy = `${game.players[i]}`
                    return true
                }
            }
        }
    }
    document.querySelector(".continue-btn").classList.toggle("isHidden")
    currentPlayer.cardShownBy = "no one";
    currentPlayer.cardShown = "";
    return `the other players do not have the cards`; 
} else {
    let num = game.players.findIndex((element) => element === "player0")
    console.log("num", num)
    if (num === 2) {
            const checkDeck = cardsOnHand[game.players[1]]
            for (let j = 0; j < keys.length; j++) {
                for (let k = 0; k < checkDeck.length; k++) {
                    if (suspicion[keys[j]] === checkDeck[k]) {
                        currentPlayer.cardShown = checkDeck[k]
                        currentPlayer.cardShownBy = `${game.players[1]}`
                        return true
            }
        }
        if(!document.querySelector(".continue-btn").classList.contains("isHidden"))
         {document.querySelector(".continue-btn").classList.toggle("isHidden")}
        
        currentPlayer.cardShownBy = "no one";
        currentPlayer.cardShown = "";
        if (currentPlayer.cardShownBy = "no one") {
            selectFromMyCards()
        }
        return `the other players do not have the cards`; 
    } 

    } else if (num === 1) {
        selectFromMyCards() 
        if (currentPlayer.cardShownBy = "no one") {
            const checkDeck = cardsOnHand[game.players[2]]
            for (let j = 0; j < keys.length; j++) {
                for (let k = 0; k < checkDeck.length; k++) {
                    if (suspicion[keys[j]] === checkDeck[k]) {
                        currentPlayer.cardShown = checkDeck[k]
                        currentPlayer.cardShownBy = `${game.players[2]}`
                        return true
            }
        }
        document.querySelector(".continue-btn").classList.toggle("isHidden")
        currentPlayer.cardShownBy = "no one";
        currentPlayer.cardShown = "";
        return `the other players do not have the cards`; 
    } 
        }
    }
}
}
const comSuspect = () => {
  if(!document.querySelector(".continue-btn").classList.contains("isHidden")) {document.querySelector(".continue-btn").classList.toggle("isHidden")}
    const i = currentPlayer.currentPlayerTurn
    const randomChar = Math.floor(Math.random() * possibleCards[i][0].length);
    const randomWeapon = Math.floor(Math.random() * possibleCards[i][1].length);
    currentPlayer.currentSuspicion["char"] = possibleCards[i][0][randomChar];
    currentPlayer.currentSuspicion["weapon"] =
      possibleCards[i][1][randomWeapon];
      document.querySelector(
        ".suspect-query"
      ).textContent = `${game.players[0]} suspect ${currentPlayer.currentSuspicion["char"]} killed with a ${currentPlayer.currentSuspicion["weapon"]} in the ${currentPlayer.currentSuspicion["room"]}`;
    checkOther()
    document.querySelector(
        ".suspect-results"
      ).textContent = `${currentPlayer.cardShownBy} showed ${game.players[0]} a card` 
    if(document.querySelector(".continue-btn").classList.contains("isHidden")) {
      document.querySelector(".continue-btn").classList.toggle("isHidden")
    }
      return true
}



const selectFromMyCards = () => {
    game.showCards = [];
    if (document.querySelectorAll(".showcards").length === 0) {
        const div = document.createElement("div")
        div.className = "showcards"
        // div.textContent = "checking your deck now"
        document.querySelector(".app").appendChild(div) 
    }
    const suspicion = currentPlayer.currentSuspicion
    const keys = Object.keys(suspicion)
    for (let i = 0; i < keys.length; i++) {
        const checkDeck = cardsOnHand["player0"]
        for (let j = 0; j < checkDeck.length; j++) {
            if (suspicion[keys[i]] === checkDeck[j]) {
                game.showCards.push(suspicion[keys[i]])
            }
        }
    }
    console.log("game.showCards", game.showCards)
    if (game.showCards.length === 0) {
        const checkDeck = cardsOnHand[game.players[1]]
        for (let j = 0; j < keys.length; j++) {
            for (let k = 0; k < checkDeck.length; k++) {
                if (suspicion[keys[j]] === checkDeck[k]) {
                    currentPlayer.cardShown = checkDeck[k]
                    currentPlayer.cardShownBy = `${game.players[1]}`
                    document.querySelector(
                        ".suspect-results"
                      ).textContent = `${currentPlayer.cardShownBy} showed ${game.players[0]} a card` 
                    return true
                }
            }
        } 
        currentPlayer.cardShownBy = "no one"
        currentPlayer.cardShown = ""
        document.querySelector(
            ".suspect-results"
          ).textContent = `${currentPlayer.cardShownBy} showed ${game.players[0]} a card` 
        document.querySelector(".continue-btn").classList.toggle("isHidden")  
    } else {
        if (document.querySelector(".showcards").classList.contains("isHidden")) {
            document.querySelector(".showcards").classList.toggle("isHidden")
    }
    document.getElementById("continue-btn").disabled = true;
    showCards()
    }
}

const showCards = () => {
  document.querySelector(".showcards").replaceChildren();
  for (let i = 0; i < game.showCards.length; i++) {
    const showcardsDiv = document.createElement("div");
    showcardsDiv.className = "showcards-card";
    const cardText = document.createElement("h5");
    cardText.classList.add("center", "showcards-cardtext");
    showcardsDiv.appendChild(cardText);
    document.querySelector(".showcards").appendChild(showcardsDiv);
    cardText.textContent = game.showCards[i];
    showcardsDiv.addEventListener("click", () => {
      showcardsDiv.classList.toggle("showthiscard");
      if (showcardsDiv.classList.contains("showthiscard")) {
        showcardsDiv.style.border = `2px solid red`;
      } else {
        showcardsDiv.style.border = "";
      }
    });
  }
  if (document.querySelectorAll(".showcards-card-btn").length === 0) {
    const button = document.createElement("button");
    button.classList.add("showcards-card-btn");
    document.querySelector(".showcards").appendChild(button);
    button.textContent = "show this card";
  }
  document
    .querySelector(".showcards-card-btn")
    .addEventListener("click", () => {
      if (document.querySelectorAll(".showthiscard").length === 1) {
        document.getElementById("continue-btn").disabled = false;
        currentPlayer.cardShownBy = "player0";
        currentPlayer.cardShown =
          document.querySelector(".showthiscard").textContent;
        document.querySelector(
          ".suspect-results"
        ).textContent = `${currentPlayer.cardShownBy} showed ${game.players[0]} a card`;
        document.querySelector(".showcards").classList.add("isHidden");
      }
    });
};

const accuseFinal = () => {
    const wincontainer = document.createElement("div")
    wincontainer.className = "wincontainer"
    document.querySelector(".app").appendChild(wincontainer)
    const button = document.createElement("button")
    button.className = "checkcards"
    button.textContent = "check envelope"
    document.querySelector(".suspicionbox").appendChild(button)
    const keys = Object.keys(game.cards)
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < game.cards[keys[i]].length; j++) {
            const div = document.createElement("div")
            div.className = [keys[i]]
            const h5 = document.createElement("h5")
            h5.className = "center"
            h5.textContent = game.cards[keys[i]][j]
            div.addEventListener("click", () => {
                div.classList.toggle(`${[keys[i]]}accused`)
                if (div.classList.contains(`${[keys[i]]}accused`)) {
                    div.style.border = `2px solid red`
                } else {
                    div.style.border = ""
                }
            })
            div.appendChild(h5)
            wincontainer.appendChild(div)
        }
    }
    const h5 = document.createElement("h5")
    h5.className = "win-results"
    document.querySelector(".suspicionbox").appendChild(h5)
    button.addEventListener("click",() => {
        winGame() 
        const playagain = document.createElement("button")
        playagain.textContent = "play again!"
        playagain.className = "playagain"
        document.querySelector(".suspicionbox").appendChild(playagain)
        playagain.addEventListener("click", reset)
    })
}

const winGame = () => {
    if (
        document.querySelectorAll(".characcused").length === 1 &&
        document.querySelectorAll(".weaponaccused").length === 1 &&
        document.querySelectorAll(".roomaccused").length === 1
      ) {
          game.accusation = [
            `${document.querySelector(".characcused").textContent}`,
            `${document.querySelector(".weaponaccused").textContent}`,
            `${document.querySelector(".roomaccused").textContent}`,
          ]
          console.log(game.accusation);
        } 
        for (let i = 0 ; i < game.envelope.length; i++) {
            if (game.envelope[i] !== game.accusation[i]) {
                document.querySelector(".win-results").textContent = `sorry you have accused wrongly! game has ended... it was actually ${game.envelope[0]} who killed with a ${game.envelope[1]} in the ${game.envelope[2]}`
                return false
            }
        }
        document.querySelector(".win-results").textContent = "excellent detective! you have made the correct guesses!";
        return true
    
}

const reset = () => {
    document.querySelector(".container").replaceChildren()
    main()
}
////////////////////////////!
//////! Clue Notes /////////!
////////////////////////////!

const clueCards = (element) => {
    for (let i = 0; i < game.cards[element].length; i++) {
      const div = document.createElement("div");
      const p = document.createElement("p");
      document.querySelector(`.cluenotes`).appendChild(div);
      div.appendChild(p);
      p.textContent = game.cards[element][i];
      p.addEventListener("click", () => {
        p.classList.toggle("strikethrough");
      });
    }
  };
  
  const clueNotes = () => {
    const div = document.createElement("div");
    div.classList.add("cluenotes");
    document.querySelector(".container").appendChild(div);
    clueCards("char");
    clueCards("weapon");
    clueCards("room");
  };


const main = () => {
    pickMurderCards()
    generatePlayers()
    distributeDeck()
    clueNotes()
    dice()
}

main()
