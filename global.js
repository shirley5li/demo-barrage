$(document).ready(function() {
	var ref = new Wilddog("https://danwu.wilddogio.com/messages");
	var arr = [];
	//将数据提交到野狗云
	$(".s_submit").click(function() {
		var text = $(".s_txt").val();
		ref.child('message').push(text);
		$(".s_txt").val('');
	});
	// 响应按键点击事件
	$(".s_submit").keypress(function() {
		if (event.keyCode == "13") {
			$(".s_submit").trigger('click');
		}
	});
	//响应清除事件
	$(".s_clear").click(function() {
		ref.remove();
		arr = [];
		$('.barrage_show').empty();
	});
	// 监听云端数据变更，云端数据变化，弹幕框里的数据随之变化
	ref.child('message').on('child_added', function(snapshot) {
		var text = snapshot.val();
		arr.push(text);
		var textObj = $("<div class=\"barrage_message\"></div>");
		textObj.text(text);
		$(".barrage_show").append(textObj);
		moveObj(textObj);
	});
	ref.on('child_removed', function() {
		arr = [];
		$('.barrage_show').empty();
	});
	// 按照时间顺序显示各条弹幕
	var topMin = $('.barrage_mask').offset().top;
	var topMax = topMin + $('.barrage_mask').height();
	var _top = topMin;

	var moveObj = function(obj) {
		var _left = $('.barrage_mask').width() - obj.width();
		_top = _top + 50;
		if (_top > (topMax - 50)) {
			_top = topMin;
		}
		obj.css({
			left: _left,
			top: _top,
			color: getRandomColor()
		});
		var time = 20000 + 10000 * Math.random();
		obj.animate({
			left: "-" + _left  + "px"
		}, time, function() {
			obj.remove();
		});
	};
	var getRandomColor = function() {
		var r=Math.floor(Math.random()*256);
        var g=Math.floor(Math.random()*256);
        var b=Math.floor(Math.random()*256);
        return "rgb(" + r + ',' + g + ',' + b + ")";
	};
	var getAndRun = function() {
		if (arr.length > 0) {
			var n = Math.floor(Math.random() * arr.length + 1) - 1;
			var textObj = $("<div>" + arr[n] + "</div>");
			$(".barrage_show").append(textObj);
			moveObj(textObj);
		}
		setTimeout(getAndRun, 3000);
	};
	jQuery.fx.interval = 50;
	getAndRun();


});