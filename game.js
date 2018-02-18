var baseHeight = 3.65;
var baseMass = 1360;
var scale = 1;

var victims =
{
  "Person": 0,
  "Car": 0,
  "Bus": 0,
  "Motorcycle": 0,
  "House": 0,
  "Train": 0,
  "Parking Garage": 0,
  "Overpass": 0
}

function getOnePrey(area)
{
  var potential = ["Person", "Car", "Bus", "House", "Train", "Parking Garage"];

  var potAreas = []

  potential.forEach(function (x) {
    potAreas.push([x,areas[x]]);
  });

  potAreas = potAreas.sort(function (x,y) {
    return x[1] < y[1];
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
  switch(region)
  {
    case "suburb": return suburbPrey(area);
  }
}

function suburbPrey(area)
{
  return fill_area(area, {"Person": 0.5, "House": 0.5, "Car": 0.2});
}

function updateVictims(prey)
{
  var sums = prey.sum();

  for (var key in sums) {
    if (sums.hasOwnProperty(key)) {
      victims[key] += sums[key];
    }
  }
}

function scaleAddMass(scale, baseMass, mass)
{
  var startMass = Math.pow(scale, 3) * baseMass;
  var newMass = startMass + mass;
  return Math.pow(newMass / baseMass, 1/3) ;
}

function feed()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = getPrey("suburb", 0.5*scale*scale);
  updateVictims(prey);

  line.innerHTML = prey.eat();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();
}

function stomp()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = getPrey("suburb", 1.5*scale*scale);
  updateVictims(prey);

  line.innerHTML = prey.stomp();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();
}

function anal_vore()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = getOnePrey(scale*scale*2)
  updateVictims(prey);

  line.innerHTML = prey.anal_vore();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();
}

function update()
{
  var log = document.getElementById("log");

  log.scrollTop = log.scrollHeight;
  var height = baseHeight * scale;
  var mass = baseMass * Math.pow(scale, 3);

  document.getElementById("height").innerHTML = "Height: " + Math.round(height * 3) + " feet";
  document.getElementById("mass").innerHTML = "Mass: " + Math.round(mass * 2.2) + " pounds";

  for (var key in victims){
    if (victims.hasOwnProperty(key)) {
      if (victims[key] > 0)
        document.getElementById(key).innerHTML = key + ": " + victims[key];
    }
  }
}

function pick_move()
{
  var choice = Math.random();

  if (choice < 0.2) {
    anal_vore();
    setTimeout(pick_move, 4000);
  } else if (choice < 0.6) {
    stomp();
    setTimeout(pick_move, 1500);
  } else {
    feed();
    setTimeout(pick_move, 2000);
  }
}

window.addEventListener('load', function(event) {
  setTimeout(pick_move, 2000);

  update();
});
