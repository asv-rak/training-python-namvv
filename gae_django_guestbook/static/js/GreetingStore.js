define([
	"dojo/_base/declare",
	"dojo/cookie",
	"dojo/store/JsonRest",
	"dojo/Deferred"
], function (declare, cookie, JsonRest, Deferred) {
	return declare("guestbook.GreetingStore", null, {
		guestbookName: "1",
		store: null,

		constructor: function () {
			var url = "/api/guestbook/" + this.guestbookName + "/greeting/";
			this.store = new JsonRest({
				target: url,
				headers: {
					"X-CSRFToken": cookie("csrftoken")
				}
			});
		},

		_addGreeting: function (obj, callback) {
			var url = '/api/guestbook/' + obj.guestBookName + '/greeting/';
			this.store.target = url;
			console.log(obj);
			this.store.add({
				guestbook_name: obj.guestBookName,
				content: obj.textGreeting
			}).then(function (data) {
				callback(null, data);
			}, function (error) {
				callback(error, null);
			});

		},

		_updateGreeting: function (obj, callback) {
			var url = '/api/guestbook/' + obj.guestBookName + '/greeting/';
			this.store.target = url;
			this.store.put({
				greeting_content: obj.textGreeting
			}, {
				id: obj.id_greeting
			}).then(function (data) {
				callback(null, data);
			}, function (error) {
				callback(error, null);
			});
		},

		_getListGreeting: function (obj, callback) {
			var url = '/api/guestbook/' + obj.guestBookName + '/greeting/';
			this.store.target = url;
			this.store.query().then(function (data) {
				callback(null, data)
			}, function (error) {
				callback(error, null);
			});
		},

		_deleteGreeting: function (obj, callback) {
			var url = '/api/guestbook/' + obj.guestBookName + '/greeting/';
			this.store.target = url;
			this.store.remove(obj.id_greeting).then(function (data) {
				callback(null, data);
			}, function (error) {
				callback(error, null);
			});
		}
	});
});