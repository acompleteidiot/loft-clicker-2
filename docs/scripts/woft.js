function woftClick() {
    game.woftClicks = game.woftClicks.add(woftCalc())
    updateVisual()
}

function woftCalc() {
    // im just using slang
    multiplier = new Decimal(1)
    multiplier = multiplier.mul(game.woftPower)

    return game.woftClickspClick.mul(multiplier)
}