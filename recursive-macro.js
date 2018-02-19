var things =
{
  "Container": Container,
  "Person": Person,
  "Empty Car": EmptyCar,
  "Car": Car,
  "Bus": Bus,
  "Tram": Tram,
  "Motorcycle": Motorcycle,
  "House": House,
  "Small Skyscraper": SmallSkyscraper,
  "Train": Train,
  "Train Car": TrainCar,
  "Parking Garage": ParkingGarage,
  "Overpass": Overpass,
};

var areas =
{
  "Container": 0,
  "Person": 1,
  "Car": 4,
  "Bus": 12,
  "Tram": 20,
  "Motorcycle": 2,
  "House": 1000,
  "Small Skyscraper": 10000,
  "Train": 500,
  "TrainCar": 500,
  "Parking Garage": 5000,
  "Overpass": 10000,
};

var masses =
{
  "Container": 0,
  "Person": 80,
  "Car": 1000,
  "Bus": 5000,
  "Tram": 10000,
  "Motorcycle": 200,
  "House": 10000,
  "Small Skyscraper": 100000,
  "Train": 5000,
  "Train Car": 5000,
  "Parking Garage": 100000,
  "Overpass": 100000,
};

// general logic: each step fills in a fraction of the remaining space

function fill_area2(area, weights = {"Person": 0.1, "Car": 0.05, "House": 0.1})
{
  result = [];
  candidates = [];
  for (var key in weights) {
    if (weights.hasOwnProperty(key)) {
      candidates.push({"name": key, "area": areas[key], "weight": weights[key]});
    }
  }

  candidates = candidates.sort(function (x,y) {
    return x.area - y.area;
  });

  while(candidates.length > 0) {
    var candidate = candidates.pop();

    if (candidate.area > area)
      continue;

    var max = Math.floor(area / candidate.area);
    var limit = Math.min(max, 100);

    var count = 0;

    // for small amounts, actually do the randomness

    // the first few ones get a better shot
    while (limit > 0) {
      if (limit <= 3)
        count += Math.random() < (1 - Math.pow((1 - candidate.weight),2)) ? 1 : 0;
      else
        count += Math.random() < candidate.weight ? 1 : 0;
      --limit;
    }

    if (limit < max) {
      count += Math.round((max-limit) * candidate.weight);
    }

    area -= count * candidate.area;

    if (count > 0)
      result.push(new things[candidate.name](count));
  }

  if (result.length > 1) {
    return new Container(result);
  } else if (result.length == 1) {
    return result[0];
  } else {
    return new Person(1);
  }

}

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

// describes everything in the container

function describe_all(contents,verbose=true) {
    var things = [];
    for (var key in contents) {
      if (contents.hasOwnProperty(key)) {
        things.push(contents[key].describe(verbose));
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
  var limit = Math.min(100,samples)
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
  return function (verbose=true,height=10) { return "You crush " + thing.describe(verbose) + " underfoot."};
}

function defaultKick(thing) {
  return function(verbose=true,height=10) { return "You punt " + thing.describe(verbose) + ", destroying " + (thing.count > 1 ? "them" : "it") + "."; }
}

function defaultEat(thing) {
  return function(verbose=true,height=10) { return "You scoop up " + thing.describe(verbose) + " and swallow " + (thing.count > 1 ? "them" : "it") + " whole."; }
}

function defaultAnalVore(thing) {
  return function(verbose=true,height=10) { return "You sit yourself down on " + thing.describe(verbose) + ". " + (thing.count > 1 ? "They slide" : "It slides") + " inside with ease."; }
}

function defaultButtcrush(thing) {
  return function(verbose=true,height=10) { return "Your heavy ass obliterates " + thing.describe(verbose) + ". "; }
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
  this.buttcrush = defaultButtcrush;
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

  this.describe = function(verbose = true) {
    return describe_all(this.contents,verbose)
  }

  this.eat = function(verbose=true) {
    var line = containerEat(this,verbose);
    if (line == "")
      return defaultEat(this)(verbose);
    else
      return line;
  };

  return this;
}

function Person(count = 1) {
  this.name = "Person";

  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = {};


  this.describeOne = function (verbose=true) {
    body = random_desc(["skinny","fat","tall","short","stocky","spindly"], (verbose ? 0.6 : 0));
    sex = random_desc(["male", "female"], (verbose ? 1 : 0));
    species = random_desc(["wolf","cat","dog","squirrel","horse","hyena","fox","jackal","crux","sergal"]);
    return "a " + merge_desc([body,sex,species]);
  }

  this.describe = function(verbose=true) {
    if (verbose) {
      if (count <= 3) {
        list = [];
        for (var i = 0; i < count; i++) {
          list.push(this.describeOne(this.count <= 2));
        }
        return merge_things(list);
      } else {
        return this.count + " people"
      }
    } else {
      return (this.count > 1 ? this.count + " people" : "a person");
    }

  }

  this.stomp = function(verbose=true) {
    var line = personStomp(this);
    if (line == "")
      return defaultStomp(this)(verbose);
    else
      return line;
  };

  this.eat = function(verbose=true) {
    var line = personEat(this);
    if (line == "")
      return defaultEat(this)(verbose);
    else
      return line;
  };
  return this;
}

function EmptyCar(count = 1) {
  this.name = "Car";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};




  this.describeOne = function(verbose=true) {
    color = random_desc(["black","black","gray","gray","blue","red","tan","white","white"]);
    adjective = random_desc(["rusty","brand-new"],0.3);
    type = random_desc(["SUV","coupe","sedan","truck","van","convertible"]);
    return "a parked " + merge_desc([adjective,color,type]);
  }

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne());
        }
        return merge_things(list);
      } else {
        return this.count + " parked cars";
      }
    } else {
      return (this.count > 1 ? this.count + " parked cars" : "a parked car");
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

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + this.contents.person.describe(false) + " inside";
      } else {
        return this.count + " cars with " + this.contents.person.describe(false) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " cars" : "a car");
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

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + this.contents.person.describe() + " inside";
      } else {
        return this.count + " buses with " + this.contents.person.describe() + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " buses" : "a bus");
    }

  }
}

