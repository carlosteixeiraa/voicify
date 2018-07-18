$.get("http://ip-api.com/json", (r) => {
    if(r.country == "Portugal") {
        pt();
    } else {
        en();
    }
});

$('#app').on('click', () => {
    $('.w-ins').fadeOut(600);
    $('.m-cont').delay(700).fadeIn(600);
    localStorage.setItem('welcomed', 'true');
});

$('#info').on('click', () => {
    $('.info-page').fadeIn(600);
});

$('.close').on('click', () => {
    $('.info-page').fadeOut(600);
});

var lang = {
    stopDown: "para",
    playDown: "toca",
    resumeDown: "continua"
}

var v_lang = 'pt-Br';

function pt() {
    $('.en').removeClass('active');
    $('.pt').addClass('active');
    $('.cen').fadeOut(300);
    $('.cpt').fadeIn(300);
    $('#cmd').text('Comandos');
    $('#htu').text('Como usar');
    $('#ih').text('Informações / Ajuda');
    $('#np').text('A TOCAR AGORA');
    $('#ten').fadeOut(300);
    $('#tpt').fadeIn(300);
    v_lang = 'pt_Br';
    lang = {
        stopDown: "para",
        playDown: "toca",
        resumeDown: "continua"
    }
    voicify.lang = v_lang;
}

function en() {
    $('.pt').removeClass('active');
    $('.en').addClass('active');
    $('.cpt').fadeOut(300);
    $('.cen').fadeIn(300);
    $('#cmd').text('Commands');
    $('#np').text('NOW PLAYING');
    $('#htu').text('How to use');
    $('#ih').text('Informations / Help');
    $('#tpt').fadeOut(300);
    $('#ten').fadeIn(300);
    v_lang = 'en-US';
    lang = {
        stopDown: "stop",
        playDown: "play",
        resumeDown: "resume"
    }
    voicify.lang = v_lang;
}

$('.pt').on('click', () => {
    pt();
});

$('.en').on('click', () => {
    en();
});

var welcomed = localStorage.getItem('welcomed');

if(welcomed == 'false') {
    $('.w-ins').css('display', 'block');
    $('.m-cont').css('display', 'none');
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}

var voicify = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
var result;
var words;

voicify.lang = v_lang;
voicify.interimResults = false;
voicify.maxAlternatives = 1;
voicify.start();

voicify.onresult = (event) => {

    result = event.results[0][0].transcript;
    words = result.split(' ');

    //console.log(result);

    if(words[0] == lang.stopDown) {
        $('#buttons').attr('src', 'media/play.svg');
        stop();
        play = false;

        status();
    }

    if(words[0] == lang.resumeDown) {
        $('#buttons').attr('src', 'media/stop.svg');
        resume();
        play = true;

        status();
    }

    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
    }

    if(words[0] == lang.playDown) {
        var resultWp = result.replace(lang.playDown, ' ');
        var link = "http://localhost:4000/api/search/" + resultWp;
        
        $.get(link, (data) => {
            status();
        });

        status();
    }

}

voicify.onend = () => {
  voicify.start();
}

function status() {  
    $.get("http://localhost:4000/api/status", (data) => {
        var song = data.song;
        $('#name').text(song);
        //console.log('updated - ' +  data.song);
    });
    
   //console.log('update');
    setTimeout(status, 3000);
}

status();

function stop() {
    $.get("http://localhost:4000/api/pause", (data) => {
        //console.log(data);
    });
    status();
}

function resume() {
    $.get("http://localhost:4000/api/resume", (data) => {
        //console.log(data);
    });
    status();
}


var play = true;

$('#buttons').on('click', () => {
    if(play == false) {
        $('#buttons').attr('src', 'media/stop.svg');
        resume();
        play = true;
    } else if (play == true) {
        $('#buttons').attr('src', 'media/play.svg');
        stop();
        play = false;
    }
});
