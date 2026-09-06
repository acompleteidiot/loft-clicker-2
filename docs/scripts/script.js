var game = {};

const themeSelect = document.getElementById("settingsTabThemeSelect");

const mobile = window.navigator.maxTouchPoints > 0;
console.log(mobile);

const iconKeyMapHeaderStyle = {
  loft: "./img/loftIcon.png?raw=true",
  woft: "./img/woftButton.png?raw=true",
  announcer: "./img/announcerIcon.png?raw=true",
  soft: "./img/softIcon.png?raw=true",
  bird: "./img/birdIcon.png?raw=true",
};
const titleKeyMapHeaderStyle = {
  loft: "Loft Clicker 2",
  woft: "Woft Clicker 2",
  announcer: "Announcersoft Clicker 2",
  soft: "Soft Clicker 2",
  bird: "Say's Phoebe Clicker 2",
};

function reset() {
  game = {
    Settings: {
      autosave: true,
      autosaveInterval: new Decimal(30),
      updateInterval: new Decimal(0.5),
    },
    Buildings: {
      loftPet: {
        descName: "loft pet",
        cost: new Decimal(10),
        owned: new Decimal(0),
        power: new Decimal(1),
      },
      woftPet: {
        descName: "woft pet",
        cost: new Decimal(20),
        owned: new Decimal(0),
        power: new Decimal(0.05),
      },
      loftChef: {
        descName: "loft chef",
        cost: new Decimal(100),
        owned: new Decimal(0),
        power: new Decimal(5),
      },
    },
    Visual: {
      loftBuildingHover: new Decimal(0),
      woftBuildingHover: new Decimal(0),
      currentTabTheme: "loft",
      unlockedTabThemes: ["loft"],
    },
    burger: new Decimal(0),
    burgerpClick: new Decimal(1),
    hotdog: new Decimal(0),
    hotdogpClick: new Decimal(1),
    woftPower: new Decimal(1),
    woftUnlock: false,
    unlockedBuildings: ["loftPet"],
  };
}

function resetButton() {
  if (
    confirm("Are you sure you want to reset your game? This cannot be undone.")
  ) {
    oldSettings = game.Settings;
    reset();
    game.Settings = oldSettings;
    save();
    updateLarge();
    location.reload();
  }
}

function save() {
  localStorage.setItem("loftclickersave", JSON.stringify(game));
}

function load() {
  reset();
  let loadgame = JSON.parse(localStorage.getItem("loftclickersave"));
  if (loadgame != null) {
    loadGame(loadgame, game);
  }
  changeFavicon(iconKeyMapHeaderStyle[game.Visual.currentTabTheme]);
  document.title = titleKeyMapHeaderStyle[game.Visual.currentTabTheme];
  themeSelect.value = game.Visual.currentTabTheme;
  document.getElementById("updateIntervalInput").value =
    game.Settings.updateInterval;
  document.getElementById("autosaveIntervalInput").value =
    game.Settings.autosaveInterval;
}

function loadFromString() {
  let loadgame = atob(prompt("Please enter your save string:"));
  if (loadgame) {
    loadgame = JSON.parse(loadgame);
    if (loadgame != null) {
      loadGame(loadgame, game);
    }
  }
  save();
  location.reload();
}

function exportToString() {
  let saveString = btoa(JSON.stringify(game));
  prompt("Here is your save string. Copy it and keep it safe!", saveString);
}

