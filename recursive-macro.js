'use strict';

var things =
{
  "Container": Container,
  "Person": Person,
  "Human": Human,
  "Cow": Cow,
  "Empty Car": EmptyCar,
  "Car": Car,
  "Bus": Bus,
  "Tram": Tram,
  "House": House,
  "Barn": Barn,
  "Small Skyscraper": SmallSkyscraper,
  "Large Skyscraper": LargeSkyscraper,
  "Train": Train,
  "Train Car": TrainCar,
  "Parking Garage": ParkingGarage,
  "Town": Town,
  "City": City,
  "Continent": Continent,
  "Planet": Planet,
  "Star": Star,
  "Solar System": SolarSystem,
  "Galaxy": Galaxy,
  "Cluster": Cluster,
  "Universe": Universe,
  "Multiverse": Multiverse,
  "Soldier": Soldier,
  "Tank": Tank,
  "Artillery": Artillery,
  "Helicopter": Helicopter,
  "Micro": Micro,
  "Macro": Macro,
};

var areas =
{
  "Container": 0,
  "Person": 0.33,
  "Human": 0.33,
  "Cow": 2,
  "Car": 4,
  "Bus": 12,
  "Tram": 20,
  "House": 150,
  "Barn": 300,
  "Small Skyscraper": 1000,
  "Large Skyscraper": 2000,
  "Train": 40,
  "TrainCar": 20,
  "Parking Garage": 750,
  "Town": 1e7,
  "City": 1e9,
  "Continent": 1.5e13,
  "Planet": 2.5e14,
  "Star": 3e18,
  "Solar System": 3e21,
  "Galaxy": 2e45,
  "Cluster": 2e49,
  "Universe": 7e53,
  "Multiverse": 5e56,
  "Soldier": 1,
  "Tank": 10,
  "Artillery": 12,
  "Helicopter": 8,
  "Micro": 0.05,
  "Macro": 100,
};

var masses =
{
  "Container": 0,
  "Person": 80,
  "Human": 80,
  "Cow": 300,
  "Car": 1000,
  "Bus": 5000,
  "Tram": 10000,
  "House": 10000,
  "Barn": 5000,
  "Small Skyscraper": 10000000,
  "Large Skyscraper": 80000000,
  "Train": 50000,
  "Train Car": 7500,
  "Parking Garage": 10000000,
  "Town": 1,
  "City": 1,
  "Continent": 1e21,
  "Planet": 5.972e24,
  "Star": 1e40,
  "Solar System": 1,
  "Galaxy": 1,
  "Cluster": 1,
  "Universe": 1,
  "Multiverse": 1,
  "Soldier": 80,
  "Tank": 5000,
  "Artillery": 7000,
  "Helicopter": 1500,
  "Micro": 0.01,
  "Macro": 80000,
};

var clusters =
{
  "Container": 0,
  "Person": 5,
  "Human": 5,
  "Cow": 15,
  "Car": 3,
  "Bus": 1,
  "Tram": 1,
  "House": 5,
  "Barn": 1,
  "Small Skyscraper": 2,
  "Large Skyscraper": 1,
  "Train": 2,
  "Train Car": 1,
  "Parking Garage": 1,
  "Town": 5,
  "City": 1,
  "Continent": 5,
  "Planet": 1,
  "Star": 1,
  "Solar System": 1,
  "Galaxy": 1,
  "Cluster": 1,
  "Universe": 1,
  "Multiverse": 1,
  "Soldier": 0,
  "Tank": 0,
  "Artillery": 0,
  "Helicopter": 0,
  "Micro": 10,
  "Macro": 0,
};

