var React = require('react');
var Modal = require('react-modal');
var AuthStore = require('../../stores/AuthStore');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var Map = React.createClass({

    getInitialState: function(){
      return {
        loggedIn: AuthStore.loggedIn(),
        modalIsOpen: false,
        page: 1,
        threads: [],
        lat: 0,
        lng: 0
      };
    },

    componentDidMount: function(){
      ThreadActions.fetchPage(this.state.page);
      AuthStore.addChangeListener(this._onChange);
      ThreadStore.addChangeListener(this._onChange);
    },

    componentWillMount: function(){
      this.loadMap();
    },

    componentWillUnmount: function(){
      AuthStore.removeChangeListener(this._onChange);
      ThreadStore.removeChangeListener(this._onChange);
    },

    _onChange: function(){
      this.setState({
        loggedIn: AuthStore.loggedIn(),
        threads: ThreadStore.getThreads().forumThreads
      });

      this.loadMap();
    },

    openModal: function(e,lat,lng) {
      if(e)e.preventDefault();
      this.setState({
        modalIsOpen: true,
        lat: lat,
        lng: lng
      });
    },

    closeModal: function(e) {
      if(e)e.preventDefault();
      this.setState({modalIsOpen: false});
    },

    addThread: function(e){
      e.preventDefault();
      // Send action to update user information
      var title = React.findDOMNode(this.refs.title).value.trim();
      var body = React.findDOMNode(this.refs.body).value.trim();
      var link = React.findDOMNode(this.refs.link).value.trim();
      var tag = React.findDOMNode(this.refs.tag).value.trim();
      var lat = React.findDOMNode(this.refs.lat).value.trim();
      var lng = React.findDOMNode(this.refs.lng).value.trim();

      if(!title || !body){
        return;
      }

      if(!lat || !lng){
        lat = parseFloat(0);
        lng = parseFloat(0);
      }

      ThreadActions.add({
        title: title,
        body: body,
        link: link,
        tag: tag,
        lat: lat,
        lng: lng
      });

      ThreadActions.fetchPage({page:1});
      this.closeModal();
    },

    loadMap: function(){
      var mapOptions = {
          // How zoomed in you want the map to start at (always required)
          zoom: 3,

          // The latitude and longitude to center the map (always required)
          center: new google.maps.LatLng(0, 0), // New York

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

          GMaps.on('click', map.map, function(event) {
              var index = map.markers.length;
              var lat = event.latLng.lat();
              var lng = event.latLng.lng();

              // Open a modal
              that.openModal(null,lat,lng);

              // On click save, create and save marker

              var template = $('#edit_marker_template').text();

              var content = template.replace(/{{index}}/g, index).replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);

              map.addMarker({
                lat: lat,
                lng: lng,
                title: 'Marker #' + index,
                infoWindow: {
                  content : content
                }
              });
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
          that.loadMarkers(that.state.threads,map);

          // Center the map first time
          map.setCenter(-60, 0);

      },1000);
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

    prevPage: function(e){
      e.preventDefault();
      if(this.state.page > 1){
        this.setState({
          page: this.state.page-1
        });
        ThreadActions.fetchPage({page:this.state.page-1});
      }
    },

    nextPage: function(e){
      e.preventDefault();
      if(this.state.page < 2){
        this.setState({
          page: this.state.page+1
        });
        ThreadActions.fetchPage({page:this.state.page+1});
      }
    },

  render: function(){

    return (
      <div>
      <div className="showLimit">
        <p>Showing top stories around the world.</p>
        <p>Click to see next page.</p>
        <div className="col-lg-12 centered">
          <a href="#" ref="left" className="glyphicon glyphicon-chevron-left" aria-hidden="true" onClick={this.prevPage}></a> 
          &nbsp;{this.state.page}&nbsp;
          <a href="#" ref="right" className="glyphicon glyphicon-chevron-right" aria-hidden="true" onClick={this.nextPage}></a>
        </div>
      </div>

      <div id="map">
        <img className="spinner" ref="spinner" src="/assets/spinner.gif"></img>
      </div>

      <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>

        {this.state.loggedIn ? (
          <div>
            <h3>Share a story</h3>
            <form>
              <button className="form-control close" onClick={this.closeModal}>X</button>
            </form>
              <div className="col-md-12 newThread">
                <form onSubmit={this.addThread}>
                  <input type="text" className="form-control" placeholder="Title" ref="title" />
                  <input type="text" className="form-control" placeholder="Link" ref="link" />
                  <input type="textarea" className="form-control" placeholder="Body" ref="body" />
                  <input type="text" className="form-control" placeholder="Tag" ref="tag" />
                  <input type="text" className="form-control" value={this.state.lat} ref="lat" />
                  <input type="text" className="form-control" value={this.state.lng} ref="lng" />
                  <button type="submit" className="btn btn-success" value="Submit">Submit</button>
                </form>
              </div>
          </div>
          ):(
          <div>
            <h3>Please log in to share stories</h3>
            <form>
              <button className="form-control close" onClick={this.closeModal}>X</button>
            </form>
          </div>
        )}


      </Modal>
      </div>
    );
  }
});

module.exports = Map;
    
