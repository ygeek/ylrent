/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
    $(document).on("click", "#sort02_m", function(e) {
       $(".fyss").toggle('slow'); 
    });
    
    $(document).on("click", ".weizhi", function(e) {
        var vid = $(this).attr("vid");
        $("input[name='weizhi']").val(vid);
        $(".weizhi").removeClass("seled");
        $(this).addClass("seled");
        $("input[name='page']").val(1);
        if(vid=="0")
        {
            $(".weizhied").remove();
            ajaxget();
            return;
        }
        var weizhied = $(".weizhied").html();
        if(!weizhied)
        {
            $(".tiaojian").append('<a href="javascript:void(0);" class="weizhied" vid="'+vid+'">'+$(this).html()+'</a>');
        }
        else
        {
            $(".weizhied").html($(this).html());
            $(".weizhied").attr("vid",vid);
        }
        ajaxget();
    });
    $(document).on("click", ".fangxing", function(e) {
        var vid = $(this).attr("vid");
        $("input[name='fangxing']").val(vid);
        $(".fangxing").removeClass("seled");
        $(this).addClass("seled");
        $("input[name='page']").val(1);
        if(vid=="0")
        {
            $(".fangxinged").remove();
            ajaxget();
            return;
        }
        var fangxinged = $(".fangxinged").html();
        if(!fangxinged)
        {
            $(".tiaojian").append('<a href="javascript:void(0);" class="fangxinged"  sid="'+$(this).attr("sid")+'" vid="'+vid+'">'+$(this).html()+'</a>');
        }
        else
        {
            $(".fangxinged").html($(this).html());
            $(".fangxinged").attr("vid",vid);
            $(".fangxinged").attr("sid",$(this).attr("sid"));
        }
        ajaxget();
    });
    $(document).on("click", ".yuezu", function(e) {
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        $("input[name='page']").val(1);
        $(".yuezu").removeClass("seled");
        $(this).addClass("seled");
        if(min=="0"&&max=="0")
        {
            $(".yuezued").remove();
            ajaxget();
            return;
        }
        var yuezued = $(".yuezued").html();
        if(!yuezued)
        {
            $(".tiaojian").append('<a href="javascript:void(0);" class="yuezued"  min="'+min+'" max="'+max+'">'+$(this).html()+'</a>');
        }
        else
        {
            $(".yuezued").html($(this).html());
            $(".yuezued").attr("min",min);
            $(".yuezued").attr("max",max);
        }
        ajaxget();
    });
    
    $(document).on("click", ".pagenum", function(e) {
        var page = $(this).attr("vid");
       
        $("input[name='page']").val(page);
        $(".pagenum").removeClass("pagesel");
        $(this).addClass("pagesel");
        
        ajaxget();
    });
    //下一页
    $(document).on("click", ".nextpage", function(e) {
        var page = $("input[name='page']").val();
        var pages = $("input[name='pages']").val();
        if(parseInt(page)+1<=parseInt(pages))
        {
            $("input[name='page']").val(parseInt(page)+1);
        }
        else
        {
            alert('已经是最后一页了！');
            return;
        }
        
        ajaxget();
    });
    $(document).on("click", ".moreHourse", function(e) {
        var page = $("input[name='page']").val();
        var pages = $("input[name='pages']").val();
        if(parseInt(page)+1<=parseInt(pages))
        {
            $("input[name='page']").val(parseInt(page)+1);
        }
        else
        {
            alert('已经是最后一页了！');
            return;
        }
        
        ajaxget('more');
    });
    //上一页
    $(document).on("click", ".prepage", function(e) {
        var page = $("input[name='page']").val();
        var pages = $("input[name='pages']").val();
        if(parseInt(page)-1>=1)
        {
            $("input[name='page']").val(parseInt(page)-1);
        }
        else
        {
            alert('没有上一页了！');
            return;
        }
        
        
        ajaxget();
    });
    $(document).on("click", ".weizhied", function(e) {
        $(this).remove();
        $(".weizhi").removeClass("seled");
        $("#weizhi").addClass("seled");
        $("input[name='page']").val(1);
        ajaxget();
    });
     $(document).on("click", ".fangxinged", function(e) {
        $(this).remove();
        $(".fangxing").removeClass("seled");
        $("#fangxing").addClass("seled");
        $("input[name='page']").val(1);
        ajaxget();
    });
     $(document).on("click", ".yuezued", function(e) {
        $(this).remove();
        $(".yuezu").removeClass("seled");
        $("#yuezu").addClass("seled");
        $("input[name='page']").val(1);
        ajaxget();
    });
    $(document).on("click", ".isHotSort", function(e) {
        $("#current03").removeAttr('style');
        $("#current03").removeAttr('id');
        $(".isHotSort").attr('id', 'current03');
        var desc = $("#current03").attr('desc');
        if (desc == 0) {
            $("#current03").attr('desc', 1);
            $("#current03").attr('style', 'background:url(/img/icon13.png) 90% no-repeat #f6f6f6;');
        } else {
            $("#current03").attr('desc', 0);
            $("#current03").attr('style', 'background:url(/img/icon20.png) 90% no-repeat #f6f6f6;');
        }
        ajaxget();
    });
    $(document).on("click", ".priceSort", function(e) {
        $("#sort01_m").removeAttr('style');
        $("#sort01_m").removeAttr('id');
        $(".priceSort").attr('id', 'sort01_m');
        var desc = $("#sort01_m").attr('desc');
        if (desc == 0) {
            $("#sort01_m").attr('desc', 1);
            $(this).children("img").attr("src","/img/mobile/icon01_s.png");
        } else {
            $("#sort01_m").attr('desc', 0);
            $(this).children("img").attr("src","/img/mobile/icon01.png");
        }
        ajaxget();
    });
    $(document).on("click", ".areaSort", function(e) {
        $("#sort01_m").removeAttr('style');
        $("#sort01_m").removeAttr('id');
        $(".areaSort").attr('id', 'sort01_m');
        var desc = $("#sort01_m").attr('desc');
        if (desc == 0) {
            $("#sort01_m").attr('desc', 1);
            $(this).children("img").attr("src","/img/mobile/icon01.png");
        } else {
            $("#sort01_m").attr('desc', 0);
            $(this).children("img").attr("src","/img/mobile/icon01_s.png");
        }
        ajaxget();
    });
    
    
    //发送短信
    $(document).on("click", ".sendButton", function(e) {
        var mobile = $("input[name='username']").val();

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
            before:function(e){
                
               
                $(".yzm").removeClass('sendButton');
                time(".yzm");
            },
            success:function(data){
                
              if (data.code !== 0) {
                    alert(data.msg);
                
              } else {
                  alert('验证码发送成功!');
              }
            }
       });
    });


    
})
function checkLogin()
{
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    var err = "0";

    if(username==''||!isphone(username))
    {

        alert('电话号码不存在或格式不正确');
        return false;
    }

    if(password=='')
    {
        alert('密码不能为空');
        return false;
    }



}

