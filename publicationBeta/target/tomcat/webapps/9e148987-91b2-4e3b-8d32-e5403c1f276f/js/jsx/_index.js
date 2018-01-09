
/* browser.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var _simulate_120_dpi = false;

function IsTouchDevice() {
    return upk.browserInfo.isTouchDevice();
}

var upk = upk || {};

// upk.browserInfo
(function (_this) {
    // PRIVATE
    var browserName = "";
    var version;
    var subversion;
    var trident = false;
    var tridentVersion;
    var isMac = false;
    var isFF3 = false;

    // PUBLIC

    _this.getAgentInfo = function () {
        if (typeof (document.documentMode) != "undefined")
            return navigator.userAgent + " - " + document.documentMode;
        else
            return navigator.userAgent;
    }

    _this.isSupportedBrowser = function () {
        var k = false;
        if (browserName == "MSIE" && (version >= 8 || (trident && tridentVersion >= 4)))
            k = true;
        if (browserName == "Firefox" && (version == 24 || version >= 27))
            k = true;
        if (browserName == "Safari" && version >= 6)
            k = true;
        if (browserName == "Chrome" && version >= 32)
            k = true;
        if (_this.isiOS())
            k = true;
        return k;
    }

    _this.isHardStop = function () {
        return (browserName == "MSIE" && version <= 6);
    }

    _this.isMacOs = function () {
        return isMac;
    }

    _this.isFF3 = function () {
        return isFF3;
    }

    _this.isFF = function () {
        return (browserName == "Firefox");
    }

    _this.isFF4 = function () {
        return (browserName == "Firefox" && version == 4);
    }

    _this.checkFFVersion = function (i) {
        return (browserName == "Firefox" && version == i);
    }

    _this.isSafari = function () {
        return (browserName == "Safari" || browserName == "Chrome");
    }

    _this.isChrome = function () {
        return (browserName == "Chrome");
    }

    _this.isExplorer = function () {
        return (browserName == "MSIE");
    }

    _this.isIEVersion = function (i) {
        return (browserName == "MSIE" && version == i);
    }

    _this.isIEQuirks = function () {
        if (_this.isExplorer() == false)
            return false;
        return (document.compatMode !== 'CSS1Compat'); // ? 'Standards' : 'Quirks');
    }

    _this.isIE8 = function () {
        if (browserName != "MSIE")
            return false;
        return (version == 8 && (trident && tridentVersion == 4));  // ie8 normal mode
    }

    _this.isIE9 = function () {
        if (browserName != "MSIE")
            return false;
        if (version == 9 && (trident && tridentVersion == 5))      // ie9 normal mode
            return true;
        if (version == 7 && (trident && tridentVersion == 5))      // ie9 compatability mode
            return true;
        return ((trident && tridentVersion == 6) && (version != 10 || document.documentMode != 10)); // ie10 compatibility mode
    }

    _this.isIE10 = function () {
        if (browserName != "MSIE")
            return false;
        return (version == 10 && (trident && tridentVersion == 6) && document.documentMode == 10); // ie10 normal mode
    }

    _this.isIE10Compatibility = function () {
        if (browserName != "MSIE")
            return false;
        return ((trident && tridentVersion == 6) && (version != 10 || document.documentMode != 10)); // ie10 compatibility mode
    }

    _this.isIE10orHigher = function () {
        if (browserName != "MSIE")
            return false;
        return (version >= 10 && (trident && tridentVersion >= 6) && document.documentMode >= 10); // ie10 or higher normal mode
    }

    _this.isIE11 = function () {
        if (browserName != "MSIE")
            return false;
        return (version == 11 && (trident && tridentVersion == 7) && document.documentMode == 11); // ie11 normal mode
    }

    _this.isIE11Compatibility = function () {
        if (browserName != "MSIE")
            return false;
        return ((trident && tridentVersion == 7) && (version != 11 || document.documentMode != 11)); // ie11 compatibility mode
    }

    _this.isActiveXEnabled = function () {
        var supported = null;
        var errorName = "";
        try {
            new ActiveXObject("");
        }
        catch (e) {
            // FF has ReferenceError here
            errorName = e.name;
        }
        try {
            supported = !!new ActiveXObject("htmlfile");
        } catch (e) {
            supported = false;
        }
        if (errorName != 'ReferenceError' && supported == false) {
            supported = false;
        } else {
            supported = true;
        }
        return supported;
    }

    _this.isIE10Modern = function () {
        if (_this.isIE10() == false)
            return false;
        return !_this.isActiveXEnabled();
    }

    _this.isiOS = function () {
        var p = navigator.platform;
        if (p === 'iPad' || p === 'iPad Simulator' || p === 'iPhone' || p === 'iPod')
            return true;
        if (_this.isChrome() && _this.isTouchDevice())
            return true;
        return false;
    }

    _this.isiOS5 = function () {
        var p = navigator.userAgent;
        return (p.indexOf("CPU OS 5_") >= 0);
    }

    _this.isiOS6 = function () {
        var p = navigator.userAgent;
        return (p.indexOf("CPU OS 6_") >= 0);
    }

    _this.isiOS7 = function () {
        var p = navigator.userAgent;
        return (p.indexOf("CPU OS 7_") >= 0);
    }

    _this.isTouchDevice = function () {
        return (("ontouchstart" in window) ? window : null);
    }

    _this.isSoundSupported = function () {
        if (_this.isiOS())
            return true;
        if (window.location.href.substr(0, 7).toLowerCase() == "file://")
            return false;
        if (swfobject.getFlashPlayerVersion().major > 0)
            return true;
        return false;
    }

    // CONSTRUCTOR
    var s = navigator.userAgent;
    var k = 0 - 1;
    if (s.indexOf("OPR") >= 0) {      // new opera version id
        browserName = "Opera";
        k = s.indexOf("OPR") + 4;
    }
    else if (s.indexOf("Chrome") >= 0) {
        browserName = "Chrome";
        k = s.indexOf("Chrome") + 7;
    }
    else if (s.indexOf("Opera") >= 0) {
        browserName = "Opera";
        k = s.indexOf("Opera") + 6;
    }
    else if (s.indexOf("Firefox") >= 0) {
        browserName = "Firefox";
        k = s.indexOf("Firefox") + 8;
    }
    else if (s.indexOf("Safari") >= 0) {
        browserName = "Safari";
        k = s.indexOf("Version") + 8;
    }
    else if (s.indexOf("MSIE") >= 0) {
        browserName = "MSIE";
        k = s.indexOf("MSIE") + 5;
        var ti = s.indexOf("Trident/");
        if (ti >= 0) {
            trident = true;
            tridentVersion = parseInt(s.substr(ti + 8));
        }
    }
    else if (s.indexOf(" rv:") >= 0) {
        browserName = "MSIE";
        k = s.indexOf(" rv:") + 3;
        var ti = s.indexOf("Trident/");
        if (ti >= 0) {
            trident = true;
            tridentVersion = parseInt(s.substr(ti + 8));
        }
    }
    else {
        browserName = "";
        version = 0;
    }
    if (browserName != "") {
        version = parseInt(s.substr(k));
        if (isNaN(version)) {
            k++;
            version = parseInt(s.substr(k));
        }
        subversion = parseInt(s.substr(k + 2, 1));
    }
    if (browserName == "Safari" && isNaN(version)) {
        version = 5;
        subversion = 0;
    }
    isMac = (s.indexOf("Macintosh") >= 0);
    isFF3 = (browserName == "Firefox" && s.indexOf("Firefox/3") > 0);

})(upk.browserInfo = {});

//
// Browser-independent object access (NS4, IE5+, Mozilla)
//

function getDIV(id) {
    return document.getElementById(id);
}

function getDIVstyle(id) {
    try {
        return document.getElementById(id).style;
    }
    catch (error) {
        //alert ("##### ERROR #####:\n" + error + "\n\n##### CALLER #####" + getDIVstyle.caller);
        return null;
    }
}

function shiftTo(id, x, y) {
    var obj = getDIVstyle(id);
    obj.left = x + "px";
    obj.top = y + "px";
}

/**
* #####################
* # START NEW CONTENT #
* #####################
*/

function getUniWidth(id) {
    return id.offsetWidth;
}

function getUniHeight(id) {
    return id.offsetHeight;
}

function getClientWidth(id) {
    return id.offsetWidth;
}

function getClientHeight(id) {
    return id.offsetHeight;
}

/**
* ###################
* # END NEW CONTENT #
* ###################
*/

