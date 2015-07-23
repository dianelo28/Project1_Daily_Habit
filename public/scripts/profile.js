$(document).ready(function(){

var $list = $('#goals-list')

var goalTemplate = _.template($('#goalTemplate').html());

	
//get currently logged in user

$.ajax({
	url:'/api/users/current',
	type:'GET',
	success: function(user){
		console.log (user)

		//iterate through each of their goals and render to template
		_.each(user.goals, function (goal, index) {
			console.log(goal)
			$list.append($(goalTemplate(goal)))
		});

		//add header to welcome
		
		var welcome = document.querySelector('h1');
		welcome.innerHTML = 'Welcome ' + user.firstName ;

		//add a new goal for current user

		$('#post-goal').on('click', function(event){
			var newGoal = {
				goal: $('#goal').val(),
				description: $('#description').val()
			}

			console.log(newGoal);

			$.ajax({
				url:'/api/users/current/goals',
				type: 'POST',
				data: newGoal,
				success: function(data){
					console.log(newGoal);
					$list.append($(goalTemplate(data)));
				}
			});

			$('#post').modal('hide');
		});
	}
});
});
	
