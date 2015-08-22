var React = require('react');

// TODO - factor out navbar login form

// Hack Reactor = 37.783814 -122.4090624

var fakeData = [
{title: 'hello',lat:37.787814,lng:-122.4090624},
{title: 'baby',lat:37.780814,lng:-122.4120624},
{title: 'bye',lat:37.778814,lng:-122.4070624}
];

var Map = React.createClass({


    getInitialState: function(){
      return {
        
      };
    },

    loadMarkers: function(data,map){
      for (var i = 0; i < data.length; i++) {
        // Add a click handler to each marker to take it to the thread
        data[i].infoWindow = {
          content: '<div class="geoThread"><a href="#/thread/'+ data[i].thread_id +'">'+ data[i].title +'</a>' + '<p class="body">' + data[i].body + '</p>' + '<p>Rating: ' + data[i].rating + '</p>' + '<p>Posts: ' + data[i].post_count + '</p>' +'<p class="tag">'+ data[i].tag  + '</p></div>'
        }
        
        map.addMarker(data[i]);
      };
    },

    componentWillMount: function(){
      var mapOptions = {
          // How zoomed in you want the map to start at (always required)
          zoom: 2,

          // The latitude and longitude to center the map (always required)
          center: new google.maps.LatLng(30, 0), // New York

          // How you would like to style the map. 
          // This is where you would paste any style found on Snazzy Maps.
          styles: [ { "stylers":[ {"visibility":"on"},  {"saturation":-100},  {"gamma":0.54}  ] },{ "featureType":"road", "elementType":"labels.icon",  "stylers":[ {"visibility":"off"}  ] },{ "featureType":"water",  "stylers":[ {"color":"#4d4946"} ] },{ "featureType":"poi",  "elementType":"labels.icon",  "stylers":[ {"visibility":"off"}  ] },{ "featureType":"poi",  "elementType":"labels.text",  "stylers":[ {"visibility":"simplified"} ] },{ "featureType":"road", "elementType":"geometry.fill",  "stylers":[ {"color":"#ffffff"} ] },{ "featureType":"road.local", "elementType":"labels.text",  "stylers":[ {"visibility":"simplified"} ] },{ "featureType":"water",  "elementType":"labels.text.fill", "stylers":[ {"color":"#ffffff"} ] },{ "featureType":"transit.line", "elementType":"geometry", "stylers":[ {"gamma":0.48}  ] },{ "featureType":"transit.station",  "elementType":"labels.icon",  "stylers":[ {"visibility":"off"}  ] },{ "featureType":"road", "elementType":"geometry.stroke",  "stylers":[ {"gamma":7.18}  ] } ]
      };

        var that = this;
        setTimeout(function(){
            var map = new GMaps({
                  el: '#map',
                  options: mapOptions
            });

            GMaps.geolocate({
              success: function(position) {
                // map.setCenter(position.coords.latitude, position.coords.longitude);
                // console.log(position.coords.latitude,position.coords.longitude);

                // Load the current location marker
                // map.addMarker({title:'current', infoWindow: {content: '<p>Current Location</p>'}, lat:position.coords.latitude,lng: position.coords.longitude});
              },
              error: function(error) {
                alert('Geolocation failed: '+ error.message);
              },
              not_supported: function() {
                alert("Your browser does not support geolocation");
              },
              always: function() {
                console.log('now at current location');
              }
            });

            // Load the markers
            that.loadMarkers(that.props.threads,map);

        },1000);
    },

  render: function(){

    return (
      <div id="map">
        <img className="spinner" ref="spinner" src="/assets/spinner.gif"></img>
      </div>
    );
  }
});

module.exports = Map;
    
