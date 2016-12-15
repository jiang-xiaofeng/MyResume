//工具类
//模态框
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
}