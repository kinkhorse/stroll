var baseHeight = 3.65;
var baseMass = 1360;
var scale = 1;

var people = 0;
var cars = 0;

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

  var prey = new Person(Math.round(scale * scale * (Math.random() / 5 + 1)));

  people += prey.count;

  line.innerHTML = prey.eat();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();

  setTimeout(feed, 2500);
}

function stomp()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = new Person(Math.round(scale * scale * (Math.random() / 4 + 1)));

  people += prey.count;

  line.innerHTML = prey.stomp();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass")/3;

  scale = scaleAddMass(scale, baseMass, preyMass);

  update();

  setTimeout(stomp, 1500);
}

function anal_vore()
{
  var log = document.getElementById("log");
  var line = document.createElement('div');

  var prey = new Person(Math.round(scale * scale * 3 * (Math.random() / 3 + 1)));

  people += prey.count;

  line.innerHTML = prey.anal_vore();
  log.appendChild(line);

  var preyMass = prey.sum_property("mass");

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

  document.getElementById("people").innerHTML = "People: " + people;
  document.getElementById("cars").innerHTML = "Cars: " + cars;
}

window.addEventListener('load', function(event) {
  setTimeout(feed, 2500);
  setTimeout(stomp, 1500);
  setTimeout(anal_vore, 4500);

  update();
});
