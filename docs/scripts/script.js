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
            },
            woftPet: {
                cost: new Decimal(20),
                owned: new Decimal(0),
                power: new Decimal(0.05)
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

    // increase woft stuff

    production = game.Buildings.woftPet.power.mul(game.Buildings.woftPet.owned)

    productionMult = new Decimal(1)

    productionExp = new Decimal(1)

    game.woftPower = game.woftPower.add(production.div(2.0)).mul(productionMult).pow(productionExp)
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
    document.getElementById("woftPower").textContent = game.woftPower.toNumber().toLocaleString()
    document.getElementById("woftClickspClickButFr").textContent = woftCalc().toNumber().toLocaleString()
    document.getElementById("woftPets").textContent = game.Buildings.woftPet.owned.toNumber().toLocaleString()
    document.getElementById("woftPetCost").textContent = game.Buildings.woftPet.cost.toNumber().toLocaleString()

    if (game.woftClicks.gte(10) || game.Buildings.woftPet.owned.gte(1)) {
        document.getElementById("woftPetsCostTracker").style.display = "inline"
        document.getElementById("woftPet").style.visibility = "visible"
    }
    if (game.Buildings.woftPet.owned.gte(1)) {
        document.getElementById("woftPetsTracker").style.display = "inline"
        document.getElementById("woftPet").style.display = "inline"
        document.getElementById("woftPowerTracker").style.display = "inline"
    }
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
            game.Buildings.loftPet.cost = new Decimal(1.15).pow(game.Buildings.loftPet.owned).mul(10).floor()
            updateVisual()
        }
    }
    if (buildingId == 2) {
        if (game.woftClicks.gte(game.Buildings.woftPet.cost)) {
            game.woftClicks = game.woftClicks.sub(game.Buildings.woftPet.cost)
            game.Buildings.woftPet.owned = game.Buildings.woftPet.owned.add(1)
            game.Buildings.woftPet.cost = new Decimal(1.5).pow(game.Buildings.woftPet.owned).mul(10).floor()
            updateVisual()
        }
    }
}
