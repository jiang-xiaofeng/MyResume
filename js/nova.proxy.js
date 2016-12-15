/**
 * 调用示例
 * 
 * 	var configParam = {
 *		moid: moid,
 *		forcategoryid: categoryid
 *	};
 * 	top.Proxy.createClue(configParam, function(response){
 * 		
 *  })
 *  或者
 *  Proxy.createClue(configParam, function(response){
 * 		
 *  })
 * 
 */

var Proxy = {
	SUCCESS : 0,
	CLIENT_ERROR : -20000,
	SERVER_ERROR : -10000,
	UNKNOWN : -1,
	showLogin : function() {
		top.location.href = '/web/login.html';
	},
	__safeCallback : function(callback, data, extra) {
		if('undefined' === typeof data) {
			return;
		}
		if('function' === typeof callback) {
			callback(data, extra);
		}
	},
	
	
	/**
	 * 登录以及会话相关的三个特例Ajax， 没有使用公共的Setup
	 * @author sunwei
	 */
	stockMonster: function(param, callback){
		$.ajax({
				url		: '/sMonster/rest/user/create',
				type	: 'POST',
				async	: true,
				dataType: 'json',
				contentType : 'application/json; charset=UTF-8',
				data 	: JSON.stringify(param),
				success	: function(response) {
					Proxy.__safeCallback(callback, response);
				},
				error : 'error',
				statusCode : {},
		beforeSend: function() {
			// NO-OP
		}
			});
	},
	// 获取当前登录用户的会话Session
	getCurrentSession: function(onsuccess, onerror) {
		$.ajax({
			url		: '/web/api/user/current_session',
			type	: 'GET',
			async	: true,
			cache	: false,
			dataType: 'json',
			success	: onsuccess,
			// override setup
			error : onerror,
			statusCode : {},
			beforeSend: function() {
				// NO-OP
			}
		});
	},
	login: function(user, onsuccess, onerror){
		$.ajax({
			url		: '/web/api/login',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(user),
			success	: onsuccess,
			// override setup
			error : onerror,
			statusCode : {},
			beforeSend: function() {
				// NO-OP
			}
		});
	},
	noop : function(callback, onerror) {
		$.ajax({
			url		: '/web/api/noop',
			type	: 'GET',
			async	: true,
			cache	: false,
			dataType: 'json',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			},
			// override setup
			error : function(jqXHR, textStatus, errorThrown) {
				Proxy.__safeCallback(callback, jqXHR);
			},
			statusCode : {},
			beforeSend: function() {
				// NO-OP
			}
		});
	},
	logout: function(onsuccess, onerror){
		$.ajax({
			url		: '/web/api/logout',
			type	: 'GET',
			async	: true,
			cache	: false,
			dataType: 'json',
			converters : {
				// 由于注销成功时返回的内容不是JSON，所以这里hack一下
				'text json' : function(data) {
					return data;
				}
			},
			success	: function(data, textStatus, jqXHR) {
				if(jqXHR.getResponseHeader('Location')) {
					top.location.href = jqXHR.getResponseHeader('Location');
				} else {
					Proxy.showLogin();
					//onsuccess();
				}
			},
			// override setup
			error : function(jqXHR, textStatus, errorThrown) {
				if(jqXHR.getResponseHeader('Location')) {
					top.location.href = jqXHR.getResponseHeader('Location');
				} else  {
					onerror(jqXHR.responseText);
				}
			},
			statusCode : {},
			beforeSend: function() {
				// NO-OP
			}
		});
	},
	changePassword: function(pwd, newPwd, callback){
		var param = {password : pwd, newPassword : newPwd};
		$.ajax({
			url		: '/web/api/user/changePassword',
			async	: true,
			cache	: false,
			dataType: 'json',
			data	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取当前登录用户的属性，目前只是为了获取要不提示用户修改密码 @author sunwei
	// 而且只在登录成功以后查询一次
	getCurrentUserProperties: function(onsuccess, onerror) {
		$.ajax({
			url		: '/web/api/user/current_user_props',
			type	: 'GET',
			async	: true,
			cache	: false,
			dataType: 'json',
			success	: onsuccess,
			// override setup
			error : onerror,
			statusCode : {},
			beforeSend: function() {
				// NO-OP
			}
		});
	},
	
	// 获取当前登录用户的所有权限 @author yoson
	getCurrentPermission: function(callback) {
		$.ajax({
			url		: '/web/api/user/current_permission',
			type	: 'GET',
			async	: true,
			cache	: false,
			dataType: 'json',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某个用户的最近登陆信息 @author fuleisen
	queryUserLatestLogonInfo: function(param,callback) {
		$.ajax({
			url		: '/web/api/user/queryUserLatestLogonInfo',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 系统维护 - 用户管理相关的方法
	 * @author sunwei
	 */
	// 列举系统中所有用户 @author sunwei
	listAllUsers: function(callback) {
		$.ajax({
			url		: '/web/api/user/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createUser: function(user, callback) {
		$.ajax({
			url		: '/web/api/user',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(user),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyUser: function(user, callback) {
		$.ajax({
			url		: '/web/api/user',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(user),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteUser: function(userID, callback) {
		$.ajax({
			url		: '/web/api/user?userID=' + userID,
			type	: 'DELETE',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUser: function(userID, callback) {
		$.ajax({
			url		: '/web/api/user?userID=' + userID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUserList: function(userids, callback) {
		$.ajax({
			url		: '/web/api/user/getUserList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(userids),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUserDetailList: function(userids, callback) {
		$.ajax({
			url		: '/web/api/user/getUserDetailList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(userids),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	freshCloudUserList:function(callback){
		$.ajax({
			url		: '/web/api/user/freshCloudUserList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCloudUserList:function(callback){
		$.ajax({
			url    : '/web/api/user/clouduser',
			type   : 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addUserFromCloud:function(param, orgID, roleID, callback){
		$.ajax({
			url		: '/web/api/user/addUserFromCloud?orgID='+orgID+'&roleID='+roleID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUserProperties: function(param, callback) {
		$.ajax({
			url		: '/web/api/user/property/get',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	orgsByUser: function(param, callback) {
		$.ajax({
			url		: '/web/api/org/orgsByUser',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getPathByOrgID: function(param, callback) {
		$.ajax({
			url		: '/web/api/org/getPathByOrgID',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	batchUpdateUserBusiorg: function(param, callback) {
		$.ajax({
			url		: '/web/api/org/batchUpdateUserBusiorg',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 我的消息相关的方法
	 */
	// 列举某组织节点下所有用户 @author yoson
	listUsers: function(orgid, callback){
		$.ajax({
			url		: '/web/api/user/list/' + orgid,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 列举聊天组 @author yoson
	listGroups: function(onlyActive, callback){
		$.ajax({
			url		: '/web/api/message/listGroups',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {onlyActive: onlyActive},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 创建聊天组 @author yoson
	createGroup: function(group, callback){
		$.ajax({
			url		: '/web/api/message/createGroup',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(group),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 角色权限相关
	 * @author sunwei
	 */
	listPermissions: function(callback) {
		$.ajax({
			url		: '/web/api/role/permission/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createPermission: function(perm, callback) {
		$.ajax({
			url		: '/web/api/role/permission',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(perm),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyPermission: function(perm, callback) {
		$.ajax({
			url		: '/web/api/role/permission',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(perm),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deletePermission: function(id, callback) {
		$.ajax({
			url		: '/web/api/role/permission?permissionID=' + id,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	listRoles: function(callback) {
		$.ajax({
			url		: '/web/api/role/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createRole: function(role, callback) {
		$.ajax({
			url		: '/web/api/role',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(role),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyRole: function(role, callback) {
		$.ajax({
			url		: '/web/api/role',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(role),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteRole: function(id, callback) {
		$.ajax({
			url		: '/web/api/role?roleID=' + id,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 组织结构相关
	 * @author sunwei
	 */
	listOrgs: function(callback) {
		$.ajax({
			url		: '/web/api/org/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// TODO sunwei 这个方法名字有点不具体
	getChildren: function(id, callback) {
		$.ajax({
			url		: '/web/api/org/children?orgID=' + id,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAllUserAndOrg : function(callback){
		$.ajax({
			url		: '/web/api/org/getAllUserAndOrg',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getChildrenOrgAndUser: function(param, callback) {
		$.ajax({
			url		: '/web/api/org/getChildrenOrgAndUser',
			type	: 'GET',
			async	: true,
			cache	: false,
			data    : param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getChildrenOrgAndSpecUser: function(param, callback) {
		$.ajax({
			url		: '/web/api/org/getChildrenOrgAndSpecUser',
			type	: 'GET',
			async	: true,
			cache	: false,
			data    : param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	listOrgUsers: function(id, callback) {
		$.ajax({
			url		: '/web/api/org/users?orgID=' + id,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	listUserOrgs: function(id, callback) {
		$.ajax({
			url		: '/web/api/org/userOrgs?userID=' + id,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 这是以前的方法，插入之前都把orgid的数据全部删掉，再插入新的，已经不适用，所以又重新写了下边的方法 lixue
	 * @param id
	 * @param param
	 * @param callback
	 */
	setOrgUsers: function(id, param, callback) {
		$.ajax({
			url		: '/web/api/org/users?orgID=' + id,
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	setOrgUserList : function(id, param, callback){
		$.ajax({
			url		: '/web/api/org/setOrgUsers?orgID=' + id,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//TODO lixue 有时间将这个和下面的合并成一个，却掉这个
	resetUserOrg : function(oldorgId, param, callback){
		$.ajax({
			url		: '/web/api/org/resetUserOrg?oldorgID=' + oldorgId,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	resetUsersOrg : function(neworgID ,oldorgID , param ,callback){
		$.ajax({
			url		: '/web/api/org/resetUsersOrg?neworgID=' + neworgID +'&oldorgID=' + oldorgID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	resetOrg: function(parentid, param, callback){
		$.ajax({
			url		: '/web/api/org/resetOrg?parentID=' + parentid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createOrg: function(org, callback) {
		$.ajax({
			url		: '/web/api/org',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(org),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyOrg: function(org, callback) {
		$.ajax({
			url		: '/web/api/org',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(org),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteOrg: function(id, callback) {
		$.ajax({
			url		: '/web/api/org?orgID=' + id,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//绑定用户栏目
	bindUserAndColumn: function( param , callback) {
		$.ajax({
			url		: '/web/api/org/setUserOrganizations',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//关联用户和用户组,和栏目的区别是不关注 roleid， 而用户组则关注roleid
	bindUserAndGroup: function( param , callback) {
		$.ajax({
			url		: '/web/api/org/setUserGroup',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateOrgRole: function( orgid , roleid , callback){
		$.ajax({
			url		: '/web/api/org/updateOrgRole?orgID=' + orgid + '&roleID=' + roleid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addOrgUserRole: function( orgid , userid , roleid , callback){
		$.ajax({
			url		: '/web/api/org/addOrgUserRole?orgID=' + orgid + '&roleID=' + roleid + '&userID=' + userid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateOrgUserRole: function( orgid , userid , roleid , callback){
		$.ajax({
			url		: '/web/api/org/updateOrgUserRole?orgID=' + orgid + '&roleID=' + roleid + '&userID=' + userid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteOrgUserRole: function( orgid , userid , roleid , callback){
		$.ajax({
			url		: '/web/api/org/deleteOrgUserRole?orgID=' + orgid + '&roleID=' + roleid + '&userID=' + userid,
			type	: 'DELETE',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	deleteUserAndorg :function(userid, orgid, callback){
		$.ajax({
			url		: '/web/api/org/delUserOrg?userid='+userid+'&orgid='+orgid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getColumn: function(id, callback) {
		$.ajax({
			url		: '/web/api/org/column?orgID=' + id,
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createColumn: function(column, callback) {
		$.ajax({
			url		: '/web/api/org/column',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(column),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyColumn: function(column, callback) {
		$.ajax({
			url		: '/web/api/org/column',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(column),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 检索流程定义（配置），从数据库中
	 * columnName使用的是数据库中的字段名（全小写）
	 * @author sunwei
	 */
	searchProcessDefine: function(param, callback) {
		$.ajax({
			url		: '/web/api/proc/define/search',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某个流程定义的版本 @author sunwei
	getProcessDefine: function(defID, callback) {
		$.ajax({
			url		: '/web/api/proc/define?defID=' + defID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 部署（添加）某个流程定义的版本 @author sunwei
	deployProcessDefine: function(param, callback) {
		$.ajax({
			url		: '/web/api/proc/define',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 删除某个流程定义的版本 @author sunwei
	deleteProcessDefine: function(defID, callback) {
		$.ajax({
			url		: '/web/api/proc/define?defID=' + defID,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 激活某个流程定义 @author sunwei
	// 相同名称（英文名）的流程定义中只能有一个版本被激活，激活这个就取消了其他正在激活状态的版本
	// 流程定义激活后再创建的流程实例就使用这个定义
	// 在这个版本激活前创建的流程实例还使用老的激活版本
	enableProcessDefine: function(defID, callback) {
		$.ajax({
			url		: '/web/api/proc/define/active?defID=' + defID,
			type	: 'PUT',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 取消某个流程定义的激活状态 @author sunwei
	disableProcessDefine: function(defID, callback) {
		$.ajax({
			url		: '/web/api/proc/define/inactive?defID=' + defID,
			type	: 'PUT',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 列举所有流程组件 @author sunwei
	listActivityTemplates: function(callback) {
		$.ajax({
			url		: '/web/api/proc/activity-templates',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 导入流程组件，覆盖更新 @author sunwei
	updateActivityTemplates: function(param, callback) {
		$.ajax({
			url		: '/web/api/proc/activity-templates',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 检索流程实例，从Solr
	 * 注意：
	 * 这个方法的参数中columnName指的是ProcessInstanceType的属性名
	 * 这个方法支持根据相关数据检索，columnName是rela.XXX，后面是相关数据的key值。需要指明相关数据的数据类型dataType
	 * @author sunwei
	 */
	searchProcesses: function(param, callback) {
		$.ajax({
			url		: '/web/api/proc/search',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 从数据库中检索流程实例
	 * 注意：
	 * 这里的参数columnName都是数据库中的字段名（全部小写）
	 * 这个方法不支持根据相关数据检索 
	 * @author sunwei
	 * @param param
	 * @param callback
	 */
	searchProcessesByDB: function(param, callback) {
		$.ajax({
			url		: '/web/api/proc/search_db',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某个流程实例的详情 @author sunwei
	getProcess: function(procID, callback) {
		$.ajax({
			url		: '/web/api/proc',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: {
				procID: procID
			},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某流程实例的所有相关数据 @author sunwei
	getProcessRelaDatas: function(procID, callback) {
		$.ajax({
			url		: '/web/api/proc/rela',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {
				procID: procID
			},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 重建所有流程实例的索引 @author sunwei
	rebuildProcessIndex : function(callback) {
		$.ajax({
			url		: '/web/api/proc/rebuild',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 批量重建流程实例的solr索引 @author sunwei
	rebuildProcessesIndex : function(procIds, callback) {
		$.ajax({
			url		: '/web/api/proc/procs/rebuild',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(procIds),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
   //取消流程实例
	cancelProc : function(procID, callback){
		$.ajax({
			url		: '/web/api/proc/terminatedProc?procID=' + procID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//重做流程实例
	reStartProc :function(procID, callback){
		$.ajax({
			url		: '/web/api/proc/reStartProc?procID=' + procID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	// 活动实例（用于流程监控图） @author sunwei
	getActivityInstance : function(procID, actID, callback) {
		$.ajax({
			url		: '/web/api/act',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {
				procID: procID,
				actID: actID
			},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某活动实例后面的连线（真正走过的路） @author sunwei
	// TODO 方法名字待斟酌
	findTransCtrls : function(actID, callback) {
		$.ajax({
			url		: '/web/api/act/tranctrls?actID=' + actID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某活动实例的所有相关数据 @author sunwei
	getActivityRelaDatas: function(procID, actID, callback) {
		$.ajax({
			url		: '/web/api/act/rela',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {
				procID: procID,
				actID: actID
			},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获取某活动实例的所有工作项 @author sunwei
	getActivityWorkitems: function(actID, callback) {
		$.ajax({
			url		: '/web/api/act/workitems',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {
				actID: actID
			},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 检索工作项任务，从solr索引中
	 * columnName指的是WorkitemType的属性名称，必须指明属性的类型dataType
	 * @author sunwei
	 */
	searchWorkitems: function(param, callback) {
		$.ajax({
			url		: '/web/api/work/search',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 删除所选工作项的索引
	 * @param param
	 * @param callback
	 */
	deleteIndexByQuery: function(param, callback) {
		$.ajax({
			url		: '/web/api/work/works/deleteIndexByQuery',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 检索指定类型的工作项任务，是对方法searchWorkitems的扩展使用
	 * @author yoson
	 * 
	 * TODO yoson 实现方式是否再斟酌一下？ 另外conroller中的方法名、变量名起的都太随意了
	 * 
	 * @param param
	 * @param type 指的是内置的一些常量，如topic, title等，后台会根据这个常量的值组织查询的活动名称（多值）
	 * @param callback
	 */
	searchWorkitemsByType: function(param, type, callback) {
		$.ajax({
			url		: '/web/api/work/searchByType?taskType=' + type,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 重建Workitem的solr索引 @author sunwei
	rebuildWorkitemIndex : function(callback) {
		$.ajax({
			url		: '/web/api/work/rebuild',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 批量重建Workitem的solr索引 @author sunwei
	rebuildWorkitemsIndex : function(workIds, callback) {
		$.ajax({
			url		: '/web/api/work/works/rebuild',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(workIds),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 取消服务类的独立任务 @author sunwei
	cancelWorkitem : function(workID, callback) {
		$.ajax({
			url		: '/web/api/work/cancel?workID=' + workID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 重置出错的服务类任务 @author sunwei
	resetWorkitem : function(workID, callback) {
		$.ajax({
			url		: '/web/api/work/reset?workID=' + workID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 登录日志（会话）
	 * @param param
	 * @param callback
	 */
	querySessions: function(param, callback) {
		$.ajax({
			url		: '/web/api/session/list',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	// 列举系统中所有存储 @author sunwei
	listDevices : function(callback) {
		$.ajax({
			url		: '/web/api/storage/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 创建存储 @author sunwei
	createDevice : function(dev, callback) {
		$.ajax({
			url		: '/web/api/storage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data 	: JSON.stringify(dev),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 修改存储 @author sunwei
	modifyDevice : function(dev, callback) {
		$.ajax({
			url		: '/web/api/storage',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data 	: JSON.stringify(dev),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 删除存储 @author sunwei
	deleteDevice : function(devID, callback) {
		$.ajax({
			url		: '/web/api/storage?devID=' + devID,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 创建存储访问方式 @author sunwei
	createAccessWay : function(way, callback) {
		$.ajax({
			url		: '/web/api/storage/access',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data 	: JSON.stringify(way),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 修改存储访问方式 @author sunwei
	modifyAccessWay : function(way, callback) {
		$.ajax({
			url		: '/web/api/storage/access',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data 	: JSON.stringify(way),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 删除存储访问方式 @author sunwei
	deleteAccessWay : function(wayID, callback) {
		$.ajax({
			url		: '/web/api/storage/access?wayID=' + wayID,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//添加我的订阅
	saveToMySubsribe : function(param, callback){
		$.ajax({
			url   : this.project + '/api/subscribe/saveMySubsribe',
			type  : 'POST',
			async : true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//根据用户id查询订阅
	getSubscribeByuserid : function(userid, callback){
		$.ajax({
			url   : this.project + '/api/subscribe/getSubscribeList?userid='+userid,
			type  : 'POST',
			async : true,
			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//删除某个订阅
	deleteBySubscribeids : function(param, callback){
		$.ajax({
			url   : this.project + '/api/subscribe/deleteBySubscribeids?idlist='+param,
			type  : 'POST',
			async : true,
			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 线索
	search: function(param, callback, extra){
		$.ajax({
			url		: this.project + '/api/resource/search',
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, extra);
			}
		});
	},
	updateTags: function(param, callback){
		$.ajax({
			url		: this.project + '/api/resource/updateTags',
			type	: 'GET',
			async	: true,
			cache   : false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getTags: function(param, callback){
		$.ajax({
			url		: this.project + '/api/resource/getTags',
			type	: 'GET',
			async	: true,
			cache   : false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createClue: function(param, callback){
		$.ajax({
			url		: this.project + '/api/clue/create',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	removeClue : function(param, callback){
		$.ajax({
			url		: this.project + '/api/clue/delete',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	removeTitle : function(param, callback){
		$.ajax({
			url		: this.project + '/api/title/delete',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//新建线索功能调用
	commitCreateClue: function(param, callback, errorCallback){
		$.ajax({
			url		: this.project + '/api/clue/commitCreate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			},
			timeout : 10000,
			error 	: function(jqXHR, textStatus, errorThrown) {
				if(jqXHR.status === 403) {
					if(jqXHR.getResponseHeader('Location')) {
						top.location.href = jqXHR.getResponseHeader('Location');
					} else {
						Message.danger('会话过期啦，要重新登录哦');
						Proxy.showLogin();
					}
					return;
				}
				if(jqXHR.status === 502) {
						Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
					return;
				}
				switch(textStatus) {
				case null:
					// 这种情况还未遇到过
					errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
					Message.show('出错啦:' + errorThrown,
							{cls : 'danger', closable: true});
					break;
				case "timeout":
//					Message.show('啊哦，网络不稳定，提交请求超时啦，再试一次吧', {cls : 'warning'});
					break;
				case "error":
					// 'Not Found'基本不会发生，除非请求地址写错了
					// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
					if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
						// NO-OP
					} else if(jqXHR.readyState === 0) {
						Message.show('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了',
								{cls : 'danger', closable: true});
					} else {
						errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
						Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
					}
					break;
				case "abort":
					// NO-OP
					// Message.show('客户端取消', {cls : 'danger'});
					break;
				case "parsererror":
					Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
					break;
				}
				Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
			}
		});
	},
	
	//快速新建报片功能提交时调用
	createIntervAndSubmitReport: function(param, successCallback, errorCallback){
		$.ajax({
			url		: this.project + '/api/clue/createIntervAndSubmitReport',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(successCallback, response);
			},
			timeout : 10000,
			error 	: function(jqXHR, textStatus, errorThrown) {
				if(jqXHR.status === 403) {
					if(jqXHR.getResponseHeader('Location')) {
						top.location.href = jqXHR.getResponseHeader('Location');
					} else {
						Message.danger('会话过期啦，要重新登录哦');
						Proxy.showLogin();
					}
					return;
				}
				if(jqXHR.status === 502) {
						Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
					return;
				}
				switch(textStatus) {
				case null:
					// 这种情况还未遇到过
					errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
					Message.show('出错啦:' + errorThrown,
							{cls : 'danger', closable: true});
					break;
				case "timeout":
//					Message.show('啊哦，网络不稳定，请求超时啦，再试一次吧', {cls : 'warning'});
					break;
				case "error":
					// 'Not Found'基本不会发生，除非请求地址写错了
					// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
					if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
						// NO-OP
					} else if(jqXHR.readyState === 0) {
						Message.show('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了',
								{cls : 'danger', closable: true});
					} else {
						errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
						Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
					}
					break;
				case "abort":
					// NO-OP
					// Message.show('客户端取消', {cls : 'danger'});
					break;
				case "parsererror":
					Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
					break;
				}
				Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
			}
		});
	},
	//衔接新solr
	/*tempSolr: function(param,callback){
		$.ajax({
			url		: this.project + '/api/clue/tempSolr',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(successCallback, response);
			}
		});
	},*/
	tempSolr: function(param,callback){
		var sendParam = {id:param,type:"add",indexName:"testasset6"}
		$.ajax({
			url		: 'http://10.27.134.82:8080/solrServer/index/update',
			type	: 'get',
			async	: true,
			dataType : "jsonp",
			jsonp: "callbackparam",
			jsonpCallback:"jsonpCallback",
			data 	: JSON.stringify(sendParam),
			success	: function(response) {
				Proxy.__safeCallback(successCallback, response);
			}
		});
	},
	/*//上层框架新建报片功能调用
	commitCreateClue: function(param, interviewID, end, callback){
		$.ajax({
			url		: this.project + '/api/clue/commitCreateReportClue?interviewID=' + interviewID + '&&end=' + end,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},*/
	updateClue : function(param, callback){
		$.ajax({
			url		: this.project + '/api/clue/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	//获得上传素材所需要的moid
	getMoid :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/clue/beginCreate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//获得新报道moid
	getNewTitleMoid :function(param, callback){
		$.ajax({
			url		: this.project +'/api/title/beginCreate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	titleGetAutoGetTopicMoid :function(callback){
		$.ajax({
			url		: this.project +'/api/title/titleAutoGetTopicMoid',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	titleAutoUpdateTopic :function(param, callback){
		$.ajax({
			url		: this.project +'/api/title/titleAutoUpdateTopic',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAsset :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/resource/getAsset',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAssetSync :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/resource/getAsset',
			type	: 'GET',
			async	: false,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getFatherDescription : function(param, callback){
		$.ajax({
			url		: this.project +'/api/rundown/getFatherDescrition',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAssetAndRelationClips :function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/getAssetAndRelationClips',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAssetFiles : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/getAssetFiles',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
//	getAssetByPage : function(param, callback){
//		$.ajax({
//			url		: this.project +'/api/resource/getAsset',
//			type	: 'GET',
//			async	: true,
//			contentType : 'application/json',
//			data 	: param,
//			success	: function(response) {
//				Proxy.__safeCallback(callback, response);
//			}
//		});
//	},
	getFilePath  : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/getFilePath',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				var filepath = response.result;
				var index = filepath.lastIndexOf('/');
				var front = filepath.substring(0, index+1);
				var after = filepath.substring(index+1);
				after = encodeURIComponent(after);
				filepath = front + after;
				response.result = filepath;
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryTask: function(taskType, page, limit, callback){
		$.ajax({
			url		: '/web/api/task/query',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: {taskType: taskType, page: page, limit: limit},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createTitle: function(param, callback){
		$.ajax({
			url		: this.project + '/api/title/create',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	titleCreateAsset: function(param, assettype , callback){
		$.ajax({
			url		: this.project + '/api/title/createAsset?assettype='+assettype,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createChildTitle: function(param,parentID,editStatus, callback){
		$.ajax({
			url		: this.project + '/api/title/createchildtitle?parentID='+parentID+'&editStatus='+editStatus,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	copyTitletoChild : function(param,userid,parentID,editStatus, callback){
		$.ajax({
			url		: this.project + '/api/title/copyTitleToChild?parentID='+parentID+'&editStatus='+editStatus+'&userID='+userid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	bindRelationship: function(moid,parentID,userid,callback){
		$.ajax({
			url		: this.project + '/api/title/bindRelationship?parentID='+parentID+'&moid='+moid+'&userID='+userid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	commitCreateTitle: function(param, callback){
		$.ajax({
			url		: this.project + '/api/title/createflow',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	commitKanKanTitle: function(param, callback){
		$.ajax({
			url		: this.project + '/api/title/sendKanKan',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	commitCreateRundown : function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/createRundownFlow',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createRundown: function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/create',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateRundownAttributes:function(param,ProcessInstanceID,callback){
		$.ajax({
			url		: this.project + '/api/rundown/updateRundownAttributes?ProcessInstanceID='+ProcessInstanceID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	saveNoCommit :function(param, callback){
		$.ajax({
			url		: this.project +'/api/topic/saveNoCommit',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateTopic :function(param, callback){
		$.ajax({
			url		: this.project +'/api/topic/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateRelationship :function(param, callback){
		$.ajax({
			url		: this.project +'/api/topic/updateRelationship',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateTitle: function(param, versionChanged,callback){
		$.ajax({
			url		: this.project + '/api/title/update?versionChanged='+versionChanged,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateRundown: function(param,callback){
		$.ajax({
			url		: this.project + '/api/rundown/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	register: function(param, callback){
		console.log(JSON.stringify(param));
		$.ajax({
			url		: this.project + '/api/onair/register',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	hotword: function(param, callback){
		$.ajax({
			url		: this.project + '/api/onair/hotword',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	hot: function(param, callback){
		$.ajax({
			url		: this.project + '/api/onair/hot',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询今日版面
	 */
	querySheetByCondition : function(param, callback){
		$.ajax({
			url		: this.project +'/api/sheet/getSheetByCondition',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获得用户在当前版面可操作的子版面以及分组名称
	 */
	getBlockNamesAndGroupNames: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/getBlockNamesAndGroupNames',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询版面
	 */
	querySheets: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/getSheets',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 删除版面
	 */
	deleteSheet: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/delete',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询版面类型下拉框
	 */
	getVisibleSheet: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/getVisibleSheet',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 删除子版面
	 */
	delBlockFromSheet: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/delBlockFromSheet',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 单独插入小版面
	 */
	createSheet: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/createSheet',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 批量更新版面
	 */
	updateSheets: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/updateSheets',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 重置版面
	 */
	resetSheet: function(param, callback){
		$.ajax({
			url		: this.project + '/api/sheet/resetSheet',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 创建新的采访任务，后台根据param中是否包含interviewID，确定创建还是更新操作
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	saveInterview :function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/save',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryInterview : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryInterviews',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	queryInterviewByPage : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryInterviewsByPage',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	queryAssignWorkItems : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryAssignWorkItems',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	queryPartyInterview : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryPartyInterview',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	reportclueofprivate : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/reportclueofprivate',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	topicOfAdopted : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/topicOfAdopted',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	kankanews : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/kankanews',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	clueTrend : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/clueTrend',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	userLogon : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/userlogon',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	terminalLogon : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/terminallogon',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	reportClueStage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/reportcluestage',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	reportclueofdept : function(param, callback){
		$.ajax({
			url		: this.project +'/api/statistics/reportclueofdept',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	 /**
     * 多个复杂条件查询采访任务
     * @param param
     * @param callback
     * @param obj
     */
	queryInterviewByCondition:function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryInterviewsByCondition',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	 /**
     * 多个复杂条件查询采访任务(支持递归查询)
     * @author zhaiguangpeng
     * @param param
     * @param callback
     */
	searchInterviewsByDB: function(param, callback) {
		$.ajax({
			url		: this.project +'/api/interview/searchByDB',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 更新采访任务(param必须包含interviewID)
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	updateInterview : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/update',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 更新采访任务基本属性(param必须包含interviewID)
	 * @author zhai_guangpeng
	 * @param param
	 * @param callback
	 */
	updateInterviewReadedFlag : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/updateReadedFlag',
			type	: 'PUT',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 更新采访任务基本属性(param必须包含interviewID)
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	updateInterviewProperty : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/updateProperty',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 采访任务提交审批(param必须包含interviewID)
	 * @param param
	 * @param callback
	 */
	submitInterview : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/submit',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 按照给定的采访任务ID数组进行删除操作（数据库里直接删除）
	 * @param param
	 * @param callback
	 */
	deleteInterview : function(param, callback) {
		$.ajax({
			url		: this.project +'/api/interview/delete',
			type	: 'GET',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 按照给定的采访任务ID数组进行删除操作(可还原)
	 * @param param
	 * @param callback
	 */
	deleteInterviewByFlag : function(param, callback) {
		$.ajax({
			url		: this.project +'/api/interview/deleteByFlag',
			type	: 'GET',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 按照给定的采访任务ID数组进行恢复操作
	 * @param param
	 * @param callback
	 */
	recollectInterview : function(param, callback) {
		$.ajax({
			url		: this.project +'/api/interview/recollect',
			type	: 'GET',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addRelClue : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/addRelClue',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	delRelClue : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/delRelClue',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getClueRelInterviews : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/getClueRelInterviews',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getInterviewtask:function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/getInterview',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getInterviewByPrcInstID:function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/getInterviewByPrcInstID',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getConfig:function(callback_getconfig){
		$.ajax({
			url		: this.project +'/api/config/get',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback_getconfig, response);
			}
		});
	},
	addTask:function(param,callback){
		$.ajax({
			url		: this.project +'/api/task/addTask',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	batchAddTasks:function(param,callback){
		$.ajax({
			url		: this.project +'/api/task/batchAddTask',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getDevicePath :function(param,callback_getconfig){
		$.ajax({
			url		: this.project +'/api/resource/getDevicePath',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	:param,
			success	: function(response) {
				Proxy.__safeCallback(callback_getconfig, response);
			}
		});
	},
	createAdvice  :function(param, callback){
		$.ajax({
			url		: this.project +'/api/advice/create',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	getEnums  :function(callback){
		$.ajax({
			url		: this.project +'/api/config/getEnums',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		
		});
	},
	queryTranscodingWorkitems : function(page, limit, callback){
		var param = {first : page, offset : limit};
		$.ajax({
			url		: this.project + '/api/work/queryTranscodingWorkitems',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryPersonWorkitems : function(taskType, page, limit, callback){
		var param = {taskType : taskType, first : page, offset : limit};
		$.ajax({
			url		: this.project + '/api/work/queryPersonWorkitems',
			type	: 'POST',
			async	: true,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response, param);
			}
		});
	},
	queryPersonWorkitemsInTimeASC : function(taskType, page, limit, actName, callback){
		var param = {taskType : taskType, first : page, offset : limit, timeASC : true, actName: actName};
		$.ajax({
			url		: this.project + '/api/work/queryPersonWorkitemsInTimeASC',
			type	: 'POST',
			async	: true,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response, param);
			}
		});
	},
	getWorkitemRelaData: function(taskType, processInstanceID, callback){
		$.ajax({
			url		: this.project + '/api/work/getWorkitemRelaData',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: {processInstanceID: processInstanceID, taskType : taskType},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getNextActivities: function(workitem, callback){
		$.ajax({
			url		: this.project + '/api/work/getNextActivities',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(workitem),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getStartNextActivities: function(taskType, extraType, callback){
		$.ajax({
			url		: this.project + '/api/work/getStartNextActivities',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: {taskType: taskType, extraType : extraType},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	submitWorkitem: function(param, callback){
		$.ajax({
			url		: this.project + '/api/work/submit',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/*titleQueryPersonWorkitems : function(userId,defNames, page, limit, callback){
		$.ajax({
			url		: this.project + '/api/task/queryPersonWorkitems',
			type	: 'POST',
			async	: false,
			//contentType : 'application/json',
			data 	: {userId: userId, defNames:defNames,first :page, offset: limit},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},*/
	getVersions :function(param, callback){
		$.ajax({
			url		: this.project +'/api/title/getVersions',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addFavorite : function(param, callback){
		$.ajax({
			url		: this.project + '/api/favorite/addFavorite',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data	: JSON.stringify(param),
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCloudCut : function(param, r, fid, callback){
		$.ajax({
			url		: this.project + '/api/cloudcut/service?r='+r+'&fid='+fid,
			type	: 'POST',
			async	: true,
			beforeSend: function(req) {
		        req.setRequestHeader("Accept", "text/html");
		    },
			//contentType : 'text/html',
			dataType: 'text',
			data	: param,
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	saveCloudCutProject : function(param, moid, callback){
		$.ajax({
			url		: this.project + '/api/cloudcut/service?r=save_project&projId=' + moid,
			type	: 'POST',
			async	: true,
			dataType:"text",
			contentType : 'application/json; charset=UTF-8',
			data	: param,
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	referPack : function(moid, taskname, callback){
		$.ajax({
			url		: this.project + '/api/cloudcut/referPack?id='+moid+'&taskname='+taskname,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	doPack : function(moid, taskname, callback){
		$.ajax({
			url		: this.project + '/api/compileragentsvc/doPack?moid='+moid+'&taskname='+taskname,
			type	: 'POST',
			async	: false,
			contentType : 'application/json; charset=UTF-8',
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getRundownList:function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/rundown/getRundownBypage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
    /**
     * 多个复杂条件查询串编单
     * @param param
     * @param callback
     * @param obj
     */
	getRundownByCondition:function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/rundown/getRundownByCondition',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	/**
     * 获取串编单以及所属报道信息
     * @param param
     * @param callback
     * @param obj
     */
	getRundownAssetsByCondition:function(rundownName,start,limit, callback){
		$.ajax({
			url		: this.project +'/api/rundown/getRundownAssetsByCondition?rundownName='+rundownName+'&start='+start+'&limit='+limit,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
     * 根据moid获取其引用串联单名称
     * @param param
     * @param callback
     * @param obj
     */
	getRefRundownNamesByTitleID:function(moid, userid, callback){
		$.ajax({
			url		: this.project +'/api/rundown/getRefRundownNamesByTitleID?moid='+moid+'&userid='+userid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//获得上传素材所需要的moid
	getTopicMoid :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/topic/beginCreate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},	
	commitCreateTopic :function(param, callback){
		$.ajax({
			url		: this.project +'/api/topic/commitCreate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	getRundown:function(param,callback){
		$.ajax({
			url		: this.project +'/api/rundown/getRundown',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	getAssetbyVersion :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/resource/getAssetbyVersion',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 重建一个资产的索引 @author sunwei
	index :function(moid, callback){
		$.ajax({
			url		: this.project +'/api/resource/index?moid=' + moid,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getSpeechRate : function(callback){
		$.ajax({
			url		: this.project +'/api/title/getSpeechRate',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getEditorInitContent : function(callback){
		$.ajax({
			url		: this.project +'/api/title/getEditorInitContent',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//报道自动保存时间
	getTitleeditorAutosaveRate : function(callback){
		$.ajax({
			url		: this.project +'/api/title/getTitleeditorAutosaveRate',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//非编工程自动保存时间
	getBseditorAutosaveRate : function(callback){
		$.ajax({
			url		: this.project +'/api/title/getBseditorAutosaveRate',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getColumnName : function(callback){
		$.ajax({
			url		: this.project +'/api/title/getLocalColumn',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getColumnByUserid : function(userid,callback){
		$.ajax({
			url		: this.project +'/api/column/getColumnByUserid?userid='+userid,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUploadStationEnum : function(prostation,userId,callback){
		$.ajax({
			url		: this.project +'/api/relatedcom/getUploadStationEnum?key='+prostation+'&userId='+userId,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	validateUploadStation : function(prostation,userId,callback){
		$.ajax({
			url		: this.project +'/api/relatedcom/validateUploadStation?key='+prostation+'&userId='+userId,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getUserOrgbyUserID : function(userID,callback){
		$.ajax({
			url		: this.project +'/api/org/getUserOrgbyUserID?&userID='+userID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getTitleTatics : function(columnName,callback){
		$.ajax({
			url		: this.project +'/api/column/geTitleTaticsByName?columnName='+columnName,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryResourceDeviceByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/queryByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryAppUserByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/app/queryAppUserByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryAssignDeviceListByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/queryAssignDeviceListByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryOutOrReturnTaskListByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevicerecord/queryTasksByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deviceRelease : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevicerecord/release',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryOutOrReturnListByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevicerecord/queryByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	queryAssignUserListByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/queryAssignUserListByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	insertResourceDevice : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/insert',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	updateResourceDevice : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	insertRecord : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevicerecord/insert',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	deleteResourceDevices : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/delete',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	queryResourceUserByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/queryByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	querySelectableUserByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/querySelectableUserByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getResourceDeviceByID : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourcedevice/getResourceDeviceByID',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getSelectableUserByID : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/getSelectableUserByID',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	insertResourceUser : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/insert',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	updateResourceUser : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	deleteResourceUsers : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resourceuser/delete',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryBaseAttributes: function(param,callback){
		$.ajax({
			url		: this.project +'/api/config/queryBaseAttributes',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryBaseAttribute: function(param,callback){
		$.ajax({
			url		: this.project +'/api/config/queryBaseAttribute',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	saveBaseAttributes: function(attributes, callback){
		$.ajax({
			url		: this.project +'/api/config/saveBaseAttributes',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data	: JSON.stringify(attributes),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteBaseAttributes: function(names, callback){
		$.ajax({
			url		: this.project +'/api/config/deleteBaseAttributes',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data	: JSON.stringify(names),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryEnums: function(callback){
		$.ajax({
			url		: this.project +'/api/config/getEnumsConfig',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	saveEnums: function(attributes, callback){
		$.ajax({
			url		: this.project +'/api/config/saveEnums',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data	: JSON.stringify(attributes),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteEnums: function(names, callback){
		$.ajax({
			url		: this.project +'/api/config/deleteEnums',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data	: JSON.stringify(names),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	//CloudCut
	getCutClipByFile :function(param, callback){
		$.ajax({
			url		: this.project +'/api/cloudcut/getCutClipByFile',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			dataType: 'text',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	getCutClipByClip :function(param, callback){
		$.ajax({
			url		: this.project +'/api/cloudcut/getCutClipByClip',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			dataType: 'text',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	titleRefer : function(param, callback){
		$.ajax({
			url : this.project + '/api/title/refer?referpack='+ referpack + '&nextADNM='+nextADNM,
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success : function(response){
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 根据rundowid获取到title
	 * @param param
	 * @param callback
	 * @returns
	 */
	getTitleByRundown:function(rundownid,callback){
		$.ajax({
			url		: this.project +'/api/rundown/getTitleByRundown?rundownid='+rundownid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 导出串编单的资源
	 * @param rundownid
	 * @param rundownName
	 * @param callback
	 */
	exportToExcel:function(rundownid,rundownName,callback){
		$.ajax({
			url:this.project+'/api/rundown/exportExcel',
			type:'POST',
			async:true,
			contentType : 'application/json; charset=UTF-8',
			data:{rundownid:rundownid,rundownName:rundownName},
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCmsTopCategory : function(catid, callback) {
		$.ajax({
			url : this.project
					+ '/api/cmstop/getCmsTopCategory?catid='+catid,
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCmsTopPage : function(pageid, callback) {
		$.ajax({
			url : this.project
			+ '/api/cmstop/getCmsTopPageid?pageid='+pageid,
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCmsTopSection : function(pageid, callback) {
		$.ajax({
			url : this.project
					+ '/api/cmstop/getCmsTopSection?pageid='+pageid,
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getAsperaCfg : function(moid,callback) {
		$.ajax({
			url		: '/web/api/aspera/getConfig?moid='+moid,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	}
	,
	registerFile : function(param,callback) {
		$.ajax({
			url		: '/web/api/aspera/registerFile',
			type	: 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	}
	,
	updateFile : function(param,callback) {
		$.ajax({
			url		: '/web/api/aspera/updateFile',
			type	: 'PUT',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	}
	,
	resourceStatistic : function(param, callback) {
		$.ajax({
			url : this.project + '/api/resourcedevice/resourceStatistic',
			type : 'GET',
			async : true,
			cache	: false,
			data : param,
			contentType : 'application/json; charset=UTF-8',
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	hotTagStatistic : function(param, callback) {
		$.ajax({
			url : this.project + '/api/resource/hotTagStatistic',
			type : 'POST',
			async : true,
			data : JSON.stringify(param),
			contentType : 'application/json; charset=UTF-8',
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateTitleUsedTimes: function(moid,addflag,callback){
		$.ajax({
			url		: this.project + '/api/rundown/updateTitleUsedTimes?moid='+moid+'&addflag='+addflag,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	getAllowedUsers : function(callback){
		$.ajax({
			url		: this.project + '/api/clue/getAllowedUsers',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	listFocus : function(callback){
		$.ajax({
			url		: this.project + '/api/focus/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	addFocus: function(param, callback){
		$.ajax({
			url		: this.project + '/api/focus/create',
			type	: 'POST',
			async	: true,
			data	: JSON.stringify(param),
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	delFocus: function(id, callback){
		$.ajax({
			url		: this.project + '/api/focus/delete',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: {focusId: id},
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	ValidateRundown: function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/validate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * @author zhujiuliang
	 * @param param
	 * @param callback
	 * @param extra
	 */
	searchFavorites: function(param, callback, extra){
		$.ajax({
			url		: this.project + '/api/favorite/search',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, extra);
			}
		});
	},
	/**
	 * 从收藏中移除某一条
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	delFavorites: function(param, callback){
		$.ajax({
			url		: this.project + '/api/favorite/delete',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json;charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * @author lihuiyan
	 * @param param
	 * @param callback
	 */
	saveRundownTemplate: function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/saveRundownTemplate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 插入人员排班数据
	 * 
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	insertScheduling : function(param, callback) {
		$.ajax({
			url : this.project + '/api/scheduling/insert',
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 更新人员排班数据
	 * 
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	updateScheduling : function(param, callback) {
		$.ajax({
			url : this.project + '/api/scheduling/update',
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询人员排班数据
	 * 
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	searchScheduling : function(param, callback) {
		$.ajax({
			url : this.project + '/api/scheduling/search',
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 删除人员排班数据
	 * 
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	deleteScheduling : function(param, callback) {
		$.ajax({
			url : this.project + '/api/scheduling/delete',
			type : 'POST',
			async : true,
			contentType : 'application/json; charset=UTF-8',
			data : JSON.stringify(param),
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * @author lihuiyan
	 * @param param
	 * @param callback
	 */
	getRundownTemplate: function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/getRundownTemplate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * @author lihuiyan
	 * @param param
	 * @param callback
	 */
	updateRundownTemplate: function(param, callback){
		$.ajax({
			url		: this.project + '/api/rundown/updateRundownTemplate',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * @author lgp
	 * @param param
	 * @param callback
	 */
	getTimelineByUsername : function(param, callback){
		$.ajax({
			url		: this.project + '/api/weibo/getTimelineByUsernames',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	/**
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	getCommentList : function(param, callback){
		$.ajax({
			url		: this.project + '/api/weibo/getCommentList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	/**
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	getFriends : function(param, callback){
		$.ajax({
			url		: this.project + '/api/weibo/getFriends',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	/**
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	weixinList : function(param, callback){
		$.ajax({
			url		: this.project + '/api/weixin/listByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	/**
	 * @author fuleisen
	 * @param param
	 * @param callback
	 */
	useAsClip : function(param, callback){
		$.ajax({
			url		: this.project + '/api/weixin/useAsClip',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
		
	},
	/**
	 * 获取工作流上一个环节的相关数据
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	getPreActivityRelaData: function(param, callback){
		$.ajax({
			url		: this.project + '/api/work/getPreActivityRelaData',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json;charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 保存考评配置
	 */
	saveEvaluationConfig : function(param,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/saveEvaluationConfig',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteEvalutionConfig : function(ids,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/deleteConfigList?configs='+ids,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 修改考评配置
	 * @param param
	 * @param callback
	 */
	editEvaluationConfig : function(param,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/editEvaluationConfig',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取到考评配置的列表
	 */
	getEvaluationConfigList : function(callback){
		$.ajax({
			url		: this.project +'/api/evaluation/getEvaConfigList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取考评配置数据
	 * @author lihuiyan
	 * @param evaluationType 
	 * @param callback
	 */
	getEvaluationConfig:function(evaluationType,callback){
		$.ajax({
			url		: this.project +'/api/evaluation/getEvaluationConfig?evaluationType='+evaluationType,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 *保存考评数据列表
	 * @author lihuiyan
	 * @param param 
	 * @param callback
	 */
	saveEvaluationList: function(param, callback){
		$.ajax({
			url		: this.project + '/api/evaluation/saveEvaluationList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 保存考评数据
	 * @author lihuiyan
	 * @param param 
	 * @param callback
	 */
	saveEvaluation: function(param, callback){
		$.ajax({
			url		: this.project + '/api/evaluation/saveEvaluation',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取考评数据
	 * @author lihuiyan
	 * @param rundownID orderNum itemfieldname
	 * @param callback
	 */
	getEvaluationData: function(rundownID,orderNum,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/getEvaluationData?rundownID='+rundownID+'&orderNum='+orderNum,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取打印考评数据
	 * @author lihuiyan
	 * @param columnName,itemName,beginTime,endTime
	 * @param callback
	 */
	getEvaluationDetailForPrint:function(columnName,itemName,beginTime,endTime,mark,grade,searchName,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/getEvaluationDetailForPrint?columnName='+columnName
			+'&itemName='+itemName+'&beginTime='+beginTime+'&endTime='+endTime+'&mark='+mark+'&grade='+grade+'&searchName='+searchName,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 根据串编单ID获取考评数据
	 * @author lihuiyan
	 * @param rundownIDs
	 * @param callback
	 */
	getEvaluationDatabyRundownIDs: function(rundownIDs,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/getEvaluationDatabyRundownIDs?rundownIDs='+rundownIDs,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取考评明细
	 * @author lihuiyan
	 * @param evaluation
	 * @param callback
	 */
	getEvaluationDetail: function(params,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/getEvaluationDetail',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(params),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取考评明细新
	 * @author lihuiyan
	 * @param evaluation
	 * @param callback
	 */
	getEvaluationStatisticsData: function(params,callback){
		$.ajax({
			url		: this.project + '/api/evaluation/getEvaluationStatisticsData',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(params),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 采访任务变更时提交数据给后台 由后台判断是否进行百度云推送
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	submitInterviewWorkItemData: function(param, callback){
		$.ajax({
			url		: this.project + '/api/interview/submitInterviewWorkItemData',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 采访任务批量提交
	 * @author zhaiguangpeng
	 * @param param
	 * @param callback
	 */
	submitMultiInterviewWorkflow: function(param, successCallback, errorCallback){
		$.ajax({
			url		: this.project + '/api/interview/submitMultiInterviewWorkflow',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(successCallback, response);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if(jqXHR.status === 403) {
					if(jqXHR.getResponseHeader('Location')) {
						top.location.href = jqXHR.getResponseHeader('Location');
					} else {
						Message.danger('会话过期啦，要重新登录哦');
						Proxy.showLogin();
					}
					return;
				}
				if(jqXHR.status === 502) {
						Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
					return;
				}
				switch(textStatus) {
				case null:
					// 这种情况还未遇到过
					errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
					Message.show('出错啦:' + errorThrown,
							{cls : 'danger', closable: true});
					break;
				case "timeout":
					Message.show('啊哦，连接超时啦，呆会再试试吧', {cls : 'warning'});
					break;
				case "error":
					// 'Not Found'基本不会发生，除非请求地址写错了
					// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
					Proxy.__safeCallback(errorCallback, textStatus, errorThrown);
					return;
					if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
						// NO-OP
					} else if(jqXHR.readyState === 0) {
						Message.show('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了',
								{cls : 'danger', closable: true});
					} else {
						errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
						Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
					}
					break;
				case "abort":
					// NO-OP
					// Message.show('客户端取消', {cls : 'danger'});
					break;
				case "parsererror":
					Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
					break;
				}
			}
		});
	},
	/**
	 * 增加微博微信配置
	 */
	insertSocial:function(param,callback){
		$.ajax({
			url		: this.project + '/api/social/createNewSocial',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询微博微信配置
	 */
	loadSocialList:function(callback){
		$.ajax({
			url		: this.project + '/api/social/loadSocialList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	editSocial:function(param,callback){
		$.ajax({
			url		: this.project + '/api/social/editSocial',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteConfig:function(param,callback){
		$.ajax({
			url		: this.project + '/api/social/deleteConfigList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getPreviewFiles:function(param,callback){
		$.ajax({
			url		: this.project + '/api/resource/getPreviewFiles',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteAssetFile:function(param,callback){
		$.ajax({
			url		: this.project + '/api/resource/deleteAssetFile',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获得公共网络媒体配置
	getSocialConfigList: function(callback) {
		$.ajax({
			url		: this.project + '/api/social/getsocialconfiglist',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 获得有效的公共网络媒体配置（未超期的）
	getValidSocialConfigList: function(callback) {
		$.ajax({
			url		: this.project + '/api/social/getvalidsocialconfiglist',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	weixinTitleSendInsert:function(param,callback){
		$.ajax({
			url		: this.project + '/api/weixintitlesend/insert',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteAsset : function(param, deletedflag, force, callback) {
		$.ajax({
			url		: '/web/api/assetManage/delete?deletedflag=' + deletedflag + '&force=' + force,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	clearRecycleBin : function(callback) {
		$.ajax({
			url		: '/web/api/assetManage/clearRecycleBin',
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	unDeleteAsset : function(param, callback) {
		$.ajax({
			url		: '/web/api/assetManage/unDelete?moID=' + param,
			type	: 'GET',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	unDeleteAssets : function(param, callback) {
		$.ajax({
			url		: '/web/api/assetManage/unDeleteAssets',
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	updateAssetAttr : function(param,  moid, callback) {
		$.ajax({
			url		: '/web/api/assetManage/updateAssetAttr?moid=' + moid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateAssetsAttr : function(param,callback) {
		$.ajax({
			url		: '/web/api/assetManage/updateAssetsAttr',
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	lockAssetLifeCycle : function(moid,lock,callback) {
		$.ajax({
			url		: '/web/api/assetManage/lockLifeCycle?moid=' + moid + '&lock=' + lock,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getScreenValue 	: function(param, callback){
		$.ajax({
			url		: '/web/api/screenconfig/getValue',
			type	: 'POST',
			data	: JSON.stringify(param),
			contentType : 'application/json; charset=UTF-8',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateScreenValue : function(param, callback){
		$.ajax({
			url		: '/web/api/screenconfig/updateValue',
			type	: 'POST',
			data    : JSON.stringify(param),
			contentType : 'application/json; charset=UTF-8',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	weibo : function(param, callback){
		$.ajax({
			url		: '/web/api/show/weibo?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	weixin : function(param, callback){
		$.ajax({
			url		: '/web/api/show/weixin?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	rank : function(param, callback){
		$.ajax({
			url		: '/web/api/show/rank?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	clue : function(param, callback){
		$.ajax({
			url		: '/web/api/show/clue?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	topic : function(param, callback){
		$.ajax({
			url		: '/web/api/show/topic?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	internet : function(param, callback){
		$.ajax({
			url		: '/web/api/show/internet?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	title : function(param, callback){
		$.ajax({
			url		: '/web/api/show/title?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	interview : function(param, callback){
		$.ajax({
			url		: '/web/api/show/interview?count=' + param,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	topFocus : function(param, callback){
		$.ajax({
			url		: '/web/api/show/focus?count=' + param.count,
			type	: 'GET',
			async	: true,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 系统维护 - 服务管理相关的方法
	 * @author zhaoxianchen
	 */
	// 列举系统中所有服务 @author zhaoxianchen
	listAllServices: function(callback) {
		$.ajax({
			url		: '/web/api/wfservice/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	createService: function(service, callback) {
		$.ajax({
			url		: '/web/api/wfservice/createService',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(service),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteService: function(serviceID, callback) {
		$.ajax({
			url		: '/web/api/wfservice?serviceID=' + serviceID,
			type	: 'DELETE',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	modifyService: function(service, callback) {
		$.ajax({
			url		: '/web/api/wfservice',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(service),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	useService: function(serviceID, callback) {
		$.ajax({
			url		: '/web/api/wfservice/use?serviceID=' + serviceID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	disableService: function(serviceID, callback) {
		$.ajax({
			url		: '/web/api/wfservice/disable?serviceID=' + serviceID,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 通联 - 统计数据
	 * @author lihuiyan
	 */
	getRelatedcomStaticticsData : function(param, callback){
		$.ajax({
			url		: '/web/api/relatedcom/getStatictics' ,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});  
	},
	/**
	 * web报片-统计-已完成任务
	 */
	queryDoneTaskWorkitem :function(param, access_token, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/app/v2/workitems/queryDone?access_token=' + access_token,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * web报片-任务
	 */
	queryTaskWorkitems :function(param, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/app/v2/wokitems/query',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 采访任务工作流--领取
	 */
	interviewReceive :function(param, access_token, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/app/v2/task/receive?access_token=' + access_token,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 采访任务工作流--签到
	 */
	interviewHold :function(param, access_token, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/app/v2/task/hold?access_token=' + access_token,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 采访任务工作流--完成
	 */
	interviewDone :function(param, access_token, callback){
		//console.log(param);
		$.ajax({
			url		: this.project +'/api/app/v2/task/done?access_token=' + access_token,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 *  查询可调度资源的调度信息  @author fuleisen
	 */
	querySelectableDeviceResourceAssignInfo: function(group, callback){
		$.ajax({
			url		: '/web/api/resourcedevice/querySelectableResourceAssignInfo',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(group),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	// 查询可调度资源的调度信息  @author fuleisen
	querySelectableUserResourceAssignInfo: function(group, callback){
		$.ajax({
			url		: '/web/api/resourceuser/querySelectableResourceAssignInfo',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(group),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	assignResourceUser : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/assignResourceUser?interviewId='+param.interviewId+'&type='+param.type+'&model='+param.model,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param.resourceUsers),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	assignResourceDevice : function(param, callback){
		$.ajax({
			url		: this.project +'/api/interview/assignResourceDevice?interviewId='+param.interviewId+'&type='+param.type+'&model='+param.model,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param.resourceDevices),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	// 更新资源调度信息  @author fuleisen
	updateAssigneDevice: function(param, callback){
		$.ajax({
			url		: '/web/api/resourcedevice/updateAssigneDevice',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	// 删除资源调度信息  @author fuleisen
	deleteAssigneDevice: function(param, callback){
		$.ajax({
			url		: '/web/api/resourcedevice/deleteAssigneDevice',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	// 更新资源调度信息  @author fuleisen
	updateAssigneUser: function(param, callback){
		$.ajax({
			url		: '/web/api/resourceuser/updateAssigneUser',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},

	// 删除资源调度信息  @author fuleisen
	deleteAssigneUser: function(param, callback){
		$.ajax({
			url		: '/web/api/resourceuser/deleteAssigneUser',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	updateInterviewTopic : function(param, callback){
		$.ajax({
			url		: '/web/api/interview/updateTopic',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	postStatistics : function(param, callback) {
		$.ajax({
			url : '/web/api/resourceuser/postStatistics',
			type : 'GET',
			async : true,
			contentType : 'application/json;charset=UTF-8',
			data : param,
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	appUserOnline : function(param, callback) {
		$.ajax({
			url : '/web/api/show/appUserOnline',
			type : 'GET',
			async : true,
			contentType : 'application/json;charset=UTF-8',
			data : null,
			success : function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 分页查询用户反馈意见
	 */
	queryFeedbacksByPage : function(param, callback){
		$.ajax({
			url		: this.project +'/api/feedback/queryFeedbacksByPage',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 设置用户反馈意见为已读
	 */
	setFeedbackToRead : function(param, callback){
		$.ajax({
			url		: this.project +'/api/feedback/setToRead',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 针对资产下素材重新生成缩略图和图片、视频标志位
	 */
	regenerateThumbnailAndFlag : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/regenerateThumbnailAndFlag',
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 选题和报道加入版面
	 */
	assetAdd2Sheet: function(param,groupname,callback){
		$.ajax({
			url		: this.project + '/api/sheet/assetAdd2Sheet?groupname='+groupname,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 删除版面单条记录
	 */
	delAssetFromSheet: function(titlemoid,sheetid,callback){
		$.ajax({
			url		: this.project + '/api/sheet/delAssetFromSheet?titlemoid='+titlemoid+'&sheetid='+sheetid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获得报道的自配发送平台
	 */
	getTitleOtherTargets: function(callback) {
		$.ajax({
			url		: this.project + '/api/title/getTitleOtherTargets',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getRefAssets: function(param, callback) {
		$.ajax({
			url		: this.project + '/api/resource/getRefAssets',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getCloseRefAssets: function(param, callback) {
		$.ajax({
			url		: this.project + '/api/resource/getCloseRefAssets',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryInverseAssetsByMoID: function(param, callback) {
		$.ajax({
			url		: this.project + '/api/resource/queryInverseAssetsByMoID',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryKankanInfos : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/queryKankanInfos',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	// add by hh 查看是否过送看看按钮
	hasKankaned : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/hasKankaned',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getTopicAllClips: function(param, callback) {
		$.ajax({
			url		: this.project + '/api/resource/getTopicAllClips',
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	queryInterviewsAndResultClueByPage : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryInterviewsAndResultClueByPage',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	queryInterviewsByPageUsingSearchType : function(param, callback, obj){
		$.ajax({
			url		: this.project +'/api/interview/queryInterviewsByPageUsingSearchType',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response, obj);
			}
		});
	},
	listUsersByRole : function(param, callback){
		$.ajax({
			url		: this.project + '/api/user/listUsersByRole',
			type	: 'GET',
			async	: true,
			data    : param,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**资产评论*/
	getCommentsNum: function(moid, callback){
		$.ajax({
			url		: this.project + '/api/comment/count/' + moid,
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	getComments: function(moid, callback){
		$.ajax({
			url		: this.project + '/api/comment/get/' + moid,
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	deleteComment: function(moid, callback){
		$.ajax({
			url		: this.project + '/api/comment/delete/' + moid,
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addComment: function(param, callback){
		$.ajax({
			url		: this.project +'/api/comment/add',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	addScreenCache: function(param, callback){
		$.ajax({
			url		: this.project +'/api/screenconfig/addScreenCache',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获得云视微信平台账号信息
	 */
	getOnairWechatAcc: function(callback) {
		$.ajax({
			url		: this.project + '/api/onair/getOnairWechatAcc',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获得微信的发送目标 是发往本地账号 还是发往云平台 loacl是本地 onair为云平台
	 */
	getWechatDestination : function(callback){
		$.ajax({
			url		: this.project +'/api/onair/getWechatDestination',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获得云视CMS平台频道信息
	 */
	getOnairCmsChannel: function(callback) {
		$.ajax({
			url		: this.project + '/api/onair/getOnairCmsChannel',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获得数字报道栏目
	 */
	getDigitalTitleColumn : function(callback){
		$.ajax({
			url		: this.project +'/api/column/getDigitalTitleColumn',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * add by hh  
	 *  获取系统初始化参数
	 */
	getBaseAttribute : function(attributeName,callback){
		$.ajax({
			url		: this.project +'/api/column/getBaseAttribute?attributeName='+attributeName,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 报道图片编辑上传
	 */
	editorUpload : function(param, callback){
		$.ajax({
			url		: this.project + '/api/editorupload/upload',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取通联线索对应的报道
	 */
	getrelatedTitles : function(MoidsParam,userId,callback){
		$.ajax({
			url		: this.project +'/api/clue/getrelatedTitles?userId='+userId,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data	:  JSON.stringify(MoidsParam),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取GPS汇报记录
	 */
	deviceLbsList : function(param,callback){
		$.ajax({
			url		: this.project +'/api/device/list',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data	:  JSON.stringify(param),
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取内容对比结果 然后到前台渲染
	 */
	uesVersionIdCompareContent:function(moid, versionIdA, versionIdB, isHtml, callback){
		$.ajax({
			url		: this.project +'/api/contentCompare/uesVersionIdCompareContent?moid='
						+ moid + '&versionIdA=' + versionIdA + '&versionIdB=' + versionIdB
						+ '&isHtml=' + isHtml,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 增加推送editsphere任务
	 */
	addPushTasks : function(param, callback){
		$.ajax({
			url		: this.project +'/api/resource/addPushTasks',
			type	: 'GET',
			async	: true,
			cache	: false,
			data    : param,
			success	: function(response) {
				Proxy.__safeCallback(callback, response);
			}
		});
	},
};

$.ajaxSetup({
	beforeSend: function(jqXHR, settings) {
		try {
			var session = SessionHelper.getCurrentSession();
			if(session != null) {
				jqXHR.setRequestHeader('Accept', 'application/json');
				jqXHR.setRequestHeader('sessionID', session.sessionID);
				jqXHR.setRequestHeader('userID', session.userID);
				jqXHR.setRequestHeader('userName', encodeURIComponent(session.userName));
				return true;
			} else {
				//Message.show('本地会话为空，你还没有登录吧？请求就不发给服务端啦！', {cls : 'warning', closable: true});
				return true;
			}
		} catch(e) {
			Message.show('解析本地会话出错啦，请求发不到服务端啦，刷新下试试吧', {cls : 'danger', closable: true});
			return false;
		}
	},
//	jqXHR.readyState
//	0 (未初始化)： (XMLHttpRequest)对象已经创建，但还没有调用open()方法。
//	1 (载入)：已经调用open() 方法，但尚未发送请求。
//	2 (载入完成)： 请求已经发送完成。
//	3 (交互)：可以接收到部分响应数据。
//	4 (完成)：已经接收到了全部数据，并且连接已经关闭。
	error : function(jqXHR, textStatus, errorThrown) {
		if(jqXHR.status === 403) {
			if(jqXHR.getResponseHeader('Location')) {
				top.location.href = jqXHR.getResponseHeader('Location');
			} else {
				Message.danger('会话过期啦，要重新登录哦');
				Proxy.showLogin();
			}
			return;
		}
		switch(textStatus) {
		case null:
			// 这种情况还未遇到过
			errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
			Message.show('出错啦:' + errorThrown,
					{cls : 'danger', closable: true});
			break;
		case "timeout":
			Message.show('啊哦，连接超时啦，呆会再试试吧', {cls : 'warning'});
			break;
		case "error":
			// 'Not Found'基本不会发生，除非请求地址写错了
			// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
			if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
				// NO-OP
			} else if(jqXHR.readyState === 0) {
				Message.show('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了',
						{cls : 'danger', closable: true});
			} else {
				errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
				Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
			}
			break;
		case "abort":
			// NO-OP
			// Message.show('客户端取消', {cls : 'danger'});
			break;
		case "parsererror":
			Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
			break;
		}
	},
//	statusCode
//	100——客户必须继续发出请求
//	101——客户要求服务器根据请求转换HTTP协议版本
//
//	200——成功
//	201——提示知道新文件的URL
//
//	300——请求的资源可在多处得到
//	301——删除请求数据
//
//	404——没有发现文件、查询或URl
//	500——服务器产生内部错误
	statusCode : {
		404 : function() {
			Message.show('后台请求的地址不对哦', {cls : 'danger', closable: true});
		},
		500 : function() {
			Message.show('后台服务出错啦，联系网络运维人员吧', {cls : 'danger', closable: true});
		}
	}
});
