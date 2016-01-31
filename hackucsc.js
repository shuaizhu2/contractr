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
    "submit #lookingFor": function(e){
      e.preventDefault();
      console.log("submit");
    },
    "keyup #lookingFor": function(){
      var lf = $('#lookingFor').val();
      console.log(lf);
      return Session.set('lF', lf);
    }/*,
    "click #cAgree": function(){
      //console.log("hey");
      Materialize.toast('I am a toast!', 4000);
    },*/
  });

  Template.nav.rendered = function(){
  };

  Template.homeA.events({
    "click #createJobs": function(){
      Meteor.call("resetJobs");
      Meteor.call("addJob", "Plumbing");
      Meteor.call("addJob", "Electrician");
      Meteor.call("addJob", "Babysitter");
      Meteor.call("addJob", "Carpenter");
      Meteor.call("addJob", "Gardener");
      Meteor.call("addJob", "Handyman");
      Meteor.call("addJob", "Locksmith");
    },
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
      if (i == "Plumbing") {
        $("#cName").text("Matt Roberts");
        $("#cPrice").text("$55 / Hour");
        $("#cIcon").attr("src", "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/6/005/043/37f/075a63b.jpg");
      } else if (i == "Babysitter") {
        $("#cName").text("Julie Shirley");
        $("#cPrice").text("$30 / Hour");
        $("#cIcon").attr("src", "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAQhAAAAJGFiYzNlNTM2LWUyZTgtNDY0My05NmE2LTUzYTA1MTdhZTUzYw.jpg");
      } else {
        $("#cName").text("Ishan Goyal");
        $("#cPrice").text("$20 / Hour");
        $("#cIcon").attr("src", "https://media.licdn.com/mpr/mpr/shrink_200_200/p/7/005/0b8/1cc/09521b2.jpg");
      }

          //https://media.licdn.com/media/AAEAAQAAAAAAAANMAAAAJDU2ZDE1MzQwLWE3OWUtNDk2MC05NjQ2LTQ5YjA4Y2RmMDA4Zg.jpg
      
      setTimeout(function(){
          //do what you need here
          console.log("hey");
          google.maps.event.trigger(GoogleMaps.maps.map.instance, "resize");
        }, 500);
      }
  })

  Template.homeA.rendered = function(){
    console.log("Home Rendered");
    $('#cAgree').on('click', function() {
      var name = $("#cName").text();
      var strung = name + " has accepted the job";
      Materialize.toast(strung, 4000);
    });
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

  var markers = [];

  //Template.map.onCreated(function() { 
  Template.map.rendered = function() {
    console.log("Map Rendered");
    GoogleMaps.ready('map', function(map) {
      console.log("Google Maps Loaded");
      var gMap = GoogleMaps.maps.map.instance;
      var latLng = Geolocation.latLng();

      //gMap.event.trigger(map, "resize");
      gMap.panTo(latLng);

      //"36.999657" "-122.062950"
      var cLat = ["36.989856","36.994004","36.9923139","36.999589","36.982844"];
      var cLon = ["-122.065964","-122.065835","-122.05","-122.055332","-122.060868"];
      /*var pl = [0,2,3];
      var cl = [1,4,5];
      var test = [0,1,2,3,4,5];*/

      var image2 = {
        url: 'http://i.imgur.com/irtXqys.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0,0) // anchor
      };

      var home = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat, latLng.lng),
        map: map.instance
      });

      $(".openModal").click(function(e){
        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        console.log(e.toElement.id);
        var tag = e.toElement.id;

        var i = Math.floor((Math.random() * 4));
        console.log(i);
        //for (var i=0; i<3; i++){
            //var lo = test;
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(cLat[i], cLon[i]),
            map: map.instance,
            icon: image2
          });
          markers.push(marker);
        //}

        /*marker.addListener('click', function() {
          console.log("hey");
          
        });*/

      }); 
    });
  };
}

Meteor.methods({
  //Individual Jobs, Times, description, contractor, contractee
  resetJobs: function(){
    Jobs.remove({});
  },
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
