angular.module('app', ['ionic', 'uiGmapgoogle-maps', 'ng-cordova', 'ngMaterial'])



    //.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
    //    $scope.close = function() {
    //        $mdSidenav('right').close()
    //            .then(function(){
    //                $log.debug("close RIGHT is done");
    //            });
    //    };
    //})
    //





    .controller('controller1', function ($scope, $http, $location, $ionicLoading, $log, $mdSidenav) {

        //$scope.toggleRight = function() {
        //    $mdSidenav('right').toggle()
        //};


        //function ContentController($scope, $ionicSideMenuDelegate) {
        //    $scope.toggleLeft = function() {
        //        $ionicSideMenuDelegate.toggleLeft();
        //    };
        //}

    $scope.form1 = {};



    var onSuccess = function (position) {
      //alert('Latitude: ' + position.coords.latitude + '\n' +
      //'Longitude: ' + position.coords.longitude + '\n' +
      //'Altitude: ' + position.coords.altitude + '\n' +
      //'Accuracy: ' + position.coords.accuracy + '\n' +
      //'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
      //'Heading: ' + position.coords.heading + '\n' +
      //'Speed: ' + position.coords.speed + '\n' +
      //'Timestamp: ' + position.timestamp + '\n');

      $scope.form1.zipBox=position.coords.latitude + ',' + position.coords.longitude;
      $scope.geocoderFCN();


    };







// onError Callback receives a PositionError object
//
    function onError(error) {
      alert('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
    }

    $scope.geoLoc= function(){
      $ionicLoading.show({
        template:'<md-progress-circular md-theme="indigo" md-mode="indeterminate">',
        noBackdrop:true
      });
      navigator.geolocation.getCurrentPosition(onSuccess, onError);


    };


//===General Scope Declarations========================test=============================
    $scope.searchZip = function () {
      $ionicLoading.show({
        template:'<md-progress-circular md-theme="indigo" md-mode="indeterminate">',
        noBackdrop:true
      });
      $scope.geocoderFCN();

      // console.log($scope.form1.zasipBox);
    };
//===============Details===================
    $scope.goDetails = function (church) {
      $location.path('/details');
      $scope.church = church;
      var mapOptions = {
        panControl: false,
        zoomControl: true,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false
      };
      $scope.map = {center: {latitude: church.lat, longitude: church.long}, zoom: 14, options: mapOptions};
      $scope.marker = {
        id: 0,
        coords: {
          latitude: church.lat,
          longitude: church.long
        }
      };
      console.log($scope.marker);

    };
//==========Geocoder================================================================
    $scope.geocoderFCN = function () {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({"address": $scope.form1.zipBox}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location;
          $http.get('http://apiv4.updateparishdata.org/Churchs/?lat=' + location.k + '&long=' + location.D + '&pg=1').
            success(function (data) {

              $scope.churchData = data;
              $scope.parseData($scope.churchData);


            }).
            error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        }
      });
    };


////////////////////TEST/////////////////////////
/////////////////////////////////////////////////
//        $scope.form1.zipBox = "48124";
//        $scope.geocoderFCN();
////////////////////////////////////////////////
///////////////////////////////////////////////


//Parse Data========================================================================
    $scope.parseData = function (rawData) {
      $scope.churchArray = [];
      for (var i = 0; i < rawData.length; i++) {
        churchName = rawData[i].name;
        churchCity = rawData[i].church_address_city_name;
        churchZip = rawData[i].church_address_postal_code;
        churchState = rawData[i].church_address_providence_name;
        churchAddress = rawData[i].church_address_street_address;
        churchPhone = rawData[i].phone_number;
        churchUrl = rawData[i].url;
        churchLong = rawData[i].longitude;
        churchLat = rawData[i].latitude;


        var times = [];
        var hasSundayMass = false;
        var sundayStr="";
        for (var j = 0; j < rawData[i].church_worship_times.length; j++) {
          times.push({
            'day': rawData[i].church_worship_times[j].day_of_week,
            'time': rawData[i].church_worship_times[j].time_start
          });
          if (rawData[i].church_worship_times[j].day_of_week === "Sunday    ") {
            hasSundayMass = true;
            if(sundayStr.length<1) {
              sundayStr = rawData[i].church_worship_times[j].time_start;
            }
            else if(sundayStr.length>1){
              sundayStr = sundayStr + ", " + rawData[i].church_worship_times[j].time_start;
            }

          }

        }
        $scope.churchArray.push({
          'hasSundayMass': hasSundayMass,
          'sundayStr':sundayStr,
          'id': i,
          'name': churchName,
          'times': times,
          'city': churchCity,
          'zipcode': churchZip,
          'state': churchState,
          'address': churchAddress,
          'phone': churchPhone,
          'url': churchUrl,
          'lat': churchLat,
          'long': churchLong
        });



      }
      console.log($scope.churchArray);
      $location.path('/results');
      $ionicLoading.hide();

    };


  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js



    //cache forward views (details page)
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.views.transition('platform'); //'none' disables transitions



    $stateProvider

      .state('page13', {
        url: '/home',
        templateUrl: 'page13.html'
      })

      .state('page15', {
        url: '/results',
        templateUrl: 'page15.html'
      })

      .state('page17', {
        url: '/details',
        templateUrl: 'page17.html'
      });

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/home');


  });
