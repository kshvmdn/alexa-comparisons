var app = angular.module('app', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$http.get('/api/sites')
		.success(function(data){
			$scope.sites = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: '+data);
		});
	$scope.addSite = function() {
		$http.post('/api/sites', $scope.formData)
			.success(function(data){
				$scope.formData = {}; // clear form for next site
				$scope.sites = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: '+data);
			});
	};
	$scope.removeSite = function(id) {
		$http.delete('/api/sites'+id) 
			.success(function(data){
				$scope.sites = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
	};
}