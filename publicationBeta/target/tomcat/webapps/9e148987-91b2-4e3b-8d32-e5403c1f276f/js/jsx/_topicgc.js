
/* common.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// Common functions between toc and lms

function filterHTML(s) {
    s = replaceString("&", "&amp;", s);
    s = replaceString("<", "&lt;", s);
    s = replaceString(">", "&gt;", s);
    return s;
}

function replaceString(oldString, newString, fullS) {
    if (fullS == null) return;
    var cReg = new RegExp(oldString, "g");
    var nString = fullS.replace(cReg, newString);
    return nString;
}

function PtToPx(pt, dpi) {
    return Math.floor((pt * dpi) / 72);
}

function PxToPt(px, dpi) {
    return (px / dpi) * 72;
}

function Bool(s) {
    if (typeof (s) == "boolean")
        return s;
    if (typeof (s) == "string") {
        if (s.toLowerCase() == "false")
            return false;
        if (s.toLowerCase() == "true")
            return true;
    }
    return null;
}

/*****************************************************************************/

function getDPICookie() {
    var cookie = new Cookie(document, "UPKDpiDailyWarning", "today", "/", null, false);
    cookie.Load();
    if (cookie.DPIdailyWarning == 1) {
        return true;
    }
    cookie.DPIdailyWarning = 1;
    cookie.Store();
    return false;
}

/*****************************************************************************/

var KeepAlive_url_ping = null;
var KeepAlive_url_closeserver = null;
var KeepAlive_finished = false;
var KeepAlive_timer = null;

function KeepAlive_Init(path) {
    if (KeepAlive_url_ping != null)
        return;
    KeepAlive_url_ping = path + "xml/ping.xml";
    KeepAlive_url_closeserver = path + "closeserver.xml";
    KeepAlive_finished = false;
    KeepAlive_timer = setInterval("KeepAlive_Ping()", 2000);
}

function KeepAlive_DoNotSendClose() {
    KeepAlive_finished = true;
}

function KeepAlive_Close() {
    if (KeepAlive_url_ping == null)
        return;
    if (KeepAlive_finished == true)
        return;
    KeepAlive_Track("close...");
    KeepAlive_finished = true;
    clearTimeout(KeepAlive_timer);
    LoadXMLDoc(KeepAlive_url_closeserver, KeepAlive_Return_OK, KeepAlive_Return_OK, "PING", true);
}

function KeepAlive_Ping() {
    KeepAlive_Track("ping...");
    if (KeepAlive_finished == true)
        return;
    LoadXMLDoc(KeepAlive_url_ping, KeepAlive_Return_OK, KeepAlive_Return_Error, "PING", false);
}

function KeepAlive_Return_OK(x) {
    KeepAlive_Track("ping returned");
    // nothing to do
}

function KeepAlive_Return_Error(x) {
    KeepAlive_Track("error returned");
    if (KeepAlive_finished == true)
        return;
    KeepAlive_finished = true;
    clearInterval(KeepAlive_timer);
    alert(R_playexe_comm_error);
}

var _KeepAlive_window = null;
var _KeepAlive_track = false;

function KeepAlive_Track(s) {
    if (_KeepAlive_track == false)
        return;
    if (_KeepAlive_window == null)
        _KeepAlive_window = window.open();
    _KeepAlive_window.document.writeln(s + "<br/>");
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

/* swfobject.js */
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){try{var ab=Z.GetVariable("$version");}catch(er){}if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
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

/* dialog.js */
/*
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
*/

var dlg_parent;
var dialogh_ref;
var device_dpi;
var dialog2_html;
var modal_dialog;
var dlg_width;
var dlg_height;
var dlg_autosizeheight = false;
var callback_end = "";
var isopened = false;
var dlg_context = "";
var grayPosition;
var overflowValue = "";
var resizefn = "";

function setParent(parentDialog) {
    dlg_parent = parentDialog;
}

function Click1() {
    closeDialog();
    $("#graydiv").remove();
}

function getDPI() {
    return device_dpi;
}

function setWidth(dlg, width) {
    $(dlg).css("width", width);
}

function setHeight(dlg, height) {
    $(dlg).css("height", height);
}

function setPadding(content, padding, classvalue) {
    var s = "<div style='padding:" + padding + "px'";
    if (classvalue && classvalue != "")
        s += " class='" + classvalue + "'";
    s += ">" + content + "</div>";
    return s;
}

function getContentSize(html) {
    var size = { width: 0, height: 0 };
    var o = $("<div style='display:visible;position:absolute;top:0px;left:0px;' id='04A98DB973UPK'>" + html + "</div>");
    $('body').append(o);
    size.width = $("#04A98DB973UPK").outerWidth(true);
    size.height = $("#04A98DB973UPK").outerHeight(true);
    $("#04A98DB973UPK").remove();
    return size;
}

function showDialog3(html, xpos, ypos, width, height, modal, dpi, noborder, outcontent) {

    showDialog2(html, xpos, ypos, width, height, modal, dpi, noborder);
    outcontent = "<div id='04A98DB974UPK'>" + outcontent + "</div>";
    $('body').append(outcontent);
}

function showDialog2(html, xpos, ypos, width, height, modal, dpi, noborder) {
    if (height == -1) {
        dlg_autosizeheight = true;
    }
    else dlg_autosizeheight = false;
    dialog2_html = html;
    showDialog("", xpos, ypos, width, height, modal, dpi, "", noborder);
}

(function ($) {
    $.fn.drags = function (opt) {
        opt = $.extend({
            handle: "",
            cursor: "move"
        }, opt);

        var $ehandler = $('<div>', {
            id: 'ehandler',
            css: {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'right': 0,
                'bottom': 0,
                'display': 'none',
                'cursor': opt.cursor,
                'z-index': 999,
                'background-color': 'red',
                'opacity': '0',
                'filter': 'alpha(opacity=0)'
            }
        }).appendTo(document.body)

        return this.addClass('draggable').each(function () {
            $drag = $(this);
            var $el = opt.handle === "" ? $drag : $drag.find(opt.handle);
            $el.addClass('active-handle')
                .on("mousedown", function (e) {
                    if (!$(e.target).is($(this))) {
                        return;
                    }
                    $drag.css('cursor', opt.cursor);
                    e.preventDefault();
                    var z_idx = $drag.css('z-index'),
                        drg_h = $drag.outerHeight(),
                        drg_w = $drag.outerWidth(),
                        pos_y = $drag.offset().top + drg_h - e.pageY,
                        pos_x = $drag.offset().left + drg_w - e.pageX;
                    $ehandler.show().on("mousemove", function (e) {
                        e.preventDefault();
                        y = e.pageY + pos_y - drg_h;
                        x = e.pageX + pos_x - drg_w;
                        if (y < 0) y = 0;
                        if (x < 0) x = 0;
                        if (window.innerWidth > $drag.outerWidth())
                            if (x > (window.innerWidth - $drag.outerWidth())) x = (window.innerWidth - $drag.outerWidth());
                        if (window.innerHeight > $drag.outerHeight())
                            if (y > (window.innerHeight - $drag.outerHeight())) y = (window.innerHeight - $drag.outerHeight());
                        $('.draggable').offset({
                            top: y,
                            left: x
                        })
                    }).add(document).on("mouseup", function (e) {
                        $drag.css('cursor', 'default');
                        e.preventDefault();
                        $(this).off("mousemove mouseup")
                        $ehandler.hide();
                    })
                })
        })
    }
})(jQuery);

function showDialog(href, xpos, ypos, width, height, modal, dpi, dialog1_path, noborder) {
    isopened = true;
    dpi = 96;
    if (xpos != -1) xpos = PtToPx(xpos, dpi);
    if (ypos != -1) ypos = PtToPx(ypos, dpi);
    width = PtToPx(width, dpi);
    height = PtToPx(height, dpi);

    dlg_width = width;
    dlg_height = height;
    device_dpi = dpi;
    dialogh_ref = href;
    modal_dialog = modal;

    var wpx, hpx;
    wpx = width;
    hpx = height;

    var centerx, centery, mainref;
    var scrollx = $(document.body).scrollLeft();
    var scrolly = $(document.body).scrollTop();

    if ((scrollx == 0 && scrolly == 0) && upk.browserInfo.isiOS()) {
        scrollx = parent.window.pageXOffset;
        scrolly = parent.window.pageYOffset;
    }

    if (xpos == -1 || ypos == -1) {
        // if the browser is IE then we can use pixel positioning
        var w = 0, h = 0;
        if (window.innerWidth) {
            if (upk.browserInfo.isiOS()) {
                w = parent.window.innerWidth;
                h = parent.window.innerHeight;
            }

            else {
                w = window.innerWidth;
                h = window.innerHeight;
            }
        }
        else if (document.documentElement) {
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight;
        }
        centerx = Math.floor(w / 2 - (wpx / 2) + scrollx);
        centery = Math.floor(h / 2 - (hpx / 2) + scrolly);
    }
    else {
        //do we need scroll adjustment here too???
        centerx = xpos;
        centery = ypos;
    }
    if (noborder)
        mainref = dialogh_ref;

    if (document.body.scrollHeight < hpx) centery = 0;

    // 18373699 PREFS DIALOG IS OUT OF SCREEN FOR HIGH CONCEPTS IN KCENTER KNOWLEDGE PATH ON IOS 
    if (typeof lmsMode !== "undefined")
        if (lmsMode && lmsMode == "LMS" && upk.browserInfo.isiOS()) centery = 20;

    var pos = "top:0;left:0;";
    if (upk.browserInfo.isIEQuirks()) {
        grayPosition = "absolute";
        pos = "top:" + scrolly + "px;left:" + scrollx + "px;";
        overflowValue = $(document.body).css("overflow"); // check overflow
        if (overflowValue === "auto") {
            $(document.body).css("overflow", "hidden"); // removes overflow:auto
        }
        document.body.scroll = "no"; // removes scroll on html
        resizefn = window.onresize;
        window.onresize = "";
    }
    else {
        grayPosition = "fixed";
    }

    if (modal) {
        $(document.body).append('<div id="graydiv" scrolling="no" class="pointerdiv" style="position:' + grayPosition + ';display:none;z-index: 99;' + pos + 'bottom:0;right:0;"></div>');
    }
    else {
        $(document.body).append('<div id="graydiv" scrolling="no" class="pointerdiv2" style="position:' + grayPosition + ';display:none;z-index: 99;' + pos + 'bottom:0;right:0;" onclick="Click1();"></div>');
    }
    // we have to prevent the preview window in doit/testit to remain scrollable while our dialog is displayed
    $("#graydiv").on("touchmove", function (e) {
        return false;
    });
    // this prevents inputs to get focus while our dialog is displayed
    // I don't understand why inputs can have focus since graydiv is on top of them
    $("input").on("focus", function () { this.blur(); });
    $("#graydiv").show();
    style = 'left:' + centerx + 'px; top:' + centery + 'px; width: ' + wpx + 'px; height: ' + hpx + 'px;';


    wwpx = wpx - 60; //-2*margin
    hhpx = hpx - 60; //-2*margin

    // Internet Explorer box model bug(IE9)
    // more info:
    // http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug
    if ((upk.browserInfo.isIEQuirks() && upk.browserInfo.isIE9()) || (upk.browserInfo.isIEQuirks() && upk.browserInfo.isIE8())) {
        wwpx -= 20; //-2*border
        hhpx -= 20; //-2*border
    }

    innerstyle = 'width: ' + wwpx + 'px; height: ' + hhpx + 'px;';

    var mode = "iossafefordesktop";
    if (IsTouchDevice())
        mode = "iossafe";
    var emptyImage = "../img/empty.gif";
    if (dialog1_path) emptyImage = dialog1_path + "img/empty.gif";

    if (modal) {
        $(document.body).append('<div class="desktopDialog" id="dialog" style="' + style + '"><div id="closebtn" onclick="Click1();"><img id="closeimg" class="close_qualifier" src="' + emptyImage + '" alt="" width="16" /></div>' +
            '<div class="' + mode + '" style="' + innerstyle + '"><iframe id="dialogBody" frameborder="0" scrolling="yes" src="' + href + '" style="width: 100%; height: 100%;margin:0px; padding:0px; position: absolute;top: 0px; left: 0px; background-color: white;"></iframe></div></div>');
        $('#dialog').drags();
        // we have to prevent the preview window in doit/testit to remain scrollable while our dialog is displayed
        $("#dialog").on("touchmove", function (e) {
            return false;
        });
    }
    else {
        innerstyle = 'width: ' + wpx + 'px; height: ' + hpx + 'px;';
        mainref = "../html/dialog2.html";
        $(document.body).append('<div class="noborderDialog" id="dialog" style="' + style + '">' +
        '<div id="dialogBodyDiv" class="noBorderDialogDesktop" style="' + innerstyle + '"><iframe id="dialogBody" frameborder="0" scrolling="no" src="' + mainref + '" style="width: 100%; height: 100%;margin:0px; padding:0px; position: absolute;top: 0px; left: 0px; background-color: white;"></iframe></div></div>');
    }
    if (dlg_context != "") {
        ctxHelper.SetContext(dlg_context);
    }
}

function isOpenDialog() {
    return isopened;
}

function removeDiv(dlgName) {
    $(dlgName).remove();
}

function appendDiv(div) {
    $(document.body).append(div);
}

function closeDialog() {
    $("#04A98DB974UPK").remove();
    $("#graydiv").remove();
    $("#dialog").remove();
    $("#ehandler").remove();
    if (dlg_context != "") {
        ctxHelper.SetPrevContext();
        dlg_context = "";
    }
    if (upk.browserInfo.isIEQuirks()) {
        if (overflowValue === "auto") {
            $(document.body).css("overflow", overflowValue); // adds back overflow:auto
            overflowValue = "";
        }
        document.body.scroll = "auto"; // adds back scroll to html
        window.onresize = resizefn;
        resizefn = "";
    }
    isopened = false;
    if (dlg_parent) {
        if (callback_end) dlg_parent.eval(callback_end);
    }
    else {
        if (callback_end) eval(callback_end);
    }
    $("input").off("focus");
}

function setOnCloseEvent(functionname) {
    if (callback_end.indexOf(functionname) < 0)
        callback_end = functionname + ";" + callback_end;
}

function getOnCloseEvent() {
    return callback_end;
}

function getDialog2Content() {
    return dialog2_html;
}

function setDlgCtx(context) {
    dlg_context = context;
}

/* lmsapplet.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// the following code must exist for AICC
// Only add the java applet to the page when running a course through HACP.

var intPos = window.location.search.toLowerCase().indexOf("aicc_url");
var intPos2 = window.location.search.toLowerCase().indexOf("aicc_sid");
function getOnlyPath(s) {
    while (s.indexOf('\\') != -1)
        s = s.replace('\\', '/');
    return s.substr(0, s.lastIndexOf("/"));
}
if ((intPos>-1) && (intPos2>-1)) {
	//running in AICC mode
	if (LmsConfig.AiccAppletPath == "") {
		//using applet from package
        var currentPgPath = window.location.protocol + "//" + window.location.host + getOnlyPath(window.location.pathname);
		fullPath = currentPgPath + "/" + lms_path + "aicc";
	}
	else {
		//using applet from predeifned location
	    fullPath = LmsConfig.AiccAppletPath;
	}

	document.write("<div style='position: absolute;'><applet NAME='GetHTTPPostData' codebase='" + fullPath + "' archive='gethttppostdata.jar' code='GetHTTPPostData' width='1' height='1' MAYSCRIPT><param name='permissions' value='sandbox' /></applet></div>");
}

/* lmscomfactory.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// This function is reposible for inserting
// the KPath API into the environment if
// the asset is running under KPath and 
// no API can currently be found. 
//
// This call inserts an invisible iframe and 
// sets its source to a HTML page that will 
// contains the KPATH Scorm API adaptor when
// the page is configured to run under Kpath UT.
//
// Since invisible iframe page will load asyncronously
// we have to tie the LmsCom creation with the 
// onload of the iframe.
function InsertRuntimeAPI(loadcallback) {

    /* If we are not running with Kpath we do not have
       to insert the API so just directly call the
       load callback. */ 
    if (Kpath_launch == false) {
        setTimeout(loadcallback, 1);
        return;
    }

    /* We are running under KPath, check to see if
    the frame hosting the low level KPath
    API adaptor has been loaded somewhere.
    If so, do nothing else but directly
    call the load call back.
       
    Else we have to asynchronously load the
    API frame into the environment */
    var apiframe = findKPathAPIFrame(window);

    if (apiframe == null) {
        apiframe = document.createElement("iframe");
        apiframe.id = "KPATH_API_FRAME";
        apiframe.style.display = 'none';

        document.body.appendChild(apiframe);

        if (loadcallback) {
            if (navigator.appName == "Microsoft Internet Explorer")
                apiframe.attachEvent("onload", loadcallback);
            else
                apiframe.onload = loadcallback;

        }

        apiframe.src = Kpath_Runtime_API;
    }
    else
        setTimeout(loadcallback, 1);
}

function findKPathAPIFrame(win) {
    var apiframe = null;
    var depth = 0;
    var w = win;

    try {
        while (w != null) {
            apiframe = w.document.getElementById("KPATH_API_FRAME");
    
            if (apiframe != null)
                return apiframe.contentWindow;
    
            depth++;
            // Note: 7 is an arbitrary number, but should
            // be more than sufficient
            if (depth > 7) {
                break;
            }
    
            if (w === w.parent) break;
            w = w.parent;
        }
    
        if (win.top.opener != null)
            return findKPathAPIFrame(win.top.opener);
    } catch (e) {
        return null;
    }


    return null;
}

var _GlobalLmsComFactory = null; 

function GetLmsComFactory() {

    if (_GlobalLmsComFactory == null)
        alert(R_initializelmscom_not_called);
        
    return _GlobalLmsComFactory;
}


function CheckForLMSAPI() {
    if (_lmsMode == "LMS" &&
            !(_GlobalLmsComFactory.api_type == "scorm2004" ||
              _GlobalLmsComFactory.api_type == "scorm12" ||
              _GlobalLmsComFactory.api_type == "aicc" ||
              (_GlobalLmsComFactory.api_type == "kpath" && findKPathAPIFrame(window))
            )
        )
            alert(R_scorm_noapi);
    if (_lmsMode == "KPT" && !findKPathAPIFrame(window))
        alert(R_scorm_noapi);
}


function InitializeLmsCom() {
    _GlobalLmsComFactory = new LmsComFactory(window.location.search);
}

/* LmsComFactory uses environmental information like URL  parameters
   and runtime variables to determine which type of LmsCom object
   it should instantiated.  Note that code outside of the JS file 
   should use GetLmsCom instead since GetLmsCom has logic in it 
   that allows the parent page to provide the LmsCom object if 
   it wants to. */ 
function LmsComFactory(launcharg) {
    var fname = "LmsComFactory";

    this.api_type = "none";
    
    this.launch_arg = launcharg;
    this.aicc_url = "";
    this.aicc_sid = "";

    //maintain the api pointer if found so that lmscomscorm constructors can use it
    this.scorm_api_12 = null;
    this.scorm_api_2004 = null; 

    if (launcharg == null)
        launcharg = "";
        
    var strArgs = this.launch_arg.substring(1).split("&");

    lmslog.addEntry(0, fname, "strArgs", strArgs);
    for (var i = 0; i < strArgs.length; i++) {
        strArg = strArgs[i];

        var val;

        val = this.CheckParam(strArg, "aicc_url=");
        if (val != "") {
            // this is aicc Hacp, set flag to indicate this
            if (val.substr(0, 4).toLowerCase() != "http") {
                this.aicc_url = LmsConfig.AiccUrlProtocol + val;
            }
            else
                this.aicc_url = val;

            continue;
        } 
        
        val = this.CheckParam(strArg, "aicc_sid=");
        if (val != "") {
            this.aicc_sid = val;
            continue;
        }
    }

    //maintain the api pointer if found so that lmscomscorm constructors can use it
    if (LmsConfig.ScormVersion !== "1.2")
        this.scorm_api_2004 = this.FindScorm2004API();
    if (this.scorm_api_2004 == null && LmsConfig.ScormVersion !== "2004")
        this.scorm_api_12 = this.FindScorm12API();

    if ((this.aicc_url != "") && (this.aicc_sid != "")) {
        this.api_type = "aicc";
    }
    else if (Kpath_launch == true) {
        this.api_type = "kpath"; 
    }
    else if (this.scorm_api_2004 != null) {
        this.api_type = "scorm2004";
    }
    else if (this.scorm_api_12 != null) {
        this.api_type = "scorm12";
    }
}


/* The factory method for LmsCom. */
// LZ: LmsComKPath added
LmsComFactory.prototype.CreateLmsCom = function() {

    if (this.api_type == "aicc") {
        return new LmsComAICC(this.aicc_url, this.aicc_sid);
    }
    else if (this.api_type == "scorm2004") {
        return new LmsComScorm2004();
    }
    // If portal launch, there will be an adapter to be found and top level SCO
    // should use it rather than calling LoadRuntime.
    else if (this.api_type == "kpath") {
        var lmscom = new LmsComKPath();
        lmscom.API = this.scorm_api_2004;
        return lmscom;
    }
    else if (this.api_type == "scorm12") {
        return new LmsComScorm12();
    }

    if (PlayerConfig.EnableCookies)
        return new LmsComCookie();
    else
        return new LmsComBase(); 
}

LmsComFactory.prototype.FindScorm12API = function () {
    try {
        var theAPI = this.FindWindowScorm12API(window);
    
        if ((theAPI == null) && (top.window.opener != null) && (!top.window.opener.closed)) {
            theAPI = this.FindWindowScorm12API(top.window.opener);
        }
    
        return theAPI;
    } catch (e) {
        return null;
    }
}

LmsComFactory.prototype.FindWindowScorm12API = function(win) {
   var findAPITries = 0;
   while ((win.API == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;
      // Note: 500 is an arbitrary number, but should be more than sufficient
      if (findAPITries > 500) 
      {
        lmslog.addEntry(0, "FindScorm12API", "", R_scorm_apideep);
        return null;
      }
      
      win = win.parent;
  }
   
   return win.API;
}

LmsComFactory.prototype.FindScorm2004API = function() {
    try {
        var theAPI = this.FindWindowScorm2004API(window);

        if ((theAPI == null) && (top.window.opener != null) && (!top.window.opener.closed)) {
            theAPI = this.FindWindowScorm2004API(top.window.opener);
        }

        return theAPI;
    } catch (e) {
        return null;
    }
}

LmsComFactory.prototype.FindWindowScorm2004API = function(win) {
    var findAPITries = 0;
 
    while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;

        if (findAPITries > 500) {
            lmslog.addEntry(0, "FindScorm2004API", "", R_scorm_apideep);
            return null;
        }
        win = win.parent;
    }

    return win.API_1484_11;
}

LmsComFactory.prototype.CheckParam = function(strArg, param) {
    var len = param.length;
    var val = "";

    if (strArg.substr(0, len).toLowerCase() == param) {
        val = strArg.substring(len);
    }

    return val;
}


/* lmscom.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/* Constant for the different statuses that a coarse may have.  
These ID corresponsed to the values used by both SCORM and 
AICC. */
var LMS_PASSED = "passed";
var LMS_FAILED = "failed";
var LMS_COMPLETED = "completed";
var LMS_INCOMPLETE = "incomplete";
var LMS_NOT_ATTEMPTED = "not attempted";

/* Extend internal Date object to format for SCORM 2004 */
Date.prototype.toSCORM = function () {
	return this.getFullYear() + "-" + ("0" + (this.getMonth() + 1)).slice(-2) + "-" + ("0" + this.getDate()).slice(-2)
        + "T" + ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2) + ":" + ("0" + this.getSeconds()).slice(-2);
}

///////////////////////////////////////
//
// LmsCom object defintions
//
///////////////////////////////////////

///////////////////////////////////////
// Base LmsCom object defintion
///////////////////////////////////////
function LmsComBase(parent) {
	this.status_obj = null;
	this.ordinal_number = 0;

	this.start_date = "";
	this.end_date = "";
	this.student_id = "";
	this.student_name = "";
	this.credit = "";
	this.lesson_status = LMS_NOT_ATTEMPTED;
	this.lesson_flag = "";
	this.lesson_location = "";
	this.lesson_data = "";
	this.original_lesson_data = "";
	this.core_vendor = "";
	this.score = "";
	this.time = "";
	this.idle_time = 0;         // session idle time only computed for lmscomkpath
	this.mode_idle_time = 0;    // idle time for topic mode launch
	this.doit_child_time = 0;   // time spent in see_it/try_it launched from do_it

	this.owner = null;  // owner window of this lmscom
	this.guid = null;   // guid of associated asset

	this.session_active = false;
	this.bigsco = false;    // executing in a big sco, so asset status stored differently

	this.isTestIt = false;

	if (parent != null) {
		this.Copy(parent);
		this.ParentLmsCom = parent;
	}

	this.object_type_name = "LmsComBase";
}

LmsComBase.prototype.GetOrdinalNumber = function () {
	return this.ordinal_number;
}

LmsComBase.prototype.SetOrdinalNumber = function (ordnum) {
	this.ordinal_number = ordnum;
}

/* Copies just that invarient information.  Allows child 
pages to report on student info if they need to. */
LmsComBase.prototype.Copy = function (from) {

	this.student_id = from.student_id;
	this.student_name = from.student_name;
	this.credit = from.credit;
	this.lesson_status = from.lesson_status;
	this.bigsco = from.bigsco;
	this.lesson_data = from.lesson_data;
	this.lesson_location = from.lesson_location;
}

/* Starts a session.  For LmsComBase, all this does is
records the start time. */
LmsComBase.prototype.Begin = function () {
	this.start_date = new Date().getTime();

	if (this.session_active)
		alert(R_lmscom_already_active);

	this.session_active = true;

	return true;
}

/* Ends a session.  For LmsComBase, all this does is
records the end time. */
LmsComBase.prototype.End = function () {

	if (!this.session_active)
		alert(R_lmscom_inactive);

	this.end_date = new Date().getTime();
	this.session_active = false;

	return true;
}

/* Load the SCORM API adapter if needed and save reference to it. */
LmsComBase.prototype.LoadAPIAdapter = function (callback) {
	//setTimeout(callback,1);
	// Above timeout caused mode launches to hang on ipad. Apparently it isn't cross-tab
	// execution that is blocked, but only the timer thread in inactive tabs.
	callback();
}

/* Sends completion status to the LMS. This is factored out of LmsCom.End() so
that completion information may be sent immediately to allow the LMS to
update any visual feedback. */
LmsComBase.prototype.SendCompletionInfo = function () { }

/* Notifies parent lmscom to roll up the status of this lmscom */
LmsComBase.prototype.NotifyParent = function () {
	var parentlmscom = this.ParentLmsCom;
	if (parentlmscom && !parentlmscom.owner.closed && parentlmscom.owner.ListenChildClose)
		parentlmscom.owner.ListenChildClose();
}

LmsComBase.prototype.getReportedLessonStatus = function () {
	if (this.lesson_status === LMS_PASSED)
		return LmsConfig.ReportOnPass;
	else if (this.lesson_status === LMS_FAILED)
		return LmsConfig.ReportOnFail;
	else
		return this.lesson_status;
}
/* Internal helper method that computes elapse time in
seconds. */
LmsComBase.prototype.computeTime = function (bdate, edate) {
	var elapsedSeconds = ((edate - bdate - this.idle_time) / 1000);
	return this.convertTotalSeconds(elapsedSeconds);
}

/* Internal helper method that computes elapse time in
seconds. Discounts time spent in Do It child launchs. */
LmsComBase.prototype.computeTime2 = function (bdate, edate) {
	var elapsedSeconds = ((edate.getTime() - bdate - this.doit_child_time) / 1000);
	return "" + elapsedSeconds;
}

/* Internal helper method that converts date/time into
seconds. */
LmsComBase.prototype.convertTotalSeconds = function (ts) {
	var sec = (ts % 60);
	ts -= sec;
	var tmp = (ts % 3600);  //# of seconds in the total # of minutes
	ts -= tmp;              //# of seconds in the total # of hours
	// convert seconds to conform to CMITimespan type (e.g. SS.00)
	sec = Math.round(sec * 100) / 100;
	var strSec = new String(sec);
	var strWholeSec = strSec;
	var strFractionSec = "";
	if (strSec.indexOf(".") != -1) {
		strWholeSec = strSec.substring(0, strSec.indexOf("."));
		strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
	}
	if (strWholeSec.length < 2) {
		strWholeSec = "0" + strWholeSec;
	}
	strSec = strWholeSec;
	if ((ts % 3600) != 0)
		var hour = 0;
	else var hour = (ts / 3600);
	if ((tmp % 60) != 0)
		var min = 0;
	else var min = (tmp / 60);
	if ((new String(hour)).length < 2)
		hour = "0" + hour;
	if ((new String(min)).length < 2)
		min = "0" + min;
	var rtnVal = hour + ":" + min + ":" + strSec;
	return rtnVal;
}

// Get current bookmark. This is only needed for a TOC that is called via lmstart
// but not from an LMS. If you open a Big SCO's concept from kp.html and launch
// it, the Big SCO toc will get an lmscombase from the lmstart, but the lmstart
// page doesn't have the toc_hash, so it can't get the bookmark.
// Note that "view outline" from a normal concept does not need this. It replaces
// the lmstart page with the toc, so the toc will end up with an lmscomcookie of
// its own.
/*
LmsComBase.prototype.GetBookmark = function(toc_hash) {
if (this.ParentLmsCom)
return this.ParentLmsCom.GetBookmark(toc_hash);
return 0;
}
*/

// Support for UPK specific functionality. Delegate to parent until an lmscomkpath is found
LmsComBase.prototype.doGetUPKValue = function (name) {
	if (this.ParentLmsCom)
		return this.ParentLmsCom.doGetUPKValue(name);
	return "";
}

LmsComBase.prototype.doSetUPKValue = function (name, value) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.doSetUPKValue(name, value);
}

LmsComBase.prototype.doUPKCommit = function () {
	if (this.ParentLmsCom)
		this.ParentLmsCom.doUPKCommit();
}

/* Record an interaction completion. Only an lmscomkpath will actually do this, so
a question in the outline will delegate to its parent lmscom (from lmstart). */
LmsComBase.prototype.setInteraction = function (index, qlmscom) {
	if (this.ParentLmsCom)
		return this.ParentLmsCom.setInteraction(index, qlmscom);
}
LmsComBase.prototype.getAnsweredQuestions = function () {
	if (this.ParentLmsCom)
		return this.ParentLmsCom.getAnsweredQuestions();
	return {};
}

LmsComBase.prototype.setObjective = function (index, objective) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.setObjective(index, objective);
}

// sequencing at end of pre/post assessment
LmsComBase.prototype.requestContinue = function () {
	if (this.ParentLmsCom)
		this.ParentLmsCom.requestContinue();
}

/* Indicate if LMS connection is live */
LmsComBase.prototype.IsConnected = function () {
	if (this.ParentLmsCom)
		return this.ParentLmsCom.IsConnected();
	return false;
}

/* This method reads persisted data from LmsCom 
(primary from lesson_data) and creates a LmsBasicStatus
object from that. */
LmsComBase.prototype.OpenBasicStatus = function () {
	this.status_obj = new LmsBasicStatus();
	this.status_obj.status = this.lesson_status;

	return this.status_obj;
}

/* This method reads persisted data from LmsCom 
(primary from lesson_data) and creates a LmsTopicStatus
object from that. */
LmsComBase.prototype.OpenTopicStatus = function (lmsModes, playerModes, lmsReqMode) {
	var fname = "OpenTopicStatus";
	this.status_obj = new LmsTopicStatus();
	this.status_obj.setRequiredMode(lmsModes, playerModes, lmsReqMode);
	lmslog.addEntry(0, fname, "RequiredMode", this.status_obj.requiredMode);
	this.status_obj.isScored = !!lmsModes["K"];

	var availableModes;
	if (GetTopLevelLmsMode() == "LMS")
		availableModes = lmsModes;
	else
		availableModes = playerModes;
	this.status_obj.setModeavail("S", availableModes["S"]);
	this.status_obj.setModeavail("T", availableModes["T"]);
	this.status_obj.setModeavail("K", availableModes["K"]);
	this.status_obj.setModeavail("D", availableModes["D"]);
	this.status_obj.setModeavail("P", availableModes["P"]);
	this.status_obj.setModeavail("E", availableModes["E"]);
	lmslog.addEntry(0, fname, "SeeIt", this.status_obj.getModeavail("S"));
	lmslog.addEntry(0, fname, "TryIt", this.status_obj.getModeavail("T"));
	lmslog.addEntry(0, fname, "KnowIt", this.status_obj.getModeavail("K"));
	lmslog.addEntry(0, fname, "DoIt", this.status_obj.getModeavail("D"));
	lmslog.addEntry(0, fname, "PrintIt", this.status_obj.getModeavail("P"));
	lmslog.addEntry(0, fname, "TestIt", this.status_obj.getModeavail("E"));

	if (this.bigsco) {
		this.status_obj.savedStatus = this.lesson_data.charAt(0);
		this.lesson_data = this.lesson_data.substring(1);
	}
	this.status_obj.initTopicstat(this.lesson_data);

	return this.status_obj;
}

// duplicates code for TopicStatus, except available modes are stored differently in
// topic.html than in lmstart.html
LmsComBase.prototype.OpenTopicLaunchStatus = function (mode, lmsModes, playerModes, lmsReqMode) {
	var fname = "OpenTopicLaunchStatus";

	this.status_obj = new LmsTopicLaunchStatus(mode);
	this.status_obj.setRequiredMode(lmsModes, playerModes, lmsReqMode);
	lmslog.addEntry(0, fname, "RequiredMode", this.status_obj.requiredMode);
	this.status_obj.isScored = lmsModes.indexOf("K") != -1;

	var availableModes;
	if (GetTopLevelLmsMode() == "LMS")
		availableModes = lmsModes;
	else
		availableModes = playerModes;
	this.status_obj.setModeavail("S", availableModes.indexOf("S") != -1);
	this.status_obj.setModeavail("T", availableModes.indexOf("T") != -1);
	this.status_obj.setModeavail("K", availableModes.indexOf("K") != -1);
	this.status_obj.setModeavail("D", availableModes.indexOf("D") != -1);
	this.status_obj.setModeavail("P", availableModes.indexOf("P") != -1);
	this.status_obj.setModeavail("E", availableModes.indexOf("E") != -1);
	lmslog.addEntry(0, fname, "SeeIt", this.status_obj.getModeavail("S"));
	lmslog.addEntry(0, fname, "TryIt", this.status_obj.getModeavail("T"));
	lmslog.addEntry(0, fname, "KnowIt", this.status_obj.getModeavail("K"));
	lmslog.addEntry(0, fname, "DoIt", this.status_obj.getModeavail("D"));
	lmslog.addEntry(0, fname, "PrintIt", this.status_obj.getModeavail("P"));
	lmslog.addEntry(0, fname, "TestIt", this.status_obj.getModeavail("E"));

	this.status_obj.initTopicstat(this.lesson_data);

	return this.status_obj;
}

/* This method reads persisted data from LmsCom 
(primary from lesson_data) and creates a 
LmsQuestionStatus object from that. */
LmsComBase.prototype.OpenQuestionStatus = function () {
	this.status_obj = new LmsQuestionStatus();
	this.status_obj.status = LMS_NOT_ATTEMPTED;
	this.status_obj.savedStatus = this.lesson_data ? Stat2Lms(this.lesson_data) : LMS_NOT_ATTEMPTED;

	return this.status_obj;
}

/* This method reads persisted data from LmsCom 
(primary from lesson_data) and creates a 
LmsAssessmentStatus object from that. */
LmsComBase.prototype.OpenAssessmentStatus = function (itemCount, hash, qlimit) {
	this.status_obj = new LmsAssessmentStatus();
	this.status_obj.hash = hash;    // save hash for when saving
	this.status_obj.questionlimit = qlimit;    // save question limit for when saving

	var str = this.lesson_data;
	var count;
	var savedhash = null;
	var savedqlimit = -1;

	if (str) {
		if (!this.bigsco) {
			var index = str.indexOf("@");
			if (index > 0) {
				count = parseInt(str.substring(0, index));
				// if aicc lms (moodle) replaced "+" in hash with " ", put "+" back
				savedhash = str.substring(index + 1, index + count + 1).replace(/ /g, "+");
				str = str.substring(index + count + 1);
				var index = str.indexOf("@");
				if (index > 0) {
					count = parseInt(str.substring(0, index));
					savedqlimit = parseInt(str.substring(index + 1, index + count + 1));
					str = str.substring(index + count + 1);
				}
			}
		} else
			savedhash = hash;   // to satisfy test below
	}

	if (hash === savedhash && str.length === itemCount + 1 && qlimit === savedqlimit) {
		this.status_obj.savedStatus = str.charAt(0);
		this.status_obj.status = str.charAt(0) === "I" ? LMS_INCOMPLETE : LMS_NOT_ATTEMPTED;
		for (var i = 0; i < itemCount; i++)
			this.status_obj.questionstatus[i] = str.charAt(i + 1);
	} else {
		if (str && !this.bigsco) {  // there was data but we need to invalidate
			this.status_obj.stateDiscarded = true;
			if (str.charAt(0) === "I")
				this.status_obj.savedStatus = "N"
			else
				this.status_obj.savedStatus = str.charAt(0);
		} else
			this.status_obj.savedStatus = "N";
		this.status_obj.status = LMS_NOT_ATTEMPTED;
		for (var i = 0; i < itemCount; i++)
			this.status_obj.questionstatus[i] = "N";
	}

	return this.status_obj;
}

/* This method reads persisted data from LmsCom 
(primary from lesson_data) and creates a 
LmsTOCStatus object from that. */
LmsComBase.prototype.OpenTOCStatus = function (nodecount, tocversion) {
	var tc = new LmsTOCStatus();
	this.status_obj = tc;

	var tocstate = new TOCState(nodecount, tocversion);
	tc.setTocState(tocstate);

	if (this.lesson_data != null && this.lesson_data.length > 0)
		tocstate.DeserializeTOC(this.lesson_data);
	return tc;
}

LmsComBase.prototype.SaveStatus = function () {
	if (this.status_obj)
		this.status_obj.Save(this);
}