var contents =
{
  "Container": [],
  "Person": [],
  "Human": [],
  "Cow": [],
  "Car": [["Person",1,4]],
  "Bus": [["Person",2,30]],
  "Tram": [["Person",10,50]],
  "Train": [["Person",1,4,"engine"],["Train Car",2,10]],
  "Train Car": [["Person",10,40]],
  "House": [["Person",0,8],["Empty Car",0,2]],
  "Barn": [["Person",0,2],["Cow",30,70]],
  "Small Skyscraper": [["Person",150,750],["Empty Car",10,50]],
  "Large Skyscraper": [["Person",500,1500],["Empty Car",20,100]],
  "Parking Garage": [["Person",10,200],["Empty Car",100,300],["Car",5,30]],
  "Town": [["Person",10000,100000],["House",5000,50000],["Empty Car",200,800],["Car",500,80000],["Bus",5,25],["Train",5,25]],
  "City": [["Person",100000,1500000],["House",20000,200000],["Empty Car",10000,100000],["Car",7500,125000],["Bus",200,400],["Train",10,50],["Tram",25,100],["Small Skyscraper",50,300],["Large Skyscraper",10,75],["Parking Garage",5,10]],
  "Continent": [["Person",1000000,15000000],["House",2500,10000],["Car",25000,375000],["Train",50,500],["Town",500,1000],["City",50,250]],
  "Planet": [["Continent",4,9]],
  "Star": [],
  "Solar System": [["Star",1,1],["Planet",5,15]],
  "Galaxy": [["Star",1e9,500e9],["Solar System",1e8,500e8]],
  "Cluster": [["Galaxy",200,5000]],
  "Universe": [["Cluster",1.5e9,2.5e9]],
  "Multiverse": [["Universe",100,1000]],
  "Soldier": [],
  "Tank": [["Soldier",3,5]],
  "Artillery": [["Soldier",4,6]],
  "Helicopter": [["Soldier",4,16]],
  "Micro": [[]],
  "Macro": [[]]
};

// replace all instances of from with to
function contents_substitute(from,to) {
  for (let key in contents) {
    if (contents.hasOwnProperty(key)) {
      let type = contents[key];
      for (let i=0; i<type.length; i++) {
        if (type[i][0] == from) {
          type[i][0] = to;
        }
      }
    }
  }
}

// remove all instances of thing
function contents_remove(thing) {
  for (let key in contents) {
    if (contents.hasOwnProperty(key)) {
      let type = contents[key];
      for (let i=0; i<type.length; i++) {
        if (type[i][0] == thing) {
          type.splice(i,1);
          --i;
        }
      }
    }
  }
}

// adds thing to parent
function contents_insert(parent,thing,min,max,label) {
  let owner = contents[parent];
  if (label == undefined)
    owner.push([thing,min,max]);
  else
    owner.push([thing,min,max,label]);
}

function initContents(name,count) {
  let result = {};
  let type = contents[name];

  for (let i=0; i<type.length; i++) {
    let amount = distribution(type[i][1],type[i][2],count);
    if (amount > 0) {
      // if a custom label is supplied, use it!
      if (type[i].length == 4)
        result[type[i][3]] = new things[type[i][0]](amount);
      else
        result[type[i][0]] = new things[type[i][0]](amount);
    }
  }

  return result;
}


function get_living_prey(sum) {
  let total = 0;
  for (let key in sum) {
    if (sum.hasOwnProperty(key)) {
      if (key == "Micro" || key == "Macro" || key == "Person" || key == "Cow" || key == 'Soldier')
        total += sum[key];
    }
  }

  return total;
}

// general logic: each step fills in a fraction of the remaining space

function fill_area(area, weights, variance=0.15)
{
  area = area + Math.random() * variance * 2 * area - variance * area;
  var result = [];
  var candidates = [];
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
    var loopvar = limit;

    // for small amounts, actually do the randomness

    // the first few ones get a much better shot
    while (loopvar > 0) {
      if (loopvar <= clusters[candidate.name] && loopvar == 1)
        count += 1;
      else if (loopvar <= clusters[candidate.name]) {
        if (Math.random() < candidate.weight ? 1 : 0 || Math.random() < 0.75) {
          count += 1;
        }
      }
      else
        count += Math.random() < candidate.weight ? 1 : 0;
      --loopvar;
    }

    if (limit < max) {
      count += Math.round((max-limit) * candidate.weight);
    }

    area -= count * candidate.area;

    if (count > 0)
      result.push(new things[candidate.name](count));
  }

  return new Container(result);
}
// describes everything in the container

