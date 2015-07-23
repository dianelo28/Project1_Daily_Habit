$(document).ready(function(){

	$(document).ready(function() {
	        $("body").css("display", "none");
	        $("body").fadeIn(2000);
	});


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
		welcome.innerHTML = 'Hi ' + user.firstName + "! Here's what you need to do today!" ;

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

$('.logOutButton').on('click', function(){

	$.ajax({
		url:'/logout',
		type: 'GET',
		sucess: function(){
			window.reload(true);
		}
	});
});

$('.nav-tabs > li > a').click(function(event){

	//get displaying tab content jQuery selector
	var active_tab_selector = $('.nav-tabs > li.active > a').attr('href');
	 
	//hide displaying tab content
	$(active_tab_selector).fadeOut(1000);
	$(active_tab_selector).removeClass('active');
	$(active_tab_selector).addClass('hide');


	//find actived navigation and remove 'active' css
	var actived_nav = $('.nav-tabs > li.active');
	actived_nav.removeClass('active');

	//add 'active' css into clicked navigation
	$(this).parents('li').addClass('active');

	var target_tab_selector = $(this).attr('href');
	$(target_tab_selector).fadeIn(1000);
	$(target_tab_selector).removeClass('hide');
	$(target_tab_selector).addClass('active');
});
});
	
