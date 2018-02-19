function round(number,precision=3) {
  return Math.round(number*Math.pow(10,precision)) / Math.pow(10,precision);
}

function mass(kg, metric=true, singular=false) {
  return metric ? metricMass(kg, singular) : customaryMass(kg, singular);
}

function length(m, metric=true, singular=false) {
  return metric ? metricLength(m, singular) : customaryLength(m, singular);
}

function metricMass(kg, singular=false) {
  if (kg < 1) {
    var mass = round(kg * 1000,0);
    return mass + (singular || mass == 1 ? " gram" : " grams");
  } else if (kg < 5000,0) {
    var mass = round(kg);
    return mass + (singular || mass == 1 ? " kilogram" : " kilograms");
  } else if (kg < 5000000) {
    var mass = round(kg / 1000,1);
    return mass + (singular || mass == 1 ? " metric ton" : " metric tons");
  } else if (kg < 5000000000) {
    var mass = round(kg / 1000000,1);
    return mass + (singular || mass == 1 ? " kiloton" : " kilotons");
  } else if (kg < 5000000000000) {
    var mass = round(kg / 1000000000,1);
    return mass + (singular || mass == 1 ? " megaton" : " megatons");
  } else {
    var mass = round(kg / 1000000000000,1);
    return mass + (singular || mass == 1 ? " gigaton" : " gigatons");
  }
}

function customaryMass(kg, singular=false) {
  var lbs = kg * 2.2;

  if (lbs < 1) {
    var mass = round(lbs * 16,0);
    return mass + (singular || mass == 1 ? " ounce" : " ounces");
  } else if (lbs < 2000) {
    var mass = round(lbs,0);
    return mass + (singular || mass == 1 ? " pound" : " pounds");
  } else {
    var mass = round(lbs / 2000,1);
    return mass + (singular || mass == 1 ? "ton" : " tons");
  }
}

function metricLength(m, singular=false) {
  if (m < 1) {
    var length = round(m * 100,0);
    return length + (singular || length == 1 ? " centimeter" : " centimeters");
  } else if (m < 500) {
    var length = round(m,2);
    return length + (singular || length == 1 ? " meter" : " meters");
  } else {
    var length = round(m / 1000,1);
    return length + (singular || length == 1 ? " kilometer" : " kilometers");
  }
}

function customaryLength(m, singular=false) {
  var ft = m * 3.28084;

  if (ft < 1) {
    var length = round(ft * 12,0);
    return length + (singular || length == 1 ? " inch" : " inches");
  } else if (ft < 5280) {
    var end = customaryLength((ft - Math.floor(ft))/3.28084);
    var length = Math.floor(ft);
    return length + (singular || length == 1 ? " foot" : " feet") + " " + end;
  } else {
    var length = round(ft/5280,1);
    return length + (singular || length == 1 ? " mile" : " miles");
  }
}
