addLayer("a", {
    name: "ayd", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ayd", // Name of prestige currency
    baseResource: "BYD", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("a", 11)) {
            mult = mult.mul(2)
        }
        if (hasUpgrade("a", 13)) {
            mult = mult.mul(10)
        }
        if (hasUpgrade("c", 13)) {
            mult = mult.mul(1000)
        }
        mult = mult.mul(buyableEffect("a", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11: {
            title: "The start",
            description: "ayd gain ×2",
            cost: new Decimal(2)
        },
        12: {
            title: "doubler",
            description: "byd gain ×10",
            cost: new Decimal(10),
            unlocked() {
                return hasUpgrade('a', 11)
            }
        },
        13: {
            title: "Can you reach 100 ayd?",
            description: "ayd gain ×10",
            cost: new Decimal(100),
            unlocked() {
                return hasUpgrade('a', 12)
            }
        },
        14: {
            title: "The First Buyable",
            description: "Unlock the first buyable",
            cost: new Decimal(500),
            unlocked() {
                return hasUpgrade('a', 13)
            }
        },
        15: {
            title: "你可以获得11451.4个ayd吗？",
            description: "byd gain ×10",
            cost: new Decimal(11451.4),
            unlocked() {
                return hasUpgrade('a', 14)
            }
        },
        16: {
            title: "这超级折算也太离谱了",
            description: "弱化超级折算 2^ → 1.7^",
            cost: new Decimal(20000),
            unlocked() {
                return hasUpgrade('a', 15) && !inChallenge("c",12)
            }
        },
        17: {
            title: "这超级折算也太离谱了<sup>2</sup>",
            description: "超级折算推迟 10 → 12",
            cost: new Decimal(50000),
            unlocked() {
                return hasUpgrade('a', 16) && !inChallenge("c",12)
            }
        },
        /*
        11: {
            title: "我是傻逼",
            cost(){
                return this.effect().pow(3)
            },
            display() {
                return "基于购买次数增加ayd的乘数<br>价格: " +
                format(this.cost())+" ayd<br>效果：×"+format(this.effect())
            },
            effect() {
                return new Decimal(2).pow(gba(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasUpgrade('a', 14)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy(){
                setBuyableAmount(this.layer, this.id,
                    getBuyableAmount(this.layer,this.id).add((player.a.points.div(this.cost())).log(2).div(3))
                );
                 }
        }*/
    },
    buyables: {
        11: {
            cost(x) {
                let chaojizhesuanstart = new Decimal(10);
                if (hasUpgrade('a', 17)) {
                    chaojizhesuanstart = new Decimal(12);
                }
                if (inChallenge("c",12)){
                    chaojizhesuanstart = new Decimal(5);
                }
                if (x.lt(chaojizhesuanstart)) {
                    return new Decimal(100).mul(x)
                } else {
                    let chaojizhesuan = new Decimal(2)
                    if (hasUpgrade('a', 16)) {
                        chaojizhesuan = new Decimal(1.7)
                        if (hasChallenge('a',12)){
                            chaojizhesuan = new Decimal(1.5)

                        }
                    }
                    return new Decimal(100).mul(chaojizhesuanstart.sub(1)).add(
                        new Decimal(100).mul(
                            chaojizhesuan.pow(
                                x.sub(chaojizhesuanstart.sub(1))
                            )
                        )
                    )
                }
            },
            display() {
                let temp = ""
                if (gba(this.layer, this.id).gte(10)) {
                    temp = temp.concat("价格已被超级折算<br>")
                }
                temp = temp.concat("基于购买次数增加ayd的乘数<br>价格: " +
                    format(this.cost()) + " ayd<br>效果：×" + format(this.effect()))
                return temp
            },
            effect() {
                return gba(this.layer, this.id).add(1)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('a', 14)
            }
        },
        12: {
            cost(x) {
                return new Decimal(2).pow(x).mul(10)
            },
            display() {
                let temp = ""
                temp = temp.concat("基于购买次数增加byd的乘数<br>价格: " +
                    format(this.cost()) + " ayd<br>效果：×" + format(this.effect()))
                return temp
            },

            effect() {
                return gba(this.layer, this.id).mul(5).max(1)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('a', 14)
            }
        }
    },
    layerShown() { return true }
})
addLayer("c", {
    name: "cyd", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    branches() {
        return ["a"]
    },
    color: "#FFFFFF",
    requires: new Decimal(1e6), // Can be a function that takes requirement increases into account
    resource: "cyd", // Name of prestige currency
    baseResource: "ayd", // Name of resource prestige is based on
    baseAmount() { return player.a.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(2)
        return mult
    },
    layerShown() {
        return true;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "beyond",
            description: "byd gain based on your cyd",
            cost: new Decimal(1),
            effect() {
                return new Decimal(1.2).pow(player.c.points).min(1e10)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        12: {
            title: "æyond",
            description: "byd gain based on your ayd",
            cost: new Decimal(2),
            effect() {
                return player.a.points.div(100).max(1).min(1e8)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        13: {
            title: "1000 multiplier",
            description: "ayd gain ×1000",
            cost: new Decimal(100),
        },
        14: {
            title: "一个游戏有挑战很正常吧",
            description: "unlock challenge",
            cost: new Decimal(2e6)
        }
    },
    challenges: {
        11: {
            name: "√byd",
            challengeDescription: "byd获取量变为原来的0.5次方",
            goalDescription: "1e13 byd",
            unlocked(){
                return hasUpgrade("c",14)
            },
            canComplete(){
                return player.points.gte("1e13")
            },
            rewardDescription: "byd获取量^1.1",

        },
        12: {
            name: "超级折算",
            challengeDescription: "你不能购买ayd #16和#17升级，超级折算从5开始",
            goalDescription: "1e27 byd",
            unlocked(){
                return hasChallenge("c",11)
            },
            canComplete(){
                return player.points.gte("1e27")
            },
            rewardDescription: "超级折算弱化1.7^ → 1.5^ 如果购买了ayd #16升级",
        }
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)

})