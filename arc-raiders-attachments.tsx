import { useState, useMemo } from "react";

// === DATA ===
const RARITY_ORDER = {Common:1,Uncommon:2,Rare:3,Epic:4,Legendary:5};

const BASE_MAG_SIZES = {
  kettle:20,rattler:12,arpeggio:24,tempest:24,bettina:20,ferro:1,renegade:8,aphelion:10,
  stitcher:30,bobcat:20,iltoro:3,vulcano:4,hairpin:10,burletta:10,venator:12,
  anvil:1,torrente:60,osprey:8,jupiter:5,hullcracker:1,equalizer:80
};

const W = [
  // Light Ammo
  { id:"hairpin",n:"Hairpin",c:"Pistol",a:"Light",f:"Slide",d:20,r:9,dps:180,rng:38.6,s:["Light Magazine"],rarity:"Common",pvp:"D",arc:"D",desc:"Built-in silencer for stealth. Too weak for real combat. Use for cameras, alarms, and escapes. Light ammo means zero ARC damage.",weakness:"Low damage output"},
  { id:"burletta",n:"Burletta",c:"Pistol",a:"Light",f:"Semi-Auto",d:10,r:28,dps:280,rng:41.7,s:["Muzzle","Light Magazine"],rarity:"Common",pvp:"C",arc:"D",desc:"High fire rate pistol. Depletes magazine fast—extended magazine essential. Light ammo excels versus players, fails versus ARCs. Better than Hairpin, still limited.",weakness:"Tiny magazine burns instantly"},
  { id:"kettle",n:"Kettle",c:"AR",a:"Light",f:"Semi-Auto",d:10,r:26,dps:280,rng:42.8,s:["Muzzle","Underbarrel","Light Magazine","Stock"],rarity:"Common",pvp:"B",arc:"D",desc:"Semi-auto workhorse with low recoil. Light ammo means weak ARC penetration—struggles against ARCs. Solid choice for player hunting if you land headshots.",weakness:"Bloom degrades accuracy over time"},
  { id:"stitcher",n:"Stitcher",c:"SMG",a:"Light",f:"Full-Auto",d:7,r:45.3,dps:317.1,rng:42.1,s:["Muzzle","Underbarrel","Light Magazine","Stock"],rarity:"Common",pvp:"A",arc:"D",desc:"Best common-tier close-quarters-combat weapon. High fire rate melts players close-range. Light ammo means terrible ARC penetration—useless against ARCs. High recoil needs control.",weakness:"Wild horizontal and vertical kick"},
  { id:"bobcat",n:"Bobcat",c:"SMG",a:"Light",f:"Full-Auto",d:6,r:66.7,dps:400,rng:44,s:["Muzzle","Underbarrel","Light Magazine","Stock"],rarity:"Uncommon",pvp:"A",arc:"D",desc:"Fastest-firing submachine gun. Shreds unarmored players instantly. Weak ARC penetration and lower damage fail against ARCs and armored opponents. Recoil demands investment.",weakness:"Extreme recoil from insane fire rate"},
  
  // Medium Ammo
  { id:"rattler",n:"Rattler",c:"AR",a:"Medium",f:"Full-Auto",d:9,r:33.3,dps:299.7,rng:56.2,s:["Muzzle","Underbarrel","Stock"],rarity:"Common",pvp:"B",arc:"C",desc:"Predictable full-auto with moderate ARC penetration. Small 12-round magazine limits sustained fights. Balanced choice for mixed encounters but outclassed by Tempest.",weakness:"Underwhelming overall performance"},
  { id:"arpeggio",n:"Arpeggio",c:"AR",a:"Medium",f:"3-Burst",d:9.5,r:18.3,dps:173.9,rng:55.9,s:["Muzzle","Underbarrel","Medium Magazine","Stock"],rarity:"Rare",pvp:"C",arc:"C",desc:"Burst-fire delays kill damage-per-second potential. Requires precision and fire discipline. Scales with upgrades but demands significant investment for mediocre returns.",weakness:"Slow recovery between bursts"},
  { id:"renegade",n:"Renegade",c:"BR",a:"Medium",f:"Lever-Action",d:35,r:21,dps:735,rng:68.8,s:["Muzzle","Medium Magazine","Stock"],rarity:"Rare",pvp:"A",arc:"B",desc:"Pinpoint mid-range powerhouse. Strong even unmodded. Medium ammo limits ARC penetration compared to heavy rifles. Weak in close-quarters rushes.",weakness:"Bullet velocity feels sluggish at range"},
  { id:"venator",n:"Venator",c:"Pistol",a:"Medium",f:"Semi-Auto",d:18,r:36.7,dps:660.6,rng:48.4,s:["Underbarrel","Medium Magazine"],rarity:"Rare",pvp:"A",arc:"C",desc:"Top-tier pistol. Significant recoil and bloom require grip investment. Medium ammo provides moderate ARC penetration. Extended magazine critical. Late-game squad wiper.",weakness:"Heavy kick and tiny 12-round mag"},
  { id:"torrente",n:"Torrente",c:"LMG",a:"Medium",f:"Full-Auto",d:8,r:58.3,dps:466.4,rng:49.9,s:["Muzzle","Medium Magazine","Stock"],rarity:"Rare",pvp:"B",arc:"B",desc:"60-round magazine suppression weapon. Terrible base dispersion—compensator mandatory. Heavy weight limits mobility. Crouching improves accuracy dramatically.",weakness:"Shots spray everywhere without mods"},
  { id:"osprey",n:"Osprey",c:"SR",a:"Medium",f:"Bolt",d:45,r:17.7,dps:796.5,rng:80.3,s:["Muzzle","Underbarrel","Medium Magazine","Stock"],rarity:"Rare",pvp:"B",arc:"B",desc:"Only scoped sniper rifle. Medium ammo limits ARC breaking. Not accurate enough for most players—better options exist for overwatch role.",weakness:"Slow bullet velocity at distance"},
  { id:"tempest",n:"Tempest",c:"AR",a:"Medium",f:"Full-Auto",d:10,r:36.7,dps:367,rng:55.9,s:["Muzzle","Underbarrel","Medium Magazine"],rarity:"Epic",pvp:"A",arc:"B",desc:"Current player-versus-player meta rifle. Manageable recoil, reliable time-to-kill at 10-20 meters. Moderate ARC penetration handles most ARCs. Burns ammo in prolonged fights.",weakness:"Vertical climb during sustained fire"},
  
  // Heavy Ammo
  { id:"ferro",n:"Ferro",c:"BR",a:"Heavy",f:"Break-Action",d:40,r:6.6,dps:264,rng:53.1,s:["Muzzle","Underbarrel","Stock"],rarity:"Common",pvp:"A",arc:"A",desc:"Budget ARC killer with massive single-shot damage. Break-action reload between shots means recoil mods are wasted. Only stock provides value. Legendary cost-to-performance.",weakness:"Sluggish aim down sights speed"},
  { id:"anvil",n:"Anvil",c:"HC",a:"Heavy",f:"Single",d:40,r:16.3,dps:652,rng:50.2,s:["Muzzle","Tech Mod"],rarity:"Uncommon",pvp:"S",arc:"A",desc:"Highest per-shot damage. Uncommon rarity means cheap maintenance with epic-tier performance. Heavy ammo shreds both ARCs and players. Universal value. Meta staple.",weakness:"Per-shot dispersion"},
  { id:"bettina",n:"Bettina",c:"AR",a:"Heavy",f:"Full-Auto",d:14,r:32,dps:448,rng:51.3,s:["Muzzle","Underbarrel","Stock"],rarity:"Epic",pvp:"A",arc:"A",desc:"Heavy-ammo hybrid excelling against both ARCs and players. Strong ARC penetration with competitive time-to-kill. High recoil and durability burn—expensive to maintain.",weakness:"Feels out of control during full-auto"},
  
  // Shotgun Ammo
  { id:"iltoro",n:"Il Toro",c:"SG",a:"Shotgun",f:"Pump",d:67.5,r:14.3,dps:965.3,rng:20,s:["Shotgun Muzzle","Underbarrel","Shotgun Magazine","Stock"],rarity:"Uncommon",pvp:"A",arc:"D",desc:"Point-blank delete button. Two-taps light shields. Useless beyond 5 meters. Slow reload punishes misses. Zero ARC penetration—player-hunting only.",weakness:"Pellet spread inconsistent"},
  { id:"vulcano",n:"Vulcano",c:"SG",a:"Shotgun",f:"Semi-Auto",d:49.5,r:26.3,dps:1302.9,rng:26,s:["Shotgun Muzzle","Underbarrel","Shotgun Magazine","Stock"],rarity:"Epic",pvp:"S",arc:"D",desc:"Fastest player time-to-kill in game. Semi-auto allows instant follow-ups. Weak ARC penetration fails against ARCs. Choke mandatory for consistency. Dominant in close-quarters-combat.",weakness:"Pellet spread unreliable without choke"},
  
  // Special Ammo
  { id:"hullcracker",n:"Hullcracker",c:"Special",a:"Special",f:"Pump",d:100,r:20.3,dps:2030,rng:38.9,s:["Underbarrel","Stock"],rarity:"Epic",pvp:"F",arc:"B",desc:"Grenade launcher. Strips ARC armor but inaccurate. Zero player damage—literally useless in player-versus-player. Niche armor-peeling role. Patch nerfs hurt viability.",weakness:"Terrible handling"},
  { id:"aphelion",n:"Aphelion",c:"BR",a:"Special",f:"2-Burst",d:25,r:9,dps:216,rng:76,s:["Underbarrel","Stock"],rarity:"Legendary",pvp:"B",arc:"A",desc:"Energy 2-burst with long range. Expensive to craft and run. Better value exists elsewhere—Renegade offers similar performance for far less investment.",weakness:"Recoil between bursts"},
  { id:"jupiter",n:"Jupiter",c:"SR",a:"Special",f:"Bolt",d:60,r:7.7,dps:423.5,rng:71.7,s:[],rarity:"Legendary",pvp:"C",arc:"A",desc:"Energy sniper with no modification slots. Massive ARC damage but ammo scarcity limits operations. Dedicated boss farming—not versatile. No attachments possible.",weakness:"No attachment slots"},
  { id:"equalizer",n:"Equalizer",c:"Special",a:"Special",f:"Full-Auto",d:8,r:33.3,dps:266.4,rng:68.6,s:[],rarity:"Legendary",pvp:"D",arc:"A",desc:"Energy beam, no attachments. Heaviest weapon (14 kilograms) kills mobility. Strong ARC penetration but terrible versus players. Squad-focused player-versus-environment. Solo players avoid.",weakness:"No attachment slots"},
];

