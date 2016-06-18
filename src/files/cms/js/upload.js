var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',      // 上传模式,依次退化
    browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
    // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
    // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
    // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
    // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
    uptoken_url: '/cms/uptoken/',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
    
    get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
    // downtoken_url: '/downtoken',
    // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
    unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
    // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: 'http://o7k9opgtr.bkt.clouddn.com/',     // bucket 域名，下载资源时用到，**必需**
    container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
    max_file_size: '100mb',             // 最大文件体积限制
    flash_swf_url: '/files/lib/plupload/Moxie.swf',  //引入 flash,相对路径
    max_retries: 3,                     // 上传失败最大重试次数
    dragdrop: true,                     // 开启可拖曳上传
    drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                  // 分块上传时，每块的体积
    auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
    
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
            });
            layer.msg('上传中...', {icon: 16,shade: 0.4,time:3600000});
        },
        'BeforeUpload': function(up, file) {
               // 每个文件上传前,处理相关的事情
               
        },
        'UploadProgress': function(up, file) {
               // 每个文件上传时,处理相关的事情
               
        },
        'FileUploaded': function(up, file, info) {
               // 每个文件上传成功后,处理相关的事情
               // 其中 info 是文件上传成功后，服务端返回的json，形式如
               // {
               //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
               //    "key": "gogopher.jpg"
               //  }
               // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

               var domain = up.getOption('domain');
               var res = $.parseJSON(info);
               var sourceLink = domain +res.key; 
               $("#images").val($("#images").val()+' '+res.key);
               //$(".imgs").empty();
               $(".imgs").append('<img src="'+sourceLink+'?imageView2/0/w/150/h/120" width="150" height="120" tid="'+res.key+'" >&nbsp;&nbsp;');
        },
        'Error': function(up, err, errTip) {
               //上传出错时,处理相关的事情
               console.log(errTip);
        },
        'UploadComplete': function() {
               //队列文件处理完毕后,处理相关的事情
               layer.closeAll();
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            //var key = "";
            // do something with key here
            //return key
        }
    }
});
$(function(){
    $(document).on('click','.forminfo li img',function(e){
        var tid = $(this).attr('tid');
        $(this).addClass('remove');
        layer.confirm('确定要删除它吗?', {icon: 3, title:'提示'}, function(index){
  
            if($("input[name='imagekeys']").val())
            {
                var newval = $("input[name='imagekeys']").val().replace(tid, "");
                $("input[name='imagekeys']").val(newval);
                $(".forminfo li img").remove(".remove");
            }
            if($("input[name='imagekey']").val())
            {
                var newval = $("input[name='imagekey']").val().replace(tid, "");
                $("input[name='imagekey']").val(newval);
                $(".forminfo li img").remove(".remove");
            }
            layer.close(index);
        });
        
      
    });
});