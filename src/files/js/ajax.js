/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*** apartment.ejs ***/
$(function() {
    $(document).on("click", ".weizhichild", function(e) {
        var vid = $(this).attr("vid");
        $("input[name='weizhi']").val(vid);
        $(".weizhipar").attr("id","");
        $(".weizhipara").attr("id","");
        $(this).parent().parent().parent().attr("id","select_hover01");
        $("input[name='page']").val(1);
        if(vid=="0")
        {
            $(".weizhichilded").remove();
            ajaxget();
            return;
        }
        //去掉行政区的条件
        $(".weizhied").remove();
        var weizhichilded = $(".weizhichilded").html();
        if(!weizhichilded)
        {
            $(".tiaojian").append('<a href="javascript:void(0);" class="weizhichilded" vid="'+vid+'">'+$(this).html()+'</a>');
        }
        else
        {
            $(".weizhichilded").html($(this).html());
            $(".weizhichilded").attr("vid",vid);
        }
        ajaxget();
    });
    //不能删除 移动端还要继续用
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
        //去掉商圈的条件
        $(".weizhichilded").remove();
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
    //加载更多
    $(document).on("click", ".moreHourse", function(e) {
        var page = $("input[name='page']").val();
        var pages = $("input[name='pages']").val();
        if(parseInt(page)+1<=parseInt(pages))
        {
            $("input[name='page']").val(parseInt(page)+1);
        }
        else
        {
            alert('没有更多了！');
            return;
        }
        
        
        ajaxget('more');
    });
    $(document).on("click", ".weizhipara", function(e) {
        $(this).attr("id","select_hover");
        $(".weizhipar").attr("id","");
        $(".weizhichilded").remove();
        $("input[name='page']").val(1);
        ajaxget();
    });
    $(document).on("click", ".weizhichilded", function(e) {
        $(this).remove();
        $(".weizhipar").removeClass("seled");
        $(".weizhipara").attr("id","select_hover");
        $("input[name='page']").val(1);
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
        $("#current03").removeAttr('style');
        $("#current03").removeAttr('id');
        $(".priceSort").attr('id', 'current03');
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
    $(document).on("click", ".areaSort", function(e) {
        $("#current03").removeAttr('style');
        $("#current03").removeAttr('id');
        $(".areaSort").attr('id', 'current03');
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
});

function ajaxget(type)
{
    var weizhi = $(".weizhied").attr("vid");
    var weizhistr = "";
    if(weizhi&&weizhi!=0)
    { 
        weizhistr = "districtId="+weizhi;
    }
    var weizhichild = $(".weizhichilded").attr("vid");
    var weizhichildstr = "";
    if(weizhichild&&weizhichild!=0)
    { 
        weizhichildstr = "commerseAreaId="+weizhichild;
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
    if ($('#current03').hasClass('isHotSort')) {
        sortBy = 'isHot';
        desc = $('#current03').attr("desc");
    }
    if ($('#current03').hasClass('priceSort')) {
        sortBy = 'price';
        desc = $('#current03').attr("desc");
    }
    if ($('#current03').hasClass('areaSort')) {
        sortBy = 'area';
        desc = $('#current03').attr("desc");
    }
    
    var page = $("input[name='page']").val();
    page = (parseInt(page)<=1)?1:parseInt(page);
    
    var datastr = 
      "page=" + page + "&" 
      + (weizhistr ? (weizhistr + "&") : '') 
      + (weizhichildstr ? (weizhichildstr + "&") : '') 
      + (fangxingstr ? (fangxingstr + "&") : '') 
      + (yuezustr ? (yuezustr + "&") : '')
      + (sortBy ? (sortBy + '=' + desc) : '');
    
    var word = $("#word").attr('val');
    var searchshi = $('#searchshi').attr('val');
    
    if (word && searchshi) {
        datastr = datastr + '&word=' + word + '&searchshi=' + searchshi;
    }
    
    $.ajax({
        //async:false,//同步请求
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
            var htmlstr = "";
            var totalstr = "";
            if (data.result.total == 1) {
                totalstr = 'style="border-bottom:none;"';
            }
            $.each(data.result.docs,function(i,result){  
                var imgstr = "/img/default.jpg";
                if(result.imagekeys[0])
                {
                    imgstr = "http://o7k9opgtr.bkt.clouddn.com/"+result.imagekeys[0]+"?imageView2/0/w/800/h/600";
                }
                 htmlstr += '<ul '+totalstr+'><a href="' + '/apartment/type/' + result._id + '"><img class="imghover" src="'+imgstr+'" width="402" height="260" /></a><li><h1><a href="/apartment/type/'+result._id+'">'+result.name+'</a></h1><p>'+result.comunity.name+'<br />  酒店式公寓  |  '+result.roomType.shi+'室'+result.roomType.ting+'厅'+result.roomType.wei+'卫  | ' + result.minArea + ' - ' + result.maxArea+'平米</p><p style="margin:110px 0 0 0;">'+result.address+'</p></li><li style="float:right; margin:0 10px 0 0;"><h2>￥ <em>'+result.minPrice+'</em> / 月 起</h2><span><a href="/apartment/type/'+result._id+'">查看详细房源</a></span></li></ul>';
            });

            if (data.result.docs.length == 0) {
                htmlstr += '<h1 style="text-align: center; font-size: 150%;padding-top:30px;">- 没有匹配的房源信息 -<br>请直接致电 400-668-1609</h1>'
            }
           
            var pagestr = '<div class="clear"></div><div class="page01">';
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
             //
             
             $("input[name='pages']").val(data.result.pages);

            $('.imghover').hover(
              function() { $( this ).fadeTo( 'fast', '0.7'); },
              function() { $( this ).fadeTo( 'fast', '1'); }
            );
            $(".moreHourse_s").addClass('moreHourse');
            $(".moreHourse").removeClass('moreHourse_s');
            $(".moreHourse a").html('更多房源');
            //$("html, body").animate({ scrollTop: 0 }, "slow");
        }
    });
}
