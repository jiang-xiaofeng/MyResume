//index页面js
var index_fun = {
	goToR: function(){
		$('.modal-footer').remove();
		$('.modal-title').text('欢迎查看我的简历！');
		$('.close').hide();
		var $loveB = $('<button class="loveB">').appendTo('.modal-header');
		
		
		$loveB.click(function(){
			$('.close').show();
		});
		
		var $goface = $('<div class = "goface">').appendTo('.modal-body');
		var $input = $('<input class = "" placeholder="请输入你的密码">').appendTo($goface);
		$('<a href="javascript:volid(0);" class = "cusNameSub" >').appendTo($goface).click(function(){
			$input.val('朋友你还是退回去吧');
		});
		
		$('<a class = "backChoose">X</a>').appendTo('.modal-header').click(function(){
			$('.close').click();
		});
    }
};