function describe_all(contents,verbose=true,except=[]) {
    var things = [];
    for (var key in contents) {
      if (contents.hasOwnProperty(key) && !except.includes(key)) {
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
    var result = "";

    list.slice(0,list.length-1).forEach(function(term) {
      result += term + ", ";
    });

    result += "and " + list[list.length-1];

    return result;
  }
}

// combine the adjectives for something into a single string

function merge_desc(list) {
  var result = "";

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

// improvement: take up to 100 samples, then use that to scale the final result

function distribution(min, max, samples) {
  var result = 0;
  var limit = Math.min(100,samples);

  if (limit < samples) {
    let dist = 0;
    for (let i = 0; i < limit; i++) {
      dist += Math.random();
    }
    dist /= 100;

    return Math.floor(dist * samples * (max - min + 1) + samples * min);
  } else {
    for (let i = 0; i < limit; i++) {
      result += Math.floor(Math.random() * (max - min + 1) + min);
    }
  }

  return result;
}

function defaultMultiply(thing) {
  return function(amount) {
    thing.count *= amount;
    for (var key in thing.contents) {
      if (thing.contents.hasOwnProperty(key)) {
        thing.contents[key].multiply(amount);
      }
    }
  };

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

    for (key in container.contents) {
      if (container.contents.hasOwnProperty(key)) {
        if (this.contents.hasOwnProperty(key)) {
          newThing.contents[key] = this.contents[key].merge(container.contents[key]);
        } else {
          newThing.contents[key] = container.contents[key];
        }
      }
    }

    return newThing;
  };
}

function listSum(sum) {
  let result = [];
  for (let key in sum) {
    if (sum.hasOwnProperty(key)) {
      result.push(new things[key](sum[key]).describe(false));
    }
  }

  return merge_things(result);
}

function defaultSum(thing) {
  return function() {
    var counts = {};

    if (thing.name != "Container")
      counts[thing.name] = thing.count;

    for (var key in thing.contents) {
      if (thing.contents.hasOwnProperty(key)) {
        var subcount = thing.contents[key].sum();
        for (var subkey in subcount) {
          if (!counts.hasOwnProperty(subkey)) {
            counts[subkey] = 0;
          }
          counts[subkey] += subcount[subkey];
        }
      }
    }

    return counts;
  };
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
  };
}

function defaultAddContent(thing) {
  return function(name, min, max, count) {
    if (min == max) {
      let object = new things[name](min*count);
      thing.contents[object.name] = object;
    } else {
      let object = new things[name](distribution(min, max, count));
      thing.contents[object.name] = object;
    }
  };
}

function DefaultEntity() {
  this.sum = defaultSum;
  this.area = defaultArea;
  this.mass = defaultMass;
  this.sum_property = defaultSumProperty;
  this.merge = defaultMerge;
  this.multiply = defaultMultiply;

  return this;
}

// god I love reinventing the wheel

function copy_defaults(self,proto) {
  for (var key in proto) {
    if (proto.hasOwnProperty(key)) {
      self[key] = proto[key](self);
    }
  }
}

function Container(contents = []) {
  this.name = "Container";

  copy_defaults(this,new DefaultEntity());

  if (Number.isInteger(contents))
    this.count = contents;
  else
    this.count = 0;

  this.contents = {};

  for (var i=0; i < contents.length; i++) {
    this.contents[contents[i].name] = contents[i];
  }

  for (var key in this.contents) {
    if (this.contents.hasOwnProperty(key)) {
      this.count += this.contents[key].count;
    }
  }

  this.describe = function(verbose = true) {
    return describe_all(this.contents,verbose);
  };

  return this;
}

