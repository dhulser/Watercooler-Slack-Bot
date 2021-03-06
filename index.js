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

var date = new Date()
console.log('------timestamp-----' + date.toLocaleTimeString());

var schedule = require('node-schedule');
var request = require('request');


controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});


const botAPI = controller.spawn({
  token: token,
  retry: 'Infinity'
})

controller.hears(['give me a question','question','give us a question'], 'direct_mention,mention', function(bot, message){
    
    request.post(
    'https://engine.adzerk.net/api/v2',
    { json: { 
        placements: [ 
                {divName: "div1", networkId: 9820, siteId: 687249, adTypes: [20] }
                    ],
        user: {key: "ue1-8237b4ed067542f65438ad0e2556de45"}
            }
    },
    
    function (error, response, body) {
        
      if (error)
        console.log("Error:", error);
      else if (response.statusCode !== 200) {
        console.log("Expected status 200, got", response.statusCode);
	  }
      else
        console.log("OK:", JSON.stringify(body, null, 2));
        chosen_message = response.body.decisions.div1.contents[0].data.customData.chosen_message
        bot.say({text: chosen_message, channel:"C3P05V49W"}) 


        impression = response.body.decisions.div1.impressionUrl
            request(impression, function (error, response, body) {
            if (!error && response.statusCode == 200) {  }
                                                                 }
                    ) 
            
            request.post(
    'https://slack.com/api/channels.history?channel=C3P05V49W&pretty=1&token=' + process.env.TOKEN,
        function (error, response, body) {
    if (error)
        console.log("Error:", error)
    else
        var time = JSON.parse(response.body)
        var timestamp = time.messages[0].ts

            bot.api.reactions.add({
                 timestamp: timestamp,
                 channel: "C3P05V49W",
                 name: 'thumbsup'});
            setTimeout(function(){
                bot.api.reactions.add({
                         timestamp: timestamp,
                         channel: "C3P05V49W",
                         name: 'thumbsdown'})  
                                }, 250);
                  });
            
            
            
});
});


    var j = schedule.scheduleJob(' */1 9-14 * * 1-5 ', function () {
    
    var chosen_message;
    
    controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});


const botAPI = controller.spawn({
  token: token,
  retry: 'Infinity'
})
        
request.post(         //Find the time the last message was posted, set to lastmessagedelay
    'https://slack.com/api/channels.history?channel=C3P05V49W&pretty=1&count=1&token=' + process.env.TOKEN,
        function (error, response, body) {
    if (error)
        console.log("Error:", error)
    else
        var time = JSON.parse(response.body);
        var timestamp = time.messages[0].ts     // find Slack timestamp
        var milliseconds = (new Date).getTime(); // find epoch timestamp
        var currenttime = (milliseconds/1000) // convert epoch to seconds
        var lastmessagedelay = currenttime-timestamp; // calculate time since last message
        var timetowait = 3600
        var postmessage = (lastmessagedelay > timetowait) ? "Post":"Dont Post";

            console.log('----currenttime-------->'+ currenttime)
            console.log('----slacktimestamp----->'+ timestamp)
            console.log('-----seconds since last message-------->'+ lastmessagedelay)
            console.log('-----time to wait-------->' + timetowait)
            console.log('-----lastmessagedelay - time to wait -------->' + lastmessagedelay-timetowait)
            console.log('----TF-------' + postmessage)

if (postmessage == "Post"){
    console.log(`---------test passes -------`)
    
request.post(
    'https://engine.adzerk.net/api/v2',
    { json: { 
        placements: [ 
                {divName: "div1", networkId: 9820, siteId: 687249, adTypes: [20] }
                    ],
        user: {key: "ue1-d1f00b07c1a84fe880efa9232dc2296e"}
            }
    },
    
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
  
  controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});


const botAPI = controller.spawn({
  token: token,
  retry: 'Infinity'
})

            botAPI.startRTM((err, bot, payload) => {  
            bot.say({text: chosen_message, channel:"C3P05V49W"}) 
            setTimeout(function(){console.log('hihihi')}, 500)

  request.post(
    'https://slack.com/api/channels.history?channel=C3P05V49W&pretty=1&token=' + process.env.TOKEN,
        function (error, response, body) {
    if (error)
        console.log("Error:", error)
    else
        var time = JSON.parse(response.body)
        var timestamp = time.messages[0].ts

            bot.api.reactions.add({
                 timestamp: timestamp,
                 channel: "C3P05V49W",
                 name: 'thumbsup'})
            setTimeout(function(){
                bot.api.reactions.add({
                         timestamp: timestamp,
                         channel: "C3P05V49W",
                         name: 'thumbsdown'})  
                                }, 250)
                  })
  
  })
  
            })
            
    }})
});
