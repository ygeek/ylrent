/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
   $(document).on("click", ".sendButton", function(e) {
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
            data: 'mobile=' + mobile,
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
});
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