function Person(count = 1) {
  this.name = "Person";

  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function (verbose=true) {
    var body = random_desc(["skinny","fat","tall","short","stocky","spindly"], (verbose ? 0.6 : 0));
    var sex = random_desc(["male", "female"], (verbose ? 1 : 0));
    var species = "";
    species = random_desc(["wolf","cat","dog","squirrel","horse","hyena","fox","jackal","crux","sergal"]);
    return "a " + merge_desc([body,sex,species]);
  };

  this.describe = function(verbose=true) {
    if (verbose) {
      if (count <= 3) {
        var list = [];
        for (var i = 0; i < count; i++) {
          list.push(this.describeOne(this.count <= 2));
        }
        return merge_things(list);
      } else {
        return this.count + " people";
      }
    } else {
      return (this.count > 1 ? this.count + " people" : "a person");
    }
  };

  return this;
}

function Human(count = 1) {
  this.name = "Person";

  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function (verbose=true) {
    var body = random_desc(["skinny","fat","tall","short","stocky","spindly"], (verbose ? 0.6 : 0));
    var sex = random_desc(["man", "woman"], 1);
    return "a " + merge_desc([body,sex]);
  };

  this.describe = function(verbose=true) {
    if (verbose) {
      if (count <= 3) {
        var list = [];
        for (var i = 0; i < count; i++) {
          list.push(this.describeOne(this.count <= 2));
        }
        return merge_things(list);
      } else {
        return this.count + " people";
      }
    } else {
      return (this.count > 1 ? this.count + " people" : "a person");
    }
  };

  return this;
}

function Cow(count = 1) {
  this.name = "Cow";

  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function (verbose=true) {
    var body = random_desc(["skinny","fat","tall","short","stocky","spindly"], (verbose ? 0.6 : 0));
    var sex = random_desc(["male", "female"], (verbose ? 1 : 0));
    return "a " + merge_desc([body,sex,"cow"]);
  };

  this.describe = function(verbose=true) {
    if (verbose) {
      if (count <= 3) {
        var list = [];
        for (var i = 0; i < count; i++) {
          list.push(this.describeOne(this.count <= 2));
        }
        return merge_things(list);
      } else {
        return this.count + " cattle";
      }
    } else {
      return (this.count > 1 ? this.count + " cattle" : "a cow");
    }
  };

  return this;
}

function EmptyCar(count = 1) {
  this.name = "Car";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var color = random_desc(["black","black","gray","gray","blue","red","tan","white","white"]);
    var adjective = random_desc(["rusty","brand-new"],0.3);
    var type = random_desc(["SUV","coupe","sedan","truck","van","convertible"]);
    return "a parked " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
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

  };
}

function Car(count = 1) {
  this.name = "Car";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var color = random_desc(["black","black","gray","gray","blue","red","tan","white","white"], (verbose ? 1 : 0));
    var adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    var type = random_desc(["SUV","coupe","sedan","truck","van","convertible"]);
    return "a " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " cars with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " cars" : "a car");
    }

  };
}

function Bus(count = 1) {
  this.name = "Bus";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    var color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    var type = random_desc(["bus","double-decker bus","articulating bus"]);
    return "a " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " buses with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " buses" : "a bus");
    }

  };
}

function Tram(count = 1) {
  this.name = "Tram";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var adjective = random_desc(["rusty","weathered"], (verbose ? 0.3 : 0));
    var color = random_desc(["blue","brown","gray"], (verbose ? 1 : 0));
    var type = random_desc(["tram"]);
    return "a " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count == 1) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(verbose));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " trams with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " trams" : "a tram");
    }
  };

  this.anal_vore = function() {
    return "You slide " + this.describe() + " up your tight ass";
  };
}

