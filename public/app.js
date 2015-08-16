var app = angular.module('app', [])

	.controller('mainController', function($http) {
		var vm = this;
		vm.formData = {};
		$http.get('/api/sites')
			.success(function(data){
				vm.sites = data;
			})
			.error(function(data) {
				console.log('Error: '+data);
			});
		vm.addSite = function() {
			$http.post('/api/sites', vm.formData)
				.success(function(data){
					vm.formData = {}; // clear form for next site
					vm.sites = data;
				})
				.error(function(data){
					console.log('Error: '+data);
				});
		};
		vm.removeSite = function(id) {
			$http.delete('/api/sites/'+id)
				.success(function(data){
					vm.sites = data;
				})
				.error(function(data){
					console.log('Error: '+data);
				});
		};
		vm.removeAll = function() {
			$http.delete('/api/sites/')
				.success(function(data){
					vm.sites = data;
				})
				.error(function(data){
					console.log('Error: '+data);
				});
		}
	});