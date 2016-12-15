/**

 * 窗体上沿下浮提示信息，id为窗体附着的载体，默认为页面body
 * 使用样例
 * Message.show('message', {cls: 'warning'});
 * 样式参考bootstrap的alert样式。
 */
var DEFAULT_DEVICE_TYPE = '基本类';
var Message = {
		TEXT:{
			NO_CREATEDTO:'当前角色与分类没有配置关系，请联系管理员！',
			NO_TARGET:'当前角色与版面没有配置关系，请联系管理员！'
		},
		defaults: {
			cls: 'warning',
			closable: false,
			lifecycle: 5000
		},
		danger : function(text, closable) {
			this.show(text, {cls: 'danger', closable: closable || false});
		},
		warn : function(text, closable) {
			this.show(text, {cls: 'warning', closable: closable || false});
		},
		info : function(text, closable) {
			this.show(text, {cls: 'info', closable: closable || false});
		},
		success : function(text, closable) {
			this.show(text, {cls: 'success', closable: closable || false});
		},
		show : function(text, opt){
			var div = $('.message-alert');
			//默认值不用修改，修改新对象并返回
			var options = $.extend(true, {}, this.defaults, opt);
			if(options.id){
				div = $('<div>').addClass('alert alert-'+ options.cls + ' message-alert').appendTo($(options.id));
			} else {
				div = $('<div>').addClass('alert alert-'+ options.cls + ' message-alert').appendTo('body');
			}
			div.empty();
			//alert-dismissable和close两个类配合使用，用于关闭按钮样式
			if(!options.closable){
				div.removeClass('alert-dismissable');
			} else {
				div.addClass('alert-dismissable');
				$('<button>').addClass('close').attr('data-dismiss', 'alert').attr('aria-hidden', true).html('&times;').appendTo(div);
			}
			$('<strong>').html(text).attr('title', text).appendTo(div);			
			
			div.slideDown(400, function(){
				if($('#silverlightControlHost').length > 0) {
					// 当有Silverlight时，hack一下，加个垫片以盖住windowless=false的Silverlight层
					var dpop = $('.message-alert');
					var l = dpop.offset().left, t = dpop.offset().top;
					var mask = $('<iframe>').appendTo('body').css({
							position: 'absolute',
							border: 'none',
							borderRadius: '7px',
							zIndex: 1059,
							left: l + 'px',
							top: t + 'px'
						}).width(dpop.width() + 20).height(dpop.height() + 12);
					$('.message-alert').data('mask', mask);
				}
				
				if(!options.closable) {
					window.setTimeout(function(){
						if($('#silverlightControlHost').length > 0) {
							$('.message-alert').data('mask').remove();
						}
						div.fadeOut(500);
						div.remove();
					}, options.lifecycle);
				}
			});
		}
};
var noRecord = '<div class=nodata-p><div class=nodata-c><small class=text-muted>抱歉，暂无数据！</small></div></div>';
/**
 * 对话框初始化 
 * var dialog = Dialog.init();
 * 对话框标题
 * dialog.find('.modal-title').html('此处填入标题');
 * 对话框的body，内容
 * var html = '<p>这里是我的body的内容</p><div style="height: 900px; width: 300px;">撑死他！</div>';
 * $(html).appendTo(dialog.find('.modal-body'));
 * 添加自定义按钮及其事件
 * $('<button class="btn btn-success">自定义按钮</button>').click(function(){
 * 		alert('我靠，你真点啊！');
 * }).appendTo(dialog.find('.modal-footer'));
 * 确定按钮事件
 * dialog.find('.btn-submit').click(function(){
 * 		alert('执行确定按钮的事件');
 * });
 * 
 */
var Dialog = {
	init: function(){
		var dlgHtml = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
			<div class="modal-dialog modal-lg">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>\
						<h4 class="modal-title">对话框标题</h4>\
					</div>\
					<div class="modal-body"></div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-link" data-dismiss="modal">取消</button>\
						<button type="button" class="btn btn-primary btn-submit">确定</button>\
					</div>\
				</div>\
			</div>\
		</div>';
		var dialog = $(dlgHtml).appendTo('body');
		dialog.modal({
			backdrop : 'static'
		});
		/**
		 * 避免页面出现多个模态框
		 */
		dialog.on('hidden.bs.modal', function () {
			dialog.remove();
		});
		return dialog;
	}
};

/**
 * 弹出框的媒体播放器
 * @author wang chuxiong
 * titlename 标题名字
 * path 文件路径
 * type 文件类型
 *
 */
var MediaPlayer = {
		show : function(titlename,path,type){
			var dialog = Dialog.init();
			dialog.addClass('media-player');
			dialog.find('.modal-title').text(titlename);
			dialog.find('.modal-header').addClass('playerHead');
			var body = dialog.find('.modal-body');
			if(type=='video'||type=='audio'){
				body.removeClass('movie pic').addClass('movie');
				var $html =$('<video class="movieclip" controls="controls" autoplay="autoplay"><source></video>');
				$html.appendTo(body).find('source').attr('src', path);
			}else if(type=='picture'){
				body.removeClass('movie pic').addClass('pic');
				$('<img/>').appendTo(body).attr('src', path);
			}
			dialog.find('.btn.btn-link').remove();
			dialog.find('.btn-submit').attr("data-dismiss","modal"); 
		},
		carouselShow: function(files, activeFile) {
			var dialog = Dialog.init();
			dialog.addClass('media-player');
			dialog.find('.modal-title').text('ss');
			dialog.find('.modal-header').addClass('playerHead');
			var body = dialog.find('.modal-body');
			var id = 'carousel-yoson';
			var carousel = $('<div class="carousel slide" data-ride="carousel" data-interval="false">').attr('id', id);
			var ol = $('<ol class="carousel-indicators">').appendTo(carousel);
			
			var list = $('<div class="carousel-inner" role="listbox">').appendTo(carousel);
			$(files).each(function(index, file){
				var li = $('<li data-target="#'+id+'">').attr('data-slide-to', index).appendTo(ol);
				var div = $('<div class="item">').appendTo(list);
				var fileID = file.fileID;
				var type = file.mediaType;
				var path = '/web/api/asset/file/' + fileID + '?time=' + new Date().getTime();
				if(type == 'video'){
					var video =$('<video class="movieclip" controls="controls">').appendTo(div);
					$('<source>').attr('src', path).appendTo(video);
				} else if(type == 'picture'){
					$('<img/>').attr('src', path).appendTo(div);
				} else if(type == 'audio'){
					var $html =$('<audio class="audioclip" controls="controls">').appendTo(div);
					$('<source>').attr('src', path).appendTo($html);
				} else if(file.fileName.toLowerCase().endWith('.pdf')){
					var path = path + '.pdf';
					var pdf = $('<a class="media {width:1000;height:800}">').attr('href', path).appendTo(div);
//					pdf.media();
					//div.data('pdf', pdf);
				}
				if( file.fileID == activeFile ){
					li.addClass('active');
					div.addClass('active');
					if(div.find('video').length > 0){
						div.find('video').get(0).play();
					}
					div.find('.media').media();
				}
			});
			
			var html = '<a class="left carousel-control" href="#'+id+'" role="button" data-slide="prev">\
				<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>\
				<span class="sr-only">Previous</span>\
			</a>\
			<a class="right carousel-control" href="#'+id+'" role="button" data-slide="next">\
				<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>\
				<span class="sr-only">Next</span>\
			</a>';
			$(html).appendTo(carousel);
			carousel.on('slid.bs.carousel', function (e) {
				$($(this).find('video')).each(function(index, item){
					item.pause();
				});
				if($(e.relatedTarget).find('video').length > 0){
					$(e.relatedTarget).find('video').get(0).play();
				}
				$(e.relatedTarget).find('.media').media();
			});
			carousel.appendTo(body);
		},
		//jquery media 
		mediaShow: function(files){
			var $show = $('.media-container');
			if($show.length == 0){
				$show = $('<div class="media-container"></div>');
				$show.appendTo('body');
			}else{
				$show.empty();
			}
			var back = $show.find('.media-back');
			if(back.length == 0){
				back = $('<div class="media-back"><div class="big-close">&times;</div></div>').appendTo('body');
			}
			back.click(function(){
			    	$(this).hide();
			    	$show.hide();
			    });
			var file = files[0];
			var fileID = file.fileID;
//			var type = file.fileCategoryID;
			var path = '/web/api/asset/file/' + fileID + '?time=' + new Date().getTime() + '.pdf';
			
			var pdf = $('<a class="media {width:1000, height:800}">').attr('href', path).appendTo($show);
			pdf.media();
			//$show.find('.media')//.css('z-index', '9999');
			
			$show.show();
		}
};


/**
 * 数字格式化为文件大小
 * @author yoson
 *
 */
Number.prototype.getFileSizeString = function() {
	var n = parseInt(this), s = '';
	for (var arr = [ "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ], m = 0, res = n / 1024; res > 1; res /= 1024, m++) {
		s = res.toFixed(2) + " " + arr[m];
	}
	if(n < 1024){
		s = n + 'B';
	}else if(n === 1024){
		s = "1KB"
	}
	return s;
};
/**
 * 获取码率
 * @returns {String}
 */
Number.prototype.getBitRateString = function() {
	var n = parseInt(this), s = '';
	for (var arr = [ "Kbps", "Mbps", "Gbps", "Tbps", "Pbps", "Ebps", "Zbps", "Ybps" ], m = 0, res = n / 1024; res > 1; res /= 1024, m++) {
		s = res.toFixed(2) + " " + arr[m];
	}
	if(n < 1024){
		s = n + 'bps';
	}else if(n === 1024){
		s = "1Kbps"
	}
	return s;
};

String.prototype.startWith = function(str){     
	return new RegExp("^"+str).test(this);        
}; 
	 
String.prototype.endWith = function(str){     
	return new RegExp(str+"$").test(this);        
};

/**
 * 11位手机号验证
 */
String.prototype.isMobilePhone = function() {
	var reg = new RegExp('^1\\d{10}$');
	return reg.test(this);
};

String.prototype.ellipsis = function(limit) {
	var num=0, str = '', tail = '';
	for (var i=0; i <this.length; i++){ 
		if(this.charCodeAt(i)> 127 || this.charCodeAt(i) <0) num+=2; 
		else num++;
		if(num > limit) {
			tail = '...';
			break;
		}
		str += this.charAt(i);
	}
	return str + tail;
};

Number.prototype.toStorageString = function() {
	var n = this, s = '0';
	for (var arr = [ "K", "M", "G", "T", "P", "E", "Z", "Y" ], m = 0, res = n / 1024; res >= 1; res /= 1024, m++) {
		s = res.toFixed(1) + " " + arr[m];
	}
	return s;
};
Number.prototype.toTimeSpanString = function() {
	if(this < 1000) {
		return '<1秒';
	}
	var d = new Date(this), s = '';
	if(d.getUTCHours() != 0) {
		s += d.getUTCHours() + '小时';
		if(d.getSeconds() != 0) {
			s += d.getMinutes() + '分' + d.getSeconds() + '秒';
		} else {
			s += d.getMinutes() + '分钟';
		}
	} else {
		if(d.getSeconds() != 0) {
			if(d.getMinutes() != 0) {
				s += d.getMinutes() + '分';
			}
			s += d.getSeconds() + '秒';
		} else {
			s += d.getMinutes() + '分钟';
		}
	}
	
    return s;
};

Date.prototype.DateAdd = function(strInterval, num) {   
    var dtTmp = this;  
    switch (strInterval) {   
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * num));  
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * num));  
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * num));  
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * num));  
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * num));  
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'y' :return new Date((dtTmp.getFullYear() + num), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    }  
};
function GPSUtil(){
	
}
GPSUtil.tranformStr = function(lon,lat){
	function _fun(l){
		var reg = new RegExp('^(-)?(\\d*°)( \\d*\')?( \\d*.?\\d*")?$');
		var f = 0;
		if(reg.test(l)){
			var r = reg.exec(l);//["30° 42' 2.08"", undefined, "30°", " 42'", " 2.08""]
			if(r[2]){
				var t = r[2].substring(0,r[2].length-1);
				f = parseInt(t);
			}
			if(r[3]){
				var t = r[3].substring(1,r[3].length-1);
				f = f + parseInt(t)/60;
			}
			if(r[4]){
				var t = r[4].substring(1,r[4].length-1);
				f = f + parseFloat(t)/3600;
			}
			if(r[1]){
				f = 0-f;
			}
		}
		return f;
	}
	if(lat){
		return _fun(lon) + "" + "," + _fun(lat) + "";
	}else{
		return _fun(lon) + "";
	}
};
Number.prototype.toTimeString = function(speechrate) {
	//TODO sunwei
	var hour=parseInt((this)/speechrate/60)<10?'0'+parseInt((this)/speechrate/60):parseInt((this)/speechrate/60);
	var min=parseInt((this)/speechrate)%60<10?'0'+parseInt((this)/speechrate)%60:parseInt((this)/speechrate)%60;
	var sec=parseInt((this)/speechrate*60)%60<10?'0'+parseInt((this)/speechrate*60)%60:parseInt((this)/speechrate*60)%60;
	var s=hour+':'+min+':'+sec;
    return s;
};
/**
 * 将js对象转换为href请求参数
 */
var parseHrefParam = function(param, key) {
	var paramStr = "";
	if (param instanceof String || param instanceof Number
			|| param instanceof Boolean) {
		paramStr += "&" + key + "=" + encodeURIComponent(param);
	} else {
		$.each(param, function(i) {
			var k = key == null ? i : key
					+ (param instanceof Array ? "[" + i + "]" : "." + i);
			paramStr += '&' + parseHrefParam(this, k);
		});
	}
	return paramStr.substr(1);
};
function getUrlParam(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) {
		return unescape(r[2]); 
	}
	return null;
}

// 获取长度为len的随机字符串
function getRandomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	var maxPos = $chars.length;
	var str = '';
	for (var i = 0; i < len; i++) {
		str += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return str;
}
//验证字符串是否url格式
function CheckUrl(str) { 
	var RegUrl = new RegExp(); 
	RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
	if (!RegUrl.test(str)) { 
		return false; 
	} 
	return true; 
} 
/**
 * 下载文件
 * @author fuleisen
 * @param pathURL
 */
function saveAs(pathURL) {
	var $link = $('#link_saveAs');
	if ($link.length == 0) {
		$link = $('<a id="link_saveAs" style="display:none" target="_black" href="#"><span></span></a>');
		$link.appendTo('body');
	}
	$link.prop('href', pathURL);
	$link.attr('download', pathURL.substring(pathURL.lastIndexOf('/')));//html5属性，下载文件时必须
	$link.find('span').click();
}
/**
 * 日期格式化
 * 
 * @param format
 * @returns
 */
Date.prototype.format =function(format) {
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth() + 3 ) / 3), //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1, (this.getFullYear() + "").substr( 4 - RegExp.$1.length));
	}
		
	for(var k in o)if(new RegExp("("+ k +")").test(format)){
		format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	}
	return format;
};
/**
 * （类似线索库）检索条件公用JS封装，调用请参考线索库
 */
