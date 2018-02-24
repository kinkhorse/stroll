'use strict';

var rules = {};

var actions = ["eat","chew","stomp","kick","anal-vore","tail-slap","tail-vore","ass-crush",
"cleavage-stuff","cleavage-crush","cleavage-drop","cleavage-absorb","breast-crush",
"breast-vore","breast-milk","unbirth","sheath-stuff","sheath-squeeze","sheath-crush",
"sheath-absorb","cock-vore","cockslap","ball-smother","male-spurt","male-orgasm","female-spurt",
"female-orgasm","grind","pouch-stuff","pouch-eat","stomach","womb","balls","bowels","breasts"];

for (let i=0; i<actions.length; i++) {
  rules[actions[i]] = [];
}

function isNonFatal(macro) {
  return macro.brutality == 0;
}

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
  if (!hasNothingElse(container, things))
    return false;

  for (var i=0; i<things.length; i++) {
    if (!container.contents.hasOwnProperty(things[i]))
      return false;
  }

  return true;
}

function hasNothingElse(container, things) {
  for (var key in container.contents) {
    if (container.contents.hasOwnProperty(key))
      if (!things.includes(key))
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
  var options = [];

  for (var i = 0; i < rules[action].length; i++) {
    if(rules[action][i].test(container,macro)) {
      options.push(rules[action][i].desc);
    }
  }

  if (options.length > 0 && Math.random() > (1 / (2 + rules[action].length))) {
    let choice = Math.floor(Math.random() * options.length);
    return options[choice](container, macro, verbose);
  }
  else {
    return describeDefault(action, container, macro, verbose);
  }
}

function describeDefault(action, container, macro, verbose=true) {
  switch(action) {
    case "eat": return defaultEat(container, macro, verbose);
    case "chew": return defaultChew(container, macro, verbose);
    case "stomp": return defaultStomp(container, macro, verbose);
    case "kick": return defaultKick(container, macro, verbose);
    case "anal-vore": return defaultAnalVore(container, macro, verbose);
    case "ass-crush": return defaultAssCrush(container, macro, verbose);
    case "tail-slap": return defaultTailSlap(container, macro, verbose);
    case "tail-vore": return defaultTailVore(container, macro, verbose);
    case "cleavage-stuff": return defaultCleavageStuff(container, macro, verbose);
    case "cleavage-crush": return defaultCleavageCrush(container, macro, verbose);
    case "cleavage-drop": return defaultCleavageDrop(container, macro, verbose);
    case "cleavage-absorb": return defaultCleavageAbsorb(container, macro, verbose);
    case "breast-crush": return defaultBreastCrush(container, macro, verbose);
    case "breast-vore": return defaultBreastVore(container, macro, verbose);
    case "breast-milk": return defaultBreastMilk(container, macro, verbose);
    case "unbirth": return defaultUnbirth(container, macro, verbose);
    case "sheath-stuff": return defaultSheathStuff(container, macro, verbose);
    case "sheath-squeeze": return defaultSheathSqueeze(container, macro, verbose);
    case "sheath-crush": return defaultSheathCrush(container, macro, verbose);
    case "sheath-absorb": return defaultSheathAbsorb(container, macro, verbose);
    case "cock-vore": return defaultCockVore(container, macro, verbose);
    case "cockslap": return defaultCockslap(container, macro, verbose);
    case "ball-smother": return defaultBallSmother(container, macro, verbose);
    case "male-spurt": return defaultMaleSpurt(container, macro, verbose);
    case "male-orgasm": return defaultMaleOrgasm(container, macro, verbose);
    case "female-spurt": return defaultFemaleSpurt(container, macro, verbose);
    case "female-orgasm": return defaultFemaleOrgasm(container, macro, verbose);
    case "grind": return defaultGrind(container, macro, verbose);
    case "pouch-stuff": return defaultPouchStuff(container, macro, verbose);
    case "pouch-eat": return defaultPouchEat(container, macro, verbose);
    case "bowels": return defaultBowels(container, macro, verbose);
    case "womb": return defaultWomb(container, macro, verbose);
    case "balls": return defaultBalls(container, macro, verbose);
    case "breasts": return defaultBreasts(container, macro, verbose);
  }
}

// DEFAULTS

function defaultEat(container, macro, verbose) {
  return "You scoop up " + container.describe(verbose) + " and swallow " + (container.count > 1 ? "them" : "it") + " whole.";
}

function defaultChew(container, macro, verbose) {
  if (isNonFatal(macro))
    return defaultEat(container, macro, verbose);
  else
    return "You scoop up " + container.describe(verbose) + " and crunch " + (container.count > 1 ? "them" : "it") + " in your powerful jaws, then swallow them down.";
}

function defaultStomp(container, macro, verbose) {
  if (isFatal(macro))
    return "You crush " + container.describe(verbose) + " underfoot.";
  else
    return "You step on " + container.describe(verbose) + ".";
}

function defaultKick(container, macro, verbose) {
  return "You punt " + container.describe(verbose) + ", destroying " + (container.count > 1 ? "them" : "it") + ".";
}

function defaultAnalVore(container, macro, verbose) {
  return "You sit yourself down on " + container.describe(verbose) + ". " + (container.count > 1 ? "They slide" : "It slides") + " inside with ease.";
}

function defaultAssCrush(container, macro, verbose) {
  if (isFatal(macro))
    return "Your heavy ass obliterates " + container.describe(verbose) + ". ";
  else
    return "You sit on " + container.describe(verbose);
}

function defaultTailSlap(container, macro, verbose) {
  if (isFatal(macro))
    return "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails swing" : " tail swings") + " into " + container.describe(verbose) + ", smashing everything in " +
    (macro.tailCount > 1 ? "their" : "its") + " path.";
  else
    return "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails slap" : " tail slaps") + " against " + container.describe(verbose) + ", bowling them over.";
}