function Tram(count = 1) {
  this.name = "Tram";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};

  var amount = distribution(40,60,count);
  this.contents.person = new Person(amount);

  this.describeOne = function(verbose=true) {
    adjective = random_desc(["rusty","weathered"], (verbose ? 0.3 : 0));
    color = random_desc(["blue","brown","gray"], (verbose ? 1 : 0));
    type = random_desc(["tram"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + this.contents.person.describe() + " inside";
      } else {
        return this.count + " trams with " + this.contents.person.describe() + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " trams" : "a tram");
    }
  }


  this.anal_vore = function() {
    return "You slide " + this.describe() + " up your tight ass";
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

  var amount = distribution(1,4,count);
  this.contents.person = new Person(amount);

  amount = distribution(1,10,count);
  this.contents.traincar = new TrainCar(amount);

  this.describeOne = function(verbose=true) {
    adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    type = random_desc(["train","passenger train","freight train"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + this.contents.person.describe() + " in the engine and " + this.contents.traincar.describe()  + " attached";
      } else {
        return this.count + " trains with " + this.contents.person.describe() + " in the engine and " + this.contents.traincar.describe()  + " attached";
      }
    } else {
      return (this.count > 1 ? this.count + " trains" : "a train");
    }

  }

  this.anal_vore = function() {
    var cars = (this.contents.traincar.count == 1 ? this.contents.traincar.describe() + " follows it inside" : this.contents.traincar.describe() + " are pulled slowly inside");
    return "You snatch up " + this.describeOne() + " and stuff it into your pucker, moaning as " + cars;
  }
}

function TrainCar(count = 1) {
  this.name = "Train Car";
  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = {};

  var amount = distribution(10,40,count);
  this.contents.person = new Person(amount);

  this.describeOne = function(verbose=true) {
    adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    type = random_desc(["train car","passenger train car","freight train car"]);
    return "a " + merge_desc([adjective,color,type]);
  }

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents) + " inside";
      } else {
        return this.count + " train cars with " + describe_all(this.contents) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " train cars" : "a train car");
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

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + this.contents.person.describe(verbose) + " inside";
      } else {
        return this.count + " homes with " + this.contents.person.describe(verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " houses" : "a house");
    }
  }
}

function SmallSkyscraper(count = 1) {
  this.name = "Small Skyscraper";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = {};

  var amount = distribution(50,500,count);
  this.contents.person = new Person(amount);
  amount = distribution(10,50,count);
  this.contents.emptycar = new EmptyCar(amount);

  this.describeOne = function(verbose=true) {
    color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    name = random_desc(["skyscraper","office tower","office building"], 1);
    return "a " + merge_desc([color,name]);
  }

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " small skyscrapers with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " skyscrapers" : "a skyscraper");
    }

  }

  this.anal_vore = function(verbose=true,height=10) {
    var line = skyscraperAnalVore(this,verbose,height);
    if (line == "")
      return defaultAnalVore(this)(verbose);
    else
      return line;
  };
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

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a parking garage" : this.count + " parking garages") + " with " + describe_all(this.contents, verbose) + " inside";
    } else {
      return (this.count == 1 ? "a parking garage" : this.count + " parking garages");
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
