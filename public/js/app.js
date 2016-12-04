/*
* Javascirpt for MedChecker Service
*/


var app = angular.module("appModule", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: 'main.html'
        })
        .when("/status", {
            templateUrl: function() {
                if(firebase.auth().currentUser)
                    return 'status.html';
                else
                    return 'privilegeReq.html';
            },
            controller: 'calController'
        })
        .when("/admin", {
            templateUrl: 'admin.html'
        })
});

app.controller('AppController', function ($scope, $auth, $route) {
	$scope.toggleAuth = function() {
        if (!firebase.auth().currentUser) {
            // Firebase FB Login Provider로 시작
            // 팝업창 없이 현화면에서 redirect
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(provider).then(function () {
              
            });
        }
        else {// 로그아웃
        	alert("로그아웃 되었습니다!");
            firebase.auth().signOut();
        }
	};

    $scope.databaseCheck = function () {
        var d = new Date();
        var n = d.getTime();
        var input = {
                '2' : 1475406000, '3': 1475506800, '7' : 1475856780, '14': 1476467340
        };

        input['' + d.getDate()] = n;

        firebase.database().ref(
                'status/' + firebase.auth().currentUser.uid +  '/' + 2016 + '/' + 11).set(input);
        $route.reload();
    };

	$auth.init($scope);
	console.log("app.js Loaded");
	$auth.setScopeOnAuthStateChange($scope);
});

app.controller('calController', function($scope, $auth, $route, $calendar) {
    $scope.currentUser = $auth.getCurrentUser();
    $scope.showDetail = function(year, month, day) {
        $scope.detailYear = year;
        $scope.detailMonth = month;
        $scope.detailDay = day;
        console.log($calendar.userPillData);
    };

    $scope.postInfo = function() {
        $calendar.postInfo($scope.takenTime);
    };

    $scope.reloadCalendar = $calendar.reloadCalendar;
    $scope.takenTime = new Date();
    if($scope.currentUser.uid)
        $calendar.createCalendar();
    //$route.reload();
});