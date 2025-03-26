var wizardPic = document.createElement("img");
var warriorPic = document.createElement("img");
var townMapPic = document.createElement("img");
var blacksmithShopPic = document.createElement("img");
var alchemistShopPic = document.createElement("img");
var pickUpItemPic = document.createElement("img");
var heartFullPic = document.createElement("img");
var heartHalfPic = document.createElement("img");
var heartEmptyPic = document.createElement("img");
var enemyPic = document.createElement("img"); // placeholder

//var titlepagePic = document.createElement("img");
var tilePics = [];

var picsToLoad = 0;

function countLoadedImagesAndLaunchIfReady(){
		picsToLoad--;
		console.log("finished downloading image #"+picsToLoad);
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
        {varName: blacksmithShopPic, theFile: "BlackSmithShop.png"},
        {varName: alchemistShopPic, theFile: "BlackSmithShop.png"},
        {varName: pickUpItemPic, theFile: "pickupItems.png"},
        {varName: heartFullPic, theFile: "fullHeart.png"},
        {varName: heartHalfPic, theFile: "halfHeart.png"},
        {varName: heartEmptyPic, theFile: "noHeart.png"},
        {varName: enemyPic, theFile: "Kobald.png"},

        {tileType: TILE_GRASS, theFile: "grass.png", sX: "0", sY: "0", options: 4},
        {tileType: TILE_WALL, theFile: "wall.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_ROAD, theFile: "road.png", sX: "0", sY: "0",options: 0},
        {tileType: TILE_FLOOR, theFile: "grass.png", sX: "0", sY: "32*2",options: 0},
        {tileType: TILE_TREE, theFile: "grass.png", sX: "0", sY: "32*2",options: 0}
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