function defaultTailVore(container, macro, verbose) {
  if (isFatal(macro))
    return "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails lunge, maws agape, " : " tail lunges, maw agape, ") + "at " + container.describe(verbose) +
     ". " + (macro.tailCount > 1 ? "They" : "It") + " scarf down everything in a second, gulping forcefully to drag your prey into your sloppy guts.";
  else
    return "Your " + macro.describeTail + (macro.tailCount > 1 ? " tails lunge, maws agape, " : " tail lunges, maw agape, ") + "at " + container.describe(verbose) +
     ". " + (macro.tailCount > 1 ? "They" : "It") + " scarf down everything in a second, gulping forcefully and pulling everything into your belly.";
}

function defaultCleavageStuff(container, macro, verbose) {
  return "You snatch up " + container.describe(verbose) + " and stuff " + (container.count > 1 ? "them" : "it") + " into your cleavage.";
}

function defaultCleavageCrush(container, macro, verbose) {
  if (container.count == 0)
    return "You grasp your breasts and forcefully squeeze them together.";
  else if (isGory(macro))
    return "You grasp your breasts and forcefully shove them together, crushing the life from " + container.describe(false) + ".";
  else if (isFatal(macro))
    return "You grasp your breasts and forcefully shove them together, crushing " + container.describe(false) + ".";
  else
    return "You grasp your breasts and squish them together, smooshing " + container.describe(false) + ".";
}

function defaultCleavageAbsorb(container, macro, verbose) {
  if (container.count == 0)
    return defaultCleavageCrush(container, macro, verbose);
  else
    return "Your squeeze your breasts together, swiftly absorbing " + container.describe(false) + " into your chest.";
}

function defaultCleavageDrop(container, macro, verbose) {
  if (container.count == 0)
    return "You pull your breasts apart and give them a shake.";
  if (isFatal(macro))
    return "You pull your breasts apart far enough for the " + container.describe(false) + " trapped within to fall out, tumbling to the ground and smashing to bits.";
  else
    return "You pull your breasts apart far enough for the " + container.describe(false) + " trapped within to fall out.";
}