function getObjHeight(id) {
    return getDIV(id).offsetHeight;
}

function getObjWidth(id) {
    return getDIV(id).offsetWidth;
}

function getObjLeft(id) {
    try {
        var obj = getDIVstyle(id);
        if (obj.pixelLeft) {
            return obj.pixelLeft;
        }
        else if (obj.left != "") {
            return parseInt(obj.left);
        }
        else {
            return document.getElementById(id).offsetLeft;
        }
    }
    catch (error) {
        return parseInt(id.offsetLeft);
    }
}

function getObjTop(id) {
    try {
        var obj = getDIVstyle(id);
        if (obj.pixelTop) {
            return obj.pixelTop;
        }
        else if (obj.top != "") {
            return parseInt(obj.top);
        }
        else {
            return document.getElementById(id).offsetTop;
        }
    }
    catch (error) {
        return parseInt(id.offsetTop);
    }
}


function getInsideWindowWidth() {
    if (window.innerWidth) {
        return window.innerWidth;
    }
    else {
        return document.body.clientWidth;
    }
}

function getInsideWindowHeight() {
    if (window.innerHeight) {
        return window.innerHeight;
    }
    else {
        return document.body.clientHeight;
    }
}

function getScrollLeft() {
    if (window.pageXOffset || window.pageXOffset == 0) {
        return window.pageXOffset;
    }
    else {
        return document.body.scrollLeft;
    }
}

function getScrollTop() {
    if (window.pageYOffset || window.pageYOffset == 0) {
        return window.pageYOffset;
    }
    else {
        return document.body.scrollTop;
    }
}

function show(id, strinput) {
    var obj = getDIVstyle(id);
    obj.visibility = "visible";
    if (strinput && upk.browserInfo.isiOS()) {
        try {
            if (playMode == "S") {
                if (showActObj.type == "Input") {
                    $("#" + id + " input").attr('readonly', true);
                }
            }
        }
        catch (e) { };
    }
}

function hide(id, strinput) {
    var obj = getDIVstyle(id);
    obj.visibility = "hidden";
}

var __DPIwidth = 0;

function getDpiInfo() {
    var d = document.getElementById("DPIInfoDiv");
    if (d != null) {
        __DPIwidth = d.clientWidth;
        if (__DPIwidth == 0) { //player is in hidden frame
            __DPIwidth = 96;
        }
        if (__DPIwidth != 0)
            document.getElementsByTagName("body")[0].removeChild(d);
    }
    return _simulate_120_dpi == true ? 120 : __DPIwidth;
}

function initDpiInfo() {
    document.write('<div id="DPIInfoDiv" style="visibility:hidden; width: 72pt; height: 1pt;">DPIINFODIV</div>');
}

function checkIEDPI() {
    return true;
    //    if (IsExplorer() == false)
    //        return true;
    //    return (screen.deviceXDPI == 96);
}

/*
functions from browser1.js
*/

function Get_Element(id) {
    return document.getElementById(id);
}

/*
END functions from browser1.js
*/

function touch(e) {
    if (e.originalEvent.touches && e.originalEvent.touches.length) {
        return e.originalEvent.touches[0];
    } else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
        return e.originalEvent.changedTouches[0];
    }
};

function isNavBar() {
    return (typeof navBar !== 'undefined');
}

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

/* cookie.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/** @constructor */
function Cookie(doc, name, exp, path, domain, secure) {
    this.$document = doc;
    this.$name = name;
    if (exp == "today") {
        var d = new Date();
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        this.$exp = d;
    }
    else if (exp)
        this.$exp = new Date((new Date()).getTime() + exp * 3600000 * 24);
    else
        this.$exp = null;
    if (path) this.$path = path; else this.$path = null;
    if (domain) this.$domain = domain; else this.$domain = null;
    if (secure) this.$secure = true; else this.$secure = false;
}

Cookie.prototype.Store = function () {
    if (!PlayerConfig.EnableCookies)
        return;

    var cookieval = "";
    for (var prop in this) {
        if ((prop.charAt(0) == "$") || ((typeof this[prop]) == 'function'))
            continue;
        if (cookieval != "") cookieval += "&";
        cookieval += prop + ":" + escape(this[prop]);
    }

    var cookie = this.$name + "=" + cookieval;
    if (this.$exp)
        cookie += "; expires=" + this.$exp.toGMTString();
    if (this.$path) cookie += "; path=" + this.$path;
    if (this.$domain) cookie += "; domain=" + this.$domain;
    if (this.$secure) cookie += "; secure=";

    this.$document.cookie = cookie;
}

Cookie.prototype.Load = function () {
    if (!PlayerConfig.EnableCookies)
        return false;

    var allcookies = this.$document.cookie;
    if (allcookies == "") return false;

    var start = allcookies.indexOf(this.$name + "=");
    if (start == -1) return false;
    start += this.$name.length + 1;

    var end = allcookies.indexOf(";", start);
    if (end == -1)
        end = allcookies.length;

    var cookieval = decodeURIComponent(allcookies.substring(start, end));

    var a = cookieval.split("&");
    for (var i = 0; i < a.length; i++) {
        var p = a[i].split(":");
        this[p[0]] = unescape(p[1]);
    }

    return true;
}

Cookie.prototype.Remove = function () {
    if (!PlayerConfig.EnableCookies)
        return;

    var cookie = this.$name + '=';
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';

    this.$document.cookie = cookie;
}

