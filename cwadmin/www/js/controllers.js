angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, APIService, $ionicPopup, $state) {
    $scope.user = {};



    $scope.login = function() {
        //console.log('Login : ' + JSON.stringify($scope.user.username));
        APIService.getToken().success(function(data){
            //console.log(JSON.stringify(data))

            localStorage.setItem("token", data.access_token);

            APIService.login(data.access_token, $scope.user.username, $scope.user.password).success(function(data){
                console.log('Login Auth Key: ' + JSON.stringify(data.x_auth_key.auth_key))
                localStorage.setItem("auth_key", data.x_auth_key.auth_key);
                $state.go('tab.dash')
            }).error(function(apidata) {                
                console.log('Error Code : ' + JSON.stringify(apidata.data.code))

                if(apidata.data.code == '10112'){
                    $ionicPopup.alert({
                        title: 'Something went wrong',
                        template: '<center>Invalid Username / Password</center>'
                    });
                }
            })

        })

    }
    
})

.controller('ViewCtrl', function($scope) {

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats, APIService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  APIService.getallofficers(localStorage.getItem("token"), localStorage.getItem("auth_key")).success(function(data){
        console.log(JSON.stringify(data))

        $scope.chats = data
  })

  //$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