function SourceFilter(){};
SourceFilter.prototype = {
		isRadio:false,// 单选或者多选
		_sourceTrDemo:'<tr class="${trClass}"><td>${trLabel}</td><td></td></tr>',// 线索筛选条件tr模板
		_sourceADemo:'<a class="btn btn-link btn-xs">${source}</a>',// 线索筛选条件a模板
		init:function(datas,dateField){
			$table = $(".filter_link table");
			$table.empty();
			for(var i=0;i<datas.length;i++){
				var $tr = this.appendTr($table,datas[i].src_type);
				var $td = $tr.find("td:last");
				this.appendAs($td,datas[i].data);
				$td.append(datas[i].html);
			};
			//处理以保存的检索条件
			var body_id = $('body').prop('id');
			var filter_saved = localStorage.getItem('nova_'+body_id+'_filter_saved');
			if(filter_saved){
				var filterSavedArr = JSON.parse(filter_saved);
				for(i in filterSavedArr){
					var $tag = $("#filter_selected").addTag(filterSavedArr[i].text);
					if(filterSavedArr[i].parentData){
						$tag.data('parentData',filterSavedArr[i].parentData);
					};
					$tag.data('data',filterSavedArr[i].data);
					$tag.data('key',filterSavedArr[i].key);
					this.select(filterSavedArr[i].data.value);
				};
				this.toggleTag(true);
			};
			/**
			 * 时间筛选控件
			 */
			if($('#btn-date-ok').length>0){
				$('#input-date-start').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				$('#input-date-end').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				var oldDate = '';
				var obj = this;
				$('#btn-date-ok').click(function(){
					var start = $('#input-date-start').val();
					var end = '';
					if( $('#input-date-end').val() == undefined){
						end = start;
					} else {
						end = $('#input-date-end').val();
					}
					if(start.trim()==''||end.trim()==''){
						return;
					};
					//日期有变化时，删除Tag，移除active
					if(oldDate != start+','+end){
						$(this).removeClass('active');
						$("#filter_selected").deleteTagByKey(oldDate);
					};
					//处理确定按钮与标签同步
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						$("#filter_selected").deleteTagByKey(start+','+end);
					}else{
						if(obj.isRadio){
							obj.onlyResetFilter();
						};
						var $tag = $("#filter_selected").addTag(start+" - "+end);
						var data = {
								source : start+" - "+end,
								value : start+','+end,
								field:dateField,
								data : [ ]
						};
						$tag.data('data',data);
						$tag.data('key',start+','+end);
						$(this).data('data',data);
						$(this).addClass('active');
						oldDate = start+','+end;
					};
					obj.toggleTag();
				});
			}
			/**
			 * 名字输入控件
			 */
			if($('#btn-searchName-ok').length>0){
				var oldName = '';
				var obj = this;   
				$('#btn-searchName-ok').click(function(){
					var name = $('#search-name').val();
					if(name.trim()==''){
						return;
					};
					//日期有变化时，删除Tag，移除active
					if(oldName != name){
						$(this).removeClass('active');
						$("#filter_selected").deleteTagByKey(oldName);
					};
					//处理确定按钮与标签同步
					if($(this).hasClass('active')){
						$(this).removeClass('active');
						$("#filter_selected").deleteTagByKey(name);
					}else{
						if(obj.isRadio){
							obj.onlyResetFilter();
						};
						var $tag = $("#filter_selected").addTag(name);
						var data = {
								source : name,
								value : name,
								field:'itemfieldvalue',
								data : [ ]
						};
						$tag.data('data',data);
						$tag.data('key',name);
						$(this).data('data',data);
						$(this).addClass('active');
						oldName = name;
					};
					obj.toggleTag();
				});
			}
		},
		/**
		 * 在table中添加行，并返回该行
		 */
		appendTr:function($target,trLabel){
			var tr = this._sourceTrDemo;
			tr = tr.replace('${trClass}','src_type').replace('${trLabel}',trLabel);
			var $tr = $(tr);
			$target.append($tr);
			return $tr;
			
		},
		/**
		 * 在“src_type”行下添加“src_type_child”行，判断是否已存在
		 */
		afterTr:function($target,trLabel){
			if($target.next().attr("class")!='src_type_child'){
				var tr = this._sourceTrDemo;
				tr = tr.replace('${trClass}','src_type_child').replace('${trLabel}',trLabel);
				var $tr = $(tr);
				$target.after($tr);
				return $tr;
			}else{
				$target.next().find('td:first').text(trLabel);
				return $target.next();
			}
		},
		/**
		 * 添加a标签并绑定数据
		 */
		appendA:function($target,data){
			var a = this._sourceADemo;
			a = a.replace('${source}',data.source);
			$a = $(a);
			$target.append($a);
			$a.data('data',data);// 绑定数据
			var $this = this;
			$a.hover(function(){$this.handleHoverEvent($(this));});// 绑定hover事件
			$a.click(function(){$this.handleClickEvent($(this));});// 绑定click事件
			if(this.isSelected(data.value)){
				$a.addClass('active');
			}
		},
		appendAs:function($target,datas){
			$target.empty();
			for(var i = 0;i<datas.length;i++){
				this.appendA($target,datas[i]);
			}
		},
		/**
		 * hover事件触发afterTr动作
		 * 
		 * @param e
		 */
		handleHoverEvent:function($this){
			if($this.data('data').data!=undefined&&$this.data('data').data.length>0){
				var $target = $this.closest('tr');
				var $tr = this.afterTr($target,$this.data('data').source);
				$tr.data('data',$this.data('data'));
				var $td = $tr.find("td:last");
				this.appendAs($td,$this.data('data').data);
			}else{
				 $this.closest('tr').next('.src_type_child').remove();
			}
		},
		/**
		 * click事件，选择或取消选择
		 * 
		 * @param e
		 */
		handleClickEvent:function($this){
			if($this.hasClass('active')){
				$this.removeClass('active');
				$("#filter_selected").deleteTagByKey($this.data('data').value);
			}else{
				if(this.isRadio){
					this.onlyResetFilter();
				};
				$this.addClass('active');
				var $tr = $this.closest('tr');
				var tagVal = '';
				if($tr.data('data')!=undefined){
					tagVal = tagVal+$tr.data('data').source+"：";
					// 选子cancel父级
					this.cancelSelected($tr.data('data').value);
					$("#filter_selected").deleteTagByKey($tr.data('data').value);
				}else{
					// 选父cancel子级
					if($this.data('data').data!=undefined){
						for(var i =0;i<$this.data('data').data.length;i++){
							this.cancelSelected($this.data('data').data[i].value);
							$("#filter_selected").deleteTagByKey($this.data('data').data[i].value);
						}
					}
				}
				var $tag = $("#filter_selected").addTag(tagVal+$this.data('data').source);
				$tag.data('data',$this.data('data'));
				if($tr.data('data')!=undefined){
					$tag.data('parentData',$tr.data('data'));
				}
				$tag.data('key',$this.data('data').value);
			};
			this.toggleTag();
		},
		/**
		 * 选中节点
		 * @param val
		 */
		select:function(val){
			var platformEle = $(".filter_link a");
			for(var i = 0;i<platformEle.length;i++){
				if($(platformEle[i]).data('data')&&$(platformEle[i]).data('data').value==val){
					$(platformEle[i]).addClass('active');
					break;
				}
			}
		},
		/**
		 * 取消选择
		 * 
		 * @param val
		 */
		cancelSelected:function(val){
			var activePlatformEle = $(".filter_link .active");
			for(var i = 0;i<activePlatformEle.length;i++){
				if($(activePlatformEle[i]).data('data').value==val){
					$(activePlatformEle[i]).removeClass('active');
					break;
				}
			}
		},
		/**
		 * 取消所有选择
		 * 
		 * @param val
		 */
		resetSelected:function(){
			var activePlatformEle = $(".filter_link .active");
			for(var i = 0;i<activePlatformEle.length;i++){
				$(activePlatformEle[i]).removeClass('active');
			}
		},
		/**
		 * 检测是否被选择
		 * 
		 * @param val
		 */
		isSelected:function(val){
			var flag = false;
			$("#filter_selected .tag-2").each(function(index, item){
				if($(item).data('key')==val){
					flag =  true;
					return;
				}
			});
			return flag;
		},
		/**
		 * 重置所有筛选条件
		 */
		resetFilter:function(){
			this.onlyResetFilter();
			this.toggleTag();
		},
		/**
		 * 仅仅重置所有筛选条件
		 */
		onlyResetFilter:function(){
			$("#filter_selected").setData([]);//重置已选择
			var body_id = $('body').prop('id');
			localStorage.setItem('nova_'+body_id+'_filter_saved', JSON.stringify(new Array()));//清空已保存
			this.resetSelected();//清空选中
		},
		/**
		 * 保存检索条件
		 */
		saveFilter:function(){
			var filterSavedArr = new Array();
			$("#filter_selected .tag-2").each(function(index, item){
				filterSavedArr.push({
						key:$(item).data('key'),
						text:$(item).find('span:first').text(),
						parentData:$(item).data('parentData'),
						data:$(item).data('data')
				});
			});
			var body_id = $('body').prop('id');
			localStorage.setItem('nova_'+body_id+'_filter_saved', JSON.stringify(filterSavedArr));
		},
		/**
		 * 控制已选标签栏目是否显示
		 */
		toggleTag:function(flag){
			if($("#filter_selected .tag-2").length!=0&&!this.isRadio){
				$(".filter_link > .rows").show();
			}else{
				$(".filter_link > .rows").hide();
			}

			if(!flag)
				this.change();
		},
		setIsRadio:function(isRadio){
			this.isRadio = isRadio;
		},
		change:function(){
			
		}
};

/**
 * 与浏览器相关的工具类
 */
var BrowserHelper = {
		getBrowserInfo : function () {
		    var agent = navigator.userAgent.toLowerCase();
		    var regStr_ie = /msie [\d.]+;/gi;
		    var regStr_ff = /firefox\/[\d.]+/gi
		    var regStr_chrome = /chrome\/[\d.]+/gi;
		    var regStr_saf = /safari\/[\d.]+/gi;
		    //IE
		    if (agent.indexOf("msie") > 0) {
		        return agent.match(regStr_ie);
		    }

		    //firefox
		    if (agent.indexOf("firefox") > 0) {
		        return agent.match(regStr_ff);
		    }

		    //Chrome
		    if (agent.indexOf("chrome") > 0) {
		        return agent.match(regStr_chrome);
		    }

		    //Safari
		    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
		        return agent.match(regStr_saf);
		    }
		},
		getBrowserVerinfo : function(){
			var browser = BrowserHelper.getBrowserInfo();
			var verinfo = (browser + "").replace(/[^0-9.]/ig, "");
			return verinfo;
		}
};

/**
 * 与会话相关的工具函数类
 * @author sunwei
 */
var SessionHelper = {
	/**
	 * 判断当前用户会话的一个或多个权限
	 * 根据浏览器本地存储存放的session判断
	 * 
	 * @param key 如果是String，直接返回true或false，如果Array，则返回一个对象
	 */
	canDO : function(key/* or keys */){
		var session = this.getCurrentSession();
		if(!key) {
			return false;
		} else if('string' === typeof(key)) {
			return session && (session.userID === 'admin' || !!session.permissions[key]);
		} else if('object' === typeof key && key instanceof Array) {
			var result = {};
			$(key).each(function(index, item){
				result[item] = session && (session.userID === 'admin' || !!session.permissions[item]);
			});
			return result;
		} else {
			return false;
		}
	},
	getRoleNames: function() {
		var session = this.getCurrentSession();
		if(!session) {
			return [];
		} else {
			return session.roleNames;
		}
	},
	// 私有成员变量，不允许SessionHelper.__currentSession 调用
	__currentSession : null,
	// 第一步，加载session成功，记录下来
	setSession: function(session) {
		localStorage.setItem('nova_session', JSON.stringify(session));
		this.__currentSession = session;
	},
	getCurrentSession: function() {
		return this.__currentSession || JSON.parse(localStorage.getItem('nova_session'));
	},
	// 第二步，加载permissions成功，附到session上记录下来
	setPermissions: function(session, roleList, otherAttributes) {
		session = session || SessionHelper.getCurrentSession();
		if(!session) {
			throw new Error('会话重整失败');
		}
		// 整理角色权限
		var roleIDs=[], roleNames=[], map={}, permissions = {};
		$(roleList).each(function(index, role){
			if(!map[role.roleID]) {
				map[role.roleID] = role;
				roleIDs.push(role.roleID);
			}
			if(!map[role.roleName]) {
				map[role.roleName] = role;
				roleNames.push(role.roleName);
			}
			$(role.permissionList).each(function(i, permission){
				permissions[permission.permission] = permission.permission;
			});
		});
		session.permissions = permissions;
		session.roleIDs		= roleIDs;
		session.roleNames	= roleNames;
		// 添加其他属性
		session.otherAttrs = otherAttributes;
		if(location.pathname !== '/web/sites/syscfg/index.html' && $(document).data('json-error') !== 'Y'){
			try{
				session.attrCreatedTos	= JSON.parse(otherAttributes['attrCreatedTos']);
				session.attrActsNameOptions	= __filterForRole(otherAttributes['activityname.interview.role.relation.default'], roleNames);
				session.attrCreatedTos_r	= JSON.parse(otherAttributes['attrCreatedTos_r']);
				session.attrTargets		= JSON.parse(otherAttributes['attrTargets']);
				session.assetFacetOrder = JSON.parse(otherAttributes['asset.facet.order']);
			}catch(e){
				Message.danger('json配置格式不正确，请联系管理员配置!');
				//增加权限判断
				if(session.permissions['系统配置/系统初始化']){
					setTimeout(function(){
						location.href = '/web/sites/syscfg/index.html';
					}, 3000);
				}
				$(document).data('json-error', 'Y');
			}
		}else{
			$(document).removeData('json-error');
			return;
		}
		
		delete otherAttributes['attrCreatedTos'];
		delete otherAttributes['attrCreatedTos_r'];
		delete otherAttributes['attrTargets'];
		delete otherAttributes['activityname.interview.role.relation.default'];
		delete otherAttributes['asset.facet.order'];
		
		this.setSession(session);
		
		// 预编译函数，可以在函数定义代码之前调用
		/** @memberOf SessionHelper */
		function __filterForRole(strAttrValue, roleNames) {
			if(!strAttrValue) return [];
			var attrValue = JSON.parse(strAttrValue);
			var arr = [], set = {};
			$(roleNames).each(function(index,roleName){
				arr = arr.concat(attrValue[roleName] || []);
			});
			// 当前用户角色没有对应的配置信息时，展示全部
//			if(arr.length <=0 ) {
//				for(var key in attrValue){
//					arr = arr.concat(attrValue[key] || []);
//				}
//			}
			return $.map(arr, function(item){
				return set[item] ? null : (set[item] = item);
			});
		};
	},
	// 第三步，加载enums成功，附到session上记录下来
	setEnums: function(enums) {
		localStorage.setItem('nova_enums', JSON.stringify(enums));
		DEFAULT_DEVICE_TYPE = enums['资源分类'][0];
	},
	//加载当前用户所在部门
	setOrgs: function(session, orgList){
		session = session || SessionHelper.getCurrentSession();
		if(!session) {
			throw new Error('会话不存在，不能存储当前组织!');
		}
		session.currentOrgs = orgList;
		this.setSession(session);
	},
	setBaseAttributes: function(session, baseAttriList){
		session = session || SessionHelper.getCurrentSession();
		if(!session) {
			throw new Error('会话不存在，不能存储基础属性!');
		}
		session.baseAttributes = {};
		if($(document).data('json-error') === 'Y'){
			$(document).removeData('json-error');
			return;
		}
		$(baseAttriList).each(function(i, item){
			session.baseAttributes[item.attributeName] = item;
			try{
				var rjson = /\{[^}]*\}|\[[^]]*\]/;
				if(rjson.test(item.attributeValue)){
					JSON.parse(item.attributeValue);
				}
			}catch(e){
				Message.danger(item.attributeName + '配置的JSON格式不对，请重新配置!');
				$(document).data('json-error', 'Y');
				return false;
			}
		});
		this.setSession(session);
	},
	isOriginalFileAccessAllowed: function() {
		var session = SessionHelper.getCurrentSession();
		return session && session.otherAttrs && session.otherAttrs['isOriginalFileAccessAllowed'] === 'true';
	},
	isPreviewFileAccessAllowed: function() {
		var session = SessionHelper.getCurrentSession();
		return session && session.otherAttrs && session.otherAttrs['isPreviewFileAccessAllowed'] === 'true';
	},
	getTopicCreatedTos: function() {
		var session = SessionHelper.getCurrentSession();
		return session.attrCreatedTos || [];
	},
	getTitleTarges: function() {
		var session = SessionHelper.getCurrentSession();
		return session.attrTargets || [];
	}
};
var selectboxHelper = {
	/**
	 * 构建下拉框
	 */
	buildSelect:function($sel,options,value){
		$sel.empty();
		for(var i=0;i<options.length;i++){
			if(value==options[i].value){
				$sel.append('<option selected value="'+options[i].value+'">'+options[i].key+'</option>');
			}else{
				$sel.append('<option value="'+options[i].value+'">'+options[i].key+'</option>');
			}
		}
	},
	buildDeviceSelect:function($html,device){
		var enums = null;
		var deviceTypes = [];
		var deviceModels = [];
		if(localStorage.getItem('nova_enums')){
			enums = JSON.parse(localStorage.getItem('nova_enums'));
			$(enums['资源分类']).each(function(index, item){
				deviceTypes.push({key:item,value:item});
			});
			var deviceType = deviceTypes[0].value;
			if(device.deviceType!=''){
				deviceType = device.deviceType;
			}
			$(enums[deviceType+'(设备)']).each(function(index, item){
				deviceModels.push({key:item,value:item});
			});
		};
		selectboxHelper.buildSelect($html.find("select[name='deviceType']"),deviceTypes,device.deviceType);
		selectboxHelper.buildSelect($html.find("select[name='deviceModel']"),deviceModels,device.deviceModel);
		$html.find("select[name='deviceType']").change(function(e){
			var deviceModels = [];
			$(enums[$(this).val()+'(设备)']).each(function(index, item){
				deviceModels.push({key:item,value:item});
			});
			selectboxHelper.buildSelect($html.find("select[name='deviceModel']"),deviceModels);
		});
	},
	buildUserSelect:function($html,user){
		var enums = null;
		var userTypes = [];
		var userModels = [];
		if(localStorage.getItem('nova_enums')){
			enums = JSON.parse(localStorage.getItem('nova_enums'));
			$(enums['资源分类']).each(function(index, item){
				userTypes.push({key:item,value:item});
			});
			var userType = userTypes[0].value;
			if(user.userType!=''){
				userType = user.userType;
			}
			$(enums[userType+'(人员)']).each(function(index, item){
				userModels.push({key:item,value:item});
			});
		};
		selectboxHelper.buildSelect($html.find("select[name='userType']"),userTypes,user.userType);
		selectboxHelper.buildSelect($html.find("select[name='userModel']"),userModels,user.userModel);
		$html.find("select[name='userType']").change(function(e){
			var userModels = [];
			$(enums[$(this).val()+'(人员)']).each(function(index, item){
				userModels.push({key:item,value:item});
			});
			selectboxHelper.buildSelect($html.find("select[name='userModel']"),userModels);
			$html.find("select[name='userModel']").change();
		});
	}
	
};
/**
 * 与资产相关的工具函数类
 * @author sunwei
 */
