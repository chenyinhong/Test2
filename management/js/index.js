$(function() {
   // var datas="{"+
   // "{name:'用户列表',next:[name:'注册信息',url:'a.html']}"+
   //" }";
    //{
    //
    //{name:"中国", province:[ { name:"黑龙江", cities:{ city:["哈尔滨","大庆"] },
    //
    //    {name:"广东", cities:{ city:["广州","深圳","珠海"] }
    //
    //    }
    //$.post("url", requestData, {
    //    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //    transformRequest: transform
    //}).success(function (data){
    //    if(data.success){
            BUI.use('common/main',function(){
                var config = [
                    {id:'1',homePage : '2',menu:[{text:'用户列表',items:[
                        {id:'2',text:'注册信息',href:'html/registInfo/registInfo.html'},
                        {id:'3',text:'用户行为',href:'html/userBehavior/userBehaivor.html'}
                    ]
                    }]},
                    {id:'3',homePage : '4',menu:[{text:'频道管理',items:[
                        {id:'4',text:'频道类别管理',href:'Node/index.html'},
                        {id:'5',text:'频道列表',href:'html/channel/channelInfo.html'},
                        {id:'6',text:'发帖量',href:'Node/index.html'},
                        {id:'7',text:'审核',href:'Node/index.html'}
                    ]}]},
                    {id:'8',homePage : '9',menu:[{text:'推荐管理',items:[
                        {id:'9',text:'推荐用户',href:'Node/index.html'},
                        {id:'10',text:'推荐频道',href:'Node/index.html'}
                    ]}]},
                ];
                new PageUtil.MainPage({
                    modulesConfig : config
                });
            });
    //    }else{
    //
    //    }
    //})

});
