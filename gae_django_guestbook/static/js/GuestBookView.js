define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom",
    "dojo/dom-style",
	"dojo/on",
	"dojo/store/JsonRest",
	"dojo/topic",
	"dijit/form/TextBox",
    "dijit/form/SimpleTextarea",

	"greeting/_ViewBase",
	"greeting/GreetingWidget",
	"greeting/GreetingStore",
	"dojo/text!./templates/GuestBookView.html"

], function (declare, lang, domConstruct, dom, domStyle, on, JsonRest, topic, TextBox, SimpleTextarea,
			 _ViewBase, _GreetingWidget, GreetingStore, template) {

	return declare('guestbook.GuestBookView', [_ViewBase], {
		templateString: template,

		currentGuestBookName: '',

		greetingClass: 'greeting',
		guestBookClass: 'guestbook',
		contentLabel: 'dataInput',

		greetingContent: '',
		guestBookName: '1',
		GreetingStore: '',

		constructor: function (obj) {
			this.inherited(arguments);
			var url = "/api/guestbook/" + this.guestbookName + "/greeting/";
		},

		postCreate: function () {
			this.inherited(arguments);
			this.initGuestBook();
			on(this.btnSwitch, "click", lang.hitch(this, 'search'));
			on(this.btnAdd, "click", lang.hitch(this, 'add'));

			var _this = this;
			var handle = topic.subscribe("guestbook/topic", function (e) {
				_this.loadGreetingList(null);
				handle.remove();
			});

		},

		initGuestBook: function () {
			this.GreetingStore = new GreetingStore();
			this.loadGreetingList(null);
		},

		getGuestBookName: function (isDefault) {
			var tmpGuestBookName = isDefault ? '1' : '0';
			return (this.inputGuestBookName.get("value") ?
				this.inputGuestBookName.get("value") : tmpGuestBookName );
		},

		add: function () {
			var _this = this;
            _this.msgErr.innerHTML = "";
            _this.msg.innerHTML = "";
			var greetingWidget = new _GreetingWidget();
			greetingWidget.processCreate({
				guestBookName: _this.signGuestBookName.get('value'),
				textGreeting: _this.inputGreeting.get('value')
			}, function (error, data) {
				if (error) {
                    _this.msgErr.innerHTML = "Add Greeting fail";
					//alert("Add Greeting fail");
				} else {
                    _this.msg.innerHTML = "Add Greeting successful";
					//alert("Add Greeting successful");
					_this.signGuestBookName.set('value', '');
					_this.inputGreeting.set('value', '');
					_this.loadGreetingList(null);
				}
			});
		},

		search: function () {
            this.msgErr.innerHTML = "";
            this.msg.innerHTML = "";
			var url = '/api/guestbook/' + this.getGuestBookName(false) + '/greeting/';
			this.loadGreetingList(url);
		},
		loadGreetingList: function (url) {
			if (url == null) {
				url = '/api/guestbook/' + this.getGuestBookName(true) + '/greeting/';
			}
			var _this = this;
			_this.greetingListNode.innerHTML = '';

			this.GreetingStore._getListGreeting({
				guestBookName: _this.getGuestBookName(true)
			}, function (error, results) {
				if (error) {
					_this.greetingListNode.innerHTML = 'Can not load list greeting!!!'
				} else {
					_this.greetingTotal.innerHTML = results.greetings.length + ' Items';
					if (results.greetings) {
						for (var i = 0; i < results.greetings.length; i++) {

							var greetingWidget = new _GreetingWidget(results.greetings[i], _this.getGuestBookName(false));
							domConstruct.place(greetingWidget.domNode, _this.greetingListNode);
                            if(i%2 != 0){
                                domStyle.set(greetingWidget.domNode, "background-color", 'rgba(249, 247, 203, 0.34902)');
                            }
						}
					}
				}
			});
		}


	});
});