function Train(count = 1) {
  this.name = "Train";
  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    var color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    var type = random_desc(["train","passenger train","freight train"]);
    return "a " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count == 1) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(verbose));
        }
        return merge_things(list) + " with " + this.contents["engine"].describe(false) + " in the engine and " + this.contents["Train Car"].describe()  + " attached";
      } else {
        return this.count + " trains with " + this.contents["engine"].describe(false) + " in the engine and " + this.contents["Train Car"].describe()  + " attached";
      }
    } else {
      return (this.count > 1 ? this.count + " trains" : "a train");
    }

  };

  this.anal_vore = function() {
    var cars = (this.contents["Train Car"].count == 1 ? this.contents["Train Car"].describe() + " follows it inside" : this.contents["Train Car"].describe() + " are pulled slowly inside");
    return "You snatch up " + this.describeOne() + " and stuff it into your pucker, moaning as " + cars;
  };
}

function TrainCar(count = 1) {
  this.name = "Train Car";
  copy_defaults(this,new DefaultEntity());

  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var adjective = random_desc(["rusty","brand-new"], (verbose ? 0.3 : 0));
    var color = random_desc(["black","tan","gray"], (verbose ? 1 : 0));
    var type = random_desc(["train car","passenger train car","freight train car"]);
    return "a " + merge_desc([adjective,color,type]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count > 1 ? this.count + " train cars" : "a train car") + " with " + describe_all(this.contents) + " inside";
    } else {
      return (this.count > 1 ? this.count + " train cars" : "a train car");
    }
  };
}

function House(count = 1) {
  this.name = "House";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var size = random_desc(["little","two-story","large"], (verbose ? 0.5 : 0));
    var color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    var name = random_desc(["house","house","house","house","house","trailer"], 1);
    return "a " + merge_desc([size,color,name]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " homes with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " houses" : "a house");
    }
  };
}

function Barn(count = 1) {
  this.name = "Barn";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var size = random_desc(["little","big","large"], (verbose ? 0.5 : 0));
    var color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    var name = random_desc(["barn","barn","barn","barn","barn","farmhouse"], 1);
    return "a " + merge_desc([size,color,name]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " barns with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " barns" : "a barn");
    }
  };
}

function SmallSkyscraper(count = 1) {
  this.name = "Small Skyscraper";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    var name = random_desc(["skyscraper","office tower","office building"], 1);
    return "a " + merge_desc([color,name]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " small skyscrapers with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " small skyscrapers" : "a small skyscraper");
    }

  };
}

function LargeSkyscraper(count = 1) {
  this.name = "Large Skyscraper";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    var color = random_desc(["blue","white","gray","tan","green"], (verbose ? 0.5 : 0));
    var name = random_desc(["skyscraper","office tower","office building"], 1);
    return "a " + merge_desc(["towering",color,name]);
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      if (this.count <= 3) {
        var list = [];
        for (var i = 0; i < this.count; i++) {
          list.push(this.describeOne(this.count < 2));
        }
        return merge_things(list) + " with " + describe_all(this.contents,verbose) + " inside";
      } else {
        return this.count + " large skyscrapers with " + describe_all(this.contents,verbose) + " inside";
      }
    } else {
      return (this.count > 1 ? this.count + " large skyscrapers" : "a large skyscraper");
    }
  };
}

function ParkingGarage(count = 1) {
  this.name = "Parking Garage";
  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describeOne = function(verbose=true) {
    return "a parking garage";
  };

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a parking garage" : this.count + " parking garages") + " with " + describe_all(this.contents, verbose) + " inside";
    } else {
      return (this.count == 1 ? "a parking garage" : this.count + " parking garages");
    }
  };
}
function Town(count = 1) {
  this.name = "Town";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a town" : this.count + " towns") + " with " + describe_all(this.contents, verbose) + " in " + (this.count == 1 ? "it" : "them");
    } else {
      return (this.count == 1 ? "a town" : this.count + " towns");
    }
  };
}