var AssetHelper = {
	/**
	 * 将List形式的资产属性转换成key-value的Map形式
	 * @param arr
	 * @returns
	 */
	toAttributeValueMap: function(arr) {
		var map = {};
		$(arr).each(function(index, attr){
			map[attr.attributeDefID] = attr.dataValue;
		});
		return map;
	},
	/**
	 * 将List形式的资产属性转换成key-attr的Map形式
	 * @param arr
	 * @returns
	 */
	toAttributeMap: function(arr) {
		var map = {};
		$(arr).each(function(index, attr){
			map[attr.attributeDefID] = attr;
		});
		return map;
	},
	/**
	 * 选题引用线索 报道引用选题
	 */
	NOVA_RELATION_REF : 10,
	/**
	 * 线索、选题、报道包含素材
	 */
	NOVA_RELATION_INCLUDE : 11,
	/**
	 * 子报道继承（扩展）报道
	 */
	NOVA_RELATION_DERIVE : 12,
	/**
	 * 成片来源于报道
	 */	
	NOVA_RELATION_ROOTIN : 13,

	// 反向关系，不记录到数据库
	NOVA_RELATION_REF_BY : 100,
	NOVA_RELATION_INCLUDE_BY : 101,
	NOVA_RELATION_DERIVE_BY : 102,
	NOVA_RELATION_ROOTIN_BY : 103,
	/**
	 * 在资产的全部文件列表中，寻找预览文件
	 * 优先显示预览文件，如果没有预览文件可以显示支持预览的原始文件
	 * @param files
	 */
	findPreviewFiles: function(fileList) {
		// 先找到所有预览文件和原始文件
		var previewFiles = [], previewFilesForType = [];
		$(fileList).each(function(index, fileType){
			//将pdf纳入统一预览  @yulan&1
			if(!fileType.isForPreviewing && !fileType.fileName.toLowerCase().endWith('.pdf')) {
				return;
			}
			if(fileType.isOriginal) {
				previewFilesForType.push(fileType);
				SessionHelper.isOriginalFileAccessAllowed() && previewFiles.push(fileType);
			} else {
				previewFilesForType.unshift(fileType);
				SessionHelper.isPreviewFileAccessAllowed() && previewFiles.unshift(fileType);
			}
		});
		// 根据预览文件分析文件类型
		// TODO 暂时只返回第一个预览文件，将来可以支持返回多个层的预览：原画、超清、高清、标清、流畅等。
		var previewFileID = null;
		return {
			mediaType: previewFilesForType.length <=0 ? 'unknown' : previewFilesForType[0].fileCategoryID,
			fileID : previewFiles.length <=0 ? null : previewFiles[0].fileID,
			fileName : previewFiles.length <= 0 ? null : previewFiles[0].fileName
		};
	},
	/**
	 * 获取PDF格式的报纸报刊转换后的图片文件列表
	 * @param fileList
	 */
	findPdfFiles : function(fileList){
		var files = [];
		$(fileList).each(function(i, file){
			if(file.isOriginal && file.fileName.toLowerCase().endWith('.pdf')){
				files.push(file);
			}
		});
		return files;
	},
	/**
	 * 内容库列表项渲染行
	 * 我的订阅、最新选题、今日版面、内容库的公用代码
	 * fuleisen
	 */
	renderAssertItem:function($container, asset){
		var attributes = AssetHelper.toAttributeValueMap(asset.attributeList);
		var name = attributes.assetname||'', 
			creationdate = attributes.creationdate.split('.')[0]||'', 
			submittime = attributes.submittime||creationdate,
			content = attributes.content||'', 
			thumbnailfileid = attributes.thumbnailfileid||'', 

			videoflag = attributes.videoflag === 'true', 
			audioflag = attributes.audioflag === 'true',
			picflag = attributes.picflag === 'true', 
			createdto = attributes.createdto||'', 
			target = attributes.target||'', 
			site = attributes.site||'', 
			platform = attributes.platform||'',
			channelpath = attributes.channelpath || '',
			author = attributes.author ||attributes.createdby ||'',
			tags = attributes.tags||'', 
			importlevel = attributes.secretlevel||'1', 
			refcount = attributes.refcount||'';
		
		if(platform == '社交媒体'){
			site = channelpath;
		}
		
		if(site == '路透社'){
			content = attributes.description||attributes.content||'';
		}
		
		submittime = submittime.split('.')[0];
		var $list_item = $('<div>').addClass('list-item').attr('id', asset.moID).appendTo($container);
		$list_item.data('asset', asset);
		var check = $('<a href=javascript:; class=checkbox><i class="fa fa-square-o"></i></a>').appendTo($list_item);
		check.click(function(){
			if($(this).find('i').hasClass('fa-square-o')){
				$(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
			} else {
				$(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
			}
			if($('.list_container .list-item>a>i').length == $('.list_container .list-item>a>.fa-check-square-o').length){
				$('#checkAll-1>i').removeClass('fa-square-o').addClass('fa-check-square-o');
			} else if(!$('#checkAll-1>i').hasClass('fa-square-o')){
				$('#checkAll-1>i').removeClass('fa-check-square-o').addClass('fa-square-o');
			}
		});
		var $library_left = $('<div></div>').addClass('library-left').appendTo($list_item);

		var thumbnail = '/web/api/asset/thumb/' + asset.moID + '?time=' + new Date().getTime();
		var thumb = $('<a href=javascript:;><img class="img-thumbnail"/></a>').appendTo($library_left);
		thumb.find('img').prop('src', thumbnail);
		
		var $library_content = $('<div></div>').addClass('library-content').appendTo($list_item);
		var html = '<div class="item-top">\
				<h5 class = "item-title"></h5>\
				<a class="relase-source" href="#"></a>\
				<div class="relase-time">'+submittime+'</div>\
			</div>\
			<div class="item-text"></div>\
			<div class="item-toolbar"></div>';
		$(html).appendTo($library_content);
		//根据author返回name
		
		var $title_a = $('<a>').prop('title',name).prop('href','javascript:;').html(name.trim()==''?'……':name).appendTo($library_content.find('.item-title'));
//		$('<span>').addClass('glyphicon glyphicon-list-alt').appendTo($library_content.find('.item-title'));
		if(AssetHelper.isVisited(asset.moID)){
			$title_a.addClass('text-muted');
		}
		if($('body').attr('id')=='todaytopic_library'&&'5'==importlevel){//最新选题中具备置顶相关功能
			var text = $title_a.text();
			$title_a.text('【置顶】'+text);
			$title_a.addClass('stick');
		}
		var shortContent = $('<div>').html(content).text().ellipsis(300);
		$library_content.find('.item-text').text(shortContent);
		if(picflag){
			$library_content.find('.item-title').append('<span class="glyphicon glyphicon-picture"></span>');
		}
		if(videoflag){
			$library_content.find('.item-title').append('<span class="glyphicon glyphicon-facetime-video"></span>');
		}
		if(audioflag){
			$library_content.find('.item-title').append('<span class="fa fa-volume-up"></span>');
		}
		if(refcount!=''&&refcount!='0'){
			var refcont_btn = $('<span class="refcount_btn"><a class="refcount" href="#"><i class="glyphicon glyphicon-retweet"></i> 引用(<span class="num">'+refcount+'</span>)</a></span>')
				.prependTo($library_content.find('.item-toolbar'));
			refcont_btn.find('.refcount').click(function(){
				AssetHelper.showInverseAssets(asset.moID);
			});
		}
		//TODO yoson 权限
		if(SessionHelper.canDO('页内/其他/评论内容')){
			var comment_btn = $('<span class="comment_btn"><a href="#"><i class="fa fa-comment"></i> 评论(<span class="num">0</span>)</a></span>').prependTo($library_content.find('.item-toolbar'));
			comment_btn.find('>a').click(function(){
				AssetHelper.addCommentEvent($(this), asset.moID, name);
			});
		}
		if(tags!=''){
			$library_content.find('.item-toolbar').prepend('<span class="tags" title="'+tags+'"><i class="glyphicon glyphicon-tags"></i> '+tags+'</span>');
		}
		
		$library_content.find('.item-toolbar').prepend('<div class="tags"><i class="glyphicon glyphicon-user"></i> <span></span></div>');
		Proxy.getUserDetailList(author.split(","),function(resp){
			var names=[];
			$(resp.result).each(function(i,item){
				names.push(item.userName);
			});
			if(names.length > 0){
				$library_content.find('div.tags').show();
				$library_content.find('div.tags>span')
				.text(names.join(','))
				.attr('title','作者信息')
				.data('data',resp.result).click(function(){
					AssetHelper.addUserDetailEvent($(this));
				});
			} else {
				$library_content.find('div.tags').hide();
			}
		});
		var showDetail = function(moid){
			Proxy.getAsset({moid : moid}, function(resp){
				if(resp.code != Proxy.SUCCESS){
					Message.show(resp.message, {cls: 'danger'});
					return;
				}
				var assetDescription = resp.result.assetDescription;
				ClueDetail.clueDetail(assetDescription, false, false, false);
			});
		};
		var thumbClick = function(item, type){
			$('.popover').popover('hide');
			var asset = $(item).closest('.list-item').data('asset');
			var user = SessionHelper.getCurrentSession();
			var param = {moid:asset.moID, userid: user.userID};
			Proxy.getAssetAndRelationClips(param, function(response){
				var code = response.code;
				if(code != Proxy.SUCCESS){
					Message.show(response.message+"("+code+")");
					return
				}else{
					var assetDescriptions = type !== 'clip'? response.result.relationAssets : [response.result.asset];
					var previewFiles = [];
					var firstFile;
					for(var i = 0; i < assetDescriptions.length; i++){
						var previewFile = AssetHelper.findPreviewFiles(assetDescriptions[i].fileList);
						if(previewFile.fileID){
							previewFiles.push(previewFile);
							if(!firstFile){
								firstFile = previewFile;
							}
						}
					}
					if(previewFiles.length > 0){
						MediaPlayer.carouselShow(previewFiles, firstFile.fileID);
					}else{
						if('clue' === type || 'clip' === type){
							showDetail(asset.moID);
						} else if('topic' === type){
							top.GlobalDetail.ask(function(){
								TopicDetail.show(null, asset, {editable: false},false);
							});
						} else if('title' === type){
							TitleDetail.titleDetail(asset, "内容库/报道");
						} 
					}
				}
			});
		};
		var $btn_group = $('<div>').addClass('btn-group').addClass('btn-group-xs').appendTo($library_content.find('.item-toolbar'));
		
		if(attributes.assetcategoryid=='title'&&target=='数字'){
			AssetHelper.loadKankanInfo(asset.moID); // 加载看看发布详情
		}
		
		switch (attributes.assetcategoryid) {
			case 'clue':{
				if(SessionHelper.canDO('页内/线索/收藏')){
					$('<button class="btn btn-default btn-collect"><i class="glyphicon glyphicon-heart"></i> 收藏</button>').appendTo($btn_group);
				}
				if(SessionHelper.canDO('页内/线索/采用')){
					var $adoptBtn = $('<button class="btn btn-default btn-adopt" title="加入到选题"><i class="glyphicon glyphicon-ok"></i> to选题</button>').appendTo($btn_group);
					$adoptBtn.click(function(){
						var session = SessionHelper.getCurrentSession();
						var result = session.attrCreatedTos;
						if(!result){
							result = new Array();
						}
						if(result.length==0){
							Message.warn(Message.TEXT.NO_CREATEDTO);
						}else{
							var asset = $(this).closest('.list-item').data('asset');
							var assetList = new Array();
							assetList.push(asset);
							Topic.setAssetList(assetList);
							top.GlobalDetail.ask(function(){
								Topic.create(asset, null);
							});
						}
					});
				}
				if(SessionHelper.canDO('页内/线索/推送采访任务')){
					var $sendBtn = $('<button class="btn btn-default btn-send" ><i class="fa fa-share-square-o"></i> 推送</button>').appendTo($btn_group);
					$sendBtn.click(function(){
						var asset = $(this).closest('.list-item').data('asset');
						var assetArray = new Array();
						assetArray.push(asset);
						Interviewtask.popoverInit($(this),assetArray);
					});
				}
				if(SessionHelper.canDO('页内/线索/直接采用')){
					AssetHelper.buildClueToTopicDirectAdoptBtn($btn_group,asset.moID);
				}
				
				var $rs = $list_item.find('.relase-source');
				$rs.text(site).attr('title',site);
				$rs.data('target', platform === '社交媒体'?'channelpath':'site');
				
				// 标题链接
				$list_item.find('.item-title a').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					$('.popover').popover('hide');
					AssetHelper.markVisited(asset.moID);
					$(this).addClass('text-muted');
					showDetail(asset.moID);
				});
				// 缩略图链接
				$list_item.find('.library-left a').click(function(){
					thumbClick(this, 'clue');
				});
				break;
			}
			case 'topic':{
				if($('body').attr('id')=='todaytopic_library'&&SessionHelper.canDO('页内/选题/置顶')){//最新选题具备置顶相关功能
					var $stickBtn = null;
					if('5'==importlevel){
						$stickBtn = $('<button class="btn btn-default btn-stick" data-loading-text="取消中…"><i class="glyphicon glyphicon-arrow-down"></i> 取消置顶</button>').data('moID',asset.moID).data('importlevel',1).appendTo($btn_group);
					}else{
						$stickBtn = $('<button class="btn btn-default btn-stick" data-loading-text="置顶中…"><i class="glyphicon glyphicon-arrow-up"></i> 置顶选题</button>').data('moID',asset.moID).data('importlevel',5).appendTo($btn_group);
					}
					$stickBtn.click(function(){
						var moID = $stickBtn.data('moID');
						var importlevel = $stickBtn.data('importlevel');
						var $btnTemp = $(this);
						$btnTemp.button('loading');
						Proxy.updateTopic({moid:moID,importlevel:importlevel},function(response) {
							$btnTemp.button('reset');
							var code = response.code;
							if (code != Proxy.SUCCESS) {
								Message.show(response.message + "(" + code + ")", {
									cls : 'warning'
								});
							} else {
								Message.success('操作成功！');
								search.load(true);
							}
							
						});
					});
				}
				if(SessionHelper.canDO('页内/选题/收藏')){
					$('<button class="btn btn-default btn-collect"><i class="glyphicon glyphicon-heart"></i> 收藏</button>').appendTo($btn_group);
				}
				if(SessionHelper.canDO('页内/选题/任务')){
					$('<button class="btn btn-default btn-interview"><i class="glyphicon glyphicon-plus"></i> 任务</button>').appendTo($btn_group);
				}
				if(SessionHelper.canDO('页内/选题/采用')){
					AssetHelper.buildTopicToTitleAdoptBtn($btn_group,asset.moID);
				}
				if(SessionHelper.canDO('页内/选题/加入电视版面')){
					$('<button class="btn btn-default"><i class="glyphicon glyphicon-plus"></i> 加入版面</button>').appendTo($btn_group).click(function(){
						var asset = $(this).closest('.list-item').data('asset');
						var name = '';
						if(asset){
							var attributeList = asset.attributeList;		
							for(var i = 0; i < attributeList.length; i++){				
								if(attributeList[i].attributeDefID == 'assetname'){
									name = attributeList[i].dataValue;
									break;
								}
							}
						}
						var item = {
								name : name,
								moid : asset.moID,
								remark : ''
							};
						itemToSheet.popoverItem($(this),item);
					});
				}
				
				//TODO  hh测试
				if(SessionHelper.canDO('页内/选题/to选题')){
					AssetHelper.buildTopicToTitleAdoptBtn($btn_group,asset.moID);
				}
				
				var $rs = $list_item.find('.relase-source');
				$rs.text(createdto).attr('title',createdto);
				$rs.data('target', 'createdto');
				
				// 标题链接
				$list_item.find('.item-title a').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					$('.popover').popover('hide');
					AssetHelper.markVisited(asset.moID);
					$(this).addClass('text-muted');
					top.GlobalDetail.ask(function(){
						TopicDetail.show(null, asset, {editable: false},false);
					});
				});
				// 缩略图链接
				$list_item.find('.library-left a').click(function(){
					thumbClick(this, 'topic');
				});
				// 采访
				$list_item.find('.item-toolbar .btn-interview').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					Interviewtask.createInterviewtask(asset, null, null, {interviewType:3});
				});
				break;
			}
			case 'title':{
				if(SessionHelper.canDO('页内/报道/收藏')){
					$('<button class="btn btn-default btn-collect"><i class="glyphicon glyphicon-heart"></i> 收藏</button>').appendTo($btn_group);
				}
				if(($('body').attr('id')=='title_library' || $('body').attr('id')=='todaytitle_library') &&SessionHelper.canDO('页内/报道/加入版面')){
					$('<button class="btn btn-default"><i class="glyphicon glyphicon-plus"></i> 加入版面</button>').appendTo($btn_group).click(function(){
						var asset = $(this).closest('.list-item').data('asset');
						var name = '';
						if(asset){
							var attributeList = asset.attributeList;		
							for(var i = 0; i < attributeList.length; i++){				
								if(attributeList[i].attributeDefID == 'assetname'){
									name = attributeList[i].dataValue;
									break;
								}
							}
						}
						var item = {
								name : name,
								moid : asset.moID,
								remark : ''
							};
						itemToSheet.popoverItem($(this),item);
					});
				}
				if($('.list_container').attr("issheetlist")=="true"){
					$('<button class="btn btn-default btn-xs"><i class="glyphicon"></i> 从版面中删除</button>').appendTo($btn_group).click(function(){
						var sheetid = $('.list_container').attr("sheetid");
						var thisdiv = $(this).parents(".list-item");
						var titlemoid = thisdiv.attr("id");
						if(sheetid&&titlemoid){
							Proxy.delAssetFromSheet(titlemoid, sheetid, function(resp){
								if(resp.code != Proxy.SUCCESS){
									Message.show(resp.message, {cls: 'danger'});
									return;
								}
								Message.success("删除成功");
								thisdiv.remove();
							});
						} else {
							Message.show("参数不全无法删除", {cls: 'danger'});
						}
					});
				}

				var $rs = $list_item.find('.relase-source');
				$rs.text(target).attr('title',target);
				$rs.data('target', 'target');
				
				// 标题链接
				$list_item.find('.item-title a').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					$('.popover').popover('hide');
					AssetHelper.markVisited(asset.moID);
					$(this).addClass('text-muted');
					TitleDetail.titleDetail(asset, "内容库/报道");
				});
				// 缩略图链接
				$list_item.find('.library-left a').click(function(){
					thumbClick(this, 'title');
				});
				break;
			}
			case 'clip':{
				if(SessionHelper.canDO('页内/素材/收藏')){
					$('<button class="btn btn-default btn-collect"><i class="glyphicon glyphicon-heart"></i> 收藏</button>').appendTo($btn_group);
				}
				if(SessionHelper.canDO('页内/素材/推送新媒')){
					$('<button class="btn btn-default btn-pushnewmedia"><i class="glyphicon glyphicon-cloud-upload"></i> 推送新媒</button>').appendTo($btn_group);
				}
				if(SessionHelper.canDO('页内/素材/推送AVID')){
					$('<button class="btn btn-default btn-pushavid"><i class="glyphicon glyphicon-cloud-download"></i> 推送AVID</button>').appendTo($btn_group);
				}
				
				var showDetail = function(moid){
					Proxy.getAsset({moid : moid}, function(resp){
						if(resp.code != Proxy.SUCCESS){
							Message.show(resp.message, {cls: 'danger'});
							return;
						}
						var assetDescription = resp.result.assetDescription;
						ClipDetail.clipDetail(assetDescription);
					});
				};
				
				// 标题链接
				$list_item.find('.item-title a').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					AssetHelper.markVisited(asset.moID);
					$(this).addClass('text-muted');
					showDetail(asset.moID);
				});
				//缩略图
				$list_item.find('.library-left a').click(function(){
					thumbClick(this, 'clip');
				});
				// 推送新媒按钮
				$list_item.find('.item-toolbar .btn-pushnewmedia').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					var attributes = asset.attributeList;
					var clueName = '';
					$(attributes).each(function(i, attribute){
						var id = attribute.attributeDefID;
						var val = attribute.dataValue;
						if(id=='assetname'){
							clueName = val;
							return;
						}
					});
					var param = {moid:asset.moID,taskType:4,otherAttr:0,actDefName:"新媒节目发布",taskName:"素材:" + clueName};
					Proxy.addTask(param,function(response){
						if(response.code != 0){
							Message.danger(response.message);
						}else{
							Message.success('提交成功！');
						}
					});
				});
				// 推送AVID按钮
				$list_item.find('.item-toolbar .btn-pushavid').click(function(){
					var asset = $(this).closest('.list-item').data('asset');
					var attributes = asset.attributeList;
					var clueName = '';
					$(attributes).each(function(i, attribute){
						var id = attribute.attributeDefID;
						var val = attribute.dataValue;
						if(id=='assetname'){
							clueName = val;
							return;
						}
					});
					var param = {moid:asset.moID,taskType:1,otherAttr:0,actDefName:"电视节目发布",taskName:"素材:" + clueName};

					Proxy.addTask(param,function(response){
						if(response.code != 0){
							Message.danger(response.message);
						}else{
							Message.success('提交成功！');
						}
					});	
				});
				break;
			}	
			default:{
				
				break;
			}
		}
		// 收藏按钮
		$list_item.find('.item-toolbar .btn-collect').click(function(){
			var asset = $(this).closest('.list-item').data('asset');
			var attributes = asset.attributeList;
			var name = '', description = '',assetcategoryid='';
			var objs = new Array();
			$(attributes).each(function(i, attribute){
				var id = attribute.attributeDefID;
				var val = attribute.dataValue;
				if(id=='assetname'){
					name = val;
				} else if(id=='description'){
					description = val;
				} else if(id=='assetcategoryid'){
					assetcategoryid = val;
				} 
			});
			objs.push({moID: asset.moID,
				favoriteName : name,
     			description: description});
			Business.collect(objs, assetcategoryid);
		});
		return $list_item;
	},
	/**
	 * 查看引用该资产的相关资产
	 * @author fuleisen
	 * @param $a
	 * @param moid
	 * @param name
	 */
	addRefHoverEvent:function($a, moid,name){
		var html='<ul class=" list-unstyled ul-reference">\
			      </ul>';
		$a.attr('data-title','<a  href="javascript:void(0);">引用:'+name+'</a><a class="close" href="javascript:;">×</a>');
		$a.attr('data-content',html);
		$a.popover({
			html:true,
			placement:'top',
			trigger:'manual',
			viewport:{ selector: 'body', padding: 0 }
		});
		/**
		 * 隐藏时销毁
		 */
		$a.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		$a.on('shown.bs.popover', function () {
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$a.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			//关闭按钮
			$(".popover .close").click(function(){
				$a.popover('hide');
			});
			
			$(".popover").addClass('popover-relate');
			$(".popover").css('z-index', '780');
			$('.ul-reference').showLoading();
			var param = {
				moid : moid
			};
			
			Proxy.getRefAssets(param,function(response){
				$('.ul-reference').hideLoading();
				var code = response.code;
				if(code != Proxy.SUCCESS){
					Message.show(response.message+"("+code+")");
					return
				}else{
					var list = null;
					var total = 0;
					if(response.result!=null){
						 list = response.result;
						 total = response.result.length;
					}
					if(total==0){
						var noRecord = '<div class=nodata-p><div class=nodata-c><small class=text-muted>抱歉，暂无数据！</small></div></div>';
						$(noRecord).appendTo($('.ul-reference'));
					}else{
						$(list).each(function(i, asset){
							var obj = AssetHelper.toAttributeValueMap(asset.attributeList);
							obj.creationdate = obj.creationdate.substring(0, obj.creationdate.length-2);
							var $li = '';
							if(obj && "topic" == obj.assetcategoryid && obj.createdto && obj.createdto!=''){
								$li = $('<li><a title="'+obj.assetname+'">'+obj.assetname+'</a><a class="extrainfo" title="'+obj.createdto+'">'+obj.createdto+'</a><span>'+obj.creationdate+'</span></li>');
							} else if(obj && "title" == obj.assetcategoryid && obj.columnname && obj.columnname!=''){
								$li = $('<li><a title="'+obj.assetname+'">'+obj.assetname+'</a><a class="extrainfo" title="'+obj.columnname+'">'+obj.columnname+'</a><span>'+obj.creationdate+'</span></li>');
							} else {
								$li = $('<li><a title="'+obj.assetname+'">'+obj.assetname+'</a><span>'+obj.creationdate+'</span></li>');
							}
							$('.ul-reference').append($li);
						});
					};
				};
				
			});
		});
		$a.popover('toggle');
	},
	addUserDetailEvent:function($this){
		var d = $this.data('data');
		var html = '';
		$(d).each(function(i,item){
			html = html + "姓名："+item.userName + "</br>";
			var map = {};
			for(var i in item.userPropertyList){
				map[item.userPropertyList[i].keyID] = item.userPropertyList[i].keyValue
			}
			var org = map.businessorg?map.businessorg:map.orgName;
			html = html + "部门："+ org + "</br>";
			html = html + "栏目："+map.columnName + "</br>";
			html = html + "手机："+map.cellphone + "</br>";
		});
		$this.attr('data-content',html);
		$this.popover({
			html:true,
			placement:'right',
			trigger:'manual',
			viewport:{ selector: 'body', padding: 0 }
		});
		/**
		 * 隐藏时销毁
		 */
		$this.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		/**
		 * 显示后绑定全选事件和 关闭按钮事件
		 */
		$this.on('shown.bs.popover', function () {
			
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$this.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			
			//loadUserDetail
		});
		$this.popover('toggle');
	},
	addCommentEvent:function($a, moid, name){
		//手动调节popover位置 尝试解决 popover 越界问题
		var direction = "bottom";//默认向下弹出
		if($a){
			var topheight = $a.offset().top;//弹出popover元素的X坐标位置
			var pageheight = $(window).height();//页面现在可是高度
			var toppanehight = 50;//上面菜单条的默认高度
			var popoverheight = 360;//popover 默认高度
			if((pageheight-toppanehight-topheight)<popoverheight){
				direction = "top";
			}
		}
		
		var html='<div class="asset-comment"><ul class="list-unstyled ul-comment"></ul></div>';
		$a.attr('data-title','<a  href="javascript:void(0);">'+name+'</a><a class="close" href="javascript:;">×</a>');
		$a.attr('data-content',html);
		$a.popover({
			html:true,
			placement:direction,
			trigger:'manual',
			viewport:{ selector: 'body', padding: 0 }
		});
		$a.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		$a.on('shown.bs.popover', function () {
			$('.ul-comment').showLoading();
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				var css  = $('#sinaEmotion').css("display");
				if(css=='block'){
					return;
				}
				$a.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			//关闭按钮
			$(".popover .close").click(function(){
				$a.popover('hide');
			});
			
			$(".popover").addClass('popover-relate');
			$(".popover").css('z-index', '780');
			var renderComment = function(comment){
				$('.ul-comment>.nocomment').remove();
				var li = $('<li>\
						<span class="user"></span>\
						<span class="time"><i class="fa fa-clock-o"></i> ' + comment.replayTime + '</span>\
						<p></p>\
					</li>');
				if(comment.fromPlatform == 'myself'){
					UserHelper.userID2userName(comment.commentor, function(user){
						li.find('.user').html('<i class="fa fa-user"></i> ' + user[0].userName).data('user', user[0]);
					});
				} else {
					li.find('.user').html('<i class="fa fa-user"></i> ' + comment.commentor);
				}
				
				li.find('p').html(comment.content);
				var user = SessionHelper.getCurrentSession();
				if(comment.commentor == user.userID || SessionHelper.canDO('页内/其他/评论管理')) {
					$('<a href="javascript:;" class="delete"><i class="fa fa-trash"></i></a>').click(function(res){
						Proxy.deleteComment(comment.commentId, function(x){
							var span = $("#" + moid +" .comment_btn>a>.num");
							var num = span.text() * 1 - 1;
							span.text(num > 0 ? num : 0);
							if($('.ul-comment>li').length==0){
								$('<li class="nocomment">暂无评论</li>').appendTo('.ul-comment');
							}
						});
						li.remove();
					}).appendTo(li);
				}
				li.appendTo('.ul-comment');
			};
			Proxy.getComments(moid, function(response){
				if(response.code != 0){
					return;
				}
				if(response.result.length == 0){
					$('<li class="nocomment">暂无评论</li>').appendTo('.ul-comment');
				}
				$(response.result).each(function(index, comment){
					renderComment(comment);
				});
				$(".ul-comment p").parseEmotion();
				$('.ul-comment').hideLoading();
			});
			var txt = $('<textarea class="form-control input-comment" rows="2"></textarea>').appendTo('.asset-comment');
			var toolbar = $('<div class="toolbar">').appendTo('.asset-comment');
			var emoticonbar = $('<div class="emoticonbar">').appendTo('.asset-comment');
			$('<button class="btn btn-xs btn-success"><i class="fa fa-save"></i> 确定</button>').click(function(){
				var content = txt.val();
				if(content.trim() == 0){
					Message.warn("请输入评论内容");
					return;
				}
				if(content.trim().length == 1000){
					Message.warn("评论内容不得超过500个汉字。");
					return;
				}
				
				//modify by hh 点击按钮后不可点击
				this.disabled=true;
				
				var comment = {moid: moid, content: content, fromPlatform: "myself"};
				Proxy.addComment(comment, function(response) {
					if(response.code == 0){
						renderComment(response.result);
						var span = $("#" + moid +" .comment_btn>a>.num");
						span.text((span.text() * 1 + 1));
						$(".ul-comment").parseEmotion();
						$a.popover('hide');
					} 
				});
			}).appendTo(toolbar);
			
			$('<button class="btn btn-xs btn-primary btn-emoticon"></i> 表情</button>').click(function(event){
			    $(this).sinaEmotion($(".input-comment"));
			    event.stopPropagation();
			}).appendTo(emoticonbar);
		});
		$a.popover('toggle');
	},
	toggleExtendAttribute : function(obj){
		if($('.extend-attribute').hasClass('in')){
			$(obj).html('显示 <i class="fa fa-arrow-circle-down"></i>');
			$('.extend-attribute').collapse('hide');
		}else{
			$(obj).html('隐藏 <i class="fa fa-arrow-circle-up"></i>');
			$('.extend-attribute').collapse('show');
		}
	},
	/**
	 * 生成直接采用按钮（线索-选题）
	 */
	buildClueToTopicDirectAdoptBtn:function($btn_group,moID){
		var session = SessionHelper.getCurrentSession();
		var result = session.attrCreatedTos;
		if(!result){
			result = new Array();
		}
		if(result.length>1){
			$('<button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false" data-loading-text="处理中…" title="加入到选题并略过编辑">\
					<i class="glyphicon glyphicon-ok"></i> to选题并提交  <span class="caret"></span></button>').appendTo($btn_group);
			var $ul = $('<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>').appendTo($btn_group);
			for(var i in result){
				var type = result[i];
				$('<li class="btn-adopt"><a href="#">'+type+'</a></li>').appendTo($ul).data('createdTo',type).data('moID',moID);
			}
			$ul.find('.btn-adopt').click(function(){
				var $btnTemp = $(this).parent().prev().button('loading');
				TopicDetail.clueAutoAdopted2Topic($(this).data('moID'),$(this).data('createdTo'),function(){
					$btnTemp.button('reset');
					Message.success('处理成功');
				});
			});
		}else{
			var $adoptBtn = $('<button class="btn btn-default btn-xs" data-loading-text="处理中…" title="加入到选题并略过编辑">\
					<i class="glyphicon glyphicon-ok"></i> to选题并提交</button>').appendTo($btn_group);
			if(result.length==1){
				$adoptBtn.data('createdTo',result[0]).data('moID',moID);
			}else{
				$adoptBtn.data('createdTo','').data('moID',moID);
			}
			$adoptBtn.click(function(){
				var moID = $(this).data('moID');
				var createdTo = $(this).data('createdTo');
				if(!!createdTo){
					var $btnTemp = $(this).button('loading');
					TopicDetail.clueAutoAdopted2Topic(moID,createdTo,function(){
						$btnTemp.button('reset');
						Message.success('处理成功');
					});
				}else{
					Message.warn(Message.TEXT.NO_CREATEDTO);
				}
			});
		}
	},
	/**
	 * 生成采用按钮（选题-报道）
	 */
	buildTopicToTitleAdoptBtn:function($btn_group,moID){
		var session = SessionHelper.getCurrentSession();
		var result = session.attrTargets;
		if(!result){
			result = new Array();
		}
		if(result.length>1){
			var $subbtn_group = $('<div class="btn-group"><button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false" data-loading-text="处理中…" title="为选题创建一个报道">\
					<i class="glyphicon glyphicon-ok"></i> to报道  <span class="caret"></span></button></div>').appendTo($btn_group);
			var $ul = $('<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>').appendTo($subbtn_group);
			for(var i in result){
				var target = result[i];
				if(target=='看看'){
					$('<li class="btn-adopt"><a href="#">'+target+'新闻网报道 </a></li>').appendTo($ul).data('target',target);
				}else{
					$('<li class="btn-adopt"><a href="#">'+target+'报道 </a></li>').appendTo($ul).data('target',target);
				}
			}
			$subbtn_group.find('.btn-adopt').click(function(){
				var target = $(this).data('target');
				top.GlobalDetail.ask(function(){
					TopicDetail.topicAdopted2Title(moID,target);
				});
			});
		}else{
			var $adoptBtn = $('<button class="btn btn-default btn-xs" data-loading-text="处理中…" title="为选题创建一个报道">\
					<i class="glyphicon glyphicon-ok"></i> to报道</button>').appendTo($btn_group);
			if(result.length==1){
				$adoptBtn.data('target',result[0]);
			}else{
				$adoptBtn.data('target','');
			}
			$adoptBtn.click(function(){
				var target = $(this).data('target');
				if(!!target){
					top.GlobalDetail.ask(function(){
						TopicDetail.topicAdopted2Title(moID,target);
					});
				}else{
					Message.warn(Message.TEXT.NO_TARGET);
				}
			});
		}
	},
	/**
	 * 标识最近浏览的500条资产
	 * @author fuleisen
	 * @param moid
	 */
	markVisited:function(moid){
		var arr = localStorage.getItem("nova_asset_visited_queue");
		if(!arr){
			arr = new Array();
		}else{
			arr = JSON.parse(arr);
		}
		arr.push(moid);
		if(arr.length>500){
			arr.shift();
		}
		localStorage.setItem("nova_asset_visited_queue",JSON.stringify(arr));
	},
	isVisited:function(moid){
		var arr = localStorage.getItem("nova_asset_visited_queue");
		if(!arr){
			return false;
		}else{
			arr = JSON.parse(arr);
			if(arr.indexOf(moid)<0){
				return false;
			}
		}
		return true;
	},
	showInverseAssets:function(moID){
		if($("#"+moID).find('.relationarea').length==0){
			Proxy.queryInverseAssetsByMoID({ moID : moID },function(response){
				if(response.code != Proxy.SUCCESS){
					Message.show(response.message+"("+code+")");
					return
				}
				var map = response.result;
				function _fun(moId,$container){
					var assetArr = map[moId];
					if(assetArr){
						var $ul = $('<ul class="list-unstyled">');
						$(assetArr).each(function(i,asset){
							var moid = asset.moID;
							var attr = AssetHelper.toAttributeValueMap(asset.attributeList);
							var $li = $('<li>').appendTo($ul).data('data',asset);
							var $a = $('<a class="title" href="#">').appendTo($li);
							if(attr.editstatus!='2'||AssetHelper.isVisited(asset.moID)){
								$a.addClass('text-muted');
							}
							if(attr.editstatus=='2'){// 草稿、流程中的不让查看详情
								$a.click(function(){
									var asset = $(this).parent().data('data');
									var attr = AssetHelper.toAttributeValueMap(asset.attributeList);
									var category = attr.assetcategoryid;
									if($("#"+moID).find('.library-content').length>0){//内容库
										AssetHelper.markVisited(asset.moID);
										$(this).addClass('text-muted');
										if(category == 'clue'){
											var showDetail = function(moid){
												Proxy.getAsset({moid : moid}, function(resp){
													if(resp.code != Proxy.SUCCESS){
														Message.show(resp.message, {cls: 'danger'});
														return;
													}
													var assetDescription = resp.result.assetDescription;
													ClueDetail.clueDetail(assetDescription, false, false, false);
												});
											};
											showDetail(asset.moID);
										}else if(category == 'topic'){
											top.GlobalDetail.ask(function(){
												TopicDetail.show(null, asset, {editable: false},false);
											});
										}else if(category == 'title'){
											TitleDetail.titleDetail(asset, "内容库/报道");
										}
									}else{//我的内容
										if(category == 'clue'){
											if(asset.editstatus == 0){
												top.GlobalDetail.ask(function(){
													ClueDetail.clueDetail(asset, true, true, true);
												});
											}else{
												top.GlobalDetail.ask(function(){
													ClueDetail.clueDetail(asset, false, true, false);
												});
											}
										}else if(category == 'topic'){
											top.GlobalDetail.ask(function(){
												if(asset.editstatus == 0){
													TopicDetail.show(null, asset, {editable: true}, true);
												}else{
													TopicDetail.show(null, asset, {editable: false}, true);
												}
											});
										}else if(category == 'title'){
											TitleDetail.titleDetail(asset, "我的内容/报道");
										}
									}
								});
							}else{
								$a.removeAttr('href');
							}
							
							if(attr.url){//看看已发布
								var $a1 = $('<a class="publish" href="'+attr.url+'" target="_blank">').appendTo($li);
								$a1.append('<i class="fa fa-newspaper-o"></i> 发布(<span class="num">'+attr.count+'</span>)');
							}
							
							if(attr.assetcategoryid=='topic'){//选题
								$('<i class="glyphicon glyphicon-inbox" title="选题">').appendTo($a);
								$('<span class="type">').text(attr.createdto).appendTo($li);
							}else if(attr.assetcategoryid=='title'){//报道
								$('<i class="glyphicon glyphicon-th-list" title="报道">').appendTo($a);
								$('<span class="type">').text(attr.target).appendTo($li);
							}else{//线索
								$('<i class="fa fa-paper-plane" title="线索">').appendTo($a);
								$('<span class="type">').text(attr.site).appendTo($li);
							}
							$a.append(attr.assetname);//标题
							if(attr.editstatus=='0'){
								$a.append('[草稿]');//标题
							}else if(attr.editstatus=='1'){
								$a.append('[流程中]');//标题
							}
							var time = '';
							if(attr.creationdate){
								time = attr.creationdate + '';
								time = time.substring(0, 19);
								if(attr.submittime){
									time = attr.submittime + '';
									time = time.substring(0, 19);
								}
							}
							$('<span class="time">').text(time).appendTo($li);//时间
							
							var assetArrTemp = map[moid];
							if(assetArrTemp){
								var $li = $('<li>').appendTo($ul);
								_fun(moid,$li);
							}
						});
						$container.append($ul);
					}
				}
				var $relarea = $('<div class="relationarea collapse">');
				_fun(moID,$relarea);
				if($("#"+moID).find('.library-content').length>0){//内容库
					$("#"+moID).find('.library-content').find('.relationarea').remove();
					$("#"+moID).find('.library-content').append($relarea);
				}else{//我的内容
					$("#"+moID).find('.relationarea').remove();
					$("#"+moID).append($relarea);
				}
				$relarea.collapse();
			});
		}else{
			if($("#"+moID).find('.relationarea').hasClass('in')){
				$("#"+moID).find('.relationarea').collapse('hide');
			}else{
				$("#"+moID).find('.relationarea').collapse('show');
			}
			
		}
	},
	loadKankanInfo:function(moid){
		Proxy.hasKankaned([moid],function(response){
			if(response.result.length){
				Proxy.queryKankanInfos([moid], function(res){
					if(res.result.length>0){
						var info = res.result[0];
						var moID = info.moid;
						var html = '<span class="pub_btn"><a title="已被看看发布" target="_blank" href="'+info.url+'"><i class="fa fa-newspaper-o"></i> 发布(<span class="num">'+info.count+'</span>)</a></span>';
						if($("#"+moID).find('.library-content').length>0){//内容库
							$('#' + moID + ' .item-toolbar .btn-group').before(html);
						}else{//我的内容
							$('#' + moID + ' .comment_btn').append(html);
						}
					}
				});
			}
		});
		
	}
};

