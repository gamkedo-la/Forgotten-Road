var intro_voiceover_1 = new Audio("sound/forgotten-road-voiceover-1.mp3");
var intro_voiceover_2 = new Audio("sound/forgotten-road-voiceover-2.mp3");
var intro_voiceover_3 = new Audio("sound/forgotten-road-voiceover-3.mp3");
var intro_voiceover_4 = new Audio("sound/forgotten-road-voiceover-4.mp3");
var pickupSound = new Audio("sound/pickup.mp3");
var openChestSound = new Audio("sound/openChest.mp3");
var pickupCoinSound = new Audio("sound/pickupCoin.mp3");

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
    pickupSound
]

function muteAllSounds() {
    all_sounds.forEach(element => {
        element.volume = 0;
    });
}

function unmuteAllSounds() {
    all_sounds.forEach(element => {
        element.volume = 1.0;
    });
    music.volume = MUSIC_VOLUME;
}
