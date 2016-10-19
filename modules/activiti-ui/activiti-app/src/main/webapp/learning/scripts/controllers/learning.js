/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular
		.module('activitiApp')
		.controller(
				'LearningController',
				[
						'$rootScope',
						'$scope',
						'$translate',
						'$http',
						'$timeout',
						'$location',
						'appResourceRoot',
						'AppDefinitionService',
						function($rootScope, $scope, $translate, $http,
								$timeout, $location, appResourceRoot, AppDefinitionService) {
							// Main page (needed for visual indicator of current
							// page)
							$rootScope.setMainPageById('learning');
							// get latest thumbnails
							$scope.imageVersion = Date.now();
							$scope.model = {}

							$scope.model = {
								filters : [ {
									id : 'myProcesses',
									labelKey : 'MY-PROCESSES'
								} ],

								sorts : [ {
									id : 'modifiedDesc',
									labelKey : 'MODIFIED-DESC'
								}, {
									id : 'modifiedAsc',
									labelKey : 'MODIFIED-ASC'
								}, {
									id : 'nameAsc',
									labelKey : 'NAME-ASC'
								}, {
									id : 'nameDesc',
									labelKey : 'NAME-DESC'
								} ]
							};

							if ($rootScope.modelFilter) {
								$scope.model.activeFilter = $rootScope.modelFilter.filter;
								$scope.model.activeSort = $rootScope.modelFilter.sort;
								$scope.model.filterText = $rootScope.modelFilter.filterText;

							} else {
								// By default, show first filter and use first
								// sort
								$scope.model.activeFilter = $scope.model.filters[0];
								$scope.model.activeSort = $scope.model.sorts[0];
								$rootScope.modelFilter = {
									filter : $scope.model.activeFilter,
									sort : $scope.model.activeSort,
									filterText : ''
								};
							}

							$scope.activateFilter = function(filter) {
								$scope.model.activeFilter = filter;
								$rootScope.modelFilter.filter = filter;
								$scope.loadProcesses();
							};

							$scope.activateSort = function(sort) {
								$scope.model.activeSort = sort;
								$rootScope.modelFilter.sort = sort;
								$scope.loadProcesses();
							};

							$scope.loadProcesses = function() {
								$scope.model.loading = true;

								var params = {
									filter : $scope.model.activeFilter.id,
									sort : $scope.model.activeSort.id,
									modelType : 0
								};

								if ($scope.model.filterText
										&& $scope.model.filterText != '') {
									params.filterText = $scope.model.filterText;
								}

								$http(
										{
											method : 'GET',
											url : ACTIVITI.CONFIG.contextRoot
													+ '/app/rest/models',
											params : params
										})
										.success(
												function(data, status, headers,
														config) {
													$scope.model.processes = data;
													$scope.model.loading = false;
												})
										.error(
												function(data, status, headers,
														config) {
													console
															.log('Something went wrong: '
																	+ data);
													$scope.model.loading = false;
												});
							};

							$scope.showProcessDetails = function(process) {
							      if (process) {
							          $rootScope.editorHistory = [];
							          $location.path("/learning/" + process.id);
							      }
							  };
							  
							$scope.loadProcesses();

						} ]);