function City(count = 1) {
  this.name = "City";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a city" : this.count + " cities") + " with " + describe_all(this.contents, verbose) + " in " + (this.count == 1 ? "it" : "them");
    } else {
      return (this.count == 1 ? "a city" : this.count + " cities");
    }
  };
}

function Continent(count = 1) {
  this.name = "Continent";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a continent" : this.count + " continents") + " with " + describe_all(this.contents, verbose) + " on " + (this.count == 1 ? "it" : "them");
    } else {
      return (this.count == 1 ? "a continent" : this.count + " continents");
    }
  };
}

function Planet(count = 1) {
  this.name = "Planet";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a planet" : this.count + " planets") + " with " + describe_all(this.contents, verbose) + " on " + (this.count == 1 ? "it" : "them");
    } else {
      return (this.count == 1 ? "a planet" : this.count + " planets");
    }
  };
}

function Star(count = 1) {
  this.name = "Star";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    return (this.count == 1 ? "a star" : this.count + " stars");
  };
}

function SolarSystem(count = 1) {
  this.name = "Solar System";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a solar system" : this.count + " solar systems") + " made up of " + describe_all(this.contents, verbose);
    } else {
      return (this.count == 1 ? "a solar system" : this.count + " solar systems");
    }
  };
}

function Galaxy(count = 1) {
  this.name = "Galaxy";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a galaxy" : this.count + " galaxies") + " made up of " + describe_all(this.contents, verbose);
    } else {
      return (this.count == 1 ? "a galaxy" : this.count + " galaxies");
    }
  };
}

function Cluster(count = 1) {
  this.name = "Cluster";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a cluster" : this.count + " clusters") + " made up of " + describe_all(this.contents, verbose);
    } else {
      return (this.count == 1 ? "a cluster" : this.count + " clusters");
    }
  };
}

function Universe(count = 1) {
  this.name = "Universe";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a universe" : this.count + " universes") + " made up of " + describe_all(this.contents, verbose);
    } else {
      return (this.count == 1 ? "a universe" : this.count + " universes");
    }
  };
}

function Multiverse(count = 1) {
  this.name = "Multiverse";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a multiverse" : this.count + " multiverses") + " made up of " + describe_all(this.contents, verbose);
    } else {
      return (this.count == 1 ? "a multiverse" : this.count + " multiverses");
    }
  };
}

function Soldier(count = 1) {
  this.name = "Soldier";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
      return (this.count == 1 ? "a soldier" : this.count + " soldiers");
  };
}

function Tank(count = 1) {
  this.name = "Tank";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a tank" : this.count + " tanks") + " with " + describe_all(this.contents, verbose) + " trapped inside.";
    } else {
      return (this.count == 1 ? "a tank" : this.count + " tanks");
    }
  };
}

function Artillery(count = 1) {
  this.name = "Artillery";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "an artillery unit" : this.count + " artillery units") + " with " + describe_all(this.contents, verbose) + " trapped inside.";
    } else {
      return (this.count == 1 ? "an artillery unit" : this.count + " artillery units");
    }
  };
}

function Helicopter(count = 1) {
  this.name = "Helicopter";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    if (verbose) {
      return (this.count == 1 ? "a helicopter" : this.count + " helicopters") + " with " + describe_all(this.contents, verbose) + " riding inside.";
    } else {
      return (this.count == 1 ? "a helicopter" : this.count + " helicopters");
    }
  };
}

function Micro(count = 1) {
  this.name = "Micro";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    return (this.count == 1 ? "a micro" : this.count + " micros");
  };
}

function Macro(count = 1) {
  this.name = "Macro";

  copy_defaults(this,new DefaultEntity());
  this.count = count;
  this.contents = initContents(this.name,this.count);

  this.describe = function(verbose = true) {
    return (this.count == 1 ? "a smaller macro" : this.count + " smaller macros");
  };
}