// Add methods for communicating to UT (Kpath lite)
LmsComBase.prototype.utGetModeIndex = function () {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utGetModeIndex();
}
LmsComBase.prototype.utPushModeIndex = function () {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utPushModeIndex();
}
LmsComBase.prototype.utPopModeIndex = function () {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utPopModeIndex();
}
LmsComBase.prototype.utRecordType = function (type) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordType(type);
}
LmsComBase.prototype.utRecordStartTime = function (time) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordStartTime(time);
}
LmsComBase.prototype.utRecordTimespan = function (seconds) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordTimespan(seconds);
}
LmsComBase.prototype.utRecordEndTime = function (time) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordEndTime(time);
}
LmsComBase.prototype.utRecordCompletionStatus = function (status) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordCompletionStatus(status);
}
LmsComBase.prototype.utRecordSuccessStatus = function (status) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordSuccessStatus(status);
}
LmsComBase.prototype.utRecordScoreScaled = function (score) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordScoreScaled(score);
}
LmsComBase.prototype.utRecordFrameViewed = function (frame) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utRecordFrameViewed(frame);
}
LmsComBase.prototype.utSendTestItResult = function (result) {
	if (this.ParentLmsCom)
		this.ParentLmsCom.utSendTestItResult(result);
}

///////////////////////////////////////
// SCORM 1.2 LmsCom object defintion
///////////////////////////////////////
function LmsComScorm12() {
	this.allow_launch = false;

	this.object_type_name = "LmsComScorm12";
}

LmsComScorm12.prototype = new LmsComBase();
LmsComScorm12.prototype.constructor = LmsComScorm12;
LmsComScorm12.prototype.BaseClass = LmsComBase.prototype;

LmsComScorm12.prototype.Begin = function () {
	LmsComScorm12.prototype.BaseClass.Begin.call(this);

	//Initalizes communication with the LMS.
	var fname = "LmsComScorm12.Begin"
	lmslog.addEntry(0, fname, "", "Start");

	//SCORM - Gets all startup parameters from the LMS
	if (this.API == null) {
		this.allow_launch = true;
		return false;
	}

	if (this.API.LMSInitialize("") == "false") {
		var err = this.API.LMSGetLastError();
		var errDesc = this.API.LMSGetErrorString(err) + "\n" + this.API.LMSGetDiagnostic("");
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		return false;
	}

	this.lesson_status = this.original_lesson_status = this.doLMSGetValue("cmi.core.lesson_status");
	this.lesson_data = this.doLMSGetValue("cmi.suspend_data");
	this.lesson_location = this.doLMSGetValue("cmi.core.lesson_location");
	this.student_id = this.doLMSGetValue("cmi.core.student_id");
	this.student_name = this.doLMSGetValue("cmi.core.student_name");
	this.allow_launch = true;

	lmslog.addEntry(0, fname, "", "LMS session started");

	return true;
}

LmsComScorm12.prototype.End = function () {
	LmsComScorm12.prototype.BaseClass.End.call(this);

	//SCORM - Calls LMS to indicate that course session has ended
	var fname = "LmsComScorm12.End";
	lmslog.addEntry(0, fname, "", "Start");

	if (!this.allow_launch)
		return false;

	this.allow_launch = false;

	if (this.API == null) {
		return false;
	}

	if (this.lesson_status == LMS_INCOMPLETE)
		this.doLMSSetValue("cmi.core.exit", "suspend");
	else
		this.doLMSSetValue("cmi.core.exit", "");    // GS set this to suspend, too

	var sesstime = this.computeTime(this.start_date, this.end_date);
	this.doLMSSetValue("cmi.core.session_time", sesstime);
	// SCORM compliance suite dies if you send it an empty string (like, say, if you
	// wanted to clear out the value)
	if (this.lesson_data)
		this.doLMSSetValue("cmi.suspend_data", this.lesson_data);
	if (this.lesson_location)
		this.doLMSSetValue("cmi.core.lesson_location", this.lesson_location);

	this.SendCompletionInfo(true);

	if (this.API && this.API.LMSFinish("") == "false") {
		var err = this.API.LMSGetLastError();
		var errDesc = this.API.LMSGetErrorString(err) + "\n" + this.API.LMSGetDiagnostic("");
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		return false;
	}

	this.API = null;  // 13102364 - prevents errors from get/set if window close occurs before page callback

	lmslog.addEntry(0, fname, "", "LMS session terminated");

	return true;
}

/* Sends completion status to the LMS. This is factored out of LmsCom.End() so
that completion information may be sent immediately to allow the LMS to
update any visual feedback. "not attempted" is sent as "incomplete" because
the SCORM1.2 spec can be interpreted to make "not attempted" an illegal value
to set */
LmsComScorm12.prototype.SendCompletionInfo = function (isEnding) {
	if (this.lesson_status === LMS_NOT_ATTEMPTED) {
		if (this.original_lesson_status === LMS_NOT_ATTEMPTED)
			this.doLMSSetValue("cmi.core.lesson_status", LMS_INCOMPLETE);
		else
			this.doLMSSetValue("cmi.core.lesson_status", this.original_lesson_status);
	} else
		this.doLMSSetValue("cmi.core.lesson_status", this.getReportedLessonStatus());

	if (this.score !== "") {
		this.doLMSSetValue("cmi.core.score.raw", this.score);
		this.doLMSSetValue("cmi.core.score.min", "0");
		this.doLMSSetValue("cmi.core.score.max", "100");
	}
	if (!isEnding)
		this.doLMSCommit();
}

/* Load the SCORM API adapter if needed and save reference to it. */
LmsComScorm12.prototype.LoadAPIAdapter = function (callback) {
	this.API = null
	if (GetLmsComFactory())
		this.API = GetLmsComFactory().scorm_api_12;
	callback();
}

/* Indicate if LMS connection is live */
LmsComScorm12.prototype.IsConnected = function () {
	return this.API != null;
}

// SCORM adapter definitions

LmsComScorm12.prototype.ErrorCodes = {
	NoError: 0,
	GeneralException: 101,
	ElementCannotHaveChildren: 202,
	ElementNotAnArray: 203,
	NotInitialized: 301,
	NotImplemented: 401,
	InvalidSetValue: 402,
	ElementIsReadOnly: 403,
	ElementIsWriteOnly: 404,
	IncorrectDataType: 405
};

LmsComScorm12.prototype.doLMSGetValue = function (name) {
	var fname = "doLMSGetValue";
	if (this.API == null) {
		return "";
	}

	var value = this.API.LMSGetValue(name);
	var err = this.API.LMSGetLastError();
	if (err != this.ErrorCodes.NoError) {
		var errDesc = this.API.LMSGetErrorString(err);
		lms_ConnectionLost(err + " " + errDesc + ", " + name);
		lmslog.addEntry(0, fname, "", R_scorm_getvalfail + name + " " + errDesc);
		return "";
	}

	lmslog.addEntry(1, fname, name, value);
	return value;
}

LmsComScorm12.prototype.doLMSSetValue = function (name, value) {
	var fname = "doLMSSetValue";
	if (this.API == null) {
		return "false";
	}

	if (this.API.LMSSetValue(name, value) == "false") {
		var err = this.API.LMSGetLastError();
		if (err != this.ErrorCodes.NoError && err != this.ErrorCodes.NotImplemented) {
			var errDesc = this.API.LMSGetErrorString(err);
			lms_ConnectionLost(err + " " + errDesc + ", " + name + ", " + value);
			lmslog.addEntry(0, fname, "", R_scorm_setvalfail + name + ":" + value + " " + errDesc);
			return "false";
		}
	}

	lmslog.addEntry(1, fname, name, value);
	return "true";
}

LmsComScorm12.prototype.doLMSCommit = function () {
	var fname = "doLMSCommit";
	if (this.API == null) {
		return "false";
	}

	if (this.API.LMSCommit("") == "false") {    // is commit failure a drop?
		var err = this.API.LMSGetLastError();
		var errDesc = this.API.LMSGetErrorString(err);
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		this.API = null;
		return "false";
	}

	lmslog.addEntry(1, fname, "", "");
	return "true";
}

///////////////////////////////////////
// SCORM 1.3 (SCORM2004) LmsCom object defintion
///////////////////////////////////////
function LmsComScorm2004() {
	this.allow_launch = false;
	this.object_type_name = "LmsComScorm2004";
	this.lesson_data_location = "cmi.suspend_data";
}

LmsComScorm2004.prototype = new LmsComBase();
LmsComScorm2004.prototype.constructor = LmsComScorm2004;
LmsComScorm2004.prototype.BaseClass = LmsComBase.prototype;

LmsComScorm2004.prototype.Begin = function () {
	LmsComScorm2004.prototype.BaseClass.Begin.call(this);

	//Initalizes communication with the LMS.
	var fname = "LmsComScorm2004.Begin"
	lmslog.addEntry(0, fname, "", "Start");

	//SCORM - Gets all startup parameters from the LMS
	if (this.API == null) {
		this.allow_launch = true;
		return false;
	}

	if (this.API.Initialize("") == "false") {
		var err = this.API.GetLastError();
		var errDesc = this.API.GetErrorString(err) + "\n" + this.API.GetDiagnostic("");
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		return false;
	}

	this.lesson_status = this.doGetValue("cmi.completion_status");
	if (this.lesson_status === "unknown") {
		this.lesson_status = LMS_NOT_ATTEMPTED;
	} else if (this.lesson_status === LMS_COMPLETED) {
		var success_status = this.doGetValue("cmi.success_status");
		if (success_status === LMS_PASSED || success_status === LMS_FAILED)
			this.lesson_status = success_status;
	}
	this.original_lesson_status = this.lesson_status;
	this.lesson_data = this.doGetValue(this.lesson_data_location);
	this.lesson_location = this.doGetValue("cmi.location");
	this.student_id = this.doGetValue("cmi.learner_id");
	this.student_name = this.doGetValue("cmi.learner_name");
	this.allow_launch = true;

	lmslog.addEntry(0, fname, "", "LMS session started");

	return true;
}

LmsComScorm2004.prototype.End = function () {
	LmsComScorm2004.prototype.BaseClass.End.call(this);

	//SCORM - Calls LMS to indicate that course session has ended
	var fname = "LmsComScorm2004.End";
	lmslog.addEntry(0, fname, "", "Start");

	if (!this.allow_launch)
		return false;

	this.allow_launch = false;

	if (this.API == null) {
		return false;
	}

	if (this.lesson_status == LMS_INCOMPLETE)
		this.doSetValue("cmi.exit", "suspend");
	else
		this.doSetValue("cmi.exit", "normal");

	var sesstime = this.computeTime(this.start_date, this.end_date);
	this.doSetValue("cmi.session_time", sesstime);
	// SCORM compliance suite dies if you send it an empty string (like, say, if you
	// wanted to clear out the value)
	if (this.lesson_data)
		this.doSetValue(this.lesson_data_location, this.lesson_data);
	if (this.lesson_location)
		this.doSetValue("cmi.location", this.lesson_location);

	this.SendCompletionInfo(true);

	if (this.API && this.API.Terminate("") == "false") {
		var err = this.API.GetLastError();
		var errDesc = this.API.GetErrorString(err) + "\n" + this.API.GetDiagnostic("");
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		return false;
	}

	this.API = null;  // 13102364 - prevents errors from get/set if window close occurs before page callback

	lmslog.addEntry(0, fname, "", "LMS session terminated");

	return true;
}

/* Load the SCORM API adapter if needed and save reference to it. */
LmsComScorm2004.prototype.LoadAPIAdapter = function (callback) {
	this.API = null
	if (GetLmsComFactory())
		this.API = GetLmsComFactory().scorm_api_2004;
	//setTimeout(callback,1);
	// Above timeout caused mode launches to hang on ipad. Apparently it isn't cross-tab
	// execution that is blocked, but only the timer thread in inactive tabs.
	callback();
}

/* Sends completion status to the LMS. This is factored out of LmsCom.End() so
that completion information may be sent immediately to allow the LMS to
update any visual feedback. */
LmsComScorm2004.prototype.SendCompletionInfo = function (isEnding) {
	var lesson_status = this.getReportedLessonStatus();
	if (lesson_status === LMS_NOT_ATTEMPTED)
		lesson_status = this.original_lesson_status;
	// split scorm1.2/aicc completion into scorm2004 values
	// maybe it would be better to hold them in the scorm2004 manner and join
	// for aicc/scorm1.2
	if (lesson_status == LMS_PASSED || lesson_status == LMS_FAILED) {
		this.doSetValue("cmi.success_status", lesson_status);
		this.doSetValue("cmi.completion_status", LMS_COMPLETED);
	} else
		this.doSetValue("cmi.completion_status", lesson_status);

	if (this.score !== "") {
		this.doSetValue("cmi.score.raw", this.score);
		this.doSetValue("cmi.score.scaled", this.score / 100);
		this.doSetValue("cmi.score.min", "0");
		this.doSetValue("cmi.score.max", "100");
	}
	if (!isEnding)
		this.doCommit();
}

/* Internal helper method that converts date/time into
seconds. This version generates a 1.3 compliant (second,10,2) result */
LmsComScorm2004.prototype.convertTotalSeconds = function (ts) {
	var sec = (ts % 60);
	ts -= sec;
	var tmp = (ts % 3600);  //# of seconds in the total # of minutes
	ts -= tmp;              //# of seconds in the total # of hours
	// convert seconds to conform to CMITimespan type (e.g. SS.00)
	sec = Math.round(sec * 100) / 100;
	var strSec = new String(sec);
	var strWholeSec = strSec;
	var strFractionSec = "";
	if (strSec.indexOf(".") != -1) {
		strWholeSec = strSec.substring(0, strSec.indexOf("."));
		strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
	}
	if (strWholeSec.length < 2) {
		strWholeSec = "0" + strWholeSec;
	}
	strSec = strWholeSec;
	if ((ts % 3600) != 0)
		var hour = 0;
	else var hour = (ts / 3600);
	if ((tmp % 60) != 0)
		var min = 0;
	else var min = (tmp / 60);
	if ((new String(hour)).length < 2)
		hour = "0" + hour;
	if ((new String(min)).length < 2)
		min = "0" + min;
	var rtnVal = "PT" + hour + "H" + min + "M" + strSec + "S";
	return rtnVal;
}

/* Indicate if LMS connection is live */
LmsComScorm2004.prototype.IsConnected = function () {
	return this.API != null;
}

// SCORM adapter definitions

LmsComScorm2004.prototype.ErrorCodes = {
	NoError: 0,
	GeneralException: 101,
	GeneralInitializationFailure: 102,
	AlreadyInitialized: 103,
	ContentInstanceTerminated: 104,
	GeneralTerminationFailure: 111,
	TerminationBeforeInitialization: 112,
	TerminationAfterTermination: 113,
	RetrieveDataBeforeInitialization: 122,
	RetrieveDataAfterTermination: 123,
	StoreDataBeforeInitialization: 132,
	StoreDataAfterTermination: 133,
	CommitBeforeInitialization: 142,
	CommitAfterTermination: 143,
	GeneralArgumentError: 201,
	GeneralGetFailure: 301,
	GeneralSetFailure: 351,
	GeneralCommitFailure: 391,
	UndefinedDataModelElement: 401,
	UnimplementedDataModelElement: 402,
	DataModelElementValueNotInitialized: 403,
	DataModelElementIsReadOnly: 404,
	DataModelElementIsWriteOnly: 405,
	DataModelElementTypeMismatch: 406,
	DataModelElementValueOutOfRange: 407,
	DataModelDependencyNotEstablished: 408,

	KPathTimeout: 1501,
	KPathConnect: 1502,
	KPathBusy: 1503
};

LmsComScorm2004.prototype.doGetValue = function (name) {
	var fname = "doGetValue";
	if (this.API == null) {
		return "";
	}

	var value = this.API.GetValue(name);
	var err = this.API.GetLastError();
	if (err != this.ErrorCodes.NoError && err != this.ErrorCodes.DataModelElementValueNotInitialized) {
		if (err == this.ErrorCodes.KPathTimeout && this.object_type_name == "LmsComKPath") {
			lmslog.addEntry(0, fname, "", "KCenter timeout");
			var idle = this.API.GetValue("upk.idle_time");
			lmslog.addEntry(0, fname, "upk.idle_time", idle);
			this.idle_time += idle;
			this.mode_idle_time += idle;
			lmslog.addEntry(0, fname, "idle_time", this.idle_time);
			return this.doGetValue(name);  // redo the call
		} else {
			var errDesc = this.API.GetErrorString(err);
			lms_ConnectionLost(err + " " + errDesc + ", " + name);
			lmslog.addEntry(0, fname, "", R_scorm_getvalfail + name + " " + errDesc);
			return "";
		}
	}

	lmslog.addEntry(1, fname, name, value);
	return value;
}

LmsComScorm2004.prototype.doSetValue = function (name, value) {
	var fname = "doSetValue";
	if (this.API == null) {
		return "false";
	}

	if (this.API.SetValue(name, value) == "false") {
		var err = this.API.GetLastError();
		if (err != this.ErrorCodes.NoError && err != this.ErrorCodes.UnimplementedDataModelElement) {
			if (err == this.ErrorCodes.KPathTimeout && this.object_type_name == "LmsComKPath") {
				lmslog.addEntry(0, fname, "", "KCenter timeout");
				var idle = this.API.GetValue("upk.idle_time");
				lmslog.addEntry(0, fname, "upk.idle_time", idle);
				this.idle_time += idle;
				this.mode_idle_time += idle;
				lmslog.addEntry(0, fname, "idle_time", this.idle_time);
				return this.doSetValue(name, value);
			} else {
				var errDesc = this.API.GetErrorString(err);
				lms_ConnectionLost(err + " " + errDesc + ", " + name + ", " + value);
				lmslog.addEntry(0, fname, "", R_scorm_setvalfail + name + ":" + value + " " + errDesc);
				return "false";
			}
		}
	}
	//alert(fname+":"+name+":"+value);
	lmslog.addEntry(1, fname, name, value);
	return "true";
}

LmsComScorm2004.prototype.doCommit = function () {
	var fname = "doCommit";
	if (this.API == null) {
		return "false";
	}

	if (this.API.Commit("") == "false") {
		var err = this.API.GetLastError();
		var errDesc = this.API.GetErrorString(err);
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(err + " " + errDesc);
		lmslog.addEntry(0, fname, "", errDesc);
		return "false";
	}

	lmslog.addEntry(1, fname, "", "");
	return "true";
}


///////////////////////////////////////
// Knowledge Pathways LmsCom object defintion
///////////////////////////////////////
function LmsComKPath(parent) {
	this.allow_launch = false;

	if (parent != null) {
		this.Copy(parent);
		this.ParentLmsCom = parent;
	}

	this.object_type_name = "LmsComKPath";
	this.lesson_data_location = "upk.sco_data";
	this.commitActive = false; // asynchronous commit in progress
	this.commitNeeded = false; // another commit needed when current one completes 
}

LmsComKPath.prototype = new LmsComScorm2004();
LmsComKPath.prototype.constructor = LmsComKPath;
LmsComKPath.prototype.BaseClass = LmsComScorm2004.prototype;

LmsComKPath.prototype.Begin = function () {
	var fname = "LmsComKPath.Begin"
	lmslog.addEntry(0, fname, "", "Start");
	var result = LmsComKPath.prototype.BaseClass.Begin.call(this);
	this.doSetValue("upk.launch_from", GetTopLevelLmsMode());
	lmslog.addEntry(0, fname, "", "LMS session started");
	return result;
}

/* Sends completion status to the LMS. This is factored out of LmsCom.End() so
that completion information may be sent immediately to allow the LMS to
update any visual feedback. Unlike the other lmscom types, we want to send
LMS_NOT_ATTEMPTED to kpath if no new attempt is made */
LmsComKPath.prototype.SendCompletionInfo = function (isEnding) {
	var lesson_status = this.getReportedLessonStatus();
	if (lesson_status === LMS_NOT_ATTEMPTED) {
		this.doSetValue("cmi.completion_status", LMS_NOT_ATTEMPTED);
		return;
	}
	// split scorm1.2/aicc completion into scorm2004 values
	// maybe it would be better to hold them in the scorm2004 manner and join
	// for aicc/scorm1.2
	if (lesson_status == LMS_PASSED || lesson_status == LMS_FAILED) {
		this.doSetValue("cmi.success_status", lesson_status);
		this.doSetValue("cmi.completion_status", LMS_COMPLETED);
	} else
		this.doSetValue("cmi.completion_status", lesson_status);

	if (this.score !== "") {
		this.doSetValue("cmi.score.raw", this.score);
		this.doSetValue("cmi.score.scaled", this.score / 100);
		this.doSetValue("cmi.score.min", "0");
		this.doSetValue("cmi.score.max", "100");
	}
	if (!isEnding)
		this.doCommit();
}

/* Load the SCORM API adapter if needed and save reference to it. */
LmsComKPath.prototype.LoadAPIAdapter = function (callback) {
	if (!this.API) {    // don't overwrite previously set adapter
		var apiframe = findKPathAPIFrame(window);
		if (apiframe && apiframe.LoadRuntime && this.guid) {
			this.deferred_callback = callback;
			var that = this;
			apiframe.LoadRuntime(this.guid, 0, 0, 0, function (s, g, a, e) { that.LoadAPIAdapterCallback(s, g, a, e) }, upk.browserInfo.isTouchDevice(), this.isTestIt);
		} else {
			callback();
		}
	} else
		callback();
}

LmsComKPath.prototype.LoadAPIAdapterCallback = function (succeeded, guid, APIControl, ErrorMessage) {
	if (succeeded == "succeeded" && guid == this.guid) {
		this.API = APIControl.GetAPI();
		lmslog.addEntry(0, "LoadAPIAdapterCallback", "", "KPath adapter bound");
		try {
			this.deferred_callback();
		} catch (e) { } // catch case where we cycle quickly through the toc & lmscom page closed before API callback runs
	} else if (succeeded == "no SCO") {
		this.API = null;    // fall back to lmscombase functionality
		lmslog.addEntry(0, "LoadAPIAdapterCallback", "", ErrorMessage);
		this.deferred_callback();
	} else {
		alert(R_scorm_noapi + " " + ErrorMessage);
		lmslog.addEntry(0, "LoadAPIAdapterCallback", "", ErrorMessage);
		this.deferred_callback();
	}
}

LmsComKPath.prototype.doGetUPKValue = function (name) {
	var ret = this.doGetValue(name);
	if (ret === "")
		ret = -1;
	return ret;
}

LmsComKPath.prototype.doSetUPKValue = function (name, value) {
	this.doSetValue(name, value);
}

LmsComKPath.prototype.doUPKCommit = function () {
	this.doCommit();
}

// do asynchronous commits to kcenter
LmsComKPath.prototype.doCommit = function () {
	var fname = "doCommit";
	if (this.API == null) {
		return "false";
	}
	if (this.commitActive) {
		lmslog.addEntry(0, fname, "commitActive==true", "")
		this.commitNeeded = true;
		return "true";
	}

	lmslog.addEntry(1, fname, "", "");
	if (!upk.browserInfo.isTouchDevice()) {  // do sync commits on ipad
		this.commitActive = true;
		var that = this;
		var callback = function (s, e) { that.doCommitCallback(s, e); }
	} else {
		var callback = null;
	}
	if (this.API.Commit("", callback) == "false") {
		this.commitActive = false;
		var err = this.API.GetLastError();
		var errDesc = this.API.GetErrorString(err);
		if (err == this.ErrorCodes.KPathTimeout && this.object_type_name == "LmsComKPath") {
			lmslog.addEntry(0, fname, "", "KCenter timeout");
			var idle = this.API.GetValue("upk.idle_time");
			lmslog.addEntry(0, fname, "upk.idle_time", idle);
			this.idle_time += idle;
			this.mode_idle_time += idle;
			lmslog.addEntry(0, fname, "idle_time", this.idle_time);
			return this.doCommit();
		} else {
			this.API = null;   // flag as disconnected
			lms_ConnectionLost(err + " " + errDesc);
			lmslog.addEntry(0, fname, "", errDesc);
			return "false";
		}
	}
	return "true";
}

LmsComKPath.prototype.doCommitCallback = function (success, error) {
	lmslog.addEntry(1, "doCommitCallback", "", "");
	this.commitActive = false;
	if (!success) {
		this.API = null;   // flag as disconnected
		lms_ConnectionLost(error);
		lmslog.addEntry(0, "doCommitCallback", "", error);
	}
	if (this.commitNeeded) {
		this.commitNeeded = false;
		this.doCommit();
	}
}


// Record an interaction completion.
LmsComKPath.prototype.setInteraction = function (index, qlmscom) {
	if (!this.API)  // if running in "lmscombase mode"
		return;

	var statobj = qlmscom.status_obj;
	var count = this.doGetValue("cmi.interactions._count");
	if (index == -1) index = count;
	if (index >= count)
		this.doSetValue("cmi.interactions." + index + ".id", qlmscom.guid);
	this.doSetValue("cmi.interactions." + index + ".type", statobj.getQuestionType());
	this.doSetValue("cmi.interactions." + index + ".timestamp", (new Date()).toSCORM());
	this.doSetValue("cmi.interactions." + index + ".weighting", "1");
	if (statobj.getResult()) {
		this.doSetValue("cmi.interactions." + index + ".learner_response", statobj.getLearnerResponse());
		this.doSetValue("cmi.interactions." + index + ".result", statobj.getResult());
	}
	this.doCommit();
	return index;
}

LmsComKPath.prototype.getAnsweredQuestions = function () {
	var answeredQuestions = {};
	if (!this.API)
		return answeredQuestions;

	var count = this.doGetValue("cmi.interactions._count");
	for (var i = 0; i < count; i++) {
		var id = this.doGetValue("cmi.interactions." + i + ".id");
		answeredQuestions[id] = { index: i };
		answeredQuestions[id].weighting = this.doGetValue("cmi.interactions." + i + ".weighting");
		answeredQuestions[id].result = this.doGetValue("cmi.interactions." + i + ".result");
	}
	return answeredQuestions;
}

LmsComKPath.prototype.setObjective = function (index, objective) {
	if (this.API) {
		var objectiveID = objective.objectiveGuid == "PRIMARYOBJ" ? "PRIMARYOBJ" : "OBJ_" + objective.objectiveGuid;
		this.doSetValue("cmi.objectives." + index + ".id", objectiveID);
		this.doSetValue("cmi.objectives." + index + ".score.scaled", objective.score / 100);
		this.doSetValue("cmi.objectives." + index + ".completion_status", objective.completed ? "completed" : "incomplete");
		this.doSetValue("cmi.objectives." + index + ".success_status", objective.completed ? "passed" : "failed");
	}
}

// sequencing at end of pre/post assessment
LmsComKPath.prototype.requestContinue = function () {
	this.doSetValue("adl.nav.request", "continue");
}

// Add methods for communicating to UT (Kpath lite)
LmsComKPath.prototype.utGetModeIndex = function () {
	this.mode_index = this.doGetValue("upk.modes._count");
}
// single entry stack for ut tracking seeit/tryit/printit from doit
LmsComKPath.prototype.utPushModeIndex = function () {
	this.saved_mode_index = this.mode_index;
	this.utGetModeIndex();
}
LmsComKPath.prototype.utPopModeIndex = function () {
	this.mode_index = this.saved_mode_index;
	delete this.saved_mode_index;
}
LmsComKPath.prototype.utRecordType = function (type) {
	this.doSetValue("upk.modes." + this.mode_index + ".type", type);
}
LmsComKPath.prototype.utRecordStartTime = function (time) {
	this.doSetValue("upk.modes." + this.mode_index + ".start_time", time.toSCORM());
	this.mode_idle_time = 0;
}
LmsComKPath.prototype.utRecordEndTime = function (time) {
	this.doSetValue("upk.modes." + this.mode_index + ".end_time", time.toSCORM());
}
LmsComKPath.prototype.utRecordTimespan = function (seconds) {
	this.doSetValue("upk.modes." + this.mode_index + ".timespan", seconds - this.mode_idle_time / 1000);
}
LmsComKPath.prototype.utRecordCompletionStatus = function (status) {
	this.doSetValue("upk.modes." + this.mode_index + ".completion_status", status);
}
LmsComKPath.prototype.utRecordSuccessStatus = function (status) {
	this.doSetValue("upk.modes." + this.mode_index + ".success_status", status);
}
LmsComKPath.prototype.utRecordScoreScaled = function (score) {
	this.doSetValue("upk.modes." + this.mode_index + ".score.scaled", score);
}
LmsComKPath.prototype.utRecordFrameViewed = function (frame) {
	this.doSetValue("upk.modes." + this.mode_index + ".frame_viewed", frame);
	var sesstime = this.computeTime(this.start_date, new Date().getTime());
	this.doSetValue("cmi.session_time", sesstime);
	this.doCommit();
}
LmsComKPath.prototype.utSendTestItResult = function (result) {
	this.doSetValue("upk.modes." + this.mode_index + ".test_result", result);
	this.doCommit();
}

///////////////////////////////////////
// AICC LmsCom object defintion
///////////////////////////////////////
function LmsComAICC(aicc_url, aicc_sid) {
	this.allow_launch = false;

	this.aicc_url = aicc_url;
	this.aicc_sid = aicc_sid;
	this.app = document.applets.GetHTTPPostData;

	this.object_type_name = "LmsComAICC";
}

LmsComAICC.prototype = new LmsComBase();
LmsComAICC.prototype.constructor = LmsComScorm12;
LmsComAICC.prototype.BaseClass = LmsComBase.prototype;

LmsComAICC.prototype.Begin = function () {
	LmsComAICC.prototype.BaseClass.Begin.call(this);

	//Initalizes communication with the LMS.
	var fname = "LmsComAICC.Begin"
	lmslog.addEntry(0, fname, "", "Start");

	this.hacpGetparam();

	lmslog.addEntry(0, fname, "", "about to log paramvalues");
}

LmsComAICC.prototype.End = function () {
	LmsComAICC.prototype.BaseClass.End.call(this);

	var fname = "LmsComAICC.End";
	lmslog.addEntry(0, fname, "", "Start");

	if (!this.allow_launch)
		return false;

	this.allow_launch = false;

	var NewAiccData = this.hacpGetpostdata();
	var params = "command=putparam&version=" + LmsConfig.AiccVersion + "&session_id=" + this.aicc_sid + "&aicc_data=" + escape(NewAiccData) + "&";
	lmslog.addEntry(0, fname, "params", params);
	var strData = this.app.GetData(unescape(this.aicc_url), params)
	lmslog.addEntry(0, fname, "strData", strData);
	params = "version=" + LmsConfig.AiccVersion + "&command=ExitAU&session_id=" + this.aicc_sid + "&";
	lmslog.addEntry(0, fname, "params", params);
	strData = this.app.GetData(unescape(this.aicc_url), params)
	lmslog.addEntry(0, fname, "strData", strData);
}

// stolen from lmsfunctions.js
var closingAmp = true;  // huh?

LmsComAICC.prototype.hacpGetparam = function () {
	//AICC - Gets startup parameters from the LMS
	var fname = "hacpGetparam";
	lmslog.addEntry(0, fname, "", "Start");
	var strData = "";
	var params;
	params = "version=" + LmsConfig.AiccVersion + "&command=GetParam&session_id=" + this.aicc_sid;
	if (closingAmp)
		params = params + "&";
	lmslog.addEntry(0, fname, "params", params);
	strData = this.app.GetData(unescape(this.aicc_url), params)
	lmslog.addEntry(0, fname, "strData", strData);
	var lessonStatus;
	var lessonFlag;
	var ErrorNum;
	var ErrorText;
	var IsValid = false;
	strData += " ";
	var strArgs = strData.split("\r");
	for (var i = 0; i < strArgs.length; i++) {
		var strArg = strArgs[i];
		var tag = trimValue(strArg.substring(0, strArg.indexOf("=")));
		var val = trimValue(strArg.substring(strArg.indexOf("=") + 1));
		if (tag.toLowerCase() == "error") {
			ErrorNum = val;
			IsValid = true;
		}
		if (tag.toLowerCase() == "error_text") {
			ErrorText = val;
		}
		if (tag.toLowerCase() == "aicc_data") {
			this.aicc_data = strData.substring(strData.indexOf(strArg.substring(0, strArg.indexOf("="))) + strArg.substring(0, strArg.indexOf("=")).length + 1);
			IsValid = true;
		}
	}
	if (IsValid) {
		if (ErrorNum == 0) {
			// successful
			var CoreData;
			CoreData = get_group_content("core", this.aicc_data);
			var strArgs = CoreData.split("\r");
			for (var i = 0; i < strArgs.length; i++) {
				var strArg = strArgs[i];
				var tag = trimValue(strArg.substring(0, strArg.indexOf("=")));
				var val = trimValue(strArg.substring(strArg.indexOf("=") + 1));
				if (tag.toLowerCase() == "student_id") {
					this.student_id = val;
				}
				if (tag.toLowerCase() == "student_name") {
					this.student_name = val;
					//					this.splitStudentname(val);				
				}
				if (tag.toLowerCase() == "lesson_status") {
					this.lesson_status = val.toLowerCase().charAt(0);
					if (val.indexOf(",") != -1)
						this.lesson_flag = trimValue(val.substring(val.indexOf(",") + 1)).toLowerCase();
					//map abreviated flags
					if (this.lesson_status == "p")
						this.lesson_status = LMS_PASSED;
					if (this.lesson_status == "c")
						this.lesson_status = LMS_COMPLETED;
					if (this.lesson_status == "f")
						this.lesson_status = LMS_FAILED;
					if (this.lesson_status == "i")
						this.lesson_status = LMS_INCOMPLETE;
					if (this.lesson_status == "n")
						this.lesson_status = LMS_NOT_ATTEMPTED;
					this.original_lesson_status = this.lesson_status;
				}
				if (tag.toLowerCase() == "lesson_location") {
					this.lesson_location = val;
				}
				if (tag.toLowerCase() == "credit") {
					this.credit = val;
				}
				if (tag.toLowerCase() == "score") {
					this.score = val;
				}
				if (tag.toLowerCase() == "time") {
					this.time = val;
				}
			}
			if (this.lesson_status == LMS_INCOMPLETE ||
			    this.lesson_status == LMS_COMPLETED ||
			    this.lesson_status == LMS_PASSED ||
			    this.lesson_status == LMS_FAILED
			    ) {
				this.lesson_data = trimValue(get_group_content("core_lesson", this.aicc_data));
			}
			else {
				this.lesson_data = "";
			}
			this.core_vendor = trimValue(get_group_content("core_vendor", this.aicc_data));
			//startTimer();
			this.allow_launch = true;
		}
		else {
			// unsuccessful, display error and do not launch
			alert(R_error_unexp + ErrorText);
			lmslog.addEntry(0, fname, "", "Unable to continue because of the following error: " + ErrorText);
		}
	}
	else {
		alert(R_error_svr + unescape(this.aicc_url) + "\r\r - " + strData);
		lmslog.addEntry(0, fname, "", "Unable to post to server " + unescape(this.aicc_url) + " - " + strData);
	}
}

LmsComAICC.prototype.hacpGetpostdata = function () {
	//AICC - Builds the AICC message string for passing to the LMS
	var fname = "hacpGetpostdata";
	lmslog.addEntry(0, fname, "", "Start");
	var NewAiccData = "";
	NewAiccData = "[CORE]\r\n";
	NewAiccData += "Lesson_Location=" + "\r\n";
	var lesson_status = this.getReportedLessonStatus();
	if (lesson_status === LMS_NOT_ATTEMPTED)
		lesson_status = this.original_lesson_status;
	if (this.lesson_status === LMS_INCOMPLETE) {
		NewAiccData += "Lesson_Status=" + lesson_status + ", suspend\r\n";
	}
	else {
		NewAiccData += "Lesson_Status=" + lesson_status + "\r\n";
	}
	lmslog.addEntry(0, fname, "is_assess", this.is_assess);
	if (this.score !== "") {
		NewAiccData += "Score=" + this.score + "\r\n";
	} else {
		NewAiccData += "Score=\r\n";
	}
	NewAiccData += "Time=" + this.computeTime(this.start_date, this.end_date) + "\r\n";
	NewAiccData += "[CORE_LESSON]\r\n";
	NewAiccData += this.lesson_data + "\r\n";
	lmslog.addEntry(0, fname, "NewAiccData", NewAiccData);
	return NewAiccData;
}

function get_group_content(section, buffer) {
	var contents = "";
	var strArgs = buffer.split("\r");
	var foundSection = false;
	for (var i = 0; i < strArgs.length; i++) {
		var line = trimValue(strArgs[i]);
		if (line.substr(0, 1) == "[") {
			if (line.toLowerCase().indexOf("[" + section.toLowerCase() + "]") >= 0) {
				foundSection = true;
			}
			else {
				foundSection = false;
			}
		}
		else {
			if (foundSection) {
				contents += line + "\r\n";
			}
		}
	}
	return contents;
}

function trimValue(Val) {
	var strval;
	var startPos = 0;
	var endPos = Val.length;
	for (var i = 0; i < Val.length; i++) {
		// space, tab, lf, cr
		if ((Val.substr(i, 1) != " ") && (Val.substr(i, 1) != "\u0009") && (Val.substr(i, 1) != "\u000A") && (Val.substr(i, 1) != "\u000D")) {
			startPos = i;
			break;
		}
	}
	if (i == Val.length)
		return "";
	for (var i = Val.length - 1; i > 0; i--) {
		// space, tab, lf, cr
		if ((Val.substr(i, 1) != " ") && (Val.substr(i, 1) != "\u0009") && (Val.substr(i, 1) != "\u000A") && (Val.substr(i, 1) != "\u000D")) {
			endPos = i;
			break;
		}
	}
	if (i == 0)
		endPos = 0;
	return Val.substring(startPos, endPos + 1);
}

/* Indicate if LMS connection is live */
LmsComAICC.prototype.IsConnected = function () {
	return true;    // what does it mean to be disconnected from an AICC LMS?
}

///////////////////////////////////////
// Cookie based LmsCom object defintion
///////////////////////////////////////
function LmsComCookie() {
	this.allow_launch = false;

	this.object_type_name = "LmsComCookie";
}

