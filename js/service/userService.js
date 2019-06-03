/*This service is responsible for user's authentication*/
angular.module('didatticaMobileWebClient').service('userService', function($q, $http, BACKEND_ENDPOINT) {
    // Create an access token used for request authentication by providing credentials to the remote server
    this.doLogin = function(username, password) {
        let deferred = $q.defer();
        $http.post(BACKEND_ENDPOINT + 'token', {"username": username, "password": password})
            .then(function successCallback(response) {
                if (response.status === 201) {
                    // The access token is stored in the session storage for future authentications
                    sessionStorage.setItem("JWToken", response.data.token);
                    // Username and password are stored in the session storage for future refreshing of token
                    sessionStorage.setItem("logged", "true");
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("password", password);
                    deferred.resolve();
                } else {
                    deferred.reject(InternalErrorException("Error in doing login"));
                }
            }, function errorCallback(response) {
                if (response.status === 401) {
                    deferred.reject(new WrongCredentialsException("Invalid credentials in authentication"));
                } else {
                    deferred.reject(new InternalErrorException("Error in doing login"));
                }
            });
        return deferred.promise;
    };

});