class Game {
  constructor() {
    this.globalHandlerFunction = null;
    this.menuHandlerFunction = null;
    this.remainingTime = 60;
  }
  // event listeners management
  globalHandler(p1, p2) {
    const gh = () => {
      this.isWinner(p1, p2);
      this.isWinner(p2, p1);
    };
    return gh;
  }
  addGlobalListener(p1, p2) {
    this.globalHandlerFunction = this.globalHandler(p1, p2);
    document.addEventListener("keydown", this.globalHandlerFunction);
  }
  removeGlobalListener() {
    document.removeEventListener("keydown", this.globalHandlerFunction);
    this.globalHandlerFunction = null;
  }
  addAllListeners(p1, p2) {
    p1.addShootListener(p2);
    p1.addReloadListener();
    p1.addBlockListener();
    p2.addShootListener(p1);
    p2.addReloadListener();
    p2.addBlockListener();
  }
  removeAllListeners(p1, p2) {
    p1.removeShootListener(p2);
    p1.removeReloadListener();
    p1.removeBlockListener();
    p2.removeShootListener(p1);
    p2.removeReloadListener();
    p2.removeBlockListener();
  }
  //in game events
  clock() {
    const interval = setInterval(() => {
      if (this.remainingTime == 0) {
        clearInterval(interval);
        console.log(`Remaining Time: ${this.remainingTime}`);
      } else {
        console.log(`Remaining Time: ${this.remainingTime}`);
        this.isWinner(p1, p2);

        this.remainingTime -= 1;
      }
    }, 1000);
  }
  isWinner(p1, p2) {
    if (p2.life <= 0) {
      this.removeAllListeners(p1, p2);
      alert(`${p1.name} wins!`);
      this.removeGlobalListener();
      console.log(`GameOver`);

      //end screen
    }
    if (p1.life <= 0) {
      this.removeAllListeners(p1, p2);
      alert(`${p2.name} wins!`);
      this.removeGlobalListener();
      console.log(`GameOver`);
      //end screen
    }
  }
  play(p1, p2) {
    this.addAllListeners(p1, p2);
    this.addGlobalListener(p1, p2);
    this.clock();
  }
}

const game = new Game(p1, p2);
game.play(p1, p2);
