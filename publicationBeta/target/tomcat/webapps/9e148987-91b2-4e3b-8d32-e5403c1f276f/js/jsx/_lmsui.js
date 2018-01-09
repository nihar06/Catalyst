
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

/* swfobject.js */
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){try{var ab=Z.GetVariable("$version");}catch(er){}if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
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


/* lms.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/
var statobj;    //Topic statistics object

//Obtain a reference to the parent window. Used for launches, available modes, etc.
var launchPage = window.parent;
var topicID = launchPage.topicID;

var _myTableObj = null;
var _pmTableObj = null;
var _pmTableHeight = 0;
var _hbordersize = 10;
var showButtons = new Array();
var requiredModes = new Array();
var _inToc = false;
var _noBorder = false;
var lmsMode = "";
var urlParser = null;
var showLaunchButton = false;   // in case of big sco in 3rd party lms
var isJumpInDialogOpen = false;
var conceptOnly = false;

var anyIconAfterConcept = false;
var anyIconBeforeConcept = false;

var allowShowScoStatus = false; // in kpath lms mode we show status for topic/question/assessment scos

var statusDisplayed = false; // status field on the light blue bar
var errorDisplayed = false;

var buttons = null; // array contains play mode buttons

var playModeButtonCount = 0;
var bigsco_status_stored = null;

var playerWindow = null;    // holds a reference to the player window if open
var bigSCOWindow = null;    // holds a reference to the big SCO window if open

var statusDescFirstDisplayed = true;
var ShowDescStatusBar; // bool that contains whether the status bar should be displayed or not
var IsDescStatusBarOpen; // bool that indicates whether the status bar is displayed or not

var hideConcept = false;
var pageWidth = 0;

$(document).ready(function () {
    Init();
});

function LmsEventKeyDown(event) {
    if (!event)
        event = window.event;
    code = event.keyCode;
    if (code == 27) {
        //close dialog if possibe
        if (_inToc == true) {
            if (parent.parent.isOpenDialog()) {
                parent.parent.closeDialog();
                return;
            }
        }
        else {
            if (isOpenDialog()) {
                closeDialog();
                return;
            }
        }
    }
}

function Init() {
    if (upk.browserInfo.isSafari())
        document.onkeydown = LmsEventKeyDown;
    else
        document.onkeypress = LmsEventKeyDown;

    urlParser = new UrlParser();
    urlParser.Parse();

    _pmTableHeight = getObjectById("playmodetable").clientHeight;
    getObjectById("playmodetable").style.display = "none";

    var guid = (parent.assetType == "B" ? parent.originalType : parent.assetType) + "_" + parent.topicID;
    if (parent.concept.length == 0) {
        if (parent.assetType == "B" || parent.assetType == "C")
            guid = null;
    }
    parent.document.title = DecodeTagElements(launchPage.topicName);
    _inToc = parent._lmsEnvironment == "TOC";
    showLaunchButton = Kpath_launch == false && parent.assetType == "B" && _inToc == false;
    lmsMode = parent.GetTopLevelLmsMode();
    _noBorder = _inToc || (Kpath_launch && lmsMode == "LMS" && parent._lmsEnvironment == "LMS");
    var inSeeAlso = _inToc && parent.parent._see_also == true;
    // status should not be displayed for sections or concepts or bigsco's (if it is displayed as a concept in KPath)
    // also do not display in help or in SeeAlso
    if (parent.UIComponents.BannerStatus && lmsMode == "LMS" && parent.assetType != "C" && parent.assetType != "S" && !(parent.assetType == "B" && parent.originalType == "C" && Kpath_launch == true) && !inSeeAlso) {
        allowShowScoStatus = true;
    }
    lms_InitPage(0, window.parent, guid, "pageInit()");
}

function DecodeTagElements(s) {
    s = replaceString("&lt;", "<", s);
    s = replaceString("&gt;", ">", s);
    return s;
}

///////////////////////////////////////////
//System startup functions
function pageInit() {
    var fname = "pageInit";
    //init status object
    statobj = document.LmsCom.status_obj;
    var mode = parent._lmsParser.GetParameter("mode");
    if (mode == null)
        mode = "";
    conceptOnly = parent._lmsParser.GetParameter("conceptonly") != null;
    if (mode.length > 0) {
        // if started from outside (dhtml launch), UI does not need to be displayed
        launchTopic(mode);
    }
    else {
        // normal launch, UI is needed
        initResources();
        pageWidth = InitUIElements();
        var b = getObjectById("thorizontal1");
        _hbordersize = b.clientHeight;
        pageWidth += _hbordersize;

        if (_noBorder) {
            getObjectById("tvertical1").style.display = "none";
            getObjectById("tvertical2").style.display = "none";
            getObjectById("tdownborder").style.display = "none";
        }

        if (lmsMode != "LMS") {
            // display jumpin arrows (hidden by default)
            $(".jumpin").css('display', 'block');
        }

        if (parent.UIComponents.ShowMoreTopics && parent._lmsEnvironment == "DHTML") {
            pageWidth += ShowElement("ShowMoreTopics");
        }
        // navigation buttons
        if (_inToc) {
            if (parent.parent.treeNavigator.isBackEnabled()) {
                $("#navbtn1 a").on("click", prevNavBtnClicked).parents("#navbtn1").on({
                    "mouseover": function () { $(this).find("img").removeClass("previous").addClass("previous_mouseover") },
                    "mouseout": function () { $(this).find("img").removeClass("previous_mouseover").addClass("previous") }
                }).find("img").addClass("previous");
            }
            else
                $("#navbtn1 a img").addClass("previous_disabled");
            if (parent.parent.treeNavigator.isForwardEnabled()) {
                $("#navbtn2 a").on("click", nextNavBtnClicked).parents("#navbtn2").on({
                    "mouseover": function () { $(this).find("img").removeClass("next").addClass("next_mousevoer") },
                    "mouseout": function () { $(this).find("img").removeClass("next_mousevoer").addClass("next") }
                }).find("img").addClass("next");
            }
            else
                $("#navbtn2 a img").addClass("next_disabled");
            pageWidth += $("#navbtn1").outerWidth(true); //getObjectById("navbtn1").offsetWidth;
            pageWidth += $("#navbtn2").outerWidth(true); //getObjectById("navbtn2").offsetWidth;
            pageWidth += $("#navbtn2 + div").outerWidth(true); //getObjectById("navbtn2").offsetWidth;
        }
        else {
            $("#navbtn1, #navbtn2, #navbtn2 + div").hide();
        }
        // share content link
        if (PlayerConfig.EnableShare && parent.UIComponents.ShareLink) {
            var url = "" + this.location;
            var local = url.indexOf("localhost") > -1 || url.indexOf("127.0.0.1") > -1;  // we do not want to share local address
            if (lmsMode != "LMS" && !local) {
                pageWidth += ShowElement("ShareContentDiv");
            }
        }

        //display the concept infoblock for the topic
        var concept = launchPage.concept;
        if (concept != "") {
            if (concept.indexOf("./tpc/") == 0)
                concept = concept.substr(2);
            // if concept is not our webpage or our leadin, it will be hidden if a dialog is displayed
            if (!(concept.length == 57 && concept.indexOf("tpc/") == 0 && concept.lastIndexOf("/Parts/index.html") == 40) &&
				!(concept.length == 52 && concept.indexOf("tpc/") == 0 && concept.lastIndexOf("/leadin.html") == 40))
                hideConcept = true;
            var i = concept.lastIndexOf('/');
            if (concept.substr(i + 1) != "leadin.html" && parent.assetType != "A" && parent.assetType != "Q") {
                // if there are any other icons before the 'open concept' icon, separator before it must be displayed
                if (anyIconBeforeConcept) {
                    pageWidth += ShowElement("sepToConcept1");
                }
                pageWidth += ShowElement("OpenConceptDiv");
                // if there are any other icons after the 'open concept' icon, separator after it must be displayed too
                if (anyIconAfterConcept) {
                    pageWidth += ShowElement("sepToConcept2");
                }
            }
            //fix concept relativ path since lmsui.html moved to html folder while tpc or template are in data|help folder
            concept = FixRelativeConceptPath(concept);
            setTimeout(function () { ShowConcept(concept); }, 1);
        }
        // add class if not touch device
        if (!IsTouchDevice()) {
            $("#playmodetable").addClass("not-touch");
        }
        initUiModes();
        var buttonsWidth = playModeButtonCount * 62; //small button width
        if (buttonsWidth > pageWidth) {
            pageWidth = buttonsWidth;
        }
    }
    if (parent._lmsParser.GetParameter("close") != null)
        parent.close();
    if (conceptOnly) {
        // topic play buttons should be hidden (MLR 31216, 31220)
        getObjectById("playmodetable").style.display = "none";
    }

    // top positions of myTable div and concept div must be set
    SetConceptTop();
}
function getConceptPageWidth() {
    return pageWidth;
}

function FixRelativeConceptPath(concept) {
    if (concept.indexOf("./tpc/") == 0)
        concept = concept.substr(2);
    if (concept.indexOf("tpc/") == 0 || parent.assetType === "A" || parent.assetType === "Q") {
        var datafolder = GetLastFolder(GetDataPath());
        concept = "../" + datafolder + "/" + concept;
    }
    return concept;
}

function SetConceptTop() {
    var mytablediv_top = 0;
    mytablediv_top += $("#header2").height();
    // horizontal bar below header2
    mytablediv_top += _hbordersize;
    // status bar
    if (IsDescStatusBarOpen) {
        mytablediv_top += $("#StatusDesc").height();
    }
    $("#myTableDiv").css("top", mytablediv_top + "px");
    // top position of concept_div inside of myTableDiv
    var concept_top = mytablediv_top;
    if ($("#playmodetable").is(":visible")) {
        concept_top += $("#playmodetable").outerHeight();
    }
    var concept_left = (_noBorder ? 0 : _hbordersize);
    //var concept_width = $("#header2").width() - (2 * concept_left);   // we don't use width
    // set top,left and width coordinates of concept div
    // note that we must also set 'bottom' if there is border at the bottom
    $("#concept_div").css({ top: concept_top + "px", left: concept_left + "px", right: concept_left + "px", bottom: concept_left + "px" });
}

function initResources() {
    // add resource strings to the elements on lmsui.html
    $("#HelpButton img").attr({ "alt": R_toctooltip_help, "title": R_toctooltip_help });
    $("#prefsbutton img").attr({ "alt": R_toctooltip_preferences, "title": R_toctooltip_preferences });
    $("#KPathLogOutButton img").attr({ "alt": R_toctooltip_kpathlogout, "title": R_toctooltip_kpathlogout });
    $("#KPathPortalButton img").attr({ "alt": R_toctooltip_kpathportal, "title": R_toctooltip_kpathportal });
    $("#AskAnExpert img").attr({ "alt": R_toctooltip_askexpert, "title": R_toctooltip_askexpert });
    $("#ProvideFeedback img").attr({ "alt": R_toctooltip_providefeedback, "title": R_toctooltip_providefeedback });
    $("#CreateNoteButton img").attr({ "alt": R_toctooltip_createnote, "title": R_toctooltip_createnote });
    $("#ViewNoteButton img").attr({ "alt": R_toctooltip_viewnote, "title": R_toctooltip_viewnote });
    // #SeeAlsoButton does not have title, is it on purpose?
    $("#SeeAlsoButton img").attr("alt", R_toc_seealso);
    $("#SeeAlsoButton span").html(NoWrap(R_toc_seealso));
    $("#ShowMoreTopics img").attr("alt", R_toctooltip_showmoretopics);
    $("#ShowMoreTopics span").html(NoWrap(R_toctooltip_showmoretopics));
    $("#ShowMoreTopics").attr("title", R_toctooltip_showmoretopics);
    $("#navbtn1").attr({ "alt": R_navigation_prev, "title": R_navigation_prev });
    $("#navbtn2").attr({ "alt": R_navigation_next, "title": R_navigation_next });
    $("#ShareContentDiv img").attr("alt", R_share_content_text_link);
    $("#ShareContentDiv span").html(NoWrap(R_share_content_text_link));
    $("#ShareContentDiv").attr("title", R_share_content_tooltip);
    $("#OpenConceptDiv img").attr({ "alt": R_open_new_window_link, "title": R_open_new_window_link });
    $("#status_label").html(NoWrap(R_attempt_label));
    // buttons
    $("#btn1").attr("title", R_start_seeit);
    $("#btn1 .btntext").html(NoWrap(R_start_seeit));
    $("#btn1 .requiredText").html(NoWrap(R_title_required));
    $("#btn1 .jumpin").attr("title", R_jumpin_link);
    $("#btn2").attr("title", R_start_tryit);
    $("#btn2 .btntext").html(NoWrap(R_start_tryit));
    $("#btn2 .requiredText").html(NoWrap(R_title_required));
    $("#btn2 .jumpin").attr("title", R_jumpin_link);
    $("#btn3").attr("title", R_start_knowit);
    $("#btn3 .btntext").html(NoWrap(R_start_knowit));
    $("#btn3 .requiredText").html(NoWrap(R_title_required));
    $("#btn4").attr("title", R_start_doit);
    $("#btn4 .btntext").html(NoWrap(R_start_doit));
    $("#btn4 .requiredText").html(NoWrap(R_title_required));
    $("#btn4 .jumpin").attr("title", R_jumpin_link);
    $("#btn5").attr("title", R_start_printit);
    $("#btn5 .btntext").html(NoWrap(R_start_printit));
    $("#btn5 .requiredText").html(NoWrap(R_title_required));
    $("#btn6").attr("title", R_start_printit);
    $("#btn6 .btntext").html(NoWrap(R_start_printit));
    $("#btn6 .requiredText").html(NoWrap(R_title_required));
    $("#btn7").attr("title", R_start_printit);
    $("#btn7 .btntext").html(NoWrap(R_start_printit));
    $("#btn7 .requiredText").html(NoWrap(R_title_required));
    var bigscotitle = bigsco_status_stored == null ? R_start_start : bigsco_status_stored;
    $("#btn8").attr("title", bigscotitle);
    $("#btn8 .btntext").html(NoWrap(bigscotitle));
    $("#btn9").attr("title", R_start_testit);
    $("#btn9 .btntext").html(NoWrap(R_start_testit));
    $("#btn9 .requiredText").html(NoWrap(R_title_required));
}

function DisplayStatusField() {
    $("#StatusFieldDiv").css("display", "block");
    statusDisplayed = true;
}
function UpdateStatusField(text) {
    var fname = "UpdateStatusField";
    if (statusDisplayed == false)
        DisplayStatusField();
    $("#status_value").html(text).attr("title", text);
}
function getObjectById(id) {
    return document.getElementById(id);
}
var lastConcept = "";

var rcTimeout = null;

function _RefreshConcept() {
    if (lastConcept != "") {
        this.frames["myconceptframe"].location.replace(lastConcept);
    }
}

function RefreshConcept() {
    try {
        clearTimeout(rcTimeout);
    }
    catch (e) {
    }
    rcTimeout = setTimeout("_RefreshConcept();", 300);
}

function ShowConcept(s) {
    if (s == lastConcept)
        return;
    lastConcept = AbsUrl(s);
    this.frames["myconceptframe"].location.replace(AbsUrl(s));
}

function conceptLoaded() {
    if (_inToc) {
        setTimeout(function () {
            parent.parent.lmsUILoaded();
        }, 50);
    }
}

function PlayButton(name, text, jumpin, asterisk, reqText) {
    this.buttonObj = getObjectById(name);
    this.textObj = $("#" + name + " .btntext").get(0);
    // always enable text before counting its width
    this.textObj.style.width = "auto";
    this.textObj.style.display = "block";
    this.textWidth = this.textObj.clientWidth;
    if (asterisk != null) {
        this.asteriskObj = $("#" + name + " .Asterisk").get(0);
        this.asteriskWidth = this.asteriskObj.clientWidth;
    }
    if (jumpin != null) {
        this.jumpinObj = $("#" + name + " .jumpin").get(0);
        this.jumpinWidth = this.jumpinObj.clientWidth;
    }
    if (reqText != null)
        this.requiredTextObj = $("#" + name + " .requiredText").get(0);
}

function SetButtonTextWidth(obj, width) {
    obj.textWidth = width;
    obj.textObj.style.width = "" + width + "px";
}

function Resize() {
    setTimeout("_Resize()", 1);
}

function Resize0() {
    setTimeout("_Resize()", 0);
}

function InitButtons() {
    buttons = new Array();
    buttons[0] = null;
    buttons[1] = new PlayButton("btn1", "seeittext", "jumpinS", "requiredAsteriskS", "requiredTextS");
    buttons[2] = new PlayButton("btn2", "tryittext", "jumpinT", "requiredAsteriskT", "requiredTextT");
    buttons[3] = new PlayButton("btn3", "knowittext", null, "requiredAsteriskK", "requiredTextK");
    buttons[4] = new PlayButton("btn4", "doittext", "jumpinD", "requiredAsteriskD", "requiredTextD");
    buttons[5] = new PlayButton("btn9", "testittext", null, "requiredAsteriskE", "requiredTextE");
    buttons[6] = new PlayButton("btn5", "printittextPDF", null, "requiredAsteriskPDF", "requiredTextPDF");
    buttons[7] = new PlayButton("btn6", "printittextDOC", null, "requiredAsteriskDOC", "requiredTextDOC");
    buttons[8] = new PlayButton("btn7", "printittextHTML", null, "requiredAsteriskHTML", "requiredTextHTML");
    buttons[9] = new PlayButton("btn8", "BigSCOStartText", null, null, null);
}

function _HResize() {
    if (checkIEDPI() == false)
        return;
    var fname = "_HResize";

    if (conceptOnly)
        return;
    if (_pmTableObj == null)
        _pmTableObj = getObjectById("playmodetable");
    _pmTableObj.style.height = "1px";
    _pmTableObj.style.visibility = "hidden";
    _pmTableObj.style.display = (playModeButtonCount > 0) ? "block" : "none";
    if (playModeButtonCount > 0) {
        if (buttons == null)
            InitButtons();
        var maxTextWidth = 0;
        for (var i = 1; i <= 9; i++) {
            if (showButtons[i] == true) {
                if (maxTextWidth < buttons[i].textWidth)
                    maxTextWidth = buttons[i].textWidth;
            }
        }
        for (var i = 1; i <= 9; i++) {
            if (showButtons[i] == true) {
                SetButtonTextWidth(buttons[i], maxTextWidth);
            }
        }
        var smallButtonWidth = 62;
        var fullButtonWidth = smallButtonWidth + maxTextWidth;
        fullBarWidth = 0; // width of the bar for the full-size play mode buttons
        for (var i = 1; i <= 9; i++) {
            if (showButtons[i] == true) {
                fullBarWidth += fullButtonWidth + 2;
            }
        }
        if (_pmTableObj.clientWidth < fullBarWidth) {
            $(".btntext").css('display', 'none');
        }
        else {
            $(".btntext").css('display', 'block');
        }
        var b_ct = 0;
        var posAsterisk = 45;
        var posJumpin = 50;
        for (var i = 1; i <= 9; i++) {
            if (showButtons[i] == true)	// visible
            {
                buttons[i].buttonObj.style.display = "block";
                if (_pmTableObj.clientWidth < fullBarWidth)	// small size
                {
                    // use "smallSizeButton" class for buttons
                    buttons[i].buttonObj.style.width = "" + smallButtonWidth + "px";  //"70px";
                    buttons[i].buttonObj.style.left = "" + (b_ct * (smallButtonWidth + 2)) + "px"; //"" + (b_ct * 72) + "px";
                    if (buttons[i].asteriskObj != null)
                        buttons[i].asteriskObj.style.left = "" + posAsterisk + "px"; //(i == 3) ? "60px" : "45px";
                    if (buttons[i].jumpinObj != null)
                        buttons[i].jumpinObj.style.left = "" + posJumpin + "px"; //(i == 3) ? "65px" : "50px";
                    if (buttons[i].requiredTextObj != null)
                        buttons[i].requiredTextObj.style.display = "none";
                }
                else	// full size
                {
                    // use "fullSizeButton" class for buttons
                    buttons[i].buttonObj.style.width = "" + fullButtonWidth + "px";  //"105px";
                    buttons[i].buttonObj.style.left = "" + (b_ct * (fullButtonWidth + 2)) + "px";
                    if (buttons[i].asteriskObj != null)
                        buttons[i].asteriskObj.style.left = "" + (maxTextWidth + posAsterisk) + "px"; //(i == 3) ? "95px" : "80px";
                    if (buttons[i].jumpinObj != null)
                        buttons[i].jumpinObj.style.left = "" + (maxTextWidth + posJumpin) + "px";  //(i == 3) ? "100px" : "85px";
                    if (buttons[i].requiredTextObj != null && requiredModes[i]) {
                        buttons[i].requiredTextObj.style.display = "block";
                        // we don't need to set width, the default "auto" is perfect
                        // but this is the correct width, the required text stretches until the jumpin arrow
                        //var wreq = (maxTextWidth + posJumpin) - $(buttons[i].requiredTextObj).position().left;
                        //buttons[i].requiredTextObj.style.width = "" + wreq + "px";
                    }
                }
                b_ct++;
            }
            else	// invisible
            {
                buttons[i].buttonObj.style.display = "none";
            }
        }
    }
    // display the play mode div with buttons at the right positions
    _pmTableObj.style.visibility = (playModeButtonCount > 0) ? "visible" : "hidden";
    _pmTableObj.style.height = "" + _pmTableHeight + "px";
}

function _Resize() {
    if (checkIEDPI() == false)
        return;

    _HResize();
    VResize();
}

function VResize() {
    if (checkIEDPI() == false)
        return;
    var fname = "VResize";
    if (IsDescStatusBarOpen) {
        var statusTextObj = getObjectById("StatusText");
        var textHeight = parseInt(statusTextObj.clientHeight);
        var statusDivObj = getObjectById("StatusDesc");
        statusDivObj.style.height = "" + textHeight + "px";
    }
    SetConceptTop();
}

///////////////////////////////////////
//User interface control functions

function isModeAvailable(s) {
    if (parent.assetType == "T") {
        return statobj.getModeavail(s);
    }
    return false;
}

function initUiModes() {
    //The following code determines which modes shall be displayed base on the available modes for the topic
    var fname = "initUiModes";
    playModeButtonCount = 0;
    // all button is invisible by default
    for (var i = 1; i <= 9; i++) {
        showButtons[i] = false;
        requiredModes[i] = false;
    }
    var displayRequired = allowShowScoStatus;
    if (showLaunchButton) {
        // only the Start/Continue/Take Again button will be displayed
        showButtons[9] = true;
        playModeButtonCount++;
    }
    else {
        if (isModeAvailable("S")) {
            if (displayRequired && statobj.isRequired("S")) {
                $("#btn1 .Asterisk").css('display', 'block');
                getObjectById("btn1").title += " " + R_title_required;
                requiredModes[1] = true;
            }
            showButtons[1] = true;
            playModeButtonCount++;
        }
        if (isModeAvailable("T")) {
            if (displayRequired && statobj.isRequired("T")) {
                $("#btn2 .Asterisk").css('display', 'block');
                getObjectById("btn2").title += " " + R_title_required;
                requiredModes[2] = true;
            }
            showButtons[2] = true;
            playModeButtonCount++;
        }
        if (isModeAvailable("E")) {
            if (displayRequired && statobj.isRequired("E")) {
                $("#btn9 .Asterisk").css('display', 'block');
                getObjectById("btn9").title += " " + R_title_required;
                requiredModes[5] = true;
            }
            showButtons[5] = true;
            playModeButtonCount++;
        }
        if (isModeAvailable("K")) {
            if (displayRequired && statobj.isRequired("K")) {
                $("#btn3 .Asterisk").css('display', 'block');
                getObjectById("btn3").title += " " + R_title_required;
                requiredModes[3] = true;
            }
            showButtons[3] = true;
            playModeButtonCount++;
        }
        if (isModeAvailable("D")) {
            if (displayRequired && statobj.isRequired("D")) {
                $("#btn4 .Asterisk").css('display', 'block');
                getObjectById("btn4").title += " " + R_title_required;
                requiredModes[4] = true;
            }
            showButtons[4] = true;
            playModeButtonCount++;
        }
        if (isModeAvailable("P")) {
            var index = launchPage.printitName.lastIndexOf(".");
            var ext = launchPage.printitName.substr(index + 1);
            var printItRequired = statobj.isRequired("P");
            if (ext == "pdf") {
                $("#btn5 .btnimage9").css('display', 'inline');
                $("#btn6 .btnimage9").css('display', 'none');
                $("#btn7 .btnimage9").css('display', 'none');
                if (displayRequired && printItRequired) {
                    $("#btn5 .Asterisk").css('display', 'block');
                    getObjectById("btn5").title += " " + R_title_required;
                    requiredModes[6] = true;
                }
                showButtons[6] = true;
            }
            else if (ext == "doc" || ext == "docx") {
                $("#btn5 .btnimage9").css('display', 'none');
                $("#btn6 .btnimage9").css('display', 'inline');
                $("#btn7 .btnimage9").css('display', 'none');
                if (displayRequired && printItRequired) {
                    $("#btn6 .Asterisk").css('display', 'block');
                    getObjectById("btn6").title += " " + R_title_required;
                    requiredModes[7] = true;
                }
                showButtons[7] = true;
            }
            else {
                $("#btn5 .btnimage9").css('display', 'none');
                $("#btn6 .btnimage9").css('display', 'none');
                $("#btn7 .btnimage9").css('display', 'inline');
                if (displayRequired && printItRequired) {
                    $("#btn7 .Asterisk").css('display', 'block');
                    getObjectById("btn7").title += " " + R_title_required;
                    requiredModes[8] = true;
                }
                showButtons[8] = true;
            }
            playModeButtonCount++;
        }
    }

    _Resize();
    window.onresize = Resize0;
}

function StartPlay(mode, frame_id, fromjumpin, path) {
    try {
        this.frames["myconceptframe"].Sound_Stop();
    }
    catch (e) { };
    s = "Topic playing will be started from here.\r\nTopic: " + "unknown" + "\r\nPlayMode: " + mode;
    if (frame_id)
        s += "\r\nFrom frame: " + frame_id;
    else
        s += "\r\nFrom beginning of topic";
    var params = "Mode=" + mode;
    if (frame_id) {
        params += "&frame=" + frame_id;
    }
    params += "&SpecMode=Y";
    // context not used if started from jumpin (either from beginning or specific frame)
    if (!fromjumpin || fromjumpin == false) {
        var ctxex = parent.urlParser.GetParameter("ctxex");
        if (ctxex != null)
            params += "&ctxex=" + ctxex;
    }
    if (launchPage.printitName != "" && isModeAvailable("P"))
        params += "&printitname=" + launchPage.printitName;
    var kparam = parent.urlParser.GetParameter("guid");
    if (kparam != null) {
        params += "&guid=" + kparam;
    }
    kparam = parent.urlParser.GetParameter("contextlist");
    if (kparam != null) {
        params += "&contextlist=" + kparam;
    }
    var baseFeatures = "toolbar=0,location=0,statusbar=0,menubar=0";

    if (!path)
        path = "";
    if (path.length > 0)
        path += "/";
    var datafolder = GetLastFolder(GetDataPath());
    path += "../" + datafolder + "/";

    var run = true;
    if ((playerWindow && playerWindow.closed == false) || (doItplayerWindow && doItplayerWindow.closed == false))
        run = false;    // prevent new player
    if (run) {
        if (mode == "D" || mode == "E") {
            var url = path + "tpc/" + topicID + "/";
            if (mode === "E")
                params += "&testit";
            LaunchDoIt(AbsUrl(url), params);
        }
        else if (mode == "P") {
            var index = launchPage.printitName.lastIndexOf(".");
            var ext = launchPage.printitName.substr(index + 1);
            var htmlFile = false;
            if (ext == "html" || ext == "htm") {
                htmlFile = true;
            }
            if (parent._lmsParser.GetParameter("dhtml") == "") {
                if (parent._lmsParser.GetParameter("mode") != null) {
                    // kp.html PrintIt link
                    parent.location.replace(AbsUrl(urlParser.GetCorrectUrl(path + "printit/" + launchPage.printitName)));
                }
                else {
                    // kp.html Topic link -> lmsui.html PrintIt button
                    window.open(AbsUrl(urlParser.GetCorrectUrl("" + path + "printit/" + launchPage.printitName)), "", htmlFile ? "" : baseFeatures + ",scrollbars=0");
                }
            }
            else {
                // lmsui.html PrintIt button
                playerWindow = window.open(urlParser.GetCorrectUrl(path + "printit/" + launchPage.printitName), "", htmlFile ? "" : baseFeatures + ",scrollbars=0");
            }
        }
        else {
            var url = path + "tpc/" + topicID + "/topic.html?" + params;
            url = AbsUrl(url);
            var l = 0;
            var t = 0;
            var sw = screen.availWidth || screen.width;
            var sh = screen.availHeight || screen.height;
            sw = (upk.browserInfo.isExplorer ? sw - 20 : sw);
            sh = (upk.browserInfo.isExplorer ? sh - 40 : sh);
            var w = sw;
            var h = sh;
            if (mode == "S") {
                var c = new Cookie(document, "OnDemandSeeItSizes", 365, "/");
                c.Load();
                if (c.SeeItHeight) {
                    l = Number(c.SeeItLeft);
                    t = Number(c.SeeItTop);
                    w = Number(c.SeeItWidth);
                    h = Number(c.SeeItHeight);
                }
                else {
                    var seeItPlaybackSize = PlayerConfig.SeeItPlayBackSize;
                    switch (seeItPlaybackSize.toLowerCase()) {
                        case "fullsize":
                            w = Math.round(sw);
                            h = Math.round(sh);
                            l = Math.round((sw - w) / 2);
                            t = Math.round((sh - h) / 2);
                            break;
                        case "halfsize":
                            w = Math.round(sw / 2);
                            h = Math.round(sh / 2);
                            l = Math.round((sw - w) / 2);
                            t = Math.round((sh - h) / 2);
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
                            l = Math.round((sw - w) / 2);
                            t = Math.round((sh - h) / 2);
                            break;
                    }
                }
            }
            if (w > sw) {
                w = sw;
                l = 0;
            }
            if (h > sh) {
                h = sh;
                t = 0;
            }
            playerWindow = window.open(urlParser.GetCorrectUrl(url), "", baseFeatures + ",scrollbars=1,resizable=1,left=" + l + ",top=" + t + ",width=" + w + ",height=" + h);
        }
    }
    else {
        alert(R_warning_other_player_instance);
    }
}

function DoItFinished() {
    var fname = "DoItFinished";
    window.focus();
}

var _semaphore = true;

var __mode = null;
var __frame_id = null;
var __fromjumpin = null;
var __path = null;

function launchTopic(mode, frame_id, fromjumpin, path) {

    if (!statobj) {
        if (mode != null) {
            __mode = mode;
            __frame_id = frame_id;
            __fromjumpin = fromjumpin;
            __path = path;
        }
        setTimeout(launchTopic, 100);
        return;
    }
    if (mode == null) {
        mode = __mode;
        frame_id = __frame_id;
        fromjumpin = __fromjumpin;
        path = __path;
    }

    var fname = "launchTopic";
    if (_semaphore == true) {
        lms_LaunchTopic(mode);  // do setup for reporting mode completion
        if (isJumpInDialogOpen) {
            // close jumpin dialog
            if (_inToc)
                parent.parent.closeDialog();
            else
                closeDialog();
            isJumpInDialogOpen = false;
        }
        setTimeout(function () {
            StartPlay(mode, frame_id, fromjumpin, path);
        }, 0);
    }
    _semaphore = true;
}

function OnPrepareDialog(closeEventName) {
    if (hideConcept) {
        // it is called before a dialog is displayed
        // concept should be hidden
        // a blank div is displayed replacing the concept so that the outline retains its size
        var w = $("#concept_div").width();
        var h = $("#concept_div").height();
        var pos = $("#concept_div").position();
        $('<div>', {
            id: 'concept_size',
            css: {
                'position': 'absolute',
                'top': pos.top,
                'left': pos.left,
                'width': w,
                'height': h,
                'background-color': 'white'
            }
        }).appendTo($("#lmsui_body"));
        $("#concept_div").hide();
    }
    // if a close event is set, use it, otherwise use the default event
    var closeEventName1 = (typeof closeEventName === "undefined" || closeEventName == "") ? "OnDialogClosed()" : closeEventName;
    if (_inToc) {
        // set callback that will be called back after dialog closed
        parent.parent.setParent(self);
        parent.parent.setOnCloseEvent(closeEventName1);
    }
    else {
        // set callback that will be called back after dialog closed
        setParent(self);
        setOnCloseEvent(closeEventName1);
    }
}

function OnDialogClosed() {
    if (hideConcept) {
        // it is set to be called when a dialog is closed
        $("#concept_size").remove();
        // concept should be re-displayed
        $("#concept_div").show();
    }
}

function Jumpin1(mode) {
    _semaphore = false;
    Jumpin(mode);
}

function Jumpin(mode) {
    var s = "";
    s += "<div class='textWindows'>";
    s += "<span class='textWindows'>" + R_jumpin_header + "</span>";
    s += "</br></br><ul><li>";
    // indicate this is from jumpin
    s += "<a class='textWindows' href='javascript:parent.launchTopic(\"" + mode + "\",null,true)'>" + R_jumpin_beginning + "</a>";
    s += "</li>";
    var jpA = parent.topicDescriptor.jumpInArray;
    for (var i = 0, il = jpA.length; i < il; i++) {
        // skip frame if it's not visible in this mode
        if (jpA[i].modes.indexOf(mode) == -1)
            continue;
        s += "<li>";
        s += "<a class='textWindows' href='javascript:parent.launchTopic(\"" + mode + "\",\"" + jpA[i].frame_id + "\",true)'>";
        s += jpA[i].label;
        s += "</a>";
        s += "</li>"
    }
    s += "</ul><br>";
    s += "<a class='textWindows' href='javascript:parent.closeDialog()'>" + R_certificate_close + "</a>";
    s += "</div>";
    s += "";

    // align to the appropriate jumpin arrow
    var btn = "";
    switch (mode) {
        case 'S':
            btn = "btn1";
            break;
        case 'T':
            btn = "btn2";
            break;
        case 'D':
            btn = "btn4";
            break;
    }
    var btnobj = $("#" + btn + " .jumpin").get(0);  //getObjectById("jumpin" + mode);
    x = btnobj.offsetLeft;
    y = btnobj.offsetTop;
    p = btnobj.offsetParent;
    while (p != null) {
        x += p.offsetLeft;
        y += p.offsetTop;
        p = p.offsetParent;
    }
    y += 20;
    cv = document.body.clientWidth;
    if (x + 290 > cv) {
        x = cv - 290;
    }

    // set outside div padding
    padding = 5;
    s = setPadding(s, padding, "textWindows");
    contentsize = getContentSize(s);
    var w = contentsize.width + padding * 2;
    if (_inToc) {
        x = parent.parent.getAbsoluteXPosInToc(x);
        y = parent.parent.getAbsoluteYPosInToc(y);
    }

    isJumpInDialogOpen = true;

    OnPrepareDialog();
    if (_inToc)
        parent.parent.showDialog2(s, PxToPt(x, 96), PxToPt(y, 96), 200, -1, false, 96, true);
    else
        showDialog2(s, PxToPt(x, 96), PxToPt(y, 96), 200, -1, false, 96, true);
}

function updateUI(status) {
    // this function updates the UI to properly indicate which modes are complete/incomplete, etc.
    // status banner can also display the offline message
    if (errorDisplayed == false) {
        // show status in kpath lms mode
        if (allowShowScoStatus) {
            UpdateStatusField(GetLocalizedStatus(status));
        }
        // text on the launch button and in tooltip if big sco
        if (showLaunchButton) {
            var localizedStatus = GetLocalizedBigSCOButtonText(status);
            var btnText = $("#btn8 .btntext").get(0);
            var btn = getObjectById("btn8");
            btnText.style.width = "auto";
            var btnw1 = btn.clientWidth;
            var w1 = btnText.clientWidth
            var diff = btnw1 - w1;
            btnText.innerHTML = localizedStatus;
            btn.title = localizedStatus;
            bigsco_status_stored = localizedStatus;
            // if buttons are not displayed yet, we don't set the width
            if (playModeButtonCount == 0)
                return;
            var newTextWidth = parseInt(btnText.clientWidth);
            SetButtonTextWidth(buttons[9], newTextWidth);
            btn.style.width = "" + (newTextWidth + diff) + "px";
        }
    }
}

function updateNoteIcon() {
    var width = 0;
    var notes = lms_IsNotesAvailable();
    if (notes) {
        if (lms_HasNoteAlready() > 0) {
            width = ShowElement("ViewNoteButton");
            getObjectById("CreateNoteButton").style.display = "none";
        }
        else {
            getObjectById("ViewNoteButton").style.display = "none";
            width = ShowElement("CreateNoteButton");
        }
    }
    return width;
}

function launchBigSco() {
    if (bigSCOWindow && bigSCOWindow.closed == false)
        alert(R_warning_other_player_instance);
    else {
        if (typeof (lms_stateDiscarded) != "undefined" && lms_stateDiscarded == true) {
            alert(R_bigsco_changed_text);
            lms_stateDiscarded = false; // trigger only once per attempt
        }
        bigSCOWindow = window.open("../data/toc.html?sco=" + parent.topicDescriptor.bigsco);
        //    parent.location.replace("./toc.html?sco=sco_" + parent.bigScoGuid);
    }
}

function OnQuestionContinue() {
    if (parent.OnQuestionContinue)
        parent.OnQuestionContinue();
}

function NoWrap(s) {
    var ss = "";
    for (var i = 0, il = s.length; i < il; i++) {
        if (s.substr(i, 1) == " ") {
            ss += "&nbsp;";
        }
        else {
            ss += s.substr(i, 1);
        }
    }
    return ss;
}

function ShowHelp() {
    onHelp(GetDataPath());
}

function ShowPrefs() {
    var p = GetBasePath() + "/../html/preferences.html";
    if (lms_IsUserProfileAvailable()) {
        var url = lms_GetUserProfileUrl();
        if (url != "")
            p += "?UserProfileUrl=" + Escape.MyEscape(url);
    }
    OnPrepareDialog();
    var ctx = "preferences";
    if (_inToc) {
        parent.parent.setDlgCtx(ctx);
        parent.parent.showDialog(p, -1, -1, 420, 380, true, 96);
    }
    else {
        setDlgCtx(ctx);
        showDialog(p, -1, -1, 420, 380, true, 96);
    }
}

function prevNavBtnClicked() {
    parent.parent.treeNavigator.GoBack();
}

function nextNavBtnClicked() {
    parent.parent.treeNavigator.GoForward();
}

function showShareContent() {
    var url = GetBasePath() + "/sharecontent.html";
    // get data folder of lmstart.html
    var path = GetDataPath();
    k = path.lastIndexOf('/');
    var folder = "";
    if (k >= 0) {
        folder = path.substr(k + 1);
        path = path.substr(0, k);
    }
    path += "/index.html";
    // todo: url param cannot have an other url param in itself,
    // the path will be completed in the share content dialog
    var p = "type=lmsui";
    p += "&base=" + path;
    p += "&guid=" + topicID;
    var at = parent.assetType;
    p += "&topic=" + ((at == "T") ? "1" : "0");
    if (at == 'A')
        p += "&owner=" + parent._lmsParser.GetParameter("owner");
    p += "&path=" + folder;
    var touchDevice = IsTouchDevice() || upk.browserInfo.isIE10Modern();
    p += "&touch=" + (touchDevice ? "1" : "0");
    // parameter list will be SafeUriEscape-d, therefore it starts with "su=", so that UrlParser unescapes it on the receiver side
    url += "?su=" + Escape.SafeUriEscape(p);
    var dpi = 96;
    var w = PxToPt(650, dpi); // width in pt
    var h = PxToPt(200, dpi); // height in pt
    OnPrepareDialog();
    var ctx = "shareIt";
    if (_inToc) {
        parent.parent.setDlgCtx(ctx);
        parent.parent.showDialog(url, -1, -1, w, h, true, dpi);
    }
    else {
        setDlgCtx(ctx);
        showDialog(url, -1, -1, w, h, true, dpi);
    }
}

function openConcept() {
    //if the link is available and this function is called, the concept does exist, we don't have to check it
    window.open(FixRelativeConceptPath(launchPage.concept));
}

function ReturnToKPathPortal() {
    var s = lms_GetKPathPortalUrl();
    parent.parent.location.replace(s);
}

function ViewNote() {
    var dpi = 96;
    var url = lms_GetNoteUrl(parent.topicID)
    OnPrepareDialog("OnNotesClosed()");
    var ctx = "notes";
    if (_inToc) {
        // set callback that will be called back after dialog closed
        parent.parent.setParent(self);
        parent.parent.setOnCloseEvent("OnNotesClosed()");
        parent.parent.setDlgCtx(ctx);
        parent.parent.showDialog(url, -1, -1, 510, 340, true, dpi);
    }
    else {
        // set callback that will be called back after dialog closed
        setParent(self);
        setOnCloseEvent("OnNotesClosed()");
        setDlgCtx(ctx);
        showDialog(url, -1, -1, 510, 340, true, dpi);
    }
}

function OnNotesClosed() {
    // dialog closed, update icon
    if (lms_HasNoteAlready(true) === -1)	// API was busy
        setTimeout(OnNotesClosed, 1000);
    else {
        updateNoteIcon();
        if (_inToc)
            parent.parent.Toc_onCloseDialog();
    }
    // it will show concept again
    OnDialogClosed();
}

function AskAnExpert() {
    var dpi = 96;
    var url = lms_GetMentoringUrl(parent.topicID)
    OnPrepareDialog();
    var ctx = "expertAdvice";
    if (_inToc) {
        parent.parent.setDlgCtx(ctx);
        parent.parent.showDialog(url, -1, -1, 510, 400, true, dpi);
    }
    else {
        setDlgCtx(ctx);
        showDialog(url, -1, -1, 510, 400, true, dpi);
    }
}

// 2011/09/20, Zsolt
function ProvideFeedback() {
    var dpi = 96;
    var url = lms_GetFeedbackUrl(parent.topicID)
    OnPrepareDialog();
    var ctx = "feedback";
    if (_inToc) {
        parent.parent.setDlgCtx(ctx);
        parent.parent.showDialog(url, -1, -1, 510, 400, true, dpi);
    }
    else {
        setDlgCtx(ctx);
        showDialog(url, -1, -1, 510, 400, true, dpi);
    }
}

function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

function ShowSeeAlso() {
    var s = "", ssize = "";
    var desc = parent.topicDescriptor;
    var ct = 0;
    for (var i in desc.seealsolinks) {
        if (desc.seealsolinks[i].filtered == true)
            continue;
        // Create image path. eg: ./img/topic.gif
        ct++;
        var classname;
        switch (desc.seealsolinks[i].type.toLowerCase()) {
            case "topic":
                classname = "topic";
                break;
            case "section":
            case "outline":

                if (desc.seealsolinks[i].empty == true) {
                    classname = "emptysection";
                }
                else {
                    classname = "module_c";
                }
                break;
            default:
                classname = "";
                break;
        }

        s += "<div><a href='javascript:parent.OpenSeeAlso(\"" + desc.seealsoroot + "\"," + i + ")'>";
        ssize += "<div><a href='javascript:parent.OpenSeeAlso(\"" + desc.seealsoroot + "\"," + i + ")'>";
        s += "<img src='../img/empty.gif' class='" + classname + "' style='vertical-align: text-bottom;' border='0' /></a>";
        ssize += "</a>";

        s += "<a class='tocFrameText' href='javascript:parent.OpenSeeAlso(\"" + desc.seealsoroot + "\"," + i + ")'>";
        ssize += "<a class='tocFrameText' href='javascript:parent.OpenSeeAlso(\"" + desc.seealsoroot + "\"," + i + ")'>";
        s += filterHTML(desc.seealsolinks[i].title) + "</a></div>";
        ssize += filterHTML(desc.seealsolinks[i].title) + "</a></div>";
    }

    // set outside div padding
    padding = 5;
    s = setPadding(s, padding);
    ssize = setPadding(ssize, padding);

    _s = ssize;
    contentsize = getContentSize("<div style='overflow:auto'>" + _s + "</div>");
    if (contentsize.width > 500)
        contentsize = getContentSize("<div style='width:500px;'>" + _s + "</div>");

    var w = contentsize.width + padding + 2;
    var h = 0;
    w += 36;
    // I set the default height, because the valid icon height is 18px of course.
    h = (ct + 1) * 18; //(topic/section/outline height)
    // but if We use ie7 We will set the icon height to 19px 
    // because the ie7 has a totally different sizing methods.
    if (document.documentMode == 7) h = (desc.seealsolinks.length + 1) * 19; ;

    if (_myTableObj == null)
        _myTableObj = getObjectById("myTable");
    var maxHeight = _myTableObj.clientHeight;
    if (h > maxHeight) {
        h = maxHeight;
        if (contentsize.width > 500)
            contentsize = getContentSize("<div style='width:500px;'>" + _s + "</div>");
        else {
            w += getScrollBarWidth();
        }
    }

    // todo: align to the see also button
    var seeAlsoButton = getObjectById("SeeAlsoButton");
    var absolutePos = getAbsolutePosition(seeAlsoButton);
    // try to calculate top-left corner from top-right position
    var x = absolutePos.x;
    var y = absolutePos.y + seeAlsoButton.clientHeight;

    if (_inToc) {
        x = parent.parent.getAbsoluteXPosInToc(x);
        y = parent.parent.getAbsoluteYPosInToc(y);
    }
    x = x - w + seeAlsoButton.offsetWidth;

    OnPrepareDialog();
    // todo: showDialog2() is called with fix sizes but will resize itself
    if (_inToc)
        parent.parent.showDialog2(s, PxToPt(x, 96), PxToPt(y, 96), PxToPt(w, 96), PxToPt(h, 96), false, 96, true);
    else
        showDialog2(s, PxToPt(x, 96), PxToPt(y, 96), PxToPt(w, 96), PxToPt(h, 96), false, 96, true);
}

function UpdateSeeAlso(seeAlso) {
    var w = 0;
    if (seeAlso) {
        w = ShowElement("SeeAlsoContainer");
    }
    else {
        getObjectById("SeeAlsoContainer").style.display = "none";
    }
    return w;
}

function getAbsolutePosition(element) {
    var r = { x: element.offsetLeft, y: element.offsetTop };
    if (element.offsetParent) {
        var tmp = getAbsolutePosition(element.offsetParent);
        r.x += tmp.x;
        r.y += tmp.y;
    }
    return r;
}

function OpenSeeAlso(seeAlsoRoot, index) {
    if (_inToc)
        parent.parent.closeDialog();
    else
        closeDialog();
    var base = GetDataPath();
    var w = window.open(urlParser.GetCorrectUrl(base + "/toc.html?seealso=" + seeAlsoRoot + "&selectitem=" + index), "SeeAlsoTocWnd");
    w.focus();
}

function InitUIElements() {
    var width = 0;
    //	Enable Preferences button
    if (parent.UIComponents.Preferences && PlayerConfig.EnableCookies == true && UserPrefs.EnablePreferences == true) {
        anyIconBeforeConcept = true;
        width += ShowElement("prefsbutton");
    }
    // in tracking mode Log Out icon must be displayed
    if (parent.UIComponents.KPathLogout && lms_IsKPathLogoutAvailable() && lmsMode == "KPT") {
        anyIconAfterConcept = true;
        width += ShowElement("KPathLogOutButton");
    }
    if (parent.UIComponents.KPathPortal && lms_IsKPathPortalAvailable()) {
        anyIconAfterConcept = true;
        width += ShowElement("KPathPortalButton");
    }
    var feedback = parent.UIComponents.ProvideUserFeedback && lms_IsFeedbackAvailable();
    if (feedback == true) {
        width += ShowElement("ProvideFeedback");
    }
    var mentoring = parent.UIComponents.AskAnExpert && lms_IsMentoringAvailable();
    if (mentoring == true) {
        width += ShowElement("AskAnExpert");
    }
    var notes_width = 0;
    if (parent.UIComponents.Notes) {
        notes_width = updateNoteIcon();
        width += notes_width;
    }
    if (notes_width > 0 || mentoring == true || feedback == true) {
        ShowElement("NotesAndMentoring"); // this is just a container div of some buttons above (feedback, expert, notes), no need to add its width
        width += $("#NotesAndMentoring > div:first-child").outerWidth(true); // separator

    }
    width += UpdateSeeAlso(parent.UIComponents.SeeAlso && parent.CheckSeeAlso());
    if (parent.UIComponents.Help) {
        anyIconBeforeConcept = true;
        width += ShowElement("HelpButton");
    }
    LoadStatusBarState();
    return width;
}

function ShowElement(id) {
    var w = $("#" + id).show().outerWidth(true);
    return w;
}

function ShowNewToc(guid) {
    var base = GetDataPath();
    if (parent.topicDescriptor.type == "Question") {
        var w = window.open(urlParser.GetCorrectUrl(base + "/toc.html?sac=" + parent.topicDescriptor.qreference), "SacTocWnd");
    }
    else if (parent.topicDescriptor.type == "Assessment") {
        var topicDescriptor = parent.LoadDescriptor(guid);
        var w = window.open(urlParser.GetCorrectUrl(base + "/toc.html?sac=" + topicDescriptor.qreference), "SacTocWnd");
    }
    w.focus();
}

function GetBasePath() {
    var base = this.location.href;
    var k = base.indexOf('?');
    if (k < 0)
        k = base.indexOf('#');
    if (k >= 0)
        base = base.substr(0, k);
    k = base.lastIndexOf('/');
    return base.substr(0, k);
}

function GetDataPath() {
    var path = parent.location.href;
    // remove url params
    var k = path.indexOf('?');
    if (k < 0)
        k = path.indexOf('#');
    if (k >= 0)
        path = path.substr(0, k);
    // remove 54 chars: /tpc/{guid}/lmstart.html
    return path.substr(0, path.length - 54);
}
function GetLastFolder(s) {
    var i = s.lastIndexOf('/');
    return (i >= 0) ? s.substr(i + 1) : s;
}

function GetLocalizedStatus(s) {
    var localizedStatus = "";
    if (s == LMS_INCOMPLETE)
        localizedStatus = R_status_incomplete;
    else if (s == LMS_COMPLETED)
        localizedStatus = R_status_completed;
    else if (s == LMS_PASSED)
        localizedStatus = R_status_passed;
    else if (s == LMS_FAILED)
        localizedStatus = R_status_failed;
    else if (s === LMS_NOT_ATTEMPTED)
        localizedStatus = R_status_notattempted;
    return localizedStatus;
}
function GetLocalizedBigSCOButtonText(s) {
    var status = R_start_start;
    if (s == LMS_INCOMPLETE)
        status = R_start_continue;
    else if (s == LMS_COMPLETED || s == LMS_PASSED || s == LMS_FAILED)
        status = R_start_takeagain;
    return status;
}
function OnStatusClicked() {
    if (IsDescStatusBarOpen) {
        CloseStatusDescBar();
        return;
    }
    ShowDescStatusBar = true;
    if (errorDisplayed)
        ShowStatusDescBar(true, null); // it will display the last seen error text
    else {
        var inst_text;
        if (parent.assetType == "T")
            inst_text = R_status_inst_topic;
        else if (parent.assetType == "B")
            inst_text = R_status_inst_bigsco;
        else if (parent.assetType == "A")
            inst_text = R_status_inst_assessment;
        else if (parent.assetType == "Q")
            inst_text = R_status_inst_question;
        ShowStatusDescBar(false, inst_text);
    }
}

function ShowMoreTopics() {
    var url = GetDataPath() + (IsTouchDevice() ? "/../ipad.html" : ("/toc.html?treeindex=" + launchPage.treeIndex));
    parent.location.replace(urlParser.GetCorrectUrl(url));
}

function ConnectionLostEvent(errText) {
    errorDisplayed = true;
    UpdateStatusField(R_status_offline);
    var message = R_status_inst_offline + "\n" + R_status_error_prefix + errText;
    if (statusDescFirstDisplayed == true) {
        // for the first time per session even a message box should appear
        var s = "";
        s += "<div class='textWindows'>";
        s += "<a class='textWindows'>" + message + "</a>";
        s += "<br/>";
        s += "<a class='textWindows' href='javascript:parent.closeDialog()'>" + R_certificate_close + "</a>";
        s += "</div>";
        s += "";
        // set outside div padding
        padding = 5;
        s = setPadding(s, padding, "textWindows");

        if (_inToc)
            parent.parent.showDialog2(s, -1, -1, 200, -1, false, 96, true);
        else
            showDialog2(s, -1, -1, 200, -1, false, 96, true);
        statusDescFirstDisplayed = false;
    }
    if (ShowDescStatusBar)
        ShowStatusDescBar(true, message);
}

function ShowStatusDescBar(isError, message) {
    if (IsDescStatusBarOpen) {
        // if already open, close it
        CloseStatusDescBar();
    }
    var statusTextObj = getObjectById("StatusText");
    if (message != null)
        statusTextObj.innerHTML = message;
    statusTextObj.className = "statustext " + (isError ? "statusbar_error statusbar_error_text" : "statusbar statusbar_text");
    var statusDescObj = getObjectById("StatusDesc");
    statusDescObj.style.display = "block";
    IsDescStatusBarOpen = true;
    VResize();
}

function CloseStatusDescBar() {
    if (IsDescStatusBarOpen == false)
        return;
    var statusDescObj = getObjectById("StatusDesc");
    statusDescObj.style.display = "none";
    IsDescStatusBarOpen = false;
    // Once dismissed, it will only show when the status is clicked.
    ShowDescStatusBar = false;
    setTimeout("VResize()", 1);
}

function LoadStatusBarState() {
    var cookie = new Cookie(document, "PlayerStatusBarState", "365", "/");
    cookie.Load();
    ShowDescStatusBar = cookie.PlayerStatusBarOpen;
    // if not yet in cookie, then show status bar
    if (typeof ShowDescStatusBar === "undefined" || ShowDescStatusBar == null)
        ShowDescStatusBar = true;
}

function SaveStatusBarState() {
    var cookie = new Cookie(document, "PlayerStatusBarState", "365", "/");
    cookie.Load();
    cookie.PlayerStatusBarOpen = ShowDescStatusBar;
    cookie.Store();
}

function OnLogOutClicked() {
    lms_KPathLogout();
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
/* lms_lmsui.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// callback functions from topic
var lms_stateDiscarded = false; // saved state discarded (big sco changed)

function lms_LoadAdapterComplete() {
	__Ialert("lms_LoadAdapterComplete() called");

	var lmscom = document.LmsCom;
	//    lmscom.Begin();   // begin already called by lmstart

	var assetType = parent.assetType;
	if ((Kpath_launch || lmscom.bigsco) && assetType === "B")
		assetType = "C";
	if (assetType === "T" || assetType === "B")
		updateUI(lmscom.status_obj.getStatus());

	if (assetType === "B") { // check if toc stat will later be invalidated
		var str = lmscom.lesson_data;
		if (str) {
			var index = str.indexOf("@");

			if (index > 0) {
				var count = parseInt(str.substring(0, index));
				// if aicc lms (moodle) replaced "+" in hash with " ", put "+" back
				lms_stateDiscarded = str.substring(index + 1, index + count + 1).replace(/ /g, "+") !== lmscom.bigScoHash;
			}
			else
				lms_stateDiscarded = true;
		} else
			lms_stateDiscarded = false;
	}

	lms_initialized = true;
	setTimeout(lms_store.callbackfunction, 1);
}

function GetChildLmsCom(child_store) {
	__Ialert("lms_GetChildLmsCom() called");
	var lmscom = document.LmsCom;
	if (child_store.childIndex === -1) {    // see also toc
		var childlmscom = child_store.window.document.LmsCom = new LmsComBase();    // don't set parent for rollup
		childlmscom.owner = child_store.window;
		lmscom.ancillaryChild = childlmscom;    // sort of stepchild
	} else {
		var childlmscom = child_store.window.document.LmsCom = new LmsComBase(lmscom);
		childlmscom.owner = child_store.window;
		lmscom.child = childlmscom;
	}
	if (lmscom.bigScoItemCount && lmscom.status_obj.getStatus() === LMS_NOT_ATTEMPTED) {
		lmscom.status_obj.setStatus(LMS_INCOMPLETE);
		lmscom.SaveStatus();
		lmscom.SendCompletionInfo();
		updateUI(LMS_INCOMPLETE);
	}
}

function ListenChildClose() {
	__alert("lms_ListenChildClose() called");

	var lmscom = document.LmsCom;

	var childlmscom = lmscom.child;
	if (childlmscom) {
		if (lms_store.cguid && lms_store.cguid.charAt(0) == "T") {
			var topicStat = lmscom.status_obj
			var launchStat = childlmscom.status_obj;
			var mode = topicStat.modes[childlmscom.status_obj.mode.id];
			mode.complete = launchStat.mode.complete;
			if (mode.id == "D" || mode.id == "E") {   // handle see it, try it, and print it from do it/test it
				topicStat.modes["S"].complete = launchStat.modes["S"].complete;
				topicStat.modes["T"].complete = launchStat.modes["T"].complete;
				topicStat.modes["P"].complete = launchStat.modes["P"].complete;
			}
			if (mode.id == "K" && launchStat.requiredMode === "K") {  // passed/failed is only copied to the topic status if this is the required mode
				topicStat.score = launchStat.score;
				topicStat.passed = launchStat.passed;
			}
			else if (mode.id == "E") {  // passed/failed is only copied to the topic status if this is the required mode (if testit is available, it is the required mode)
				topicStat.passed = launchStat.passed;
			}
			lmscom.SaveStatus();
		} else {
			lmscom.lesson_data = childlmscom.lesson_data;
			lmscom.status_obj.setStatus(childlmscom.lesson_status);
			lmscom.SaveStatus();    // roll up to LMS immediately to change indicator
			lmscom.score = childlmscom.score;
			lmscom.lesson_location = childlmscom.lesson_location;
		}
	}
	// since we will never change TO not attempted, this would only happen in the case of an asset
	// that was visited but not launched and we don't want to flash "Not Attempted" even temporarily
	if (lmscom.lesson_status !== LMS_NOT_ATTEMPTED)
		updateUI(lmscom.lesson_status);
	// roll up status info in order to update LMS indicators, if applicable
	lmscom.SendCompletionInfo();

	// if we're in a big sco, call the parent to update the toc
	lmscom.NotifyParent();
}

// called when a mode is selected to launch the topic in order to set up the
// child lmscom object
function lms_LaunchTopic(mode) {
	__alert("lms_LaunchTopic(" + mode + ") called");

	var lmscom = document.LmsCom;
	lmscom.status_obj.anylaunched = true;
	if (lmscom.lesson_status === LMS_NOT_ATTEMPTED && lmscom.status_obj.isComplete()) {    // new attempt with kpath-persisted data
		lmscom.status_obj.clearTopicstat();    // clear out old state
		updateUI(LMS_INCOMPLETE);
		// roll up status info in order to update LMS indicators, if applicable
		lmscom.SendCompletionInfo();
	}

	if (mode == "P") {
		lmscom.utGetModeIndex();
		lmscom.utRecordType("print_it");
		lmscom.utRecordStartTime(new Date());
		lmscom.utRecordEndTime(new Date());
		lmscom.utRecordCompletionStatus(LMS_COMPLETED);
		lmscom.status_obj.setModestatus("P", true);
		lmscom.SaveStatus();
		updateUI(lmscom.lesson_status);
		lmscom.SendCompletionInfo();
		// if we're in a big sco, call the parent to update the toc
		lmscom.NotifyParent();
		return;
	}
}

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

function lms_KPathLogout() {
	_logout(false);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// NOTES AND MENTORING SUPPORT

// lms_IsMentoringAvailable
function lms_IsMentoringAvailable() {
	__alert("lms_IsMentoringAvailable() called");
	if (CheckKPTMode() == false)
		return false;
	return document.LmsCom.doGetUPKValue("upk.mentoring_available") && document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

// lms_GetMentoringUrl
function lms_GetMentoringUrl() {
	__alert("lms_GetMentoringUrl() called");
	return Kpath_base_URL + "/Mentoring/NewMentQuest.aspx?Path=" +
        lms_store.parentW.location.href.split("?")[0] + "&GUID=" + lms_store.cguid + "&FeedbackType=1";
}

// lms_IsFeedbackAvailable
// 2011/09/20, Zsolt 
function lms_IsFeedbackAvailable() {
	__alert("lms_IsFeedbackAvailable() called");
	if (CheckKPTMode() == false)
		return false;
	return document.LmsCom.doGetUPKValue("upk.feedback_available") && document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

// lms_GetFeedbackUrl
// 2011/09/20, Zsolt 
function lms_GetFeedbackUrl() {
	__alert("lms_GetFeedbackUrl() called");
	return Kpath_base_URL + "/Mentoring/NewMentQuest.aspx?Path=" +
        lms_store.parentW.location.href.split("?")[0] + "&GUID=" + lms_store.cguid + "&FeedbackType=2";
}

function lms_IsNotesAvailable() {
	__alert("lms_IsNotesAvailable() called");
	if (CheckKPTMode() == false)
		return false;
	return document.LmsCom.doGetUPKValue("upk.notes_available") && document.LmsCom.doGetUPKValue("upk.anonymous") == "0";
}

// lms_HasNoteAlready
// if update, update from server, returns -1 if API busy with async commit
function lms_HasNoteAlready(update) {
	__alert("lms_HasNoteAlready(" + update + ") called");
	if (!update)
		return document.LmsCom.doGetUPKValue("upk.has_note");
	else
		return document.LmsCom.doGetUPKValue("upk.update_has_note");
}

// lms_GetNoteUrl
function lms_GetNoteUrl() {
	__alert("lms_GetNoteUrl() called");
	return Kpath_base_URL + "/Notebook/Notes.aspx?Path=" +
        lms_store.parentW.location.href.split("?")[0] + "&GUID=" + lms_store.cguid;
}

//----------------------------------------------------------------------------------------------/

var _lms_module_name = "lms_lmsui.js";
var _lms_show_alert = false;
var _lms_show_Ialert = false;
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
