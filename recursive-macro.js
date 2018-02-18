
var things =
{
  "Container": Container,
  "Person": Person,
  "Empty Car": EmptyCar,
  "Car": Car,
  "Bus": Bus,
  "Motorcycle": Motorcycle,
  "House": House,
  "Train": Train,
  "Parking Garage": ParkingGarage,
  "Overpass": Overpass,
};

var areas =
{
  "Container": 0,
  "Person": 3,
  "Car": 4,
  "Bus": 12,
  "Motorcycle": 2,
  "House": 1000,
  "Train": 10000,
  "Parking Garage": 20000,
  "Overpass": 10000,
};

function fill_area(area, weights = {"Person": 0.1})
{
  var testRadius = Math.sqrt(area / Math.PI);
  result = []
  for (var key in weights) {
    if (weights.hasOwnProperty(key)) {
      var objArea = areas[key];
      var objRadius = Math.sqrt(objArea / Math.PI);
      var newRadius = testRadius - objRadius;

      if (newRadius > 0) {
        var newArea = newRadius * newRadius * Math.PI;
        var numObjs = weights[key] * newArea;
        if (numObjs < 1) {
          numObjs = Math.random() > numObjs ? 0 : 1;
        }
        else {
          numObjs = Math.round(numObjs);
        }

        if (numObjs > 0)
          result.push(new things[key](numObjs));
        else {
          // try again with a better chance for just one
        }

      }

    }
  }

  if (result.length > 1)
    return new Container(result);
  else if (result.length == 1)
    return result[0];
  else
    return new Person();
}

var masses =
{
  "Container": 0,
  "Person": 80,
  "Car": 1000,
  "Bus": 5000,
  "Motorcycle": 200,
  "House": 10000,
  "Train": 50000,
  "Parking Garage": 100000,
  "Overpass": 100000,
};

// describes everything in the container

function describe_all(contents) {
    var things = [];
    for (var key in contents) {
      if (contents.hasOwnProperty(key)) {
        things.push(contents[key].describe());
      }
    }
    return merge_things(things);
}

function random_desc(list, odds=1) {
  if (Math.random() < odds)
    return list[Math.floor(Math.random() * list.length)];
  else
    return "";
}

// combine strings into a list with proper grammar

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

// combine the adjectives for something into a single string

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

// solution: only a few are random lul

function distribution(min, max, samples) {
  var result = 0;
  var limit = Math.min(100,max)
  for (var i = 0; i < limit; i++) {
    result += Math.floor(Math.random() * (max - min + 1) + min);
  }

  if (limit < samples) {
    result += Math.round((max - min) * (samples - limit));
  }

  return result;
}

/* default actions */

function defaultStomp(thing) {
  return function () { return "You crush " + thing.describe() + " underfoot."};
}

function defaultKick(thing) {
  return function() { return "You punt " + thing.describe() + ", destroying " + (thing.count > 1 ? "them" : "it") + "."; }
}

function defaultEat(thing) {
  return function() { return "You scoop up " + thing.describe() + " and swallow " + (thing.count > 1 ? "them" : "it") + " whole."; }
}

function defaultAnalVore(thing) {
  return function() { return "Your ass slams down on " + thing.describe() + ". " + (thing.count > 1 ? "They slide" : "It slides") + " inside with ease."; }
}

function defaultArea(thing) {
  return areas[thing.name];
}

function defaultMass(thing) {
  return masses[thing.name];
}

function defaultMerge(thing) {
  return function(container) {
    var newCount = this.count + container.count;

    var newThing = new things[thing.name](newCount);
    newThing.contents = {};

    for (var key in this.contents) {
      if (this.contents.hasOwnProperty(key)) {
        newThing.contents[key] = this.contents[key];
      }
    }

    for (var key in container.contents) {
      if (container.contents.hasOwnProperty(key)) {
        if (this.contents.hasOwnProperty(key)) {
          newThing.contents[key] = this.contents[key].merge(container.contents[key]);
        } else {;
          newThing.contents[key] = container.contents[key];
        }
      }
    }

    return newThing;
  }
}

