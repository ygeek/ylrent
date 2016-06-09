/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){
	$(document).on("click",".yuyue",function(){
		$(".remen02").toggle();
	});
	$(document).on("click",".dailyyuyue",function(){
		$(".order01").toggle("slow");
	});
	
	$.Tipmsg.r=null;
		
	var showmsg=function(msg){
		alert(msg);
	}
	
	$(".apartmentform").Validform({
		tiptype:function(msg,o,cssctl){
			if(!o.obj.is("form")){
				showmsg(msg);
			}
			
		},
		tipSweep:true,
		ajaxPost:true,
	});
	
	$(document).on("click",".sendButtons",function(){
		var mobile = $("#usernameField").val();
		if(mobile=='/  手机号'||mobile=='')
		{
			alert('请填写手机号!');
			return;
		}
		if(!isphone(mobile))
		{
			
			alert('手机号码格式不正确!');
		  
			return;
		}
		
		$.ajax({
			type: 'post',
			url: '/user/requestsms/',
			data: 'mobile=' + mobile,
			dataType: 'json',
			
			success:function(data){
			  if (data.code !== 0) {
					alert(data.msg);
				
			  }
			  else
			  {
				  $(".yanzhengma").removeClass('sendButtons');
					time(".yanzhengma",'sendButtons');  
			  }
			}
	   });
	})

})



var wait = 60;
function time(o,thisClass) {
  if (parseInt(wait) === 0) {
    $(o).addClass(thisClass);
    $(o).val("获取验证码"); 
    wait = 60;
  } else {
    $(o).val(wait + "秒");
    wait = parseInt(wait)-1;
    setTimeout(function() {
      time(o,thisClass);
    }, 1000);
  }
}

function isphone(inputString)
{
     var partten = /^1[3,5,8,7]\d{9}$/;
     var fl=false;
     if(partten.test(inputString))
     {
          //alert('是手机号码');
          return true;
     }
     else
     {
          return false;
          //alert('不是手机号码');
     }
}