$('#app').on('click', () => {
    $('.w-ins').fadeOut(600);
    $('.m-cont').delay(700).fadeIn(600);
    localStorage.setItem('welcomed', 'true');
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

voicify.lang = 'pt-Br';
voicify.interimResults = false;
voicify.maxAlternatives = 1;
voicify.start();

voicify.onresult = (event) => {

    result = event.results[0][0].transcript;
    words = result.split(' ');

    //console.log(result);

    if(words[0] == "para" || words[0] == "Para") {

        $('#buttons').attr('src', 'media/play.svg');
        stop();
        play = false;

        status();
    }

    if(words[0] == "continua" || words[0] == "Continua") {
        
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

    if(words[0] == "toca" || words[0] == "Toca" || words[0] == "toque") {
        var resultWp = result.replace('toca', ' ');
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
    
    console.log('update');
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
