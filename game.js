"use strict";

/*jshint browser: true*/
/*jshint devel: true*/

let errored = false;

window.onerror = function(msg, source, lineno, colno, error) {
  if (!errored) {
    errored = true;

    alert("An error occurred! Please press F12 to open the dev tools, then click the 'Console' tab and send any errors shown there to chemicalcrux\n\nScreenshotting the text and line number of the error would be great.\n\nAlso include the browser information that gets logged below it.\n\nThe error might also show up here: " + msg + " at " + lineno + "," + colno);

    console.log(navigator.userAgent);
  }
};

let started = false;

let strolling = false;

let unit = "metric";

let numbers = "full";

let verbose = true;

let biome = "city";

let newline = "&nbsp;";

let victims = {};

let macro =
{
  "scaling": function(value, scale, factor) { return value * Math.pow(scale,factor); },
  "name": "",
  "species": "crux",
  "color" : "blue",
  "baseHeight": 2.26,
  get height() { return this.scaling(this.baseHeight, this.scale, 1); },
  "baseMass": 135,
  get mass () { return this.scaling(this.baseMass, this.scale, 3); },
  "pawScale": 1,
  "basePawArea": 0.1,
  get pawArea() { return this.scaling(this.basePawArea * this.pawScale * this.pawScale, this.scale, 2); },
  "baseAnalVoreDiameter": 0.1,
  get analVoreArea() { return this.scaling(Math.pow(this.baseAnalVoreDiameter * this.assScale, 2), this.scale, 2); },
  "baseAssArea": 0.25,
  get assArea() { return this.scaling(this.baseAssArea * this.assScale, this.scale, 2); },
  "baseHandArea": 0.1,
  get handArea() { return this.scaling(this.baseHandArea, this.scale, 2); },

  "sameSizeVore": true,
  "sameSizeStomp": true,

  "assScale": 1,
  "analVore": true,

  // part types

  "footType": "paw",
  "footSockEnabled": false,
  "footShoeEnabled": false,
  "footSock": "none",
  "footShoe": "none",
  "footSockWorn": false,
  "footShoeWorn": false,

  "footOnlyDesc": function(plural=false,capital=false) {
    let result = "";

    switch(this.footType) {
      case "paw":
        result = plural ? "paws" : "paw";
        break;
      case "hoof":
        result = plural ? "hooves" : "hoof";
        break;
      case "foot":
      case "avian":
        result = plural ? "feet" : "foot";
        break;
      }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "footDesc": function(plural=false,capital=false,possessive=false) {
    let result = "";
    if (!this.footWear) {
      return this.footOnlyDesc(plural,capital);
    }
    if (!this.footSockWorn && !this.footShoeWorn) {
      return this.footOnlyDesc(plural,capital);
    } else if (this.footShoeWorn) {
      switch(this.footShoe) {
        case "shoe":
          result = plural ? "shoes" : "shoe";
          break;
        case "boot":
          result = plural ? "boots" : "boot";
          break;
        case "trainer":
          result = plural ? "trainers" : "trainer";
          break;
        case "sandal":
          result = plural ? "sandals" : "sandal";
          break;
      }
    } else if (this.footSockWorn) {
      switch(this.footSock) {
        case "sock":
          result = "socked " + this.footOnlyDesc(plural,false);
      }
    }

    if(possessive) {
      result = " your " + result;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "toeNoShoeDesc": function(plural=false,capital=false) {
    let result = "";

    if (!this.footSockWorn) {
      return this.toeOnlyDesc(plural,capital);
    } else if (this.footSockWorn) {
      switch(this.footSock) {
        case "sock":
          result = "socked " + this.toeOnlyDesc(plural,false);
      }
    }

    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "toeOnlyDesc": function(plural=false,capital=false) {
    let result = "";

    switch(this.footType) {
      case "paw":
        result = plural ? "toes" : "toe";
        break;
      case "hoof":
        result = plural ? "hooves" : "hoof";
        break;
      case "foot":
        result = plural ? "toes" : "toe";
        break;
      case "avian":
        result = plural ? "talons" : "talon";
        break;
      }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "toeDesc": function(plural=false,capital=false,possessive=false) {
    let result = "";
    if (!this.footWear) {
      return this.toeOnlyDesc(plural,capital);
    }
    if (!this.footSockWorn && !this.footShoeWorn) {
      return this.toeOnlyDesc(plural,capital);
    } else if (this.footShoeWorn) {
      switch(this.footShoe) {
        case "shoe":
          result = plural ? "treads" : "tread";
          break;
        case "boot":
          result = plural ? "treads" : "tread";
          break;
        case "trainer":
          result = plural ? "treads" : "tread";
          break;
        case "sandal":
          result = plural ? "treads" : "tread";
          break;
      }
    } else if (this.footSockWorn) {
      switch(this.footSock) {
        case "sock":
          result = "socked " + this.toeOnlyDesc(plural,false);
      }
    }

    if(possessive) {
      result = "your " + result;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "shoeDesc": function(plural,capital) {
    let result = "";
    switch(this.footShoe) {
      case "shoe":
        result = plural ? "shoes" : "shoe";
        break;
      case "boot":
        result = plural ? "boots" : "boot";
        break;
      case "trainer":
        result = plural ? "trainers" : "trainer";
        break;
      case "sandal":
        result = plural ? "sandals" : "sandal";
        break;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "sockDesc": function(plural,capital) {
    let result = "";
    switch(this.footSock) {
      case "sock":
        result = plural ? "socks" : "sock";
        break;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "jawType": "jaw",

  "jawDesc": function(plural=false,capital=false) {
    let result = "";
    switch(this.jawType) {
      case "jaw":
        result = plural ? "jaws" : "jaw";
        break;
      case "beak":
        result = "beak";
        break;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "biteDesc": function(plural=false,capital=false) {
    let result = "";
    switch(this.jawType) {
      case "jaw":
        result = plural ? "crushes" : "crush";
        break;
      case "beak":
        result = plural ? "slices" : "slice";
        break;
    }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "hasTail": true,
  "tailType": "slinky",
  "tailCount": 1,
  "baseTailLength": 1,
  "baseTailDiameter": 0.1,
  "tailDensity": 250,
  "tailStretchiness": 2,
  "tailScale": 1,
  "tailMaw": false,

  get tailLength() {
    return this.scaling(this.baseTailLength * this.tailScale, this.scale, 1);
  },
  get tailDiameter() {
    return this.scaling(this.baseTailDiameter * this.tailScale, this.scale, 1);
  },
  get tailStretchDiameter() {
    return this.scaling(this.tailStretchiness * this.baseTailDiameter * this.tailScale, this.scale, 1);
  },
  get tailGirth() {
    return Math.pow(this.tailDiameter/2,2) * Math.PI;
  },
  get tailStretchGirth() {
    return Math.pow(this.tailStretchDiameter/2,2) * Math.PI;
  },
  get tailArea() {
    return this.tailLength * this.tailDiameter;
  },
  get tailVolume() {
    return this.tailGirth * this.tailLength;
  },
  get tailMass() {
    return this.tailVolume * this.tailDensity;
  },
  get tailDesc() {
    return this.tailType + " " + (this.tailCount > 1 ? "tails" : "tail");
  },
  "dickType": "canine",
  "baseDickLength": 0.3,
  "baseDickDiameter": 0.08,
  "dickDensity": 1000,
  "dickStretchiness": 2,
  "dickScale": 1,
  get dickLength() {
    let factor = 1;
    if (!this.arousalEnabled || this.arousal < 25) {
      factor = 0.5;
    } else if (this.arousal < 75) {
      factor = 0.5 + (this.arousal - 25) / 100;
    }

    return this.scaling(this.baseDickLength * this.dickScale * factor, this.scale, 1);
  },
  get dickDiameter() {
    let factor = 1;
    if (!this.arousalEnabled || this.arousal < 25) {
      factor = 0.5;
    } else if (this.arousal < 75) {
      factor = 0.5 + (this.arousal - 25) / 100;
    }

    return this.scaling(this.baseDickDiameter * this.dickScale * factor, this.scale, 1);
  },
  get dickGirth() {
    return Math.pow((this.dickDiameter/ 2),2) * Math.PI;
  },
  get dickStretchGirth() {
    return this.dickGirth * this.dickStretchiness * this.dickStretchiness;
  },
  get dickArea() {
    return this.dickLength * this.dickDiameter* Math.PI / 2;
  },
  get dickVolume() {
    return this.dickLength * Math.pow(this.dickDiameter/2,2) * Math.PI;
  },
  get dickMass() {
    return this.dickVolume * this.dickDensity;
  },
  "baseBallDiameter": 0.05,
  "ballDensity": 1000,
  "ballScale": 1,
  get ballDiameter() { return this.scaling(this.baseBallDiameter * this.ballScale, this.scale, 1); },
  get ballArea() { return 2 * Math.PI * Math.pow(this.ballDiameter/2, 2); },
  get ballVolume() {
    let radius = this.ballDiameter / 2;
    return 4/3 * Math.PI * Math.pow(radius,3);
  },
  get ballMass() {
    let volume = this.ballVolume;
    return volume * this.ballDensity;
  },

  "baseCumRatio": 1,
  "cumScale": 1,
  get cumVolume() {
    return this.dickGirth * this.baseCumRatio * (1 + this.edge) + Math.max(0,this.cumStorage.amount - this.cumStorage.limit);
  },

  "baseVaginaLength": 0.1,
  "baseVaginaWidth": 0.05,
  "vaginaStretchiness": 2,
  "vaginaScale": 1,

  get vaginaLength() { return this.scaling(this.baseVaginaLength * this.vaginaScale, this.scale, 1); },
  get vaginaWidth() { return this.scaling(this.baseVaginaWidth * this.vaginaScale, this.scale, 1); },
  get vaginaArea() { return this.vaginaLength * this.vaginaWidth; },
  get vaginaStretchArea() { return this.vaginaStretchiness * this.vaginaStretchiness * this.vaginaLength * this.vaginaWidth; },
  get vaginaVolume() { return this.vaginaArea * this.vaginaWidth; },
  "baseFemcumRatio": 1,
  "femcumScale": 1,
  get femcumVolume() {
    return this.vaginaArea * this.baseFemcumRatio * (1 + this.edge) + Math.max(0,this.femcumStorage.amount - this.femcumStorage.limit);
  },

  hasBreasts: true,
  lactationEnabled: true,
  lactationScale: 1,
  lactationFactor: 0.25,

  get lactationVolume() {
    return this.milkStorage.limit * this.lactationFactor;
  },

  "baseBreastDiameter": 0.1,
  "breastScale": 1,
  "breastStretchiness": 2,
  "breastDensity": 1000,
  get breastDiameter() { return this.scaling(this.baseBreastDiameter * this.breastScale, this.scale, 1); },
  get breastStretchDiameter() { return this.scaling(this.breastStretchiness * this.baseBreastDiameter * this.breastScale, this.scale, 1); },
  get breastArea() {
    return 2 * Math.PI * Math.pow(this.breastDiameter/2,2);
  },
  get breastStretchArea() {
    return 2 * Math.PI * Math.pow(this.breastStretchDiameter/2,2);
  },
  get breastVolume() {
    let radius = this.breastDiameter / 2;
    return 4/3 * Math.PI * Math.pow(radius,3);
  },
  get breastMass() {
    let volume = this.breastVolume;
    return volume * this.breastDensity;
  },

  "digest": function(owner, organ, time=15) {

    // ignore if using manual digestion
    if (time != 0) {
      setTimeout(function() { owner.digest(owner, organ, time); }, time * 1000 / organ.stages);
    }

    let count = Math.min(organ.contents.length, organ.maxDigest);

    let container = organ.contents.pop();
    organ.contents.unshift(new Container());

    if (container.count == 0)
      return;

    do_digestion(owner, organ, container);

  },

  "baseScatDigestFactor": 1,
  "scatScaleWithSize": true,
  get scatDigestFactor() {
    if (this.scatScaleWithSize) {
      return this.baseScatDigestFactor * this.scale;
    } else {
      return this.baseScatDigestFactor;
    }
  },

  "stomach": {
    "name": "stomach",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.oralDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container) {
      return describe("stomach",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      if (owner.gasEnabled)
        owner.gasStorage.amount += container.sum_property("mass") * owner.gasDigestFactor / 1e4;
      if (owner.scatEnabled) {
        owner.scatStorage.amount += container.sum_property("mass") * owner.scatDigestFactor / 1e3;
        owner.scatStorage.victims = owner.scatStorage.victims.merge(container);
      }
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your belly is flat, growling and gurgling for want of prey.";
      } else {
        if (macro.brutality > 0)  {
          return "Your belly churns and bubbles as it works to melt " + prey.describe(false) + " down to chyme.";
        } else {
          return "Your belly sloshes with the weight of " + prey.describe(false) + " trapped within.";
        }
      }
    },
    "contents": [],
    "stages": 3
  },

  "tail": {
    "name" : "tail",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.tailDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeMove" : function(container) {
      return describe("tail-to-stomach",container,this.owner,verbose);
    },
    "describeDigestion" : function(container) {
      return describe("tail",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      if (owner.gasEnabled)
        owner.gasStorage.amount += container.sum_property("mass") * owner.gasDigestFactor / 1e3;
      if (owner.scatEnabled) {
        owner.scatStorage.amount += container.sum_property("mass") * owner.scatDigestFactor / 1e3;
        owner.scatStorage.victims = owner.scatStorage.victims.merge(container);
      }
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your " + this.owner.tailDesc + " are empty.";
      } else {
        if (this.owner.tailVoreToStomach) {
          return "Your " + this.owner.tailDesc + " " + (this.owner.tailCount > 1 ? "clench and squeeze around " : "clenches and squeezes around ") + prey.describe(false) + ", working them deeper and deeper inside.";
        }
        else if (macro.brutality > 0)  {
          return "Your " + this.owner.tailDesc + " " +  (this.owner.tailCount > 1 ? "groans" : "groan") + " ominously as " + (this.owner.tailCount > 1 ? "they gurgle" : "it gurgles" ) + " around " + prey.describe(false) + ", slowly absorbing them into your musky depths.";
        } else {
          return "Your " + this.owner.tailDesc + " " + (this.owner.tailCount > 1 ? "bulge" : "bulges") + " with " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "bowels": {
    "name" : "bowels",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.analDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeMove" : function(container) {
      return describe("bowels-to-stomach",container,this.owner,verbose);
    },
    "describeDigestion" : function(container) {
      return describe("bowels",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      if (owner.gasEnabled)
        owner.gasStorage.amount += container.sum_property("mass") * owner.gasDigestFactor / 1e3;
      if (owner.scatEnabled) {
        owner.scatStorage.amount += container.sum_property("mass") * owner.scatDigestFactor / 1e3;
        owner.scatStorage.victims = owner.scatStorage.victims.merge(container);
      }
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your bowels are empty.";
      } else {
        if (macro.brutality > 0)  {
          return "Your bowels groan ominously as they clench around " + prey.describe(false) + ", slowly absorbing them into your musky depths.";
        } else {
          return "Your bowels bulge with " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "baseFemcumDigestFactor": 1,
  "femcumScaleWithSize": true,
  get femcumDigestFactor() {
    if (this.femcumScaleWithSize) {
      return this.baseFemcumDigestFactor * this.scale;
    } else {
      return this.baseFemcumDigestFactor;
    }
  },

  "womb": {
    "name" : "womb",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.unbirthDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container, vol) {
      return describe("womb",container,this.owner,verbose).replace("$VOLUME",volume(vol,unit,false));
    },
    "fill": function(owner,container) {
      let amount = container.sum_property("mass") * owner.femcumDigestFactor / 1e3;
      owner.femcumStorage.amount += amount;
      return amount;
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your lower belly is flat.";
      } else {
        if (macro.brutality > 0)  {
          return "Your womb tingles as its rhythmically grinds down on " + prey.describe(false) + ", turning them soft and wet as they start to dissolve into femcum.";
        } else {
          return "Your womb clenches around " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "baseCumDigestFactor": 1,
  "cumScaleWithSize": true,
  get cumDigestFactor() {
    if (this.cumScaleWithSize) {
      return this.baseCumDigestFactor * this.scale;
    } else {
      return this.baseCumDigestFactor;
    }
  },

  "balls": {
    "name" : "balls",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.cockDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container, vol) {
      return describe("balls",container,this.owner,verbose).replace("$VOLUME",volume(vol,unit,false));
    },
    "fill": function(owner,container) {
      let amount = container.sum_property("mass") * owner.cumDigestFactor / 1e3;
      owner.cumStorage.amount += amount;
      return amount;
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your balls are smooth.";
      } else {
        if (macro.brutality > 0)  {
          return "Your balls slosh and bulge as they work to convert " + prey.describe(false) + " into hot cum.";
        } else {
          return "Your balls slosh about, loaded down with " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "baseMilkDigestFactor": 1,
  "milkScaleWithSize": true,
  get milkDigestFactor() {
    if (this.milkScaleWithSize) {
      return this.baseMilkDigestFactor * this.scale;
    } else {
      return this.baseMilkDigestFactor;
    }
  },

  "breasts": {
    "name" : "breasts",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.breastDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container, vol) {
      return describe("breasts",container,this.owner,verbose).replace("$VOLUME",volume(vol,unit,false));
    },
    "fill": function(owner,container) {
      if (macro.lactationEnabled) {
        let amount = container.sum_property("mass") * owner.milkDigestFactor / 1e3;
        owner.milkStorage.amount += amount;
        return amount;
      }
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your breasts are smooth.";
      } else {
        if (macro.brutality > 0)  {
          return "Your breasts slosh from side to side, " + prey.describe(false) + " slowly digesting into creamy milk.";
        } else {
          return "Your breasts bulge with " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "basePissDigestFactor": 1,
  "pissScaleWithSize": true,
  get pissDigestFactor() {
    if (this.pissScaleWithSize) {
      return this.basePissDigestFactor * this.scale;
    } else {
      return this.basePissDigestFactor;
    }
  },

  "bladder": {
    "name" : "bladder",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.bladderDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container, vol) {
      return describe("bladder",container,this.owner,verbose).replace("$VOLUME",volume(vol,unit,false));
    },
    "fill": function(owner,container) {
      let amount = container.sum_property("mass") * owner.pissDigestFactor / 1e3;
      owner.pissStorage.amount += amount;
      return amount;
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your bladder has nobody in it.";
      } else {
        if (macro.brutality > 0)  {
          return "Your bladder bulges, " + prey.describe(false) + " dissolving in your acrid piss.";
        } else {
          return "Your bladder bulges with " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  soulVoreEnabled: true,

  "souls": {
    "name" : "souls",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.soulDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (get_living_prey(prey.sum()) > 0)
        this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container) {
      return describe("soul-digest",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      add_victim_people("soul-digest",container);
    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      let souls = get_living_prey(prey.sum());

      if (souls == 0) {
        return "Your depths hold no souls.";
      } else {
        if (macro.brutality > 0)  {
          return "Your depths bubble and boil with energy, slowly digesting " + (souls > 1 ? souls + " souls." : "a lonely soul");
        } else {
          return "You feel " + (souls > 1 ? souls + " souls " : "a soul ") + "trapped in your depths.";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "gooEnabled": true,
  "gooMolten": false,
  "gooDigestion": true,

  "goo": {
    "name" : "goo",
    "setup": function(owner) {
      this.owner = owner;

      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());

      if (owner.gooDigestion) {
        owner.digest(owner, this, owner.gooDigestTime);
      }


    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container) {
      add_victim_people("goo", container);
      return describe("goo-digest",container,this.owner,verbose);
    },
    "fill": function(owner,container) {

    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "You contain no prey.";
      } else {
        if (macro.gooDigestion)  {
          return "Your gooey body contains " + prey.describe(false) + ", gradually absorbing them into your bulk.";
        } else {
          return "Your gooey body contains " + prey.describe(false) + ".";
        }
      }
    },
    "contents" : [],
    "stages": 3
  },

  "pawVoreEnabled": false,

  "pawsVore": {
    "name" : "paws",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner, this, owner.pawDigestTime);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion" : function(container) {
      return describe("paws",container,this.owner,verbose);
    },
    "fill": function(owner,container) {

    },
    get description() {
      let prey = new Container();
      this.contents.forEach(function(x) {
        prey = prey.merge(x);
      });

      if (prey.count == 0) {
        return "Your " + this.owner.footOnlyDesc(true) + " don't contain any prey.";
      } else {
        return "Your " + this.owner.footOnlyDesc(true) + " have enveloped " + prey.describe(false);
      }
    },
    "contents" : [],
    "stages": 3
  },

  // holding spots

  hasPouch: true,
  "pouch": {
    "name": "pouch",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "Your pouch is empty";
      else
        return "Your pouch contains " + this.container.describe(false);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  hasSheath: true,
  "sheath": {
    "name": "sheath",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "Your sheath is empty";
      else
        return "Your sheath contains " + this.container.describe(false);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  hasCleavage: true,
  "cleavage": {
    "name": "cleavage",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "Your breasts don't have anyone stuck between them";
      else
        return "Your cleavage contains " + this.container.describe(false);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  "shoeTrapped": new Container(),
  "sockTrapped": new Container(),

  "shoe": {
    "name": "shoe",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "Your shoes are empty.";
      else
        return "Your shoes contain " + this.container.describe(false);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  "sock": {
    "name": "sock",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "Your socks are empty.";
      else
        return "Your socks contain " + this.container.describe(false);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  "paws": {
    "name": "paws",
    "container": new Container(),
    get description() {
      if (this.container.count == 0)
        return "You don't have anyone stuck between your " + this.owner.toeDesc(true);
      else
        return "You have " + this.container.describe(false) + " wedged between your " + this.owner.toeDesc(true);
    },
    "add": function(victims) {
      this.container = this.container.merge(victims);
    }
  },

  "init": function() {
    this.stomach.setup(this);
    this.bowels.setup(this);
    this.tail.setup(this);
    this.womb.setup(this);
    this.balls.setup(this);
    this.breasts.setup(this);
    this.bladder.setup(this);
    this.souls.setup(this);
    this.goo.setup(this);
    this.pawsVore.setup(this);
    this.cumStorage.owner = this;
    this.femcumStorage.owner = this;
    this.milkStorage.owner = this;
    this.gasStorage.owner = this;
    this.pissStorage.owner = this;
    this.scatStorage.owner = this;

    this.paws.owner = this;

    if (this.analVoreToStomach) {
      this.bowels.moves = this.stomach;
    }

    if (this.tailVoreToStomach) {
      this.tail.moves = this.stomach;
    }

    if (this.maleParts)
      this.fillCum(this);
    if (this.femaleParts)
      this.fillFemcum(this);
    if (this.lactationEnabled && this.hasBreasts)
      this.fillBreasts(this);
    if (this.arousalEnabled)
      this.quenchExcess(this);
    if (this.gasEnabled)
      this.fillGas(this);
    if (this.pissEnabled)
      this.fillPiss(this);
    if (this.scatEnabled)
      this.fillScat(this);
  },

  "maleParts": true,
  "femaleParts": true,

  "fillCum": function(self) {
    self.cumStorage.amount += self.cumScale * self.cumStorage.limit / self.cumStorageScale / 1000;
    if (self.cumStorage.amount > self.cumStorage.limit)
      self.arouse(1 * (self.cumStorage.amount / self.cumStorage.limit - 1));
    setTimeout(function () { self.fillCum(self); }, 100);
    update();
  },

  "fillFemcum": function(self) {
    self.femcumStorage.amount += self.femcumScale * self.femcumStorage.limit / self.femcumStorageScale / 1000;
    if (self.femcumStorage.amount > self.femcumStorage.limit)
      self.arouse(1 * (self.femcumStorage.amount / self.femcumStorage.limit - 1));
    setTimeout(function () { self.fillFemcum(self); }, 100);
    update();
  },

  "fillBreasts": function(self) {
    if (self.milkStorage.amount > self.milkStorage.limit) {
      breast_milk(self.milkStorage.amount - self.milkStorage.limit);
    }
    self.milkStorage.amount += self.lactationScale * self.milkStorage.limit / self.milkStorageScale / 1000;

    if (self.milkStorage.amount > self.milkStorage.limit) {
      self.milkStorage.amount = self.milkStorage.limit;
    }
    setTimeout(function () { self.fillBreasts(self); }, 100);
    update();
  },

  "fillGas": function(self) {
    self.gasStorage.amount += self.gasScale * self.gasStorage.limit / self.gasStorageScale / 1000;

    let ratio = self.gasStorage.amount / self.gasStorage.limit;

    if (ratio > 1 && Math.random()*100 < ratio || ratio > 2) {
      let amount = self.gasStorage.amount - self.gasStorage.limit*3/4;
      if (self.belchEnabled && self.fartEnabled) {
        if (Math.random() < 0.5)
          belch(amount);
        else
          fart(amount);
      } else if (self.belchEnabled) {
        belch(amount);
      } else if (self.fartEnabled) {
        fart(amount);
      }

    }
    setTimeout(function () { self.fillGas(self); }, 100);
    update();
  },

  "pissEnabled": true,
  "pissScale": 1,
  "baseUrethraDiameter": 0.03,
  "urethraStretchiness": 5,

  get urethraDiameter() {
    return this.scaling(this.baseUrethraDiameter, this.scale, 1);
  },
  get urethraStretchDiameter() {
    return this.urethraDiameter * this.urethraStretchiness;
  },
  get urethraStretchArea() {
    return (this.urethraStretchDiameter * this.urethraStretchDiameter / 4) * Math.PI;
  },

  "fillPiss": function(self) {
    self.pissStorage.amount += self.pissScale * self.pissStorage.limit / self.pissStorageScale / 1000;
    if (self.pissStorage.amount > self.pissStorage.limit * 2)
      piss(self.pissStorage.amount);
    setTimeout(function () { self.fillPiss(self); }, 100);
    update();
  },

  "fillScat": function(self) {
    self.scatStorage.amount += self.scatScale * self.scatStorage.limit / self.scatStorageScale / 1000;
    if (self.scatStorage.amount > self.scatStorage.limit * 2)
      scat(self.scatStorage.amount);
    setTimeout(function () { self.fillScat(self); }, 100);
    update();
  },

  "cumStorage": {
    "amount": 0,
    get limit() {
      return this.owner.ballVolume * this.owner.cumStorageScale;
    }
  },

  "femcumStorage": {
    "amount": 0,
    get limit() {
      return this.owner.vaginaVolume * this.owner.femcumStorageScale;
    }
  },

  "milkStorage": {
    "amount": 0,
    get limit() {
      return this.owner.breastVolume * 2 * this.owner.milkStorageScale;
    }
  },

  "gasStorage": {
    "amount": 0,
    get limit() {
      return Math.pow(this.owner.scale,3) / 1000 * this.owner.gasStorageScale;
    }
  },

  "pissStorage": {
    "amount": 0,
    get limit() {
      return Math.pow(this.owner.scale,3) / 5000 * this.owner.pissStorageScale;
    }
  },

  "scatEnabled": true,

  "scatStorage": {
    "amount": 0,
    "victims": new Container(),
    get limit() {
      return Math.pow(this.owner.scale,3) / 1000 * this.owner.scatStorageScale;
    }
  },

  "stenchEnabled": true,
  "basePawStenchArea": 1,
  get pawStenchArea() {
    return this.pawArea * this.basePawStenchArea;
  },
  "baseAssStenchArea": 1,
  get assStenchArea() {
    return this.assArea * this.baseAssStenchArea;
  },

  "gasEnabled": true,
  "gasScale": 1,
  "gasFactor": 1,
  "baseGasDigestFactor": 1,
  "gasScaleWithSize": true,
  get gasDigestFactor() {
    if (this.gasScaleWithSize) {
      return this.baseGasDigestFactor * this.scale;
    } else {
      return this.baseGasDigestFactor;
    }
  },
  "belchEnabled": true,
  "fartEnabled": true,

  "orgasm": false,
  "afterglow": false,

  "arousalEnabled": true,

  "arousalFactor": 1,

  "arousal": 0,
  "edge": 0,

  "maleSpurt": 0,
  "femaleSpurt": 0,

  "arouse": function(amount) {
    if (!this.arousalEnabled)
      return;

    if (this.afterglow)
      return;

    this.arousal += amount * this.arousalFactor;

    if (this.arousal >= 200) {
      this.arousal = 200;

      if (!this.orgasm) {
        this.orgasm = true;
        update(["You shudder as ecstasy races up your spine",newline]);
        if (this.maleParts) {
          this.maleOrgasm(this);
          if (this.sheath.container.count > 0)
            sheath_crush();
        }
        if (this.femaleParts) {
          this.femaleOrgasm(this);
        }
        if (!this.maleParts && !this.femaleParts) {
          this.nullOrgasm(this);
        }
        this.quench(100);
      }
    }
  },

  "quench": function(amount) {
    if (!this.arousalEnabled)
      return;

    this.arousal -= amount;

    if (this.arousal <= 100) {
      if (this.orgasm) {
        this.orgasm = false;
        this.afterglow = true;
      }
    }

    if (this.arousal < 0) {
      this.arousal = 0;
      this.afterglow = false;
    }
    update();
  },

  "quenchExcess": function(self) {
    if (self.arousalEnabled) {
      if (self.arousal > 100 && !self.orgasm) {
        self.arousal = Math.max(100,self.arousal-1);
        self.edge += Math.sqrt((self.arousal - 100)) / 500;
        self.edge = Math.min(1,self.edge);
        self.edge = Math.max(0,self.edge - 0.002);

        if (self.maleParts)
          self.maleSpurt += ((self.arousal-100)/100 + Math.random()) / 25 * (self.edge);
        if (self.femaleParts)
          self.femaleSpurt += ((self.arousal-100)/100 + Math.random()) / 25 * (self.edge);

        if (self.maleSpurt > 1) {
          male_spurt(macro.cumVolume * (0.1 + Math.random() / 10));
          self.maleSpurt = 0;
        }
        if (self.femaleSpurt > 1) {
          female_spurt(macro.femcumVolume * (0.1 + Math.random() / 10));
          self.femaleSpurt = 0;
        }
        update();
      } else if (self.afterglow) {
        self.quench(0.5);
        self.edge = Math.max(0,self.edge - 0.01);
      }
    }
    setTimeout(function() { self.quenchExcess(self); }, 200);
  },

  "maleOrgasm": function(self) {
    if (!this.arousalEnabled)
      return;

    if (self.orgasm) {
      let amount = 0;
      let times = Math.round(Math.random()*3+3);
      for (let i=0; i<5; i++) {
        let spurt = Math.min(this.cumVolume, this.cumStorage.amount);
        amount += spurt;
        this.cumStorage.amount -= spurt;
      }
      male_orgasm(amount,5);
      setTimeout(function() { self.maleOrgasm(self); }, 2000);
    }
  },

  "femaleOrgasm": function(self) {
    if (!this.arousalEnabled)
      return;

    if (this.orgasm) {
      let amount = 0;
      let times = Math.round(Math.random()*3+3);
      for (let i=0; i<5; i++) {
        let spurt = Math.min(this.femcumVolume, this.femcumStorage.amount);
        amount += spurt;
        this.femcumStorage.amount -= spurt;
      }
      female_orgasm(amount,5);
      setTimeout(function() { self.femaleOrgasm(self); }, 2000);
    }
  },

  "nullOrgasm": function(self) {
    if (!this.arousalEnabled)
      return;

    if (this.orgasm) {
      this.quench(10);
      setTimeout(function() { self.nullOrgasm(self); }, 2000);
    }
  },

  get totalMass() {
    let base = Math.pow(this.scale,3) * this.baseMass;

    if (this.hasTail) {
      base += this.tailMass * this.tailCount;
    }

    if (this.maleParts) {
      base += this.dickMass;
      base += this.ballMass * 2;
    }

    if (this.hasBreasts) {
      base += this.breastMass * 2;
    }

    return base;
  },

  get description() {
    let result = [];

    let line = "You are " + (macro.name == "" ? "" : macro.name + ", ") + "a " + length(macro.height, unit, true) + " tall " + macro.species + ". You weigh " + mass(macro.mass, unit) + ".";

    result.push(line);

    result.push(macro.stomach.description);

    if (this.analVore) {
      result.push(macro.bowels.description);
    }

    if (this.hasTail) {
      line = "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails sway as you walk. " : " tail sways as you walk. ");
      if (this.tailMaw) {
        line += (macro.tailCount > 1 ? "Their maws are drooling" : "Its maw is drooling");
      }
      result.push(line);

      if (this.tailMaw) {
        result.push(this.tail.description);
      }
    }
    if (this.arousalEnabled) {
      if (this.afterglow) {
        result.push("You're basking in the afterglow of a powerful orgasm.");
      }
      else if (this.orgasm) {
        result.push("You're cumming!");
      } else if (this.arousal < 25) {

      } else if (this.arousal < 75) {
        result.push("You're feeling a little aroused.");
      } else if (this.arousal < 150) {
        result.push("You're feeling aroused.");
      } else if (this.arousal < 200) {
        result.push("You're on the edge of an orgasm!");
      }
    }
    if (this.maleParts) {
      if (this.hasSheath && this.arousal < 75) {
        line = "Your " + this.describeDick + " cock is hidden away in your bulging sheath, with two " + mass(macro.ballMass, unit, true) + ", " + length(macro.ballDiameter, unit, true) + "-wide balls hanging beneath.";
      }
      line = "Your " + this.describeDick + " cock hangs from your hips, with two " + mass(macro.ballMass, unit, true) + ", " + length(macro.ballDiameter, unit, true) + "-wide balls hanging beneath.";
      result.push(line);
      result.push(macro.balls.description);
    }

    if (this.femaleParts) {
      line = "Your glistening " + this.describeVagina + " slit peeks out from between your legs.";
      result.push(line);
      result.push(macro.womb.description);
    }

    if (this.hasBreasts) {
      line = "You have two " + length(this.breastDiameter, unit, true) + "-wide breasts that weigh " + mass(macro.breastMass, unit) + " apiece.";

      if (this.cleavage.container.count > 0)
        line += " Between them are " + this.cleavage.container.describe(false) + ".";

      result.push(line);
      if (this.breastVore) {
        result.push(this.breasts.description);
      }
    }

    if (this.soulVoreEnabled) {
      result.push(this.souls.description);
    }

    if (this.hasPouch) {
      result.push(this.pouch.description);
    }

    line = "Your two " + this.footDesc(true) + " shake the earth.";

    if (this.footShoeWorn && this.shoe.container.count > 0) {
      line += " Within " + (this.shoe.container.count > 1 ? "are" : "is") + " " + this.shoe.container.describe(false);
      if (this.footSockWorn && this.sock.container.count > 0) {
        line += " and " + this.sock.container.describe(false) + " in your socks.";
      }
    } else if (this.footSockWorn && this.sock.container.count > 0) {
      line += " Within " + (this.sock.container.count > 1 ? "are" : "is") + " " + this.sock.container.describe(false);
    }

    if (this.paws.container.count > 0) {
      line += " You have " + this.paws.container.describe(false) + " wedged between your " + macro.toeDesc(true);
    }

    result.push(line);

    if (this.gooMolten) {
      result.push(this.goo.description);
    }

    if (this.pawVoreEnabled) {
      result.push(this.pawsVore.description);
    }

    return result;
  },

  get describeTail() {
    return (this.tailCount > 1 ? this.tailCount + " " : "") + length(this.tailLength, unit, true) + "-long " + this.tailType;
  },


  get describeDick() {
    let state = "";
    if (!this.arousalEnabled) {
      state = "limp";
    } else if (this.orgasm) {
      state = "spurting";
    } else {
      if (this.arousal < 25) {
        state = "limp";
      } else if (this.arousal < 75) {
        state = "swelling";
      } else if (this.arousal < 100) {
        state = "erect";
      } else if (this.arousal < 150) {
        state = "erect, throbbing";
      } else if (this.arousal < 200) {
      state = "erect, throbbing, pre-soaked";
      }
    }
    return length(this.dickLength, unit, true) + " long " + state + " " + this.dickType;
  },

  get describeVagina() {
    let state = "";
    if (!this.arousalEnabled) {
      state = "unassuming";
    } else if (this.orgasm) {
      state = "gushing, quivering";
    } else {
      if (this.arousal < 25) {
        state = "unassuming";
      } else if (this.arousal < 75) {
        state = "moist";
      } else if (this.arousal < 100) {
        state = "glistening";
      } else if (this.arousal < 150) {
        state = "dripping";
      } else if (this.arousal < 200) {
        state = "dripping, quivering";
      }
    }

    return length(this.vaginaLength, unit, true) + " long " + state;
  },

  "growthPoints": 0,

  "addGrowthPoints": function(mass) {
    this.growthPoints += Math.round(mass / (this.scale*this.scale));
  },

  // 0 = entirely non-fatal
  // 1 = fatal, but not specific
  // 2 = gory

  "brutality": 1,

  "scale": 1,
};

function look()
{
  let desc = macro.description;

  let line2 = "";

  if (macro.height > 1e12)
    line2 = "You're pretty much everywhere at once.";
  else if (macro.height > 1e6)
    line2 = "You're standing...on pretty much everything at once.";
  else
    switch(biome) {
      case "rural": line2 = "You're standing amongst rural farmhouses and expansive ranches. Cattle are milling about at your feet."; break;
      case "suburb": line2 = "You're striding through the winding roads of a suburb."; break;
      case "city": line2 = "You're terrorizing the streets of a city. Heavy traffic, worsened by your rampage, is everywhere."; break;
      case "downtown": line2 = "You're lurking amongst the skyscrapers of downtown. The streets are packed, and the buildings are practically begging you to knock them over.";
    }

  desc = desc.concat([newline,line2,newline]);
  update(desc);
}

function toggle_auto()
{
  strolling = !strolling;
  document.getElementById("button-stroll").innerHTML = "Status: " + (strolling ? "Strolling" : "Standing");
  if (strolling)
    update(["You start walking.",newline]);
  else
    update(["You stop walking.",newline]);
}

function toggle_units()
{
  switch(unit) {
    case "metric": unit = "customary"; break;
    case "customary": unit = "approx"; break;
    case "approx": unit = "metric"; break;
  }

  document.getElementById("button-units").innerHTML = "Units: " + unit.charAt(0).toUpperCase() + unit.slice(1);

  update();
}

function toggle_units_options()
{
  switch(unit) {
    case "metric": unit = "customary"; break;
    case "customary": unit = "metric"; break;
  }

  document.getElementById("button-units-options").innerHTML = "Units: " + unit.charAt(0).toUpperCase() + unit.slice(1);

  updateAllPreviews();
}

function toggle_numbers() {
  switch(numbers) {
    case "full": numbers="prefix"; break;
    case "prefix": numbers="words"; break;
    case "words": numbers = "scientific"; break;
    case "scientific": numbers = "full"; break;
  }

  document.getElementById("button-numbers").innerHTML = "Numbers: " + numbers.charAt(0).toUpperCase() + numbers.slice(1);

  update();
}

function toggle_verbose()
{
  verbose = !verbose;

  document.getElementById("button-verbose").innerHTML = (verbose ? "Verbose Text" : "Simple Text");
}

function toggle_arousal()
{
  macro.arousalEnabled = !macro.arousalEnabled;

  document.getElementById("button-arousal").innerHTML = (macro.arousalEnabled ? "Arousal On" : "Arousal Off");
  if (macro.arousalEnabled) {
    document.getElementById("arousal").style.display = "block";
    document.getElementById("edge").style.display = "block";
    document.querySelector("#arousalMeter").style.display = 'inline-block';
    document.querySelector("#orgasmMeter").style.display = 'inline-block';
    document.querySelector("#edgeMeter").style.display = 'inline-block';
  } else {
    document.getElementById("arousal").style.display = "none";
    document.getElementById("edge").style.display = "none";
    document.querySelector("#arousalMeter").style.display = 'none';
    document.querySelector("#orgasmMeter").style.display = 'none';
    document.querySelector("#edgeMeter").style.display = 'none';
  }

  macro.orgasm = false;
  macro.afterglow = false;

  enable_victim("cum-flood","Flooded by cum");
  enable_victim("femcum-flood","Flooded by femcum");

}

// lists out total people
function summarize(sum, fatal = true)
{
  let word;
  let count = get_living_prey(sum);
  if (fatal && macro.brutality > 0)
    word = count != 1 ? "kills" : "kill";
  else if (!fatal && macro.brutality > 0)
    word = "prey";
  else
    word = count != 1 ? "victims" : "victim";

  return "<b>(" + count + " " + word + ")</b>";
}

function getOnePrey(biome, area, sameSize = true)
{
  let weights = getWeights(biome, area);

  let potential = [];

  for (let key in weights) {
    if (weights.hasOwnProperty(key)) {
      potential.push(key);
    }
  }

  let potAreas = [];

  potential.forEach(function (x) {
    potAreas.push([x,areas[x]]);
  });

  potAreas = potAreas.sort(function (x,y) {
    return y[1] - x[1];
  });

  for (let i=0; i<potAreas.length; i++) {
    let x = potAreas[i];
    if (x[1] < area) {
      return new Container([new things[x[0]](1)]);
    }
  }

  if (sameSize)
    return new Container([new things["Person"](1)]);
  else
    return new Container();
}

function getWeights(region, area) {
  let weights = {};

  if (area > areas["Planet"]) {
    weights = {
      "Planet": 1.47e-10,
      "Star": 1.7713746e-12,
      "Solar System": 4e-10,
      "Galaxy": 0.1,
      "Cluster": 0.5,
      "Universe": 1,
      "Multiverse": 1
    };
  }
  else if (area > areas["Town"]) {
    weights = {
      "Town": 0.001,
      "City": 0.0005,
      "Continent": 0.5,
    };
  }
  else {
    weights = {
      "House": 0.1,
      "Car": 0.07,
      "Bus": 0.02,
      "Parking Garage": 0.003,
      "Small Skyscraper": 0.05,
      "Town": 0.00001,
      "City": 0.00005,
      "Continent": 0.0005,
      "Planet": 0.0001
    };

    if (!macro.victimsNoPeople) {
      if (macro.victimsHuman) {
        weights["Human"] = 0.017;
      } else {
        weights["Person"] = 0.017;
      }
    }

    if (macro.victimsMilitary) {
      weights["Soldier"] = 0.01;
      weights["Tank"] = 0.0005;
      weights["Artillery"] = 0.0001;
      weights["Helicopter"] = 0.00005;
    }

    if (macro.victimsMicros) {
      weights["Micro"] = 1;
    }

    if (macro.victimsMacros) {
      weights["Macro"] = 0.0001;
    }
  }

  return weights;
}

function getPrey(region, area, sameSize = false)
{
  let weights = getWeights(region, area);

  var prey = fill_area(area,weights);

  if (prey.count == 0 && sameSize)
    return getOnePrey(biome, area, true);
  return prey;
}

function digest_all(organ) {
  let prey = new Container();

  for (let i = 0; i < organ.stages; i++) {
    prey = prey.merge(organ.contents[i]);
    organ.contents[i] = new Container();
  }

  if (prey.count == 0) {
    return;
  }

  do_digestion(organ.owner, organ, prey);
}

function do_digestion(owner, organ, container) {
  if (organ.moves != undefined) {
    organ.moves.feed(container);
    let sound = getSound("insert",container.sum_property("mass"));
    let line = organ.describeMove(container);
    let summary = summarize(container.sum(),false);
    update([line, summary, newline]);
    return;
  }

  let digested = container.sum();
  for (let key in victims[organ.name]) {
    if (victims[organ.name].hasOwnProperty(key) && digested.hasOwnProperty(key) ) {
      victims["digested"][key] += digested[key];
      victims[organ.name][key] -= digested[key];
    }
  }

  let sound = getSound("digest",container.sum_property("mass"));

  let vol = organ.fill(owner, container);
  let line = organ.describeDigestion(container, vol);
  let lethal = macro.brutality != 0 && (!macro.soulVoreEnabled || organ.name === "souls");
  let summary = summarize(container.sum(),lethal);

  if (macro.soulVoreEnabled && organ.name != "souls") {
    owner.souls.feed(container);
    let soulCount = container.sum()["Person"];
    let soulLine = "";
    if (soulCount > 0)
      soulLine = "Their " + (soulCount == 1 ? "soul is" : "souls are") + " trapped in your depths!";
    else
      soulLine = "No souls, though...";
    update([sound,line,summary,soulLine,newline]);
  } else {
    update([sound,line,summary,newline]);
  }
}

function digest_stomach() {
  digest_all(macro.stomach);
}

function digest_tail() {
  digest_all(macro.tail);
}

function digest_anal() {
  digest_all(macro.bowels);
}

function digest_cock() {
  digest_all(macro.balls);
}

function digest_breast() {
  digest_all(macro.breasts);
}

function digest_unbirth() {
  digest_all(macro.womb);
}

function digest_soul() {
  digest_all(macro.souls);
}

function digest_bladder() {
  digest_all(macro.bladder);
}

function digest_goo() {
  digest_all(macro.goo);
}

function digest_paws() {
  digest_all(macro.pawsVore);
}


function feed()
{
  let area = macro.handArea;
  let prey = getPrey(biome, area, macro.sameSizeVore);

  let line = describe("eat", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("swallow",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.stomach.feed(prey);

  add_victim_people("eaten",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);
}

function chew()
{
  let area = macro.handArea;
  let prey = getPrey(biome, area, macro.sameSizeVore);

  let line = describe("chew", prey, macro, verbose);

  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());
  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Snap.";
  } else if (people < 10) {
    sound = "Crunch.";
  } else if (people < 50) {
    sound = "Crack!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRRUNCH!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("chew",prey);

  macro.stomach.feed(prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(10);
}

function stomp()
{
  if (macro.gooMolten && !macro.footShoeWorn && !macro.footSockWorn) {
    stomp_goo();
    return;
  }

  let area = macro.pawArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("stomp", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);

  add_victim_people("stomped",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);

  stomp_wedge();

  if (macro.stenchEnabled && macro.basePawStenchArea > 0) {
    paw_stench();
  }
}

function stomp_wedge() {
  if (macro.footType == "hoof")
    return;

  let area = 0;

  if (!macro.footWear || (!macro.footSockWorn && !macro.footShoeWorn))
    area = macro.pawArea / 10;
  else if (macro.footShoeWorn)
    area = macro.pawArea / 25;
  else
    area = macro.pawArea / 50;

  let prey = getPrey(biome, area, false);

  if (prey.count == 0)
    return;

  let line = describe("stomp-wedge", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.paws.add(prey);

  add_victim_people("stomped",prey);

  update([sound,line,linesummary,newline]);
}

function stomp_goo() {
  let area = macro.pawArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("stomp-goo", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("goo",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.goo.feed(prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);

  if (macro.stenchEnabled) {
    paw_stench();
  }
}

function flex_toes() {

  let prey = new Container();

  if (!macro.footWear || (!macro.footSockWorn && !macro.footShoeWorn)) {
    prey = macro.paws.container;
    macro.paws.container = new Container();
  }
  else if (macro.footSockWorn && macro.footShoeWorn) {
    prey = macro.shoe.container.merge(macro.sock.container);
    if (macro.brutality > 0) {
      macro.shoe.container = new Container();
      macro.sock.container = new Container();
    }
  } else if (macro.footSockWorn) {
    prey = macro.sock.container;
    if (macro.brutality > 0) {
      macro.sock.container = new Container();
    }
  } else if (macro.footShoeWorn) {
    prey = macro.shoe.container;
    if (macro.brutality > 0) {
      macro.shoe.container = new Container();
    }
  }

  let line = describe("flex-toes", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);

  add_victim_people("flex-toes",prey);

  update([sound,line,linesummary,newline]);
}

function paw_stench() {

  let area = macro.pawStenchArea;
  let prey = getPrey(biome, area);
  let line = describe("paw-stench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("paw-stench",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function grind()
{
  let area = macro.assArea / 2;

  if (macro.maleParts)
    area += macro.dickArea;
  if (macro.femalePartS)
    area += macro.vaginaArea;

  let prey = getPrey(biome, area);

  let line = describe("grind", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);

  add_victim_people("humped",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function anal_vore()
{
  let area = macro.analVoreArea;
  let prey = getOnePrey(biome, area, macro.sameSizeVore);

  let line = describe("anal-vore", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.bowels.feed(prey);

  add_victim_people("anal-vore",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function sit()
{
  if (macro.gooMolten) {
    sit_goo();
    return;
  }

  let area = macro.assArea;
  let crushed = getPrey(biome, area, macro.sameSizeStomp);

  let line = describe("ass-crush", crushed, macro, verbose);
  let linesummary = summarize(crushed.sum(), true);

  let people = get_living_prey(crushed.sum());

  let crushedMass = crushed.sum_property("mass");

  let sound = getSound("crush",crushedMass);

  macro.addGrowthPoints(crushedMass);

  update([sound,line,linesummary,newline]);

  add_victim_people("ass-crush",crushed);

  macro.arouse(5);

  if (macro.stenchEnabled && macro.baseAssStenchArea > 0) {
    ass_stench();
  }
}

function sit_goo()
{
  let area = macro.assArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);

  let line = describe("ass-goo", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let crushedMass = prey.sum_property("mass");

  let sound = getSound("goo",crushedMass);

  macro.goo.feed(prey);

  macro.addGrowthPoints(crushedMass);

  update([sound,line,linesummary,newline]);

  macro.arouse(15);

  if (macro.stenchEnabled && macro.baseAssStenchArea > 0) {
    ass_stench();
  }
}

function ass_stench() {

  let area = macro.assStenchArea;
  let prey = getPrey(biome, area);
  let line = describe("ass-stench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (prey.sum()["Person"] == undefined)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("ass-stench",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function cleavage_stuff()
{
  let area = macro.handArea;
  let prey = getPrey(biome, area);
  let line = describe("cleavage-stuff", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  macro.cleavage.add(prey);

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  update([sound,line,linesummary,newline]);

  macro.arouse(10);
}

function cleavage_crush()
{
  let prey = macro.cleavage.container;
  macro.cleavage.container = new Container();
  let line = describe("cleavage-crush", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cleavage-crush",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse((preyMass > 0 ? 20 : 10));
}

function cleavage_drop()
{
  let prey = macro.cleavage.container;
  macro.cleavage.container = new Container();
  let line = describe("cleavage-drop", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("drop",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cleavage-drop",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse((preyMass > 0 ? 15 : 5));
}

function cleavage_absorb()
{
  let prey = macro.cleavage.container;
  macro.cleavage.container = new Container();
  let line = describe("cleavage-absorb", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cleavage-absorb",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse((preyMass > 0 ? 15 : 5));
}

function breast_toy()
{
  let prey = macro.cleavage.container;
  let line = describe("breast-toy", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  update([sound,line,linesummary,newline]);
  macro.arouse(15);
}

function breast_crush()
{
  let area = macro.breastArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("breast-crush", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("breast-crush",prey);

  update([sound,line,linesummary,newline]);

  if (macro.lactationEnabled && macro.milkStorage.amount / macro.milkStorage.limit > 0.5) {
    let amount = Math.min(macro.lactationVolume, (macro.milkStorage.amount / macro.milkStorage.limit - 0.5) * macro.milkStorage.limit);
    breast_milk(amount);
  }

  macro.arouse(10);
}

function breast_vore()
{
  // todo nipple areas?
  let area = macro.breastStretchArea/4;
  let prey = getPrey(biome, area, macro.sameSizeVore);
  let line = describe("breast-vore", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("breast-vore",prey);
  macro.breasts.feed(prey);


  update([sound,line,linesummary,newline]);

  if (macro.lactationEnabled && macro.milkStorage.amount / macro.milkStorage.limit > 0.5) {
    let amount = Math.min(macro.lactationVolume, (macro.milkStorage.amount / macro.milkStorage.limit - 0.5) * macro.milkStorage.limit);
    breast_milk(amount);
  }

  macro.arouse(10);
}

function breast_milk(vol)
{
  if (vol == undefined) {
    vol = Math.min(macro.lactationVolume, macro.milkStorage.amount);
  }

  macro.milkStorage.amount -= vol;

  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("breast-milk", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("milk-flood",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function unbirth()
{
  let area = macro.vaginaStretchArea;
  let prey = getPrey(biome, area, macro.sameSizeVore);
  let line = describe("unbirth", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.womb.feed(prey);
  add_victim_people("unbirth",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function slit_toy()
{
  let prey = macro.womb.contents[0].merge(macro.womb.contents[1]);
  let line = describe("slit-toy", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  update([sound,line,linesummary,newline]);
  macro.arouse(15);
}

function sheath_stuff()
{
  let area = Math.min(macro.handArea, macro.dickArea);
  let prey = getPrey(biome, area, macro.sameSizeVore);
  let line = describe("sheath-stuff", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.sheath.add(prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(15);
}

function sheath_toy()
{
  let prey = macro.sheath.container;
  let line = describe("sheath-toy", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  update([sound,line,linesummary,newline]);
  macro.arouse(15);
}

function sheath_clench()
{
  let prey = macro.sheath.container;
  macro.sheath.container = new Container();
  let line = describe("sheath-clench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  add_victim_people("sheath-crush",prey);
  update([sound,line,linesummary,newline]);
  macro.arouse(45);
}

function sheath_crush()
{
  let prey = macro.sheath.container;
  macro.sheath.container = new Container();
  let line = describe("sheath-crush", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  add_victim_people("sheath-crush",prey);
  update([sound,line,linesummary,newline]);
  macro.arouse(45);
}

function sheath_absorb()
{
  let prey = macro.sheath.container;
  macro.sheath.container = new Container();
  let line = describe("sheath-absorb", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  add_victim_people("sheath-absorb",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(45);
}

function cockslap()
{
  let area = macro.dickArea;
  let prey = getPrey(biome, area);
  let line = describe("cockslap", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cock-slap",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(15);
}

function cock_vore()
{
  let area = macro.dickStretchGirth;
  let prey = getPrey(biome, area, macro.sameSizeVore);
  let line = describe("cock-vore", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.balls.feed(prey);

  add_victim_people("cock-vore",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function ball_smother()
{
  let area = macro.ballArea * 2;
  let prey = getPrey(biome, area);
  let line = describe("ball-smother", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);

  add_victim_people("ball-smother",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(10);
}

function male_spurt(vol)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("male-spurt", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cum-flood",prey);

  update([sound,line,linesummary,newline]);

  if (macro.maleMuskEnabled) {
    male_spurt_musk(area * macro.baseMaleMuskArea);
  }
}

function male_spurt_musk(area) {
  let prey = getPrey(biome, area);
  let line = describe("male-spurt-musk", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("male-spurt-musk",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function male_orgasm(vol,times)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("male-orgasm", prey, macro, verbose).replace("$TIMES",times).replace("$VOLUME",volume(vol*times,unit,true));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("cum-flood",prey);

  update([sound,line,linesummary,newline]);

  if (macro.maleMuskEnabled) {
    male_orgasm_musk(area * macro.baseMaleMuskArea);
  }
}

function male_orgasm_musk(area) {
  let prey = getPrey(biome, area);
  let line = describe("male-orgasm-musk", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("male-orgasm-musk",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function female_spurt(vol)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("female-spurt", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("femcum-flood",prey);

  update([sound,line,linesummary,newline]);

  if (macro.femaleMuskEnabled) {
    female_spurt_musk(area * macro.baseFemaleMuskArea);
  }
}

function female_spurt_musk(area) {
  let prey = getPrey(biome, area);
  let line = describe("female-spurt-musk", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("female-spurt-musk",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function female_orgasm(vol,times)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("female-orgasm", prey, macro, verbose).replace("$TIMES",times).replace("$VOLUME",volume(vol*times,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("femcum-flood",prey);

  update([sound,line,linesummary,newline]);

  if (macro.femaleMuskEnabled) {
    female_orgasm_musk(area * macro.baseFemaleMuskArea);
  }
}

function female_orgasm_musk(area) {
  let prey = getPrey(biome, area);
  let line = describe("female-orgasm-musk", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("female-orgasm-musk",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function tail_slap()
{
  let area = macro.tailArea * macro.tailCount;
  let prey = getPrey(biome, area);
  let line = describe("tail-slap", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("tail-slap",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);
}

function tail_vore_only()
{
  tail_vore(1);
}

function tail_vore_one()
{
  tail_vore(1);
}

function tail_vore_some()
{
  tail_vore(Math.floor(Math.random() * macro.tailCount) + 1);
}

function tail_vore_all()
{
  tail_vore(macro.tailCount);
}

function tail_vore(count)
{
  let lines = [];
  let totalPrey = new Container();
  for (let i=0; i<count; i++) {
    let area = macro.tailStretchGirth;
    let prey = getPrey(biome, area, macro.sameSizeVore);
    totalPrey = totalPrey.merge(prey);
    let line = describe("tail-vore", prey, macro, verbose);
    lines.push(line);
  }

  let linesummary = summarize(totalPrey.sum(), false);

  lines.push(linesummary);

  lines.push(newline);

  let people = get_living_prey(totalPrey.sum());

  let preyMass = totalPrey.sum_property("mass");

  let sound = getSound("swallow",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.tail.feed(totalPrey);
  add_victim_people("tail-vore",totalPrey);


  update([sound].concat(lines));

  macro.arouse(5);
}

function pouch_stuff()
{
  let area = macro.handArea;
  let prey = getPrey(biome, area);
  let line = describe("pouch-stuff", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.pouch.add(prey);


  update([sound,line,linesummary,newline]);

  macro.arouse(5);
}

function pouch_rub()
{
  let prey = macro.pouch.container;

  let line = describe("pouch-rub", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);
  update([line,linesummary,newline]);
}

function pouch_eat()
{
  let prey = macro.pouch.container;
  macro.pouch.container = new Container();

  let line = describe("pouch-eat", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("swallow",preyMass);

  macro.addGrowthPoints(preyMass);
  macro.stomach.feed(prey);
  add_victim_people("eaten",prey);


  update([sound,line,linesummary,newline]);

  macro.arouse(5);
}

function pouch_absorb()
{
  let prey = macro.pouch.container;
  macro.pouch.container = new Container();

  let line = describe("pouch-absorb", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.stomach.feed(prey);
  add_victim_people("pouch-absorb",prey);


  update([sound,line,linesummary,newline]);

  macro.arouse(25);
}

function soul_vore()
{
  let area = macro.height * macro.height;
  let prey = getPrey(biome, area);

  let line = describe("soul-vore", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("swallow",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.souls.feed(prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(15);
}

function soul_absorb_paw()
{
  let prey = getPrey(biome, macro.pawArea, macro.sameSizeStomp);

  let line = describe("soul-absorb-paw", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("crush",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("soul-paw",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(25);
}

function belch(vol)
{
  if (vol == undefined) {
    vol = Math.min(macro.gasStorage.amount,macro.gasStorage.limit/3);
  }

  macro.gasStorage.amount -= vol;

  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("belch", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("belch",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("gas-belch",prey);


  update([sound,line,linesummary,newline]);
}

function fart(vol)
{
  if (vol == undefined) {
    vol = Math.min(macro.gasStorage.amount,macro.gasStorage.limit/2);
  }

  macro.gasStorage.amount -= vol;

  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("fart", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("fart",preyMass);

  macro.addGrowthPoints(preyMass);
  add_victim_people("gas-fart",prey);


  update([sound,line,linesummary,newline]);
}

function wear_shoes() {
  macro.shoe.container = macro.shoe.container.merge(macro.paws.container);

  let line = describe("wear-shoe",macro.shoe.container.merge(macro.paws.container),macro,verbose);
  macro.paws.container = new Container();
  let summary = summarize(macro.shoe.container.sum(),false);

  macro.footShoeWorn = true;

  footwearUpdate();

  macro.paws.container = macro.shoeTrapped;
  macro.shoeTrapped = new Container();

  update([line,summary,newline]);
}

function remove_shoes() {
  macro.footShoeWorn = false;

  macro.shoeTrapped = macro.paws.container;
  macro.paws.container = new Container();

  let line = describe("remove-shoe",macro.shoe.container,macro,verbose);
  let summary = summarize(macro.shoe.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);

  if (macro.stenchEnabled) {
    remove_shoes_stench();
  }
}

function remove_shoes_stench() {
    let area = macro.pawStenchArea * 2;
    let prey = getPrey(biome, area);
    let line = describe("paw-stench", prey, macro, verbose);
    let linesummary = summarize(prey.sum(), true);

    let people = get_living_prey(prey.sum());

    if (get_living_prey(prey.sum()) == 0)
      return;

    let preyMass = prey.sum_property("mass");

    macro.addGrowthPoints(preyMass);

    add_victim_people("paw-stench",prey);

    update([line,linesummary,newline]);

    macro.arouse(5);
}

function wear_socks() {
  macro.sock.container = macro.sock.container.merge(macro.paws.container);

  let line = describe("wear-sock",macro.sock.container,macro,verbose);
  macro.paws.container = new Container();
  let summary = summarize(macro.sock.container.sum(),false);

  macro.footSockWorn = true;

  macro.paws.container = macro.sockTrapped;
  macro.sockTrapped = new Container();

  footwearUpdate();

  update([line,summary,newline]);
}

function remove_socks() {
  macro.footSockWorn = false;

  macro.sockTrapped = macro.paws.container;
  macro.paws.container = new Container();

  let line = describe("remove-sock",macro.sock.container,macro,verbose);
  let summary = summarize(macro.sock.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);

  if (macro.stenchEnabled) {
    remove_socks_stench();
  }
}

function remove_socks_stench() {
    let area = macro.pawStenchArea * 2;
    let prey = getPrey(biome, area);
    let line = describe("paw-stench", prey, macro, verbose);
    let linesummary = summarize(prey.sum(), true);

    let people = get_living_prey(prey.sum());

    if (get_living_prey(prey.sum()) == 0)
      return;

    let preyMass = prey.sum_property("mass");

    macro.addGrowthPoints(preyMass);

    add_victim_people("paw-stench",prey);

    update([line,linesummary,newline]);

    macro.arouse(5);
}

function stuff_shoes() {
  let prey = getPrey(biome, macro.pawArea/5, false);

  macro.shoe.add(prey);

  let line = describe("stuff-shoe",prey,macro,verbose);
  let summary = summarize(prey.sum(),false);

  update([line,summary,newline]);
}

function stuff_socks() {
  let prey = getPrey(biome, macro.pawArea/5, false);

  macro.sock.add(prey);

  let line = describe("stuff-sock",prey,macro,verbose);
  let summary = summarize(prey.sum(),false);

  update([line,summary,newline]);
}

function dump_shoes() {
  let prey = macro.shoe.container;

  macro.shoe.container = new Container();

  let line = describe("dump-shoe",prey,macro,verbose);
  let summary = summarize(prey.sum(),false);

  update([line,summary,newline]);
}

function dump_socks() {
  let prey = macro.sock.container;

  macro.sock.container = new Container();

  let line = describe("dump-sock",prey,macro,verbose);
  let summary = summarize(prey.sum(),false);

  update([line,summary,newline]);
}


function footwearUpdate() {
  disable_button("wear_shoes");
  disable_button("remove_shoes");
  disable_button("wear_socks");
  disable_button("remove_socks");
  disable_button("stuff_shoes");
  disable_button("dump_shoes");
  disable_button("stuff_socks");
  disable_button("dump_socks");

  if (macro.footShoeEnabled) {
    if (macro.footShoeWorn) {
      enable_button("remove_shoes");
    } else {
      enable_button("stuff_shoes");
      enable_button("dump_shoes");
      enable_button("wear_shoes");
    }
  }

  if (macro.footSockEnabled) {
    if (!macro.footShoeEnabled || !macro.footShoeWorn) {
      if (macro.footSockWorn) {
        enable_button("remove_socks");
      } else {
        enable_button("wear_socks");
      }
    }

    if (!macro.footSockWorn) {
      enable_button("stuff_socks");
      enable_button("dump_socks");
    }
  }
}

function piss(vol) {
  if (vol == undefined) {
    vol = macro.pissStorage.amount;
  }

  macro.pissStorage.amount -= vol;

  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("piss", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("liquid",preyMass);

  add_victim_people("piss",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(20);

  if (macro.stenchEnabled && macro.basePissStenchArea > 0) {
    piss_stench(area * macro.basePissStenchArea);
  }
}

function piss_stench(area) {
  let prey = getPrey(biome, area);
  let line = describe("piss-stench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("piss-stench",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function bladder_vore() {
  let prey = getPrey(biome, macro.urethraStretchArea, macro.sameSizeVore);
  let line = describe("bladder-vore", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  add_victim_people("bladder_vore",prey);

  macro.bladder.feed(prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function scat(vol) {
  if (vol == undefined) {
    vol = macro.scatStorage.amount;
  }

  let area = Math.pow(vol, 2/3);

  let scatArea = macro.analVoreArea;
  let scatLength = vol / macro.analVoreArea;
  let prey = getPrey(biome, area);
  let line = describe("scat", prey, macro, verbose).replace("$MASS",mass(vol*1000,unit,true)).replace("$LENGTH",length(scatLength,unit,true));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("scat",preyMass);

  macro.scatStorage.victims = new Container();
  add_victim_people("scat",prey);
  update([sound,line,linesummary,newline]);

  macro.scatStorage.amount -= vol;

  macro.arouse(50);

  if (macro.stenchEnabled && macro.baseScatStenchArea > 0) {
    scat_stench(area*macro.baseScatStenchArea);
  }
}

function scat_stench(area) {
  let prey = getPrey(biome, area);
  let line = describe("scat-stench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (get_living_prey(prey.sum()) == 0)
    return;

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  add_victim_people("scat-stench",prey);

  update([line,linesummary,newline]);

  macro.arouse(5);
}

function setButton(button, state) {
  if (state) {
    enable_button(button);
  } else {
    disable_button(button);
  }
}

function gooButtons(molten) {
  setButton("melt", !molten);
  setButton("solidify", molten);
  setButton("flood", molten);
  setButton("goo_stomach_pull", molten);
  setButton("goo_stomach_push", molten);

  if (macro.analVore) {
    setButton("goo_bowels_pull", molten);
    setButton("goo_bowels_push", molten);
  }

  if (macro.femaleParts) {
    setButton("goo_womb_pull", molten);
    setButton("goo_womb_push", molten);
  }

  if (macro.maleParts) {
    setButton("goo_balls_pull", molten);
    setButton("goo_balls_push", molten);
  }

  if (macro.hasBreasts) {
    setButton("goo_breasts_pull", molten);
    setButton("goo_breasts_push", molten);
  }

  if (macro.pawVoreEnabled) {
    setButton("goo_paws_pull", molten);
    setButton("goo_paws_push", molten);
  }

  if (macro.hasTail) {
    setButton("goo_tail_pull", molten);
    setButton("goo_tail_push", molten);
  }

  if (macro.gooDigestTime == 0) {
    setButton("digest_goo", molten);
  }
}

function melt()
{
  macro.gooMolten = true;

  gooButtons(macro.gooMolten);

  let prey = new Container();

  prey = prey.merge(macro.paws.container);
  macro.paws.container = new Container();

  if (macro.footSockWorn) {
    prey = prey.merge(macro.sock.container);
    macro.sock.container = new Container();
  } else if (macro.footShoeWorn) {
    prey = prey.merge(macro.shoe.container);
    macro.shoe.container = new Container();
  }

  let line = describe("melt", prey, macro, verbose);

  macro.goo.feed(prey);

  update([line, newline]);
}

function flood()
{
  let area = Math.pow(macro.totalMass / 1000, 2/3);
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("flood", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("goo",preyMass);

  macro.goo.feed(prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);
}

function solidify()
{
  macro.gooMolten = false;

  gooButtons(macro.gooMolten);

  let prey = new Container();

  for (let i=0; i < macro.goo.contents.length; i++) {
    prey = prey.merge(macro.goo.contents[i]);
    macro.goo.contents[i] = new Container();
  }

  let line = describe("solidify", prey, macro, verbose);

  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  if (macro.gooDigestion) {
    update([sound, line, linesummary, newline]);
    add_victim_people("goo", prey);
  } else {
    update([sound, line, newline]);
  }
}

function vomit() {
  let prey = new Container();

  for (let i = 0; i < macro.stomach.contents.length; i++) {
    prey = prey.merge(macro.stomach.contents[i]);
    macro.stomach.contents[i] = new Container();
  }

  let line = describe("vomit", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);
  let preyMass = prey.sum_property("mass");
  let sound = getSound("vomit", preyMass);

  update([sound, line, linesummary, newline]);
  add_victim_people("vomit", prey);
}

function move_prey(from, to) {
  let prey = new Container();

  for (let i = 0; i < from.contents.length; i++) {
    prey = prey.merge(from.contents[i]);
    from.contents[i] = new Container();
  }

  to.feed(prey);

  return prey;
}

function goo_move_prey(from, to, name) {
  let prey = move_prey(from, to);
  let line = describe(name, prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);
  let preyMass = prey.sum_property("mass");
  let sound = getSound("goo", preyMass);

  update([sound, line, linesummary, newline]);
}

function goo_stomach_pull() {
  return goo_move_prey(macro.stomach, macro.goo, "goo-stomach-pull");
}

function goo_stomach_push() {
  return goo_move_prey(macro.goo, macro.stomach, "goo-stomach-push");
}

function goo_bowels_pull() {
  return goo_move_prey(macro.bowels, macro.goo, "goo-bowels-pull");
}

function goo_bowels_push() {
  return goo_move_prey(macro.goo, macro.bowels, "goo-bowels-push");
}

function goo_womb_pull() {
  return goo_move_prey(macro.womb, macro.goo, "goo-womb-pull");
}

function goo_womb_push() {
  return goo_move_prey(macro.goo, macro.womb, "goo-womb-push");
}

function goo_balls_pull() {
  return goo_move_prey(macro.balls, macro.goo, "goo-balls-pull");
}

function goo_balls_push() {
  return goo_move_prey(macro.goo, macro.balls, "goo-balls-push");
}

function goo_breasts_pull() {
  return goo_move_prey(macro.breasts, macro.goo, "goo-breasts-pull");
}

function goo_breasts_push() {
  return goo_move_prey(macro.goo, macro.breasts, "goo-breasts-push");
}

function goo_tail_pull() {
  return goo_move_prey(macro.tail, macro.goo, "goo-tail-pull");
}

function goo_tail_push() {
  return goo_move_prey(macro.goo, macro.tail, "goo-tail-push");
}

function goo_paws_pull() {
  return goo_move_prey(macro.pawsVore, macro.goo, "goo-paws-pull");
}

function goo_paws_push() {
  return goo_move_prey(macro.goo, macro.pawsVore, "goo-paws-push");
}

function paw_vore()
{
  let prey = new Container();

  let lines = [];

  if ((!macro.footShoeEnabled || !macro.footShoeWorn) && (!macro.footSockEnabled || !macro.footSockWorn)) {
    let area = macro.pawArea;
    prey = prey.merge(getPrey(biome, area, macro.sameSizeVore));

    lines.push(describe("paw-vore", prey, macro, verbose));
  }

  if (macro.paws.container.count > 0) {
    prey = prey.merge(macro.paws.container);
    lines.push(describe("paw-vore-toes", macro.paws.container, macro, verbose));
    macro.paws.container = new Container();
  }

  if (macro.shoe.container.count > 0 && macro.footShoeWorn && (!macro.footSockEnabled || !macro.footSockWorn)) {
    prey = prey.merge(macro.shoe.container);
    lines.push(describe("paw-vore-toes", macro.shoe.container, macro, verbose));
    macro.shoe.container = new Container();
  }

  if (macro.sock.container.count > 0 && macro.footSockWorn) {
    prey = prey.merge(macro.sock.container);
    lines.push(describe("paw-vore-toes", macro.sock.container, macro, verbose));
    macro.sock.container = new Container();
  }

  if (lines.length == 0) {
    update(["Nothing happens...",newline]);
    return;
  }

  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let preyMass = prey.sum_property("mass");

  let sound = getSound("insert",preyMass);

  macro.addGrowthPoints(preyMass);

  macro.pawsVore.feed(prey);

  add_victim_people("paw-vore",prey);

  update([sound].concat(lines).concat([linesummary,newline]));

  macro.arouse(5);
}

function cooldown_start(name) {
  let button = document.querySelector("#" + "button-action-" + name);
  let parent = button.parentElement;

  let category = parent.id.replace("actions-", "");

  Array.from(parent.children).forEach(function(x) {
    x.disabled = true;
    x.classList.add("action-button-disabled");
  });

  cooldown(category, 100, 100);
}

function cooldown(category, time, timestart) {
  if (time <= 0) {
    cooldown_end(category);
  } else {
    let button = document.getElementById("action-part-" + category);

    let amount = Math.round((timestart - time) / timestart * 100);
    console.log(amount);

    let unselect = dark ? "#111" : "#ddd";
    let select = dark ? "#444" : "#555";

    button.style.setProperty("background", "linear-gradient(to right, " + select + " 0%, " + select + " " + amount + "%, " + unselect + " " + amount + "%, " + unselect + " 100%");
    setTimeout(function() { cooldown(category, time - 1, timestart); }, 20);
  }

}

function cooldown_end(category) {

    let button = document.getElementById("action-part-" + category);

    button.style.setProperty("background", null);

    let parent = document.querySelector("#actions-" + category);

    Array.from(parent.children).forEach(function(x) {
      x.disabled = false;
      x.classList.remove("action-button-disabled");
    });
}

function transformNumbers(line)
{
  return line.toString().replace(/[0-9]+(\.[0-9]+)?(e\+[0-9]+)?/g, function(text) { return number(text, numbers); });
}

function update(lines = [])
{
  let log = document.getElementById("log");

  lines.forEach(function (x) {
    let line = document.createElement('div');
    line.innerHTML = transformNumbers(x);
    log.appendChild(line);
  });

  if (lines.length > 0)
    log.scrollTop = log.scrollHeight;

  document.getElementById("height").innerHTML = "Height: " + transformNumbers(length(macro.height, unit));
  document.getElementById("mass").innerHTML = "Mass: " + transformNumbers(mass(macro.totalMass, unit));

  applyPercentage("arousal", 150 - macro.arousal * 1.5);
  applyPercentage("orgasm", 150 - (macro.arousal - 100) * 1.5);
  applyPercentage("edge", 150 - macro.edge * 150);
  stylePercentage("cum", macro.cumStorage);
  stylePercentage("femcum", macro.femcumStorage);
  stylePercentage("milk", macro.milkStorage);
  stylePercentage("gas", macro.gasStorage);
  stylePercentage("piss", macro.pissStorage);
  stylePercentage("scat", macro.scatStorage);
}

function applyPercentage(name, meterPos) {
  meterPos = meterPos < 0 ? 0 : meterPos;
  document.querySelector("#" + name + "Meter .fill").style.setProperty("transform", "translate(0px, " + Math.round(meterPos) + "px)");

  let meter = document.querySelector("#" + name + "Meter");
  if (meterPos == 0) {
    meter.classList.add("shaking");
  } else {
    meter.classList.remove("shaking");
  }
}

function stylePercentage(name, storage) {
  document.getElementById(name).innerHTML = name + ": " + transformNumbers(volume(storage.amount,unit,false));
  let meterPos = 150 - storage.amount / storage.limit * 150;
  applyPercentage(name, meterPos);
}

function pick_move()
{
  setTimeout(pick_move, 1500 * (1 + Math.log10(macro.scale)));
  if (!strolling) {
    return;
  }

  stomp();
}

function grow_part_pick(id) {
  document.querySelector(".growth-part-active").classList.remove("growth-part-active");
  document.querySelector("#" + id).classList.add("growth-part-active");
}

function grow_pick(times) {

  let button = document.querySelector(".growth-part-active");

  switch (button.id.replace("button-growth-", "")) {
    case "body": grow(times); break;
    case "paws": grow_paws(times); break;
    case "tail": grow_tail(times); break;
    case "ass": grow_ass(times); break;
    case "dick": grow_dick(times); break;
    case "balls": grow_balls(times); break;
    case "slit": grow_vagina(times); break;
    case "breasts": grow_breasts(times); break;
  }
}

function grow(factor=1)
{

  let oldHeight = macro.height;
  let oldMass = macro.mass;

  macro.scale *= factor;

  let newHeight = macro.height;
  let newMass = macro.mass;

  let heightDelta = newHeight - oldHeight;
  let massDelta = newMass - oldMass;

  let heightStr = length(heightDelta, unit);
  let massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function grow_paws(factor)
{

  let oldArea = macro.pawArea;

  macro.pawScale *= factor;

  let areaDelta = macro.pawArea - oldArea;

  let areaStr = area(areaDelta, unit, false);

  update(["Power surges through you as your " + macro.footDesc(true) + " grow, gaining " + areaStr + " of area.",newline]);
}

function grow_tail(factor)
{

  let oldLength = macro.tailLength;
  let oldMass = macro.tailMass;

  macro.tailScale *= factor;

  let lengthDelta = macro.tailLength - oldLength;
  let massDelta = macro.tailMass - oldMass;
  update(["Power surges through you as your " + macro.tailType + " tail grows " + length(lengthDelta, unit, false) + " longer and gains " + mass(massDelta, unit, false) + " of mass",newline]);
}

function grow_dick(factor)
{

  let oldLength = macro.dickLength;
  let oldMass = macro.dickMass;

  macro.dickScale *= factor;

  let lengthDelta = macro.dickLength - oldLength;
  let massDelta = macro.dickMass - oldMass;
  update(["Power surges through you as your " + macro.dickType + " cock grows " + length(lengthDelta, unit, false) + " longer and gains " + mass(massDelta, unit, false) + " of mass",newline]);
}

function grow_balls(factor)
{


  let oldDiameter = macro.ballDiameter;
  let oldMass = macro.ballMass;

  macro.ballScale *= factor;

  let diameterDelta = macro.ballDiameter - oldDiameter;
  let massDelta = macro.ballMass - oldMass;
  update(["Power surges through you as your balls swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_breasts(factor)
{


  let oldDiameter = macro.breastDiameter;
  let oldMass = macro.breastMass;

  macro.breastScale *= factor;

  let diameterDelta = macro.breastDiameter - oldDiameter;
  let massDelta = macro.breastMass - oldMass;
  update(["Power surges through you as your breasts swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_vagina(factor)
{

  let oldLength = macro.vaginaLength;

  macro.vaginaScale *= factor;

  let lengthDelta = macro.vaginaLength - oldLength;

  update(["Power surges through you as your moist slit expands by by " + length(lengthDelta, unit, false),newline]);
}

function grow_ass(factor)
{


  let oldDiameter = Math.pow(macro.assArea,1/2);

  macro.assScale *= factor;

  let diameterDelta = Math.pow(macro.assArea,1/2) - oldDiameter;
  update(["Power surges through you as your ass swells by " + length(diameterDelta, unit, false),newline]);
}

function resetSettings() {
  document.forms.namedItem("custom-species-form").reset();
  updateAllPreviews();
}

function loadPreset() {
  resetSettings();

  let select = document.getElementById("character-presets");

  loadSettings(presets[select.selectedIndex]);
}

function generateSettings() {
  let form = document.forms.namedItem("custom-species-form");
  let settings = {};
  for (let i=0; i<form.length; i++) {
    let value = form[i].value == "" ? form[i].placeholder : form[i].value;
    if (form[i].type == "text")
      settings[form[i].name] = value;
    else if (form[i].type == "number")
      settings[form[i].name] = parseFloat(value);
    else if (form[i].type == "checkbox") {
      settings[form[i].name] = form[i].checked;
    } else if (form[i].type == "radio") {
      let name = form[i].name;
      if (form[i].checked)
        settings[name] = form[i].value;
    } else if (form[i].type == "select-one") {
      settings[form[i].name] = form[i][form[i].selectedIndex].value;
    }
  }

  return settings;
}

function clearExport() {
  document.getElementById("export-area").value = "";
}

function exportSettings() {
  let settings = generateSettings();

  document.getElementById("export-area").value = JSON.stringify(settings);
}

function importSettings() {
  let settings = JSON.parse(document.getElementById("export-area").value);

  loadSettings(settings);
}

function saveSettings() {
  let storage = window.localStorage;

  let settings = generateSettings();

  storage.setItem('settings',JSON.stringify(settings));
}

function loadAutosave() {
  if (window.localStorage.getItem('autosave') == null)
    return;

  loadSettings(JSON.parse(window.localStorage.getItem('autosave')));
}

function loadSettings(settings = null) {

  if (settings == null) {
    if (window.localStorage.getItem('settings') == null)
      return;

    let storage = window.localStorage;

    settings = JSON.parse(storage.getItem('settings'));
  }
  let form = document.forms.namedItem("custom-species-form");

  for (let i=0; i<form.length; i++) {
    if (settings[form[i].name] != undefined) {
      if (form[i].type == "text")
        form[i].value = settings[form[i].name];
      else if (form[i].type == "number")
        form[i].value = settings[form[i].name];
      else if (form[i].type == "checkbox") {
        form[i].checked = settings[form[i].name];
      } else if (form[i].type == "radio") {
        let name = form[i].name;
        form[i].checked = (settings[name] == form[i].value);
      } else if (form[i].type == "select-one") {
        for (let j=0; j<form[i].length; j++) {
          if (form[i][j].value == settings[form[i].name]) {
            form[i].selectedIndex = j;
            break;
          }
        }
      }
    }
  }
  updateAllPreviews();
}

function add_victim_people(category, prey) {
  victims[category]["people"] += get_living_prey(prey.sum());
  update();
}

function enable_victim(category, name) {
  victims[category] = {};
  victims[category]["people"] = 0;
  victims[category]["name"] = name;
}

function enable_button(name) {
  document.getElementById("button-action-" + name).style.display = "inline";
}

function disable_button(name) {
  document.getElementById("button-action-" + name).style.display = "none";
}

function enable_panel(name) {
  document.getElementById("action-part-" + name).style.display = "inline";
}

function enable_stat(name) {
  document.getElementById(name).style.display = 'block';
  document.querySelector("#" + name + "Meter").style.display = 'inline-block';
}

function enable_growth_part(name) {
  document.querySelector("#button-growth-" + name).style.display = 'block';
}

function disable_button(name) {
  document.getElementById("button-action-" + name).style.display = "none";
}

function disable_panel(name) {
  document.getElementById("action-part-" + name).style.display = "none";
}

function startGame(e) {
  if (started)
    return;

  started = true;

  window.localStorage.setItem('autosave',JSON.stringify(generateSettings()));

  let warns = [];
  let settings = generateSettings();

  for (var key in settings) {
    if (settings.hasOwnProperty(key)) {
      macro[key] = settings[key];
    }
  }

  registerActions();

  if (!macro.hasTail) {
    macro.tailCount = 0;
  }

  enable_growth_part("paws");
  enable_victim("stomped","Stomped");
  enable_victim("flex-toes","Squished between toes");
  enable_victim("eaten","Devoured");
  enable_victim("ass-crush","Sat on");
  enable_victim("humped","Humped");

  document.getElementById("log-area").style.display = 'inline';
  document.getElementById("character-build-area").style.display = 'none';
  document.getElementById("action-panel").style.display = 'flex';

  enable_panel("options");

  enable_panel("body");
  enable_button("feed");

  if (macro.oralDigestTime == 0) {
    enable_button("digest_stomach");
  }

  enable_panel("paws");

  enable_button("stomp");

  if (macro.vomitEnabled) {
    enable_button("vomit");
    enable_victim("vomit");
  }

  if (macro.footType != "hoof")
    enable_button("flex_toes");

  enable_button("sit");
  enable_button("grind");

  enable_growth_part("body");
  enable_growth_part("ass");

  if (macro.brutality > 0) {
    warns.push("Fatal actions are enabled.");
    enable_button("chew");
    enable_victim("chew","Chewed");
  }

  if (macro.arousalEnabled) {
    document.querySelector("#arousalMeter").style.display = 'inline-block';
    document.querySelector("#orgasmMeter").style.display = 'inline-block';
    document.querySelector("#edgeMeter").style.display = 'inline-block';
  }

  if (macro.analVore) {
    enable_button("anal_vore");
    enable_victim("anal-vore","Anal vore");

    if (macro.analDigestTime == 0) {
      enable_button("digest_anal");
    }
  }

  if (macro.tailCount > 0) {
    enable_panel("tails");
    enable_growth_part("tail");
    enable_button("tail_slap");
    enable_victim("tail-slap","Tail slapped");

    if (macro.tailMaw) {
      enable_victim("tail-vore","Tailmaw'd");
      if (macro.tailCount > 1) {
        enable_button("tail_vore_one");
        enable_button("tail_vore_some");
        enable_button("tail_vore_all");
      } else {
        enable_button("tail_vore_only");
      }

      if (macro.tailDigestTime == 0) {
        enable_button("digest_tail");
      }
    }
  }

  if (macro.maleParts) {
    enable_panel("dick");

    enable_victim("cock-slap","Cockslapped");
    enable_victim("cock-vore","Cock vore");
    enable_victim("ball-smother","Smothered under balls");

    enable_button("cockslap");
    enable_button("cock_vore");
    enable_button("ball_smother");

    enable_stat("cum");

    enable_growth_part("dick");
    enable_growth_part("balls");

    if (macro.cockDigestTime == 0) {
      enable_button("digest_cock");
    }

    if (macro.hasSheath) {
      enable_victim("sheath-crush","Crushed in sheath");
      enable_victim("sheath-absorb","Absorbed by sheath");

      enable_button("sheath_stuff");
      enable_button("sheath_toy");
      enable_button("sheath_clench");
      enable_button("sheath_absorb");
    }

    if (macro.arousalEnabled) {
      enable_victim("cum-flood","Flooded by cum");

      if (macro.maleMuskEnabled) {
        enable_victim("male-spurt-musk","Inundated in masculine precum musk");
        enable_victim("male-orgasm-musk","Inundated in masculine cum musk");
      }
    }
  }

  if (macro.femaleParts) {
    enable_victim("unbirth","Unbirthed");

    enable_panel("vagina");

    enable_button("unbirth");
    enable_button("slit_toy");

    enable_stat("femcum");

    enable_growth_part("slit");

    if (macro.arousalEnabled) {
      enable_victim("femcum-flood","Flooded by femcum");

      if (macro.femaleMuskEnabled) {
        enable_victim("female-spurt-musk","Inundated in feminine precum musk");
        enable_victim("female-orgasm-musk","Inundated in feminine cum musk");
      }
    }

    if (macro.unbirthDigestTime == 0) {
      enable_button("digest_unbirth");
    }
  }

  if (macro.hasBreasts) {
    enable_victim("breast-crush","Crushed under breasts");
    enable_victim("cleavage-crush","Crushed in cleavage");
    enable_victim("cleavage-absorb","Absorbed by cleavage");
    enable_victim("cleavage-drop","Dropped from cleavage");

    enable_panel("breasts");

    enable_button("breast_crush");
    enable_button("breast_toy");
    enable_button("cleavage_stuff");
    enable_button("cleavage_crush");
    enable_button("cleavage_drop");
    enable_button("cleavage_absorb");

    enable_growth_part("breasts");

    if (macro.lactationEnabled) {
      warns.push("Lactation is enabled.");
      enable_victim("milk-flood","Flooded by milk");

      enable_button("breast_milk");
      enable_stat("milk");
    }

    if (macro.breastVore) {
      enable_victim("breast-vore","Stuffed into breasts");

      enable_button("breast_vore");

      if (macro.breastDigestTime == 0) {
        enable_button("digest_breast");
      }
    }
  }

  if (macro.hasPouch) {
    enable_victim("pouch-absorb","Absorbed into pouch");

    enable_panel("misc");

    enable_button("pouch_stuff");
    enable_button("pouch_rub");
    enable_button("pouch_eat");
    enable_button("pouch_absorb");

  }

  if (macro.soulVoreEnabled) {
    warns.push("Soul vore is enabled.");
    enable_victim("soul-digest","Souls digested");
    enable_victim("soul-paw","Souls absorbed underfoot");

    enable_panel("souls");

    enable_button("soul_vore");
    enable_button("soul_absorb_paw");

    if (macro.soulDigestTime == 0) {
      enable_button("digest_soul");
    }

  }

  if (macro.stenchEnabled) {
    warns.push("Stench is enabled.");
    enable_victim("paw-stench","Smothered in paw stench");
    enable_victim("ass-stench","Smothered in rump stench");
  }

  if (macro.gasEnabled) {
    warns.push("Gas is enabled.");
    enable_stat("gas");
    if (macro.belchEnabled) {
      enable_panel("waste");
      enable_button("belch");
      enable_victim("gas-belch","Belched on");
    }
    if (macro.fartEnabled) {
      enable_panel("waste");
      enable_button("fart");
      enable_victim("gas-fart","Farted on");
    }
  }

  if (macro.footWear) {
    enable_panel("shoes");

    macro.footShoeWorn = macro.footShoeEnabled;
    macro.footSockWorn = macro.footSockEnabled;

    footwearUpdate();
  }

  if (macro.pissEnabled) {
    warns.push("Watersports are enabled.");
    enable_panel("waste");

    enable_button("piss");

    enable_stat("piss");

    enable_victim("piss","Pissed away");

    if (macro.bladderVore) {
      enable_button("bladder_vore");

      enable_victim("bladder_vore","Dissolved into piss");

      if (macro.bladderDigestTime == 0) {
        enable_button("digest_bladder");
      }
    }

    if (macro.stenchEnabled) {
      enable_victim("piss-stench","Smothered in piss stench");
    }
  }

  if (macro.scatEnabled) {
    warns.push("Scat is enabled.");
    enable_panel("waste");

    enable_button("scat");

    enable_stat("scat");

    enable_victim("scat","Shat on");

    if (macro.stenchEnabled) {
      enable_victim("scat-stench","Smothered in scat stench");
    }
  }

  if (macro.gooEnabled) {
    enable_panel("goo");

    enable_button("melt");

    if (macro.gooDigestion) {
      enable_victim("goo","Absorbed into the goo");
    }
  }

  if (macro.pawVoreEnabled) {
    enable_button("paw_vore");

    enable_victim("paw-vore","Absorbed into paws");

    if (macro.pawDigestTime == 0) {
      enable_button("digest_paws");
    }
  }

  document.getElementById("button-arousal").innerHTML = (macro.arousalEnabled ? "Arousal On" : "Arousal Off");
  if (!macro.arousalEnabled) {
    document.getElementById("arousal").style.display = "none";
    document.getElementById("edge").style.display = "none";
  }

  if (macro.victimsNoPeople) {
    contents_remove("Person");
  }

  if (macro.victimsHuman) {
    // oh god this is bad bad bad bad bad bad BAD BAD BAD BAD BAD
    things["Person"] = Human;
  }

  if (macro.victimsMacros) {
    contents_insert("Town","Macro",2,5);
    contents_insert("City","Macro",5,20);
    contents_insert("Continent","Macro",100,300);
  }

  macro.init();

  update(warns);

  document.getElementById("actions-body").style.display = 'flex';
  document.getElementById("stat-container").style.display = 'flex';

  window.scroll(0,0);
}

function actionTab(e) {
  let name = e.target.id;

  let target = "actions-" + name.replace(/action-part-/,"");

  document.querySelectorAll(".action-part-button.active").forEach(function (element) {
    element.classList.remove("active");
  });
  document.querySelectorAll(".action-tab").forEach(function (element) {
    element.style.display = "none";
  });

  e.target.classList.add("active");
  document.getElementById(target).style.display = "flex";
}

function showStats() {
  let lines = [];

  if (macro.brutality > 0) {
    lines.push("Total kills:");
  } else {
    lines.push("Total victims:");
  }

  let total = 0;
  for (var key in victims) {
    if (victims.hasOwnProperty(key)) {
      lines.push(victims[key]["name"] + ": " + victims[key]["people"]);
      total += victims[key]["people"];
    }
  }
  lines.push("Total: " + total);
  update(lines);
}

function registerActions() {
  let buttons = document.querySelectorAll("[id^='button-action']");

  buttons.forEach( function(button) {
    let name = button.id;
    name = name.replace(/button-action-/,"");
    if (macro.difficulty > 0) {
      button.addEventListener("click", function() { cooldown_start(name); window[name](); });
    } else {
      button.addEventListener("click", function() { window[name](); });
    }

  });
}

function updateAllPreviews() {
  document.querySelectorAll(".preview").forEach(function(prev) {
    let name = prev.id.replace("Preview","");
    updatePreview(name);
  });
}

function updatePreview(name) {
  let scale = document.getElementById("scale").value;
  if (scale == "")
    scale = document.getElementById("scale").placeholder;

  let element = document.getElementById(name);

  if (element == undefined)
    return;

  let value = element.value;
  let unitType = document.getElementById(name).dataset.unit;

  if (value == "")
    value = document.getElementById(name).placeholder;

  let result = "";

  if (unitType == undefined)
    return;

  if (unitType == "length")
    result = length(value * scale, unit);
  else if (unitType == "area")
    result = area(value * scale * scale, unit);
  else if (unitType == "volume")
    result = volume(value * scale * scale * scale, unit);
  else if (unitType == "mass")
    result = mass(value * scale * scale * scale, unit);

  document.getElementById(name + "Preview").innerHTML = result;
}

function debugLog() {
  console.log("Your character settings:");
  console.log(JSON.stringify(generateSettings()));
  console.log("Current macro state:");
  console.log(JSON.stringify( macro, function( key, value) {
    if( key == 'owner') { return "owner";}
    else {return value;}
  }));
  alert("Debug info has been logged to console. Press F12, click \"Console\", and copy all the text");
}

window.addEventListener('load', function(event) {

  (function() {
    let storage = window.localStorage;

    if (storage.getItem("dark-mode") != null) {
      setDarkMode(storage.getItem("dark-mode") === "true");
    }
  }());

  document.querySelectorAll("input[type='number']").forEach(function(x) {
    x.addEventListener("input", function() { updatePreview(x.id); });
  });

  updateAllPreviews();

  document.querySelector("#scale").addEventListener("input", updateAllPreviews);

  presets.sort(function(x,y) {return x.name.localeCompare(y.name); } );

  let list = document.getElementById("character-presets");

  for (let i=0; i < presets.length; i++) {
    let opt = document.createElement("option");
    opt.innerHTML = presets[i]["name"];
    opt.value = i;
    list.appendChild(opt);
  }

  document.querySelectorAll(".action-part-button").forEach(function (element) {
    element.addEventListener("click",actionTab);
  });

  document.getElementById("button-look").addEventListener("click",look);
  document.getElementById("button-stroll").addEventListener("click",toggle_auto);
  document.getElementById("button-numbers").addEventListener("click",toggle_numbers);
  document.getElementById("button-units").addEventListener("click",toggle_units);
  document.getElementById("button-verbose").addEventListener("click",toggle_verbose);
  document.getElementById("button-arousal").addEventListener("click",toggle_arousal);

  document.getElementById("button-dark-mode-options").addEventListener("click",toggleDarkMode);
  document.getElementById("button-dark-mode-game").addEventListener("click",toggleDarkMode);

  document.getElementById("button-units-options").addEventListener("click",toggle_units_options);

  document.getElementById("button-stats").addEventListener("click",showStats);
  document.getElementById("button-debug-log").addEventListener("click",debugLog);

  document.querySelectorAll(".growth-part").forEach(function (button) {
    button.addEventListener("click", function() { grow_part_pick(button.id); });
  });

  document.getElementById("button-growth-1.1").addEventListener("click",function() { grow_pick(1.1); });
  document.getElementById("button-growth-1.5").addEventListener("click",function() { grow_pick(1.5); });
  document.getElementById("button-growth-2").addEventListener("click",function() { grow_pick(2); });
  document.getElementById("button-growth-5").addEventListener("click",function() { grow_pick(5); });
  document.getElementById("button-growth-20").addEventListener("click",function() { grow_pick(20); });
  document.getElementById("button-growth-100").addEventListener("click",function() { grow_pick(100); });

  document.getElementById("button-load-preset").addEventListener("click",loadPreset);

  document.getElementById("button-export-clear").addEventListener("click",clearExport);
  document.getElementById("button-export-preset").addEventListener("click",exportSettings);
  document.getElementById("button-import-preset").addEventListener("click",importSettings);

  document.getElementById("button-reset-custom").addEventListener("click",resetSettings);
  document.getElementById("button-load-autosave").addEventListener("click",loadAutosave);

  document.getElementById("button-load-custom").addEventListener("click",function() { loadSettings(); });
  document.getElementById("button-save-custom").addEventListener("click",saveSettings);
  document.getElementById("button-start").addEventListener("click",startGame);
  setTimeout(pick_move, 2000);
});
