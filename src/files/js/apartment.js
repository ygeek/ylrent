/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){
	$(document).on("click",".yuyue",function(){
		$(".remen02").toggle("slow");
	});
	$(document).on("click",".dailyyuyue",function(){
		$(".order01").toggle("slow");
	});
	
	$.Tipmsg.r=null;
		
	var showmsg=function(msg){
		$.flash(msg);
	}
	
	$(".apartmentform").Validform({
		tiptype:function(msg,o,cssctl){
			if(!o.obj.is("form")){
				showmsg(msg);
			}
			
		},
		tipSweep:true,
		ajaxPost:true,
		beforeSubmit: function(form) {
			$('body').loading();
			return true;
		},
		callback:function(data){
			console.log(data.msg);
			if(data.code!=0)  //验证失败
			{
				$.flash(data.msg) ;
				
			}
			else
			{
				$.flash(data.msg) ;
				$(".remen02").toggle("slow");
				$(".order01").toggle("slow");
				$('.apartmentform')[0].reset();
			}
			$('body').loading('stop');
		}
	});
	
	var handlerPopup = function(captchaObj) {
		"use strict";

		$(document).on("click",".sendButtons",function(){
			var validate = captchaObj.getValidate();
			if (!validate) {
				return;
			}

			$("#origin_popup-button").remove();
			
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
				data: {
					mobile: mobile,
					// 二次验证所需的三个值
					geetest_challenge: validate.geetest_challenge,
					geetest_validate: validate.geetest_validate,
					geetest_seccode: validate.geetest_seccode
				},
				dataType: 'json',

				success:function(data){
					if (data.code !== 0) {
						$.flash(data.msg);
					}
					else
					{
						$(".yanzhengma").removeClass('sendButtons');
						time(".yanzhengma",'sendButtons');
					}
				}
			});
		});

		// 弹出式需要绑定触发验证码弹出按钮
		captchaObj.bindOn("#popup-button");
		// 将验证码加到id为captcha的元素里
		captchaObj.appendTo("#popup-captcha");
		// 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
	};

	$.ajax({
		// 获取id，challenge，success（是否启用failback）
		url: "/user/testregister?t=" + (new Date()).getTime(), // 加随机数防止缓存
		type: "get",
		dataType: "json",
		success: function (data) {
			// 使用initGeetest接口
			// 参数1：配置参数
			// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
			initGeetest({
				gt: data.gt,
				challenge: data.challenge,
				product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
				offline: !data.success // 表示用户后台检测极验服务器是否宕机，与SDK配合，用户一般不需要关注
			}, handlerPopup);
		}
	});
});


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