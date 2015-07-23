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
			// console.log(goal)
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

	// console.log(newGoal);

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

//create a new user

$('#sign-up-form').on('submit', function(e){
	e.preventDefault();
	// var newUser = {
	// 	firstName: $('#firstName').val(),
	// 	lastName: $('#lastName').val(),
	// 	email: $('#email').val(),
	// 	password: $('#password').val(),
	// };

	var password = $('#password').val();

	if ( password.length <= 4){

		alert('Password too short!');
		return('Too short!');
	}

	$.ajax({
		url:'/users',
		type:'POST',
		data: $("#sign-up-form").serialize(),
		success: function(data){
			// alert("SENDING")
			console.log(data);
		},
		error: function(data, status, error) {
		  alert(data.responseText);
		}

	});

	$('#sign-up').modal('hide');
});

// $.ajax({
// 	url: 'https://community-food2fork.p.mashape.com/get?key=7265727d95515b59e5a8f7e7ec0f3d9f&rId=37859',
// 	type:'GET',
// 	data:{ recipes },
// 	datatype: 'json',
// 	success: function(data) {
// 		var searchResult = data.recipe;
// 			console.log(searchResult)
// 		},
// 	error: function(err) { alert(err) },
// 	beforeSend: function(xhr){
// 		xhr.setRequestHeader ("X-Mashape-Key", "eqGe7SasOCmshHHd4jnPnA5MeUlzp1eY22Vjsn7GvsKlYaYo5i");
// 	}

// 	});
});