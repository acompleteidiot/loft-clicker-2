function woftClick() {
    game.hotdog = game.hotdog.add(woftCalc())
    updateVisual()
}

function woftCalc() {
    // im just using slang
    multiplier = new Decimal(1)
    multiplier = multiplier.mul(game.woftPower)

    return game.hotdogpClick.mul(multiplier)
}