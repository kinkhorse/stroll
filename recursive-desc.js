function subset(list1,list2) {
  for (var i = 0; i < list1.length; i++) {
    if (!list2.includes(list1[i])){
      return false;
    }
  }
  return true;
}

function seteq(list1,list2) {
  return list1.length == list2.length && subset(list1,list2);
}

function getPreyNames(contents) {
  prey = [];

  for (var key in contents) {
    if (contents.hasOwnProperty(key)) {
      prey.push(contents[key].name);
    }
  }
  return prey;
}

function getPreyCounts(contents) {
  prey = {};

  for (var key in contents) {
    if (contents.hasOwnProperty(key)) {
      prey[contents[key].name] = contents[key].count;
    }
  }

  return prey;
}

function containerEat(container) {
  var preyNames = getPreyNames(container.contents);
  var preyCounts = getPreyCounts(container.contents);
  return "";
}

function personEat(person) {
  if (person.count == 1) {
    if (Math.random() > 0.5)
      return "You hoist " + person.describe() + " into the air and stuff them down your gullet. Delicious!";
  }
  else if (person.count <= 3) {
    if (Math.random() > 0.5)
      return "You reach down with both hands, snagging " + (person.count == 2 ? "two" : "three") + " meals. You savor their taste, " + person.describe() + " slipping past your lips and down your throat, one-by-one.";
  }
  else if (person.count < 5) {
    if (Math.random() > 0.5)
      return "You reach down and snatch up a fistful of snacks, stuffing " + person.count + " people into your maw and swallowing deeply.";
  }

  return "";
}

function personStomp(person) {
  if (person.count == 1) {
    var choice = Math.random();
    if (choice < 0.2)
      return "Your heavy paw smashes a " + person.describe() + " like a bug. Splat.";
    else if (choice < 0.4)
      return "A wayward step obliterates a " + person.describe();
    else if (choice < 0.6)
      return "You lunge at a " + person.describe() + " with your toes outstretched, squashing them flat.";
  }
  else if (person.count <= 3) {
    if (Math.random() > 0.5)
      return "Your paw comes down on " + person.describe() + ". " + (person.count == 2 ? "Both" : "All three") + " crunch beneath your heavy toes.";
  }

  return "";
}

function skyscraperAnalVore(skyscraper,height = 10) {
  if (height < 5000) {
    return "You ease yourself down over the skyscraper, spreading your ass wide as you take it to the ground - then, with a powerful clench, snap it from its base. " + describe_all(skyscraper.contents) + " are sealed away in your ass.";
  } else {
    return "You stuff the skyscraper up your ass with ease. Bad luck for " + describe_all(skyscraper.contents) + " inside.";
  }

  return "";
}