/**
 * 查询用户信息工具
 * @author Chuxiong Wang
 */
var UserHelper = {
	/**
	 * 用userID 查询 用户名称 兼容数组形式
	 * Chuxiong Wang
	 */
	userID2userName: function(userID,callback) {
		if(userID&&userID!=''){
			if(userID instanceof Array){
				Proxy.getUserList(userID,function(response){
					if(response.code != 0){
						Message.show(response.message);
						return;
					}
					callback(response.result);
				});
			} else if(userID.constructor==String){
				var tmep = [userID];
				Proxy.getUserList(tmep,function(response){
					if(response.code != 0){
						Message.show(response.message);
						return;
					}
					callback(response.result);
				});
			}
		} else {
			callback();
		}
	},
	
	/**
	 * 返回当前用户是否为记者角色
	 * @returns {Boolean}
	 */
	isReporter: function() {
		var roleIDs = SessionHelper.getCurrentSession().roleIDs;
		var reporterRoleIds = SessionHelper.getCurrentSession().baseAttributes['user.reporter.roles'].attributeValue;
		var arr = reporterRoleIds.split(',');
		for(var i in arr){
			if(roleIDs.indexOf(arr[i]) != -1){
				return true;
			}
		}
		return false;
	},
	
};

function SelectReporter(options){
	options = $.extend({showCheck:true},options);
	options.title = options.title || '选择记者';
	this.popoverInit = function($this,callback){
		var html='<ul class=" list-inline ul-selectReporter" style="height: 300px; width: 430px; position: relative;">\
		</ul>'+
		'<ul class=" list-unstyled popover-operate">\
			<li><button class="btn btn-default btn-sm btn-ensureSelected"><i class="glyphicon glyphicon-floppy-disk"></i>&nbsp;确定</button></li>\
		</ul>';
		$this.attr('data-title','<a  href="javascript:void(0);" title="'+options.title+'">'+options.title+'</a><a class="close" href="javascript:;">×</a>');
		$this.attr('data-content',html);
		$this.popover({
			html:true,
			placement:'auto right',
			trigger:'manual',
			container:'body'
		});
		/**
		 * 隐藏时销毁
		 */
		$this.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		$this.on('shown.bs.popover', function () {

			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$this.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			
			//关闭按钮
			$(".popover .close").click(function(){
				$this.popover('hide');
			});
			$('.popover-operate .btn-ensureSelected').click(function(){
				var users = $('.ul-selectReporter').getCheckedData();
				if(users.length==0){
					Message.show("请选择人员");
				}else{
					$this.popover('hide');
					if(callback){
						callback(users);
					}
				}
			});
			
			$('.ul-selectReporter').novaTree({
				spread : options.spread || false,
				treeType : options.treeType || 'user',// org:组织机构；user：用户；
				showCheck : options.showCheck || false,
				enableSearch : options.enableSearch || false,
				checkedData : options.checkedData || [],
				data : [ {
					text : options.text || '组织机构',
					checkState : false,// 复选框选中状态
					checkable : false,// 是否可用于提取最终结果
					complete : false,// 是否已经加载过
					hasChild : true,
					icon : 'fa fa-sitemap',
					originalData : {
						organizationID : options.organizationID ||'',
						organizationName : options.organizationName||'组织机构'
					},// 原始数据 用于自定义用途 如封装请求参数等 可选
					data : []// 子数据 可选
				} ]
			});
		});
		$this.popover('toggle');
	};
};