LmsComCookie.prototype = new LmsComBase();
LmsComCookie.prototype.constructor = LmsComCookie;
LmsComCookie.prototype.BaseClass = LmsComBase.prototype;

LmsComCookie.prototype.Begin = function () {
	LmsComCookie.prototype.BaseClass.Begin.call(this);
	/*
    if (this.toc_hash = window.toc_hash) {  // assignment intended
    var c = new Cookie(document, "Bookmark_" + this.toc_hash, 30);
    c.Load();
    this.lesson_location = c.Location;
    }
    */
}

LmsComCookie.prototype.End = function () {
	LmsComCookie.prototype.BaseClass.End.call(this);
	/*
    if (this.toc_hash) {
    var c = new Cookie(document, "Bookmark_" + this.toc_hash, 30);
    c.Load();
    c.Location = this.lesson_location;
    c.Store();
    }
    */
}

// Get current bookmark. This is only needed for a TOC that is called via lmstart
// but not from an LMS. If you open a Big SCO's concept from kp.html and launch
// it, the Big SCO toc will get an lmscombase from the lmstart, but the lmstart
// page doesn't have the toc_hash, so it can't get the bookmark.
// Note that "view outline" from a normal concept does not need this. It replaces
// the lmstart page with the toc, so the toc will end up with an lmscomcookie of
// its own.
/*
LmsComCookie.prototype.GetBookmark = function (toc_hash) {
if (this.toc_hash = toc_hash) { // assignment intended
var c = new Cookie(document, "Bookmark_" + this.toc_hash, 30);
c.Load();
this.lesson_location = c.Location;
}
return parseInt(this.lesson_location, 10);
}
*/

///////////////////////////////////////
//
// LmsStatus object defintions
//
///////////////////////////////////////

/* The following are a seriers of objects 
used to communicate the learning
asset runtime state with the peristence
structure used by the LmsCom object */

///////////////////////////////////////
// Basic status
///////////////////////////////////////

/* Really basic status - use by documents
like concepts in the TOC */
function LmsBasicStatus() {
	this.status = LMS_NOT_ATTEMPTED;
}

LmsBasicStatus.prototype.getStatus = function () {
	return this.status;
}

LmsBasicStatus.prototype.setStatus = function (status) {
	this.status = status;
}

LmsBasicStatus.prototype.Save = function (lmscom) {
	lmscom.lesson_status = this.status;
}

///////////////////////////////////////
// Topic status
///////////////////////////////////////
LmsTopicStatus.prototype = new LmsBasicStatus();
LmsTopicStatus.prototype.constructor = LmsTopicStatus;
LmsTopicStatus.prototype.BaseClass = LmsBasicStatus.prototype;

function LmsTopicStatus() {
	this.score = "";
	this.passed = false;  // it holds the passed/failed status of the required mode only
	this.modes = new Array();
	this.modes["S"] = new Mode("S");
	this.modes["T"] = new Mode("T");
	this.modes["K"] = new Mode("K");
	this.modes["D"] = new Mode("D");
	this.modes["P"] = new Mode("P");
	this.modes["E"] = new Mode("E");

	this.anylaunched = false;  // any mode launched this attempt?
}

LmsTopicStatus.prototype.Save = function (lmscom) {
	var fname = "SaveTopicStatus";

	lmscom.lesson_data = lmscom.bigsco ? "" : this.getStatusstring();
	lmscom.lesson_status = this.getLMSStatus();
	lmscom.score = this.getScore();
}

LmsTopicStatus.prototype.setModeavail = function (m, a) {
	this.modes[m].avail = a;
}

LmsTopicStatus.prototype.getModeavail = function (m) {
	return this.modes[m].avail;
}

LmsTopicStatus.prototype.setModestatus = function (m, s) {
	if (this.modes[m].avail)
		this.modes[m].complete = s;
	else
		lmslog.addEntry(0, "setModestatus", "", "Invalid call of setModestatus");
}

LmsTopicStatus.prototype.getModestatus = function (m) {
	return this.modes[m].complete;
}

LmsTopicStatus.prototype.setRequiredMode = function (lmsModes, playerModes, lmsReqMode) {
	if (GetTopLevelLmsMode() == "LMS")
		this.requiredMode = lmsReqMode || this._getRequiredMode(lmsModes);
	else
		this.requiredMode = this._getRequiredMode(playerModes);
}

LmsTopicStatus.prototype._getRequiredMode = function (modes) {
	var modeorder = "EKTSPD";
	for (var i = 0; i < modeorder.length; i++) {
		if (modes[modeorder.charAt(i)])
			return modeorder.charAt(i);
	}
	return "None"
}

LmsTopicStatus.prototype.GetRequiredMode = function () {
	return this.requiredMode;
}

LmsTopicStatus.prototype.initTopicstat = function (s) {
	var loopVar;
	var fname = "initTopicstat";
	lmslog.addEntry(0, fname, "", "Start");
	lmslog.addEntry(0, fname, "s string", s);

	lmslog.addEntry(0, fname, "s.length", s.length);
	if (s.length != 0) {
		//split the tracking string
		var f = s.split(",");
		for (loopVar = 0; loopVar <= f.length - 1; loopVar++) {
			lmslog.addEntry(0, fname, "f[" + loopVar + "]", f[loopVar]);
			if (f[loopVar].charAt(1) == "=") {
				this.modes[f[loopVar].charAt(0)].complete = this.modeIscomplete(f[loopVar].substr(2, 1));
			}
			else if (f[loopVar].substr(0, 5) == "PASS=") {
				var flag = f[loopVar].substr(5, 1);
				this.passed = (flag !== "0");  // it will apply the required mode only
			}
			else if (f[loopVar].substr(0, 6) == "SCORE=") {
				this.score = f[loopVar].substr(6);
			}
		}
	}
}

LmsTopicStatus.prototype.clearTopicstat = function () {
	this.score = "";
	this.passed = false;
	for (var m in this.modes)
		this.modes[m].complete = false;
}

LmsTopicStatus.prototype.getStatusstring = function () {
	var fname = "get_statusstring";
	lmslog.addEntry(0, fname, "", "Start");
	var dataString = "";
	for (x in this.modes) {
		if (dataString.length != 0)
			dataString += ",";
		dataString += this.modes[x].id + "=" + (this.modes[x].complete ? "C" : "I");
	}
	if (this.modes["E"].complete) {  // if testit is available, it is the required mode
		dataString += ",PASS=" + (this.passed ? "1" : "0");
	} else if (this.requiredMode === "K" && this.modes["K"].complete && this.isScored) {
		dataString += ",PASS=" + (this.passed ? "1" : "0") + ",SCORE=" + this.score;
	}
	lmslog.addEntry(0, fname, "dataString", dataString);
	return dataString;
}

LmsTopicStatus.prototype.getStatus = function () {
	var itemstatus = "";
	if (this.isComplete()) {
		//topic is complete
		if ((this.requiredMode === "K" && this.isScored) || this.requiredMode === "E") {
			itemstatus = (this.passed) ? LMS_PASSED : LMS_FAILED;  // this.passed holds the status of the required mode, either it is knowit or testit
		}
		else {
			itemstatus = LMS_COMPLETED;
			if (this.savedStatus == "P" || this.savedStatus == "F")
				itemstatus = this.savedStatus;
		}
	} else {
		//topic is not complete
		itemstatus = LMS_INCOMPLETE;
		if (this.savedStatus == "P" || this.savedStatus == "F" || this.savedStatus == "C")
			itemstatus = Stat2Lms(this.savedStatus);
	}
	return itemstatus;
}

// Reports Not Attempted for a completed topic where no mode has been launched.
// This keep us from reporting an attempt if the user is just browsing
// the tree and doesn't do anything.
LmsTopicStatus.prototype.getLMSStatus = function () {
	if (this.isComplete() && !this.anylaunched)
		return LMS_NOT_ATTEMPTED;
	return this.getStatus();
}

LmsTopicStatus.prototype.getScore = function () {
	return this.score;
}

// Is considered complete if either the required
// mode is taken or a mode that allows the users
// to demonstrate more knowledge than the required mode
// has been taken.
// From "Play Mode Filtering in LMS"
LmsTopicStatus.prototype.isComplete = function () {
	var fname = "is_complete";
	lmslog.addEntry(0, fname, "", "Start");
	var iscomp = false;

	// if Topic has no modes hence no required mode,
	// is considered complete just by visiting it.
	if (this.requiredMode === "None" || this.modes[this.requiredMode].complete) {
		iscomp = true;
	}
	lmslog.addEntry(0, fname, "iscomp", iscomp);
	return iscomp;
}

LmsTopicStatus.prototype.modeIscomplete = function (f) {
	var ret = false;
	var fname = "modeIscomplete";
	lmslog.addEntry(0, fname, "", "Start");
	if (f == "C")
		ret = true;
	else if (f == "I")
		ret = false;
	lmslog.addEntry(0, fname, "ret", ret);
	return ret;
}

LmsTopicStatus.prototype.isRequired = function (m) {
	return this.requiredMode === m;
}

// holds the status of a single mode launch of a topic
// pretty much duplicates the code in TopicStatus so if topic mode launched
// standalone (UT mode) it can write back to kpath coordinated with a kpath
// launch of the topic
LmsTopicLaunchStatus.prototype = new LmsTopicStatus();
LmsTopicLaunchStatus.prototype.constructor = LmsTopicStatus;
LmsTopicLaunchStatus.prototype.BaseClass = LmsTopicStatus.prototype;

function LmsTopicLaunchStatus(mode) {
	this.mode = this.modes[mode];
	this.score = "";
	this.passed = false;

	this.anylaunched = true;
}

LmsTopicLaunchStatus.prototype.Save = function (lmscom) {
	var fname = "SaveTopicLaunchStatus";

	// serialize state to report back to kpath in UT mode; LMS mode will ignore
	// this and use the mode completion flag for roll-up    
	this.BaseClass.Save.call(this, lmscom);
}

LmsTopicLaunchStatus.prototype._getRequiredMode = function (modes) {
	var modeorder = "EKTSPD";
	for (var i = 0; i < modeorder.length; i++) {
		if (modes.indexOf(modeorder.charAt(i)) != -1)
			return modeorder.charAt(i);
	}
	return "None"
}

// returns result when topic is used in an assessment
LmsTopicLaunchStatus.prototype.getResult = function () {
	return this.passed ? "correct" : "incorrect";
}
LmsTopicLaunchStatus.prototype.getQuestionType = function () {
	return "other";
}
LmsTopicLaunchStatus.prototype.getLearnerResponse = function () {
	return "";
}

//////////////////////////////////////////
// Mode object definition
function Mode(mid) {
	this.avail = false;
	this.complete = false;
	this.id = mid;
}

///////////////////////////////////////
// Question status
///////////////////////////////////////
LmsQuestionStatus.prototype = new LmsBasicStatus();
LmsQuestionStatus.prototype.constructor = LmsQuestionStatus;
LmsQuestionStatus.prototype.BaseClass = LmsBasicStatus.prototype;

function LmsQuestionStatus() {
	this.question_type = null;
	this.learner_response = null;
	this.result = null;
}

LmsQuestionStatus.prototype.Save = function (lmscom) {
	lmscom.lesson_status = this.status;
	lmscom.lesson_data = Lms2Stat(this.getStatus());
}

LmsQuestionStatus.prototype.getStatus = function () {
	return this.status === LMS_NOT_ATTEMPTED ? this.savedStatus : this.status;
}

/* get/set question type */
LmsQuestionStatus.prototype.getQuestionType = function () {
	return this.question_type;
}

LmsQuestionStatus.prototype.setQuestionType = function (qtype) {
	return this.question_type = qtype;
}

/* get/set Learner Response */
LmsQuestionStatus.prototype.getLearnerResponse = function () {
	return this.learner_response;
}

LmsQuestionStatus.prototype.setLearnerResponse = function (lresp) {
	return this.learner_response = lresp;
}

LmsQuestionStatus.prototype.getResult = function () {
	return this.result;
}

LmsQuestionStatus.prototype.setResult = function (result) {
	return this.result = result;
}

///////////////////////////////////////
// Assessment status
///////////////////////////////////////
LmsAssessmentStatus.prototype = new LmsBasicStatus();
LmsAssessmentStatus.prototype.constructor = LmsAssessmentStatus;
LmsAssessmentStatus.prototype.BaseClass = LmsBasicStatus.prototype;

function LmsAssessmentStatus() {
	this.score = "";
	this.questionstatus = new Array();
	this.stateDiscarded = false;    // saved state was discarded due to change in assessment
}

LmsAssessmentStatus.prototype.Save = function (lmscom) {
	lmscom.lesson_status = this.status;

	if (this.status != LMS_INCOMPLETE &&
        this.status != LMS_NOT_ATTEMPTED)
		lmscom.score = this.score;
	else
		lmscom.score = "";

	var str = "";
	if (!lmscom.bigsco) {
		str = this.hash.length + "@" + this.hash;
		var ql = this.questionlimit.toString();
		str += ql.length + "@" + ql;
	}
	// if a new attempt and we didn't do anything, keep old saved status    
	str += this.status == LMS_NOT_ATTEMPTED ? this.savedStatus : Lms2Stat(this.status);
	for (var i = 0; i < this.questionstatus.length; i++)
		str += this.questionstatus[i];
	lmscom.lesson_data = str;
}

LmsAssessmentStatus.prototype.getStatus = function () {
	return this.status === LMS_NOT_ATTEMPTED ? Stat2Lms(this.savedStatus) : this.status;
}

LmsAssessmentStatus.prototype.getLMSStatus = function () {
	return this.status;
}
/* get/set Learner Response */
LmsAssessmentStatus.prototype.getScore = function () {
	return this.score;
}

LmsAssessmentStatus.prototype.setScore = function (score) {
	return this.score = score;
}

///////////////////////////////////////
// TOC status
///////////////////////////////////////
LmsTOCStatus.prototype = new LmsBasicStatus();
LmsTOCStatus.prototype.constructor = LmsTOCStatus;
LmsTOCStatus.prototype.BaseClass = LmsBasicStatus.prototype;

function LmsTOCStatus() {
}

LmsTOCStatus.prototype.getStatus = function () {
	return Stat2Lms(this.getTocState().GetStatus(0));
}

LmsTOCStatus.prototype.Save = function (lmscom) {
	lmscom.lesson_status = this.getStatus();

	var tocstat = this.getTocState();
	lmscom.lesson_data = tocstat.SerializeTOC();
}

/* get/set the state structure for the entire
TOC */
LmsTOCStatus.prototype.getTocState = function () {
	return this.tocstate;
}

LmsTOCStatus.prototype.setTocState = function (tocstate) {
	return this.tocstate = tocstate;
}

function NodeState() {
	this.Status = 'N';
	this.Score = null;
	this.ChildrenStatus = "";
}

/* class that holds the state of the tree */
function TOCState(count, tocversion) {
	this.NodeCounter = count;
	this.TocVersion = tocversion;

	this.InitInLookupTable();
}

/* sets the status of the outline element based on its index */
TOCState.prototype.SetStatus = function (index, status) {
	if (!this.LookUpTable[index])
		this.LookUpTable[index] = new NodeState();
	this.LookUpTable[index].Status = status;
}

/* gets the status of the outline element based on its index */
TOCState.prototype.GetStatus = function (index) {
	return this.LookUpTable[index].Status;
}

/* sets the score of the outline element based on its index */
TOCState.prototype.SetScore = function (index, score) {
	if (!this.LookUpTable[index])
		this.LookUpTable[index] = new NodeState();

	this.LookUpTable[index].Score = score;
}

/* gets the score of the outline element based on its index */
TOCState.prototype.GetScore = function (index) {
	return this.LookUpTable[index].Score;
}

/* sets the score of the outline element based on its index */
TOCState.prototype.SetChildren = function (index, ChildrenStatus) {
	if (!this.LookUpTable[index])
		this.LookUpTable[index] = new NodeState();

	this.LookUpTable[index].ChildrenStatus = ChildrenStatus;
}

/* gets the score of the outline element based on its index */
TOCState.prototype.GetChildren = function (index) {
	return this.LookUpTable[index].ChildrenStatus;
}

/* Deserializes the persisted state (str) into the TOC XML
outline structure */
TOCState.prototype.DeserializeTOC = function (str) {
	var count = 0;
	var version;

	var index = str.indexOf("@");
	var count;

	if (index > 0) {
		count = parseInt(str.substring(0, index));
		version = str.substring(index + 1, index + count + 1);
	}
	else
		return;

	/* if the TOC has changed since last 
    time data was persisted, throw away the 
    persisted data */
	if (version != this.TocVersion)
		return;

	var statusstr = str.substring(index + count + 2);

	index = statusstr.indexOf("@");
	if (index > 0) {
		count = parseInt(statusstr.substring(0, index));
		statusstr = statusstr.substring(index + 1, index + count + 1);

		/* if the status string isn't equal to the 
        count we stored for it,then the string got 
        truncated by the LMS because it was too big
        so throw away the data */
		if (statusstr.length != count)
			return;
	}
	else
		return;

	statusstr = this.RLESDecode(statusstr);
	str = this.DeserializeLookUpTable(statusstr);
}

/* Deserializes the persisted state (str) of just the tree portion 
of the outline into the XML outline structure */
TOCState.prototype.DeserializeLookUpTable = function (str) {
	var count = 0;
	var score = "";

	for (var i = 0; i < str.length; i++) {
		var status = str.charAt(i);
		this.SetStatus(count, status);

		score = "";
		while (i < str.length - 1 && str.charAt(i + 1) >= "0" && str.charAt(i + 1) <= "9") {
			i++;
			score += str.charAt(i);
		}

		if (score.length > 0)
			this.SetScore(count, parseInt(score));

		if (i < str.length - 1 && str.charAt(i + 1) == "{") {
			var j = str.indexOf("}", i + 2);
			this.SetChildren(count, str.substring(i + 2, j));
			i = j;
		}

		count++;
	}
}

//this.TocVersion.length
TOCState.prototype.SerializeTOC = function () {
	var statusstr = this.RLESEncode(this.SerializeLookupTable());
	return this.TocVersion.length + "@" + this.TocVersion + " " + statusstr.length + "@" + statusstr;
}

TOCState.prototype.SerializeLookupTable = function () {
	var str = '';

	for (var i = 0; i < this.NodeCounter; i++) {

		var status = this.LookUpTable[i].Status;
		var score = this.LookUpTable[i].Score;
		var childrenstatus = this.LookUpTable[i].ChildrenStatus;

		if (!status) status = "N";

		str += status;
		//        if (score !== null)
		//            str += score;

		if (childrenstatus)
			str += "{" + childrenstatus + "}";
	}

	return str;
}

TOCState.prototype.InitInLookupTable = function () {
	this.LookUpTable = new Array();

	for (var i = 0; i < this.NodeCounter; i++) {
		this.LookUpTable[i] = new NodeState();
	}
	this.SetStatus(0, "I");
}

/* Run lenght encode (RLE) the string to compress the storage */
TOCState.prototype.RLESEncode = function (str) {
	var last = '';
	var run = 0;
	var outstr = '';

	last = str.charAt(0);
	run = 1;

	for (var i = 1; i < str.length; i++) {
		if (str.charAt(i) == last) {
			run++;
		}
		else {
			if (run > 2) {
				outstr += "#";
				outstr += run;
				outstr += last;
			}
			else {
				outstr += str.substring(i - run, i)
			}

			last = str.charAt(i);
			run = 1;
		}
	}

	if (run > 2) {
		outstr += "#";
		outstr += run;
		outstr += last;
	}
	else {
		outstr += str.substring(i - run, i)
	}

	return outstr;
}

/* Run lenght decode (RLE) the string */
TOCState.prototype.RLESDecode = function (str) {
	var outstr = '';
	var runcountstr = '';
	var runcount;

	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == '#') {
			runcountstr = '';
			i++;
			while (str.charAt(i) >= "0" && str.charAt(i) <= "9") {
				runcountstr += str.charAt(i);
				i++;
			}

			runcount = parseInt(runcountstr);
			for (var j = 0; j < runcount; j++)
				outstr += str.charAt(i);
		}
		else
			outstr += str.charAt(i);
	}

	return outstr;
}

function Lms2Stat(lmsStatus) {
	return lmsStatus.charAt(0).toUpperCase();
}

function Stat2Lms(status) {
	return [LMS_PASSED, LMS_FAILED, LMS_COMPLETED, LMS_INCOMPLETE, LMS_NOT_ATTEMPTED]["PFCIN".indexOf(status)];
}
/////////////////////
// LogEntry object //
/////////////////////

function LogEntry(startdate, ltype, funcname, varname, msgval) {
	this.logType = ltype;
	this.funcName = funcname;
	this.varName = varname;
	this.msgValue = msgval;
	this.dateTime = new Date().getTime() - startdate;   //Store the entry time in millisecs after the log started
	//alert(this.toString());
}

LogEntry.prototype.GetTableRow = function (i) {
	var typeMsg = "Info";
	var color = "#006600";

	if (this.logType === 1) {
		typeMsg = "LMS Comm";
		color = "#000033";
	}

	var varName = this.varName;
	if (varName === "") { varName = "&nbsp;"; }

	var msgValue = this.msgValue;
	if (msgValue === "") { msgValue = "&nbsp;"; }

	var html = "<tr>";
	html += "<td align='right'>" + (this.dateTime / 1000) + "</td>";
	html += "<td style='color:" + color + ";'>" + this.funcName + "</td>";
	html += "<td>" + varName + "</td>";
	html += "<td>" + msgValue + "</td>";
	html += "</tr>";

	return html;
}


////////////////
// Log object //
////////////////
function Log(active) {
	this.traceWindow = null;
	this.logArray = new Array();
	this.enabled = active;
	this.startDateTime = new Date();
	this.changed = true;    // Flag for letting external parties know when the log has changed
	this.windowReady = false;
	this.startLog();
}

Log.prototype.startLog = function () {
	if (this.enabled) {
		//this.log_string += "<table border='1'><tr><td>Type</td><td>Function</td><td>Variable</td><td>Message</td></tr>";
		this.addEntry(0, "initLog", "", "Log Intialized");
		this.openTraceWindow();
	}
}

Log.prototype.addEntry = function (ltype, funcname, varname, msgval) {
	if (this.enabled) {
		this.logArray.push(new LogEntry(this.startDateTime.getTime(), ltype, funcname, varname, msgval));
		this.changed = true;
		if (this.traceWindow && this.windowReady)
			this.traceWindow.UpdateTraceStack();
	}
}

Log.prototype.writeLog = function (sortOrder, traceLength) {
	var t = traceLength;
	if (t > this.logArray.length || t == 0) {
		t = this.logArray.length;
	}

	var html = "<table width='600'>";
	html += "<tr>";
	html += "<th colspan=4>Session start: " + this.startDateTime + "</th>";
	html += "</tr>";

	html += "<tr>";
	html += "<th>time</th>";
	html += "<th>function</th>";
	html += "<th>variable</th>";
	html += "<th>message</th>";
	html += "</tr>";

	var logEntry;
	if (sortOrder == 0) {
		for (var i = this.logArray.length - t; i < this.logArray.length; i++) {
			logEntry = this.logArray[i];
			html += logEntry.GetTableRow(i);
		}
	} else {
		for (var i = this.logArray.length - 1; i >= this.logArray.length - t; i--) {
			logEntry = this.logArray[i];
			html += logEntry.GetTableRow(i);
		}
	}
	html += "</table>";

	this.changed = false;   // Reset the changed flag
	this.windowReady = true;    // window initiates first call to writelog, so we know we're up
	return html;
}

Log.prototype.writeDetails = function (i) {
	return this.logArray[i].GetDetails();
}

Log.prototype.openTraceWindow = function () {
	if (this.traceWindow == null) {
		this.changed = true;
		this.traceWindow = window.open(lms_path + "html/lmsdebug.html", "_blank");
	}
}

/* lms_init.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// javascript include area

/*
if (typeof lms_path == 'undefined')
lms_path = "../../../";

document.write('<script type="text/javascript" src="' + lms_path + 'kpsettings.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/scormoptions.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/lmsoptions.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/lmsapplet.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/lmsresource.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/lmscomfactory.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/lmscom.js"></script>');
document.write('<script type="text/javascript" src="' + lms_path + 'js/escape.js"></script>');



<script type="text/javascript" src="kpsettings.js"></script>
<script type="text/javascript" src="js/scormoptions.js"></script>
<script type="text/javascript" src="js/lmsoptions.js"></script>
<script type="text/javascript" src="js/lmsapplet.js"></script>
<script type="text/javascript" src="js/lmsresource.js"></script>
<script type="text/javascript" src="js/lmscomfactory.js"></script>
<script type="text/javascript" src="js/lmscom.js"></script>
<script type="text/javascript" src="js/escape.js"></script>


*/

// launch mode determination

var _lmsMode = null;          // LMS, KPT, Cookie or undefined

var _lmsParser = null;

function InitLmsMode(source) {
    if (_lmsParser == null) {
        _lmsParser = new UrlParser();
        _lmsParser.Parse();

        if (IsTouchDevice() && source == "player") {
            if (parent == null || (window.location == parent.location)) {
                if (_lmsParser.GetParameter("directlaunch") == null)
                    _lmsParser.params.directlaunch = 2;         // check by closing
            }
        }

        // direct launch
        if (source == "player") {
            if (_lmsParser.GetParameter("directlaunch") != null) {
                _lmsMode = (Kpath_launch == true ? "KPT" : "Cookie");
            }
        }

        // lmstart
        else if (source == "lmstart") {
            if (_lmsParser.GetParameter("toc") != null) {
                // _lmsMode = null;
            }
            else if (_lmsParser.GetParameter("dhtml") != null) {
                _lmsMode = (Kpath_launch == true ? "KPT" : "Cookie");
            }
            else {
                _lmsMode = "LMS";
            }
        }

        // toc
        else if (source == "toc") {
            if (_lmsParser.GetParameter("sco") == null) {
                _lmsMode = (Kpath_launch == true ? "KPT" : "Cookie");
            }
        }

        else {
            alert(R_undefined_lms_source);
        }
    }
}

function GetTopLevelLmsMode() {
    return _GetTopLevelLmsMode(this);
}

function _GetTopLevelLmsMode(w) {
    var m = w._lmsMode;
    if (m == null) {
        return _GetTopLevelLmsMode(w.lms_store.parentW);
    }
    return m;
}

// common lms callback functionality

var lms_initialized = false;

var lms_store;

var lmslog;

// lms_InitPage()
// called from onLoad event
function lms_InitPage(childIndex, parentW, cguid, callbackfunction) {
    if (lms_initialized == true) {
        setTimeout(callbackfunction, 1);
        return;
    }
    __Ialert("lms_InitPage called with parameters:" + childIndex + "," + parentW + "," + cguid + "," + callbackfunction);
    var istestit = false;
    if (window.lmsModes) {
    	if (typeof window.lmsModes == "string") {
    		istestit = window.lmsModes.indexOf('E') > -1;
    	}
    	else {
    		istestit = window.lmsModes['E'] === true;
    	}
    }
    lms_store = { window: window,
        childIndex: childIndex,
        parentW: parentW,
        cguid: cguid,
        isTestIt: istestit,
        callbackfunction: callbackfunction
    };

    if (!parentW || parentW.closed) {
        lmslog = new Log(LmsConfig.DebugMode);
        InitializeLmsCom();
        InsertRuntimeAPI(lms_LoadRuntimeComplete);
    } else {
        if (!parentW.lms_initialized) return; // handle funky refresh handling of Firefox
        lmslog = parentW.lmslog;
        setTimeout(lms_LoadRuntimeComplete, 1);
    }
}

function lms_LoadRuntimeComplete() {
    __Ialert("lms_LoadRuntimeComplete() called");
    if (lms_store.parentW && !lms_store.parentW.closed) {
        lms_store.parentW.GetChildLmsCom(lms_store);
    } else if (!lms_store.parentW && !lms_store.cguid && !window.bigScoItemCount) { // launching a non-bigsco toc
        // NB: window.bigScoItemCount will only be defined in the lmstart page of a big sco
        document.LmsCom = PlayerConfig.EnableCookies ? new LmsComCookie() : new LmsComBase();
    } else {
        CheckForLMSAPI();
        document.LmsCom = _GlobalLmsComFactory.CreateLmsCom();
    }
    var lmscom = document.LmsCom;

    lmscom.guid = lms_store.cguid;
    lmscom.isTestIt = lms_store.isTestIt;
    lmscom.owner = window;
    lmscom.LoadAPIAdapter(lms_LoadAdapterComplete);
}

// lms_UpdateUI()
// called from first level assets to update the UI status bar
function lms_UpdateUI(status) {
    try {
        if (parent && parent.updateUI)
            parent.updateUI(status);
    } catch (e) { }
}

// lms_ClosePage()
// called from onUnload event
var hasClosed = false;
function lms_ClosePage(callClose) {
    __Ialert("lms_ClosePage() called");
    if (hasClosed == true)
        return;
    hasClosed = true;
    var lmscom = document.LmsCom;
    if (!lmscom || !lmscom.session_active)
        return;
    var childlmscom = lmscom.child;
    if (childlmscom && childlmscom.session_active && childlmscom.owner && !childlmscom.owner.closed)
        childlmscom.owner.lms_ClosePage(true);
    childlmscom = lmscom.ancillaryChild;    // close see also trail, if any
    if (childlmscom && childlmscom.session_active && childlmscom.owner && !childlmscom.owner.closed)
        childlmscom.owner.lms_ClosePage(true);
    if (window._closePage)
        _closePage();   // do any asset specific stuff
    if (lmscom.session_active) {    // test if our twin (lmstart/lmsui) snuck in (FF)
        lmscom.SaveStatus();
        lmscom.End();
        lmscom.NotifyParent();
    }
    if (callClose)
        window.close();
}

// connection drop
function lms_ConnectionLost(errText) {
    if (window.ConnectionLostEvent)
        ConnectionLostEvent(errText);
    if (lms_store.parentW && !lms_store.parentW.closed)
        lms_store.parentW.lms_ConnectionLost(errText);
}

function lms_IsConnected() {
    var lmscom = document.LmsCom;
    if (lmscom)
        return lmscom.IsConnected();
    return false;
}

// KPath logout
function lms_IsKPathLogoutAvailable() {
    return !!window.Kpath_logout_available;
}

function _logout(closeWindow) {
    if (lms_store.parentW && !lms_store.parentW.closed && lms_store.parentW._logout) {
        lms_store.parentW._logout(false);
    } else if (window.Kpath_logout_URL) {
        if (GetTopLevelLmsMode() == "LMS") {
            window.parent.parent.location.replace(Kpath_logout_URL);
        } else if (closeWindow) {   // need to logout through the opener window
            if (window.opener && !window.opener.closed) {
                window.opener.location.replace(Kpath_logout_URL);
                window.close();
            } else {    // if no opener available, must logout through full screen topic window
                window.location.replace(Kpath_logout_URL);
            }
        } else {
            window.location.replace(Kpath_logout_URL);
        }
    }
}

