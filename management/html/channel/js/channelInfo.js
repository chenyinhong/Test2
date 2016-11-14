var currentPage = 1;
var pageNum = 10;
var totalNum=0;
var allPage=0;
$(function () {
    $('#addnew').click(function(){
        window.location.href="add.html";
    });



    var datas= $('#searchFrom').serializeObject();
    datas.currentPage=currentPage;
    datas.pageNum=pageNum;

    //doSave();
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: baseUrl+"/hap/api/channel/channelList",
        data : datas,
        success: function(msg){
            var htl= template('teams_tmpl',{data:msg.page.list});
            totalNum=msg.page.totalNum;
            allPage=msg.page.allPage;
            $('#table').html(htl);
            setPage(totalNum,allPage);
        }
    });
    setPage();
});
function doSearch(state){
    if(state==1){
        setPageN();
    }
    //setPageN();
    var datas= $('#searchFrom').serializeObject();
    datas.currentPage=currentPage;
    datas.pageNum=pageNum;
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: baseUrl+"/hap/api/channel/channelList",
        data : datas,
        success: function(msg){
            var htl= template('teams_tmpl',{data:msg.page.list});
            totalNum=msg.page.totalNum;
            allPage=msg.page.allPage;

            $('#table').html(htl);
            setPage(totalNum,allPage);
        }
    });

}

function setPage( num, page){
    //10122 条记录 1/507 页  <a href='javascript:void(0)'>下一页</a>     <a href='#'>上一页</a> <input type="number" style="width: 40px"> <a href='#'>跳转</a>
    var pageLian=num+" 条记录 "+currentPage+"/"+page+" 页 ";
    var pre="  <a href='javascript:void(0)' onclick='pre()'>下一页</a> ";
    var next=" <a href='javascript:void(0)' onclick='next()'>上一页</a>";
    var tip='  <input type="number" style="width: 40px" id="pageNum" value="'+currentPage+'"> <a href="javascript:void(0)" onclick="tip()">跳转</a>';
    pageLian=pageLian+next+pre+tip;
    $('#page').html(pageLian);
}

function pre(){
    if(currentPage<allPage){
        currentPage=currentPage+1;
    }else{
        return;
    }
    doSearch();
}
function next(){
    if(currentPage>1){
        currentPage=currentPage-1;
    }else{
        return;
    }
    doSearch();
}

function tip(){
    var a=parseInt($('#pageNum').val());
    if(a>0 && a<=allPage){
        currentPage=a;
    }else{
        alert("输入页码有误");
    }
    doSearch();
}
function setPageN(){
    currentPage = 1;
    totalNum=0;
    allPage=0;
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


