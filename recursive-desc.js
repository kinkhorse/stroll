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

function hasNothing(container, thing, amount) {
  for (var key in container.contents) {
    if (container.contents.hasOwnProperty(key))
      return false;
  }

  return true;
}

function hasExactly(container, thing, amount) {
  if (!container.contents.hasOwnProperty(thing) && amount == 0)
    return true;
  if (container.contents.hasOwnProperty(thing) && container.contents[thing].count == amount)
    return true;
  return false;
}

function describe(action, container, macro, verbose=true) {
  options = [];

  for (var i = 0; i < rules[action].length; i++) {
    if(rules[action][i].test(container,macro)) {
      options.push(rules[action][i].desc);
    }
  }

  if (options.length > 0)
    return options[0](container, macro);
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
  }
}

// EATING

rules["eat"].push({
  "test": function(container, macro) {
    return hasNothing(container);
  },
  "desc": function(container, macro) {
    return "You scoop up...nothing. Oh well.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Person", 1);
  },
  "desc": function(conatiner, macro) {
    return "you eat them lol";
  }
});
