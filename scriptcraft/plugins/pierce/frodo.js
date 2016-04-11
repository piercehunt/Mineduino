
var mqtt = require('sc-mqtt'),
  spawn = require('spawn'),
  utils = require('utils'),
  foreach = require('utils').foreach,
  client = mqtt.client(),
  JavaString = java.lang.String,
  last = false;

client.connect();
client.subscribe('arduino1');

client.onMessageArrived( function(topic,message){
    var msgText = '' + new JavaString(message.payload);
    if (topic == 'arduino1'){

      // console.log(msgText);

      parseColors(msgText, function(r,g,b) {
        console.log(r);
        console.log(g);
        console.log(b);

        if(r > 75 && !last){
          last = true;
          // get player location
          var player = utils.player("Chumbeee");
          if(player) {
            var location = player.location;
            // location.setZ(location.getZ() + 70);
            spawn("PIG", location);
            console.log("PIG!");
          }
        }
        else {
          last = false;
        }
        // do something based upon r,g,b
      });
        /*
          change the time in each of the server's worlds.
          Day becomes night, night becomes day.
         */
        //foreach( server.worlds, function(world){
        //    var time = world.time + 12000; // adds 1/2 day to time
        //    world.time = time;
        //});
    }
});

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
