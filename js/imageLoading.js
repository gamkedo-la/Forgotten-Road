var logoPic = document.createElement("img");
var wizardPic = document.createElement("img");
var warriorPic = document.createElement("img");
var portraitPic = document.createElement("img");
var townMapPic = document.createElement("img");
var blacksmithShopPic = document.createElement("img");
var alchemistShopPic = document.createElement("img");
var pickUpItemPic = document.createElement("img");
var heartFullPic = document.createElement("img");
var heartHalfPic = document.createElement("img");
var heartEmptyPic = document.createElement("img");
var enemyPic = document.createElement("img"); // placeholder
var boltPic = document.createElement("img"); 
var staffIconPic = document.createElement("img"); 
var leatherArmorIconPic = document.createElement("img");
var healthPotionPic = document.createElement("img");
var goblinPic = document.createElement("img");
var koboldPic = document.createElement("img");
var ghoulPic = document.createElement('img');
var skeletonPic = document.createElement("img");
var skeletonKingPic = document.createElement("img");
var orcPic = document.createElement("img");
var wraithPic = document.createElement("img"); 
var oldManPic = document.createElement("img");
var chuckPic = document.createElement("img");
var boxPic = document.createElement("img");
var coinPic = document.createElement("img");
var shieldGlowPic = document.createElement("img");
var boltItemPic = document.createElement("img");
var pendantPic = document.createElement("img");
var blacksmithPic = document.createElement("img");
var alchemistPic = document.createElement("img");
var shadowPic = document.createElement("img");
var foliagePic = document.createElement("img");
var chefPic = document.createElement("img");
var mickPic = document.createElement("img");
var topBarBackgroundPic = document.createElement("img");
var bluethermometerPic = document.createElement("img");
var redthermometerPic = document.createElement("img");
var fogPic = document.createElement("img");
var chickenPic = document.createElement("img");
var mushroomPic = document.createElement("img");
var rainPic = document.createElement("img");
var snowPic = document.createElement("img");
var treasureChestPic = document.createElement("img");
var barrelPic = document.createElement("img");
var villagerHousesPic = document.createElement("img");
var animsPic = document.createElement("img");

//var titlepagePic = document.createElement("img");
var tilePics = [];

var picsToLoad = 0;