//注册前检查数据
function checkRegister()
{
    var err = "0";
    var usernameField = $("input[name='username']").val();
    var smscode = $("input[name='smscode']").val();

    var password = $("input[name='password']").val();

    if(!isphone(usernameField))
    {
       alert('手机号不能为空或格式不正确!');
        return false;
    }

    if(smscode.length!=4||smscode=="/  验证码")
    {
       alert('请填写验证码或格式不正确！');

        return false;
    }

    if(password==''||password=='/  输入密码')
    {
        alert('请填写密码！');
      return false;
    }

    
    if(!$("input[name='agreed']").is(':checked'))
    {
        alert('请同意服务协议！');
        return false;
    }
}

function ajaxget(type)
{
    var weizhi = $(".weizhied").attr("vid");
    var weizhistr = "";
    if(weizhi&&weizhi!=0)
    { 
        weizhistr = "districtId="+weizhi;
    }
    var fangxingsid = $(".fangxinged").attr("sid");
    var fangxingvid = $(".fangxinged").attr("vid");
    var fangxingstr = "";
    if(fangxingvid!="0"&&fangxingvid)
    { 
        fangxingstr = fangxingsid+"="+fangxingvid;
    }
    var yuezumin = $(".yuezued").attr("min");
    var yuezumax = $(".yuezued").attr("max");
    var yuezustr = "";
    if(yuezumin=="0"&&yuezumax!="0")
    { 
        yuezustr = "maxPrice="+yuezumax;
    }
    if(yuezumin!="0"&&yuezumax!="0"&&yuezumin&&yuezumax)
    { 
        yuezustr = "maxPrice="+yuezumax+"&"+"minPrice="+yuezumin;
    }
    if(yuezumin!="0"&&yuezumax=="0")
    { 
        yuezustr = "minPrice="+yuezumin;
    }
    if(yuezumin=="0"&&yuezumax=="0")
    { 
        yuezustr = "";
    }
    
    var sortBy = null;
    var desc = 1;
    if ($('#sort01_m').hasClass('isHotSort')) {
        sortBy = 'isHot';
        desc = $('#sort01_m').attr("desc");
    }
    if ($('#sort01_m').hasClass('priceSort')) {
        sortBy = 'price';
        desc = $('#sort01_m').attr("desc");
    }
    if ($('#sort01_m').hasClass('areaSort')) {
        sortBy = 'area';
        desc = $('#sort01_m').attr("desc");
    }
    
    var page = $("input[name='page']").val();
    page = (parseInt(page)<=1)?1:parseInt(page);
    
    var datastr = 
      "page=" + page + "&" 
      + (weizhistr ? (weizhistr + "&") : '') 
      + (fangxingstr ? (fangxingstr + "&") : '') 
      + (yuezustr ? (yuezustr + "&") : '')
      + (sortBy ? (sortBy + '=' + desc) : '');
    
    var word = $("#word").attr('val');
    var searchshi = $('#searchshi').attr('val');
    
    if (word && searchshi) {
        datastr = datastr + '&word=' + word + '&searchshi=' + searchshi;
    }
    
    $.ajax({
        async:false,//同步请求
        type: "GET",
        url: "/apartment/api/",
        dataType: "JSON",
        data: datastr,
        before:function(e){
            $(".moreHourse a").html('正在加载...');
            $(".moreHourse").addClass('moreHourse_s');
            $(".moreHourse").removeClass('moreHourse');
        },
        success: function(data){
            var htmlstr = '<div class="houselist">';
            $.each(data.result.docs,function(i,result){  
                var imgstr = "/img/default.jpg";
                if(result.imagekeys[0])
                {
                    imgstr = "http://o7k9opgtr.bkt.clouddn.com/"+result.imagekeys[0]+"?imageView2/0/w/320/h/240";
                }
                 htmlstr += '<div class="fangyuan_pic"><a href="' + '/apartment/type/' + result._id + '"><img class="imghover" src="'+imgstr+'"  /></a><div class="fangyuan_pic01"><h1><a href="/apartment/type/'+result._id+'">【'+result.comunity.name+'】'+result.name+'</a></h1><h2><p>'+result.roomType.shi+'室'+result.roomType.ting+'厅'+result.roomType.wei+'卫  | ' + result.minArea + ' - ' + result.maxArea+'平 </p><span>￥<em>'+result.minPrice+'</em> / 月</span></h2><div class="clear"></div></div><div class="clear"></div></div>';
            });

            if (data.result.docs.length == 0) {
                htmlstr += '<h1 style="text-align: center; font-size: 150%;">- 没有匹配的房源信息 -<br>请直接致电 400-668-1609</h1>'
            }
           
            var pagestr = '<div class="page01">';
            if (data.result.page > 3) {
               pagestr +=  '<a href="javascript:void(0);"  class="prepage">上一页</a> ';
            }
            var lth = 1;
            var st = 1;
            if(data.result.pages>=5)
            {
                lth = 5;
            }
            else
            {
                lth = parseInt(data.result.pages);
            }
            
            if(data.result.page<=3)
            {
                st = 0;
            }
            else
            {
                st = parseInt(data.result.page)-3;
            }
            if(data.result.pages-data.result.page<2)
            {
                st = data.result.pages-5;
                if(parseInt(st)<=0)
                {
                    st = 0;
                }
            }
            
            for (var i = 1; i <= lth; i++) { 
                var pagesel = ((i+st)==data.result.page)?' class="pagenum pagesel" ':' class="pagenum"';
                pagestr +=  ' <a href="javascript:void(0);" vid="'+(i+st)+'"  '+pagesel+'  >'+(i+st)+'</a> ';
            } 
            if (data.result.page + 3 <= data.result.pages) {
                 pagestr +=  ' <a href="javascript:void(0);" class="nextpage">下一页</a> ';
            }
            pagestr += '</div>';
            
            if(type=='more')
            {
                $(".moreHourse").before(htmlstr);
            }
            else
            {
                $(".tuijianfangyuan_m").html(htmlstr+pagestr);
                if (data.result.pages > 1) {
                    $(".tuijianfangyuan_m").append('<div class="more01 moreHourse"><a href="javascript:void(0);">更多房源</a></div>');
                }
            }
            
            
            
            
             //$(".tuijianfangyuan_m").html(htmlstr+pagestr);
             $("input[name='pages']").val(data.result.pages);

            $('.imghover').hover(
              function() { $( this ).fadeTo( 'fast', '0.7'); },
              function() { $( this ).fadeTo( 'fast', '1'); }
            );
            adjustListImageHeight();
            
            $(".moreHourse_s").addClass('moreHourse');
            $(".moreHourse_s").removeClass('moreHourse_s');
            $(".moreHourse a").html('更多房源');
           // $("html, body").animate({ scrollTop: 0 }, "slow");
        }
    });
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
   
    $(o).val("获取验证码"); 
    wait = 60;
  } else {
    $(o).val(wait + "秒");
    wait = parseInt(wait)-1;
    setTimeout(function() {
      time(o);
    }, 1000);
  }
}
