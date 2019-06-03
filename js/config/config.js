/*
* This module defines the way the app handles the routing between the "pages".
* */
angular.module('didatticaMobileWebClient').config(function($routeProvider) {
    $routeProvider
    // The entry point is the login page
        .when("/", {templateUrl: "html/login.html", controller: "loginController"})
        .when("/home", {templateUrl: "html/home.html", controller: "homeController"})
        .when("/courseDetail", {templateUrl: "html/courseDetail.html", controller: "courseDetailController"})
        .otherwise({redirectTo: "html/login.html"})
});