angular.module('starter.controllers', [])

.controller('LoginCtrl', function($state, $scope, APIService, $ionicPopup, $state, $ionicLoading) {
    $scope.user = {};



    $scope.login = function() {
        $ionicLoading.show({
          template: '<p>Checking Credentials ...</p><ion-spinner></ion-spinner>'
        });
        //console.log('Login : ' + JSON.stringify($scope.user.username));
        APIService.getToken().success(function(data){
            //console.log(JSON.stringify(data))

            localStorage.setItem("token", data.access_token);

            APIService.login(data.access_token, $scope.user.username, $scope.user.password).success(function(data){
                //alert('Login Auth Key: ' + JSON.stringify(data.x_auth_key.auth_key))
                localStorage.setItem("auth_key", data.x_auth_key.auth_key);
                $state.go('tab.chats')
                $ionicLoading.hide()
            }).error(function(apidata) {                
                //alert('Error Code : ' + JSON.stringify(apidata.data.code))
                $ionicLoading.hide()
                if(apidata.data.code == '10112'){
                    $ionicPopup.alert({
                        title: 'Something went wrong',
                        template: '<center>Invalid Username / Password</center>'
                    });
                }
            })

        }).error(function(apidata) {                
            //alert('Error Code : ' + JSON.stringify(apidata))
            $ionicLoading.hide()
              
            var errorConnection = $ionicPopup.show({
                title: "Error Internet Connection",
                template: "Internet connection is needed for first time install",
                scope: $scope, 
                buttons: [ 
                    { 
                        text:  "Try Again",
                        type: 'button-positive',  
                        onTap: function (){
                            return "tryagain"; 
                        } 
                    }          
                ]    
            });   

            errorConnection.then(function(result) {
                if(result == "tryagain"){

                    $window.location.reload();               
                }                        
            });  
                 
                
        })

    }
    
})

.controller('ViewCtrl', function($scope, $state, $ionicLoading, APIService, $ionicPopup) {

    $scope.officer={};

    

    $scope.AddListing = function() {
        //alert(JSON.stringify($scope.officer))

        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        
        APIService.addListing(localStorage.getItem("token"), localStorage.getItem("auth_key"), $scope.officer).success(function(data){

          //alert('Success Update : ' + JSON.stringify(data))
          $ionicLoading.hide()
          $ionicPopup.alert({
              title: 'Success',
              template: '<center>Successfully Added {{$scope.officer.department}} Record.</center>'
          });
          $state.go('tab.chats')
        })
    }    
    
})

.controller('DashCtrl', function($scope) {
    

})

.controller('ChatsCtrl', function($state, $scope, Chats, APIService, $ionicLoading) {
 
  
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
  });

  $scope.$on('$ionicView.enter', function(e) {
        APIService.getallofficers(localStorage.getItem("token"), localStorage.getItem("auth_key")).success(function(data){
            //alert(JSON.stringify(data))
            $scope.chats = data
      })
  });

  //$state.go($state.current, {}, {reload: true});

  APIService.getallofficers(localStorage.getItem("token"), localStorage.getItem("auth_key")).success(function(data){
        //alert(JSON.stringify(data))

        $scope.chats = data
        $ionicLoading.hide()
  })

  //$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $state, $stateParams, Chats, APIService, $ionicPopup, $ionicLoading) {
   $scope.officer={};


  APIService.getindividualofficer($stateParams.chatId, localStorage.getItem("token"), localStorage.getItem("auth_key")).success(function(data){
        
        $scope.officer.level = data[0].level
        $scope.officer.department = data[0].department
        $scope.officer.emp_name1= data[0].emp_name1
        $scope.officer.position1 = data[0].position1
        $scope.officer.mobile1 = data[0].mobile1
        $scope.officer.landline1 = data[0].landline1
        $scope.officer.local = data[0].local
        $scope.officer.email1 = data[0].email1
        $scope.officer.emp_name2 = data[0].emp_name2
        $scope.officer.position2 = data[0].position2
        $scope.officer.mobile2 = data[0].mobile2
        $scope.officer.email2 = data[0].email2
        $scope.officer.landline2 = data[0].landline2
        $scope.officer.mobile3 = data[0].mobile3
        $scope.officer.mobile4 = data[0].mobile4

        //alert(JSON.stringify(data))

        //$scope.chat = data
  })

  //$scope.chats = Chats.all();
  $scope.Update = function() {

    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    //alert(JSON.stringify($scope.officer))
    APIService.updateindividualofficer($stateParams.chatId, localStorage.getItem("token"), localStorage.getItem("auth_key"), $scope.officer).success(function(data){

      //alert('Success Update : ' + JSON.stringify(data))
      $ionicLoading.hide()
      $ionicPopup.alert({
          title: 'Success',
          template: '<center>Successfully Updated {{$scope.officer.department}} Record.</center>'
      });

       $state.go('tab.chats')

    })
  };


  $scope.Delete = function() {

    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    //alert(JSON.stringify($scope.officer))
    APIService.deleteindividualofficer($stateParams.chatId, localStorage.getItem("token"), localStorage.getItem("auth_key")).success(function(data){

      //alert('Success Delete : ' + JSON.stringify(data))
      $ionicLoading.hide()
      $ionicPopup.alert({
          title: 'Success',
          template: '<center>Successfully Deleted Record.</center>'
      });

      $state.go('tab.chats')
    })
  };

  //$scope.chat = Chats.get($stateParams.chatId);

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