function loadGame(loadgame, gameObject = game) {
  let loadKeys = Object.keys(loadgame);

  for (let i = 0; i < loadKeys.length; i++) {
    let thisKey = loadKeys[i];

    if (loadgame[thisKey] === undefined || loadgame[thisKey] === "undefined")
      continue;

    // 1. Check for arrays explicitly first
    if (Array.isArray(loadgame[thisKey]) && gameObject[thisKey]) {
      for (let j = 0; j < loadgame[thisKey].length; j++) {
        if (
          typeof loadgame[thisKey][j] === "string" &&
          !isNaN(loadgame[thisKey][j])
        ) {
          gameObject[thisKey][j] = new Decimal(loadgame[thisKey][j]);
        } else {
          gameObject[thisKey][j] = loadgame[thisKey][j];
        }
      }
    }
    // 2. FIXED: Drill into nested objects correctly by matching the nested child key reference
    else if (
      typeof loadgame[thisKey] === "object" &&
      loadgame[thisKey] !== null &&
      gameObject[thisKey]
    ) {
      loadGame(loadgame[thisKey], gameObject[thisKey]);
    }
    // 3. If it's a string value representation of a Decimal (or a number we want as a Decimal inside Buildings)
    else if (
      (typeof loadgame[thisKey] === "string" &&
        !isNaN(loadgame[thisKey]) &&
        thisKey !== "dragonName") ||
      (typeof loadgame[thisKey] === "number" &&
        (thisKey === "cost" || thisKey === "owned" || thisKey === "power"))
    ) {
      gameObject[thisKey] = new Decimal(loadgame[thisKey]);
    }
    // 4. Otherwise, copy primitive values (booleans, standard numbers like intervals) directly
    else {
      gameObject[thisKey] = loadgame[thisKey];
    }
  }
}

load();

function burgerCalc() {
  production = buildingCalc(1).add(buildingCalc(3));

  productionMult = new Decimal(1);

  productionExp = new Decimal(1);

  return production.mul(productionMult).pow(productionExp);
}

function buildingCalc(buildingId) {
  if (buildingId == 1) {
    return game.Buildings.loftPet.owned.mul(game.Buildings.loftPet.power);
  } else if (buildingId == 2) {
  } else if (buildingId == 3) {
    return game.Buildings.loftChef.owned.mul(game.Buildings.loftChef.power);
  }
}

function woftPowerCalc() {
  production = game.Buildings.woftPet.power.mul(game.Buildings.woftPet.owned);

  productionMult = new Decimal(1);

  productionExp = new Decimal(1);

  return production.mul(productionMult).pow(productionExp);
}

function updateCurrency() {
  timescale = 1 / game.Settings.updateInterval;

  // increase loft stuff

  game.burger = game.burger.add(burgerCalc().div(timescale));

  // increase woft stuff

  game.woftPower = game.woftPower.add(woftPowerCalc().div(timescale));
}

const styleOptions = document
  .getElementById("settingsTabThemeSelect")
  .getElementsByTagName("option");