/**
 * 用于资产的Facet（垂直）搜索的工具类
 * 参照工作流垂直搜索工具类FacetSearchPane修改而来，主要为搜索参数的变化
 * @autor lihuiyan
 * @since 2015-04-13
 */
function assetSearchPane(options) {

	
	// 内部私有组件
	/** @memberOf assetSearchPane */
	var _dayHelper = {
		today		: null,
		yesterday	: null,
		monday		: null,
		lastMonday	: null,
		getLastMonday: function() {
			this.reset();
			return this.lastMonday;
		},
		reset: function() {
			var now = new Date();
			var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			if(this.today && today.getTime() === this.today.getTime()) {
				return;
			}
			var currentWeek = today.getDay();
			if ( currentWeek == 0 ) currentWeek = 7;
			var monday = new Date( today.getTime() - (currentWeek-1)*24*60*60*1000);
			var lastMonday = new Date( monday.getTime() - 7*24*60*60*1000);

			this.today		= today;
			this.yesterday	= new Date(today.getTime() - 24*60*60*1000);
			this.monday		= monday;
			this.lastMonday	= lastMonday;
		},
		mapFacet: function(facet) {
			this.reset();
			
			var helper = this;
			var arr = ['今天', '昨天', '本周', '上周', '两周前'], map = {};
			$(arr).each(function(i, item){
				map[item] = 0;
			});
				
			$(facet.facetItemList).each(function(i, item){
				var time = new Date(item.name).getTime();
				if(time >= helper.today.getTime()) {
					map['今天'] += item.value;
				} else if(time >= helper.yesterday.getTime()) {
					map['昨天'] += item.value;
				}
				if(time >= helper.monday.getTime()) {
					map['本周'] += item.value;
				} else if(time >= helper.lastMonday.getTime()) {
					map['上周'] += item.value;
				}
			});
			map['两周前'] = facet.before || 0;
			
			return $.map(arr, function(item, i){
				return map[item] <= 0 ? null : {
					name: item,
					value: map[item]
				};
			});
		},
		changeDataField: function(df, val) {
			this.reset();
			
			switch(val) {
			case '今天':
				df.comparator = 'GE';
				df.values[0].value = this.today.format('yyyy-MM-ddT00:00:00Z');
				break;
			case '昨天':
				df.comparator = 'BETWEEN';
				df.values[0].value = this.yesterday.format('yyyy-MM-ddT00:00:00Z');
				df.values[0].anotherValue = this.today.format('yyyy-MM-ddT00:00:00Z'); 
				break;
			case '本周':
				df.comparator = 'GE';
				df.values[0].value = this.monday.format('yyyy-MM-ddT00:00:00Z');
				break;
			case '上周':
				df.comparator = 'BETWEEN';
				df.values[0].value = this.lastMonday.format('yyyy-MM-ddT00:00:00Z');
				df.values[0].anotherValue = this.monday.format('yyyy-MM-ddT00:00:00Z');
				break;
			case '两周前':
				df.comparator = 'LT';
				df.values[0].value = this.lastMonday.format('yyyy-MM-ddT00:00:00Z');
				break;
			default:
				return;
			}
		}
	};

	options = options || {};
	options.limit = options.limit || 50;
	options.fields = options.fields || [];
	options.orderList = options.orderList || [];
	options.onchange = options.onchange || function() {};
	options.drawFacetsBefore = options.drawFacetsBefore || function(facets, total) {};
	options.customFacetCrumb = options.customFacetCrumb || function(crumb, item, facet, field) {};
	
	/** @memberOf assetSearchPane */
	var __fieldsMap = {};
	$(options.fields).each(function(i, field){
		__fieldsMap[field.fieldName] = field;
	});
		
	// DOM根元素
	/** @memberOf assetSearchPane */
	var __dadvanced = $('<div class="search-facet">\
			<div class="selector">\
			</div>\
			<div class="crumbs-nav-main clearfix">\
				<div class="crumbs-nav-item">\
					<a class="crumbs-link">已选条件</a>\
					<i class="crumbs-arrow">&gt;</i>\
				</div>\
				<div class="crumbs-nav-item">\
					<div class="selector-set"></div>\
				</div>\
				<a class="btn btn-default btn-xs pull-right sl-e-reset">全部撤销</a>\
			</div>\
		</div>');
	
	/** @memberOf assetSearchPane */
	var __addCrumb = function(crumb) {
		var dcrumbs = __dadvanced.find('.crumbs-nav-main').show();
		var sset = dcrumbs.find('.selector-set');
		
		var ditem = $('<a class="ss-item"><b></b><em></em><i></i></a>').appendTo(sset).data('crumb', crumb).attr('data-fd', crumb.column);
		ditem.find('b').text(crumb.caption);
		var valCaption = '';
		if(crumb.values.length == 1) {
			valCaption = crumb.values[0].caption;
		} else if(crumb.values.length > 1) {
			valCaption = $.map(crumb.values, function(val, i) {
				return val.caption;
			}).join('、');
		}
		ditem.find('em').text(valCaption);
		ditem.find('i').click(function(){
			ditem.remove();
			if(sset.children().length <= 0) {
				dcrumbs.hide();
			}
			options.onchange();
		});
		options.onchange();
	};
	
	
	this.getDOM = function() {
		return __dadvanced;
	};
	
	this.initUI = function() {
		var dcrumbs = __dadvanced.find('.crumbs-nav-main').hide();
		dcrumbs.find('.sl-e-reset').click(function(){
			dcrumbs.find('.selector-set').empty();
			dcrumbs.hide();
			
			options.onchange();

			__dadvanced.find('.input-txt[name=createTime1]').val('');
			__dadvanced.find('.input-txt[name=createTime2]').val('');
		});

		var dselector = __dadvanced.find('.selector').empty();
		
		$(options.fields).each(function(i, field){
			var fdName = field.fieldName;
			var fdCaption = field.fieldCaption;
			var fdType = field.dataType;
			
			var dline = $('<div class="s-line">').hide().appendTo(dselector).data('field', field);//.attr('data-fd', fdName).attr('data-fd-caption', fdCaption).attr('data-fd-type', fdType);
			var dwrap = $('<div class="sl-wrap">\
					<div class="sl-key"><span></span></div>\
					<div class="sl-value">\
						<div class="sl-v-list"><ul></ul></div>\
						<div class="sl-btns">\
							<a href="javascript:;" class="btn btn-primary btn-xs sl-e-confirm disabled">确定</a>\
							<a href="javascript:;" class="btn btn-default btn-xs sl-e-cancel">取消</a>\
						</div>\
					</div>\
					<div class="sl-ext">\
						<a href="javascript:;" class="sl-e-more">更多<i></i></a>\
						<a href="javascript:;" class="sl-e-multiple">多选<i></i></a>\
					</div>\
				</div>').appendTo(dline);
			dwrap.find('.sl-key>span').html(fdCaption);
			
			var dconfirm = dwrap.find('.sl-e-confirm');
			var dcancel = dline.find('.sl-e-cancel');
			var dmore = dline.find('.sl-e-more');
			var dmulti = dwrap.find('.sl-e-multiple');
			
			if(!field.multiple) {
				dmulti.css('visibility', 'hidden');
			}
			if(field.morable) {
				dmore.css('visibility', 'visible');
			}
			if(fdType === 'DATE_TIME') {
				dmulti.css('visibility', 'hidden');
				
				var dprice = $('<div class="sl-price">\
								<input name="createTime1" maxlength="10" class="input-txt" readOnly />\
								<em>-</em>\
								<input name="createTime2" maxlength="10" class="input-txt" readOnly />\
								<a class="btn btn-default btn-xs sl-e-confirm">确定</a>\
							</div>');
				dwrap.find('.sl-v-list').append(dprice);

				var dtime1 = dprice.find('.input-txt[name=createTime1]').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				var dtime2 = dprice.find('.input-txt[name=createTime2]').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				dprice.find('.sl-e-confirm').click(function(){
					var time1 = dtime1.val();
					var time2 = dtime2.val();
					if(time1.length <= 0 || time2.length <=0) {
						return;
					}
					// 输入时间段
					__addCrumb({
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator: 'BETWEEN',
						values: [{
							value: time1 + 'T00:00:00Z',
							anotherValue: time2 + 'T23:59:59Z',
							caption: '从' + time1 + '到' + time2
						}]
					});
					dline.hide();
				});
			}

			dmore.click(function(){
				dwrap.toggleClass('extend');
				if(dwrap.is('.extend')) {
					$(this).html('收起<i></i>');
				} else {
					$(this).html('更多<i></i>');
				}
			});
			dmulti.click(function(){
				dwrap.addClass('multiple');
				dconfirm.addClass('disabled');
			});
			dconfirm.click(function(){
				if(dconfirm.is('.disabled')) return;
				var crumb = {
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator: 'EQ',
						values: []
					};
				dwrap.removeClass('multiple').find('.sl-v-list li.selected').removeClass('selected').each(function(i, li){
					var val = $(li).find('a').data('crumb').values[0];
					crumb.values.push(val);
				});
				// 多选
				__addCrumb(crumb);
			});
			dcancel.click(function(){
				dwrap.removeClass('multiple').find('.sl-v-list li').removeClass('selected');
			});
		});
	};
	
	this.updateFacets = function(facets, total) {
		var facetMP = {};
		$(facets).each(function(i, facet){
			facetMP[facet.attributeDefID] = facet;

			var field = __fieldsMap[facet.attributeDefID];
			if(!field) throw new Error('unknown facet result:' + facet.attributeDefID  );
			
//			facet.field = field;
			if(field.dataType === 'DATE_TIME') {
				facet.facetItemList = _dayHelper.mapFacet(facet);
			}
		});
		options.drawFacetsBefore(facets, total);
		
		var crumbs = __dadvanced.find('.crumbs-nav-main');
		var sset = crumbs.find('.selector-set');
		
		__dadvanced.find('.s-line').each(function(i, line){
			var dline = $(line);
			var field = dline.data('field');
			var fdName = field.fieldName;
			var fdCaption = field.fieldCaption;
			var fdType = field.dataType;
			
			if(sset.find('a[data-fd="' + fdName + '"]').length > 0) {
				dline.hide();
				return;
			}
			var facet = facetMP[fdName] || {facetItemList:[]};
			var list = facet.facetItemList;
			if(list.length <= 0) {
				dline.hide();
				return;
			}
			dline.show();
			
			var ul = dline.find('.sl-v-list>ul').empty();
			$(list).each(function(i, item){
				var crumb = {
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator:  'EQ',
						values: [{
							value: item.name,
							caption: item.caption
						}]
					};
				
				if(fdType === 'DATE_TIME') {
					_dayHelper.changeDataField(crumb, item.name);
				}
				options.customFacetCrumb(crumb, item, facet, field);
 
				var li = $('<li><a><i></i></a></li>').appendTo(ul);
				li.find('a').data('crumb', crumb).append(document.createTextNode(item.caption)).attr('title', item.caption).click(function(){
					if(!$(this).closest('.sl-wrap').is('.multiple')) {
						dline.hide();
						// 单选
						__addCrumb($(this).data('crumb'));
					} else {
						li.toggleClass('selected');
						if(ul.find('.selected').length > 0) {
							dline.find('.sl-e-confirm').removeClass('disabled');
						} else {
							dline.find('.sl-e-confirm').addClass('disabled');
						}
					}
				});
			});
		});
	};
	
	this.buildConditions = function() {
		var crumbs = __dadvanced.find('.crumbs-nav-main');
		var sset = crumbs.find('.selector-set');
		
		var _conds = [];
		var _groups = [];

		sset.find('a').each(function(i, a){
			var df = $(a).data('crumb');
			if(df.values.length == 1) {
				_conds.push({ attributeDefID: df.column,  comparator: df.comparator, value: df.values[0].value, anotherValue: df.values[0].anotherValue });
			} else {
				var group = {
						operator: 'OR',
						attributeConditionList: []
					};
				$(df.values).each(function(i, val){
					group.attributeConditionList.push({ attributeDefID: df.column,  comparator: df.comparator, value: val.value, anotherValue: val.anotherValue });
				});
				_groups.push(group);
			}
		});
		
		var fieldList = $.map(options.fields, function(field, i) {
			var range = undefined;
			if(field.dataType === 'DATE_TIME') {
				range = {
					value1: _dayHelper.getLastMonday().format('yyyy-MM-dd 00:00:00'),//'2015-03-23 00:00:00',
					value2: new Date().format('yyyy-MM-dd 00:00:00'),
					gap: '+1DAY',
					other: 'ALL'
				};
			}
			return {
					attributeDefID: field.fieldName,
					range: range
				};
		});
		
		return {
			fullText:'',
			searchGroup: {
				operator: 'AND',
				attributeConditionList: _conds,
				searchGroupList:_groups
			},
			orderList: options.orderList,
			firstRowNum: _firstRowNum,
			maxResults: _maxResults,
			facet: {
				limit: 100,
				fieldList: fieldList
			}
		};
	};
//	由于在dom节点没有挂到文档上时，datepicker初始化会出错，因此这里不能初始化
//	改有外层应用在append完成之后显式的initUI
//	this.initUI();
}

