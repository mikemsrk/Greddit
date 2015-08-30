var React = require('react');
var Router = require('react-router');

var Navbar = require('./components/navbar/navbar');
var Sidebar = require('./components/sidebar/sidebar');
var Profile = require('./components/profile/profile');
var Front = require('./components/front/front');
var Login = require('./components/login/login');
var Inbox = require('./components/inbox/inbox');
var Logout = require('./components/logout/logout');
var Signup = require('./components/signup/signup');
var NewThread = require('./components/thread/new');
var Thread = require('./components/thread/thread');
var User = require('./components/user/user');
var Geo = require('./components/geo/geo')

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
var Link = Router.Link;

var App = React.createClass({
  
  render: function(){
    return (
      <div className="container-fluid">
        <Navbar/>
          <div id="wrapper" className="toggled">
            <div id="sidebar-wrapper">
              <Sidebar/>
            </div>
            <div id="page-content-wrapper">
              <RouteHandler/>
            </div>
          </div>
      </div>
    );
  }
});

// TODO: Fix Geo and Front handler names.
var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Geo}/>
    <Route name="front" path="front" handler={Geo}/>
    <Route name="threads" path="threads" handler={Front}/>
    <Route path="profile" handler={Profile}/>
    <Route path="inbox" handler={Inbox}/>
    <Route name="login" path="login" handler={Login}/>
    <Route path="logout" handler={Logout}/>
    <Route path="signup" handler={Signup}/>
    <Route path="new" handler={NewThread}/>
    <Route path="thread/:id" handler={Thread}/>
    <Route path="user/:id" handler={User}/>
  </Route>
);

	
module.exports = App;

var reactApp = $('#app');

$('#app').hide();

// Button On click - render app and hide landing div.
$('#goApp').on('click',function(){
    $('body').html('');
    $('body').removeAttr('id');
    $('body').removeAttr('data-spy');
    $('body').removeAttr('data-target');

    $('body').append(reactApp);
    $('#app').show();
    $('head').append('<link rel="stylesheet" href="main.css"/>');
    $("html, body").animate({scrollTop: 0}, 500);

    Router.run(routes, Router.HashLocation, function(Root){
      React.render(
        <Root locales={['en-US']}/>,
        document.getElementById('app')
      );
    });
    
});