function defaultBreastCrush(container, macro, verbose) {
  if (isFatal(macro))
    return "Your heavy breasts obliterate " + container.describe(verbose) + ". ";
  else
    return "You smoosh " + container.describe(verbose) + " with your breasts.";
}

function defaultBreastVore(container, macro, verbose) {
  return "Your nipples envelop " + container.describe(verbose) + ", pulling them into your breasts. ";
}


function defaultBreastMilk(container, macro, verbose) {
  if (isFatal(macro))
    return "You squeeze your breasts, coaxing out $VOLUME of warm, creamy milk that floods " + container.describe(verbose) + " in an unstoppable wave of white.";
  else
    return "You squeeze your breasts, coaxing out $VOLUME of warm, creamy milk that floods " + container.describe(verbose) + ".";
}

function defaultUnbirth(container, macro, verbose) {
  return "You gasp as you slide " + container.describe(verbose) + " up your slit. ";
}

function defaultSheathStuff(container, macro, verbose) {
  return "You pluck " + container.describe(verbose) + " from the ground and slip them into your musky sheath.";
}

function defaultSheathSqueeze(container, macro, verbose) {
  if (container.count > 0) {
    if (macro.orgasm) {
      return "You stroke your spurting cock, then reach down to give your sheath a firm <i>squeeze</i>. Anything within has been ground away to nothingness by the force of your orgasm.";
    } else if (macro.arousal < 25) {
      return "You grip your soft sheath and give it a squeeze, feeling " + container.describe(false) + " within rub against your " + macro.describeDick + " cock.";
    } else if (macro.arousal < 75) {
      return "You grip your swelling sheath and squeeze, feeling " + container.describe(false) + " within grind against your " + macro.describeDick + " cock.";
    } else if (macro.arousal < 150) {
      return "You run your fingers down your " + macro.describeDick + " shaft and grip your sheath, squeezing it to feel " + container.describe(false) + " being smothered against the musky walls by your throbbing cock.";
    } else {
      return "Trembling with your impending orgasm, your fingers play over your sheath, feeling " + container.describe(false) + " within rub against your " + macro.describeDick + " cock.";
    }
  } else {
    if (macro.orgasm) {
      return "You stroke your spurting cock, then reach down to give your sheath a firm <i>squeeze</i>. Anything within has been ground away to nothingness by the force of your orgasm.";
    } else if (macro.arousal < 25) {
      return "You grip your soft sheath and give it a squeeze.";
    } else if (macro.arousal < 75) {
      return "You grip your swelling sheath and squeeze.";
    } else if (macro.arousal < 150) {
      return "You run your fingers down your " + macro.describeDick + " shaft and grip your sheath, squeezing it gently.";
    } else {
      return "Trembling with your impending orgasm, your fingers play over your sheath.";
    }
  }
}

function defaultSheathCrush(container, macro, verbose) {
  if (isGory(macro))
    return "Your powerful orgasm causes your throbbing " + macro.describeDick + " cock to swell and crush the life from everything in your sheath, reducing " + container.describe(false) + " to a gory paste that slickens your spurting shaft.";
  else if (isFatal(macro))
    return "Your orgasm causes your " + macro.describeDick + " shaft to throb and swell, smashing " + container.describe(false) + " trapped in your musky sheath.";
  else
    return "Your orgasm causes your " + macro.describeDick + " cock to swell, squeezing " + container.describe(false) + " out from your sheath.";
}

function defaultSheathAbsorb(container, macro, verbose) {
  if (container.count > 0)
    return "You grip your sheath and give it a firm <i>squeeze</i>, abruptly absorbing " + container.describe(false) + " into your musky body.";
  else
    return defaultSheathSqueeze(container, macro, verbose);
}

function defaultCockVore(container, macro, verbose) {
  return "You stuff " + container.describe(verbose) + " into your throbbing shaft, forcing them down to your heavy balls.";
}

