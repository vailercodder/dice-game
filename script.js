class Player {
  constructor(scoreElement, totalScoreElement) {
    this.scoreElement = scoreElement;
    this.totalScoreElement = totalScoreElement;
    this.currentScore = 0;
    this.totalScore = 0;
  }

  resetScores() {
    this.totalScore = 0;
    this.updateTotalScore();
  }

  updateScore(num1, num2, isZeroRule) {
    if (isZeroRule) {
      this.currentScore = num1 + num2 + 2;
      this.totalScore = 0;
    } else {
      this.currentScore = num1 + num2 + 2;
      this.totalScore += this.currentScore;
    }
    this.updateUI();
  }

  updateUI() {
    this.scoreElement.textContent = this.currentScore;
    this.updateTotalScore();
  }

  updateTotalScore() {
    this.totalScoreElement.textContent = this.totalScore;
  }
}

class UI {
  static hideElement(element) {
    element.style.display = "none";
  }

  static showElement(element) {
    element.style.display = "block";
  }

  static changeBackground(element, color, textColor) {
    element.style.backgroundColor = color;
    element.style.color = textColor;
  }

  static disableButtons(buttons) {
    buttons.forEach((button) => {
      button.classList.add("disabled");
      button.disabled = true;
      button.style.opacity = 0.5;
    });
  }

  static enableButtons(buttons) {
    buttons.forEach((button) => {
      button.classList.remove("disabled");
      button.disabled = false;
      button.style.opacity = 1;
    });
  }

  static updateInputValue(inputElement, newValue) {
    inputElement.value = newValue;
  }

  static getRandomDiceImages(pictureList) {
    let randomIndex1 = Math.floor(Math.random() * pictureList.length);
    let randomIndex2 = Math.floor(Math.random() * pictureList.length);
    return [
      pictureList[randomIndex1],
      pictureList[randomIndex2],
      randomIndex1,
      randomIndex2,
    ];
  }

  static setDiceImages(picture1, picture2, image1, image2) {
    picture1.src = image1;
    picture2.src = image2;
  }
}

class DiceGame {
  constructor() {
    this.ZERONUM = 6;
    this.WINSCORE = 50;
    this.rollCount = 0;
    this.pictureList = [
      "images/dice-1.png",
      "images/dice-2.png",
      "images/dice-3.png",
      "images/dice-4.png",
      "images/dice-5.png",
      "images/dice-6.png",
    ];

    this.picture1 = document.getElementById("picture1");
    this.picture2 = document.getElementById("picture2");
    this.changeDice = document.getElementById("changeDice");
    this.buttonChangePlayerValue = document.getElementById("hold");
    this.inputContainer = document.getElementById("input-container");
    this.submitButton = document.getElementById("submit-button");
    this.targetScoreInput = document.getElementById("number-input");
    this.allButtons = document.querySelectorAll("button:not(#specialButton)");

    this.player1 = new Player(
      document.getElementById("player-1-score"),
      document.getElementById("player-1-total-score")
    );
    this.player2 = new Player(
      document.getElementById("player-2-score"),
      document.getElementById("player-2-total-score")
    );

    this.init();
  }

  init() {
    UI.updateInputValue(this.targetScoreInput, this.WINSCORE);
    this.submitButton.addEventListener("click", () => this.setTargetScore());
    this.changeDice.addEventListener("click", () => this.rollDice());
    this.buttonChangePlayerValue.addEventListener("click", () =>
      this.changePlayer()
    );
  }

  setTargetScore() {
    UI.hideElement(this.inputContainer);
    this.WINSCORE = Number(this.targetScoreInput.value);
  }

  rollDice() {
    this.rollCount++;
    const [image1, image2, num1, num2] = UI.getRandomDiceImages(
      this.pictureList
    );
    UI.setDiceImages(this.picture1, this.picture2, image1, image2);

    if (this.rollCount % 2 !== 0) {
      this.player1.updateScore(num1, num2, this.isZeroRule(num1, num2));
    } else {
      this.player2.updateScore(num1, num2, this.isZeroRule(num1, num2));
    }
    this.checkTotalScore();
  }

  changePlayer() {
    this.rollCount++;
  }

  isZeroRule(num1, num2) {
    return num1 + 1 === this.ZERONUM && num2 + 1 === this.ZERONUM;
  }

  checkTotalScore() {
    if (this.player1.totalScore >= this.WINSCORE) {
      this.declareWinner(true);
    } else if (this.player2.totalScore >= this.WINSCORE) {
      this.declareWinner(false);
    }
  }

  declareWinner(player1Wins) {
    if (player1Wins) {
      const player1 = document.getElementsByClassName("player-1")[0];
      const youWonHeading = document.getElementById("player-1-you-won");
      const player1WinGif = document.getElementById("player-1-win-gif");
      UI.changeBackground(player1, "black", "white");
      UI.showElement(youWonHeading);
      UI.showElement(player1WinGif);
    } else {
      const player2 = document.getElementsByClassName("player-2")[0];
      const youWonHeading2 = document.getElementById("player-2-you-won");
      const player2WinGif = document.getElementById("player-2-win-gif");
      UI.changeBackground(player2, "black", "white");
      UI.showElement(youWonHeading2);
      UI.showElement(player2WinGif);
    }
    this.resetGame();
  }

  resetGame() {
    this.player1.resetScores();
    this.player2.resetScores();
    UI.disableButtons(this.allButtons);
  }
}

function refreshPage() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  new DiceGame();
});
