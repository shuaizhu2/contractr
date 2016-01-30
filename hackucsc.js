Jobs = new Mongo.Collection('jobs');
Users = new Mongo.Collection('users');

if (Meteor.isClient) {
  var MAP_ZOOM = 15;

  Meteor.startup(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
        Session.set('lat', position.coords.latitude);
        Session.set('lon', position.coords.longitude);
    });

    GoogleMaps.load();
  });

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.home.helpers({
    jobs: function(){
      var query = Session.get('lF');
      if (query){
        var re = new RegExp(query, 'i');
        console.log(re);
        var j = Jobs.find({'category': {$regex : re}});
      } else {
        console.log("miss");
        var j = Jobs.find({}).fetch();
      }
      
      for (var i=0; i<j.length; i++) {
        j[i].id = "Job" + i;
      }
      console.log(j);
      return j;
    }
  });

  Template.home.events({
    "click #createJobs": function(){
      Meteor.call("addJob", "Plumbing");
      Meteor.call("addJob", "Painting");
      Meteor.call("addJob", "Moving");
      Meteor.call("addJob", "Cleaning");
    },
    "click #openModal": function(){
      console.log("trigger");
      $('#modal1').openModal();
    },
    "submit #lookingFor": function(e){
      e.preventDefault();
      console.log("submit");
    },
    "keyup #lookingFor": function(){
      var lf = $('#lookingFor').val();
      console.log(lf);
      return Session.set('lF', lf);
    }
  });

  Template.home.rendered = function(){
    console.log("Home Rendered");
    $('#openModal').on('click', function() {
      console.log("trigger");
      $('#modal1').openModal();
    });
  };

  Template.map.helpers({  
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },
    mapOptions: function() {
      var latLng = Geolocation.latLng();
      // Initialize the map once we have the latLng.
      if (GoogleMaps.loaded() && latLng) {
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }
  });

  Template.map.onCreated(function() {  
    var self = this;

    GoogleMaps.ready('map', function(map) {
      var marker;

      // Create and move the marker when latLng changes.
      self.autorun(function() {
        var latLng = Geolocation.latLng();
        if (! latLng)
          return;

        // If the marker doesn't yet exist, create it.
        if (! marker) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
          });
        }
        // The marker already exists, so we'll just change its position.
        else {
          marker.setPosition(latLng);
        }

        // Center and zoom the map view onto the current position.
        map.instance.setCenter(marker.getPosition());
        map.instance.setZoom(MAP_ZOOM);
      });
    });
  });
}

Meteor.methods({
  //Individual Jobs, Times, description, contractor, contractee
  addJob: function(category) {
    Jobs.insert({
      category: category,
      called: 0,
      contractors: [],
      //query by tasks, avaliability and distance
      // tasks
    });
  }//,
  /*AddUser: function(name, type) {
    //i.e Shuai Zhu, Contractor
    //Simulated with paypal, etc.
    Users.insert({
      name: name,
      type: type,
      location: 
    });
  },*/
  //AddContractor: function()
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    /*Meteor.publish("jobs", function () {
      return Jobs.find({
      });
    });

    Meteor.publish("users", function () {
      return Users.find({
      });
    });
    // code to run on server at startup*/
  });
}
