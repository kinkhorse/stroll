function round(number,precision=3) {
  return Math.round(number*Math.pow(10,precision)) / Math.pow(10,precision);
}

function metricMass(kg) {
  if (kg < 1) {
    var mass = round(kg * 1000);
    return mass + (mass == 1 ? " gram" : " grams");
  } else if (kg < 5000) {
    var mass = round(kg);
    return mass + (mass == 1 ? " kilogram" : " kilograms");
  } else {
    var mass = round(kg / 1000);
    return mass + (mass == 1 ? " metric ton" : " metric tons");
  }
}

function customaryMass(kg) {
  var lbs = kg * 2.2;

  if (lbs < 1) {
    var mass = round(lbs * 16);
    return mass + (mass == 1 ? " ounce" : " ounces");
  } else if (lbs < 2000) {
    var mass = round(lbs);
    return mass + (mass == 1 ? " pound" : " pounds");
  } else {
    var mass = round(lbs / 2000);
    return mass + (mass == 1 ? "ton" : " tons");
  }
}

function metricLength(m) {
  if (m < 1) {
    var length = round(m * 100);
    return length + (length == 1 ? " centimeter" : " centimeters");
  } else if (m < 500) {
    var length = round(m);
    return length + (length == 1 ? " meter" : " meters");
  } else {
    var length = round(m / 1000);
    return length + (length == 1 ? " kilometer" : " kilometers");
  }
}

function customaryLength(m) {
  var ft = m * 3.28084;

  if (ft < 1) {
    var length = round(ft * 12,0);
    return length + (length == 1 ? " inch" : " inches");
  } else if (ft < 5280) {
    var end = customaryLength((ft - Math.floor(ft))/3.28084);
    var length = Math.floor(ft);
    return length + (length == 1 ? " foot" : " feet") + " " + end;
  } else {
    var length = round(ft/5280);
    return length + (length == 1 ? " mile" : " miles");
  }
}
