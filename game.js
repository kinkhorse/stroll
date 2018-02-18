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

  var prey = getPrey("suburb", 2*scale*scale);
  updateVictims(prey);

  line.innerHTML = prey.eat();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass") * 3;

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();

  setTimeout(feed, 2000);
}

function stomp()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = getPrey("suburb", 2*scale*scale);
  updateVictims(prey);

  line.innerHTML = prey.stomp();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();

  setTimeout(stomp, 1250);
}

function anal_vore()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = getPrey("suburb", 4*scale*scale);
  if (prey.name == "Person" && prey.count == 1 && scale*scale > 4)
    prey = new Car(1);
  updateVictims(prey);

  line.innerHTML = prey.anal_vore();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass") * 5;

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();

  setTimeout(anal_vore, 4500);
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

window.addEventListener('load', function(event) {
  setTimeout(feed, 2000);
  setTimeout(stomp, 1250);
  setTimeout(anal_vore, 4500);

  update();
});