// user profile (so it is accessible from everywhere)
function lms_IsUserProfileAvailable() {
    __alert("lms_IsUserProfileAvailable() called");
    if (GetTopLevelLmsMode() !== "KPT")
        return false;
    return document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

function lms_GetUserProfileUrl() {
    __alert("lms_GetUserProfileUrl() called");
    if (Kpath_launch == false)
        return "";
    return Kpath_profile_URL + "?UPKLaunch=true";
}

function GetNoSound() {
    if (lms_store.parentW && !lms_store.parentW.closed)
        return lms_store.parentW.GetNoSound();
    else
        return lms_store.noSound;
}

function SetNoSound(value) {
    lms_store.noSound = value;
}

// lms callback trace functions

var _lms_show_all_alert = false;

function __alert(s) {
    if (_lms_show_alert || _lms_show_all_alert)
        alert(s + "\nfile: " + _lms_module_name);
}

function __Ialert(s) {
    if (_lms_show_alert || _lms_show_Ialert || _lms_show_all_alert)
        alert(s + "\nfile: " + _lms_module_name);
}
/* lms_topic.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// include lms_init.js
/*
document.write('<script> lms_path="../../../"</script>');
document.write('<script type="text/javascript" src="../../../js/lms_init.js"></script>');
*/
var _modeLaunch = "incomplete";	// LMS_INCOMPLETE not ready yet?
var _feedbackUrlArgs = "";

// callback functions from topic

function lms_LoadAdapterComplete() {
	__alert("lms_LoadAdapterComplete() called");

	var lmscom = document.LmsCom;
	lmscom.Begin();
	if (lmscom.assessment_guid)
		lmscom.doSetUPKValue("upk.actual_guid", lmscom.assessment_guid);
	lmscom.utPushModeIndex();    // set up for UT tracking if under kpath

	// recall the topic player, do not remove
	lms_initialized = true;
	setTimeout(lms_store.callbackfunction, 1);
}

function GetChildLmsCom(child_store) {
	__Ialert("lms_GetChildLmsCom() called");
	var lmscom = document.LmsCom;
	var childlmscom = child_store.window.document.LmsCom = new LmsComBase(lmscom);
	childlmscom.owner = child_store.window;
	lmscom.child = childlmscom;
}

function ListenChildClose() {
	__alert("lms_ListenChildClose() called");

	var lmscom = document.LmsCom;

	var childlmscom = lmscom.child;
	if (childlmscom) {
		var topicStat = lmscom.status_obj
		var launchStat = childlmscom.status_obj;
		var mode = topicStat.modes[childlmscom.status_obj.mode.id];
		mode.complete = launchStat.mode.complete;
		lmscom.utPopModeIndex();
		lmscom.doit_child_time += childlmscom.end_date - childlmscom.start_date;
	}
}

// asset specific processing called from lms_init on ClosePage
// End the UT session. Pulled out of topicFinish so that it can be called from ClosePage in case topic is exited before
// being completed.
function _closePage() {
	var lmscom = document.LmsCom;
	var endTime = new Date();
	lmscom.utRecordEndTime(endTime);
	lmscom.utRecordTimespan(lmscom.computeTime2(lmscom.start_date, endTime))
	lmscom.utRecordCompletionStatus(_modeLaunch);
}

// called when a mode is selected to launch the topic in order to set up the
// child lmscom object
function lms_LaunchTopic(mode) {
	__alert("lms_LaunchTopic(" + mode + ") called");

	var lmscom = document.LmsCom;

	if (mode == "P") {
		lmscom.utPushModeIndex();
		lmscom.utRecordType("print_it");
		lmscom.utRecordStartTime(new Date());
		lmscom.utRecordEndTime(new Date());
		lmscom.utRecordCompletionStatus(LMS_COMPLETED);
		lmscom.utPopModeIndex();
		lmscom.status_obj.setModestatus("P", true);
		lmscom.SaveStatus();
		return;
	}
}

// lms_topicStart(guid,mode)
// called when a topic starts
function lms_topicStart(guid, mode) {
	__alert("lms_topicStart() called with parameters: " + guid + "," + mode);
	var lmscom = document.LmsCom;
	var reqMode = ((lmsModes.indexOf("E") > -1) || (typeof lmsReqMode === "undefined")) ? null : lmsReqMode;
	if (lmscom.assessment_guid) // if in an assessment, make sure knowit is in modes so it will be reported scored
		lmscom.OpenTopicLaunchStatus(mode, lmsModes + 'K', playerModes + 'K', reqMode);
	else
		lmscom.OpenTopicLaunchStatus(mode, lmsModes, playerModes, reqMode);
	if (lmscom.lesson_status === LMS_NOT_ATTEMPTED && lmscom.status_obj.isComplete()) {    // new attempt with kpath-persisted data
		lmscom.status_obj.clearTopicstat();    // clear out old state
	}

	var modeType = ["see_it", "try_it", "know_it", "do_it", "print_it", "test_it"]["STKDPE".indexOf(mode)];
	lmscom.utRecordType(modeType);
	lmscom.utRecordStartTime(new Date());
}

// lms_topicFinish(guid)
// called when a topic finishes
function lms_topicFinish(guid) {
	__alert("lms_topicFinish() called with parameter: " + guid);
	var lmscom = document.LmsCom;
	lmscom.status_obj.mode.complete = true;
	_modeLaunch = LMS_COMPLETED;
}

// lms_frameView(guid, mode, frameid)
// called when a frame appears
function lms_frameView(guid, mode, frameid) {
	__alert("lms_frameView() called with parameter: " + guid + "," + mode + "," + frameid);
	var lmscom = document.LmsCom;
	lmscom.utRecordFrameViewed(frameid);
	_feedbackUrlArgs = "&FrameID=" + frameid + "&UPKMode=" + mode;
}

// lms_knowitScore(guid, score, passed)
// called when a topic finished in knowit mode
function lms_knowitScore(guid, score, passed) {
	__alert("lms_knowitScore called with parameter: " + guid + "," + score + "," + passed);
	var lmscom = document.LmsCom;
	lmscom.status_obj.mode.complete = true;
	lmscom.status_obj.score = score;
	lmscom.status_obj.passed = passed;
	lmscom.utRecordSuccessStatus(passed ? "passed" : "failed");
	lmscom.utRecordScoreScaled(score / 100);
}

function lms_getUserName() {
	var lmscom = document.LmsCom;
	var username = lmscom.student_name;
	return username;
}

function lms_sendTestItResult(status, result) {
	__alert("lms_sendTestItResult called with parameter: " + result);
	var lmscom = document.LmsCom;
	lmscom.status_obj.passed = (status == 1);
	lmscom.utRecordSuccessStatus(status == 1 ? "passed" : (status == 2 ? "failed" : "unknown"));
	lmscom.utSendTestItResult(result);
}

function lms_KPathLogout() {
	_logout(true);
}

//----------------------------------------------------------------------------------------------/

var _lms_module_name = "lms_topic.js";
var _lms_show_alert = false;
var _lms_show_Ialert = false;
/* popup.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/


var appOpened = true;
var oPopup;
var oPopBody;
var i = 0;
var constPad = 8;
var popHeight = 400;
var popWidth = 275;
var currentPos = 0;
var MainTopPos;
var MainLeftPos;
var newwindow = '';
var isIE = upk.browserInfo.isExplorer();
var popupVersion = false;

var pss = document.location.hash.substring(1);
var pstrArgs = pss.split("&");
if (pstrArgs.length == 0 || pstrArgs[0] == "") {
	pss = document.location.search.substring(1);
	pstrArgs = pss.split("&");
}
if (pstrArgs.length == 1) {
	if (pstrArgs[0].toLowerCase().substr(0, 3) == "su=") {
		safeUriMode = true;
		var ps = Escape.SafeUriUnEscape(pstrArgs[0].substr(3));
		pstrArgs = ps.split("&");
	}
}

for (var i = 0; i < pstrArgs.length; i++) {
	if (pstrArgs[i].substr(0, 6).toLowerCase() == "popup=") {
		popupVersion = true;
	}
}
var TopPos;
var LeftPos;
if (isIE && popupVersion) {
	TopPos = screen.availHeight - popHeight - constPad;
	LeftPos = screen.availWidth - popWidth - constPad;
}
else {
	TopPos = window.screenTop != undefined ? window.screenTop : window.screenY;
	LeftPos = window.screenLeft != undefined ? window.screenLeft : window.screenX;
}
var TaskBarHeight = 0;
var idPostFix = '';
var eventTarget = null;

//Detects the IE version
if (isIE && popupVersion) {
	var appVerArray = navigator.appVersion.split(";");
	var appVer = appVerArray[1];
	appVer = appVer.substr(6)
	appVer = parseFloat(appVer);
}
else {
	constPad = 12;
	TaskBarHeight = 25;
	TopPos = TopPos - TaskBarHeight
}

//Creates the popup if IE 5.5 or higher
if (isIE && popupVersion) oPopup = window.createPopup();
else oPopup = window;

if (!(isIE && popupVersion)) idPostFix = 'FF';

//used to grab elements regardless of browser
function getID(ID) {
	if (document.all) {
		return document.all(ID);
	}
	else {
		return document.getElementById(ID);
	}
}

function oPopup_show(l, t, w, h, hide) {
	if (!popHidden && isIE && popupVersion) {
		oPopup.show(l, t, w, h);
		if (!hide) {
			LeftPos = oPopup.document.parentWindow.screenLeft;
			TopPos = oPopup.document.parentWindow.screenTop;
		}

	}
}

//Used by the popup only.  Reloads the Popup if it is hidden
function RePop() {
	if (window.screenLeft >= -1000 && window.screenTop >= -1000 && isIE && popupVersion) {
		if (!popHidden && !oPopup.isOpen && appOpened) {
			oPopup_show(LeftPos, TopPos, popWidth, popHeight);
		}
	}
	if (window.screenLeft <= 3000 && isIE && popupVersion && !popHidden) {
		try {
			window.moveTo(4000, 4000);
		}
		catch (err) {
		}
	}
}
//Initializes all of the popups Attributes
function InitPopUp() {
	if (isIE && popupVersion) {
		oPopBody = oPopup.document.body;
		oPopBody.innerHTML = getID("oContextHTML0").innerHTML;
		oPopBody.ondragstart = EventCancel;
	}
	else {
		oPopBody = document.body;
		document.getElementById("noPopupFF").style.display = "inline";
		if (isIE) {
			oPopBody.onmousedown = EventCancel
			oPopBody.ondragstart = EventCancel;
//			Get_Element("cameraFF").onmousedown = function () { SSEH(this); }
//			Get_Element("giSplitter" + idPostFix).onmousedown = function () { GGGSplitD(this); }
			window.onresize = function () { GICloseAction(); GIOnResize(); };
		}
		else {
			oPopBody.addEventListener("mousedown", function (event) { EventCancel(event); }, false);
			window.addEventListener("resize", GICloseAction, true);
			window.addEventListener("resize", GIOnResize, true);
//			Get_Element("cameraFF").addEventListener("mousedown", SSEH, true);
//			Get_Element("giSplitter" + idPostFix).addEventListener("mousedown", GGGSplitD, true);
		}
		window.onbeforeunload = closeAp;
	}
	if (IsTouchDevice()) {
		$("#camera" + idPostFix).css({"overflow": "scroll", "-webkit-overflow-scrolling": "touch"})
		$("#giSplitter").bind("touchstart", SplitStart);
		$("#giToggleFF").bind("touchstart", SplitStart);
	} else {
		$("#giSplitter").bind("mousedown", SplitStart);
		$("#camera" + idPostFix).bind("mousedown", SSPanStart);
	}

	oPopBody.oncontextmenu = EventCancel;
	//    oPopBody.onkeydown = EventCancel;
	//	document.onkeypress = CheckFrameIDKeys;
	if (DoItConfig.DoItBackgroundColor != '') { oPopBody.style.backgroundColor = DoItConfig.DoItBackgroundColor; }
	else if (GIbgcolor) { oPopBody.style.backgroundColor = GIbgcolor; }
	else { oPopBody.style.backgroundColor = "#FEFECE"; }
	oPopBody.style.color = "black";
	$("#giSplitter").css("background-color", DoItConfig.DoItBorderColor);
	$(oPopup.document).find("#splitterDiv").css("background-color", DoItConfig.DoItBorderColor);
	if (isIE && popupVersion) {
		oPopBody.style.border = "solid 3px";
		oPopBody.style.borderColor = DoItConfig.DoItBorderColor;
		oPopBody.style.borderBottomWidth = "2px";
	}
	oPopBody.aLink = "blue";
	oPopBody.vLink = "blue";
	if (isIE && popupVersion) {
		oPopBody.attachEvent("onmousemove", BodyMove);
		oPopBody.attachEvent("onmousedown", GISizePopup);
	}
	oPopup_show(LeftPos, TopPos, popWidth, popHeight);
}
//This will load the initial page
var PopIV = null;
var noStart = false;
function Load() {
	//	GetCorrectImage();

	GIPlayer = self;

	loadtemp();

	GINoCookieSave = false;

	InitPopUp();
	if (isIE && popupVersion) {
		PopIV = setInterval(RePop, 250);
	}
	//	window.blur();

}

var resizdir = 0;
var resizbdown = false;
function BodyMove() {
	//alert("hello")
	var e = oPopBody.ownerDocument.parentWindow.event;
	//	GIInfoFrame.innerHTML=GICamera.scrollLeft + ",,," + GICamera.scrollTop
	if ((e.srcElement.id == "movePopup" || e.srcElement.id == "movePopup2") && !resizbdown) {
		resizdir = "move"
		return;
	}
	if ((e.srcElement.id == "resizeSE" || ((e.clientX >= popWidth - 3 && e.y >= popHeight - 15) || (e.clientX >= popWidth - 15 && e.y >= popHeight - 3))) && !resizbdown) {
		oPopBody.style.cursor = "se-resize";
		resizdir = "se"
		return;
	}
	if (((e.clientX <= 3 && e.clientY <= 15) || (e.clientY <= 3 && e.clientX <= 15)) && !resizbdown) {
		oPopBody.style.cursor = "nw-resize";
		resizdir = "nw"
		return;
	}
	if (((e.clientX <= 3 && e.clientY >= popHeight - 15) || (e.clientY >= popHeight - 3 && e.clientX <= 15)) && !resizbdown) {
		oPopBody.style.cursor = "sw-resize";
		resizdir = "sw"
		return;
	}
	if (((e.clientX >= popWidth - 15 && e.clientY <= 3) || (e.clientY <= 15 && e.clientX >= popWidth - 3)) && !resizbdown) {
		oPopBody.style.cursor = "ne-resize";
		resizdir = "ne"
		return;
	}
	if (e.clientY >= popHeight - 3 && !resizbdown) {
		oPopBody.style.cursor = "s-resize";
		resizdir = "s"
		return;
	}
	if (e.clientX >= popWidth - 3 && !resizbdown) {
		oPopBody.style.cursor = "e-resize";
		resizdir = "e"
		return;
	}
	if (e.clientX <= 3 && !resizbdown) {
		oPopBody.style.cursor = "w-resize";
		resizdir = "w"
		return;
	}
	if (e.clientY <= 3 && !resizbdown) {
		oPopBody.style.cursor = "n-resize";
		resizdir = "n"
		return;
	}
	oPopBody.style.cursor = "auto";
	if (!resizbdown) {
		resizdir = 0;
		//			oPopBody.detachEvent("onmousedown",GISizePopup);
		//			window.status="detach"
	}

}

var captobj = null;
var doresize = false;
var rIV = null;
function GIResize() {
	doresize = true;
}

function GISizePopup() {
	if (!resizdir) return;
	var e = oPopup.document.parentWindow.event;
	if (e.button != 1) return;
	var s = e.type;
	if (s == "mousedown" && e.button == 1) {
		captobj = e.srcElement;
		resizeStartPos = { left: LeftPos - e.screenX, width: popWidth + e.screenX, width2: popWidth - e.screenX, right: LeftPos + popWidth, top: TopPos - e.screenY, height: popHeight + e.screenY, height2: popHeight - e.screenY, bottom: TopPos + popHeight }
		resizbdown = true;
		captobj.setCapture();
		rIV = setInterval(GIResize, 15)
		captobj.attachEvent("onmousemove", GISizePopup);
		captobj.attachEvent("onmouseup", GISizePopup);
		return;
	}
	if (s == "mouseup") {
		if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
			GICookie["Cleft"] = LeftPos;
			GICookie["Ctop"] = TopPos;
			GICookie["Cwidth"] = popWidth;
			if (ScreenshotVisible) GICookie["Cheight"] = popHeight;
			else GICookie["Cheight"] = popHeight + SavedSSHeight;
			//			GICookie["s1"]=oPopup.document.getElementById("split1").style.height;
			//			GICookie["s2"]=oPopup.document.getElementById("split2").style.height;
			GICookie["Csss"] = ScreenshotVisible + 1;
			GICookie.Store()
		}

		resizbdown = false;
		clearInterval(rIV);
		captobj.detachEvent("onmousemove", GISizePopup);
		captobj.detachEvent("onmouseup", GISizePopup);
		captobj.releaseCapture();
		//			window.status="up"
		resizeStartPos = null;
		return;
	}
	if (!resizeStartPos || !doresize)
		return;

	doresize = false;
	switch (resizdir) {
		case "move":
			LeftPos = resizeStartPos.left + e.screenX;
			TopPos = resizeStartPos.top + e.screenY;
			break;
		case "se":
			popHeight = resizeStartPos.height2 + e.screenY;
			popWidth = resizeStartPos.width2 + e.screenX;
			if (LeftPos + popWidth > screen.width) popWidth = screen.width - LeftPos;
			if (TopPos + popHeight > screen.height) popHeight = screen.height - TopPos;
			break;
		case "ne":
			popHeight = resizeStartPos.height - e.screenY;
			popWidth = resizeStartPos.width2 + e.screenX;
			TopPos = resizeStartPos.top + e.screenY;
			if (TopPos < 0) popHeight = resizeStartPos.bottom;
			if (TopPos + 200 > resizeStartPos.bottom) TopPos = resizeStartPos.bottom - 200;
			if (LeftPos + popWidth > screen.width) popWidth = screen.width - LeftPos;
			break;
		case "nw":
			popWidth = resizeStartPos.width - e.screenX;
			LeftPos = resizeStartPos.left + e.screenX;
			popHeight = resizeStartPos.height - e.screenY;
			TopPos = resizeStartPos.top + e.screenY;
			if (LeftPos < 0) popWidth = resizeStartPos.right;
			if (TopPos < 0) popHeight = resizeStartPos.bottom;
			if (LeftPos + 150 > resizeStartPos.right) LeftPos = resizeStartPos.right - 150;
			if (TopPos + 200 > resizeStartPos.bottom) TopPos = resizeStartPos.bottom - 200;
			break;
		case "sw":
			popHeight = resizeStartPos.height2 + e.screenY;
			popWidth = resizeStartPos.width - e.screenX;
			LeftPos = resizeStartPos.left + e.screenX;
			if (TopPos + popHeight > screen.height) popHeight = screen.height - TopPos;
			if (LeftPos + 150 > resizeStartPos.right) LeftPos = resizeStartPos.right - 150;
			if (LeftPos < 0) popWidth = resizeStartPos.right;
			break;
		case "w":
			popWidth = resizeStartPos.width - e.screenX;
			LeftPos = resizeStartPos.left + e.screenX;
			if (LeftPos + 150 > resizeStartPos.right) LeftPos = resizeStartPos.right - 150;
			if (LeftPos < 0) popWidth = resizeStartPos.right;
			break;
		case "n":
			popHeight = resizeStartPos.height - e.screenY;
			TopPos = resizeStartPos.top + e.screenY;
			if (TopPos + 200 > resizeStartPos.bottom) TopPos = resizeStartPos.bottom - 200;
			if (TopPos < 0) popHeight = resizeStartPos.bottom;
			break;
		case "e":
			popWidth = resizeStartPos.width2 + e.screenX;
			if (LeftPos + popWidth > screen.width) popWidth = screen.width - LeftPos;
			break;
		case "s":
			popHeight = resizeStartPos.height2 + e.screenY;
			if (TopPos + popHeight > screen.height) popHeight = screen.height - TopPos;
			break;
	}
	if (ScreenshotVisible) {
		if (popHeight < 200)
			popHeight = 200;
	}
	else {
		if (popHeight < 129)
			popHeight = 129;
	}
	if (popWidth < 150)
		popWidth = 150;

	if (ScreenshotVisible) {
		var s1 = oPopup.document.getElementById("split1");
		var s2 = oPopup.document.getElementById("split2");
		var yd = s1.clientHeight;
		if (yd < 78) yd = 78;
		var sy = s1.clientHeight + s2.clientHeight;
		yd /= sy;
		if (yd < 0.1)
			yd = 0.1;
		if (yd > 0.9)
			yd = 0.9;
		s1.style.height = (yd * 100) + "%";
		s2.style.height = ((1 - yd) * 100) + "%";
	}
	//	window.status = s + LeftPos + ", " + TopPos;
	//	oPopup.document.parentWindow.event.returnValue = false;
	oPopup_show(LeftPos, TopPos, popWidth, popHeight);
	//	LeftPos = oPopup.document.parentWindow.screenLeft;
	//	TopPos = oPopup.document.parentWindow.screenTop;
	GITextFrame.style.width = popWidth - 29;
}

function touch(e) {
	if (e.originalEvent.touches && e.originalEvent.touches.length) {
		return e.originalEvent.touches[0];
	} else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
		return e.originalEvent.changedTouches[0];
	}
}

var splitState = 0;

function SplitStart(e) {
	var event = e;
	if (IsTouchDevice()) {
		e.preventDefault();
		event = touch(e);
	}
	clearInterval(IV);
	IV = null;
	startPos = { Y: $(this).scrollTop() + event.clientY, X: $(this).scrollLeft() + event.clientX }
	if (IsTouchDevice()) {
		$(document).bind("touchend", SplitEnd);
		$(document).bind("touchmove", SplitMove);
	} else {
		$(document).bind("mouseup", SplitEnd);
		$(document).bind("mousemove", SplitMove);
	}
	$("#EventListenerDIV").css({ cursor: "n-resize", "z-index": "4" });
}

function SplitMove(e) {
	var event = e;
	if (IsTouchDevice()) {
		e.preventDefault();
		event = touch(e);
	}
	var yd = event.clientY;
	var s1 = $("#split1" + idPostFix);
	var s2 = $("#split2" + idPostFix);
	var sy = 0;
	if (isIE && popupVersion) {
		sy = s1.getBoundingClientRect().top;
		yd -= sy + 12;
	}
	else {
		yd -= 27;
	}

	if (yd < 78) yd = 78;
	sy = s1.height() + s2.height();
	yd /= sy;
	if (yd < 0.1)
		yd = 0.1;
	if (yd > 0.9)
		yd = 0.9;
	s1.css({ "height": (yd * 100) + "%" });
	s2.css({ "top": (yd * 100) + "%", "height": ((1 - yd) * 100) + "%" })
	GIOnResize();
}

function SplitEnd(e) {
	var event = e;
	if (IsTouchDevice()) {
		e.preventDefault();
		event = touch(e);
	}
	if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
		GICookie["Cleft"] = LeftPos;
		GICookie["Ctop"] = TopPos;
		GICookie["Cwidth"] = popWidth;
		if (ScreenshotVisible) GICookie["Cheight"] = popHeight;
		else GICookie["Cheight"] = popHeight + SavedSSHeight;
		//		GICookie["s1"]=oPopup.document.getElementById("split1").style.height;
		//		GICookie["s2"]=oPopup.document.getElementById("split2").style.height;
		GICookie["Cs2"] = (isIE && popupVersion) ? oPopup.document.getElementById("split2" + idPostFix).clientHeight : oPopup.document.getElementById("split1" + idPostFix).style.height;
		GICookie["Csss"] = ScreenshotVisible + 1;
		GICookie.Store()
	}

	$("#EventListenerDIV").css({ cursor: "default", "z-index": "-1" });
	$(document).unbind("mousemove", SplitMove);
	$(document).unbind("mouseup", SplitEnd);
	$(document).unbind("touchmove", SplitMove);
	$(document).unbind("touchend", SplitEnd);
}

function GGGSplitD(o) {
	var e = isIE ? oPopBody.ownerDocument.parentWindow.event : o;
	if (isIE) {
		if (!popupVersion) {
			o.onmousemove = function () { GGGSplitM(o); }
			o.onmouseup = function () { GGGSplitU(o); }
		}
		o.setCapture();
	}
	else {
		eventTarget = e.currentTarget;
		var ldiv = Get_Element("EventListenerDIV");
		ldiv.style.cursor = "n-resize";
		ldiv.style.zIndex = 4;
		ldiv.addEventListener("mousemove", function (event) { GGGSplitM(event); }, true);
		ldiv.addEventListener("mouseup", function (event) { GGGSplitU(event); }, true);
	}
	splitState = 1;
}

function GGGSplitM(o) {
	var e = isIE ? oPopBody.ownerDocument.parentWindow.event : o;

	if (splitState) {
		var yd = e.clientY;
		var s1 = oPopup.document.getElementById("split1" + idPostFix);
		var s2 = oPopup.document.getElementById("split2" + idPostFix);
		var sy = 0;
		if (isIE && popupVersion) {
			sy = s1.getBoundingClientRect().top;
			yd -= sy + 12;
		}
		else {
			sy = oPopup.document.getElementById("giTitlebarFF").clientHeight;
			if (isIE) yd -= sy + 27;
			else yd -= sy + 21;
		}

		//		GIInfoFrame.innerHTML=yd + ",,," + sy
		if (yd < 78) yd = 78;
		sy = s1.clientHeight + s2.clientHeight;
		yd /= sy;
		if (yd < 0.1)
			yd = 0.1;
		if (yd > 0.9)
			yd = 0.9;
		s1.style.height = (yd * 100) + "%";
		s2.style.top = (yd * 100) + "%";
		s2.style.height = ((1 - yd) * 100) + "%";
		GIOnResize();
	}
}

function GGGSplitU(o) {
	if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
		GICookie["Cleft"] = LeftPos;
		GICookie["Ctop"] = TopPos;
		GICookie["Cwidth"] = popWidth;
		if (ScreenshotVisible) GICookie["Cheight"] = popHeight;
		else GICookie["Cheight"] = popHeight + SavedSSHeight;
		//		GICookie["s1"]=oPopup.document.getElementById("split1").style.height;
		//		GICookie["s2"]=oPopup.document.getElementById("split2").style.height;
		GICookie["Cs2"] = (isIE && popupVersion) ? oPopup.document.getElementById("split2" + idPostFix).clientHeight : oPopup.document.getElementById("split1" + idPostFix).style.height;
		GICookie["Csss"] = ScreenshotVisible + 1;
		GICookie.Store()
	}
	splitState = 0;
	if (isIE) o.releaseCapture();
	eventTarget = null;
	if (!(isIE && popupVersion)) {
		var ldiv = Get_Element("EventListenerDIV");
		ldiv.style.zIndex = -1;
		ldiv.style.cursor = "default";
		if (isIE) {
			ldiv.onmousemove = null;
			ldiv.onmouseup = null;
			ldiv.releaseCapture();
		}
		else {
			ldiv.removeEventListener("mousemove", function (event) { SSEH(event); }, true);
			ldiv.removeEventListener("mouseup", function (event) { SSEH(event); }, true);
		}
	}
}

var startPos = null;
//----Event handler for screenshot

function SSPanStart(e) {
	clearInterval(IV);
	IV = null;
	startPos = { Y: $(this).scrollTop() + e.clientY, X: $(this).scrollLeft() + e.clientX }
	if (e.which == 3) {
		if (hpos) {
			GICamera.scrollLeft = hpos.left - (GICamera.clientWidth / 2);
			GICamera.scrollTop = hpos.top - (GICamera.clientHeight / 2);
		}
		else {
			GICamera.scrollLeft = 0;
			GICamera.scrollTop = 0;
		}
		return;
	}
	else {
		$(document).bind("mousemove", SSPanMove);
		$(document).bind("mouseup", SSPanEnd);
	}
	$("#EventListenerDIV").css({ cursor: "move", "z-index": "4" });
}

function SSPanMove(e) {
	if (!startPos) return;
	$("#camera" + idPostFix).scrollTop(startPos.Y - e.clientY);
	$("#camera" + idPostFix).scrollLeft(startPos.X - e.clientX);
}

function SSPanEnd(e) {
	$("#EventListenerDIV").css({ cursor: "default", "z-index": "-1" });
	$(document).unbind("mousemove", SSPanMove);
	$(document).unbind("mouseup", SSPanEnd);
	$(document).unbind("touchmove", SSPanMove);
	$(document).unbind("touchend", SSPanEnd);
}

function SSEH(o) {
	var e = oPopBody.ownerDocument.parentWindow.event;
	if (e.type == "mousedown" && e.button == 2) {
		clearInterval(IV);
		IV = null;
		if (hpos) {
			GICamera.scrollLeft = hpos.left - (GICamera.clientWidth / 2);
			GICamera.scrollTop = hpos.top - (GICamera.clientHeight / 2);
		}
		else {
			GICamera.scrollLeft = 0;
			GICamera.scrollTop = 0;
		}
		return;
	}
	if (e.type == "mousedown" && e.button) {
		var srcElement = o;
		clearInterval(IV);
		IV = null;
		startPos = { top: o.scrollTop + e.screenY, left: o.scrollLeft + e.screenX }
		eventTarget = srcElement;
		var ldiv = Get_Element("EventListenerDIV");
		ldiv.style.cursor = "move";
		ldiv.style.zIndex = 4;
			//	        alert("most")
		ldiv.onmousemove = SSEH;
		o.onmouseup = function(){SSEH(o);};
		o.setCapture();
		return;
	}
	if (e.type == "mouseup") {
		//	    alert("fel")
		startPos = null;
		if (isIE && popupVersion) o.releaseCapture();
		eventTarget = null;
		if (!(isIE && popupVersion)) {
			var ldiv = Get_Element("EventListenerDIV");
			ldiv.style.zIndex = -1;
			ldiv.style.cursor = "default";
				ldiv.onmousemove = null;
				o.onmouseup = null;
				o.releaseCapture();
		}
		return;
	}
	if (!startPos) return;
	if (isIE && popupVersion) {
		o.scrollTop = startPos.top - e.screenY;
		o.scrollLeft = startPos.left - e.screenX;
	}
	else {
		eventTarget.scrollTop = startPos.top - e.screenY;
		eventTarget.scrollLeft = startPos.left - e.screenX;
	}

}

var popHidden = false;
function HidePopup() {
	if (isIE && popupVersion) {
		oPopup_show(1, 1, 1, 1, true);
		clearInterval(PopIV);
	}
	else if (!upk.browserInfo.isTouchDevice()) {
		document.title = "_" + document.title;
	}
	popHidden = true;
	GIStopCHL();
}

function ShowPopup() {
	popHidden = false;
	oPopup_show(LeftPos, TopPos, popWidth, popHeight);
	if (isIE && popupVersion) PopIV = setInterval(RePop, 250);
	else if (document.title.indexOf("_") == 0) {
		document.title = document.title.substr(1);
	}
	if (contCHL) top.GIPlayer.GIStartIV();
}

//Closes the Popup or window
function closeAp() {
	if (appOpened) {
		if (!noStart && GIEndFrame) {
			lms_topicFinish(getMyGuid());
		}
		if (!noStart) {
			lms_ClosePage();
		}
		//setTimeout(closeAp2,500);
		closeAp2();
	}
}

function closeAp2() {
	if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
		if (!(isIE && popupVersion)) {
			TopPos = window.screenTop != undefined ? window.screenTop : window.screenY;
			LeftPos = window.screenLeft != undefined ? window.screenLeft : window.screenX;
			popWidth = document.getElementById("noPopupFF").clientWidth;
			popHeight = document.getElementById("noPopupFF").clientHeight;
		}
		if (!GINoCookieSave) {
			GICookie["Cleft"] = LeftPos;
			GICookie["Ctop"] = TopPos;
			GICookie["Cwidth"] = popWidth;
			if (ScreenshotVisible || !(isIE && popupVersion)) GICookie["Cheight"] = popHeight;
			else GICookie["Cheight"] = popHeight + SavedSSHeight;
			//			GICookie["s1"]=oPopup.document.getElementById("split1").style.height;
			//			GICookie["s2"]=oPopup.document.getElementById("split2").style.height;
			GICookie["Csss"] = ScreenshotVisible + 1;
			GICookie.Store()
		}
	}
	clearInterval(IV);
	if (isIE && popupVersion) {
		clearInterval(PopIV);
		StopKeyHook();
		oPopup.hide();
	}
	appOpened = false;
	//window.moveTo(MainLeftPos,MainTopPos)
	if (top.GIPlayer)
		top.GIPlayer.GIClosePlayer();
	window.close();
}

//This function is used to keep the do it mode window topmost
//by the plugin

function SendEventToHemiFFButtonPlugin() {
	var element = document.getElementById("HTML2HemiFFButtonData");
	if (!element) {
		element = document.createElement("HTML2HemiFFButtonData");
		element.setAttribute("id", "HTML2HemiFFButtonData");
		document.documentElement.appendChild(element);
	}

	if ("createEvent" in document) {
		element.setAttribute("paramDomain", document.domain);
		element.setAttribute("paramTitle", document.title + " - Mozilla Firefox");

		var evt = document.createEvent("Events");
		evt.initEvent("StayOnTopEvent", true, false);
		element.dispatchEvent(evt);
		element.removeAttribute("paramTitle");
		element.removeAttribute("paramDomain");
	}
}

/* template.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var template_leadin = "";
var template_leadout = "";
var template_explanation = "";
var template_pauselink = "";

var template_knowit_leadin = "";
var template_knowit_leadout = "";
var template_knowit_nextstep = "";
var template_knowit_explanation = "";

var template_knowit_leadin_score = "";

var template_knowit_warningL1 = "";
var template_knowit_warningL2 = "";
var template_knowit_warningL3_0 = "";
var template_knowit_warningL3_H = "";
var template_knowit_warningL4 = "";

var template_scoring = "";

var template_scoring_YES = "";
var template_scoring_NO = "";

var template_knowit_continue = "";
var template_knowit_confirmdemo = "";
var template_typingcomplete = "";

var template_knowit_dragwarning = ""

var template_knowit_finish_close = "";
var template_knowit_finish_close_inassessment = "";

var template_strinp_suppress_example = 0;

//***********************************************************************************************

var _template_arr = new Array();
var _template_retfv = "";
var xmlDoc;

function LoadTemplates(guid, retfv) {
    _template_retfv = retfv;
    if (document.implementation && document.implementation.createDocument) {
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.onload = LoadTemplates_Returned0;
    }
    else if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.onreadystatechange = function () {
            if (xmlDoc.readyState == 4) LoadTemplates_Returned0();
        };
    }
    else {
        LoadTemplates_Error();
        return;
    }

    try {
        xmlDoc.load("../../template/" + guid + "/template.xml");
    }
    catch (e) {
        LoadXMLDocArray("../../template/" + guid + "/template.xml", LoadTemplates_Returned, LoadTemplates_Error, "Item", true)
    }
}

function LoadTemplates_Returned0() {
    _nodesArray = new Array();
    var _nodes = xmlDoc.getElementsByTagName('Item');
    for (var i = 0; i < _nodes.length; i++) {
        var n = _nodes[i];
        var xmlname = n.attributes[0].value;
        var xmltext = "";
        for (var j = 0; j < n.childNodes.length; j++) {
            if (n.childNodes[j].xml) {
                xmltext += n.childNodes[j].xml;
            } else {
                var oSerializer = new XMLSerializer;
                xmltext += oSerializer.serializeToString(n.childNodes[j]);
            }
        }
        _nodesArray[_nodesArray.length] = xmlname + "=" + xmltext;
    }
    LoadTemplates_Returned(_nodesArray);
}

function LoadTemplates_Error() {
    alert("Common template loading error ...");
}

function LoadTemplates_Returned(a) {
    _template_arr = new Array();
    for (var i = 0; i < a.length; i++) {
        var k = a[i].indexOf("=");
        var key = a[i].substr(0, k);
        var value = a[i].substr(k + 1);
        _template_arr[key] = value;
    }
    LoadAll();
    setTimeout(_template_retfv, 100);
}

function GetTemp(id) {
    if (_template_arr[id])
        return _template_arr[id];
    return "";
}

function Insert(s1, s2, k) {
    return s1.substr(0, k) + s2 + s1.substr(k);
}

function LoadAll() {
    template_leadin = GetTemp('leadin');
    template_leadout = GetTemp('leadout');
    template_explanation = GetTemp('continue');
    //var p = GetTemp('pauselink');
    //var p1 = ReplaceAll(p, '<br></br>', '<br/>');
    //template_pauselink = ReplaceAll(p1, '<BR></BR>', '<br/>');

    template_knowit_leadin = GetTemp('knowit_leadin');
    template_knowit_leadout = GetTemp('knowit_leadout');
    template_knowit_nextstep = GetTemp('knowit_nextstep');
    template_knowit_explanation = GetTemp('knowit_explanation');

    if (IsTouchDevice()) {
        var attr = ' style="color:#0033cc;font-weight:bold;" href="javascript:HLink(0)"';
        template_leadin = R_swipe_start;
        var k = template_leadin.indexOf("<a");
        template_leadin = Insert(template_leadin, attr, k + 2);
        attr = ' style="color:#0033cc;font-weight:bold;" href="javascript:HLink(1)"';
        template_explanation = R_swipe_continue;
        k = template_explanation.indexOf("<a");
        template_explanation = Insert(template_explanation, attr, k + 2);
        attr = ' style="color:#0033cc;font-weight:bold;" href="javascript:HLink(2)"';
        template_leadout = R_swipe_finish;
        k = template_leadout.indexOf("<a");
        template_leadout = Insert(template_leadout, attr, k + 2);
        template_knowit_leadin = template_leadin;
        template_knowit_explanation = template_explanation;
        template_knowit_leadout = template_explanation;
    }

    template_knowit_leadin_score = GetTemp('leadin_score');

    template_knowit_warningL1 = GetTemp('knowit_warningL1');
    template_knowit_warningL2 = GetTemp('knowit_warningL2');
    template_knowit_warningL3_0 = GetTemp('knowit_warningL3_0');
    template_knowit_warningL3_H = GetTemp('knowit_warningL3_H');
    template_knowit_warningL4 = GetTemp('knowit_warningL4');

    template_scoring = GetTemp('scoring');
    if (IsTouchDevice()) {
        var k0 = template_scoring.indexOf('align="right"');
        var k1 = template_scoring.indexOf('<', k0);
        var k2 = template_scoring.indexOf('</td', k0);
        var s1 = template_scoring.substr(0, k1);
        var s2 = template_scoring.substr(k2);
        template_scoring = s1 + '<span class="InstructText">' + Template_Replace(template_leadout, "HLink(2)", "HLink(20)") + '</span>' + s2;
    }

    template_scoring = template_scoring.substr(0, 6) + ' width="100%" ' + template_scoring.substr(6);

    template_scoring_YES = GetTemp('scoring_YES');
    template_scoring_NO = GetTemp('scoring_NO');

    template_knowit_continue = GetTemp('knowit_continue');
    template_knowit_confirmdemo = GetTemp('knowit_confirmdemo');
    template_typingcomplete = GetTemp('typingcomplete');

    template_knowit_dragwarning = GetTemp('knowit_dragwarning')

    template_knowit_finish_close = GetTemp('knowit_finish_close');
    template_knowit_finish_close_inassessment = GetTemp('knowit_finish_close_inassessment');

    template_strinp_suppress_example = GetTemp('strinp_suppress_example');

    var s = GetTemplate_knowit_leadin_score("168");
}

function ReplaceAll(sourcestr, sourceexpr, newexpr) {
    var ret = sourcestr;
    var k = ret.indexOf(sourceexpr);
    while (k >= 0) {
        ret = Template_Replace(ret, sourceexpr, newexpr);
        var k = ret.indexOf(sourceexpr);
    }
    return ret;
}

function Template_Replace(sourcestr, sourceexpr, newexpr) {
    var k = sourcestr.indexOf(sourceexpr);
    if (k < 0)
        return sourcestr;
    var s1 = sourcestr.substr(0, k);
    var s2 = sourcestr.substr(k + sourceexpr.length);
    return s1 + newexpr + s2;
}

function GetTemplate_knowit_leadin_score(score) {
    return Template_Replace(template_knowit_leadin_score, "$score$", score);
}

function GetTemplate_scoring(good, needed, result) {
    var s = Replace(template_scoring, "$good$", good);
    var ss = Replace(s, "$needed$", needed);
    return Replace(ss, "$result$", result);
}


/* help.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

function onHelp(url)
{
	if (url.charAt(url.length - 1) == '/')
	    url = url.substr(0, url.length - 1);
	if (url.length > 0)
	    url += "/";
	var _left=screen.availWidth/17;
	var _top=_left;
	var _height=screen.availHeight-3*_top;
	if (_height>500)
		_height=500;
	var _width=_height*4.5/3;
	_height=390;
	_width=637;
	var strFeatures = "width="+_width+",height="+_height+",left="+_left+",top="+_top + 
				",resizable=1,toolbar=1,scrollbars=1,location=0,menubar=0";
	var w=window.open(url+"../help/toc.html", "odhelp", strFeatures)
	w.focus();
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

/* preferences.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

function UserPreferences() {
    this.EnablePreferences = true;
    this.TimeStamp = "000000000000";
    this.PlayAudio = "all";
    this.ShowLeadIn = "all";
    this.MarqueeColor = "red";
    this.TryIt = new Object;
    this.TryIt.EnableSkipping = true;
    this.DoIt = new Object
    this.DoIt.HotKey = new Object;
    this.DoIt.HotKey.Ctrl = "L";
    this.DoIt.HotKey.Shift = "N";
    this.DoIt.HotKey.Alt = "L";
    this.DefaultPlayMode = "S";
    this.WebPageAutoPlayback = true;
    this.ApplicableOutlineDisplay = "L";    // L - List, O - Outline, A - All
    this.NavbarVolume = 100;
    this.EnableShowDiagnostics = false;
}

UserPreferences.prototype.Copy = function (src) {
    this.TimeStamp = src.TimeStamp;
    this.PlayAudio = src.PlayAudio;
    this.ShowLeadIn = src.ShowLeadIn;
    this.MarqueeColor = src.MarqueeColor;
    this.TryIt.EnableSkipping = src.TryIt.EnableSkipping;
    this.DoIt.HotKey.Ctrl = src.DoIt.HotKey.Ctrl;
    this.DoIt.HotKey.Shift = src.DoIt.HotKey.Shift;
    this.DoIt.HotKey.Alt = src.DoIt.HotKey.Alt;
    this.DefaultPlayMode = src.DefaultPlayMode;
    this.WebPageAutoPlayback = src.WebPageAutoPlayback;
    this.ApplicableOutlineDisplay = src.ApplicableOutlineDisplay;
    this.NavbarVolume = src.NavbarVolume;
    this.EnableShowDiagnostics = src.EnableShowDiagnostics;
}

UserPreferences.prototype.Compare = function (src) {
    if (this.PlayAudio != src.PlayAudio) return true;
    if (this.ShowLeadIn != src.ShowLeadIn) return true;
    if (this.MarqueeColor != src.MarqueeColor) return true;
    if (this.TryIt.EnableSkipping != src.TryIt.EnableSkipping) return true;
    if (this.DoIt.HotKey.Ctrl != src.DoIt.HotKey.Ctrl) return true;
    if (this.DoIt.HotKey.Shift != src.DoIt.HotKey.Shift) return true;
    if (this.DoIt.HotKey.Alt != src.DoIt.HotKey.Alt) return true;
    if (this.DefaultPlayMode != src.DefaultPlayMode) return true;
    if (this.WebPageAutoPlayback != src.WebPageAutoPlayback) return true;
    if (this.ApplicableOutlineDisplay != src.ApplicableOutlineDisplay) return true;
    if (this.NavbarVolume != src.NavbarVolume) return true;
    if (this.EnableShowDiagnostics != src.EnableShowDiagnostics) return true;
    return false;
}

UserPreferences.prototype.GetCookie = function () {
    return new Cookie(document, "OnDemandPlayer", 365, "/", null, false);
}

UserPreferences.prototype.LoadCookie = function () {
    var cookie = this.GetCookie();
    cookie.Load();
    if (cookie.PlayAudio)
        this.PlayAudio = cookie.PlayAudio;
    UserPref_PlayAudio_Original = this.PlayAudio;
    if (upk.browserInfo.isSoundSupported() == false)
        this.PlayAudio = "none";

    if (UserPrefs.TimeStamp != "000000000000" && (!cookie.TimeStamp || UserPrefs.TimeStamp > cookie.TimeStamp))
        return;

    if (cookie.ShowLeadIn)
        this.ShowLeadIn = cookie.ShowLeadIn;
    if (cookie.MarqueeColor)
        this.MarqueeColor = cookie.MarqueeColor;
    if (cookie.TryIt_EnableSkipping)
        this.TryIt.EnableSkipping = (cookie.TryIt_EnableSkipping == "true");
    if (cookie.DoIt_HotKey_Ctrl)
        this.DoIt.HotKey.Ctrl = cookie.DoIt_HotKey_Ctrl;
    if (cookie.DoIt_HotKey_Shift)
        this.DoIt.HotKey.Shift = cookie.DoIt_HotKey_Shift;
    if (cookie.DoIt_HotKey_Alt)
        this.DoIt.HotKey.Alt = cookie.DoIt_HotKey_Alt;
    if (cookie.DefaultPlayMode)
        this.DefaultPlayMode = cookie.DefaultPlayMode;
    if (cookie.WebPageAutoPlayback)
        this.WebPageAutoPlayback = cookie.WebPageAutoPlayback;
    if (cookie.ApplicableOutlineDisplay)
        this.ApplicableOutlineDisplay = cookie.ApplicableOutlineDisplay;
    if (cookie.NavbarVolume)
        this.NavbarVolume = cookie.NavbarVolume;
    if (cookie.EnableShowDiagnostics)
        this.EnableShowDiagnostics = (cookie.EnableShowDiagnostics == "true");
}

UserPreferences.prototype.StoreCookie = function () {
    var cookie = this.GetCookie();
    cookie.TimeStamp = this.TimeStamp;
    cookie.PlayAudio = this.PlayAudio;
    cookie.ShowLeadIn = this.ShowLeadIn;
    cookie.MarqueeColor = this.MarqueeColor;
    cookie.TryIt_EnableSkipping = this.TryIt.EnableSkipping;
    cookie.DoIt_HotKey_Ctrl = this.DoIt.HotKey.Ctrl;
    cookie.DoIt_HotKey_Shift = this.DoIt.HotKey.Shift;
    cookie.DoIt_HotKey_Alt = this.DoIt.HotKey.Alt;
    cookie.DefaultPlayMode = this.DefaultPlayMode;
    cookie.WebPageAutoPlayback = this.WebPageAutoPlayback;
    cookie.ApplicableOutlineDisplay = this.ApplicableOutlineDisplay;
    cookie.NavbarVolume = this.NavbarVolume;
    cookie.EnableShowDiagnostics = this.EnableShowDiagnostics;
    cookie.Store();
}

UserPreferences.prototype.GetUrlParamString = function () {
    return "PP_SOUND=" + this.PlayAudio +
		"&PP_LEADIN=" + this.ShowLeadIn +
		"&PP_SKIP=" + (this.TryIt.EnableSkipping ? "true" : "false") +
		"&PP_MARQUEE=" + this.MarqueeColor +
		"&PP_ENABLE=" + (this.EnablePreferences ? "true" : "false") +
		"&PP_HOTKEY=" + this.DoIt.HotKey.Ctrl + this.DoIt.HotKey.Shift + this.DoIt.HotKey.Alt;
}

UserPreferences.prototype.ParseUrlParamString = function (param_str) {
    var params = param_str.split('&');
    for (var p = 0; p < params.length; p++) {
        var paritem = params[p].split("=");
        if (paritem[0].toUpperCase() == "PP_SOUND")
            this.PlayAudio = paritem[1];
        else if (paritem[0].toUpperCase() == "PP_LEADIN")
            this.ShowLeadIn = paritem[1];
        else if (paritem[0].toUpperCase() == "PP_MARQUEE")
            this.MarqueeColor = paritem[1];
        else if (paritem[0].toUpperCase() == "PP_SKIP")
            this.TryIt.EnableSkipping = (paritem[1] == "true");
        else if (paritem[0].toUpperCase() == "PP_ENABLE")
            this.EnablePreferences = (paritem[1] == "true");
        else if (paritem[0].toUpperCase() == "PP_HOTKEY") {
            this.DoIt.HotKey.Ctrl = paritem[1].charAt(0);
            this.DoIt.HotKey.Shift = paritem[1].charAt(1);
            this.DoIt.HotKey.Alt = paritem[1].charAt(2);
        }
    }
}

var UserPrefs = new UserPreferences();
var UserPref_PlayAudio_Original = "";

if (typeof SetDefaultPreferences !== "undefined")
    SetDefaultPreferences();
if (UserPrefs.EnablePreferences)
    UserPrefs.LoadCookie();

var paramstr = unescape(document.location.hash.substring(1));
if (paramstr == "")
    paramstr = unescape(document.location.search.substring(1));

UserPrefs.ParseUrlParamString(paramstr);

function OpenPreferencesDialog(path, nosound) {
    if (!UserPrefs.EnablePreferences)
        alert(R_preferences_disabled);
    else {
    	var p = path + "/html/preferences.html";
        var h;
        if (upk.browserInfo.isChrome())
            h = 430;
        else if (upk.browserInfo.isFF())
            h = 420;
        else if (upk.browserInfo.isSafari())
            h = 350;
        else
            h = 412;
        var params = new Array();
        try {
            if (lms_IsUserProfileAvailable()) {
                var url = lms_GetUserProfileUrl();
                if (url != "")
                    params[params.length] = "UserProfileUrl=" + Escape.MyEscape(url);
            }
        }
        catch (e) { };
        if (nosound) {
            params[params.length] = "nosound";
        }
        for (var i = 0; i < params.length; i++) {
            p += (i == 0) ? "?" : "&";
            p += params[i];
        }
        if (IsTouchDevice() || upk.browserInfo.isIE10Modern()) {
        	var w = 400;
        	h += 50;
        	showDialog(p, -1, -1, w, h, true, 96, "../../../", false);
        }
        else {
        	window.open(p, "prefwin", "width=500,height=" + h + ",resizable=1,scrollbars=0,top=" + (screen.availHeight - 290) / 2 + ",left=" + (screen.availWidth - 500) / 2);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////

function SessionPreferences() {
    this.swipeInstructionShowed = false;
}

SessionPreferences.prototype.GetCookie = function () {
    return new Cookie(document, "OnDemandPlayerSession", null, "/");
}

SessionPreferences.prototype.LoadCookie = function () {
    var cookie = this.GetCookie();
    cookie.Load();
    if (cookie.swipeInstructionShowed)
        this.swipeInstructionShowed = cookie.swipeInstructionShowed;
}

SessionPreferences.prototype.StoreCookie = function () {
    var cookie = this.GetCookie();
    cookie.swipeInstructionShowed = this.swipeInstructionShowed;
    cookie.Store();
}

var SessionPrefs = new SessionPreferences();

///////////////////////////////////////////////////////////////////////////////////////////////

function GetContentPathName() {
    var s = window.location.pathname;
    var k = s.indexOf("data/toc.html");
    if (k > 0)
        return s.substr(0, k);
    k = s.indexOf("html/roles.html");
    if (k > 0)
        return s.substr(0, k);
    k = s.indexOf("data/tpc/");
    if (k > 0)
        return s.substr(0, k);
    k = s.indexOf("html/lmsui.html");
    if (k > 0)
        return s.substr(0, k);
    return s;
}

function UserRolesClass() {
    this.Filtering = false;
    this.Roles = new Array();
}

UserRolesClass.prototype.Copy = function (src) {
    this.Filtering = src.Filtering;
    this.Roles = new Array();
    for (var r = 0; r < src.Roles.length; r++)
        this.Roles[r] = src.Roles[r];
}

UserRolesClass.prototype.Compare = function (src) {
    if (this.Filtering != src.Filtering) return true;
    if (this.Roles.length != src.Roles.length) return true;
    for (var r = 0; r < this.Roles.length; r++) {
        if (this.Roles[r] != src.Roles[r]) return true;
    }
    return false;
}

UserRolesClass.prototype.GetCookie = function () {
    return new Cookie(document, "OnDemandPlayerRoles", 90, GetContentPathName(), null, false);
}

UserRolesClass.prototype.LoadCookie = function () {
    var cookie = this.GetCookie();
    cookie.Load();
    this.Filtering = false;
    if (cookie.Filtering)
        this.Filtering = (cookie.Filtering == "true");
    this.Roles = new Array();
    if (cookie.Roles)
        this.Roles = cookie.Roles.split("+");
}

UserRolesClass.prototype.StoreCookie = function () {
    var cookie = this.GetCookie();
    cookie.Filtering = this.Filtering ? "true" : "false";
    cookie.Roles = this.Roles.join("+");
    cookie.Store();
}

UserRolesClass.prototype.GetUrlParamString = function () {
    return "PP_ROLEFILTERING=" + (this.Filtering ? "true" : "false") + "&PP_ROLES=" + encodeURIComponent(this.Roles.join('+'));
}

UserRolesClass.prototype.ParseUrlParamString = function (param_str) {
    var params = param_str.split('&');
    for (var p = 0; p < params.length; p++) {
        var paritem = params[p].split("=");
        if (paritem[0].toUpperCase() == "PP_ROLEFILTERING")
            this.Filtering = (paritem[1] == "true");
        else if (paritem[0].toUpperCase() == "PP_ROLES") {
            this.Roles = new Array();
            if (paritem[1])
                this.Roles = paritem[1].split('+');
        }
    }
}

var UserRoles = new UserRolesClass();
UserRoles.LoadCookie();
UserRoles.ParseUrlParamString(paramstr);

function OpenRolesDialog(path) {
    window.open(path + "/html/roles.html", "roleswin", "width=500,height=318,resizable=1,scrollbars=0,top=" + (screen.availHeight - 286) / 2 + ",left=" + (screen.availWidth - 500) / 2);
}

/* soundobj.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var sounds = new Array();

function SoundObj(id, filelist, duration) {
    var _flist = filelist.split("+");
    var _fct = _flist.length;
    this.flist = new Array();
    this.fct = 0;
    this.duration = duration;
    for (var i = 0; i < _fct; i++) {
        var s = _flist[i];
        if (s.substr(0, 5) != "TEMP:") {
            this.flist[this.fct] = s;
            this.fct++;
        }
    }
};

function Sound(id, filelist, duration) {
    if (id.indexOf('.') < 0)
        id += ".ASX";
    sounds[id.substr(1)] = new SoundObj(id, filelist, duration);
};

/* infoblock.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var isOnLink = false;

function ShowInfoBlock(s, t) {
    try {
        if (playMode != null) {
            if (playMode != "") {
                PlayStop(true);
            }
        }
    }
    catch (e) { };
    var webpage = false;
    var su = Escape.MyUnEscape(s);

    if (su.indexOf('odrel://') == 0)
        su = resolve(su);

    var ss = su;

    while (ss.substr(0, 3) == "../") {
        ss = ss.substr(3);
    }
    var k = ss.lastIndexOf("/");
    if (k >= 0 && ss.substr(k) == '/index.html') {
        webpage = true;
    }

    if (t == null || t.length == 0)
        t = "_blank";
    t = t.toLowerCase();
    if (t != "_blank") {
        this.location.replace(su);
        return;
    }
    if (webpage) {
        var w = screen.availWidth;
        var left = (w - PlayerConfig.InfoWidth) / 2;

        var h = screen.availHeight;
        var top = (h - PlayerConfig.InfoHeight) / 2;

        var features = "toolbar=1,scrollbars=1,statusbar=1,resizable=1";
        id = window.open(su, "", "top=" + top + ",left=" + left + ",width=" + PlayerConfig.InfoWidth + ",height=" + PlayerConfig.InfoHeight + features);
        var s = "Center(" + left + "," + top + ")";
        setTimeout(s, 500);

    }
    else {
        var iw = PlayerConfig.InfoWidth;
        var ih = PlayerConfig.InfoHeight;
        if (PlayerConfig.InfoWidth2) {
            if (PlayerConfig.InfoWidth2 > 0) {
                iw = PlayerConfig.InfoWidth2;
            }
        }
        if (PlayerConfig.InfoHeight2) {
            if (PlayerConfig.InfoHeight2 > 0) {
                ih = PlayerConfig.InfoHeight2;
            }
        }

        var w = screen.availWidth;
        var left = (w - iw) / 2;

        var h = screen.availHeight;
        var top = (h - ih) / 2;

        var features = "toolbar=1,scrollbars=1,location=1,statusbar=1,menubar=1,resizable=1";
        id = window.open(su, "", "top=" + top + ",left=" + left + ",width=" + iw + ",height=" + ih + features);
        var s = "Center(" + left + "," + top + ")";
        setTimeout(s, 500);
    }
}

function OnLink() {
    isOnLink = true
}

function OffLink() {
    isOnLink = false
}

var globalloc = "";

function MakeAbsolute(URL) {
    var s = URL.toLowerCase();
    if (s.substr(0, 7) == "mailto:")
        return URL;
    var loc = "";
    if (globalloc.length == 0) {
        globalloc = location.href;
        while (globalloc.indexOf('\\') != -1)
            globalloc = globalloc.replace('\\', '/');
    };
    loc = globalloc;
    var k = loc.indexOf('#');
    if (k < 0)
        k = loc.indexOf('?');
    if (k >= 0)
        loc = loc.substr(0, k);
    var end
    end = loc.lastIndexOf('/')
    if (end != -1 && URL.indexOf('//') == -1) {
        return loc.substr(0, end + 1) + URL
    }
    else
        return URL
}

var id;

function Center(x, y) {
    try {
        id.focus();
        id.moveTo(x, y);
    }
    catch (e) {
    }
};


/* gimenu.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/



var popupMenu = 0;
var aPopBody = 0;
var innerBody = 0;

function ActionMenu() {
    this.Open = _AOpen;
    this.Close = _AClose;
    this.Refresh = _ARefresh;
    this.IsOnScreen = _AIsOnScreen;
    this.onScreen = false;
    this.created = false;
};

function _AOpen(left, top) {
    if (upk.browserInfo.isExplorer() && popupVersion) {
        if (!popupMenu) {
            popupMenu = oPopup.document.parentWindow.createPopup();
            popupMenuBody = popupMenu.document.body;
        };
        aPopBody = popupMenu.document.body;

        aPopBody.style.borderStyle = "solid";
        aPopBody.style.borderWidth = "1px";
        aPopBody.style.borderColor = "gray";
        aPopBody.style.backgroundColor = "#f7f7e7";
        aPopBody.style.marginTop = "8px";
        aPopBody.style.marginBottom = "8px";
        aPopBody.style.marginLeft = "8px";
        aPopBody.style.marginRight = "8px";
        $(aPopBody).css(DoItConfig.DoItActionsColor);
        $(aPopBody).css(DoItConfig.DoItActionsBorderColor);

        aPopBody.aLink = "0000FF";
        aPopBody.link = "0000FF";
        aPopBody.vLink = "0000FF";
        aPopBody.text = "black";
        aPopBody.ondragstart = EventCancel;
        aPopBody.oncontextmenu = EventCancel;
    }
    else {
        if (!this.created) {
            popupMenu = window;
            aPopBody = document.createElement("div");
            aPopBody.id = "actMenu";
            aPopBody.style.borderStyle = "solid";
            aPopBody.style.borderWidth = "1px";
            aPopBody.style.borderColor = "gray";
            aPopBody.style.backgroundColor = "#f7f7e7";
            aPopBody.aLink = "0000FF";
            aPopBody.link = "0000FF";
            aPopBody.vLink = "0000FF";
            aPopBody.text = "black";

            innerBody = document.createElement("div");
            aPopBody.appendChild(innerBody);
            innerBody.style.marginTop = "8px";
            innerBody.style.marginBottom = "8px";
            innerBody.style.marginLeft = "8px";
            innerBody.style.marginRight = "8px";

            aPopBody.style.position = "absolute";
            aPopBody.style.display = "block"
            aPopBody.style.zIndex = 6;
            aPopBody.style.overflow = "auto";
            //            document.getElementById("giTitlebarInnerFF").appendChild(aPopBody);
            document.body.appendChild(aPopBody);
            $("#actMenu").css(DoItConfig.DoItActionsColor);
            $("#actMenu").css(DoItConfig.DoItActionsBorderColor);
            this.created = true;
        }
        else {
            aPopBody.style.display = "block";
        }
        aPopBody.style.maxWidth = (document.getElementById("noPopupFF").clientWidth - 40) + "px";
        aPopBody.style.maxHeight = (document.getElementById("noPopupFF").clientHeight - 50) + "px";
    }
    //	popupMenu.show(left, top, 200,300);
    this.onScreen = true;
};

function _AClose() {
    if (this.onScreen) {
        if (upk.browserInfo.isExplorer() && popupVersion) popupMenu.hide();
        else {
            aPopBody.style.display = "none";
            var ldiv = Get_Element("EventListenerDIV");
            ldiv.style.zIndex = -1;
            if (upk.browserInfo.isExplorer()) ldiv.onmousedown = null;
            else ldiv.removeEventListener("mousedown", GICloseAction, true);
        }
        this.onScreen = false;
    }
};

function OnActionSelection(v1, v2, v3) {
    PlayStop();
    if (upk.browserInfo.isExplorer() && popupVersion) popupMenu.hide();
    this.onScreen = false;
    if (v1 == "Alt") {
        GIPlayer.GINextAlt();
    };
    if (v1 == "Next") {
        GIPlayer.GINextStep();
    };
    if (v1 == "Pass") {
        GIPlayer.GIPassStep();
    };
    if (v1 == "Fail") {
        GIPlayer.GIFailStep();
    };
    if (v1 == "Skip") {
        GIPlayer.GISkipStep();
    };
    if (v1 == "Report") {
        GIPlayer.GIGoToReport();
    };
    if (v1 == "TestItNotes") {
        GIPlayer.openTestNotes();
    };
    if (v1 == "TestItSTR") {
        GIPlayer.openSTR();
    };
    if (v1 == "Prev") {
        GIPlayer.GIPrevStep();
    };
    if (v1 == "Restart") {
        GIPlayer.GIRestart();
    };
    if (v1 == "Conc") {
        setTimeout(concepts[v2].url, 20);
    };
    if (v1 == "Info") {
        setTimeout(GIFrames[v3].infoblocks[v2].url, 20);
    };
    if (v1 == "PlayT") {
        GIPlayer.openTM();
    };
    if (v1 == "PlayD") {
        GIPlayer.openDM();
    };
    if (v1 == "Prefs") {
        GIPlayer.GIOpenPreferences();
    };
    if (v1 == "Share") {
        GIPlayer.GIShare();
    };
    if (v1 == "Help") {
        GIPlayer.GIOpenHelp();
    };
    if (v1 == "LogOut") {
        GIPlayer.LogOut();
    };
    if (v1 == "CloseT") {
        GIPlayer.GIClosePlayer();
    };
    if (v1 == "ViewOutline") {
        GIPlayer.GIClosePlayer(true);
    };
    if (v1 == "CloseW") {
        GIPlayer.GICloseAction();
    };
    if (v1 == "Printit") {
        GIPlayer.GIShowPrintit();
    }
    if (v1 == "AskAnExpert") {
        GIPlayer.AskAnExpert();
    };
    if (v1 == "ProvideFeedback") {
        GIPlayer.ProvideFeedback();
    };
    GICloseAction();
};

function CorrectPopup() {
    if (upk.browserInfo.isExplorer() && popupVersion) {
        popupMenu.show(0, 0, 0, 0);
    }
    sp = popupMenu.document.getElementById("actionspan");
    hsp = sp.offsetHeight;
    wsp = sp.offsetWidth + 20;
    obj = oPopup.document.getElementById("pgiaction" + idPostFix);
    objh = obj.offsetHeight;
    if (upk.browserInfo.isExplorer() && popupVersion) {
        wsp = (wsp >= 250 ? 250 : wsp);
        popupMenu.show(-(wsp - 20), objh, wsp + 20, hsp + 20, obj);
    }
    else {
        aPopBody.style.left = (obj.offsetLeft + obj.offsetWidth - wsp - 20) + "px";
        aPopBody.style.top = (obj.offsetTop + objh + 6) + "px";
    }
    ActMenu.onScreen = true;
}

function PopupToggle(div) {
    if (popupMenu.document.getElementById(div).style.display == "none")
        popupMenu.document.getElementById(div).style.display = "block";
    else
        popupMenu.document.getElementById(div).style.display = "none";
    CorrectPopup()
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//KPATH PORTAL SUPPORT

var _topLevelLmsMode = "";

function ReducedTOCMode() {
    if (_inToc == false)
        return false;
    if (parent.parent._see_also == true)
        return true;
    if (parent.parent._sco == true)
        return true;
    if (parent.parent._associated_content == true)
        return true;
}

function CheckKPTMode() {
    if (_topLevelLmsMode == "")
        _topLevelLmsMode = GetTopLevelLmsMode();
    if (Kpath_launch == true && _topLevelLmsMode == "LMS" && ReducedTOCMode() == true)
        return true;
    return (_topLevelLmsMode == "KPT");
}

// lms_IsKPathPortalAvailable()
function lms_IsKPathPortalAvailable() {
    __alert("lms_IsKPathPortalAvailable() called");
    if (CheckKPTMode() == false)
        return false;
    if (parent.urlParser.GetParameter("launchFromKPath") == null)
        return "";
    return (lms_GetKPathPortalUrl().length > 0);
}

// lms_GetKPathPortalUrl()
function lms_GetKPathPortalUrl() {
    __alert("lms_GetKPathPortalUrl() called");
    if (Kpath_launch == false)
        return "";
    var s = "";
    try {
        s = Kpath_home_URL;
    }
    catch (e) { };
    return s;
}

function AskAnExpert() {
    var dpi = 96;
    var url = lms_GetMentoringUrl(parent.topicID);
    h = 530;
    w = window.open(url, "askanexpertwnd", "width=550,height=" + h + ",resizable=1,scrollbars=0,top=" + (screen.availHeight - 530) / 2 + ",left=" + (screen.availWidth - 550) / 2);
    w.focus();
}

function ProvideFeedback() {
    var dpi = 96;
    var url = lms_GetFeedbackUrl(parent.topicID)
    h = 530;
    w = window.open(url, "providefeedbackwnd", "width=550,height=" + h + ",resizable=1,scrollbars=0,top=" + (screen.availHeight - 530) / 2 + ",left=" + (screen.availWidth - 550) / 2);
    w.focus();
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// NOTES AND MENTORING SUPPORT

// lms_IsMentoringAvailable
function lms_IsMentoringAvailable() {
    __alert("lms_IsMentoringAvailable() called");
    return document.LmsCom.doGetUPKValue("upk.mentoring_available") && document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

// lms_GetMentoringUrl
function lms_GetMentoringUrl() {
    __alert("lms_GetMentoringUrl() called");
    // _feedbackUrlArgs in lms_topic.js
    return Kpath_base_URL + "/Mentoring/NewMentQuest.aspx?Path=" +
        window.location.href.split("?")[0] + "&GUID=" + lms_store.cguid + "&FeedbackType=1" + _feedbackUrlArgs;
}

// lms_IsFeedbackAvailable
// 2011/09/20, Zsolt 
function lms_IsFeedbackAvailable() {
    __alert("lms_IsFeedbackAvailable() called");
    return document.LmsCom.doGetUPKValue("upk.feedback_available") && document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

// lms_GetFeedbackUrl
// 2011/09/20, Zsolt 
function lms_GetFeedbackUrl() {
    __alert("lms_GetFeedbackUrl() called");
    // _feedbackUrlArgs in lms_topic.js
    return Kpath_base_URL + "/Mentoring/NewMentQuest.aspx?Path=" +
        window.location.href.split("?")[0] + "&GUID=" + lms_store.cguid + "&FeedbackType=2" + _feedbackUrlArgs;
}


///////////////////
function _ARefresh(prefs, his, alt, next, testnext, tmenabled, dmenabled, distut, printit, fastdoit) {
    if (!this.onScreen)
        return;
    var s = "";
    if (upk.browserInfo.isExplorer() && popupVersion) s = "<div id='actionspan' style='font:8pt Arial;width:100'>";
    else if (upk.browserInfo.isExplorer()) s = "<div id='actionspan' style='font:8pt Arial;min-width:100' nowrap='true'>";
    else s = "<div id='actionspan' style='font:8pt Arial;width:100' nowrap='true'><ul style='padding-left:18px'>";

    if (alt) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Alt\");return false;'>";
        s += R_menu_alternatives;
        s += "</a></li>";
    };
    if (next) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Next\");return false;'>";
        s += R_menu_nextstep;
        s += "</a></li>";
    };
    if (testnext) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Pass\");return false;'>";
        s += R_testit_markpassed;
        s += "</a></li>";
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Fail\");return false;'>";
        s += R_testit_markfailed;
        s += "</a></li>";
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Skip\");return false;'>";
        s += R_testit_markskipped;
        s += "</a></li>";
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"TestItNotes\");return false;'>";
        s += R_testit_opennotes;
        s += "</a></li>";
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"TestItSTR\");return false;'>";
        s += R_testit_openstr;
        s += "</a></li>";
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Report\");return false;'>";
        s += R_testit_gotoreport;
        s += "</a></li>";
    };
    if (his) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Prev\");return false;'>";
        s += R_menu_prevstep;
        s += "</a></li>";

        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Restart\");return false;'>";
        s += R_menu_start;
        s += "</a></li>";
    };
    var i = 0;
    if (concepts.length > 0) {
        s += "<li>";
        s += "<a href='#' onclick='parent.parent.OnActionSelection(\"Conc\",\"0\");return false;'>";
        s += R_menu_concepts;
        s += "</a></li>";
    };

    var iState = GIState
    var iAction = GIFrames[iState].actions[GIAltIndex]
    var donext = true
    var donext2 = true

    while (donext) {
        if (GIFrames[iState].infoblocks.length > 0) {
            donext = false
            s += "<li><a href='#' onclick='parent.parent.PopupToggle(\"infodiv\")'>";
            s += R_menu_infoblocks;
            s += "</a></li>";
            if (upk.browserInfo.isExplorer()) s += "<div id='infodiv' style='display:none'>";
            else s += "<div id='infodiv' style='display:none'><ul style='padding-left:18px'>";

            while (donext2) {
                for (i = 0; i < GIFrames[iState].infoblocks.length; i++) {
                    s += "<li style='list-style-type:circle;" + (upk.browserInfo.isExplorer() ? "text-indent:18px" : "") + "'>";
                    s += "<a href='#' onclick='parent.parent.OnActionSelection(\"Info\",";
                    s += "" + i;
                    s += ",\"" + iState + "\");return false;'>";
                    s += GIFrames[iState].infoblocks[i].tooltip;
                    s += "</a></li>";
                };
                if (iAction.dn && GIFrames[iAction.next].type != "decision") {
                    iState = iAction.next
                    iAction = GIFrames[iState].actions[0]
                }
                else donext2 = false
            }
            if (upk.browserInfo.isExplorer()) s += "</div>";
            else s += "</ul></div>";
        }
        else {
            if (iAction.dn && GIFrames[iAction.next].type != "decision") {
                iState = iAction.next
                iAction = GIFrames[iState].actions[0]
            }
            else donext = false
        }
    }
    if (tmenabled || dmenabled || printit) {
        s += "<li><a href='#' onclick='parent.parent.PopupToggle(\"playdiv\")'>";
        s += R_menu_play;
        s += "</a></li>";
        if (upk.browserInfo.isExplorer()) s += "<div id='playdiv' style='display:block'>";
        else s += "<div id='playdiv' style='display:block'><ul style='padding-left:18px'>";
        if (dmenabled) {
            s += "<li style='list-style-type:circle;" + (upk.browserInfo.isExplorer() ? "text-indent:18px" : "") + "'>";
            s += "<a href='#' onclick='parent.parent.OnActionSelection(\"PlayD\"";
            s += ");return false;'>";
            s += R_mode_seeit;
            s += "</a></li>";
        }
        if (tmenabled) {
            s += "<li style='list-style-type:circle;" + (upk.browserInfo.isExplorer() ? "text-indent:18px" : "") + "'>";
            s += "<a href='#' onclick='parent.parent.OnActionSelection(\"PlayT\"";
            s += ");return false;'>";
            s += R_mode_tryit;
            s += "</a></li>";
        }
        if (printit) {
            s += "<li style='list-style-type:circle;" + (upk.browserInfo.isExplorer() ? "text-indent:18px" : "") + "'>";
            s += "<a href='#' onclick='parent.parent.OnActionSelection(\"Printit\"";
            s += ");return false;'>";
            s += R_interface_printit;
            s += "</a></li>";
        }
        if (upk.browserInfo.isExplorer()) s += "</div>";
        else s += "</ul></div>";
    };

    ///// AskAnExpert
    if (lms_IsMentoringAvailable() == true) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"AskAnExpert\");return false;'>";
        s += R_interface_askexpert;
        s += "</a></li>";
    }

    ///// ProvideFeedback
    if (lms_IsFeedbackAvailable() == true) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"ProvideFeedback\");return false;'>";
        s += R_interface_providefeedback;
        s += "</a></li>";
    }

    if (prefs) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Prefs\");return false;'>";
        s += R_menu_preferences;
        s += "</a></li>";
    };

    var url = "" + parent.location;
    var local = url.indexOf("localhost") > -1 || url.indexOf("127.0.0.1") > -1;  // we do not want to share local address
    if (UIComponents.ShareLink && !local && GetTopLevelLmsMode() != "LMS") {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Share\");return false;'>";
        s += R_menu_share;
        s += "</a></li>";
    }

    if (UIComponents.TopicHelp == true) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"Help\");return false;'>";
        s += R_menu_help;
        s += "</a></li>";
    }

    try {
        if ((GetTopLevelLmsMode() == "KPT" || Kpath_launch == true) && lms_IsKPathLogoutAvailable()) {
            s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"LogOut\");return false;'>";
            s += R_toctooltip_kpathlogout;
            s += "</a></li>";
        }
    }
    catch (e) { }

    if (fastdoit) {
        s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"ViewOutline\");return false;'>";
        s += R_menu_viewoutline;
        s += "</a></li>";
    };

    s += "<li><a href='#' onclick='parent.parent.OnActionSelection(\"CloseT\");return false;'>";
    s += R_menu_Close;
    s += "</a></li>";

    //	s+="<br>";
    //	s+="<a href='#' onclick='parent.parent.OnActionSelection(\"CloseW\");return false;'>";
    //	s+=R_gimenu_close;
    //	s+="</a>";
    if (upk.browserInfo.isExplorer()) s += "</div>";
    else s += "</ul></div>"

    if (upk.browserInfo.isExplorer() && popupVersion) {
        aPopBody.innerHTML = s;
    }
    else {
        innerBody.innerHTML = s;
    }
    //	obj=document.all('screen');
    //	popupMenu.show(100,150,230,360,obj);
    CorrectPopup()
    this.onScreen = true;
};

function _AIsOnScreen() {
    return this.onScreen;
};

/* giinit.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/



var GICookie = null
var GIS2 = null;
var GISSS = null;

function setWindow()
{

    if (upk.browserInfo.isExplorer() && popupVersion) { 
        window.resizeTo(1, 1);
	    window.moveTo(4000,4000);
	}

	if (PlayerConfig.EnableCookies)
    {
	    GICookie =	new Cookie(document,"GICookie",365,"/",null,null)
	    var left = screen.availWidth-popWidth-constPad;
	    var top = screen.availHeight-popHeight-constPad;
	    if(GICookie.Load())
	    {
	        GIS2 = GICookie["Cs2"];
	        GISSS = GICookie["Csss"];
	        //		alert(GICookie["left"] + "," + GICookie["top"] + "," + GICookie["width"] + "," + GICookie["height"])
	        if (upk.browserInfo.isExplorer() && popupVersion && GICookie["Cwidth"] > 40 && GICookie["Cleft"] >= 0 && GICookie["Ctop"] >= 0 && parseInt(GICookie["Cleft"]) + parseInt(GICookie["Cwidth"]) < screen.availWidth && GICookie["Ctop"] < screen.availHeight) {
	            LeftPos = parseInt(GICookie["Cleft"]);
	            TopPos = parseInt(GICookie["Ctop"]);
	            popWidth = parseInt(GICookie["Cwidth"]);
	            popHeight = parseInt(GICookie["Cheight"]);
	            //				GIS1=GICookie["s1"];
	            //			oPopup_show(LeftPos,TopPos,popWidth,popHeight);
	        }
	    }
    }
}

setWindow();
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


/* ecidcomp.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	EcidComparer:
//	------------
//	void Init(expressionstr)	-> Initializes the object variable with expression string, got the player 
//										as ECID parameter in command line
//	BOOL Compare(ecidarray)		-> EcidArray contains ECID-s, got the player in an Action function
//										If the return value is true, the player has to start from frame, that
//										contain the given action, as "forward" action.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Using:	You have to initialize the object variable, and you can use the compare function for every action.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Important:	Include with "query.js"!!!
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var EcidComparer =
{
    expstr: "",

    Init:
function (expressionstr) {
	var ev = null;
    if (expressionstr && expressionstr.length > 0) {
        ev = QueryParser.Parse("URI", expressionstr);
    }
    else {
        this.expstr = "";
        return;
    };

    if (ev)
        this.expstr = ev;
},






    Compare:
function (ecidarray) {
    if (this.expstr.length == 0)
        return false;
    if (!ecidarray)
        return false;
    eval("exparray = [" + this.expstr + "]");
    for (var i = 0; i < exparray.length; i++) {
        exparray[i].l = false;
        if (exparray[i].a.toLowerCase() == "s") {
            for (var j = 0; j < ecidarray.length; j++) {
                if (matchString(ecidarray[j], exparray[i].p)) {
                    exparray[i].l = true;
                };
            };
        };
    };
    EcidCompareStack.Init();
    for (var i = 0; i < exparray.length; i++) {
        if (exparray[i].a.toLowerCase() == "s") {
            EcidCompareStack.Push(exparray[i]);
        }
        else {
            var a = EcidCompareStack.Pop();
            var b = EcidCompareStack.Pop();
            if (exparray[i].p == "|")
                a.l = a.l || b.l;
            else
                a.l = a.l && b.l;
            EcidCompareStack.Push(a);
        };
    };
    return EcidCompareStack.Pop().l;
}
};

function StackItem(a, p, l) {
    this.a = a;
    this.p = p;
    this.l = l;
};

var EcidCompareStack =
{
    Init:
function () {
    this.stArray = new Array();
    this.pTop = (-1);
},

    Push:
function (element) {
    if (this.stArray.length - this.pTop == 1) {
        this.stArray[this.stArray.length] = new StackItem(element.a, element.p, element.l);
        this.pTop++;
    }
    else {
        this.pTop++;
        this.stArray[this.pTop] = new StackItem(element.a, element.p, element.l);
    };
},

    Pop:
function () {
    if (this.pTop != (-1)) {
        return this.stArray[this.pTop--];
    };
}
};

/////////////////////////////////////////////////////////////////////////////////////

function matchCharacter(char1, char2) {
    return (ToHalfWidth(char1) == ToHalfWidth(char2));
}

function replaceDotAndCircle(str) {
    var fullKatakanaSet1 = "ガギグゲゴザジズゼゾダヂヅデドバビブベボ";
    var newFullKatakanaSet1 = "カキクケコサシスセソタチツテトハヒフヘホ";
    var fullKatakanaSet2 = "パピプペポ"
    var newFullKatakanaSet2 = "ハヒフヘホ";
    var newStr = null;

    newStr = str.replace(new RegExp("ﾞ", "g"), "#");
    newStr = newStr.replace(new RegExp("ﾟ", "g"), "*");

    for (var i = 0; i < fullKatakanaSet1.length; i++) {
        newStr = newStr.replace(new RegExp(fullKatakanaSet1.charAt(i), "g"), newFullKatakanaSet1.charAt(i) + "#");
    }
    for (var i = 0; i < fullKatakanaSet2.length; i++) {
        newStr = newStr.replace(new RegExp(fullKatakanaSet2.charAt(i), "g"), newFullKatakanaSet2.charAt(i) + "*");
    }
    return newStr;
}

function matchString(s1, s2, casesensitive) {
    if (!s1)
        return false;
    if (!casesensitive)
        casesensitive = false;
    var sl1 = s1.length;
    var sl2 = s2.length;
    if (sl1 == 0 && sl2 == 0)
        return true;
    if (sl1 == 0 && sl2 != 0)
        return false;
    if (sl1 != 0 && sl2 == 0)
        return false;
    if (sl1 != sl2)
        return false;

    var ss1 = (casesensitive ? s1 : s1.toLowerCase());
    var ss2 = (casesensitive ? s2 : s2.toLowerCase());

    var newStr1 = replaceDotAndCircle(ss1);
    var newStr2 = replaceDotAndCircle(ss2);
    if (newStr1.length != newStr2.length)
        return false;

    for (var i = 0; i < newStr1.length; i++) {
        if (!matchCharacter(newStr1.substr(i, 1), newStr2.substr(i, 1)))
            return false;
    }
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////
/* giplayer.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/



var GIFrames = new Object;
var GIState = null;
var GIChainState = null;
var GIFrameCC = null;
var GIActionCC = null;
var GIAdvText = null;
var GIScreenshot = null;
var GIHighlight = null;
var GICamera = null;
var GITextFrame = null;
var GIInfoFrame = null;
var GIFirstFrame = null;
var GIPlayer = null;
var GIActAction = null;
var GIPrevType = null;
var GINextState = null;
var GIAltIndex = 0;
var GIChainAltIndex = 0;
var GIOnLoad = false;
var GIEndFrame = false;
var GINoCookieSave = true;
var ActMenu = null;
var concepts = new Array();
var GIHistory = new Array();
var PlaySound = false;
var SoundAvail = false;
var AudioAction = null;
var P_GIRESOURCES = "";
var GITMEnabled = false;
var GIDMEnabled = false;
var GITemplateSet = null;
var GIbgcolor = null;
var playMode = "D"
var testIt = false;
var strWindow, testNotesWindow, testReportWindow = null;
var testItPassed = true;
var gotoReport = false;
var startTime = new Date().getTime();
var timeSpent = 0;

var fatSSPath = "";
var fatTSPath = "";
var param_ctx = "";
var param_ctxlist = "";
var param_guid = "";
var param_printitname = "";
var param_fastdoit = false;
var param_nosound = false;
var gicontextID = null;
var screenNames = new Array();

var safeUriMode = false;
var mViewOutline = false;

var showFrameIDToggle = false;


P_GIRESOURCES = "../../../img/";

//defines
var SM_CYCAPTION = 19;
var SM_CYFRAME = 4;

//-----   Frame types: "normal", "decision", "start", "end"
function GIFrame(id, sspath, type, header) {
    if (header) header = header.replace(/&amp;/g, '&');
    GIFrameCC = { actions: new Array, infoblocks: new Array, sspath: sspath, type: type, header: header };
    screenNames[screenNames.length] = id;
    GIFrames[id] = GIFrameCC;
}

function StartsWith(s, prefix) {
    if (s.length < prefix.length)
        return false;
    var prlow = prefix.toLowerCase();
    var sp = s.substr(0, prefix.length);
    var slow = sp.toLowerCase();
    if (slow == prlow)
        return true;
    return false;
}

function RemoveNbsp(s)
// Remove &nbsp; characters from bubbletext, except the leadin characters in every paragraphs
{
    var status = 0;
    var output = "";
    var i = 0;
    while (i < s.length) {
        snext = s.substr(i);
        switch (status) {
            case 0: 		// search <font tag
                if (StartsWith(snext, "<font")) {
                    output += snext.substr(0, 5);
                    i += 5;
                    status = 1;
                }
                else {
                    output += snext.substr(0, 1);
                    i++;
                }
                break;
            case 1: 		// search > of <font tag
                if (StartsWith(snext, ">")) {
                    output += snext.substr(0, 1);
                    i += 1;
                    status = 2;
                }
                else {
                    output += snext.substr(0, 1);
                    i++;
                }
                break;
            case 2: 		// search nbsp (change last or single nbsp to space)
                if (StartsWith(snext, "&nbsp;&nbsp;")) {
                    output += snext.substr(0, 6);
                    i += 6;
                    status = 2;
                }
                else if (StartsWith(snext, "&nbsp; ")) {
                    output += snext.substr(0, 7);
                    i += 7;
                    status = 2;
                }
                else if (StartsWith(snext, "&nbsp;")) {
                    output += " ";                          // change!!!
                    i += 6;
                    status = 2;
                }
                else if (StartsWith(snext, ">")) {
                    output += snext.substr(0, 1);
                    i += 1;
                    status = 0;
                }
                else {
                    output += snext.substr(0, 1);
                    i++;
                }
                break;
        }
    }
    return output;
}

function TemplateTextCorrection(text) {
    var $fulltext = $("<div>" + text + "</div>");
    var $face = $fulltext.find("span[face]");
    if ($face.length == 0)
        return text;
    var family = "";    // font-family
    for (var i = 0; i < $face[0].attributes.length; i++) {
        var a = $face[0].attributes[i];
        if (a.name == "face")
            family = a.value;
    }
    $face.find("span").css("font-family", family);
    return $fulltext[0].innerHTML;
}

function GIAction(id, next, matchedcontext, ctx, ecidarray, text, dn, icon, bcolor, input) {
    GIActionCC = { id: id, next: next, matchedcontext: matchedcontext, ctx: ctx, ecidarray: ecidarray, text: TemplateTextCorrection(RemoveNbsp(text)), dn: dn, icon: icon, bcolor: bcolor, input: (fixInputString(input)), hotspots: new Array };
    GIActionCC.ecidarray = null;
    GIFrameCC.actions.push(GIActionCC);
}

function InfoBlock(buttonfile, url, tooltip, infotype, infokey) {
    if (!tooltip) tooltip = "undefined";
    else {
        tooltip = tooltip.replace(/"/g, '&quot;');
        tooltip = tooltip.replace(/&amp;/g, '&');
    }
    _buttonfile = buttonfile;
    _img = "infobitmapimage.gif";
    _sb = buttonfile.toLowerCase();
    if (_sb.substr(_sb.length - _img.length) == _img) {
        _buttonfile = buttonfile.substr(0, _sb.length - _img.length) + _img;
    }
    GIFrameCC.infoblocks.push({ buttonfile: _buttonfile, url: url, tooltip: tooltip, infotype: infotype, infokey: infokey })
};

function GIInfoBlock(src, icon, alt) {
    GIFrameCC.infoblocks.push({ src: src, icon: icon, alt: alt });
}

function GIHotspot(left, top, right, bottom, explanation) {
    left = left - 3;
    top = top - 3;
    var width = right - left - 3;
    var height = bottom - top - 3;
    GIActionCC.hotspots.push({ left: left, top: top, width: width, height: height, explanation: explanation })
}


function ConceptInfo(buttonfile, url, tooltip, infotype, infokey) {
    concepts[concepts.length] = new Object({ buttonfile: buttonfile, url: url, tooltip: tooltip, infotype: infotype, infokey: infokey });
};

function MyEscape(s) {
    var snew = "";

    for (var i = 0; i < s.length; i++) {
        ss = s.substr(i, 1);
        if ((ss >= '0' && ss <= '9') ||
			(ss >= 'a' && ss <= 'z') ||
			(ss >= 'A' && ss <= 'Z')) {
            snew += ss;
        }
        else {
            ss = s.charCodeAt(i);
            a = "0000" + ss.toString(16).toUpperCase();
            snew += "$" + a.substr(a.length - 4);
        }
    }

    return snew;
}

function EventCancel(event) {
    if (!upk.browserInfo.isExplorer() && !IsTouchDevice()) {
        var e = event;
        e.preventDefault();
    }
    return false;
}

function TeacherModeEnabled() {
    GITMEnabled = true
}

function DemoModeEnabled() {
    GIDMEnabled = true
}

function SetScreenshotPath(path) {
    if (path != "") {
        fatSSPath = path + "/";
        SoundPlayerObj.SetSoundPath(path);
    }
    else {
        fatSSPath = document.location.href;
        while (fatSSPath.indexOf('\\') != -1)
            fatSSPath = fatSSPath.replace('\\', '/');
        fatSSPath = fatSSPath.substr(0, fatSSPath.lastIndexOf('/') + 1);
    }
}

function startTopic() {

    if (noStart) {
        this.close();
        return;
    }
    if (window.opener) {
        try {
            if (!upk.browserInfo.isFF())
                window.opener.blur();
        }
        catch (e) { };
    }

    var ss = document.location.hash.substring(1);
    var strArgs = ss.split("&");
    if (strArgs.length == 0 || strArgs[0] == "")
        ss = document.location.search.substring(1);
    strArgs = ss.split("&");

    if (strArgs.length == 1) {
        if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
            safeUriMode = true;
            var s = Escape.SafeUriUnEscape(strArgs[0].substr(3));
            strArgs = s.split("&");
        }
    }

    for (var i = 0; i < strArgs.length; i++) {
        if (strArgs[i].substr(0, 7).toLowerCase() == "nosound") {
            param_nosound = true;
        }
        if (strArgs[i].substr(0, 6).toLowerCase() == "testit") {
            testIt = true;
        }
    }

    Init()
    InitLmsMode("player");

    if (_lmsMode != null) {
        if (param_nosound == false) {
            if (Sound_Init(PlaySound, UserPref_PlayAudio_Original, "GIClosePlayer()") == false)
                return;
        }
    }

    ctxHelper.SetContext("topicPlayer");
    lms_InitPage((_lmsMode == null ? 0 : -1), (_lmsMode == null ? window.opener : null), "T_" + document.getElementById("TopicId").getAttribute("topicid"), "FirstScreen()");
}

// lms callback function after InitPage
function FirstScreen() {
    startTopic2();
}

function startTopic2() {
    if (!GIOnLoad) {
        setTimeout(startTopic2, 50)
        return;
    }
    BuildBackActions();
    GIChainState = GIState = GIFirstFrame;
    lms_topicStart(getMyGuid(), testIt ? "E" : "D");

    if (GIS2) {
        var s2p = GIS2 / (popHeight - 60)

        if (s2p < 0.1)
            s2p = 0.1;
        if (s2p > 0.9)
            s2p = 0.9;
        if (upk.browserInfo.isExplorer() && popupVersion && (GIS2.indexOf("%") == -1)) {
            oPopup.document.getElementById("split1").style.height = ((1 - s2p) * 100) + "%";
            oPopup.document.getElementById("split2").style.height = (s2p * 100) + "%";
        }
        else if (GIS2.indexOf("%") >= 0) {
            oPopup.document.getElementById("split1" + idPostFix).style.height = GIS2;
            oPopup.document.getElementById("split2" + idPostFix).style.top = GIS2;
            oPopup.document.getElementById("split2" + idPostFix).style.height = (100 - Number(GIS2.substring(0, GIS2.indexOf("%")))) + "%";
        }
    }
    if (GISSS == 1) toggleScreenshot(true);

    var ss = document.location.hash.substring(1);
    var strArgs = ss.split("&");
    if (strArgs.length == 0 || strArgs[0] == "")
        ss = document.location.search.substring(1);
    strArgs = ss.split("&");

    if (strArgs.length == 1) {
        if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
            safeUriMode = true;
            var s = Escape.SafeUriUnEscape(strArgs[0].substr(3));
            strArgs = s.split("&");
        }
    }

    var _dLaunch = false;
    var _keepAlive = false;

    for (var i = 0; i < strArgs.length; i++) {
        if (strArgs[i].substr(0, 6).toLowerCase() == "frame=") {
            GIChainState = GIState = strArgs[i].substr(6);
        }
        if (strArgs[i].substr(0, 4).toLowerCase() == "Ctx=") {
            param_ctx = strArgs[i].substr(4);
        }
        if (strArgs[i].substr(0, 5).toLowerCase() == "guid=") {
            param_guid = strArgs[i].substr(5);
        }
        if (strArgs[i].substr(0, 12).toLowerCase() == "contextlist=") {
            param_ctxlist = strArgs[i].substr(12);
        }
        if (strArgs[i].substr(0, 9).toLowerCase() == "fastdoit=") {
            param_fastdoit = true;
        }
        if (strArgs[i].substr(0, 12).toLowerCase() == "printitname=") {
            param_printitname = strArgs[i].substr(12);
        }
        if (strArgs[i].substr(0, 12).toLowerCase() == "directlaunch") {
            _dLaunch = true;
        }
        if (strArgs[i].substr(0, 16).toLowerCase() == "keep-alive-timer") {
            _keepAlive = true;
        }
    }
    if (_dLaunch == true && _keepAlive == true) {
        KeepAlive_Init("../../../");
    }

    if (SoundPlayerObj) SoundAvail = SoundPlayerObj.IsAvailable()

    if (param_nosound == true) {
        SetNoSound(true);
    }
    if (GetNoSound()) {
        SoundAvail = false;
    }
    SetStartMatchedContext(param_ctxlist, param_guid);

    if (testIt && GIState == GIFirstFrame) {
        GIChainState = GIState = "teststart";
    }

    oPopup.document.getElementById("frameidtext" + idPostFix).innerHTML = R_frameid;
    switch (PlayerConfig.ShowFrameID.toLowerCase()) {
        case "on":
            oPopup.document.getElementById("frameiddiv" + idPostFix).style.display = "block";
            break;
        case "off":
            oPopup.document.getElementById("frameiddiv" + idPostFix).style.display = "none";
            break;
        case "shiftf1":
            showFrameIDToggle = 112;
            break;
        case "shiftf2":
            showFrameIDToggle = 113;
            break;
        case "shiftf3":
            showFrameIDToggle = 114;
            break;
        case "shiftf4":
            showFrameIDToggle = 115;
            break;
        case "shiftf5":
            showFrameIDToggle = 116;
            break;
        case "shiftf6":
            showFrameIDToggle = 117;
            break;
        case "shiftf7":
            showFrameIDToggle = 118;
            break;
        case "shiftf8":
            showFrameIDToggle = 119;
            break;
        case "shiftf9":
            showFrameIDToggle = 120;
            break;
        case "shiftf10":
            showFrameIDToggle = 121;
            break;
        case "shiftf11":
            showFrameIDToggle = 122;
            break;
        case "shiftf12":
            showFrameIDToggle = 123;
            break;
    }
    if (showFrameIDToggle) {
        document.onkeydown = CheckFrameIDKeys;
    }

    document.title = giTitle;

    if (IsTouchDevice()) { ShowPlayButton(); }
    else { RefreshStep(); }
}

var swipe = new Swipe();

function ShowPlayButton() {
    var startdiv = $("<div>", {
        "class": "grayoverlay",
        html: $("<img/>", {
            "class": "startcenter",
            src: "../../../img/ipad_playbutton.png"
        }).add("<div>", {
            "class": "startplayfont",
            text: R_swipe_instruction_doit
        }),
        click: function () { onStartClick(); }
    })
    $(document.body).append(startdiv);

    startdiv.bind('touchstart', function (e) {
        e.stopPropagation();
        swipe.Init($("#noPopupFF").width());
    });
    startdiv.bind('touchmove', function (e) {
        e.stopPropagation();
        try {
            if (e.originalEvent.touches[1] || e.originalEvent.changedTouches[1]) {
                swipe.DetectedMulti();
            }
            else if (swipe.IsNotZoomed()) {
                e.preventDefault();
            }
        }
        catch (e) { };
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        swipe.Add(touch.pageY, touch.pageX);

    });
    startdiv.bind('touchend', function (e) {
        var sensitivity = 30;
        if (swipe.IsMulti()) {
            return;
        }
        if (swipe.IsNotZoomed() == false) {
            return;
        }
        var x = swipe.GetX();
        var y = swipe.GetY();
        if (Math.abs(x) > Math.abs(y)) {
            return;
        }
        if (y < (0 - sensitivity)) {
            onStartClick();
        }
    });
}

function onStartClick() {
    $(".grayoverlay").remove();
    SoundPlayerObj.InitAudioPlayer();
    RefreshStep();
}

function Swipe() {
}

Swipe.prototype.Init = function (width) {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.dnx = 0;
    this.dny = 0;
    this.width = width;
    this.multi = false;
}

Swipe.prototype.Add = function (x, y) {
    if (this.x == 0 && this.y == 0) {
        this.x = this.dx = this.dnx = x;
        this.y = this.dy = this.dny = y;
    }
    else {
        this.dnx = this.dx;
        this.dny = this.dy;
        this.dx = x;
        this.dy = y;
    }
}

Swipe.prototype.IsNotZoomed = function () {
    if (window.innerWidth > this.width)
        return true;
    return (Math.abs(window.innerWidth - this.width) < 5);
}

Swipe.prototype.DetectedMulti = function () {
    this.multi = true;
}

Swipe.prototype.IsMulti = function () {
    return this.multi;
}

Swipe.prototype.Result = function () {
    return ("" + (this.dx - this.x) + " " + (this.dy - this.y));
}

Swipe.prototype.GetSpeedX = function () {
    return (this.dx - this.dnx);
}

Swipe.prototype.GetSpeedY = function () {
    return (this.dy - this.dny);
}

Swipe.prototype.GetX = function () {
    return (this.dx - this.x);
}

Swipe.prototype.GetY = function () {
    return (this.dy - this.y);
}

Swipe.prototype.GetPoint = function () {
    return ("" + this.dx + "," + this.dy);
}

function ecidStr(s) {
    return replaceString("%27", "'", s);
}

var ecidMatchingFrames = new Array();
var ecidStartDecisions = new Object();
var ecidDecisionStart = false;

function SearchPathForEcid(frid, ctxArray) {
    var frameid = frid;
    var d = true;
    while (d) {
        var frame = GIFrames[frameid];
        if (frame == null) {
            continue;
        }
        if (frame.type == "end") {
            d = false;
        }
        if (frame.type == "decision") {
            var match = false;
            ecidStartDecisions[frameid] = { id: frameid, display: false, pathstoignore: new Array() };
            for (var i = 0; i < frame.actions.length; i++) {
                if (SearchPathForEcid(frame.actions[i].next, ctxArray)) {
                    if (match) {
                        ecidStartDecisions[frameid].display = true;
                    }
                    match = true;
                } else {
                    ecidStartDecisions[frameid].pathstoignore.push(frame.actions[i].id);
                }
            };
            return match;
        }
        var _ctxArray = ctxArray.split("C");
        for (var i = 0; i < _ctxArray.length; i++) {
            ctxItem = "C" + _ctxArray[i];
            if (ctxItem != "C") {
                for (var j = 0; j < frame.actions.length; j++) {
                    var act = frame.actions[j];
                    if (act.matchedcontext == ctxItem) {
                        ecidMatchingFrames.push({ frameid: frameid, altindex: j });
                        return true;
                    }
                }
            }
        }
        frameid = frame.actions[0].next;
    }
    return false;
}

function FindEcidStartNextFrame(frid) {
    var frameid = frid;
    var frame = GIFrames[frameid];
    if (frame.type == "decision") {
        if (ecidStartDecisions[frameid].display) {
            GIChainState = GIState = frameid;
            return;
        }
    }
    for (var ii = 0; ii < ecidMatchingFrames.length; ii++) {
        //            alert(act.id + " : " + ecidMatchingFrames[ii].frameid)
        if (frameid == ecidMatchingFrames[ii].frameid) {
            GIChainState = GIState = frameid;
            GIChainAltIndex = GIAltIndex = ecidMatchingFrames[ii].altindex;
            ecidDecisionStart = false;
            return;
        }
    }
    for (var iii = 0; iii < frame.actions.length; iii++) {
        if (frame.actions[iii].next) {
            FindEcidStartNextFrame(frame.actions[iii].next);
        }
    }
}

function SetStartMatchedContext(param_ctxlist, param_guid) {
    if (param_ctxlist == "" || GIState != GIFirstFrame || param_guid != getMyGuid()) {
        return;
    }

    SearchPathForEcid(GIFirstFrame, param_ctxlist);
    if (ecidMatchingFrames.length == 1) {
        SetStartFrame(ecidMatchingFrames[0].frameid);
        GIChainAltIndex = GIAltIndex = ecidMatchingFrames[0].altindex;
        StartFrameCorrection(GIState);
        return;
    }
    else if (ecidMatchingFrames.length >= 2) {
        ecidDecisionStart = true;
        FindEcidStartNextFrame(GIFirstFrame);
        StartFrameCorrection(GIState);
    }
}

function SetParamCtx(ctxlist) {
    gicontextID = ctxlist;
    SetStartContext();
}

var bBackActionsBuilded = false;

function BuildBackActions() {
    if (!bBackActionsBuilded) {
        var scr = null;
        for (var i = 0; i < screenNames.length; i++) {
            scr = GIFrames[screenNames[i]];
            scr.backActions = new Array();
        };
        for (i = 0; i < screenNames.length; i++) {
            scr = GIFrames[screenNames[i]];
            for (var j = 0; j < scr.actions.length; j++) {
                scr.actions[j].prevFrame = screenNames[i];
                s = scr.actions[j].next;
                if (s) {
                    if (GIFrames[s].type != "end")
                        GIFrames[s].backActions[GIFrames[s].backActions.length] = scr.actions[j];
                }
            };
        };
    };
    bBackActionsBuilded = true;
};

function StartFrameCorrection(frameID) {
    var frmPos = frameID;
    if (GIFrames[frameID].backActions.length == 0) {
        StartScreen = "start";
        return;
    };
    var fID = "";
    for (var i = 0; i < GIFrames[frameID].backActions.length; i++) {
        if (i == 0)
            fID = GIFrames[frameID].backActions[0].prevFrame;
        else {
            if (fID != GIFrames[frameID].backActions[0].prevFrame) {
                GIChainState = GIState = frameID;
                return;
            };
        };
    };
    frmPos = GIFrames[frmPos].backActions[0].prevFrame;
    while (true) {
        if (GIFrames[frmPos].backActions.length == 0) {
            GIChainState = GIState = "start";
            return;
        };
        if (GIFrames[frmPos].type == "decision") {
            GIChainState = GIState = frmPos;
            return;
        };
        GIChainState = GIState = frameID;
        return;
    };
};

function SetStartFrame(frameID) {
    if (frameID.length == 0)
        return;
    if (GIFrames[frameID])
        GIChainState = GIState = frameID;
};

function SetStartContext() {
    if (gicontextID.length == 0)
        return;
    var ctxArray = new Array();
    ctxArray = gicontextID.split("+");

    for (var i = 0; i < ctxArray.length; i++) {
        ctxItem = ctxArray[i];
        for (var j = 0; j < screenNames.length; j++) {
            scrName = screenNames[j];
            scr = GIFrames[scrName];
            for (var k = 0; k < scr.actions.length; k++) {
                act = scr.actions[k];
                if (act.ctx == ctxItem) {
                    SetStartFrame(scrName);
                    StartFrameCorrection(GIState);
                    return;
                };
            };
        };
    };
};

function OnClose() {
    top.GIPlayer.closeAp();
}

function SetSound(s) {
    if (s && soundModes.indexOf("D") > 0) PlaySound = s;
}

function soundIsPublished() {
    return true;
}

var KeyHookUp = 1;
var KeyHookTimer = 0;

function StartKeyHook() {
    StopKeyHook();
    PGIKeyHook.onclick = KeyHookHandler;
    KeyHookTimer = setInterval(KeyHookCallback, 50);
}

function StopKeyHook() {
    clearInterval(KeyHookTimer);
}

function KeyHookCallback() {
    PGIKeyHook.click();
}

function KeyHookHandler() {
    if (UserPrefs.DoIt.HotKey.Ctrl == "N" && UserPrefs.DoIt.HotKey.Shift == "N" && UserPrefs.DoIt.HotKey.Alt == "N") return;
    var F_CTRL = 0x1;
    var F_LCTRL = 0x2;
    var F_ALT = 0x4;
    var F_LALT = 0x8;
    var F_SHIFT = 0x16;
    var F_LSHIFT = 0x32;
    var nextact = false;

    var mask = 0x0;
    if (UserPrefs.DoIt.HotKey.Ctrl == "L") { mask |= F_LCTRL | F_CTRL }
    if (UserPrefs.DoIt.HotKey.Ctrl == "R") { mask |= F_CTRL }
    if (UserPrefs.DoIt.HotKey.Shift == "L") { mask |= F_LSHIFT | F_SHIFT }
    if (UserPrefs.DoIt.HotKey.Shift == "R") { mask |= F_SHIFT }
    if (UserPrefs.DoIt.HotKey.Alt == "L") { mask |= F_LALT | F_ALT }
    if (UserPrefs.DoIt.HotKey.Alt == "R") { mask |= F_ALT }

    var flags = 0x0;
    if (event.ctrlLeft) { flags |= F_LCTRL }
    if (event.ctrlKey) { flags |= F_CTRL }
    if (event.shiftLeft) { flags |= F_LSHIFT }
    if (event.shiftKey) { flags |= F_SHIFT }
    if (event.altLeft) { flags |= F_LALT }
    if (event.altKey) { flags |= F_ALT }

    nextact = flags == mask;

    if (nextact) {
        if (KeyHookUp) {
            KeyHookUp = 0;
            if (GIFrames[GIState].type == "end" || GIFrames[GIState].type == "testend") {
                if (GIFrames[GIState].type == "end" && testIt) {
                    GINextStep();
                }
                else {
                    closeAp();
                }
            }
            else {
                if (testIt && GIFrames[GIState].type == "normal") {
                    GIPassStep();
                }
                else {
                    GINextStep();
                }
            }
        }
    } else
        KeyHookUp = 1;
}

function ToggleShowFrameID() {
    //    alert("aaa");
    if (oPopup.document.getElementById("frameiddiv" + idPostFix).style.display == "none") { oPopup.document.getElementById("frameiddiv" + idPostFix).style.display = "block"; }
    else oPopup.document.getElementById("frameiddiv" + idPostFix).style.display = "none";
    return false;
}

function CheckFrameIDKeys(event) {
    if (event == null)
        event = window.event;
    //    alert(event.keyCode)
    if (event != undefined) {
        if (event.type == "keydown") {
            if (event.keyCode == showFrameIDToggle) {
                if (event.shiftKey == true) {
                    ToggleShowFrameID();
                    //                    if (event.preventDefault) {event.preventDefault(); }
                    return false;
                }
            }
        }
    }
}

function GIHilite(ssid) {
    GIHighlight.innerHTML = '';
    if (!ssid) {
        GIHighlight.style.display = "none";
        return;
    } else {
        var col = UserPrefs.MarqueeColor;
        for (var i = 0; i < SSAList[ssid].a.hotspots.length; i++) {

            GIHighlight.innerHTML += '<DIV id="gihotspot" style="position:absolute;left:' + SSAList[ssid].a.hotspots[i].left
				+ 'px;top:' + SSAList[ssid].a.hotspots[i].top + 'px;z-index:2">'
				+ '<img id="gihotspotimg" src="' + P_GIRESOURCES + 'spacer.gif" width="' + SSAList[ssid].a.hotspots[i].width
				+ '" height="' + SSAList[ssid].a.hotspots[i].height
				+ '" class="Area" border="3" style="border-color:' + col + '"/></DIV>'

        }
        GIHighlight.style.display = "inline";
    }
}

var hpos = null;
var GICameraSL = 0, GICameraST = 0;
function GICenterHL() {
    if (!hpos) return;
    var cx = GICamera.clientWidth / 2;
    var cy = GICamera.clientHeight / 2;
    var ox = hpos.left - cx;
    if (ox < 0)
        ox = 0;
    ox = ox - GICameraSL;
    var oy = hpos.top - cy;
    if (oy < 0)
        oy = 0;
    oy = oy - GICameraST;
    vl = Math.sqrt(ox * ox + oy * oy);
    if (vl < 5) {
        clearInterval(IV);
        IV = null;
        GICamera.scrollLeft = hpos.left - (GICamera.clientWidth / 2);
        GICamera.scrollTop = hpos.top - (GICamera.clientHeight / 2);
        return;
    }
    ox = ox * 3 / vl;
    oy = oy * 3 / vl;
    GICameraSL = GICameraSL + ox;
    GICameraST = GICameraST + oy;
    GICamera.scrollLeft = GICameraSL;
    GICamera.scrollTop = GICameraST;
}

var contCHL = false;
function GIStopCHL() {
}

var SSAList = null; // ScreenShotList
var IV = null;
function GILoadSS(ssid) {
    hpos = null;
    GIHighlight.innerHTML = '';
    if (ssid) {
        GIScreenshot.src = fatSSPath + SSAList[ssid].sspath;
        if (SSAList[ssid].imgid) {
            for (var n in SSAList) {
                oPopup.document.getElementById(SSAList[n].imgid).src = "../../../img/stepdispl0.gif"
            }
            oPopup.document.getElementById(SSAList[ssid].imgid).src = "../../../img/stepdispl1.gif"
        }
        if (SSAList[ssid].a.hotspots.length > 0) {
            hpos = { left: SSAList[ssid].a.hotspots[0].left, top: SSAList[ssid].a.hotspots[0].top }
            if (!SSAList[ssid].a.hotspots[0].explanation) {
                GIHilite(ssid);
            }
            setTimeout(GIStartIV, 500);
        }
    }
}
function GIStartIV() {
    GICameraSL = GICamera.scrollLeft;
    GICameraST = GICamera.scrollTop;
    if (!IV)
        IV = setInterval(GICenterHL, 10);
}

function OnUpdatePreferences(userpref) {
    UserPrefs.Copy(userpref);
    setTimeout('RefreshStep()', 100);
}

function RefreshStep() {
    GITextFrame.style.overflow = "visible";
    if (GIState) GIStep(GIState);
    GITextFrame.style.overflow = "auto";
}

function GIStep(newState) {
    //	SoundPlayerObj.Play("01000002.ASX");
    if (upk.browserInfo.isExplorer()) {
        GITextFrame.style.overflow = "visible";
        StopKeyHook();
    }
    GIEndFrame = false;
    GIHighlight.innerHTML = '';
    GIAdvText.innerHTML = '';
    AudioAction = null;
    SSAList = null;
    hpos = null;
    var text = ""
    if (newState == null) {
        GIClosePlayer();
        return
    }
    if (upk.browserInfo.isExplorer() && popupVersion) GICamera.style.width = popWidth - 18;

    GIChainState = GIState = newState

    oPopup.document.getElementById("frameidvalue" + idPostFix).innerHTML = (GIFrames[GIState].type == "start" || GIFrames[GIState].type == "teststart") ? "Start" : GIState.substr(1);
    var advkeytext = "";
    if (upk.browserInfo.isExplorer()) {
        switch (UserPrefs.DoIt.HotKey.Ctrl) {
            case "L":
                advkeytext += "[" + R_interface_left + R_interface_ctrl + "]";
                break;
            case "R":
                advkeytext += "[" + R_interface_right + R_interface_ctrl + "]";
                break;
        }
        switch (UserPrefs.DoIt.HotKey.Shift) {
            case "L":
                if (advkeytext != "") advkeytext += " + ";
                advkeytext += "[" + R_interface_left + R_interface_shift + "]";
                break;
            case "R":
                if (advkeytext != "") advkeytext += " + ";
                advkeytext += "[" + R_interface_right + R_interface_shift + "]";
                break;
        }
        switch (UserPrefs.DoIt.HotKey.Alt) {
            case "L":
                if (advkeytext != "") advkeytext += " + ";
                advkeytext += "[" + R_interface_left + R_interface_alt + "]";
                break;
            case "R":
                if (advkeytext != "") advkeytext += " + ";
                advkeytext += "[" + R_interface_right + R_interface_alt + "]";
                break;
        }
    }
    var nextsteptext = advkeytext ? formatStr(R_interface_nextstep, advkeytext) : R_interface_nextstep_nokey;
    //	window.open("../../../toc/noscroll.html?Topic.htm#Mode=T", "tplayer", "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0, fullscreen");

    if (GIState == "teststart" || GIState == "testend") {
        GIClearAll();
        if (!GIAltIndex) { GIChainAltIndex = GIAltIndex = 0; }

        if (GIState == "teststart") {
            GIActAction = GIFrames[GIState].actions[GIAltIndex]
            GINextState = GIActAction.next;
            lms_frameView(getMyGuid(), "D", GIState);
            GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GINextStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstep + '" border="0" title="' + nextsteptext + '"/></span>';
        }
        else {
            GIEndFrame = true;
            if (GIHistory.length > 0)
                GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GIPrevStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_prevstep + '" border="0" title="' + R_menu_prevstep + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"/>'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.closeAp(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstepclose + '" border="0" title="' + R_bubble_closeondemand + '"/></span>';
        }

        GIgetActionText(GIActAction);
        if (GIState == "testend") {
            GIGetTestResults();
        }
        //        (GIState == "TestStart") ? $("PGITextFrame" + idPostFix).append($("#TestItIntro").html()) : $("PGITextFrame" + idPostFix).append($("#TestItEnd").html());
        GITextFrame.innerHTML = (GIState == "teststart") ? $("#TestItIntro").html().replace(/__my_new_line__/g, '<br>') : $("#TestItEnd").html().replace(/__my_new_line__/g, '<br>');
        if (ScreenshotVisible) {
            if (GIState == "teststart") {
                SSAList[GIActAction.id].a = GIActAction;
                SSAList[GIActAction.id].sspath = GIFrames[GIState].sspath;
                GILoadSS(GIActAction.id)
            }
            GIHilite(null);
        }

        if (upk.browserInfo.isExplorer()) StartKeyHook();
    }

    if (GIFrames[GIState].type == "start" || GIFrames[GIState].type == "end") {
        GIClearAll();
        if (!GIAltIndex) { GIChainAltIndex = GIAltIndex = 0; }
        GIActAction = GIFrames[GIState].actions[GIAltIndex]

        if (GIFrames[GIState].type == "start") {
            lms_frameView(getMyGuid(), "D", GIState);
            if (UserPrefs.ShowLeadIn != "all") {
                GINextState = GIActAction.next;
                GINextStep()
                return false;
            }
            if (GIHistory.length > 0)
                GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GIPrevStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_prevstep + '" border="0" title="' + R_menu_prevstep + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"/>'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GINextStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstep + '" border="0" title="' + nextsteptext + '"/></span>';
        }
        else {
            GIEndFrame = true;
            gotoReport = false;
            if (GIHistory.length > 0) {
                GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GIPrevStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_prevstep + '" border="0" title="' + R_menu_prevstep + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"/>'
            }
            if (testIt) {
                GIActAction.next = "testend";
                GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GINextStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstep + '" border="0" title="' + nextsteptext + '"/></span>';
            }
            else {
                GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.closeAp(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstepclose + '" border="0" title="' + R_bubble_closeondemand + '"/></span>';
            }
        }

        GILoadInfoBlocks(GIInfoFrame);

        text += GIgetActionText(GIActAction)
        GITextFrame.innerHTML = text;

        if (ScreenshotVisible) {
            if (GIState == "start") {
                SSAList[GIActAction.id].a = GIActAction;
                SSAList[GIActAction.id].sspath = GIFrames[GIState].sspath;
                GILoadSS(GIActAction.id)
            }
            else
                GIScreenshot.src = fatSSPath + GIState.substr(1, GIState.length - 1) + "g.png";
            GIHilite(null);
        }
        if (upk.browserInfo.isExplorer()) StartKeyHook();
    }

    if (GIFrames[GIState].type == "decision") {
        if (ecidStartDecisions[GIState]) {
            if (ecidStartDecisions[GIState].display) {
                ecidDecisionStart = true;
            }
        }
        GIChainAltIndex = GIAltIndex = 0;
        GIActAction = GIFrames[GIState].actions[GIAltIndex];
        GIClearAll()
        if (GIHistory.length > 0)
            GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GIPrevStep(); return false"><img src="../../../img/empty.gif"style="' + DIMG_prevstep + '" border="0" title="' + R_menu_prevstep + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"/><img src="../../../img/giftrk1.gif" style="border:0;width:22;height:22"/>'
        GILoadInfoBlocks(GIInfoFrame);
        text += GIGetDecisionText(GIState)
        GITextFrame.innerHTML = text;
        if (ScreenshotVisible) {
            GIScreenshot.src = fatSSPath + GIState.substr(1, GIState.length - 1) + "g.png";
            GIHilite(null);
        }
    }

    if (GIFrames[GIState].type == "normal") {
        //		GIAdvText.innerHTML = '<a href="#" onclick="top.GIPlayer.GINextStep(); return false">' + R_menu_nextstep + '</a>'
        if (!GIAltIndex) { GIChainAltIndex = GIAltIndex = 0; }
        GIClearAll();
        if (GIHistory.length > 0)
            GIAdvText.innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GIPrevStep(); return false"><img src="../../../img/empty.gif"style="' + DIMG_prevstep + '" border="0" title="' + R_menu_prevstep + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'

        if (testIt) {
            GIAdvText.innerHTML += '<IMG SRC="' + P_GIRESOURCES + 'spacer.gif" border="0" style="background-color:black; width:1px; height:20px"/><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"><span style="cursor:pointer" onclick="top.GIPlayer.GIPassStep(); return false"><img id="testpass" src="../../../img/empty.gif"  style="' + (GIFrames[GIState].actions[GIAltIndex].teststatus == "passed" ? DIMG_steppassed : DIMG_steppassed1) + '" border="0" title="' +
                (GIFrames[GIState].actions[GIAltIndex].teststatus == "passed" ? R_testit_passedmarked : R_testit_markpassed) + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GIFailStep(); return false"><img id="testfail" src="../../../img/empty.gif" style="' +
				(GIFrames[GIState].actions[GIAltIndex].teststatus == "failed" ? DIMG_stepfailed : DIMG_stepfailed1) + '" border="0" title="' +
                (GIFrames[GIState].actions[GIAltIndex].teststatus == "failed" ? R_testit_failedmarked : R_testit_markfailed) + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GISkipStep(); return false"><img id="testskip" src="../../../img/empty.gif" style="' + (GIFrames[GIState].actions[GIAltIndex].teststatus == "skipped" ? DIMG_stepskipped : DIMG_stepskipped1) + '" border="0" title="' +
                (GIFrames[GIState].actions[GIAltIndex].teststatus == "skipped" ? R_testit_skippedmarked : R_testit_markskipped) + '"/></span>'
            GIAdvText.innerHTML += '<img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"><IMG SRC="' + P_GIRESOURCES + 'spacer.gif" border="0" style="background-color:black; width:1px; height:20px"/><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.openTestNotes(); return false"><img src="../../../img/empty.gif" style="' + DIMG_addnotes + '" border="0" title="' + R_testit_opennotes + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.openSTR(); return false"><img src="../../../img/empty.gif" style="' + DIMG_steps2recreate + '" border="0" title="' + R_testit_openstr + '"/></span><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<IMG SRC="' + P_GIRESOURCES + 'spacer.gif" border="0" style="background-color:black; width:1px; height:20px"/><img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px">'
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GIGoToReport(); return false"><img src="../../../img/empty.gif" style="' + DIMG_gotoreport + '" border="0" title="' + R_testit_gotoreport + '"/></span>'
            switch (GIFrames[GIState].actions[GIAltIndex].teststatus) {
                case "passed":
                    GITestStatus.innerHTML = R_testit_passed.toUpperCase();
                    break;
                case "failed":
                    GITestStatus.innerHTML = R_testit_failed.toUpperCase();
                    break;
                case "skipped":
                    GITestStatus.innerHTML = R_testit_skipped.toUpperCase();
                    break;
            }
        }
        else {
            GIAdvText.innerHTML += '<span style="cursor:pointer" onclick="top.GIPlayer.GINextStep(); return false"><img src="../../../img/empty.gif" style="' + DIMG_nextstep + '" border="0" title="' + nextsteptext + '"/></span>'
        }
        if (GIFrames[GIState].actions.length > 1) {
            for (var aa = 1; aa < GIFrames[GIState].actions.length; aa++) {
                var bt = GetTextWT(GIFrames[GIState].actions[aa].text)
                if (bt != "")
                    GIShowAltsPic()
            }
        }
        //		alert(GIState)
        GIActAction = GIFrames[GIState].actions[GIAltIndex]

        GILoadInfoBlocks(GIInfoFrame);

        text += GIgetActionText(GIActAction)
        GITextFrame.innerHTML = text;

        if (ScreenshotVisible) {
            var GA = GIActAction;
            SSAList[GA.id].a = GIActAction;
            SSAList[GA.id].sspath = GIFrames[GIState].sspath;
            //		GGGGShowActions = new Array();
            //		GGGGShowActions.push( {f: GIState, a: GIActAction} );
            while (GA.dn && GIFrames[GA.next].type != "decision") {
                SSAList[GIFrames[GA.next].actions[0].id].a = GIFrames[GA.next].actions[0];
                SSAList[GIFrames[GA.next].actions[0].id].sspath = GIFrames[GA.next].sspath;
                GA = GIFrames[GA.next].actions[0];
            }
            GILoadSS(GIActAction.id)
        }

        //		GGGSA(oPopup.document.getElementById("camera"), 0);

        if (upk.browserInfo.isExplorer()) StartKeyHook();
    }

    GIRefreshActionMenu()

    bubbc = GIActAction.bcolor;
    GIbgcolor = bubbc.toString(16);
    while (GIbgcolor.length < 6) GIbgcolor = "0" + GIbgcolor;
    GIbgcolor = "#" + GIbgcolor;
    //	if (GIbgcolor) oPopBody.style.backgroundColor = ("#" + GIbgcolor.toString(16));
    if (DoItConfig.DoItBackgroundColor != '') { oPopBody.style.backgroundColor = DoItConfig.DoItBackgroundColor; }
    else if (GIbgcolor) { oPopBody.style.backgroundColor = GIbgcolor; }
    else { oPopBody.style.backgroundColor = "#FEFECE"; }

    //	var loc = window.location.href
    //	loc = loc.substring(0,loc.lastIndexOf("/")+1);

    //if (GITMEnabled) {
    //			getID("GIST").innerHTML='<a href="#" onclick='
    //				+'"top.window.open(\'../../../toc/noscroll.html?'+escape(loc + 'Topic.htm#Mode=T&Frame='+GIState)+'\', \'tplayer\', \'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0, fullscreen\'); return false"><IMG SRC="' + P_GIRESOURCES + 'playtpc.gif" border="0" title=""></a> '

    /* getID("GIST") @ */
    //			oPopup.document.getElementById("GIST").innerHTML='<a href="#" onclick="top.GIPlayer.openTM()"'
    //				+'><IMG SRC="' + P_GIRESOURCES + 'playtpc.gif" border="0" title="' + R_tooltip_viewtryit + '"></a> '

    //			oPopBody = oPopup.document.body;
    //			oPopBody.innerHTML = getID("oContextHTML0").innerHTML;
    //			oPopBody.ondragstart = EventCancel ;
    //}

    AudioAction = GIActAction;
    if (GIState != "teststart" && GIState != "testend" && SoundAvail && PlaySound && UserPrefs.PlayAudio == "all") {
        PlayAudio()
    }
    //	alert(GIInfoFrame.innerHTML)
    //	alert(text)
    //	window.blur()
    if (upk.browserInfo.isExplorer() && popupVersion) GITextFrame.style.width = popWidth - 29;
    if (!popupVersion) {
        GIInfoFrame.style.right = GIAdvText.clientWidth + 10 + "px";
        GIInfoFrame.style.left = "0px";
    }
    if (upk.browserInfo.isExplorer()) GITextFrame.style.overflow = "auto";
    $(".giTitle").css(DoItConfig.DoItTopicTitleFont);
    GIOnResize();
    setTimeout(GIOnResize, 500);
}

