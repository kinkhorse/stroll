"use strict";

/*jshint browser: true*/
/*jshint devel: true*/

let presets = [{"name":"Fen","species":"crux","scale":"1","baseHeight":2.26,"baseMass":135,"basePawArea":0.1,"baseHandArea":0.1,"baseAnalVoreDiameter":0.1,"baseAssArea":0.4,"brutality":"1","victimsMilitary":false,"victimsMacros":false,"victimsMicros":false,"sameSizeVore":true,"sameSizeStomp":true,"soulVoreEnabled":true,"footType":"paw","analVore":true,"analVoreToStomach":false,"arousalEnabled":true,"arousalFactor":1,"hasTail":true,"tailCount":1,"tailType":"slinky","baseTailLength":1,"baseTailDiameter":0.3,"tailMaw":true,"hasPouch":true,"maleParts":true,"hasSheath":true,"dickType":"canine","baseDickLength":0.3,"baseDickDiameter":0.08,"baseBallDiameter":0.05,"baseCumRatio":1,"cumScale":1,"hasBreasts":true,"baseBreastDiameter":0.1,"lactationEnabled":true,"lactationFactor":0.25,"lactationScale":1,"breastVore":true,"femaleParts":true,"baseVaginaLength":0.1,"baseVaginaWidth":0.05,"baseFemcumRatio":1,"femcumScale":1},
{"name":"Mekuto","species":"wahsune","scale":"1","baseHeight":1.778,"baseMass":66,"basePawArea":0.1,"baseHandArea":0.1,"baseAnalVoreDiameter":0.1,"baseAssArea":0.25,"brutality":"1","victimsMilitary":false,"victimsMacros":false,"victimsMicros":false,"sameSizeVore":true,"sameSizeStomp":false,"soulVoreEnabled":false,"footType":"paw","analVore":true,"analVoreToStomach":true,"arousalEnabled":true,"arousalFactor":1,"hasTail":true,"tailCount":5,"tailType":"ravenous","baseTailLength":1.9,"baseTailDiameter":0.15,"tailMaw":true,"tailStretchiness":3,"hasPouch":false,"maleParts":true,"hasSheath":true,"dickType":"canine","baseDickLength":0.15,"baseDickDiameter":0.05,"dickStretchiness":3,"baseBallDiameter":0.03,"baseCumRatio":1,"cumScale":1,"hasBreasts":false,"baseBreastDiameter":0.1,"breastStretchiness":1,"lactationEnabled":true,"lactationFactor":0.25,"lactationScale":1,"breastVore":true,"femaleParts":false,"baseVaginaLength":0.1,"baseVaginaWidth":0.05,"vaginaStretchiness":1,"baseFemcumRatio":1,"femcumScale":1},
{"name":"Vulpes","species":"fox","scale":"1","baseHeight":2,"baseMass":73,"basePawArea":0.25,"baseHandArea":0.1,"baseAnalVoreDiameter":0.1,"baseAssArea":0.2,"brutality":"2","victimsMilitary":false,"victimsMacros":true,"victimsMicros":false,"sameSizeVore":false,"sameSizeStomp":false,"soulVoreEnabled":true,"footType":"paw","analVore":true,"analVoreToStomach":true,"arousalEnabled":true,"arousalFactor":1,"hasTail":true,"tailCount":1,"tailType":"fluffy","baseTailLength":1.3,"baseTailDiameter":0.3,"tailMaw":false,"tailStretchiness":1,"hasPouch":false,"maleParts":true,"hasSheath":true,"dickType":"sheathed","baseDickLength":0.25,"baseDickDiameter":0.1,"dickStretchiness":2,"baseBallDiameter":0.04,"baseCumRatio":1,"cumScale":1,"hasBreasts":false,"baseBreastDiameter":0.1,"breastStretchiness":1,"lactationEnabled":true,"lactationFactor":0.25,"lactationScale":1,"breastVore":true,"femaleParts":false,"baseVaginaLength":0.1,"baseVaginaWidth":0.05,"vaginaStretchiness":1,"baseFemcumRatio":1,"femcumScale":1},
{"name":"Noma","species":"Lynxcoon","scale":1,"baseHeight":8,"baseMass":4800,"basePawArea":2,"baseHandArea":1,"baseAssArea":0.4,"brutality":"1","victimsMilitary":true,"victimsMacros":true,"victimsMicros":true,"sameSizeVore":true,"sameSizeStomp":true,"footType":"paw","jawType":"jaw","footWear":true,"footSockEnabled":true,"footSock":"sock","footShoeEnabled":true,"footShoe":"boot","analVore":false,"baseAnalVoreDiameter":0.1,"analVoreToStomach":false,"arousalEnabled":false,"arousalFactor":1,"hasTail":true,"tailCount":1,"tailType":"fluffy coon","baseTailLength":14,"baseTailDiameter":4,"tailMaw":true,"tailStretchiness":2,"hasPouch":true,"maleParts":true,"hasSheath":true,"dickType":"feline","baseDickLength":4,"baseDickDiameter":1,"dickStretchiness":1,"baseBallDiameter":2,"baseCumRatio":1,"cumScale":1,"hasBreasts":false,"baseBreastDiameter":0.1,"lactationEnabled":true,"lactationFactor":0.25,"lactationScale":1,"breastVore":true,"breastStretchiness":1,"femaleParts":false,"baseVaginaLength":0.1,"baseVaginaWidth":0.05,"vaginaStretchiness":1,"baseFemcumRatio":1,"femcumScale":1,"stenchEnabled":false,"basePawStenchArea":1,"baseAssStenchArea":1,"gasEnabled":true,"belchEnabled":true,"fartEnabled":false,"gasScale":1,"baseGasDigestFactor":1,"gasScaleWithSize":true,"soulVoreEnabled":true,"soulVoreType":"body"}]

