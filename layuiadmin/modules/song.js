 var wy = 0;
var qq = 1;
var kg = 2;
var current = 1;//当前歌曲页数
var currentDiscover = 1;//当前歌单页数
var limit = 20;//分页数量
var limitDiscover = 12;//分页数量
var musicLength = 0;//歌单长度
var discoverLength = 0;//歌单长度
var ap;//播放器
var musicList = new Array();//歌区列表
var discoverList = new Array();//歌单列表
var searchKey = "";//搜索词
		
/**
 *  转换歌单数据
 *  data 要转换的数据
 */
function songListconvert(data) {
    var result = new Array();
    for (var i = 0;i<data.length;i++) {
        var temp = new Object();
        temp['name'] = data[i]['title'];
        temp['artist'] = data[i]['author'];
        temp['url'] = data[i]['url'];
        temp['cover'] = data[i]['pic'];
        temp['lrc'] = data[i]['lrc'];
        //判断是否有时间
        if (data[i]['time']) {
            temp['time'] = data[i]['time'];
        }
        result[i] = temp;
    }
    return result;
}
/**
 * ajax 获取音乐内容
 * code 请求码
 * data 请求内容
 */
function ajaxGetMusicData(code, data) {
	
    $.ajax({
        type: "POST",
        url: "https://api.hibai.cn/api/index/index",
        data: {'TransCode': code, 'OpenId': '7cwa.com', 'Body': data},
        dataType: 'json',
        async: false,
        success: function (result) {
            var data = result.Body;
            musicList = songListconvert(data);
            if(musicList.length==1){
                song = musicList[0];
            }
            musicLength = musicList.length;
        }
    });
}
/**
 * 加载音乐播放器
 * @param List
 * @param type
 */
function aplayerLoadingSong(musicList,id,type) {
    //判断是否加载ap 若没有加载则初始化
    if(ap==null){
        ap = new APlayer({
            container: document.getElementById('aplayer'),
            theme: '#e9e9e9',
            listFolded: true,
            lrcType: 3,
            mutex: true,
            audio: musicList
        });
    }
    //调用加载内容
    topContent(musicList,id,type);
    //美化播放器
    aplayerFix();
}
/**
 * 播放器美化
 */
function aplayerFix() {
    $('.aplayer').css('box-shadow', 'none');
    $('.aplayer-pic').css('border-radius', '12px');
    $('.aplayer-info').css('border-bottom','none');
}
//默认获取网易云榜单
ajaxGetMusicData("020117","");
//美化播放器
aplayerFix();
//加载内容
aplayerLoadingSong(musicList,"top","wy");
//默认加载分页
pageMusic(musicLength,"wy");
//监听音乐
AplayerListener();
/**
 * 加载Content 
 * dataList加载内容 
 * type 加载类型
 */
