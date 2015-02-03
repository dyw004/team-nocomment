$(document).ready(function () {
    BaasBox.setEndPoint("http://localhost:9000"); // Address of BaasBox server
    BaasBox.appcode = "1234567890";               // Application code of BaasBox server
});

var TCG = angular.module('TCG', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

// Routing for ng-view
TCG.config(function($routeProvider)
{
    $routeProvider
        .when('/',
        {
            templateUrl:"partials/home.html",
            controller:"homeController"
        })
        .when('/dashboard',
        {
            templateUrl:"partials/dashboard.html",
            controller:"dashboardController"
        })
        .when('/signup',
        {
            templateUrl:"partials/signup.html",
            controller:"signUpController"
        })
        .when('/stuff',
        {
            templateUrl:"partials/stuff.html",
            controller:"suffController"
        })
        .otherwise({redirectTo:'/'})
})

// Controller for navbar
TCG.controller("navController", function($scope, $location)
{
    $scope.alerts = [];
    
    switch($location.path())
    {
        case '/': $scope.radioModel = "Home"; break;
        case '/signup': $scope.radioModel = "Sign Up"; break;
        case '/stuff': $scope.radioModel = "Stuff"; break;
        case '/dashboard': $scope.radioModel = "Dashboard"; break;
    }
    
    $scope.closeAlert = function(index) { $scope.alerts.splice(index, 1); }
    $scope.loggedIn = function(){ return BaasBox.getCurrentUser() != null; }
    $scope.signIn = function()
    {
        if($scope.loggedIn()) // Handle logout
        {
            BaasBox.logout()
            .done(function (res) {
                $scope.radioModel = "Home";
                $location.path('/');
                $scope.$apply();
            })
            .fail(function (error) {
                console.log("Logout Failed");
            })
        }
        else // Handle login
        {
            BaasBox.login($scope.signInEmail, $scope.signInPassword)
            .done(function (res) {
                $scope.alerts = [];
                $scope.radioModel = "Dashboard";
                $location.path('/dashboard');
                $scope.$apply();
            })
            .fail(function (error) {
                console.log("Login Failed");
                if($scope.alerts.length == 0) $scope.alerts.push({});
                $scope.$apply();
            })
        }
    }
})

/********************************************************
Controllers for Partials
********************************************************/

// Controller for Home
TCG.controller("homeController", function($scope)
{
})

// Controller for Login Dashboard
TCG.controller("dashboardController", function($scope)
{
})
// Controller for other stuff page
TCG.controller("stuffController", function($scope)
{
})

// Controller for Sign Up Page
TCG.controller("signUpController", function($scope, $location)
{
    $scope.loggedIn = function(){ return BaasBox.getCurrentUser() != null; }
    $scope.signUp = function()
    {
        BaasBox.signup($scope.signUpEmail, $scope.signUpPassword)
            .done(function (res) {
                $scope.signUpEmail = $scope.signUpPassword = $scope.signUpFirst = $scope.signUpLast = "";
                $location.path('/dashboard');
                $scope.$apply();
            })
            .fail(function (error) {
                console.log("Sign Up Failed");
            })
    }
})