function GIGoToReport() {
    gotoReport = true;
    GINextStep('testend');
}

function GITMClosed() {
    //	alert("csukva")
    ShowPopup();
    //	InitPopUp();
    //	GIStep(GIState);
    //	RePop()
}

function IsPrimaryDisplay() {
    primarydisplay = true;
    var testwindow = window.open("", "", "width=10,height=10");
    if (testwindow.screenLeft < 0 || testwindow.screenLeft > this.screen.width)
        primarydisplay = false;
    if (testwindow.screenTop < 0 || testwindow.screenTop > this.screen.height)
        primarydisplay = false;
    testwindow.close();
    return primarydisplay;
}

function openSTR() {
    if (isTestItOnTouchDevice()) {
        openEmbeddedDialog('../../../html/testitstr.html');
    }
    else {
        HidePopup();
        strWindow = top.window.open('../../../html/testitstr.html?', 'teststr', "scrollbars=yes,left=150,top=150,width=500,height=300,resizable=yes");
    }
}

function closeSTR() {
    if (strWindow != null)
        strWindow.close();
    ShowPopup();
}

function OnClosingChildWindow() {
    ShowPopup();
}

function fillSTRBox(o) {
    var strstepnum = 1;
    var tt = "";
    var a = null;

    tt += jQuery.trim($("#TopicName").text()) + "\n";
    tt += "\n" + jQuery.trim(R_testit_str) + ":\n"
    for (var i = 0; i < GIHistory.length; i++) {
        if (GIHistory[i].type != "decision" && GIHistory[i].type != "start" && GIHistory[i].type != "end" && GIHistory[i].type != "teststart" && GIHistory[i].type != "testend") {
            a = GIFrames[GIHistory[i].frame].actions[GIHistory[i].altindex];
            if (a.teststatus != "skipped") {
                tt += strstepnum + ". " + jQuery.trim($(a.text.replace(/(<br>|<\/p>)/gi, ' ')).text().replace(/[\s\xA0]+/g, ' ')) + "\n";
                strstepnum++;
            }
            while (a.dn && GIFrames[a.next].type != "decision" && GIFrames[a.next].type != "end") {
                a = GIFrames[a.next].actions[0];
                if (a.teststatus != "skipped") {
                    tt += strstepnum + ". " + jQuery.trim($(a.text.replace(/(<br>|<\/p>)/gi, ' ')).text().replace(/[\s\xA0]+/g, ' ')) + "\n";
                    strstepnum++;
                }
            }
        }
    }
    a = GIFrames[GIState].actions[GIAltIndex];
    tt += strstepnum + ". " + jQuery.trim($(a.text.replace(/(<br>|<\/p>)/gi, ' ')).text().replace(/[\s\xA0]+/g, ' ')) + "\n";
    strstepnum++;
    while (a.dn && GIFrames[a.next].type != "decision" && GIFrames[a.next].type != "end") {
        a = GIFrames[a.next].actions[0];
        tt += strstepnum + ". " + jQuery.trim($(a.text.replace(/(<br>|<\/p>)/gi, ' ')).text().replace(/[\s\xA0]+/g, ' ')) + "\n";
        strstepnum++;
    }
    o.fillText(tt);
}

