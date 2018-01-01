'use static'

import React,{Component} from 'react';
import _ from 'lodash'
import querystring from 'query-string'
import Mock from 'mockjs'

import config  from './config'
 
const Request = {};
Request.get = function(url,parm) {
	/*
	 * uri: http://rap.taobao.org/mockjs/30700/api/listp
	 * parm: {'accessToken':'abcd'}
	**/
	if (parm) {
		url += '?' + querystring.stringify(parm);
	}
	return fetch(url)
	.then((response) => response.json())
	.then((responseJson) => Mock.mock(responseJson));
},

Request.post = function(url,parm) {
	let options = _.extend(config.header, {
		body: JSON.stringify(parm)
	})
	return fetch(url,options)
	.then((response) => response.json())
	.then((responseJson) => Mock.mock(responseJson));
}

module.exports = Request