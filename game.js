var strolling = false;

var maxStomachDigest = 10;
var maxBowelsDigest = 10;

var unit = "metric";

var verbose = true;

var biome = "suburb";

var newline = "&nbsp;";

victims = {};

var macro =
{
  "scaling": function(value, scale, factor) { return value * Math.pow(scale,factor); },
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
  get assArea() { return this.scaling(this.baseAssArea, this.scale, 2); },
  "baseHandArea": 0.3,
  get handArea() { return this.scaling(this.baseHandArea, this.scale, 2); },

  "baseDickLength": 0.3048,
  "baseDickDiameter": 0.08,
  "dickDensity": 1000,
  "dickScale": 1,
  get dickLength() { return this.scaling(this.baseDickLength * this.dickScale, this.scale, 1); },
  get dickDiameter() { return this.scaling(this.baseDickDiameter * this.dickScale, this.scale, 1); },
  get dickGirth() {
    return Math.pow((this.dickDiameter / 2),2) * Math.PI;
  },
  get dickArea() {
    return this.dickLength * this.dickDiameter * Math.PI / 2;
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
  get ballArea() { return 2 * Math.PI * Math.pow(this.ballDiameter/2, 2) },
  get ballVolume() {
    var radius = this.ballDiameter / 2;
    return 4/3 * Math.PI * Math.pow(radius,3);
  },
  get ballMass() {
    var volume = this.ballVolume;
    return volume * this.ballDensity;
  },

  "baseCumRatio": 0.25,
  "cumScale": 1,
  get cumVolume() {
    return this.ballVolume * this.baseCumRatio * this.cumScale + Math.max(0,this.cumStorage.amount - this.cumStorage.limit);
  },

  "baseVaginaLength": 0.1,
  "baseVaginaWidth": 0.05,
  "vaginaScale": 1,

  get vaginaLength() { return this.scaling(this.baseVaginaLength * this.vaginaScale, this.scale, 1); },
  get vaginaWidth() { return this.scaling(this.baseVaginaWidth * this.vaginaScale, this.scale, 1); },
  get vaginaArea() { return this.vaginaLength * this.vaginaWidth },
  get vaginaVolume() { return this.vaginaArea * this.vaginaWidth },
  "femcumRatio": 0.1,
  "femcumScale": 1,
  get femcumVolume() {
    return this.vaginaVolume * this.femcumRatio * this.femcumScale + Math.max(0,this.femcumStorage.amount - this.femcumStorage.limit);
  },

  "baseBreastDiameter": 0.1,
  "breastScale": 1,
  "breastDensity": 1000,
  get breastDiameter() { return this.scaling(this.baseDickLength * this.breastScale, this.scale, 1); },
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

  "digest": function(organ) {
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

    update([line,summary,newline]);
  },

  "stomach": {
    "name": "stomach",
    "feed": function(prey) {
      this.feedFunc(prey,this,this.owner);
    },
    "feedFunc": function(prey,self,owner) {
      if (self.contents.length == 0)
        setTimeout(function() { owner.digest(self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion": function(container) {
      return "Your stomach gurgles as it digests " + container.describe(false);
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
        setTimeout(function() { owner.digest(self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion" : function(container) {
      return "Your bowels churn as they absorb " + container.describe(false);
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
        setTimeout(function() { owner.digest(self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion" : function(container) {
      return "Your womb squeezes as it dissolves " + container.describe(false);
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
        setTimeout(function() { owner.digest(self) }, 15000);
      this.contents.push(prey);
    },
    "describeDigestion": function(container) {
      return "Your balls slosh as they transform " + container.describe(false) + " into cum";
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
    if (this.maleParts)
      this.fillCum(this)
    if (this.femaleParts)
      this.fillFemcum(this)
  },

  "maleParts": true,
  "femaleParts": true,

  "fillCum": function(self) {
    self.cumStorage.amount += self.ballVolume / 30;
    if (self.cumStorage.amount > self.cumStorage.limit)
      self.arouse(10 * (self.cumStorage.amount / self.cumStorage.limit - 1));
    setTimeout(function () { self.fillCum(self) }, 1000);
    update();
  },

  "fillFemcum": function(self) {
    self.femcumStorage.amount += self.vaginaVolume / 30;
    if (self.femcumStorage.amount > self.femcumStorage.limit)
      self.arouse(10 * (self.femcumStorage.amount / self.femcumStorage.limit - 1));
    setTimeout(function () { self.fillFemcum(self) }, 1000);
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
  "orgasm": false,
  "arousal": 0,

  "arouse": function(amount) {
    this.arousal += amount;

    if (this.arousal >= 100) {
      this.arousal = 100;

      if (!this.orgasm) {
        this.orgasm = true;
        if (this.maleParts) {
          this.maleOrgasm(this);
        }
        if (this.femaleParts) {
          this.femaleOrgasm(this);
        }
      }
    }
  },

  "quench": function(amount) {
    this.arousal -= amount;

    if (this.arousal <= 0) {
      this.arousal = 0;
      if (this.orgasm) {
        this.orgasm = false;
      }
    }
  },

  "maleOrgasm": function(self) {
    if (self.orgasm) {
      self.quench(10);
      var amount = Math.min(this.cumVolume, this.cumStorage.amount);
      this.cumStorage.amount -= amount;
      male_orgasm(amount);
      setTimeout(function() { self.maleOrgasm(self) }, 2000);
    }
  },

  "femaleOrgasm": function(self) {
    if (this.orgasm) {
      this.quench(10);
      var amount = Math.min(this.femcumVolume, this.femcumStorage.amount);
      this.femcumStorage.amount -= amount;
      female_orgasm(amount);
      setTimeout(function() { self.femaleOrgasm(self) }, 2000);
    }
  },


  get description() {
    result = [];
    line = "You are a " + length(macro.height, unit, true) + " tall " + macro.species + ". You weigh " + mass(macro.mass, unit) + ".";
    result.push(line);
    if (this.maleParts) {
      line = "Your " + length(macro.dickLength, unit, true) + " long dick hangs from your hips, with two " + mass(macro.ballMass, unit, true) + ", " + length(macro.ballDiameter, unit, true) + "-wide balls hanging beneath.";
      result.push(line);
    }
    if (this.femaleParts) {
      line = "Your glistening " + length(macro.vaginaLength, unit, true) + " long slit is oozing between your legs."
      result.push(line);
      line = "You have two " + length(macro.breastDiameter, unit, true) + "-wide breasts that weigh " + mass(macro.breastMass, unit) + " apiece.";
      result.push(line);
    }

    return result;
  },

  "scale": 3,

  "scaleWithMass": function(mass) {
    var startMass = this.mass;
    var newMass = startMass + mass;
    this.scale = Math.pow(newMass / this.baseMass, 1/3);
  }
}

function look()
{
  var desc = macro.description;

  var line2 = ""

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

function toggle_verbose()
{
  verbose = !verbose;

  document.getElementById("button-verbose").innerHTML = "Descriptions: " + (verbose ? "Verbose" : "Simple");
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
    "Train": 0,
    "Train Car": 0,
    "Parking Garage": 0,
    "Overpass": 0,
  };
};

// lists out total people
function summarize(sum, fatal = true)
{
  var count = get_living_prey(sum);
  return "<b>(" + count + " " + (fatal ? (count > 1 ? "kills" : "kill") : (count > 1 ? "prey" : "prey")) + ")</b>";
}

function getOnePrey(biome,area)
{
  var potential = ["Person"];

  switch(biome) {
    case "suburb": potential = ["Person", "Car", "Bus", "Train", "House"]; break;
    case "city": potential = ["Person", "Car", "Bus", "Train", "Tram", "House", "Parking Garage"]; break;
    case "downtown": potential = ["Person", "Car", "Bus", "Tram", "Small Skyscraper", "Parking Garage"]; break;
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
      return new things[x[0]](1);
    }
  };

  return new Person(1);
}
function getPrey(region, area)
{
  var weights = {"Person": 1};

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
      "Small Skyscraper": 0.4
    }; break;
  }
  return fill_area2(area,weights);
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

  var line = prey.eat(verbose)
  var linesummary = summarize(prey.sum(), false);

  var people = get_living_prey(prey.sum());
  var sound = "Ulp";
  if (people < 3) {
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

  macro.scaleWithMass(preyMass);

  macro.stomach.feed(prey);

  macro.arouse(5);

  updateVictims("stomach",prey);
  update([sound,line,linesummary,newline]);
}

function stomp()
{
  var area = macro.pawArea;
  var prey = getPrey(biome, area);
  var line = prey.stomp(verbose)
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

  macro.scaleWithMass(preyMass);

  macro.arouse(5);

  updateVictims("stomped",prey);
  update([sound,line,linesummary,newline]);
}

function anal_vore()
{
  var area = macro.analVoreArea;
  var prey = getOnePrey(biome,area);

  area = macro.assArea;
  var crushed = getPrey(biome,area);

  var line1 = prey.anal_vore(verbose, macro.height);
  var line1summary = summarize(prey.sum(), false);

  var line2 = crushed.buttcrush(verbose);
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

  macro.scaleWithMass(preyMass);
  macro.scaleWithMass(crushedMass);

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
  var line = prey.breast_crush(verbose);
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

  macro.scaleWithMass(preyMass);

  macro.arouse(10);

  updateVictims("breasts",prey);
  update([sound,line,linesummary,newline]);
}

function unbirth()
{
  var area = macro.vaginaArea;
  var prey = getPrey(biome, area);
  var line = prey.unbirth(verbose)
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

  macro.scaleWithMass(preyMass);

  macro.womb.feed(prey);

  macro.arouse(20);

  updateVictims("womb",prey);
  update([sound,line,linesummary,newline]);
}

function cockslap()
{
  var area = macro.dickArea;
  var prey = getPrey(biome, area);
  var line = prey.cockslap(verbose)
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

  macro.scaleWithMass(preyMass);

  macro.arouse(15);

  updateVictims("cock",prey);
  update([sound,line,linesummary,newline]);
}

function cock_vore()
{
  var area = macro.dickGirth;
  var prey = getPrey(biome, area);
  var line = prey.cock_vore(verbose)
  var linesummary = summarize(prey.sum(), true);

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

  macro.scaleWithMass(preyMass);

  macro.balls.feed(prey);

  macro.arouse(20);

  updateVictims("balls",prey);
  update([sound,line,linesummary,newline]);
}

function ball_smother()
{
  var area = macro.ballArea * 2;
  var prey = getPrey(biome, area);
  var line = prey.ball_smother(verbose)
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

  macro.scaleWithMass(preyMass);

  macro.arouse(10);

  updateVictims("balls",prey);
  update([sound,line,linesummary,newline]);
}

function male_orgasm(vol)
{
  // let's make it 10cm thick

  var area = vol * 10;

  var prey = getPrey(biome, area);
  var line = prey.male_orgasm(verbose).replace("$VOLUME",volume(vol,unit,false))
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

  macro.scaleWithMass(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function female_orgasm(vol)
{
  // let's make it 10cm thick

  var area = vol * 10;

  var prey = getPrey(biome, area);
  var line = prey.female_orgasm(verbose).replace("$VOLUME",volume(vol,unit,false));
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

  macro.scaleWithMass(preyMass);

  updateVictims("splooged",prey);
  update([sound,line,linesummary,newline]);
}

function update(lines = [])
{
  var log = document.getElementById("log");

  lines.forEach(function (x) {
    var line = document.createElement('div');
    line.innerHTML = x;
    log.appendChild(line);
  });

  log.scrollTop = log.scrollHeight;

  document.getElementById("height").innerHTML = "Height: " + length(macro.height, unit);
  document.getElementById("mass").innerHTML = "Mass: " + mass(macro.mass, unit);
  document.getElementById("arousal").innerHTML = "Arousal: " + round(macro.arousal,0) + "%";
  document.getElementById("cum").innerHTML = "Cum: " + volume(macro.cumStorage.amount,unit,false) + "/" + volume(macro.cumStorage.limit,unit,false);
  document.getElementById("femcum").innerHTML = "Femcum: " + volume(macro.femcumStorage.amount,unit,false) + "/" + volume(macro.femcumStorage.limit,unit,false);

  for (var type in victims) {
    if (victims.hasOwnProperty(type)) {
      for (var key in victims[type]){
        if (victims[type].hasOwnProperty(key) && victims[type][key] > 0) {
          document.getElementById("stat-" + key).style.display = "table-row";
          document.getElementById("stat-" + type + "-" + key).innerHTML = victims[type][key];
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

function grow()
{
  var oldHeight = macro.height;
  var oldMass = macro.mass;

  macro.scale *= 1.2;

  var newHeight = macro.height;
  var newMass = macro.mass;

  var heightDelta = newHeight - oldHeight;
  var massDelta = newMass - oldMass;

  var heightStr = length(heightDelta, unit);
  var massStr = mass(massDelta, unit);

  update(["Power surges through you as you grow " + heightStr + " taller and gain " + massStr + " of mass",newline]);
}

function option_male() {
  macro.maleParts = !macro.maleParts;

  document.getElementById("button-male-genitals").innerHTML = (macro.maleParts ? "Male genitals" : "No male genitals");
}

function option_female() {
  macro.femaleParts = !macro.femaleParts;

  document.getElementById("button-female-genitals").innerHTML = (macro.femaleParts ? "Female genitals" : "No female genitals");
}

function startGame() {
  document.getElementById("option-panel").style.display = 'none';
  document.getElementById("action-panel").style.display = 'flex';

  victimTypes = ["stomped","digested","stomach","bowels"];

  if (macro.maleParts) {
    victimTypes = victimTypes.concat(["cock","balls"]);
  } else {
    document.getElementById("button-cockslap").style.display = 'none';
    document.getElementById("button-cock_vore").style.display = 'none';
    document.getElementById("button-ball_smother").style.display = 'none';
    document.getElementById("cum").style.display = 'none';
  }

  if (macro.femaleParts) {
    victimTypes = victimTypes.concat(["breasts"],["womb"]);
  } else {
    document.getElementById("button-breast_crush").style.display = 'none';
    document.getElementById("button-unbirth").style.display = 'none';
    document.getElementById("femcum").style.display = 'none';
  }

  if (macro.maleParts || macro.femaleParts) {
    victimTypes.push("splooged");
  }

  var table = document.getElementById("victim-table");

  var tr = document.createElement('tr');

  var th = document.createElement('th');
  th.innerHTML = "Method";
  tr.appendChild(th);
  for (var i = 0; i < victimTypes.length; i++) {
    var th = document.createElement('th');
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


  var species = document.getElementById("option-species").value;
  var re = /^[a-zA-Z\- ]+$/;

  // tricksy tricksy players
  if (re.test(species)) {
    macro.species = species;
  }

  macro.init();

  update();

  document.getElementById("stat-container").style.display = 'flex';
}

window.addEventListener('load', function(event) {

  victims["stomped"] = initVictims();
  victims["digested"] = initVictims();
  victims["stomach"] = initVictims();
  victims["bowels"] = initVictims();
  victims["breasts"] = initVictims();
  victims["womb"] = initVictims();
  victims["cock"] = initVictims();
  victims["balls"] = initVictims();
  victims["smothered"] = initVictims();
  victims["splooged"] = initVictims();

  document.getElementById("button-look").addEventListener("click",look);
  document.getElementById("button-grow").addEventListener("click",grow);
  document.getElementById("button-feed").addEventListener("click",feed);
  document.getElementById("button-stomp").addEventListener("click",stomp);
  document.getElementById("button-breast_crush").addEventListener("click",breast_crush);
  document.getElementById("button-unbirth").addEventListener("click",unbirth);
  document.getElementById("button-cockslap").addEventListener("click",cockslap);
  document.getElementById("button-cock_vore").addEventListener("click",cock_vore);
  document.getElementById("button-ball_smother").addEventListener("click",ball_smother);
  document.getElementById("button-anal_vore").addEventListener("click",anal_vore);
  document.getElementById("button-stroll").addEventListener("click",toggle_auto);
  document.getElementById("button-location").addEventListener("click",change_location);
  document.getElementById("button-units").addEventListener("click",toggle_units);
  document.getElementById("button-verbose").addEventListener("click",toggle_verbose);

  document.getElementById("button-male-genitals").addEventListener("click",option_male);
  document.getElementById("button-female-genitals").addEventListener("click",option_female);
  document.getElementById("button-start").addEventListener("click",startGame);
  setTimeout(pick_move, 2000);
});
