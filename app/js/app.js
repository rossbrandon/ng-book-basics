var app = angular.module('myApp', ['myApp.filters']);

app.controller('signupController', ['$scope', '$filter', function($scope, $filter) {
    $scope.today = new Date();
    $scope.isCapitalized = function(str) {
        return str[0] == str[0].toUpperCase();
    }
}]);

angular.module('myApp.filters', []).filter('capitalize', function() {
    return function(input) {
        if (input) {
            return input[0].toUpperCase() + input.slice(1);
        }
    }
});

app.directive('ensureUnique', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function(n) {
                if (!n) {
                    return;
                }

                $http({
                    method: 'POST',
                    url: 'api/check/' + attrs.ensureUnique,
                    data: { 'field': attrs.ensureUnique }
                }).success(function(data) {
                    c.$setValidity('unique', data.isUnique);
                }).error(function(data) {
                    c.$setValidity('unique', false);
                });
            });
        }
    }
});

app.directive('ngFocus', [function() {
    var FOCUS_CLASS = 'ng-focused';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = true;
                });
            }).bind('blur', function(evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = false;
                });
            });
        }
    }
}]);