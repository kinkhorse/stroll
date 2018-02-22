rules = {};

rules["eat"] = [];
rules["stomp"] = [];
rules["kick"] = [];
rules["anal-vore"] = [];
rules["ass-crush"] = [];
rules["breast-crush"] = [];
rules["unbirth"] = [];
rules["cock-vore"] = [];
rules["cockslap"] = [];
rules["ball-smother"] = [];
rules["male-orgasm"] = [];
rules["female-orgasm"] = [];
rules["grind"] = [];

rules["stomach"] = [];
rules["balls"] = [];
rules["womb"] = [];
rules["ass"] = [];

function isFatal(macro) {
  return macro.brutality >= 1;
}

function isGory(macro) {
  return macro.brutality >= 2;
}

function hasNothing(container, thing, amount) {
  for (var key in container.contents) {
    if (container.contents.hasOwnProperty(key))
      return false;
  }

  return true;
}

function hasLessThan(container, thing, amount) {
  if (container.contents.hasOwnProperty(thing))
    if (container.contents[thing].count < amount && container.contents[thing].count > 0)
      return true;
  return false;
}

function hasExactly(container, thing, amount) {
  if (!container.contents.hasOwnProperty(thing) && amount == 0)
    return true;
  if (container.contents.hasOwnProperty(thing) && container.contents[thing].count == amount)
    return true;
  return false;
}

function hasOnly(container, things) {
  for (var key in container.contents) {
    if (container.contents.hasOwnProperty(key))
      if (!things.includes(key))
        return false;
  }

  for (var i=0; i<things.length; i++) {
    if (!container.contents.hasOwnProperty(things[i]))
      return false;
  }

  return true;
}

function nothingLarger(container, thing) {
  for (var key in container.contents)
    if (container.contents.hasOwnProperty(key))
      if (areas[key] > areas[thing])
        return false;

  return true;
}

function describe(action, container, macro, verbose=true) {
  options = [];

  for (var i = 0; i < rules[action].length; i++) {
    if(rules[action][i].test(container,macro)) {
      options.push(rules[action][i].desc);
    }
  }

  if (options.length > 0) {
    let choice = Math.floor(Math.random() * options.length);
    return options[choice](container, macro, verbose);
  }
  else {
    return describeDefault(action, container, macro, verbose);
  }
}

function describeDefault(action, container, macro, verbose=true) {
  switch(action) {
    case "eat": return "You scoop up " + container.describe(verbose) + " and swallow " + (container.count > 1 ? "them" : "it") + " whole.";
    case "stomp": return "You crush " + container.describe(verbose) + " underfoot.";
    case "kick": return "You punt " + container.describe(verbose) + ", destroying " + (container.count > 1 ? "them" : "it") + ".";
    case "anal-vore": return "You sit yourself down on " + container.describe(verbose) + ". " + (container.count > 1 ? "They slide" : "It slides") + " inside with ease.";
    case "ass-crush": return "Your heavy ass obliterates " + container.describe(verbose) + ". ";
    case "breast-crush": return "Your heavy breasts obliterate " + container.describe(verbose) + ". ";
    case "unbirth": return "You gasp as you slide " + container.describe(verbose) + " up your slit. ";
    case "cock-vore": return "You stuff " + container.describe(verbose) + " into your throbbing shaft, forcing them down to your heavy balls.";
    case "cockslap": return "Your swaying shaft crushes " + container.describe(verbose) + ". ";
    case "ball-smother": return "Your weighty balls spread over " + container.describe(verbose) + ", smothering them in musk.";
    case "male-orgasm": return "You're cumming! Your thick cock spurts out $VOLUME of seed, splooging " + container.describe(verbose) + ".";
    case "female-orgasm": return "You're cumming! Your moist slit sprays $VOLUME of slick femcum, splooging " + container.describe(verbose) + ".";
    case "grind":
      var end = (macro.arousalEnabled ? ", smashing them to fuel your lust." : ", smashing them to bits.");
      if (macro.maleParts && macro.femaleParts) {
        return "You grind your " + macro.describeDick + " cock and " + macro.describeVagina + " slit against " + container.describe(verbose) + end;
      } else if (macro.maleParts && !macro.femaleParts) {
        return "You grind your " + macro.describeDick + " shaft against " + container.describe(verbose) + end;
      } else if (!macro.maleParts && macro.femaleParts) {
        return "You grind your " + macro.describeVagina + " slit against " + container.describe(verbose) + end;
      } else {
        return "You grind your hips against " + container.describe(verbose) + end;
      }
    case "stomach": return "Your stomach gurgles as it digests " + container.describe(false);
    case "bowels": return "Your bowels churn as they absorb " + container.describe(false);
    case "womb": return "Your womb squeezes as it dissolves " + container.describe(false);
    case "balls": return "Your balls slosh as they transform " + container.describe(false) + " into cum";
  }
}

