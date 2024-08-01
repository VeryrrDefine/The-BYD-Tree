let modInfo = {
	name: "The BYD Tree",
	id: "thebydtree",
	author: "VeryrrDefine",
	pointsName: "BYD",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "https://discord.gg/GrMEPW7JZT",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "æyond",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Add BYD, Add ayd, Add cyd, Add cyd challenges<br>
	<h3>v0.0</h3><br>
		- Put my heart to develop my game, don't think that 傻逼 dygm.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints() {
	return true
}

// Calculate points/sec!
function getPointGen() {
	if (!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('a', 12)) {
		gain = gain.mul(10)
	}
	if (hasUpgrade('a', 15)) {
		gain = gain.mul(10)
	}
	gain = gain.mul(buyableEffect("a", 12))
	if (hasUpgrade('c', 11)) {
		gain = gain.mul(upgradeEffect("c", 11))
	}
	if (hasUpgrade('c', 12)) {
		gain = gain.mul(upgradeEffect("c", 12))
	}
	if (inChallenge("c", 11)){
		gain = gain.pow(0.5)
	}
	if (hasChallenge("c", 11)){
		gain = gain.pow(1.1)
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
	}
}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return (3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}