const CL = {AR:"Assault Rifle",BR:"Battle Rifle",SMG:"SMG",SG:"Shotgun",Pistol:"Pistol",HC:"Hand Cannon",LMG:"LMG",SR:"Sniper Rifle",Special:"Special"};
const CC = {AR:"#3b82f6",BR:"#f59e0b",SMG:"#22c55e",SG:"#ef4444",Pistol:"#a855f7",HC:"#ec4899",LMG:"#f97316",SR:"#06b6d4",Special:"#6b7280"};
const AC = {Light:"#a3e635",Medium:"#fbbf24",Heavy:"#f87171",Shotgun:"#fb923c",Special:"#818cf8"};
const RARITY_COLORS = {Common:"#9ca3af",Uncommon:"#22c55e",Rare:"#3b82f6",Epic:"#a855f7",Legendary:"#f59e0b"};

const ALL_W = W.map(w=>w.id);
const MOST_MUZZLE = ALL_W.filter(x=>!["hairpin","venator","iltoro","vulcano","aphelion","hullcracker","jupiter","equalizer"].includes(x));
const MOST_UB = ALL_W.filter(x=>!["hairpin","burletta","anvil","torrente","jupiter","equalizer"].includes(x));
const MOST_STOCK = ALL_W.filter(x=>!["hairpin","burletta","venator","anvil","tempest","jupiter","equalizer"].includes(x));

