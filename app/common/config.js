'use strict'

module.exports = {
		header : {
			method: 'POST',
		  headers: {
		    'Accept': 'application/json',
    		'Content-Type': 'application/json',
		  }
		},

		url : {
			base: 'http://rap.taobao.org/mockjs/30700/',
			plist: 'api/listp',	//列表接口
			praise: 'api/praise', //点赞接口
			comment: 'api/comment' //评论接口
		}
	}