/* query.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/// <reference path="resource.js" />
/// <reference path="xmlloader.js" />
/// <reference path="escape.js" />

// OnDemand query parser

//TEMPORARY
var logger_enabled_query = false;
//var logger_enabled_query = true;

function log(x) {
	if (logger_enabled_query) {
		if (window.top.console) {
			window.top.console.log(x);
		}
	}
}


var datasourceroot = "querydb/";
var ConvertDbSelector = { t: "text", u: "ctxod", e: "ctxex", r: "role", g: "genctx" };

var q_search_and = " and ";
var q_search_or = " or ";

function ToHalfWidth(str) {
	var halfKatakanaSet = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
	var fullKatakanaSet = "ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン";

	var result = "";

	for (var i = 0; i < str.length; i++) {
		var k = fullKatakanaSet.indexOf(str.charAt(i));
		if (k !== -1)
			result += halfKatakanaSet.charAt(k);
		else if (str.charCodeAt(i) >= 0xff01 && str.charCodeAt(i) <= 0xff5f)
			result += String.fromCharCode(str.charCodeAt(i) - 0xfee0);
		else
			result += str.charAt(i);
	}

	return result;
}

var QueryParser = (function ()
{	
	var PS; // stack
	var PT = [ 0,
//     e   (   )   &|  !  EOT q
	[  2,  3,  0,  0,  0,  0, 4 ],
	[ -1, -1, -1, -1,  5, -1, 0 ],
	[  2,  3,  0,  0,  0,  0, 6 ],
	[  0,  0,  0,  7,  0, 10, 0 ],
	[ -2, -2, -2, -2, -2, -2, 0 ],
	[  0,  0,  8,  7,  0,  0, 0 ],
	[  2,  3,  0,  0,  0,  0, 9 ],
	[ -4, -4, -4, -4, -4, -4, 0 ],
	[ -3, -3, -3, -3, -3, -3, 0 ]];

	function Parse(query_type, query_expression)
	{
		log('QueryProcessor.Parse');

		if (query_type === 'XDT') {
			var retobj = ParseXDT(query_expression);
			return JSON.stringify(retobj);
		}

		q_search_and = " " + R_search_AND.toLowerCase() + " ";
		q_search_or = " " + R_search_OR.toLowerCase() + " ";

		var lexer;
		var keyws;
		if ("URI" === query_type) {
			lexer = /\(|\)|\+|-|[u,e,k,r,g]|!|\d|'[^']+'/g;
			keyws = ["(",")","+","-","u","e","t","r","g","!","0","1","2","3","4","5","6","7","8","9"];
		} else {
			lexer = new RegExp('\\(|\\)|'+q_search_and+'|'+q_search_or+'|"[^"]+"|[^ \\(\\)]+(?=\\(|\\)|\\s|$)','gi'); //doesn't support db|!|\d
			keyws = ["(",")",q_search_and,q_search_or];
		}
		var codem = [1,2,3,3,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4];
		var semvm = [0,0,"&","|",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


		if (query_type !== 'URI')
		{
			query_expression = ToHalfWidth(query_expression);
			query_expression = query_expression.toLowerCase();
		}
	
		var ev = null;
		var pr = null;
		PS = [];
		PS.push({st: 1, se: 0});
	
		var result;
		var i;
		var opm = 0; // operator missing
		var cdb = "t"; // current database
		while ((result = lexer.exec(query_expression)) != null) {
			var sem = result[0]; // semantic value
			var sym = 0; // symbol value
			for (i in keyws) {
				if (sem === keyws[i]) {
					sym = codem[i];
					if (semvm[i])
						sem = semvm[i];
					break;
				}
			}

			// lexical preprocessor
			// 1) implicit db settings
			// 2) implicit operator '&'
			if (sym === 5) { // db change is stored but not passed
				cdb = sem;
				continue;
			}
			if (sym === 3) // operator
				opm = 0;
			if ((sym === 0 || sym === 1) && opm) { 
				if (SM(3, "&")) // insert missing '&'
					return;
				opm = 0;
			}
			if (sym === 0) { // condition
				if (sem.charAt(0) === '"' || sem.charAt(0) === "'")
					sem = sem.slice(1, sem.length - 1);
				if ("URI" !== query_type) 
				{
					// remove trailing % or *
					if (sem.length > 1) {
						var lc = sem[sem.length - 1];
						if (lc === '%' || lc === '*')
							sem = sem.slice(0, -1);
					}
					sem = Escape.MyEscape(sem.toLowerCase());
				}
				sem = cdb + sem;
				opm = 1;
			}
			if (SM(sym, sem)) {
				log('QueryProcessor.Parse return');
				return;
			}
		}
		if (!SM(5, "$")) {
			ev = PS[1].se.ev;
			pr = PS[1].se.pr;
		}
		log('QueryProcessor.Parse ' + ev + ' ' + pr);
		//	alert(ev + "\n" + pr);

		return ev;
	}
	function ParseXDT(query_object) {
		var retval = [];
		switch (query_object[0].Op) {
			case '&':
			case '|':
				retval = ParseXDT(query_object[1]);

				for (var i = 2; i < query_object.length; i++) {
					retval = retval.concat(ParseXDT(query_object[i]));
					retval.push({ "a": "o", "p": query_object[0].Op });
				}
				return retval;
			case "EM":
				retval[0] = { "a": "s", "d": "e",
					"p": (query_object[0].App + "$" + Escape.MyEscape(query_object[1])) };

				for (var i = 2; i < query_object.length; i++) {
					retval.push({ "a": "s", "d": "e",
						"p": (query_object[0].App + "$" + Escape.MyEscape(query_object[i])) });
					retval.push( { "a": "o", "p" : '&' } ) ; 
				}
				return retval; 
        
			case "SM":
				return [ { "a": "s", "d" : "g", "p": query_object } ] ;

			default:
				console.log("Error: Unknown operator " + query_object[0].Op);
				break; 
		}

		return null; 
	}

	function SM(sym, sem)
	{
		//	alert(sym + ", " + sem);
		log('QueryProcessor.SM ' + sym + ' ' + sem);
		while (1) {
			var sp = PS[PS.length - 1];
			var ptv = PT[sp.st][sym];
			if (ptv === 10) {
				//			alert("accept");
				return false;
			}
			if (ptv === 0) {
				//			alert("error");
				return true; // error
			}
			if (ptv > 0) { // shift
				PS.push({st: ptv, se: sem});
				return false;
			}
			if (ptv < 0) {
				var nsem;
				var p = PS.length;
				var p1 = PS[p - 1];
				var p2 = PS[p - 2];
				var p3 = PS[p - 3];
				switch (-ptv) {
					case 1: 
						nsem = { 
							ev: "{a:'s', d:'" + p1.se.charAt(0) + "', p:'" + p1.se.slice(1) + "'}", 
							pr: p1.se.slice(1) }; 
						break;
					case 2:	
						if (p1.se === "!") {
							nsem = { ev: "{a:'s', d:'" + p2.se.charAt(0) + "', p:'" + p2.se.slice(1) + "', m:'" + p1.se + "'}" };
						} else {
							var ss = p2.se.slice(1, parseInt(p1.se) + 1) + "$002A";
							nsem = {
								ev: "{a:'s', d:'" + p2.se.charAt(0) + "', p:'" + p2.se.slice(1) +
								"'}, {a:'s', d:'" + p2.se.charAt(0) + "', p:'" + ss + 
								"'}, {a:'o', p:'|'}" };
						}
						nsem.pr = p2.se.slice(1);
						break;
					case 3: nsem = {
						ev: p3.se.ev + ", " + p1.se.ev + ", {a:'o', p:'" + p2.se + "'}",
						pr: p3.se.pr + (p2.se === "|" ? " or " : " ") + p1.se.pr };
						break;
					case 4: nsem = {
						ev: p2.se.ev,
						pr: "(" + p2.se.pr + ")" };	
						ptv = -3;
						break;
				}
				if (ptv === -1 || ptv === -2) {
					nsem.pr = decodeURIComponent(nsem.pr);
					if (nsem.pr.search(/\s/) !== -1)
						nsem.pr = '"' + nsem.pr + '"';
				}
				PS.length += ptv;
				PS.push({st: PT[PS[PS.length - 1].st][6], se: nsem});
			}
		}
	}

	function o(op, op1, op2)
	{
		//	debug.insertAdjacentHTML("beforeEnd", "<div>" + op + ", " + op1 + ", " + op2 + "</div>");
		return op1 + op + op2;
	}

	function e(db, se, st) {
		if (!st)
			st = "";
		se = decodeURIComponent(se);
		//	debug.insertAdjacentHTML("beforeEnd", "<div>" + db + ", " + se + ", " + st + "</div>");

		return db + "=" + se + st;
	}

	return {
		Parse: Parse
	}
})();

var QueryProcessor = {
	rr: null,
Start: function(q, r)
{
	log('QueryProcessor.Start');
	this.rr = r;
	if (q.slice(0, 1) === "[" && q.slice(-1) === "]")
		this.qa = eval(q);
	else
		eval("this.qa = [" + q + "]");
	this.qp = 0;
	this.Eval();
},

Eval: function()
{
	var n = this.qa[this.qp];
	if (n.a === "s") {
		if (n.d === "g")
			SearchSM(n.p, function (r) { QueryProcessor.ReportResult(r); });
		else {
			var m = n.d === "t" ? false : true;
			if (n.m === "!")
				m = !m;
			SearchDBs[n.d].Search(n.p, m);
		}
	} else if (n.a === "o") {
		if (n.p === "&")
			this.qa[this.qp - 2].And(this.qa[this.qp - 1]);
		else
			this.qa[this.qp - 2].Or(this.qa[this.qp - 1]);
		this.qp -= 2;
		this.qa.splice(this.qp + 1, 2);
		this.Next();
	}
},

Next: function()
{
	if (this.qa.length === 1) {
		this.rr(this.qa[0].rs);
		return;
	}
	this.qp++;
	this.Eval();
},

ReportResult: function(r)
{
	log('QueryProcessor.ReportResult r = ' + r);
	log('QueryProcessor.ReportResult this.qa = ' + this.qa + ' this.qp = ' + this.qp + ' ' + this.qa[this.qp]);
	this.qa[this.qp] = r;
	this.Next();
}
};

function ReadBase64_6(i)
{
	if (i === 43)
		return 62;
	if (i === 45)
		return 63;
	if (i < 58)
		return i - 48;
	if (i < 91)
		return i - 55;
	else
		return i - 61;
}

function ReadBase64_32(s)
{
	var i, j;
	j = 0;
	i = 0x20;
	while (i & 0x20) {
		i = ReadBase64_6(s.s.charCodeAt(s.p));
		j <<= 5;
		j |= (i & 0x1f);
		s.p++;
	}
	return j;
}

function ReadBase64_ITP(s, ctr)
{
	var r = [];
	var c, n, l = 0;
	while (s.p < s.s.length) {
		n = ReadBase64_32(s);
		c = 1 === n ? ReadBase64_32(s) : 1;
		while (c) {
			l += n;
			r.push(new ctr(l));
			c--;
		}
	}
	return r;
}

function SearchDB(dbid)
{
	log('SearchDB dbid = ' + dbid);
	this.db_id = dbid;
	this.ResetIndex();
	this.request_total = 0;
	this.request_count = 0;
}

SearchDB.prototype.ResetIndex = function () {
	this.index = [];
	this.index.push({ key: null, node: "1" });
};

SearchDB.prototype.k = function (args) {
	log('SearchDB.k() args.length = ' + args.length);
	var prev = "";
	for (var i = 0; i < args.length; i++) {
		var s = { s: args[i], p: 0 };
		var l;
		var w = "";
		l = ReadBase64_32(s);
		var nk;
		nk = i === args.length - 1 ? this.index[this.index_insert_position] : {};
		nk.node = l > 0 ? s.s.slice(s.p, s.p + l) : 0;
		s.p += l;
		l = ReadBase64_32(s);
		w += prev.slice(0, l);
		l = ReadBase64_32(s);
		w += s.s.slice(s.p, s.p + l);
		s.p += l;
		if (w.length > 0) {
			nk.key = w;
		}
		prev = w;
		while (s.p < s.s.length) {
			nk.values = [];
			l = ReadBase64_32(s);
			nk.values.push(s.s.slice(s.p, s.p + l));
			s.p += l;
		}
		if (i < args.length - 1) {
			this.index.splice(this.index_insert_position, 0, nk);
			this.index_insert_position++;
		}
	}
	this.d();
};

SearchDB.prototype.LoadScript = function (f) {
	//log('SearchDB.LoadScript() f = ' + f);
	CDB = this;
	var dbPath = ConvertDbSelector[this.db_id];
	//	setTimeout("jsdbfile.src='" + datasourceroot + dbPath + "/" + f + ".js'", 1);
	LoadXMLDocArray(datasourceroot + dbPath + "/" + f + ".xml", (function (sdb) { return function (p) { sdb.LoadScript_Callback(p); } })(SearchDBs[this.db_id]), null, "N", false);
	this.request_total++;
	this.request_count++;
};

SearchDB.prototype.LoadScript_Callback = function (a) {
	//log('SearchDB.LoadScript_Callback() a = ' + a);
	CDB = this;
	CDB.k(a);
};

SearchDB.prototype.Search = function (s, m, c) {
	log('SearchDB.Search() = ' + s);
	if (c) {
		this.Search_CallBack = c;
	}
	else {
		this.Search_CallBack = QueryProcessor.ReportResult;
	}
	//log('SearchDB.Search() this.Search_CallBack = ' + this.Search_CallBack.toString());
	this.RequestCount = 0;
	this.search = s;
	this.exact_match = m;
	this.results = new SearchResultSet(null);
	if (this.search.length === 0)
		return;
	this.index_match = 0;
	this.d = this.d1;
	this.d();
};

SearchDB.prototype.IndexSearch = function () {
	log('SearchDB.IndexSearch() this.index.length = ' + this.index.length);
	var i;
	for (i = this.index_match; i < this.index.length; i++)
		if (null == this.index[i].key || this.search <= this.index[i].key)
			break;

	this.index_match = i;
	log('SearchDB.IndexSearch() this.index_match = ' + this.index_match);
};

SearchDB.prototype.d1 = function () {
	log('SearchDB.d1()');
	this.IndexSearch();
	if (null != this.index[this.index_match].key && this.search === this.index[this.index_match].key) {
		//log('SearchDB.d1() 1');
		if (!this.exact_match && this.index[this.index_match].values.length < 2) {
			//log('SearchDB.d1() 2');
			//Bug 17502091 - share - kp.html doesn't have concept with outline link
			this.results.Or(new SearchResultSet(this.index[this.index_match].values[0]));
			this.index_match++;
			this.d = this.d2;
			this.d();
		} else {
			//log('SearchDB.d1() 1 else');
			var v = this.index[this.index_match].values;
			for (var j in v) {
				this.results.Or(new SearchResultSet(v[j]));
				if (this.exact_match)
					break;
			}
			//QueryProcessor.ReportResult(this.results);
			this.ReportResult(this.results);
		}
	} else {
		//log('SearchDB.d1() else');
		if (this.index[this.index_match].node != 0) {
			this.index_insert_position = this.index_match;
			this.LoadScript(this.index[this.index_match].node);
		} else {
			if (!this.exact_match) {
				this.d = this.d2;
				this.d();
			}
			else {
				//QueryProcessor.ReportResult(this.results);
				this.ReportResult(this.results);
			}
		}
	}
};

SearchDB.prototype.d2 = function () {
	log('SearchDB.d2()');
	if (this.index[this.index_match].node !== 0) { // key has smaller children that are not yet loaded, load them
		this.index_insert_position = this.index_match;
		this.LoadScript(this.index[this.index_match].node);
	} else if (null !== this.index[this.index_match].key && this.index[this.index_match].key.substring(0, this.search.length) === this.search) { // substring match
		this.results.Or(new SearchResultSet(this.index[this.index_match].values[0])); // add to results
		this.index_match++; // move to next
		this.d2();
	} else { // no children, no match, end of traversal, report results
		log('SearchDB.d2() this.results = ' + this.results);
		this.ReportResult(this.results);
		return;
	}
};

SearchDB.prototype.ReportResult = function (r) {
	log('SearchDB.ReportResult() r = ' + r);

	if (this.db_id !== 'g') {
		QueryProcessor.ReportResult(r);
	}
	else {
		this.Search_CallBack(r);
	}
};

var SearchDBs = { t: new SearchDB("t"), u: new SearchDB("u"), e: new SearchDB("e"), r: new SearchDB("r"), g: new SearchDB("g") };
var CDB = null;

function SearchResult(index)
{
	this.index = index;
	this.weight = 1.0;
}

function SearchResultSet(s)
{
	if (s) {
		var ss = { s: s, p: 0 };
		this.rs = ReadBase64_ITP(ss, SearchResult);
	} else
		this.rs = [];
}

SearchResultSet.prototype.Or = function (srs) {
	this.AOR(srs, true);
};

SearchResultSet.prototype.AOR = function (srs, or, weight) {
	var i, j;
	for (i = 0, j = 0; i < srs.rs.length; i++) {
		while (j < this.rs.length && this.rs[j].index < srs.rs[i].index)
			j++;
		if (j === this.rs.length || this.rs[j].index !== srs.rs[i].index)
			this.rs.splice(j, 0, srs.rs[i]);
		else {
			var w1 = this.rs[j].weight;
			var w2 = srs.rs[i].weight;
			//log('AOR w1 = ' + w1 + ' w2 = ' + w2 + ' or = ' + or + ' weight = ' + weight);
			this.rs[j].weight = or ? Math.max(w1, w2) : w1 + w2 * weight;
		}
	}
};

SearchResultSet.prototype.Combine = function (srs, weight) {
	this.AOR(srs, false, weight);
};

SearchResultSet.prototype.GetMaxWeight = function () {
	var maxValue = 0;
	for (var i = 0; i < this.rs.length; i++) {
		if (this.rs[i].weight > maxValue) {
			maxValue = this.rs[i].weight;
		}
	}
	return maxValue;
};

SearchResultSet.prototype.CutOffByLimit = function (limit) {
	for (var i = 0; i < this.rs.length; i++) {
		if (this.rs[i].weight < limit) {
		    this.rs.splice(i, 1);
		    i--;
		}
	}
};


SearchResultSet.prototype.And = function (srs) {
	var i, j;
	for (i = 0, j = 0; i < srs.rs.length && j < this.rs.length; i++) {
		while (j < this.rs.length && this.rs[j].index < srs.rs[i].index)
			this.rs.splice(j, 1);
		if (j < this.rs.length && srs.rs[i].index === this.rs[j].index) {
			var w1 = this.rs[j].weight;
			var w2 = srs.rs[i].weight;
			this.rs[j].weight = Math.min(w1, w2);
			j++;
		}
	}
	this.rs.splice(j, this.rs.length - j);
};


/* xmlloader.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

//////////////////////////////////////////////////////////////////////////////
// Simple function for load XML file by HTTPRequest
// Parameters:
//	url				url of xml file
//	workerFunction	name of callback function will be called with request in the following form:
//					workerFunction(req,extraInfo);
//	extraInfo		extra information for user will be give back with callback function

function AbsUrl(url) {
    return url;

    /*
    for (var i = 0; i < url.length; i++) {
    if (url.substr(i, 1) == ':')
    return url;
    }
    var base = window.location.href;

    var k1 = base.indexOf('?');
    var k2 = base.indexOf('#');
    if (k1 >= 0 || k2 >= 0) {
    if (k1 >= 0 && k2 >= 0) {
    base = base.substr(0, (k1 < k2 ? k1 : k2));
    }
    else if (k1 >= 0) {
    base = base.substr(0, k1);
    }
    else {
    base = base.substr(0, k2);
    }
    }

    var k;
    if (url.substr(0, 3) == "../") {
    k = base.lastIndexOf('/');
    base = base.substr(0, k);
    while (url.substr(0, 3) == "../") {
    k = base.lastIndexOf('/');
    base = base.substr(0, k);
    url = url.substr(3);
    }
    base = base + "/" + url;
    }
    else {
    if (url.substr(0, 1) == "/")
    url = url.substr(1);
    k = base.lastIndexOf('/');
    base = base.substr(0, k);
    base = base + "/" + url;
    }
    return (base);
    */
}

