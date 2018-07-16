module.exports = () => {
    var express = require('express');
    var cors = require('cors');
    var setTitle = require('console-title');
    var colors = require('colors');
    var app = express();
    var port = 4000;
    var spotifyLc = require('spotify-local-control');
    var spotifyWa = require('spotify-web-api-node');
    var client = spotifyLc();

    setTitle('Voicify');

    var spotifyApi = new spotifyWa({
        clientId: '8301516442e24d0593e2dd39596d74fc',
        clientSecret: 'bbb26ab52725430c8f68e45c10a343df'
    });

    app.use(cors());

    function v_log(infoo) {
        console.log(' ');
        console.log(colors.green('Voicify - Command executed!'));
        console.log(infoo);
        console.log(' ');
    }

    app.get('/api/resume', (req, res) => {
        client.resume();
        res.send('Voicify API - Song resumed!');
        v_log('Song resumed.');
    });

    app.get('/api/pause', (req, res) => {
        client.pause();
        res.send('Voicify API - Song paused!');
        v_log('Song Paused.');
    });

    app.get('/api/search/:param', (req, res) => {

        var param = req.params.param;

        spotifyApi.searchTracks(param).then((data) => {
            client.play(data.body.tracks.items[0].uri);
            v_log('New song played.');
        }, (error) => {
        });

    });


    app.get('/api/status', (req, res) => {
        client.status().then((data) => {
            res.send({
                song: data.body.track.artist_resource.name + ' - ' + data.body.track.track_resource.name
            });    
        });
    });

    spotifyApi.clientCredentialsGrant().then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);

    }, (error) => {
    });

    app.listen(port, () => {
        console.log(' ');
        console.log(' ');
        console.log(' ');
        console.log(colors.green('Voicify running with sucess! go to https://carlosteixeira.xyz/voicify'));
        console.log(' ');
        console.log(' ');
        console.log(' ');
    });
}