const MOD_FAMILIES = {
  "Muzzle": [
    {fam:"Compensator",desc:"Reduces bloom",
      tiers:{1:{e:"25% Reduced Per-Shot Dispersion",cr:"6x Metal Parts, 1x Wire"},2:{e:"35% Reduced Per-Shot Dispersion",cr:"2x Mechanical Components, 4x Wire"},3:{e:"50% Reduced Per-Shot Dispersion",cr:"2x Mod Components, 8x Wire"}},
      w:MOST_MUZZLE, poor:["ferro"]},
    {fam:"Muzzle Brake",desc:"Reduces recoil",
      tiers:{1:{e:"15% Reduced Recoil",cr:"6x Metal Parts, 1x Wire"},2:{e:"20% Reduced Recoil",cr:"2x Mechanical Components, 4x Wire"},3:{e:"25% Reduced Recoil",cr:"2x Mod Components, 8x Wire"}},
      w:MOST_MUZZLE, poor:["ferro"]},
    {fam:"Silencer",desc:"Reduces noise",
      tiers:{2:{e:"20% Reduced Noise",cr:"2x Mechanical Components, 4x Wire"},3:{e:"40% Reduced Noise",cr:"2x Mod Components, 8x Wire"},"3+": {e:"60% Reduced Noise",cr:"3x Mod Components, 15x Wire"}},
      w:MOST_MUZZLE},
    {fam:"Extended Barrel",desc:"Increases velocity",
      tiers:{3:{e:"+25% Bullet Velocity",cr:"2x Mod Components, 8x Wire"}},
      w:["osprey","stitcher","ferro","arpeggio","anvil","burletta","kettle","renegade","rattler","bettina","tempest","bobcat","torrente"]},
  ],
  "Shotgun Muzzle": [
    {fam:"Shotgun Choke",desc:"Tightens spread",
      tiers:{1:{e:"20% Reduced Dispersion",cr:"6x Metal Parts, 1x Wire"},2:{e:"30% Reduced Dispersion",cr:"2x Mechanical Components, 4x Wire"},3:{e:"40% Reduced Dispersion",cr:"2x Mod Components, 8x Wire"}},
      w:["vulcano","iltoro"]},
    {fam:"Shotgun Silencer",desc:"Reduces noise",
      tiers:{3:{e:"50% Reduced Noise",cr:"2x Mod Components, 8x Wire"}},
      w:["vulcano","iltoro"]},
  ],
  "Underbarrel": [
    {fam:"Angled Grip",desc:"Reduces horizontal recoil",
      tiers:{1:{e:"20% Reduced H-Recoil",cr:"6x Plastic Parts, 1x Duct Tape"},2:{e:"30% Reduced H-Recoil",cr:"2x Mechanical Components, 3x Duct Tape"},3:{e:"40% Reduced H-Recoil",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_UB, poor:["ferro"]},
    {fam:"Vertical Grip",desc:"Reduces vertical recoil",
      tiers:{1:{e:"20% Reduced V-Recoil",cr:"6x Plastic Parts, 1x Duct Tape"},2:{e:"30% Reduced V-Recoil",cr:"2x Mechanical Components, 3x Duct Tape"},3:{e:"40% Reduced V-Recoil",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_UB, poor:["ferro"]},
    {fam:"Horizontal Grip",desc:"Both recoil directions",leg:true,
      tiers:{3:{e:"30% Reduced Recoil",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_UB, poor:["ferro"]},
    {fam:"Kinetic Converter",desc:"+15% Fire Rate",leg:true,
      tiers:{3:{e:"+15% Fire Rate"}},
      w:["arpeggio","rattler","kettle","vulcano","osprey","torrente","ferro","iltoro","bettina","stitcher","bobcat","tempest","renegade"], poor:["ferro"]},
  ],
  "Light Magazine": [
    {fam:"Extended Light Magazine",desc:"More rounds",
      tiers:{1:{e:"+5 Magazine Size",cr:"6x Plastic Parts, 1x Steel Spring"},2:{e:"+10 Magazine Size",cr:"2x Mechanical Components, 3x Steel Spring"},3:{e:"+15 Magazine Size",cr:"2x Mod Components, 5x Steel Spring"}},
      w:["bobcat","stitcher","kettle","hairpin","burletta"]},
  ],
  "Medium Magazine": [
    {fam:"Extended Medium Magazine",desc:"More rounds",
      tiers:{1:{e:"+4 Magazine Size",cr:"6x Plastic Parts, 1x Steel Spring"},2:{e:"+8 Magazine Size",cr:"2x Mechanical Components, 3x Steel Spring"},3:{e:"+12 Magazine Size",cr:"2x Mod Components, 5x Steel Spring"}},
      w:["arpeggio","venator","torrente","renegade","osprey","tempest"]},
  ],
  "Shotgun Magazine": [
    {fam:"Extended Shotgun Magazine",desc:"More shells",
      tiers:{1:{e:"+2 Magazine Size",cr:"6x Plastic Parts, 1x Steel Spring"},2:{e:"+4 Magazine Size",cr:"2x Mechanical Components, 3x Steel Spring"},3:{e:"+6 Magazine Size",cr:"2x Mod Components, 5x Steel Spring"}},
      w:["iltoro","vulcano"]},
  ],
  "Stock": [
    {fam:"Stable Stock",desc:"Faster recovery",
      tiers:{1:{e:"40% Recovery",cr:"7x Rubber Parts, 1x Duct Tape"},2:{e:"60% Recovery",cr:"2x Mechanical Components, 3x Duct Tape"},3:{e:"50% Recovery",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_STOCK},
    {fam:"Padded Stock",desc:"All-in-one stability",
      tiers:{3:{e:"30% Reduced Recoil/Dispersion",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_STOCK},
    {fam:"Lightweight Stock",desc:"Fast ADS",
      tiers:{3:{e:"+200% ADS Speed",cr:"2x Mod Components, 5x Duct Tape"}},
      w:MOST_STOCK},
  ],
  "Tech Mod": [
    {fam:"Anvil Splitter",desc:"Spread shot",leg:true,
      tiers:{3:{e:"+3 Projectiles"}},
      w:["anvil"]},
  ],
};

const TL = {1:"T1",2:"T2",3:"T3","3+":"T3+"};
const TC = {1:"#22c55e",2:"#3b82f6",3:"#a855f7","3+":"#f59e0b"};

// Goal-based presets
const GOAL_PRESETS = {
  fix: {
    icon: "🎯",
    name: "Fix This Gun",
    desc: "Addresses biggest weakness",
    builds: {
      hairpin: {slots:{"Light Magazine":{fam:"Extended Light Magazine",tier:2}},fix:"Extends stealth capacity"},
      burletta: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:3}},fix:"Fixes tiny mag + bloom"},
      kettle: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:1},"Light Magazine":{fam:"Extended Light Magazine",tier:3},"Stock":{fam:"Stable Stock",tier:2}},fix:"Eliminates bloom"},
      stitcher: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:3},"Stock":{fam:"Stable Stock",tier:1}},fix:"Tames wild kick"},
      bobcat: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:3},"Stock":{fam:"Stable Stock",tier:2}},fix:"Controls extreme recoil"},
      rattler: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:1},"Stock":{fam:"Stable Stock",tier:1}},fix:"Basic improvements"},
      arpeggio: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:1},"Medium Magazine":{fam:"Extended Medium Magazine",tier:2},"Stock":{fam:"Stable Stock",tier:2}},fix:"Speeds burst recovery"},
      renegade: {slots:{"Muzzle":{fam:"Extended Barrel",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:2},"Stock":{fam:"Stable Stock",tier:2}},fix:"Fixes sluggish velocity"},
      venator: {slots:{"Underbarrel":{fam:"Vertical Grip",tier:2},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3}},fix:"Extends mag, controls kick"},
      torrente: {slots:{"Muzzle":{fam:"Compensator",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:2},"Stock":{fam:"Stable Stock",tier:2}},fix:"Fixes terrible dispersion"},
      osprey: {slots:{"Muzzle":{fam:"Extended Barrel",tier:3},"Stock":{fam:"Lightweight Stock",tier:3}},fix:"Velocity + snap-aim"},
      tempest: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3}},fix:"Controls vertical climb"},
      ferro: {slots:{"Stock":{fam:"Lightweight Stock",tier:3}},fix:"Fixes sluggish ADS"},
      anvil: {slots:{"Muzzle":{fam:"Compensator",tier:3}},fix:"Tightens dispersion"},
      bettina: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:3},"Underbarrel":{fam:"Horizontal Grip",tier:3},"Stock":{fam:"Stable Stock",tier:2}},fix:"Controls full-auto"},
      iltoro: {slots:{"Shotgun Muzzle":{fam:"Shotgun Choke",tier:2},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:2}},fix:"Tightens spread"},
      vulcano: {slots:{"Shotgun Muzzle":{fam:"Shotgun Choke",tier:3},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:3}},fix:"Reliable pellets"},
      hullcracker: {slots:{"Underbarrel":{fam:"Vertical Grip",tier:1},"Stock":{fam:"Stable Stock",tier:1}},fix:"Better handling"},
      aphelion: {slots:{"Underbarrel":{fam:"Vertical Grip",tier:2},"Stock":{fam:"Stable Stock",tier:2}},fix:"Smooths bursts"},
      jupiter: {slots:{},fix:"No slots available"},
      equalizer: {slots:{},fix:"No slots available"},
    }
  },
  budget: {
    icon: "💰",
    name: "Budget Build",
    desc: "Max value, low cost",
    builds: {
      stitcher: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:2}},fix:"Cheap but effective"},
      tempest: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Angled Grip",tier:2},"Medium Magazine":{fam:"Extended Medium Magazine",tier:2}},fix:"T2 meta setup"},
      ferro: {slots:{"Stock":{fam:"Stable Stock",tier:1}},fix:"Cheapest ARC killer"},
      bobcat: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:2}},fix:"Budget stable"},
      vulcano: {slots:{"Shotgun Muzzle":{fam:"Shotgun Choke",tier:2},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:2}},fix:"Essentials only"},
      iltoro: {slots:{"Shotgun Muzzle":{fam:"Shotgun Choke",tier:2},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:2}},fix:"Minimal cost"},
      kettle: {slots:{"Muzzle":{fam:"Compensator",tier:1},"Underbarrel":{fam:"Vertical Grip",tier:1},"Light Magazine":{fam:"Extended Light Magazine",tier:1},"Stock":{fam:"Stable Stock",tier:1}},fix:"All T1 cheap"},
    }
  },
  recoil: {
    icon: "⚡",
    name: "Zero Recoil",
    desc: "Maximum stability",
    builds: {
      stitcher: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:3},"Underbarrel":{fam:"Vertical Grip",tier:3},"Stock":{fam:"Padded Stock",tier:3}},fix:"Laser accuracy"},
      bobcat: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:3},"Underbarrel":{fam:"Horizontal Grip",tier:3},"Stock":{fam:"Padded Stock",tier:3}},fix:"Full control"},
      tempest: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:3},"Underbarrel":{fam:"Horizontal Grip",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:2}},fix:"Max stability"},
      bettina: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:3},"Underbarrel":{fam:"Vertical Grip",tier:3},"Stock":{fam:"Padded Stock",tier:3}},fix:"Tames heavy"},
      torrente: {slots:{"Muzzle":{fam:"Compensator",tier:3},"Stock":{fam:"Padded Stock",tier:3}},fix:"Laser beam"},
    }
  },
  stealth: {
    icon: "🔇",
    name: "Stealth",
    desc: "Silencers, low noise",
    builds: {
      osprey: {slots:{"Muzzle":{fam:"Silencer",tier:2},"Stock":{fam:"Stable Stock",tier:2}},fix:"Silent snipes"},
      anvil: {slots:{"Muzzle":{fam:"Silencer",tier:2}},fix:"Quiet power"},
      vulcano: {slots:{"Shotgun Muzzle":{fam:"Shotgun Silencer",tier:3},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:3}},fix:"Silent clear"},
      burletta: {slots:{"Muzzle":{fam:"Silencer",tier:2},"Light Magazine":{fam:"Extended Light Magazine",tier:3}},fix:"Stealth pistol"},
      hairpin: {slots:{"Light Magazine":{fam:"Extended Light Magazine",tier:2}},fix:"Extended stealth"},
    }
  },
  pvp: {
    icon: "🏆",
    name: "Meta PVP",
    desc: "Player combat proven",
    builds: {
      tempest: {slots:{"Muzzle":{fam:"Muzzle Brake",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3}},fix:"AR king"},
      vulcano: {slots:{"Shotgun Muzzle":{fam:"Shotgun Choke",tier:3},"Shotgun Magazine":{fam:"Extended Shotgun Magazine",tier:3}},fix:"Fastest TTK"},
      anvil: {slots:{"Muzzle":{fam:"Compensator",tier:3}},fix:"Meta cannon"},
      stitcher: {slots:{"Muzzle":{fam:"Compensator",tier:3},"Light Magazine":{fam:"Extended Light Magazine",tier:3}},fix:"High DPS"},
      venator: {slots:{"Underbarrel":{fam:"Horizontal Grip",tier:3},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3}},fix:"Top pistol"},
    }
  },
  arc: {
    icon: "🤖",
    name: "ARC Hunter",
    desc: "Robot combat optimized",
    builds: {
      ferro: {slots:{"Stock":{fam:"Stable Stock",tier:2}},fix:"Boss killer"},
      anvil: {slots:{"Muzzle":{fam:"Compensator",tier:2}},fix:"Heavy precision"},
      bettina: {slots:{"Muzzle":{fam:"Compensator",tier:3},"Underbarrel":{fam:"Vertical Grip",tier:2},"Stock":{fam:"Stable Stock",tier:3}},fix:"Heavy accuracy"},
      tempest: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Underbarrel":{fam:"Vertical Grip",tier:2},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3}},fix:"Sustained DPS"},
      renegade: {slots:{"Muzzle":{fam:"Compensator",tier:2},"Medium Magazine":{fam:"Extended Medium Magazine",tier:3},"Stock":{fam:"Stable Stock",tier:2}},fix:"ARC breaking"},
    }
  }
};

