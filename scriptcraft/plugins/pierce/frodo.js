
var mqtt = require('sc-mqtt'),
  spawn = require('spawn'),
  utils = require('utils'),
  entities = require('entities'),
  foreach = require('utils').foreach,
  client = mqtt.client(),
  JavaString = java.lang.String,
  last = false;

client.connect();
client.subscribe('arduino1');

var colorSensorSub = [
  {
    player: "Chumbeee",
    color: { r: 136, g:20, b: 45 },
    spawn: "SHEEP",
    spawn_color: "8",
    last: false,
    tag: "sheep"
  },
  {
    player: "Nurdy",
    color: { r: 136, g:20, b: 45 },
    spawn: "SHEEP",
    spawn_color: "8",
    last: false,
    tag: "sheep"
  },
  {
    player: "Nurdy",
    color: { r: 83, g:75, b: 35 },
    spawn: "SQUID",
    last: false,
    tag: "SQUID"
  }
];

var delta = 10;

// 1. Chumbee is listening for Red to spawn sheep near his location
// 2. When Red occurs, spawn sheep near all players
// 3, Register Chumbee with Red and Spawn Sheep so that when red is shown it will cause spawn

client.onMessageArrived( function(topic,message){
  var msgText = '' + new JavaString(message.payload);
  if (topic != 'arduino1'){
    return;
  }

  if(colorSensorSub.length <= 0) {
    // Nobody wants colorsensor stuff.
    return;
  }

  // console.log(msgText);

  try {

    parseColors(msgText, function(r,g,b) {
      console.log(r);
      console.log(g);
      console.log(b);

      // check each subscriber to this sensor
      for(x=0;x < colorSensorSub.length; x++){
          var sub = colorSensorSub[x];
          // Check to see if the subscriber's colors match
          if( r > sub.color.r -delta && r < sub.color.r +delta &&
              g > sub.color.g -delta && g < sub.color.g +delta &&
              b > sub.color.b -delta && b < sub.color.b +delta) {

                // if last sensor reading was same as this one
                if(sub.last) {
                  // do nothing...
                  continue;
                }

                // Find player in game
                var player = utils.player(sub.player);
                if(sub.spawn) {
                  if(player) {
                    var location = player.location;
                    // location.setZ(location.getZ() + 70);
                    //spawnEntity(sub.spawn, location, sub.spawn_color);
                    spawn(sub.spawn, location);
                    console.log(sub.player + ":" + sub.spawn + "!");
                  }
                }

                // flag this subscriber so we dont duplicate this action.
                sub.last = sub.tag;
          }
          else {
            sub.last = false;
          }
      }
    });
  }
  catch (error){
    // Eat any errors
    console.log("Frodo: ERROR!");
    console.log(error);
  }
});

function spawnEntity(entity, location, color) {
  var entityTypeFn, entityType;
  if (typeof entity === 'string'){
    entityTypeFn = entities[entity.toLowerCase()];
    entityType = entityTypeFn();
  }

  var Canary = Packages.net.canarymod.Canary;
  var cmDyeColor = Packages.net.canarymod.api.DyeColor;
  var entityFactory = Canary.factory().entityFactory;
  var cmEntityType = Packages.net.canarymod.api.entity.EntityType;

  var spawned = entityFactory.newEntity(entityType, location);
  if(entity == "SHEEP"){
    spawned.setColor(cmDyeColor.ORANGE); // TODO: use color to drive this color
  }
  spawned.spawn();
}

function parseColors(colors, action) {
  var r=0,g=0,b=0;

  // TODO: parse "R0000 G0000 B0000" into r,g,b
  var segments = colors.split(" ");
  if (segments.length !== 3){
    return;
  }

  if(segments[0].indexOf("R") !== 0) {
    return;
  }

  if(segments[1].indexOf("G") !== 0) {
    return;
  }

  if(segments[2].indexOf("B") !== 0) {
    return;
  }

  r = segments[0].substring(1,5);
  g = segments[1].substring(1,5);
  b = segments[2].substring(1,5);

  r = parseInt(r, 10);
  g = parseInt(g, 10);
  b = parseInt(b, 10);

  action(r,g,b);
}
