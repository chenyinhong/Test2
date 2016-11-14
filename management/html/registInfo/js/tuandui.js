	var myScroll,
		startScrollX,
	    scrollX,
	    $scrollDom,
	    searchPage,
	    lastTeamId,
	    isTeamOwner,
	    curDocCode;
	var xScroll = 0;
	var yOff = 0, xOff = 0;
	
	mui.plusReady(function() {
		curDocCode = JSON.parse(plus.storage.getItem("docInfo")).code;
		lastTeamId = plus.storage.getItem("teamId");
		
		myScroll = $('#content').lscroll({pullDownAction: pullDownAction, top: 16,
			scrollCallBack: function(s){
				yOff += Math.abs(s.distY>>0);
				xOff += Math.abs(s.distX>>0);
				if(xScroll==0 && yOff<20 && xOff>yOff)
					xScroll = true;
			}, scrollEndCallBack: function(s){
				xScroll = 0;
				yOff = 0;
				xOff = 0;
			}
		});
		initTeams(JSON.parse(plus.storage.getItem("teamInfo")))
		
		/**
		 * 预加载查询页面
		 */
		searchPage = mui.preload({
		    url: 'search.html'
		});
	});
	
	function pullDownAction(){
		initMembers(lastTeamId, true);
	}
	
	template.helper("setQyzs", function(level, qyzs) {
		if(level==1)
			return "";
		return "签约总数： "+ (qyzs? qyzs : '0');
	});
	
	template.helper("setInfo", function(info) {
		return JSON.stringify(info);
	});
	
	var qkys = [], zkys = [], jgs= [];
	/**
	 * 初始化成员
	 * @param {Object} teamId
	 */
	function initMembers(teamId, isRefresh){
		plus.nativeUI.showWaiting();
		getReqPromises(
			[
				{url: "/doctor/admin-teams/"+ teamId +"/members", reqType: "GET"}
			]
		).then(function(datas) {
			if(datas[0].status==200){
				appendMembers(datas[0].data, isRefresh);
			} else
				mui.toast("获取成员数据失败！");
			plus.nativeUI.closeWaiting();
		}).catch(function(e){
			mui.toast(e.msg);
		});
	}
	
	/**
	 * 初始化选择团队
	 */
	function initTeams(data){
		var isCheck = false;
		template.helper("setChecked", function(id, i) {
			if(lastTeamId && lastTeamId==id)
				return "checked";
			return "";
		});
		
		$('.lin-sel-group').html(template('teams_tmpl', data));
		if(!isCheck){
			var $dom = $('.lin-sel-group li').eq(0).addClass("checked");
		}
		setCurTeamName();
		setTeamId();
		if(lastTeamId)
			initMembers(lastTeamId, true);
	}
	
	function setCurTeamName(name){
		$('.demo-comtop h1').html((name || $('.lin-sel-group li.checked').attr('data-name')) + '<label class="lin-down-arrow"></label>');
	}
	
	function setTeamId(){
		var $cTeam = $('.lin-sel-group li.checked');
		lastTeamId = $cTeam.attr('data-code');
		isTeamOwner = $cTeam.attr('data-leaderCode')==curDocCode;
		plus.storage.setItem('teamId', lastTeamId);
	}
	
	/**
	 * 删除成员
	 */
	function removeMember(code, $dom){
		mui.confirm("删除医生后，该医生将不能进行代理签约等团队内的工作，是否确认继续删除？", "提示", ["不了", "继续删除"], function(e){
			if(e.index == 1){
				plus.nativeUI.showWaiting();
				sendPost("/doctor/admin-teams/"+ lastTeamId +"/members/"+ code +"/remove", {}, null, 
					function(res){
						if(res.status==200){
							$dom.parent().parent().parent().remove();
							plus.nativeUI.closeWaiting();
							mui.toast('删除成功！');
						} else{
							plus.nativeUI.closeWaiting();
							mui.confirm(res.msg, "提示", ["我知道了"], function(e){});
						}
					})
			}
		})
		
	}
	
	/**
	 * 列表点击事件
	 */
	var initListEvent = function(){
		$('.doc-list')
		.on('tap', 'div.zyjm', function(){ // 转移居民按钮
			
			var docCode = $(this).parent().parent().attr('data-code');
			mui.openWindow({
				id: "xuanzezhuanyijumin.html",
				url: "xuanzezhuanyijumin.html",
				extras: {
					teamCode: lastTeamId,
					docCode: docCode
				}
			});
			return false;
		})
		.on('tap', 'div.sccy', function(){ // 删除成员按钮
			removeMember($(this).parent().parent().attr('data-code'), $(this));
			return false;
		})
		.on('touchstart', '.doc-item', function(e){ //左滑动作开始
			e.preventDefault();
			startScrollX = e.originalEvent.targetTouches[0].screenX;
		})
		.on('touchmove', '.doc-item', function(e){ //左滑动作移动
			if(!isTeamOwner) return;
			if(xScroll != true) return;
			e.preventDefault();
			scrollX = e.originalEvent.targetTouches[0].screenX - startScrollX;
			debugger
			var offLeft = $(e.currentTarget).find('div.operate').children('div').length * (-65);
			if(scrollX<0 && scrollX >= offLeft)
				$(e.currentTarget).css('left', scrollX + 'px');
		})
		.on('touchend', '.doc-item', function(e){ //左滑动作结束
			e.preventDefault();
			if(scrollX<-50){
				$scrollDom = $(e.currentTarget);
				var offLeft = $(e.currentTarget).find('div.operate').children('div').length * (-65);
				$scrollDom.animate({left: offLeft}, "fast");
			} else{
				startScrollX = undefined;
				$scrollDom = undefined;
				$(e.currentTarget).animate({left: '0px'}, "fast");
			}
			scrollX = undefined;
		})
		.on('tap', '.doc-item', function(){
			mui.openWindow({
				id: "p2p",
				url: "../../message/html/p2p.html",
				extras: {
					otherCode: $(this).attr("data-code"),
					otherName: $(this).attr("data-name"),
					otherPhoto: $(this).find("img").attr("src"),
					otherSex: $(this).attr("data-sex")
				}
			})
		})
	}();
	
	/**
	 * 搜索按钮点击
	 */
	$('.lin-search').on('tap', function() {
		mui.fire(searchPage, "initSearch", {html: $('.doc-list').html()});
		searchPage.show();
	})
	
	/**
	 * 取消左移块的事件
	 */
	$('body').on('touchstart', function(e){
		if($scrollDom)
			$scrollDom.animate({left: '0px'}, "fast");
	}).on('touchmove', function(e){
		e.preventDefault();
	})
	
	/**
	 * 初始化头部点击事件
	 */
	var initHeaderEvent = function(){
		/**
		 * 显示团队选择
		 */
		var showGroupSel = function(e, isShow){
			isShow = isShow || $('.lin-mask:hidden').length != 0;
			$('.lin-mask').toggle(isShow);
			$('.lin-sel-group').toggle(isShow);
		}
		
		$('.lin-mask').on('tap', showGroupSel);
		$('.demo-comtop h1').on('tap', showGroupSel);
	
		$('.lin-conf').on('tap', function(){
			mui.openWindow({
				url: "tuanduishezhi.html",
				extras: getTeamInfo()
			})
		})
		
		$('.lin-gp-add').on('tap', function(){
			mui.openWindow({
				url: "tianjiachengyuan.html",
				extras: getTeamInfo()
			})
		})
		
		$('.lin-sel-group').on('tap', 'li', function(){
			showGroupSel(undefined, false);
			if(!$(this).hasClass('checked')){
				$(this).addClass('checked').siblings().removeClass('checked');
				setCurTeamName();
				setTeamId();
				initMembers(lastTeamId, true);
			}
		})
		
		$('.lin-group-chat').on('tap', function(){
			var members = [];
			$.each($('.doc-item'), function(i, v) {
				members.push( JSON.parse($(v).attr('data-info')) );
			});
			var info = getTeamInfo();
			info.code = info.teamCode;
			info.members = members;
			mui.openWindow({
				url: "../../message/html/tuanduiqunliao.html",
				id: "tuanduiqunliao.html",
				extras: {
					info: info
				}
			})
		})
	}();

	function getTeamInfo(){
		var $team = $('.lin-sel-group li.checked');
		return {teamName: $team.attr('data-name'), teamCode: $team.attr('data-code')}
	}
	
	function appendMembers(data, isRefresh){
		var html = template('doc_list_tmpl', {data: data, isTeamOwner: isTeamOwner, curDocCode: curDocCode});
		if(isRefresh){
			$('.doc-list').html(html);
		} else{
			$('.doc-list').append(html);
		}
		myScroll.refresh(true);
	}
	/**
	 * 更新团队名称
	 */
	window.addEventListener("updateTeamName", function(e){
		var $cur = $('.lin-sel-group li[data-code="'+ e.detail.teamCode +'"]');
		var name = e.detail.teamName;
		$cur.attr('data-name', name).find('label').html(name);
		if($cur.hasClass('checked')){
			setCurTeamName(name);
		}
	})	
	
	/**
	 * 新增成员
	 */
	window.addEventListener("updateTeamMember", function(e){
		var data = e.detail.data;
		var tmp = [];
		for(var k in data){
			tmp.push(data[k]);
		}
		appendMembers(tmp);
	})