export default function ArcRaidersAttachments() {
  const [gun,setGun]=useState(null);
  const [selectedGoal,setSelectedGoal]=useState(null);
  const [equipped,setEquipped]=useState({});
  const [viewMode,setViewMode]=useState("goals");

  const gunObj = useMemo(()=>W.find(w=>w.id===gun),[gun]);

  // Calculate build cost
  const buildCost = useMemo(()=>{
    const materials = {};
    Object.values(equipped).forEach(({fam:famName,tier})=>{
      const allFams = Object.values(MOD_FAMILIES).flat();
      const famObj = allFams.find(f=>f.fam===famName);
      if(famObj && famObj.tiers[tier] && famObj.tiers[tier].cr){
        const cr = famObj.tiers[tier].cr;
        const parts = cr.split(',').map(p=>p.trim());
        parts.forEach(part=>{
          const match = part.match(/(\d+)x\s+(.+)/);
          if(match){
            const [,qty,item] = match;
            materials[item] = (materials[item]||0) + parseInt(qty);
          }
        });
      }
    });
    return materials;
  },[equipped]);

  const applyGoalBuild = (goalKey) => {
    const goal = GOAL_PRESETS[goalKey];
    if(goal && goal.builds[gun]){
      setEquipped(goal.builds[gun].slots);
      setSelectedGoal(goalKey);
    }
  };

  const resetSelection = () => {
    setGun(null);
    setSelectedGoal(null);
    setEquipped({});
    setViewMode("goals");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 bg-opacity-50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            ARC RAIDERS Build Tool
          </h1>
          {gun && (
            <button onClick={resetSelection} className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Change Weapon
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* STEP 1: Weapon Selection */}
        {!gun && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Weapon</h2>
              <p className="text-gray-400 text-sm">Select the weapon you want to build</p>
            </div>
            <div className="space-y-3">
              {["Light","Medium","Heavy","Shotgun","Special"].map(ammoType=>{
                const guns = W.filter(w=>w.a===ammoType).sort((a,b)=>RARITY_ORDER[a.rarity]-RARITY_ORDER[b.rarity]);
                if(guns.length===0) return null;
                return (
                  <div key={ammoType} className="space-y-2">
                    <h3 className="text-sm font-semibold px-2 py-1 rounded inline-block" style={{backgroundColor:AC[ammoType]+"22",color:AC[ammoType]}}>{ammoType} Ammo</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {guns.map(w=>(
                        <button key={w.id} onClick={()=>setGun(w.id)}
                          className="p-3 rounded-lg border border-gray-800 bg-gray-900 hover:border-orange-500 transition-all text-left group">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-white group-hover:text-orange-300 transition-colors">{w.n}</span>
                          </div>
                          <p className="text-xs text-gray-500">{CL[w.c]}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Goal Selection */}
        {gun && viewMode === "goals" && (
          <div className="space-y-6">
            {/* Weapon header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{gunObj.n}</h2>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs px-2 py-1 rounded" style={{backgroundColor:CC[gunObj.c]+"22",color:CC[gunObj.c]}}>{CL[gunObj.c]}</span>
                    <span className="text-xs px-2 py-1 rounded" style={{backgroundColor:AC[gunObj.a]+"22",color:AC[gunObj.a]}}>{gunObj.a}</span>
                    <span className="text-xs px-2 py-1 rounded" style={{backgroundColor:RARITY_COLORS[gunObj.rarity]+"22",color:RARITY_COLORS[gunObj.rarity]}}>{gunObj.rarity}</span>
                  </div>
                  {gunObj.weakness && (
                    <div className="flex items-start gap-2 bg-gray-800 bg-opacity-50 rounded-lg p-3">
                      <span className="text-orange-400 text-xl shrink-0">⚠️</span>
                      <div>
                        <div className="text-xs font-semibold text-orange-400 mb-1">Known Weakness</div>
                        <p className="text-sm text-gray-300">{gunObj.weakness}</p>
                      </div>
                    </div>
                  )}
                </div>
                {gunObj.s.length > 0 && (
                  <button onClick={()=>setViewMode("custom")} className="px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition-colors">
                    ⚙️ Advanced Custom Build
                  </button>
                )}
              </div>
            </div>

            {/* Goal cards */}
            {gunObj.s.length === 0 ? (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <p className="text-xl text-gray-400 font-semibold mb-2">No Attachment Slots</p>
                <p className="text-sm text-gray-500">This weapon cannot be modified</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-2">What Do You Want to Achieve?</h3>
                  <p className="text-sm text-gray-400">Choose your goal and we'll show you exactly how to build it</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(GOAL_PRESETS).map(([key,goal])=>{
                    const hasBuild = goal.builds[gun];
                    const isSelected = selectedGoal === key;
                    if(!hasBuild) return null;

                    return (
                      <button key={key} onClick={()=>applyGoalBuild(key)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left hover:scale-105 transform ${
                          isSelected 
                            ? "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 bg-opacity-20 shadow-lg shadow-orange-500/20" 
                            : "border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-orange-500/50"
                        }`}>
                        <div className="text-5xl mb-3">{goal.icon}</div>
                        <h4 className="font-bold text-xl mb-2">{goal.name}</h4>
                        <p className="text-sm text-gray-400 mb-3">{goal.desc}</p>
                        {isSelected && (
                          <div className="pt-3 border-t border-orange-500/30">
                            <p className="text-sm text-orange-200 font-semibold">✓ {goal.builds[gun].fix}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Build preview */}
                {selectedGoal && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-500 p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Your Build</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-400 font-semibold">Total Cost:</span>
                        {Object.keys(buildCost).length === 0 ? (
                          <span className="text-lg font-bold text-green-400 px-4 py-2 rounded-lg bg-green-500/20">Free</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(buildCost).map(([item,qty])=>(
                              <span key={item} className="text-sm px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-orange-300 font-bold">
                                {qty}x {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Equipped */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(equipped).map(([slot,{fam,tier}])=>(
                        <div key={slot} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{slot}</div>
                          <div className="font-bold text-lg text-white">{fam}</div>
                          <div className="text-sm mt-2 font-semibold" style={{color:TC[tier]}}>{TL[tier]}</div>
                        </div>
                      ))}
                    </div>

                    <button onClick={()=>setViewMode("custom")} className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                      Customize This Build
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STEP 3: Custom Build */}
        {gun && viewMode === "custom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={()=>setViewMode("goals")} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                ← Back to Goal Selection
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:sticky lg:top-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">{gunObj.n}</h3>
                    <p className="text-xs text-gray-500">{gunObj.desc}</p>
                  </div>

                  {Object.keys(buildCost).length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <h4 className="text-sm text-gray-400 font-semibold mb-3">Total Cost</h4>
                      <div className="space-y-2">
                        {Object.entries(buildCost).map(([item,qty])=>(
                          <div key={item} className="flex items-center justify-between text-sm bg-gray-800 rounded-lg px-3 py-2">
                            <span className="text-gray-300">{item}</span>
                            <span className="text-orange-400 font-bold">{qty}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(equipped).length > 0 && (
                    <button onClick={()=>setEquipped({})} className="w-full px-4 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/40 text-red-400 font-semibold transition-colors">
                      Clear All Attachments
                    </button>
                  )}
                </div>
              </div>

              {/* Slots */}
              <div className="lg:col-span-2 space-y-3">
                {gunObj.s.map(slot=>{
                  const eq = equipped[slot];
                  const fams = (MOD_FAMILIES[slot]||[]).filter(f=>f.w.includes(gunObj.id));

                  return (
                    <div key={slot} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-200">{slot}</h4>
                        {eq && (
                          <button onClick={()=>{const {[slot]:_,...rest}=equipped;setEquipped(rest);}} className="text-sm text-red-400 hover:text-red-300 font-medium">
                            Remove
                          </button>
                        )}
                      </div>

                      {eq ? (
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                          <div>
                            <div className="font-bold text-white text-lg">{eq.fam}</div>
                            <div className="text-sm mt-1 font-semibold" style={{color:TC[eq.tier]}}>{TL[eq.tier]}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {fams.map(fam=>{
                            const tiers = Object.keys(fam.tiers);
                            return (
                              <div key={fam.fam} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <div className="font-semibold text-white">{fam.fam}</div>
                                    <div className="text-xs text-gray-500 mt-1">{fam.desc}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {tiers.map(t=>(
                                    <button key={t} onClick={()=>setEquipped(prev=>({...prev,[slot]:{fam:fam.fam,tier:t}}))}
                                      className="flex-1 px-4 py-3 rounded-lg font-bold hover:brightness-125 transition-all shadow-md hover:shadow-lg"
                                      style={{backgroundColor:TC[t],color:"white"}}>
                                      {TL[t]}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
