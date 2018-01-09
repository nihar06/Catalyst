
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
/* lmstart.js */
// Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
/*
document.write('<script src="../../../kpsettings.js"></script>');
*/

var urlParser = null;

// var _lmsMode = "";          // LMS, KPT, Cookie or undefined | defined in lms_init.js
var _lmsEnvironment = "";   // LMS, TOC, DHTML

function InitLmsEnvironment() {
    if (urlParser.GetParameter("toc") != null) {
        _lmsEnvironment = "TOC";
    }
    else if (urlParser.GetParameter("dhtml") != null) {
        _lmsEnvironment = "DHTML";
    }
    else {
        _lmsEnvironment = "LMS";
    }
}

function decodeHTMLString(strHTMLString) {
    strHTMLString = replaceString("&amp;", "&", strHTMLString);
    return strHTMLString;
}

function fixHTMLString(strHTMLString) {
    strHTMLString = replaceString("<", "&lt;", strHTMLString);
    strHTMLString = replaceString(">", "&gt;", strHTMLString);
    strHTMLString = replaceString("'", "&#39;", strHTMLString);
    strHTMLString = replaceString('"', "&#34;", strHTMLString);
    var k = strHTMLString.indexOf("\\\\");
    while (k >= 0) {
        strHTMLString = strHTMLString.substr(0, k) + strHTMLString.substr(k + 1);
        k = strHTMLString.indexOf("\\\\", k + 1);
    }

    return strHTMLString;
}

var _deviceDPI = 0;

function InitUI() {

    // Get the current device DPI
    if (_deviceDPI == 0)
        _deviceDPI = getDpiInfo();

    if (_deviceDPI == 0) {
        setTimeout("InitUI()", 100);
        return;
    }

    if (_deviceDPI != 96) {
        if (getDPICookie() == false) {
            this.location.replace("../../../html/unsuppdpi.html?" + Escape.MyEscape(AbsUrl(this.location.href)));
            return;
        }
    }

    urlParser = new UrlParser();
    urlParser.Parse();

    concept = decodeHTMLString(concept);
    concept = resolveIfRelative(concept);
    if (concept.length == 0 && assetType == "T") {
        concept = "./tpc/" + topicID + "/leadin.html";
    }
    topicName = decodeHTMLString(topicName);
    InitLmsEnvironment();
    InitLmsMode("lmstart");
    var childIndex = 0;
    var childIndexParam = urlParser.GetParameter("lmsChildIndex");
    if (childIndexParam > 0) {
        childIndex = childIndexParam;
    }
    var guid = (assetType == "B" ? originalType : assetType) + "_" + topicID;

    //    oType = (assetType == "B" ? originalType : "");
    //    if (concept.length == 0 && (assetType == "C" || oType == "C")) {
    //        guid = null;
    //    }

    if (concept.length == 0) {
        if (assetType == "B" || assetType == "C")
            guid = null;
    }

    if (_lmsMode != null) {
        if (urlParser.GetParameter("nosound") == null) {
            if (Sound_Init(soundIsExported, UserPref_PlayAudio_Original, null, false) == false)
                return;
        }
    }

    var ctx;
    switch (assetType) {
        case "T":
            ctx = "topic"
            break;
        case "A":
            ctx = "assessment"
            break;
        case "Q":
            ctx = "question"
            break;
        case "C":
            ctx = "concept"
            break;
    }
    if (_lmsEnvironment == "TOC") {
        ctxHelper.SetContext("toc", ctx);
    } else {
        ctxHelper.SetContext(ctx);
    }
    lms_InitPage((_lmsMode == null ? childIndex : -1), (_lmsMode == null ? window.parent : null), guid, "InitUI2()");
}

function InitUI2() {

    if (urlParser.GetParameter("nosound") != null) {
        SetNoSound(true);
    }

    if (topicDescriptor == null)
        topicDescriptor = LoadDescriptor();
    if (assetType == "Q") {
        BuildQuestionConcept();
    }
    if (assetType == "A") {
        BuildAssessmentConcept();
    }
    if (!topicDescriptor.userdefined) {
        if (concept.length > 0)
            concept = urlParser.GetCorrectUrl(concept, true);
    }
    try {
        if (getInnerWidth() > 0 && getInnerHeight() > 0)
            this.frames["myframe"].location.replace(urlParser.GetCorrectUrl("../../../html/lmsui.html"));
    }
    catch (e) { return; }
}

