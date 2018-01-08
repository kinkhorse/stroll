
function random_desc(list, odds=1) {
  if (Math.random() < odds)
    return list[Math.floor(Math.random() * list.length)];
  else
    return "";
}

function merge_things(list,semicolons=false) {
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

/* default actions */

function defaultStomp(thing) {
  return "You crush " + thing.describe() + " underfoot.";
}

function defaultKick(thing) {
  return "You punt " + thing.describe() + ", destroying " + (thing.count > 1 ? "them" : "it") + ".";
}

function defaultEat(thing) {
  return "You scoop up " + thing.describe() + " and swallow " + (thing.count > 1 ? "them" : "it") + " whole.";
}

function DefaultEntity() {
  this.stomp = defaultStomp;
  this.eat = defaultEat;
  this.kick = defaultKick;

  return this;
}
function Person(count = 1) {
  this.name = "Person";
  this.count = count;
  this.contents = {};
  this.describeOne = function (verbose=true) {
    sex = random_desc(["male", "female"], (verbose ? 1 : 0));
    body = random_desc(["skinny","fat","tall","short","stocky","spindly"], (verbose ? 0.6 : 0));
    species = random_desc(["wolf","cat","dog","squirrel","horse","hyena","fox","jackal","crux","sergal"]);
    return "a " + merge_desc([sex,body,species]);
  }

  this.describe = function() {
    if (count <= 3) {
      list = [];
      for (var i = 0; i < count; i++) {
        list.push(this.describeOne(this.count <= 2));
      }
      return merge_things(list);
    } else {
      return this.count + " people"
    }
  }

  return this;
}

function EmptyCar(count = 1) {
  this.name = "Car";
  this.count = count;
  this.contents = {};

  this.describeOne = function() {
    color = random_desc(["black","black","gray","gray","blue","red","tan","white","white"]);
    adjective = random_desc(["rusty","brand-new"],0.3);
    type = random_desc(["SUV","coupe","sedan","truck","van","convertible"]);
    return "a parked " + merge_desc([adjective,color,type]);
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne());
      }
      return merge_things(list);
    } else {
      return this.count + " parked cars"
    }
  }
}

function Car(count = 1) {
  this.name = "Car";
  this.count = count;
  this.contents = {};
  var amount = distribution(2,5,count);
  this.contents.person = new Person(amount);

  this.describeOne = function(verbose=true) {
    color = random_desc(["black","black","gray","gray","blue","red","tan","white","white"], (verbose ? 1 : 0));
    adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    type = random_desc(["SUV","coupe","sedan","truck","van","convertible"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne(this.count < 2));
      }
      return merge_things(list) + " with " + this.contents.person.describe() + " inside";
    } else {
      return this.count + " cars with " + this.contents.person.describe() + " inside";
    }
  }
}

function Bus(count = 1) {
  this.name = "Bus";
  this.count = count;
  this.contents = {};
  this.resolved = false;
  var amount = distribution(10,35,count);
  this.contents.person = new Person(amount);

  this.describeOne = function(verbose=true) {
    color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    type = random_desc(["bus","double-decker bus","articulating bus"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne(this.count < 2));
      }
      return merge_things(list) + " with " + this.contents.person.describe() + " inside";
    } else {
      return this.count + " buses with " + this.contents.person.describe() + " inside";
    }
  }
}

function Motorcycle(count = 1) {
  this.name = "Motorcycle";
  this.count = count;
  this.contents = {};
  var amount = distribution(1,2,count);
  this.contents.person = new Person(amount);
}

function Train(count = 1) {
  this.name = "Train";
  this.count = count;
  this.contents = {};
  var amount = distribution(20,60,count);
  this.contents.person = new Person(amount);
}

function House(count = 1) {
  this.name = "House";
  this.count = count;
  this.contents = {};
  var amount = distribution(0,8,count);
  this.contents.person = new Person(amount);
  amount = distribution(0,2,count);
  this.contents.emptycar = new EmptyCar(amount);

  this.describeOne = function(verbose=true) {
    size = random_desc(["little","two-story","large"], (verbose ? 0.5 : 0));
    color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    name = random_desc(["house","house","house","house","house","trailer"], 1);
    return "a " + merge_desc([size,color,name]);
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne(this.count < 2));
      }
      return merge_things(list) + " with " + this.contents.person.describe() + " inside";
    } else {
      return this.count + " homes with " + this.contents.person.describe() + " inside";
    }
  }
}

function ParkingGarage(count = 1) {
  this.name = "Parking Garage";
  this.count = count;
  this.contents = {};
  var amount = distribution(10,200,count);
  this.contents.person = new Person(amount);
  amount = distribution(30,100,count);
  this.contents.emptycar = new EmptyCar(amount);
  amount = distribution(5,20,count);
  this.contents.car = new Car(amount);

  this.describeOne = function(verbose=true) {
    return "a parking garage";
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne(this.count < 2));
      }
      return merge_things(list) + " with " + merge_things([this.contents.person.describe(),this.contents.emptycar.describe(),this.contents.car.describe()]) + " inside";
    } else {
      return this.count + " parking garages with " + this.contents.person.describe() + " inside";
    }
  }
}

function Overpass(count = 1) {
  this.name = "Overpass";
  this.count = count;
  this.contents = {};
  var amount = distribution(0,20,count);
  this.contents.person = new Person(amount);
  amount = distribution(25,100,count);
  this.contents.car = new Car(amount);
}
