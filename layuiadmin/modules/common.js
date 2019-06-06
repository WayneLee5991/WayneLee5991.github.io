/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */
 
layui.define(function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin
  
  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
  	
  	//手机屏幕唤出导航菜单
  	$("#menu_toggle").click(function(){
		var dis = $(".navigation").css("display");
		if(dis == "none"){
			$(".navigation").css("display","block");
			$(".menu").removeClass("fa-bars");
			$(".menu").addClass("fa-times");
			$(".navigation").addClass("layui-anim layui-anim-scale")
		}else{
			$(".navigation").css("display","none");
			$(".menu").removeClass("fa-times");
			$(".menu").addClass("fa-bars");
		}
	})
  	//监听enter键
	$('body').keydown(function (event) {
	    if (event.which == "13") {
	    	var keyword = $(".search-key").val();
	    	if(keyword.trim() == ""){
	    		layer.msg("请输入搜索关键词");
	    	} else {
	    		window.location.href="views/find/result.html?k="+keyword;
	    	};
	    }
	});
  
  //退出
  admin.events.logout = function(){
    //执行退出接口
    admin.req({
      url: layui.setter.base + 'json/user/logout.js'
      ,type: 'get'
      ,data: {}
      ,done: function(res){ //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
        
        //清空本地记录的 token，并跳转到登入页
        admin.exit(function(){
          location.href = 'user/login.html';
        });
      }
    });
  };

  
  //对外暴露的接口
  exports('common', {});
});