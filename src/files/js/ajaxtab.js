




//ajax 选项卡
$('#ajaxtab .tabbtn li a').click(function(){
	var thiscity = $(this).attr("href");
	$("#ajaxtab .loading").ajaxStart(function(){
		$(this).show();
	}); 
	$("#ajaxtab .loading").ajaxStop(function(){
		$(this).hide();
	}); 
	$('#ajaxtab .tabcon').load(thiscity);
	$('#ajaxtab .tabbtn li a').parents().removeClass("current");
	$(this).parents().addClass("current");
	return false;
});
$('#ajaxtab .tabbtn li a').eq(0).trigger("click");

//tab plugins 插件
$(function(){
	
	//选项卡鼠标滑过事件
	$('#statetab .tabbtn li').mouseover(function(){
		TabSelect("#statetab .tabbtn li", "#statetab .tabcon", "current", $(this))
	});
	$('#statetab .tabbtn li').eq(0).trigger("mouseover");
	
	//选项卡鼠标滑过事件
	$('#clicktab .tabbtn li').click(function(){
		TabSelect("#clicktab .tabbtn li", "#clicktab .tabcon", "current", $(this))
	});
	$('#clicktab .tabbtn li').eq(0).trigger("click");

	function TabSelect(tab,con,addClass,obj){
		var $_self = obj;
		var $_nav = $(tab);
		$_nav.removeClass(addClass),
		$_self.addClass(addClass);
		var $_index = $_nav.index($_self);
		var $_con = $(con);
		$_con.hide(),
		$_con.eq($_index).show();
	}
	
});



//ajax 选项卡
$('#ajaxtab01 .tabbtn01 li a').click(function(){
	var thiscity = $(this).attr("href");
	$("#ajaxtab01 .loading").ajaxStart(function(){
		$(this).show();
	}); 
	$("#ajaxtab01 .loading").ajaxStop(function(){
		$(this).hide();
	}); 
	$('#ajaxtab01 .tabcon01').load(thiscity);
	$('#ajaxtab01 .tabbtn01 li a').parents().removeClass("current");
	$(this).parents().addClass("current");
	return false;
});
$('#ajaxtab01 .tabbtn01 li a').eq(0).trigger("click");

//tab plugins 插件
$(function(){
	
	//选项卡鼠标滑过事件
	$('#statetab01 .tabbtn01 li').mouseover(function(){
		TabSelect("#statetab01 .tabbtn01 li", "#statetab01 .tabcon01", "current", $(this))
	});
	$('#statetab01 .tabbtn01 li').eq(0).trigger("mouseover");
	
	//选项卡鼠标滑过事件
	$('#clicktab01 .tabbtn01 li').click(function(){
		TabSelect("#clicktab01 .tabbtn01 li", "#clicktab01 .tabcon01", "current", $(this))
	});
	$('#clicktab01 .tabbtn01 li').eq(0).trigger("click");

	function TabSelect(tab,con,addClass,obj){
		var $_self = obj;
		var $_nav = $(tab);
		$_nav.removeClass(addClass),
		$_self.addClass(addClass);
		var $_index = $_nav.index($_self);
		var $_con = $(con);
		$_con.hide(),
		$_con.eq($_index).show();
	}
	
});
 
 
 
//ajax 选项卡
$('#ajaxtab02 .tabbtn02 li a').click(function(){
	var thiscity = $(this).attr("href");
	$("#ajaxtab02 .loading").ajaxStart(function(){
		$(this).show();
	}); 
	$("#ajaxtab02 .loading").ajaxStop(function(){
		$(this).hide();
	}); 
	$('#ajaxtab02 .tabcon02').load(thiscity);
	$('#ajaxtab02 .tabbtn02 li a').parents().removeClass("current");
	$(this).parents().addClass("current");
	return false;
});
$('#ajaxtab02 .tabbtn02 li a').eq(0).trigger("click");

//tab plugins 插件
$(function(){
	
	//选项卡鼠标滑过事件
	$('#statetab02 .tabbtn02 li').mouseover(function(){
		TabSelect("#statetab02 .tabbtn02 li", "#statetab02 .tabcon02", "current", $(this))
	});
	$('#statetab02 .tabbtn02 li').eq(0).trigger("mouseover");
	
	//选项卡鼠标滑过事件
	$('#clicktab01 .tabbtn02 li').click(function(){
		TabSelect("#clicktab02 .tabbtn02 li", "#clicktab02 .tabcon02", "current", $(this))
	});
	$('#clicktab02 .tabbtn02 li').eq(0).trigger("click");

	function TabSelect(tab,con,addClass,obj){
		var $_self = obj;
		var $_nav = $(tab);
		$_nav.removeClass(addClass),
		$_self.addClass(addClass);
		var $_index = $_nav.index($_self);
		var $_con = $(con);
		$_con.hide(),
		$_con.eq($_index).show();
	}
	
});


 
//ajax 选项卡
$('#ajaxtab03 .tabbtn03 li a').click(function(){
	var thiscity = $(this).attr("href");
	$("#ajaxtab03 .loading").ajaxStart(function(){
		$(this).show();
	}); 
	$("#ajaxtab03 .loading").ajaxStop(function(){
		$(this).hide();
	}); 
	$('#ajaxtab03 .tabcon03').load(thiscity);
	$('#ajaxtab03 .tabbtn03 li a').parents().removeClass("current");
	$(this).parents().addClass("current");
	return false;
});
$('#ajaxtab03 .tabbtn03 li a').eq(0).trigger("click");

//tab plugins 插件
$(function(){
	
	//选项卡鼠标滑过事件
	$('#statetab03 .tabbtn03 li').mouseover(function(){
		TabSelect("#statetab03 .tabbtn03 li", "#statetab03 .tabcon03", "current", $(this))
	});
	$('#statetab03 .tabbtn03 li').eq(0).trigger("mouseover");
	
	//选项卡鼠标滑过事件
	$('#clicktab01 .tabbtn03 li').click(function(){
		TabSelect("#clicktab02 .tabbtn03 li", "#clicktab03 .tabcon03", "current", $(this))
	});
	$('#clicktab03 .tabbtn03 li').eq(0).trigger("click");

	function TabSelect(tab,con,addClass,obj){
		var $_self = obj;
		var $_nav = $(tab);
		$_nav.removeClass(addClass),
		$_self.addClass(addClass);
		var $_index = $_nav.index($_self);
		var $_con = $(con);
		$_con.hide(),
		$_con.eq($_index).show();
	}
	
});


