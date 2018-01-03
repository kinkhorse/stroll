
function random_desc(list, odds=1) {
  if (Math.random() < odds)
    return list[Math.floor(Math.random() * list.length)];
  else
    return "";
}

function merge_things(list) {
  if (list.length == 0) {
    return "";
  } else if (list.length == 1) {
    return list[0];
  } else if (list.length == 2) {
    return list[0] + " and " + list[1];
  } else {
    result = "";

    list.slice(0,list.length-1).forEach(function(term) {
      result += term + ", ";
    })

    result += "and " + list[list.length-1]

    return result;
  }
}

function merge_desc(list) {
  result = ""

  list.forEach(function(term) {
    if (term != "")
      result += term + " ";
  });

  // knock off the last space
  if (result.length > 0) {
    result = result.substring(0, result.length - 1);
  }

  return result;
}
// maybe make this something that approximates a
// normal distribution; doing this 15,000,000 times is bad...

function distribution(min, max, samples) {
  var result = 0;
  for (var i = 0; i < samples; i++) {
    result += Math.floor(Math.random() * (max - min + 1) + min);
  }

  return result;
}

function Person(count = 1) {
  this.name = "Person";
  this.count = count;
  this.contents = [];

  this.describeOne = function () {
    sex = random_desc(["male", "female"]);
    body = random_desc(["skinny","fat","tall","short","stocky","spindly"],0.6);
    species = random_desc(["wolf","cat","dog","squirrel","horse","hyena","fox","jackal","crux","sergal"]);
    return "a " + merge_desc([sex,body,species]);
  }

  this.describe = function() {
    if (count <= 3) {
      list = [];
      for (var i = 0; i < count; i++) {
        list.push(this.describeOne());
      }
      return merge_things(list);
    } else {
      return this.count + " people."
    }
  }

  return this;
}

function EmptyCar(count = 1) {
  this.name = "Car";
  this.count = count;
  this.contents = [];

  this.describeOne
}

function Car(count = 1) {
  this.name = "Car";
  this.count = count;
  this.contents = [];
  var amount = distribution(2,5,count);
  this.contents.push(new Person(amount));
}

function Bus(count = 1) {
  this.name = "Bus";
  this.count = count;
  this.contents = [];
  this.resolved = false;
  var amount = distribution(10,35,count);
  this.contents.push(new Person(amount));
}

function Motorcycle(count = 1) {
  this.name = "Motorcycle";
  this.count = count;
  this.contents = [];
  var amount = distribution(1,2,count);
  this.contents.push(new Person(amount));
}

function Train(count = 1) {
  this.name = "Train";
  this.count = count;
  this.contents = [];
  var amount = distribution(20,60,count);
  this.contents.push(new Person(amount));
}

function House(count = 1) {
  this.name = "House";
  this.count = count;
  this.contents = [];
  var amount = distribution(0,8,count);
  this.contents.push(new Person(amount));
  amount = distribution(0,2,count);
  this.contents.push(new Car(amount));
}

function ParkingGarage(count = 1) {
  this.name = "Parking Garage";
  this.count = count;
  this.contents = [];
  var amount = distribution(10,200,count);
  this.contents.push(new Person(amount));
  amount = distribution(30,100,count);
  this.contents.push(new EmptyCar(amount));
  amount = distribution(5,20,count);
  this.contents.push(new Car(amount));
}

function Overpass(count = 1) {
  this.name = "Overpass";
  this.count = count;
  this.contents = [];
  var amount = distribution(0,20,count);
  this.contents.push(new Person(amount));
  amount = distribution(25,100,count);
  this.contents.push(new Car(amount));
}