function updateVisual() {
  // update loft stuff
  document.getElementById("burger").textContent = game.burger
    .toNumber()
    .toLocaleString();
  document.getElementById("burgerpClick").textContent = game.burgerpClick
    .toNumber()
    .toLocaleString();
  if (game.Visual.loftBuildingHover != 0) {
    const buildingHoverDesc = Array.from(
      document
        .getElementById("loftBuildingDescription")
        .getElementsByTagName("span"),
    );

    if (game.Visual.loftBuildingHover == 1) {
      let buildingInfo = game.Buildings.loftPet;
      buildingHoverDesc[0].textContent = buildingInfo.descName;
      buildingHoverDesc[1].textContent = buildingInfo.cost
        .toNumber()
        .toLocaleString();
      buildingHoverDesc[2].textContent = buildingCalc(1)
        .toNumber()
        .toLocaleString();
      if (buildingCalc(1) != 1) {
        buildingHoverDesc[3].style.display = "inline";
      } else {
        buildingHoverDesc[3].style.display = "none";
      }
      buildingHoverDesc[4].textContent = buildingInfo.owned
        .toNumber()
        .toLocaleString();
    } else if (game.Visual.loftBuildingHover == 3) {
      let buildingInfo = game.Buildings.loftChef;
      buildingHoverDesc[0].textContent = buildingInfo.descName;
      buildingHoverDesc[1].textContent = buildingInfo.cost
        .toNumber()
        .toLocaleString();
      buildingHoverDesc[2].textContent = buildingCalc(3)
        .toNumber()
        .toLocaleString();
      if (buildingCalc(3) != 1) {
        buildingHoverDesc[3].style.display = "inline";
      } else {
        buildingHoverDesc[3].style.display = "none";
      }
      buildingHoverDesc[4].textContent = buildingInfo.owned
        .toNumber()
        .toLocaleString();
    }
  }

  if (burgerCalc().gt(0)) {
    document.getElementById("burgerPerSecond").style.display = "inline";
    document.getElementById("burgerPerSecNum").textContent = burgerCalc()
      .toNumber()
      .toLocaleString();
  }
  if (game.burger != 1) {
    document.getElementById("burgerCountPlural").style.display = "inline";
  } else {
    document.getElementById("burgerCountPlural").style.display = "none";
  }
  if (game.burgerpClick != 1) {
    document.getElementById("burgerPerClickPlural").style.display = "inline";
  } else {
    document.getElementById("burgerPerClickPlural").style.display = "none";
  }
  if (burgerCalc() != 1) {
    document.getElementById("burgerPerSecPlural").style.display = "inline";
  } else {
    document.getElementById("burgerPerSecPlural").style.display = "none";
  }

  if (game.Buildings.loftPet.owned.gte(10) && !game.unlockedBuildings.includes("loftChef")) {
    game.unlockedBuildings.push("loftChef")
  }

  const loftBuildings = document.getElementById("loftBuildings").getElementsByTagName("button")
  for (let option = 0; option < loftBuildings.length; option++) {
    if (game.unlockedBuildings.includes(loftBuildings[option].id)) {
      loftBuildings[option].style.display = "block";
    } else {
      loftBuildings[option].style.display = "none";
    }
  }

  // update woft stuff

  if (game.burger.gte(100000)) {
    if (!game.woftUnlock) {
      game.woftUnlock = true;
      document.getElementById("woftContainer").style.opacity = "1";
    }

    document.getElementById("hotdog").textContent = game.hotdog
      .toNumber()
      .toLocaleString();
    document.getElementById("hotdogpClick").textContent = game.hotdogpClick
      .toNumber()
      .toLocaleString();

    if (game.hotdog.gte(10) || game.Buildings.woftPet.owned.gte(1)) {
      document.getElementById("woftPetCost").textContent =
        game.Buildings.woftPet.cost.toNumber().toLocaleString();
      document.getElementById("woftPetsCostTracker").style.display = "inline";
      document.getElementById("woftPet").style.visibility = "visible";
    }
    if (game.Buildings.woftPet.owned.gte(1)) {
      document.getElementById("woftPetsTracker").style.display = "inline";
      document.getElementById("woftPet").style.display = "inline";
      document.getElementById("woftPowerTracker").style.display = "inline";
      document.getElementById("hotdogpClickActual").style.display = "inline";
      document.getElementById("hotdogpClickActualNum").textContent = woftCalc()
        .toNumber()
        .toLocaleString();
      document.getElementById("woftPets").textContent =
        game.Buildings.woftPet.owned.toNumber().toLocaleString();
      document.getElementById("woftPower").textContent = game.woftPower
        .toNumber()
        .toLocaleString();
    }
  }

  // settings
  if (document.getElementById("settingsContainer").style.display === "block") {
    document.getElementById("currentAutosaveInterval").textContent = Number(
      game.Settings.autosaveInterval,
    ).toLocaleString();
    document.getElementById("currentUpdateInterval").textContent = Number(
      game.Settings.updateInterval,
    ).toLocaleString();
  }
  if (
    game.burger.gte(1000) &&
    !game.Visual.unlockedTabThemes.includes("soft")
  ) {
    game.Visual.unlockedTabThemes.push("soft");
  }
  if (
    game.burger.gte(10000) &&
    !game.Visual.unlockedTabThemes.includes("announcer")
  ) {
    game.Visual.unlockedTabThemes.push("announcer");
  }
  if (game.woftUnlock && !game.Visual.unlockedTabThemes.includes("woft")) {
    game.Visual.unlockedTabThemes.push("woft");
  }
  if (
    game.Buildings.loftPet.owned.gte(20) &&
    !game.Visual.unlockedTabThemes.includes("bird")
  ) {
    game.Visual.unlockedTabThemes.push("bird");
  }
  for (let option = 0; option < styleOptions.length; option++) {
    if (game.Visual.unlockedTabThemes.includes(styleOptions[option].value)) {
      styleOptions[option].style.display = "block";
    } else {
      styleOptions[option].style.display = "none";
    }
  }
}