function getInnerWidth() {
    if (window.innerWidth) {
        return window.innerWidth;
    }
    else if (document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }
    else if (document.body.clientWidth) {
        return document.body.clientWidth;
    }
}

function getInnerHeight() {
    if (window.innerHeight) {
        return window.innerHeight;
    }
    else if (document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }
    else if (document.body.clientHeight) {
        return document.body.clientHeight;
    }
}

function GetBasePath() {
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

function BuildQuestionConcept() {
    var _userdefined = topicDescriptor.userdefined;
    concept = topicDescriptor.concept;
    if (_userdefined.toLowerCase() == "true") {
        var kpnextpage = AbsUrl("../../../../html/udq_callback.html");
        //            kpnextpage = "../../js/udq_callback.html";
        var kpmode = 0;
        var kprnda = 0;
        var kpremed = 0;
        var kpfeedbk = 0;
        switch (topicDescriptor.remediation.toLowerCase()) {
            case "always":
                kpremed = 3;
                kpfeedbk = 1;
                break;
            case "userasks":
                kpremed = 1;
                kpfeedbk = 1;
                break;
            case "incorrect":
                kpremed = 2;
                kpfeedbk = 1;
                break;
            case "resultsonly":
                kpremed = 0;
                kpfeedbk = 1;
                break;
            case "none":
                kpremed = 0;
                kpfeedbk = 0;
                break;
        }
        concept += "?kpnextpage=" + kpnextpage + "&kpmode=" + kpmode + "&kpremed=" + kpremed + "&kpfeedbk=" + kpfeedbk + "&kprnda=" + kprnda;
    }
    if (_lmsMode == "LMS") { concept += "&lms"; }
    concept += "&question=" + topicID + "&host=player";
}

function AbsUrl(url) {
    return url;

    /*
    for (var i = 0; i < url.length; i++) {
    c = url.substr(i, 1);
    if (c == ':')
    return url;
    }
    base = window.location.href;

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

    if (url.substr(0, 3) == "../") {
    var k = base.lastIndexOf('/');
    base = base.substr(0, k);
    while (url.substr(0, 3) == "../") {
    k = base.lastIndexOf('/');
    base = base.substr(0, k);
    url = url.substr(3);
    }
    base = base + "/" + url;
    }
    else {
    k = base.lastIndexOf('/');
    base = base.substr(0, k);
    base = base + "/" + url;
    }
    return (base);
    */
}

function BuildAssessmentConcept() {
    var cc = urlParser.GetCorrectUrl(concept, true);
    concept = topicDescriptor.concept + "&assessment=" + topicID;
    concept += "&concept=" + cc;
    if (_lmsMode == "LMS") { concept += "&lms"; }
    var _owner = urlParser.GetParameter("owner");
    if (_owner != null) {
        if (_owner.length > 0) {
            concept += "&owner=" + _owner;
        }
    }
}

function OnQuestionContinue() {
    if (parent.OnQuestionContinue)
        parent.OnQuestionContinue();
}

function OnPrepareDialog() {
    this.frames["myframe"].OnPrepareDialog();
}

function StartTopic(mode, frame_id, fromjumpin) {
    this.frames["myframe"].launchTopic(mode, frame_id, fromjumpin);
}

function getConceptPageWidth() {
    return this.frames["myframe"].getConceptPageWidth();
}

function SetCtxexParam(s) {
    urlParser.AddParameter("ctxex", s);
}

function RoleStatusChanged() {
    var k = CheckSeeAlso();
    // call lmsui (lms.js) to update the link on the UI
    this.frames["myframe"].UpdateSeeAlso(k);
}

function OpenSeeAlso(seeAlsoRoot, index) {
    this.frames["myframe"].OpenSeeAlso(seeAlsoRoot, index);
}

function OnNotesClosed() {
    this.frames["myframe"].OnNotesClosed();
}

function ConnectionLostEvent(errText) {
    if (this.frames["myframe"].ConnectionLostEvent)
        this.frames["myframe"].ConnectionLostEvent(errText);
    else
        alert(R_status_inst_offline + "\n" + R_status_error_prefix + errText);
}

////////////////////////////////////////////////////////////////////////////////////////////
// Descriptor support

var topicDescriptor = null;

function topicDescriptorObj(title, type, tpc, playmodes, jumpInArray, leadin, concept, printitname, userdefined, remediation, qreference, bigsco) {
    this.title = title;
    this.type = type;
    this.tpc = tpc;
    this.playmodes = playmodes;
    this.jumpInArray = jumpInArray;
    this.leadin = leadin;
    this.concept = concept;
    this.printitname = encodeURIComponent(printitname);
    this.userdefined = userdefined;
    this.remediation = remediation;
    this.seealsoroot = "";
    this.seealsolinks = new Array();
    this.qreference = qreference;
    this.bigsco = bigsco;
}

function seeAlsoLink(type, title, guid, empty) {
    this.type = type;
    this.title = title;
    this.guid = guid;
    this.filtered = false;
    this.empty = empty;
}

function JumpInPoint(label, frameid, modes) {
    this.label = label;
    this.frame_id = frameid;
    this.modes = modes;
}

function LoadDescriptor(guid) {

    var req = null;
    try {
        if (window.location.href.substr(0, 7).toLowerCase() == "http://" ||
            window.location.href.substr(0, 8).toLowerCase() == "https://")
            req = new XMLHttpRequest();
        if (window.location.href.substr(0, 7).toLowerCase() == "file://" && IsTouchDevice()) {
            req = new XMLHttpRequest();
        }
    }
    catch (e) { }
    finally {
        if (req == null)
            req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var descfile = (guid == null ? "descriptor.xml" : "../" + guid + "/descriptor.xml");
    req.open("GET", descfile, false);
    req.send();

    if (req.status == 200 || (location.hostname == "" && req.status == 0)) {
        if (req.responseXML == null || req.responseXML.documentElement == null) {
            var xmlDoc = null;
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(req.responseText);
            }
            catch (e) {
                var p = new window.DOMParser();
                xmlDoc = p.parseFromString(req.responseText, "application/xml");
            }
            var rpt = req.responseText;
            req = {};
            req.responseXML = xmlDoc;
            req.responseText = rpt;
        }
    }

    var playmodes = getDescriptorItem(req, "PlayModes");

    jumpInArray = new Array();
    nodes = req.responseXML.getElementsByTagName("JumpIn");
    for (var i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (n.textContent)
            label = n.textContent;
        else if (n.text)
            label = n.text;
        else if (n.firstChild.data)
            label = n.firstChild.data;
        for (var j = 0; j < n.attributes.length; j++) {
            a = n.attributes[j];
            if (a.nodeName.toLowerCase() == "frameid")
                frameid = a.value;
            if (a.nodeName.toLowerCase() == "modes")
                modes = a.value;
        }
        jumpInArray[jumpInArray.length] = new JumpInPoint(fixHTMLString(label), frameid, modes);
    }
    _leadIn = "../html/empty.html";
    nodes = req.responseXML.getElementsByTagName("Leadin");
    if (nodes.length > 0) {
        _leadIn = "./tpc/" + topicID + "/leadin.html";
    }
    _concept = "";
    nodes = req.responseXML.getElementsByTagName("Concept");
    if (nodes.length > 0) {
        n = nodes[0];
        if (n.textContent)
            _concept = n.textContent;
        else if (n.text)
            _concept = n.text;
        else if (n.firstChild.data)
            _concept = n.firstChild.data;

        if (_concept.indexOf('odrel://') == 0)
            _concept = resolve(_concept);
    }
    _title = getDescriptorItem(req, "Title");
    _type = getDescriptorItem(req, "Type");
    _printitname = getDescriptorItem(req, "PrintItName");
    _userdefined = getDescriptorItem(req, "UserDefined");

    _remediation = getDescriptorItem(req, "Remediation");
    if (_remediation == "")
        _remediation = "Always";
    _qreference = getDescriptorItem(req, "Reference");
    _bigsco = getDescriptorItem(req, "BigSco");

    var tD = new topicDescriptorObj(_title, _type, topicID, playmodes, jumpInArray, _leadIn, _concept, _printitname, _userdefined, _remediation, _qreference, _bigsco);

    nodes = req.responseXML.getElementsByTagName("SeeAlsoRoot");
    if (nodes.length > 0) {
        n = nodes[0];
        var saroot = "";
        if (n.textContent)
            saroot = n.textContent;
        else if (n.text)
            saroot = n.text;
        else if (n.firstChild.data)
            saroot = n.firstChild.data;
        tD.seealsoroot = saroot;
    }

    nodes = req.responseXML.getElementsByTagName("SeeAlso");
    for (var i = 0; i < nodes.length; i++) {
        n = nodes[i];
        var type = "";
        var title = "";
        var guid = "";
        var empty = false;
        for (var j = 0; j < n.attributes.length; j++) {
            var a = n.attributes[j];
            if (a.nodeName == "Type")
                type = getTextContent(a);
            if (a.nodeName == "Title")
                title = getTextContent(a);
            if (a.nodeName == "Guid")
                guid = getTextContent(a);
            if (a.nodeName == "Empty")
                empty = true;
        }
        if (type.length > 0 && title.length > 0) {
            tD.seealsolinks[tD.seealsolinks.length] = new seeAlsoLink(type, title, guid, empty);
        }
    }
    return tD;
}

function UpdateSeeAlsoLinks(tdesc) {
    for (var i = 0; i < tdesc.seealsolinks.length; i++) {
        tdesc.seealsolinks[i].filtered = parent._getFilteredStatus(tdesc.seealsolinks[i].guid);
    }
}

function CheckSeeAlso() {
    if (topicDescriptor.seealsoroot.length == 0)
        return false;
    if (topicDescriptor.seealsolinks.length == 0)
        return false;
    if (_lmsEnvironment == "TOC") {
        if (parent.CheckSeeAlso() == false)
            return false;
        UpdateSeeAlsoLinks(topicDescriptor);
        for (var i = 0; i < topicDescriptor.seealsolinks.length; i++) {
            if (topicDescriptor.seealsolinks[i].filtered == false)
                return true;
        }
        return false;
    }
    return true;
}

function getDescriptorItem(req, itemname) {
    var item = "";
    try {
        var nodes = req.responseXML.getElementsByTagName(itemname);
        if (nodes.length > 0) {
            n = nodes[0];
            if (n.textContent != null)
                item = n.textContent;
            else if (n.text != null)
                item = n.text;
            else if (n.firstChild.data != null)
                item = n.firstChild.data;
        }
    }
    catch (e) { };
    return item;
}

function getTextContent(n) {
    try {
        if (n.value)
            return n.value;
        else if (n.text)
            return n.text;
        else if (n.firstChild.data)
            return n.firstChild.data;
        return "";
    }
    catch (e) {
        return "";
    }

}

/* lms_lmstart.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// include lms_init.js
/*
document.write('<script type="text/javascript" src="../../../config.js"></script>');
document.write('<script type="text/javascript" src="../../../js/cookie.js"></script>');
document.write('<script type="text/javascript" src="../../../js/lms_init.js"></script>');
*/
// callback functions from lmstart.html

function lms_LoadAdapterComplete() {
	__Ialert("lms_LoadAdapterComplete() called");

	var lmscom = document.LmsCom;
	lmscom.Begin();

	var assetType = window.assetType;
	if ((Kpath_launch || lmscom.bigsco) && assetType === "B")
		assetType = "C";
	if (lms_store.cguid) {
		switch (assetType) {
			case "T":
				var reqMode = (lmscom.isTestIt || (typeof window.lmsReqMode === "undefined")) ? null : window.lmsReqMode;
				var statobj = lmscom.OpenTopicStatus(lmsModes, playerModes, reqMode);
				if (!statobj.isComplete()) {
					//                    statobj.setStatus(LMS_INCOMPLETE);    // computed field
					lmscom.SaveStatus();    // roll up to LMS immediately to change indicator
					lmscom.SendCompletionInfo();
					// if we're in a big sco, call the parent to update the toc
					lmscom.NotifyParent();
				} else if (statobj.GetRequiredMode() === "None" || lmscom.lesson_status === LMS_INCOMPLETE) {
					// if no modes enabled, then we complete as soon as we launch
					// 12829500 - or, if we finished a mode outside the portal that wasn't the required mode
					// but is the required mode now that we're in the portal, complete the topic without needing to
					// relaunch the now-required mode again
					// note: we can't distinguish this from previous completion
					//                    statobj.setStatus(LMS_COMPLETED); // computed field
					statobj.anylaunched = true;    // fake it out since there are no modes to launch
					lmscom.SaveStatus();    // roll up to LMS immediately to change indicator
					lmscom.SendCompletionInfo();
					// if we're in a big sco, call the parent to update the toc
					lmscom.NotifyParent();
				}
				break;
			case "C":
				lmscom.OpenBasicStatus();
				lmscom.status_obj.setStatus(LMS_COMPLETED); // section concept completes just by viewing
				lmscom.SaveStatus();    // roll up to LMS immediately to change indicator
				lmscom.SendCompletionInfo();
				// if we're in a big sco, call the parent to update the toc
				lmscom.NotifyParent();
				break;
			case "A":
				lmscom.OpenBasicStatus();
				lmscom.itemCount = window.itemCount;
				lmscom.hash = window.hash;
				lmscom.questionlimit = window.questionlimit;
				break;
			default:
				lmscom.OpenBasicStatus();
		}
	} else {
		lmscom.OpenBasicStatus();   // for conceptless sections
	}
	if (assetType === "B") {
		lmscom.bigScoItemCount = window.bigScoItemCount;
		lmscom.bigScoHash = window.bigScoHash;
		if (!lmscom.lesson_data)
			lmscom.status_obj.setStatus(LMS_NOT_ATTEMPTED);
	}

	lms_initialized = true;
	setTimeout(lms_store.callbackfunction, 1);
}

function GetChildLmsCom(child_store) {
	__Ialert("lms_GetChildLmsCom() called");
	var lmscom = document.LmsCom;
	var childlmscom = child_store.window.document.LmsCom = lmscom;  // lmstart and lmsui share same lmscom object
	childlmscom.owner = child_store.window;     // set owner to lmsui so its ListenChildClose will be called by asset
}

//----------------------------------------------------------------------------------------------/

var _lms_module_name = "lms_lmstart.js";
var _lms_show_alert = false;
var _lms_show_Ialert = false;

/* relativelink.js */
// Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.

// Split an URI into three main parts
function splitUri(uri) {
    // Split the URI into parts
    var parts = uri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    parts.shift();

    // Identidy tge different parts
    var scheme = parts[1], authority = parts[3], path = parts[4], querystring = parts[6], frag = parts[8];

    // Build the three main part of the URI: prefix, path, postfix
    parts = [scheme + "://" + authority, path, querystring + frag];

    // Return the three main parts as an array
    return parts;
}

// Combine base and relative URL into a resolved URL
function combine(baseUrl, relativeUrl) {

    // Remove the "odrel://" prefix if exists
    var relativePath = relativeUrl;
    if (relativePath.indexOf('odrel://') == 0)
        relativePath = relativePath.substr('odrel://'.length);

    // Empty relative path points to base path
    if (relativePath == "") relativePath = ".";

    // Split the base url into the main three parts
    var baseUrlparts = splitUri(baseUrl);
    var baseUrlPrefix = baseUrlparts[0]; var baseUrlPath = baseUrlparts[1];

    // Trim slashes
    if (baseUrlPath.charAt(0) == '/') baseUrlPath = baseUrlPath.substr(1);
    if (baseUrlPath.charAt(baseUrlPath.length - 1) == '/') baseUrlPath = baseUrlPath.substr(0, baseUrlPath.length - 1);
    if (relativePath.charAt(relativePath.length - 1) == '/') relativePath = relativePath.substr(0, relativePath.length - 1);

    // Split the paths into segments
    var baseUrlPathSegments = baseUrlPath.split('/');
    var relativePathSegments = relativePath.split('/');

    if ((relativePathSegments.length > 2) && (relativePathSegments[0] == '') && (relativePathSegments[1] == '')) {
        var path = baseUrlPrefix.split(':')[0] + ":/";
        for (var i = 2; i < relativePathSegments.length; i++)
            path += "/" + relativePathSegments[i];

        return path;
    }

    // Initialize the segments of the resolved path
    var resolvedPathSegments = new Array();
    for (var i = 0; i < baseUrlPathSegments.length; i++)
        resolvedPathSegments[i] = baseUrlPathSegments[i];

    // Resolve the relative address
    for (var i = 0; i < relativePathSegments.length; i++) {
        if (relativePathSegments[i] == "..") {
            if (resolvedPathSegments.length > 0) {
                // Remove the last folder in the URI
                resolvedPathSegments = resolvedPathSegments.slice(0, resolvedPathSegments.length - 1);
            }
        }
        else if (relativePathSegments[i] == ".") {
            // Do nothing
        }
        else if (relativePathSegments[i] == "") {
            // Remove all segments from the base URL
            resolvedPathSegments = new Array();
        }
        else {
            // Add the segment to the end of the resolved address
            resolvedPathSegments[resolvedPathSegments.length] = relativePathSegments[i];
        }
    }

    // Build the resolved path
    var resolvedPath = '';
    for (var i = 0; i < resolvedPathSegments.length; i++)
        resolvedPath += '/' + resolvedPathSegments[i];
    var resolvedUrl = baseUrlPrefix + resolvedPath;

    // Return the resolved URI
    return resolvedUrl;
}

// Get the root URL of the player (folder of the index.html)
function getRootUrl() {

    // If the function is running in toc.html
    if (typeof (isTocHtml) != "undefined") {
        var url = document.location.href;
        return url.substr(0, url.lastIndexOf("/"));
    }

    // Split the URL of current document into parts
    var documentUrlParts = splitUri(document.location.href);
    var documentUrlPrefix = documentUrlParts[0];
    var documentUrlPath = documentUrlParts[1];

    // Trim the document path
    if (documentUrlPath.charAt(0) == '/') documentUrlPath = documentUrlPath.substr(1);

    // Split the document URL path into segments
    var documentPathSegments = documentUrlPath.split('/');

    // Find the tpc folder in the document path
    var i;
    for (i = documentPathSegments.length - 1; documentPathSegments[i] != 'tpc' && i >= 0; i--) { };

    if (i > 0 && (documentPathSegments[i-1] == 'data' || documentPathSegments[i-1] == 'help')) { i = i - 1; }

    // Build the path of the root URL
    var rootPath = "";
    for (var j = 0; j < i; j++)
        rootPath += "/" + documentPathSegments[j];

    // Build the root URL
    var rootUrl = documentUrlPrefix + rootPath;

    // Return the root URL
    return rootUrl;
}

function isRelative(uri) {
    // Split the URI into parts
    var parts = uri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

    // If there is no scheme in the uri, then it's relative
    return (parts[1] == '') || (parts[1] == undefined);
}

// Checks the url and resolves if it is relative
function resolveIfRelative(Url) {
    if (Url.indexOf("odrel://") == 0)
        return resolve(Url);
    else
        return Url;
}

// Resolve a relative URL based on the configured base address
function resolve(relativeUrl) {

    // If the base URL is relative
    if (isRelative(PlayerConfig.BaseUrl)) {
        // Get the URL of the player root
        var rootUrl = getRootUrl();
        // Get hte basolute base URL
        var absoluteBaseUrl = combine(rootUrl, PlayerConfig.BaseUrl);
        // Resolve the relative URL
        return combine(absoluteBaseUrl, relativeUrl);
    }
    // If the base URL is absolute
    else {
        // Resolve the relative URL
        return combine(PlayerConfig.BaseUrl, relativeUrl);
    }
}

// Resolve all link in a web page
function resolveLinksInWebPage() {
    // Get the links from the document
    var links = document.getElementsByTagName("a");

    // For each link
    for (var i = 0; i < links.length; i++) {
        // If the link is relative        
        var hr = links[i].getAttribute("href");
        if (hr != null) {
            if (hr.indexOf('odrel://') == 0) {
                // Resolve the URL
                links[i].href = resolve(links[i].getAttribute("href"));
            }
        }
    }
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
