var React = require('react');
var Chat = require('./sidebar-chat');
var ChatActions = require('../../actions/ChatActions');
var ChatStore = require('../../stores/ChatStore');
var AuthStore = require('../../stores/AuthStore');
var rd3 = require('react-d3');
var PieChart = rd3.PieChart;
var Treemap = rd3.Treemap;

var Router = require('react-router');

var getTrending = function(callback) {
  $.ajax({
    type: 'GET',
    url: '/trending/',
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });

};

var Sidebar = React.createClass({

    mixins : [Router.Navigation],

    getInitialState: function(){
      return {
        from: "",
        messages: [],
        data : [],
        loggedIn: AuthStore.loggedIn()
      };
    },

    loadTrending: function(){
      var that = this;

      getTrending(function(data){
        var array = [];
        var total = 0;
        for (var i = 0; i < data.topics.length; i++) {
          total += data.topics[i].count;
        };
        for (var i = 0; i < data.topics.length; i++) {
          var obj = data.topics[i];
          array.push({label: obj.tag, value: Math.round((obj.count/total)*100)});
        };
        that.setState({
          data:array
        });
      });
    },

    componentDidMount: function(){
      AuthStore.addChangeListener(this._onAuthChange);
      ChatStore.addChangeListener(this._onChange);
      this.loadTrending();
      $("#menu-toggle").click(function(e) {
          e.preventDefault();
          $("#wrapper").toggleClass("toggled");
      });
    },

    componentWillUnmount: function(){
      AuthStore.removeChangeListener(this._onAuthChange);
      ChatStore.removeChangeListener(this._onChange);
    },

    _onChange: function(){
        this.setState({
          messages: ChatStore.getMessages()
        });  
    },

    _onAuthChange: function(){
      this.setState({
        from: AuthStore.getUser().username,
        loggedIn: AuthStore.loggedIn()
      });
      if(AuthStore.loggedIn()){
        this.joinChat(); // On Auth change, if user logs in then connect to chat server.
      }
    },

    joinChat: function(){
      ChatActions.connect();
    },

    sendMessage: function(msg){
      ChatActions.send({message:msg});
    },

    toFront: function(e){
      e.preventDefault();
      this.transitionTo("front");
    },

    render: function(){
      return (
        <ul className="sidebar-nav">
            <li><h1>Welcome!</h1></li>
            <li>
                <h2>Trending</h2>
                <PieChart
                  data={this.state.data}
                  width={220}
                  height={200}
                  radius={40}
                  innerRadius={0}/>
            </li>
            {this.state.loggedIn ? (
              <li>
                  <h2>Chat (global)</h2>
              </li>
              ):(
              <p>Please log in to use chat.</p>
              )
            }
            {this.state.loggedIn ? (
            <Chat messages={this.state.messages} user={this.state.from} onSend={this.sendMessage} onChat={this.joinChat} />
              ):(
              null
              )
            }
        </ul>
      );
  }
});

module.exports = Sidebar;