function defaultCockslap(container, macro, verbose) {
  if (isFatal(macro))
    return "Your swaying " + macro.describeDick + " cock crushes " + container.describe(verbose) + ". ";
  else
    return "You smack " + container.describe(verbose) + " with your " + macro.describeDick + " shaft.";
}

function defaultBallSmother(container, macro, verbose) {
  if (isFatal(macro))
    return "Your weighty balls spread over " + container.describe(verbose) + ", drowning them in musk.";
  else
    return "Your weighty balls spread over " + container.describe(verbose) + ".";
}

function defaultMaleSpurt(container, macro, verbose) {
  if (isFatal(macro))
    return "Your " + macro.describeDick + " cock spurts out $VOLUME of bitter precum, drowning " + container.describe(verbose) + " in a deluge of musk.";
  else
    return "Your " + macro.describeDick + " shaft spurts out $VOLUME of precum, splooging " + container.describe(verbose) + ".";
}

function defaultMaleOrgasm(container, macro, verbose) {
  if (isFatal(macro))
    return "You're cumming! Your " + macro.describeDick + " cock gushes $VOLUME of seed, obliterating " + container.describe(verbose) + " in a torrent of cum.";
  else
    return "You're cumming! Your " + macro.describeDick + " shaft gushes $VOLUME of seed, splooging " + container.describe(verbose) + ".";
}

function defaultFemaleSpurt(container, macro, verbose) {
  if (isFatal(macro))
    return "Your moist slit splatters $VOLUME of slick juices, drowning " + container.describe(verbose) + " in your building lust.";
  else
    return "Your moist slit splatters $VOLUME of slick juices, splooging " + container.describe(verbose) + ".";
}

function defaultFemaleOrgasm(container, macro, verbose) {
  if (isFatal(macro))
    return "Your moist slit sprays $VOLUME of slick femcum, obliterating " + container.describe(verbose) + " in a torrent of femcum.";
  else
    return "Your moist slit sprays $VOLUME of slick femcum, splooging " + container.describe(verbose) + ".";
}

function defaultGrind(container, macro, verbose) {
  var mid = isFatal(macro) ? ", smashing them apart" : ", using them as a toy";
  var end = macro.arousalEnabled ? " to fuel your lust." : ".";
  if (macro.maleParts && macro.femaleParts) {
    return "You grind your " + macro.describeDick + " cock and " + macro.describeVagina + " slit against " + container.describe(verbose) + mid + end;
  } else if (macro.maleParts && !macro.femaleParts) {
    return "You grind your " + macro.describeDick + " shaft against " + container.describe(verbose) + mid + end;
  } else if (!macro.maleParts && macro.femaleParts) {
    return "You grind your " + macro.describeVagina + " slit against " + container.describe(verbose) + mid + end;
  } else {
    return "You grind your hips against " + container.describe(verbose) + mid + end;
  }
}

function defaultPouchStuff(container, macro, verbose) {
  return "You grab " + container.describe(verbose) + " and stuff " + (container.count > 1 ? "them" : "it") + " into your pouch.";
}

function defaultPouchEat(container, macro, verbose) {
  return "You snatch " + container.describe(verbose) + " from your pouch and shove " + (container.count > 1 ? "them" : "it") + " down your gullet!";
}

function defaultStomach(container, macro, verbose) {
  if (isFatal(macro))
    return "Your stomach gurgles as it digests " + container.describe(false);
  else
    return "Your stomach groans as it absorbs " + container.describe(false);
}

function defaultBowels(container, macro, verbose) {
  if (isFatal(macro))
    return "Your bowels churn as they melt down " + container.describe(false) + " and absorb them into your body";
  else
    return "Your bowels churn as they absorb " + container.describe(false);
}

function defaultWomb(container, macro, verbose) {
  if (isFatal(macro))
    return "Your womb squeezes and dissolves " + container.describe(false) + ", turning them into slick femcum.";
  else
    return "Your womb squeezes as it absorbs " + container.describe(false);
}

