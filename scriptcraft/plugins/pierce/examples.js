// This doesnt work right now, but not sure why!!
function spawnEntity(entity, location, color) {
  var entityTypeFn, entityType;
  if (typeof entity === 'string'){
    entityTypeFn = entities[entity.toLowerCase()];
    entityType = entityTypeFn();
  }

  var world = location.world;
  if (__plugin.bukkit){
    DyeColor = Packages.net.minecraft.item.EnumDyeColor;
    var entityInstance = world.spawnEntity( location, entityType);
    if(entity == "SHEEP"){
      console.log(entityInstance);
      applyColors(entityInstance, DyeColor.ORANGE); // TODO: use color to drive this color
    }
  }
  if (__plugin.canary){

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
}

function applyColors( block, metadata ){
  //switch( block.typeId){
  //case blocks.wool.white:
  //case 35:
  //case blocks.stained_clay.white:
  //case 159:
  //case blocks.stained_glass.white:
  //case 95:
  //case blocks.stained_glass_pane.white:
  //case 160:
  //case blocks.carpet.white:
  //case 171:
    property(block).set('color',metadata);
  // }
}
