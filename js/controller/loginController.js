angular.module('didatticaMobileWebClient').controller('loginController',
    function($scope, userService, $location, $rootScope, INTERNAL_ERROR_MESSAGE, WRONG_CREDENTIALS_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE) {
    // If the user is logged, the login page is not shown
    if (sessionStorage.getItem("logged") === "true") {
        $location.path('/home');
    }
    $scope.login = function() {
        // A progress bar spins while the request is processed
        $scope.loading = true;
        // The interaction with the persistence layer is delegated to the service userService
        userService.doLogin($scope.username, $scope.password)
            .then(function successCallback() {
                // Upon successful authentication the home page is shown
                $location.path('/home');
            }, function errorCallback(error) {
                // Upon failed authentication an error message is shown
                $scope.errorOccurred = true;
                if (error instanceof InternalErrorException) {
                    $scope.errorMessage = INTERNAL_ERROR_MESSAGE;
                } else if (error instanceof WrongCredentialsException) {
                    $scope.errorMessage = WRONG_CREDENTIALS_ERROR_MESSAGE;
                } else {
                    $scope.errorMessage = UNKNOWN_ERROR_MESSAGE;
                }
            })
            .finally(function () {
                // When the request has been processed, the progress bar disappears.
                $scope.loading = false;
            });
    }
});