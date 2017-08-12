angular.module('cwapp.controllers', ['ionic.cloud'])
  
.controller('directoryCtrl', function ($scope, $stateParams, DATA_CONFIG) {

	$scope.itemsList = [];

    //$scope.itemsList.push({"name":"big screen TV", "room":"Basement"});
    //$scope.itemsList.push({"name":"Xbox One", "room":"Basement"});
    //$scope.itemsList.push({"name":"Ice Maker", "room":"Kitchen"});
    //$scope.itemsList.push({"name":"China Cabinet", "room":"Dining Room"});

    //aert('directory')
    document.addEventListener('deviceready', function() {
      var db = window.sqlitePlugin.openDatabase({name: 'cw1.db', key: 'lgc21normanlausgroup', location: 'default'});

     
      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Officers', [], function(tx, rs) {

           // alert
           // $scope.itemsList = DATA_CONFIG.employees;
           //alert(rs.rows.length)
            if(rs.rows.length >0){

                for(var i=0; i<rs.rows.length; i++){
                    $scope.itemsList.push(rs.rows.item(i));                    
                } 
                
            }

            //alert(JSON.stringify($scope.itemsList));
            //alert('Record count (expected to be 2): ' + JSON.stringify(rs.rows.items);
            //alert('Record length: ' + JSON.stringify(rs.rows.length));
        }, function(tx, error) {
          alert('SELECT error: ' + error.message);
        });
      });
        
    });

    

    /*

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
    */

})
   
.controller('homeCtrl', function ($scope, $stateParams, $ionicPush, $ionicPopup, APIService, $cordovaSQLite, $ionicLoading) {

    

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


  if((localStorage.getItem("install")==null)||(localStorage.getItem("update")==true)){

        if(localStorage.getItem("app_status")==null){          
            $ionicLoading.show({
                template: '<ion-spinner class="cwxloader"></ion-spinner> <br/>Retrieving Directory ...'
            });
        }
        else if(localStorage.getItem("app_status")=='update')  {
            $ionicLoading.show({
                template: '<ion-spinner class="cwxloader"></ion-spinner> <br/>Updating Directory ...'
            });
        }
       

       

         APIService.getToken().success(function(data){
            //alert(JSON.stringify(data))
            //localStorage.setItem("token", data.access_token);
            APIService.getallofficers(data.access_token,'lausgroup21').success(function(data){
                //alert(JSON.stringify(data))
                //localStorage.setItem("token", data.access_token);
                 document.addEventListener('deviceready', function() {
                  var db = window.sqlitePlugin.openDatabase({name: 'cw1.db', key: 'lgc21normanlausgroup', location: 'default'});

                  db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Officers (id string primary key, level text, department text, emp_name1 text, position1 text, mobile1 text, landline1 text, email1 text, emp_name2 text, position2 text, mobile2 text, landline2 text, email2 text)');

                    //tx.executeSql('DROP TABLE Officers');

                    angular.forEach(data, function(data, key) {
                         tx.executeSql('INSERT OR REPLACE INTO Officers VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data._id, data.level, data.department, data.emp_name1, data.position1, data.mobile1, data.landline1, data.email1, data.emp_name2, data.position2, data.mobile2, data.landline2, data.email2]);
                    })
                    //localStorage.setItem("install", true)

                    $ionicLoading.hide();
                    
                  }, function(error) {
                    alert('Transaction ERROR: ' + error.message);
                  }, function() {
                    //alert('Populated database OK');
                  });

                  
                  db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Officers', [], function(tx, rs) {

                       //alert('Record count : ' + JSON.stringify(rs.rows.item(0)));
                       //alert('Record length: ' + JSON.stringify(rs.rows.length));
                    }, function(tx, error) {
                      alert('SELECT error: ' + error.message);
                    });
                  });
                    
                });


            }).error(function(apidata) {                
                  alert('Error Code : ' + JSON.stringify(apidata))        
            })


        }).error(function(apidata) {                
              alert('Error Code : ' + JSON.stringify(apidata))        
        })
  }

})
   
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

    document.addEventListener('deviceready', function() {
      var db = window.sqlitePlugin.openDatabase({name: 'cw1.db', key: 'lgc21normanlausgroup', location: 'default'});

     
      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Officers WHERE level = ' + emp_id, [], function(tx, rs) {

           // alert
           // $scope.itemsList = DATA_CONFIG.employees;
           //alert(rs.rows.length)
            //if(rs.rows.length >0){

                //for(var i=0; i<rs.rows.length; i++){
                    $scope.employee = rs.rows.item(0);                    
                //} 
                
            //}

            alert(JSON.stringify($scope.employee));
            //alert('Record count (expected to be 2): ' + JSON.stringify(rs.rows.items);
            //alert('Record length: ' + JSON.stringify(rs.rows.length));
        }, function(tx, error) {
          alert('SELECT error: ' + error.message);
        });
      });
        
    });

   

    //var employee = $filter('filter')(DATA_CONFIG.employees, {id:emp_id})[0];
    
    //alert(JSON.stringify(employee));
    //$scope.employee = employee;

})
 