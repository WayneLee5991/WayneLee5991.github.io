layui.define(['form', 'upload','table','laypage'], function(exports){
  	var $ = layui.$
  	,layer = layui.layer
  	,laytpl = layui.laytpl
  	,table = layui.table
  	,setter = layui.setter
  	,view = layui.view
  	,admin = layui.admin;
 
  	//对外暴露的接口
  	exports('music', {
  		initSong: function(elm,id,platform){
			admin.req({
				url:setter.musicUrl + platform +'song'
				,data:{
					id:id
	    			,format: 1
				}
				,done:function(res){
				    var data = res.data[0];
			    	var option = {
			    		container: document.getElementById(elm)
			    		,theme: '#e9e9e9'
			    		,lrcType:3
					    ,audio: [{
					        name: data.name,
					        artist: data.singer,
					        url: data.url,
					        cover: data.pic,
					        lrc: data.lrc
						}]
						,autoplay: false //开启自动播放
			    	};
			    	const ap = new APlayer(option);
			    	$('.aplayer').css('box-shadow', 'none');
				    $('.aplayer-pic').css('border-radius', '12px');
				}
			})
		}
	
  	});
});