define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/topic",
	"dijit/form/TextBox",
	"greeting/_ViewBase",
	"greeting/GreetingStore",
	"dojo/text!./templates/GreetingWidget.html"
], function (declare, lang, on, dom, domStyle, domAttr, topic, TextBox, _ViewBase, GreetingStore, template) {

	return declare('guestbook.GreetingWidget', [_ViewBase], {
		templateString: template,
		createdTime: '',
		updatedTime: 'N/A',
		createdUser: '',
		updatedUser: '',
		content: '',
		id_greeting: '',

		guestBookName: '',
		addGuestBookName: '',
		addGreetingContent: '',
		isEdit: false,

		constructor: function (obj, guestBookName) {
			this.inherited(arguments);
			if (obj) {
				console.log(obj);
				this.content = obj.content || '';
				this.createdTime = obj.date || '';
				this.updatedTime = obj.updated_date || '';
				this.createdUser = obj.author || 'No one';
				//this.updatedUser = obj.updated_by || '';
				this.id_greeting = obj.id_greeting || '';

				if (dom.byId('isUserAdmin').value == 'True' || dom.byId('isUseLogin').value == obj.author) {
					this.isEdit = true;
				}
			}

			if (guestBookName) {
				this.guestBookName = guestBookName;
			}



		},

		postCreate: function () {
			if (this.isEdit) {
				domStyle.set(this.btnEdit, "display", "inline-block");
				domStyle.set(this.btnDelete, "display", "inline-block");
			}

			on(this.btnEdit, "click", lang.hitch(this, 'editGreeting'));
			on(this.btnCancel, "click", lang.hitch(this, 'cancelGreeting'));
			on(this.btnDelete, "click", lang.hitch(this, 'deleteGreeting'));
			on(this.btnSave, "click", lang.hitch(this, 'updateGreeting'));

		},

		editGreeting: function () {

			domStyle.set(this.contentEditNode, "display", "inline-block");
			this.displayEditForm(true);
		},

		cancelGreeting: function () {
			this.contentEditNode.set('value', this.content);
			this.displayEditForm(false);
		},

		displayEditForm: function (display) {
			////this.contentEditNode.set('readonly', !display);
			domStyle.set(this.editContent, "display", display ? "inline-block" : "none");
			domStyle.set(this.lblContent, "display", display ? "none" : "inline-block");

			domStyle.set(this.btnEdit, "display", display ? "none" : "inline-block");
			domStyle.set(this.btnSave, "display", display ? "inline-block" : "none");
			domStyle.set(this.btnCancel, "display", display ? "inline-block" : "none");


		},

		processCreate: function (obj, callback) {
			if (obj.guestBookName.length == 0 || obj.textGreeting.length == 0) {
				alert("Please Input data");
				return false;
			}
			if (obj.guestBookName.length > 10 || obj.textGreeting.length > 10) {
				alert("Character maximun is 10");
				return false;
			}

			var _greetingStore = new GreetingStore();
			var _this = this;

			_greetingStore._addGreeting({
				guestBookName: obj.guestBookName,
				textGreeting: obj.textGreeting
			}, function (error, data) {
				callback(error, data);
			});
		},

		deleteGreeting: function () {
			var _greetingStore = new GreetingStore();
			var _this = this;
			var url = '/api/guestbook/' + _this.guestBookName + '/greeting/';

			var isDelete = confirm("Do you want to delete this greeting?");
			if (isDelete == true) {
				_greetingStore._deleteGreeting({
					guestBookName: _this.guestBookName,
					id_greeting: _this.id_greeting
				}, function (error, results) {
					if (error) {
						alert("Delete Greeting fail");
					} else {
						location.reload();

					}
				});
			}
		},

		updateGreeting: function () {
			var _greetingStore = new GreetingStore();
			var _this = this;
			if (_this.contentEditNode.get('value').length > 0 && _this.contentEditNode.get('value').length <= 10) {
				_greetingStore._updateGreeting({
					guestBookName: _this.guestBookName,
					id_greeting: _this.id_greeting,
					textGreeting: _this.contentEditNode.get('value')
				}, function (error, results) {
					alert(error ? "Update Greeting fail" : "Update Greeting successful");
					if (error) {
						_this.contentEditNode.set('value', _this.content);
					}
					_this.lblContent.innerHTML = _this.contentEditNode.get('value');
					_this.displayEditForm(false);

					domStyle.set(_this.btnEdit, "display", "inline-block");
					domStyle.set(_this.btnSave, "display", "none");
					domStyle.set(_this.btnCancel, "display", "none");
					location.reload();
				});
			} else {
				alert("Character maximun is 10.");
			}
		}
	});
});