function topContent(dataList,id, type) {
    /*if(id!=""){
        //添加通用块
        addContent(id,type);
    }*/
    $(".layui-tab-content .layui-show").html("<div class='music-list'>" +
        "       <ul>" +
        "          <li class='music-list-li music-list-header'>" +
        "           <div class='layui-row'>" +
        "              <div class='layui-col-md1 layui-col-xs1'><div class='number'>序号</div></div>" +
        "              <div class='layui-col-md7 layui-col-xs7'><div class='title'>歌曲</div></div>" +
        "              <div class='layui-col-md1 layui-col-xs1'><div class='play'>播放</div></div>" +
        "              <div class='layui-col-md1 layui-col-xs1'><div class='download'>下载</div></div>" +
        "              <div class='layui-col-md2 layui-col-xs2'><div class='time'>时长</div></div>" +
        "            </div>" +
        "          </li>" +
        "          <div id="+type+">" +
        "          </div>" +
        "        </ul> " +
        "    </div>");
    var str ="";
    for (var i = 0+(current-1)*limit; i<current*limit; i++) {
        if(dataList[i]==null){
            break;
        }
        //分
        var time = dataList[i].time;
        m = PrefixInteger(Math.floor(parseInt(time)/60),2);
        //秒
        s = PrefixInteger((parseInt(dataList[i].time))%60,2);
        str = str +
            "<li class='music-list-li'>" +
            "   <div class='layui-row'>" +
            "       <div class='layui-col-md1 layui-col-xs1'>" +
            "           <div class='number'>"+(i+1)+"</div>" +
            "       </div>" +
            "       <div class='layui-col-md7 layui-col-xs7 text-hide'>" +
            "           <div class='pic list-song'>" +
            "                <img src='"+dataList[i].cover+"' alt='loadimg...' width='20px'>" +
            "           </div>" +
            "           <div class='title list-song'><p>"+dataList[i].name+"</p></div>" +
            "           <div class='author list-song'><p>"+dataList[i].artist+"</p></div>" +
            "       </div>" +
            "       <div class='layui-col-md1 layui-col-xs1'>" +
            "           <div class='play'>" +
            "               <a onclick='playThis(0,"+i+")' value='"+i+"'>" +
            "                   <i class='layui-icon icon-player' value='0' style='font-size: 20px; color: #049688;'></i>" +
            "               </a>" +
            "           </div>" +
            "       </div>" +
            "       <div class='layui-col-md1 layui-col-xs1'>" +
            "           <div class='download'><a href='"+dataList[i].url+"'><i class='layui-icon' style='font-size: 20px; color: #049688;'></i></a></div>" +
            "       </div>" +
            "       <div class='layui-col-xs2'>" +
            "           <div class='time'>"+m+":"+s+"</div>" +
            "       </div>" +
            "    </div>" +
            "</li>";
    }
    $("#"+type+"").html(str);//添加列表
}

//时间空位补0
function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
/**
 * 分页
 */
function pageMusic(count,type) {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage,
            layer = layui.layer;
        laypage.render({
            elem: 'page'
            , count: count
            , limit: limit
            , first: '首页'
            , last: '尾页'
            , jump: function (obj) {
                //obj包含了当前分页的所有参数，比如：
                current = obj.curr;
                aplayerLoadingSong(musicList,"top",type);
            }
        });
    });
}
/**
 * 监听tab
 */
layui.use('element', function(){
    var $ = layui.jquery,
    element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
    //监听tab切换
    element.on('tab(top)', function(data){
    	
        switch(data.index){
            case 0:
            	var length = $(".music-list ul" ).children("#wy").length; 
            	if(length == 0){
            		ajaxGetMusicData("020117","");
	                aplayerLoadingSong(musicList,"top",wy);
	                //当前页置1
	                current = 1;
	                //默认加载分页
	                pageMusic(musicLength,wy);
	                //重新加载数据
	                ap.list.audios = musicList;
            	}
                break;
            case 1:
            	var length = $(".music-list ul" ).children("#qq").length;
            	if(length == 0){
            		ajaxGetMusicData("020337","");
	                aplayerLoadingSong(musicList,"top","qq");
	                //当前页置1
	                current = 1;
	                //默认加载分页
	                pageMusic(musicLength,"qq");
	                //重新加载数据
	                ap.list.audios = musicList;
            	}
                break;
            case 2:
                ajaxGetMusicData("020226","");
                aplayerLoadingSong(musicList,"top",kg);
                //当前页置1
                current = 1;
                //默认加载分页
                pageMusic(musicLength,kg);
                //重新加载数据
                ap.list.audios = musicList;
                break;
        }
    });
    //监听tab切换
    element.on('tab(discover)', function(data){
        switch(data.index){
            case 0:
                ajaxGetDisoverData("020551","");//获取网易歌单
                discoverContent(discoverList,wy);
                pageDiscover(discoverLength,wy);
                break;
            case 1:
                ajaxGetDisoverData("020553","");//获取QQ歌单
                discoverContent(discoverList,qq);
                pageDiscover(discoverLength,qq);
                break;
            case 2:
                ajaxGetDisoverData("020552","");//获取酷狗歌单
                discoverContent(discoverList,kg);
                pageDiscover(discoverLength,kg);
                break;
        }
    });
    //监听tab切换
    element.on('tab(searchList)', function(data){
        switch(data.index){
            case 0:
                ajaxGetMusicData("020116",{key:searchKey});//获取网易歌单
                aplayerLoadingSong(discoverList,"searchList",wy);
                ap.list.audios = musicList;
                pageMusic(discoverLength,wy);
                break;
            case 1:
                ajaxGetMusicData("020336",{key:searchKey});//获取QQ歌单
                aplayerLoadingSong(discoverList,"searchList",qq);
                ap.list.audios = musicList;
                //默认加载分页
                pageMusic(musicLength,qq);
                break;
            case 2:
                ajaxGetMusicData("020225",{key:searchKey});//获取酷狗歌单
                aplayerLoadingSong(discoverList,"searchList",kg);
                ap.list.audios = musicList;
                pageMusic(discoverLength,kg);
                break;
        }
    });
});
/**
 * 监听播放暂停和下一首
 * @return {[type]} [description]
 */
