$(document).ready(function(){

	var $list = $('#goals-list')

	var goalTemplate = _.template($('#goalTemplate').html());
	
// get goals from db and render onto page

$.ajax({
	url:'/api/goals',
	type:'GET',
	success: function(data){
		var goals = data;
		console.log(data);

		_.each(goals, function(goal){
			console.log(goal)
			var newGoal = $(goalTemplate(goal));
			$list.append(newGoal)
		});
	}
});

//add a new goal

$('#post-goal').on('click', function(event){
	var newGoal = {
		goal: $('#goal').val(),
		description: $('#description').val()
	}

	console.log(newGoal);

	$.ajax({
		url:'/api/goals',
		type: 'POST',
		data: newGoal,
		success: function(data){
			$list.append($(goalTemplate(data)));
		}
	});

	$('#post').modal('hide');
});

//edit a goal

$(document).on('click', '.editButton', function(event){
	goalId = $($(this).closest('.list')).attr('data-id');

	$.ajax({
		url:'/api/goals/' + goalId,
		type:'GET',
		success: function(res) {
			$('#editGoal').val(res.goal);
			$('#editDescription').val(res.description);
		}
	});
});

$('#submitEdit').on('click', function(event){
	var goal = {
		goal: $('#editGoal').val(),
		description: $('#editDescription').val()
	}
	$.ajax({
		url:'/api/goals/' + goalId,
		type:'PUT',
		data: goal,
		success: function(data){
			var newGoal = $(goalTemplate(data));
			$('#goals-list-' + goalId).replaceWith(newGoal)
		}
	});

	$('#edit').modal('hide');
});

//get currently logged in user

$.ajax({
	url:'/api/users/current',
	type:'GET',
	success: function(user){
		console.log (user)

		//iterate through each of their goals and render to template
		_.each(user.goals, function (goal) {
			console.log(goal)
			$list.append($(goalTemplate(goal)))
		});

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


//delete a goal

$('#deleteGoal').on('click', function(event){
	$(goalId).remove();

	$.ajax({
		url:'/api/goals/' + goalId,
		type:'DELETE',
		success: function(data){
			$('#goals-list-' + goalId).remove();
		}
	});

	$('#edit').modal('hide');
});
});