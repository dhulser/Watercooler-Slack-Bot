/**
 * A Bot for Slack!
 */

/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});





/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!
controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});


const botAPI = controller.spawn({
  token: token,
  retry: 'Infinity'
})

var schedule = require('node-schedule');

var request = require('request');

var j = schedule.scheduleJob(' */1 * * * * ', function () {
    var chosen_message;
        
request.post(
    'https://engine.adzerk.net/api/v2',
    { json: { placements: [ { divName: "div1", networkId: 9820, siteId: 687249, adTypes: [20] } ] } },
    function (error, response, body) {
        
      if (error)
        console.log("Error:", error);
      else if (response.statusCode !== 200) {
        console.log("Expected status 200, got", response.statusCode);
	  }
      else
        console.log("OK:", JSON.stringify(body, null, 2));
        chosen_message = response.body.decisions.div1.contents[0].data.customData.chosen_message

        impression = response.body.decisions.div1.impressionUrl
  request(impression, function (error, response, body) {
      if (!error && response.statusCode == 200) {  }
      
    }
)
  
botAPI.startRTM((err, bot, payload) => {  
            bot.say({text: chosen_message, channel:"C033UHJ0S"}) 
            
              setTimeout(function(){console.log('hihihi')}, 500)

  request.post(
    'https://slack.com/api/channels.history?channel=C033UHJ0S&pretty=1&token=' + process.env.TOKEN,
        function (error, response, body) {
    if (error)
        console.log("Error:", error)
    else
        var time = JSON.parse(response.body)
        var timestamp = time.messages[0].ts
        console.log(timestamp)
          
            bot.api.reactions.add({
                 timestamp: timestamp,
                 channel: "C033UHJ0S",
                 name: 'thumbsup'})
            bot.api.reactions.add({
                 timestamp: timestamp,
                 channel: "C033UHJ0S",
                 name: 'thumbsdown'})                
})
        
}
                            )
})
})
        ;
      


