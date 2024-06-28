class Guy {
    constructor(name, playerID, shootKey = "a", reloadKey = "s", changeStanceKey = "d") {
        this.name = name
        this.playerID = playerID
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
        this.sfx = {
            fire: "../assets/sfx/revolver-fire.wav",
            reload: "../assets/sfx/revolver-reload.mp3",
            block: "../assets/sfx/hit-with-frying-pan.mp3"
        }
    }
    shoot(enemy) {
        if (!this.isBlocking) {
            if (!this.bullets <= 0) {
                this.bullets -= 1;
                this.playSfx(`${this.playerID}Audio`, this.sfx.fire)
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
        this.playSfx(`${this.playerID}Audio`, this.sfx.reload)
        //reload:animation
        this.bullets = 6;
    }

    changeStance() {
        if (this.isBlocking) {
            this.isBlocking = false
            console.log(`${this.name} is holding his weapon!`);
            this.playSfx(`${this.playerID}Audio`, this.sfx.reload)
            //change to weapon animation

        }

        else {
            this.isBlocking = true
            console.log(`${this.name} is now blocking`);
            this.playSfx(`${this.playerID}Audio`, this.sfx.block)
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
            this.playSfx(`${this.playerID}Audio`, this.sfx.block)

        }
    }
    isEnemyDead(enemy) {
        if (enemy.life <= 0) {
            console.log(`${player.name} wins!`);
            return true
        }
        return false
    }
    playSfx(audioLabelID, sfxPath) {
        document.getElementById(`${audioLabelID}`).setAttribute("src", `${sfxPath}`)
        document.getElementById(`${audioLabelID}`).play()
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
    renderStance(player) {
        if (!player.isBlocking) {
            this.renderWeapon(player)
        } else {
            this.rendershield(player)
        }
    }
    renderWeapon(player) {
        document.getElementById(`${player.playerID}Gun`).setAttribute("src", "../assets/guns/revolver-svgrepo-com.svg")

    }
    rendershield(player) {
        document.getElementById(`${player.playerID}Gun`).setAttribute("src", "../assets/shields/frying-pan-and-fried-egg-svgrepo-com.svg")
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
                    this.renderStance(player)
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

const p1 = new Guy("red", "p1")
const p2 = new Guy("blue", "p2", "z", "x", "c")

const game = new Game

game.gameStart(p1, p2)