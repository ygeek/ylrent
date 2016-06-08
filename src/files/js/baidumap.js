/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var htmlstr ;
var city ='上海';
// 创建标注 并添加自定义窗口
function addMarker(point,content,name){
	var marker = new BMap.Marker(point);
	map.addOverlay(marker);
	//添加信息窗口
	var opts = {width : 250,height: 80,title : name ,enableMessage:true};
	marker.addEventListener("click",function(e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
		
	});
  
}
//获取周边数据
function getJsonInfo(query,htmlid)
{
	$(".tabcon02").hide();
	$("#"+htmlid).show();
	$(".tabbtn02 li").removeClass("current");
	$("."+htmlid).addClass("current");
	var ht = $("#"+htmlid+" table").attr('ht');
	if(ht=="1")
	{
            //直接调用缓存数据
            var datas = $("div").data("'"+htmlid+"'");
            deletePoint();
            addThisMaker();
            $.each( datas.results, function(key, val){
				
                var ggpoint = new BMap.Point(val.location.lng,val.location.lat);
                var content = "地址："+val.address;
                //添加标注以及信息窗口
                addMarker(ggpoint,content,val.name); 
            });
            return ;
		//$("#"+htmlid+" table").html('');
	}
	$("#"+htmlid+" table").attr('ht','1');
	deletePoint();
	addThisMaker();
	var filter = $("."+htmlid).attr('filter');
	var filterStr = '';
	var radius  = $("."+htmlid).attr('radius');
	if(!radius) radius='20000';
	if(filter)
	{
		filterStr = '&filter='+filter+'&location='+latitude+','+longitude+'&radius='+radius;
	}
	else
	{
		filterStr = '&location='+latitude+','+longitude+'&radius='+radius;
	}
	$.getJSON("http://api.map.baidu.com/place/v2/search?query="+encodeURIComponent(query)+"&page_size=10&page_num=0&scope=2"+filterStr+"&output=json&ak=hfr56zCA14KkpuRGsr2vKcV0GOG7KtH6&callback=?", function(data){ 
		//获取数据成功！
		if(data.status==0)
		{
			
			$.each( data.results, function(key, val){
				
				var ggpoint = new BMap.Point(val.location.lng,val.location.lat);
				var content = "地址："+val.address;
				//添加标注以及信息窗口
				addMarker(ggpoint,content,val.name); 
				 
				
				//计算驾车时间和距离  回调方法里面嵌套步行的时间
				var transit = new BMap.DrivingRoute(map, {onSearchComplete: function (results){
				
						if (transit.getStatus() != BMAP_STATUS_SUCCESS){
							return ;
						}
						var plan = results.getPlan(0);
					
						
						//计算步行的时间
						var walking = new BMap.WalkingRoute(map, {onSearchComplete: function (resultss){
						
							if (walking.getStatus() != BMAP_STATUS_SUCCESS){
								return ;
							}
							var plans = resultss.getPlan(0);
							
							//plans.getDistance(true) + "\n";             //获取距离
							htmlstr = '<tr  id="'+val.location.lng+'_'+val.location.lat+'" onclick="infoOpen('+val.location.lng+','+val.location.lat+',\''+content+'\',\''+val.name+'\')" ><td>'+val.name+'</td><td><img src="/img/icon16.png" /></td><td>'+plans.getDuration(true)+'</td><td><img src="/img/icon17.png" /></td><td>'+plan.getDuration(true)+'</td></tr>';
							 //添加html内容
							
							$("#"+htmlid+" table").append(htmlstr);
						}});
						walking.search(point, ggpoint);
					
						
					},
				});
				transit.search(point, ggpoint);
				
			});
			//缓存起来数据
                        $("div").data("'"+htmlid+"'",data);
		}
		else
		{
			alert('数据获取失败！'); 
		}
	});
}
//清空标注点
function deletePoint(){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
		map.removeOverlay(allOverlay[i]);	
	}
}
//添加当前标注
function addThisMaker()
{
	//添加当前房源标注并直接显示
	var centerPoint = new BMap.Point(longitude,latitude);
	var centerContent = "地址："+centerPointAddress;
	//添加标注以及信息窗口
	//创建特殊图标
	
	var myIcon = new BMap.Icon("/img/dibiao.png", new BMap.Size(42,42));
	var marker2 = new BMap.Marker(centerPoint,{icon:myIcon});  // 创建标注
	map.addOverlay(marker2);              // 将特殊标注添加到地图中
	
	//添加信息窗口
	var opts1 = {width : 250,height: 80,title : centerPointName ,enableMessage:true};
	marker2.addEventListener("click",function(e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(centerContent,opts1);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,centerPoint); //开启信息窗口
		
	});
	
	var infoWindow = new BMap.InfoWindow(centerContent,opts1);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,centerPoint); //开启信息窗口
	//添加当前房源结束		
		
}
//自动获取信息框
function infoOpen(x,y,content,name)
{
	var opts = {width : 250,height: 80,title : name ,enableMessage:true,enableAutoPan : true};
	
	point = new BMap.Point(x, y);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,point); //开启信息窗口
	map.getCenter();
}