function openTestNotes() {
    if (testNotesWindow == null || testNotesWindow.closed) {
        if (isTestItOnTouchDevice()) {
            openEmbeddedDialog('../../../html/testitnotes.html');
        }
        else {
            HidePopup();
            testNotesWindow = top.window.open('../../../html/testitnotes.html?', 'testnotes', "scrollbars=yes,left=150,top=150,width=500,height=300,resizable=yes");
        }
    }
    else {
        testNotesWindow.focus();
    }
}

function fillTestNotesBox(o) {
    o.fillText(GIFrames[GIState].actions[GIAltIndex].testnotes);
}

function saveTestNotes(text) {
    GIFrames[GIState].actions[GIAltIndex].testnotes = text;
}

function closeTestNotes() {
    if (testNotesWindow != null)
        testNotesWindow.close();
    ShowPopup();
}

function isTestItOnTouchDevice() {
    return IsTouchDevice() || upk.browserInfo.isIE10Modern();
}

function openEmbeddedDialog(url) {
    $("<iframe/>", { src: url }).appendTo($("#embedded_dialog"));
    $("#embedded_dialog").show();
    $("#noPopupFF").hide();
}
function removeEmbeddedDialog() {
    $("#embedded_dialog iframe").remove();
    $("#embedded_dialog").hide();
    $("#noPopupFF").show();
}

