// $(document).ready(function(){

// var $recipe = $('#recipe');
// var $results = $('#results');

// var recipeTemplate = _.template($('#recipeTemplate').html());

// //search for recipe with input value
// $('#recipeSearchButton').on('click',function(e){
// 	// e.preventDefault();
// 	console.log('click!')
// 	var search = $recipe.val();
// 	console.log(search);

// 	//send the get request to food2fork
// 	$.ajax({
// 		url: 'https://community-food2fork.p.mashape.com/search?key=7265727d95515b59e5a8f7e7ec0f3d9f&q=' + search + '&sort=rating',
// 		type:'GET',
// 		datatype: 'json',
// 		success: function(data) {
// 			var searchResult = data.recipe;
// 				console.log(searchResult)
// 			//iterate through each result for template

// 				_.each(searchResult, function(result, index){
// 					var templateData = {
// 						title: result.title,
// 						f2f_url: result.f2f_url
// 					};

// 					console.log(templateData)

// 					$results.append($(recipeTemplate(templateData)));
// 				});
// 			}
// 		})
// 		error: function(err) { alert(err) },
// 		beforeSend: function(xhr){
// 			xhr.setRequestHeader ("X-Mashape-Key", "eqGe7SasOCmshHHd4jnPnA5MeUlzp1eY22Vjsn7GvsKlYaYo5i");
// 		}

// 	});
// });

// });

