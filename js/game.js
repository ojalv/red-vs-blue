class Player {
  constructor(
    ID,
    name,
    gun,
    shield,
    hat,
    shootKey = "a",
    reloadKey = "s",
    blockKey = "d"
  ) {
    this.ID = ID;
    this.name = name;
    this.gun = gun;
    this.shield = shield;
    this.hat = hat;
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
    document
      .querySelector(`.guy #p${this.ID}Gun`)
      .setAttribute("src", `${this.gun.skin}`);
    this.isBlocking = false;
    if (this.gun.bullets > 0) {
      //reduce enemy life equal to gun damage if enemy is not blocking and you are'nt out of bullets
      if (!enemy.isBlocking) {
        this.gun.bullets -= 1;
        console.log(`bullets: ${this.gun.bullets}`);
        console.log(`${this.name} bullets: ${this.gun.bullets}`);
        enemy.life -= this.gun.damage;

        if (!(enemy.life <= 0)) {
          document
            .querySelector(`#p${enemy.ID}LifeBar .life`)
            .setAttribute("style", `width: ${enemy.life}%;`);
        } else {
          document
            .querySelector(`#p${enemy.ID}LifeBar .life`)
            .setAttribute("style", `width: 0%;`);
        }

        console.log(`${enemy.name} life: ${enemy.life}`);
      } else {
        console.log(`${this.name} bullets: ${this.gun.bullets}`);
        this.gun.bullets -= 1;
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
    document
      .querySelector(`.guy #p${this.ID}Gun`)
      .setAttribute("src", `${this.gun.skin}`);
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
    document
      .querySelector(`.guy #p${this.ID}Gun`)
      .setAttribute("src", `${this.shield.skin}`);
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
  constructor(name, damage, magazineSize, skin) {
    this.name = name;
    this.damage = damage;
    this.bullets = magazineSize;
    this.magazineSize = magazineSize;
    this.skin = skin;
  }
}
class Shield {
  constructor(name, skin) {
    this.name = name;
    this.skin = skin;
  }
}
class Hat {
  constructor(name, skin) {
    this.name = name;
    this.skin = skin;
  }
}
const guns = [
  new Gun("pistol", 15, 12, "../assets/guns/pistol/skin/gun-solid.svg"),
  new Gun(
    "revolver",
    30,
    6,
    "../assets/guns/revolver/skin/revolver-svgrepo-com.svg"
  ),
];

const shields = [
  new Shield(
    "frying-pan",
    "../assets/shields/frying-pan/skin/frying-pan-and-fried-egg-svgrepo-com.svg"
  ),
];
const hats = [
  new Hat("cowboy", "../assets/hats/cowboy/hat-cowboy-solid.svg"),
  new Hat(
    "cowboy-side",
    "../assets/hats/cowboy-side/hat-cowboy-side-solid.svg"
  ),
];
const p1 = new Player(1, "alvaro", { ...guns[0] }, shields[0], hats[1]);

const p2 = new Player(
  2,
  "juan",
  structuredClone(guns[0]),
  shields[0],
  hats[1],
  "z",
  "x",
  "c"
);

class Game {
  constructor() {
    this.globalHandlerFunction = null;
    this.menuHandlerFunction = null;
    this.remainingTime = 10;
    this.winnerName = null;
    this.draw = false;
    this.clock = setInterval(() => {
      this.isWinner(p1, p2);
      if (!(this.remainingTime == 0)) {
        if (!(this.winnerName == null)) {
          this.renderClock();
          clearInterval(this.clock);
          console.log(`Remaining Time: ${this.remainingTime}`);
        } else {
          console.log(`Remaining Time: ${this.remainingTime}`);
          this.renderClock();
          this.remainingTime -= 1;
        }
      } else {
        this.renderClock();
        console.log(`Remaining Time: ${this.remainingTime}`);
        clearInterval(this.clock);
      }
    }, 1000);
  }
  renderClock() {
    document.getElementById("time").innerText = this.remainingTime;
  }
  renderPlayersAssets(p1, p2) {
    document
      .querySelector(`.guy #p${p1.ID}Gun`)
      .setAttribute("src", `${p1.gun.skin}`);

    document
      .querySelector(`.guy #p${p2.ID}Gun`)
      .setAttribute("src", `${p2.gun.skin}`);
    document
      .querySelector(`.guy #p${p1.ID}Hat`)
      .setAttribute("src", `${p1.hat.skin}`);
    document
      .querySelector(`.guy #p${p2.ID}Hat`)
      .setAttribute("src", `${p2.hat.skin}`);
  }

  // event listeners management
  globalHandler() {
    const gh = () => {};
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

  isWinner(p1, p2) {
    if (this.remainingTime == 0) {
      if (p1.life > p2.life) {
        this.winnerName = p1.name;
      } else if (p1.life < p2.life) {
        this.winnerName = p2.name;
      } else if (p1.life == p2.life) {
        this.draw = true;
      }
    } else {
      if (p2.life <= 0) {
        this.winnerName = p1.name;
      } else if (p1.life <= 0) {
        this.winnerName = p2.name;
      }
    }
    if (!this.draw) {
      if (!(this.winnerName == null)) {
        this.removeAllListeners(p1, p2);
        console.log(`${this.winnerName} wins!`);
        this.removeGlobalListener();
        console.log(`GameOver`);
        //end screen
      }
    } else {
      this.removeAllListeners(p1, p2);
      console.log(`Draw!`);
      this.removeGlobalListener();
      console.log(`GameOver`);
    }
  }
  play(p1, p2) {
    this.renderClock()
    this.renderPlayersAssets(p1, p2);
    this.addAllListeners(p1, p2);
    this.addGlobalListener(p1, p2);
  }
}

const game = new Game(p1, p2);
game.play(p1, p2);