/**
 * 用于采访任务的Facet（垂直）搜索的工具类
 * 参照工作流垂直搜索工具类FacetSearchPane修改而来，主要为搜索参数的变化
 * @author zhaiguangpeng
 * @since 2015-05-07
 */
function InterviewSearchPane(options) {
	
	// 内部私有组件
	/** @memberOf InterviewSearchPane */
	var _dayHelper = {
		today		: null,
		yesterday	: null,
		monday		: null,
		lastMonday	: null,
		getLastMonday: function() {
			this.reset();
			return this.lastMonday;
		},
		reset: function() {
			var now = new Date();
			var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			if(this.today && today.getTime() === this.today.getTime()) {
				return;
			}
			var currentWeek = today.getDay();
			if ( currentWeek == 0 ) currentWeek = 7;
			var monday = new Date( today.getTime() - (currentWeek-1)*24*60*60*1000);
			var lastMonday = new Date( monday.getTime() - 7*24*60*60*1000);

			this.today		= today;
			this.yesterday	= new Date(today.getTime() - 24*60*60*1000);
			this.monday		= monday;
			this.lastMonday	= lastMonday;
		},
		mapFacet: function(facet) {
			this.reset();
			
			var helper = this;
			var arr = ['今天', '昨天', '本周', '上周', '两周前'];
//			$(arr).each(function(i, item){
//				map[item] = 0;
//			});
//				
//			$(facet.facetItemList).each(function(i, item){
//				var time = new Date(item.name).getTime();
//				if(time >= helper.today.getTime()) {
//					map['今天'] += item.value;
//				} else if(time >= helper.yesterday.getTime()) {
//					map['昨天'] += item.value;
//				}
//				if(time >= helper.monday.getTime()) {
//					map['本周'] += item.value;
//				} else if(time >= helper.lastMonday.getTime()) {
//					map['上周'] += item.value;
//				}
//			});
//			map['两周前'] = facet.before || 0;
			
			return $.map(arr, function(item, i){
				return {
					name: item,
					value: item,
					caption: item
				}
			});
		},
		changeDataField: function(df, val) {
			this.reset();
			
			switch(val) {
			case '今天':
				df.comparator = 'GE';
				df.values[0].value = this.today.format('yyyy-MM-dd 00:00:00');
				break;
			case '昨天':
				df.comparator = 'BETWEEN';
				df.values[0].value = this.yesterday.format('yyyy-MM-dd 00:00:00');
				df.values[0].anotherValue = this.today.format('yyyy-MM-dd 00:00:00'); // TODO
				break;
			case '本周':
				df.comparator = 'GE';
				df.values[0].value = this.monday.format('yyyy-MM-dd 00:00:00');
				break;
			case '上周':
				df.comparator = 'BETWEEN';
				df.values[0].value = this.lastMonday.format('yyyy-MM-dd 00:00:00');
				df.values[0].anotherValue = this.monday.format('yyyy-MM-dd 00:00:00'); // TODO
				break;
			case '两周前':
				df.comparator = 'LT';
				df.values[0].value = this.lastMonday.format('yyyy-MM-dd 00:00:00');
				break;
			default:
				return;
			}
		}
	};

	options = options || {};
	options.limit = options.limit || 50;
	options.fields = options.fields || [];
	options.orderList = options.orderList || [];
	options.onchange = options.onchange || function() {};
	options.drawFacetsBefore = options.drawFacetsBefore || function(facets, total) {};
	options.customFacetCrumb = options.customFacetCrumb || function(crumb, item, facet, field) {};
	
	/** @memberOf InterviewSearchPane */
	var __fieldsMap = {};
	$(options.fields).each(function(i, field){
		__fieldsMap[field.fieldName] = field;
	});
		
	// DOM根元素
	/** @memberOf InterviewSearchPane */
	var __dadvanced = $('<div class="search-facet">\
			<div class="selector">\
			</div>\
			<div class="crumbs-nav-main clearfix">\
				<div class="crumbs-nav-item">\
					<a class="crumbs-link">已选条件</a>\
					<i class="crumbs-arrow">&gt;</i>\
				</div>\
				<div class="crumbs-nav-item">\
					<div class="selector-set"></div>\
				</div>\
				<a class="btn btn-default btn-xs pull-right sl-e-reset">条件清空</a>\
			</div>\
		</div>');
	
	/** @memberOf InterviewSearchPane */
	var __addCrumb = function(crumb) {
		var dcrumbs = __dadvanced.find('.crumbs-nav-main').show();
		var sset = dcrumbs.find('.selector-set');
		
		var ditem = $('<a class="ss-item"><b></b><em></em><i></i></a>').appendTo(sset).data('crumb', crumb).attr('data-fd', crumb.column);
		ditem.find('b').text(crumb.caption);
		var valCaption = '';
		if(crumb.values.length == 1) {
			valCaption = crumb.values[0].caption;
		} else if(crumb.values.length > 1) {
			valCaption = $.map(crumb.values, function(val, i) {
				return val.caption;
			}).join('、');
		}
		ditem.find('em').text(valCaption);
		ditem.find('i').click(function(){
			ditem.remove();
			if(sset.children().length <= 0) {
				dcrumbs.hide();
			}
			options.onchange();
		});
		options.onchange();
	};
	
	
	this.getDOM = function() {
		return __dadvanced;
	};
	
	this.initUI = function() {
		var dcrumbs = __dadvanced.find('.crumbs-nav-main').hide();
		dcrumbs.find('.sl-e-reset').click(function(){
			dcrumbs.find('.selector-set').empty();
			dcrumbs.hide();
			
			options.onchange();
		});

		var dselector = __dadvanced.find('.selector').empty();
		
		$(options.fields).each(function(i, field){
			var fdName = field.fieldName;
			var fdCaption = field.fieldCaption;
			var fdType = field.dataType;
			
			var dline = $('<div class="s-line">').hide().appendTo(dselector).data('field', field);//.attr('data-fd', fdName).attr('data-fd-caption', fdCaption).attr('data-fd-type', fdType);
			var dwrap = $('<div class="sl-wrap">\
					<div class="sl-key"><span></span></div>\
					<div class="sl-value">\
						<div class="sl-v-list"><ul></ul></div>\
						<div class="sl-btns">\
							<a href="javascript:;" class="btn btn-primary btn-xs sl-e-confirm disabled">确定</a>\
							<a href="javascript:;" class="btn btn-default btn-xs sl-e-cancel">取消</a>\
						</div>\
					</div>\
					<div class="sl-ext">\
						<a href="javascript:;" class="sl-e-more">更多<i></i></a>\
						<a href="javascript:;" class="sl-e-multiple">多选<i></i></a>\
					</div>\
				</div>').appendTo(dline);
			dwrap.find('.sl-key>span').html(fdCaption);
			
			var dconfirm = dwrap.find('.sl-e-confirm');
			var dcancel = dline.find('.sl-e-cancel');
			var dmore = dline.find('.sl-e-more');
			var dmulti = dwrap.find('.sl-e-multiple');
			
			if(!field.multiple) {
				dmulti.css('visibility', 'hidden');
			}
			if(field.morable) {
				dmore.css('visibility', 'visible');
			}
			if(fdType === 'DATE_TIME') {
				dmulti.css('visibility', 'hidden');
				
				var dprice = $('<div class="sl-price">\
								<input name="createTime1" maxlength="10" class="input-txt" readOnly />\
								<em>-</em>\
								<input name="createTime2" maxlength="10" class="input-txt" readOnly />\
								<a class="btn btn-default btn-xs sl-e-confirm">确定</a>\
							</div>');
				dwrap.find('.sl-v-list').append(dprice);

				var dtime1 = dprice.find('.input-txt[name=createTime1]').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				var dtime2 = dprice.find('.input-txt[name=createTime2]').datepicker({language: 'cn', format: 'yyyy-mm-dd',todayBtn: 'linked', todayHighlight: true});
				dprice.find('.sl-e-confirm').click(function(){
					var time1 = dtime1.val();
					var time2 = dtime2.val();
					if(time1.length <= 0 || time2.length <=0) {
						return;
					}
					// 输入时间段
					__addCrumb({
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator: 'BETWEEN',
						values: [{
							value: time1 + ' 00:00:00',
							anotherValue: time2 + ' 23:59:59',
							caption: '从' + time1 + '到' + time2
						}]
					});
					dline.hide();
				});
			}

			dmore.click(function(){
				dwrap.toggleClass('extend');
				if(dwrap.is('.extend')) {
					$(this).html('收起<i></i>');
				} else {
					$(this).html('更多<i></i>');
				}
			});
			dmulti.click(function(){
				dwrap.addClass('multiple');
				dconfirm.addClass('disabled');
			});
			dconfirm.click(function(){
				if(dconfirm.is('.disabled')) return;
				var crumb = {
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator: 'EQ',
						values: []
					};
				dwrap.removeClass('multiple').find('.sl-v-list li.selected').removeClass('selected').each(function(i, li){
					var val = $(li).find('a').data('crumb').values[0];
					crumb.values.push(val);
				});
				// 多选
				__addCrumb(crumb);
			});
			dcancel.click(function(){
				dwrap.removeClass('multiple').find('.sl-v-list li').removeClass('selected');
			});
		});
	};
	
	this.updateFacets = function(facets, total) {
		var facetMP = {};
		$(facets).each(function(i, facet){
			facetMP[facet.fieldName] = facet;

			var field = __fieldsMap[facet.fieldName];
			if(!field) throw new Error('unknown facet result:' + facet.fieldName);
			
//			facet.field = field;
			if(field.dataType === 'DATE_TIME') {
				facet.facetItemList = _dayHelper.mapFacet(facet);
			}
		});
		options.drawFacetsBefore(facets, total);
		
		var crumbs = __dadvanced.find('.crumbs-nav-main');
		var sset = crumbs.find('.selector-set');
		
		__dadvanced.find('.s-line').each(function(i, line){
			var dline = $(line);
			var field = dline.data('field');
			var fdName = field.fieldName;
			var fdCaption = field.fieldCaption;
			var fdType = field.dataType;
			
			if(sset.find('a[data-fd="' + fdName + '"]').length > 0) {
				dline.hide();
				return;
			}
			var facet = facetMP[fdName] || {facetItemList:[]};
			var list = facet.facetItemList;
			if(list.length <= 0) {
				dline.hide();
				return;
			}
			dline.show();
			
			var ul = dline.find('.sl-v-list>ul').empty();
			$(list).each(function(i, item){
				var crumb = {
						column: fdName,
						caption: fdCaption,
						dataType: fdType,
						comparator:  'EQ',
						values: [{
							value: item.name,
							caption: item.caption
						}]
					};
				
				if(fdType === 'DATE_TIME') {
					_dayHelper.changeDataField(crumb, item.name);
				}
				options.customFacetCrumb(crumb, item, facet, field);
 
				var li = $('<li><a><i></i></a></li>').appendTo(ul);
				li.find('a').data('crumb', crumb).append(document.createTextNode(item.caption)).attr('title', item.caption).click(function(){
					if(!$(this).closest('.sl-wrap').is('.multiple')) {
						dline.hide();
						// 单选
						__addCrumb($(this).data('crumb'));
					} else {
						li.toggleClass('selected');
						if(ul.find('.selected').length > 0) {
							dline.find('.sl-e-confirm').removeClass('disabled');
						} else {
							dline.find('.sl-e-confirm').addClass('disabled');
						}
					}
				});
			});
		});
	};
	
	this.buildConditions = function() {
		var crumbs = __dadvanced.find('.crumbs-nav-main');
		var sset = crumbs.find('.selector-set');
		
		var _conds = [];
		var _groups = [];

		sset.find('a').each(function(i, a){
			var df = $(a).data('crumb');
			if(df.values.length == 1) {
				_conds.push({ column: df.column, dataType: df.dataType, comparator: df.comparator, value: df.values[0].value, anotherValue: df.values[0].anotherValue });
			} else {
				var group = {
						operator: 'OR',
						conditionList: []
					};
				$(df.values).each(function(i, val){
					group.conditionList.push({ column: df.column, dataType: df.dataType, comparator: df.comparator, value: val.value, anotherValue: val.anotherValue })
				});
				_groups.push(group);
			}
		});
		
		var fieldList = $.map(options.fields, function(field, i) {
			var range = undefined;
			if(field.dataType === 'DATE_TIME') {
				range = {
					value1: _dayHelper.getLastMonday().format('yyyy-MM-dd 00:00:00'),//'2015-03-23 00:00:00',
					value2: new Date().format('yyyy-MM-dd 00:00:00'),
					gap: '+1DAY',
					other: 'ALL'
				};
			}
			return {
					fieldName: field.fieldName,
					dataType: field.dataType,
					prefix: field.prefix,
					range: range
				};
		});
		
		return {
			group: {
				operator: 'AND',
				conditionList: _conds,
				groupList: _groups
			},
			orderList: options.orderList
//			facet: {
//				limit: 100,
//				fieldList: fieldList
//			}
		};
	};
//	由于在dom节点没有挂到文档上时，datepicker初始化会出错，因此这里不能初始化
//	改有外层应用在append完成之后显式的initUI
//	this.initUI();
}

