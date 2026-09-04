function loftClick() {
    game.loftClicks = game.loftClicks.add(game.loftClickspClick)
    document.getElementById("loftClicks").textContent = game.loftClicks.toNumber().toLocaleString()
}