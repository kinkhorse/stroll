var strolling = false;

var maxStomachDigest = 10;
var maxBowelsDigest = 10;

var unit = "metric";

var numbers = "full";

var verbose = true;

var biome = "suburb";

var newline = "&nbsp;";

victims = {};

var humanMode = true;

var macro =
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
  "baseAnalVoreArea": 0.1,
  get analVoreArea() { return this.scaling(this.baseAnalVoreArea, this.scale, 2); },
  "baseAssArea": 0.4,
  get assArea() { return this.scaling(this.baseAssArea * this.assScale, this.scale, 2); },
  "baseHandArea": 0.1,
  get handArea() { return this.scaling(this.baseHandArea, this.scale, 2); },

  "assScale": 1,

  "hasTail": true,
  "tailType": "slinky",
  "tailCount": 1,
  "baseTailLength": 1,
  "baseTailDiameter": 0.1,
  "tailDensity": 250,
  "tailScale": 1,
  "tailMaw": false,

  get tailLength() {
    return this.scaling(this.baseTailLength * this.tailScale, this.scale, 1);
  },
  get tailDiameter() {
    return this.scaling(this.baseTailDiameter * this.tailScale, this.scale, 1);
  },
  get tailGirth() {
    return Math.pow(this.tailDiameter/2,2) * Math.PI;
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
  "dickScale": 1,
  get dickLength() {
    factor = 1;
    if (!this.arousalEnabled || this.arousal < 25) {
      factor = 0.5;
    } else if (this.arousal < 75) {
      factor = 0.5 + (this.arousal - 25) / 100;
    }

    return this.scaling(this.baseDickLength * this.dickScale * factor, this.scale, 1);
  },
  get dickDiameter() {
    factor = 1;
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
  get dickArea() {
    return this.dickLength* this.dickDiameter* Math.PI / 2;
  },
  get dickVolume() {
    return this.dickLength* Math.pow(this.dickDiameter2,2) * Math.PI;
  },
  get dickMass() {
    return this.dickVolume* this.dickDensity;
  },
  "baseBallDiameter": 0.05,
  "ballDensity": 1000,
  "ballScale": 1,
  get ballDiameter() { return this.scaling(this.baseBallDiameter * this.ballScale, this.scale, 1); },
  get ballArea() { return 2 * Math.PI * Math.pow(this.ballDiameter/2, 2) },
  get ballVolume() {
    var radius = this.ballDiameter / 2;
    return 4/3 * Math.PI * Math.pow(radius,3);
  },
  get ballMass() {
    var volume = this.ballVolume;
    return volume * this.ballDensity;
  },

  "baseCumRatio": 1,
  "cumScale": 1,
  get cumVolume() {
    return this.dickGirth * this.baseCumRatio * this.cumScale * (1 + this.edge) + Math.max(0,this.cumStorage.amount - this.cumStorage.limit);
  },

  "baseVaginaLength": 0.1,
  "baseVaginaWidth": 0.05,
  "vaginaScale": 1,

  get vaginaLength() { return this.scaling(this.baseVaginaLength * this.vaginaScale, this.scale, 1); },
  get vaginaWidth() { return this.scaling(this.baseVaginaWidth * this.vaginaScale, this.scale, 1); },
  get vaginaArea() { return this.vaginaLength * this.vaginaWidth },
  get vaginaVolume() { return this.vaginaArea * this.vaginaWidth },
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
  "breastDensity": 1000,
  get breastDiameter() { return this.scaling(this.baseBreastDiameter * this.breastScale, this.scale, 1); },
  get breastArea() {
    return 2 * Math.PI * Math.pow(this.breastDiameter/2,2);
  },
  get breastVolume() {
    var radius = this.breastDiameter / 2;
    return 4/3 * Math.PI * Math.pow(radius,3);
  },
  get breastMass() {
    var volume = this.breastVolume;
    return volume * this.breastDensity;
  },

  "digest": function(owner,organ) {
    var count = Math.min(organ.contents.length, organ.maxDigest);

    var container = new Container();

    while (count > 0) {
      var victim = organ.contents.shift();
      if (victim.name != "Container")
        victim = new Container([victim]);
      container = container.merge(victim);
      --count;
    }

    var digested = container.sum();

    for (var key in victims[organ.name]) {
      if (victims[organ.name].hasOwnProperty(key) && digested.hasOwnProperty(key) ) {
        victims["digested"][key] += digested[key];
        victims[organ.name][key] -= digested[key];
      }
    }

    var line = organ.describeDigestion(container);
    organ.fill(this,container);
    var summary = summarize(container.sum());

    if (organ.contents.length > 0) {
      setTimeout(function() { owner.digest(owner,organ) }, 15000);
    }

    update([line,summary,newline]);
  },

  "stomach": {
    "name": "stomach",
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (self.contents.length == 0)
        setTimeout(function() { owner.digest(owner,self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion": function(container) {
      return describe("stomach",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      //no-op
    },
    "contents": [],
    "maxDigest": 5
  },

  "bowels": {
    "name" : "bowels",
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (self.contents.length == 0)
        setTimeout(function() { owner.digest(owner,self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion" : function(container) {
      return describe("bowels",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      //no-op
    },
    "contents" : [],
    "maxDigest" : 3
  },

  "womb": {
    "name" : "womb",
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (self.contents.length == 0)
        setTimeout(function() { owner.digest(owner,self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion" : function(container) {
      return describe("womb",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      owner.femcumStorage.amount += container.sum_property("mass") / 1e3;
    },
    "contents" : [],
    "maxDigest" : 1
  },

  "balls": {
    "name" : "balls",
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (self.contents.length == 0)
        setTimeout(function() { owner.digest(owner,self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion": function(container) {
      return describe("balls",container,this.owner,verbose);
    },
    "fill": function(owner,container) {
      owner.cumStorage.amount += container.sum_property("mass") / 1e3;
    },
    "contents" : [],
    "maxDigest" : 1
  },

  "init": function() {
    this.stomach.owner = this;
    this.bowels.owner = this;
    this.womb.owner = this;
    this.balls.owner = this;
    this.cumStorage.owner = this;
    this.femcumStorage.owner = this;
    this.milkStorage.owner = this;

    if (this.maleParts)
      this.fillCum(this);
    if (this.femaleParts)
      this.fillFemcum(this);
    if (this.lactationEnabled)
      this.fillBreasts(this);
    if (this.arousalEnabled) {
      this.quenchExcess(this);
    }
  },

  "maleParts": true,
  "femaleParts": true,

  "fillCum": function(self) {
    self.cumStorage.amount += self.cumScale * self.ballVolume / 1200;
    if (self.cumStorage.amount > self.cumStorage.limit)
      self.arouse(1 * (self.cumStorage.amount / self.cumStorage.limit - 1));
    setTimeout(function () { self.fillCum(self) }, 100);
    update();
  },

  "fillFemcum": function(self) {
    self.femcumStorage.amount += self.femcumScale * self.vaginaVolume / 1200;
    if (self.femcumStorage.amount > self.femcumStorage.limit)
      self.arouse(1 * (self.femcumStorage.amount / self.femcumStorage.limit - 1));
    setTimeout(function () { self.fillFemcum(self) }, 100);
    update();
  },

  "fillBreasts": function(self) {
    self.milkStorage.amount += self.lactationScale * self.milkStorage.limit / 1200;
    if (self.milkStorage.amount > self.milkStorage.limit)
      self.milkStorage.amount = self.milkStorage.limit;
    setTimeout(function () { self.fillBreasts(self) }, 100);
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
        }
        if (this.femaleParts) {
          this.femaleOrgasm(this);
        }
        if (!this.maleParts && !this.femaleParts) {
          this.nullOrgasm(this);
        }
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
      self.quench(10);
      var amount = Math.min(this.cumVolume, this.cumStorage.amount);
      this.cumStorage.amount -= amount;
      male_orgasm(amount);
      setTimeout(function() { self.maleOrgasm(self) }, 2000);
    }
  },

  "femaleOrgasm": function(self) {
    if (!this.arousalEnabled)
      return;

    if (this.orgasm) {
      this.quench(10);
      var amount = Math.min(this.femcumVolume, this.femcumStorage.amount);
      this.femcumStorage.amount -= amount;
      female_orgasm(amount);
      setTimeout(function() { self.femaleOrgasm(self) }, 2000);
    }
  },

  "nullOrgasm": function(self) {
    if (!this.arousalEnabled)
      return;

    if (this.orgasm) {
      this.quench(10);
      setTimeout(function() { self.nullOrgasm(self) }, 2000);
    }
  },


  get description() {
    result = [];
    line = "You are " + (macro.name == "" ? "" : macro.name + ", ") + "a " + length(macro.height, unit, true) + " tall " + macro.species + ". You weigh " + mass(macro.mass, unit) + ".";
    result.push(line);

    if (this.hasTail) {
      line = "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails sway as you walk," : "sways as you walk.");
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
      line = "Your " + this.describeDick + " cock hangs from your hips, with two " + mass(macro.ballMass, unit, true) + ", " + length(macro.ballDiameter, unit, true) + "-wide balls hanging beneath.";
      result.push(line);
    }
    if (this.femaleParts) {

      line = "Your glistening " + this.describeVagina + " slit peeks out from between your legs."
      result.push(line);
    }
    if (this.hasBreasts) {
      line = "You have two " + length(macro.breastDiameter, unit, true) + "-wide breasts that weigh " + mass(macro.breastMass, unit) + " apiece.";
      result.push(line);
    }

    return result;
  },

  get describeTail() {
    return (this.tailCount > 1 ? this.tailCount + " " : "") + length(this.tailLength, unit, true) + "-long " + this.tailType;
  },


  get describeDick() {
    state = "";
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
    state = "";
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

    return length(this.vaginaLength, unit, true) + " long " + state
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
}

function look()
{
  var desc = macro.description;

  var line2 = ""

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
  var total = 0;
  for (var key in sum) {
    if (sum.hasOwnProperty(key)) {
      if (key == "Person" || key == "Cow")
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

function change_location()
{
  switch(biome) {
    case "suburb": biome = "city"; break;
    case "city": biome = "downtown"; break;
    case "downtown": biome = "rural"; break;
    case "rural": biome = "suburb"; break;
  }

  document.getElementById("button-location").innerHTML = "Location: " + biome.charAt(0).toUpperCase() + biome.slice(1);
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

  document.getElementById("button-verbose").innerHTML = (verbose ? "Verbose" : "Simple");
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

function initVictims()
{
  return {
    "Person": 0,
    "Cow": 0,
    "Car": 0,
    "Bus": 0,
    "Tram": 0,
    "Motorcycle": 0,
    "House": 0,
    "Barn": 0,
    "Small Skyscraper": 0,
    "Large Skyscraper": 0,
    "Train": 0,
    "Train Car": 0,
    "Parking Garage": 0,
    "Overpass": 0,
    "Town": 0,
    "City": 0,
    "Continent": 0,
    "Planet": 0,
    "Star": 0,
    "Solar System": 0,
    "Galaxy": 0
  };
};

// lists out total people
function summarize(sum, fatal = true)
{
  var word;
  var count = get_living_prey(sum);
  if (fatal && macro.brutality > 0)
    word = count > 1 ? "kills" : "kill";
  else if (!fatal && macro.brutality > 0)
    word = "prey";
  else
    word = count > 1 ? "victims" : "victim";

  return "<b>(" + count + " " + word + ")</b>";
}

function getOnePrey(biome,area)
{
  var potential = ["Person"];

  if (macro.height > 1e12)
    potential = ["Planet","Star","Solar System","Galaxy"];
  else if (macro.height > 1e6)
    potential = ["Town","City","Continent","Planet"];
  else
    switch(biome) {
      case "suburb": potential = ["Person", "Car", "Bus", "Train", "House"]; break;
      case "city": potential = ["Person", "Car", "Bus", "Train", "Tram", "House", "Parking Garage"]; break;
      case "downtown": potential = ["Person", "Car", "Bus", "Tram", "Small Skyscraper", "Large Skyscraper", "Parking Garage"]; break;
      case "rural": potential = ["Person", "Barn", "House", "Cow"]; break;
    }

  var potAreas = []

  potential.forEach(function (x) {
    potAreas.push([x,areas[x]]);
  });

  potAreas = potAreas.sort(function (x,y) {
    return y[1] - x[1];
  });

  for (var i=0; i<potAreas.length; i++) {
    x = potAreas[i];
    if (x[1] < area) {
      return new Container([new things[x[0]](1)]);
    }
  };

  return new Container([new Person(1)]);
}
function getPrey(region, area)
{
  var weights = {"Person": 1};

  if (macro.height > 1e12) {
    weights = {
      "Planet": 1.47e-10,
      "Star": 1.7713746e-12,
      "Solar System": 4e-10,
      "Galaxy": 0.1,
    }
  }
  else if (macro.height > 1e6) {
    weights = {
      "Town": 0.1,
      "City": 0.05,
      "Continent": 0.005,
      "Planet": 0.0001
    }
  }
  else {
    switch(region)
    {
      case "rural": weights = {
        "Person": 0.05,
        "House": 0.01,
        "Barn": 0.01,
        "Cow": 0.2
      }; break;
      case "suburb": weights = {
        "Person": 0.5,
        "House": 0.5,
        "Car": 0.2,
        "Train": 0.1,
        "Bus": 0.1
      }; break;
      case "city": weights = {
        "Person": 0.5,
        "House": 0.2,
        "Car": 0.2,
        "Train": 0.1,
        "Bus": 0.1,
        "Tram": 0.1,
        "Parking Garage": 0.02
      }; break;
      case "downtown": weights = {
        "Person": 0.5,
        "Car": 0.3,
        "Bus": 0.15,
        "Tram": 0.1,
        "Parking Garage": 0.02,
        "Small Skyscraper": 0.4,
        "Large Skyscraper": 0.1
      }; break;
    }
  }
  return fill_area(area,weights);
}


function updateVictims(type,prey)
{
  var sums = prey.sum();

  for (var key in sums) {
    if (sums.hasOwnProperty(key)) {
      victims[type][key] += sums[key];
    }
  }
}

function feed()
{
  var area = macro.handArea;
  var prey = getPrey(biome, area);

  var line = describe("eat", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());
  var sound = "";
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

  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.stomach.feed(prey);

  macro.arouse(5);

  updateVictims("stomach",prey);
  update([sound,line,linesummary,newline]);
}

function chew()
{
  var area = macro.handArea;
  var prey = getPrey(biome, area);

  var line = describe("chew", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());
  var sound = "";
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

  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(10);

  updateVictims("digested",prey);
  update([sound,line,linesummary,newline]);
}

function stomp()
{
  var area = macro.pawArea;
  var prey = getPrey(biome, area);
  var line = describe("stomp", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Thump";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(5);

  updateVictims("stomped",prey);
  update([sound,line,linesummary,newline]);
}

function grind()
{
  var area = macro.assArea / 2;

  if (macro.maleParts)
    area += macro.dickArea
  if (macro.femalePartS)
    area += macro.vaginaArea;

  var prey = getPrey(biome,area);

  var line = describe("grind", prey, macro, verbose);
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());
  var sound = "";

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

  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(20);

  updateVictims("ground",prey);
  update([sound,line,linesummary,newline]);
}

function anal_vore()
{
  var area = macro.analVoreArea;
  var prey = getOnePrey(biome,area);

  area = macro.assArea;
  var crushed = getPrey(biome,area);

  var line1 = describe("anal-vore", prey, macro, verbose);
  var line1summary = summarize(prey.sum(), false);

  var line2 = describe("ass-crush", crushed, macro, verbose);
  var line2summary = summarize(crushed.sum(), true);

  var people = get_living_prey(prey.sum());
  var sound = "Shlp";

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

  var people = get_living_prey(crushed.sum());
  var sound2 = "Thump";

  if (people < 3) {
    sound2 = "Thump!";
  } else if (people < 10) {
    sound2 = "Squish!";
  } else if (people < 50) {
    sound2 = "Crunch!";
  } else if (people < 500) {
    sound2 = "CRUNCH!";
  } else if (people < 5000) {
    sound2 = "CRRUUUNCH!!";
  } else {
    sound2 = "Oh the humanity!";
  }

  var preyMass = prey.sum_property("mass");
  var crushedMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);
  macro.addGrowthPoints(crushedMass);

  macro.bowels.feed(prey);

  macro.arouse(10);

  updateVictims("bowels",prey);
  updateVictims("stomped",crushed);
  update([sound,line1,line1summary,newline,sound2,line2,line2summary,newline]);
}

function breast_crush()
{
  var area = macro.breastArea;
  var prey = getPrey(biome, area);
  var line = describe("breast-crush", prey, macro, verbose);
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Thump";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(10);

  updateVictims("breasts",prey);
  update([sound,line,linesummary,newline]);

  if (macro.lactationEnabled && macro.milkStorage.amount / macro.milkStorage.limit > 0.5) {
    var amount = Math.min(macro.lactationVolume, (macro.milkStorage.amount / macro.milkStorage.limit - 0.5) * macro.milkStorage.limit);
    milk_breasts(null, amount);
  }
}

function milk_breasts(e,vol)
{
  if (vol == undefined) {
    var vol = Math.min(macro.lactationVolume, macro.milkStorage.amount);
  }

  macro.milkStorage.amount -= vol;

  var area = Math.pow(vol, 2/3);

  var prey = getPrey(biome, area);
  var line = describe("breast-milk", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false))
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Dribble.";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  updateVictims("flooded",prey);
  update([sound,line,linesummary,newline]);
}

function unbirth()
{
  var area = macro.vaginaArea;
  var prey = getPrey(biome, area);
  var line = describe("unbirth", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());

  var sound = "";

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

  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.womb.feed(prey);

  macro.arouse(20);

  updateVictims("womb",prey);
  update([sound,line,linesummary,newline]);
}

function cockslap()
{
  var area = macro.dickArea;
  var prey = getPrey(biome, area);
  var line = describe("cockslap", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Thump";

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

  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(15);

  updateVictims("cock",prey);
  update([sound,line,linesummary,newline]);
}

function cock_vore()
{
  var area = macro.dickGirth;
  var prey = getPrey(biome, area);
  var line = describe("cock-vore", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());

  var sound = "lp";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.balls.feed(prey);

  macro.arouse(20);

  updateVictims("balls",prey);
  update([sound,line,linesummary,newline]);
}

function ball_smother()
{
  var area = macro.ballArea * 2;
  var prey = getPrey(biome, area);
  var line = describe("ball-smother", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Thump";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(10);

  updateVictims("balls",prey);
  update([sound,line,linesummary,newline]);
}

function male_spurt(vol)
{
  var area = Math.pow(vol, 2/3);

  var prey = getPrey(biome, area);
  var line = describe("male-spurt", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false))
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Spurt!";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function male_orgasm(vol)
{
  var area = Math.pow(vol, 2/3);

  var prey = getPrey(biome, area);
  var line = describe("male-orgasm", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false))
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Spurt!";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function female_spurt(vol)
{
  var area = Math.pow(vol, 2/3);

  var prey = getPrey(biome, area);
  var line = describe("female-spurt", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false))
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Spurt!";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function female_orgasm(vol)
{
  var area = Math.pow(vol, 2/3);

  var prey = getPrey(biome, area);
  var line = describe("female-orgasm", prey, macro, verbose).replace("$VOLUME",volume(vol,unit,false));
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Spurt!";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function tail_slap()
{
  var area = macro.tailArea * macro.tailCount;
  var prey = getPrey(biome, area);
  var line = describe("tail-slap", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), true);

  var people = get_living_prey(prey.sum());

  var sound = "Thump";

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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(5);

  updateVictims("tailslapped",prey);
  update([sound,line,linesummary,newline]);
}

function tail_vore()
{
  var area = macro.tailGirth * macro.tailCount;
  var prey = getPrey(biome, area);
  var line = describe("tail-vore", prey, macro, verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());

  var sound = "";
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
  var preyMass = prey.sum_property("mass");

  macro.addGrowthPoints(preyMass);

  macro.arouse(5);

  macro.stomach.feed(prey);

  updateVictims("tailmaw'd",prey);
  update([sound,line,linesummary,newline]);
}

function transformNumbers(line)
{
  return line.toString().replace(/[0-9]+(\.[0-9]+)?(e\+[0-9]+)?/g, function(text) { return number(text, numbers); });
}

function update(lines = [])
{
  var log = document.getElementById("log");

  lines.forEach(function (x) {
    var line = document.createElement('div');
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
  document.getElementById("cum").innerHTML = "Cum: " + transformNumbers(volume(macro.cumStorage.amount,unit,false))
  document.getElementById("cumPercent").innerHTML = Math.round(macro.cumStorage.amount / macro.cumStorage.limit * 100) + "%";
  document.getElementById("femcum").innerHTML = "Femcum: " + transformNumbers(volume(macro.femcumStorage.amount,unit,false));
  document.getElementById("femcumPercent").innerHTML = Math.round(macro.femcumStorage.amount / macro.femcumStorage.limit * 100) + "%";
  document.getElementById("milk").innerHTML = "Milk: " + transformNumbers(volume(macro.milkStorage.amount,unit,false));
  document.getElementById("milkPercent").innerHTML = Math.round(macro.milkStorage.amount / macro.milkStorage.limit * 100) + "%";

  for (var type in victims) {
    if (victims.hasOwnProperty(type)) {
      for (var key in victims[type]){
        if (victims[type].hasOwnProperty(key) && victims[type][key] > 0) {
          document.getElementById("stat-" + key).style.display = "table-row";
          document.getElementById("stat-" + type + "-" + key).innerHTML = number(victims[type][key],numbers);
        }
      }
    }
  }
}

function pick_move()
{
  if (!strolling) {
    setTimeout(pick_move, 1500 * Math.sqrt(macro.scale));
    return;
  }
  var choice = Math.random();

  if (choice < 0.2) {
    anal_vore();
  } else if (choice < 0.6) {
    stomp();
  } else {
    feed();
  }
  setTimeout(pick_move, 1500 * Math.sqrt(macro.scale));
}

function grow_pick(times) {
  if (document.getElementById("part-body").checked == true) {
    grow(times);
  }
  else if (document.getElementById("part-ass").checked == true) {
    grow_ass(times);
  }
  else if (document.getElementById("part-dick").checked == true) {
    grow_dick(times);
  }
  else if (document.getElementById("part-balls").checked == true) {
    grow_balls(times);
  }
  else if (document.getElementById("part-breasts").checked == true) {
    grow_breasts(times);
  }
  else if (document.getElementById("part-vagina").checked == true) {
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

  var oldHeight = macro.height;
  var oldMass = macro.mass;

  macro.scale *= Math.pow(1.02,times);

  var newHeight = macro.height;
  var newMass = macro.mass;

  var heightDelta = newHeight - oldHeight;
  var massDelta = newMass - oldMass;

  var heightStr = length(heightDelta, unit);
  var massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function grow_dick(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  var oldLength = macro.dickLength;
  var oldMass = macro.dickMass;

  macro.dickScale = Math.pow(macro.dickScale * macro.dickScale + 1.02*times, 1/2) ;

  var lengthDelta = macro.dickLength - oldLength;
  var massDelta = macro.dickMass - oldMass;
  update(["Power surges through you as your " + macro.dickType + " cock grows " + length(lengthDelta, unit, false) + " longer and gains " + mass(massDelta, unit, false) + " of mass",newline]);
}

function grow_balls(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  var oldDiameter = macro.ballDiameter;
  var oldMass = macro.ballMass;

  macro.ballScale = Math.pow(macro.ballScale * macro.ballScale + 1.02*times, 1/2) ;

  var diameterDelta = macro.ballDiameter - oldDiameter;
  var massDelta = macro.ballMass - oldMass;
  update(["Power surges through you as your balls swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_breasts(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  var oldDiameter = macro.breastDiameter;
  var oldMass = macro.breastMass;

  macro.breastScale = Math.pow(macro.breastScale * macro.breastScale + 1.02*times, 1/2) ;

  var diameterDelta = macro.breastDiameter - oldDiameter;
  var massDelta = macro.breastMass - oldMass;
  update(["Power surges through you as your breasts swell by " + length(diameterDelta, unit, false) + ", gaining " + mass(massDelta, unit, false) + " of mass apiece",newline]);
}

function grow_vagina(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  var oldLength = macro.vaginaLength;

  macro.vaginaScale = Math.pow(macro.vaginaScale * macro.vaginaScale + 1.02*times, 1/2) ;

  var lengthDelta = macro.vaginaLength - oldLength;

  update(["Power surges through you as your moist slit expands by by " + length(lengthDelta, unit, false),newline]);
}

function grow_ass(times=1)
{
  if (macro.growthPoints < 10 * times) {
    update(["You don't feel like growing right now."]);
    return;
  }

  macro.growthPoints -= 10 * times;

  var oldDiameter = Math.pow(macro.assArea,1/2);

  macro.assScale = Math.pow(macro.assScale * macro.assScale + 1.02*times, 1/2) ;

  var diameterDelta = Math.pow(macro.assArea,1/2) - oldDiameter;
  update(["Power surges through you as your ass swells by " + length(diameterDelta, unit, false),newline]);
}

function grow_lots()
{
  var oldHeight = macro.height;
  var oldMass = macro.mass;

  macro.scale *= 100;

  var newHeight = macro.height;
  var newMass = macro.mass;

  var heightDelta = newHeight - oldHeight;
  var massDelta = newMass - oldMass;

  var heightStr = length(heightDelta, unit);
  var massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function preset(name) {
  switch(name){
    case "Fen":
      macro.species = "crux";
      macro.baseHeight = 2.2606;
      macro.baseMass = 124.738;
      break;
    case "Renard":
      macro.species = "fox";
      macro.baseHeight = 1.549;
      macro.baseMass = 83.9;
    case "Vulpes":
      macro.species = "fox";
      macro.baseHeight = 20000;
      macro.baseMass = 180591661866272;
  }
}

function saveSettings() {
  storage = window.localStorage;

  settings = {};

  form = document.forms.namedItem("custom-species-form");

  for (var i=0; i<form.length; i++) {
    if (form[i].value != "") {
      if (form[i].type == "text")
        settings[form[i].name] = form[i].value;
      else if (form[i].type == "number")
        settings[form[i].name] = parseFloat(form[i].value);
      else if (form[i].type == "checkbox") {
        settings[form[i].name] = form[i].checked;
      } else if (form[i].type == "radio") {
        let name = form[i].name.match(/(?:[a-zA-Z]+-)*[a-zA-Z]+/)[0];
        if (form[i].checked)
          settings[name] = form[i].id
      }
    }
  }

  storage.setItem('settings',JSON.stringify(settings));
}

function loadSettings() {
  if (window.localStorage.getItem('settings') == null)
    return;

  storage = window.localStorage;

  settings = JSON.parse(storage.getItem('settings'));
  form = document.forms.namedItem("custom-species-form");

  for (var i=0; i<form.length; i++) {
    if (settings[form[i].name] != undefined) {
      if (form[i].type == "text")
        form[i].value = settings[form[i].name];
      else if (form[i].type == "number")
        form[i].value = settings[form[i].name];
      else if (form[i].type == "checkbox") {
        form[i].checked = settings[form[i].name];
      } else if (form[i].type == "radio") {
        let name = form[i].name.match(/(?:[a-zA-Z]+-)*[a-zA-Z]+/)[0];
        form[i].checked = (settings[name] == form[i].id);
      }
    }
  }
}

function startGame(e) {

  form = document.forms.namedItem("custom-species-form");

  for (var i=0; i<form.length; i++) {
    if (form[i].value != "") {
      if (form[i].type == "text")
        macro[form[i].name] = form[i].value;
      else if (form[i].type == "number")
        macro[form[i].name] = parseFloat(form[i].value);
      else if (form[i].type == "checkbox") {
        if (form[i].name == "humanMode")
          humanMode = form[i].checked;
        else
          macro[form[i].name] = form[i].checked;
      } else if (form[i].type == "radio") {
        if (form[i].checked) {
          switch(form[i].id) {
            case "brutality-0": macro.brutality = 0; break;
            case "brutality-1": macro.brutality = 1; break;
            case "brutality-2": macro.brutality = 2; break;
          }
        }
      }
    }
  }

  if (!macro.hasTail) {
    macro.tailCount = 0;
  }

  document.getElementById("log-area").style.display = 'inline';
  document.getElementById("option-panel").style.display = 'none';
  document.getElementById("action-panel").style.display = 'flex';

  victimTypes = ["stomped","digested","stomach","bowels","ground"];

  if (macro.tailCount > 0) {
    victimTypes = victimTypes.concat(["tailslapped"]);
    if (macro.tailMaw) {
      victimTypes = victimTypes.concat(["tailmaw'd"]);
    } else {
      document.getElementById("button-tail_vore").style.display = 'none';
    }
  } else {
    document.getElementById("button-tail_slap").style.display = 'none';
    document.getElementById("button-tail_vore").style.display = 'none';
  }

  if (macro.maleParts) {
    victimTypes = victimTypes.concat(["cock","balls"]);
  } else {
    document.getElementById("button-cockslap").style.display = 'none';
    document.getElementById("button-cock_vore").style.display = 'none';
    document.getElementById("button-ball_smother").style.display = 'none';
    document.getElementById("cum").style.display = 'none';
    document.getElementById("cumPercent").style.display = 'none';
    document.querySelector("#part-balls+label").style.display = 'none';
    document.querySelector("#part-dick+label").style.display = 'none';
  }

  if (macro.femaleParts) {
    victimTypes = victimTypes.concat(["womb"]);
  } else {
    document.getElementById("button-unbirth").style.display = 'none';
    document.getElementById("femcum").style.display = 'none';
    document.getElementById("femcumPercent").style.display = 'none';
    document.querySelector("#part-vagina+label").style.display = 'none';
  }

  if (macro.hasBreasts) {
    victimTypes = victimTypes.concat(["breasts"]);
    if (macro.lactationEnabled) {
      victimTypes = victimTypes.concat(["flooded"]);
    } else {
      document.getElementById("button-breast_milk").style.display = 'none';
      document.getElementById("milk").style.display = 'none';
      document.getElementById("milkPercent").style.display = 'none';
    }
  } else {
    document.getElementById("button-breast_milk").style.display = 'none';
    document.getElementById("milk").style.display = 'none';
    document.getElementById("milkPercent").style.display = 'none';
    document.getElementById("button-breast_crush").style.display = 'none';
    document.querySelector("#part-breasts+label").style.display = 'none';
  }

  if (macro.maleParts || macro.femaleParts) {
    victimTypes.push("splooged");
  }

  if (macro.brutality < 1) {
    document.getElementById("button-chew").style.display = 'none';
  }
  var table = document.getElementById("victim-table");

  var tr = document.createElement('tr');
  var th = document.createElement('th');

  th.innerHTML = "Method";
  tr.appendChild(th);
  for (var i = 0; i < victimTypes.length; i++) {
    var th = document.createElement('th');
    th.classList.add("victim-table-cell");
    th.innerHTML = victimTypes[i].charAt(0).toUpperCase() + victimTypes[i].slice(1);
    tr.appendChild(th);
  }

  table.appendChild(tr);
  for (var key in things) {
    if (things.hasOwnProperty(key) && key != "Container") {
      var tr = document.createElement('tr');
      tr.id = "stat-" + key;
      tr.style.display = "none";
      var th = document.createElement('th');
      th.innerHTML = key;
      tr.appendChild(th);

      for (var i = 0; i < victimTypes.length; i++) {
        var th = document.createElement('th');
        th.innerHTML = 0;
        th.id = "stat-" + victimTypes[i] + "-" + key;
        tr.appendChild(th);
      }
      table.appendChild(tr);
    }
  }

  document.getElementById("button-arousal").innerHTML = (macro.arousalEnabled ? "Arousal On" : "Arousal Off");
  if (!macro.arousalEnabled) {
    document.getElementById("arousal").style.display = "none";
    document.getElementById("edge").style.display = "none";
  }


  //var species = document.getElementById("option-species").value;
  //var re = /^[a-zA-Z\- ]+$/;

  // tricksy tricksy players
  //if (re.test(species)) {
  //  macro.species = species;
  //}

  macro.init();

  update();

  document.getElementById("stat-container").style.display = 'flex';
}

window.addEventListener('load', function(event) {

  victims["stomped"] = initVictims();
  victims["tailslapped"] = initVictims();
  victims["tailmaw'd"] = initVictims();
  victims["bowels"] = initVictims();
  victims["digested"] = initVictims();
  victims["stomach"] = initVictims();
  victims["breasts"] = initVictims();
  victims["flooded"] = initVictims();
  victims["womb"] = initVictims();
  victims["cock"] = initVictims();
  victims["balls"] = initVictims();
  victims["smothered"] = initVictims();
  victims["splooged"] = initVictims();
  victims["ground"] = initVictims();

  document.getElementById("button-look").addEventListener("click",look);
  document.getElementById("button-feed").addEventListener("click",feed);
  document.getElementById("button-chew").addEventListener("click",chew);
  document.getElementById("button-stomp").addEventListener("click",stomp);
  document.getElementById("button-anal_vore").addEventListener("click",anal_vore);
  document.getElementById("button-tail_slap").addEventListener("click",tail_slap);
  document.getElementById("button-tail_vore").addEventListener("click",tail_vore);
  document.getElementById("button-breast_crush").addEventListener("click",breast_crush);
  document.getElementById("button-breast_milk").addEventListener("click",milk_breasts);
  document.getElementById("button-unbirth").addEventListener("click",unbirth);
  document.getElementById("button-cockslap").addEventListener("click",cockslap);
  document.getElementById("button-cock_vore").addEventListener("click",cock_vore);
  document.getElementById("button-ball_smother").addEventListener("click",ball_smother);
  document.getElementById("button-grind").addEventListener("click",grind);
  document.getElementById("button-stroll").addEventListener("click",toggle_auto);
  document.getElementById("button-location").addEventListener("click",change_location);
  document.getElementById("button-numbers").addEventListener("click",toggle_numbers);
  document.getElementById("button-units").addEventListener("click",toggle_units);
  document.getElementById("button-verbose").addEventListener("click",toggle_verbose);
  document.getElementById("button-arousal").addEventListener("click",toggle_arousal);
  document.getElementById("button-grow-lots").addEventListener("click",grow_lots);

  document.getElementById("button-amount-1").addEventListener("click",function() { grow_pick(1); });
  document.getElementById("button-amount-5").addEventListener("click",function() { grow_pick(5); });
  document.getElementById("button-amount-10").addEventListener("click",function() { grow_pick(10); });
  document.getElementById("button-amount-20").addEventListener("click",function() { grow_pick(20); });
  document.getElementById("button-amount-50").addEventListener("click",function() { grow_pick(50); });
  document.getElementById("button-amount-100").addEventListener("click",function() { grow_pick(100); });

  document.getElementById("button-load-custom").addEventListener("click",loadSettings);
  document.getElementById("button-save-custom").addEventListener("click",saveSettings);
  document.getElementById("button-start").addEventListener("click",startGame);
  setTimeout(pick_move, 2000);
});
