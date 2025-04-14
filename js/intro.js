var current_intro_text = "";
var current_intro_fade = 1;
var current_intro_fadespeed = 0.0005;
var voiceover_script = [
    "For generations, the town of Falldale has stood as a quiet beacon of peace — a forgotten place,\nhidden deep within the woods of Dark Winter. Nestled among towering trees and the\ncrumbling bones of ancient ruins, it endures in silence. Its people live simple lives:\nfarming, forging, trading… and sharing half-believed tales passed down from the ancients.",
    // I forgot to record this line of voiceover! oops!
    // "They speak in hushed tones of a cursed forest, where treasure hunters vanish without a trace\nand strange lights drift between the trees. Of catacombs buried beneath cobbled streets,\nsealed long ago by ancestors who feared what they could not destroy. And of\nThe Eye Below — a name spoken only by torchlight, whispered like a prayer… or a warning.",
    "You are no hero. Or are you? To most, you’re just a traveler — staff in hand, crossbow slung\nat your side. Drawn here by rumors of gold, glory, or perhaps something deeper.\nYou wield no magic. You rely on grit, simple weapons, and your own stubborn will.\nIn Falldale, that might be enough… or it might not be.",
    "The townsfolk watch you closely. Some with hope. Others, with unease. They’ve seen the signs:\nGoblins, creeping from the woods beneath the moonlight. Skeletons, clawing from\nforgotten graves. And far beneath their feet, something ancient stirs.",
    "Your choices will shape the fate of Falldale."
];

function intro_text(str) {
    //console.log("intro text: "+str);
    current_intro_text = str;
    current_intro_fade = 1;
}

function intro1() {
    console.log("intro part 1");
    intro_voiceover_1.play();
    intro_text(voiceover_script[0]);
}

function intro2() {
    console.log("intro part 2");
    intro_voiceover_2.play();
    intro_text(voiceover_script[1]);
}

function intro3() {
    console.log("intro part 3");
    intro_voiceover_3.play();
    intro_text(voiceover_script[2]);
}

function intro4() {
    console.log("intro part 4");
    intro_voiceover_4.play();
    intro_text(voiceover_script[3]);
}

function drawIntroText() {
    if (current_intro_fade > 0) {
        //console.log("INTRO!");
        current_intro_fade -= current_intro_fadespeed;
        // split multiple lines
        var arr = current_intro_text.split("\n");
        for (let line=0; line<arr.length; line++) {
            // var fadedoutRGBA= "rgba(255,255,255,"+current_intro_fade+")"
            drawTextWithShadow(arr[line], 400, 610+(line*20)-((1-current_intro_fade)*120),"white","14px Arial","center");
        }
    }
}


function startIntro() {
    console.log("playing music and queueing up intro voiceovers");
    music.play();
    var delay = 4000;
    setTimeout(() => intro1(), delay);
    setTimeout(() => intro2(), delay + 26000);
    setTimeout(() => intro3(), delay + 46000);
    setTimeout(() => intro4(), delay + 63000);
}
