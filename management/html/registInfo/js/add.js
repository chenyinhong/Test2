$(function(){
    $('#backid').click(function(){
        window.location.href="registInfo.html";
    });
    $('.prov').bind("change",function(){
        getCity();
    });


    $.ajax({
        type : "POST",
        url : baseUrl+"/hap/data/labels",
        success : function(msg){
            var htl="";
            $.each(msg.list,function(n,obj){
               htl=htl+"<option value='"+obj.label_id+"'>"+obj.label_name+"</option> ";
            })
            $("#itLabel").append(htl);
            $('#itLabel').selectpicker('render');
            $('#itLabel').selectpicker('refresh');

        }
    });
    $.ajax({
        type : "POST",
        url : baseUrl+"/hap/data/provinces",

        success : function(msg){
            var htl="<option value='0'>请选择</option>";
            $.each(msg.list,function(n,obj){
                htl+="<option value='"+obj.adcode+"'>"+obj.area_name+"</option>";
                $('.prov').html(htl);
            })
        }
    });
    $('form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            phone: {
                message: '手机验证',
                validators: {
                    notEmpty: {
                        message: '手机号码不能为空'
                    },
                    regexp: {
                        regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                        message: '请输入正确的手机号码'
                    },
                    threshold :  11 , //有6字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，6字符以上才开始）
                    remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                        url: baseUrl+"/hap/api/user/phoneIsRight",//验证地址
                        message: '该手机用户已注册',//提示消息
                        //delay :  2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                        type: 'POST'//请求方式
                        /**自定义提交数据，默认值提交当前input value
                         *  data: function(validator) {
                               return {
                                   password: $('[name="passwordNameAttributeInYourForm"]').val(),
                                   whatever: $('[name="whateverNameAttributeInYourForm"]').val()
                               };
                            }
                         */
                    }
                }
            },
            nickname: {
                message: '昵称验证',
                validators: {
                    stringLength: {
                        min: 0,
                        max: 64,
                        message: '昵称小于64位'
                    }
                }
            },
            signature: {
                message: '个性签名验证',
                validators: {
                    stringLength: {
                        min: 0,
                        max: 256,
                        message: '个性签名小于256位'
                    }
                }
            }

        }
    }).on('success.form.bv', function(e){
        e.preventDefault();
        save();

    })
})

function getCity(){
    var parentCode=$('.prov').val();
    if(0==parentCode){
        $('.city').empty().attr("disabled",true);
        return ;
    }
    $('.city').empty().attr("disabled",false);
    $.ajax({
        type : "POST",
        url : baseUrl+"/hap/data/citys",
        data :{"parentCode" : parentCode},
        success : function(msg){
            var htl="";
            $.each(msg.list,function(n,obj){
                htl+="<option value='"+obj.adcode+"'>"+obj.area_name+"</option>";
                $('.city').html(htl);
            })
        }
    });
}

function save(){
    var datas= $('#addFrom').serializeObject();
    var itLabel=null==$('#itLabel').val()?"":$('#itLabel').val().toString();
    datas.itLabel=itLabel;
    $.ajax({
        type : "POST",
        url : baseUrl+"/hap/api/user/addUser",
        data :datas,
        success : function(msg){
            if(msg.success){
                alert("用户创建成功");
                window.history.go(-1);
            }

        }
    });


}