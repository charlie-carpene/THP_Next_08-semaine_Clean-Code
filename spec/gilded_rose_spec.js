var { Shop, BackStagePasseItem, AgedBrieItem, SulfurasItem, Item } = require('../src/gilded_rose.js');

describe("GildedRose shop manager", function () {
  var listItems;

  beforeEach(function () {
    listItems = [];
  });


  it("Baisser de 1 la qualité et sellIn d'item normaux", function () {
    listItems.push(new Item("+5 Dexterity Vest", 10, 20));
    listItems.push(new Item("Mana Cake", 3, 6));
    listItems.push(new Item("Juicy Juice", 0, 3));
    listItems.push(new Item("Cereal bar", 15, 0));
    listItems.push(new SulfurasItem("Sulfuras", 15, 80));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 },
      { sellIn: -1, quality: 1 },
      { sellIn: 14, quality: 0 },
      { sellIn: 14, quality: 80 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality, 'La qualité du produit ' + items[idx].name + ' devrait être ' + testCase.quality + ' et non ' + items[idx].quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn, 'La DDC du produit ' + items[idx].name + ' devrait être ' + testCase.sellIn + ' et non ' + items[idx].sellIn);
    });
  });

  it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", function () {
    listItems.push(new AgedBrieItem("Aged Brie", 20, 30));
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 20, 30));
    listItems.push(new AgedBrieItem("Aged Brie", 20, 50));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 50 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality, `le produit ${items[idx].name} doit avoir une qualité de ${testCase.quality} maintenant`);
      expect(items[idx].sellIn).toBe(testCase.sellIn, `le produit ${items[idx].name} doit avoir une DDC de ${testCase.sellIn} maintenant`);
    });
  });

  it("Vérifier que l'article à bien une qualité comprise entre min 0 et max 50", function () {
    listItems.push(new AgedBrieItem("Aged Brie", 20, 60));
    listItems.push(new Item("Cereal bar", 20, 51));
    listItems.push(new SulfurasItem("Sulfuras", 20, 80));
    listItems.push(new AgedBrieItem("Aged Brie", 20, 0));
    listItems.push(new Item("Cereal bar", 20, -6));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 50 },
      { sellIn: 19, quality: 49 },
      { sellIn: 19, quality: 80 },
      { sellIn: 19, quality: 1 },
      { sellIn: 19, quality: 0 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality, `le produit ${items[idx].name} ne peut pas avoir une qualité au delà de ${testCase.quality}`);
      expect(items[idx].sellIn).toBe(testCase.sellIn, `le produit ${items[idx].name} doit avoir une DDC de ${testCase.sellIn} jours maintenant`);
    });
  });

  it("Diminuer la qualité de 2 pour un Backstage pass quand il reste 10 jours ou moins", function() {
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 10, 40));
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 9, 40));
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 6, 40));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 9, quality: 42 },
      { sellIn: 8, quality: 42 },
      { sellIn: 5, quality: 42 },
    ];

    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Diminuer la qualité de 3 pour un Backstage pass quand il reste 5 jours ou moins", function() {
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 5, 15));
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 4, 15));
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 1, 15));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 4, quality: 18 },
      { sellIn: 3, quality: 18 },
      { sellIn: 0, quality: 18 },
    ];

    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Mettre à zéro un pass après la date du concert passer", function() {
    listItems.push(new BackStagePasseItem("TAFKAL80ETC concert", 0, 15));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    expect(items[0].quality).toBe(0);
    expect(items[0].sellIn).toBe(-1);
  })
});
