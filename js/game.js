class Player {
  constructor(ID, name, gun, shootKey = "a", reloadKey = "s", blockKey = "d") {
    this.ID = ID;
    this.name = name;
    this.gun = gun;
    this.life = 100;
    this.shootKey = shootKey;
    this.reloadKey = reloadKey;
    this.blockKey = blockKey;
    this.isBlocking = false;
    this.shootHandlerFunction = null;
    this.reloadHandlerFunction = null;
    this.blockHandlerFunction = null;
  }
  // shoot
  shoot(enemy) {
    this.isBlocking = false;
    if (this.gun.bullets > 0) {
      //reduce enemy life equal to gun damage if enemy is not blocking and you are'nt out of bullets
      if (!enemy.isBlocking) {
        this.gun.bullets -= 1;
        console.log(`${this.name} bullets: ${this.gun.bullets}`);
        enemy.life -= this.gun.damage;
        console.log(`${enemy.name} life: ${enemy.life}`);
      } else {
        //if the enemy is blocking you dont deal damage
        console.log(`${this.name} shoots but ${enemy.name} is blocking`);
      }
    } else {
      //if you are out of bullets, you don't deal damage
      console.log(`${this.name} is out of bullets!`);
    }
  }

  shootHandler(enemy) {
    const sh = (e) => {
      if (e.key === this.shootKey) {
        this.shoot(enemy);
      }
    };
    return sh;
  }
  addShootListener(enemy) {
    this.shootHandlerFunction = this.shootHandler(enemy);
    document.addEventListener("keydown", this.shootHandlerFunction);
  }
  removeShootListener() {
    document.removeEventListener("keydown", this.shootHandlerFunction);
    this.shootHandlerFunction = null;
  }
  // reload
  reload() {
    this.isBlocking = false;
    if (this.gun.bullets < this.gun.magazineSize) {
      console.log(`${this.name}: +1 bullet`);
      this.gun.bullets += 1;
    } else {
      console.log(`${this.name}: full ammo`);
    }
  }
  reloadHandler() {
    const sh = (e) => {
      if (e.key === this.reloadKey) {
        this.reload();
      }
    };
    return sh;
  }
  addReloadListener() {
    this.reloadHandlerFunction = this.reloadHandler();
    document.addEventListener("keydown", this.reloadHandlerFunction);
  }
  removeReloadListener() {
    document.removeEventListener("keydown", this.reloadHandlerFunction);
    this.reloadHandlerFunction = null;
  }
  //block
  block() {
    //while the block button is pressing the state of "blocking" is true
    //during the this state you are invulneable
    //this state has a counter what reduces while you blocking and recharges while you don't
    //if the counter of blocking is equal to zero, you loose blocking for a moment
    console.log(`${this.name} is blocking!`);

    this.isBlocking = true;
  }
  blockHandler() {
    const sh = (e) => {
      if (e.key === this.blockKey) {
        this.block();
      }
    };
    return sh;
  }
  addBlockListener() {
    this.blockHandlerFunction = this.blockHandler();
    document.addEventListener("keydown", this.blockHandlerFunction);
  }
  removeBlockListener() {
    document.removeEventListener("keydown", this.blockHandlerFunction);
    this.blockHandlerFunction = null;
  }
}
class Gun {
  constructor(name, damage, bullets, magazineSize) {
    this.name = name;
    this.damage = damage;
    this.bullets = bullets;
    this.magazineSize = magazineSize;
  }
}
const revolver1 = new Gun("revolver", 50, 6, 6);
const revolver2 = new Gun("revolver", 1, 6, 6);
const p1 = new Player(1, "alvaro", revolver1);
const p2 = new Player(1, "juan", revolver2, "z", "x", "c");

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
    if (p1.life > p2.life && this.remainingTime == 0) {
      this.removeAllListeners(p1, p2);
      console.log(`${p1.name} wins!`);
      this.removeGlobalListener();
      console.log(`GameOver`);
      //end screen
    }
    if (p1.life < p2.life && this.remainingTime == 0) {
      this.removeAllListeners(p1, p2);
      console.log(`${p2.name} wins!`);
      this.removeGlobalListener();
      console.log(`GameOver`);
      //end screen
    }
    if (p2.life <= 0) {
      this.removeAllListeners(p1, p2);
      console.log(`${p1.name} wins!`);
      this.removeGlobalListener();
      this.remainingTime = 0;
      console.log(`GameOver`);

      //end screen
    }
    if (p1.life <= 0) {
      this.removeAllListeners(p1, p2);
      console.log(`${p2.name} wins!`);
      this.removeGlobalListener();
      this.remainingTime = 0;
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
