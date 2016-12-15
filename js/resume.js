$(function(){
	var $right_body_re = $('#right_body_re');
	
	//自我介绍
	$('.a-btn-slide-int').click(function(){
		$right_body_re.empty();
		var $introduceMe = $('<div id="introduceMe" class="introduceMe mine_re"></div>');
		var $intr_bg = $('<div class="intro_bg"></div>').appendTo($introduceMe);
		$introduceMe.appendTo($right_body_re);
	});
	//教育经历
	$('.a-btn-slide-edu').click(function(){
		$right_body_re.empty();
		var $edu_experience = $('<div id="edu_experience" class="edu_experience mine_re"></div><span class="a-btn-slide-int a-btn-slide">自我介绍</span>');
		$edu_experience.appendTo($right_body_re);
	});
	//工作经历
	$('.a-btn-slide-wor').click(function(){
		$right_body_re.empty();
		var $work_experience = $('<div id="work_experience" class="work_experience mine_re"></div>');
		$work_experience.appendTo($right_body_re);
	});
	//技能描述
	$('.a-btn-slide-abi').click(function(){
		$right_body_re.empty();
		var $ability = $('<div id="ability" class="ability mine_re"></div>');
		$ability.appendTo($right_body_re);
	});
	
	
});