function defaultBalls(container, macro, verbose) {
  if (isFatal(macro))
    return "Your balls slosh as they digest " + container.describe(false) + " into cum";
  else
    return "Your balls slosh as they absorb " + container.describe(false);
}

function defaultBreasts(container, macro, verbose) {
  if (isFatal(macro))
    return "Your breasts grrgle as they digest " + container.describe(false) + " into milk";
  else
    return "Your breasts slosh as they absorb " + container.describe(false);
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
    return hasOnly(container, ["Person"]) &&
     hasLessThan(container, "Person", 6) &&
     macro.height >= 10;
  },
  "desc": function(container, macro, verbose) {
    return "You pluck up the " + container.describe() + " and stuff them into your mouth, swallowing lightly to drag them down to your bubbling guts.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     macro.height < 10;
  },
  "desc": function(container, macro, verbose) {
    return "You grasp " + container.describe() + " and greedily wolf them down, swallowing forcefully to cram them into your bulging stomach. A crass belch escapes your lips as they curl up in your slimy gut.";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person","Car"]) &&
     hasExactly(container, "Car", 1) &&
     hasLessThan(container, "Person", 5);
  },
  "desc": function(container, macro, verbose) {
    return "You crush the " + container.contents["Car"].describe() + " with your tight throat, washing it down with " + container.contents["Person"].describe();
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Small Skyscraper", 1) &&
     nothingLarger(container, "Small Skyscraper") &&
     macro.height < 500;
  },
  "desc": function(container, macro, verbose) {
    return "You drop onto your hands and knees, jaws opening wide to envelop the skyscraper. It glides into your throat as your snout touches the ground,\
    and you suckle on it for a long moment before twisting your head to snap it loose. The entire building and the " + describe_all(container.contents["Small Skyscraper"].contents, verbose) + "\
    within plunge into your roiling guts, along with some delicious treats you slurped up along with it - " + describe_all(container.contents, verbose, ["Small Skyscraper"]) + ".";
  }
});

rules["eat"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Small Skyscraper", 2) &&
     nothingLarger(container, "Small Skyscraper") &&
     macro.height < 750;
  },
  "desc": function(container, macro, verbose) {
    return "You drop onto your hands and knees, jaws opening wide to envelop the skyscraper. It glides into your throat as your snout touches the ground,\
    and you suckle on it for a long moment before twisting your head to snap it loose. Without missing a beat, you rise back up, sloppy tongue slathering over the side \
    of the remaining tower, sucking on its tip and roughly shoving it into your maw. It breaks from its foundation, vanishing past your lips as you use two fingers to shove it \
    down your sultry throat. Your gut bubbles as " + describe_all(container.contents["Small Skyscraper"].contents, verbose) + " are crunched and crushed within, along with the \
    " + describe_all(container.contents, verbose, ["Small Skyscraper"]) + " that were unfortunate enough to be caught up by your slimy tongue.";
  }
});

// CHEWING

rules["chew"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     isGory(macro) &&
     macro.height < 5;
  }, "desc": function(container, macro, verbose) {
    return "You tackle a " + container.describe(verbose) + " and dig into your meal, powerful jaws ripping them to shreds in seconds. You wolf down great mouthfuls \
    of meat, consuming them in a terrifying frenzy that ends with naught but bones lying on the ground.";
  }
});

rules["chew"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     isGory(macro) &&
     macro.height >= 5;
  }, "desc": function(container, macro, verbose) {
    return "You snatch up a " + container.describe(verbose) + ", then stuff their lower body into the guillotine that is your ravenous maw - slicing off their legs with \
    a single disgusting <i>crunch</i>, then finishing them off with another ravenous bite that obliterates their torso. Their bleeding head falls from your lips, only to be \
    caught between two fingers and popped back in to be crunched between molars and swallowed.";
  }
});

