function woftClick() {
    multiplier = new Decimal(1)
    multiplier = multiplier.mul(game.woftPower)

    game.woftClicks = game.woftClicks.add(game.woftClickspClick.mul(multiplier))
}