var io = require('sails.io.js')( require('socket.io-client') ),
    Client = require('node-rest-client').Client,
    client = new Client(),
    assert = require('assert'),
    readline = require('readline'),
    suspend = require('suspend'),

    args = process.argv.slice(2),

    userName = args[0],
    channelName = args[1],
    channel,
    createChannel = false
    ;

io.sails.url = "http://localhost:1337/";

assert(userName, 'user name required');
assert(channelName, 'channel name required');

var printMessage = function(message) {
  console.log(String(message.poster) + ': ' + String(message.content));
};

var messageHandler = suspend.fn(function *(data) {
  if (data.verb === 'addedTo' && data.attribute === 'messages') {
    // todo: not happy about the extra GET required here
    var url = "http://localhost:1337/message/" + data.addedId;
    var rawMessage = yield client.get(url, suspend.resumeRaw());
    var message = rawMessage[0];
    // quick hack to avoid talking to yourself,
    // but assumes unique userName. full user model w/ ID check
    // would also get around this - or altering socket room paradigm
    if (message.poster !== userName) {
      printMessage(message);
    }
  }
});

var postMessage = suspend.fn(function *(input) {
  var url = "http://localhost:1337/message/";
  var postargs = { data: {
    'channel': channel.id,
    'content': input,
    'poster': userName
  }};
  yield client.post(url, postargs, suspend.resumeRaw());
});

var loadMessages = suspend.fn(function *() {
  // get most recent messages
  var url = "http://localhost:1337/message?channel=" + String(channel.id) + "&limit=30&sort=createdAt%20DESC";
  var data = yield client.get(url, suspend.resumeRaw());
  var messages = data[0];

  messages.reverse();
  for (i=0; i<messages.length; i++) {
    printMessage(messages[i]);
  }
});

io.socket.on('channel', messageHandler);

var main = suspend.fn(function *() {
  // todo: this won't handle bad url chars very well
  var url = "http://localhost:1337/channel?name=" + String(channelName);

  // this lib doesn't follows node callback scheme, and
  // returns data instead of err, data. use resumeRaw
  var data = yield client.get(url, suspend.resumeRaw());
  existingChannels = data[0];

  if (existingChannels > 1) {
    throw new Error("Multiple channel names");
  }

  if (existingChannels.length < 1) {
    console.log('creating channel:', channelName);
    var url = "http://localhost:1337/channel";
    var postargs = { data: {'name': channelName} };
    var data = yield client.post(url, postargs, suspend.resumeRaw());
    channel = data[0];
  } else {
    channel = existingChannels[0];
  }

  // subscribe to specific channel id
  yield io.socket.get('/channel/' + channel.id, suspend.resumeRaw());
  console.log('subscribed to:', channelName, channel.id);

  loadMessages();

  // begin the chat loop
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', postMessage);

});

main();