function countLoadedImagesAndLaunchIfReady(){
		picsToLoad--;
		//console.log("finished downloading image #"+picsToLoad);
		if(picsToLoad == 0) {
			imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/" + fileName;
}

function loadImageForRoomCode(tileCode, fileName, sX = 0, sY = 0, sW = TILE_W, sH = TILE_H) {
  const img = document.createElement("img");
  img.onload = countLoadedImagesAndLaunchIfReady;
  img.src = "images/" + fileName;
  img.sX = sX;
  img.sY = sY;
  img.sW = sW;
  img.sH = sH;

  tilePics[tileCode] = img;
}

function loadImages() {	
    var imageList = [
        {varName: logoPic, theFile: "logo.png"},
        {varName: townMapPic, theFile: "townMap.png"},
        {varName: wizardPic, theFile: "wizard.png"},
        {varName: warriorPic, theFile: "warrior.png"},
        {varName: portraitPic, theFile: "PlayerPotrait.png"},
        {varName: goblinPic, theFile: "goblin.png"},
        {varName: koboldPic, theFile: "Kobald.png"},
        {varName: skeletonPic, theFile: "skeleton.png"},
        {varName: skeletonKingPic, theFile: "skeletonKing.png"},
        {varName: ghoulPic, theFile: "Ghoul.png"},
        {varName: orcPic, theFile: "orc.png"},
        {varName: wraithPic, theFile: "Wraith.png"},
        {varName: blacksmithShopPic, theFile: "BlackSmithShop.png"},
        {varName: alchemistShopPic, theFile: "BlackSmithShop.png"},
        {varName: pickUpItemPic, theFile: "pickupItems.png"},
        {varName: heartFullPic, theFile: "fullHeart.png"},
        {varName: heartHalfPic, theFile: "halfHeart.png"},
        {varName: heartEmptyPic, theFile: "noHeart.png"},
        {varName: boltPic, theFile: "bolt.png"},
        {varName: staffIconPic, theFile: "staffIcon.png"},
        {varName: leatherArmorIconPic, theFile: "armorIcon.png"},
        {varName: healthPotionPic, theFile: "healthPotion.png"},
        {varName: oldManPic, theFile: "oldman.png"},
        {varName: chuckPic, theFile: "chuck.png"},
        {varName: chefPic, theFile: "chef.png"},
        {varName: mickPic, theFile: "mick.png"},
        {varName: boxPic, theFile: "box.png"},
        {varName: coinPic, theFile: "coin.png"},
        {varName: shieldGlowPic, theFile: "shadowShield.png"},
        {varName: boltItemPic, theFile: "boltItem.png"},
        {varName: pendantPic, theFile: "pendant.png"},
        {varName: blacksmithPic, theFile: "blacksmith.png"},
        {varName: alchemistPic, theFile: "alchemist.png"},
        {varName: shadowPic, theFile: "shadow.png"},
        {varName: foliagePic, theFile: "foliage.png"},
        {varName: topBarBackgroundPic, theFile: "tree_top_bar_bg.png"},
        {varName: bluethermometerPic, theFile: "thermometer_blue.png"},
        {varName: redthermometerPic, theFile: "thermometer_red.png"},
        {varName: fogPic, theFile: "fog.png"},
        {varName: chickenPic, theFile: "chicken.png"},
        {varName: mushroomPic, theFile: "mushroom.png"},
        {varName: rainPic, theFile: "rain.png"},
        {varName: snowPic, theFile: "snow.png"},
        {varName: treasureChestPic, theFile: "treasureChest.png"},
        {varName: barrelPic, theFile: "barrel.png"},
        {varName: villagerHousesPic, theFile: "villagerHouses.png"},
        {varName: animsPic, theFile: "anims.png"},

        {tileType: TILE_GRASS, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_CRYPT_GATE, theFile: "cryptGate.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_FENCE, theFile: "fence.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_GRAVES, theFile: "graves.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_WALL, theFile: "wall.png", sX: "32", sY: "0",options: 0},
        {tileType: TILE_ROAD, theFile: "road.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_FLOOR, theFile: "grass.png", sX: "0", sY: "32*2",options: 0},
        {tileType: TILE_TREE, theFile: "tree.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_TREE2, theFile: "grass.png", sX: 0, sY: 160, sW: 64, sH: 64, options: 0},
        {tileType: TILE_BUSH1, theFile: "wildBush.png", sX: 0, sY: 0, options: 0},
        {tileType: TILE_BUSH2, theFile: "wildBush2.png", sX: 0, sY: 0, options: 0},
        {tileType: TILE_LAMP, theFile: "lamp.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_WATER, theFile: "water.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_WATER_FULL, theFile: "water.png", sX: "0", sY: "32",options: 0},
        {tileType: TILE_WATER_SOUTH, theFile: "water.png", sX: "0", sY: "64",options: 0},
        {tileType: TILE_WATER_NE, theFile: "water.png", sX: "32", sY: "0",options: 0},
        {tileType: TILE_WATER_EAST, theFile: "water.png", sX: "32", sY: "32",options: 0},

        {tileType: TILE_PRESSURE_PLATE, theFile: "grass.png", sX: "64", sY: "32",options: 0},
        {tileType: TILE_DIRT, theFile: "dirt.png", sX: "32", sY: "32",options: 0},
        {tileType: TILE_DUNGEON_ENTRANCE, theFile: "wall.png", sX: 0, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_TOP, theFile: "wall.png", sX: 128, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_DOOR_CEILING, theFile: "wall.png", sX: 128, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_TORCH, theFile: "wall.png", sX: 192, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_1, theFile: "wall.png", sX: 32, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_2, theFile: "wall.png", sX: 64, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_3, theFile: "wall.png", sX: 32, sY:32, options: 0},
        {tileType: TILE_DUNGEON_WALL_BOTTOM, theFile: "wall.png", sX: 128, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_WALL_LEFT, theFile: "wall.png", sX: 96, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_WALL_RIGHT, theFile: "wall.png", sX: 160, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_WALL_CORNER_TL, theFile: "wall.png", sX: 96, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_CORNER_TR, theFile: "wall.png", sX: 160, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_WALL_CORNER_BL, theFile: "wall.png", sX: 96, sY: 64, options: 0},
        {tileType: TILE_DUNGEON_WALL_CORNER_BR, theFile: "wall.png", sX: 160, sY: 64, options: 0},
        {tileType: TILE_DUNGEON_FLOOR, theFile: "wall.png", sX: 128, sY: 64, options: 0},
        {tileType: TILE_DUNGEON_FLOOR_SKULL1, theFile: "wall.png", sX: 128, sY: 96, options: 0},
        {tileType: TILE_DUNGEON_FLOOR_SKULL2, theFile: "wall.png", sX: 128, sY: 128, options: 0},
        {tileType: TILE_DUNGEON_FLOOR_SKULL3, theFile: "wall.png", sX: 128, sY: 160, options: 0},
        {tileType: TILE_DUNGEON_FLOOR_SKULL4, theFile: "wall.png", sX: 128, sY: 192, options: 0},
        {tileType: TILE_DUNGEON_DOOR_TL, theFile: "wall.png", sX: 224, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_DOOR_TC, theFile: "wall.png", sX: 256, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_DOOR_TR, theFile: "wall.png", sX: 288, sY: 0, options: 0},
        {tileType: TILE_DUNGEON_DOOR_BL, theFile: "wall.png", sX: 224, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_DOOR_BC, theFile: "wall.png", sX: 256, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_DOOR_BR, theFile: "wall.png", sX: 288, sY: 32, options: 0},
        {tileType: TILE_DUNGEON_LOCKED_DOOR_BL, theFile: "wall.png", sX: 224, sY: 64, options: 0},
        {tileType: TILE_DUNGEON_LOCKED_DOOR_BC, theFile: "wall.png", sX: 256, sY: 64, options: 0},
        {tileType: TILE_DUNGEON_LOCKED_DOOR_BR, theFile: "wall.png", sX: 288, sY: 64, options: 0},
        {tileType: TILE_ROAD_CORNER_TL, theFile: "road.png", sX: 0,   sY: 0 },
        {tileType: TILE_ROAD_CORNER_TR, theFile: "road.png", sX: 32,  sY: 0 },
        {tileType: TILE_ROAD_CORNER_BL, theFile: "road.png", sX: 0,   sY: 32 },
        {tileType: TILE_ROAD_CORNER_BR, theFile: "road.png", sX: 32,  sY: 32 },
        {tileType: TILE_ROAD_VERTICAL, theFile: "road.png", sX: 32,  sY: 0 },
        {tileType: TILE_ROAD_HORIZONTAL, theFile: "road.png", sX: 32,  sY: 32 },
        {tileType: TILE_ROAD_CROSS, theFile: "road.png", sX: 32, sY: 32 },
        {tileType: TILE_TREE1_TL, theFile: "bigTree.png", sX: 0, sY: 0 },
        {tileType: TILE_TREE1_TR, theFile: "bigTree.png", sX: 32, sY: 0 },
        {tileType: TILE_TREE1_BL, theFile: "bigTree.png", sX: 0, sY: 32 },
        {tileType: TILE_TREE1_BR, theFile: "bigTree.png", sX: 32, sY: 32 },
        {tileType: TILE_TREE2_TL, theFile: "bigTree.png", sX: 64, sY: 0 },
        {tileType: TILE_TREE2_TR, theFile: "bigTree.png", sX: 96, sY: 0 },
        {tileType: TILE_TREE2_BL, theFile: "bigTree.png", sX: 64, sY: 32 },
        {tileType: TILE_TREE2_BR, theFile: "bigTree.png", sX: 96, sY: 32 },
        {tileType: TILE_CRYPT_10, theFile: "SkeletonKingCrypt.png", sX: 0, sY: 0 },
        {tileType: TILE_CRYPT_11, theFile: "SkeletonKingCrypt.png", sX: 32, sY: 0 },
        {tileType: TILE_CRYPT_12, theFile: "SkeletonKingCrypt.png", sX: 64, sY: 0 },
        {tileType: TILE_CRYPT_13, theFile: "SkeletonKingCrypt.png", sX: 96, sY: 0 },
        {tileType: TILE_CRYPT_14, theFile: "SkeletonKingCrypt.png", sX: 128, sY: 0 },
        {tileType: TILE_CRYPT_20, theFile: "SkeletonKingCrypt.png", sX: 0, sY: 32 },
        {tileType: TILE_CRYPT_21, theFile: "SkeletonKingCrypt.png", sX: 32, sY: 32 },
        {tileType: TILE_CRYPT_22, theFile: "SkeletonKingCrypt.png", sX: 64, sY: 32 },
        {tileType: TILE_CRYPT_23, theFile: "SkeletonKingCrypt.png", sX: 96, sY: 32 },
        {tileType: TILE_CRYPT_24, theFile: "SkeletonKingCrypt.png", sX: 128, sY: 32 },
        {tileType: TILE_CRYPT_30, theFile: "SkeletonKingCrypt.png", sX: 0, sY: 64 },
        {tileType: TILE_CRYPT_31, theFile: "SkeletonKingCrypt.png", sX: 32, sY: 64 },
        {tileType: TILE_CRYPT_32, theFile: "SkeletonKingCrypt.png", sX: 64, sY: 64},
        {tileType: TILE_CRYPT_33, theFile: "SkeletonKingCrypt.png", sX: 96, sY: 64 },
        {tileType: TILE_CRYPT_34, theFile: "SkeletonKingCrypt.png", sX: 128, sY: 64 },
        {tileType: TILE_CRYPT_40, theFile: "SkeletonKingCrypt.png", sX: 0, sY: 96 },
        {tileType: TILE_CRYPT_41, theFile: "SkeletonKingCrypt.png", sX: 32, sY: 96 },
        {tileType: TILE_CRYPT_42, theFile: "SkeletonKingCrypt.png", sX: 64, sY: 96 },
        {tileType: TILE_CRYPT_43, theFile: "SkeletonKingCrypt.png", sX: 96, sY: 96 },
        {tileType: TILE_CRYPT_44, theFile: "SkeletonKingCrypt.png", sX: 128, sY: 96 },
        {tileType: TILE_CRYPT_50, theFile: "SkeletonKingCrypt.png", sX: 0, sY: 128 },
        {tileType: TILE_CRYPT_51, theFile: "SkeletonKingCrypt.png", sX: 32, sY: 128 },
        {tileType: TILE_CRYPT_52, theFile: "SkeletonKingCrypt.png", sX: 64, sY: 128 },
        {tileType: TILE_CRYPT_53, theFile: "SkeletonKingCrypt.png", sX: 96, sY: 128 },
        {tileType: TILE_CRYPT_54, theFile: "SkeletonKingCrypt.png", sX: 128, sY: 128 },



        // this is so NPCs have grass underneath them
        {tileType: TILE_NPC_ALCHEMIST, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_BLACKSMITH, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_OLD_MAN, theFile: "grass.png", sX: "0", sY: "32*2",options: 4},
        {tileType: TILE_NPC_CHEF, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_CHUCK, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_MICK, theFile: "grass.png", sX: "0", sY: "0", options: 4},
    ];
    
    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {
        const entry = imageList[i];

        if (entry.tileType !== undefined) {
            const sX = parseInt(entry.sX) || 0;
            const sY = parseInt(entry.sY) || 0;
            const sW = parseInt(entry.sW) || TILE_W;
            const sH = parseInt(entry.sH) || TILE_H;

            loadImageForRoomCode(entry.tileType, entry.theFile, sX, sY, sW, sH);
        } else {
            beginLoadingImage(entry.varName, entry.theFile);
        }
    }

}
