/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
	var handlerPopup = function (captchaObj) {

		$(document).on("click", ".sendButton", function(e) {
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

				$(".usernameError").html('手机号码格式不正确!');
				$(".usernameError").show();
				return;
			}
			else
			{
				$(".usernameError").html('');
				$(".usernameError").hide();
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
				beforeSend:function(e){

					$(".yanzm em").attr('style','background:#c5c5c5;');
					$(".yanzm em").removeClass('sendButton');
					time(".yanzm em");
				},
				success:function(data){
					if (data.code !== 0) {
						$(".smsError").html(data.msg);
						$(".smsError").show();
					} else {
						$(".smsError").html('');
						$(".smsError").hide();
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
//注册前检查数据
function checkRegister()
{
	var err = "0";
	var usernameField = $("input[name='username']").val();
	var smscode = $("input[name='smscode']").val();
	var name = $("input[name='name']").val();
	var email = $("input[name='email']").val();
	var password = $("input[name='password']").val();
	var password2 = $("input[name='password2']").val();
	if(!isphone(usernameField))
	{
		$(".usernameError").html('手机号码格式不正确！');
		$(".usernameError").show();
		err = "1";
	}
	else
	{
		$(".usernameError").hide();
	}
	if(smscode.length!=4||smscode=="/  验证码")
	{
		$(".smsError").html('请填写验证码或格式不正确！');
		$(".smsError").show();
		err = "1";
	}
	else
	{
		$(".smsError").hide();
	}
	if(name==''||name=="/  姓名")
	{
		$(".name").html('请填写姓名！');
		$(".name").show();
		err = "1";
	}
	else
	{
		$(".name").hide();
	}
	if(!checkEmail(email))
	{
		$(".email").html('email格式不正确！');
		$(".email").show();
		err = "1";
	}
	else
	{
		$(".email").hide();
	}
	if(password==''||password=='/  输入密码')
	{
		$(".password").html('请填写密码！');
		$(".password").show();
		err = "1";
	}
	else
	{
		$(".password").hide();
	}
	if(password2==''||password2!=password||password2=='/  输入密码')
	{
		$(".password2").html('2次填写的密码不一致！');
		$(".password2").show();
		err = "1";
	}
	else
	{
		$(".password2").hide();
	}
	if(err=="1")
	{
		return false;
	}
	var err2 = "0";
	
	if($("input[name='isCorp']").is(':checked'))
	{
		var corpName = $("input[name='corpName']").val();
		var title = $("input[name='title']").val();
		var address = $("input[name='address']").val();
		if(corpName==''||corpName=='/  企业名称')
		{
			$(".corpName").html('请填写企业名称！');
			$(".corpName").show();
			err2 = "1";
		}
		else
		{
			$(".corpName").hide();
		}
		if(title==''||title=='/  职位')
		{
			$(".title").html('请填写职位！');
			$(".title").show();
			err2 = "1";
		}
		else
		{
			$(".title").hide();
		}
		if(address==''||address=='/  地址')
		{
			$(".address").html('请填写地址！');
			$(".address").show();
			err2 = "1";
		}
		else
		{
			$(".address").hide();
		}
	}
	else
	{
		$(".corpName").hide();
		$(".title").hide();
		$(".address").hide();
		err2 = "0";
	}
	if(err2=="1")
	{
		return false;
	}
	if(!$("input[name='agreed']").is(':checked'))
	{
		alert('请同意服务协议！');
		return false;
	}
}
function checkLogin()
{
	var username = $("input[name='username']").val();
	var password = $("input[name='password']").val();
	var err = "0";
	
	if(username==''||username=='/  账号')
	{
		
		$(".usernameError").html('请输入账号！');
		$(".usernameError").show();
		err = "1";
	}
	else
	{
		$(".usernameError").hide();
	}
	if(password==''||password=='/  输入密码')
	{
		$(".password").html('请填写密码！');
		$(".password").show();
		err = "1";
	}
	else
	{
		$(".password").hide();
	}
	if(err=="1")
	{
		return false;
	}
}

function checkForget()
{
	var err = "0";
	var usernameField = $("input[name='username']").val();
	var smscode = $("input[name='smscode']").val();
	
	var password = $("input[name='password']").val();
	var password2 = $("input[name='password2']").val();
	if(!isphone(usernameField))
	{
		
		$(".usernameError").html('手机号码格式不正确！');
		$(".usernameError").show();
		err = "1";
	}
	else
	{
		$(".usernameError").hide();
	}
	if(smscode.length!=4||smscode=="/  验证码")
	{
		$(".smsError").html('请填写验证码或格式不正确！');
		$(".smsError").show();
		err = "1";
	}
	else
	{
		$(".smsError").hide();
	}
	
	if(password==''||password=='/  输入密码')
	{
		$(".password").html('请填写密码！');
		$(".password").show();
		err = "1";
	}
	else
	{
		$(".password").hide();
	}
	if(password2==''||password2!=password||password2=='/  输入密码')
	{
		$(".password2").html('2次填写的密码不一致！');
		$(".password2").show();
		err = "1";
	}
	else
	{
		$(".password2").hide();
	}
	if(err=="1")
	{
		return false;
	}
}
function checkEmail(str){
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(reg.test(str)){
		return true;
	}else{
		return false;
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
var wait = 60;
function time(o) {
  if (parseInt(wait) === 0) {
    $(o).addClass("sendButton");
    $(o).attr("style",'');
    $(o).html("获取验证码"); 
    wait = 60;
  } else {
    $(o).html(wait + "秒");
    wait = parseInt(wait)-1;
    setTimeout(function() {
      time(o);
    }, 1000);
  }
}