/**
 * 调用全局的用户， 请调用这个方法
 */
function selectUser(options){
	options = options || {};
	this.popoverInit = function($this,callback){
		var html='<ul class=" list-inline ul-selectReporter" style="height: 300px; width: 430px; position:relative;">\
		</ul>'+
		'<ul class=" list-unstyled popover-operate">\
			<li><button class="btn btn-default btn-sm btn-ensureSelected"><i class="glyphicon glyphicon-floppy-disk"></i>&nbsp;确定</button></li>\
		</ul>';
		$this.attr('data-title','<a  href="javascript:void(0);" title="选择用户">选择用户</a><a class="close" href="javascript:;">×</a>');
		$this.attr('data-content',html);
		$this.popover({
			html:true,
			placement:'auto left',
			trigger:'manual',
			container:'body'
		});
		/**
		 * 隐藏时销毁
		 */
		$this.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		$this.on('shown.bs.popover', function () {

			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$this.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			
			//关闭按钮
			$(".popover .close").click(function(){
				$this.popover('hide');
			});
			$('.popover-operate .btn-ensureSelected').click(function(){
				var users = $('.ul-selectReporter').getCheckedData();
				if(users.length==0){
					Message.show("请选择人员");
				}else{
					$this.popover('hide');
					if(callback){
						callback(users);
					}
				}
			});
			
			$('.ul-selectReporter').novaTree({
				spread : options.spread || false,
				treeType : options.treeType || 'user',// org:组织机构；user：用户；
				showCheck : options.showCheck || false,
				enableSearch : options.enableSearch || false,
				checkedData : options.checkedData || [],
				data : [ {
					text : options.text || '组织机构',
					checkState : false,// 复选框选中状态
					checkable : false,// 是否可用于提取最终结果
					complete : false,// 是否已经加载过
					hasChild : true,
					icon : 'fa fa-sitemap',
					originalData : {
						organizationID : '',
						organizationName : '组织机构'
					},// 原始数据 用于自定义用途 如封装请求参数等 可选
					data : []// 子数据 可选
				} ],
				orgMaps : options.orgmaps,
				orguserMaps : options.orguserMaps
			});
		});
		$this.popover('toggle');
	};
};


/**
 * @author Sunwei
 * @since 2015-4-13
 * 
 * =======================================
 * next style can be used to prettify it
 * 
#yourContext .popover {
	max-width: 800px;
	min-width: 500px;
	max-height: 600px;
	min-height: 400px;
}
#yourContext .popover .popover-title .btn {
	margin: 0 4px;
}
#yourContext .popover .popover-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 38px;
	overflow: auto;
	padding: 10px;
}
 * =====================================
 */
function PopoverDialog(options /* never used now*/) {
	options = options || {};
	options.title = options.title || '';
	options.container = options.container || 'body';
	options.placement = options.placement || 'auto left';
//	{
//	title: ''
//}
	this.pop = function($this, callback) {
		if('function' === typeof $this) return;
		$this = $($this);
		$this.popover({
			title: options.title,
			html: true,
			content: '<p>',
			placement: options.placement,
			trigger: 'manual',
			container: options.container
		}).on('hidden.bs.popover', function (e) {
			$this.popover('destroy');
		}).on('shown.bs.popover', function (e) {
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$this.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			var $pop = $('#' + $this.attr('aria-describedby')).on('mousedown.popover',function (event) {
				event.stopPropagation();
				event.preventDefault();
			});
			
			callback && callback($pop);
		}).popover('show');
	};
}


/**
 * @author Sunwei
 * @since 2015-4-13
 * 
 * =======================================
 * next style can be used to prettify it
 * 
#yourContext .popover {
	max-width: 800px;
	min-width: 500px;
	max-height: 600px;
	min-height: 400px;
}
#yourContext .popover .popover-title .btn {
	margin: 0 4px;
}
#yourContext .popover .popover-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 38px;
	overflow: auto;
	padding: 10px;
}
#yourContext .popover .popover-content >.nova-tree {
	bottom: auto;
	height: auto;
	left: auto;
	overflow: visible;
	position: static;
	right: auto;
	top: auto;
}
 * =====================================
 */
function PopoverUserDialog(options) {
//	{
//		title: ''
//	}
	options = options || {};
	options.title = options.title || '请选择用户';
	var dlg = new PopoverDialog(options);
	
	this.pop = function($this, callback) {
		if('function' === typeof $this) return;
		dlg.pop($this, function($pop){
			var dtitle = $pop.find('.popover-title');
			var dcontent = $pop.find('.popover-content').empty();
			dcontent.novaTree({
				treeType: 'user',
				showCheck : true,
				spread: true,
				data: [{
					text : '所有部门',
					checkState : false,
					checkable : true,
					complete : false,
					hasChild : true,
					icon : 'fa fa-sitemap',
					originalData : {
						organizationID : null,
						organizationName : '所有部门'
					}
				}]
			});
			var toolbar = $('<div class="toolbar pull-right" role="toolbar">').appendTo(dtitle);
			$('<button type="button" class="btn btn-default btn-xs">取消</button>').appendTo(toolbar).click(function(){
				$this.popover('hide');
			});
			$('<button type="button" class="btn btn-success btn-xs">确定</button>').appendTo(toolbar).click(function(){
				var users = dcontent.getCheckedData();
				if(users.length <= 0){
					Message.show("请选择人员");
				}
				callback && callback(users);
				$this.popover('hide');
			});
		});
	};
}

/**
 * zhaiguangpeng
 * 获取用户所属的栏目并自动添加到给定的select元素（自动去重）
 */
function renderColumns(selectElement,opts){
	var opts_default = {
			selectAllFlag : 0,		//是否添加全选选择项
			initValue : null,		//初始栏目名称
			initOrgID : null,		//初始栏目ID
			callback : null
	};
	var options = $.extend(true, opts_default, opts);
	
	if(selectElement.length<1){
		return;
	}
	
	//如果全选
	if(options.selectAllFlag){
		var opt = '<option value="所有">' + '所有' +'</option>';
		$(opt).appendTo(selectElement).data('orgID','all');;
	}
	
	var user = SessionHelper.getCurrentSession();
	Proxy.getColumnByUserid(user.userID, function(response) {
		if(response.code !== 0) {
			Message.warning("没查询到用户的工作栏目！");
			return;
		}
		var columns = response.result;
		var optionArray = [];
		
		//将所有已经存在不重复的选择项加入数组；
		selectElement.find('option').each(function(){
			if(optionArray.indexOf($(this).val())<0){
				optionArray.push($(this).val());
			}
		});
		if(options.initValue==''){
			optionArray.push("");
			var opt = '<option value=""></option>';
			$(opt).appendTo(selectElement).data('orgID','');
			selectElement.val('');
		}
		//返回的每一个栏目，如果不在已存在的选择项中，则添加到选择项，并添加到给定元素中
		$(columns).each(function(index, column){
			var columnName = column.organizationName;
			var opt = '<option value="' + columnName + '">' + columnName +'</option>';
			if(optionArray.indexOf(columnName)<0){
				optionArray.push(columnName);
				$(opt).appendTo(selectElement).data('orgID',column.organizationID);
			}
		});
		
		//设置初始值
		if(options.initValue){
			if(optionArray.indexOf(options.initValue)<0){
				optionArray.push(options.initValue);
				var opt = '<option value="' + options.initValue + '">' + options.initValue +'</option>';
				$(opt).appendTo(selectElement).data('orgID',options.initOrgID);
			}
			selectElement.val(options.initValue);
		};
		//如果最后没有任何选择项，则添加一个空的选择项
		if(optionArray.length < 1){
			optionArray.push("");
			var opt = '<option value="">' + '空' +'</option>';
			$(opt).appendTo(selectElement);
			selectElement.val('');
		}
		
		if(options.callback && 'function' === typeof options.callback){
			options.callback();
		}
	});
};
$(function(){
	// sunwei:
	// 这段代码解决，子框架页刷新的时候，没有把自己打开的侧滑页注销掉的问题
	// 并且不会影响父框架页中的侧滑页
	$(window).on('unload', function() {
		if(window !== top.window && top.GlobalDetail && !top.GlobalDetail.ask(function(){}, 'quiet')) {
			var detail = top.GlobalDetail.get();
			if(detail && detail.is($(document).find('.detail-div'))) {
				top.GlobalDetail.unreg();
			}
		}
	});
});
/**
 * Jquery星标评级插件 此处修改后需要与nova.star.js的代码同步
 * 临时放在这里 不然需要在很多html里面引用nova.star.js
 * @author fuleisen
 * @param $
 */
(function($){
	jQuery.fn.novaStar = function(options){
		jQuery.fn.getScore = function(){
			var novaStar =$(this).data('novaStar');
			return novaStar.getScore();
		};
		jQuery.fn.setScore = function(score){
			var novaStar =$(this).data('novaStar');
			novaStar.setScore(score,true);
			novaStar.options.score = novaStar.getScore();
		};
		jQuery.fn.readOnly = function(readOnly){
			var novaStar =$(this).data('novaStar');
			novaStar.readOnly(readOnly);
		};
		return this.each(function(){
			var $this = $(this);
			var novaStar = new NovaStar($this,options);
			$this.data('novaStar',novaStar);
		});
	};
})(jQuery);

function NovaStar($container,options){
	this.defaults = {
		number:5,
		score:0,
		readOnly:false
	};
	this.options = $.extend({},this.defaults,options);
	this.init = function(){
		var $obj = this;
		$container.empty();
		var $nova_star = $('<div>').addClass('nova-star').appendTo($container);
		for(var i=0;i<$obj.options.number;i++){
			$('<i class="fa fa-star-o"></i>').data("score",i+1).appendTo($nova_star);
		}
		$obj.setScore($obj.options.score,true);
		$container.find('.nova-star').find('i').mouseover(function(){
			if(!$obj.options.readOnly){
				var score = parseInt($(this).data("score"));
				$obj.setScore(score,false);
			}
		}).mouseout(function(){//鼠标移出还原得分
			if(!$obj.options.readOnly){
				var score = $obj.options.score;
				$obj.setScore(score,true);
			}
		}).click(function(){
			if(!$obj.options.readOnly){
				var score = parseInt($(this).data("score"));
				$obj.setScore(score,true);
				$obj.options.score = $obj.getScore();
			}
		});
	};
	this.setScore = function(score,flag){
		var $obj = this;
		var clazz = 'hover';
		if(flag){
			clazz = 'click';
		}
		$container.find('.nova-star').find('i').removeClass('fa-star fa-star-o click hover').addClass('fa-star-o');
		$container.find('.nova-star').find('i').each(function(index,item){
			if(index<score){
				$(this).removeClass('fa-star fa-star-o '+clazz).addClass('fa-star '+clazz);
			}
		});
	};
	this.getScore = function(){
		return $container.find('.nova-star').find('.fa-star').length;
	};
	this.readOnly = function(readOnly){
		this.options.readOnly = readOnly;
	};
	this.init();
};
var ReportUtils = {
		autoJudgeSourceByOrg : function(){
			var ret = {};
			var session = SessionHelper.getCurrentSession();
			var report = session.baseAttributes['reportStation.organization.default'];
			var county = session.baseAttributes['county.organization.default'];
			report = new RegExp(report.attributeValue);
			county = new RegExp(county.attributeValue);
			for(var i = 0; i < session.currentOrgs.length; i++){
				var result;
				if((result = report.exec(session.currentOrgs[i]))!= null){
					//记者站
					ret.platform = '全媒报片';
					ret.site = '报片';
					ret.channelpath = result[1];
					break;
				}else if((result = county.exec(session.currentOrgs[i])) != null){
					ret.platform = '全媒报片';
					ret.site = '报片';
					ret.channelpath = result[1];
					break;
				}
			}
			return ret;
		}
};
var AutoCompleteUtils = {
		autocompleteUserParam: function(reportLimit, id, name, initUser){
			var cache = [];
			var inputvalue;
			var users = {};//initUser || {};
			var queryCache;
			var queryfun;
			if(reportLimit){
				queryfun = function(callback){
					var param = {roleID: SessionHelper.getCurrentSession().baseAttributes['user.reporter.roles'].attributeValue};
					Proxy.listUsersByRole(param, callback);
				};
			}else{
				queryfun = Proxy.listAllUsers;
			}
			$(name).keyup(function(e){
				var val = $(name).val();
				val = val.replace(/[，]/g, ',').replace(/\s/g, '');
				$(name).val(val);
				var realValues = val.split(',');
	        	var ids = '';
	        	$(realValues).each(function(i, val){
	        		var real = users[val];
	        		if(real){
	        			ids += real + ',';
	        		}
	        	});
	        	if(ids.endWith(',')){
	        		ids = ids.substring(0, ids.length-1);
	        	}
	        	$(id).val(ids);
			});
			return {
				addUser : function(userID, userName){
					users[userName] = userID;
				},
		        source:function(query,process){
		        	var splitIndex = query.lastIndexOf(',');
		        	inputvalue = query;
		        	if(splitIndex != -1){
		        		inputvalue = query.substring(0, splitIndex+1);
		        		query = query.substring(splitIndex+1);
		        		if(!query){
		        			return;
		        		}
		        	}
		        	var realValues = $(name).val().split(',');
		        	if(cache.length === 0){
		        		queryfun(function(response){
			        		if(response.code != 0){
			        			Message.fail('获取数据异常');
			        			return;
			        		}
			        		var userList = response.result.userList;
			        		var items = [];
			        		$(userList).each(function(i, item){
			        			users[item.userName] = item.userID;
			        			cache.push({userID: item.userID, userName: item.userName});
			        			if(item.userID.toLowerCase().indexOf(query.toLowerCase()) != -1
			        				|| item.userName.toLowerCase().indexOf(query.toLowerCase()) != -1){
			        				items.push({userID: item.userID, userName: item.userName});
			        			}
			        		});
			        		queryCache = this.query;
			        		this.query = query;
			        		process(items);
			        		this.query = queryCache;
			        	});
		        	}else{
		        		var itemsCache = [];
		        		$(cache).each(function(i, item){
		        			if(item.userID.toLowerCase().indexOf(query.toLowerCase()) != -1
			        				|| item.userName.toLowerCase().indexOf(query.toLowerCase()) != -1){
		        					itemsCache.push({userID: item.userID, userName: item.userName});
			        			}
		        		});
		        		var me = this;
		        		setTimeout(function(){
		        			queryCache = me.query;
			        		me.query = query;
		        			process(itemsCache);
		        			me.query = queryCache;
		        		}, 0);
		        	}
		        },
		        formatItem:function(item){
		            return item.userID + '\t' + item.userName;
		        },
		        setValue:function(item){
		        	if(!users[item.userName]){
		        		users[item.userName] = item.userID;
		        	}
		        	
		            return {'data-value':item.userName,'real-value':item.userName};
		        },
		        updater:function(item){
		        	var realValues = $(name).val().split(',');
		        	var index = $.inArray(item, realValues);
		        	if(index != -1 && index != realValues.length-1){
		        		realValues.length = realValues.length -1;
		        		return realValues.join(',');
		        	}
		        	realValues[realValues.length-1] = item;
		        	var ids = '';
		        	$(realValues).each(function(i, val){
		        		var real = users[val];
		        		if(real){
		        			ids += real + ',';
		        		}
		        	});
		        	if(ids.endWith(',')){
		        		ids = ids.substring(0, ids.length-1);
		        	}
		        	$(id).val(ids);
		        	if(!inputvalue.endWith(',')){
		        		inputvalue = '';
		        	}
		        	return inputvalue + item;
		        }
		    };
		}
};
/**
 * 对象与数组深度拷贝方法(不包括内部函数)
 *
 */
Object.defineProperty(Object.prototype, "deepClone", {
	value : function() {
		var str = JSON.stringify( this ); 
		return JSON.parse( str ); 
	}
});

/**
 * 选题或报道加入版面
 * 建议 页面初始化时new对象，以后就用此一个对象
 * @author fuleisen
 */
