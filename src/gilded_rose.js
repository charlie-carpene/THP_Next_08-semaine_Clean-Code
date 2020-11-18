const AGED_BRIE = "Aged Brie";
const BACKSTAGE_PASS = " Backstage passes to a ";
const SULFURAS = "Sulfuras";

const applyCommonRulesForItemUpdates = (item) => {
  if (item.quality > 0) {
    if (item.sellIn > 0) {
      item.quality--
      item.sellIn--;
    } else {
      item.quality = item.quality - 2;
      item.sellIn--;
    }
  } else {
    item.quality = 0;
    item.sellIn--;
  }
};

class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    if (quality > 50) {
      this.quality = 50;
    } else if (quality < 0) {
      this.quality = 0;
    } else {
      this.quality = quality;
    }
  }

  updateQuality() {
    applyCommonRulesForItemUpdates(this);
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateOldQuality() {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].name != AGED_BRIE && this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
            this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
          if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert' || this.items[i].name == 'Aged Brie') {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
          }
        }
      }
      if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != 'Aged Brie') {
          if (this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                this.items[i].quality = this.items[i].quality - 1;
              }
            }
          } else {
            this.items[i].quality = this.items[i].quality - this.items[i].quality;
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
      return this.items;
    }
  }

  updateQuality() {
    return this.items.map(item => {
      item.updateQuality()
      return item;
    });
  };

};

class BackStagePasseItem extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
    this.name = BACKSTAGE_PASS + name;
  };

  updateQuality() {
    if (this.sellIn <= 10 && this.sellIn > 5) {
      this.quality = this.quality + 2;
      this.sellIn--;
    } else if (this.sellIn <= 5 && this.sellIn > 0) {
      this.quality = this.quality + 3;
      this.sellIn--;
    } else if (this.sellIn <= 0) {
      this.quality = 0;
      this.sellIn--;
    } else {
      this.quality++;
      this.sellIn--;
    }
  };
};

class AgedBrieItem extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
    this.name = AGED_BRIE;
  };

  updateQuality() {
    if (this.quality < 50) {
      this.quality++;
      this.sellIn--;
    } else {
      this.quality = 50;
      this.sellIn--;
    }
  };
};

class SulfurasItem extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality);
    this.name = SULFURAS;
    this.quality = 80;
  };

  updateQuality() {
    this.sellIn--;
  };

};

module.exports = {
  Item,
  BackStagePasseItem,
  AgedBrieItem,
  SulfurasItem,
  Shop
}