// EATING

rules["eat"].push({
  "test": function(container, macro) {
    return hasNothing(container);
  },
  "desc": function(container, macro, verbose) {
    return "You scoop up...nothing. Oh well.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"])
    && hasLessThan(container, "Person", 6)
    && macro.height >= 10;
  },
  "desc": function(container, macro, verbose) {
    return "You pluck up the " + container.describe() + " and stuff them into your mouth, swallowing lightly to drag them down to your bubbling guts.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"])
    && hasExactly(container, "Person", 1)
    && macro.height < 10;
  },
  "desc": function(container, macro, verbose) {
    return "You grasp " + container.describe() + " and greedily wolf them down, swallowing forcefully to cram them into your bulging stomach. A crass belch escapes your lips as they curl up in your slimy gut.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person","Car"])
    && hasExactly(container, "Car", 1)
    && hasLessThan(container, "Person", 5);
  },
  "desc": function(container, macro, verbose) {
    return "You crush the " + container.contents["Car"].describe() + " with your tight throat, washing it down with " + container.contents["Person"].describe();
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Small Skyscraper", 1)
    && nothingLarger(container, "Small Skyscraper")
    && macro.height < 500;
  },
  "desc": function(container, macro, verbose) {
    return "You drop onto your hands and knees, jaws opening wide to envelop the skyscraper. It glides into your throat as your snout touches the ground,\
    and you suckle on it for a long moment before twisting your head to snap it loose. The entire building and the " + describe_all(container.contents["Small Skyscraper"].contents, verbose) + "\
    within plunge into your roiling guts, along with some delicious treats you slurped up along with it - " + describe_all(container.contents, verbose, ["Small Skyscraper"]) + ".";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Small Skyscraper", 2)
    && nothingLarger(container, "Small Skyscraper")
    && macro.height < 750;
  },
  "desc": function(container, macro, verbose) {
    return "You drop onto your hands and knees, jaws opening wide to envelop the skyscraper. It glides into your throat as your snout touches the ground,\
    and you suckle on it for a long moment before twisting your head to snap it loose. Without missing a beat, you rise back up, sloppy tongue slathering over the side \
    of the remaining tower, sucking on its tip and roughly shoving it into your maw. It breaks from its foundation, vanishing past your lips as you use two fingers to shove it \
    down your sultry throat. Your gut bubbles as " + describe_all(container.contents["Small Skyscraper"].contents, verbose) + " are crunched and crushed within, along with the \
    " + describe_all(container.contents, verbose, ["Small Skyscraper"]) + " that were unfortunate enough to be caught up by your slimy tongue.";
  }
});

// STOMPING

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"])
    && hasExactly(container, "Person", 1)
    && isFatal(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your heavy paw slams down on " + container.describe(verbose) + ", smashing the poor thing like an insect.";
  }
});

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"])
    && hasExactly(container, "Person", 1)
    && isGory(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your paw thumps " + container.describe(verbose) + ", shoving your victim to the ground and cracking them open like an egg.";
  }
});

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"])
    && hasExactly(container, "Person", 1)
    && isGory(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your shadow falls over " + container.describe(verbose) + ", and your paw follows, crushing their soft body and reducing them to a heap of broken gore.";
  }
});