function LoadXMLDoc(url, workerFunction, errorFunction, extraInfo, synchronous) {
    var _url = AbsUrl(url);
    if (synchronous == undefined)
        synchronous = false;

    var _req = null;
    try {
        if (window.location.href.substr(0, 7).toLowerCase() == "http://" ||
			window.location.href.substr(0, 8).toLowerCase() == "https://")
            _req = new XMLHttpRequest();
        if (window.location.href.substr(0, 7).toLowerCase() == "file://" && IsTouchDevice()) {
            _req = new XMLHttpRequest();
        }
    }
    catch (e) { }
    finally {
        if (_req == null)
            _req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    _req.onreadystatechange = function () { state_Change(_url, _req, workerFunction, errorFunction, extraInfo); };
    _req.open("GET", _url, !synchronous);
    if (extraInfo == "PING")
        _req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
    _req.send(null);
}

function state_Change(_url, _req, _workerFunction, _errorFunction, _extraInfo) {
    if (_req.readyState == 4) {
        if (_req.status == 200 || (_req.status == 0 && _extraInfo != "PING")) {
            if (_req.responseXML == null || _req.responseXML.documentElement == null) {
                var xmlDoc = null;
                try {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(_req.responseText);
                }
                catch (e) {
                    var p = new window.DOMParser();
                    xmlDoc = p.parseFromString(_req.responseText, "application/xml");
                }
                var rpt = _req.responseText;
                _req = {};
                _req.responseXML = xmlDoc;
                _req.responseText = rpt;
            }
            _workerFunction(_req, _extraInfo);
        }
        else {
            if (_errorFunction) {
                if (_extraInfo != "PING")
                    alert(_url + " not found. Logged...");
                _errorFunction(_extraInfo);
            }
            else
                alert("Problem retrieving data: " + _req.statusText);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////
// Function to load XML files contain simple arrays
// Parameters:
//	url				url of xml file
//	returnFunction	function will be call back with a simple array loaded from xml file
//	nodeName		name of node for load

function LoadXMLDocArray(url, returnFunction, errorFunction, nodeName, xmlmode) {
    LoadXMLDoc(url, xmlmode ? XMLDocArrayWorker2 : XMLDocArrayWorker, errorFunction, { nodeName: nodeName, returnFunction: returnFunction }, false);
}

function XMLDocArrayWorker(req, extraInfo) {
    var _nodesArray = [];
    var _nodes = req.responseXML.getElementsByTagName(extraInfo.nodeName);
    for (var i = 0; i < _nodes.length; i++) {
        var n = _nodes[i];
        var s = (n.textContent ? n.textContent : n.text);
        if (!s)
            s = "";
        var k = s.length;
        if (k >= 2) {
            if ((s.substr(0, 1) == '\"') && (s.substr(k - 1, 1) == '\"')) {
                s = s.substr(1, k - 2);
            }
        }
        _nodesArray[_nodesArray.length] = s;
    }
    extraInfo.returnFunction(_nodesArray);
}

function XMLDocArrayWorker2(req, extraInfo) {
    var _nodesArray = [];
    var _nodes = req.responseXML.getElementsByTagName(extraInfo.nodeName);
    for (var i = 0; i < _nodes.length; i++) {
        var n = _nodes[i];
        var xmlname = n.attributes[0].value;
        var xmltext = "";
        for (var j = 0; j < n.childNodes.length; j++) {
            if (n.childNodes[j].xml) {
                xmltext += n.childNodes[j].xml;
            } else {
                var oSerializer = new XMLSerializer();
                xmltext += oSerializer.serializeToString(n.childNodes[j]);
            }
        }
        _nodesArray[_nodesArray.length] = xmlname + "=" + xmltext;
    }
    extraInfo.returnFunction(_nodesArray);
}


/* playerlaunch.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var doItplayerWindow = null;

function LaunchDoIt(url, params) {
    var popupVersion = false;
    var _params = params;

    var run = true;
    if (doItplayerWindow) {
        if (!doItplayerWindow.closed)
            run = false;
    }

    if (run) {
        if (upk.browserInfo.isExplorer()) {
            try {
                function IsWindowPositioningRestricted() {
                    var p = window.createPopup();
                    p.show(1, 1, 1, 1);
                    var r = p.document.parentWindow.screenTop == 1;
                    p.hide();
                    return !r;
                }

                if (!IsWindowPositioningRestricted() && !upk.browserInfo.isIE10Modern()) {
                    var safeuri = false;
                    if (_params.substr(0, 3) == "su=") {
                        _params = Escape.SafeUriUnEscape(_params.substr(3));
                        safeuri = true;
                    }
                    _params += "&popup=true";
                    if (safeuri) {
                        _params = "su=" + Escape.SafeUriEscape(_params);
                    }
                    popupVersion = true;
                }
            } catch (e) {
            }
        }

        if (popupVersion) {
//            if (IsIE9()) {url = url + "topicgc.html"; }
//            else {url = url + "topicgcx.html"; }
            url = url + "topicgc.html";
            var url2 = typeof (urlParser) == "undefined" ? url + "?" + _params : urlParser.GetCorrectUrl(url + "?" + _params);
            doItplayerWindow = window.open(url2, "", "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,left=1500");
        }
        else {
            url = url + "topicgcx.html";
            if (upk.browserInfo.isExplorer()) {
                var appVerArray = navigator.appVersion.split(";");
                var appVer = appVerArray[1];
                appVer = appVer.substr(6)
                appVer = parseFloat(appVer);
            }
            var LeftPos = upk.browserInfo.isSafari() ? screen.availWidth - 361 : screen.availWidth - 290;
            var TopPos = screen.availHeight - 450;
            var popWidth = upk.browserInfo.isSafari() ? 346 : 275;
            var popHeight = 400;
            if (PlayerConfig.EnableCookies) {
                GICookie = new Cookie(document, "GICookie", 365, "/", null, null)
                if (GICookie.Load()) {
                	if (GICookie["Cleft"] >= 0 && GICookie["Ctop"] >= 0 && parseInt(GICookie["Cleft"]) + parseInt(GICookie["Cwidth"]) < screen.availWidth && GICookie["Ctop"] < screen.availHeight) {
                        LeftPos = parseInt(GICookie["Cleft"]);
                        TopPos = parseInt(GICookie["Ctop"]);
                        popWidth = parseInt(GICookie["Cwidth"]);
                        popHeight = parseInt(GICookie["Cheight"]);
                    }
                }
            }
            var url2 = typeof (urlParser) == "undefined" ? url + "?" + _params : urlParser.GetCorrectUrl(url + "?" + _params);
            doItplayerWindow = window.open(url2, "", "toolbar=0,scrollbars=0,location=1,statusbar=0,menubar=0,resizable=1,left=" + LeftPos + ",top=" + TopPos + ",width=" + popWidth + ",height=" + popHeight);
        }
    }
    else {
        alert(R_toc_doit_err);
    }
}


/* dual_support.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

//defines
var SM_CYCAPTION = 19;
var SM_CYFRAME = 4;

function GetDualMonitor() {
    primarydisplay = true;

    if (PlayerConfig.DualMonitorSupport) {
        var testwindow = window.open("", "", "width=10,height=10");
        twscreenX = (testwindow.screenX != null ? testwindow.screenX : testwindow.screenLeft)
        twscreenY = (testwindow.screenY != null ? testwindow.screenY : testwindow.screenTop)
        if (twscreenX < 0 || twscreenX > this.screen.width)
            primarydisplay = false;
        if (twscreenY < 0 || twscreenY > this.screen.height)
            primarydisplay = false;
        testwindow.close();
    }

    var features = "";
    if (primarydisplay) {
        if (PlayerConfig.DualMonitorFixedSize == true) {
            var lngMaxWidth = 1024;
            var lngMaxHeight = 768;
            var lngWidth;
            var lngHeight;
            var lngLeft = 0;
            var lngTop = 0;
            if (screen.width > lngMaxWidth) {
                lngWidth = lngMaxWidth;
                lngLeft = Math.round((screen.width / 2) - lngMaxWidth / 2);
            }
            else {
                lngWidth = screen.width - 8;
            }
            if (screen.height > lngMaxHeight) {
                lngHeight = lngMaxHeight;
                lngTop = Math.round(((screen.height - 60) / 2) - lngMaxHeight / 2);
            }
            else {
                lngHeight = screen.height - 60;
            }
            features = "top=" + lngTop + ",left=" + lngLeft + ",width=" + lngWidth + ",height=" + lngHeight;
        }
        else {
            features = "fullscreen=1";
        }
    }
    else {
        sw = window.screen.availWidth - 2 * SM_CYFRAME; 			// screen width
        sh = window.screen.availHeight - 2 * SM_CYFRAME - SM_CYCAPTION; // screen height
        features = "top=0,left=0,width=" + sw + ",height=" + sh;
    }
    return features;
}
/* toctreedata.js */
/// <reference path="jquery.d.ts" />
/// <reference path="xmlloader.js" />
/// <reference path="query.js" />

/*
interface TreeDataNode {
t: string;
y: string;
g: string;
o: number;
r: Array<number>;
}

interface TreeData {
data: { [ordinal: string]: Array<TreeDataNode> };
indexer: Array<{ block: number; min: number; max: number }>;
root: string;
rootNode: TreeDataNode;
}
*/

// json outline tree data acccess layer
var upk_tocTreeData = (function () {

    var treeData /*: TreeData*/;
    var callbacksByBlockId /*: { [id: number]: Array<() => void> }*/ = {};
    var loadedByBlockId /*: { [id: number] : boolean}*/ = {};
    var dataPath /*: string*/ = "";
    var _cindex = 0;
    var _seeAlsoMap = null;

    function setDataPath(path /*:string*/) {
        dataPath = path;
    }

    function getRootNode() {
        if (!treeData.rootNode) {
            treeData.rootNode = { t: null, y: "S", g: treeData.root, o: 1, r: null };
        }
        return treeData.rootNode;
    }

    function loadByBlockId(id /*: number*/, done /*: () => void*/) {
        if (id in callbacksByBlockId) {
            callbacksByBlockId[id].push(done);
        } else {
            callbacksByBlockId[id] = [done];
            LoadXMLDoc(dataPath + "toc/" + id + ".json.js", function (xhr /*: XMLHttpRequest*/) {
                var node = $.parseJSON(xhr.responseText);
                if (node.seealsoroots == undefined)
                    node.seealsoroots = new Array();
                if (id == 1) {
                    treeData = node;
                } else {
                    for (var key in node.data) {
                        treeData.data[key] = node.data[key];
                    }
                }
                loadedByBlockId[id] = true;
                for (var i = 0; i < callbacksByBlockId[id].length; i++) {
                    callbacksByBlockId[id][i]();
                }
                delete callbacksByBlockId[id];
            }, null, null, true);
        }
    }

    function getByOrdinal(id /*: number*/, result /*: (id: number, children: Array<TreeDataNode>) => void*/) {

        var ids = id.toString();
        var blockIndex = 0;

        function load() {
            if (ids in treeData.data) {
                result(id, treeData.data[ids]);
            } else if (searchInSeealso() == false) {
                while (treeData.indexer[blockIndex].block in loadedByBlockId || treeData.indexer[blockIndex].min > id || treeData.indexer[blockIndex].max < id)
                    blockIndex++;
                loadByBlockId(treeData.indexer[blockIndex].block, load);
            }
        }

        function searchInSeealso() {
            if (_cindex == 0)
                return false;
            treeData.seealsoroots.sort(function (a, b) {
                return (parseInt(a) - parseInt(b));
            });
            for (var i = 0; i < treeData.seealsoroots.length; i++) {
                var found = new Array();
                var block = 0;
                var k = treeData.seealsoroots[i];
                for (var j = 0; j < treeData.data[k].length; j++) {
                    var o = treeData.data[k][j];
                    if (_cindex >= o.r[0] && _cindex <= o.r[1]) {
                        found.unshift(o);
                        block = k;
                        break;
                    }
                }
                if (block != 0) {
                    var l = true;
                    while (l == true) {
                        searchOrder(block, function (b, p) {
                            if (b) {
                                found.unshift(p);
                                block = b;
                            }
                            else {
                                result(0, found);
                                l = false;
                            }
                        });
                    }
                    return true;
                }
            }
            return false;

            function searchOrder(kk, result) {
                createSeeAlsoMap();
                if (_seeAlsoMap[kk]) {
                    result(_seeAlsoMap[kk].block, _seeAlsoMap[kk].obj);
                    return;
                }
                result(null, null);
            }
        }

        if (treeData)
            load();
        else
            loadByBlockId(1, load);
    }

    function getByCIndex(cindex /*: number*/, result /*: (path: Array<TreeDataNode>, name: string, type: string, relcindex: number) => void*/, seealso) {

        var path /*: Array<TreeDataNode>*/ = null;
        _cindex = (seealso == true ? cindex : 0);

        function traverse(id /*: number*/, children /*: Array<TreeDataNode>*/) {
            if (path == null)
                path = [getRootNode()];
            if (id == 0) {
                var c = children[children.length - 1];
                result(children, c.t, c.y, cindex - c.r[0]);
                return;
            }
            for (var i = children.length - 1; i >= 0; i--) {
                c = children[i];
                if (c.r[0] <= cindex) {
                    path.push(c);
                    if (cindex <= c.r[1]) {
                        result(path, c.t, c.y, cindex - c.r[0]);
                    } else {
                        getByOrdinal(c.o, traverse);
                    }
                    break;
                }
            }
        }

        getByOrdinal(1, traverse);
    }

    function getPathByOrdinal(ordinal /*: number*/, result /*: (path: Array<TreeDataNode>, name: string, type: string: number) => void*/) {

        var path /*: Array<TreeDataNode>*/ = null;

        function traverse(id /*: number*/, children /*: Array<TreeDataNode>*/) {
            if (path == null)
                path = [getRootNode()];
            for (var i = children.length - 1; i >= 0; i--) {
                var c = children[i];
                if (c.o <= ordinal) {
                    path.push(c);
                    if (ordinal == c.o) {
                        result(path, c.t, c.y);
                    } else {
                        getByOrdinal(c.o, traverse);
                    }
                    break;
                }
            }
        }

        getByOrdinal(1, traverse);
    }

    function getByGuid(guid /*: string*/, result /*: (path: Array<TreeDataNode>, name: string, type: string, relcindex: number) => void*/) {
        QueryProcessor.Start(QueryParser.Parse("URI", "t'" + Escape.MyEscape('"' + guid) + "'"), function (hits) {
            getByCIndex(hits[0].index, result, false);
        });
    }

    function getSeeAlsoReferences(pobj, result) {
        var resultarray = new Array();
        function traverse(id, children) {
            for (var i = 0; i < treeData.seealsoroots.length; i++) {
                var k = treeData.seealsoroots[i];
                for (var j = 0; j < treeData.data[k].length; j++) {
                    var o = treeData.data[k][j];
                    if (o.g == pobj.g) {
                        resultarray.push(o);
                    }
                }
            }
            result(resultarray);
        }

        getByOrdinal(1, traverse);
    }

    function createSeeAlsoMap() {
        function traverse(id, children) {
            _seeAlsoMap = new Array();
            for (var i = 0; i < treeData.seealsoroots.length; i++) {
                var k = treeData.seealsoroots[i];
                for (var j = 0; j < treeData.data[k].length; j++) {
                    var o = treeData.data[k][j];
                    _seeAlsoMap[o.o] = { block: k, obj: o };
                }
            }
        }

        if (_seeAlsoMap == null) {
            getByOrdinal(1, traverse);
        }
    }

    // public
    return {
        getByOrdinal: getByOrdinal,
        getByCIndex: getByCIndex,
        getByGuid: getByGuid,
        getPathByOrdinal: getPathByOrdinal,
        getSeeAlsoReferences: getSeeAlsoReferences,
        setDataPath: setDataPath
    };
})();
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

/* iashelper.js */
window.ias=function(j){function o(a){var b={};if(a!=c)for(var k in a){var i=a[k];if(i!=c)b[k]=i}return b}function s(a){e=o(a);f.push(e);g=c}function t(a,b){if(b!=c)m[a]=b;else delete m[a];l=c}function w(a,b){return encodeURIComponent(a)+"="+encodeURIComponent(b)}function x(a,b){return encodeURIComponent(a)+(b==""?"":"="+encodeURIComponent(b))}function u(a,b){var k=b?x:w,i=[],n;for(n in a){var h=a[n];if(h&&h.push&&h.sort)for(var p=0;p<h.length;++p)i.push(k(n,h[p]));else h!=c&&i.push(k(n,h))}return i.join(";")}
var c=null,v=c,g=c,e={},f=[e],m={},l=c,q=[],r=[],d=window.ias||{};d.SetNamespace=function(a){v=a};d.SetContext=function(a){e=o(a);f[f.length-1]=e;g=c};d.SetContextPart=function(a,b){if(b!=c)e[a]=b;else delete e[a];g=c};d.ResetContext=function(a){f=[];s(a)};d.SetTag=t;d.SetTags=function(a){for(var b in a)t(b,a[b])};d.ResetTags=function(a){m=o(a);l=c};d.PushContext=s;d.PopContext=function(){f.pop();f.length||f.push({});e=f[f.length-1];g=c};d.AddDiscoveryCddUrl=function(a){q.push(a)};d.AddApplicableCddUrl=
function(a){r.push(a)};j.UPK_GetNamespace=function(){return v};j.UPK_GetContext=function(){if(g==c)g=u(e);return g};j.UPK_GetTags=function(){if(l==c)l=u(m,true);return l};j.UPK_GetDiscoveryCddUrls=function(){return q.length?q:c};j.UPK_GetApplicableCddUrls=function(){return r.length?r:c};return d}(window);ias.SetTag("upk-trait-nohelp","");

/* index.js */
/*--
Copyright � 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// index.html functions

var navigation_mode = "smart";
var browser_buttons = false;

var newWindow = true;

var dim_w = 800;
var dim_h = 600;

function ShowToc() {
    if (!upk.browserInfo.isSupportedBrowser())
        return;
    if (window.location.hostname == "" && upk.browserInfo.isiOS() == false)
        return;
    var params = document.location.hash.substring(1);
    if (params.length == 0)
        params = document.location.search.substring(1);
    var toclink = "./" + targetPath + "/toc.html";
    if (params.length > 0)
        toclink += "?" + params;

    if (!newWindow) {
        this.location.href = toclink;
        return true;
    }

    var c = new Cookie(document, "OnDemandToc", 365);
    c.Load();

    var HPercent = .80;
    var WPercent = .81;
    var MaxH = 750;
    var MaxW = 880;
    var MinW = 770;
    var AW = screen.availWidth;
    var AH = screen.availHeight;

    var X;
    var Y;
    var W;
    var H;
    if (c.TocWidth) {
        X = Number(c.TocLeft);
        Y = Number(c.TocTop);
        W = Number(c.TocWidth);
        H = Number(c.TocHeight);
    }
    else {
        W = AW * WPercent;
        H = AH * HPercent;
        if (W > MaxW)
            W = MaxW;
        if (W < MinW)
            W = MinW;
        if (H > MaxH)
            H = MaxH;
        X = Math.floor((AW - W) / 2);
        Y = Math.floor((AH - H) / 2);
    }
    if (X < 0)
        X = 0;
    if (Y < 0)
        Y = 0;
    if (X + W > AW - 12) {
        if (W > AW - 12) {
            X = 0;
            W = AW - 12;
        }
        else {
            X = AW - 12 - W;
        }
    }
    if (Y + H > AH - 36) {
        if (H > AH - 36) {
            Y = 0;
            H = AH - 36;
        }
        else {
            Y = AH - 36 - H;
        }
    }

    var features = "channelmode=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,toolbar=no,";
    if (browser_buttons == true) {
        features = "channelmode=no,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes,";
    }
    var win = window.open(toclink, "toc", features + "left=" + X + ",top=" + Y + ",width=" + W + ",height=" + H);
    return (win != null);
}

function Parse_index() {

    for (var i = 0; i < strArgs.length; i++) {
        strArg = strArgs[i].toLowerCase();
        if (strArg.substr(0, 8) == "buttons=") {
            s = strArg.substr(8, 1);
            browser_buttons = (s == "y");
        }
        if (strArg.substr(0, 6) == "index=") {
            s = strArg.substr(6, 1);
            if (s == "b")
                navigation_mode = "back";
            if (s == "c")
                navigation_mode = "close";
            if (s == "s")
                navigation_mode = "self";
            if (s == "r")
                navigation_mode = "smart";
        }
    }

    if (navigation_mode == "smart")	// browser dependent default settings
    {
        navigation_mode = "self";
        browser_buttons = true;
    }

    newWindow = (navigation_mode != "self");
}

function Back() {
    var h = (upk.browserInfo.isExplorer() ? 1 : 2);
    if (history.length > h) {
        setTimeout("history.back();", 10);
        return;
    }
    else
        Close();
}

function Close() {
    window.open("", "_self");
    opener = null;
    window.close();
}

function Init_index() {
    Parse_index();
    if (ShowToc()) {
        switch (navigation_mode) {
            case "back":
                Back();
                break;
            case "close":
                Close();
                break;
            default:
                break;
        }
    }
}

// dhtml_kp functions

var map_loaded = false;

var nameMap = new Array();
var _printitName = "";
var urlParams = "";

function NameObj(name, guid) {
    this.name = name;
    this.guid = guid;
}

function PrObj(guid, filename) {
    this.guid = guid;
    this.filename = filename;
}

function Name(name, guid) {
    nameMap[nameMap.length] = new NameObj(name, guid);
}

function A(guid, name) {
    Name(name, guid);
}

function GetGuidForName(name) {
    for (var i = 0; i < nameMap.length; i++) {
        if (nameMap[i].name == name)
            return nameMap[i].guid;
    }
    return "";
}

function GetFilenameForGuid(guid) {
    var s = targetPath + "/tpc/" + guid + "/descriptor.xml";
    LoadXMLDoc(s, Returned);
}

function GetIndexForGuid(guid) {
    upk_tocTreeData.setDataPath(targetPath + "/");
    datasourceroot = targetPath + "/" + datasourceroot;
    upk_tocTreeData.getByGuid(guid, function (path) {
        var a_index = path[path.length - 1].o;
        this.location.replace("./" + targetPath + "/toc.html?treeindex=" + a_index + "&" + urlParams);
    });
}

function Returned(req) {
    var playmodes = "";
    var printitName = "";
    nodes = req.responseXML.getElementsByTagName("PlayModes");
    if (nodes.length > 0) {
        n = nodes[0];
        if (n.textContent != null)
            playmodes = n.textContent;
        else if (n.text != null)
            playmodes = n.text;
        else if (n.firstChild.data != null)
            playmodes = n.firstChild.data;
    }
    nodes = req.responseXML.getElementsByTagName("PrintItName");
    if (nodes.length > 0) {
        n = nodes[0];
        if (n.textContent != null)
            printitName = n.textContent;
        else if (n.text != null)
            printitName = n.text;
        else if (n.firstChild.data != null)
            printitName = n.firstChild.data;
    }
    if (playmodes.indexOf('P') >= 0) {
        _printitName = printitName;
    }
    Load2();
}

var targetPath = "data";

function Init_dhtml() {
    document.title = R_KP_title;
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = targetPath + "/topicmap.js";
    document.body.appendChild(script);
    setTimeout("LoadFirst();", 100);
}

var infoWindow = "none";
var kp_param_kpnextpage = "";
var kpfeedbk = "";
var kp_param_kpfeedbk = "";
var strAfter = "";
var playerwindow;
var IntervalID;
var guid = "";
var conceptonly = false;
var bypassToc = null;

function LoadFirst() {
    setTimeout('Load()', 100);
}

function LoadLast() {
}

function Close() {
    window.open("", "_self");
    opener = null;
    window.close();
}

function PlayerExit(close) {
    if (close) {
        setTimeout(strAfter, 1);
        return;
    }
    if (playerwindow) {
        if (playerwindow.closed) {
            clearInterval(IntervalID);
            setTimeout(strAfter, 1);
        }
    } else {
        clearInterval(IntervalID);
        setTimeout(strAfter, 1);
    }
}

var strMode = "";
var strListFile = "";
var strExtraOptions = "";
var strFrame = "";
var strWindowed = false;
var strOwner = "";

function Load() {
    try {
        if (strListPath == undefined)
            strListPath = "./" + targetPath + "/tpc/";
    }
    catch (e) {
        strListPath = "./" + targetPath + "/tpc/";
    }

    try {
        eval("LoadMap()");
    }
    catch (e) {
        setTimeout("Load();", 100);
        return;
    }

    // Call parameters can be seperated from the URL by either a "?"
    // or a "#" character...
    urlParams = document.location.hash.substring(1);
    if (urlParams == "")
        urlParams = document.location.search.substring(1);
    for (var i = 0; i < strArgs.length; i++) {
        strArg = strArgs[i];
        if (strArg.substr(0, 5).toLowerCase() == "mode=") {
            strMode = strArg.substr(5, 1);
        }
        else if (strArg.substr(0, 5).toLowerCase() == "guid=") {
            guid = strArg.substring(5);
            strListFile = guid;
        }
        else if (strArg.substr(0, 5).toLowerCase() == "name=") {
            name = decodeURI(strArg.substring(5));
            guid = GetGuidForName(name);
            strListFile = guid;
        }
        else if (strArg.substr(0, 11).toLowerCase() == "kpnextpage=") {
            kp_param_kpnextpage = strArg.substr(11);
        }
        else if (strArg.substr(0, 9).toLowerCase() == "kpfeedbk=") {
            kp_param_kpfeedbk = strArg.substr(9);
        }
        else if (strArg.substr(0, 4).toLowerCase() == "back" && strArg.substr(0, 5).toLowerCase() != "back2") {
            strAfter = "history.back()";
        }
        else if (strArg.substr(0, 5).toLowerCase() == "back2") {
            strAfter = "history.go(-2)";
        }
        else if (strArg.substr(0, 5).toLowerCase() == "close") {
            strAfter = "Close()";
        }
        else if (strArg.substr(0, 6).toLowerCase() == "frame=") {
            strFrame = strArg.substr(6);
            if (strFrame != "")
                strFrame = "&Frame=F" + strFrame;
        }
        else if (strArg.substr(0, 8).toLowerCase() == "windowed") {
            strWindowed = true;
        }
        else if (strArg.substr(0, 6).toLowerCase() == "owner=") {
            strOwner = strArg.substr(6);
        }
        else if (strArg.substr(0, 11).toLowerCase() == "conceptonly") {
            conceptonly = true;
        }
        else if (strArg.substr(0, 10).toLowerCase() == "bypasstoc=") {
            var s = strArg.substr(10);
            bypassToc = (s == 'y' ? true : false);
        }
    }

    strAfter = "LoadLast();" + strAfter;

    if (strListFile == "") {
        LoadLast();
        alert(R_KP_invalid_arguments);
        return;
    }

    if (strMode == "") {
        if (bypassToc == undefined || bypassToc == true) {
            var params = "?dhtml";
            if (strFrame.length > 0)
                params += "&" + strFrame;
            if (strOwner.length > 0)
                params += "&owner=" + strOwner;
            if (conceptonly == true)
                params += "&conceptonly";
            this.location.replace(strListPath + strListFile + "/lmstart.html" + params + "&" + urlParams);
        }
        else {
            GetIndexForGuid(guid);
        }
    }
    else if (strMode == "A") {
        Load2();
    }
    else {
        GetFilenameForGuid(guid);
    }
}

function Load2() {

    if (playerwindow) {
        if (!playerwindow.closed) {
            alert(R_toc_doit_err);
            return;
        }
    }

    if (strMode == "P") {
        if (_printitName.length > 0) {
            playerwindow = window.open(strListPath + strListFile + "/lmstart.html?dhtml&mode=P");
        }
    }
    else if (strMode == "D" || strMode == "E") {
        var params = "directlaunch&mode=D";
        if (strFrame.length > 0)
            params += strFrame;
        if (_printitName.length > 0)
            params += "&printitname=" + _printitName;
        if (strMode === "E")
            params += "&testit";
        LaunchDoIt(strListPath + strListFile + "/", params);
    }
    else if (strMode == "A") {
        playerwindow = window.open(strListPath + strListFile + "/topic.html");
    }
    else {
        var params = "?directlaunch&mode=" + strMode;
        if (strFrame.length > 0)
            params += strFrame;
        if (_printitName.length > 0)
            params += "&printitname=" + _printitName;
        if (kp_param_kpnextpage.length > 0)
            params += "&kpnextpage=" + kp_param_kpnextpage;
        if (kp_param_kpfeedbk.length > 0)
            params += "&kpfeedbk=" + kp_param_kpfeedbk;

        var features = "resizable=1,toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0";
        if (IsTouchDevice()) {
            strAfter = "";
            LaunchTopic(strListPath + strListFile + "/topic.html" + params);
        }
        else {
            var l = 0;
            var t = 0;
            var w = screen.width;
            var h = screen.height;
            var seeItPlaybackSize = PlayerConfig.SeeItPlayBackSize;
            if (strMode == "S") {
                if (PlayerConfig.LaunchNewPlayerWindow == false) {
                    window.location.href = strListPath + strListFile + "/topic.html" + params;
                    return;
                }
                var c = new Cookie(document, "OnDemandSeeItSizes", 365, "/");
                c.Load();
                if (c.SeeItHeight) {
                    l = Number(c.SeeItLeft);
                    t = Number(c.SeeItTop);
                    w = Number(c.SeeItWidth);
                    h = Number(c.SeeItHeight);
                }
                else {
                    switch (seeItPlaybackSize.toLowerCase()) {
                        case "fullsize":
                            break;
                        case "halfsize":
                            w = Math.round(screen.width / 2);
                            h = Math.round(screen.height / 2);
                            break;
                        default:
                            var a = seeItPlaybackSize.split('x');
                            if (a.length == 1)
                                break;
                            if (isNaN(parseInt(a[0])))
                                break;
                            if (isNaN(parseInt(a[1])))
                                break;
                            w = parseInt(a[0]);
                            h = parseInt(a[1]);
                            break;
                    }
                    l = Math.round((screen.width - w) / 2);
                    t = Math.round((screen.height - h) / 2);
                }
            }
            if (w > screen.width) {
                w = screen.width;
                l = 0;
            }
            if (h > screen.height) {
                h = screen.height;
                t = 0;
            }
            playerwindow = window.open(strListPath + strListFile + "/topic.html" + params, "", features + ",left=" + l + ",top=" + t + ",width=" + w + ",height=" + h);
        }
    }
    if ((strAfter != "" && playerwindow) || (doItplayerWindow && doItplayerWindow.closed == false))
        IntervalID = setInterval("PlayerExit(true)", 125);
}

function LaunchTopic(s) {
    this.location.replace(s);
    setTimeout("LaunchTopic('" + s + "')", 1000);
}


// common: Init and playbutton

var strArgs;
var dhtml_mode = false;

function SetTargetPath() {
    strArgs = document.location.hash.substring(1).split("&");
    if (strArgs.length == 0 || strArgs[0] == "")
        strArgs = document.location.search.substring(1).split("&");

    if (strArgs.length == 1) {
        if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
            var s = Escape.SafeUriUnEscape(strArgs[0].substr(3));
            strArgs = s.split("&");
        }
    }

    for (var i = 0; i < strArgs.length; i++) {
        strArg = strArgs[i].toLowerCase();
        if (strArg.substr(0, 5) == "path=") {
            targetPath = strArg.substr(5);
        }
    }
}

function Init() {
    SetTargetPath();
    var d = document.getElementById("getdimension");
    dim_w = d.clientWidth;
    dim_h = d.clientHeight;
    d.style.display = "none";
    if (window.location.hostname == "" && upk.browserInfo.isiOS() == false)
        return;
    strArgs = document.location.hash.substring(1).split("&");
    if (strArgs.length == 0 || strArgs[0] == "")
        strArgs = document.location.search.substring(1).split("&");

    if (strArgs.length == 1) {
        if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
            var s = Escape.SafeUriUnEscape(strArgs[0].substr(3));
            strArgs = s.split("&");
        }
    }

    for (var i = 0; i < strArgs.length; i++) {
        strArg = strArgs[i].toLowerCase();
        if (strArg.substr(0, 5) == "guid=") {
            dhtml_mode = true;
        }
        if (strArg.substr(0, 5) == "name=") {
            dhtml_mode = true;
        }
    }
    if (dhtml_mode == true) {
        Init_dhtml()
    }
    else {
        Init_index();
    }
}

function OnPlayButton() {
    if (dhtml_mode == true) {
        Load2();
    }
    else {
        ShowToc();
    }
}