var io = require('sails.io.js')( require('socket.io-client') ),
    assert = require('assert'),
    readline = require('readline'),
    suspend = require('suspend'),

    Helpers = require('./helpers.js'),
    helpers = new Helpers(),

    args = process.argv.slice(2),

    userName = args[0],
    channelName = 'general',
    channel,
    createChannel = false
    ;

if (args.length > 1) {
  channelName = args[1];
}

io.sails.url = "http://localhost:1337/";
helpers.url  = "http://localhost:1337/";

assert(userName, 'user name required');
assert(channelName, 'channel name required');

var printMessage = function(message) {
  console.log(String(message.poster) + ': ' + String(message.content));
};

var messageHandler = suspend.fn(function *(data) {
  if (data.id === channel.id && data.verb === 'addedTo' && data.attribute === 'messages') {
    // todo: not happy about the extra GET required here
    var message = yield helpers.get('message/' + String(data.addedId), suspend.resume());

    // quick hack to avoid talking to yourself,
    // but assumes unique userName. full user model w/ ID check
    // would also get around this - or altering socket room paradigm
    if (message.poster !== userName) {
      printMessage(message);
    }
  }
});

var handleInput = suspend.fn(function *(input) {
  if (input[0] === '/') { // escape sequences
    var split = input.split(' ');

    switch (split[0]) {
      case '/channels':
        var channels = yield helpers.get('channel', suspend.resume());
        console.log('Available Channels:');
        for (var i=0; i<channels.length; i++) {
          console.log(' ', channels[i].name);
        }
        break;
      case '/join':
        if (split.length !== 2) {
          console.log('/join requires exactly ONE argument')
          return;
        }

        var newChannel = split[1];
        channel = yield subscribeToChannel(newChannel, suspend.resume());
        yield loadMessages(suspend.resume());

        break;
      case '/help':
      default:
        console.log('Commands:');
        console.log('/help - display this message');
        console.log('/channels - display available channels');
        console.log('/join <channel> - join this new channel');
    }
  } else {
    var body = {
      'channel': channel.id,
      'content': input,
      'poster': userName
    };
    helpers.post('message', body, function() {}); // no need to yield and wait.
  }
});

var loadMessages = suspend.callback(function *() {
  var url = "message?channel=" + String(channel.id) + "&limit=10&sort=createdAt%20DESC";
  var messages = yield helpers.get(url, suspend.resume());

  messages.reverse();
  for (i=0; i<messages.length; i++) {
    printMessage(messages[i]);
  }

  return;
});

var subscribeToChannel = suspend.callback(function *(channelName) {
  // todo: this won't handle bad url chars very well
  var url = "channel?name=" + String(channelName);
  var existingChannels = yield helpers.get(url, suspend.resume());

  if (existingChannels.length > 1) {
    throw new Error("Multiple channel names");
  }

  var channel;
  if (existingChannels.length < 1) {
    channel = yield helpers.post('channel', {'name': channelName}, suspend.resume());
  } else {
    channel = existingChannels[0];
  }

  // subscribe to specific channel id
  yield io.socket.get('/channel/' + channel.id, suspend.resumeRaw());
  console.log('*** Subscribed to:', channelName);

  return channel;
})


io.socket.on('channel', messageHandler);

var main = suspend.fn(function *() {
  // these could be parallelized
  channel = yield subscribeToChannel(channelName, suspend.resume());

  yield loadMessages(suspend.resume());

  // begin the chat loop
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', handleInput);

});

main();
