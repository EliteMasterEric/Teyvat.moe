	var markedLog = []
	for(var i = 0 ; i< 29; i++ ) {
		for(var j = 1 ; j< 1200; j++) {
			var key = i + "_" + j
			if (localStorage.getItem(key)) {
				markedLog.push(key)
			}
		}
	}
	var eleLink = document.createElement('a');
    eleLink.download = 'markers.json';
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([JSON.stringify(markedLog)]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);	