function AplayerListener(){
    ap.on('play',function() {
        // 获取当前播放的音乐索引
        playIndex = ap.list.index;
        // //判断是否同一页面的歌曲 如果是则播放
        var currentPlayIndex = $('.play a').eq(playIndex%limit).val();
        if(playIndex==currentPlayIndex){
            // 设置播放中的图标为暂停
            setPlayShowStatus(playIndex,false);
        }
    });
    ap.on('pause',function() {
        // 获取当前播放的音乐索引
        playIndex = ap.list.index;
        // 设置播放中的图标为暂停
        setPlayShowStatus(playIndex,true);
    });
    ap.on('ended',function() {

        //获取当前播放的索引
        playIndex = ap.list.index;
        // 判断歌单是否循环完毕
        if(playIndex==musicLength){
            // 重头开始播放
            ap.list.switch(0);
        }else{
            //下一首
            ap.list.switch(playIndex);
        }
    });
};
/**
 * [setPlayShowStatus 设置播放状态]
 * @param {int} index  [索引]
 * @param {boolean} status [播放状态]
 */
function setPlayShowStatus(index,status) {
    // 如果播放则暂停 否则暂停的播放
    // 由于使用了分页，所以除以分页数求余
    // .layui-show a .icon-player 显示状态下的页面
    if(status){
        $('.layui-show a .icon-player').eq(index%limit).html('&#xe652;');
        $('.layui-show .play a').eq(index%limit).attr('onclick','playThis(0,'+index+')');
    }else{
        $('.layui-show a .icon-player').eq(index%limit).html('&#xe651;');
        $('.layui-show .play a').eq(index%limit).attr('onclick','playThis(1,'+index+')');
    }
}
/**
 * [playThis play or pause]
 * @param  {[int]} index [click num]
 * @return
 */
function playThis(status,index) {
    // 获取当前播放的音乐索引
    playIndex = ap.list.index;
    //未播放过 进行播放
    if(status==0){
        title = $(".aplayer-title").html();
        // 点击与播放的索引不同和音乐名称不相同则重新加载
        if(index!=playIndex||ap.list.audios[index]['name']!=title){
            //切换音乐为点击的音乐
            ap.list.switch(index);
        }
        // 播放
        ap.play();
        // 设置播放中的图标为暂停
        setPlayShowStatus(playIndex,true);
        // 点击播放的图标为播放状态
        setPlayShowStatus(index,false);
    }else if(status==1){ //正在播放中进行暂停
        // 设置播放中的图标为暂停
        ap.pause();
        setPlayShowStatus(index,true);
    }
}