function openTM() {
    if (SoundPlayerObj && SoundAvail && PlaySound) SoundPlayerObj.Stop();
    HidePopup()
    var loc = window.location.href
    loc = loc.substring(0, loc.lastIndexOf("/") + 1);


    var p = 'mode=T&frame=' + GIState;
    if (safeUriMode) {
        var s = Escape.SafeUriEscape(p);
        p = "su=" + s;
    }

    var baseFeatures = "toolbar=0,location=0,statusbar=0,menubar=0";
    top.window.open('topic.html?' + p, 'tplayer', baseFeatures + ",scrollbars=1,resizable=0,fullscreen=1,left=0,top=0,width=" + screen.width + ",height=" + screen.height);
    //	alert(tplayer)
}

function openDM() {
    if (SoundPlayerObj && SoundAvail && PlaySound) SoundPlayerObj.Stop();
    HidePopup()
    var loc = window.location.href
    loc = loc.substring(0, loc.lastIndexOf("/") + 1);

    var p = 'mode=S&frame=' + GIState;
    if (safeUriMode) {
        var s = Escape.SafeUriEscape(p);
        p = "su=" + s;
    }

    var baseFeatures = "toolbar=0,location=0,statusbar=0,menubar=0";
    top.window.open('topic.html?' + p, 'dplayer', baseFeatures + ",scrollbars=1,resizable=0,fullscreen=1,left=0,top=0,width=" + screen.width + ",height=" + screen.height);
    //	alert(tplayer)
}

function LogOut() {
    lms_KPathLogout();
}

function PlayAudio() {
    //	SoundPlayerObj.Stop();
    if (SoundPlayerObj) {
        SoundPlayerObj.Play(AudioAction.id.substring(1) + ".ASX");
    }
    //	SoundPlayerObj.Play("../../../TEMPLATE/Default/standard/g_then.wav");
}

function PlayStop(noTimeout) {
    if (SoundPlayerObj) {
        SoundPlayerObj.Stop(noTimeout);
    }
}

function OnEndPlaySound() {
    if (SoundPlayerObj) SoundPlayerObj.Stop();
    //	alert("joo")
    if (AudioAction.dn && GIFrames[AudioAction.next].type != "decision") {
        AudioAction = GIFrames[AudioAction.next].actions[0]
        setTimeout(PlayAudio, 300);
    }
}

function OnErrorPlaySound(code, descr) {
    if (SoundPlayerObj) SoundPlayerObj.Stop();
    //	alert(descr)
    if (AudioAction.dn && GIFrames[AudioAction.next].type != "decision") {
        AudioAction = GIFrames[AudioAction.next].actions[0]
        setTimeout(PlayAudio, 300);
    }
}

function GIGetDecisionText(newState) {
    //	var tt = "<span style='font: Arial 9pt'>Choose one of the options below:<BR><BR>";
    var tt = "<span style='font: 9pt Arial'>" + GIFrames[GIState].header + "<BR><BR>";
    if (!popupVersion) {
        tt += "<ul style='padding: 0 0 0 18px; margin: 0;'>";
    }
    for (var i = 0; i < GIFrames[newState].actions.length; i++) {
        var a = GIFrames[newState].actions[i]
        var ignorepath = false;
        if (ecidStartDecisions[newState]) {
            if (ecidStartDecisions[newState].display) {
                for (var ii = 0; ii < ecidStartDecisions[newState].pathstoignore.length; ii++) {
                    if (ecidStartDecisions[newState].pathstoignore[ii] == a.id) {
                        ignorepath = true;
                    }
                }
            }
        }
        if (!ignorepath) {
            var at = a.text.replace(/&amp;/g, '&');
            //		var at = escape(GetTextWT(a.text))
            //		tt += '<a href="#" onclick="top.GIPlayer.GINextStep(\'' + a.next + '\',\'' + at + '\'); return false">';
            tt += popupVersion ? "<li style='padding: 0 0 0 18px; margin: 0;list-style-position:outside'>" : "<li>";
            tt += "<a href='#' onclick='top.GIPlayer.GINextStep(\"" + a.next + "\"); return false'>";
            tt += at;
            tt += '</a><BR></li>'
        }
    }
    if (!popupVersion) {
        tt += "</ul>";
    }
    tt += '</span>';
    //	alert(tt);
    return tt
}

function Replace(str, s, r) {
    var k = str.indexOf(s);
    if (k < 0)
        return str;
    var s1 = str.substr(0, k);
    var s2 = str.substr(k + 6);
    return (s1 + r + s2);
};

function GIShowFrameID(id) {
    oPopup.document.getElementById("frameidvalue" + idPostFix).innerHTML = id;
}

function GIgetActionText(action) {
    var tt = '';
    SSAList = new Array();
    SSAList[action.id] = { fid: null, a: null, imgid: null }
    if (action.icon) {
        tt += '<img style="float:left;margin-right:5px;margin-bottom:5px" align="left" border="0" src="' + P_GIRESOURCES + action.icon + '"/> '
    }
    if (action.text == null) tt += '';
    else {
        //		tt += "<div>";
        if (action.input) {
            action.text = BuildInputText(action.input, action.text);
        }
        if (action.dn && GIFrames[action.next].type != "decision") {
            if (ScreenshotVisible) {
                tt += "<img id='lss" + action.id + "' title='" + R_interface_filmstrip + "' style='cursor:pointer' align='right' src='../../../img/stepdispl1.gif' onclick='parent.GIShowFrameInChain(\"" + GIState + "\",\"" + action.id + "\",\"" + GIAltIndex + "\");'/>";
                var id1 = 'lss' + action.id
                SSAList[action.id].imgid = id1;
            }
        }
        tt += "<span>" + action.text + "</span>";
        if (testIt && GIFrames[GIState].type != "start" && GIFrames[GIState].type != "end" && jQuery.trim($("#ExpectedTestResults_" + GIState).html()) != "") {
            tt += "<span style='font-family:Arial; font-size:10pt;'><br><span style='font-weight:bold'>" + R_testit_expectedresults + ":</span><br>";
            tt += $("#ExpectedTestResults_" + GIState).html().replace(/__my_new_line__/g, '<br>');
            tt += "<br></span>";
        }
    }
    var a = action
    while (a.dn && GIFrames[a.next].type != "decision") {
        var fid = a.next;
        a = GIFrames[a.next].actions[0]
        if (a.input) {
            a.text = BuildInputText(a.input, a.text);
        }
        tt += '<br/><div style="clear:both"></div><B style="font-family:Arial;font-size:9pt"/>' + R_bubletext_then + '</B><BR>'

        if (a.icon) {
            tt += '<img  style="float:left;margin-right:5px;margin-bottom:5px" align="left" border="0" src="' + P_GIRESOURCES + a.icon + '"/> '
        }
        if (ScreenshotVisible) {
            tt += "<img id='lss" + a.id + "' title='" + R_interface_filmstrip + "' style='margin-top:-12px;cursor:pointer' align='right' src='../../../img/stepdispl0.gif' onclick='parent.GIShowFrameInChain(\"" + fid + "\",\"" + a.id + "\"); '/>";
            var id1 = 'lss' + a.id
            SSAList[a.id] = { fid: null, a: null, imgid: id1 }
        }
        tt += "<span>" + a.text + "</span>"
        if (testIt && GIFrames[fid].type != "start" && GIFrames[fid].type != "end" && jQuery.trim($("#ExpectedTestResults_" + fid).html()) != "") {
            tt += "<span style='font-family:Arial; font-size:10pt;'><br><span style='font-weight:bold'>" + R_testit_expectedresults + ":</span><br>";
            tt += $("#ExpectedTestResults_" + fid).html().replace(/__my_new_line__/g, '<br>');
            tt += "<br></span>";
        }

        //		tt += "<div>" + a.text + "</div>";
    }
    //		alert(tt)
    GINextState = a.next;

    return tt;
}

function GIGetTestResults() {
    testItPassed = true;
    var passed = 0, failed = 0, skipped = 0;
    for (var i = 0; i < GIHistory.length; i++) {
        if (GIHistory[i].type != "decision" && GIHistory[i].type != "start" && GIHistory[i].type != "end" && GIHistory[i].type != "teststart" && GIHistory[i].type != "testend") {
            var act = GIFrames[GIHistory[i].frame].actions[GIHistory[i].altindex];
            switch (act.teststatus) {
                case "passed":
                    passed++;
                    break;
                case "failed":
                    failed++;
                    break;
                case "skipped":
                    skipped++;
            }
        }
    }
    if (failed || gotoReport) { testItPassed = false; }
    $("#TestResults").html("");
    var tt = "";
    tt += "<span style='font-weight:bold'>" + R_testit_summary + ":</span><br>";
    tt += '<div style="margin-bottom:3px; margin-top:3px"><img src="../../../img/empty.gif" style="' + DIMG_sum_passed + ' float:left; margin-left:20px" border="0" /><div style="float:left; margin-left:5px;"> ' + R_testit_passed + ': <span style="font-weight:bold;">' + passed + '</span></div><div style="clear:both"></div></div>';
    tt += '<div style="margin-bottom:3px; margin-top:3px"><img src="../../../img/empty.gif" style="' + DIMG_sum_failed + ' float:left; margin-left:20px" border="0" /><div style="float:left; margin-left:5px;"> ' + R_testit_failed + ': <span style="font-weight:bold;">' + failed + '</span></div><div style="clear:both"></div></div>';
    tt += '<div style="margin-bottom:3px; margin-top:3px"><img src="../../../img/empty.gif" style="' + DIMG_sum_skipped + ' float:left; margin-left:20px" border="0" /><div style="float:left; margin-left:5px;"> ' + R_testit_skipped + ': <span style="font-weight:bold;">' + skipped + '</span></div><div style="clear:both"></div></div>';
    tt += '<span>' + R_testit_stepnum + ': <span style="font-weight:bold">' + (passed + failed + skipped) + '</span></span><br>';
    tt += '<span>' + R_testit_result + ': <span style="font-weight:bold">' + (testItPassed ? R_testit_passed.toUpperCase() : R_testit_failed.toUpperCase()) + '</span></span><br><br>';
    tt += '<a href="#" onclick="top.GIPlayer.GITestItReport()">' + R_testit_viewreport + '</a>';

    $("#TestResults").append(tt);

    function ConvertDateToXMLDateTime(date) {
        function pad(n) {
            var s = n.toString();
            return s.length < 2 ? '0' + s : s;
        };
        //"YYYY-MM-DDThh:mm:ss"
        var strXMLDateTime = date.getFullYear() + "-" +
                     pad(date.getMonth() + 1) + "-" +
                     pad(date.getDate()) + "T" +
                     pad(date.getHours()) + ":" +
                     pad(date.getMinutes()) + ":" +
                     pad(date.getSeconds());

        return strXMLDateTime;
    }

    var endTime = new Date().getTime();
    timeSpent = endTime - startTime;
    var timeSpentS = Math.floor(timeSpent / 1000);
    var bookmarks = '<bookmarks>';
    var TestStatusN = { 'passed': 1, 'failed': 2, 'skipped': 3 }

    for (var i in GIFrames) {
        var fr = GIFrames[i];
        for (var ii = 0; ii < fr.actions.length; ii++) {
            var act = fr.actions[ii];
            var notes = '';
            bookmarks += '<bookmark name="TestResultFrameID' + i + '_' + act.id + '">' +
						'<value>' + (TestStatusN[act.teststatus] || 0) + '</value></bookmark>'
            if (act.testnotes) {
                bookmarks += '<bookmark name="TestNotesFrameID' + i + '_' + act.id + '">' +
							'<value><![CDATA[' + act.testnotes + ']]></value></bookmark>'
            }
        }
    }
    bookmarks += '</bookmarks>'

    var testStatus = testItPassed ? 1 : 2;
    var testResultsXML = '<result>' +
			'<testdate>' + ConvertDateToXMLDateTime(new Date()) + '</testdate>' +
			'<result>' + testStatus + '</result>' +
			'<estimatedtime>' + testItEstimate + '</estimatedtime>' +
			'<actualtime>' + timeSpentS + '</actualtime>' +
			'<passedsteps>' + passed + '</passedsteps>' +
			'<failedsteps>' + failed + '</failedsteps>' +
			'<skippedsteps>' + skipped + '</skippedsteps>' +
			'<totalsteps>' + (passed + failed + skipped) + '</totalsteps>' +
			'<testdocrevision>' + testItDocRevision + '</testdocrevision>' +
			bookmarks + '</result>';
    lms_sendTestItResult(testStatus, testResultsXML);

    //    var tt = "<p style='font-weight:bold'>Result Summary:</p>";
    //    tt+=
}

function GIShowFrameInChain(fid, aid, aindex) {
    aindex = aindex || 0;
    GIChainState = fid;
    GIChainAltIndex = aindex;
    parent.GILoadSS(aid);
    parent.GIShowFrameID(fid.substr(1));
    //    if (testIt) {
    //        $("#GIPassButton").css("font-weight", "normal");
    //        $("#GIFailButton").css("font-weight", "normal");
    //        if (GIFrames[fid].actions[aindex].teststatus == "passed") {
    //            $("#GIPassButton").css("font-weight", "bold");
    //        }
    //        if (GIFrames[fid].actions[aindex].teststatus == "failed") {
    //            $("#GIFailButton").css("font-weight", "bold");
    //        }
    //    }
}

function DisplayInputTextPart(templatetext, part, disp) {
    var p1 = '<DIV id=' + part + ' style="DISPLAY: inline">';
    var k1 = templatetext.indexOf(p1);
    if (k1 < 0) {
        p1 = '<div id="' + part + '" style="display: inline;">';
        k1 = templatetext.indexOf(p1);
        if (k1 < 0) {
            p1 = '<div id="' + part + '" style="display:inline">';
            k1 = templatetext.indexOf(p1);
            if (k1 < 0) {
                p1 = '<DIV style="DISPLAY: inline" id=' + part + '>';
                k1 = templatetext.indexOf(p1);
                if (k1 < 0)
                    return templatetext;
            }
        }
    }
    var t1 = templatetext.substr(k1 + p1.length);
    var k2 = t1.indexOf('</DIV>');
    if (k2 < 0)
        k2 = t1.indexOf('</div>');
    if (disp == true)
        return templatetext.substr(0, k1) + t1.substr(0, k2) + t1.substr(k2 + 6);
    return templatetext.substr(0, k1) + t1.substr(k2 + 6);
}

function BuildInputText(aobj, templatetext) {
    var display_anything = false;
    var display_example = false;
    var display_inputtext = false;
    var display_inputalt = false;
    var display_blank = false;

    // something	

    if (aobj[0] == "S") {
        display_anything = true;
        if (template_strinp_suppress_example == "<span>0</span>") {
            display_example = true;
            display_inputtext = true;
        }
    }

    // anything

    else if (aobj[0] == "A") {
        display_anything = true;
        display_blank = true;
        if (template_strinp_suppress_example == "<span>0</span>") {
            display_example = true;
            display_inputtext = true;
        }
    }

    // nothing

    else if (aobj[0] == "N") {
        display_inputtext = true;
        display_inputalt = true;
        display_blank = true;
    }

    // 1 vagy tobb konkret alternativa

    else {
        display_inputtext = true;
        display_inputalt = true;
    }

    // beiras a templatetextbe

    var s = templatetext;
    s = DisplayInputTextPart(s, "anything", display_anything);
    s = DisplayInputTextPart(s, "example", display_example);
    s = DisplayInputTextPart(s, "inputtext", display_inputtext);
    s = DisplayInputTextPart(s, "inputalt", display_inputalt);
    s = DisplayInputTextPart(s, "blank", display_blank);

    // begin 22282 hack
    s = s.replace(new RegExp("<SPAN></SPAN>", "g"), "<SPAN> </SPAN>");
    s = s.replace(new RegExp("\r", "g"), "");
    s = s.replace(new RegExp("\n", "g"), "");
    // end 22282 hack

    return s;
};


function GIClearAll() {
    GITextFrame.innerHTML = "";
    GIInfoFrame.innerHTML = "";
    GIInfoFrame.innerHTML += '<span id="GIST"></span>'
    GIInfoFrame.innerHTML += '<span id="GIAlts' + idPostFix + '"></span>';
    GITestStatus.innerHTML = "";
}

function GIRestart() {
    var firstFrame = GIHistory[0].frame;
    GIHistory = null;
    GIHistory = new Array();
    GINextStep(firstFrame, true);
}

function GIPrevStep() {
    var GIHistItem = GIHistory[GIHistory.length - 1];
    GIRHist(GIHistory.length - 1);
    GINextStep(GIHistItem.frame, true, GIHistItem.altindex);
}

function GINextStep(newStep, prev, altindex) {
    try {
        if (testNotesWindow) {
            if (testNotesWindow.saveNotes) {
                testNotesWindow.saveNotes();
                testNotesWindow = null;
            }
        }
    }
    catch (err) {
    }
    if (strWindow) {
        strWindow.close();
    }
    if (newStep) {
        var ns = newStep;
        if (GIFrames[ns].type == "decision" && GIFrames[ns].actions.length == 1) { GINextStep(GIFrames[ns].actions[0].next); return false; }
        if (!prev) GIHistory.push({ frame: GIState, type: GIFrames[GIState].type, altindex: GIAltIndex })
        if (ecidDecisionStart) {
            FindEcidStartNextFrame(ns);
            ns = GIState;
            altindex = null;
        }
        if (GIFrames[ns].type == "end") {
            lms_frameView(getMyGuid(), "D", "end");
        }
        else {
            lms_frameView(getMyGuid(), "D", ns);
        }
        if (altindex) { GIChainAltIndex = GIAltIndex = altindex }
        else GIAltIndex = null

        GIClearAll()
        GIStep(ns)
    }
    else {
        if (GIFrames[GINextState].type == "end") {
            lms_frameView(getMyGuid(), "D", "end");
        }
        else {
            lms_frameView(getMyGuid(), "D", GINextState);
        }
        if (GIFrames[GINextState].type == "decision" && GIFrames[GINextState].actions.length == 1) { GINextStep(GIFrames[GINextState].actions[0].next); return false; }
        //		alert(GIState+"   " + GIActAction.text)
        if (!prev) GIHistory.push({ frame: GIState, type: GIFrames[GIState].type, altindex: GIAltIndex })
        if (altindex) { GIChainAltIndex = GIAltIndex = altindex }
        else GIAltIndex = null

        GIClearAll()
        GIStep(GINextState)
    }
}

function GetTextWT(text) {
    var pos, pos2;
    while (text.indexOf("<") != -1) {
        pos = text.indexOf("<")
        var bef = text.substring(0, pos)
        pos2 = text.indexOf(">", pos)
        var intext = text.substring(pos + 1, pos2)
        //		alert(intext)
        if (intext == "/P" || intext == "/p" || intext.substr(0, 1) == "p" || intext.substr(0, 1) == "P" || intext == "BR" || intext == "br") {
            bef += "&nbsp";
        }
        var aft = text.substring(pos2 + 1)
        text = bef + aft;
    }
    return text;
}

function GILoadInfoBlocks(frame) {
    var iState = GIState
    var iAction = GIFrames[iState].actions[GIAltIndex]
    var donext = true
    var donext2 = true
    //	GIClearAll()

    while (donext) {
        if (GIFrames[iState].infoblocks.length > 0) {
            donext = false
            var htmltext = '';
            //		frame .innerHTML += '<IMG border="0" style="background-color:black; width:1; height:20">&nbsp &nbsp'

            if (GIFrames[GIState].actions.length > 1 && GIFrames[GIState].type != "decision") htmltext = '<img SRC="' + P_GIRESOURCES + 'spacer.gif" style="border:0;width:3px;height:1px"><IMG SRC="' + P_GIRESOURCES + 'spacer.gif" border="0" style="background-color:black; width:1px; height:20px"/>'
            var span = oPopup.document.createElement("span");
            frame.appendChild(span);
            span.innerHTML = htmltext;
            //			frame.insertAdjacentHTML("beforeEnd", htmltext);
            while (donext2) {
                for (var i = 0; i < GIFrames[iState].infoblocks.length; i++) {
                    var inf = GIFrames[iState].infoblocks[i]

                    htmltext = "<img SRC='" + P_GIRESOURCES + "spacer.gif' style='border:0;width:3px;height:1px'><span style='cursor:pointer' onclick=\"" + inf.url + "\""
						+ '/>'
						+ '<IMG SRC="' + P_GIRESOURCES + inf.buttonfile + '" border="0" title="' + inf.tooltip + '"/></span>'
                    var span2 = oPopup.document.createElement("span");
                    frame.appendChild(span2);
                    span2.innerHTML = htmltext;
                    //					frame.insertAdjacentHTML("beforeEnd", htmltext);
                }
                if (iAction.dn && GIFrames[iAction.next].type != "decision") {
                    iState = iAction.next
                    iAction = GIFrames[iState].actions[0]
                }
                else donext2 = false
            }
        }
        else {
            if (iAction.dn && GIFrames[iAction.next].type != "decision") {
                iState = iAction.next
                iAction = GIFrames[iState].actions[0]
            }
            else donext = false
        }
    }
}

function GINextAlt() {
    try {
        if (testNotesWindow) {
            if (testNotesWindow.saveNotes) {
                testNotesWindow.saveNotes();
                testNotesWindow = null;
            }
        }
    }
    catch (err) {
    }
    if (strWindow) {
        strWindow.close();
    }
    GIAltIndex += 1;
    GIChainAltIndex = GIAltIndex;
    if (GIAltIndex >= GIFrames[GIState].actions.length)
        GIChainAltIndex = GIAltIndex = 0;

    var bt = GetTextWT(GIFrames[GIState].actions[GIAltIndex].text)
    if (bt == "") {
        GINextAlt()
        return false;
    }

    RefreshStep();
}

function GIShowAltsPic() {
    /* getID("GIAlts") @ */
    oPopup.document.getElementById("GIAlts" + idPostFix).innerHTML = '<span style="cursor:pointer" onclick="top.GIPlayer.GINextAlt(); return false"><IMG SRC="' + P_GIRESOURCES + 'alternatives.gif" border="0" title="' + R_menu_alternatives + '"/></span>'
}

function GIPassStep() {
    GIFrames[GIState].actions[GIAltIndex].teststatus = "passed";
    a = GIFrames[GIState].actions[GIAltIndex];
    while (a.dn && GIFrames[a.next].type != "decision" && GIFrames[a.next].type != "end") {
        a = GIFrames[a.next].actions[0];
        a.teststatus = "passed";
    }
    GINextStep();
}

function GIFailStep() {
    GIFrames[GIState].actions[GIAltIndex].teststatus = "failed";
    a = GIFrames[GIState].actions[GIAltIndex];
    while (a.dn && GIFrames[a.next].type != "decision" && GIFrames[a.next].type != "end") {
        a = GIFrames[a.next].actions[0];
        a.teststatus = "failed";
    }
    GINextStep();
}

function GISkipStep() {
    if (GIFrames[GIState].actions[GIAltIndex].teststatus != "passed" && GIFrames[GIState].actions[GIAltIndex].teststatus != "failed") {
        GIFrames[GIState].actions[GIAltIndex].teststatus = "skipped";
        a = GIFrames[GIState].actions[GIAltIndex];
        while (a.dn && GIFrames[a.next].type != "decision" && GIFrames[a.next].type != "end") {
            a = GIFrames[a.next].actions[0];
            a.teststatus = "skipped";
        }
    }
    GINextStep();
}

function GetBasePathTestIt() {
    base = this.location.href;
    k = base.indexOf('?');
    if (k < 0)
        k = base.indexOf('#');
    if (k >= 0)
        base = base.substr(0, k);
    k = base.lastIndexOf('/');
    b = base.substr(0, k);
    return b;
}

var testScriptLoaded = false;
var testItLoadI;
function GITestItReport() {
    if (testReportWindow) {
        testReportWindow.close();
    }
    var reportname = "../../testitsummary/" + UnescapeQuotes(testItReportName);
    if (isTestItOnTouchDevice()) {
        var url = GetBasePathTestIt() + "/" + reportname;
        var dpi = 96;
        var w = PxToPt($("#noPopupFF").width() - 20, dpi);
        var h = PxToPt($("#noPopupFF").height() - 20, dpi);
        showDialog(url, 0, 0, w, h, true, 96, "../../../", false);
    }
    else {
        testReportWindow = top.window.open(reportname, 'testreport', "toolbar=1,location=1,statusbar=1,menubar=1,scrollbars=1,resizable=1");
    }
    testScriptLoaded = false;
    //    GILoadTestItScripts();
    testItLoadI = setInterval(function () { GITestScript(); }, 1500);
}

function GITestScript() {
    if (!testScriptLoaded) {
        try {
            if (isTestItOnTouchDevice()) {
                var $childhead = $("#dialogBody").contents().find('head');
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = GetBasePathTestIt() + "/../../../js/jquery.min.js";
                $childhead[0].appendChild(s);
                s = document.createElement("script");
                s.type = "text/javascript";
                s.src = GetBasePathTestIt() + "/../../../js/testitreportload.js";
                $childhead[0].appendChild(s);
            }
            else {
                var childhead = testReportWindow.document.getElementsByTagName('HEAD').item(0);
                var childscript = testReportWindow.document.createElement("script");
                var childscript2 = testReportWindow.document.createElement("script");
                childscript.type = "text/javascript";
                childscript2.type = "text/javascript";
                childscript.src = "../../js/jquery.min.js";
                childscript2.src = "../../js/testitreportload.js";
                childhead.appendChild(childscript);
                setTimeout(function () { childhead.appendChild(childscript2); }, 1000);
            }
        }
        catch (err) {
        }
    }

}

function GITestItReportLoad() {
    if (testScriptLoaded)
        return;
    testScriptLoaded = true;
    clearInterval(testItLoadI);
    GILoadTestItScripts();
}

function GILoadTestItScripts() {
    if (isTestItOnTouchDevice()) {
        var $childhead = $('#dialogBody').contents().find('HEAD');
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = GetBasePathTestIt() + "/../../../js/resource.js";
        $childhead[0].appendChild(s);
        s = document.createElement("script");
        s.type = "text/javascript";
        s.src = GetBasePathTestIt() + "/../../../js/testitreport.js";
        $childhead[0].appendChild(s);
        $("<link/>", { type: "text/css", href: GetBasePathTestIt() + "/../../../css/playerimages.css", rel: "stylesheet" }).appendTo($childhead);
    }
    else {
        var childhead = testReportWindow.document.getElementsByTagName('HEAD').item(0);
        //    if ($(testReportWindow.document).find("*[name='TestName']").length == 0) {
        //        setTimeout(GILoadTestItScripts, 1000);
        //        return;
        //    }
        var childcss = testReportWindow.document.createElement("link");
        childcss.type = "text/css";
        childcss.href = "../../css/playerimages.css"
        childcss.rel = "stylesheet"
        var childscript2 = testReportWindow.document.createElement("script");
        var childscript3 = testReportWindow.document.createElement("script");
        childscript2.type = "text/javascript";
        childscript3.type = "text/javascript";
        childscript2.src = "../../js/resource.js";
        childscript3.src = "../../js/testitreport.js";
        childhead.appendChild(childcss);
        childhead.appendChild(childscript2);
        childhead.appendChild(childscript3);
    }
    //    testScriptLoaded = false;

}

function GITestItReportReady() {
    var w = isTestItOnTouchDevice() ? document.getElementById('dialogBody').contentWindow : testReportWindow;
    w.setEditable(!Kpath_launch);
    for (var i in GIFrames) {
        var fr = GIFrames[i];
        for (var ii = 0; ii < fr.actions.length; ii++) {
            var act = fr.actions[ii];
            var notes = "";
            if (act.testnotes) {
                notes = act.testnotes.replace(/([^>]?)\n/g, '__my_new_line__');
                var findReplace = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"]]
                for (var item in findReplace) {
                    notes = notes.replace(findReplace[item][0], findReplace[item][1]);
                }
                notes = notes.replace(/__my_new_line__/g, '<br>')
            }
            if (notes == "") { notes = "<br>"; }
            w.fillActionTesterNotes(i, act.id, notes);
            w.fillActionTestResult(i, act.id, act.teststatus);
            w.fillTestResults(testItPassed);
        }
        var endTime = new Date().getTime();
        if (!timeSpent) { timeSpent = endTime - startTime }
        seconds = Math.floor((timeSpent / 1000) % 60);
        seconds = (seconds < 10 ? '0' : '') + seconds
        minutes = Math.floor((timeSpent / (1000 * 60)) % 60);
        minutes = (minutes < 10 ? '0' : '') + minutes
        hours = Math.floor(timeSpent / (1000 * 60 * 60));
        hours = (hours < 10 ? '0' : '') + hours
        w.fillActualTime(hours + ":" + minutes + ":" + seconds);
        var userName = lms_getUserName();
        if (userName) {
            if (userName != "") {
                w.fillTestName(userName);
            }
        }
    }
}

function GIOpenAction(o) {
    if (upk.browserInfo.isExplorer() && popupVersion) {
        for (var ii = 0; ii < oPopup.document.all.length; ii++) {
            oPopup.document.all[ii].detachEvent("onclick", GICloseAction)
        }
    }
    else {
        $("#EventListenerDIV").css({ "cursor": "default", "zIndex": -1 }).unbind("mousedown");
    }
    var pleft = 100;
    var ptop = 100;
    pleft = LeftPos + popWidth - 234;
    ptop = TopPos + 30;
    if (ActMenu) ActMenu.Open(pleft, ptop);
    GIRefreshActionMenu()

    setTimeout(GIAttachEvent, 100)
}

function GIAttachEvent() {
    if (upk.browserInfo.isExplorer() && popupVersion) {
        for (var ii = 0; ii < oPopup.document.all.length; ii++) {
            oPopup.document.all[ii].attachEvent("onclick", GICloseAction);
        }
    }
    else {
        $("#EventListenerDIV").css({ "cursor": "default", "zIndex": 4 }).bind("mousedown", function () { GICloseAction() });
    }
}

function GICloseAction() {
    if (ActMenu) {
        ActMenu.Close();
    }
}

function GIRHist(index) {
    //	alert(index)
    var arr = new Array()
    for (var i = 0; i < index; i++) {
        arr[i] = GIHistory[i]
    }
    GIHistory = new Array()
    for (var i = 0; i < arr.length; i++) {
        GIHistory[i] = arr[i]
    }
}

function GIRefreshActionMenu() {
    if (ActMenu) {
        var his = false;
        if (GIHistory.length > 0)
            his = true;
        var alt = false;
        if (GIFrames[GIState].actions.length > 1 && GIFrames[GIState].type != "decision")
            alt = true;
        var next = false;
        var testnext = false;
        if (GIFrames[GIState].type != "decision" && (GIFrames[GIState].type != "end" || testIt) && GIState != "testend") {
            if (testIt && GIFrames[GIState].type != "start" && GIFrames[GIState].type != "end" && GIState != "teststart") {
                testnext = true;
            }
            else {
                next = true;
            }
        }
        var prefs = UserPrefs.EnablePreferences
        if (!PlayerConfig.EnableCookies) prefs = false;
        var printit = param_printitname.length > 0;
        ActMenu.Refresh(prefs, his, alt, next, testnext, GITMEnabled, GIDMEnabled, true, printit, param_fastdoit)
    }
}

function GIShowPrintit() {
    if (param_printitname.length > 0) {
        lms_LaunchTopic("P");

        if (upk.browserInfo.isIE10() && param_printitname.indexOf(".pdf", param_printitname.length - 4) !== -1) {
            window.open("../../../html/pdfgateway.html?" + "printit/" + param_printitname);
        }
        else {
            window.open("../../printit/" + param_printitname);
        }
    }
}

