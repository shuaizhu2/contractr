Jobs = new Mongo.Collection('jobs');
Users = new Mongo.Collection('users');

if (Meteor.isClient) {
  var MAP_ZOOM = 15;

  Meteor.startup(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        Session.set('lat', position.coords.latitude);
        Session.set('lon', position.coords.longitude);
    });

    GoogleMaps.load();
  });

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.homeA.helpers({
    jobs: function(){
      var query = Session.get('lF');
      if (query){
        var re = new RegExp(query, 'i');
        var j = Jobs.find({'category': {$regex : re}});
      } else {
        var j = Jobs.find({}).fetch();
      }
      
      /*for (var i=0; i<j.length; i++) {
        j[i].id = "Job" + i;
      }*/
      return j;
    }
  });

  Template.nav.events({
    "click #createJobs": function(){
      Meteor.call("addJob", "Plumbing");
      Meteor.call("addJob", "Painting");
      Meteor.call("addJob", "Moving");
      Meteor.call("addJob", "Cleaning");
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

  Template.nav.rendered = function(){
  };

  Template.homeA.events({
    "click .openModal": function(e){
      var i = e.toElement.id;
      //console.log("trigger");
      $('#modal1').openModal();
      //Jobs.find({});
      $("#jobHeader").text(i);  

      //var map = Session.get('map');
      /*var myLatLng = {lat: -37.0005, lng: -122.059};
      var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!'
      });*/
    }
  })

  Template.homeA.rendered = function(){
    console.log("Home Rendered");
    /*$('#openModal').on('click', function() {
      console.log("trigger");
      $('#modal1').openModal();
    });*/
  };

  Template.map.helpers({  
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

  //Template.map.onCreated(function() { 
  Template.map.rendered = function() {
    console.log("Map Rendered");
    GoogleMaps.ready('map', function(map) {
      console.log("Google Maps Loaded");
      var gMap = GoogleMaps.maps.map.instance;
      var latLng = Geolocation.latLng();

      //gMap.event.trigger(map, "resize");
      gMap.panTo(latLng);

      var cLat = ["36.989856","36.994004","36.9923139","36.999589","36.999657","36.982844"];
      var cLon = ["-122.065964","-122.065835","-122.05","-122.055332","-122.062950","-122.060868"];
      var pl = [0,2,3];
      var cl = [1,4,5];
      var test = [0,1,2,3,4,5];

      var image2 = {
        url: 'http://i.imgur.com/irtXqys.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0,0) // anchor
      };

      var image1 = {
        url: 'http://icons.iconseeker.com/png/fullsize/fruity-apples/seablue-512.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0,0) // anchor
      };

      var home = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat, latLng.lng),
        map: map.instance,
        image: image1
      });

      var markers = [];

      $(".openModal").click(function(e){

        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        console.log(e.toElement.id);
        var tag = e.toElement.id;

        if (tag == "Plumbing") {
          var lo = pl;
        } else {
          var lo = cl;
        }

        for (var i=0; i<3; i++){
            //var lo = test;
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(cLat[lo[i]], cLon[lo[i]]),
            map: map.instance,
            image: image2
          });
          markers.push(marker);
        }
      });
    });
  };
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
