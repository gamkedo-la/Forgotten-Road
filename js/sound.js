var intro_voiceover_1 = new Audio("sound/forgotten-road-voiceover-1.mp3");
var intro_voiceover_2 = new Audio("sound/forgotten-road-voiceover-2.mp3");
var intro_voiceover_3 = new Audio("sound/forgotten-road-voiceover-3.mp3");
var intro_voiceover_4 = new Audio("sound/forgotten-road-voiceover-4.mp3");
var pickupSound = new Audio("sound/pickup.mp3");
var openChestSound = new Audio("sound/openChest.mp3");
var pickupCoinSound = new Audio("sound/pickupCoin.mp3");
var bossMusicSound = new Audio("sound/boss-prepare-to-be-destroyed-haha.mp3");
var bossHaHaHaHaSound = new Audio("sound/boss-hahahaha.mp3");
var bossChuckleSound = new Audio("sound/boss-chuckle.mp3");

var noStaminaSound = new Audio("sound/no-stamina.wav");
var raiseShieldSound = new Audio("sound/raise-shield.wav");
raiseShieldSound.volume = 0.2;
var blockSound = new Audio("sound/block.wav");
var staffAttackSound = new Audio("sound/attack-staff.wav");
var bowAttackSound = new Audio("sound/attack-bow.wav");
var playerDamagedSound = new Audio("sound/player-damaged.wav");
var playerDieSound = new Audio("sound/player-die.wav");
var playerHealSound = new Audio("sound/player-heal.wav");
var enemyDamagedSound = new Audio("sound/enemy-damaged.wav");
var enemyDieSound = new Audio("sound/enemy-die.wav");

const FOOTSTEP_VOLUME = 1;
var footstepSound = new Audio("sound/FootStepFaster.mp3");
footstepSound.loop = true;
footstepSound.volume = FOOTSTEP_VOLUME;

const MUSIC_VOLUME = 0.2;
var music = new Audio("sound/four-chords.mp3");
music.loop = true;
music.volume = MUSIC_VOLUME;

all_sounds = [
    intro_voiceover_1,
    intro_voiceover_2,
    intro_voiceover_3,
    intro_voiceover_4,
    music,
    pickupSound,
    bossMusicSound,
    bossHaHaHaHaSound,
    bossChuckleSound,
    footstepSound,
]

function muteAllSounds() {
    all_sounds.forEach(element => {
        element.volume = 0;
    });
}

function unmuteAllSounds() {
    all_sounds.forEach(element => {
        element.volume = 1.0; // FIXME: remember previous volume
    });
    music.volume = MUSIC_VOLUME;
}
