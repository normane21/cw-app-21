angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.directory', {
    url: '/directory',
    views: {
      'tab2': {
        templateUrl: 'templates/directory.html',
        controller: 'directoryCtrl'
      }
    }
  })

  .state('tabsController.home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.frequentlyAskQuestions', {
    url: '/faq',
    views: {
      'tab3': {
        templateUrl: 'templates/frequentlyAskQuestions.html',
        controller: 'frequentlyAskQuestionsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.individualDirectory', {
    url: '/individual-directory/:id',
    views: {
      'tab2': {
        templateUrl: 'templates/individualDirectory.html',
        controller: 'individualDirectoryCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/home')

  

});