var game = {}

function reset() {
    game = {
        Settings: {
            autosave: true,
            autosaveInterval: 30
        },
        loftClicks: new Decimal(0),
        loftClickspClick: new Decimal(1)
    }
}

function save() {
    localStorage.setItem("loftclickersave", JSON.stringify(game));
}

function load() {
	reset()
	let loadgame = JSON.parse(localStorage.getItem("loftclickersave"))
  //loadgame.kkkgl();
	if (loadgame != null) {loadGame(loadgame)}
}

function loadGame(loadgame) {
  //Sets each variable in 'game' to the equivalent variable in 'loadgame' (the saved file)
  let loadKeys = Object.keys(loadgame);
  for (i=0; i<loadKeys.length; i++) {
    if (loadgame[loadKeys[i]] != "undefined") {
      let thisKey = loadKeys[i];
      if (typeof loadgame[thisKey] == "string" && thisKey != "dragonName") {game[thisKey] = new Decimal(loadgame[thisKey])}
      else if (Array.isArray(loadgame[thisKey]) && game[loadKeys[i]]) { // If the value is an array and the corresponding key exists in the game object
        for (j = 0; j < loadgame[thisKey].length; j++) { // Iterate through the array elements
          //if (typeof loadgame[thisKey][j] == "string" && !isNaN(parseFloat(loadgame[thisKey][j]))) { // If the array element is a string that can be converted to a Decimal, do so
					if (typeof loadgame[thisKey][j] == "string") {
            game[loadKeys[i]][j] = new Decimal(loadgame[thisKey][j])
          }
          else { // Otherwise, copy the value directly
            game[loadKeys[i]][j] = loadgame[thisKey][j]
          }
        }
      }
      //else {game[Object.keys(game)[i]] = loadgame[loadKeys[i]]}
      else {game[loadKeys[i]] = loadgame[loadKeys[i]]}
    }
  }
}

load()

function autosave() {
    setTimeout(autosave, game.Settings.autosaveInterval * 1000)
    save()
}

autosave()