function GIOpenHelp() {
    onHelp("../../")
}

function GIClosePlayer(viewoutline) {
    if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
        if (!(upk.browserInfo.isExplorer() && popupVersion)) {
            TopPos = window.screenTop != undefined ? window.screenTop : window.screenY;
            LeftPos = window.screenLeft != undefined ? window.screenLeft : window.screenX;
            popWidth = document.getElementById("noPopupFF").clientWidth;
            popHeight = document.getElementById("noPopupFF").clientHeight;
        }
        if (!GINoCookieSave) {
            GICookie["Cleft"] = LeftPos;
            GICookie["Ctop"] = TopPos;
            GICookie["Cwidth"] = popWidth;
            if (ScreenshotVisible || !(upk.browserInfo.isExplorer() && popupVersion)) GICookie["Cheight"] = popHeight;
            else GICookie["Cheight"] = popHeight + SavedSSHeight;
            //			GICookie["s1"]=oPopup.document.getElementById("split1").style.height;
            //			GICookie["s2"]=oPopup.document.getElementById("split2").style.height;
            GICookie["Csss"] = ScreenshotVisible + 1;
            GICookie.Store()
        }
    }
    GICloseAction();
    if (GIPlayer) {
        GIPlayer.close();
    }
    if (testNotesWindow) {
        testNotesWindow.close();
    }
    if (strWindow) {
        strWindow.close();
    }
    KeepAlive_Close();
    if (window.opener) {
        try {
            if (viewoutline || mViewOutline) {
                mViewOutline = true;
                window.opener.DoItFinished(false);
            }
            else window.opener.DoItFinished(param_fastdoit);
        }
        catch (e) { };
    }
}

function OnClosingPreferences() {
    ShowPopup();
    setTimeout('RefreshStep()', 100);
}

function GIOpenPreferences() {
    HidePopup();
    OpenPreferencesDialog(GetBasePathTestIt() + "/../../..", !SoundAvail);
}

var sharedUrl1 = "";
var sharedUrl2 = "";
var sharedUrl3 = "";

function GIShare() {
    var k = window.location.href.indexOf("/data/tpc/");
    var dom = window.location.href.substr(0, k) + "/";
    var topicId = document.getElementById("TopicId").getAttribute("topicid");
    // outline with this topic selected
    var p = "bypasstoc=0&guid=" + topicId;
    sharedUrl1 = dom + "index.html?" + p;
    // at the beginning of this topic
    var p = "mode=" + (testIt ? 'E' : playMode) + "&guid=" + topicId;
    sharedUrl2 = dom + "index.html?" + p;
    // at the current location
    var p = "mode=" + (testIt ? 'E' : playMode) + "&guid=" + topicId;
    if (GIState != "start" && GIActAction.next != null)
        p += "&frame=" + GIState.substr(1);
    sharedUrl3 = dom + "index.html?" + p;

    var url = GetBasePathTestIt() + "/" + "../../../html/sharecontent.html";
    var p = "type=player";
    p += "&src=D";  // DoIt/TestIt player
    var touchDevice = IsTouchDevice() || upk.browserInfo.isIE10Modern();
    p += "&touch=" + (touchDevice ? "1" : "0");
    // parameter list will be SafeUriEscape-d, therefore it starts with "su=", so that UrlParser unescapes it on the receiver side
    url += "?su=" + Escape.SafeUriEscape(p);
    var dpi = 96;
    var w = PxToPt(650, dpi); // width in pt
    var h = PxToPt(260, dpi); // height in pt
    var ctx = "shareIt";
    if (touchDevice) {
        setDlgCtx(ctx);
        showDialog(url, -1, -1, w, h, true, 96, "../../../", false);
    }
    else {
        window.open(url, "sharewin", "width=600,height=" + h + ",resizable=1,scrollbars=0,top=" + (screen.availHeight - 290) / 2 + ",left=" + (screen.availWidth - 600) / 2);
    }
}

function GetSharedUrl(k) {
    switch (k) {
        case 1: return sharedUrl1;
        case 2: return sharedUrl2;
        case 3: return sharedUrl3;
    }
    return "";
}

function GIOnResize() {
    if (!popupVersion) {
        var h = GIAdvText.clientHeight;
        if (GIInfoFrame.clientHeight > GIAdvText.clientHeight) { h = GIInfoFrame.clientHeight; }
        GITextFrame.style.bottom = h + (testIt ? 30 : 16) + "px";
    }
}

function Init() {
    ActMenu = new ActionMenu();
    Init2()
}

var giTitle;
function Init2() {
    //	if(!document.frames("GITextFrame").document.getElementsByTagName('body')[0])
    oPopup.document.getElementById("GITwisty" + idPostFix).title = R_interface_graphic;

    oPopup.document.getElementById("gititle" + idPostFix).innerHTML = "&nbsp " + (testIt ? R_mode_testit : R_mode_doit);
    closebtn = oPopup.document.getElementById("gicloseod" + idPostFix);
    if (closebtn) closebtn.title = R_bubble_closeondemand;
    GITestStatus = oPopup.document.getElementById("PGITestStatus" + idPostFix);
    GIInfoFrame = oPopup.document.getElementById("PGIInfoFrame" + idPostFix);
    GITextFrame = oPopup.document.getElementById("PGITextFrame" + idPostFix);
    GITextFrameJ = $("#PGITextFrame" + idPostFix);
    oPopup.document.getElementById("pgiaction" + idPostFix).innerHTML = '<span title="' + R_interface_action_alt + '" style="CURSOR:pointer;TEXT-DECORATION:underline;FONT-SIZE:9pt;COLOR:' + DoItConfig.DoItActionsLinkColor + ';FONT-WEIGHT:normal;FONT-FAMILY:Arial,Helvetica,sans-serif" onclick="top.GIPlayer.GIOpenAction(this);">' + R_interface_action + '</span>';
    GIAdvText = oPopup.document.getElementById("PGIAdvText" + idPostFix);
    GIScreenshot = oPopup.document.getElementById("PGIScreenshot" + idPostFix);
    GIScreenshot.title = R_interface_graphic_alt;
    GIHighlight = oPopup.document.getElementById("PGIHighlight" + idPostFix);
    GICamera = oPopup.document.getElementById("camera" + idPostFix);
    $("#esttime").text(R_testit_estimate + ": ");
    $("#testsetup").text(R_testit_setup + ": ");
    if (testIt) {
        if (popupVersion) {
            oPopup.document.getElementById("PGITestStatusRow").style.display = "block";
            $(oPopup.document).find("#PGITestStatusRow").css(DoItConfig.TestItStatusFont);
        }
        else {
            $("#PGITextFrame" + idPostFix).css("bottom", "52px");
            $("#PGIAdvText" + idPostFix).css("bottom", "24px");
            $("#PGIInfoFrame" + idPostFix).css("bottom", "24px");
            $("#PGITestStatus" + idPostFix).css("display", "block");
            $("#PGITestStatus" + idPostFix).css(DoItConfig.TestItStatusFont);
        }
    }
    $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup0).css({ "display": "block", "cursor": "pointer" }).hover(function () {
        $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup1).css({ "display": "block", "cursor": "pointer" })
    }, function () {
        $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup0).css({ "display": "block", "cursor": "pointer" })
    });

    $(oPopup.document).find("#gicloseod").attr("style", DIMG_bubexit0sq).css({ "display": "block", "cursor": "pointer" }).hover(function () {
        $(oPopup.document).find("#gicloseod").attr("style", DIMG_bubexit1sq).css({ "display": "block", "cursor": "pointer" })
    }, function () {
        $(oPopup.document).find("#gicloseod").attr("style", DIMG_bubexit0sq).css({ "display": "block", "cursor": "pointer" })
    });

    if (IsTouchDevice()) { $(".iosonly").show(); }

    $("#giTitlebarContFF").css(DoItConfig.DoItFont);
    $("#giTitlebarContFF").css(DoItConfig.DoItHeaderColor);
    $(oPopup.document).find("#gititle").css(DoItConfig.DoItFont);
    $(oPopup.document).find("#movePopup, #movePopup2").css(DoItConfig.DoItHeaderColor);
    if (!jQuery.isEmptyObject(DoItConfig.DoItHeaderImage)) {
        $("#giTitlebarContFF").css("background-color", "");
        $("#giTitlebarFF").css(DoItConfig.DoItHeaderImage);
        $(oPopup.document).find("#movePopup, #movePopup2").css("background-color", "");
        $(oPopup.document).find("#TitleContainer").css(DoItConfig.DoItHeaderImage);
    }
    if (!jQuery.isEmptyObject(DoItConfig.DoItBackground)) {
        $("#split1FF").css(DoItConfig.DoItBackground);
    }

    var rnd = Math.random().toString()
    var sessionID = rnd.substr(rnd.length - 8);
    giTitle = (testIt ? R_mode_testit : R_mode_doit) + " " + jQuery.trim($("#TopicName").text()) + (upk.browserInfo.isFF() ? (" (" + sessionID + ")") : "");
    document.title = giTitle;


    SendEventToHemiFFButtonPlugin();

    GIOnLoad = true;

}

var ScreenshotVisible = 1;
var SavedSSHeight = 0;
var SavedSSHeight2 = 0;

function toggleScreenshot(o) {
    //	alert(popHeight+" 1: "+oPopup.document.getElementById("split1").clientHeight+" 2: "+oPopup.document.getElementById("split2").clientHeight)
    //	alert(" 1: "+oPopup.document.getElementById("split1").style.height+" 2: "+oPopup.document.getElementById("split2").style.height)
    if (ScreenshotVisible) {
        if (IsTouchDevice()) {
            $("#giSplitter" + idPostFix).unbind("touchstart", SplitStart);
            $("#giToggleFF").unbind("touchstart", SplitStart);
        }
        $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistydown0).css({ "display": "block", "cursor": "pointer" }).hover(function () {
            $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistydown1).css({ "display": "block", "cursor": "pointer" })
        }, function () {
            $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistydown0).css({ "display": "block", "cursor": "pointer" })
        });

        if (upk.browserInfo.isExplorer() && popupVersion) {
            var s2 = oPopup.document.getElementById("split2");
            var h = s2.getBoundingClientRect().top;
            SavedSSHeight = popHeight - h;
            SavedSSHeight2 = s2.clientHeight;
            popHeight = h;
            oPopup.document.getElementById("sstoggle1").style.display = "none";
            oPopup.document.getElementById("sstoggle2").style.display = "none";
            oPopup.document.getElementById("sstoggle3").style.display = "none";
        }
        else {
            SavedSSHeight = oPopup.document.getElementById("split1" + idPostFix).style.height;
            oPopup.document.getElementById("split2" + idPostFix).style.display = "none";
        }
        oPopup.document.getElementById("split1" + idPostFix).style.height = "100%";
        ScreenshotVisible = 0;
        oPopup_show(LeftPos, TopPos, popWidth, popHeight);
    } else {
        if (IsTouchDevice()) {
            $("#giSplitter" + idPostFix).bind("touchstart", SplitStart);
            $("#giToggleFF").bind("touchstart", SplitStart);
        }
        $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup0).css({ "display": "block", "cursor": "pointer" }).hover(function () {
            $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup1).css({ "display": "block", "cursor": "pointer" })
        }, function () {
            $(oPopup.document).find("#GITwisty" + idPostFix).attr("style", DIMG_twistyup0).css({ "display": "block", "cursor": "pointer" })
        });

        if (upk.browserInfo.isExplorer() && popupVersion) {
            if (!SavedSSHeight2) SavedSSHeight2 = 100;
            popHeight += SavedSSHeight;

            oPopup.document.getElementById("sstoggle1").style.display = "inline";
            oPopup.document.getElementById("sstoggle2").style.display = "inline";
            oPopup.document.getElementById("sstoggle3").style.display = "inline";

            var s2p = SavedSSHeight2 / (popHeight - 60)

            if (s2p < 0.1)
                s2p = 0.1;
            if (s2p > 0.9)
                s2p = 0.9;
            oPopup.document.getElementById("split1").style.height = ((1 - s2p) * 100) + "%";
            oPopup.document.getElementById("split2").style.height = (s2p * 100) + "%";
            if (popHeight > screen.height)
                popHeight = screen.height;
            oPopup_show(LeftPos, TopPos, popWidth, popHeight);
            LeftPos = oPopup.document.parentWindow.screenLeft;
            TopPos = oPopup.document.parentWindow.screenTop;
        }
        else {
            oPopup.document.getElementById("split1" + idPostFix).style.height = SavedSSHeight;
            oPopup.document.getElementById("split2" + idPostFix).style.top = SavedSSHeight;
            oPopup.document.getElementById("split2" + idPostFix).style.height = (100 - Number(SavedSSHeight.substring(0, SavedSSHeight.indexOf("%")))) + "%";
            oPopup.document.getElementById("split2" + idPostFix).style.display = "block";
        }
        ScreenshotVisible = 1;
    }
    if (PlayerConfig.EnableCookies && GICookie && GICookie != null) {
        GICookie["Cleft"] = LeftPos;
        GICookie["Ctop"] = TopPos;
        GICookie["Cwidth"] = popWidth;
        if (ScreenshotVisible) GICookie["Cheight"] = popHeight;
        else GICookie["Cheight"] = popHeight + SavedSSHeight;
        GICookie["Csss"] = ScreenshotVisible + 1;
        GICookie["Cs2"] = (upk.browserInfo.isExplorer() && popupVersion) ? SavedSSHeight2 : SavedSSHeight;
        GICookie.Store()
    }

    RefreshStep();
}

function DecodeInputString(s) {
    s = replaceString("&lt;", "<", s);
    return s;
}

function replaceString(oldS, newS, fullS) {
    // Replaces oldS with newS in the string fullS
    for (var i = 0; i < fullS.length; i++) {
        if (fullS.substring(i, i + oldS.length) == oldS) {
            fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length)
        }
    }
    return fullS
}

function fixInputString(strHTMLString) {
    if (strHTMLString) {
        for (var i = 0; i < strHTMLString.length; i++) {
            strHTMLString[i] = replaceString("<", "&lt;", strHTMLString[i]);
            strHTMLString[i] = replaceString(">", "&gt;", strHTMLString[i]);
        }
    }

    return strHTMLString;
}

function getMyGuid() {
    var l = this.location.href;
    var k = l.indexOf("?");
    if (k >= 0)
        l = l.substr(0, k);
    k = l.lastIndexOf("/");
    var g = l.substr(k - 36, 36);
    return g;
}

function formatStr(s) {
    var args = arguments;
    for (var i = 1; i < args.length; i++) {
        var arg = "{" + (i - 1) + "}";
        var k = s.indexOf(arg);
        if (k >= 0)
            s = s.substr(0, k) + args[i] + s.substr(k + arg.length);
    }
    return s;
}

/*
function GGGFocus()
{
	
RePop();
}

function GGGBlur()
{
RePop();
}

window.onfocus=GGGFocus;
window.onblur=GGGBlur;
*/
if (Array.prototype.push == null)
    Array.prototype.push = function (e) { this[this.length] = e; return e };

if (typeof HTMLElement != "undefined" && !
HTMLElement.prototype.insertAdjacentElement) {
    HTMLElement.prototype.insertAdjacentElement = function 
(where, parsedNode) {
        switch (where) {
            case 'beforeBegin':
                this.parentNode.insertBefore(parsedNode, this)
                break;
            case 'afterBegin':
                this.insertBefore(parsedNode, this.firstChild);
                break;
            case 'beforeEnd':
                this.appendChild(parsedNode);
                break;
            case 'afterEnd':
                if (this.nextSibling)
                    this.parentNode.insertBefore(parsedNode, this.nextSibling);
                else this.parentNode.appendChild(parsedNode);
                break;
        }
    }

    HTMLElement.prototype.insertAdjacentHTML = function 
(where, htmlStr) {
        var r = this.ownerDocument.createRange();
        r.setStartBefore(this);
        var parsedHTML = r.createContextualFragment(htmlStr);
        this.insertAdjacentElement(where, parsedHTML)
    }


    HTMLElement.prototype.insertAdjacentText = function 
(where, txtStr) {
        var parsedText = document.createTextNode(txtStr)
        this.insertAdjacentElement(where, parsedText)
    }
}

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


/* sound.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved. 
--*/

// -----------------------------------------------------------------------------
// Globals
// Version of Flash required
var requiredFlashVersion = "9.0.124";

var _name = "";
var _asyn = false;
var _fire = false;
var _knowpalyer = false;
// -----------------------------------------------------------------------------
// -->

/*
if (navigator.platform == "MacPPC" && navigator.userAgent.indexOf("Safari") >= 0) {
requiredFlashVersion = "7.0.14";
}
*/

var bPlayerIsAvailable = false;
var useAudioTag = false;
var useFlash = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////

// document.write("<div id='fplayer'></div>"); NEED TO BE DEFINED IN HTML NEXT TO THE BODY TAG

var hasRequestedVersion;
var _fPlayerPath = "";
var soundjs_initialized = false;

function SoundjsInit() {
    if (soundjs_initialized == true)
        return;
    soundjs_initialized = true;
    var k = document.getElementById("fplayer");
    if (k) {
        // Bug 16683852 - ipad - pdf concept does not appear for the first time
        if (typeof assetType === 'undefined')
            k.innerHTML = "<audio id='upkaudio' onended='AudioEnded();' onerror='AudioError();' oncanplay='AudioLoaded()' style='display: none;'><Source type='audio/mpeg'></audio>";
    }

    /* This hack is to deal with a bug on iOS5.
    We found that sometimes we would request sound to 
    start playing after changing the source and it would
    never start playing.  When that happens, loadstart event
    fires but the durationchange does not.   So we use
    that fact to restart the play request.  */
    if (upk.browserInfo.isiOS5() && typeof assetType === 'undefined') {
        getAPlayer().addEventListener("loadstart", SoundPlayer_OnLoadStart);
        getAPlayer().addEventListener("durationchange", SoundPlayer_OnDurationChange);
    }

    hasRequestedVersion = swfobject.hasFlashPlayerVersion(requiredFlashVersion);
    try {
        _fPlayerPath = (_webpage_ == true ? "../../../../" : "../../../");
    }
    catch (e) { _fPlayerPath = "../../../" };

    SupportAAC();

    CheckAndEnableSound();
}



function SoundPlayer_OnLoadStart() {
    if (SoundPlayerObj.LoadStartTimer) clearInterval(SoundPlayerObj.LoadStartTimer);

    if (getAPlayer().src)
        SoundPlayerObj.LoadStartTimer = setInterval("SoundPlayer_Started()", 3000);
}

function SoundPlayer_OnDurationChange() {
    if (SoundPlayerObj.LoadStartTimer) {
        clearInterval(SoundPlayerObj.LoadStartTimer);
        SoundPlayerObj.LoadStartTimer = 0;
    }
}

function SoundPlayer_Started() {
    /* must reset source */
    getAPlayer().src = getAPlayer().src;
    getAPlayer().play();
}
/* end hack */


function SupportAAC() {
    if (upk.browserInfo.isiOS()) {
        useAudioTag = true;
        bPlayerIsAvailable = true;
        if (PlayerConfig.AACIsAvailable == true)
            return true;
    }
    return false;
}

function CheckAndEnableSound() {
    var k = false;
    try {
        k = soundIsPublished();
    }
    catch (e) {
        k = false;
    }
    if (k == true) {
        if (hasRequestedVersion && !IsTouchDevice() && bPlayerIsAvailable == false && UserPrefs.PlayAudio != 'none') {
            swfobject.embedSWF(_fPlayerPath + "audio/fplayer.swf", "fplayer", "1", "1", requiredFlashVersion, null, null, null, null, onLoadFlash);
            return;
        }
    }
}

function onLoadFlash(e) {
    if (e.success == true) {
        useFlash = true;
        bPlayerIsAvailable = true;
    }
    document.getElementById("fplayer").style.position = "absolute";
    document.getElementById("fplayer").style.top = "0px";
    document.getElementById("fplayer").style.left = "0px";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function AreCookiesEnabled() {
    if (PlayerConfig.EnableCookies == false)
        return false;
    var tmpcookie = new Date();
    chkcookie = (tmpcookie.getTime() + '');
    document.cookie = "chkcookie=" + chkcookie + "; path=/";
    return ((document.cookie.indexOf(chkcookie, 0)) < 0 ? false : true);
}

function Check_Flash(exported, audioPref) {
    if (exported == false)
        return true;
    if (SupportAAC() == true)
        return true;
    if (hasRequestedVersion == false) {
        if (audioPref != "none") {
            return false;
        }
    }
    return true;
}

function getFPlayer() {
    return document.getElementById("fplayer");
}

function getAPlayer() {
    return document.getElementById("upkaudio");
}

function Sound_Init(exported, audioPref, closerFunction, newwindow, path) {
    SoundjsInit();
    if (Check_Flash(exported, audioPref) == true)
        return true;

    if (!SupportAAC() && upk.browserInfo.isiOS())
        return true;

    var _path = "../../../";
    if (path != undefined)
        _path = path;
    if (closerFunction != null)
        eval(closerFunction);
    sw = (screen.width - 640) / 2;
    sh = (screen.height - 480) / 2;
    if (newwindow == null)
        newwindow = true;
    KeepAlive_DoNotSendClose();
    if (newwindow == true)
        window.open(_path + "html/getflash.html?url=" + Escape.MyEscape(this.location.href) + "&newwindow", "", "top=" + sh + ", left=" + sw + ", width=640, height=480, resizable=1,toolbar=1,scrollbars=1,location=1,statusbar=1,menubar=1");
    else if (newwindow == "parent") // windowed player
        setTimeout('parent.location.replace("' + _path + 'html/getflash.html?url=' + Escape.MyEscape(parent.location.href) + '")', 10);
    else
        setTimeout('this.location.replace("' + _path + 'html/getflash.html?url=' + Escape.MyEscape(this.location.href) + '")', 10);
    return false;
}

function SoundPlayerClass() {
    this.TopicPath = unescape(window.location.href);
    while (this.TopicPath.indexOf('\\') != -1)
        this.TopicPath = this.TopicPath.replace('\\', '/');

    var i = this.TopicPath.indexOf("?");
    if (i >= 0)
        this.TopicPath = this.TopicPath.substr(0, i);
    i = this.TopicPath.lastIndexOf("/");
    this.TopicPath = this.TopicPath.substr(0, i + 1);

    this.RootPath = this.TopicPath;
    for (var j = 0; j <= 3; j++) {
        i = this.RootPath.lastIndexOf("/");
        if (i != -1)
            this.RootPath = this.RootPath.substr(0, i);
    };
    this.RootPath = this.RootPath + '/';
    this.SoundPath = this.TopicPath;
    this.AudioPath = resolveUri(this.TopicPath, "../../../audio/");
    this.Volume = 100;

    /* iOS 6.1/5.1 hack to track whether we think sound
    is playing */
    this.LoadStartTimer = 0;
    this.PlayCheckerTimer = 0;
}

function resolveUri(s1, s2) {
    return (s1 + s2);
}

SoundPlayerClass.prototype.ChangeFileSuffix = function (sndfile) {
    var n = sndfile.lastIndexOf(".mp3");
    if (n == sndfile.length - 4)
        return sndfile;
    var s = sndfile.substr(0, sndfile.length - 4);
    if (PlayerConfig.AACIsAvailable || upk.browserInfo.isiOS())
        return s + ".m4a";
    if (useFlash)
        return s + ".flv";
    alert("sound - file extension error");
}

SoundPlayerClass.prototype.Play = function (sndfile, audiofile, templatefile, asyncron) {
    if (useFlash) {
        var fplayer = getFPlayer();
        if (fplayer) {
            fplayer.style.top = getScrollTop() + "px";
            fplayer.style.left = getScrollLeft() + "px";
        }
    }

    if (!audiofile)
        S_SetFrameState("S");

    var frameState = S_GetFrameState();
    if (!asyncron)
        asyncron = false;

    if (!bPlayerIsAvailable) {
        if (asyncron == false) {
            if (frameState != "D")
                S_SetFrameState("D");
            OnErrorPlaySound();
        }
        return;
    }

    if (!templatefile)
        templatefile = false;
    if (templatefile == true) {
        if (asyncron == false)
            OnEndPlaySound();
        return;
    }

    if (sndfile.length == 0) {
        if (asyncron == false) {
            if (frameState != "D")
                S_SetFrameState("D");
            OnErrorPlaySound();
        }
        return;
    }

    if (sndfile.substr(sndfile.length - 4) == ".ASX") {
        var d = sounds[sndfile].duration.split(":");
        try {
            _lastAudioFileSize = parseInt(d[0]) * 60 * 60 + parseInt(d[1]) * 60 + parseFloat(d[2]);
        }
        catch (e) {
            _lastAudioFileSize = 0;
        }
        sndfile = sounds[sndfile].flist[0];
    };

    SoundPlayer_Stop();
    if (sndfile.length == 0) {
        if (asyncron == false) {
            if (frameState != "D")
                S_SetFrameState("D");
            OnErrorPlaySound();
        }
        return;
    }

    fname = (audiofile ? resolveUri(this.AudioPath, sndfile) : resolveUri(this.SoundPath, sndfile));

    _name = this.ChangeFileSuffix(fname);
    _asyn = asyncron;
    _fire = true;
    if (useFlash) {
        if (_knowpalyer == true) {
            setTimeout("SoundPlayer_Open(\"" + _name + "\"," + asyncron + ")", 120);
        }
    }
    else if (useAudioTag) {
        setTimeout("SoundPlayer_Open(\"" + _name + "\"," + asyncron + ")", 120);
    }
}

SoundPlayerClass.prototype.Stop = function (noTimeout) {
    if (bPlayerIsAvailable) {
        if (!noTimeout)
            setTimeout("SoundPlayer_Stop()", 10);
        else
            SoundPlayer_Stop();
    };
}

SoundPlayerClass.prototype.Pause = function () {
    try {
        if (bPlayerIsAvailable) {
            if (useFlash)
                getFPlayer().SoundPause();
            if (useAudioTag)
                getAPlayer().pause();
        }
    }
    catch (e) { };
}

SoundPlayerClass.prototype.Resume = function () {
    if (!InWebpage()) {
        if (getLastSoundFileName() != getActualSoundFileName())
            return;
    }
    try {
        if (bPlayerIsAvailable) {
            if (useFlash)
                getFPlayer().SoundPlay();
            if (useAudioTag)
                getAPlayer().play();
        }
    }
    catch (e) { };
}

SoundPlayerClass.prototype.InitAudioPlayer = function () {
    if (bPlayerIsAvailable) {
        if (useAudioTag) {
            getAPlayer().src = this.AudioPath + "empty.m4a";
            getAPlayer().play();
        }
    }
}

SoundPlayerClass.prototype.IsAvailable = function () {
    return bPlayerIsAvailable;
};

SoundPlayerClass.prototype.SetSoundPath = function (s) {
    if (s.length > 0)
        this.SoundPath = s;
};

SoundPlayerClass.prototype.SetVolume = function (t) {   //  0 <= t <= 100
    if (t == null)
        t = this.Volume;
    else
        this.Volume = t;
    if (useFlash) {
        try {
            getFPlayer().SetSoundVolume(t / 100);
        }
        catch (e) { };
    }
    if (useAudioTag) {
        try {
            getAPlayer().volume = (t / 100);
        }
        catch (e) { };
    }
}

function InWebpage() {
    if (typeof (_webpage_) === "undefined")
        return false;
    return _webpage_;
}

function SoundPlayer_EndCheck() {
    var htmlaudio = getAPlayer();
    if (htmlaudio.ended && SoundPlayerObj.PlayCheckerTimer) {
        setTimeout(function () {
            if (SoundPlayerObj.PlayCheckerTimer)
                SoundComplete(false);
        },
         50);
    }
}

var _lastAsyncronFile = false;
var _lastAudioFile = "";
var _lastFlashTime = -1;
var _lastAudioFileSize = 0;
var _lastFileName = "";

function clearLastSoundFileName() {
    _lastFileName = "";
}

function getLastSoundFileName() {
    return _lastFileName.substr(_lastFileName.lastIndexOf('/') + 1);
}

function getActualSoundFileName() {
    try {
        return sounds[showActObj.id.substr(1) + ".ASX"].flist[0];
    }
    catch (e) {
        return "";
    }
}

function SoundPlayer_Open(fname, asyncron) {
    if (fname.length > 0)
        _lastFileName = fname;
    try {
        if (fname.length > 0 && asyncron == true)
            _lastAsyncronFile = true;
        if (timelineDescriptor.valid && timelineDescriptor.type != "narration") {
            throw "";
        }
        if (useFlash) {
            audio_loading = true;
            _lastFlashTime = -1;
            getFPlayer().SetSoundFile(fname);
            getFPlayer().SoundPlay();
            if (timelineDescriptor.valid && timelineDescriptor.type == "narration") {
                SoundFPlayer_SetTime();
                return;
            }
            audio_loading = false;
        }
        if (useAudioTag) {
            audio_loading = true;
            getAPlayer().pause();
            if (_lastAudioFile == fname) {
                AudioLoaded();
            }
            else {
                getAPlayer().src = fname;
                CLog(fname + " - " + _lastAudioFile + " play");
            }
            _lastAudioFile = fname;
        }
        SoundPlayerObj.SetVolume();
        if (upk.browserInfo.isiOS()) {
            if (SoundPlayerObj.PlayCheckerTimer)
                clearInterval(SoundPlayerObj.PlayCheckerTimer);
            SoundPlayerObj.PlayCheckerTimer = setInterval("SoundPlayer_EndCheck()", 500);
        }
    }
    catch (e) {
        S_SetFrameState("D");
        if (asyncron == false)
            OnErrorPlaySound();
    }
}

function SoundFPlayer_SetTime() {
    getFPlayer().SoundPause();
    getFPlayer().SoundSeek(timelineDescriptor.resttime / 1000);
    var d = Math.abs(timelineDescriptor.resttime / 1000 - getFPlayer().Time());
    if (d < 0.3) {
        getFPlayer().SoundPlay();
        audio_loading = false;
        return;
    }
    setTimeout("SoundFPlayer_SetTime()", 300);
}

function SoundAPlayer_SetTime() {
    if (audio_seeking == false)
        return;
    if (audio_counter > 100) {
        setTimeout("AudioReload();", 100);
        return;
    }
    audio_counter++;
    var resttime = 0;
    if (timelineDescriptor.valid == true && timelineDescriptor.type == "narration") {
        resttime = timelineDescriptor.resttime / 1000;
        if (resttime > _lastAudioFileSize - 1) {
            getAPlayer().pause();
            SoundComplete();
            CLog("nextframe");
            return;
        }
        if (resttime < 0)
            resttime = 0;
    }
    try {
        getAPlayer().currentTime = resttime;
    }
    catch (e) {
        setTimeout("SoundAPlayer_SetTime()", 300);
    }
    var ct = getAPlayer().currentTime;
    var d = Math.abs(ct - resttime);
    try {
        CLog("d: " + d + " " + ct + " " + resttime + " " + _lastAudioFileSize + " " + showScreen);
    }
    catch (e) {
        CLog("d: " + d + " " + ct + " " + resttime + " " + _lastAudioFileSize);
    }
    if (d < 0.3) {
        audio_seeking = false;
        CLog("play...");
        getAPlayer().play();
    }
    else {
        setTimeout("SoundAPlayer_SetTime()", 300);
    }
}

function SoundIsLocked() {
    return (audio_loading == true || audio_seeking == true);
}

function SoundPlayer_Stop() {
    try {
        if (SoundPlayerObj.PlayCheckerTimer) {
            clearInterval(SoundPlayerObj.PlayCheckerTimer);
            SoundPlayerObj.PlayCheckerTimer = 0;
        }
        _lastAsyncronFile = false;
        if (useFlash)
            getFPlayer().SoundStop();
        if (useAudioTag) {
            getAPlayer().pause();
        }
    }
    catch (e) { }
}

function SoundPlayer_GetTime() {
    var sfile = getLastSoundFileName();
    var id = showActObj.id.substr(1);
    var s2file = sounds[id + '.ASX'].flist[0];
    if (sfile.length > 0 && sfile != s2file) {
        return { s: sfile, t: NaN };
    }
    var fTime = 0;
    if (useAudioTag) {
        fTime = getAPlayer().currentTime * 1000;
    }
    if (useFlash) {
        var fTime = getFPlayer().Time() * 1000;
    }
    if (fTime == 0 && _lastFlashTime >= 0)
        fTime = _lastFlashTime;
    else
        _lastFlashTime = fTime;
    return { s: sfile, t: fTime };
}

function OnFlashLoad() {
    if (_fire == true) setTimeout("SoundPlayer_Open(\"" + _name + "\"," + _asyn + ")", 20);
    _fire_ = false;
    _knowpalyer = true;
}

function SoundComplete(error) {
    if (InWebpage()) {
        if (error)
            OnErrorPlaySound();
        else
            OnEndPlaySound();
        return;
    }
    if (SoundPlayerObj.PlayCheckerTimer) {
        clearInterval(SoundPlayerObj.PlayCheckerTimer);
        SoundPlayerObj.PlayCheckerTimer = 0;
    }
    if (_lastAsyncronFile) {
        _lastAsyncronFile = false;
        return;
    }
    if (useAudioTag) {
        if (error) {
            S_SetFrameState("D");
            OnErrorPlaySound();
        }
        else {
            if (typeof (animObject) != "undefined") {
                if (animObject) {
                    if (fusionmode == true && animObject.timeout == DELAY_INFINITE * 100) {
                        if (animObject.showbubble == false)
                            animObject.timeout = 0;
                    }
                    else {
                        animObject.timeout = 0;
                    }
                }
            }
            OnEndPlaySound();
        }
    }
    if (useFlash) {
        s = getFPlayer().SoundState();
        if (s == "notfoundfile") {
            S_SetFrameState("D");
            OnErrorPlaySound();
        }
        else if (s == "complete") {
            if (typeof (animObject) != "undefined") {
                if (animObject) {
                    if (fusionmode == true && animObject.timeout == DELAY_INFINITE * 100) {
                        if (animObject.showbubble == false)
                            animObject.timeout = 0;
                    }
                    else {
                        animObject.timeout = 0;
                    }
                }
            }
            OnEndPlaySound();
        }
    }
}

function AudioEnded() {
    var a = getAPlayer();
    CLog(a.src + " done...");
    if (a.src.indexOf("empty.m4a") >= 0)
        return;
    SoundComplete(false);
}

function AudioError() {
    var a = getAPlayer();
    if (a == null)
        return;
    if (a.src == "")
        return;
    if (a.src.indexOf("empty.m4a") >= 0)
        return;
    CLog(a.src + " error...");
    SoundComplete(true);
}

var audio_loading = false;
var audio_seeking = false;
var audio_counter = 0;

function AudioReload() {
    audio_loading = true;
    getAPlayer().pause();
    getAPlayer().src = _lastAudioFile;
    CLog(fname + " - " + _lastAudioFile + " replay");
}

function AudioLoaded() {
    CLog("AudioLoaded");
    if (audio_loading == true) {
        CLog("AudioLoaded true");
        audio_loading = false;
        audio_counter = 0;
        getAPlayer().pause();
        audio_seeking = true;
        SoundAPlayer_SetTime();
    }
}

function S_GetFrameState() {
    try {
        return upk.Timeline.GetFrameState();
    }
    catch (e) { return ""; }
}

function S_SetFrameState(s) {
    try {
        upk.Timeline.SetFrameState(s);
    }
    catch (e) { }
}

function TimelineDescriptor(valid, frameid, timelineindex, narration, animation, resttime) {
    this.valid = valid;
    if (valid) {
        this.frameid = frameid;
        this.timelineindex = timelineindex;
        this.narration = narration;
        this.animation = animation;
        this.resttime = resttime;
        this.type = "narration";
        if (resttime >= narration)
            this.type = "animationstart";
        if (resttime >= narration + (animation / 2))
            this.type = "nextframe";
    }
}

var timelineDescriptor = new TimelineDescriptor(false, "", 0, 0, 0, 0);
var SoundPlayerObj = new SoundPlayerClass();

var clog_enabled = false;

function CLog(s, force) {
    if (clog_enabled || force == true) {
        if (console !== undefined)
            console.log(s);
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

/* iashelper.js */
window.ias=function(j){function o(a){var b={};if(a!=c)for(var k in a){var i=a[k];if(i!=c)b[k]=i}return b}function s(a){e=o(a);f.push(e);g=c}function t(a,b){if(b!=c)m[a]=b;else delete m[a];l=c}function w(a,b){return encodeURIComponent(a)+"="+encodeURIComponent(b)}function x(a,b){return encodeURIComponent(a)+(b==""?"":"="+encodeURIComponent(b))}function u(a,b){var k=b?x:w,i=[],n;for(n in a){var h=a[n];if(h&&h.push&&h.sort)for(var p=0;p<h.length;++p)i.push(k(n,h[p]));else h!=c&&i.push(k(n,h))}return i.join(";")}
var c=null,v=c,g=c,e={},f=[e],m={},l=c,q=[],r=[],d=window.ias||{};d.SetNamespace=function(a){v=a};d.SetContext=function(a){e=o(a);f[f.length-1]=e;g=c};d.SetContextPart=function(a,b){if(b!=c)e[a]=b;else delete e[a];g=c};d.ResetContext=function(a){f=[];s(a)};d.SetTag=t;d.SetTags=function(a){for(var b in a)t(b,a[b])};d.ResetTags=function(a){m=o(a);l=c};d.PushContext=s;d.PopContext=function(){f.pop();f.length||f.push({});e=f[f.length-1];g=c};d.AddDiscoveryCddUrl=function(a){q.push(a)};d.AddApplicableCddUrl=
function(a){r.push(a)};j.UPK_GetNamespace=function(){return v};j.UPK_GetContext=function(){if(g==c)g=u(e);return g};j.UPK_GetTags=function(){if(l==c)l=u(m,true);return l};j.UPK_GetDiscoveryCddUrls=function(){return q.length?q:c};j.UPK_GetApplicableCddUrls=function(){return r.length?r:c};return d}(window);ias.SetTag("upk-trait-nohelp","");
