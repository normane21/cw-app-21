angular.module('cwapp.controllers', ['ionic.cloud'])
  
.controller('directoryCtrl', function ($scope, $stateParams, DATA_CONFIG) {

	$scope.employees = [];

    $scope.employees =DATA_CONFIG.employees;



    var fav = JSON.parse(localStorage.getItem('favorites')) || [];

    angular.forEach(DATA_CONFIG.employees, function(value, key) {

        if(fav.indexOf(value.id)!= -1){
            value.data.favorites = "ion-android-star";
        }else{
            value.data.favorites = "ion-android-star-outline"
        }
       //if(fav.indexOf(value.id))
       //alert('value : ' + value + '   ' + 'Key : ' + key);
       
        //alert(JSON.stringify(value));
    })


})
   
.controller('homeCtrl', ['$scope', '$stateParams', '$ionicPush', '$ionicPopup', function ($scope, $stateParams, $ionicPush, $ionicPopup) {

  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    //alert(JSON.stringify(t));
    //alert('Token saved:', t.token);
  });

  $scope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;

    $ionicPopup.alert({
      title: msg.title,
      template: msg.text
    });
    //alert(msg.title + ': ' + msg.text);
  });


}])
   
.controller('frequentlyAskQuestionsCtrl',  function ($scope, $stateParams) {

      
      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };


    $scope.showSales = true;
    $scope.showService = false;
    $scope.showParts = false;

    $scope.sales = function() {
        $scope.showSales = true;
        $scope.showService = false;
        $scope.showParts = false;
    };

    $scope.service = function() {
        $scope.showSales = false;
        $scope.showService = true;
        $scope.showParts = false;
    };

    $scope.parts = function() {
        $scope.showSales = false;
        $scope.showService = false;
        $scope.showParts = true;
    };
      

})
      
.controller('individualDirectoryCtrl', function ($scope, $stateParams, DATA_CONFIG, $filter) {

	//alert($stateParams.id);

    $scope.employee = [];


    var emp_id = $stateParams.id;

    var employee = $filter('filter')(DATA_CONFIG.employees, {id:emp_id})[0];
    
    //alert(JSON.stringify(employee));
    $scope.employee = employee;

})
 