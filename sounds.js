let sounds = {
  "crush": ["Thump.", "Crunch.", "Crrruunch.", "CRUNCH!", "CRRRUNNCH!", "SKRRRRUNCH!", "SKRRRRRRRSMASH!"],
  "swallow": ["Ulp.", "Gulp.", "Glrph.", "Glrrrpkh.", "Gluuuurrkph!","GLRP!","GLRRRRPKH!","GLUUUUURRPKH!"],
  "liquid": ["Dribble.","Splat.","Splash.","Sploosh.","SPLASH!","SPLOOSH!","SPLOOOOOOSH!"],
  "insert": ["Slp.","Shlp.","Shlllp.","Shlllrp.","SHLP!","SHLLLLRP!"],
  "drop": ["Thump.","Thump!","Splat.","Splat!","SPLAT!"],
  "belch": ["Burp.","Urph.","Urrrrrph.","UuuuuuuRRRRRPPHHHhhhh.","UUUURRRRPHH!","BUUUURRRRRRRRPPPHHH!"],
  "fart":
  ["Pft.","Pffft.","Pfffffbt.","Frrrrrrrt.","FRRRRRRRRPBBT!"],
  "scat":
  ["Clench.","Squeeeeeze.","Squeeeeeeeeeeeze.","Sqlllllch.","SQLLLLLLCH!"],
  "digest":
  ["Grrgle.","Grrrrgle","Grrrrlglorp.","GrrrrGLRRRLPH!","GRRRRRLGPRLHK!"],
};

function pickByMass(list, mass) {
  let index = Math.floor(Math.log10(mass/100)/2);
  index = Math.max(index, 0);

  if (index < list.length)
    return list[index];
  else
    return list[list.length-1];
}

function getSound(name, mass) {
  return pickByMass(sounds[name],mass);
}
