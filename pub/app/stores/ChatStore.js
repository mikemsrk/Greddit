var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var clientSocket = {
  connect: function(targetId){
    conn = new WebSocket("ws://"+window.location.host+"/chat/");
    setTimeout(function(){conn.send('cp:'); conn.send('np:');},2000);
    /*----------------
      Event Listening
    -----------------*/
    conn.onmessage = function(evt) {
      var eventName = evt.data.split(":")[0];
      var data = JSON.parse(evt.data.substring(eventName.length+1));

    // On receiving global message
      if(eventName === 'sgm'){
        clientSocket.onGlobalMessage(data);
      }
    // On receiving direct message
      if(eventName === 'sdm'){
        clientSocket.onDirectMessage(data);
      }

    };
  },

  /*-----------------

    Send Messages

  ------------------*/
  // Global Message
  sendGlobalMessage: function(data){
    conn.send('sgm:'+ data);
  },
  // Direct Message
  sendDirectMessage: function(userId,data){
    conn.send('sdm:'+ userId + ':' + data);
  },

  /*-----------------

    Receive Messages

  ------------------*/

  // On receiving global messages
  onGlobalMessage: function(data){
    ChatStore.receive(data);
  },

  // On receiving direct messages
  onDirectMessage: function(data){
    ChatStore.receiveDM(data);
  }

};

var _messages = [];
var _directMsgs = [];
var _dmStatus = {};
var _error = null;

var ChatStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(CHANGE_EVENT);
   },

  getMessages: function(){
    return _messages;
  },

  getDirectMessages: function(){
    return _directMsgs;
  },

  getReceived: function(){
    return _dmStatus;
  },

  error: function(){
    return _error;
  },

  connect: function(msg){
    clientSocket.connect();
  },

  send: function(msg){
    clientSocket.sendGlobalMessage(msg);
  },

  sendDM: function(id, msg){
    clientSocket.sendDirectMessage(id, msg);
  },

  receive: function(data){
    _messages.push(data);

    if(_messages.length > 9){
      _messages.shift();
    }

    this.emitChange();
  },

  receiveDM: function(data){
    _directMsgs.push(data);

    if(_directMsgs.length > 9){
      _directMsgs.shift();
    }
    _dmStatus.msgReceived = true;
    _dmStatus.from = data.id;
    this.emitChange();
  },

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});


AppDispatcher.register(function(payload){
  var action = payload.action;

  switch(action.actionType){
    case ChatConstants.SEND:
      ChatStore.send(action.data.message);
      ChatStore.emitChange();
      break;
    case ChatConstants.SENDDM:
      ChatStore.sendDM(action.data.userId, action.data.message);
      ChatStore.emitChange();
      break;
    case ChatConstants.RECEIVE:
      ChatStore.emitChange();
      break;
    case ChatConstants.CONNECT:
      ChatStore.connect();
      ChatStore.emitChange();
      break;
    default:
      return true;
  }

  ChatStore.emitChange();
  return true;
});

module.exports = ChatStore;