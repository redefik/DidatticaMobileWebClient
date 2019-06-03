angular.module('didatticaMobileWebClient').controller('homeController',
    function($scope, courseService, $location, INTERNAL_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE) {
    let initializeCoursesList = function () {
        $scope.loading = true;
        courseService.getTeacherCourses()
            .then(function successCallback(courses) {
                // On success the courses are shown
                $scope.courses = courses;
            }, function errorCallback(error) {
                // On failure an error message is shown
                $scope.errorOccurred = true;
                if (error instanceof InternalErrorException) {
                    $scope.errorMessage = INTERNAL_ERROR_MESSAGE;
                } else {
                    $scope.errorMessage = UNKNOWN_ERROR_MESSAGE;
                }
            })
            .finally(function () {
                // When the request has been processed, the progress bar disappears.
                $scope.loading = false;
            });
    };
    initializeCoursesList();

    // Go to the page that shows the detail of the course
    $scope.goToCourseDetail = function(course) {
        // The course to show is stored in session storage to make it available to the controller responsible to show
        // the details
        sessionStorage.setItem("course_to_show", JSON.stringify(course));
        $location.path('/courseDetail');
    }
});