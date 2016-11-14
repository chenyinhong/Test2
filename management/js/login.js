


$(function() {
    if ($.cookie('userName') != "" && $.cookie('userName') != "null" && $.cookie('userName') != null) {
        $.cookie("userName",null);
        $.cookie("token",null);
        $.cookie("userId",null);
    }


    var url = window.location;




    $('form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e){
        e.preventDefault();
        var requestData = {"userName": 1, "userPass": 2};
        //$.post("url",{},)
        //$.post("/trans/api/user/login", requestData, {
        //    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        //    transformRequest: transform
        //}).success(function (data){
        //    if(data.success){
        //
        //    }else{
        //
        //    }
        //})
        $.cookie("userName","老王");
        $.cookie("token","213123qwewqe");
        $.cookie("userId","Q12333");
        window.location.href="../index.html";
    })
});

