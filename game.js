var strolling = false;

var maxStomachDigest = 10;
var maxBowelsDigest = 10;

var metric = true;

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
  "scale": 3,

  "scaleWithMass": function(mass) {
    var startMass = this.mass;
    var newMass = startMass + mass;
    this.scale = Math.pow(newMass / this.baseMass, 1/3);
  }
}

function look()
{
  var line1 = "You are a " + length(macro.height, metric, true) + " tall " + macro.species + ". You weigh " + mass(macro.mass, metric) + ".";

  var line2 = ""

  switch(biome) {
    case "rural": line2 = "You're standing amongst rural farmhouses and expansive ranches. Cattle are milling about at your feet."; break;
    case "suburb": line2 = "You're striding through the winding roads of a suburb."; break;
    case "city": line2 = "You're terrorizing the streets of a city. Heavy traffic, worsened by your rampage, is everywhere."; break;
    case "downtown": line2 = "You're lurking amongst the skyscrapers of downtown. The streets are packed, and the buildings are practically begging you to knock them over.";
  }
  update([line1,newline,line2,newline]);
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
  metric = !metric;

  document.getElementById("button-units").innerHTML = "Units: " + (metric ? "Metric" : "Customary");

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

var stomach = []
var bowels = []

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

  stomach.push(prey);

  if (stomach.length == 1)
    setTimeout(function() { doDigest("stomach"); }, 15000);

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

  bowels.push(prey);

  if (bowels.length == 1)
    setTimeout(function() { doDigest("bowels"); }, 15000);

  updateVictims("bowels",prey);
  updateVictims("stomped",crushed);
  update([sound,line1,line1summary,newline,sound2,line2,line2summary,newline]);
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

  document.getElementById("height").innerHTML = "Height: " + (metric ? metricLength(macro.height) : customaryLength(macro.height));
  document.getElementById("mass").innerHTML = "Mass: " + (metric ? metricMass(macro.mass) : customaryMass(macro.mass));

  for (var type in victims) {
    if (victims.hasOwnProperty(type)) {
      for (var key in victims[type]){
        if (victims[type].hasOwnProperty(key)) {
          if (document.getElementById("stats-" + type + "-" + key) == null) {
            if (victims[type][key] == 0)
              continue;
            child = document.createElement('div');
            child.id = "stats-" + type + "-" + key;
            child.classList.add("stat-line");
            document.getElementById("stats-" + type).appendChild(child);
          }
          document.getElementById("stats-" + type + "-" + key).innerHTML = key + ": " + victims[type][key];
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

  var heightStr = metric ? metricLength(heightDelta) : customaryLength(heightDelta);
  var massStr = metric ? metricMass(massDelta) : customaryMass(massDelta);

  update(["Power surges through you as you grow " + heightStr + " and gain " + massStr,newline]);
}

// pop the list and digest that object

function doDigest(containerName)
{
  var digestType = containerName == "stomach" ? stomach : bowels;
  var count = 0

  if (containerName == "stomach") {
    count = stomach.length;
    count = Math.min(count,maxStomachDigest);
  } else if (containerName == "bowels") {
    count = bowels.length;
    count = Math.min(count,maxBowelsDigest);
  }

  var container = new Container();

  while (count > 0) {
    --count;
    var toDigest = digestType.shift();
    if (toDigest.name != "Container")
      toDigest = new Container([toDigest]);
    container = container.merge(toDigest);
  }

  var digested = container.sum();

  for (var key in victims[containerName]) {
    if (victims[containerName].hasOwnProperty(key) && digested.hasOwnProperty(key) ) {
      victims["digested"][key] += digested[key];
      victims[containerName][key] -= digested[key];
    }
  }

  if (containerName == "stomach")
    update(["Your stomach gurgles as it digests " + container.describe(false),summarize(container.sum()),newline]);
  else if (containerName == "bowels")
    update(["Your bowels churn as they absorb " + container.describe(false),summarize(container.sum()),newline]);

  if (digestType.length > 0) {
    setTimeout(function() {
      doDigest(containerName);
    }, 15000);
  }
}

window.addEventListener('load', function(event) {
  victims["stomped"] = initVictims();
  victims["digested"] = initVictims();
  victims["stomach"] = initVictims();
  victims["bowels"] = initVictims();

  document.getElementById("button-look").addEventListener("click",look);
  document.getElementById("button-grow").addEventListener("click",grow);
  document.getElementById("button-feed").addEventListener("click",feed);
  document.getElementById("button-stomp").addEventListener("click",stomp);
  document.getElementById("button-anal_vore").addEventListener("click",anal_vore);
  document.getElementById("button-stroll").addEventListener("click",toggle_auto);
  document.getElementById("button-location").addEventListener("click",change_location);
  document.getElementById("button-units").addEventListener("click",toggle_units);
  document.getElementById("button-verbose").addEventListener("click",toggle_verbose);
  setTimeout(pick_move, 2000);

  update();
});
