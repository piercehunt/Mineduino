
/************************************************************************
## Frodo Color-Sensor Module

* listens to colors from Arduino and tries to match them with color-actions list
* Color Actions are associated with a player and will only activate if player is online
* Color Actions are an array of objects with a color, player, and spawn type

/************************************************************************/
var mqtt = require('sc-mqtt'),
  spawn = require('spawn'),
  utils = require('utils'),
  entities = require('entities'),
  blocks = require('blocks'),
  property = require('blockhelper').property,
  foreach = require('utils').foreach,
  lightning = require('lightning'),
  client = mqtt.client(),
  JavaString = java.lang.String,
  last = false;

client.connect();
client.subscribe('arduino1');

// Creates an allowance for the target color to trigger
var delta = 18;

// listening to the mqtt protocol for colors sent from arduino
client.onMessageArrived( function(topic,message){
  var msgText = '' + new JavaString(message.payload);
  if (topic != 'arduino1'){
    return;
  }

  if(colorActions.length <= 0) {
    // Nobody wants colorsensor stuff.
    return;
  }

  // console.log(msgText);

  try {

    parseColors(msgText, function(r,g,b) {
      // console.log(r);
      // console.log(g);
      // console.log(b);
      console.log("r:" + r + ", g:" + g + ", b:" + b);

      // check each subscriber to this sensor
      for(x=0;x < colorActions.length; x++){
          var sub = colorActions[x];
          // Check to see if the subscriber's colors match
          if( r > sub.color.r -delta && r < sub.color.r +delta &&
              g > sub.color.g -delta && g < sub.color.g +delta &&
              b > sub.color.b -delta && b < sub.color.b +delta) {

                // if last sensor reading was same as this one
                if(sub.last) {
                  // do nothing...
                  continue;
                }

                // do the action as soon as possible
                setTimeout(createColorSpawner(sub),0);
          }
          else {
            sub.last = false;
          }
      }
    });
  }
  catch (error){

    console.log("Frodo: ERROR!");
    console.log(error);
  }
});

function createColorSpawner(sub) {
  return function() { // Find player in game
            var player = utils.player(sub.player);
            if(sub.spawn) {
              if(player) {
                var location = player.location;
                // location.setZ(location.getZ() + 70);
                // spawnEntity(sub.spawn, location, sub.spawn_color);
                spawn(sub.spawn, location);
                console.log(sub.player + ":" + sub.spawn + "!");
              }
            }

            // flag this subscriber so we dont duplicate this action.
            sub.last = sub.tag;
          };
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

var colorActions = [
  {
    player: "Chumbeee",
    color: { r: 136, g:20, b: 45 },
    spawn: "PIG",
    spawn_color: "8",
    last: false,
    tag: "pig"
  },
  {
    player: "Chumbeee",
    color: { r: 254, g:204, b: 375 },
    spawn: "SHEEP",
    spawn_color: "8",
    last: false,
    tag: "sheep"
  },
  {
    player: "Chumbeee",
    color: { r: 83, g:75, b: 35 },
    spawn: "CREEPER",
    last: false,
    tag: "creeper"
  },
  {
    player: "Chumbeee",
    color: { r: 52, g:52, b: 102 },
    spawn: "SQUID",
    spawn_color: "8",
    last: false,
    tag: "squid"
  },
  {
    player: "Chumbeee",
    color: { r: 255, g:255, b: 255 },
    spawn: "SKELETON",
    spawn_color: "8",
    last: false,
    tag: "skeleton"
  },
  {
    player: "Chumbeee",
    color: { r: 180, g:180, b: 180 },
    spawn: "WOLF",
    spawn_color: "8",
    last: false,
    tag: "wolf"
  },
  {
    player: "Chumbeee",
    color: { r:163, g:85, b: 82 },
    spawn: "PIG_ZOMBIE",
    spawn_color: "8",
    last: false,
    tag: "pigman"
  },
  {
    player: "Chumbeee",
    color: { r: 101, g:93, b: 83 },
    spawn: "SLIME",
    spawn_color: "8",
    last: false,
    tag: "slime"
  },
  {
    player: "Chumbeee",
    color: { r: 87, g:21, b: 23 },
    spawn: "OCELOT",
    spawn_color: "8",
    last: false,
    tag: "ocelot"
  }
  // {
  //   player: "Chumbeee",
  //   trigger: {
  //     color: { r: 60, g:180, b: 60 }
  //   },
  //   action: {
  //     spawn: "SLIME",
  //
  //   },
  //   last: false,
  //   tag: "slime"
  // }
];