ItemToSheet.sheetModel = [];
function ItemToSheet(){
	this.blockMap = {};
	this.init = function(){
		var obj = this;
		if(ItemToSheet.sheetModel.length==0){
			Proxy.getVisibleSheet({},function(response){
				if(response.code != 0){
					Message.danger("查询版面模板配置信息报错！");
				} else {
					ItemToSheet.sheetModel = response.result;
				}
			});
		}
	};
	/**
	 * 复制条目
	 */
	this.popoverItem = function($btn,item){
		var obj = this;
		var demo = '\
			<div>\
			<div class="form-group">\
				<label for="to_playdate" class="col-xs-2 control-label">播出日期</label>\
				<div class="col-xs-10">\
					<input type="text" class="form-control" id="to_playdate" placeholder="请输入日期">\
				</div>\
			</div>\
			<div class="form-group">\
				<label for="to_sheettype" class="col-xs-2 control-label">版面类型</label>\
				<div class="col-xs-10">\
					<select class="form-control" id="to_sheettype">\
					</select>\
				</div>\
			</div>\
			<div class="form-group" id="to_blockname_div">\
				<label for="to_blockname" class="col-xs-2 control-label">分组</label>\
				<div class="col-xs-10">\
				</div>\
			</div>\
			<div class="form-group" id="to_blockname_div2">\
				<label for="to_blockname2" class="col-xs-2 control-label"></label>\
				<div class="col-xs-10">\
				</div>\
			</div>\
		</div>';
		var $demo = $(demo);
		var $to_sheettype = $demo.find('#to_sheettype').empty();
		for(var i in ItemToSheet.sheetModel){
			$('<option>').val(ItemToSheet.sheetModel[i]).text(ItemToSheet.sheetModel[i]).appendTo($to_sheettype);
		}
		var html='\
			<ul class=" list-unstyled ul-interview"><div id="to_sheetform" class="form-horizontal" role="form">'+$demo.html()+'</div>\
			</ul>\
			<ul class=" list-unstyled popover-operate">\
				<li><button class="btn btn-default btn-sm btn-send"><i class="glyphicon glyphicon-ok"></i>&nbsp;确定</button></li>\
			</ul>';
		$btn.attr('data-title','<a  href="javascript:void(0);">'+item.name+'</a><a class="close" href="javascript:;">×</a>');
		$btn.attr('data-content',html);
		$btn.popover({
			html:true,
			placement:'auto left',
			trigger:'manual',
			container:'body'
		});
		/**
		 * 隐藏时销毁
		 */
		$btn.on('hidden.bs.popover', function () {
			$btn.popover('destroy');
		});
		/**
		 * 显示后绑定全选事件和 关闭按钮事件
		 */
		$btn.on('shown.bs.popover', function () {
			
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$btn.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			
			$(".popover .close").click(function(){
				$btn.popover('hide');
			});
			$(".popover #to_playdate").change(function(){
				obj.changeSheetFun();
			});
			
			$(".popover #to_playdate").val(new Date().format('yyyy-MM-dd'));
			
			$(".popover #to_sheettype").change(function(){
				obj.changeSheetFun();
			});
			$('.popover-operate .btn-send').click(function(){
				obj.ensureCommit($btn,item);
			});
			obj.changeSheetFun();
		});
		$btn.popover('toggle');
	};
	/**
	 * 确定按钮操作
	 */
	this.ensureCommit = function($btn,item){

		var playDate = $(".popover #to_playdate").val().trim();
		var sheetType = $(".popover #to_sheettype").val().trim();
		var blockName = '';
		var blockName2 = '';
		if($(".popover #to_blockname").length>0){
			blockName = $(".popover #to_blockname").val().trim();
		}
		if($(".popover #to_blockname2").length>0){
			blockName2 = $(".popover #to_blockname2").val().trim();
		}
		if(blockName==''){
			Message.warn('请选择分组');
			return;
		}
		var param = {
				playDate:playDate,
				sheetType:sheetType,
				blockName:blockName,
				listContent:JSON.stringify(item)
		};
		Proxy.assetAdd2Sheet(param,blockName2,function(response){
			if(response.code != Proxy.SUCCESS){
				Message.danger("操作出错");
			}else{
				$btn.popover('hide');
				if($('body').attr('id')=='today_sheet_body'){
					if(true){
						if($('#playdate').val().trim()==playDate&&$('#sheettype').val().trim()==sheetType){
							Message.success("操作成功，请刷新“"+blockName+"”查看！");
							return;
						}
					}
				}
				Message.success("操作成功！");
				return;
			}
		});
	};
	/**
	 * 播出日期、版面类型改变事件
	 */
	this.changeSheetFun = function(){
		var obj = this;
		var to_playdate = $('.popover #to_playdate').val();
		var to_sheettype = $('.popover #to_sheettype').val();
		if(to_playdate.trim()==''||(to_playdate.trim()).split('-').length!=3){
			Message.warn("请输入正确的播出日期");//TODO fuleisen 日期格式验证
			return;
		}
		var param = {
				sheetType:to_sheettype,
				playDate:to_playdate
		};
		Proxy.getBlockNamesAndGroupNames(param, function(response){
			if(response.code != Proxy.SUCCESS){
				Message.danger("加载分组出错");
			}else{
				var $form = $('.popover #to_sheetform');
				var $parent = $form.find("#to_blockname_div");
				var $parent2 = $form.find("#to_blockname_div2");
				$form.find("#to_blockname").remove();
				$form.find("#to_blockname2").remove();
				var $select = $('<select>').attr('id','to_blockname').addClass('form-control').appendTo($parent.find('.col-xs-10'));
				$select.change(function(){
					obj.changeBlockFun();
				});
				$(response.result).each(function(i,block){
					obj.blockMap[block.name] = block.groups;
					$('<option>').val(block.name).text(block.name).appendTo($select);
					if(block.groups.length>0&&i==0){
						var $select2 = $('<select>').attr('id','to_blockname2').addClass('form-control').appendTo($parent2.find('.col-xs-10'));
						$(block.groups).each(function(i,name){
							$('<option>').val(name).text(name).appendTo($select2);
						});
					}
				});
			}
		});
	};
	/**
	 * 板块change事件
	 */
	this.changeBlockFun = function(){
		var obj = this;
		var $form = $('.popover #to_sheetform');
		var blockName = $form.find("#to_blockname").val();
		var groups = obj.blockMap[blockName];
		var $parent2 = $form.find("#to_blockname_div2");
		$form.find("#to_blockname2").remove();
		if(groups.length>0){
			var $select2 = $('<select>').attr('id','to_blockname2').addClass('form-control').appendTo($parent2.find('.col-xs-10'));
			$(groups).each(function(i,name){
				$('<option>').val(name).text(name).appendTo($select2);
			});
		}
	};
	this.init();
}
//定时处理
+function(window){
	
	function Interval(option){
		this.option = $.extend({},Interval.DEFAULTS, option);
		if(this.option.autoStart){
			this.start();
		}
	}
	
	Interval.prototype = {
		start: function(){
			if(this.started){
				return;
			}
			if(this.option.once){
				this.timeId = window.setTimeout(this.option.callback, this.option.period * 1000);
			}else{
				var that = this;
				window.setTimeout(function(){
					if(that.option.doOnStart){
						that.option.callback();
					}
					that.timeId = window.setInterval(that.option.callback, that.option.period * 1000);
				}, this.option.doOnStart?this.option.delayTimeOnStart:0);
			}
			this.started = true;
		},
		stop: function(){
			if(this.started){
				if(this.option.once){
					window.clearTimeout(this.timeId);
				}else{
					window.clearInterval(this.timeId);
				}
				this.started = false;
			}
		},
		manual: function(){
			if(this.manualPermit){
				this.option.callback && this.option.callback();
			}
		}
	};
	
	Interval.DEFAULTS = {
		once: false,
		callback: function(){},
		period: 60, // 60s
		autoStart: false,
		doOnStart: false,
		manualPermit: false,
		delayTimeOnStart: 2000
	};
	
	window.periodDo = function(options){
		var period = new Interval(options);
		return {
			stop: function(){
				period.stop();
			},
			start: function(){
				period.start();
			},
			manualDo: function(){
				period.manual();
			}
		};
	};
}(window);
/**
 * 提取浏览器版本信息，调用方式如if(window.Browser.chrome){console.log('Chrome: ' + window.Browser.chrome);}
 * @author fuleisen
 */
+function() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
//	console.log(ua);
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : "Do nothing";
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : "Do nothing";
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : "Do nothing";
	(s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] : "Do nothing";
	(s = ua.match(/safari\/([\d.]+)/)) ? Sys.safari = s[1] : (s = ua
			.match(/version\/([\d.]+).*safari/))
			? Sys.safari = s[1]
			: "Do nothing";
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : "Do nothing";

	// 以下进行测试
	/*if (Sys.ie)
		console.log('IE: ' + Sys.ie);
	if (Sys.firefox)
		console.log('Firefox: ' + Sys.firefox);
	if (Sys.chrome)
		console.log('Chrome: ' + Sys.chrome);
	if (Sys.edge)
		console.log('Edge: ' + Sys.edge);
	if (Sys.opera)
		console.log('Opera: ' + Sys.opera);
	if (Sys.safari)
		console.log('Safari: ' + Sys.safari);*/
	window.Browser = Sys;
	/**
	 * 比较两个版本号之间的大小关系：1表示大于，-1表示小于，0表示等于
	 * @author fuleisen
	 * @param v1
	 * @param v2
	 * @returns {Number}
	 */
	window.Browser.compare = function(v1,v2){
		var arr1 = v1.split('.');
		var arr2 = v2.split('.');
		var max = arr1.length > arr2.length?arr2.length:arr1.length;
		for(var i = 0;i < max;i++){
			var j1 = parseInt(arr1[i]);
			var j2 = parseInt(arr2[i]);
			if(j1>j2){
				return 1;
			}else if(j1<j2){
				return -1;
			}
		}
		if(arr1.length > max){
			return 1;
		}else if(arr2.length > max){
			return -1;
		}
		return 0;
	};
}();

var HistoryTab = {
	appendHistoryTab : function(tab, isForTitle){
		var renewtype = "";
		if(isForTitle){
			renewtype = "<th>更新方式</th>";
		}
		var tabcontent = '<div class="history">\
				<div class="panel panel-default">\
					<table class="table">\
						<tr><th></th><th>#</th><th>更新时间</th><th>操作人</th>' + renewtype + '</tr>\
					</table>\
				</div>\
			</div>\
			<div class="comparation">\
				<div class="output"></div>\
				<div class="temp-version1"></div>\
				<div class="temp-version2"></div>\
			</div>';
		tab.append($(tabcontent));
	},
	appendDataAndAction : function(tab, moid){
		var tbl = tab.find('.history .table');
		tbl.find('tr:gt(0)').remove();
		//获得所有版本
		Proxy.getVersions({moid: moid}, function(response){
			tbl.find('tr:gt(0)').remove();
			if(response.code != 0){
				Message.show(response.message);
				return;
			}
			if(!response.result){
				Message.show('无版本信息！！！');
				return;
			}
			$(response.result).each(function(index, versiondata){
				var tr = $('<tr>').appendTo(tbl).click(function(event){
					var chk = $(this).find(':checkbox');
					chk.prop('checked', !chk.prop('checked'));
					compareContent(moid);
				}).data('version', versiondata.versionType);
				var versiontype = versiondata.versionType;
				var chk = $('<input type="checkbox" class="version-check" disabled>').val(versiontype.versionID).click(function(event){
					event.stopPropagation();
					compareContent(moid);
				});
				$('<td>').append(chk).appendTo(tr);
				$('<td>').append(document.createTextNode(versiontype.versionID)).appendTo(tr);
				$('<td>').text(new Date(versiontype.creationDate).format("yyyy-MM-dd hh:mm:ss")).appendTo(tr);
				$('<td>').text(versiontype.createdBy).appendTo(tr);
				var tempattrs = AssetHelper.toAttributeValueMap(versiondata.versionAssetDes.assetDescription.attributeList);
				tr.data('assetDescription', versiondata.versionAssetDes.assetDescription);
				tr.data('assetAttributes', tempattrs);
				tr.find(':checkbox').prop('disabled', false);
				//只有报道显示更新方式 其他都为自动 故其他不显示
				if(tempattrs['assetcategoryid'] == 'title'){
					if(tempattrs['updatetype']=='auto'){
						$('<td>').text('自动更新').appendTo(tr);
					} else if(tempattrs['updatetype']=='manual'){
						$('<td>').text('手动更新').appendTo(tr);
					} else {
						$('<td>').text('').appendTo(tr);
					}
				}
			});
		});
		
		// 进行内容比较
		function compareContent(moid) {
			var dcomp = tab.find('.comparation');
			var chks = tbl.find(':checkbox:checked');
			if(chks.length != 2) {
				dcomp.hide();
				return;
			}
			dcomp.show();
			var versions = chks.closest('tr').map(function(index, tr){
				return {
					versionID: $(tr).data('version').versionID,
					content: $(tr).data('assetAttributes')['content'] || '',
					assetcategoryid: $(tr).data('assetAttributes')['assetcategoryid'] || '',
					target: $(tr).data('assetAttributes')['target'] || ''};
			});
			var d1 = dcomp.find('.temp-version1').empty(), d2 = dcomp.find('.temp-version2').empty();
			var v1 = versions.get(0), v2 = versions.get(1);
			var txt1 = v1.content, txt2 = v2.content;
			var txt3,txt4;
			var isHtml = true;
			if(v1.assetcategoryid=="title"&&v1.target=="微博"){
				isHtml = false;
			}
			if(!isHtml) {
				txt1 = difflib.stringAsLines(txt1);
				txt2 = difflib.stringAsLines(txt2);
				txt3 = txt1;
				txt4 = txt2;
			} else {
				d1.append(v1.content);
				d2.append(v2.content);
				/*
				 * txt1 = difflib.stringAsLines(d1[0].innerText); txt2 =
				 * difflib.stringAsLines(d2[0].innerText);
				 */
				/*
				 * txt3 = txt1; txt4 = txt2;
				 */
				txt1 = [];
				txt2 = [];
				txt3 = [];
				txt4 = [];
				var htmlchild1 = dcomp.find('.temp-version1').children();
				var htmlchild2 = dcomp.find('.temp-version2').children();
				htmlchild1.each(function(index,val){
					//txt3.push($(val).prop('outerHTML'));//带样式
					txt3.push($(val).text());//不带样式
					txt1.push($(val).text());
				});
				htmlchild2.each(function(index,val){
					//txt4.push($(val).prop('outerHTML'));//带样式
					txt4.push($(val).text());//不带样式
					txt2.push($(val).text());
				});
			}
			dcomp.find('.output').empty().append(diffview.buildView({
				baseTextLines: txt3,
		        newTextLines: txt4,
		        opcodes: (new difflib.SequenceMatcher(txt1, txt2)).get_opcodes(),
		        // set the display titles for each resource
		        baseTextName: "版本" + v1.versionID,
		        newTextName: "版本" + v2.versionID,
		        contextSize: 100,
		       // viewType: $("inline").checked ? 1 : 0
		        viewType: 0 ,
		        isHTML: isHtml
			}));
			d1.empty();
			d2.empty();
			//进行行内比较
			compareline(moid,v1.versionID,v2.versionID,isHtml);
		}
		function compareline(moid, versionIdA, versionIdB, isHtml){
			Proxy.uesVersionIdCompareContent(moid,versionIdA,versionIdB,isHtml,function(response){
				if(response.code != 0){
					Message.show(response.message);
					return;
				}
				if(!response.result){
					return;
				}
				var compareresult = response.result;
				for(var i=0; i<compareresult.length;i++){
					var tempcontentcompare = compareresult[i];
					if(tempcontentcompare.changeType=="change" && tempcontentcompare.subChange){
						var subchange = tempcontentcompare.subChange;
						for(var j=0; j<subchange.length;j++){
							var linechange = subchange[j];
							var contentLineA = $('.diff tbody').children('tr').eq(parseInt(linechange.compareLineNumA)-1).children('td').eq(0);
							var contentLineB = $('.diff tbody').children('tr').eq(parseInt(linechange.compareLineNumB)-1).children('td').eq(1);
							if(linechange.lineChange){
								//TODO 行内样式会被去掉
								var linesubchange = linechange.lineChange;
								for(var k=0;k<linesubchange.length;k++){
									var startCharNumA = parseInt(linesubchange[k].startLineA);
									var endCharNumA = parseInt(linesubchange[k].endLineA);
									var startCharNumB = parseInt(linesubchange[k].startLineB);
									var endCharNumB = parseInt(linesubchange[k].endLineB);
									//var lineContentA = $($(contentLineA)[0])[0].innerHTML;//html加样式比较 会有问题
									//var lineContentB = $($(contentLineB)[0])[0].innerHTML;
									var lineContentA = $($(contentLineA)[0])[0].textContent;
									var lineContentB = $($(contentLineB)[0])[0].textContent;
									var lineChangeType = linesubchange[k].changeType;
									if(lineChangeType!="add"){
										var newcontent = lineContentA.substr(0, startCharNumA-1) 
											+ "<span class='redchar'>" 
											+ lineContentA.substr(startCharNumA-1, endCharNumA-startCharNumA+1)
											+ "</span>"
											+ lineContentA.substr(endCharNumA, lineContentA.length);
										$($(contentLineA)[0])[0].innerHTML = newcontent;
									} 
									if(lineChangeType!="del"){
										var newcontent = lineContentB.substr(0, startCharNumB-1) 
											+ "<span class='redchar'>" 
											+ lineContentB.substr(startCharNumB-1, endCharNumB-startCharNumB+1)
											+ "</span>"
											+ lineContentB.substr(endCharNumB, lineContentB.length);
										$($(contentLineB)[0])[0].innerHTML = newcontent;
									}
								}
							}
						}
					}//其他类型不用管js插件已经都渲染完了
				}
			});
		}
	}
};
