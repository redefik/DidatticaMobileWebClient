angular.module('didatticaMobileWebClient').controller('courseDetailController',
    function ($scope, teachingMaterialService, $route, $window, INTERNAL_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE, CONFLICT_FILE_ERROR_MESSAGE) {
    $scope.course = JSON.parse(sessionStorage.getItem("course_to_show"));
    $scope.errorMessage = "";
    $scope.errorOccurred = false;
    $scope.uploadingErrorOccurred = false;
    $scope.uploadingErrorMessage = "";
    // Initialize the course detail page downloading the teaching materials for the course
    let initializeTeachingMaterialsList = function (courseId) {
        $scope.loading = true;
        teachingMaterialService.getTeachingMaterials(courseId)
            .then(function successCallback(teachingMaterials) {
                $scope.teachingMaterials = teachingMaterials;
            }, function errorCallback(error) {
                $scope.errorOccurred = true;
                if (error instanceof InternalErrorException) {
                    $scope.errorMessage = INTERNAL_ERROR_MESSAGE;
                } else {
                    $scope.errorMessage = UNKNOWN_ERROR_MESSAGE;
                }

            })
            .finally(function (){
                $scope.loading = false;
            });
    };
    initializeTeachingMaterialsList($scope.course.id);

    // Upload the teaching material selected by the user
    $scope.uploadTeachingMaterial = function () {
        let fileToUpload = document.getElementById("inputFile").files[0];
        if (!fileToUpload) {
            return;
        }
        $scope.uploading = true;
        teachingMaterialService.uploadTeachingMaterial($scope.course, fileToUpload)
            .then(function successCallback(){
               // On successfully upload, the page is refreshed
               $route.reload();
            }, function errorCallback(error) {
                // On failure an error message is shown
                $scope.errorOccurred = true;
                if (error instanceof InternalErrorException) {
                    $scope.errorMessage = INTERNAL_ERROR_MESSAGE;
                } else if (error instanceof ConflictFileException) {
                    $scope.errorMessage = CONFLICT_FILE_ERROR_MESSAGE;
                } else {
                    $scope.errorMessage = UNKNOWN_ERROR_MESSAGE;
                }
            })
            .finally(function () {
                $scope.uploading = false;
            });
    };

    // Download the teaching material clicked by the user
    $scope.downloadTeachingMaterial = function(material) {
        teachingMaterialService.downloadTeachingMaterial($scope.course, material.split("_")[1])
            .then(function successCallback(fileLink) {
                // The file is opened in another window
                $window.open(fileLink);
            }, function errorCallback(error){
                // On failure, an error message is shown.
                $scope.errorOccurred = true;
                if (error instanceof InternalErrorException) {
                    $scope.errorMessage = INTERNAL_ERROR_MESSAGE;
                } else {
                    $scope.errorMessage = UNKNOWN_ERROR_MESSAGE;
                }
            });
    };
});