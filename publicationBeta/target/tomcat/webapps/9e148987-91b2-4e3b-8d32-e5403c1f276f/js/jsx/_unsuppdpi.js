
/* escape.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var Escape = (function()
{
	//*****************************************************************
	//Safe Escape/UnEscape support

	var SafeUri_EscapeCharacter = '/';

	var SafeUri_UnsafeCharacters = ['<', '>', '"', '\'', '%', ';', '(', ')', '&', '+'];
	
	return {
		SafeUriEscape: function(s) {
			return __Escape(s, 1);
		},

		SafeUriUnEscape: function(s) {
			return __UnEscape(s, 1);
		},


	//*****************************************************************
	// Simple Escape/UnEscape support

		MyEscape: function(s) {
			return __Escape(s, 0);
		},

		MyUnEscape: function(s) {
			return __UnEscape(s, 0);
		}
	}

	//*****************************************************************
	// private

	function __Escape(s, safe) {
		var snew = "";
		for (var i = 0; i < s.length; i++) {
			var ss = s.substr(i, 1);
			if (safe == 0 ? __Normal_Contains(ss) : !__SafeUri_Contains(ss)) {
				snew += ss;
			}
			else {
				ss = s.charCodeAt(i);
				var a = "0000" + ss.toString(16).toUpperCase();
				snew += (safe == 0 ? "$" : SafeUri_EscapeCharacter) + a.substr(a.length - 4);
			}
		}
		return snew;
	}

	function __UnEscape(s, safe) {
		var snew = "";
		var bEscape = false;
		for (var i = 0; i < s.length; i++) {
			var ss;
			if (bEscape) {
				ss = s.substr(i, 4);
				snew += String.fromCharCode(parseInt("0x" + ss));
				i += 3;
				bEscape = false;
			}
			else {
				ss = s.substr(i, 1);
				if (ss == (safe == 0 ? '$' : SafeUri_EscapeCharacter))
					bEscape = true;
				else
					snew += ss;
			}
		}
		return snew;
	}

	function __Normal_Contains(s) {
		return ((s >= '0' && s <= '9') || (s >= 'a' && s <= 'z') || (s >= 'A' && s <= 'Z'));
	}

	function __SafeUri_Contains(s) {
		var l = SafeUri_UnsafeCharacters.length;
		for (var i = 0; i < l; i++) {
			if (s == SafeUri_UnsafeCharacters[i])
				return true;
		}
		if (s == SafeUri_EscapeCharacter)
			return true;
		return false;
	}

})();

////////////////////////////////////////////////////////////////////////////////////////
// UrlParser object

/** @constructor */
function UrlParser() {
	this.params = new Array();
	this.safemode = false;
}

UrlParser.prototype.Clone = function() {
	var url = new UrlParser();
	url.params = new Array();
	url.safemode = this.safemode;
	for (var k in this.params) {
		var v = this.params[k];
		if (v == null)
			continue;
		url.params[k] = this.params[k];
	}
	return url;
}

UrlParser.prototype.Parse = function() {
	var strArgs;
	var strArg;
	var ss = document.location.hash.substring(1);
	strArgs = ss.split("&");
	if (strArgs.length == 0 || strArgs[0] == "") {
		ss = document.location.search.substring(1);
		strArgs = ss.split("&");
	};
	if (strArgs.length > 0) {
		if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
			this.safemode = true;
			strArgs = strArgs[0].substr(3);
			strArgs = Escape.SafeUriUnEscape(strArgs);
			strArgs = strArgs.split("&");
		}
	}
	for (var i = 0; i < strArgs.length; i++) {
		strArg = (strArgs[i]);
		if (strArg.length == 0)
			continue;
		var param = strArg.split("=");
		if (param.length == 2) {
			this.params[param[0].toLowerCase()] = param[1];
		}
		else if (param.length < 2) {
			this.params[param[0].toLowerCase()] = "";
		}
		else {
			this.params[param[0].toLowerCase()] = strArg.substr(param[0].length + 1);
		}
	}
}

UrlParser.prototype.GetSafeMode = function() {
	return this.safemode;
}

UrlParser.prototype.SetSafeMode = function(k) {
	this.safemode = k;
}

UrlParser.prototype.GetParameter = function(s) {
	return this.params[s.toLowerCase()];
}

UrlParser.prototype.AddParameter = function(s, v) {
	this.params[s.toLowerCase()] = v;
}

UrlParser.prototype.RemoveParameter = function(s) {
	this.params[s.toLowerCase()] = null;
}

UrlParser.prototype.ClearParameterList = function(s) {
	this.params = null;
	this.params = new Array();
}

UrlParser.prototype.BuildParameterList = function(s) {
	var s = "";
	var first = true;
	for (var k in this.params) {
		var v = this.params[k];
		if (v == null) {
			continue;
		}
		if (first == false) {
			s += "&";
		}
		first = false;
		if (v.length == 0) {
			s += k;
		}
		else {
			s += k + "=" + this.params[k];
		}
	}
	if (this.safemode) {
		s = "su=" + Escape.MyEscape(s);
	}
	return s;
}

UrlParser.prototype.GetCorrectUrl = function(url, nosu) {
	if (!this.safemode) { return url; }
	var strArgs;
	var k = url.indexOf("#");
	if (k == -1) { k = url.indexOf("?") }
	if (k >= 0) {
		var paramss = url.substring(k + 1);
		strArgs = paramss.split("&");
		if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
			return url;
		}
		var ss = url.substring(0, k + 1) + "su=" + Escape.SafeUriEscape(paramss);
		return ss;
	}
	else {
		return url + (nosu ? "" : "?su=");
	}
}

function UnescapeQuotes(s) {
	return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