function updateLarge() {
  updateCurrency();
  updateVisual();
}

updateLarge();
setInterval(updateLarge, game.Settings.updateInterval * 1000);

function autosave() {
  setTimeout(autosave, game.Settings.autosaveInterval * 1000);
  save();
}

autosave();

function buyBuilding(type, buildingId) {
  if (mobile) {
    if (
      game.Visual.loftBuildingHover == buildingId ||
      game.Visual.woftBuildingHover == buildingId
    ) {
    } else {
      if (type == 1) {
        game.Visual.loftBuildingHover = buildingId;
      } else if (type == 2) {
        game.Visual.woftBuildingHover = buildingId;
      }
      updateVisual();
      return;
    }
  }

  if (buildingId == 1) {
    if (game.burger.gte(game.Buildings.loftPet.cost)) {
      game.burger = game.burger.sub(game.Buildings.loftPet.cost);
      game.Buildings.loftPet.owned = game.Buildings.loftPet.owned.add(1);
      game.Buildings.loftPet.cost = new Decimal(1.15)
        .pow(game.Buildings.loftPet.owned)
        .mul(10)
        .floor();
    }
  }
  if (buildingId == 2) {
    if (game.hotdog.gte(game.Buildings.woftPet.cost)) {
      game.hotdog = game.hotdog.sub(game.Buildings.woftPet.cost);
      game.Buildings.woftPet.owned = game.Buildings.woftPet.owned.add(1);
      game.Buildings.woftPet.cost = new Decimal(1.5)
        .pow(game.Buildings.woftPet.owned)
        .mul(10)
        .floor();
    }
  }
  if (buildingId == 3) {
    if (game.burger.gte(game.Buildings.loftChef.cost)) {
      game.burger = game.burger.sub(game.Buildings.loftChef.cost);
      game.Buildings.loftChef.owned = game.Buildings.loftChef.owned.add(1);
      game.Buildings.loftChef.cost = new Decimal(1.15)
        .pow(game.Buildings.loftChef.owned)
        .mul(100)
        .floor();
    }
  }
  updateVisual();
}

function hoverBuilding(type, buildingId) {
  if (!mobile) {
    if (type == 1) {
      game.Visual.loftBuildingHover = buildingId;
    } else if (type == 2) {
      game.Visual.woftBuildingHover = buildingId;
    }
  }
}

function settings() {
  if (document.getElementById("settingsContainer").style.display === "block") {
    document.getElementById("settingsContainer").style.display = "none";
    document.getElementById("settingsBg").style.display = "none";
  } else {
    document.getElementById("settingsContainer").style.display = "block";
    document.getElementById("settingsBg").style.display = "block";
  }
  updateVisual();
}

function applySettings() {
  newAutosaveInt = document
    .getElementById("autosaveIntervalInput")
    .value.trim();
  if (Number(newAutosaveInt)) {
    game.Settings.autosaveInterval = Number(newAutosaveInt);
  }
  newUpdateInt = document.getElementById("updateIntervalInput").value.trim();
  if (
    Number(newUpdateInt) &&
    game.Settings.updateInterval != Number(newUpdateInt)
  ) {
    game.Settings.updateInterval = Number(newUpdateInt);
    save();
    location.reload();
  }
  updateVisual();
}

function changeFavicon(src) {
  // Look for existing favicon links
  let link = document.querySelector("link[rel~='icon']");

  // If no favicon link exists, create one
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  // Update the image source path
  link.href = src;
}

themeSelect.addEventListener("change", (event) => {
  let selectedValue = themeSelect.value;
  console.log("Selected theme:", selectedValue);
  changeFavicon(iconKeyMapHeaderStyle[selectedValue]);
  document.title = titleKeyMapHeaderStyle[selectedValue];
  game.Visual.currentTabTheme = selectedValue;
});