rules["chew"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 2) &&
     isGory(macro);
  }, "desc": function(container, macro, verbose) {
    var prey1 = new Person(1).describe(verbose);
    var prey2 = new Person(1).describe(verbose);
    return "Powerful jaws obliterate " + prey1  +"'s body. You toss your head back and swallow their gory remains, your free hand slowly crushing " + prey2 + " like a nut \
    in a vice. A heartbeat later, their face is jammed into your bloody throat. A squeeze of your jaws snaps their spine with ease, and their limp body plunges down into \
    your churning depths to be destroyed.";
  }
});

// STOMPING

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     isFatal(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your heavy paw slams down on " + container.describe(verbose) + ", smashing the poor thing like an insect.";
  }
});

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     isGory(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your paw thumps " + container.describe(verbose) + ", shoving your victim to the ground and cracking them open like an egg.";
  }
});

rules["stomp"].push({
  "test": function(container, macro) {
    return hasOnly(container, ["Person"]) &&
     hasExactly(container, "Person", 1) &&
     isGory(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your shadow falls over " + container.describe(verbose) + ", and your paw follows, crushing their soft body and reducing them to a heap of broken gore.";
  }
});

rules["stomp"].push({
  "test": function(container, macro) {
    return hasNothingElse(container, ["Person","Cow","Car"]) &&
     isNonFatal(macro);
  }, "desc": function(container, macro, verbose) {
    return "Your soft paws smoosh over " + container.describe(verbose) + ". They stick to your toes, carried along for the ride as you take another few steps before finally\
    falling off.";
  }
});

// ANAL VORE

rules["anal-vore"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Person", 1) &&
     hasOnly(container, ["Person"]);
  }, "desc": function(container, macro, verbose) {
    let adjective = ["musky","winding","churning"][Math.floor(Math.random()*3)];
    return "Your weighty rump slams against the ground. A shock of pleasure runs up your spine as a " + container.describe(verbose) + " slides up your ass," +
    (macro.maleParts ? " grinding against your prostate" : "") + ". A powerful clench drags them deeper into your bowels, sealing them away in your " + adjective + " depths.";
  }
});

rules["anal-vore"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Car", 1) &&
     hasOnly(container, ["Car"]);
  }, "desc": function(container, macro, verbose) {
    return "You ram " + container.describe(verbose) + " up your ass, biting your lip as it" + (macro.maleParts ? " rubs along your prostate" : " slides into velvety depths") + ".\
    You moan and clench hard, yanking it in with a wet <i>shlrrp</i> and abruplty silencing its blaring horn.";
  }
});

rules["anal-vore"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Bus", 1) &&
     hasOnly(container, ["Bus"]);
  }, "desc": function(container, macro, verbose) {
    return "A speeding bus slams on its brakes as you abruptly sit - but it's too late to stop. A gasp flies from your lips as it penetrates your greedy ass, sinking halfway in and coming to a halt. \
    You grunt and squeeze, causing its frame to creak and groan. Two fingers to the back are enough to get it moving again, and it slowly works inside. You shiver and moan, taking it in all the way. \
    Your ass claims " + container.describe(verbose) + ".";
  }
});

rules["anal-vore"].push({
  "test": function(container, macro) {
    return hasExactly(container, "Train", 1) &&
     hasOnly(container, ["Train"]);
  }, "desc": function(container, macro, verbose) {
    var cars = container.contents["Train"].contents["Train Car"].count;
    return "Your massive fingers wrap around a train, yanking it from the rails with a tremendous screech of metal-on-metal. You squat down low, eyes rolling back in anticipation as you thrust the locomotive towards your massive ass - and then it hits home. A moan of pleasure shakes the earth, your ravenous pucker spread around the engine and sucking it in with a <i>squelch</i>. Powerful muscles squeeze and grab...and " + container.describe(verbose) + " swiftly vanishes into your bowels, every one of the " + cars + " cars a fresh shock of pleasure as they glide into your musky depths.";
  }
});
