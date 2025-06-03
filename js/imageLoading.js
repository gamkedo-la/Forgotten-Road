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

function loadImageForRoomCode(tileCode, fileName)  {
	tilePics[tileCode] = document.createElement("img");
	beginLoadingImage(tilePics[tileCode], fileName);	
}

function loadImages() {	
    var imageList = [
        {varName: townMapPic, theFile: "townMap.png"},
        {varName: wizardPic, theFile: "wizard.png"},
        {varName: warriorPic, theFile: "warrior.png"},
        {varName: portraitPic, theFile: "PlayerPotrait.png"},
        {varName: goblinPic, theFile: "goblin.png"},
        {varName: koboldPic, theFile: "Kobald.png"},
        {varName: skeletonPic, theFile: "skeleton.png"},
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

        {tileType: TILE_GRASS, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_CRYPT_GATE, theFile: "cryptGate.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_FENCE, theFile: "fence.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_GRAVES, theFile: "graves.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_WALL, theFile: "wall.png", sX: "32", sY: "0",options: 0},
        {tileType: TILE_ROAD, theFile: "road.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_FLOOR, theFile: "grass.png", sX: "0", sY: "32*2",options: 0},
        {tileType: TILE_TREE, theFile: "tree.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_TREE2, theFile: "grass.png", sX: 0, sY: 160, sW: 64, sH: 64, options: 0},
        {tileType: TILE_LAMP, theFile: "lamp.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_WATER, theFile: "water.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_CLIFF, theFile: "cliff.png", sX: "64", sY: "96",options: 0},
        {tileType: TILE_PRESSURE_PLATE, theFile: "grass.png", sX: "96", sY: "128",options: 0},
        {tileType: TILE_DIRT, theFile: "dirt.png", sX: "32", sY: "32",options: 0},

        // this is so NPCs have grass underneath them
        {tileType: TILE_NPC_ALCHEMIST, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_BLACKSMITH, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_OLD_MAN, theFile: "grass.png", sX: "0", sY: "32*2",options: 4},
        {tileType: TILE_NPC_CHEF, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_CHUCK, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_NPC_MICK, theFile: "grass.png", sX: "0", sY: "0", options: 4},
    ];
    
    picsToLoad = imageList.length;

    for(var i = 0; i < imageList.length; i++) {
        if(imageList[i].tileType !== undefined) {
            loadImageForRoomCode(imageList[i].tileType, imageList[i].theFile);
        } else {
            beginLoadingImage(imageList[i].varName, imageList[i].theFile);
        }
    }
}
