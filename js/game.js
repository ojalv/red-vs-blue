class Guy {
    constructor(name, shootKey = "a", reloadKey = "s", changeStanceKey = "d") {
        this.name = name
        this.hatID = "cowboy-side"
        this.gunID = "revolver"
        this.shieldID = "frying-pan"
        this.life = 100
        this.gunDamage = 25
        this.bullets = 6
        this.shootKey = shootKey
        this.reloadKey = reloadKey
        this.changeStanceKey = changeStanceKey
        this.isBlocking = false
    }
    shoot(enemy) {
        if (!this.isBlocking) {
            if (!this.bullets <= 0) {
                this.bullets -= 1;
                enemy.getDamaged(this)
                //shoot:sfx
                //shoot:animation
            }
            else {
                this.reload()
            }


        }

        if (this.isBlocking) {
            console.log(`${this.name} tries to shoot but he can't`);
        }
    }
    reload() {
        console.log(`${this.name} is reloading!`);
        //reload:sfx
        //reload:animation
        this.bullets = 6;
    }

    changeStance() {
        if (this.isBlocking) {
            this.isBlocking = false
            console.log(`${this.name} is holding his weapon!`);
            //change to weapon SFX
            //change to weapon animation

        }

        else {
            this.isBlocking = true
            console.log(`${this.name} is now blocking`);
            //change to block SFX
            //change to block animation
        }
    }
    getDamaged(enemy) {
        if (!this.isBlocking) {
            this.life -= enemy.gunDamage
            console.log(`${this.name} is damaged\nlife:${this.life}`);
        }

        if (this.isBlocking) {
            console.log(`${this.name} blocked the bullet!\nlife:${this.life}`);
        }
    }
    isEnemyDead(enemy) {
        if (enemy.life <= 0) {
            console.log(`${player.name} wins!`);
            return true
        }
        return false
    }
}


class Game {
    constructor() {
        this.isMenuVisible = false
        this.isPlayerOptionsVisible = false
        this.isSoundOptionsVisible = false
    }

    gameStart(p1, p2) {
        this.menuListeners()
        this.renderLifeBars(p1, p2)
        this.playerKeysListeners(p1, p2)
        this.playerKeysListeners(p2, p1)
    }
    renderLifeBars(p1, p2) {
        document.querySelector("#p1LifeBar .life").style.width = `${p1.life}%`
        document.querySelector("#p2LifeBar .life").style.width = `${p2.life}%`
    }

    playerKeysListeners(player, enemy) {
        document.querySelector("body").addEventListener(`keydown`, (e) => {
            switch (e.key) {
                case player.shootKey:
                    player.shoot(enemy)
                    this.renderLifeBars(p1, p2)
                    if (player.isEnemyDead(enemy)) {
                        setTimeout(() => {
                            //end game screen
                        }, 2000);
                    }

                    break;
                case player.changeStanceKey:
                    player.changeStance()
                    break;

                case player.reloadKey:
                    player.reload()
                    break;

                default:
                    break;
            }

        })
    }
    menuListeners() {
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "Escape":
                    if (!this.isMenuVisible) {
                        this.displayMenu()
                    }
                    else {
                        hideMenu()

                    }
                    break;

                default:
                    break;
            }
        })
    }
    displayMenu() { }
    hideMenu() { }
    playerOptions(player) { }
    soundOptions() { }
}

const p1 = new Guy("red")
const p2 = new Guy("blue", "z", "x", "c")

const game = new Game

game.gameStart(p1, p2)