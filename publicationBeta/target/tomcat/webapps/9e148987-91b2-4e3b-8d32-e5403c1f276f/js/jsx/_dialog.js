
/* dialog_globals.js */
// Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
function keyPressHandler(e) {
	//alert("press1");
	var kC = (window.event) ?    // MSIE or Firefox?
                 event.keyCode : e.keyCode;
	var Esc = (window.event) ?
                27 : e.DOM_VK_ESCAPE // MSIE : Firefox
	if (kC == Esc) {
	if(parent.parent.isOpenDialog)
		if (parent.parent.isOpenDialog()) {
			parent.parent.closeDialog();
			return
			}
			if (parent.parent.parent.parent.isOpenDialog) {
				if (parent.parent.parent.parent.isOpenDialog())
					parent.parent.parent.parent.closeDialog();
		return;
			}
	
			
	}
}
/* ctxhelper.js */
/// <reference path="jquery-1.4.1-vsdoc.js" />

var upk = upk || {};

$.extend(true, upk, {
	contextHelper: function () {
		var _this = this;
		var _parentContextHelper = null;
		
		var currentCtx, prevCtx;

		_this.SetContext = function (ctx, sub) {
			if (_parentContextHelper) { _parentContextHelper.SetContext(ctx, sub); }
			else {
				//alert(window.location + ", ctx:" + ctx + ", sub:" + sub);
				prevCtx = currentCtx;
				currentCtx = { "view": ctx, "subview": sub };
				ias.SetContext(currentCtx);
			}
			return;
		}

		_this.SetNamespace = function (ns) {
			if (!_parentContextHelper) {
				//alert(window.location + ", Namespace:" + ns);
				ias.SetNamespace(ns);
			}
			return;
		}

		_this.AddDiscoveryCddUrl = function (url) {
			if (!_parentContextHelper) {
				ias.AddDiscoveryCddUrl(url);
			}
			return;
		}

		_this.SetPrevContext = function () {
			if (_parentContextHelper) { _parentContextHelper.SetPrevContext(); }
			else {
				currentCtx = prevCtx;
				ias.SetContext(currentCtx);
			}
		}

		try {
			if (self != top && typeof parent.ctxHelper === "object") {
				_parentContextHelper = parent.ctxHelper;
			}
		} catch(e){}

		return _this;
	}
})

window.ctxHelper = new upk.contextHelper();
if (window.ctxHelper instanceof upk.contextHelper) {
}
