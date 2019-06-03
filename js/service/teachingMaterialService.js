/*This service is responsible for handling teaching materials of a course. Namely, it provides functionality
* for listing, downloading and uploading materials*/
angular.module('didatticaMobileWebClient').service('teachingMaterialService', function ($http, $q, jwtHelper, userService, BACKEND_ENDPOINT) {
    this.getTeachingMaterials = function(courseId) {
        // the access token used for authenticating requests is read from the session storage
        let jwToken = sessionStorage.getItem('JWToken');
        let deferred = $q.defer();

        // Encapsulate the http request used to retrieve teacher's course.
        let makeRequest = function() {
            $http.defaults.headers.common.Authorization = 'Bearer' + sessionStorage.getItem('JWToken');
            $http.get(BACKEND_ENDPOINT + 'teachingMaterials/' + courseId)
                .then(function successCallback(response) {
                    // On success the list of teaching materials is returned to the controller
                    deferred.resolve(response.data);
                }, function errorCallback() {
                    deferred.reject(new InternalErrorException("Error in retrieving teaching materials"));
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

    // Get a temporary link for uploading a file to AWS S3
    this.getUploadTemporaryLink = function(course, file) {
      // the access token used for authenticating requests is read from the session storage
      let jwToken = sessionStorage.getItem('JWToken');
      let deferred = $q.defer();

      // Encapsulate the http request used to get the temporary link used to upload the file
      let makeRequest = function() {
          $http.defaults.headers.common.Authorization = 'Bearer' + sessionStorage.getItem('JWToken');
          $http.get(BACKEND_ENDPOINT + 'teachingMaterials/uploadLink/' + file.name + '/course/' + course.id)
              .then(function successCallback(response) {
                  // On success the temporary link for uploading the file is returned
                  deferred.resolve(response.data.link);
              }, function errorCallback(response) {
                  if (response.status === 409) {
                      deferred.reject(new ConflictFileException("Try to upload already existent resource"));
                  } else {
                      deferred.reject(new InternalErrorException("Error in uploading the file"));
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

    // Upload the file as a teaching material of the provided course. The upload request is made to AWS S3 data-store service.
    this.uploadTeachingMaterial = function(course, file) {
        let deferred = $q.defer();

        // Encapsulate the HTTP request made to upload a new teaching material to AWS S3
        let makeUpload = function(link) {
            // The access token is removed from the header to avoid conflict with AWS
            $http.defaults.headers.common.Authorization = undefined;
            let formData = new FormData();
            formData.set("file", file);
            $http.put(link, formData, {headers: {'Content-Type': undefined}})
                .then(function successCallback() {
                    deferred.resolve();
                }, function errorCallback(){
                   deferred.reject(new InternalErrorException("Error in uploading the file"));
                });
        };

        // Get the temporary link for uploading the file to AWS S3
        this.getUploadTemporaryLink(course, file)
            .then(function successCallback(uploadLink){
                makeUpload(uploadLink);
            }, function errorCallback(error) {
               deferred.reject(error);
            });

        return deferred.promise;

    };

    // Get a temporary link for downloading a file from AWS S3
    this.getDownloadTemporaryLink = function(course, fileName) {
        // the access token used for authenticating requests is read from the session storage
        let jwToken = sessionStorage.getItem('JWToken');
        let deferred = $q.defer();

        // Encapsulate the http request used to get the temporary link used to download the file
        let makeRequest = function() {
            $http.defaults.headers.common.Authorization = 'Bearer' + sessionStorage.getItem('JWToken');
            $http.get(BACKEND_ENDPOINT + 'teachingMaterials/downloadLink/' + fileName + '/course/' + course.id)
                .then(function successCallback(response) {
                    // On success the temporary link for download the file is returned
                    deferred.resolve(response.data.link);
                }, function errorCallback() {
                    deferred.reject(new InternalErrorException("Error in downloading the file"));
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


    // Download the file with the provided name from the repository of the given course. The file is downloaded from AWS S3 data-store service.
    this.downloadTeachingMaterial = function(course, fileName) {
        let deferred = $q.defer();

        // Get the temporary link for downloading the file from AWS S3
        // The link of the file is returned to the controller that can open the file
        this.getDownloadTemporaryLink(course, fileName)
            .then(function successCallback(downloadLink){
                    deferred.resolve(downloadLink);
                }, function errorCallback(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

});