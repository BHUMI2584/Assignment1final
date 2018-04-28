// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

  .controller('firebaseCtl', function ($scope, $firebaseObject) {
    $scope.page = "";
    $scope.categories = ["select cetegory", "Rent", "Bakery", "Car", "Gas", "Clothes"];
    $scope.model = {
      CategoryName: "",
      expenseName: "",
      price: ""
    };
    $scope.gotoPage = function (page) {
      $scope.page = page;
    }

    $scope.model.category = $scope.categories[0];
    $scope.initializeFirebase = function () {
      var ref = new Firebase("https://april10-a924d.firebaseio.com/expenses/" + $scope.sKey + "/");
      $scope.expenses = $firebaseObject(ref);
      $scope.gotoPage('list');
    }

    $scope.barcodescanner = function () {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled) {
            document.getElementById("barcodetext").innerHTML = "Barcode type is: " + result.format + ".Decoded text is: " + result.text;
          }
        },
        function (error) {
        }
      );
    }

    setInterval(function () {
      if (navigator.network.connection.type == Connection.NONE) {
        document.getElementById("maps").innerHTML = "No Internet in your device";
      }
    }, 5000)


    $scope.sKey = localStorage.getItem("sMD5");
    if ($scope.sKey != null) {
      $scope.initializeFirebase();
    }


    $scope.initializeStorage = function () {
      sMd5 = CryptoJS.MD5($scope.model.uname + $scope.model.password + "topSecret");
      localStorage.setItem("sMD5", sMd5);
      $scope.sKey = localStorage.getItem("sMD5");
      $scope.initializeFirebase();
    }
    $scope.addExpense = function () {
      $scope.expenses[uuid.v4()] = { CategoryName: $scope.model.category, expenseName: $scope.model.expenseName, price: $scope.model.price };
      $scope.model.category = "";
      $scope.model.expenseName = "";
      $scope.model.price = "";
      $scope.expenses.$save();
      $scope.gotoPage('list');
    }


    $scope.removeItem = function (item_guid) {
      for (var item_id in $scope.expenses) {
        if (item_id == item_guid) {
          $scope.expenses[item_id] = null;
        }
      }
      $scope.expenses.$save();
    }
    $scope.logout = function () {
      localStorage.removeItem('sMD5');
      $scope.sKey = null;
    }


  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
