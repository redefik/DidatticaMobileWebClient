/*This service is responsible is for handling the course held by a teacher*/
angular.module('didatticaMobileWebClient').service('courseService', function($http, jwtHelper, $q, userService, BACKEND_ENDPOINT) {
    this.getTeacherCourses = function() {
        // the access token used for authenticating requests is read from the session storage
        let jwToken = sessionStorage.getItem('JWToken');
        let decodedToken = jwtHelper.decodeToken(jwToken);
        // read from the token teacher's name
        let teacherName = decodedToken.Name;
        let teacherSurname = decodedToken.Surname;

        let deferred = $q.defer();

        // Encapsulate the http request used to retrieve teacher's course.
        let makeRequest = function() {
            $http.defaults.headers.common.Authorization = 'Bearer' + sessionStorage.getItem('JWToken');
            $http.get(BACKEND_ENDPOINT + 'courses/teacher/' + teacherName + "-" + teacherSurname)
                .then(function successCallback(response) {
                    // On success the list of courses is returned to the controller
                    deferred.resolve(response.data);
                }, function errorCallback(response) {
                    if (response.status === 404) {
                        // If no course is found, an empty list is returned
                        deferred.resolve([]);
                    } else {
                        deferred.reject(new InternalErrorException('Error in retrieving courses'));
                    }
                });
        };

        // If the JWT token is expired, it must be refreshed before making the actual request
        if (jwtHelper.isTokenExpired(jwToken)) {
            userService.doLogin(sessionStorage.getItem("username"), sessionStorage.getItem("password"))
                .then(function successCallback(){
                    makeRequest();
                }, function errorCallback() {
                    deferred.reject();
                })
        } else {
            makeRequest();
        }
        return deferred.promise;

    };
});