let errored = false;

window.onerror = function(msg, source, lineno, colno, error) {
  if (!errored) {
    errored = true;

    alert("An error occurred! Please press F12 to open the dev tools, then click the 'Console' tab and send any errors shown there to chemicalcrux\n\nScreenshotting the text and line number of the error would be great.\n\nAlso include the browser information that gets logged below it.\n\nThe error might also show up here: " + msg + " at " + lineno + "," + colno);

    console.log(navigator.userAgent);
  }
};

// do da dark mode

let dark = false;

function toggleDarkMode(e) {
  dark = !dark;
  setDarkMode(dark);
}

function setDarkMode(darkMode) {
  dark = darkMode;
  window.localStorage.setItem("dark-mode",dark);
  if (dark) {
    document.querySelector("body").classList.remove("light");
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
    document.querySelector("body").classList.add("light");
  }
}

let started = false;

let strolling = false;

let maxStomachDigest = 10;
let maxBowelsDigest = 10;

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
  "basePawArea": 0.1,
  get pawArea() { return this.scaling(this.basePawArea, this.scale, 2); },
  "baseAnalVoreDiameter": 0.1,
  get analVoreArea() { return this.scaling(Math.pow(this.baseAnalVoreDiameter, 2), this.scale, 2); },
  "baseAssArea": 0.4,
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
  "footShoeWorn": true,

  "footOnlyDesc": function(plural=false,capital=false) {
    let result = "";

    switch(this.footType) {
      case "paw":
        result = plural ? "paws" : "paw";
        break;
      case "hoof":
        result = plural ? "hooves" : "hoof";
        break;
      case "feet":
      case "avian":
        result = plural ? "feet" : "foot";
        break;
      }
    return capital ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  },

  "footDesc": function(plural=false,capital=false,possessive=true) {
    let result = "";
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

  "toeOnlyDesc": function(plural=false,capital=false) {
    let result = "";

    switch(this.footType) {
      case "paw":
        result = plural ? "toes" : "toe";
        break;
      case "hoof":
        result = plural ? "toes" : "toe";
        break;
      case "feet":
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
    return this.dickLength * Math.pow(this.dickDiameter,2) * Math.PI;
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
    return this.dickGirth * this.baseCumRatio * this.cumScale * (1 + this.edge) + Math.max(0,this.cumStorage.amount - this.cumStorage.limit);
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
    return this.vaginaArea * this.baseFemcumRatio * this.femcumScale * (1 + this.edge) + Math.max(0,this.femcumStorage.amount - this.femcumStorage.limit);
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

  "digest": function(owner,organ) {
    setTimeout(function() { owner.digest(owner,organ); }, 5000);

    let count = Math.min(organ.contents.length, organ.maxDigest);

    let container = organ.contents.pop();
    organ.contents.unshift(new Container());

    if (container.count == 0)
      return;

    if (organ.moves != undefined) {
      organ.moves.feed(container);
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

    let line = organ.describeDigestion(container);
    organ.fill(this,container);
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
      update([line,summary,soulLine,newline]);
    } else {
      update([line,summary,newline]);
    }

  },

  "stomach": {
    "name": "stomach",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
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
      owner.gasStorage.amount += container.sum_property("mass") * this.owner.gasDigestFactor / 1e4;
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

  "bowels": {
    "name" : "bowels",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
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
      owner.gasStorage.amount += container.sum_property("mass") * this.owner.gasDigestFactor / 1e3;
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
    "stages" : 3
  },

  "womb": {
    "name" : "womb",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion" : function(container) {
      return describe("womb",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      owner.femcumStorage.amount += container.sum_property("mass") / 1e3;
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
    "stages" : 2
  },

  "balls": {
    "name" : "balls",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container) {
      return describe("balls",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      owner.cumStorage.amount += container.sum_property("mass") / 1e3;
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
    "stages" : 2
  },

  "breasts": {
    "name" : "breasts",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      this.contents[0] = this.contents[0].merge(prey);
    },
    "describeDigestion": function(container) {
      return describe("breasts",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      if (macro.lactationEnabled) {
        owner.milkStorage.amount += container.sum_property("mass") / 1e3;
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
    "stages" : 2
  },

  soulVoreEnabled: true,

  "souls": {
    "name" : "souls",
    "setup": function(owner) {
      this.owner = owner;
      for (let i = 0; i < this.stages; i++)
        this.contents.push(new Container());
      owner.digest(owner,this);
    },
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
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

      if (prey.count == 0) {
        return "Your depths hold no souls.";
      } else {
        if (macro.brutality > 0)  {
          return "Your depths bubble and boil with energy, slowly digesting the " + (prey.count > 1 ? "souls of " : "soul of ") + prey.describe(false);
        } else {
          return "You feel " + (prey.count > 1 ? prey.count + " souls " : "a soul ") + "trapped in your depths.";
        }
      }
    },
    "contents" : [],
    "stages" : 2
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

  "init": function() {
    this.stomach.setup(this);
    this.bowels.setup(this);
    this.womb.setup(this);
    this.balls.setup(this);
    this.breasts.setup(this);
    this.souls.setup(this);
    this.cumStorage.owner = this;
    this.femcumStorage.owner = this;
    this.milkStorage.owner = this;
    this.gasStorage.owner = this;

    if (this.analVoreToStomach) {
      this.bowels.moves = this.stomach;
    }

    if (this.maleParts)
      this.fillCum(this);
    if (this.femaleParts)
      this.fillFemcum(this);
    if (this.lactationEnabled)
      this.fillBreasts(this);
    if (this.arousalEnabled)
      this.quenchExcess(this);
    if (this.gasEnabled)
      this.fillGas(this);
  },

  "maleParts": true,
  "femaleParts": true,

  "fillCum": function(self) {
    self.cumStorage.amount += self.cumScale * self.ballVolume / 1200;
    if (self.cumStorage.amount > self.cumStorage.limit)
      self.arouse(1 * (self.cumStorage.amount / self.cumStorage.limit - 1));
    setTimeout(function () { self.fillCum(self); }, 100);
    update();
  },

  "fillFemcum": function(self) {
    self.femcumStorage.amount += self.femcumScale * self.vaginaVolume / 1200;
    if (self.femcumStorage.amount > self.femcumStorage.limit)
      self.arouse(1 * (self.femcumStorage.amount / self.femcumStorage.limit - 1));
    setTimeout(function () { self.fillFemcum(self); }, 100);
    update();
  },

  "fillBreasts": function(self) {
    if (self.milkStorage.amount > self.milkStorage.limit) {
      breast_milk(null, self.milkStorage.amount - self.milkStorage.limit);
    }
    self.milkStorage.amount += self.lactationScale * self.milkStorage.limit / 1200;

    if (self.milkStorage.amount > self.milkStorage.limit) {
      self.milkStorage.amount = self.milkStorage.limit;
    }
    setTimeout(function () { self.fillBreasts(self); }, 100);
    update();
  },

  "fillGas": function(self) {
    self.gasStorage.amount += self.gasScale * self.gasStorage.limit / 3600;

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
      self.gasStorage.amount = self.gasStorage.limit*3/4;
    }
    setTimeout(function () { self.fillGas(self); }, 100);
    update();
  },

  "cumStorage": {
    "amount": 0,
    get limit() {
      return this.owner.ballVolume;
    }
  },

  "femcumStorage": {
    "amount": 0,
    get limit() {
      return this.owner.vaginaVolume;
    }
  },

  "milkStorage": {
    "amount": 0,
    get limit() {
      return this.owner.breastVolume * 2;
    }
  },

  "gasStorage": {
    "amount": 0,
    get limit() {
      return Math.pow(this.owner.scale,3) / 1000;
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


  get description() {
    let result = [];

    let line = "You are " + (macro.name == "" ? "" : macro.name + ", ") + "a " + length(macro.height, unit, true) + " tall " + macro.species + ". You weigh " + mass(macro.mass, unit) + ".";

    result.push(line);

    result.push(macro.stomach.description);
    result.push(macro.bowels.description);

    if (this.hasTail) {
      line = "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails sway as you walk. " : " tail sways as you walk. ");
      if (this.tailMaw) {
        line += (macro.tailCount > 1 ? "Their maws are drooling" : "Its maw is drooling");
      }
      result.push(line);
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
      result.push(macro.breasts.description);
    }

    if (this.soulVoreEnabled) {
      result.push(macro.souls.description);
    }

    if (this.hasPouch) {
      line = this.pouch.description;
      result.push(line);
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
    this.growthPoints += Math.round(50 * mass / (this.scale*this.scale));
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

function get_living_prey(sum) {
  let total = 0;
  for (let key in sum) {
    if (sum.hasOwnProperty(key)) {
      if (key == "Micro" || key == "Macro" || key == "Person" || key == "Cow")
        total += sum[key];
    }
  }

  return total;
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
  } else {
    document.getElementById("arousal").style.display = "none";
    document.getElementById("edge").style.display = "none";
  }

  macro.orgasm = false;
  macro.afterglow = false;

}

// lists out total people
function summarize(sum, fatal = true)
{
  let word;
  let count = get_living_prey(sum);
  if (fatal && macro.brutality > 0)
    word = count > 1 ? "kills" : "kill";
  else if (!fatal && macro.brutality > 0)
    word = "prey";
  else
    word = count > 1 ? "victims" : "victim";

  return "<b>(" + count + " " + word + ")</b>";
}

function getOnePrey(biome, area, sameSize = true)
{
  let potential = ["Person"];

  if (area >= areas["Planet"])
    potential = ["Planet","Star","Solar System","Galaxy"];
  else if (area >= areas["Town"])
    potential = ["Town","City","Continent","Planet"];
  else
    switch(biome) {
      case "suburb": potential = ["Person", "Car", "Bus", "Train", "House"]; break;
      case "city": potential = ["Person", "Car", "Bus", "Train", "Tram", "House", "Parking Garage"]; break;
      case "downtown": potential = ["Person", "Car", "Bus", "Tram", "Small Skyscraper", "Large Skyscraper", "Parking Garage"]; break;
      case "rural": potential = ["Person", "Barn", "House", "Cow"]; break;
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
    return new Container([new Person(1)]);
  else
    return new Container();
}

function getPrey(region, area, sameSize = false)
{
  let weights = {"Person": 1};

  if (area > areas["Planet"]) {
    weights = {
      "Planet": 1.47e-10,
      "Star": 1.7713746e-12,
      "Solar System": 4e-10,
      "Galaxy": 0.1,
    };
  }
  else if (area > areas["Town"]) {
    weights = {
      "Town": 0.00001,
      "City": 0.00005,
      "Continent": 0.0005,
      "Planet": 0.0001
    };
  }
  else {
    weights = {
      "Person": 0.017,
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
  var prey = fill_area(area,weights);

  if (prey.count == 0 && sameSize)
    return getOnePrey(biome, area, true);
  return prey;
}


function updateVictims(type,prey)
{
  /*
  let sums = prey.sum();

  for (let key in sums) {
    if (sums.hasOwnProperty(key)) {
      victims[type][key] += sums[key];
    }
  }*/
}

function feed()
{
  let area = macro.handArea;
  let prey = getPrey(biome, area, macro.sameSizeVore);

  let line = describe("eat", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());
  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Ulp.";
  } else if (people < 10) {
    sound = "Gulp.";
  } else if (people < 50) {
    sound = "Glrrp.";
  } else if (people < 500) {
    sound = "Glrrrpkh!";
  } else if (people < 5000) {
    sound = "GLRRKPKH!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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

  update([sound,line,linesummary,newline]);

  macro.arouse(10);
}

function stomp()
{
  let area = macro.pawArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("stomp", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);


  add_victim_people("stomped",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(5);

  if (macro.stenchEnabled) {
    paw_stench();
  }
}

function paw_stench() {

  let area = macro.pawStenchArea;
  let prey = getPrey(biome, area);
  let line = describe("paw-stench", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  if (prey.sum()["Person"] == undefined)
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
  let sound = "";

  if (people < 3) {
    sound = "Thump.";
  } else if (people < 10) {
    sound = "Crunch.";
  } else if (people < 50) {
    sound = "Crrrrunch.";
  } else if (people < 500) {
    sound = "SMASH!";
  } else if (people < 5000) {
    sound = "CCCRASH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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
  let sound = "Shlp";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.bowels.feed(prey);

  add_victim_people("anal-vore",prey);

  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function sit()
{
  if (macro.analVore)
    anal_vore();

  let area = macro.assArea;
  let crushed = getPrey(biome, area, macro.sameSizeStomp);

  let line = describe("ass-crush", crushed, macro, verbose);
  let linesummary = summarize(crushed.sum(), true);

  let people = get_living_prey(crushed.sum());
  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let crushedMass = crushed.sum_property("mass");

  macro.addGrowthPoints(crushedMass);



  update([sound,line,linesummary,newline]);

  add_victim_people("ass-crush",crushed);

  macro.arouse(5);

  if (macro.stenchEnabled) {
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

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Smish!";
  } else if (people < 500) {
    sound = "SQUISH!";
  } else if (people < 5000) {
    sound = "SMISH!";
  } else {
    sound = "Oh the humanity!";
  }

  macro.cleavage.add(prey);


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

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Smish!";
  } else if (people < 500) {
    sound = "SQUISH!";
  } else if (people < 5000) {
    sound = "SMISH!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump.";
  } else if (people < 10) {
    sound = "Splat.";
  } else if (people < 50) {
    sound = "Thump!";
  } else if (people < 500) {
    sound = "THUMP!";
  } else if (people < 5000) {
    sound = "SPLAT!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let sound = "Thump";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Slurp.";
  } else if (people < 50) {
    sound = "Shlrrrrp!";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SHLLLLURP!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("cleavage-absorb",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse((preyMass > 0 ? 15 : 5));
}

function breast_crush()
{
  let area = macro.breastArea;
  let prey = getPrey(biome, area, macro.sameSizeStomp);
  let line = describe("breast-crush", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("breast-crush",prey);


  update([sound,line,linesummary,newline]);

  if (macro.lactationEnabled && macro.milkStorage.amount / macro.milkStorage.limit > 0.5) {
    let amount = Math.min(macro.lactationVolume, (macro.milkStorage.amount / macro.milkStorage.limit - 0.5) * macro.milkStorage.limit);
    breast_milk(null, amount);
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

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Slurp.";
  } else if (people < 50) {
    sound = "Shlrrrrp!";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SHLLLLURP!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("breast-vore",prey);
  macro.breasts.feed(prey);


  update([sound,line,linesummary,newline]);

  if (macro.lactationEnabled && macro.milkStorage.amount / macro.milkStorage.limit > 0.5) {
    let amount = Math.min(macro.lactationVolume, (macro.milkStorage.amount / macro.milkStorage.limit - 0.5) * macro.milkStorage.limit);
    breast_milk(null, amount);
  }

  macro.arouse(10);
}

function breast_milk(e,vol)
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

  let sound = "Dribble.";

  if (people < 3) {
    sound = "Dribble.";
  } else if (people < 10) {
    sound = "Splash.";
  } else if (people < 50) {
    sound = "Splash!";
  } else if (people < 500) {
    sound = "SPLOOSH!";
  } else if (people < 5000) {
    sound = "SPLOOOOOOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.womb.feed(prey);
  add_victim_people("unbirth",prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(20);
}

function sheath_stuff()
{
  let area = Math.min(macro.handArea, macro.dickArea);
  let prey = getPrey(biome, area);
  let line = describe("sheath-stuff", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  macro.sheath.add(prey);
  update([sound,line,linesummary,newline]);

  macro.arouse(15);
}

function sheath_squeeze()
{
  let prey = macro.sheath.container;
  let line = describe("sheath-squeeze", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), false);

  let people = get_living_prey(prey.sum());

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  update([sound,line,linesummary,newline]);
  macro.arouse(15);
}

function sheath_crush()
{
  let prey = macro.sheath.container;
  macro.sheath.container = new Container();
  let line = describe("sheath-crush", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

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

  let sound = "";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }

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

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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

  let sound = "lp";

  if (people < 3) {
    sound = "Shlp.";
  } else if (people < 10) {
    sound = "Squelch.";
  } else if (people < 50) {
    sound = "Shlurrp.";
  } else if (people < 500) {
    sound = "SHLRP!";
  } else if (people < 5000) {
    sound = "SQLCH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Smoosh!";
  } else if (people < 500) {
    sound = "SMOOSH!";
  } else if (people < 5000) {
    sound = "SMOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let sound = "Spurt!";

  if (people < 3) {
    sound = "Spurt!";
  } else if (people < 10) {
    sound = "Sploosh!";
  } else if (people < 50) {
    sound = "Sploooooosh!";
  } else if (people < 500) {
    sound = "SPLOOSH!";
  } else if (people < 5000) {
    sound = "SPLOOOOOOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("cum-flood",prey);


  update([sound,line,linesummary,newline]);
}

function male_orgasm(vol,times)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("male-orgasm", prey, macro, verbose).replace("$TIMES",times).replace("$VOLUME",volume(vol*times,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Spurt!";

  if (people < 3) {
    sound = "Spurt!";
  } else if (people < 10) {
    sound = "Sploosh!";
  } else if (people < 50) {
    sound = "Sploooooosh!";
  } else if (people < 500) {
    sound = "SPLOOSH!";
  } else if (people < 5000) {
    sound = "SPLOOOOOOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("cum-flood",prey);

  update([sound,line,linesummary,newline]);
}

function female_spurt(vol)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("female-spurt", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Spurt!";

  if (people < 3) {
    sound = "Spurt!";
  } else if (people < 10) {
    sound = "Sploosh!";
  } else if (people < 50) {
    sound = "Sploooooosh!";
  } else if (people < 500) {
    sound = "SPLOOSH!";
  } else if (people < 5000) {
    sound = "SPLOOOOOOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("femcum-flood",prey);


  update([sound,line,linesummary,newline]);
}

function female_orgasm(vol,times)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("female-orgasm", prey, macro, verbose).replace("$TIMES",times).replace("$VOLUME",volume(vol*times,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Spurt!";

  if (people < 3) {
    sound = "Spurt!";
  } else if (people < 10) {
    sound = "Sploosh!";
  } else if (people < 50) {
    sound = "Sploooooosh!";
  } else if (people < 500) {
    sound = "SPLOOSH!";
  } else if (people < 5000) {
    sound = "SPLOOOOOOOOOOSH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("femcum-flood",prey);


  update([sound,line,linesummary,newline]);
}

function tail_slap()
{
  let area = macro.tailArea * macro.tailCount;
  let prey = getPrey(biome, area);
  let line = describe("tail-slap", prey, macro, verbose);
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Thump";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = prey.sum_property("mass");

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

  let people = get_living_prey(totalPrey.sum());

  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Ulp.";
  } else if (people < 10) {
    sound = "Gulp.";
  } else if (people < 50) {
    sound = "Glrrp.";
  } else if (people < 500) {
    sound = "Glrrrpkh!";
  } else if (people < 5000) {
    sound = "GLRRKPKH!";
  } else {
    sound = "Oh the humanity!";
  }
  let preyMass = totalPrey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.stomach.feed(totalPrey);
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

  let sound = "Thump";

  if (people < 3) {
    sound = "Slp.";
  } else if (people < 10) {
    sound = "Squeeze.";
  } else if (people < 50) {
    sound = "Thump!";
  } else if (people < 500) {
    sound = "THOOOMP!";
  } else if (people < 5000) {
    sound = "THOOOOOOOMP!";
  } else {
    sound = "Oh the humanity!";
  }

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
  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Ulp.";
  } else if (people < 10) {
    sound = "Gulp.";
  } else if (people < 50) {
    sound = "Glrrp.";
  } else if (people < 500) {
    sound = "Glrrrpkh!";
  } else if (people < 5000) {
    sound = "GLRRKPKH!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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
  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Slp.";
  } else if (people < 10) {
    sound = "Shlp.";
  } else if (people < 50) {
    sound = "Shlorp.";
  } else if (people < 500) {
    sound = "Shlrrrrp!";
  } else if (people < 5000) {
    sound = "SHLRP!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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
  let sound = "";
  if (people == 0) {
    sound = "";
  } else if (people < 3) {
    sound = "Ulp.";
  } else if (people < 10) {
    sound = "Gulp.";
  } else if (people < 50) {
    sound = "Glrrp.";
  } else if (people < 500) {
    sound = "Glrrrpkh!";
  } else if (people < 5000) {
    sound = "GLRRKPKH!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

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
  let sound = "";

  if (people < 3) {
    sound = "Thump!";
  } else if (people < 10) {
    sound = "Squish!";
  } else if (people < 50) {
    sound = "Crunch!";
  } else if (people < 500) {
    sound = "CRUNCH!";
  } else if (people < 5000) {
    sound = "CRRUUUNCH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("soul-paw",prey);


  update([sound,line,linesummary,newline]);

  macro.arouse(25);
}

function belch(vol)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("belch", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Urp.";

  if (people < 3) {
    sound = "Burp.";
  } else if (people < 10) {
    sound = "Urph.";
  } else if (people < 50) {
    sound = "Urrrrrph.";
  } else if (people < 500) {
    sound = "UUURRP!";
  } else if (people < 5000) {
    sound = "BUUUUURRRRRRRRRRPHHH!!";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("gas-belch",prey);


  update([sound,line,linesummary,newline]);
}

function fart(vol)
{
  let area = Math.pow(vol, 2/3);

  let prey = getPrey(biome, area);
  let line = describe("fart", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  let linesummary = summarize(prey.sum(), true);

  let people = get_living_prey(prey.sum());

  let sound = "Pft.";

  if (people < 3) {
    sound = "Pft.";
  } else if (people < 10) {
    sound = "Pffft.";
  } else if (people < 50) {
    sound = "Pfffbt.";
  } else if (people < 500) {
    sound = "Pffffffbt.";
  } else if (people < 5000) {
    sound = "PFFFBT.";
  } else {
    sound = "Oh the humanity!";
  }

  let preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  add_victim_people("gas-fart",prey);


  update([sound,line,linesummary,newline]);
}

function wear_shoes() {
  macro.footShoeWorn = true;

  let line = describe("wear-shoe",macro.shoe.container,macro,verbose);
  let summary = summarize(macro.shoe.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);
}

function remove_shoes() {
  macro.footShoeWorn = false;

  let line = describe("remove-shoe",macro.shoe.container,macro,verbose);
  let summary = summarize(macro.shoe.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);
}

function wear_socks() {
  macro.footSockWorn = true;

  let line = describe("wear-sock",macro.sock.container,macro,verbose);
  let summary = summarize(macro.sock.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);
}

function remove_socks() {
  macro.footSockWorn = false;

  let line = describe("remove-sock",macro.sock.container,macro,verbose);
  let summary = summarize(macro.sock.container.sum(),false);

  footwearUpdate();

  update([line,summary,newline]);
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

      if (!macro.footSockEnabled || macro.footSockWorn) {
        enable_button("wear_shoes");
      }
    }
  }

  if (!macro.footShoeEnabled || !macro.footShoeWorn) {
    if (macro.footSockEnabled) {
      if (macro.footSockWorn) {
        enable_button("remove_socks");
      } else {
        enable_button("wear_socks");
        enable_button("stuff_socks");
        enable_button("dump_socks");
      }
    }
  }

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
  document.getElementById("mass").innerHTML = "Mass: " + transformNumbers(mass(macro.mass, unit));
  document.getElementById("growth-points").innerHTML = "Growth Points:" + macro.growthPoints;
  document.getElementById("arousal").innerHTML = "Arousal: " + round(macro.arousal,0) + "%";
  document.getElementById("edge").innerHTML = "Edge: " + round(macro.edge * 100,0) + "%";
  document.getElementById("cum").innerHTML = "Cum: " + transformNumbers(volume(macro.cumStorage.amount,unit,false));
  document.getElementById("cumPercent").innerHTML = Math.round(macro.cumStorage.amount / macro.cumStorage.limit * 100) + "%";
  document.getElementById("femcum").innerHTML = "Femcum: " + transformNumbers(volume(macro.femcumStorage.amount,unit,false));
  document.getElementById("femcumPercent").innerHTML = Math.round(macro.femcumStorage.amount / macro.femcumStorage.limit * 100) + "%";
  document.getElementById("milk").innerHTML = "Milk: " + transformNumbers(volume(macro.milkStorage.amount,unit,false));
  document.getElementById("milkPercent").innerHTML = Math.round(macro.milkStorage.amount / macro.milkStorage.limit * 100) + "%";
  document.getElementById("gas").innerHTML = "Gas: " + transformNumbers(volume(macro.gasStorage.amount,unit,false));
  document.getElementById("gasPercent").innerHTML = Math.round(macro.gasStorage.amount / macro.gasStorage.limit * 100) + "%";

}

function pick_move()
{
  setTimeout(pick_move, 1500 * (1 + Math.log10(macro.scale)));
  if (!strolling) {
    return;
  }

  stomp();
}

function grow_pick(times) {
  if (document.getElementById("part-body").checked === true) {
    grow(times);
  }
  else if (document.getElementById("part-ass").checked === true) {
    grow_ass(times);
  }
  else if (document.getElementById("part-dick").checked === true) {
    grow_dick(times);
  }
  else if (document.getElementById("part-balls").checked === true) {
    grow_balls(times);
  }
  else if (document.getElementById("part-breasts").checked === true) {
    grow_breasts(times);
  }
  else if (document.getElementById("part-vagina").checked === true) {
    grow_vagina(times);
  }
}

function grow(times=1)
{
  if (macro.growthPoints < 100 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 100 * times;

  let oldHeight = macro.height;
  let oldMass = macro.mass;

  macro.scale *= Math.pow(1.02,times);

  let newHeight = macro.height;
  let newMass = macro.mass;

  let heightDelta = newHeight - oldHeight;
  let massDelta = newMass - oldMass;

  let heightStr = length(heightDelta, unit);
  let massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function grow_dick(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  let oldLength = macro.dickLength;
  let oldMass = macro.dickMass;

  macro.dickScale = Math.pow(macro.dickScale * macro.dickScale + 1.02*times, 1/2) ;

  let lengthDelta = macro.dickLength - oldLength;
  let massDelta = macro.dickMass - oldMass;
  update(["Power surges through you as your " + macro.dickType + " cock grows " + length(lengthDelta, unit, false) + " longer and gains " + mass(massDelta, unit, false) + " of mass",newline]);
}

function grow_balls(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  let oldDiameter = macro.ballDiameter;
  let oldMass = macro.ballMass;

  macro.ballScale = Math.pow(macro.ballScale * macro.ballScale + 1.02*times, 1/2) ;

  let diameterDelta = macro.ballDiameter - oldDiameter;
  let massDelta = macro.ballMass - oldMass;
  update(["Power surges through you as your balls swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_breasts(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  let oldDiameter = macro.breastDiameter;
  let oldMass = macro.breastMass;

  macro.breastScale = Math.pow(macro.breastScale * macro.breastScale + 1.02*times, 1/2) ;

  let diameterDelta = macro.breastDiameter - oldDiameter;
  let massDelta = macro.breastMass - oldMass;
  update(["Power surges through you as your breasts swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_vagina(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  let oldLength = macro.vaginaLength;

  macro.vaginaScale = Math.pow(macro.vaginaScale * macro.vaginaScale + 1.02*times, 1/2) ;

  let lengthDelta = macro.vaginaLength - oldLength;

  update(["Power surges through you as your moist slit expands by by " + length(lengthDelta, unit, false),newline]);
}

function grow_ass(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  let oldDiameter = Math.pow(macro.assArea,1/2);

  macro.assScale = Math.pow(macro.assScale * macro.assScale + 1.02*times, 1/2) ;

  let diameterDelta = Math.pow(macro.assArea,1/2) - oldDiameter;
  update(["Power surges through you as your ass swells by " + length(diameterDelta, unit, false),newline]);
}

function grow_lots()
{
  let oldHeight = macro.height;
  let oldMass = macro.mass;

  macro.scale *= 100;

  let newHeight = macro.height;
  let newMass = macro.mass;

  let heightDelta = newHeight - oldHeight;
  let massDelta = newMass - oldMass;

  let heightStr = length(heightDelta, unit);
  let massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function resetSettings() {
  document.forms.namedItem("custom-species-form").reset();
}

function loadPreset() {
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
  document.getElementById(name + "Percent").style.display = 'block';
}

function enable_growth_part(name) {
  document.querySelector("#part-" + name + "+label").style.display = 'inline';
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

  let settings = generateSettings();

  for (var key in settings) {
    if (settings.hasOwnProperty(key)) {
      macro[key] = settings[key];
    }
  }

  if (!macro.hasTail) {
    macro.tailCount = 0;
  }

  enable_victim("stomped","Stomped");
  enable_victim("eaten","Devoured");
  enable_victim("ass-crush","Sat on");
  enable_victim("humped","Humped");

  document.getElementById("log-area").style.display = 'inline';
  document.getElementById("custom-species").style.display = 'none';
  document.getElementById("action-panel").style.display = 'flex';

  enable_panel("body");
  enable_button("feed");
  enable_button("stomp");
  enable_button("sit");
  enable_button("grind");

  enable_growth_part("body");
  enable_growth_part("ass");

  if (macro.brutality > 0) {
    enable_button("chew");
    enable_victim("chew","Chewed");
  }

  if (macro.analVore) {
    enable_button("anal_vore");
    enable_victim("anal-vore","Anal vore");
  }

  if (macro.tailCount > 0) {
    enable_panel("tails");
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

    if (macro.hasSheath) {
      enable_victim("sheath-crush","Crushed in sheath");
      enable_victim("sheath-absorb","Absorbed by sheath");

      enable_button("sheath_stuff");
      enable_button("sheath_squeeze");
      enable_button("sheath_absorb");
    }

    if (macro.arousalEnabled) {
      enable_victim("cum-flood","Flooded by cum");
    }
  }

  if (macro.femaleParts) {
    enable_victim("unbirth","Unbirthed");

    enable_panel("vagina");

    enable_button("unbirth");

    enable_stat("femcum");

    enable_growth_part("vagina");

    if (macro.arousalEnabled) {
      enable_victim("femcum-flood","Flooded by femcum");
    }
  }

  if (macro.hasBreasts) {
    enable_victim("breast-crush","Crushed under breasts");
    enable_victim("cleavage-crush","Crushed in cleavage");
    enable_victim("cleavage-absorb","Absorbed by cleavage");
    enable_victim("cleavage-drop","Dropped from cleavage");

    enable_panel("breasts");

    enable_button("breast_crush");
    enable_button("cleavage_stuff");
    enable_button("cleavage_crush");
    enable_button("cleavage_drop");
    enable_button("cleavage_absorb");

    enable_growth_part("breasts");

    if (macro.lactationEnabled) {
      enable_victim("milk-flood","Flooded by milk");

      enable_button("breast_milk");
      enable_stat("milk");
    }

    if (macro.breastVore) {
      enable_victim("breast-vore","Stuffed into breasts");

      enable_button("breast_vore");
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
    enable_victim("soul-digest","Souls digested");
    enable_victim("soul-paw","Souls absorbed underfoot");

    enable_panel("souls");

    enable_button("soul_vore");
    enable_button("soul_absorb_paw");

  }

  if (macro.stenchEnabled) {
    enable_victim("paw-stench","Smothered in paw stench");
    enable_victim("ass-stench","Smothered in rump stench");
  }

  if (macro.gasEnabled) {
    enable_stat("gas");
    if (macro.belchEnabled) {
      enable_victim("gas-belch","Belched on");
    }
    if (macro.fartEnabled) {
      enable_victim("gas-fart","Farted on");
    }
  }

  if (macro.footWear) {
    enable_panel("shoes");

    macro.footShoeWorn = macro.footShoeEnabled;
    macro.footSockWorn = macro.footSockEnabled;

    footwearUpdate();
  }

  document.getElementById("button-arousal").innerHTML = (macro.arousalEnabled ? "Arousal On" : "Arousal Off");
  if (!macro.arousalEnabled) {
    document.getElementById("arousal").style.display = "none";
    document.getElementById("edge").style.display = "none";
  }


  //let species = document.getElementById("option-species").value;
  //let re = /^[a-zA-Z\- ]+$/;

  // tricksy tricksy players
  //if (re.test(species)) {
  //  macro.species = species;
  //}

  macro.init();

  update();

  document.getElementById("actions-body").style.display = 'flex';
  document.getElementById("stat-container").style.display = 'flex';
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
    button.addEventListener("click", window[name]);
  });
}

window.addEventListener('load', function(event) {

  (function() {
    let storage = window.localStorage;

    if (storage.getItem("dark-mode") != null) {
      setDarkMode(storage.getItem("dark-mode") === "true");
    }
  }());

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

  registerActions();

  document.getElementById("button-look").addEventListener("click",look);
  document.getElementById("button-stroll").addEventListener("click",toggle_auto);
  document.getElementById("button-numbers").addEventListener("click",toggle_numbers);
  document.getElementById("button-units").addEventListener("click",toggle_units);
  document.getElementById("button-verbose").addEventListener("click",toggle_verbose);
  document.getElementById("button-arousal").addEventListener("click",toggle_arousal);
  document.getElementById("button-grow-lots").addEventListener("click",grow_lots);

  document.getElementById("button-dark-mode-options").addEventListener("click",toggleDarkMode);
  document.getElementById("button-dark-mode-game").addEventListener("click",toggleDarkMode);

  document.getElementById("button-stats").addEventListener("click",showStats);

  document.getElementById("button-amount-1").addEventListener("click",function() { grow_pick(1); });
  document.getElementById("button-amount-5").addEventListener("click",function() { grow_pick(5); });
  document.getElementById("button-amount-10").addEventListener("click",function() { grow_pick(10); });
  document.getElementById("button-amount-20").addEventListener("click",function() { grow_pick(20); });
  document.getElementById("button-amount-50").addEventListener("click",function() { grow_pick(50); });
  document.getElementById("button-amount-100").addEventListener("click",function() { grow_pick(100); });

  document.getElementById("button-load-preset").addEventListener("click",loadPreset);

  document.getElementById("button-export-clear").addEventListener("click",clearExport);
  document.getElementById("button-export-preset").addEventListener("click",exportSettings);
  document.getElementById("button-import-preset").addEventListener("click",importSettings);

  document.getElementById("button-reset-custom").addEventListener("click",resetSettings);
  document.getElementById("button-load-custom").addEventListener("click",function() { loadSettings(); });
  document.getElementById("button-save-custom").addEventListener("click",saveSettings);
  document.getElementById("button-start").addEventListener("click",startGame);
  setTimeout(pick_move, 2000);
});
