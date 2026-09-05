var game = {}

function reset() {
    game = {
        Settings: {
            autosave: true,
            autosaveInterval: 30
        },
        Buildings: {
            loftPet: {
                cost: new Decimal(10),
                owned: new Decimal(0),
                power: new Decimal(1)
            }
        },
        loftClicks: new Decimal(0),
        loftClickspClick: new Decimal(1),
        woftClicks: new Decimal(0),
        woftClickspClick: new Decimal(1),
        woftPower: new Decimal(1)
    }
}

function resetButton() {
    if (confirm("Are you sure you want to reset your game? This cannot be undone.")) {
        reset()
        save()
        updateLarge()
        location.reload()
    }
}

function save() {
    localStorage.setItem("loftclickersave", JSON.stringify(game));
}

function load() {
    reset()
    let loadgame = JSON.parse(localStorage.getItem("loftclickersave"))
    if (loadgame != null) {loadGame(loadgame, game)}
}

function loadFromString() {
    let loadgame = atob(prompt("Please enter your save string:"))
    if (loadgame) {
        loadgame = JSON.parse(loadgame)
        if (loadgame != null) {loadGame(loadgame, game)}
    }
}

function exportToString() {
    let saveString = btoa(JSON.stringify(game))
    prompt("Here is your save string. Copy it and keep it safe!", saveString)
}

function loadGame(loadgame, gameObject = game) {
  let loadKeys = Object.keys(loadgame);
  
  for (let i = 0; i < loadKeys.length; i++) {
    let thisKey = loadKeys[i];
    
    if (loadgame[thisKey] === undefined || loadgame[thisKey] === "undefined") continue;

    // 1. Check for arrays explicitly first
    if (Array.isArray(loadgame[thisKey]) && gameObject[thisKey]) {
      for (let j = 0; j < loadgame[thisKey].length; j++) {
        if (typeof loadgame[thisKey][j] === "string" && !isNaN(loadgame[thisKey][j])) {
          gameObject[thisKey][j] = new Decimal(loadgame[thisKey][j]);
        } else {
          gameObject[thisKey][j] = loadgame[thisKey][j];
        }
      }
    } 
    // 2. FIXED: Drill into nested objects correctly by matching the nested child key reference
    else if (typeof loadgame[thisKey] === "object" && loadgame[thisKey] !== null && gameObject[thisKey]) {
      loadGame(loadgame[thisKey], gameObject[thisKey]);
    } 
    // 3. If it's a string value representation of a Decimal (or a number we want as a Decimal inside Buildings)
    else if ((typeof loadgame[thisKey] === "string" && !isNaN(loadgame[thisKey]) && thisKey !== "dragonName") || 
             (typeof loadgame[thisKey] === "number" && (thisKey === "cost" || thisKey === "owned" || thisKey === "power"))) {
      gameObject[thisKey] = new Decimal(loadgame[thisKey]);
    } 
    // 4. Otherwise, copy primitive values (booleans, standard numbers like intervals) directly
    else {
      gameObject[thisKey] = loadgame[thisKey];
    }
  }
}


load()

function updateCurrency() {
    // increase loft stuff
    production = game.Buildings.loftPet.power.mul(game.Buildings.loftPet.owned)

    productionMult = new Decimal(1)

    productionExp = new Decimal(1)

    game.loftClicks = game.loftClicks.add(production.div(2.0)).mul(productionMult).pow(productionExp)
}

function updateVisual() {
    // update loft stuff
    document.getElementById("loftClicks").textContent = game.loftClicks.toNumber().toLocaleString()
    document.getElementById("loftClickspClick").textContent = game.loftClickspClick.toNumber().toLocaleString()
    
    // loft pet stuff
    document.getElementById("loftPets").textContent = game.Buildings.loftPet.owned.toNumber().toLocaleString()
    document.getElementById("loftPetCost").textContent = game.Buildings.loftPet.cost.toNumber().toLocaleString()

    if (game.Buildings.loftPet.owned.gte(1)) {
        document.getElementById("loftPetsTracker").style.display = "inline"
        document.getElementById("loftPet").style.display = "inline"
    }
    if (game.loftClicks.gte(10) || game.Buildings.loftPet.owned.gte(1)) {
        document.getElementById("loftPet").style.opacity = "1"
        document.getElementById("loftPetsCostTracker").style.display = "inline"
    }
    if (game.Buildings.loftPet.owned.eq(1)) {
        document.getElementById("loftPetsPlural").style.display = "none"
    } else {
        document.getElementById("loftPetsPlural").style.display = "inline"
    }

    // update woft stuff
    document.getElementById("woftClicks").textContent = game.woftClicks.toNumber().toLocaleString()
    document.getElementById("woftClickspClick").textContent = game.woftClickspClick.toNumber().toLocaleString()
}

function updateLarge() {
    updateCurrency()
    updateVisual()
}

updateLarge()
setInterval(updateLarge, 500)

function autosave() {
    setTimeout(autosave, game.Settings.autosaveInterval * 1000)
    save()
}

autosave()

function buyBuilding(buildingId) {
    if (buildingId == 1) {
        if (game.loftClicks.gte(game.Buildings.loftPet.cost)) {
            game.loftClicks = game.loftClicks.sub(game.Buildings.loftPet.cost)
            game.Buildings.loftPet.owned = game.Buildings.loftPet.owned.add(1)
            game.Buildings.loftPet.cost = game.Buildings.loftPet.cost.mul(1.15).floor()
            updateLarge()
        }
    }
}