function defaultSum(thing) {
  return function() {
    var counts = {}

    if (thing.name != "Container")
      counts[thing.name] = thing.count;

    for (var key in thing.contents) {
      if (thing.contents.hasOwnProperty(key)) {
        subcount = thing.contents[key].sum();
        for (var subkey in subcount) {
          if (!counts.hasOwnProperty(subkey)) {
            counts[subkey] = 0;
          }
          counts[subkey] += subcount[subkey];
        }
      }
    }

    return counts;
  }
}

function defaultSumProperty(thing) {
  return function(prop) {
    var total = 0;

    total += thing[prop] * thing.count;

    for (var key in thing.contents) {
      if (thing.contents.hasOwnProperty(key)) {
        total += thing.contents[key].sum_property(prop);
      }
    }

    return total;
  }
}

function DefaultEntity() {
  this.stomp = defaultStomp;
  this.eat = defaultEat;
  this.kick = defaultKick;
  this.anal_vore = defaultAnalVore;
  this.sum = defaultSum;
  this.area = defaultArea;
  this.mass = defaultMass;
  this.sum_property = defaultSumProperty;
  this.merge = defaultMerge;
  return this;
}

// god I love reinventing the wheel

function copy_defaults(self,proto) {
  for (var key in proto) {
    if (proto.hasOwnProperty(key)) {
      self[key] = proto[key](self)
    }
  }
}

function Container(contents = []) {
  this.name = "Container";

  copy_defaults(this,new DefaultEntity());

  this.count = 0;

  this.contents = {}

  for (var i=0; i < contents.length; i++) {
    this.contents[contents[i].name] = contents[i];
  }

  for (var key in this.contents) {
    if (this.contents.hasOwnProperty(key)) {
      this.count += this.contents[key].count;
    }
  }

  this.describe = function() {
    return describe_all(this.contents)
  }

  return this;
}

function Person(count = 1) {
  this.name = "Person";

  copy_defaults(this,new DefaultEntity());

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

  copy_defaults(this,new DefaultEntity());
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
      return this.count + " parked cars";
    }
  }
}

function Car(count = 1) {
  this.name = "Car";

  copy_defaults(this,new DefaultEntity());
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

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};

  var amount = distribution(10,35,count);
  this.contents.person = new Person(amount);

  this.describeOne = function(verbose=true) {
    adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
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

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};




  var amount = distribution(1,2,count);
  this.contents.person = new Person(amount);
}

function Train(count = 1) {
  this.name = "Train";
  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = {};

  var amount = distribution(50,250,count);
  this.contents.person = new Person(amount);

  amount = distribution(10,50,count);
  this.contents.emptycar = new EmptyCar(amount);


  this.describeOne = function(verbose=true) {
    adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    type = random_desc(["train","passenger train","freight train"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function() {
    if (this.count <= 3) {
      list = [];
      for (var i = 0; i < this.count; i++) {
        list.push(this.describeOne(this.count < 2));
      }
      return merge_things(list) + " with " + describe_all(this.contents) + " inside";
    } else {
      return this.count + " trains with " + describe_all(this.contents) + " inside";
    }
  }
}
function House(count = 1) {
  this.name = "House";
  copy_defaults(this,new DefaultEntity());
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
  copy_defaults(this,new DefaultEntity());
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
      return merge_things(list) + " with " + describe_all(this.contents) + " inside";
    } else {
      return this.count + " parking garages with " + describe_all(this.contents) + " inside";
    }
  }
}

function Overpass(count = 1) {
  this.name = "Overpass";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};




  var amount = distribution(0,20,count);
  this.contents.person = new Person(amount);
  amount = distribution(25,100,count);
  this.contents.car = new Car(amount);
}
