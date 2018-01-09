
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

/* loader.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var loader_dontclose = false;

function EscEvent() {
    if (loader_dontclose == false)
        top.close();
};

document.onstop = EscEvent

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

/* splash.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

function SplashWindow() {
    //	var x=window.screen.availWidth;
    //	var y=window.screen.availHeight;

    var x = document.documentElement.offsetWidth;
    var y = document.documentElement.offsetHeight;

    document.open();

    document.writeln("<script>var splash_hidden=false;");
    document.writeln("function ShowSplash()");
    document.writeln("{if (splash_hidden==false)");
    document.writeln("document.getElementById('splash').style.display='block';}");
    document.writeln("function HideSplash()");
    document.writeln("{splash_hidden=true; document.getElementById('splash').style.display='none';}");
    document.writeln("</script>");

    document.writeln("<DIV id='splash' style='display:none;position:absolute;left:0;top:" + (y / 2 - 50) + ";width:" + x + ";height:200'>");
    document.writeln("<p align='center'><font color='#FF0000' face='Arial' style='font-size:11pt'>");
    document.writeln(R_splashtext);
    document.writeln("</font></p>");
    document.writeln("</DIV>");
    document.writeln("<script>setTimeout('ShowSplash()',2000);</script>");
    document.close();
};

SplashWindow();





/* binterface.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

//file version 2.82

function getElementsByAttribute(attribute, attributeValue) {
    var elementArray = new Array();
    var matchedArray = new Array();

    if (attribute == "id" && document.all && !upk.browserInfo.isFF3()) {
        var oObject = document.all.item(attributeValue);
        if (oObject != null) {
            if (oObject.length != null) {
                for (i = 0; i < oObject.length; i++) {
                    matchedArray[matchedArray.length] = oObject(i);
                }
            } else {
                matchedArray[matchedArray.length] = oObject;
            }
        }
        return matchedArray;
    }

    if (document.all && !upk.browserInfo.isFF3()) {
        elementArray = document.all;
    }
    else {
        elementArray = document.getElementsByTagName("*");
    }

    for (var i = 0; i < elementArray.length; i++) {
        if (attribute == "class") {
            var pattern = new RegExp("(^| )" +
         attributeValue + "( |$)");

            if (pattern.test(elementArray[i].className)) {
                matchedArray[matchedArray.length] = elementArray[i];
            }
        }
        else if (attribute == "for") {
            if (elementArray[i].getAttribute("htmlFor") ||
         elementArray[i].getAttribute("for")) {
                if (elementArray[i].htmlFor == attributeValue) {
                    matchedArray[matchedArray.length] = elementArray[i];
                }
            }
        }
        else if (elementArray[i].getAttribute(attribute) ==
       attributeValue) {
            matchedArray[matchedArray.length] = elementArray[i];
        }
    }

    return matchedArray;
}

function getElementOfObject(attributeValue, objectId) {
    var cNode = '';
    var elements = getElementsByAttribute('id', attributeValue);
    for (var i in elements) {
        cNode = elements[i];
        while (cNode.parentNode != null) {
            if (cNode.parentNode == objectId) { return elements[i]; }
            cNode = cNode.parentNode;
        }
    }
    return false;
}

//////////////////////////////////////////////////////////////////

var objIcon02Img;
var objYesImg0;
var objNoImg0;
var objDoneTypingImg0;
var objYesImg1;
var objNoImg1;
var objDoneTypingImg1;
var spanE;
var spanEYes;
var spanENo;

var mobjBubble = 0;
var mobjContent = 0;
var mobjPointer = 0;
var mblnShowPointer = false;

var mAct;

// outer bubble padding from content
var topPadding = 38;
var leftPadding = 14;
var rightPadding = 14;
var bottomPadding = 3;

var m_Pointed;
var m_PointerXpos = 0;
var m_PointerYpos = 0;
var m_PointerDirection = BUBB07_NOPOINTER;
var m_bWidth = 0;
var m_bHeight = 0;

//	<xsl:variable name="BUBBLE_DIR_TOP_LEFT" select="3" />
//	<xsl:variable name="BUBBLE_DIR_TOP_RIGHT" select="4" />
//	<xsl:variable name="BUBBLE_DIR_BOTTOM_LEFT" select="1" />
//	<xsl:variable name="BUBBLE_DIR_BOTTOM_RIGHT" select="2" />
//	<xsl:variable name="BUBBLE_DIR_LEFT_TOP" select="7" />
//	<xsl:variable name="BUBBLE_DIR_RIGHT_TOP" select="8" />
//	<xsl:variable name="BUBBLE_DIR_LEFT_BOTTOM" select="5" />
//	<xsl:variable name="BUBBLE_DIR_RIGHT_BOTTOM" select="6" />
//	<xsl:variable name="BUBBLE_DIR_NONE" select="0" />


var BUBB07_NULL = 0;
var BUBB07_NOPOINTER = 0;

var BUBB07_TOPLEFT = 3; 	// 1
var BUBB07_TOPRIGHT = 4; 	// 2
var BUBB07_BOTTOMLEFT = 1; 	// 3
var BUBB07_BOTTOMRIGHT = 2; 	// 4
var BUBB07_LEFTTOP = 7;
var BUBB07_RIGHTTOP = 8; 	// 2
var BUBB07_LEFTBOTTOM = 5;
var BUBB07_RIGHTBOTTOM = 6;

var BUBB07_DEFAULTWIDTH = 200 - leftPadding - rightPadding;

// +++ defines
var BUBB07_LEFTAREA = 37;
var m_BubblePath = "../../../img/";
var ash = false;
var abubbv02_bubbcolor = 0;
var tID = 0;
var setpos = true;

//var img1on,img1off,
var img2on, img2off;

var imagesArr = new Array();
var imagesXref = new Array();

function cached_image(color) {
    var bubbc;
    bubbc = convert(String(color), 10, 16);
    while (bubbc.length < 6) bubbc = "0" + bubbc;

    bubbc = bubbc.toLowerCase();
    //alert("cached_image - " + bubbc)

    var m_BubbleImgs;
    m_BubbleImgs =
		[m_BubblePath + 'giftrk1.gif', //0
			m_BubblePath + 'b' + bubbc + '_03.png',
			m_BubblePath + 'b' + bubbc + '_03over.png',
			m_BubblePath + 'b' + bubbc + '_01.png',
			m_BubblePath + 'b' + bubbc + '_02.png',
			m_BubblePath + 'b' + bubbc + '_04.png', 	//10
			m_BubblePath + 'b' + bubbc + '_06.png',
			m_BubblePath + 'b' + bubbc + '_07.png',
			m_BubblePath + 'b' + bubbc + '_08.png',
			m_BubblePath + 'b' + bubbc + '_09.png',
			m_BubblePath + 'b' + bubbc + '_anch_tl.png', // upper left
			m_BubblePath + 'b' + bubbc + '_anch_tr.png', // upper right
			m_BubblePath + 'b' + bubbc + '_anch_lthigh.png', // left high
			m_BubblePath + 'b' + bubbc + '_anch_ltlow.png', // left low
			m_BubblePath + 'b' + bubbc + '_anch_rthigh.png', // right high
			m_BubblePath + 'b' + bubbc + '_anch_rtlow.png', // right low
			m_BubblePath + 'b' + bubbc + '_anch_bl.png', // bottom left
			m_BubblePath + 'b' + bubbc + '_anch_br.png',
			m_BubblePath + 'b' + bubbc + '_03disab.png', // bottom right
			m_BubblePath + 'b' + bubbc + '_03empty.png'] // no bottom

    this.imageNames = m_BubbleImgs;
    this.color = color;

    var imgon = document.createElement("img");
    imgon.width = 23;
    imgon.height = 21;
    imgon.src = m_BubbleImgs[2];

    var imgoff = document.createElement("img");
    imgoff.width = 23;
    imgoff.height = 21;
    imgoff.src = m_BubbleImgs[1];

    this.imgon = imgon;
    this.imgoff = imgoff;

}


function cached_images(bubcolor) {
    abubbv02_bubbcolor = bubcolor;
    if (!imagesArr["c_" + bubcolor]) {
        imagesArr["c_" + bubcolor] = new cached_image(bubcolor);
        imagesXref[imagesXref.length] = "c_" + bubcolor;
    }
}

function load_buttons() {
    if (document.images) {
        img2on = imagesArr["c_" + abubbv02_bubbcolor].imgon;
        img2off = imagesArr["c_" + abubbv02_bubbcolor].imgoff;
    }
}

function GetScrName(fileName) {
    var k = fileName.lastIndexOf('/');
    var s = fileName.substr(k + 1);
    return "../../img/" + s;
}

function BubbleimgOn(imgName, img2) {

    if (img2) {
        //mobjBubble.all[imgName].style.display = "none"
        //mobjBubble.all[img2].style.display = "block"
        var cimg = getElementOfObject(imgName, mobjBubble);
        cimg.style.display = "none";
        var cimg2 = getElementOfObject(img2, mobjBubble);
        cimg2.style.display = "block";
    }
    else {
        var blnInBox = false;
        // on highlight if in box otherwise do not highlight
        if (document.images) {
            if ((event.offsetX >= 3 && event.offsetX <= 26) && (event.offsetY >= 7 && event.offsetX <= 27)) {
                mobjBubble.all[imgName].src = GetScrName(eval(imgName + "on.src"));
            }
            else {
                mobjBubble.all[imgName].src = GetScrName(eval(imgName + "off.src"));
            }
        }
    }
}

function BubbleimgOff(imgName, img2) {
    if (img2) {
        //mobjBubble.all[imgName].style.display = "block"
        //mobjBubble.all[img2].style.display = "none"
        var cimg = getElementOfObject(imgName, mobjBubble);
        cimg.style.display = "block";
        var cimg2 = getElementOfObject(img2, mobjBubble);
        cimg2.style.display = "none";
    }
    else {
        if (document.images)
            mobjBubble.all[imgName].src = GetScrName(eval(imgName + "off.src"));
    }
}

function BubbleClose() {
    /*	if ((event.offsetX >= 3 && event.offsetX <= 26) && (event.offsetY >= 7 && event.offsetX <= 27)) {*/
    OnClose();
    /*}*/
}

function InAnchor(event) {

    var inAnchor = false;
    var xCoord = event.offsetX;
    var yCoord = event.offsetY;
    switch (abubbv02_Pointer) {
        case BUBB07_TOPLEFT:
            if ((xCoord >= 3) && (yCoord <= 38)) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (38 - 1) / (18 - 4);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (18 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos > 38) {
                    inAnchor = true;
                }
            }
            break;
        case BUBB07_TOPRIGHT:
            if ((xCoord <= 15) && (yCoord <= 38)) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (1 - 35) / (13 - 1);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (13 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos > 1) {
                    inAnchor = true;
                }
                //alert(inAnchor);
            }
            break;
        case BUBB07_BOTTOMLEFT:
            if (xCoord >= 3) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (41 - 5) / (5 - 17);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (5 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos < 41) {
                    inAnchor = true;
                }
                //alert(inAnchor);
            }
            break;
        case BUBB07_BOTTOMRIGHT:
            if (xCoord <= 15) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (41 - 4) / (14 - 1);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (14 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos < 41) {
                    inAnchor = true;
                }
                //alert(inAnchor);
            }
            break;
        case BUBB07_LEFTTOP:
            if (yCoord >= 3) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (15 - 3) / (38 - 1);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (38 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos < 15) {
                    inAnchor = true;
                }
            }
            break;
        case BUBB07_LEFTBOTTOM:
            if (yCoord <= 15) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (3 - 15) / (38 - 1);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (38 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos > 3) {
                    inAnchor = true;
                }
            }
            break;
        case BUBB07_RIGHTTOP:
            if (yCoord >= 3) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (15 - 3) / (1 - 38);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (1 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos < 15) {
                    inAnchor = true;
                }
            }
            break;
        case BUBB07_RIGHTBOTTOM:
            if (yCoord >= 3) {
                // in triangle range

                //slop = (y2 - y1) / (x2 - x1)
                var Slope = (3 - 15) / (1 - 38);

                // CoordPos = y1 = slope * (x2 - x1) - y2
                var CoordPos = (Slope * (1 - xCoord)) + yCoord;

                // if CoordPos < y1
                if (CoordPos > 3) {
                    inAnchor = true;
                }
            }
            break;

    }
    return inAnchor;
}

function AnchorMouseDown() {
    // this function is to determine if the mousedown event was in the pointer. If not pass event
    // through

    if (!InAnchor(event)) {
        EventMouseDown(event);
    }
}

function AnchorMouseUp() {
    // this function is to determine if the mousedown event was in the pointer. If not pass event
    // through
    if (!InAnchor(event)) {
        EventMouseUp(event);
    }
}


function convert(input, origin, dest) {
	var base, c, Result, t, n, b, a, e, d, Ciffer;
    base = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    c = 0; Result = "";
    for (t = 1; t <= input.length; t++) {
        b = base.indexOf(input.substring(t - 1, t));
        n = b * (Math.pow(origin, input.length - t));
        c += n;
    }
    a = 100;
    while (c < Math.pow(dest, a)) { a--; }

    while (a > -1) {
        e = Math.pow(dest, a);
        a--;
        d = ((c - (c % e)) / e) + 1;
        c = c % e; Ciffer = base.substring(d - 1, d); Result = Result + Ciffer;
    }
    return Result;
}


//<!--hide from old browsers

N = (document.all && !upk.browserInfo.isFF3()) ? 0 : 1;
var ob = false;
var xi, yi, X, Y;
var global_moveable = true;


// +++ mouse down event
function bubb07_global_MD(e) {
    if (OnBubbleClicked)
        OnBubbleClicked();
    if (!global_moveable) return;
    if (N) {
        ob = e.target;

        if (e.target.id == "blink" || e.target.id == "m_Caption" || e.target.id == "m_StaticCaption") {
            if (e.target.id == "blink" || e.target.id == "m_StaticCaption") {
                xi = document.getElementById("bubb_cap").offsetWidth;
            }
            else {
                xi = 0
            }

            ob = true;

            X = e.pageX - getObjLeft(mobjBubble);
            Y = e.pageY - getObjTop(mobjBubble);
        };

        return false;
    }
    else {
        if (event.srcElement.id == "blink" || event.srcElement.id == "m_Caption" || event.srcElement.id == "m_StaticCaption") {
            if (event.srcElement.id == "blink" || event.srcElement.id == "m_StaticCaption") {
                xi = mobjBubble.all.bubb_cap.clientWidth;
            }
            else {
                xi = 0;
            }
            ob = true;

            X = window.event.clientX - getObjLeft(mobjBubble);
            Y = window.event.clientY - getObjTop(mobjBubble);
        }
    }
}


// +++ mouse move event
function bubb07_global_MM(e) {
    if (ob) {
        if (IsTouchDevice()) {
            if (ob == true) {
                leftarea = 0;
                rightarea = 0;

                var xMovement = e.clientX - X;
                var yMovement = e.clientY - Y;

                var xp = getObjLeft(mobjBubble) + xMovement;
                var yp = getObjTop(mobjBubble) + yMovement;

                X = e.clientX;
                Y = e.clientY;

                mobjBubble.style.left = xp + "px";
                mobjBubble.style.top = yp + "px";

                mobjContent.style.left = Number(xp + leftPadding) + "px";
                mobjContent.style.top = Number(yp + topPadding) + "px";
            }
        }
        else if (N) {
            if (ob == true) {
                leftarea = 0;
                rightarea = 0;

                var xMovement = e.pageX - X	//-14-xi + document.body.scrollLeft-leftarea;
                var yMovement = e.pageY - Y	// + document.body.scrollTop-rightarea;

                mobjBubble.style.left = xMovement + "px";
                mobjBubble.style.top = yMovement + "px";

                mobjContent.style.left = Number(xMovement + leftPadding) + "px";
                mobjContent.style.top = Number(yMovement + topPadding) + "px";

                document.getElementById('blink').focus();
                return false;
            }
        }
        else {
            if (ob == true) {
                leftarea = 0;
                rightarea = 0;

                var xMovement = event.clientX - X //- 14 - xi + document.body.scrollLeft - leftarea;
                var yMovement = event.clientY - Y //+ document.body.scrollTop - rightarea;

                mobjBubble.style.left = xMovement + "px";
                mobjBubble.style.top = yMovement + "px";

                mobjContent.style.left = Number(xMovement + leftPadding) + "px";
                mobjContent.style.top = Number(yMovement + topPadding) + "px";
            }
            return false;
        }
    }
}


// +++ mouse up event
function bubb07_global_MU() {
    if (ob) OnBubbleMoved();
    ob = false;
}

if (N) {
    document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
}

if (!IsTouchDevice()) {
    if (document.attachEvent) {
        document.attachEvent("onmousedown", bubb07_global_MD);
        document.attachEvent("onmousemove", bubb07_global_MM);
        document.attachEvent("onmouseup", bubb07_global_MU);
    }
    else {
        document.addEventListener("mousedown", bubb07_global_MD, true);
        document.addEventListener("mousemove", bubb07_global_MM, true);
        document.addEventListener("mouseup", bubb07_global_MU, true);
    }
}

function JSRect(left, top, right, bottom) {
    this.m_Left = left;
    this.m_Top = top;
    this.m_Right = right;
    this.m_Bottom = bottom;
}

///////////////////////////////////
//  +++ class JSBubbleInterface  //
///////////////////////////////////
function JSBubbleInterface(name) {
    abubbv02_bVisible = false;
    abubbv02_show = true;
    abubbv02_Text = "";
    abubbv02_CaptionText = "";
    abubbv02_ActionText = "";
    abubbv02_IconName = '';
    abubbv02_Pointer = BUBB07_NULL;
    abubbv02_infos = "";
    abubbv02_enableclose = 1;
    m_Pointed = true;
    //abubbv02_bubbcolor=0;
    _ax = 0;
    _ay = 0;

    // +++ bubble position
    m_rect = new JSRect(-1, -1, -1, -1);

    //alert(name);
    // +++ knowit bubble position
    this.m_knrect = new JSRect(-1, -1, -1, -1)

    //if(document.all) this.m_Object=document.all[this.m_BubbleID];
    this.m_bFFClearHeight = false;
    this.m_Name = name;
    this.m_Text = "";
    this.m_Caption = "";
    this.lastbubbstyle = "";
    this.m_ShowAction = false;
    this.EnabledAction = false;
    this.m_bMoveDefPos = false;
    this.savedPos = null;
};

///////////////////////////////////////////////
JSBubbleInterface.prototype.SetMode = function (text) {
    //alert(text);
    abubbv02_CaptionText = text;
}


JSBubbleInterface.prototype.ShowMode = function () {
    if (abubbv02_show == true) {
        if (document.all && !upk.browserInfo.isFF3()) {
            mobjBubble.all.m_Caption.innerText = abubbv02_CaptionText;
        } else {
            var mCap = getElementsByAttribute('id', 'm_Caption');
            for (var i in mCap) {
                mCap[i].textContent = abubbv02_CaptionText;
            };
        };
    }
}

JSBubbleInterface.prototype.StartBlink = function (color) {
    BlinkTxt();
}

JSBubbleInterface.prototype.EndBlink = function (color) {
    clearTimeout(tID);
    var prdiv = document.getElementById("prdiv"); // instead of mobjContent.all (works only in IE)
    prdiv.style.color = "blue"
}

JSBubbleInterface.prototype.SetColor = function (color) {

    abubbv02_bubbcolor = color;
}

function BlinkTxt() {

    if (mobjContent) {
        var prdiv = getElementOfObject("prdiv", mobjContent); // instead of mobjContent.all (works only in IE)
        if (prdiv) {
            if (prdiv.style.color == "#ccffff" || prdiv.style.color == "rgb(204, 255, 255)" || prdiv.style.color == "#7dc1db" || prdiv.style.color == "rgb(125, 193, 219)")
                prdiv.style.color = "#003366"
            else
                prdiv.style.color = grayBubbles ? "#7dc1db" : "#ccffff";
        }
    }
    tID = setTimeout('BlinkTxt()', 750);
}

JSBubbleInterface.prototype.SetEnableCloseButton = function (bValue) {

    //    if (abubbv02_enableclose != bValue)
    if (abubbv02_show == true) {
        var closebtn = document.getElementById("closebtn_" + abubbv02_bubbcolor); // instead of mobjBubble.all["closebtn"] (works only in IE)
        str = "";
        if (bValue == 1) {
            str = "<div id='closebtn_" + abubbv02_bubbcolor + "' style='position:relative'><div><img id='img2' name='img2' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[1] + "' style='display:block' width='32' height='27' border='0'><img id='img2o' name='img2o' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[2] + "' style='display:none' width='32' height='27' border='0'></div><div style='position:absolute; left:3px; top:7px'><a href='#' onclick='BubbleClose();return false'"
				+ (IsTouchDevice() ? "" : " onMouseMove='BubbleimgOn(\"img2\",\"img2o\")' onMouseOut='BubbleimgOff(\"img2\",\"img2o\")'")
				+ "><img alt='" + R_bubble_closeondemand + "' id='imghandler' name='imghandler' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[0] + "' style='display:block' width='23' height='20' border='0'></a></div></div></td>";
            //closebtn.detachEvent("onmousemove",BubbleimgOn2);
            //closebtn.detachEvent("onmouseout",BubbleimgOff2);
            //closebtn.attachEvent("onmousemove",BubbleimgOn2);
            //closebtn.attachEvent("onmouseout",BubbleimgOff2);
            //closebtn.href="javascript:OnClose()";
            //closebtn.all["img2"].src=imagesArr["c_" + abubbv02_bubbcolor].imageNames[2];
            //closebtn.detachEvent("onclick",BubbleClose);
            //closebtn.attachEvent("onclick",BubbleClose);
        }
        else if (bValue == 0) {
            str = '<a id="closebtn_' + abubbv02_bubbcolor + '" onclick=""><img name="img2" src="' + imagesArr["c_" + abubbv02_bubbcolor].imageNames[18] + '" width="32" height="27" border="0" alt="' + R_bubble_closeondemand + '"></td>';
        }
        else {      // bValue == 2 -> nem kell gomb: bxxxxxx_03empty.gif
            str = '<a id="closebtn_' + abubbv02_bubbcolor + '" onclick=""><img name="img2" src="' + imagesArr["c_" + abubbv02_bubbcolor].imageNames[19] + '" width="32" height="27" border="0" alt=""></td>';
        }

        if (document.all && !upk.browserInfo.isFF3()) {
            closebtn.outerHTML = str;
        } else {
            var r = closebtn.ownerDocument.createRange();
            r.setStartBefore(closebtn);
            var df = r.createContextualFragment(str);
            closebtn.parentNode.replaceChild(df, closebtn);
        }
    }
    abubbv02_enableclose = bValue;
}

JSBubbleInterface.prototype.GetActionLink = function () {
    return getElementOfObject('m_ActionText', mobjBubble);
}

JSBubbleInterface.prototype.SetPRText = function (text) {
    if (mobjContent) {
        var cElem = document.getElementById('prdiv');
        if (cElem != null) //if(mobjContent.all["prdiv"])
        {
            if (document.all && !upk.browserInfo.isFF3()) {
                cElem.innerText = text; //mobjContent.all["prdiv"].innerText=text;
            } else {
                cElem.textContent = text;
            }
        }
    }
}

var noactionstitle = false;
JSBubbleInterface.prototype.SetActionText = function (text, notitle) {
    //alert(text);
    abubbv02_ActionText = text;
    //this.ShowActionText();
    noactionstitle = notitle;
    this.ShowActionText();
}

JSBubbleInterface.prototype.ShowActionText = function () {
    //alert("huha");
    if (mobjBubble)
        if (abubbv02_show == true) {
            if (document.all && !upk.browserInfo.isFF3()) {
                if (!noactionstitle) mobjBubble.all.m_ActionText.title = R_interface_action_alt;
                mobjBubble.all.m_ActionText.innerText = abubbv02_ActionText;
            } else {
                mAct = getElementOfObject('m_ActionText', mobjBubble);
                if (!noactionstitle) mAct.title = R_interface_action_alt;
                mAct.textContent = abubbv02_ActionText;
            }
        }
}

JSBubbleInterface.prototype.Show = function () {
    this.ShowActionText();
    abubbv02_bVisible = true;
    if (mobjBubble) {
        mobjBubble.style.visibility = "visible";
        mobjBubble.style.zIndex = 2;
        mobjBubble.style.left = Math.abs(getObjLeft(mobjBubble)) + "px";
        mobjContent.style.visibility = "visible";
        mobjContent.style.zIndex = 3;
        if (mblnShowPointer) {
            mobjPointer.style.visibility = "visible";
            mobjPointer.style.zIndex = 4;
        }
        mAct = getElementOfObject('m_ActionText', mobjBubble);
        mAct.style.visibility = "visible";
    }
}

JSBubbleInterface.prototype.Hide = function () {
    if (mobjBubble) {
        abubbv02_bVisible = false;

        //		_ax=mobjContent.style.pixelLeft;
        //		_ay=mobjContent.style.pixelTop;

        _ax = getObjLeft(mobjContent);
        _ay = getObjTop(mobjContent);

        //here what is this for??
        mobjBubble.style.visibility = "hidden";
        mobjBubble.style.left = "-" + Math.abs(getObjLeft(mobjBubble)) + "px";
        mobjContent.style.visibility = "hidden";
        if (mblnShowPointer)
            mobjPointer.style.visibility = "hidden";
        mAct = getElementOfObject('m_ActionText', mobjBubble);
        mAct.style.visibility = "hidden";
    }
}

JSBubbleInterface.prototype.IsVisible = function () {
    if (mobjBubble)
        return abubbv02_bVisible;
    return false;
}

JSBubbleInterface.prototype.SetErrorMessage = function (text) {
    //alert(text);
    this.m_bFFClearHeight = true;
    var checkobj;
    checkobj = getElementOfObject("errortext", mobjContent);
    if (abubbv02_show == true) {
        var intObjHeight = 0;
        if (text == '') {
            //no error message - regenerate the bubble text using the appropriate function.
            this.Hide();
            this.ShowText();
            kmbdefpos = false;
            RepositionBubble(this);
            this.Show();
        }
        else {
            this.SetEnableCloseButton(true);
            if (!checkobj) {

                this.Hide();
                this.ShowText();

                var objContent = mobjContent;
                var objSpan = document.createElement("span");
                objSpan.ID = "errortext";
                var objB = document.createElement("b");
                var objFont = document.createElement("font");
                objFont.color = "#FF0000";
                objFont.face = "Arial";
                objFont.size = "2";
                objFont.setAttribute("style", "font-family:Arial; font-size:10pt;");

                if (document.all && !upk.browserInfo.isFF3()) {
                    objFont.innerText = text;
                } else {
                    objFont.textContent = text;
                }
                objB.appendChild(objFont);
                objSpan.appendChild(objB);

                var objHR = document.createElement("hr");
                objSpan.appendChild(objHR);
                if (document.all && !upk.browserInfo.isFF3()) objContent.insertBefore(objSpan, objContent.children(0))
                else objContent.insertBefore(objSpan, objContent.firstChild);

                this.RefreshBubble();
                kmbdefpos = false;
                RepositionBubble(this);
                this.Show();
            }
        }
    }
}
JSBubbleInterface.prototype.SetIcon = function (iconfilename) {
    if (iconfilename != "") {
        abubbv02_IconName = iconfilename;
    }
}

JSBubbleInterface.prototype.SetMoveable = function (bValue) {
    global_moveable = bValue;
};

JSBubbleInterface.prototype.RefreshBubble = function () {
    // reset the width. Otherwise the width will just grow
    mobjContent.style.pixelWidth = BUBB07_DEFAULTWIDTH;
    //	mobjContent.style.pixelHeight = 30;
    mobjContent.style.width = BUBB07_DEFAULTWIDTH + 'px';
    //	mobjContent.style.height = '30px';

    //	if((mobjContent.clientHeight + topPadding + bottomPadding) > BUBB07_DEFAULTWIDTH)
    //	{	
    //	    //bubble height exceeds predefined bubble width - adjust width to a (4:3) width-to-height ratio...
    //		var avgSize = Math.round((((mobjContent.clientHeight + topPadding + bottomPadding) + (mobjContent.clientWidth + leftPadding + rightPadding))*4)/7) - leftPadding - rightPadding;
    //		
    //		mobjContent.style.width = avgSize;
    //		
    //	}
    //	
}

JSBubbleInterface.prototype.SetText = function (text) {
    abubbv02_Text = text;
}


JSBubbleInterface.prototype.ResetContent = function () {
    abubbv02_IconName = "";
    m_ShowAction = "false";
    abubbv02_infos = "";
}

JSBubbleInterface.prototype.ShowText = function () {
    text = abubbv02_Text;


    if (abubbv02_show == true) {
        var objContent = mobjContent;

        if (text == '') {
            text = '<DIV style="visibility: hidden">longtextlongtextlongtext</DIV>';
            //alert(text);
        }

        objContent.innerHTML = text;

        if (abubbv02_IconName != '') {
            //iconarea='<IMG alt="" width="32" height="32" align="left" src="'+abubbv02_IconName+'"/>';
            var objImg = document.createElement("img");
            objImg.width = 32;
            objImg.height = 32;
            objImg.border = 0;
            objImg.align = "left";
            objImg.src = m_BubblePath + abubbv02_IconName;
            if (document.all && !upk.browserInfo.isFF3())
                objContent.insertBefore(objImg, objContent.children(0))
            else
                objContent.firstChild.insertBefore(objImg, objContent.firstChild.firstChild);
        }
        var objTable = document.createElement("table");
        objTable.cellspacing = 0;
        objTable.cellpadding = 0;
        objTable.style.marginBottom = "8px";
        var objTableBody = document.createElement("tbody");

        var objTR = document.createElement("tr");

        var objTD = document.createElement("td");
        objTD.height = 5;
        objTR.appendChild(objTD);
        objTableBody.appendChild(objTR);

        if (this.m_ShowAction || abubbv02_infos) {
            objTR = document.createElement("tr");

            if (this.m_ShowAction) {
                //action=+separator+"</td>"
                objTD = document.createElement("td");
                objTD.align = "right";

                var objAnchor = document.createElement("a");
                objAnchor.href = "javascript:OnAlternative();";

                var objImg = document.createElement("img");
                objImg.width = 22;
                objImg.height = 22;
                objImg.border = 0;
                objImg.alt = R_menu_alternatives;
                objImg.src = m_BubblePath + "alternatives.gif"
                objAnchor.appendChild(objImg);

                objTD.appendChild(objAnchor);


                if (screens[showScreen].infoblocks.length > 0) {
                    //separator="<img src='icondivide.gif' width='16' height='19' border='0' alt=''></img>";
                    var objImgSep = document.createElement("img");
                    objImgSep.width = 16;
                    objImgSep.height = 19;
                    objImgSep.border = 0;
                    objImgSep.src = m_BubblePath + "icondivide.gif"
                    objTD.appendChild(objImgSep);
                }

                objTR.appendChild(objTD)
            }

            if (screens[showScreen].infoblocks.length > 0) {
                // process infoblocks
                for (var i = 0; i < screens[showScreen].infoblocks.length; i++) {
                    var ib = screens[showScreen].infoblocks[i];

                    var objInfoBlock = document.createElement("td");
                    objInfoBlock.width = 25;
                    objInfoBlock.border = 0;

                    var objAnchor = document.createElement("a");
                    objAnchor.href = ib.url;
                    objAnchor.title = ib.tooltip;

                    var objActionImg = document.createElement("img");
                    objActionImg.src = ib.buttonfile;
                    objActionImg.width = 22;
                    objActionImg.height = 22
                    objActionImg.border = 0;
                    objActionImg.alt = ib.tooltip;
                    objAnchor.appendChild(objActionImg);

                    objInfoBlock.appendChild(objAnchor);
                    objTR.appendChild(objInfoBlock);
                };
            }
            objTableBody.appendChild(objTR);
        }
        objTable.appendChild(objTableBody);
        objContent.appendChild(objTable);

        if (playMode == "K") {
            // insert images using DOM. Currently three instances of images will be processed
            // through the DOM. These images are only available for Know It
            //var objIcon02 = mobjContent.all["img_icon02"];
            var objIcon02 = document.getElementById("img_icon02");
            if (objIcon02) {
                // if icon exists
                var objImg = objIcon02Img.cloneNode(null);
                objIcon02.appendChild(objImg);
            }

            UpdateYesNo(false, false);
        }
        UpdateDoneTyping(false);
    }
}

function UpdateDoneTyping(HighLighted) {

    //var objDoneTyping = mobjContent.all["img_DoneTyping"];
    //var objDoneTyping = mobjContent.img_DoneTyping;
    var a_objDoneTyping = getElementsByAttribute('id', 'img_DoneTyping');
    for (var i = 0; i < a_objDoneTyping.length; i++) {
        objDoneTyping = a_objDoneTyping[i];
        if (objDoneTyping) {
            // if yes No object exists
            if ((document.all && !upk.browserInfo.isFF3() && objDoneTyping.childNodes.length == 0) || (!document.all && objDoneTyping.nodeType == 1)) {
                // if the object is empty then populate using appenchild		

                spanE.innerHTML = R_tcbutton_title;

                objDoneTyping.appendChild(objDoneTypingA);
                objDoneTypingA.appendChild(objDoneTypingImg0);
                objDoneTypingImg0.appendChild(spanE);
                if (playMode == "K") {
                    br = document.createElement("P");
                    br.innerHTML = "&nbsp;";
                    br2 = document.createElement("P");
                    br2.innerHTML = "&nbsp;";
                    objDoneTyping.appendChild(br);
                    objDoneTyping.appendChild(br2);
                    objDoneTypingImg0.style.marginTop = "0px";
                }
                else {
                    // bottom line
                    br = document.createElement("p");
                    br.style.height = "42px";
                    objDoneTyping.appendChild(br);
                    objDoneTypingImg0.style.marginTop = "10px";
                    objDoneTypingImg0.style.marginBottom = "15px";
                }


            }
        }
    }
}

function UpdateYesNo(YesHighLighted, NoHighlighted) {
    //var objYesNo = mobjContent.all["img_YesNo"];
    var objYesNo = document.getElementById("img_YesNo");
    if (objYesNo) {
        // if yes No object exists

        if (objYesNo.childNodes.length == 0 || !mobjContent.all) {
            // if the object is empty then populate using appenchild
            spanENo.innerHTML = R_nobutton_title;
            objNoA.appendChild(spanENo);
            objYesNo.appendChild(objNoA);
            var objTextNode = document.createTextNode("  ");
            objYesNo.appendChild(objTextNode);

            spanEYes.innerHTML = R_yesbutton_title;
            objYesA.appendChild(spanEYes);
            objYesNo.appendChild(objYesA);
            yesnobr = document.createElement("P");
            yesnobr.innerHTML = "&nbsp;";
            objYesNo.appendChild(yesnobr);
        }
    }
}

function YesOnClick() {
    HLink(11);
}

function YesOnMouseOver() {
    HLink(111);
}

function YesOnMouseOut() {
    HLink(110);
}

function NoOnClick() {
    HLink(12);
}

function NoOnMouseOver() {
    HLink(121);
}

function NoOnMouseOut() {
    HLink(120);
}

function DTOnClick() {
    HLink(13);
}

function DTOnMouseOver() {
    HLink(131);
}

function DTOnMouseOut() {
    HLink(130);
}

JSBubbleInterface.prototype.SetAlternative = function (bShow, bEnabled) {
    this.m_ShowAction = bShow;
    this.EnabledAction = bEnabled;
}

JSBubbleInterface.prototype.AddInfoBlock = function (bitmapname, urltext, tooltip) {
    //if(abubbv02_show==true)
    {
        var EncodedTooltip = fixHTMLString(tooltip)
        abubbv02_infos += "<td width='25' border='0'><a target='_blank' href='" + urltext + "'><img src='" + bitmapname + "' width='22' height='22' border='0' alt='" + EncodedTooltip + "'></img></a></td>";
    }
}

var kmbdefpos = false;
var FirstBubble = true;

JSBubbleInterface.prototype.GetBubbleLeft = function (full) {
    if (!full)
        return getObjLeft(mobjBubble);
    switch (m_PointerDirection) {
        case BUBB07_LEFTTOP:
        case BUBB07_LEFTBOTTOM:
            return getObjLeft(mobjPointer)
        default:
            return getObjLeft(mobjBubble);
    }
}

JSBubbleInterface.prototype.GetBubbleTop = function (full) {
    if (!full)
        return getObjTop(mobjBubble);
    switch (m_PointerDirection) {

        case BUBB07_TOPLEFT:
        case BUBB07_TOPRIGHT:
            return getObjTop(mobjPointer)
        default:
            return getObjTop(mobjBubble);
    }
}

JSBubbleInterface.prototype.GetBubbleWidth = function (full) {
    if (!full)
        return getClientWidth(mobjBubble);
    switch (m_PointerDirection) {
        case BUBB07_LEFTTOP:
        case BUBB07_RIGHTTOP:
        case BUBB07_LEFTBOTTOM:
        case BUBB07_RIGHTBOTTOM:
            return getClientWidth(mobjBubble) + getClientWidth(mobjPointer);
        default:
            return getClientWidth(mobjBubble);
    }
}

JSBubbleInterface.prototype.GetBubbleHeight = function (full) {
    if (!full)
        return getClientHeight(mobjBubble);
    switch (m_PointerDirection) {
        case BUBB07_TOPLEFT:
        case BUBB07_TOPRIGHT:
        case BUBB07_BOTTOMLEFT:
        case BUBB07_BOTTOMRIGHT:
            return getClientHeight(mobjBubble) + getClientHeight(mobjPointer);
        default:
            return getClientHeight(mobjBubble);
    }
}

JSBubbleInterface.prototype.GetBubblePointer = function () {
    return m_PointerDirection;
}

function SavedPosition(left, top, right, bottom, pointed, pointerDirection, pointerXpos, pointerYpos, bwidth, bheight) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.pointed = pointed;
    this.pointerDirection = pointerDirection;
    this.pointerXpos = pointerXpos;
    this.pointerYpos = pointerYpos;
    this.bwidth = bwidth;
    this.bheight = bheight;
}

JSBubbleInterface.prototype.RefreshPosition = function () {
    if (this.savedPos == null)
        return;
    if (this.IsVisible() == false)
        return;
    this.SetPosition(this.savedPos.left, this.savedPos.top, this.savedPos.right, this.savedPos.bottom, this.savedPos.pointed, this.savedPos.pointerDirection, this.savedPos.pointerXpos, this.savedPos.pointerYpos, this.savedPos.bwidth, this.savedPos.bheight);
    this.Show();
}


JSBubbleInterface.prototype.SetPosition = function (left, top, right, bottom, pointed, pointerDirection, pointerXpos, pointerYpos, bwidth, bheight) {

    this.savedPos = new SavedPosition(left, top, right, bottom, pointed, pointerDirection, pointerXpos, pointerYpos, bwidth, bheight);

    // +++ check & set knowit mode move default position flag 
    //mobjContent = document.all["content"];
    mobjContent = document.getElementById('content');
    this.Hide();
    this.ShowText();
    this.RefreshBubble();


    //	kmbdefpos=false;
    if (m_rect.m_Left == -1 && this.m_bMoveDefPos) kmbdefpos = true;
    if (FirstBubble) {
        this.m_bMoveDefPos = true;
        FirstBubble = false;
    }

    m_rect.m_Left = left;
    m_rect.m_Top = top;
    m_rect.m_Right = right;
    m_rect.m_Bottom = bottom;

    m_Pointed = pointed;
    m_PointerDirection = pointerDirection;
    m_PointerXpos = pointerXpos;
    m_PointerYpos = pointerYpos;
    m_bWidth = bwidth;
    m_bHeight = bheight;

    mblnShowPointer = m_Pointed;

    RepositionBubble(this);
    this.ShowMode();
    //	alert(pointerXpos + " X,W " + bwidth);

}

function RepositionBubble(thisItem) {

    // Note that we should probably incorperate
    // the screen object (infoblocks) in the interface as well.

    // set dimensions of hotspot location
    thisItem.SetEnableCloseButton(abubbv02_enableclose);

    var right = m_rect.m_Right;
    var left = m_rect.m_Left;
    var bottom = m_rect.m_Bottom;
    var top = m_rect.m_Top;
    var pointed = m_Pointed;

    var contentLeft = 0;
    var contentTop = 0;

    // width and height of hotspot location
    var _w = right - left;
    var _h = bottom - top;

    var addwidth = 0;

    var sScreen = getDIV("screen");
    if (m_bWidth > sScreen.style.pixelWidth) m_bWidth = sScreen.style.pixelWidth;

    // if hotspot width is less that 40 and greater that 0 then added width is half of 
    // hotspot width, otherwise add width is 20	
    if (_w < 40 & _w > 0) addwidth = (_w) / 2;
    else addwidth = 20;

    if (abubbv02_show == true) {
        //var cw = document.body.clientWidth; // client width
        //var ch = document.body.clientHeight; // client height
        var cw = getObjWidth("screen");
        var ch = getObjHeight("screen");
        var w = mobjContent.clientWidth; 	// bubble width
        var h = mobjContent.clientHeight; 	// bubble height
        var x, y;
        var st01, st02;

        x = right + w;
        y = bottom + h;

        var right_over = false;
        var left_over = false;
        var top_over = false;
        var bottom_over = false;

        //alert("bubborék valós1 = "+m_Object.style.pixelLeft+","+m_Object.style.pixelTop+",");

        if (setpos) {
            //			thisItem.m_knrect.left=mobjContent.style.pixelLeft;
            //			thisItem.m_knrect.top=mobjContent.style.pixelTop;

            thisItem.m_knrect.left = getObjLeft(mobjContent);
            thisItem.m_knrect.top = getObjTop(mobjContent);
        }
        if (left == -1 && pointed && m_PointerDirection == 0) {
            //			thisItem.m_knrect.left=_ax;//m_Object.style.pixelLeft;
            //			thisItem.m_knrect.top=_ay;//m_Object.style.pixelTop;
            //alert("bubborék valós0 = "+this.m_knrect.left+","+this.m_knrect.top+",");
            setpos = false;

        }
        if (!pointed) {
            if (m_bWidth) setpos = false;
            else setpos = true;
            if (thisItem.m_knrect.left) {
                //alert("bubborék valós2 = "+this.m_knrect.left+","+this.m_knrect.top+",");
                //mobjContent.style.pixelLeft=thisItem.m_knrect.left;
                //mobjContent.style.pixelTop=thisItem.m_knrect.top;

                mobjContent.style.left = thisItem.m_knrect.left + "px";
                mobjContent.style.top = thisItem.m_knrect.top + "px";
            }
        }
        if (pointed) {
            setpos = false;
            if (mobjContent && m_PointerDirection > 0) {
                abubbv02_Pointer = m_PointerDirection;

                mobjContent.style.pixelWidth = m_bWidth - 28;
                mobjContent.style.pixelHeight = m_bHeight - 41;
                if (m_bWidth) mobjContent.style.width = (m_bWidth - 28) + 'px';
                mobjContent.style.height = '';
                if (!thisItem.m_bFFClearHeight && mobjContent.clientHeight < (m_bHeight - 41)) mobjContent.style.height = (m_bHeight - 41) + 'px';

                var pointerdir = 0;
                var inScreen = false;
                while (!inScreen) {
                    if (abubbv02_Pointer == BUBB07_TOPLEFT) {
                        //alert("TopLeft");

                        GetBubble("bubbTLp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 4;
                        contentTop = m_PointerYpos;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = contentLeft - leftPadding;
                        //						mobjBubble.style.pixelTop=contentTop + 38;

                        mobjBubble.style.left = Number(contentLeft - leftPadding) + "px";
                        mobjBubble.style.top = Number(contentTop + 38) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = contentLeft;
                        //						mobjContent.style.pixelTop = contentTop + 37 + topPadding;

                        mobjContent.style.left = contentLeft + "px";
                        mobjContent.style.top = Number(contentTop + 37 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2
                        mobjContent.style.zIndex = 3
                        mobjPointer.style.zIndex = 4
                    }

                    if (abubbv02_Pointer == BUBB07_TOPRIGHT) {
                        //alert("TopRight");

                        GetBubble("bubbTRp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 10;
                        contentTop = m_PointerYpos;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft - 5;

                        mobjPointer.style.left = Number(contentLeft - 5) + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = (contentLeft+ leftPadding + rightPadding) - mobjBubble.clientWidth;
                        //						mobjBubble.style.pixelTop=contentTop + 38;

                        mobjBubble.style.left = Number((contentLeft + leftPadding + rightPadding) - mobjBubble.clientWidth) + "px";
                        mobjBubble.style.top = Number(contentTop + 38) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = (contentLeft+ leftPadding + rightPadding) - mobjBubble.clientWidth + leftPadding;
                        //						mobjContent.style.pixelTop = contentTop + 37 + topPadding;

                        mobjContent.style.left = Number((contentLeft + leftPadding + rightPadding) - mobjBubble.clientWidth + leftPadding) + "px";
                        mobjContent.style.top = Number(contentTop + 37 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_BOTTOMRIGHT) {
                        //alert("BottomRight");
                        GetBubble("bubbBRp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 10;
                        contentTop = m_PointerYpos - 41;
                        //contentTop = top-41;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft - 5;

                        mobjPointer.style.left = Number(contentLeft - 5) + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = (contentLeft+ leftPadding + rightPadding) - mobjBubble.clientWidth;
                        //						mobjBubble.style.pixelTop=contentTop - mobjBubble.clientHeight + 3;

                        mobjBubble.style.left = Number((contentLeft + leftPadding + rightPadding) - mobjBubble.clientWidth) + "px";
                        mobjBubble.style.top = Number(contentTop - mobjBubble.clientHeight + 3) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = (contentLeft+ leftPadding + rightPadding) - mobjBubble.clientWidth + leftPadding;
                        //						mobjContent.style.pixelTop = contentTop - mobjBubble.clientHeight + 2 + topPadding;

                        mobjContent.style.left = Number((contentLeft + leftPadding + rightPadding) - mobjBubble.clientWidth + leftPadding) + "px";
                        mobjContent.style.top = Number(contentTop - mobjBubble.clientHeight + 2 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_BOTTOMLEFT) {
                        //alert("BottomRight");
                        GetBubble("bubbBLp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 4;
                        contentTop = m_PointerYpos - 41;
                        //alert("h=" + h + "\nObject Height = " + m_Object.clientHeight);
                        //contentTop = top - 41;

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = contentLeft - leftPadding;
                        //						mobjBubble.style.pixelTop=contentTop - mobjBubble.clientHeight + 3;

                        mobjBubble.style.left = Number(contentLeft - leftPadding) + "px";
                        mobjBubble.style.top = Number(contentTop - mobjBubble.clientHeight + 3) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = contentLeft;
                        //						mobjContent.style.pixelTop = contentTop - mobjBubble.clientHeight + 2 + topPadding;

                        mobjContent.style.left = contentLeft + "px";
                        mobjContent.style.top = Number(contentTop - mobjBubble.clientHeight + 2 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_LEFTTOP) {
                        //alert("TopLeft");

                        GetBubble("bubbLTp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos;
                        contentTop = m_PointerYpos - 3;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = contentLeft - leftPadding + 52;
                        //						mobjBubble.style.pixelTop=contentTop - 15;

                        mobjBubble.style.left = Number(contentLeft - leftPadding + 52) + "px";
                        mobjBubble.style.top = Number(contentTop - 15) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = contentLeft + 52;
                        //						mobjContent.style.pixelTop = contentTop + topPadding - 16;

                        mobjContent.style.left = Number(contentLeft + 52) + "px";
                        mobjContent.style.top = Number(contentTop + topPadding - 16) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_RIGHTTOP) {
                        //alert("TopRight");

                        GetBubble("bubbRTp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 41;
                        contentTop = m_PointerYpos - 3;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = (contentLeft - leftPadding) - mobjBubble.clientWidth + 17;
                        //						mobjBubble.style.pixelTop=contentTop - 15;

                        mobjBubble.style.left = Number((contentLeft - leftPadding) - mobjBubble.clientWidth + 17) + "px";
                        mobjBubble.style.top = Number(contentTop - 15) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = (contentLeft - leftPadding) - mobjBubble.clientWidth + leftPadding + 17;
                        //						mobjContent.style.pixelTop = contentTop + topPadding - 16;

                        mobjContent.style.left = Number((contentLeft - leftPadding) - mobjBubble.clientWidth + leftPadding + 17) + "px";
                        mobjContent.style.top = Number(contentTop + topPadding - 16) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_RIGHTBOTTOM) {
                        //alert("BottomRight");
                        GetBubble("bubbRBp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos - 41;
                        contentTop = m_PointerYpos - 15;
                        // place the pointer

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = (contentLeft - leftPadding) - mobjBubble.clientWidth + 17;
                        //						mobjBubble.style.pixelTop=contentTop - mobjBubble.clientHeight + 33;

                        mobjBubble.style.left = Number((contentLeft - leftPadding) - mobjBubble.clientWidth + 17) + "px";
                        mobjBubble.style.top = Number(contentTop - mobjBubble.clientHeight + 33) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = (contentLeft - leftPadding) - mobjBubble.clientWidth + leftPadding + 17;
                        //						mobjContent.style.pixelTop = contentTop - mobjBubble.clientHeight + 32 + topPadding;

                        mobjContent.style.left = Number((contentLeft - leftPadding) - mobjBubble.clientWidth + leftPadding + 17) + "px";
                        mobjContent.style.top = Number(contentTop - mobjBubble.clientHeight + 32 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }

                    if (abubbv02_Pointer == BUBB07_LEFTBOTTOM) {
                        //alert("BottomRight");
                        GetBubble("bubbLBp", abubbv02_bubbcolor);
                        contentLeft = m_PointerXpos;
                        contentTop = m_PointerYpos - 15;
                        //alert("h=" + h + "\nObject Height = " + m_Object.clientHeight);
                        //contentTop = top;

                        //						mobjPointer.style.pixelTop = contentTop;
                        //						mobjPointer.style.pixelLeft = contentLeft;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";

                        // place the bubble over top of pointer

                        //						mobjBubble.style.pixelLeft = contentLeft - leftPadding + 52;
                        //						mobjBubble.style.pixelTop=contentTop - mobjBubble.clientHeight + 33;

                        mobjBubble.style.left = Number(contentLeft - leftPadding + 52) + "px";
                        mobjBubble.style.top = Number(contentTop - mobjBubble.clientHeight + 33) + "px";

                        // place the content in the bubble

                        //						mobjContent.style.pixelLeft = contentLeft + 52;
                        //						mobjContent.style.pixelTop = contentTop - mobjBubble.clientHeight + 32 + topPadding;

                        mobjContent.style.left = Number(contentLeft + 52) + "px";
                        mobjContent.style.top = Number(contentTop - mobjBubble.clientHeight + 32 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                    }
                    if (abubbv02_Pointer == 9) {
                        //alert("BottomRight");
                        GetBubble("bubbLBp", abubbv02_bubbcolor);
                        m_PointerXpos = getUniWidth(sScreen) / 2;
                        m_PointerYpos = getUniHeight(sScreen) / 2;
                        contentLeft = m_PointerXpos;
                        contentTop = m_PointerYpos - 15;

                        mobjPointer.style.left = contentLeft + "px";
                        mobjPointer.style.top = contentTop + "px";


                        mobjBubble.style.left = Number(contentLeft - leftPadding + 52) + "px";
                        mobjBubble.style.top = Number(contentTop - mobjBubble.clientHeight + 33) + "px";


                        mobjContent.style.left = Number(contentLeft + 52) + "px";
                        mobjContent.style.top = Number(contentTop - mobjBubble.clientHeight + 32 + topPadding) + "px";

                        mobjBubble.style.zIndex = 2;
                        mobjContent.style.zIndex = 3;
                        mobjPointer.style.zIndex = 4;
                        pointed = false;

                    }
                    //					if(mobjBubble.style.pixelTop < 0 || mobjBubble.style.pixelTop + mobjBubble.clientHeight > sScreen.style.pixelHeight ||
                    //						mobjBubble.style.pixelLeft < 0 ||  mobjBubble.style.pixelLeft + mobjBubble.clientWidth > sScreen.style.pixelWidth)
                    if
					(
						getObjTop(mobjBubble) < 0 ||
						getObjTop(mobjBubble) + getClientHeight(mobjBubble) > getUniHeight(sScreen) ||
						getObjLeft(mobjBubble) < 0 ||
						getObjLeft(mobjBubble) + getClientWidth(mobjBubble) > getUniWidth(sScreen)
					) {
                        pointerdir++;
                        abubbv02_Pointer = pointerdir;
                        inScreen = false;
                        switch (abubbv02_Pointer) {
                            case 1:
                                m_PointerXpos = right;
                                m_PointerYpos = top;
                                break;
                            case 2:
                                m_PointerXpos = left;
                                m_PointerYpos = top;
                                break;
                            case 3:
                                m_PointerXpos = right;
                                m_PointerYpos = bottom;
                                break;
                            case 4:
                                m_PointerXpos = left;
                                m_PointerYpos = bottom;
                                break;
                            case 5:
                                m_PointerXpos = right;
                                m_PointerYpos = top;
                                break;
                            case 6:
                                m_PointerXpos = left;
                                m_PointerYpos = top;
                                break;
                            case 7:
                                m_PointerXpos = right;
                                m_PointerYpos = bottom;
                                break;
                            case 8:
                                m_PointerXpos = left;
                                m_PointerYpos = bottom;
                                break;
                            case 9:
                                //								abubbv02_Pointer = BUBB07_TOPLEFT;
                                m_PointerXpos = getUniWidth(sScreen) / 2;
                                m_PointerYpos = getUniHeight(sScreen) / 2;
                                pointed = false;
                                inScreen = true;
                                break;
                        }
                    }
                    else {
                        thisItem.m_bFFClearHeight = false;
                        inScreen = true;
                    }
                    m_PointerDirection = abubbv02_Pointer;
                    thisItem.lastbubbstyle = abubbv02_Pointer;
                }
            }
        }
        if (!pointed) {
            thisItem.m_bMoveDefPos = false;

            brect = new JSRect();

            //			brect.left = mobjContent.style.pixelLeft - leftPadding;
            //			brect.top = mobjContent.style.pixelTop - topPadding;
            //			brect.right = mobjContent.style.pixelLeft + w + rightPadding;
            //			brect.bottom = mobjContent.style.pixelTop + h + bottomPadding;

            brect.left = getObjLeft(mobjContent) - leftPadding;
            brect.top = getObjTop(mobjContent) - topPadding;
            brect.right = getObjLeft(mobjContent) + w + rightPadding;
            brect.bottom = getObjTop(mobjContent) + h + bottomPadding;

            if (m_bWidth) mobjContent.style.pixelWidth = m_bWidth - 28;
            mobjContent.style.pixelHeight = m_bHeight - 41;
            if (m_bWidth) mobjContent.style.width = (m_bWidth - 28) + 'px';
            mobjContent.style.height = '';
            if (!thisItem.m_bFFClearHeight && mobjContent.clientHeight < (m_bHeight - 41)) mobjContent.style.height = (m_bHeight - 41) + 'px';

            setBubbleWidthToNowrapElements('getNode:NOBR', 'size:maxWidth');

            if (m_PointerXpos != 0) {
                mobjContent.style.pixelWidth = m_bWidth - 28;
                mobjContent.style.pixelHeight = m_bHeight - 41;
                if (m_bWidth) mobjContent.style.width = (m_bWidth - 28) + 'px';
                mobjContent.style.height = '';
                if (!thisItem.m_bFFClearHeight && mobjContent.clientHeight < (m_bHeight - 41)) {
                    mobjContent.style.height = (m_bHeight - 41) + 'px';
                    thisItem.m_bFFClearHeight = false;
                }
            }

            GetBubble("bubbNp", abubbv02_bubbcolor);
            abubbv02_Pointer = BUBB07_NOPOINTER;

            contentLeft = m_PointerXpos - (mobjBubble.clientWidth / 2);
            contentTop = m_PointerYpos - (mobjBubble.clientHeight / 2);
            //-------------Bubble Out--------------------------------------------------
            if (m_PointerXpos == 0) {
                contentLeft = brect.left;
                contentTop = brect.top;
            }
            //-------------------------------------------------------------------------
            //contentLeft = brect.left;
            //contentTop = brect.top;
            // check bubble position
            if ((brect.right > cw) && (m_PointerXpos == 0)) {
                contentLeft = cw - mobjContent.clientWidth - 10 - leftPadding - rightPadding;
            }
            if ((brect.bottom > ch) && (m_PointerXpos == 0)) {
                contentTop = ch - mobjContent.clientHeight - 10 - topPadding - bottomPadding;
            }

            // +++ check default position flag
            if ((kmbdefpos) && (m_PointerXpos == 0)) {
                // +++ set deafult position
                contentLeft = (cw - mobjContent.clientWidth - 10 - leftPadding - rightPadding);
                contentTop = ((ch / 2) - mobjContent.clientHeight / 2) - topPadding - bottomPadding;
                // +++ actualize bubble position
                brect.left = contentLeft;
                brect.top = contentTop;
            }
            if (contentLeft < 0) contentLeft = 0;
            if (contentLeft + mobjBubble.clientWidth > getUniWidth(sScreen)) contentLeft = getUniWidth(sScreen) - mobjBubble.clientWidth;
            if (contentTop < 0) contentTop = 0;
            if (contentTop + mobjBubble.clientHeight > getUniHeight(sScreen)) contentTop = getUniHeight(sScreen) - mobjBubble.clientHeight;

            // place the bubble over top of pointer

            //			mobjBubble.style.pixelLeft = contentLeft;
            //			mobjBubble.style.pixelTop=contentTop;

            mobjBubble.style.left = contentLeft + "px";
            mobjBubble.style.top = contentTop + "px";

            // place the content in the bubble

            //			mobjContent.style.pixelLeft = contentLeft + leftPadding;
            //			mobjContent.style.pixelTop = contentTop + topPadding;

            mobjContent.style.left = Number(contentLeft + leftPadding) + "px";
            mobjContent.style.top = Number(contentTop + topPadding) + "px";

            mobjBubble.style.zIndex = 2
            mobjContent.style.zIndex = 3
            if
			(
				getObjTop(mobjBubble) < top &&
				getObjTop(mobjBubble) + getClientHeight(mobjBubble) > bottom &&
				getObjLeft(mobjBubble) < left &&
				getObjLeft(mobjBubble) + getClientWidth(mobjBubble) > right
			) {
                if (left > (cw - right)) {
                    contentLeft = left - getClientWidth(mobjBubble) - 10;
                    if (contentLeft < 0) contentLeft = 0;
                }
                else {
                    contentLeft = right + 10;
                    if (contentLeft + mobjBubble.clientWidth > getUniWidth(sScreen)) contentLeft = getUniWidth(sScreen) - mobjBubble.clientWidth;
                }
                mobjBubble.style.left = contentLeft + "px";
                mobjContent.style.left = Number(contentLeft + leftPadding) + "px";
            }
        }

        if (mobjContent && left == -1 && right == -1 && top == -1 && bottom == -1 && pointed && m_PointerDirection == 0) {
            //			if(m_bWidth && m_PointerXpos > 0) mobjContent.style.width = m_bWidth - 28;
            //			if(m_bHeight && m_PointerXpos > 0) mobjContent.style.height = m_bHeight - 52;
            if (m_bWidth) mobjContent.style.pixelWidth = m_bWidth - 28;
            if (m_bHeight) mobjContent.style.pixelHeight = m_bHeight - 41;
            if (m_bWidth) mobjContent.style.width = (m_bWidth - 28) + 'px';
            mobjContent.style.height = '';
            if (!thisItem.m_bFFClearHeight && mobjContent.clientHeight < (m_bHeight - 41)) {
                mobjContent.style.height = (m_bHeight - 41) + 'px';
                thisItem.m_bFFClearHeight = false;
            }

            var qcw = queryContentWidth();
            if (qcw > m_bWidth - 28) { mobjContent.style.width = queryContentWidth() + "px"; }

            GetBubble("bubbNp", abubbv02_bubbcolor);
            abubbv02_Pointer = BUBB07_NOPOINTER;

            //cw = getObjWidth("screen");
            //ch = getObjHeight("screen");
            //            cw = document.body.clientWidth;
            //            ch = document.body.clientHeight;
            if (m_PointerXpos > 0 && m_PointerYpos > 0) {
                contentLeft = (m_PointerXpos - mobjBubble.clientWidth / 2); //right;//-(right-left);
                contentTop = m_PointerYpos - mobjBubble.clientHeight / 2;
            }
            else {
                contentLeft = ((cw / 2) - mobjBubble.clientWidth / 2); //right;//-(right-left);
                contentTop = (ch / 2) - mobjBubble.clientHeight / 2;
            }
            //if(abubbv02_Pointer!=BUBB07_NOPOINTER) 
            //{
            //this.SetColor(abubbv02_bubbcolor);
            //}

            if (contentLeft < 0) contentLeft = 0;
            if (contentLeft + mobjBubble.clientWidth > getUniWidth(sScreen)) contentLeft = getUniWidth(sScreen) - mobjBubble.clientWidth;
            if (contentTop < 0) contentTop = 0;
            if (contentTop + mobjBubble.clientHeight > getUniHeight(sScreen)) contentTop = getUniHeight(sScreen) - mobjBubble.clientHeight;

            //			mobjBubble.style.pixelLeft = contentLeft;
            //			mobjBubble.style.pixelTop = contentTop;

            mobjBubble.style.left = contentLeft + "px";
            mobjBubble.style.top = contentTop + "px";

            // place the content in the bubble

            //			mobjContent.style.pixelLeft = contentLeft + leftPadding;
            //			mobjContent.style.pixelTop = contentTop + topPadding;

            mobjContent.style.left = Number(contentLeft + leftPadding) + "px";
            mobjContent.style.top = Number(contentTop + topPadding) + "px";

            mobjBubble.style.zIndex = 2;
            mobjContent.style.zIndex = 3;
        }
    }
    $("#content a").bind("touchstart", function (e) {
    	e.stopPropagation();
    	//e.preventDefault();
    }).bind("touchend", function (e) {
    	e.stopPropagation();
    	//e.preventDefault();
    }).bind("click", function (e) {
    	e.stopPropagation();
    	//e.preventDefault();
    })
}

var imgCntr = 0;

function buildBubble(color) {

    var bubble = "";
    var bubID;

    var bubbc;
    bubbc = convert(String(color), 10, 16);
    while (bubbc.length < 6) bubbc = "0" + bubbc;
    bubbc = "#" + bubbc;

    bubID = "bubble_" + color;

    bubble += "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:100; top:100;zIndex:2;visibility:hidden'>";

    if (!upk.browserInfo.isIE8()) {
    	bubble += "<div style=' position: absolute; top:1px; z-index:-1; left:10px; background-color:" + bubbc + "; right: 10px; bottom: 1px;'></div>"
    }

    bubble += "<table ID='BubbleTable' width='266' border='0' cellspacing='0' cellpadding='0'>";
    bubble += "<tr>"
    bubble += "<td valign='top'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[3] + "' width='14' height='27' border='0' alt=''></td>";
    bubble += "<td valign='top' bgcolor='" + (grayBubbles ? "#F4F2F1" : "#003166") + "' width='100%' background=" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[4] + ">";
    //	bubble += "<div style='position:absolute;'>";
    bubble += "<table border='0' cellspacing='0' cellpadding='0' height='27' width='100%'>";
    bubble += "<tr>"
    bubble += "<td id='bubb_cap' valign='" + (grayBubbles ? "center" : "bottom") + "' nowrap><a style='cursor:default' id='m_Caption' class='CurvedBoxText'></a></td>";
    bubble += "<td id='m_StaticCaption' valign='" + (grayBubbles ? "center" : "bottom") + "' width='100%' align='right'><div id='blink' style='white-space:nowrap; VISIBILITY: visible'><a id='m_ActionText' style='white-space:nowrap; cursor:pointer; text-decoration:underline;' onclick='setAOpener(event)' class='CurvedBoxNav'></a></div></td>";
    bubble += "<td>&nbsp;&nbsp;</td>";
    bubble += "</tr>";
    bubble += "<tr height='" + (grayBubbles ? "0" : "3") + "'>";
    bubble += "<td colspan='3'></td>";
    bubble += "</tr>";
    bubble += "</table>";
    //	bubble += "</div>";
    //	bubble += "<img src='"+imagesArr["c_" + abubbv02_bubbcolor].imageNames[4]+"' width='100%' height='27' border='0' alt=''>";
    bubble += "</td>";
    bubble += "<td valign='top'><div id='closebtn_" + color + "' style='position:relative'><div><img id='img2' name='img2' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[1] + "' style='display:block' width='32' height='27' border='0'><img id='img2o' name='img2o' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[2] + "' style='display:none' width='32' height='27' border='0'></div><div style='position:absolute; left:3px; top:7px'><a onclick='BubbleClose();return false'"
	 + (IsTouchDevice() ? "" : "onMouseMove='BubbleimgOn(\"img2\",\"img2o\")' onMouseOut='BubbleimgOff(\"img2\",\"img2o\")'")
	 + "><img href='#' alt='" + R_bubble_closeondemand + "' id='imghandler' name='imghandler' src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[0] + "' style='display:block' width='23' height='20' border='0'></a></div></div></td>";
    bubble += "</tr>";
    bubble += "<tr>";
    if (!upk.browserInfo.isIE8() && !upk.browserInfo.isIE11()) {
    	bubble += "<td " + (upk.browserInfo.isExplorer() ? "style='height:1px'" : "") + "> <img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[5] + "' style='height:100%; width: 14px'/></td>";
    }
    else {
    	bubble += "<td style='background-image:url(" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[5] + ")'></td>";
    }
    bubble += "<td ID='BubbleSides' bgcolor='" + bubbc + "' height='116'>&nbsp;</td>";
    if (!upk.browserInfo.isIE8() && !upk.browserInfo.isIE11()) {
    	bubble += "<td " + (upk.browserInfo.isExplorer() ? "style='height:1px'" : "") + "> <img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[6] + "' style='height:100%; width: 32px'/></td>";
    }
    else {
    	bubble += "<td style='background-image:url(" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[6] + ")'></td>";
    }
    bubble += "</tr>";
    bubble += "<tr>"
    bubble += "<td valign='top'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[7] + "' width='14' height='14' border='0' alt=''></td>";
    bubble += "<td valign='top' width='100%'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[8] + "' width='100%' height='14px'></td>";
    bubble += "<td valign='top'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[9] + "' width='32' height='14' border='0' alt=''></td>";
    bubble += "</tr>";
    bubble += "</table>"
    bubble += "</div>"

    $("#screen").append(bubble);
    //    document.write(bubble);

    //<!-- anchor upper left -->
    bubID = "ulPointer_" + color;
    ul = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:114; top:62;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[10] + "' width='18' height='41' border='0' alt=''></div>";
    //<!-- anchor upper right -->
    bubID = "urPointer_" + color;
    ur = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:334; top:62;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[11] + "' width='18' height='41' border='0' alt=''></div>";
    //<!-- anchor left high -->
    bubID = "lhPointer_" + color;
    lh = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:62; top:114;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[12] + "' width='41' height='18' border='0' alt=''></div>";
    //<!-- anchor left low -->
    bubID = "llPointer_" + color;
    ll = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:62; top:225;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[13] + "' width='41' height='18' border='0' alt=''></div>";
    //<!-- anchor right high -->
    bubID = "rhPointer_" + color;
    rh = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:363; top:114;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[14] + "' width='41' height='18' border='0' alt=''></div>";
    //<!-- anchor right low -->
    bubID = "rlPointer_" + color;
    rl = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:363; top:225;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[15] + "' width='41' height='18' border='0' alt=''></div>";
    //<!-- anchor lower left -->
    bubID = "btPointer_" + color;
    bt = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:114; top:254;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[16] + "' width='18' height='41' border='0' alt=''></div>";
    //<!-- anchor lower right -->
    bubID = "brPointer_" + color;
    br = "<div id='" + bubID + "' name='" + bubID + "' style='position:absolute; left:334; top:254;zIndex:2;visibility:hidden' onMouseDown='AnchorMouseDown(); return false' onMouseUp='AnchorMouseUp(); return false'><img src='" + imagesArr["c_" + abubbv02_bubbcolor].imageNames[17] + "' width='18' height='41' border='0' alt=''></div>";

    $("#screen").append(ul);
    $("#screen").append(ur);
    $("#screen").append(lh);
    $("#screen").append(ll);
    $("#screen").append(rh);
    $("#screen").append(rl);
    $("#screen").append(bt);
    $("#screen").append(br);

}

function LoadAllBubbles() {
    for (var c = 0; c < imagesXref.length; c++) {
        var color = imagesArr[imagesXref[c]].color;
        abubbv02_bubbcolor = color;
        buildBubble(color);
    }

    $("#screen").append("<div id='content' name='content' style='position:absolute; left:114; top:138;zIndex:10;visibility:hidden'></div>");

    objDoneTypingA = document.createElement("SPAN");
    objDoneTypingA.id = "bbdta";
    objDoneTypingA.style.position = "absolute";
    objDoneTypingA.style.right = 0;
    objDoneTypingA.style.marginTop = "16px";

    objDoneTypingImg0 = document.createElement("A");
    objDoneTypingImg0.id = "bbdt0";
    objDoneTypingImg0.className = "bg_button_a bubbbutton";
    objDoneTypingImg0.style.display = "block";
    objDoneTypingImg0.onclick = function () { DTOnClick(); };
    objDoneTypingImg0.href = "#";

    spanE = document.createElement("SPAN");
    spanE.innerHTML = R_tcbutton_title;
    spanE.className = "bg_button_span bubbbutton_span";
    if (R_tcbutton_title.length >= 18) {
        objDoneTypingImg0.style.letterSpacing = "-1px";
        objDoneTypingImg0.style.font = "bold 7pt Arial";
    }

    if (playMode == "K") {
        // know it needs to have additional images

        // icon imape
        objIcon02Img = document.createElement("img");
        objIcon02Img.src = m_BubblePath + template_knowit_icon02;

        spanEYes = document.createElement("SPAN");
        spanEYes.innerHTML = R_yesbutton_title;
        spanEYes.className = "bg_button_span bubbbutton_span";

        spanENo = document.createElement("SPAN");
        spanENo.innerHTML = R_nobutton_title;
        spanENo.className = "bg_button_span bubbbutton_span";

        // yes button images	
        objYesA = document.createElement("A");
        objYesA.id = "bbyesa";
        objYesA.className = "bg_button_a bubbbutton";
        objYesA.href = "#";
        objYesA.onclick = YesOnClick;
        objYesA.style.styleFloat = "right";
        objYesA.style.cssFloat = "right";

        // no button images	
        objNoA = document.createElement("A");
        objNoA.id = "bbnoa";
        objNoA.className = "bg_button_a bubbbutton";
        objNoA.href = "#";
        objNoA.style.styleFloat = "right";
        objNoA.style.cssFloat = "right";
        objNoA.onclick = NoOnClick;
    }
    if (IsTouchDevice()) {
        $(document).bind("touchend", function (e) {
            bubb07_global_MM(touch(e));
            if (ob) {
                e.preventDefault();
            }
            ob = false;
            bubbleDrag = false;
        });
        $(document).bind("touchmove", function (e) {
            bubb07_global_MM(touch(e));
            if (ob) {
                e.preventDefault();
            }
        });
        $("#m_ActionText").bind("touchstart", function (e) {
        	e.stopPropagation();
        });
        $("#blink, #m_Caption, #m_StaticCaption").bind("touchstart", function (e) {
            if (!global_moveable) return;
            bubbleDrag = true;
            var f = touch(e);
            e.preventDefault();
            e.stopPropagation();
            ob = true;
            X = f.clientX;
            Y = f.clientY;
        });
    }
}

function GetBubble(type, color) {
    //mobjBubble = document.all["bubble_" + color];
    mobjBubble = document.getElementById('bubble_' + color);
    //mobjBubble = document.getElementById('bubble_16777152');
    if (mblnShowPointer) {
        mblnShowPointer = true;
        switch (type) {
            case "bubbTLp":
                mobjPointer = document.getElementById("ulPointer_" + color);
                break;
            case "bubbTRp":
                mobjPointer = document.getElementById("urPointer_" + color);
                break;
            case "bubbBLp":
                mobjPointer = document.getElementById("btPointer_" + color);
                break;
            case "bubbBRp":
                mobjPointer = document.getElementById("brPointer_" + color);
                break;
            case "bubbLTp":
                mobjPointer = document.getElementById("lhPointer_" + color);
                break;
            case "bubbRTp":
                mobjPointer = document.getElementById("rhPointer_" + color);
                break;
            case "bubbLBp":
                mobjPointer = document.getElementById("llPointer_" + color);
                break;
            case "bubbRBp":
                mobjPointer = document.getElementById("rlPointer_" + color);
                break;
            case "bubbNp":
                mblnShowPointer = false;
        }
    }
    //mobjContent.style.backgroundColor = color;
    //mobjBubble.style.backgroundColor = color;

    //alert(mobjBubble.all["BubbleSides"]);
    //mobjBubble.all["BubbleSides"].height = mobjContent.clientHeight + topPadding + bottomPadding;
    //mobjBubble.all["BubbleSides"].height = mobjContent.clientHeight //+ bottomPadding;
    //document.getElementById('BubbleSides').height = mobjContent.clientHeight //+ bottomPadding;
    var cBS = getElementsByAttribute('id', 'BubbleSides');
    for (var i in cBS) {
        cBS[i].height = mobjContent.clientHeight;
    };

    //mobjBubble.all["BubbleTable"].width = mobjContent.clientWidth + leftPadding + rightPadding;
    //document.getElementById('BubbleTable').width = mobjContent.clientWidth + leftPadding + rightPadding;
    var cBT = getElementsByAttribute('id', 'BubbleTable');
    for (var i in cBT) {
        cBT[i].width = mobjContent.clientWidth + leftPadding + rightPadding;
    };

    load_buttons();
}

function setBubbleWidthToNowrapElements(getNode, getBy) {
    try {
        var getNode = getNode.split(':')[1];
        var cParts = mobjContent.getElementsByTagName('*');
        var KCmaxWidth = 0;

        //get left
        for (var i = 0; i < cParts.length; i++) {
            if (cParts[i].nodeName == getNode) {
                var nodeLeft = cParts[i].offsetLeft;
                break;
            }
        }

        //get by size
        if (getBy.indexOf('size') != -1) {
            for (var i = 0; i < cParts.length; i++) {
                if (cParts[i].nodeName == getNode) {
                    if (cParts[i].offsetWidth > KCmaxWidth) {
                        KCmaxWidth = cParts[i].offsetWidth;
                    }
                }
            }
            if (KCmaxWidth + nodeLeft > mobjContent.clientWidth) mobjContent.style.width = KCmaxWidth + nodeLeft + 'px';
        }

        //get by id
        if (getBy.indexOf('id') != -1) {
            var nodeId = getBy.split(':')[1];
            for (var i = 0; i < cParts.length; i++) {
                if (cParts[i].id == nodeId) {
                    mobjContent.style.width = cParts[i].offsetWidth + nodeLeft + 'px';
                    break;
                }
            }
        }
    } catch (e) { }
}

function queryContentWidth() {
    try {
        var cParts = mobjContent.getElementsByTagName('*');
        var KCmaxWidth = 0;

        //get left
        for (var i = 0; i < cParts.length; i++) {
            if (cParts[i].nodeName.toUpperCase() == 'NOBR' || cParts[i].nodeName.toUpperCase() == 'TABLE') {
                var w = cParts[i].offsetWidth + cParts[i].offsetLeft;
                if (w > KCmaxWidth) KCmaxWidth = w;
            }
        }
        return KCmaxWidth;
    } catch (e) { }
}

/* menu.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var popupMenu = 0;
showAttachments = false;
var fullength = 0;

function ActionMenu() {
    this.Open = _AOpen;
    this.Close = _AClose;
    this.Refresh = _ARefresh;
    this.IsOnScreen = _AIsOnScreen;
    this.PopupIsOpened = _APopupIsOpened;
    this.onScreen = false;
};


function setAOpener(e) {
    if (document.all) {
        popupOpener = event.srcElement;
    }
    else {
        event = e;
        popupOpener = event.target;
    }
    OnAction();
}

function _AOpen() {

    /*	IE FÜGGŐ HÍVÁS	

    if (!popupMenu)
    {
    popupMenu=createPopup();
    };
    */

    //HELYETTE DIV

    if (!popupMenu) {
        popupMenu = document.createElement('DIV');
        document.body.appendChild(popupMenu);
        myspan = document.createElement('SPAN');
        myspan.setAttribute("id", "_myspan_");
        myspan.setAttribute("style", "font:8pt Arial;");
        document.body.appendChild(myspan);
    };

    //LEKÉRDEZZÜK A NYITÓ POZÍCIÓJÁT
    nextNode = popupOpener;
    popupOpener.positionTop = 0;
    popupOpener.positionLeft = 0;
    while (nextNode.nodeName != 'BODY') {
        popupOpener.positionTop += nextNode.offsetTop;
        popupOpener.positionLeft += nextNode.offsetLeft;
        nextNode = nextNode.parentNode;
    }

    popupOpenerHeight = popupOpener.offsetHeight;

    //BELŐJÜK A MENÜ POZÍCIÓJÁT	
    popupMenu.style.zIndex = 10000;
    popupMenu.style.textAlign = "left";
    popupMenu.aLink = "0000FF";
    popupMenu.link = "0000FF";
    popupMenu.vLink = "0000FF";
    popupMenu.style.position = "absolute";

    //    var _top_correction = (upk.browserInfo.isFF3() || upk.browserInfo.isFF4() || upk.browserInfo.checkFFVersion(7) || upk.browserInfo.checkFFVersion(8) || upk.browserInfo.checkFFVersion(9) || upk.browserInfo.isSafari() ? 16 : 0);

    var _top_correction = 0;

    popupMenu.style.top = (popupOpener.positionTop + popupOpenerHeight) - _top_correction - 6 + 'px';

    if (upk.browserInfo.isIE10orHigher()) {
        popupMenu.style.left = (popupOpener.positionLeft - 65) + 'px';
        popupMenu.style.width = "auto";
    }
    else if (document.all || upk.browserInfo.isiOS7() || upk.browserInfo.isSafari()) {
        popupMenu.style.left = (popupOpener.positionLeft - 65) + 'px';
        popupMenu.style.width = "140px";
    }
    else {
        popupMenu.style.left = (popupOpener.positionLeft - 65) + 'px';
        popupMenu.style.width = "140px";
    }

    //aPopBody = popupMenu.document.body;	NEM KELL

    //NEM KELLENEK A DOCUMENT.BODY -K, margin, helyett padding

    //EZ KAPCSOLJA BE A MENÜ MEGJELENÍTÉSÉT
    popupMenu.style.display = "block";
    popupMenu.className = "AMenu";

    popupMenu.style.borderStyle = "solid";
    popupMenu.style.borderWidth = "1px";
    popupMenu.style.borderColor = "gray";
    popupMenu.style.paddingTop = "8px";
    popupMenu.style.paddingBottom = "8px";
    popupMenu.style.paddingLeft = "8px";
    popupMenu.style.paddingRight = "8px";

    popupMenu.aLink = "0000FF";
    popupMenu.link = "0000FF";
    popupMenu.vLink = "0000FF";
    popupMenu.text = "black";

    //aPopBody.ondragstart = EventCancel ;
    //aPopBody.oncontextmenu = EventCancel ;

    this.onScreen = true;
};

function _APopupIsOpened() {
    if (popupMenu == 0) {
        return false;
    }
    return popupMenu.isOpen;
}

function _AClose() {
    //popupMenu.hide();
    window.setTimeout("popupMenuHide()", 200);
    this.onScreen = false;
};

function OnActionSelection(v1, v2) {
    //popupMenu.hide();
    this.onScreen = false;
    if (v1 == "Next") {
        OnMenuAlternative("TeacherForward(false)");
    };
    if (v1 == "Prev") {
        OnMenuAlternative("TeacherBack()");
    };
    if (v1 == "Start") {
        OnMenuAlternative("TeacherFastBack()");
    };
    if (v1 == "Alt") {
        OnMenuAlternative("TeacherAlter()");
    };
    if (v1 == "Conc") {
        OnMenuAlternative(concepts[v2].url,
							concepts[v2].width,
							concepts[v2].height,
							concepts[v2].infotype,
							concepts[v2].infokey);
    };
    if (v1 == "Info") {
        OnMenuAlternative(screens[showScreen].infoblocks[v2].simpleurl,
							screens[showScreen].infoblocks[v2].width,
							screens[showScreen].infoblocks[v2].height,
							screens[showScreen].infoblocks[v2].infotype,
							screens[showScreen].infoblocks[v2].infokey);
    };
    if (v1 == "Prefs") {
        OnMenuAlternative("OpenPreferences()");
    };
    if (v1 == "Share") {
        OnMenuAlternative("Share()");
    };
    if (v1 == "Help") {
        OnMenuAlternative("LaunchHelp()", "../../");
    };
    if (v1 == "LogOut") {
        OnMenuAlternative("LogOut()");
    };
    if (v1 == "CloseT") {
        OnMenuAlternative("OnClose()");
    };
    if (v1 == "CloseW") {
        CloseAction();
    };
    if (v1 == "Resume") {
        OnMenuAlternative("Menu_Resume()");
    }
    if (v1 == "Printit") {
        OnMenuAlternative("ShowPrintit()");
    }
    if (v1 == "AskAnExpert") {
        OnMenuAlternative("AskAnExpert()");
    }
    if (v1 == "ProvideFeedback") {
        OnMenuAlternative("ProvideFeedback()");
    }
};


function CorrectPopup() {
    try {
        obj = binterf.GetActionLink();
        h = obj.offsetHeight;
        popupMenu.show(0, h, 0, 0, obj);
        sp = popupMenu.getElementById('actionspan');
        hsp = sp.offsetHeight;
        wsp = sp.offsetWidth;
        popupMenu.show(0, h, wsp + 20, hsp + 20, obj);
    } catch (e) { };
    this.onScreen = true;

}

function PopupToggle(div) {
    if (popupMenu.getElementsByTagName('DIV')[1].style.display == "none") {
        if (!upk.browserInfo.isExplorer() || upk.browserInfo.isiOS7() || upk.browserInfo.isSafari()) {
            if (fullength > 100)
                popupMenu.style.width = "" + (fullength + 40) + "px";
        }
        popupMenu.getElementsByTagName('DIV')[1].style.display = "block";
        showAttachments = true;
    }
    else {
        if (upk.browserInfo.isIE10orHigher())
            popupMenu.style.width = "auto";
        else if (!upk.browserInfo.isExplorer() || upk.browserInfo.isiOS7() || upk.browserInfo.isSafari()) {
            popupMenu.style.width = "140px";
        }
        popupMenu.getElementsByTagName('DIV')[1].style.display = "none";
        showAttachments = true;
    }

    CorrectPopup();
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
    var ctx = "expertAdvice";
    parent.setDlgCtx(ctx);
    parent.showDialog(url, -1, -1, 510, 430, true, dpi, "../../../");
}

// 2011/09/20, Zsolt
function ProvideFeedback() {
    var dpi = 96;
    var url = lms_GetFeedbackUrl(parent.topicID);
    var ctx = "feedback";
    parent.setDlgCtx(ctx);
    parent.showDialog(url, -1, -1, 510, 430, true, dpi, "../../../");
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

function _ARefresh(next, prev, first, alt, changeconcept, changeinfo, frompref, printit) {
    if (!this.onScreen)
        return;

    var s = "";
    s += "<div id='actionspan' style='font:8pt Arial; width:100%;' nowrap=yes>";
    s += "<a href='#'></a>";
    if (playMode == "T") {
        if (next) {
            s += "<li><a href='#' onclick='OnActionSelection(\"Next\");return false;'>";
            s += R_menu_nextstep;
            s += "</a></li>";
        };
        if (prev) {
            s += "<li><a href='#' onclick='OnActionSelection(\"Prev\");return false;'>";
            s += R_menu_prevstep;
            s += "</a></li>";
        };
        if (first) {
            s += "<li><a href='#' onclick='OnActionSelection(\"Start\");return false;'>";
            s += R_menu_start;
            s += "</a></li>";
        };
        if (alt) {
            s += "<li><a href='#' onclick='OnActionSelection(\"Alt\");return false;'>";
            s += R_menu_alternatives;
            s += "</a></li>";
        };

        var i = 0;
        if (concepts.length > 0) {
            s += "<li>";
            s += "<a href='#' onclick='OnActionSelection(\"Conc\",\"0\");return false;'>";
            s += R_menu_concepts;
            s += "</a></li>";
        };

        if (screens[showScreen].infoblocks.length > 0) {
            s += "<li><a href='javascript:EmptyFunction()' onclick='PopupToggle(\"infodiv\")'>";
            s += R_menu_infoblocks;
            s += "</a></li>";
            s += "<div id='infodiv' style='display:none'>";
            if (!upk.browserInfo.isExplorer()) {
                for (i = 0; i < screens[showScreen].infoblocks.length; i++) {
                    document.getElementById("_myspan_").innerHTML = fixHTMLString(screens[showScreen].infoblocks[i].tooltip);
                    var fw = document.getElementById("_myspan_").offsetWidth;
                    if (fullength < fw) {
                        fullength = fw;
                    }
                    document.getElementById("_myspan_").innerHTML = "";
                }
            }
            for (i = 0; i < screens[showScreen].infoblocks.length; i++) {
                if (upk.browserInfo.isIE10orHigher())
                    s += "<li style='list-style-type:circle;text-indent:18px; width: 100%;'>";
                else if (!upk.browserInfo.isExplorer() || upk.browserInfo.isiOS7() || upk.browserInfo.isSafari())
                    s += "<li style='list-style-type:circle;text-indent:18px; width: " + (fullength + 40) + "px;'>";
                else
                    s += "<li style='list-style-type:circle;text-indent:18px; width: 140px;'>";
                s += "<a href='#' onclick='OnActionSelection(\"Info\",";
                s += "" + i;
                s += ");return false;'>";
                s += fixHTMLString(screens[showScreen].infoblocks[i].tooltip);
                s += "</a></li>";
            };
            s += "</div>";
        };
    };

    ///// works in seeit only

    if (playMode == "S") {
        s += "<li><a href='#' onclick='OnActionSelection(\"Resume\");return false;'>";
        s += R_interface_resume;
        s += "</a></li>";
    }

    if (playMode == "T" || playMode == "S") {
        if (printit) {
            s += "<li><a href='#' onclick='OnActionSelection(\"Printit\");return false;'>";
            s += R_interface_printit;
            s += "</a></li>";
        }
    }

    ///// works in tryit and knowit and seeit
    ///// AskAnExpert
    if (lms_IsMentoringAvailable() == true) {
        s += "<li><a href='#' onclick='OnActionSelection(\"AskAnExpert\");return false;'>";
        s += R_interface_askexpert;
        s += "</a></li>";
    }

    ///// ProvideFeedback
    if (lms_IsFeedbackAvailable() == true) {
        s += "<li><a href='#' onclick='OnActionSelection(\"ProvideFeedback\");return false;'>";
        s += R_interface_providefeedback;
        s += "</a></li>";
    }

    if (PlayerConfig.EnableCookies && UserPrefs.EnablePreferences) {
        s += "<li><a href='#' onclick='OnActionSelection(\"Prefs\");return false;'>";
        s += R_menu_preferences;
        s += "</a></li>";
    };

    var url = "" + parent.location;
    var local = url.indexOf("localhost") > -1 || url.indexOf("127.0.0.1") > -1;  // we do not want to share local address
    if (UIComponents.ShareLink && !local && GetTopLevelLmsMode() != "LMS") {
        s += "<li><a href='#' onclick='OnActionSelection(\"Share\");return false;'>";
        s += R_menu_share;
        s += "</a></li>";
    }

    if (UIComponents.TopicHelp == true) {
        s += "<li><a href='#' onclick='OnActionSelection(\"Help\");return false;'>";
        s += R_menu_help;
        s += "</a></li>";
    }

    try {
        if ((GetTopLevelLmsMode() == "KPT" || Kpath_launch == true) && lms_IsKPathLogoutAvailable()) {
            s += "<li><a href='#' onclick='OnActionSelection(\"LogOut\");return false;'>";
            s += R_toctooltip_kpathlogout;
            s += "</a></li>";
        }
    }
    catch (e) { }

    s += "<li><a href='#' onclick='OnActionSelection(\"CloseT\");return false;'>";
    s += R_menu_Close;
    s += "</a></li>";

    s += "</span>";


    //popupMenu.document.body.innerHTML=s;
    popupMenu.innerHTML = s;

    if (upk.browserInfo.isIE10orHigher()) {
        $("#actionspan *").width("100%");
        $("#actionspan *").css("white-space", "nowrap");
    }

    //    sH = document["screenshot"].clientHeight;
    sH = document.getElementsByTagName("body")[0].clientHeight + getScrollTop();
    if (popupMenu.offsetTop + popupMenu.clientHeight > sH) {
        popupMenu.style.top = "" + (sH - popupMenu.clientHeight) + "px";
    }

    //    sW = document["screenshot"].clientWidth;
    sW = document.getElementsByTagName("body")[0].clientWidth + getScrollLeft();
    if (popupMenu.offsetLeft + popupMenu.clientWidth > sW) {
        popupMenu.style.left = "" + (sW - popupMenu.clientWidth) + "px";
    }

    setTimeout('try{popupMenu.document.all["actfocus"].focus();}catch(e){};', 100);
    //	obj=document.all('screen');
    //	popupMenu.show(100,150,230,360,obj);

    CorrectPopup();
};

function popupMenuHide() {
    if (showAttachments == true) {
        showAttachments = false
        actionMenu.onScreen = true;
    }
    else {
        popupMenu.style.display = 'none';
    }
}

function _AIsOnScreen() {
    return this.onScreen;
};

function EmptyFunction() {
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
/* timeline.js */
/*--
Copyright � 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// adding a last operator to the JavaScript
// array class  
if (!Array.prototype.last) {
    Array.prototype.last = function () {

        if (this.length > 0)
            return this[this.length - 1];
        else
            return null;
    }
}

// adding a first operator to the JavaScript 
// array class.  Isn't used anywhere, I just
// like symmetry. 
if (!Array.prototype.first) {
    Array.prototype.first = function () {
        if (this.length > 0)
            return this[0];
        else
            return null;
    }
}


// UPKDelegate class

function UPKDelegate() {
    this.fn = new Array();
}

UPKDelegate.prototype.Raise = function (sender, args) {
    for (var i = 0; i < this.fn.length; i++) {
        this.fn[i](sender, args);
    }
}

UPKDelegate.prototype.Register = function (fn) {
    this.fn.push(fn);
}

UPKDelegate.prototype.Unregister = function (fn) {
    for (var i = 0; i < this.fn.length; i++) {
        if (this.fn[i] == fn) {
            this.fn.splice(i, 1);
            return;
        }
    }
    alert("UPKDelegate.Unregister failed to find function");
}

UPKDelegate.prototype.Count = function () {
    return this.fn.length;
}


var upk = upk || {};


upk.Timeline = (function () {
    var _this = {};

    var _timeline = new Array();
    var _lockTimeline = false;
    var _lockTimeCt = 0;
    var _sliderTime = 0;

    var _currentFrameIndex = -1;
    _timeline.push("start");

    var _TotalTime = 0;
    var _AccumalitiveCurrentFrameTime = 0;
    var _lastFrameTime = 0;
    var _lastFrame = 0;
    var _lastSoundInfo = { f: "", t: 0 };
    var _initialized = false;

    var _ProgressDelegate = new UPKDelegate();

    // Used by the frame walking algorithm to 
    // make sure we cycles in the graphi are 
    // only traversed once.  
    // Note we only need to put branch points
    // onto the list. 
    var _marklist;

    var _timeline_container_for_test = null;

    /*  What state is the frame playing it.  
    
    can be one of:
    B - beginning
    D - waiting out frame delay
    S - Play sound
    A - Playing out animation 
    */
    var _FrameState = "B";

    /* time counter used by the delay and 
    animation parts of the frame playback
    to update time progress. */
    var _FrameTimeCounter;

    /******************* private method section ******************************/

    /* This function  looks for the frame.  This search
    is sensitive which direction the timeline is 
    being played in.  Hence why direction is passed 
    in. */
    function FindTimelineIndex(frame, dir) {
        /* see if the requested frame is somewhere after current */

        if (dir == "back") {
            /* check back in the timeline first */
            for (var i = (_currentFrameIndex - 1); i >= 0; i--) {
                if (_timeline[i] == frame) {
                    return i;
                }
            }

            /* Check forward on the timline second*/
            for (var i = _currentFrameIndex; i < _timeline.length; i++) {
                if (_timeline[i] == frame) {
                    return i;
                }
            }
        }
        else {
            /* Check forward on the timline first */
            for (var i = _currentFrameIndex; i < _timeline.length; i++) {
                if (_timeline[i] == frame) {
                    return i;
                }
            }

            /* check back in the timeline second */
            for (var i = (_currentFrameIndex - 1); i >= 0; i--) {
                if (_timeline[i] == frame) {
                    return i;
                }
            }
        }

        return -1;
    }


    /* function to check is the frame is
    in the already visited marked list */
    function InMarkList(frame) {
        for (var i = 0; i < _timeline.length; i++) {
            if (_marklist[i] == frame) {
                return true;
            }
        }

        return false;
    }

    function GetFrameSoundDuration(frame) {
        var action = screens[frame].actions[0];

        if (_HasSound(action)) {
            var asx = (action.id).substr(1) + ".ASX";
            var ret = StandardTimeToMillisecs(sounds[asx].duration);
            return (isNaN(ret) ? 0 : (ret + 500))
        }

        return 0;
    }

    function GetFrameDelayTime(frame) {
        var delay = screens[frame].actions[0].delay;

        if (delay != DELAY_INFINITE)
            return delay * 100;

        return 0;
    }

    // Computes the time it takes to play a specic frame
    // in 1/1000 of a second. 

    function GetFrameDurationNarration(frame) {
        if (frame == "end")
            return 0;
        var action = screens[frame].actions[0];
        if (_HasSound(action))
            return GetFrameSoundDuration(frame);

        else
            return GetFrameDelayTime(frame);
    }

    function GetFrameDurationAnimation(frame) {
        if (frame == "end")
            return 0;
        var action = screens[frame].actions[0];
        return action.animTime;
    }

    function GetFrameDuration(frame) {
        var n = GetFrameDurationNarration(frame);
        var a = GetFrameDurationAnimation(frame);
        if (_timeline_container_for_test != null) {
            _timeline_container_for_test[frame] = { "n": n, "a": a, "s": a + n };
        }
        return n + a;
    }

    function GetFrameCurrentTime() {
        var time = 0;
        var frame = _this.GetCurrentFrame();
        if (!frame)
            return 0;
        if (frame == "end")
            return 0;
        var action = screens[frame].actions[0];

        switch (_FrameState) {
            case "A": /* in animatio section */
                if (_HasSound(action))
                    time += GetFrameSoundDuration(frame);
                else
                    time += GetFrameDelayTime(frame);

                time += _FrameTimeCounter;
                break;

            case "D": /* in time delay */
                time = _FrameTimeCounter;
                break;

            case "S":  /* in sound play back */
                var o = SoundPlayer_GetTime();
                time = o.t;
                if (isNaN(time)) {
                    return _lastFrameTime;
                }
                if (Math.round(time) == _lastSoundInfo.t) {
                    if (frame != _lastSoundInfo.f) {
                        return _lastFrameTime;
                    }
                }
                _lastSoundInfo = { f: frame, t: Math.round(time) };
                break;

            case "B": /* just started */
                time = 0;
                break;
        }
        var frameduration = GetFrameDuration(frame);
        if (time > frameduration)
            time = frameduration;

        if (_lastFrame == frame) {
            if (frame != "start") {
                if (time < _lastFrameTime)
                    time = _lastFrameTime;
                else
                    _lastFrameTime = time;
            }
        }
        else
            time = 0;

        _lastFrame = frame;
        return time;
    }


    /* Reset some frame state stuff and update 
    the accumaltive timeline */
    function SetCurrentFrameIndex(index) {
        _lastFrameTime = 0;
        _FrameState = "B";
        _FrameTimeCounter = 0;
        _currentFrameIndex = index;
    }

    function RecalculateAccumalitiveTime() {
        var temp = 0;
        for (var i = 0; i < _currentFrameIndex; i++)
            temp += GetFrameDuration(_timeline[i]);

        _AccumalitiveCurrentFrameTime = temp;
    }

    /* Simple wrapper around the real append path,
    Just makes sure the marklist get reset before
    starting the search */
    function AppendPathToTimeLine(toframe) {
        _marklist = new Array();
        if (AppendPathToTimeLine2(toframe, false))
            return true;

        _marklist = new Array();
        return (AppendPathToTimeLine2(toframe, true))
    }


    /* Find a way to get to the "toframe" from the 
    last node currently on the timeline.  Append that
    path to the timeline.  */
    function AppendPathToTimeLine2(toframe, allowloops, lastFrame) {
        if (lastFrame == undefined) {
            lastFrame = _timeline.last();
        }
        if (lastFrame == "end") {
            _timeline.push("end");
            return true;
        }
        var branches = 1;
        try {
            branches = screens[lastFrame].actions.length;
        }
        catch (e) { };
        for (var i = 0; i < branches; i++) {
            var next = screens[lastFrame].actions[i].nextFrame;
            var skipped = false;
            if (next == toframe) {
                _timeline.push(next);
                return true;
            }
            else if (next == "end") {
                continue;
            }

            /* frame is marked as skip move
            to next frame */
            else if (_SkipFrame(screens[next])) {
                skipped = true;
            }
            if (!skipped) {
                if (allowloops) {
                    /* this code below is here to avoid getting stuck
                    in loops.  It is coded based on knowing we
                    have to support looping back into the primary 
                    path.

                    Hence why it doesn't 'mark' branch 0 */
                    if (i > 0) {
                        if (InMarkList(next))
                            continue;
                        else
                            _marklist.push(next);
                    }
                }
                else {
                    if (FindTimelineIndex(next) >= 0) {
                        continue;
                    }
                }
                _timeline.push(next);
            }
            if (AppendPathToTimeLine2(toframe, allowloops, next)) {
                return true;
            }
            else {
                _timeline.pop();
                continue;
            }

        }

        return false;
    }


    function FireProgressEvent() {
        _ProgressDelegate.Raise(_this,
            { 'CurrentTime': _this.GetCurrentTime(),
                'TimelineDuration': _TotalTime,
                'FrameState': _this.GetFrameState(),
                'Locked': _lockTimeline
            });
    }

    /******************* public method section ******************************/

    _this.Init = function (startscreen) {
        if (_initialized)
            return false;
        _initialized = true;
        _timeline.push(startscreen);
        _lastFrame = 0;
        _lastFrameTime = 0;
        return true;
    }

    _this.Lock = function (lock, slidertime) {
        _lockTimeline = lock;
        if (lock == true) {
            _lockTimeCt = 3;
            _sliderTime = slidertime;
        }
    }

    _this.OnProgressUpdate = function (handler) {
        _ProgressDelegate.Register(handler);

        /* Set up timer if this is the first event
        being registered */
        if (_ProgressDelegate.Count() == 1) {
            setInterval(FireProgressEvent, 300);
        }
    }


    /* player needs to notify this class where
    in the frames timeline the play head is 

    What state is the frame playing it.  
    
    can be one of:
    B - beginning
    D - waiting out frame delay
    S - Play sound
    A - Playing out animation */
    _this.SetFrameState = function (state) {
        _FrameState = state;
        _FrameTimeCounter = 0;
    }

    _this.GetFrameState = function () {
        return _FrameState;
    }

    /* Set the time counter used by the delay and 
    animation parts of the frame playback
    to manually update time progress */
    _this.IncFrameTimeCounter = function (val) {
        _FrameTimeCounter += val;
    }




    _this.CalculateTimeline = function (toframe) {
        _this.CalculateTimelineThrough(toframe);
        return;
    };


    /* use this function primarily for jump in points and hemi where
    we want to create a new path from start to end going through
    a specific node. */
    _this.CalculateTimelineThrough = function (throughframe) {
        /* truncate back to start */
        _timeline = new Array();
        _timeline.push(StartScreen);

        if (throughframe != "end")
            AppendPathToTimeLine(throughframe);
        AppendPathToTimeLine("end");

        SetCurrentFrameIndex(throughframe == "end" ? 0 : FindTimelineIndex(throughframe));

        //        _timeline_container_for_test = new Array();   // for test only
        _this.UpdateTimelineDuration();
        _timeline_container_for_test = null;

    }


    /* this function should be called whenever the current 
    display frame changes. */
    _this.UpTimelineAt = function (selectedframe, dir, tdesc) {
        var findex = FindTimelineIndex(selectedframe, dir);

        if (tdesc && tdesc.valid) {
            findex = tdesc.timelineindex;
        }

        /* Desired frame is already on the timeline and
        we didn't go backwards, set current location there
        and  just return. */
        if ((findex >= 0) && (dir != "back")) {
            SetCurrentFrameIndex(findex);
            RecalculateAccumalitiveTime();
            if (tdesc && tdesc.valid) {
                _lastFrameTime = tdesc.resttime;
                _lastFrame = this.GetCurrentFrame();
            }
            return;
        }
        else if (findex >= 0) {
            /* Truncate the timeline back to the current 
            found frame and then recompute path from 
            current  frame to end frame */
            _timeline = _timeline.slice(0, findex + 1);

            AppendPathToTimeLine("end");
        }
        else {
            /* Truncate the timeline back to the current 
            display frame and then recompute path from 
            current  frame to selected frame and then to end frame 
               
            *There is an assumption here that selected frame can be 
            reached from the current frame.   Probably safe, however 
            if you wanted to be extra safe, check the return from
            AppendPathToTimeline, if it returns false, call 
            CalculateTimelineThrough to compute a path through
            selected. 
            */
            _timeline = _timeline.slice(0, _currentFrameIndex + 1);

            AppendPathToTimeLine(selectedframe);

            if (selectedframe != "end")
                AppendPathToTimeLine("end");

            findex = FindTimelineIndex(selectedframe, dir);
        }

        SetCurrentFrameIndex(findex);
        _this.UpdateTimelineDuration();
        if (tdesc && tdesc.valid) {
            _lastFrameTime = tdesc.resttime;
            _lastFrame = this.GetCurrentFrame();
        }
    }


    _this.GetCurrentFrame = function () {
        return _timeline[_currentFrameIndex];
    }


    _this.GetTimeline = function () {
        return _timeline;
    }

    _this.GetCurrentFrameIndex = function () {
        return _currentFrameIndex;
    }

    /* returns the current timeline duration
    in 1000ths of seconds */
    _this.GetTimelineDuration = function () {
        return _TotalTime;
    }

    /* returns the play head location 
    in 1000ths of seconds */
    _this.GetCurrentTime = function () {
        if (_lockTimeline == false) {
            if (_lockTimeCt > 0) {
                _lockTimeCt--;
                if (_sliderTime != undefined) {
                    return _sliderTime;
                }
            }
        }
        return _AccumalitiveCurrentFrameTime + GetFrameCurrentTime();
    }

    // Used to update showHistory when the slider
    // is used to change the postion of the timeline. 
    _this.GetHistory = function () {
        var history = new Array();

        for (var i = 0; i < _currentFrameIndex; i++) {
            history.push(_timeline[i]);
        }

        return history;
    }

    /* Recomputes the duration of the current timeline. 
    this sometimes needs to be triggered from outside
    code line when preferences change */
    _this.UpdateTimelineDuration = function () {
        var temp = 0;

        for (var i = 0; i < _timeline.length; i++) {
            temp += GetFrameDuration(_timeline[i]);
        }

        RecalculateAccumalitiveTime();
        _TotalTime = temp;
    }

    _this.FrameTimeStructure = function (frameid, timelineindex, narration, animation, resttime) {
        this.frameid = frameid;
        this.timelineindex = timelineindex;
        this.narration = narration;
        this.animation = animation;
        this.resttime = resttime;
    }

    _this.END_OF_TOPIC = -999;

    _this.DeterminateCurrentFrameFromTime = function (time) {
        if (time == _TotalTime)
            return new _this.FrameTimeStructure(_this.END_OF_TOPIC);
        var temp = 0;
        var summarytime = 0;
        var i = 0;
        for (i = 0; i < _timeline.length; i++) {
            var n = GetFrameDurationNarration(_timeline[i]);
            var a = GetFrameDurationAnimation(_timeline[i]);
            temp += n + a;
            if (temp >= time) {
                break;
            }
            summarytime = temp;
        }
        return new _this.FrameTimeStructure(_timeline[i], i, n, a, time - summarytime);
    }

    return _this;
})();

function StandardTimeToMillisecs(time) {
    var a = time.split(":");
    var t = DELAY_INFINITE;
    try {
        t = parseFloat(a[0] * 3600) + parseFloat(a[1] * 60) + parseFloat(a[2]); // hours, minutes, seconds
        t *= 1000;                          // convert to milliseconds
    }
    catch (e) { };
    return t;
}

function MillisecsToFormattedTime(time) {
    var t = time / 1000;
    var s = "" + Math.floor(t % 60);
    s = (s.length > 1 ? s : "0" + s);
    var m = "" + Math.floor(t / 60);
    m = (m.length > 1 ? m : "0" + m);
    var h = "" + Math.floor(t / 3600);
    h = (h.length > 1 ? h : "0" + h);
    return "" + h + ":" + m + ":" + s;
}

/* test code */

var fidiv = document.getElementById("frameiddiv");
var showtest = false;

function SetUpProgressReporting() {
    if (showtest) {
        $("#frameiddiv").append("<div id='testtiming'>timing</div>");
        $("#frameiddiv").append("<div id='testtimeline'>timeline</div>");
        $("#frameiddiv").append("<input id='testback' type='button' value='Back' onclick='return testback_onclick()' />");
    }
    upk.Timeline.OnProgressUpdate(TestTimelineProgress);
}

function testback_onclick() {
    DemoPrev();
}

function TestTimelineProgress(sender, event) {
    if (event.Locked)
        return;
    if (SoundIsLocked)
        if (SoundIsLocked())
            return;
    if (showtest) {
        var str = MillisecsToFormattedTime(event.CurrentTime) + " : " + MillisecsToFormattedTime(event.TimelineDuration);
        str += " - " + event.FrameState;
        $("#testtiming").html(str);

        var timeline = upk.Timeline.GetTimeline();
        var currentFrameIndex = upk.Timeline.GetCurrentFrameIndex();

        str = "Cindex: " + currentFrameIndex + " | ";
        for (var i = 0; i < timeline.length; i++) {
            if (i == currentFrameIndex) str += "->";
            str += timeline[i];
            if (i == currentFrameIndex) str += "<-";

            str += " ";
        }

        $("#testtimeline").html(str);
    }
    if (isNavBar()) {
        navBar.setEndTime(event.TimelineDuration);
        navBar.setCurrentTime(event.CurrentTime);
    }

}

/* topic.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved. 
--*/

//	V: 47 LM: 10/23/2002 by lw
//	V: 52 LM: 10/28/2002 by gh
//	Aladdin closed...
//	V: 123 LM: 11/04/2003 by gh
//	Barbary Coast closed...
//	V: 173 LM: 01/10/2005 by gh 

///////// User defined area for knowit mode ///////////

// variables


//variables for tracking
var trackArgList;        // An array of strings contains the parameter list of the url
var trackScoreCompleted; // A number contains the result in percent
var trackScoreRequired;  // A number contains the required result defined by database in percent
// user can define additional variables (called track...) used by following functions e.q. trackTime

function trackOnBegin()
// called by the begin of the track in Knowit mode
// trackArgList is reachable -> user can parse and interpret his own parameters, init variables etc.
{
    // KP related code ///////////////////
    for (var i = 0; i < trackArgList.length; i++) {
        strArg = trackArgList[i];
        if (strArg.substr(0, 9) == "kpfeedbk=") {
            PlayerConfig.TrackFeedBack = (strArg.substr(9) == "0" ? false : true);
            PlayerConfig.ShowScoreNeeded = PlayerConfig.TrackFeedBack;
            // PlayerConfig.TrackFeedBack is able to suppress the PlayerConfig.ShowScoreNeeded setting!!!
        }
    };
    // End of KP related code ////////////	
};

function trackComplete()
// called by the end of the track in Knowit mode after the topic is complete
// trackArgList, trackScoreCompleted, trackScoreRequired are reachable
{
    // KP related code ///////////////////
    var kpnextpage = "";
    for (var i = 0; i < trackArgList.length; i++) {
        strArg = trackArgList[i];
        if (strArg.substr(0, 11) == "kpnextpage=") {
            kpnextpage = strArg.substr(11);
        }
    };
    if (kpnextpage.length > 0) {
        var answer = "" + trackScoreCompleted + "%";
        var score = 0;
        if (trackScoreCompleted >= trackScoreRequired)
            score = 1;
        var newloc = "";
        if ((kpnextpage.indexOf("?") >= 0) || (kpnextpage.indexOf("#") >= 0)) {
            newloc = kpnextpage + "&score=" + score + "&answer=" + answer;
        }
        else {
            newloc = kpnextpage + "?score=" + score + "&answer=" + answer;
        }
        if (window.parent.opener)
            window.parent.opener.location.href = newloc;
    };
    // End of KP related code ////////////	
};

function trackIncomplete()
// called by the end of the track in Knowit mode by mid topic exit
// trackArgList, trackScoreCompleted, trackScoreRequired are reachable
{
    // KP related code ///////////////////
    // End of KP related code ////////////	
};

///////// End of the User defined area ////////////////

var guidedParent = null;
var gopener = null;

function GetOpener() {
    if (top.window.opener) {
        try {
            if (!top.window.opener.closed) {
                if (top.window.opener.GIPlayer) {
                    guidedParent = top.window.opener.GIPlayer;
                    gopener = guidedParent;
                }
            }
        }
        catch (e) { };
    }
}

var playMode = "S"
var param_frame = ""
var param_ctx = ""
var param_ctxlist = "";
var param_guid = "";
var param_printitname = "";
var lms_childIndex = 0;
var lms_inAssessment = false;

var screenshotPath = "";

var DEF_KWARNINGSCORELEVEL = 1; // defines the level where the step not accepted
var KWarningLevel = 0;
var KScoreNeeded = 80;
var KTopicFinished = false;
var soundIsExported = false;
var KWrongScreens = new Array();
var KScoringScreen = false;
var KConfirmDemo = false;
var KConfirmCheckBox = true;
var KFinishClose = false;
var KPreventSound = false;
var KContinueFlag = 0; // 1, after guest demo playing
var KGuestDemoMode = 0;
var KRemediation1 = true;
var KRemediation2 = true;
var KRemediation3 = true;

var binterf = 0;
var def_PLAYER_CLOSE = "PLAYER_CLOSE"

var NS4 = (navigator.appName == "Netscape" && parseInt(navigator.appVersion) == 4)

var screens = new Array()
var screenNames = new Array()
var currentScreenObj
var currentscreenName
var FirstScreenName = ""
var showLeadIn = 2; // 0 -> hide, 1 -> show, other -> defined by cookies
var firsthemialternativeindex = 0;
var nosound = false;

var concepts = new Array()
var preloadImages = new Array();
var preloadImagesList = new Array();
var preloadImagesCacheSize = 50;


var showScreen = ""
var showAct = 0

var moduleName = "";
var topicName = unescape(document.title);
var topicShowBubbles = "";

var StartAction = 0;

var Knowit_minimum = 167;
var Rem1_minimum = 200;
var Rem2_minimum = 250;
var Rem4_width = 300;

function DummyObj() {
    this.type = "";
};
var showActObj = new DummyObj();

var showActInpObj
var showHistory = new Array()
var historyActionMap = new Array()
//var isTabbed = false
var isPaused = false

var DELAY_INFINITE = 999
var MOUSE_STEP = 25

var scrH = 0;
var scrW = 0;

var animTimeout;
var bullsTimeout;
var animPhase = ""
var animCmd = ""
var animSteps = 0
var animStepOriginal = 0
var anim_x, anim_y
var anim_to_x, anim_to_y

var screenshot = new Image();
var event_blocked;

var animObject;

var showFrameIDToggle = 0;

function InputOnFocus() {
    if (showActInpObj)
        showActInpObj.hasfocus = true;
}

function InputOnBlur() {
    if (showActInpObj)
        showActInpObj.hasfocus = false;
}

function FocusMe() {
    try {
        window.focus();
    }
    catch (e) { };
};

function FocusInpObj() {
    if (showActInpObj) {
        try {
            showActInpObj.focus();
        }
        catch (e) { };
        var cObjID = showActInpObj.id;
        var cObj = document.getElementById(cObjID);
        var txt = cObj.text;
        cObj.text = txt;
        /*
        var txtRange=showActInpObj.createTextRange()
        var txt=txtRange.text;
        txtRange.text=txt;
        */
        SelectText(showActInpObj);
    };
}

function SelectText(obj) {
    if (IsTouchDevice()) {
        try {
            obj.setSelectionRange(0, 9999);
        }
        catch (e) {
            obj.select();
        }
    }
    else {
        obj.select();
    }
}

function OnFocus() {
    if (!showActObj)
        return;
    if (showActObj.type) {
        if (showActObj.type == 'Input') {
            if (showActInpObj)
                setTimeout("FocusInpObj()", 10);
        };
    };
};

function OnBubbleMoved() {
    OnFocus();
};

function OnBubbleClicked() {
    if (actionMenu) {
        if (actionMenu.IsOnScreen()) {
            actionMenu.Close();
        };
    }
};

function AnimObject(cmd, timeout, phase) {
    this.cmd = cmd;
    this.timeout = timeout;
    this.phase = phase;
    this.delaystep = 0;
    this.showbubble = true;
};

function IsLeadIn(o) {
    if (o == null)
        o = showActObj;
    return (screens["start"].actions[0].id == o.id);
};

function IsLeadOut(o) {
    if (o == null)
        o = showActObj;
    return (o.nextFrame == "end");
};

function IsDecision(o) {
    if (o == null)
        o = showActObj;
    return (o.type == "Decision");
};

function IsExplanation(o) {
    if (o == null)
        o = showActObj;
    if (IsLeadIn(o) || IsLeadOut(o))
        return false;
    return (o.type == "None");
};

function IsActionFrame(o) {
    if (o == null)
        o = showActObj;
    return (o.type == "Normal");
}

function StoredEvent(x, y, shiftState, buttonID) {
    this.storedEvent = true;
    this.pX = x;
    this.pY = y;
    this.pShState = shiftState;
    this.pButton = buttonID;
};

function AddToWrongScreens(id) {
    for (var i = 0; i < KWrongScreens.length; i++) {
        if (KWrongScreens[i] == id)
            return;
    };
    KWrongScreens[KWrongScreens.length] = id;
};

function GetResultInPercent(unfinished) {
    //    var allsteps = showHistory.length - 2;

    var allsteps = 0;
    for (var i = 0; i < showHistory.length; i++) {
        if (screens[showHistory[i]].actions[0].type != "None")
            allsteps++;
    }
    var wrongsteps = KWrongScreens.length;
    if (!unfinished) {
    }
    else {
        if (!IsLeadOut()) {
            var myscr = screens[showScreen];
            var id = myscr.actions[0].nextFrame;
            while (id != "end") {
                if (myscr.type != "decision" && myscr.type != "none") {
                    allsteps++;
                    wrongsteps++;
                };
                myscr = screens[id];
                id = myscr.actions[0].nextFrame;
            };
        };
    };
    if (allsteps == 0)
        return 100;
    return Math.round(100 - ((wrongsteps / allsteps) * 100));
};

function StartDemoInKnowIt() {
    if (!IsDragBegin)
        AddToWrongScreens(showScreen);
    KGuestDemoMode = 1;
    binterf.SetMoveable(false);
    setTimeout("ShowScreen(showScreen)", 200);
};

function StartDemoInTryIt() {
    KGuestDemoMode = 1;
    setTimeout("ShowScreen(showScreen)", 200);
}

function HLink(s) {
    if (playMode == "T")	// 0 -> leadin, 1 -> leadout, 2 -> explanation
    {
        if (s == 0 || s == 1 || s == 2) {
            HLinkStart = true;
            TeacherForward(true);
        }
        else if (s == 13)		// typingcomplete
        {
            if (AssessStringInput(true, true)) {
                TeacherForward(true);
            }
            else {
                TeacherWrong();
            };
        }
        else if (s == 130) {
            UpdateDoneTyping(false);
        }
        else if (s == 131) {
            UpdateDoneTyping(true);
        };
    }
    else if (playMode == "S") // 0 -> leadin, 1 -> leadout
    {
        if (s == 0 || s == 1 || s == 2) {
            DemoForward();
        }
        else if (s == 600)	// pause/resume link pressed in seeit
        {
            PauseToggle();
        }
    }
    else	// playMode=="K"	
    {
        if (s == 0 || s == 1)	// leadin, leadout
        {
            HLinkStart = true;
            TeacherForward(true);
        }
        else if (s == 2)	// nextstep
        {
            if (KWarningLevel < DEF_KWARNINGSCORELEVEL && KConfirmCheckBox) {
                KPreventSound = true;
                HideAction();
                KConfirmDemo = true;
                ShowAction();
                return;
            }
            else if (KWarningLevel < DEF_KWARNINGSCORELEVEL && !KConfirmCheckBox) {
                AddToWrongScreens(showScreen);
            };
            StartDemoInKnowIt();
        }
        else if (s == 10)		// ok button on level 4 panel
        {
            StartDemoInKnowIt(); ;
        }
        else if (s == 11)		// yes on confirm panel
        {
            KConfirmDemo = false;
            AddToWrongScreens(showScreen);
            StartDemoInKnowIt();
        }
        else if (s == 110) {
            UpdateYesNo(false, false);
        }
        else if (s == 111) {
            UpdateYesNo(true, false);
        }
        else if (s == 12)		// no on confirm panel
        {
            KPreventSound = true;
            HideAction();
            KConfirmDemo = false;
            ShowAction();
        }
        else if (s == 120) {
            UpdateYesNo(false, false);
        }
        else if (s == 121) {
            UpdateYesNo(false, true);
        }
        else if (s == 13)		// typingcomplete
        {
            if (AssessStringInput(true, true)) {
                TeacherForward(true);
            }
            else {
                TeacherWrong();
            };
        }
        else if (s == 130) {
            UpdateDoneTyping(false);
        }
        else if (s == 131) {
            UpdateDoneTyping(true);
        }
        else if (s == 125) {
            KConfirmCheckBox = !KConfirmCheckBox;
        }
        else if (s == 126) {
            KConfirmCheckBox = !KConfirmCheckBox;
            document.getElementsByName("KConfCB")[0].checked = !document.getElementsByName("KConfCB")[0].checked;
        }
        else if (s == 20)		// finish
        {
            ClosePlayer(1);
        }
        else if (s == 30)		// drag&drop start
        {
            StartDemoInKnowIt(); ;
        }
        else if (s == 400)	// print site
        {
            if (trackSent)
                return;
            var passed = GetResultInPercent();

            var moduledesc = R_module + moduleName;
            //			var topicdesc= R_topic + escape(document.title);
            //			var topicdesc= R_topic + encodeURIComponent(document.title);
            //			var topicdesc= R_topic + document.title;

            page = window.open("../../../html/certificate.html" +
							"#ModuleDesc=1" +
							"&TopicDesc=1" +
							"&PctComplete=" + passed +
							"&PctNeeded=" + KScoreNeeded,
							'print',
							'toolbar=1,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=600,left=147,top=131');
        }
        else if (s == 500)	// exit on finish/close panel
        {
            ClosePlayer();
        }
        else if (s == 501)	// remain on finish/close panel
        {
            HideAction();
            KFinishClose = false;
            ShowAction();
        }
        else if (s == 502)    // exit assessment
        {
            ClosePlayer(0, 1);
        }
        else if (s == 503)    // exit
        {
            lms_knowitScore(getMyGuid(), 0, 0);
            lms_topicFinish(getMyGuid());
            ClosePlayer();
        }
        else if (s == 504)    //return to know it
        {
            HideAction();
            KFinishClose = false;
            ShowAction();
        }
        else if (s == 600)	// pause/resume link pressed in seeit
        {
            PauseToggle();
        }
    };
};

function Certification_GetModuleName() {
    if (moduleName.length == 0)
        return "";
    return (R_outline + moduleName);
}

function Certification_GetTopicName() {
    if (topicName.length == 0)
        return "";
    return (R_topic + topicName);
}

function OnClose() {
    SavePosition();
    if (playMode == "K") {
        if (IsLeadOut()) {
            if (KScoringScreen) {
                ClosePlayer(1);
            }
            else {
                HLink(1);
            };
            return;
        };
        HideAction();
        KFinishClose = true;
        ShowAction();
    }
    else {
        ClosePlayer();
    };
};

var actionMenu = 0;
var closedbyEnter = false;

function OnAction() {
    if (closedbyEnter) {
        closedbyEnter = false;
        return;
    };
    if (actionMenu) {
        if (actionMenu.IsOnScreen()) {
            actionMenu.Close();
            return true;
        };
    }
    if (playMode == "T" || (playMode == "K" && KGuestDemoMode == 0)) {
        if (actionMenu == 0)
            actionMenu = new ActionMenu();
        actionMenu.Open();
        RefreshActionMenu();
    };
    if (playMode == "S" || (playMode == "K" && KGuestDemoMode > 0)) {
        if (!isPaused)
            PauseToggle();
        if (actionMenu == 0)
            actionMenu = new ActionMenu();
        actionMenu.Open();
        RefreshActionMenu();
    };
};

function OnAlternative() {
    TeacherAlter();
};

function RefreshActionMenu(changeconcept, changeinfo, frompref) {
    if (actionMenu) {
        var next = (showActObj.nextFrame != "end" && showActObj.type != "Decision");
        if (!UserPrefs.TryIt.EnableSkipping)
            next = false;
        var prev = (showHistory.length > 1);
        var alt = (screens[showScreen].actions.length > 1 && showActObj.type != "Decision");
        var printit = param_printitname.length > 0;
        actionMenu.Refresh(next, prev, prev, alt, changeconcept, changeinfo, frompref, printit);
    };
};

function OnMenuAlternative(s, p1, p2, p3, p4) {
    CloseAction();
    PlayStop();
    if (p1 != null && p2 == null) {
        LaunchHelp(p1);
    }
    else {
        eval(s);
    }
};

function LaunchHelp(s) {
    if (!isPaused)
        PauseToggle();
    onHelp(s);
};

function CloseAction(notfocus) {
    if (actionMenu)
        actionMenu.Close();
    if (!notfocus)
        FocusMe();
};

function ShowPrintit() {
    if (param_printitname.length > 0)
        window.open("../../printit/" + param_printitname);
}

function LogOut() {
    lms_KPathLogout();
}

////////////////////////////////////////////////////////////////////////

function OpenPreferences() {
    var s = window.location;
    var nosound = !SoundPlayerObj.IsAvailable();
    var p = MakeAbsolute("../../../html/preferences.html");
    var params = new Array();
    if (lms_IsUserProfileAvailable()) {
        var url = lms_GetUserProfileUrl();
        if (url != "")
            params[params.length] = "UserProfileUrl=" + Escape.MyEscape(url);
    }
    if (nosound) {
        params[params.length] = "nosound";
    }
    for (var i = 0; i < params.length; i++) {
        p += (i == 0) ? "?" : "&";
        p += params[i];
    }
    saved_preferences_event = getOnCloseEvent();
    setOnCloseEvent("preferences_return()");
    var ctx = "preferences";
    parent.setDlgCtx(ctx);
    parent.showDialog(p, -1, -1, 420, 380, true, 96, "../../../");
};

var saved_preferences_event = "";

function preferences_return() {
    setOnCloseEvent(saved_preferences_event);
}

function IsPreferencesOpened() {
    return getOnCloseEvent() == "preferences_return()";
}

var sharedUrl1 = "";
var sharedUrl2 = "";
var sharedUrl3 = "";

function Share() {
    var k = window.location.href.indexOf("/data/tpc/");
    var dom = window.location.href.substr(0, k) + "/";
    var topicId = document.getElementById("TopicId").getAttribute("topicid");
    // outline with this topic selected
    var p = "bypasstoc=0&guid=" + topicId;
    sharedUrl1 = dom + "index.html?" + p;
    // at the beginning of this topic
    var p = "mode=" + playMode + "&guid=" + topicId;
    sharedUrl2 = dom + "index.html?" + p;
    // at the current location
    var p = "mode=" + playMode + "&guid=" + topicId;
    if (showScreen != "start" && showActObj.nextFrame != "end")
        p += "&frame=" + showScreen.substr(1);
    sharedUrl3 = dom + "index.html?" + p;

    var p = MakeAbsolute("../../../html/sharecontent.html");
    p += "?type=player";
    if (playMode == "K")
        p += "K";   //type=playerK
    var touchDevice = IsTouchDevice() || upk.browserInfo.isIE10Modern();
    p += "&touch=" + (touchDevice ? "1" : "0");
    var dpi = 96;
    var w = PxToPt(650, dpi); // width in pt
    var h = PxToPt(260, dpi); // height in pt
    var ctx = "shareIt";
    parent.setDlgCtx(ctx);
    parent.showDialog(p, -1, -1, w, h, true, 96, "../../../");
}

function GetSharedUrl(k) {
    switch (k) {
        case 1: return sharedUrl1;
        case 2: return sharedUrl2;
        case 3: return sharedUrl3;
    }
    return "";
}

function Menu_Resume() {
    if (isPaused)
        PauseToggle();
}

function InsertStart() {
    var c = new Array();
    for (var i = 0; i < showHistory.length; i++)
        c[c.length] = showHistory[i];
    showHistory = new Array();
    showHistory[0] = "start";
    for (var i = 0; i < c.length; i++)
        showHistory[showHistory.length] = c[i];
};

function DeleteStart() {
    var c = new Array();
    for (var i = 0; i < showHistory.length; i++)
        c[c.length] = showHistory[i];
    showHistory = new Array();
    for (var i = 1; i < c.length; i++)
        showHistory[showHistory.length] = c[i];
};

function OnUpdatePreferences(userpref) {
    UserPrefs.Copy(userpref);
    if ((showLeadIn == 1) || (userpref.ShowLeadIn == "all" && showLeadIn != 0)) {
        if (showHistory.length > 0) {
            if (showHistory[0] != "start") {
                // insert
                InsertStart();
            };
        };
    }
    else {
        if (showHistory.length > 0) {
            if (showHistory[0] == "start") {
                // delete
                DeleteStart();
            };
        };
    };
    try {
        if (opener.OnUpdatePreferences)
            opener.OnUpdatePreferences(userpref);
    }
    catch (e) { };
    //	RefreshActionMenu(false,false,true);
    //	SetActionColor();
};

//////////////////////////////////////////////////////
// DownloadImage function

function DownloadImage_(image, url, vfnRet) {
    image.user_url = Format(url);
    image.user_retFn = vfnRet;
    image.onload = Loaded_;
    image.onerror = LoadError_;
    image.src = url;
};

function Loaded_() {
    var s;
    s = this.user_retFn + '("' + this.user_url + '",true)';
    eval(s);
};

function LoadError_() {
    var s;
    s = this.user_retFn + '("' + this.user_url + '",false)';
    eval(s);
};

function Format(s) {
    var ss = "";
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c == "\\") {
            ss += "\\\\";
        }
        else {
            ss += c;
        };
    };
    return ss;
};

function GetImage(image, url) {
    image.src = url;
};

function DownloadImage(url, vfnret) {
    if (!preloadImages[url]) {
        PreloadImage(url);
    };
    WaitForImage(url, vfnret);
};

function WaitForImage(url, vfnret) {
    var s;
    if (preloadImages[url].loaded) {
        s = vfnret + '("' + preloadImages[url].user_url + '",true)';
        eval(s);
        return;
    };
    if (preloadImages[url].error) {
        s = vfnret + '("' + preloadImages[url].user_url + '",false)';
        eval(s);
        return;
    };
    s = "WaitForImage('" + url + "','" + vfnret + "');";
    setTimeout(s, 300);
};

function HandlePreloadImagesCache() {
    while (preloadImagesList.length > preloadImagesCacheSize) {
        var o = preloadImagesList.shift();
        preloadImages[o] = null;
    }
}

function PreloadImage(url) {
    if (preloadImages[url])
        return;
    preloadImagesList.push(url);
    preloadImages[url] = new Image();
    preloadImages[url].loaded = false;
    preloadImages[url].error = false;
    HandlePreloadImagesCache();
    DownloadImage_(preloadImages[url], url, "Preload_Return");
};

function Preload_Return(url, success) {
    if (success)
        preloadImages[url].loaded = true
    else
        preloadImages[url].error = true;
};

// DownloadImage end //////////////////////////////////////

//
// Topic object model
//

function ScreenObj(image, showBubble) {
    this.image = image;
    this.showBubble = showBubble;
    this.actions = new Array();
    this.infoblocks = new Array();
    this.emptyinfo = true;
}

function Screen(id, image, showBubble) {
    var scr = new ScreenObj(image, showBubble)
    screens[id] = scr
    currentScreenObj = scr
    screenNames[screenNames.length] = id;
    currentScreenName = id;
}

function FilterTryItText(text) {
    var ss = text;
    var s = ss.toLowerCase();

    var l = true;
    while (l) {
        l = false;
        var k1, k2;
        for (var i = 0; i < s.length; i++) {
            if (s.substr(i, 5) == "href=") {
                l = true;
                k1 = i;
                break;
            };
        };
        if (l) {
            k2 = 0
            for (var j = i; j < s.length; j++) {
                if (s.substr(j, 7) == "hrefend") {
                    k2 = j + 10;
                    break;
                };
            };
            if (k2 > 0) {
                var sss = ss;
                ss = sss.substr(0, k1) + sss.substr(k2);
                s = ss.toLowerCase();
            }
            else {
                l = false;
            }
        };
    };

    s = ss;

    l = true;
    while (l) {
        l = false;
        var k1, k2;
        for (var i = 0; i < s.length; i++) {
            if (s.substr(i, 6) == "title=") {
                l = true;
                k1 = i;
                break;
            };
        };
        if (l) {
            k2 = 0
            for (var j = i; j < s.length; j++) {
                if (s.substr(j, 8) == "titleend") {
                    k2 = j + 11;
                    break;
                };
            };
            if (k2 > 0) {
                var sss = ss;
                ss = sss.substr(0, k1) + sss.substr(k2);
                s = ss.toLowerCase();
            }
            else {
                l = false;
            }
        };
    };

    return ss;
};

function IsTextEmpty(s) {
    var status = true;
    for (var i = 0; i < s.length; i++) {
        var c = s.substr(i, 1);
        if (status == true) {
            if (c == "<")
                status = false
            else if (s.charCodeAt(i) != 13 && s.charCodeAt(i) != 10)
                return false;
        }
        else {
            if (c == ">")
                status = true;
        };
    };
    return true;
}

function Replace(str, s, r) {
    var l = s.length;
    var k = str.indexOf(s);
    if (k < 0)
        return str;
    var s1 = str.substr(0, k);
    var s2 = str.substr(k + l);
    return (s1 + r + s2);
};

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

    if ((playMode == "S") || (playMode == "T"))
        display_inputtext = true
    else if (aobj.par1[0] == "S") {
        display_anything = true;
        if (template_strinp_suppress_example == "<span>0</span>") {
            display_example = true;
            display_inputtext = true;
        }
    }
    else if (aobj.par1[0] == "A") {
        display_anything = true;
        display_blank = true;
        if (template_strinp_suppress_example == "<span>0</span>") {
            display_example = true;
            display_inputtext = true;
        }
    }
    else if (aobj.par1[0] == "N") {
        display_inputtext = true;
        display_inputalt = true;
        display_blank = true;
    }
    else {
        display_inputtext = true;
        display_inputalt = true;
    }

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

function DummyActionObj(id, nextFrame, hotspots, type, par1) {
    this.realAction = false;
    this.id = id;
    this.nextFrame = nextFrame;
    this.hotspots = hotspots;
    this.type = type;
    this.par1 = par1;
}

function AddDummyActions(actArray, a) {
    if (upk.browserInfo.isMacOs()) {
        if (upk.browserInfo.isFF()) {
            if (a.type == "RClick1" && a.par1 == "") { // mac ff
                actArray[actArray.length] = new DummyActionObj(a.id, a.nextFrame, a.hotspots, "RClick1", "c");
            }
            if (a.type == "LClick1" && a.par1 == "c") { // mac ff
                actArray[actArray.length] = new DummyActionObj(a.id, a.nextFrame, a.hotspots, "RClick1", "c");
            }
        }
        if (upk.browserInfo.isSafari()) {
            if (a.type == "RClick1" && a.par1 == "") { // mac safari
                actArray[actArray.length] = new DummyActionObj(a.id, a.nextFrame, a.hotspots, "LClick1", "c");
            }
            if (a.type == "RClick1" && a.par1 == "c") { // mac safari
                actArray[actArray.length] = new DummyActionObj(a.id, a.nextFrame, a.hotspots, "LClick1", "c");
            }
        }
    }
}

function TemplateTextCorrection(templatetext) {
    var $fulltext = $("<div>" + templatetext + "</div>");
    var $face = $fulltext.find("span[face]");
    if ($face.length == 0)
        return templatetext;
    var family = "";    // font-family
    for (var i = 0; i < $face[0].attributes.length; i++) {
        var a = $face[0].attributes[i];
        if (a.name == "face")
            family = a.value;
    }
    $face.find("span").css("font-family", family);
    return $fulltext[0].innerHTML;
}

function TemplateTextCorrection2(templatetext, fonttext) {
    var $text = $("<div>" + templatetext + "</div");
    var family = "";
    var $f = $("<div " + fonttext + " />");
    for (var i = 0; i < $f[0].attributes.length; i++) {
        var a = $f[0].attributes[i];
        if (a.name == "face")
            family = a.value;
    }
    $text.find("span").css("font-family", family);
    return $text[0].innerHTML;
}

function ActionObj(id, nextFrame, matchedcontext, hotspots, bubpos, xpos, ypos, width, height, kwidth, kheight, ctx, ecidarray, type, delay, par1, par2, par3, iconname,
					bubcolor, tryittext, knowittext, templatetext, fonttext,
					bubtextfirst, knowitflag, disabledmodes)
// tryittext -> text for simulated modes
// knowittext -> text for knowit mode
// templatetext -> templatetext
// fonttext -> font information for every texts
// bubtextfirst -> use tryittext/knowittext before templatetext
// knowitflag -> show also templatetext on level 0, 1
{
    this.realAction = true;
    this.disabledmodes = (disabledmodes == null ? "" : disabledmodes);
    tryittext = RemoveNbsp(tryittext);
    knowittext = RemoveNbsp(knowittext);
    //	tryittext=replaceString("&nbsp;"," ",tryittext)
    //	knowittext=replaceString("&nbsp;"," ",knowittext)
    if (!knowittext)
        knowittext = "";
    if (IsTextEmpty(knowittext))
        knowittext = "";
    if (!templatetext)
        templatetext = "";
    this.id = id
    this.nextFrame = nextFrame;
    this.matchedcontext = matchedcontext;
    this.hotspots = hotspots;
    this.bubpos = bubpos;
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.kwidth = kwidth;
    this.kheight = kheight;
    this.ctx = ctx;
    this.ecidarray = null;

    this.type = type
    this.delay = delay
    this.par1 = par1;
    try {
        this.par1[1] = DecodeTagElements(par1[1]);
    }
    catch (e) { }
    this.par2 = DecodeInputString(par2);
    this.par3 = par3
    this.par4 = false	// input edit has been started
    this.lastIMEtext = "";
    this.par5 = ""	// input edit text
    this.iconname = iconname;
    this.bubcolor = bubcolor;

    var fontbegin = "<font " + fonttext + ">";
    var fontend = "</font>";

    var animationsoundtime = 0;
    if (UserPrefs.PlayAudio != 'none') {
        animationsoundtime = 1000;
    }
    /* edw */
    if (this.type == "Input") {
        var numofkeys = 10;
        try {
            numofkeys = DecodeInputString(this.par1[1]).length;
        }
        catch (e) { };
        this.animTime = PlayerConfig.InputDelay * numofkeys;
        this.animTime += animationsoundtime;
    }
    else if (this.type == "Key") {
        this.animTime = PlayerConfig.InputDelay;
        this.animTime += animationsoundtime;
    }
    else if (this.type.indexOf("Wheel") != -1) {
        this.animTime = PlayerConfig.WheelDelay;
        this.animTime += animationsoundtime;
    }
    else if (this.type == "None")
        this.animTime = 0;
    else if (this.type == "Decision")
        this.animTime = 0;
    else if (this.type == "Drag")
        this.animTime = PlayerConfig.MouseDelay * 3;
    else { /* we assume mouse event? */
        this.animTime = PlayerConfig.MouseDelay * PlayerConfig.MouseSteps;
        this.animTime += 2 * PlayerConfig.BullseyeDelay;
        this.animTime += animationsoundtime;
    }

    this.fontbegin = fontbegin;
    this.fontend = fontend;

    var s;
    var ss;
    //////////////////////////	 text -> for simulated modes & K mode Level 2,3

    templatetext = TemplateTextCorrection(templatetext);

    if (playMode == "S" && type != "Decision") {
        s = FilterTryItText(tryittext);
        tryittext = s;
    };

    if (this.type == "Input" && templatetext.length > 0) {
        templatetext = BuildInputText(this, templatetext);
    };

    if (tryittext.length == 0 && templatetext.length == 0) {
        s = "";
    }
    else if (tryittext.length == 0) {
        s = templatetext;
    }
    else if (templatetext == 0) {
        s = tryittext;
    }
    else {
        if (bubtextfirst)
        //			s=tryittext+"<br>"+templatetext
            s = tryittext + "<p>" + templatetext + "</p>";
        else
        //			s=templatetext+"<br>"+tryittext;
            s = templatetext + tryittext;
    };

    if (knowittext.length == 0 && templatetext.length == 0) {
        ss = "";
    }
    else if (knowittext.length == 0) {
        ss = templatetext;
    }
    else if (templatetext == 0) {
        ss = knowittext;
    }
    else {
        if (bubtextfirst)
        //			s=tryittext+"<br>"+templatetext
            ss = knowittext + templatetext
        else
        //			s=templatetext+"<br>"+tryittext;
            ss = templatetext + knowittext;
    };

    if (type == "None") {
        if (currentScreenName == "start" && playMode != "S") {
            s += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_leadin, fonttext) + fontend + "</p>";
            if (PlayerConfig.ShowScoreNeeded)
                ss += "###KSCORE###";
            ss += "###KINSTRUCTION###";
            ss += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_knowit_leadin, fonttext) + fontend + "</p>";
            this.delay = 999;
        }
        else if (nextFrame == "end" && playMode != "S") {
            s += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_leadout, fonttext) + fontend + "</p>";
            ss += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_knowit_leadout, fonttext) + fontend + "</p>";
            this.delay = 999;
        }
        else if (delay == 999) {
            s += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_explanation, fonttext) + fontend + "</p>";
            ss += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_knowit_explanation, fonttext) + fontend + "</p>";
        }
        else if (!IsTextEmpty(s) && this.delay != 999 && playMode == "T") {
            s += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_explanation, fonttext) + fontend + "</p>";
            this.delay = 999;
        };
    }
    else if (playMode == "S") {
        if (delay == 999) {
            if (type != "Decision") {
                s += "<br><p class='MsoNormal'>" + fontbegin + TemplateTextCorrection2(template_explanation, fonttext) + fontend + "</p>";
            };
        };
    };
    //	this.text=fontbegin+s+fontend;
    if (IsTextEmpty(s))
        this.text = ""
    else
        this.text = s;
    this.emptytext = (this.text.length == 0);
    if (IsTextEmpty(ss))
        this.ktext = ""
    else
        this.ktext = ss;
    this.kemptytext = (this.ktext.length == 0);
    //////////////////////////	 knowittext -> for K mode Level 0,1
    s = "";
    if (!knowitflag)
        templatetext = "";
    if (knowittext.length == 0 && templatetext == 0) {
        s = "";
    }
    else if (knowittext.length == 0) {
        s = templatetext;
    }
    else if (templatetext == 0) {
        s = knowittext;
    }
    else {
        if (bubtextfirst)
        //			s=knowittext+"<br>"+templatetext
            s = knowittext + templatetext
        else
        //			s=templatetext+"<br>"+knowittext;
            s = templatetext + knowittext;
    };
    //	this.knowittext=fontbegin+s+fontend;
    this.knowittext = s;
}

function Action(id, nextFrame, matchedcontext, hotspots, bubpos, xpos, ypos, width, height, kwidth, kheight, ctx, ecidarray, type, delay, par1, par2, par3, iconname, bubcolor,
					tryittext, knowittext, templatetext, fonttext, bubtextfirst, knowitflag, disabledmodes) {
    // +++ add new params xpos,ypos
    if (currentScreenObj) {
        var actArray = currentScreenObj.actions;
        var a = new ActionObj(id, nextFrame, matchedcontext, hotspots, bubpos, xpos, ypos, width, height, kwidth, kheight, ctx, ecidarray,
									type, delay,
									par1, par2, par3, iconname, bubcolor, tryittext, knowittext,
									templatetext, fonttext, bubtextfirst, knowitflag, disabledmodes);
        actArray[actArray.length] = a;
        AddDummyActions(actArray, a);
    }
}

function InfoObj(buttonfile, url, tooltip, infotype, infokey) {
    this.buttonfile = buttonfile;
    this.url = url;
    this.tooltip = DecodeInputString(tooltip);
    if (isNaN(infotype))
        infotype = 999;
    this.infotype = infotype;
    this.infokey = infokey;
    this.simpleurl = url;
    this.width = 0;
    this.height = 0;
};

function InfoBlock(buttonfile, url, tooltip, infotype, infokey) {
    if (!tooltip)
        tooltip = "";
    if (currentScreenObj) {
        _buttonfile = buttonfile;
        _img = "infobitmapimage.gif";
        _sb = buttonfile.toLowerCase();
        if (_sb.substr(_sb.length - _img.length) == _img) {
            _buttonfile = buttonfile.substr(0, _sb.length - _img.length) + _img;
        }
        var infoArray = currentScreenObj.infoblocks;
        infoArray[infoArray.length] = new InfoObj(_buttonfile, url, tooltip, infotype, infokey);
        currentScreenObj.emptyinfo = false;
    };
};

function ConceptObj(url, width, height, text, infotype, infokey) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.text = text;
    if (isNaN(infotype))
        infotype = 999;
    this.infotype = infotype;
    this.infokey = infokey;
};

function ConceptInfo(url, width, height, text, infotype, infokey) {
    concepts[concepts.length] = new ConceptObj(url, width, height, text, infotype, infokey);
};

//
// Demo mode animations
//

var frameChangedDuringPausedStatus = false;

function Animate2(fname, demosound, cmd, timeout, phase) {
    if (timeout == "")
        timeout = 0;
    if (isPaused) {
        if (frameChangedDuringPausedStatus == true) {
            if (fname.split('.')[0] != getActualSoundFileName().split('.')[0])
                return;
        }
        var cmd3 = 'Animate2("' + fname + '",' + demosound + ',"' + cmd + '",' + timeout + ',"' + phase + '")';
        setTimeout(cmd3, PlayerConfig.PausedDelay);
        return;
    }
    frameChangedDuringPausedStatus = false;
    if (!demosound)
        upk.Timeline.SetFrameState("D");
    animObject = new AnimObject(cmd, timeout, phase);
    if (showActObj.emptybubble || !_ShowBubble(showActObj))
        animObject.showbubble = false;
    if (KGuestDemoMode && demosound == false)
        Animate(cmd, timeout, phase)
    else {
        if (_lastAsyncronFile == true && animSteps == 0) {
            var s = 'Animate2("' + fname + '",' + demosound + ',"' + cmd + '",' + timeout + ',"' + phase + '")';
            setTimeout(s, 200);
        }
        else {
            PlaySound(fname, demosound);
        }
    }
}

var DELAY_STEP = 20;

function Animate(cmd, timeout, phase) {
    animCmd = cmd
    animPhase = phase
    if (timeout == DELAY_INFINITE * 100) {
        animPhase = "";
        SetButtonToBeInfinite();
        return;
    };
    clearTimeout(animTimeout);
    if (animObject)
        animObject.delaystep = 0;
    animObject.timeout = timeout;
    animTimeout = setTimeout("AnimateTimer()", DELAY_STEP)
    upk.Timeline.IncFrameTimeCounter(DELAY_STEP);
}

function AnimateTimer() {
    if (animObject) {
        if (animObject.timeout == DELAY_INFINITE * 100) {
            if (_ShowBubble(showActObj) == true) {
                animPhase = "";
                SetButtonToBeInfinite();
                return;
            }
        }
    }
    if (isPaused) {
        clearTimeout(animTimeout);
        animTimeout = setTimeout("AnimateTimer()", PlayerConfig.PausedDelay)
        return;
    }
    if (animObject) {
        animObject.delaystep += DELAY_STEP;
        if (animObject.delaystep < animObject.timeout) {
            upk.Timeline.IncFrameTimeCounter(DELAY_STEP);
            clearTimeout(animTimeout);
            animTimeout = setTimeout("AnimateTimer()", DELAY_STEP)
            return;
        }
    }
    eval(animCmd);
}

function AnimateKeyboard() {
    Animate2("stype.flv", true, "ShowScreen('" + showActObj.nextFrame + "')", PlayerConfig.InputDelay, "nostop")
    show("cursor");
};

function AnimateInput(internal) {
    hide("cursor");
    animObject = null;
    if (!internal)
        upk.Timeline.SetFrameState("A");
    upk.Timeline.IncFrameTimeCounter(PlayerConfig.InputDelay);

    --animSteps

    Ds = DecodeInputString(showActObj.par1[1]);
    try {
        var a = Ds.length;
    }
    catch (e) {
        return;
    }
    //    if (IsSafari()) {
    //        showActInpObj.value = Ds.substr(0, Ds.length - animSteps);
    //        showActInpObj.original = showActInpObj.value;
    //        try {
    //            var txtRange = showActInpObj.createTextRange();
    //            txtRange.scrollIntoView(false);
    //        }
    //        catch (e) {
    //        }
    //    }
    //    else 
    {
        //LÉTREHOZOK EGY SZÁMLÁLÓT AZ ANIMÁLT SZTRING ELEJÉNEK VÁGÁSÁHOZ	
        if (typeof (trimAnimTxt) == 'undefined') {
            trimAnimTxt = 0;
        }

        if ((Ds.length - animSteps) == 1) {
            //AZ INPUT MEZŐRE ÁLLÁSKOR KINULLÁZOM A KEZDŐ STRINGET HELYÉT
            trimAnimTxt = 0;
            //KIOLVASOM A CSS FÁJLBÓL AZ INPUT MEZŐ FONT MÉRETÉT
            var dCss = document.styleSheets;
            for (var i in dCss) {
                if (dCss[i].cssRules) {
                    for (var j in dCss[i].cssRules) {
                        var selText1 = '.' + showActInpObj.className;
                        var selText2 = selText1.toLowerCase();
                        if (dCss[i].cssRules[j].selectorText == selText1 ||
                            dCss[i].cssRules[j].selectorText == selText2) {
                            iSDFontSize = dCss[i].cssRules[j].style.fontSize;
                            break;
                        }
                    }
                }
                else {
                    for (var j in dCss[i].rules) {
                        if (dCss[i].rules[j].selectorText == '.' + showActInpObj.className) {
                            iSDFontSize = dCss[i].rules[j].style.fontSize;
                            break;
                        }
                    }
                }
            }
        }

        showActInpObj.value = Ds.substr(trimAnimTxt, Ds.length - animSteps);
        showActInpObj.original = showActInpObj.value;

        //LÉTREHOZOK EGY OBJEKTUMOT A BEÍRT SZÖVEG VALÓDI HOSSZÁNAK ELLENŐRZÉSÉHEZ ÉS ÁTADOM NEKI AZ INPUT ÉRTÉKÉT
        try {
            iSD = document.getElementById('InpSizeDetect');
            iSD.innerHTML = showActInpObj.value
            iSD.style.fontSize = iSDFontSize;
        }
        catch (e) {
            var InpSizeDetect_ = document.createElement('SPAN');
            InpSizeDetect_.id = 'InpSizeDetect';
            InpSizeDetect_.style.fontFamily = 'arial';
            InpSizeDetect_.style.fontSize = iSDFontSize;
            InpSizeDetect_.style.paddingRight = '12px';
            InpSizeDetect_.style.visibility = 'hidden';
            document.body.appendChild(InpSizeDetect_);
            iSD = document.getElementById('InpSizeDetect');
        }

        //ELLENÖRZÖM , HOGY AZ ÚJ NODE - TARTALOMMAL NYÚLIK - SZÉLESSÉGE MEGHALADJA-E AZ INPUT MEZŐÉT
        //HA MEGHALADJA, AKKOR ELKEZDEM LEVÁGNI AZ STRING OBJEKTUM ELEJÉRŐL A KARAKTEREKET	
        if (iSD.offsetWidth >= showActInpObj.offsetWidth) {
            trimAnimTxt++;
        }
    }

    if ((DecodeInputString(showActObj.par1[1]).length - 1) == animSteps) {
        PlaySound_asyncron("strinput.flv");
    }

    if (animSteps > 0)
        setTimeout("AnimateInput(true)", PlayerConfig.InputDelay);
    else {
        show("cursor");
        Animate2("", true, "ShowScreen('" + showActObj.nextFrame + "')", PlayerConfig.InputDelay, "nostop")
    }
}

function ShowBullsEye() {
    if (PlayerConfig.HideClickMark != true)
        show("bullseye");
}

function HideBullsEye() {
    hide("bullseye");
}

var cursor_alignment_x = 25;
var cursor_alignment_y = 25;

function AnimateMouse(internal) {
    if (internal == undefined)
        upk.Timeline.SetFrameState("A");
    var cx, cy
    show("cursor");
    animSteps--;
    if (animSteps >= 0) {
        var hot = "hot" + showActObj.id + "_0";
        anim_to_x = getObjLeft(hot) + getObjWidth(hot) / 2
        anim_to_y = getObjTop(hot) + getObjHeight(hot) / 2
        cx = anim_to_x - animSteps * anim_x
        cy = anim_to_y - animSteps * anim_y
        if (!isNaN(cx) && !isNaN(cy)) {
            shiftTo("cursor", cx - cursor_alignment_x, cy - cursor_alignment_y);
            shiftTo("bullseye", cx - getObjWidth("bullseye") / 2, cy - getObjHeight("bullseye") / 2)
        }
    }
    if (animSteps >= 0) {
        var delay = PlayerConfig.MouseDelay;
        if (animStepOriginal > 15) {
            if ((animSteps > 5) && (animSteps < (animStepOriginal - 5))) {
                delay = PlayerConfig.MinMouseDelay;
            }
        }
        upk.Timeline.IncFrameTimeCounter(delay);
        Animate("AnimateMouse(true)", delay, animPhase)
    }
    else {
        animSteps = parseInt(showActObj.type.substr(showActObj.type.length - 1, 1)) * 2;
        if (animSteps > 0) {
            ShowBullsEye();
            if (animPhase != "")
                clearTimeout(animTimeout)
            Animate2("sclick.flv", true, "AnimateBullseye()", PlayerConfig.BullseyeDelay, "nostop")
        }
        else if (showActObj.type.indexOf("Down") != -1) {
            ShowBullsEye();
            Animate2("sclick.flv", true, "ShowScreen(\'" + showActObj.nextFrame + "\')", PlayerConfig.MouseDelay, "nostop")
            //			ShowScreen(showActObj.nextFrame)
        }
        else if (showActObj.type.indexOf("BeginDrag") != -1) {
            ShowBullsEye();
            clearTimeout(bullsTimeout);
            bullsTimeout = setTimeout("DragStart()", PlayerConfig.BullseyeDelay);
            //			Animate2("sclick.wav",true,"ShowScreen(\'"+showActObj.nextFrame+"\')",PlayerConfig.MouseDelay,"nostop")
            //			ShowScreen(showActObj.nextFrame)
        }
        else if (showActObj.type.indexOf("Up") != -1) {
            ShowBullsEye();
            clearTimeout(bullsTimeout);
            bullsTimeout = setTimeout("DragEnd()", PlayerConfig.BullseyeDelay);
            //			hide("bullseye")
            //			Animate2("sclick.wav",true,"ShowScreen(\'"+showActObj.nextFrame+"\')",PlayerConfig.MouseDelay,"nostop")
            //			ShowScreen(showActObj.nextFrame)
        }
        else if (showActObj.type.indexOf("Wheel") != -1) {
            ShowBullsEye();
            Animate2("swheel.flv", true, "ShowScreen(\'" + showActObj.nextFrame + "\')", PlayerConfig.WheelDelay, "nostop")
            //			ShowScreen(showActObj.nextFrame)
        }
        else
            ShowScreen(showActObj.nextFrame)
    }
}

function DragStart() {
    Animate2("sclick.flv", true, "ShowScreen(\'" + showActObj.nextFrame + "\')", PlayerConfig.MouseDelay, "nostop")
};

function DragEnd() {
    HideBullsEye();
    Animate2("sclick.flv", true, "ShowScreen(\'" + showActObj.nextFrame + "\')", PlayerConfig.MouseDelay, "nostop")
};

function AnimateBullseye() {
    --animSteps;

    upk.Timeline.IncFrameTimeCounter(PlayerConfig.BullseyeDelay);

    if (Math.floor(animSteps / 2) == animSteps / 2) {
        HideBullsEye();
        if (animSteps > 0)
            Animate2("sclick.flv", true, "AnimateBullseye()", PlayerConfig.BullseyeDelay, animPhase)
        else
            ShowScreen(showActObj.nextFrame)
    }
    else {
        ShowBullsEye();
        if (animSteps > 0)
            Animate("AnimateBullseye()", PlayerConfig.BullseyeDelay, animPhase)
        else
            ShowScreen(showActObj.nextFrame)
    }
}

function DemoNext() {
    if (IsPaused())
        frameChangedDuringPausedStatus = true;
    upk.Timeline.Lock(true);
    clearTimeout(animTimeout);
    clearTimeout(bullsTimeout);
    PlayStop();
    HideBullsEye();
    ShowScreen(showActObj.nextFrame)
}

function DemoPrev(fromswipe) {
    if (IsPaused())
        frameChangedDuringPausedStatus = true;
    upk.Timeline.Lock(true);
    clearTimeout(animTimeout);
    clearTimeout(bullsTimeout);
    PlayStop();
    HideBullsEye();

    l = showHistory.length;
    if (l == 0)
        return;
    if (l == 1) {
        s = showHistory[0];
        showHistory.length--;
    }
    else {
        s = showHistory[l - 2];
        while (screens[s].actions[0].type == "Drag" || (fromswipe == true && screens[s].actions[0].type.indexOf("Up") != -1)) {
            showHistory.length--;
            s = showHistory[showHistory.length - 2];
        }
        showHistory.length -= 2;

    }
    ShowScreen(s, null, "back");
}

function DemoForward(gonext) {
    if (!gonext)
        gonext = false;
    ClearInfiniteButton();
    if (gonext || (!gonext && isPaused)) {
        clearTimeout(animTimeout);
        clearTimeout(bullsTimeout);
        PlayStop();
        HideBullsEye();
        setTimeout("ShowScreen(\"" + showActObj.nextFrame + "\")", 10);
        return;
    };
    if (showActObj && animPhase == "mouse" && animSteps != animStepOriginal) {
        HideBullsEye();
        ShowScreen(showActObj.nextFrame)
    }
    else if (showActObj && animPhase != "nostop") {
        if (showActObj.type != "Input" && showActObj.type != "Key" && showActObj.type != "None" && showActObj.type != "Decision") {
            animObject.timeout = 50;
            PlaySound("dummy.flv");
        }
        else {
            ShowScreen(showActObj.nextFrame)
        }
    }
}

//
// Teacher mode
//

function TeacherFastBack() {
    if (showHistory.length > 1) {
        //    var firstID = showHistory[0]
        showHistory.length = 0
        //    ShowScreen(firstID)
    }
    FirstScreen(true);
}

function TeacherTestSkip(type) {
    return (type == "Drag" || type.indexOf("Up") != -1)
}

var _backStep = false;

function TeacherBack() {
    if (actionMenu) {
        if (actionMenu.IsOnScreen()) {
            actionMenu.Close();
            return true;
        }
    }
    _backStep = true;
    if (showHistory.length > 1) {
        showHistory.length--;
        var prevID = showHistory[showHistory.length - 1];
        while (showHistory.length > 1 && TeacherTestSkip(screens[prevID].actions[0].type)) {
            showHistory.length--;
            prevID = showHistory[showHistory.length - 1];
        }
        showHistory.length--;
        HideAction();
        if (historyActionMap[prevID])
            ShowScreen(prevID, historyActionMap[prevID])
        else
            ShowScreen(prevID);
        //	binterf.SetErrorMessage("");
    }
}

function TeacherForward(noskip, id, actid) {
    _backStep = false;
    if (event_blocked)
        return;

    if (KFinishClose)
        return

    KnowItForward();
    if (id == null)
        id = showActObj.nextFrame

    if (actid) {
        for (var i = 0; i < screens[showScreen].actions.length; i++) {
            if (actid == screens[showScreen].actions[i].id) {
                historyActionMap[showScreen] = i;
                break;
            };
        };
    };

    var count = 999
    var idsaved = id;
    if (id != "end") {
        while (!noskip && id != "end" && TeacherTestSkip(screens[id].actions[0].type) && count--) {
            showHistory[showHistory.length] = id
            id = screens[id].actions[0].nextFrame
        }
    }
    if (id != idsaved) {
        HideBullsEye();
        KGuestDemoMode = 2;
    }
    ///	binterf.SetErrorMessage("");
    ShowScreen(id)
}

function TeacherAlter() {
    var k = true;
    while (k) {
        showAct++;
        if (showAct == screens[showScreen].actions.length)
            showAct = 0;
        k = screens[showScreen].actions[showAct].realAction == false;
        if (k == true)
            k = screens[showScreen].actions[showAct].emptybubble;
    };
    showHistory.length--
    ShowScreen(showScreen, showAct)
}

function FrameIDUpdated(id) {
    document.getElementById("frameidvalue").innerHTML = id == "start" ? "Start" : id.substr(1);
    //    alert(id);
}

function ToggleShowFrameID() {
    if (document.getElementById("frameiddiv").style.display == "none") { document.getElementById("frameiddiv").style.display = "block"; }
    else document.getElementById("frameiddiv").style.display = "none";
}

function CheckFrameIDKeys(e) {
    if (e != undefined) {
        if (e.type == "keydown") {
            if (e.keyCode == showFrameIDToggle) {
                if (e.shiftKey == true) {
                    return true;
                }
            }
            try {
                if (e.originalCode == showFrameIDToggle) {
                    if (e.shiftKey == true) {
                        return true;
                    }
                }
            }
            catch (ee) { }
        }
    }
    return false;
}

function TeacherWrong(e) {
    if (showFrameIDToggle && CheckFrameIDKeys(e) == true) {
        ToggleShowFrameID();
        return;
    }

    if (showActObj.type == "None")
        return;

    if (KFinishClose)
        return

    if (event_blocked)
        return;
    if (playMode == "K") {
        if (showActObj.type == "Input")
            showActObj.par2 = showActInpObj.value;
        if (!IsLeadIn() && !IsLeadOut())
            KnowItWrong();
        return;
    };
    var text

    if (showActObj.type == "Input")
        text = R_wrong_input
    else if (showActObj.type == "Key")
        text = R_wrong_key
    else if (showActObj.type == "Decision")
        text = R_wrong_decision
    else
        text = R_wrong_mouse

    if (showActObj.type == 'Input') {
        line = "FocusInpObj()";
    }
    else
        line = "";

    if (showHistory.length > 1 && TeacherTestSkip(showActObj.type)) {
        var prevID = showHistory[showHistory.length - 1]
        while (showHistory.length > 1 && TeacherTestSkip(screens[prevID].actions[0].type)) {
            showHistory.length--
            prevID = showHistory[showHistory.length - 1]
        }
        showHistory.length--
        line = "ShowScreen('" + prevID + "')"
    }

    if (_ShowBubble(showActObj)) {
        binterf.SetErrorMessage(text);
    }

    Animate2("ding.flv", true, "", "", "");
    if (line.length > 0) {
        if (IsTouchDevice()) {
            if (line == "FocusInpObj()") {
                FocusInpObj();
            }
            else {
                setTimeout(line, 0);
            }
        }
        else
            setTimeout(line, 0);
    }
}

//
// Generic player functions
//

function Decision(num) {
    // Go down decision path #num (num is 1-based)
    ClearInfiniteButton();
    OffLink();
    Menu_Resume();
    ShowScreen(screens[showScreen].actions[num - 1].nextFrame)
}

var trackSent = false;

function ClosePlayer(topicfinished, closeassessment) {
    if (knowit_AltF4Pressed) {
        topicfinished = 0;
        closeassessment = 1;
    }
    lms_ClosePage();
    KeepAlive_Close();
    SavePosition();
    //close dialog if possibe
    if (parent.isOpenDialog) {
        if (parent.isOpenDialog()) {
            parent.closeDialog();
            return;
        }
    }
    if (!trackSent) {
        trackSent = true;
        try {
            if (opener.OnQuestionContinue_fromTopic) {
                var success = topicfinished;
                if (!success)
                    success = 0;
                if (!closeassessment)
                    closeassessment = 0;
                if (success == 1)
                    success = (GetResultInPercent() >= KScoreNeeded);
                opener.OnQuestionContinue_fromTopic(success, closeassessment);
            }
        }
        catch (e) { };
    }
    setTimeout("TimedClosePlayer(" + topicfinished + ")", 500);
};

function TimedClosePlayer(topicfinished) {
    PlayStop();
    CloseAction();

    KTopicFinished = topicfinished;
    /*	
    if (playMode=="K")
    {
    trackScoreCompleted=GetResultInPercent(true);
    trackScoreRequired=KScoreNeeded;
    if (topicfinished)
    trackComplete()
    else
    trackIncomplete();
    };
    */
    this.blur();

    //	moved to onUnload
    //	if (guidedParent)
    //	{
    //		guidedParent.GITMClosed();
    //	}
    var dl = _lmsParser.GetParameter("directlaunch");
    if (IsTouchDevice() && (dl != null) && (dl != 2)) {
        history.back();
    }
    else {
        try {
            if (window.opener != null)
                window.opener.focus();
        }
        catch (e) { };
        if (upk.browserInfo.isExplorer())
            window.open("", "_self");
        opener = null;
        window.close();
    }
    /*	
    if (top.window.opener)
    {
    if (!top.window.opener.closed)
    {
    if (top.window.opener.GITMClosed)
    top.window.opener.GITMClosed();
    }
    };
    top.close()
    */
}

function HandleResize0() {
    // 10009037  PLAYER - PREFERENCES DIALOG MESSED UP ON BROWSER RESIZE
    // Zsolt, 10/08/2010
    // if the window size is changed, i will refresh the gray area
    /*if (isOpenDialog)
    if (isOpenDialog() == true)
    resizeDialog();*/
    if (IsTouchDevice()) { return; }
    Scroll2Action(true, true);
    HandleResize();
}

function HandleResize() {
    if (scrW == 0)
        return;
    if (NS4) {
        if (loadWidth != window.innerWidth || loadHeight != window.innerHeight) {
            history.go(0)
            return
        }
    }

    //    if (IsTouchDevice()) {
    //        try {
    //            binterf.RefreshPosition();
    //        }
    //        catch (e) { }
    //    }

}

function ClearScrBorder() {
    //    var borderobj = document.getElementById("scrborder");
    //    if (!borderobj)
    //        return;
    //    hide("scrborder");
};

function SetScrBorder(x, y, w, h, b) {
    //    var borderobj = document.getElementById("scrborder");
    //    if (!borderobj)
    //        return;
    //    if (upk.browserInfo.isFF() || upk.browserInfo.isSafari()) {
    //        w -= 2;
    //        h -= 2;
    //    }
    //    borderobj.style.left = x - b;
    //    borderobj.style.top = y - b;
    //    borderobj.style.width = w + 2 * b;
    //    borderobj.style.height = h + 2 * b;
    //    borderobj.style.borderWidth = String(b) + "px";
    //    show("scrborder");
};

function max(a, b) {
    return (a > b) ? a : b
}

function min(a, b) {
    return (a < b) ? a : b
}

function SetActionColor() {
    var bub = showActObj.id
    var color = UserPrefs.MarqueeColor;
    for (var i = 0; i < showActObj.hotspots; i++) {
        var hotp = "hot" + bub + "_" + i + "p";
        document.getElementById(hotp).style.borderColor = color;
    }
};

function KnowItWrong() {
    if (KWarningLevel == 4) {
        Animate2("ding.flv", true, "", "", "");
        return;
    };
    HideKnowItBubble()
    KWarningLevel++;
    if (KWarningLevel == 1 && KRemediation1 == false)
        KWarningLevel++;
    if (KWarningLevel == 2 && KRemediation2 == false)
        KWarningLevel++;
    if (KWarningLevel == 3 && KRemediation3 == false)
        KWarningLevel++;
    if (KWarningLevel >= DEF_KWARNINGSCORELEVEL)
        AddToWrongScreens(showScreen);
    Animate2("ding.flv", true, "", "", "");
    ShowKnowItBubble();
};

function KnowItForward() {
    KWarningLevel = 0;
};

function IsDragBegin(ss) {
    var s = showActObj.type;
    if (ss)
        s = ss;
    return (s == "LBeginDrag" || s == "RBBeginDrag" || s == "MBBeginDrag")
};

function IsDragSequence2(ss) {
    var s = showActObj.type;
    if (ss)
        s = ss;
    return (s == "Drag");
};

var nib_Positioned = false;
var nib_l, nib_t, nib_r, nib_b;
var nib_bCloseEnabled = true;

function DecodeTagElements(s) {
    s = replaceString("&lt;", "<", s);
    s = replaceString("&gt;", ">", s);
    return s;
}

function AddTopMargin(s) {
    if (s.substr(0, 17) == '<p align="right">') {
        ss = s.substr(0, 16) + ' style="margin-top: 10px;" ' + s.substr(16);
        return ss;
    }
    return s;
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

function formatKnowItIgnoreText(actionstr) {
    var s = '<a class="InstructText"><b><font color="#000080"><p style="margin-top: 0px;">';
    s += formatStr(R_knowit_ignore_text1, actionstr);
    s += '<br/>';
    s += R_knowit_ignore_text2;
    s += '<br/>';
    s += R_knowit_ignore_text3;
    s += '</p><p>';
    s += R_knowit_ignore_text4;
    s += '</p></font></b></a><br/><input onClick="HLink(30)" value="' + R_preferences_OK + '" width="200" type="button"/>';
    return s;
}

function ShowKnowItBubble() {
    binterf.m_bFFClearHeight = false;
    var s = "";
    nib_Positioned = false;
    nib_bCloseEnabled = true;
    if (KFinishClose) {
        PlayStop();
        binterf.m_bFFClearHeight = true;
        s = (lms_inAssessment == true ? template_knowit_finish_close_inassessment : template_knowit_finish_close);
        ss = s.substr(0, 3) + ' style="list-style-type:disc;" ' + s.substr(3);
        s = ss;
        nib_Positioned = true;
        nib_bCloseEnabled = false;
    }
    else if (KConfirmDemo) {
        binterf.m_bFFClearHeight = true;
        s = template_knowit_confirmdemo;
        nib_Positioned = true;
    }
    else if (IsLeadIn()) {
        s = DecodeTagElements(R_titleformat_begin) + topicName + DecodeTagElements(R_titleformat_end);
        s += showActObj.ktext;
        sscore = GetTemplate_knowit_leadin_score("" + KScoreNeeded);
        sscore = '<p id="scoretext" class="InstructText">' + sscore + '</p>';
        if (s.indexOf("###KSCORE###") >= 0)
            s = replaceString("###KINSTRUCTION###", '<br/><p class="InstructText">' + R_knowit_knowitdraginstruction + "</p>", s);
        else
            s = replaceString("###KINSTRUCTION###", '<p class="InstructText">' + R_knowit_knowitdraginstruction + "</p>", s);
        s = replaceString("###KSCORE###", sscore, s);
        if (PlayerConfig.ShowScoreNeeded)
            binterf.m_bFFClearHeight = true;
        nib_Positioned = false;
    }
    else if (IsLeadOut()) {
        if (KScoringScreen) {
            binterf.m_bFFClearHeight = true;
            var passed = GetResultInPercent();
            var result = "";
            s = DecodeTagElements(R_titleformat_begin) + topicName + DecodeTagElements(R_titleformat_end);

            if (passed >= KScoreNeeded) {
                lms_knowitScore(getMyGuid(), passed, 1);
                result = template_scoring_YES;
            }
            else {
                lms_knowitScore(getMyGuid(), passed, 0);
                result = template_scoring_NO;
            };
            s += GetTemplate_scoring("" + passed, "" + KScoreNeeded, result);
        }
        else {
            s = DecodeTagElements(R_titleformat_begin) + topicName + DecodeTagElements(R_titleformat_end);
            s += showActObj.ktext;
        };
        nib_Positioned = false;
    }
    else if (IsExplanation()) {
        s = showActObj.knowittext + "<br><p class='MsoNormal'>" + showActObj.fontbegin + template_knowit_explanation + showActObj.fontend + "</p>";
        nib_Positioned = false;
        binterf.m_bFFClearHeight = true;
    }
    else {
        switch (KWarningLevel) {
            case 0:
                binterf.m_bFFClearHeight = true;
                if (IsDragBegin()) {
                    if (IsTouchDevice()) {
                        s = formatKnowItIgnoreText(R_action_dragdrop);
                    }
                    else {
                        s = template_knowit_dragwarning
                    }
                }
                else if ((IsTouchDevice()) && showActObj.type == "Key") {
                    s = formatKnowItIgnoreText(R_action_keyboard);
                }
                else {
                    s = "";
                    if (KContinueFlag == 1) {
                        s = template_knowit_continue;
                        if (showActObj.knowittext.length > 0)
                            s += "<br><br>";
                    };
                    s += showActObj.knowittext;
                    if (showActObj.type == "Input")
                        s += template_typingcomplete;
                    s += AddTopMargin(template_knowit_nextstep);
                };
                break;
            case 1:
                binterf.m_bFFClearHeight = true;
                if (showActObj.knowittext.length > 0) {
                    s = template_knowit_warningL1 + "<hr>" + showActObj.knowittext;
                    if (showActObj.type == "Input")
                        s += template_typingcomplete;
                    s += AddTopMargin(template_knowit_nextstep);
                }
                else {
                    s = template_knowit_warningL1;
                    if (showActObj.type == "Input")
                        s += template_typingcomplete;
                    s += AddTopMargin(template_knowit_nextstep);
                };
                break;
            case 2:
                binterf.m_bFFClearHeight = true;
                s = template_knowit_warningL2 + showActObj.text;
                if (showActObj.type == "Input")
                    s += template_typingcomplete;
                s += AddTopMargin(template_knowit_nextstep);
                break;
            case 3:
                binterf.m_bFFClearHeight = true;
                if (showActObj.hotspots == 0) {
                    s = template_knowit_warningL3_0 + showActObj.text;
                    if (showActObj.type == "Input")
                        s += template_typingcomplete;
                    s += AddTopMargin(template_knowit_nextstep);
                }
                else {
                    s = template_knowit_warningL3_H + showActObj.text;
                    if (showActObj.type == "Input")
                        s += template_typingcomplete;
                    s += AddTopMargin(template_knowit_nextstep);
                    var bub = showActObj.id
                    SetActionColor();
                    for (var i = 0; i < showActObj.hotspots; i++) {
                        var hot = "hot" + bub + "_" + i;
                        if (getDIV(hot)) show(hot, playMode == "S")
                    }
                };
                break;
            default: // level 4
                binterf.m_bFFClearHeight = true;
                s = template_knowit_warningL4;
        };
        nib_Positioned = true;
    };

    nib_l = nib_t = nib_r = nib_b = (-1);
    if (nib_Positioned) {
        if (showActObj.hotspots) {
            var d = "hot" + showActObj.id + "_0";
            nib_l = getObjLeft(d)
            nib_t = getObjTop(d)
            nib_r = nib_l + getObjWidth(d);
            nib_b = nib_t + getObjHeight(d);
        }
    };
    nib_Positioned = !nib_Positioned;

    binterf.ResetContent();
    binterf.SetText(s);
    binterf.SetColor(showActObj.bubcolor);
    //binterf.Download("ShowKnowItBubble2");
    ShowKnowItBubble2();
};

function ShowKnowItBubble2(retOK, retError) {
    if (IsExplanation()) {
        binterf.SetPosition(-1, -1, -1, -1, true, false, showActObj.xpos, showActObj.ypos, showActObj.kwidth, showActObj.kheight);
    }
    else {
        w = (KWarningLevel < 2 ? showActObj.kwidth : showActObj.width);
        h = (KWarningLevel < 2 ? showActObj.kheight : showActObj.height);
        w = (w < Knowit_minimum ? Knowit_minimum : w);
        if (KWarningLevel == 1 || KConfirmDemo == true) {
            w = (w < Rem1_minimum ? Rem1_minimum : w);
        }
        if (KWarningLevel == 2 || KWarningLevel == 3) {
            w = (w < Rem2_minimum ? Rem2_minimum : w);
        }
        if (KWarningLevel == 4) {
            w = Rem4_width;
        }
        if (KFinishClose) {
            w = 58;
        }
        binterf.SetPosition(nib_l, nib_t, nib_r, nib_b, nib_Positioned, 0, 0, 0, w, h);
    }
    binterf.SetEnableCloseButton(nib_bCloseEnabled ? 1 : 0);
    binterf.Show();
    if (showActObj.type == "Input") {
        var bub = showActObj.id;
        SetActionColor();
        for (var i = 0; i < showActObj.hotspots; i++) {
            var hot = "hot" + bub + "_" + i;
            var hotdiv = getDIV(hot);
            if (hotdiv) {
                var inp = getDIV(hot + "p");
                if (KWarningLevel < 3 || KWarningLevel == 4 || KFinishClose) {
                    if (!hotdiv.LeftOriginal)
                        hotdiv.LeftOriginal = hotdiv.offsetLeft;
                    if (!hotdiv.TopOriginal)
                        hotdiv.TopOriginal = hotdiv.offsetTop;
                    hotdiv.style.left = "" + (hotdiv.LeftOriginal + 2) + "px";
                    hotdiv.style.top = "" + (hotdiv.TopOriginal + 2) + "px";

                    if (!inp.WidthOriginal)
                        inp.WidthOriginal = inp.offsetWidth;
                    if (!inp.HeightOriginal)
                        inp.HeightOriginal = inp.offsetHeight;
                    if (!inp.borderColorOriginal)
                        inp.borderColorOriginal = inp.style.borderColor;

                    inp.style.border = "0px";
                    inp.style.width = "" + (inp.WidthOriginal - 4) + "px";
                    inp.style.height = "" + (inp.HeightOriginal - 4) + "px";
                }
                else {
                    if (inp.borderColorOriginal) {
                        inp.style.border = "3px";
                        inp.style.borderColor = inp.borderColorOriginal;
                        inp.style.borderStyle = "solid";
                    };
                    if (inp.WidthOriginal)
                        inp.style.width = "" + inp.WidthOriginal + "px";
                    if (inp.HeightOriginal)
                        inp.style.height = "" + inp.HeightOriginal + "px";
                    if (hotdiv.LeftOriginal)
                        hotdiv.style.left = "" + hotdiv.LeftOriginal + "px";
                    if (hotdiv.TopOriginal)
                        hotdiv.style.top = "" + hotdiv.TopOriginal + "px";
                };
                show(hot, playMode == "S")
            };
        }
        if (showActObj.par4) {
            // Preset input field
            showActObj.par4 = false;
            if (KWarningLevel == 0) {
                showActInpObj = document.layers ? document.layers.screen.document.layers["hot" + showActObj.id + "_0"].document["f" + showActObj.id]["inp" + showActObj.id] : document["f" + showActObj.id + "_0"]["inp" + showActObj.id + "_0"]
                showActInpObj.value = showActObj.par5
                showActInpObj.original = showActInpObj.value;
                showActInpObj.onkeyup = EventKeyUp
                showActInpObj.onkeypress = EventInputKey
                showActInpObj.onpropertychange = EventPropertyChange
                showActInpObj.onfocus = InputOnFocus;
                showActInpObj.onblur = InputOnBlur;
            }
            try {
                showActInpObj.focus()
            }
            catch (e) { };
        };
    };
    ShowScreen3();
};

function HideKnowItBubble() {
    var bub = showActObj.id
    for (var i = 0; i < showActObj.hotspots; i++) {
        var hot = "hot" + bub + "_" + i;
        if (getDIV(hot)) hide(hot, playMode == "S")
    }
    binterf.ResetContent();
    binterf.Hide();
};

////////////////////////////////////////////////////////////////////////////////
// sound support

var soundplayed = false;

function PlayStop(noTimeout) {
    SoundPlayerObj.Stop(noTimeout);
};

function PlayPause() {
    SoundPlayerObj.Pause();
}

function PlayResume() {
    if (soundplayed) {
        SoundPlayerObj.Resume();
        return true;
    }
    else if (!bPlayerIsAvailable) {
        return true;
    }
    else if (showScreen == StartScreen) {
        return false;
    }
    return true;
};

function GetDecisionSound(actionfname) {
    return actionfname;
};

function PlaySound_asyncron(fname) {
    var pa = UserPrefs.PlayAudio;
    if (pa != "none")
        SoundPlayerObj.Play(fname, true, false, true);
}

function PlaySound(fname, demosound, temp) {
    if (KPreventSound == true) {
        KPreventSound = false;
        return;
    }
    if (fname == "dummy.flv") {
        PlayStop();
        soundplayed = false;
        if (animObject) {
            if (animObject.cmd.length > 0) {
                Animate(animObject.cmd, animObject.timeout, animObject.phase);
            };
        };
        return;
    };
    var dname = GetDecisionSound(fname);
    fname = dname;
    if (!temp) {
        animObject.fname = fname;
        animObject.demosound = demosound;
    };
    var dmsound = true;
    if (!demosound)
        dmsound = false;

    var pa = UserPrefs.PlayAudio;
    if (playMode == "T" || playMode == "K") {
        if ((pa == "all" && soundIsExported) || (dmsound && (pa == "demo" || pa == "all"))) {
            if (KScoringScreen == false && KFinishClose == false && (KWarningLevel == 0 || dmsound)) {
                soundplayed = true;
                SoundPlayerObj.Play(fname, dmsound, temp);
                upk.Timeline.IncFrameTimeCounter(1000);
            }
        }
        else if (animObject.cmd.length > 0)
            Animate(animObject.cmd, animObject.timeout, animObject.phase);
    }
    else if (playMode == "S" || KGuestDemoMode) {
        if ((pa == "all" && soundIsExported) || (dmsound && (pa == "demo" || pa == "all"))) {
            soundplayed = true;
            SoundPlayerObj.Play(fname, dmsound, temp);
            upk.Timeline.IncFrameTimeCounter(1000);
        }
        else if (animObject.cmd.length > 0)
            Animate(animObject.cmd, animObject.timeout, animObject.phase);
    };
    //    if (playMode == "K") {
    //        if (dmsound && (pa == "demo" || pa == "all")) {
    //            soundplayed = true;
    //            SoundPlayerObj.Play(fname, dmsound, temp);
    //        }
    //    };
};

function OnErrorPlaySound(v1, v2) {
    soundplayed = false;
    if (animObject) {
        if (animObject.cmd.length > 0 && (playMode != "K" || (playMode == "K" && KGuestDemoMode > 0))) {
            if (timelineDescriptor.valid == true) {
                if (timelineDescriptor.type == "narration") { // sound playing failed
                    if (animObject.timeout != DELAY_INFINITE * 100)
                        animObject.timeout = timelineDescriptor.resttime;
                }
                if (timelineDescriptor.type == "animationstart") {
                    if (animObject.timeout != DELAY_INFINITE * 100)
                        animObject.timeout = 1;
                }
                if (timelineDescriptor.type == "nextframe") {
                    DemoNext();
                    timelineDescriptor.valid = false;
                    return;
                }
                timelineDescriptor.valid = false;
            }
            Animate(animObject.cmd, animObject.timeout, animObject.phase);
        };
    };
};

function OnEndPlaySound(v1) {
    soundplayed = false;
    timelineDescriptor.valid = false;
    if (animObject) {
        if (animObject.cmd.length > 0 && (playMode != "K" || (playMode == "K" && KGuestDemoMode > 0))) {
            animCmd = animObject.cmd;
            animPhase = animObject.phase;
            clearTimeout(animTimeout);
            animTimeout = setTimeout("AnimateTimer();", 100);
            upk.Timeline.IncFrameTimeCounter(1000);
        };
    };
};

////////////////////////////////////////////////////////////////////////////////

function _HasSound(a) {
    if (UserPrefs.PlayAudio != "all")
        return false;
    ix = (a.id).substr(1) + ".ASX";
    if (sounds[ix]) {
        if (sounds[ix].fct == 0)
            return false;
        return (sounds[ix].flist[0].length > 0);
    }
    return false;
}

function _HasActionArea(a) {
    if (IsExplanation(a))
        return false;
    if (IsLeadIn(a))
        return false;
    if (IsLeadOut(a))
        return false;
    if (IsDecision(a))
        return false;
    return (a.hotspots > 0);
}

function _ShowBubble(a) {
    f = screens[a.prevFrame];
    if (playMode == "S" || playMode == "T") {
        if (a.type == "Decision")
            return true;
        if (topicShowBubbles == "Always")
            return true;
        if (topicShowBubbles == "Never")
            return false;
        return (f.showBubble == "true" ? true : false);
    }
    return true;
}

function _ShowActionArea(obj) {
    if (playMode == "S" && PlayerConfig.HideActionBordersInSeeIt == true) {
        return false;
    }
    if (topicShowBubbles == "Never")
        return false;
    if ($("#" + obj).attr("border") == "0")
        return false;
    return true;
}

function _SkipFrame(f) {
    a = f.actions[0];
    // only one decision branch
    if (f.actions.length == 1 && a.type == "Decision")
        return true;
    // explanation, start and end frame, null delay in S and T modes
    if (playMode == "S" && a.type == "None" && a.delay == 0)
        return true;
    if (playMode == "T" && a.type == "None" && a.delay == 0)
        return true;
    // decision frame and null delay in S mode
    if (playMode == "S" && a.type == "Decision" && a.delay == 0)
        return true;
    // all decision in K mode
    if (playMode == "K" && a.type == "Decision")
        return true;
    // explanation frame with empty text in K mode
    if (playMode == "K" && a.type == "None" && a.prevFrame != "start" && a.nextFrame != "end" && a.knowittext.length == 0)
        return true;

    if (playMode == "K")
        return false;

    _HasActionArea(a);

    if (!_ShowBubble(a)) {
        if (_HasSound(a)) {
            return false;
        }
        else {
            if (IsLeadIn(a))
                return true;
            if (IsLeadOut(a))
                return true;
            if (IsExplanation(a))
                return true;
            if (IsDecision(a))
                return false;
            if (a.delay == DELAY_INFINITE) {
                if (playMode == "S") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
    return false;
}

function FilterDecisionText() {
    if (IsDecision()) {
        var frameid = showActObj.prevFrame;
        var eobj = ecidStartDecisions[frameid];
        if (eobj == null) {
            var newstr = showActObj.text;
            if (upk.browserInfo.isIE10())
                newstr = replaceString("DecisionList", "DecisionListIE10", showActObj.text);
            return newstr;
        }
        var dpathlist = new Array();
        var prefix = "";
        var postfix = "";
        var s = showActObj.text.toLowerCase();

        var liclass1 = '<li class=decisionlist>';
        var liclass2 = '<li class="decisionlist">';
        if (upk.browserInfo.isIE10()) {
            liclass1 = '<li class=decisionlistie10>';
            liclass2 = '<li class="decisionlistie10">';
        }

        var k1 = s.indexOf(liclass1);
        if (k1 < 0)
            k1 = s.indexOf(liclass2);
        prefix = showActObj.text.substr(0, k1);
        var k2 = s.lastIndexOf('</li>') + 5;
        postfix = showActObj.text.substr(k2);
        while (true) {
            if (k1 < 0)
                break;
            var k21 = s.indexOf(liclass1, k1 + 1);
            if (k21 < 0)
                k21 = s.indexOf(liclass2, k1 + 1);
            if (k21 > 0) {
                dpathlist[dpathlist.length] = showActObj.text.substr(k1, k21 - k1 - 1);
                k1 = k21;
            }
            else {
                dpathlist[dpathlist.length] = showActObj.text.substr(k1, k2 - k1);
                break;
            }
        }

        for (var i = 0; i < dpathlist.length; i++) {
            var s = dpathlist[i].toLowerCase();
            var l = s.length;
            if (s.substr(l - 5) != '</li>') {
                dpathlist[i] = dpathlist[i] + "</li>";
            }
        }

        var stext = prefix;
        var actions = screens[frameid].actions;
        for (var i = 0; i < actions.length; i++) {
            var l = true;
            for (ii = 0; ii < eobj.pathstoignore.length; ii++) {
                if (eobj.pathstoignore[ii] == actions[i].id) {
                    l = false;
                }
            }
            if (l)
                stext += dpathlist[i];
        }
        stext += postfix;
        return stext;
    }
    return showActObj.text;
}

function ShowAction() {
    binterf.m_bFFClearHeight = false;
    if (!IsDragBegin() && !IsDragSequence())
        disableswipeondrag = false;
    var pointerDirection = showActObj.bubpos;
    var pointerXpos = showActObj.xpos;
    var pointerYpos = showActObj.ypos;

    if (playMode == "K" && !KGuestDemoMode) {
        ShowKnowItBubble();
        if ((IsDragBegin() || (IsTouchDevice() && showActObj.type == "Key")) && !KFinishClose)
            Animate2("ding.flv", true, "", "", "");
        return;
    };
    if (showActObj.type == "None" && showActObj.emptytext) {
        if (!IsLeadIn() && !IsLeadOut()) {
            ShowScreen3();
            return;
        };
    };
    var bub = showActObj.id
    binterf.ResetContent();
    var bubtext = FilterDecisionText();
    if (playMode == "T" && showActObj.type == "Input") {
        bubtext = showActObj.text + template_typingcomplete;
    }
    if (playMode == "S" || (playMode == "K" && KGuestDemoMode)) {
        var k1 = template_pauselink.indexOf("HLink(600)");
        var k2 = template_pauselink.indexOf("</a>");
        var tpl1 = template_pauselink.substr(0, k1 + 12);
        var tpl2 = template_pauselink.substr(k2);
        var tpl = tpl1 + (isPaused ? R_interface_resume : R_interface_pause) + tpl2;
        bubtext += fusionmode ? "" : tpl;
        binterf.m_bFFClearHeight = true;
    }

    if (playMode == "T" && IsDragBegin() && IsTouchDevice() && KGuestDemoMode == 0) {
        binterf.ResetContent();
        bubtext = '<p class="InstructText" style="margin-top: 0px; color: #000080; font-weight:bold;">' + R_swipe_drag + '</p>';
        disableswipeondrag = true;
        binterf.SetText(bubtext);
        binterf.SetIcon(showActObj.iconname);
        binterf.SetColor(showActObj.bubcolor);
        binterf.SetPosition(-1, -1, -1, -1, true, 0, 0, 0);
        //     binterf.SetPosition(-1, -1, -1, -1, true, pointerDirection, pointerXpos, pointerYpos, showActObj.width, showActObj.height);
        ShowAction2();
        return;
    }
    if (playMode == "S" && IsDragBegin() && IsTouchDevice() && KGuestDemoMode == 0) {
        disableswipeondrag = true;
    }
    binterf.SetText(bubtext);
    binterf.SetIcon(showActObj.iconname);
    binterf.SetColor(showActObj.bubcolor);
    if (playMode == "T") {
        binterf.SetAlternative(showActObj.showalternatives);
        for (var i = 0; i < screens[showScreen].infoblocks.length; i++) {
            var ib = screens[showScreen].infoblocks[i];
            binterf.AddInfoBlock(ib.buttonfile, ib.url, ib.tooltip);
        };
    };
    if (showActObj.type == "Decision" || showActObj.type == "Input")
        binterf.m_bFFClearHeight = true;
    if (showActObj.hotspots) {
        var d = "hot" + bub + "_0";

        l = getObjLeft(d)
        if (l < 0) l = 0;
        t = getObjTop(d)
        if (t < 0) t = 0;
        r = l + getObjWidth(d);
        b = t + getObjHeight(d);
        if (showActObj.bubpos > 0) {
            binterf.SetPosition(l, t, r, b, true, pointerDirection, pointerXpos, pointerYpos, showActObj.width, showActObj.height);
        }
        else {
            if (showActObj.type == "None")
                binterf.SetPosition(-1, -1, -1, -1, true, pointerDirection, pointerXpos, pointerYpos, showActObj.width, showActObj.height)
            else
                binterf.SetPosition(l, t, r, b, false, pointerDirection, pointerXpos, pointerYpos, showActObj.width, showActObj.height);
        };
    }
    else {
        binterf.SetPosition(-1, -1, -1, -1, true, pointerDirection, pointerXpos, pointerYpos, showActObj.width, showActObj.height);
    };

    if (KGuestDemoMode == 0 && !showActObj.emptybubble)
    //binterf.Download("ShowAction2")
        ShowAction2()
    else
        ShowAction2();
}

function ShowAction2(retOK, retError) {
    if (KGuestDemoMode == 0 && !showActObj.emptybubble && _ShowBubble(showActObj))
        binterf.Show();
    else
        binterf.Hide();

    if (showActObj.type != "None") {
        SetActionColor();
        var bub = showActObj.id
        for (var i = 0; i < showActObj.hotspots; i++) {
            if (i == 0 || showActObj.type != "Input") {
                var hot = "hot" + bub + "_" + i;
                var hotdiv = getDIV(hot);
                var hotp = hot + "p";

                w = getObjWidth("screen");
                h = getObjHeight("screen");

                if (!showActObj.areacorrected) {
                    bord1 = document.getElementById(hotp).border;

                    if (document.getElementById(hotp).type == "password") {
                        document.getElementById(hotp).style.fontFamily = "Arial";
                        document.getElementById(hotp).style.fontSize = "12px";
                    }

                    hl = hotdiv.offsetLeft;
                    if (hl < 0) {
                        hw = document.getElementById(hotp).clientWidth;
                        document.getElementById(hotp).style.width = "" + (hw + hl) + "px";
                        hotdiv.style.left = 0;
                    }
                    ht = hotdiv.offsetTop;
                    if (ht < 0) {
                        hh = document.getElementById(hotp).clientHeight;
                        document.getElementById(hotp).style.height = hh + ht;
                        hotdiv.style.top = 0;
                    }

                    bord = bord1 * 2;
                    hl = hotdiv.offsetLeft;
                    hw = document.getElementById(hotp).clientWidth + bord;
                    ht = hotdiv.offsetTop;
                    hh = document.getElementById(hotp).clientHeight + bord;

                    var c = bord1;

                    if (hl + hw > w - c)
                        document.getElementById(hotp).style.width = "" + (hw - bord - 3 - c) + "px";
                    if (ht + hh > h)
                        document.getElementById(hotp).style.height = "" + (hh - bord - 3) + "px";
                    showActObj.areacorrected = true;
                }

                if (hotdiv) {
                    if (showActObj.type == "Input") {
                        var inp = getDIV(hot + "p");
                        if (inp.borderColorOriginal) {
                            inp.style.border = "3px";
                            inp.style.borderColor = inp.borderColorOriginal;
                            inp.style.borderStyle = "solid";
                        };
                        if (inp.WidthOriginal)
                            inp.style.width = "" + inp.WidthOriginal + "px";
                        if (inp.HeightOriginal)
                            inp.style.height = "" + inp.HeightOriginal + "px";
                        if (hotdiv.LeftOriginal)
                            hotdiv.style.left = "" + hotdiv.LeftOriginal + "px";
                        if (hotdiv.TopOriginal)
                            hotdiv.style.top = "" + hotdiv.TopOriginal + "px";

                        var noborder = (_ShowActionArea(hotp) == false);
                        var cstr = hotdiv.style.cssText.toLowerCase();
                        if (cstr.indexOf("marquee: false") >= 0)	// no border
                            noborder = true;
                        if (noborder == true) {
                            if (!showActObj.marqueecorrected) {
                                showActObj.marqueecorrected = true;
                                //hotdiv.style.left=""+(hotdiv.style.pixelLeft+3)+"px";
                                hotdiv.style.left = "" + Number(getObjLeft(hotdiv) + 3) + "px";
                                //hotdiv.style.top=""+(hotdiv.style.pixelTop+3)+"px";
                                hotdiv.style.top = "" + Number(getObjTop(hotdiv) + 3) + "px";
                                inp.style.border = "0px";
                                inp.style.width = "" + (inp.offsetWidth - 6) + "px";
                                inp.style.height = "" + (inp.offsetHeight - 6) + "px";
                            }
                        }
                        show(hot, playMode == "S");
                    }
                    else {
                        if (_ShowActionArea(hotp))
                            show(hot, playMode == "S");
                    }
                };
            };
        }
    };
    if (playMode == "S") {
        if (isPaused) {
            binterf.SetPRText(R_interface_resume);
        }
        else {
            binterf.SetPRText(R_interface_pause);
        }
    }
    ShowScreen3();
};

function _getObjTop(o) {
    k = getObjTop(o) - 10;
    if (k < 0)
        k = 0;
    return k;
}

function _getObjLeft(o) {
    k = getObjLeft(o) - 10;
    if (k < 0)
        k = 0;
    return k;
}

function ScrollToAction() {
    if (playMode == "K") {
        if (showScreen == "start")
            window.scrollTo(0, 0);
        if (showActObj.nextFrame == "end")
            window.scrollTo(0, 0);
        setTimeout("ShowScreen4()", 5);
        if (upk.browserInfo.isiOS()) {
            if (showActObj.type == 'Input' && !showActObj.par4) {
                SelectText0();
            }
        }
        return;
    }
    Scroll2Action();
}

var Actionarea_left = 150;
var Actionarea_top = 32;
var Actionarea_right = 0;
var Actionarea_bottom = 0;

var Bubble_horizontal = 150
var Bubble_vertical = 32

function RectArea(x, y, dx, dy, bubpt) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.bubpt = bubpt;
}

function combineRect(r1, r2) {
    if (r1.dx == 0 && r1.dy == 0) {
        return r2;
    }
    if (r2.dx == 0 && r2.dy == 0) {
        return r1;
    }
    var x = min(r1.x, r2.x);
    var y = min(r1.y, r2.y);
    var dx = max(r1.x + r1.dx, r2.x + r2.dx) - x;
    var dy = max(r1.y + r1.dy, r2.y + r2.dy) - y;
    var r = new RectArea(x, y, dx, dy, 0);
    return r;
}

function fitRectinRect(r1, r2) { // fits r1 IN r2
    if (r1.dx == 0 && r1.dy == 0)
        return true;
    if (r1.dx > r2.dx)
        return false;
    if (r1.dy > r2.dy)
        return false;
    return true;
}

function containRect(r1, r2) {  // is r1 IN r2
    if (r1.dx == 0 && r1.dy == 0)
        return true;
    if (r1.x < r2.x)
        return false;
    if (r1.y < r2.y)
        return false;
    if (r1.x + r1.dx > r2.x + r2.dx)
        return false;
    if (r1.y + r1.dy > r2.y + r2.dy)
        return false;
    return true;
}

function getArea(bubrect, hotspotrect, screenarea) {
    sdx = document.getElementById("screen").clientWidth;
    sdy = document.getElementById("screen").clientHeight;
    brect = new RectArea(0, 0, 0, 0, 0);
    brectnopadding = new RectArea(0, 0, 0, 0, 0);
    if (bubrect.dx > 0 && bubrect.dy > 0) {
        brect = new RectArea(bubrect.x, bubrect.y, bubrect.dx, bubrect.dy, bubrect.bubpt);
        brectnopadding = new RectArea(bubrect.x, bubrect.y, bubrect.dx, bubrect.dy, bubrect.bubpt);
        switch (brect.bubpt) {
            case BUBB07_NOPOINTER:
                break;
            case BUBB07_TOPLEFT:
            case BUBB07_TOPRIGHT:
                if (brect.y > Bubble_vertical) {
                    brect.y -= Bubble_vertical;
                    brect.dy += Bubble_vertical;
                }
                else {
                    brect.dy += brect.y;
                    brect.y = 0;
                }
                break;
            case BUBB07_BOTTOMLEFT:
            case BUBB07_BOTTOMRIGHT:
                if (brect.y + brect.dy < sdy) {
                    brect.dy += Bubble_vertical;
                }
                else {
                    brect.dy = sdy - brect.dy;
                }
                break;
            case BUBB07_LEFTTOP:
            case BUBB07_LEFTBOTTOM:
                if (brect.x > Bubble_horizontal) {
                    brect.x -= Bubble_vertical;
                    brect.dx += Bubble_vertical;
                }
                else {
                    brect.dx += brect.x;
                    brect.x = 0;
                }
                break;
            case BUBB07_RIGHTTOP:
            case BUBB07_RIGHTBOTTOM:
                if (brect.x + brect.dx < sdx) {
                    brect.dx += Bubble_horizontal;
                }
                else {
                    brect.dx = sdx - brect.dx;
                }
                break;
        }
    }
    hrect = new RectArea(0, 0, 0, 0, 0);
    hrectnopadding = new RectArea(0, 0, 0, 0, 0);
    if (hotspotrect.dx > 0 && hotspotrect.dy > 0) {
        hrect = new RectArea(hotspotrect.x, hotspotrect.y, hotspotrect.dx, hotspotrect.dy, hotspotrect.bubpt);
        hrectnopadding = new RectArea(hotspotrect.x, hotspotrect.y, hotspotrect.dx, hotspotrect.dy, hotspotrect.bubpt);
        if (hrect.x > Actionarea_left) {
            hrect.x -= Actionarea_left;
            hrect.dx += Actionarea_left;
        }
        else {
            hrect.dx += hrect.x;
            hrectx = 0;
        }
        if (hrect.y > Actionarea_top) {
            hrect.y -= Actionarea_top;
            hrect.dy += Actionarea_top;
        }
        else {
            hrect.dy -= hrect.y;
            hrect.y = 0;
        }
        if (hrect.x + hrect.dx < sdx) {
            hrect.dx += Actionarea_right;
        }
        else {
            hrect.dx = sdx - hrect.x;
        }
        if (hrect.y + hrect.dy < sdy) {
            hrect.dy += Actionarea_bottom;
        }
        else {
            hrect.dy = sdy - hrect.y;
        }
    }
    var r0 = combineRect(brect, hrect);
    if (fitRectinRect(r0, screenarea))       // bubble + hotspot with padding
        return r0;
    r1 = combineRect(brectnopadding, hrectnopadding);
    if (fitRectinRect(r1, screenarea))       // bubble + hotspot no padding
        return r1;
    if (fitRectinRect(brect, screenarea))   // bubble with padding (full)
        return brect;
    if (fitRectinRect(brectnopadding, screenarea))
        return brectnopadding;
    brectnopadding.dx = screenarea.dx;
    if (brectnopadding.x + brectnopadding.dx > sdx)
        brectnopadding.dx = sdx - brectnopadding.x;
    brectnopadding.dy = screenarea.dy;
    if (brectnopadding.y + brectnopadding.dy > sdy)
        brectnopadding.dy = sdy - brectnopadding.y;
    return brectnopadding;
}

function getHorizontalScrollPosition(r1, r2) {  // r1 is IN r2
    if (r1.x < r2.x) {
        return r1.x;
    }
    if (r1.x + r1.dx > r2.x + r2.dx) {
        return r1.x - (r2.dx - r1.dx);
    }
    return r2.x;
}

function getVerticalScrollPosition(r1, r2) {    // r1 is IN r2
    if (r1.y < r2.y) {
        return r1.y;
    }
    if (r1.y + r1.dy > r2.y + r2.dy) {
        return r1.y - (r2.dy - r1.dy);
    }
    return r2.y;
}

function getDefinedBubbleRect(r0) {
    switch (r0.bubpt) {
        case BUBB07_NOPOINTER:
            break;
        case BUBB07_TOPLEFT:
        case BUBB07_TOPRIGHT:
        case BUBB07_BOTTOMLEFT:
        case BUBB07_BOTTOMRIGHT:
            r0.dy += 40 + Bubble_vertical;
            break;
        case BUBB07_LEFTTOP:
        case BUBB07_LEFTBOTTOM:
        case BUBB07_RIGHTTOP:
        case BUBB07_RIGHTBOTTOM:
            r0.dx += 40 + Bubble_horizontal;
            break;
    }
    return r0;
}

function Scroll2Action(simplereturn, nosoundrestart) {
    //    if (showScreen == "start") {
    //        window.scrollTo(0, 0);
    //        if (!simplereturn)
    //            setTimeout("ShowScreen4()", 5);
    //        return;
    //    }
    //    if (showActObj.nextFrame == "end") {
    //        ScrollTo(0, 0);
    //        if (!simplereturn)
    //            setTimeout("ShowScreen4()", 5);
    //        return;
    //    }
    var wh = document.body.clientHeight;
    wh -= 3;
    if (fusionmode)
        wh -= navBar.getHeight();
    var ww = document.body.clientWidth;
    ww -= 3;
    var scrX = getObjLeft("screencontainer");
    var sx = getScrollLeft() - scrX;
    var scrY = getObjTop("screencontainer");
    var sy = getScrollTop() - scrY;
    var srect = new RectArea(sx, sy, ww, wh, 0);

    var bub = showActObj.id;
    if (showScreen == "start")
        bub += "S";
    var brect = new RectArea(0, 0, 0, 0, 0);
    if (getDIV(bub)) {
        brect = new RectArea(binterf.GetBubbleLeft(true), binterf.GetBubbleTop(true),
                                binterf.GetBubbleWidth(true), binterf.GetBubbleHeight(true), binterf.GetBubblePointer());
        //        brect = new RectArea(_getObjLeft(bub), _getObjTop(bub), getObjWidth(bub), getObjHeight(bub), showActObj.bubpos);
        //        brect = new RectArea(showActObj.xpos, showActObj.ypos,showActObj.width,showActObj.height, showActObj.bubpos);
    }
    var hot = "hot" + bub + "_0";
    var hrect = new RectArea(0, 0, 0, 0, 0);
    if (getDIV(hot)) {
        hrect = new RectArea(_getObjLeft(hot), _getObjTop(hot), getObjWidth(hot), getObjHeight(hot), 0);
    }
    var r = getArea(brect, hrect, srect);
    if (containRect(r, srect)) {
        if (!simplereturn)
            setTimeout("ShowScreen4()", 5);
    }
    else {
        if (showActObj.nextFrame != "end") {
            var nextObj = screens[showActObj.nextFrame].actions[0];
            var l = true;
            while (l) {
                var nbub = nextObj.id;
                var nbrect = new RectArea(0, 0, 0, 0, 0);
                if (getDIV(nbub)) {
                    nbrect = getDefinedBubbleRect(new RectArea(nextObj.xpos, nextObj.ypos, nextObj.width, nextObj.height, nextObj.bubpos));
                }
                var nhot = "hot" + nbub + "_0";
                var nhrect = new RectArea(0, 0, 0, 0, 0);
                if (getDIV(nhot)) {
                    nhrect = new RectArea(_getObjLeft(nhot), _getObjTop(nhot), getObjWidth(nhot), getObjHeight(nhot), 0);
                }
                var nextRect = getArea(nbrect, nhrect, srect);
                var cRect = combineRect(r, nextRect);
                if (fitRectinRect(cRect, srect)) {
                    r = cRect;
                }
                else {
                    l = false;
                }
                if (nextObj.nextFrame == "end")
                    l = false;
                if (l)
                    nextObj = screens[nextObj.nextFrame].actions[0];
            }
        }
        ssx = getHorizontalScrollPosition(r, srect);
        ssy = getVerticalScrollPosition(r, srect);
        ScrollTo(ssx, ssy, simplereturn, nosoundrestart);
    }
    if (upk.browserInfo.isiOS()) {
        if ((showActObj.type == 'Input' && playMode != "K") ||
			(showActObj.type == 'Input' && playMode == "K" && !showActObj.par4)) {
            SelectText0();
        }
    }
}

function ScrollTo(x, y, nosmooth, nosoundrestart) {
    if (fusionmode) {
        if (nosmooth || isPaused) {
            window.scrollTo(x, y);
            setTimeout("ShowScreen4(" + nosoundrestart + ")", 5);
        }
        else
            SmoothScroll(x, y);
    }
    else {
        //        y += 18;
        window.scrollTo(x, y);
        setTimeout("ShowScreen4(" + nosoundrestart + ")", 5);
    }
}

function TimerObj(x, y, currentx, currenty, targetx, targety, dx, dy) {
    this.x = x;
    this.y = y;
    this.currentx = currentx;
    this.currenty = currenty;
    this.targetx = targetx;
    this.targety = targety;
    this.dx = dx;
    this.dy = dy;
}
var timerObj = new TimerObj(0, 0, 0, 0, 0, 0, 0, 0, 0);

function SmoothScroll(targetx, targety) {
    currentx = getScrollLeft();
    currenty = getScrollTop();

    l = PlayerConfig.PanSpeed;
    dx = targetx - currentx;
    dy = targety - currenty;
    x = (dx > 0 ? l : 0 - l);
    y = (dy > 0 ? l : 0 - l);
    step = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
        step = Math.abs(Math.round(dx / l)) + 1;
        y = Math.round(dy / step);
        if (y == 0) {
            y = (dy > 0 ? 1 : -1);
        }
    }
    else {
        step = Math.abs(Math.round(dy / l)) + 1;
        x = Math.round(dx / step);
        if (x == 0) {
            x = (dx > 0 ? 1 : -1);
        }
    }

    //    x *= 2;
    //    y *= 2;

    timerObj = new TimerObj(x, y, currentx, currenty, targetx, targety, dx, dy);
    setTimeout("SmoothScollTimed()", 5);
}

function SmoothScollTimed() {
    if (isPaused) {
        if (isNavBar())
            navBar.setKeepHidden(false);
        setTimeout("SmoothScollTimed()", 5);
        return;
    }
    if (isNavBar())
        navBar.setKeepHidden(true);
    if (timerObj.currentx == timerObj.targetx && timerObj.currenty == timerObj.targety) {
        if (isNavBar())
            navBar.setKeepHidden(false);
        setTimeout("ShowScreen4()", 5);
        return;
    }
    timerObj.currentx += timerObj.x;
    if (timerObj.dx > 0) {
        if (timerObj.targetx - timerObj.currentx < 0)
            timerObj.currentx = timerObj.targetx;
    }
    else {
        if (timerObj.targetx - timerObj.currentx > 0)
            timerObj.currentx = timerObj.targetx;
    }
    timerObj.currenty += timerObj.y;
    if (timerObj.dy > 0) {
        if (timerObj.targety - timerObj.currenty < 0)
            timerObj.currenty = timerObj.targety;
    }
    else {
        if (timerObj.targety - timerObj.currenty > 0)
            timerObj.currenty = timerObj.targety;
    }
    window.scrollTo(timerObj.currentx, timerObj.currenty);
    setTimeout("SmoothScollTimed()", 5);
}

function HideAction() {
    if (playMode == "K" && !KGuestDemoMode) {
        HideKnowItBubble();
        return;
    };
    var bub = showActObj.id

    binterf.ResetContent();
    binterf.Hide();

    for (var i = 0; i < showActObj.hotspots; i++) {
        var hot = "hot" + bub + "_" + i;
        if (getDIV(hot)) hide(hot, playMode == "S")
    }
}

var myscr = "";

function ShowScreen(scr, act, dir, fromslider) {
    if (!fromslider)
        timelineDescriptor.valid = false;
    if (scr != "end") {
        if (screens[scr].actions[0].nextFrame == "end") {
            lms_frameView(getMyGuid(), playMode, "end");
        }
        else {
            lms_frameView(getMyGuid(), playMode, scr);
        }
    }

    //AICC_STORM mode completing verification
    if (scr != "end") {
        var ASmyscr = screens[scr];
        var l = 0;
        while (l == 0) {
            var ASid = ASmyscr.actions[0];
            var ASNext = ASid.nextFrame;
            if (ASNext == "end") {
                l = 1;
            }
            else if (ASid.delay == 0 || ASid.type == "None") {
                ASmyscr = screens[ASNext];
            }
            else {
                l = 2;
            };
        };
    };

    if (act == null) {
        act = firsthemialternativeindex;
        firsthemialternativeindex = 0;
    }

    if (KGuestDemoMode == 2) {
        KGuestDemoMode = 0;
        KWarningLevel = 0;
        binterf.SetPosition(-1, -1, -1, -1, true, 0, 0, 0);
        if (playMode == "K")
            binterf.SetMoveable(true);
        KContinueFlag = 1;
        //		if (showActObj.type!="Input")
        ShowScreen(scr, act);
        KContinueFlag = 2;
        return;
    };
    if (KGuestDemoMode == 1) {

        var myact = screens[scr].actions[0];
        if (IsDragBegin(myact.type) && showActObj.id == myact.id) {
        }
        else {
            if (!IsDragSequence2(myact.type))
                KGuestDemoMode = 2;
        };
    };
    if (KContinueFlag == 2)
        KContinueFlag = 0;

    try {
        var myframe = scr;
        while (_SkipFrame(screens[myframe])) {
            myframe = screens[myframe].actions[0].nextFrame;
        }
        if (screens[myframe].actions[0].nextFrame == "end") {
            lms_topicFinish(getMyGuid());
        }
    }
    catch (e) {
        if (myframe == "end")
            lms_topicFinish(getMyGuid());
    }

    /* edw */
    if (playMode == "S") {
        if (upk.Timeline.Init(myframe))
            StartScreen = myframe;
        upk.Timeline.UpTimelineAt(myframe, dir, timelineDescriptor);
        upk.Timeline.Lock(false);
    }

    if (scr == "end") {
        if (playMode == "K" && PlayerConfig.TrackFeedBack) {
            HideAction();
            KScoringScreen = true;
            ShowAction();
            return;
        };
        ClosePlayer(1);
        return;
    }

    //  isTabbed = false

    // Bubble and Action Area
    if (showScreen != "") {
        if (showActObj.type == 'Input') {
            if (showActInpObj)
                showActInpObj.blur()
        }
        HideAction()
    }

    oldscr = scr;
    while (_SkipFrame(screens[scr]))
    //    ((screens[scr].actions.length == 1 && screens[scr].actions[0].type == "Decision") ||
    //	(playMode == "S" && screens[scr].actions[0].type == "None" && screens[scr].actions[0].delay == 0) ||
    //	(playMode == "T" && screens[scr].actions[0].type == "None" && screens[scr].actions[0].delay == 0) ||
    //	(playMode == "S" && screens[scr].actions[0].type == "Decision" && screens[scr].actions[0].delay == 0) ||
    //	(playMode == "K" && screens[scr].actions[0].type == "Decision") ||
    //	(playMode == "K" && screens[scr].actions[0].type == "None" && scr != "start" &&
    //				screens[scr].actions[0].nextFrame != "end" && screens[scr].actions[0].knowittext.length == 0) ||
    {
        scr = screens[scr].actions[0].nextFrame
        if (scr == "end") {
            setTimeout("ShowScreen(\"end\")", 10)
            return;
        };
        act = 0
    }

    if (ecidStartDecisions[scr]) {
        if (ecidStartDecisions[scr].display) {
            ecidDecisionStart = true;
        }
    }
    if (ecidDecisionStart) {
        scr = FindEcidStartNextFrame(scr);
        act = 0;
    }

    if (scr != oldscr) {
        if (scr != "end") {
            if (screens[scr].actions[0].nextFrame == "end") {
                lms_frameView(getMyGuid(), playMode, "end");
            }
            else {
                lms_frameView(getMyGuid(), playMode, scr);
            }
        }
    }

    showScreen = scr;
    if (!KGuestDemoMode) {
        showHistory[showHistory.length] = scr;
    };

    if (act)
        showAct = act
    else
        showAct = 0

    if (animPhase != "") {
        clearTimeout(animTimeout)
        animPhase = ""
    }

    showActObj = screens[showScreen].actions[showAct]

    if (showActObj == null) {
        showActObj = screens[showScreen].actions[0];
    }

    myscr = scr;
    url = screenshotPath + screens[showScreen].image;
    screenshot = new Image();
    event_blocked = true;
    DownloadImage(url, "Returned");
}

function Returned(url, success) {
    GetImage(screenshot, url);
    event_blocked = false;
    // Screenshot
    FrameIDUpdated(myscr);
    if (document.layers) {
        document.layers.screen.document.screenshot.src = screenshot.src;
    }
    else {
        document["screenshot"].src = screenshot.src;
        //    document.all["scrbg"].style.backgroundColor="black";
        //	if (IsLeadIn() || IsLeadOut() || IsDecision())
        //	{
        //	    document["screenshot"].style.filter='Alpha(opacity=80) gray()';
        //	}
        //	else
        //	{
        //	    document["screenshot"].style.filter='';
        //	}
    }
    ShowScreen2();
};

function GetDelay() {
    if (KGuestDemoMode)
        return 200;
    return showActObj.delay * 100;
};

function ShowScreen2() {
    scr = myscr;
    if (showActObj.type == "Input") {
        showActObj.par4 = false;
        showActObj.lastIMEtext = "";
    };
    ShowAction()
};

function ShowScreen3() {
    // Cursor
    if (playMode == "S" || KGuestDemoMode) {
        if (!showCursor)
            hide("cursor");
        showCursor = true;
    }
    if (playMode == "K" && !KGuestDemoMode)
        hide("cursor");
    if (playMode == "T" && !KGuestDemoMode)
        hide("cursor");

    // Preset input field
    if ((showActObj.type == 'Input' && playMode != "K") ||
	 (showActObj.type == 'Input' && playMode == "K" && !showActObj.par4)) {
        showActInpObj = document.layers ? document.layers.screen.document.layers["hot" + showActObj.id + "_0"].document["f" + showActObj.id]["inp" + showActObj.id] : document["f" + showActObj.id + "_0"]["inp" + showActObj.id + "_0"]
        showActInpObj.value = showActObj.par2
        showActInpObj.original = "";
        showActInpObj.onkeyup = EventKeyUp;
        // The onKeyPress handler is also assigned statically to the input element
        // to work around a Mozilla bug.
        showActInpObj.onkeypress = EventInputKey;
        //showActInpObj.onpropertychange = EventPropertyChange;
        EventPropertyChange();
        showActInpObj.onfocus = InputOnFocus;
        showActInpObj.onblur = InputOnBlur;
    }

    // Scroll to make action visible
    ScrollToAction()
}

function SelectText0() {
    showActInpObj.value = showActObj.par2;
    showActInpObj.original = showActInpObj.value;
    SelectText(showActInpObj);
    _backStep = false;
}

function ShowPlayButtons() {
    var iw = window.innerWidth;
    var ih = window.innerHeight;
    var sw = $("#screen").width();
    var sh = $("#screen").height();
    var dh = ih < sh ? ih : sh;

    var zoomfactor = sw / 1024;
    var width = parseInt(192 * zoomfactor);
    var height = parseInt(195 * zoomfactor);
    var top = parseInt((dh - height) / 2);
    var left = parseInt((sw - width) / 2);

    var s = '<div id="graydiv" scrolling="yes" class="pointerdiv" onclick="onStartClick()">';
    s += '<img src="../../../img/ipad_playbutton.png" style="position:absolute; ';
    s += 'top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; height: ' + height + 'px; "/>';

    height = parseInt(50 * zoomfactor);
    s += '<div id="startplayfont" ';
    s += 'style="position:absolute; width: 100%; height: ' + height + 'px; left: 0px; top: ' + (dh - height) + 'px; text-align: center; padding-top: ' + parseInt(10 * zoomfactor) + 'px; ';
    s += 'background-image: url(../../../img/ipad_messagebar.png); background-repeat: repeat;">' + R_swipe_instruction + '</div>';
    s += '</div>';
    $("#screen").append(s);

    var f = parseInt($("#startplayfont").css("font-size"));
    f = "" + parseInt(f * zoomfactor) + "px";
    $("#startplayfont").css("font-size", f);
    $("#graydiv").bind('touchstart', function (e) {
        swipe.Init(screenwidth);
    });
    $("#graydiv").bind('touchmove', function (e) {
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
    $("#graydiv").bind('touchend', function (e) {
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
    $("#graydiv").remove();
    SoundPlayerObj.InitAudioPlayer();
    iPadStartingProcess(1);
}

function iPadStartingProcess(mode) {
    switch (mode) {
        case 0:
            binterf.Hide();
            ShowPlayButtons();
            break;
        case 1:
            touchIntroChecked = true;
            if (isNavBar()) {
                navBar.setKeepHidden(false);
                navBar.show();
            }
            if (KGuestDemoMode == 0 && !showActObj.emptybubble && _ShowBubble(showActObj)) {
                binterf.Show();
            }
            else {
                binterf.Hide();
            }
            ShowScreen4();
            if ((showActObj.type == 'Input' && playMode != "K") ||
                    (showActObj.type == 'Input' && playMode == "K" && !showActObj.par4)) {
                SelectText0();
            }
            break;
        default:
            break;
    }
}

var touchIntroChecked = false;

function ShowScreen4(nosoundrestart) {
    // Panel up/down
    HandleResize()

    if (IsTouchDevice() && !touchIntroChecked) {
        iPadStartingProcess(0);
        return;
    }

    if (nosoundrestart)
        return;
    /*
    // Preload next screenshot(s)
    var preloadID = showActObj.nextFrame
    var preloadNext = true
    var count = 5
    preloadScreen = new Array()
    while(preloadID!="end" && preloadNext && count--)
    {
    preloadScreen[preloadScreen.length] = new Image()
    preloadScreen[preloadScreen.length-1].src = screenshotPath+screens[preloadID].image;
    preloadNext = TeacherTestSkip(screens[preloadID].actions[0].type)
    preloadID = screens[preloadID].actions[0].nextFrame
    }
    */



    if (!IsTouchEvent())
        FocusInpObj();

    PreloadImages();
    // Set buttons
    //	RefreshActionMenu()

    var hot = "hot" + showActObj.id + "_0"
    var asx = (showActObj.id).substr(1) + ".ASX";

    // Kick off timers and animations in Demo mode
    if (playMode == "S" || KGuestDemoMode) {
        if (showActObj.nextFrame == "end") {
            Animate2(asx, false, "ClosePlayer(1)", GetDelay(), "other");
        };

        if (showActObj.type == "Input") {
            animSteps = DecodeInputString(showActObj.par1[1]).length
            Animate2(asx, false, "AnimateInput()", GetDelay(), "input")
        }
        else if (showActObj.type == "Key") {
            hide("cursor");
            Animate2(asx, false, "AnimateKeyboard()", GetDelay(), "keyboard")
        }
        else if (showActObj.type == "None" || showActObj.type == "Decision" || !getDIV(hot)) {
            Animate2(asx, false, "ShowScreen('" + showActObj.nextFrame + "')", GetDelay(), "other")
        }
        else {
            var cx, cy
            var dx, dy

            anim_to_x = getObjLeft(hot) + getObjWidth(hot) / 2
            anim_to_y = getObjTop(hot) + getObjHeight(hot) / 2
            cx = getObjLeft("cursor") + cursor_alignment_x;
            cy = getObjTop("cursor") + cursor_alignment_y;
            dx = anim_to_x - cx - (upk.browserInfo.isiOS() ? sx : 0);
            dy = anim_to_y - cy - (upk.browserInfo.isiOS() ? sy : 0);

            animSteps = Math.round(Math.sqrt(dx * dx + dy * dy) / MOUSE_STEP);

            if (animSteps == 0) animSteps++;
            animStepOriginal = animSteps;

            anim_x = dx / animSteps
            anim_y = dy / animSteps

            if ((showActObj.type == "Drag" || showActObj.type.indexOf("Up") != -1)) {
                shiftTo("bullseye", cx - sx - getObjWidth("bullseye") / 2, cy - sy - getObjHeight("bullseye") / 2)
                HideBullsEye();
                //        show("bullseye")
            }
            else {
                HideBullsEye();
            }

            Animate2(asx, false, "AnimateMouse()", GetDelay(), "mouse")
        }
    }
    else {
        if ((showActObj.emptybubble && _ShowBubble(showActObj)) && showActObj.type == "None" && scr != "start") {
            Animate2(asx, false, "ShowScreen('" + showActObj.nextFrame + "')", GetDelay(), "other");
        }
        else {
            animObject = new AnimObject("", "", "");
            PlaySound(asx, false);
        };
    }
    if (upk.browserInfo.isiOS()) {
        setTimeout(function () {
            $("#screencontent").removeClass("swipeanim");
            $("#screencontent").css({ "-webkit-transform": "translate3d(0,0,0)" });
            SetSwipeActions();
            var sw = $("#screen").width() + 2;
            var w = sw;
            var l = 0;
            if (swipeNextEnabled) { w += sw + 100; }
            if (swipePrevEnabled) { w += sw + 100; l = -sw - 100 }
            $("#screencontent").css("left", l).width(w);
        }, 100)
    }
};

function SetSwipeActions() {
    if (playMode == "K" && scr != StartScreen && !IsLeadOut() && !IsExplanation()) { return; }
    var myscr = screens[scr];
    var nextFrame = myscr.actions[0].nextFrame;
    var type, nextimg, previmg;
    if (nextFrame != "end") {
        while (_SkipFrame(screens[nextFrame])) {
            nextFrame = screens[nextFrame].actions[0].nextFrame;
        }
    }
    if (nextFrame != "end") {
        nextimg = screenshotPath + screens[nextFrame].image;
    }
    var prevFrame = null;
    try {
        prevFrame = showHistory[showHistory.length - 2];
    }
    catch (e) { };
    if (prevFrame != null) {
        previmg = screenshotPath + screens[prevFrame].image;
    }
    type = "normal";
    if (scr == StartScreen)
        type = "start";
    if (nextFrame == "end")
        type = "end";
    if (myscr.actions[0].type == "Input")
        type = "input";
    if (myscr.actions[0].type == "Decision")
        type = "decision";
    if (myscr.actions[0].type.substr(1) == "BeginDrag")
        type = "begindrag";
    if (myscr.actions[0].type == "Drag")
        type = "drag";
    if (myscr.actions[0].type.substr(1) == "Up")
        type = "up";
    if (playMode == "K" && IsLeadOut())
        type = "endknowit";
    if (type == "normal" || type == "input" || type == "decision" || type == "up") {
        EnableSwipeNext(nextimg);
        EnableSwipePrev(previmg);
    }
    if (type == "start" || (playMode == "K" && IsExplanation())) {
        EnableSwipeNext(nextimg);
        DisableSwipePrev();
    }
    if (type == "end" || type == "begindrag") {
        DisableSwipeNext();
        EnableSwipePrev(previmg);
    }
    if (type == "drag" || type == "endknowit") {
        DisableSwipeNext();
        DisableSwipePrev();
    }
    if (prevFrame == null) {
        DisableSwipePrev();
    }
    swipeStarted = false;
}

function PreloadImages() {
    if (!PlayerConfig.PreloadScreenEnabled)
        return;
    // Preload next screenshot(s)
    var preloadID = showActObj.nextFrame
    var preloadNext = true
    var count = 3;
    while (preloadID != "end" && preloadNext && count--) {
        url = screenshotPath + screens[preloadID].image;
        PreloadImage(url);
        //		preloadNext = TeacherTestSkip(screens[preloadID].actions[0].type);
        preloadID = screens[preloadID].actions[0].nextFrame;
    }
    for (var i = 0; i < screens[showScreen].actions.length; i++) {
        preloadID = screens[showScreen].actions[i].nextFrame;
        if (preloadID != "end") {
            url = screenshotPath + screens[preloadID].image;
            PreloadImage(url);
        };
    };
}

function GetShiftState(event) {
    if (event == 0)
        event = window.event;
    if (event.storedEvent)
        return event.pShState;
    var alt = event.modifiers ? (event.modifiers & Event.ALT_MASK) : event.altKey;
    var ctrl = event.modifiers ? (event.modifiers & Event.CONTROL_MASK) : event.ctrlKey;
    var shift = event.modifiers ? (event.modifiers & Event.SHIFT_MASK) : event.shiftKey
    var ret = (shift ? "s" : "") + (ctrl ? "c" : "") + (alt ? "a" : "");
    return ret;
}

function GetButton(event) {
    if (event == 0)
        event = window.event;
    if (event.storedEvent)
        return event.pButton;
    if (event.button)
        return (event.button & 1) ? "L" : (event.button & 2) ? "R" : (event.button & 4) ? "M" : ""
    else
        return (event.which == 1) ? "L" : (event.which == 3) ? "R" : ""
}

function GetMouseX(event) {
    if (event == 0)
        event = window.event;
    if (event.storedEvent)
        return event.pX;
    var scrX = 0;
    if (upk.browserInfo.isExplorer() == false) {
        scrX = getObjLeft("screencontainer");
    }
    if (event.pageX)
        if (event.type == "DOMMouseScroll")
            return event.screenX - scrX + document.body.scrollLeft;
        else
            return event.pageX - scrX;
    else if (event.x)
        return event.x - scrX + getScrollLeft();
    else
        return event.layerX;
}

function GetMouseY(event) {
    if (event == 0)
        event = window.event;
    if (event.storedEvent)
        return event.pY;
    var scrY = 0;
    if (upk.browserInfo.isExplorer() == false) {
        scrY = getObjTop("screencontainer");
    }
    if (event.pageY)
        if (event.type == "DOMMouseScroll")
            return event.screenY - scrY + document.body.scrollTop;
        else
            return event.pageY - scrY;
    else if (event.y)
        return event.y - scrY + getScrollTop();
    else
        return event.layerY;
}

function MouseInObject(event, objID) {
    var hot = getDIV(objID)
    if (hot) {
        var mx = GetMouseX(event);
        var my = GetMouseY(event);
        var hx = getObjLeft(objID);
        var hy = getObjTop(objID);
        var hw = getObjWidth(objID);
        var hh = getObjHeight(objID);

        var sL = document.body.scrollLeft;
        var sT = document.body.scrollTop;

        if (upk.browserInfo.isIE10orHigher()) {
            mx -= getObjLeft("screencontainer");
            my -= getObjTop("screencontainer");
        }

        if (upk.browserInfo.isIE8() || upk.browserInfo.isIE9() || upk.browserInfo.isIE11Compatibility()) {
            mx -= sL;
            my -= sT;
        }

        if (showActObj.type == "Input") {
            var s = showActInpObj.id.substr(0, 14);
            while (s.substr(s.length - 1, 1) == 'p' || s.substr(s.length - 1, 1) == 'x') {
                s = s.substr(0, s.length - 1);
            }
            if (s == objID) {
                hw = showActInpObj.offsetWidth;
                hh = showActInpObj.offsetHeight;
            }
        }
        if (mx >= hx && my >= hy && mx < hx + hw && my < hy + hh)
            return true
        if (IsTouchDevice()) {
            var dd = 30;
            if (hx > dd) {
                hx -= dd;
            }
            else {
                hx = 0;
            }
            if (hy > dd) {
                hy -= dd;
            }
            else {
                hy = 0;
            }
            hw += 2 * dd;
            hh += 2 * dd;
            if (mx >= hx && my >= hy && mx < hx + hw && my < hy + hh)
                return true
        }
    }
    return false
}

function MouseInHotspot(event, action) {
    if (action == null)
        action = showActObj;
    for (var i = 0; i < action.hotspots; i++) {
        if (MouseInObject(event, "hot" + action.id + "_" + i) &&
									GetShiftState(event) == action.par1)
            return true;
    };
    return false;
}

var touchEvents = ["LClick1", "LClick2", "LClick3", "LBeginDrag", "LDown", "LUp", "RClick1", "RClick2", "RClick3", "RBeginDrag", "RDown", "RUp", "Drag", "Move"]

function InArray(k, a) {
    for (var i = 0; i < a.length; i++) {
        if (k == a[i])
            return true;
    }
    return false;
}

function MouseEventControl(type1, type2) {
    if (type1 == type2) {
        return true;
    }
    if (IsTouchDevice()) {
        if (InArray(type1, touchEvents) && InArray(type2, touchEvents))
            return true;
    }
    return false;
}

function IsStringinputValidated() {
    if (showActObj.type != "Input")
        return false;
    var p = showActObj.par1[0];
    return ((p == "N" || p == "A") ? false : true);
}

function ActionControl(type, event, avoidinput) {
    if (playMode == "K" && KGuestDemoMode > 0)
        return null;
    if (avoidinput == null)
        avoidinput = false;
    if (event == null) {
        for (var i = 0; i < screens[showScreen].actions.length; i++) {
            var myAct = screens[showScreen].actions[i];
            if (MouseEventControl(myAct.type, type)) {
                return myAct;
            };
        };
        return 0;
    };

    for (var i = 0; i < screens[showScreen].actions.length; i++) {
        var myAct = screens[showScreen].actions[i];
        if (MouseEventControl(myAct.type, type) && MouseInHotspot(event, myAct)) {
            return myAct;
        };
    };

    if (avoidinput == true)
        return null;

    if (showActObj.type == "Input" && IsStringinputValidated() == false) {
        var nf = showActObj.nextFrame;
        for (var i = 0; i < screens[nf].actions.length; i++) {
            var myAct = screens[nf].actions[i];
            if (MouseEventControl(myAct.type, type) && MouseInHotspot(event, myAct)) {
                return myAct;
            };
        };
    };

    return 0;
};

function ToStandard(k) {
    var c = String.fromCharCode(k);
    var cc = c.toUpperCase(c);
    return cc.charCodeAt(0);
}

function ToStandard2(k) {
    if (k >= 112 && k <= 123)
        return k;
    return ToStandard(k);
}

function ActionKeyControl(code, event, noShift) {
    if (!noShift)
        noShift = false;
    var code1 = code;
    if (code == 107 || code == 187) {	// + key
        code1 = 43;
        noShift = true;
    }
    if (code == 109 || code == 189) {	// - key
        code1 = 45;
        noShift = true;
    }
    if (code == 56 || code == 106) {	// * key
        code1 = 42;
        noShift = true;
    }
    var shState = GetShiftState(event);
    if (shState.length > 0) {
        if (noShift) {
            if (shState.substr(0, 1) == "s")
                shState = shState.substr(1);
        };
    };
    for (var i = 0; i < screens[showScreen].actions.length; i++) {
        var myAct = screens[showScreen].actions[i];
        var myActSh = myAct.par2;
        if (noShift) {
            if (myActSh.substr(0, 1) == "s")
                myActSh = myActSh.substr(1);
        }
        if (myAct.type == "Key" &&
            (code1 == ToStandard(myAct.par1) || code1 == ToStandard2(myAct.par1)) &&
             shState == myActSh) {
            return myAct;
        };
    };
    return 0;
};

function IsDragSequence() {
    var k = screens[showScreen].actions.length;
    return (k == 1 && screens[showScreen].actions[0].type == "Drag");
};

///////////////////////////////////////////
// mouse global variables
var m_mouseStatus = 0;
var m_p1 = new StoredEvent(0, 0, "", "");
var m_p2 = new StoredEvent(0, 0, "", "");
var m_p3 = new StoredEvent(0, 0, "", "");
var m_buttonID;
var DOUBLECLICKTIME = 500;
var m_timer1 = 0;
var m_timer2 = 0;
var m_bClkEvent = false;
var m_begindragEvent = 0;
///////////////////////////////////////////

function BDown(point) {
    m_begindragEvent = 0;
    var act = ActionControl(m_buttonID + "BDown", point);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        m_mouseStatus = 0;
        FalseEvent();
    };
};

function BBeginDrag(point) {
    var act = ActionControl(m_buttonID + "BeginDrag", point);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        m_mouseStatus = 0;
        FalseEvent();
    };
};

function BUp(point) {
    if (isOnLink)
        return;
    m_begindragEvent = 0;
    var act = ActionControl(m_buttonID + "Up", point);
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        m_mouseStatus = 0;
        if (playMode == "K" && KScoringScreen)
            return
        else if (IsLeadIn() || IsLeadOut() || showActObj.type == "None")
            return
        else
            FalseMouseEvent();
    };
};

function BClk(point) {
    m_begindragEvent = 0;
    var act = ActionControl(m_buttonID + "Click1", point, false);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        FalseEvent();
    };
};

function BDblClk(point) {
    m_begindragEvent = 0;
    var act = ActionControl(m_buttonID + "Click2", point, false);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        FalseEvent();
    };
};

function BTrplClk(point) {
    m_begindragEvent = 0;
    var act = ActionControl(m_buttonID + "Click3", point, false);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        FalseEvent();
    };
};

function BWheel(point) {
    var act = ActionControl("Wheel", point);
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            showHistory[showHistory.length] = showActObj.nextFrame;
            historyActionMap[showActObj.nextFrame] = 0;
            TeacherForward(true, act.nextFrame, act.id);
            return;
        }
    }
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    }
    else {
        FalseEvent();
    };
};

function FalseMouseEvent() {
    if (showActObj.type == "Input") {
        if (AssessStringInput(true, true)) //complete
        {
            TeacherForward(true, showActObj.nextFrame, showActObj.id);
            setTimeout("FalseEvent();", 300);
            return;
        }
    }
    FalseEvent();
}

function FalseEvent() {
    TeacherWrong();
};

var g_x, g_y, g_shst;
var g_timer = 0;

function EventMouseMove(event) {
    if (IsTouchDevice())
        return;
    if (event == null)
        event = window.event;
    if (playMode == "K") {
        g_x = GetMouseX(event);
        g_y = GetMouseY(event);
        g_shst = GetShiftState(event)
    };
    if (playMode == "K" && KGuestDemoMode)
        return false;
    if (playMode == "K" && IsDragBegin())
        return false;
    //	defaultStatus=GetMouseX(event)+","+GetMouseY(event);
    // begindrag
    if (m_begindragEvent) {
        if (!MouseInHotspot(event, m_begindragEvent)) {
            TeacherForward(true, m_begindragEvent.nextFrame, m_begindragEvent.id);
            m_begindragEvent = 0;
            return;
        };
    };
    // drag
    var act = ActionControl("Drag", event);
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
        return;
    };
    // point
    act = ActionControl("Move", event)
    if (act) {
        if (playMode == "K") {
            if (g_timer == 0) {
                g_timer = setTimeout("PointDelay();", 300);
            };
        }
        else
            TeacherForward(true, act.nextFrame, act.id);
    };
};

function PointDelay() {
    var myevent = new StoredEvent(g_x, g_y, g_shst);
    g_timer = 0;
    act = ActionControl("Move", myevent)
    if (act) {
        TeacherForward(true, act.nextFrame, act.id);
    };
};

function EventDblClk(event) {
    return false;
    /*
    if (playMode == "S")
    return false;
    if (playMode == "K" && KGuestDemoMode)
    return false;
    if (playMode == "K" && IsDragBegin())
    return false;
    if (document.layers)
    return false;
    if (m_mouseStatus == 0)
    return false;
    EventMouseDown(event);
    return false;
    */
};

function EventWheel(event) {
    if (playMode == "K" && KGuestDemoMode)
        return false;
    if (playMode == "K" && IsDragBegin())
        return false;
    if (playMode == "K" && (KConfirmDemo > 0))
        return false;
    if (playMode == "S")
        return false;
    if (m_mouseStatus != 0)
        return false;
    if (event == null)
        event = window.event;
    BWheel(event);
    return false;
};

function DocEventMouseDown(event) {
    if (!event)
        event = window.event;
    if (event.srcElement) {
        if (event.srcElement.id == "m_ActionText")
            return;
    }
    if (event.target) {
        if (event.target.id == "m_ActionText")
            return;
    }
    if (actionMenu) {
        return true;
    }
};

function EventMouseDown(event) {
    if (actionMenu) {
        if (actionMenu.IsOnScreen()) {
            actionMenu.Close();
            return true;
        };
    }
    if (playMode == "K" && KGuestDemoMode)
        return false;
    if (playMode == "K" && IsDragBegin())
        return false;
    if (playMode == "K" && (KConfirmDemo > 0))
        return false;
    if (playMode == "S") {
        if (isOnLink)
            return true;
        //		else if(showActObj.type!="Decision")
        //			DemoForward()
        //		else
        //			TeacherWrong()
        //		else if (IsLeadIn() || IsLeadOut())
        //			DemoForward();
        return false
    }

    if (event == null)
        event = window.event;
    var but = GetButton(event);
    if (!m_buttonID)
        m_buttonID = but;
    if (but == "")
        but = m_buttonID;
    if (playMode == "K" || playMode == "T") {
        if (showActObj.type == "Input") {
            for (var i = 0; i < showActObj.hotspots; i++) {
                if (MouseInObject(event, "hot" + showActObj.id + "_" + i)) {
                    return true;
                };
            };
        };
    };
    if (screens[showScreen].actions.length > 0) {
        if (screens[showScreen].actions[0].type == "Decision")
            return true;
    };
    var downEvent = ActionControl(but + "BDown", event);
    var begindragEvent = ActionControl(but + "BeginDrag", event);
    var clkEvent = ActionControl(but + "Click1", event);
    var dblclkEvent = ActionControl(but + "Click2", event);
    var trplclkEvent = ActionControl(but + "Click3", event);
    switch (m_mouseStatus) {
        case 0:
            // first down event arrived
            m_bClkEvent = false;
            m_mouseStatus = 1;
            m_p1 = new StoredEvent(GetMouseX(event), GetMouseY(event), GetShiftState(event), but);
            m_buttonID = but;
            m_begindragEvent = 0;
            if (clkEvent == 0 && dblclkEvent == 0 && trplclkEvent == 0) {
                if (downEvent)
                    BDown(m_p1);
                if (begindragEvent)
                    BBeginDrag(m_p1);
                break;
            };
            if (begindragEvent) {
                m_begindragEvent = begindragEvent;
            };
            if (dblclkEvent || trplclkEvent) {
                m_timer1 = setTimeout(Event_Mouse_Timer1, DOUBLECLICKTIME);
            };
            break;
        case 2:
            // doubleclick event arrived
            if (but != m_buttonID)
                break;
            if (m_timer1 > 0) {
                clearTimeout(m_timer1);
                m_timer1 = 0;
            };
            if (dblclkEvent && trplclkEvent == 0) {
                m_mouseStatus = 0;
                if (MouseInHotspot(m_p1, dblclkEvent)) {
                    BDblClk(event);
                }
                else {
                    FalseMouseEvent();
                };
                break;
            };
            m_mouseStatus = 3;
            m_p3 = new StoredEvent(GetMouseX(event), GetMouseY(event), GetShiftState(event), but);
            m_timer2 = setTimeout(Event_Mouse_Timer2, DOUBLECLICKTIME);
            break;
        case 3:
            // tripleclick event arrived
            if (but != m_buttonID)
                break;
            if (m_timer2 > 0) {
                clearTimeout(m_timer2);
                m_timer2 = 0;
            };
            m_mouseStatus = 0;
            if (trplclkEvent && MouseInHotspot(m_p1, trplclkEvent) &&
													MouseInHotspot(m_p3, trplclkEvent)) {
                BTrplClk(event);
            }
            else {
                FalseMouseEvent();
            };
            break;
        default:
            m_mouseStatus = 0;
            break;
    };
    return false;
};

function EventMouseUp(event) {
    if (m_mouseStatus == 2) {
        EventMouseDown(event);
    }
    if (playMode == "K" && KGuestDemoMode)
        return false;
    if (playMode == "K" && IsDragBegin())
        return false;
    if (playMode == "K" && (KConfirmDemo > 0))
        return false;
    if (event == null)
        event = window.event;
    var but = GetButton(event);
    if (but != m_buttonID)
        return false;
    if (screens[showScreen].actions.length > 0) {
        if (screens[showScreen].actions[0].type == "Decision")
            return true;
    };
    var clkEvent = ActionControl(but + "Click1", event);
    var dblclkEvent = ActionControl(but + "Click2", event);
    var trplclkEvent = ActionControl(but + "Click3", event);
    switch (m_mouseStatus) {
        case 1:
            // first up event arrived
            if (clkEvent == 0 && dblclkEvent == 0 && trplclkEvent == 0) {
                m_mouseStatus = 0;
                BUp(event);
                break;
            };
            if (clkEvent) {
                m_bClkEvent = MouseInHotspot(m_p1, clkEvent);
            };
            if (m_timer1 == 0) {
                if (clkEvent) {
                    m_mouseStatus = 0;
                    if (m_bClkEvent)
                        BClk(event)
                    else
                        BUp(event);
                }
                else {
                    m_mouseStatus = 0;
                    FalseMouseEvent();
                };
                break;
            };
            m_mouseStatus = 2;
            m_p2 = new StoredEvent(GetMouseX(event), GetMouseY(event), GetShiftState(event), but);
            break;
        default:
            break;
    };
    return false;
};

function Event_Mouse_Timer1() {
    m_timer1 = 0;
    if (m_mouseStatus == 2) {
        if (m_bClkEvent)
            BClk(m_p2)
        else
            BUp(m_p2);
        m_mouseStatus = 0;
    };
};

function Event_Mouse_Timer2() {
    m_timer2 = 0;
    if (m_mouseStatus == 3) {
        m_mouseStatus = 0;
        var dblEvent = ActionControl(m_buttonID + "Click2", m_p3);
        if (dblEvent) {
            if (MouseInHotspot(m_p1, dblEvent)) {
                BDblClk(m_p3);
            };
        }
        else {
            FalseMouseEvent();
        };
    };
};

var knowit_AltF4Pressed = false;

function BeforeUnload() {
    SavePosition();
    return;
};

var getCode = false;
//var fromInput=false;

function EventKeyPress(event) {
    if (showActObj.type == "Input")
        return true;
    //	if (fromInput)
    //	{
    //		fromInput=false;
    //		return false;
    //	};
    if (!getCode)
        return true;

    if (event == null)
        event = window.event;
    var code = event.which ? event.which : event.keyCode
    //	if (!(code>=112 && code<=123))
    if (code >= 65 && code <= 90) {
        var codes = String.fromCharCode(code);
        var upcodes = codes.toUpperCase();
        code = upcodes.charCodeAt(0);
    };

    if (playMode == "T") {
        if (act = ActionKeyControl(code, event, true))
            TeacherForward(true, act.nextFrame, act.id)
        else if (!IsLeadIn() && !IsLeadOut())
            TeacherWrong(event);
    }
    else	// playMode==K
    {
        if (act = ActionKeyControl(code, event, true))
            TeacherForward(true, act.nextFrame, act.id)
        else
            TeacherWrong(event)
    };
    getCode = false;
    return false;
};

var _tabsemaphore = false;

function EventKeyDown(event) {
    if (event == null) {
        event = window.event;
    }

    var code = event.which ? event.which : event.keyCode;
    if (code >= 96 && code <= 105) {  // numeric keyboard event codes
        code -= 48;
    }

    if (upk.browserInfo.isExplorer()) {
        if (code == 9) {
            if (_tabsemaphore == true) {
                return false;
            }
            else {
                _tabsemaphore = true;
                setInterval("_tabsemaphore=false;", 10);
            }

        }
    }

    // NS: Disable function keys in "See It" mode
    if ((playMode == "S") && (code >= 112) && (code <= 123)) {
        if (showFrameIDToggle && CheckFrameIDKeys(event) == true) {
            ToggleShowFrameID();
        }
        return false;
    }

    if (playMode == "K") {
        if (code == 27 && actionMenu) {
            if (actionMenu.IsOnScreen()) {
                actionMenu.Close();
                return false;
            };
        }
        if (KFinishClose == true) {
            return false;
        }
    }

    if (showActObj.type == "Input") {
        if (playMode == "S" || (playMode == "K" && KGuestDemoMode)) {
            if (code == 13)
                DemoForward();
            if (code == 27)
                ClosePlayer();
            if (code == 32)
                PauseToggle();
            return false;
        }
        if (code == 9 && PlayerConfig.StringInputLostFocusAutoadvanceEnabled) {
            if (AssessStringInput(true, true)) //complete
            {
                TeacherForward(true);
            }
            else {
                TeacherWrong(event);
            };
        };
        if (code == 13) {
            if (actionMenu) {
                if (actionMenu.IsOnScreen()) {
                    actionMenu.Close();
                    return true;
                }
            }
            if (playMode == "T" && (UserPrefs.TryIt.EnableSkipping || IsTouchEvent())) {
                TeacherForward(true);
            }
            else if (AssessStringInput(true, true)) //complete
            {
                TeacherForward(true);
            }
            else {
                TeacherWrong(event);
            };
        }
        if (upk.browserInfo.isSafari() && code == 27) {
            OnClose();
            return false;
        }
        return true;
    }
    if (playMode == "K" && KGuestDemoMode)
        return false;
    if (playMode == "K" && IsDragBegin())
        return false;
    //	if (!(code>=112 && code<=123))
    if (code >= 65 && code <= 90) {
        var codes = String.fromCharCode(code);
        var upcodes = codes.toUpperCase();
        code = upcodes.charCodeAt(0);
    };
    if (code >= 16 && code <= 18)
        return true;
    if (code == 91 || code == 92)		//(windows key!)
        return true;

    if (code == 114 || code == 116 || code == 117 || code == 121)		// F3, F5, F6 and F10 keys
    {
        if (document.all && !upk.browserInfo.isFF3()) {
            event.originalCode = code;
            event.keyCode = 0;
        }
        if (playMode == "S")
            return false;
    };

    var act;
    if (playMode == "S") {
        if (code == 27) {
            ClosePlayer();
            return false;
        }
        else if (code == 32) {
            PauseToggle()
            return false;
        }
        else if (code == 13) {
            //			if(isTabbed)
            //				return true
            if (actionMenu) {
                if (actionMenu.IsOnScreen()) {
                    actionMenu.Close();
                    return true;
                }
            }
            DemoForward(showActObj.delay != DELAY_INFINITE);
            return false;
        }
        //		else if(code==9)
        //		{
        //			isTabbed = true
        //			return false
        //		}
        return true;
    }
    else if (playMode == "T") {
        if (event.keyCode == 115 && event.altKey == true) {
            return false;
        };
        if (code == 13) {
            if (actionMenu) {
                if (actionMenu.IsOnScreen()) {
                    closedbyEnter = true;
                    actionMenu.Close();
                    return true;
                };
            }
            //			if (isTabbed)
            //				return true
            //			else
            if (act = ActionKeyControl(code, event)) {
                TeacherForward(true, act.nextFrame, act.id);
                return false;
            }
            else if (UserPrefs.TryIt.EnableSkipping || IsTouchEvent()) {
                TeacherForward(false)
                return false;
            }
            else if (screens[showScreen].actions[0].type == "None") {
                TeacherForward(true)
                return false;
            }
            if (!UserPrefs.TryIt.EnableSkipping && !IsTouchEvent()) {
                TeacherWrong(event);
                return false;
            }
            else
                return true;
        }
        /*		
        else if(act=ActionKeyControl(code,event))
        TeacherForward(true,act.nextFrame)
        else if(code==9)
        {
        isTabbed = true;
        return true;
        }
        else if(code==27)
        ClosePlayer()
        else if((code>=16 && code<=18) || showActObj.type=="Input")
        return true
        else if (!IsLeadIn() && !IsLeadOut())
        TeacherWrong()
        */
        else if (code == 27) {
            if (act = ActionKeyControl(code, event))
                TeacherForward(true, act.nextFrame, act.id)
            else
                ClosePlayer();
            return false;
        }
        else if (code == 9) {
            if (act = ActionKeyControl(code, event)) {
                TeacherForward(true, act.nextFrame, act.id);
                return false;
            }
            else {
                TeacherWrong(event);
                return false;
            };
        }
        else if ((code >= 16 && code <= 18) || showActObj.type == "Input")
            return true
        else if (act = ActionKeyControl(code, event)) {
            TeacherForward(true, act.nextFrame, act.id);
            return false;
        }
        else
        //        if (code >= 112 && code <= 123)	// function keys
        {
            TeacherWrong(event);
            return false;
        };
        //        getCode = true;
        //        return true;
    }
    else // playMode=="K"
    {
        if (event.keyCode == 115 && event.altKey == true)	// altF4
        {
            try { event.keyCode = 27; } catch (e) { };
            code = 27;
            knowit_AltF4Pressed = true;
        };
        if (code == 13) {
            if (actionMenu) {
                if (actionMenu.IsOnScreen()) {
                    actionMenu.Close();
                    return true;
                }
            }
            if (KScoringScreen)
                ClosePlayer(1)
            else if (IsLeadIn() || IsLeadOut())
                TeacherForward(true)
            else if (act = ActionKeyControl(code, event))
                TeacherForward(true, act.nextFrame, act.id)
            else if (screens[showScreen].actions[0].type == "None") {
                TeacherForward(true, act.nextFrame, act.id)
            }
            else
                TeacherWrong(event)
            return true;
        };
        /*		
        if(act=ActionKeyControl(code,event))
        TeacherForward(true,act.nextFrame)
        else if(code==27)
        OnClose()
        else if((code>=16 && code<=18) || showActObj.type=="Input")
        return true
        else
        TeacherWrong()
        */
        //		if(code==9)
        //		{
        //			TeacherWrong();
        //			return false;
        //		}
        //		else if(code==27) !!!!!
        if (code == 27) {
            if (act = ActionKeyControl(code, event))
                TeacherForward(true, act.nextFrame, act.id)
            else
                OnClose();
            return false;
        }
        else if (code == 9) {
            if (act = ActionKeyControl(code, event)) {
                TeacherForward(true, act.nextFrame, act.id);
                return false;
            }
            else {
                TeacherWrong(event);
                return false;
            };
        }
        else if ((code >= 16 && code <= 18) || showActObj.type == "Input")
            return true
        else if (act = ActionKeyControl(code, event)) {
            TeacherForward(true, act.nextFrame, act.id)
            return false;
        };
        if (code >= 112 && code <= 123)	// function keys
        {
            TeacherWrong(event);
            return false;
        };
        getCode = true;
        return true;
    };
    //return false;
}

function StrongAssess(complete, primary) {
    if (!complete)
        complete = false;
    if (!primary)
        primary = false;
    var v = showActInpObj.value;
    if (primary) {
        var s = showActObj.par1[1];
        if (matchString(s, v, showActObj.par3))
            return true;
        var s = DecodeInputString(showActObj.par1[1]);
        return matchString(s, v, showActObj.par3)
    };

    if (complete) {
        if (showActObj.par1[0] == "N" && v == "")
            return true;
        if (showActObj.par1[0] == "A" && v == "")
            return true;
    }

    for (var i = 1; i < showActObj.par1.length; i++) {
        var s = showActObj.par1[i];
        if (matchString(s, v, showActObj.par3))
            return true;
        s = DecodeInputString(showActObj.par1[i]);
        if (matchString(s, v, showActObj.par3))
            return true;
    };
    return false;
};

var _assessStr_counter = 0;

function AssessStringInput(complete, force) {
    if (!force) {
        _assessStr_counter++;
        if (_assessStr_counter == 3)
            _assessStr_counter = 0;
        if (_assessStr_counter != 0)
            return;
    }

    if (!complete)
        complete = false;

    var validatedoption = false;
    if (playMode == "K")
        validatedoption = true;

    if (!complete)
        return StrongAssess(false, !validatedoption);
    if (validatedoption) {
        if (showActObj.par1[0] == "N" || showActObj.par1[0] == "") {
            return StrongAssess(true, false);
        }
        else if (showActObj.par1[0] == "S") {
            return (showActInpObj.value.length > 0);
        }
        else {
            return true;
        };
    }
    else {
        return StrongAssess(complete, true);
    };

};

function EventInputKey(event) {
    if (playMode == "S") {
        var code = window.event ? window.event.keyCode : event.which ? event.which : event.keyCode;
        if (code == 27) {
            OnClose();
            return false;
        };
        setTimeout("showActInpObj.value=showActInpObj.original;", 10);
        return false;
    }
    if (playMode == "K" && KGuestDemoMode) {
        setTimeout("showActInpObj.value=showActInpObj.original;", 10);
        return false;
    };
    if (playMode == "K" && IsDragBegin()) {
        setTimeout("showActInpObj.value=showActInpObj.original;", 10);
        return false;
    };
    if (playMode == "T" || playMode == "K") {
        var code = window.event ? window.event.keyCode : event.which ? event.which : event.keyCode;
        if (code != 13)
            showActObj.par4 = true;
        if (code == 27) {
            showActInpObj.value = showActObj.par5;
            showActInpObj.original = showActInpObj.value;
            OnClose();
            return false;
        };
    }
    //return false;
    return true;
}

///////////////////////////////////////////////
// Trace for test
var tracewindow = null;

function Trace(s) {
    if (tracewindow == null) {
        tracewindow.open("", "", "");
    };
    tracewindow.document.writeln(s);
    tracewindow.document.writeln("<br>");
    tracewindow.scrollBy(0, 100);
}
///////////////////////////////////////////////

function EventPropertyChange()
// it works by non key based character input (japanese content, IME input)
{
    if (showActObj.type != "Input") {
        if (showActObj.par4 == false) {
            return true;
        }
    }
    if (playMode == "T" || playMode == "K") {
        if (PlayerConfig.StringInputAutoadvanceEnabled) {
            //            if (_backStep == true)
            //                return false;
            if (AssessStringInput(false) && showActObj.par4 == true)			// implicit
            {
                TeacherForward(true, showActObj.nextFrame, showActObj.id);
            }
        }
    }
    setTimeout("EventPropertyChange();", 100);
    return true;
}

function EventKeyUp(event) {
    return true
}

function EventCancel(event) {
    return false	// cancel popups
}

function SavePosition() {
    if (upk.browserInfo.isiOS())
        return;
    if (playMode == "S") {
        var c = new Cookie(document, "OnDemandSeeItSizes", 365, "/");
        c.Load();
        if (!isNaN(window.screenX)) {
            c.SeeItLeft = window.screenX;
            c.SeeItTop = window.screenY;
            c.SeeItWidth = (upk.browserInfo.isExplorer() ? window.innerWidth - 4 : window.innerWidth);
            c.SeeItHeight = (upk.browserInfo.isExplorer() ? window.innerHeight - 4 : window.innerHeight);
        }
        else {
            var correction = 80;
            var ua = upk.browserInfo.getAgentInfo().toLowerCase();
            if (ua.indexOf("trident/5.") >= 0) { // ie9 normal and compatibility
                correction -= 21;
            }
            else {
                if (upk.browserInfo.isIEVersion(7)) // ie10/11... compatibility
                    correction -= 21;
            }
            window.status = "test";
            if (window.status == "test")  // test intranet zone
                correction -= 29;
            c.SeeItLeft = window.screenLeft - 8;
            c.SeeItTop = window.screenTop - correction;
            c.SeeItWidth = document.body.clientWidth + 17;
            c.SeeItHeight = document.body.clientHeight + 17;
        }
        c.Store();
    }
}

function UnLoad() {
    lms_ClosePage();
    SavePosition();
    if (playMode == "K") {
        trackScoreCompleted = GetResultInPercent(true);
        trackScoreRequired = KScoreNeeded;
        if (KTopicFinished || KScoringScreen || showActObj.nextFrame == 'end')
            trackComplete()
        else
            trackIncomplete();
    };
    if (playMode == "S" || playMode == "T" || playMode == "K") {
        ClosePlayer();
    }
    if (guidedParent) {
        guidedParent.GITMClosed();
    }
};

function StartFrameCorrection(frameID) {
    var originalFrameID = frameID;
    var frmPos = frameID;
    if (screens[frameID].backActions.length == 0) {
        StartScreen = "start";
        if (StartScreen != originalFrameID)
            StartAction = 0;
        return;
    };
    var fID = "";
    for (var i = 0; i < screens[frameID].backActions.length; i++) {
        if (i == 0)
            fID = screens[frameID].backActions[0].prevFrame
        else {
            if (fID != screens[frameID].backActions[0].prevFrame) {
                StartScreen = frameID;
                if (StartScreen != originalFrameID)
                    StartAction = 0;
                return;
            };
        };
    };
    frmPos = screens[frmPos].backActions[0].prevFrame;
    while (true) {
        if (screens[frmPos].backActions.length == 0) {
            StartScreen = "start";
            if (StartScreen != originalFrameID)
                StartAction = 0;
            return;
        };
        if (screens[frmPos].actions[0].type == "None") {
            frmPos = screens[frmPos].backActions[0].prevFrame;
            continue;
        };
        if (screens[frmPos].actions[0].type == "Decision") {
            StartScreen = frmPos;
            if (StartScreen != originalFrameID)
                StartAction = 0;
            return;
        };
        StartScreen = frameID;
        if (StartScreen != originalFrameID)
            StartAction = 0;
        return;
    };
};

function SetStartFrame(frameID) {
    if (frameID.length == 0)
        return;
    if (screens[frameID])
        StartScreen = frameID;
};

function SetStartContext(contextID) {
    if (contextID.length == 0)
        return;
    var ctxArray = new Array();
    ctxArray = contextID.split("+");

    for (var i = 0; i < ctxArray.length; i++) {
        ctxItem = ctxArray[i];
        for (var j = 0; j < screenNames.length; j++) {
            scrName = screenNames[j];
            scr = screens[scrName];
            for (var k = 0; k < scr.actions.length; k++) {
                act = scr.actions[k];
                if (act.ctx == ctxItem) {
                    SetStartFrame(scrName);
                    StartFrameCorrection(StartScreen);
                    return;
                };
            };
        };
    };
};

var ecidMatchingFrames = new Array();
var ecidStartDecisions = new Object();
var ecidDecisionStart = false;

function SearchPathForEcid(frid, ctxArray) {
    var frameid = frid;
    while (true) {
        if (frameid == "end") {
            return false;
        }
        var frame = screens[frameid];
        frame.type = frame.actions[0].type.toLowerCase();
        if (frame.type == "decision") {
            var match = false;
            ecidStartDecisions[frameid] = { id: frameid, display: false, pathstoignore: new Array() };
            for (var i = 0; i < frame.actions.length; i++) {
                if (SearchPathForEcid(frame.actions[i].nextFrame, ctxArray)) {
                    if (match) {
                        ecidStartDecisions[frameid].display = true;
                    }
                    match = true;
                }
                else {
                    ecidStartDecisions[frameid].pathstoignore.push(frame.actions[i].id);
                }
            }
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
        frameid = frame.actions[0].nextFrame;
    }
}

function FindEcidStartNextFrame(frid) {
    var frameid = frid;
    var frame = screens[frameid];
    frame.type = frame.actions[0].type.toLowerCase();
    if (frame.type == "decision") {
        if (ecidStartDecisions[frameid].display) {
            return frameid;
        }
    }
    for (var i = 0; i < ecidMatchingFrames.length; i++) {
        if (frameid == ecidMatchingFrames[i].frameid) {
            StartAction = ecidMatchingFrames[i].altindex;
            ecidDecisionStart = false;
            return frameid;
        }
    }
    for (var iii = 0; iii < frame.actions.length; iii++) {
        if (frame.actions[iii].nextFrame != "end") {
            var ret = FindEcidStartNextFrame(frame.actions[iii].nextFrame);
            if (ret) return ret;
        }
    }
}

function SetStartMatchedContext(param_ctxlist, param_guid) {
    if (param_ctxlist == "")
        return;
    if (param_guid != getMyGuid())
        return;

    SearchPathForEcid(screenNames[0], param_ctxlist);
    if (ecidMatchingFrames.length == 1) {
        SetStartFrame(ecidMatchingFrames[0].frameid);
        StartAction = ecidMatchingFrames[0].altindex;
        StartFrameCorrection(StartScreen);
    }
    else if (ecidMatchingFrames.length >= 2) {
        ecidDecisionStart = true;
        StartScreen = FindEcidStartNextFrame(screenNames[0]);
        StartFrameCorrection(StartScreen);
    }
}

function Skip() {
    return false;
};

function SetFlags() {
    for (var i = 0; i < screenNames.length; i++) {
        scrName = screenNames[i];
        var bcount = 0;
        for (var j = 0; j < screens[scrName].actions.length; j++) {
            var ie = screens[scrName].emptyinfo;
            var te = screens[scrName].actions[j].emptytext;
            var be = (ie && te);
            screens[scrName].actions[j].emptybubble = be;
            if (!be && screens[scrName].actions[j].realAction == true)
                bcount++;
        };
        for (var j = 0; j < screens[scrName].actions.length; j++) {
            screens[scrName].actions[j].showalternatives = (bcount > 1);
            if (screens[scrName].actions[j].type == "None" ||
				screens[scrName].actions[j].type == "Decision")
                screens[scrName].actions[j].showalternatives = false;
        };
    };
};

var bActionsBuilded = false;

function FrameContainer() {
    this.container = new Object();

    this.Clear = function () {
        this.container = new Object();
    }

    this.Contains = function (id) {
        try {
            var a = this.container[id];
            if (a != null)
                return true;
        }
        catch (e) { }
        return false;
    }

    this.Get = function (id) {
        if (this.Contains(id))
            return this.container[id];
        return null;
    }

    this.Add = function (id, nextid) {
        this.container[id] = nextid;
    }
}

var frameContainer = new FrameContainer();

function _isHiddenAction(a) {
    try {
        return (a.disabledmodes.indexOf(playMode) >= 0);
    }
    catch (e) {
        return false;
    }
}

function _isFrameToSkip(f) {
    if (playMode == "S") {
        var a = f.actions[0];
        if (!_isHiddenAction(a)) {
            return false;
        }
    }
    else {
        for (var i = 0; i < f.actions.length; i++) {
            var a = f.actions[i];
            if (!_isHiddenAction(a)) {
                return false;
            }
        }
    }
    return true;
}

// creates a new action array for a frame avoiding actions are hidden
function _createActionArray(fname) {
    var aa = new Array();
    var f = screens[fname];
    for (var i = 0; i < f.actions.length; i++) {
        var a = f.actions[i];
        if (!_isHiddenAction(a)) {
            aa[aa.length] = a;
        }
    }
    return aa;
}

function _buildActionsS() {
    // creating a map from the frames to skip
    for (var i = 0; i < screenNames.length; i++) {
        var f = screens[screenNames[i]];
        if (_isFrameToSkip(f)) {
            frameContainer.Add(f.actions[0].prevFrame, f.actions[0].nextFrame);
        }
    }
    // reducing map
    var changed = true;
    while (changed) {
        changed = false;
        for (var j in frameContainer.container) {
            var k = frameContainer.Get(j);
            var kn = frameContainer.Get(k);
            if (kn != null && k != kn) {
                frameContainer.Add(j, kn);
                changed = true;
            }
        }
    }
    // rebuild nextFrame pointers about the map
    for (var i = 0; i < screenNames.length; i++) {
        var fname = screenNames[i];
        var f = screens[fname];
        try {
            var next = f.actions[0].nextFrame;
            if (frameContainer.Contains(next)) {
                f.actions[0].nextFrame = frameContainer.Get(next);
            }
        }
        catch (e) { }
    }
}

function _buildActionsTK() {
    // creating a map from the frames to skip
    for (var i = 0; i < screenNames.length; i++) {
        var f = screens[screenNames[i]];
        if (_isFrameToSkip(f)) {
            for (var j = 0; j < f.backActions.length; j++)
                frameContainer.Add(f.backActions[j].nextFrame, f.actions[0].nextFrame);
        }
    }
    // reducing map
    var changed = true;
    while (changed) {
        changed = false;
        for (var j in frameContainer.container) {
            var k = frameContainer.Get(j);
            var kn = frameContainer.Get(k);
            if (kn != null && k != kn) {
                frameContainer.Add(j, kn);
                changed = true;
            }
        }
    }
    // rebuild nextFrame pointers about the map
    for (var i = 0; i < screenNames.length; i++) {
        var fname = screenNames[i];
        var f = screens[fname];
        f.actions = _createActionArray(fname);
        for (var j = 0; j < f.actions.length; j++) {
            var next = f.actions[j].nextFrame;
            if (frameContainer.Contains(next)) {
                f.actions[j].nextFrame = frameContainer.Get(next);
            }
        }
    }
}

function BuildActions() {
    if (bActionsBuilded)
        return;
    frameContainer.Clear();
    if (playMode == "S") {
        _buildActionsS();
    }
    else {
        _buildActionsTK();
    }
    bActionsBuilded = true;
}

var bBackActionsBuilded = false;

function BuildBackActions() {
    if (!bBackActionsBuilded) {
        for (var i = 0; i < screenNames.length; i++) {
            scr = screens[screenNames[i]];
            scr.backActions = new Array();
        };
        for (i = 0; i < screenNames.length; i++) {
            if (!frameContainer.Contains(screenNames[i])) {
                scr = screens[screenNames[i]];
                for (var j = 0; j < scr.actions.length; j++) {
                    scr.actions[j].prevFrame = screenNames[i];
                    s = scr.actions[j].nextFrame;
                    if (s != "end")
                        screens[s].backActions[screens[s].backActions.length] = scr.actions[j];
                }
            };
        };
    };
    bBackActionsBuilded = true;
};

var _deviceDPI = 0;

var swipe = new Swipe();
var screenwidth = 0;

function IsTouchEvent() {
    if (IsTouchDevice()) {
        if (UserPrefs.TryIt.EnableSkipping)
            return true;
        var t = showActObj.type.toLowerCase();
        if (t.indexOf('click') >= 0)
            return false;
        if (t.indexOf('input') >= 0)
            return false;
        return true;
    }
    return false;
}

function TestResolution() {
    var bw = document.body.clientWidth;
    var bh = document.body.clientHeight;
    var sw = document.getElementById("screen").clientWidth;
    var sh = document.getElementById("screen").clientHeight;
    if (bw != sw || bh != sh)
        document.body.style.overflow = "auto";
}

function SetVolumeLevel(v, m) {
    SoundPlayerObj.SetVolume(m ? 0 : v);
    UserPrefs.LoadCookie();
    UserPrefs.NavbarVolume = (m ? v + 1000 : v);
    UserPrefs.StoreCookie();
}

function UpdateHistoryFromTimeline(timelineindex) {
    var t = upk.Timeline.GetTimeline();
    showHistory = new Array();
    for (var i = 0; i < timelineindex; i++) {
        showHistory[showHistory.length] = t[i];
    }
}

function SetTimeLevel(t) {
    upk.Timeline.Lock(true, t);
    PlayStop();
    var fts = upk.Timeline.DeterminateCurrentFrameFromTime(t);
    if (fts.frameid == upk.Timeline.END_OF_TOPIC) {
        ClosePlayer()
        return;
    }
    timelineDescriptor = new TimelineDescriptor(true, fts.frameid, fts.timelineindex, fts.narration, fts.animation, fts.resttime);
    UpdateHistoryFromTimeline(fts.timelineindex);
    ShowScreen(fts.frameid, "", "back", true);
}

function MenuitemSelected(e) {
    if (!IsPaused())
        PauseToggle();
    //    alert(e.item);
    switch (e.item) {
        case "share":
            Share();
            break
        case "askexpert":
            AskAnExpert();
            break;
        case "providefeedback":
            ProvideFeedback();
            break;
        case "printit":
            ShowPrintit();
            break;
        case "preferences":
            OpenPreferences();
            break;
        case "help":
            LaunchHelp("../../")
            break;
        case "logout":
            LogOut();
            break;
        default:
    }
}

var tStartX, tStartY, disableSwipe = false, swipeStarted = false, sticktofinger = true, bubbleDrag = false;
var showCursor = false;
var fusionmode = false;
var touch_Started = false;
var disableswipeondrag = false;
function FirstScreen(restart) {

    template_pauselink = '<div align="right"><span id="prbr"><br /></span><a id="prdiv" class="InstructText" href="javascript:HLink(600)">' + R_interface_pause + '</a></div>'
    if (fusionmode && !isNavBar()) {
        navBar = new upk.player.navBar("navBar1", $(document.body), { ios: IsTouchDevice() })
        navBar.bind({
            "onnext": function () { ClearInfiniteButton(); DemoNext() },
            "onprev": function () { ClearInfiniteButton(); DemoPrev() },
            "onrefresh": function () { clearLastSoundFileName(); ClearInfiniteButton(); TeacherFastBack() },
            "onpausetoggle": function () { PauseToggle() },
            "onprefs": function () { SeeItPause(); OpenPreferences() },
            "onvolumechange": function (e) { SetVolumeLevel(e.volume, e.muted) },
            "onsliderchange": function (e) { SetTimeLevel(e.time) },
            "onhelp": function () { LaunchHelp("../../") },
            "onmenu": function (e) { MenuitemSelected(e); }
        });
        UserPrefs.LoadCookie();
        var v = UserPrefs.NavbarVolume;
        var m = v > 1000;
        if (m) {
            navBar.setVolume(v - 1000);
            navBar.toggleMute(true);
        }
        else {
            navBar.setVolume(v);
        }
        if (IsTouchDevice()) {
            navBar.setKeepHidden(true);
        } else {
            navBar.show();
        }

    }
    HideSplash();

    TestResolution();

    //if (IsTouchDevice()) {
    //    $("#spacer").hide();
    //}

    // Get the current device DPI
    if (_deviceDPI == 0)
        _deviceDPI = getDpiInfo();


    if (_deviceDPI != 96) {
        if (getDPICookie() == false) {
            loader_dontclose = true;
            this.location.replace("../../../html/unsuppdpi.html?" + Escape.MyEscape(AbsUrl(this.location.href)));
            return;
        }
    }
    InitLmsMode("player");

    if (!restart && lms_initialized == false) {

        // edw
        SetUpProgressReporting();

        GetOpener();
        var lms_opener = (window.opener == undefined ? window.parent : window.opener);
        /*
        if (lms_inAssessment == true) {
        lms_opener = window.opener.parent;
        }
        */

        var k = soundModes.indexOf(playMode);
        if (k < 0)
            soundIsExported = false;

        if (window.location.href.substr(0, 7).toLowerCase() != "file://" || !IsTouchDevice()) {
            if (location.hostname == "")
                soundIsExported = false;
        }

        if (_lmsMode != null) {
            if (nosound == false) {
                if (Sound_Init(soundIsExported, UserPref_PlayAudio_Original, null, false) == false) {
                    loader_dontclose = true;
                    return;
                }
            }
        }

        ctxHelper.SetContext("topicPlayer");
        lms_InitPage((_lmsMode == null ? lms_childIndex : -1), (_lmsMode == null ? (gopener == null ? lms_opener : gopener) : null), "T_" + document.getElementById("TopicId").getAttribute("topicid"), "FirstScreen()");
        return;
    }

    if (isNavBar()) {
        var url = "" + parent.location;
        var local = url.indexOf("localhost") > -1 || url.indexOf("127.0.0.1") > -1;  // we do not want to share local address
        navBar.initMenuItems(UIComponents.ShareLink && !local && GetTopLevelLmsMode() != "LMS",
                                lms_IsMentoringAvailable() == true,
                                lms_IsFeedbackAvailable() == true,
                                param_printitname.length > 0,
                                PlayerConfig.EnableCookies && UserPrefs.EnablePreferences,
                                UIComponents.TopicHelp,
                                (GetTopLevelLmsMode() == "KPT" || Kpath_launch == true) && lms_IsKPathLogoutAvailable());
    }

    if (nosound == true) {
        SetNoSound(true);
    }

    if (GetNoSound()) {
        soundIsExported = false;
    }

    BuildBackActions();
    BuildActions();
    bBackActionsBuilded = false;
    BuildBackActions();
    event_blocked = false;

    if (playMode != "K") {
        if (restart) {
            StartScreen = FirstScreenName;
        }
        else {
            SetStartFrame(param_frame);
            if (param_frame == "") {
                SetStartContext(param_ctx);
                SetStartMatchedContext(param_ctxlist, param_guid);
            }
            FirstScreenName = StartScreen;
            SetFlags();
        };
        if (StartScreen == "start") {
            if (showLeadIn == 0) {
                StartScreen = screens["start"].actions[0].nextFrame;
            }
            else if (showLeadIn != 1) {
                if (UserPrefs.ShowLeadIn == "toc") {
                    StartScreen = screens["start"].actions[0].nextFrame;
                }
            }
        }
    }
    else {
        FirstScreenName = StartScreen;
        KWrongScreens = new Array();
    };

    var screenObj = getDIV("screen")

    scrH = getObjHeight("screen");
    scrW = getObjWidth("screen");

    window.onresize = HandleResize0;
    if (!IsTouchDevice()) {
        window.onscroll = HandleResize;
    }

    document.body.oncontextmenu = EventCancel;

    window.onhelp = Skip;
    document.onhelp = Skip;
    screenObj.onhelp = Skip;

    // Safety net in case onresize/onscroll is not processed properly
    if (navigator.appName.substring(0, 9) != "Microsoft" && !IsTouchDevice()) {
        setInterval("HandleResize()", 1000)
    }

    if (document.layers) {
        document.captureEvents(Event.KEYDOWN)
        if (playMode == "T" || playMode == "K") screenObj.captureEvents(Event.MOUSEMOVE)
        screenObj.captureEvents(Event.MOUSEDOWN)
        if (playMode == "T" || playMode == "K") screenObj.captureEvents(Event.MOUSEUP)
        screenObj.captureEvents(Event.DBLCLICK)
    }

    if (playMode == "T" || playMode == "K") screenObj.onmousemove = EventMouseMove
    getDIV("scrtransparent").onmousedown = EventMouseDown;
    document.onmousedown = DocEventMouseDown;
    if (playMode == "T" || playMode == "K") screenObj.onmouseup = EventMouseUp
    screenObj.ondblclick = EventDblClk;

    if (screenObj.addEventListener)
        screenObj.addEventListener('DOMMouseScroll', EventWheel, false)
    else
        screenObj.onmousewheel = EventWheel;

    // ondblclick is also assigned statically in the HTML text to avoid a
    // bug in current Mozilla betas (0.9.4 at the time of writing)
    screenObj.oncontextmenu = EventCancel
    screenObj.ondragstart = EventCancel
    document.ondragstart = EventCancel

    document.onkeydown = EventKeyDown;
    document.onkeypress = EventKeyPress;

    document.onstop = null
    if (screenwidth == 0) {
        screenwidth = $("#screen").width() + 2;

        if (IsTouchDevice()) {

            var clname = document["body"].className;
            if (clname.indexOf('ipad') < 0) {
                document["body"].className = clname + " ipad";
            }

            setiPadScreen();
            $("body").bind('orientationchange', function (e) {
                if (actionMenu) {
                    if (actionMenu.IsOnScreen()) {
                        actionMenu.Close();
                    };
                }
                setiPadScreen();
                //setTimeout("binterf.RefreshPosition();", 100);
            });

            $("body").bind('touchstart', function (e) {
                if (touchIntroChecked == false)
                    return;
                if (IsPreferencesOpened())
                    return;
                if (actionMenu && actionMenu.IsOnScreen())
                    return;
                if (playMode != "K" || scr == "start" || IsLeadOut() || IsExplanation()) {
                    //					if(e.originalEvent.touches.length == 1 && e.originalEvent.changedTouches.length) {sticktofinger = true;}
                    var te = touch(e);
                    swipe.Init(screenwidth);
                    tStartX = te.pageX;
                    tStartY = te.pageY;
                }
            });

            $("body").bind('touchmove', function (e) {
                touch_Started = true;
                if (touchIntroChecked == false)
                    return;
                if (IsPreferencesOpened())
                    return;
                if (actionMenu && actionMenu.IsOnScreen())
                    return;
                if ((playMode != "K" || scr == "start" || IsLeadOut() || IsExplanation()) && !bubbleDrag) {
                    if (e.originalEvent.touches.length > 1 && !sticktofinger) { return; }
                    if (disableSwipe || swipeStarted) { e.preventDefault(); return false; }
                    try {
                        if ((e.originalEvent.touches[1] || e.originalEvent.changedTouches[1]) && !sticktofinger) {
                            swipe.DetectedMulti();
                        }
                        else if (swipe.IsNotZoomed()) {
                            if (disableswipeondrag == false) {
                                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                                var tPosX = touch.pageX - tStartX;
                                if ((tPosX > 0 && !swipePrevEnabled) || (tPosX < 0 && !swipeNextEnabled)) tPosX /= 2;
                                //								$("#screencontent").css("-webkit-transform", "translate(" + (tPosX) + "px)")
                                $("#screencontent").css({ "-webkit-transform": "translate3d(" + (tPosX) + "px,0,0)" });
                                sticktofinger = true;
                            }
                            e.preventDefault();
                        }
                    }
                    catch (e) { };
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    swipe.Add(touch.pageX, touch.pageY);
                }
            });

            $("body").bind('touchend', function (e) {
                if (touch_Started == true) {
                    touch_Started = false;
                    if (isNavBar())
                        navBar.hideMenu();
                }
                else
                    return;
                if (touchIntroChecked == false)
                    return;
                if (IsPreferencesOpened())
                    return;
                if (actionMenu && actionMenu.IsOnScreen()) {
                    CloseAction();
                    return;
                }
                if (playMode != "K" || scr == "start" || IsLeadOut() || IsExplanation()) {
                    if (e.originalEvent.touches.length > 0 && !sticktofinger) { disableSwipe = true; return false; }
                    if (e.originalEvent.touches.length == 0 && e.originalEvent.changedTouches.length) { disableSwipe = false; sticktofinger = false; }
                    if (disableSwipe || swipeStarted) { e.preventDefault(); return false; }
                    var sensitivity = $("#screen").width() / 2;
                    var speedsensitivity = 30;
                    if (swipe.IsMulti()) {
                        //							alert("multi")
                        if (swipe.IsNotZoomed() == true) {
                            $("#screencontent").addClass("swipeanim");
                            $("#screencontent").css({ "-webkit-transform": "translate3d(0,0,0)" });
                            setTimeout(function () {
                                $("#screencontent").removeClass("swipeanim");
                            }, 400)
                        }
                        //                    setTimeout("binterf.RefreshPosition();", 100);
                        return;
                    }
                    if (swipe.IsNotZoomed() == false) {
                        return;
                    }
                    var x = swipe.GetX();
                    var y = swipe.GetY();
                    var speedx = swipe.GetSpeedX();
                    var speedy = swipe.GetSpeedY();
                    if (Math.abs(y) > Math.abs(x)) {
                        $("#screencontent").addClass("swipeanim");
                        disableSwipe = true;
                        $("#screencontent").css({ "-webkit-transform": "translate3d(0,0,0)" });
                        setTimeout(function () {
                            $("#screencontent").removeClass("swipeanim");
                            disableSwipe = false;
                        }, 400)
                        return;
                    }
                    if (swipePrevEnabled && x > 0 && (x > sensitivity || speedx > speedsensitivity)) {
                        //                   alert("touch right swipe");
                        swipeStarted = true;
                        $("#screencontent").addClass("swipeanim");
                        var w = $("#screen").width() + 102;
                        $("#screencontent").css({ "-webkit-transform": "translate3d(" + w + "px,0,0)" });
                        $("#screencontent").bind("webkitTransitionEnd", function () {
                            $("#screencontent").removeClass("swipeanim");
                            CloseAction();
                            if (playMode == "S") {
                                ClearInfiniteButton();
                                DemoPrev(true);
                            }
                            else
                                TeacherBack();
                            $("#screencontent").unbind("webkitTransitionEnd");
                        })
                    }
                    else if ((IsDragBegin() || IsDragSequence() || swipeNextEnabled || IsLeadOut()) && x < 0 && (x < (0 - sensitivity) || speedx < (0 - speedsensitivity)) && IsTouchEvent()) {
                        //                    alert("touch left swipe");
                        if (IsDragBegin() && KGuestDemoMode == 0) {
                            StartDemoInTryIt();
                            return;
                        }
                        if ((IsDragBegin() || IsDragSequence()) && KGuestDemoMode == 1) {
                            TeacherForward(false);
                            return;
                        }
                        animSpeed = speedx;
                        swipeStarted = true;
                        $("#screencontent").addClass("swipeanim");
                        var w = -($("#screen").width() + 102);
                        $("#screencontent").css({ "-webkit-transform": "translate3d(" + w + "px,0,0)" });
                        $("#screencontent").bind("webkitTransitionEnd", function () {
                            $("#screencontent").removeClass("swipeanim");
                            CloseAction();
                            if (playMode == "S") {
                                ClearInfiniteButton();
                                DemoNext();
                            }
                            else {
                                var a = new Object();
                                a.keyCode = 13;
                                EventKeyDown(a);
                            }
                            $("#screencontent").unbind("webkitTransitionEnd");
                        })
                    }
                    else {
                        $("#screencontent").addClass("swipeanim");
                        disableSwipe = true;
                        $("#screencontent").css({ "-webkit-transform": "translate3d(0,0,0)" });
                        setTimeout(function () {
                            $("#screencontent").removeClass("swipeanim");
                            disableSwipe = false;
                        }, 400)
                    }
                }
            });
        }

    }

    if (parent)
        parent.document.onstop = null;
    window.onunload = UnLoad;
    window.onbeforeunload = BeforeUnload;
    window.onfocus = OnFocus;

    curH = getObjHeight("cursor");
    curW = getObjWidth("cursor");
    sx = screenObj.offsetLeft;
    sy = screenObj.offsetTop;
    if (upk.browserInfo.isiOS()) {
        if (sx > scrW)
            sx -= (scrW + 100);
    }
    shiftTo("cursor", (scrW - curW - sx - cursor_alignment_x) / 2, (scrH - curH - sy - cursor_alignment_y) / 2);
    showCursor = false;

    var StartScreenSaved = StartScreen;
    StartScreen = "";
    HandleResize();
    StartScreen = StartScreenSaved;
    if (!restart) {
        binterf = new JSBubbleInterface("bubb01");
    };

    binterf.SetEnableCloseButton(1);

    if (playMode == "T") {
        binterf.SetMode(R_mode_tryit);
        binterf.SetActionText(R_interface_action);
        binterf.SetMoveable(false);
    };
    if (playMode == "S") {
        binterf.SetMode(R_mode_seeit);
        //		binterf.SetActionText(R_interface_pause,true);
        if (!fusionmode)
            binterf.SetActionText(R_interface_action);
        binterf.SetMoveable(false);
    };
    if (playMode == "K") {

        binterf.SetMode(R_mode_knowit);
        binterf.SetActionText(R_interface_action);
        binterf.SetPosition(-1, -1, -1, -1, true, 0, 0, 0);
        binterf.SetMoveable(true);
    };

    document.getElementById("frameidtext").innerHTML = R_frameid;

    switch (PlayerConfig.ShowFrameID.toLowerCase()) {
        case "on":
            document.getElementById("frameiddiv").style.display = "block";
            // ___TraceInit();
            break;
        case "off":
            document.getElementById("frameiddiv").style.display = "none";
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

    lms_topicStart(getMyGuid(), playMode);

    ShowScreen(StartScreen, StartAction)
    try {
        window.focus()
    }
    catch (e) { };

    /* edw */
    if (playMode == "S") {
        upk.Timeline.CalculateTimelineThrough("end");
    }

}

var ___TraceStarted = false;

function ___TraceInit() {
    $("#frameiddiv").append("<div id='mytracediv'></div>");
    ___TraceStarted = true;
}

function ___TraceClear() {
    if (___TraceStarted == true)
        $("#mytracediv").html("");
}

function ___Trace(s) {
    if (___TraceStarted == true)
        $("#mytracediv").html($("#mytracediv").html() + "<br/>" + s);
}

function setiPadScreen() {
    if (window.innerWidth / window.innerHeight > $("#screen").width() / $("#screen").height()) {
        $("html").css({
            "margin": 0,
            "padding": 0
        });
        $("body").css({
            "position": "relative",
            "margin": 0,
            "padding": 0
        }).width(window.innerWidth / window.innerHeight * $("#screen").height());
        //$("#screen").css("top", 0)
        //$("#screen").css("left", (((window.innerWidth / window.innerHeight * $("#screen").height()) - $("#screen").width()) / 2))
        //alert(((window.innerWidth / window.innerHeight * $("#screen").height()) - $("#screen").width()) / 2)
        //shiftTo("screen", ((window.innerWidth / window.innerHeight * $("#screen").height()) - $("#screen").width()) / 2, 0)
    } else {
        $("body").width($("#screen").width());
        //$("#screen").css("left", 0)
        //$("#screen").css("top", (((window.innerHeight / window.innerWidth * $("#screen").width()) - $("#screen").height()) / 2))
    }


}

var swipeNextEnabled = false, swipePrevEnabled = false;
function EnableSwipeNext(img) {
    if (swipeNextEnabled) {
        $("#nextscreen").css("background-image", "url('" + img + "')");
    }
    else {
        $("<div/>", {
            id: "nextscreen",
            style: "float:left; margin-left:100px; margin-top:1px; width:" + ($("#screen").width() + 2) + "px;height:" + ($("#screen").height() + 2) + "px; background-color:Blue; background-image : url('" + img + "')"
        }).appendTo("#screencontent")
        swipeNextEnabled = true;
    }
}

function DisableSwipeNext() {
    if (swipeNextEnabled) {
        $("#nextscreen").remove();
        swipeNextEnabled = false;
    }
}

function EnableSwipePrev(img) {
    if (swipePrevEnabled) {
        $("#prevscreen").css("background-image", "url('" + img + "')");
    }
    else {
        $("<div/>", {
            id: "prevscreen",
            style: "float:left; margin-right:100px; margin-top:1px; width:" + ($("#screen").width() + 2) + "px;height:" + ($("#screen").height() + 2) + "px; background-color:Blue; background-image : url('" + img + "')"
        }).prependTo("#screencontent")
        swipePrevEnabled = true;
    }
}

function DisableSwipePrev() {
    if (swipePrevEnabled) {
        $("#prevscreen").remove();
        swipePrevEnabled = false;
    }
}

function SetSound(value) {
    soundIsExported = value;
};

function soundIsPublished() {
    return true;
}

function SetKScore(score) {
    KScoreNeeded = score;
};

function HexaToDec(hexa) {
    if (hexa.length == 0)
        return "";
    try {
        return hexa.substr(0, 1) + parseInt("0x" + hexa.substr(1));
    }
    catch (e) {
        return "";
    }
}

function ecidStr(s) {
    return replaceString("%27", "'", s);
}

function ParseArguments() {
    var strArgs;
    var strArg;

    // Call parameters can be seperated from the URL by either a "?"
    // or a "#" character...

    var ss = document.location.hash.substring(1);
    strArgs = ss.split("&");
    if (strArgs.length == 0 || strArgs[0] == "") {
        ss = document.location.search.substring(1);
        strArgs = ss.split("&");
    };

    if (strArgs.length == 1) {
        if (strArgs[0].toLowerCase().substr(0, 3) == "su=") {
            var s = Escape.SafeUriUnEscape(strArgs[0].substr(3));
            strArgs = s.split("&");
        }
    }

    var _dLaunch = false;
    var _keepAlive = false;

    for (var i = 0; i < strArgs.length; i++) {
        strArg = (strArgs[i]);

        if (strArg.substr(0, 5).toLowerCase() == "mode=") {
            playMode = strArg.substr(5, 1);
            if (playMode == "S")
                fusionmode = true;
        }
        if (strArg.substr(0, 9).toLowerCase() == "framehex=") {
            param_frame = HexaToDec(strArg.substr(9));
        }
        if (strArg.substr(0, 6).toLowerCase() == "frame=") {
            param_frame = strArg.substr(6);
        }
        if (strArg.substr(0, 4).toLowerCase() == "ctx=") {
            param_ctx = strArg.substr(4);
        }
        if (strArg.substr(0, 5).toLowerCase() == "guid=") {
            param_guid = strArg.substr(5);
        }
        if (strArg.substr(0, 12).toLowerCase() == "contextlist=") {
            param_ctxlist = strArg.substr(12);
        }
        if (strArg.substr(0, 8).toLowerCase() == "leadin=1") {
            showLeadIn = 1;
        }
        if (strArg.substr(0, 8).toLowerCase() == "leadin=0") {
            showLeadIn = 0;
        }
        if (strArg.substr(0, 12).toLowerCase() == "printitname=") {
            param_printitname = strArg.substr(12);
        }
        if (strArg.substr(0, 11).toLowerCase() == "childindex=") {
            lms_childIndex = parseInt(strArg.substr(11));
        }
        if (strArg.substr(0, 10).toLowerCase() == "assessment") {
            lms_inAssessment = true;
        }
        if (strArg.substr(0, 7).toLowerCase() == "nosound") {
            nosound = true;
        }
        if (strArg.substr(0, 12).toLowerCase() == "directlaunch") {
            _dLaunch = true;
        }
        if (strArg.substr(0, 16).toLowerCase() == "keep-alive-timer") {
            _keepAlive = true;
        }
    }
    if (_dLaunch == true && _keepAlive == true) {
        KeepAlive_Init("../../../");
    }
    if (playMode == "K") {
        trackArgList = strArgs;
        trackOnBegin();
    };
}

var clicknum = 1

function SoundToggle() {
    clicknum = clicknum + 1
    if (Math.floor(clicknum / 2) == clicknum / 2) {
        document.imgS.src = "sound_isoff.gif";
    }
    else {
        document.imgS.src = "sound_ison.gif";
    }
}

function OpenDialog(URL) {
    day = new Date();
    id = day.getTime();
    eval("page" + id + " = window.open(MakeAbsolute(URL), '" + id + "', 'toolbar=1,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=506,height=338,left = 147,top = 131');");
}

var _infiniteButton = false;

function SetButtonToBeInfinite() {
    if (fusionmode) {
        _infiniteButton = true;
        navBar.togglePause(true);
    }
}

function ClearInfiniteButton() {
    if (fusionmode) {
        if (_infiniteButton == true) {
            _infiniteButton = false;
            navBar.togglePause(isPaused);
            return true;
        }
    }
    return false;
}

function PauseToggle() {
    if (ClearInfiniteButton() == true) {
        DemoNext();
        return;
    }
    try {
        _lastAsyncronFile = false;
        isPaused = !isPaused;
        if (isPaused) {
            if (fusionmode == false) {
                binterf.SetPRText(R_interface_resume);
                binterf.StartBlink();
            }
            PlayPause();
        }
        else {
            if (fusionmode == false) {
                binterf.EndBlink();
                binterf.SetPRText(R_interface_pause);
            }
            if (!PlayResume()) {
                if (isNavBar())
                    navBar.togglePause(isPaused);
                TeacherFastBack();
                return;
            }
        }
        if (parent.setPauseStatus)
            parent.setPauseStatus(isPaused);
        if (isNavBar())
            navBar.togglePause(isPaused);
    }
    catch (e) {
        isPaused = !isPaused;
    }
}

function SeeItPause() {
    if (playMode == "S" && !isPaused)
        PauseToggle();
}

function SeeItResume() {
    if (playMode == "S" && isPaused)
        PauseToggle();
}

function IsPaused() {
    return isPaused;
}

function SetScrollbars() {
    var div = getDIV("screen");
    var w = div.offsetWidth;
    //	var ww=window.screen.width;
    var ww = document.body.clientWidth + 2;
    var h = div.offsetHeight;
    //	var hh=window.screen.height;
    var hh = document.body.clientHeight;
    if (w > ww || h > hh) {
        document.body.scroll = "auto";
    };
};

function SetScreenshotPath(s) {
    if (!s)
        s = "";
    if (s == "")
        screenshotPath = MakeAbsolute("")
    else
        screenshotPath = s;
    if (s != "")
        SoundPlayerObj.SetSoundPath(s);
};

function SetRemediationLevels(level1, level2, level3) {
    KRemediation1 = level1;
    KRemediation2 = level2;
    KRemediation3 = level3;
}

function SetTopicName(s) {
    if (!s)
        s = "";
    if (s.length > 0)
        topicName = unescape(s);
}

function SetTopicShowBubbles(s) {
    topicShowBubbles = s;
}

function fixHTMLString(strHTMLString) {
    strHTMLString = replaceString("<", "&lt;", strHTMLString);
    strHTMLString = replaceString(">", "&gt;", strHTMLString);
    strHTMLString = replaceString("'", "&#39;", strHTMLString);
    strHTMLString = replaceString('"', "&#34;", strHTMLString);

    return strHTMLString;
}

function DecodeInputString(s) {
    s = replaceString("&lt;", "<", s);
    s = replaceString("&gt;", ">", s);
    s = replaceString("&amp;", "&", s);
    return s;
}

//
// Initialization and preloads
//

ParseArguments()

//
// Mode-specific styles
//

document.writeln("<STYLE>")
if (playMode == "S") {
    document.writeln("A.textLink {text-decoration:none; color:black}")
    document.writeln(".infoblocks {display:none}")
}
else {
    document.writeln("A.textLink {color:#0033cc}")
}
document.writeln("</STYLE>")

//
// Force reload when Netscape 4 resizes window
//

if (NS4) {
    var loadWidth = window.innerWidth
    var loadHeight = window.innerHeight
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

/********** swipe support ************************************************************************/

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

/*************************************************************************************************/

var __myLogWnd = null;

function MYLOGOpen() {
    if (__myLogWnd == null)
        __myLogWnd = window.open();
}

function MYLOG(o) {
    MYLOGOpen();
    __myLogWnd.document.write("<hr/>");
    __myLogWnd.document.write(o + "<br/><br/>");
    for (var name in o) {
        __myLogWnd.document.write(name + ": " + o[name] + "<br/>");
    }
    __myLogWnd.document.write("<hr/>");
}

function MYLOGSimple(s) {
    MYLOGOpen();
    __myLogWnd.document.write(s + "<br/>");
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

/* navbar.js */
/*--
Copyright � 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

//file version 1.0

var upk = upk || {};
///////////////////////////////////
//  +++ class upk.player.navBar  //
///////////////////////////////////

$.extend(true, upk, {
    player: {
        navBar: function (id, parentElement, opts) {
            /// <summary>navBar object, can be created using "new" keyword</summary>
            /// <param name="id" type="String">navBar id</param>
            /// <param name="parentElement" type="JQuery">The element that the navBar will be appended to</param>

            //////////////------- PUBLIC ---------//////////////
            var _this = this;

            _this.bind = function (p1, p2) {
                _self.bind(p1, p2);
            }

            _this.show = function (anim) {
                hideTimer = 28;
                _protected.scaleToWindow();
                if (_visible) { return; }
                _visible = true;
                if (anim) {
                    _self.show();
                    var h = $(".NavbarOuter").height();
                    $(".NavbarOuter").css({ "-webkit-transform": "translate3d(0," + h + "px,0)", "transform": "translate3d(0," + h + "px,0)", "-ms-transform": "translate3d(0," + h + "px,0)" });
                    $(".NavbarOuter").unbind("webkitTransitionEnd").unbind("transitionend");
                    $(".NavbarOuter, .timeslider").addClass("navbaranim");
                    $(".NavbarOuter").css({ "-webkit-transform": "translate3d(0,0,0)", "transform": "translate3d(0,0,0)", "-ms-transform": "translate3d(0,0,0)" });
                    $(".timeslider").css({ "-webkit-transform": "translate3d(0,0,0)" });
                    $(".NavbarOuter").bind("webkitTransitionEnd", function () {
                        $(".NavbarOuter").unbind("webkitTransitionEnd");
                        $(".NavbarOuter, .timeslider").removeClass("navbaranim");
                    }).bind("transitionend", function () {
                        $(".NavbarOuter").unbind("transitionend");
                        $(".NavbarOuter, .timeslider").removeClass("navbaranim");
                    })
                }
                else {
                    $(".NavbarOuter").css({ "-webkit-transform": "translate3d(0,0,0)", "transform": "translate3d(0,0,0)", "-ms-transform": "translate3d(0,0,0)" });
                    $(".timeslider").css({ "-webkit-transform": "translate3d(0,0,0)" });
                    _self.show();
                }
                _protected.scaleToWindow();
            }

            _this.hide = function (anim) {
                if (!_visible) { return; }
                _visible = false;
                if (anim) {
                    $(".NavbarOuter").unbind("webkitTransitionEnd").unbind("transitionend");
                    $(".NavbarOuter, .timeslider").addClass("navbaranim");
                    var h = $(".NavbarOuter").height();
                    $(".NavbarOuter").css({ "-webkit-transform": "translate3d(0," + h + "px,0)", "transform": "translate3d(0," + h + "px,0)", "-ms-transform": "translate3d(0," + h + "px,0)" });
                    $(".timeslider").css({ "-webkit-transform": "translate3d(0," + h + "px,0)" });
                    $(".NavbarOuter").bind("webkitTransitionEnd", function () {
                        $(".NavbarOuter").unbind("webkitTransitionEnd");
                        $(".NavbarOuter").removeClass("navbaranim");
                        _self.hide();
                    }).bind("transitionend", function () {
                        $(".NavbarOuter").unbind("transitionend");
                        $(".NavbarOuter, .timeslider").removeClass("navbaranim");
                        _self.hide();
                    })
                }
                else {
                    $(".NavbarOuter").css({ "-webkit-transform": "translate3d(0," + h + "px,0)", "transform": "translate3d(0," + h + "px,0)", "-ms-transform": "translate3d(0," + h + "px,0)" });
                    $(".timeslider").css({ "-webkit-transform": "translate3d(0," + h + "px,0)" });
                    _self.hide();
                }
            }

            _this.setOptions = function (opts) {
                $.extend(_protected.options, opts);
            }

            _this.setEndTime = function (t) {
                if (_timeSliderDragged) { return; }
                _endTime = t;
                _self.find(".endtime").text(getTime(_endTime));
                _self.find(".timeslider").slider("option", "max", _endTime);
                _this.setCurrentTime(_currentTime);
                var wt = 0
                if (_endTime >= (1000 * 60 * 60)) { wt = _protected.options.ios ? 260 : 120 }
                else { wt = _protected.options.ios ? 180 : 100 }
                _self.find(".timerdisplay").width(wt);
            }

            _this.setCurrentTime = function (t) {
                if (_timeSliderDragged) { return; }
                _currentTime = t;
                _self.find(".currenttime").text(getTime(_currentTime));
                _self.find(".timeslider").slider("value", _currentTime);
            }

            _this.setVolume = function (v) {
                _volume = v;
                _self.find(".volumeslider").slider("value", _volume);
            }

            _this.setKeepHidden = function (b) {
                _keepHidden = b;
                if (hideTimer > 0) { hideTimer = 28; }
                if (_keepHidden) { _keepVisible = false; _this.hide(); }
                else if (hideTimer > 0) { _this.show(); }
            }

            _this.setKeepVisible = function (b) {
                _keepVisible = b;
                if (_keepVisible) { _keepHidden = false; _this.show(); }
            }

            _this.toggleMute = function (m) {
                _volumeMuted = m;
                if (_volumeMuted) {
                    _self.find(".volumeslider").slider("value", 0);
                }
            }

            _this.initMenuItems = function (share, askexpert, providefeedback, printit, preferences, help, logout) {
                var isEmpty = !(share || askexpert || providefeedback || printit || preferences || help || logout);
                var needsSeparator = ((share || askexpert || providefeedback || printit) && (preferences || help || logout));

                if (isEmpty) {
                    _self.find(".menubutton").remove();
                    return;
                }

                if (share == false) { _self.find(".m_share").css("display", "none"); }
                if (askexpert == false) { _self.find(".m_askexpert").css("display", "none"); }
                if (providefeedback == false) { _self.find(".m_providefeedback").css("display", "none"); }
                if (printit == false) { _self.find(".m_printit").css("display", "none"); }
                if (preferences == false) { _self.find(".m_preferences").css("display", "none"); }
                if (help == false) { _self.find(".m_help").css("display", "none"); }
                if (needsSeparator == false) { _self.find(".m_separator").css("display", "none"); }
                if (logout == false) { _self.find(".m_logout").css("display", "none"); }

                var c = _self.find(".menucontainer");
                c.css('top', '-' + (c.height() + 3) + "px");
            }

            _this.hideMenu = function () {
                _self.find(".menucontainer").hide();
            }

            var _isPaused = true;
            _this.togglePause = function (p) {
                _isPaused = p;
                if (_isPaused) {
                    _self.find(".pauseresumebutton").removeClass("pause_butt" + classPostFix).addClass("play_butt" + classPostFix);
                } else {
                    _self.find(".pauseresumebutton").removeClass("play_butt" + classPostFix).addClass("pause_butt" + classPostFix);
                }
            }

            _this.getHeight = function () {
                return $(".NavbarOuter").height();
            }

            /////////////----------- PROTECTED ---------------/////////////////

            var _protected = {};
            _protected.id = id;
            _protected.parentElement = parentElement;
            _protected.options = {
                ios: false
            };
            $.extend(_protected.options, opts);

            _protected.create = function () {
                /// <summary>Creates navbar DOM</summary>
                /// <returns type="JQuery" /> Returns the navbar container element

                var self = $("<div>", {
                    "class": "NavbarWrapper" + (_protected.options.ios ? "" : " small"),
                    html: [$("<div>", {
                        "class": "NavbarOuter",
                        html: $("<div>", {
                            id: _protected.id,
                            "class": "NavbarMain",
                            html: [$("<div>", {
                                "class": "prevbutton previous_butt" + classPostFix,
                                title: R_fusion_back,
                                html: "",
                                click: function () { _self.trigger("onprev"); }
                            }), $("<div>", {
                                "class": "pauseresumebutton pause_butt" + classPostFix,
                                title: R_fusion_play_pause,
                                html: "",
                                click: function () { _self.trigger("onpausetoggle"); }
                            }), $("<div>", {
                                "class": "nextbutton next_butt" + classPostFix,
                                title: R_fusion_forward,
                                html: "",
                                click: function () { _self.trigger("onnext"); }
                            }), $("<div>", {
                                "class": "refreshbutton refresh_butt" + classPostFix,
                                title: R_fusion_restart,
                                html: "",
                                click: function () { _self.trigger("onrefresh"); }
                            }), $("<div>", {
                                "class": "slidercontainer slider_backgrnd" + classPostFix,
                                html: $("<div>", {
                                    "class": "sliderleft slider_leftbar" + classPostFix
                                })
                            }), $("<div>", {
                                "class": "menubutton more_butt" + classPostFix,
                                title: R_fusion_more,
                                html: $("<div>", {
                                    "class": "menucontainer",
                                    title: "",
                                    html: [$("<ul>", {
                                        html: [$("<li>", {
                                            "class": "m_share",
                                            click: function () { _self.trigger({ type: "onmenu", item: "share" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage share_link" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_menu_share
                                            })]
                                        }), $("<li>", {
                                            "class": "m_askexpert",
                                            click: function () { _self.trigger({ type: "onmenu", item: "askexpert" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage askexpert_button" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_interface_askexpert
                                            })]
                                        }), $("<li>", {
                                            "class": "m_providefeedback",
                                            click: function () { _self.trigger({ type: "onmenu", item: "providefeedback" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage feedback_qualifier" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_interface_providefeedback
                                            })]
                                        }), $("<li>", {
                                            "class": "m_printit",
                                            click: function () { _self.trigger({ type: "onmenu", item: "printit" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage PrintAreaIconPurple" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_interface_printit
                                            })]
                                        }), $("<li>", {
                                            "class": "m_separator",
                                            html: $("<hr>", {
                                                width: "90%"
                                            })
                                        }), $("<li>", {
                                            "class": "m_preferences",
                                            click: function () { _self.trigger({ type: "onmenu", item: "preferences" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage prefs_button2b" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_menu_preferences
                                            })]
                                        }), $("<li>", {
                                            "class": "m_help",
                                            click: function () { _self.trigger({ type: "onmenu", item: "help" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage helptopics" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_menu_help
                                            })]
                                        }), $("<li>", {
                                            "class": "m_logout",
                                            click: function () { _self.trigger({ type: "onmenu", item: "logout" }) },
                                            html: [$("<div>", {
                                                "class": "menuimage logout_button" + classPostFixIOS
                                            }), $("<span>", {
                                                "class": "menutext",
                                                text: R_toctooltip_kpathlogout
                                            })]
                                        })]
                                    }), $("<div>", {
                                        "class": "menupointer dialog_pointer"
                                    })]
                                }),
                                click: function (e) {
                                    var c = $(this).find(".menucontainer").toggle();
                                    _self.trigger({
                                        type: "onmenu",
                                        item: (c.css("display") == "none" ? "closed" : "opened")
                                    });
                                    _this.setKeepVisible(c.css("display") != "none");
                                    return false;
                                }
                            }), $("<div>", {
                                "class": "timerdisplay slider_backgrnd" + classPostFix,
                                html: [$("<span>", {
                                    "class": "currenttime",
                                    text: getTime(_currentTime)
                                }), $("<span>", {
                                    text: " / "
                                }), $("<span>", {
                                    "class": "endtime",
                                    text: getTime(_endTime)
                                })]
                            }), $("<div>", {
                                html: "",
                                "class": "timerleft slider_leftbar" + classPostFix
                            }), $("<div>", {
                                "class": "volumebutton volume_butt" + classPostFix,
                                html: $("<div>", {
                                    "class": "volumeslidercontainer",
                                    html: $("<div>", {
                                        "class": "volumeslider"
                                    })
                                }),
                                click: function () {
                                    _volumeMuted = !_volumeMuted;
                                    _self.trigger({
                                        type: "onvolumechange",
                                        volume: _volume,
                                        muted: _volumeMuted
                                    })
                                    _self.find(".volumeslider").slider("value", (_volumeMuted ? 0 : _volume));
                                }
                            })]
                        })
                    }), $("<div>", {
                        html: "",
                        "class": "timeslider"
                    })]
                })
                self.appendTo(_protected.parentElement);

                ////// Set up JQuery slider
                self.find(".timeslider").slider({
                    orientation: "horizontal",
                    range: "min",
                    change: function (event, ui) {
                        _self.find(".currenttime").text(getTime(ui.value));
                    },
                    start: function (event, ui) { _timeSliderDragged = true },
                    stop: function (event, ui) {
                        _timeSliderDragged = false;
                        _self.trigger({
                            type: "onsliderchange",
                            time: ui.value
                        })
                    },
                    slide: function (event, ui) {
                        _self.find(".currenttime").text(getTime(ui.value));
                        _self.trigger({
                            type: "onsliderslide",
                            time: ui.value
                        })
                    }
                });

                if (_protected.options.ios) {
                    //// Remove desktop specific elements
                    self.find(".ui-slider .ui-slider-handle").addClass("sliderpointer");
                    self.find(".volumebutton").remove();
                } else {
                    //// Set hover color
                    self.find(".prevbutton, .pauseresumebutton, .nextbutton, .refreshbutton, .menubutton, .volumebutton").bind({
                        "mouseenter": function () { $(this).css("background-color", "#cacac9") },
                        "mouseleave": function () { $(this).css("background-color", "") }
                    })
                    self.find(".m_share, .m_askexpert, .m_providefeedback, .m_printit, .m_preferences, .m_help, .m_logout").bind({
                        "mouseenter": function () { $(this).css("background-color", "#97c4ff") },
                        "mouseleave": function () { $(this).css("background-color", "") }
                    })
                    //// Set up JQuery slider for volume control
                    self.find(".volumeslider").slider({
                        orientation: "horizontal",
                        range: "min",
                        max: 100,
                        value: 100,
                        change: function (event, ui) {
                            if (!_volumeMuted) { _volume = ui.value; }
                            _volumeMuted = (ui.value == 0);
                            if (_volumeMuted) { _self.find(".volumebutton").removeClass("volumebutton" + classPostFix).addClass("volumemuted_butt" + classPostFix); }
                            else { _self.find(".volumebutton").addClass("volumebutton" + classPostFix).removeClass("volumemuted_butt" + classPostFix); }
                            _self.trigger({
                                type: "onvolumechange",
                                volume: _volume,
                                muted: _volumeMuted
                            })
                        },
                        slide: function (event, ui) {
                            _volumeMuted = (ui.value == 0);
                            _volume = ui.value;
                            if (_volumeMuted) { _self.find(".volumebutton").removeClass("volumebutton" + classPostFix).addClass("volumemuted_butt" + classPostFix); }
                            else { _self.find(".volumebutton").addClass("volumebutton" + classPostFix).removeClass("volumemuted_butt" + classPostFix); }
                            _self.trigger({
                                type: "onvolumechange",
                                volume: _volume,
                                muted: _volumeMuted
                            })
                        }
                    });
                    self.find(".volumeslider.ui-slider .ui-slider-handle").addClass("volumesliderbutton");
                    self.find(".timeslider").appendTo(".NavbarOuter");
                }
                self.find(".timeslider .ui-slider-handle").addClass("slider_pointer" + classPostFix);
                self.find(".timeslider .ui-slider-range-min").addClass("slider_left" + classPostFix);
                return self;
            }

            _protected.scaleToWindow = function () {
                /// <summary>Sets navbar positions</summary>

                var addHeight = 0;                               /// NavbarOuter is set to hide overflow, need to add height when menus are open
                if (_self.find('.volumeslidercontainer').is(':visible')) {
                    addHeight = 22;
                }
                if (_self.find('.menucontainer').is(':visible')) {
                    addHeight += _self.find('.menucontainer').height() + 3;
                }
                if (_protected.options.ios) {
                    var c = _self.find(".menucontainer");
                    c.css('top', '-' + (c.height() + 3) + "px");
                    var ww = (window.orientation == 0 || window.orientation == 180) ? window.innerWidth / 45 * 87 : window.innerWidth / 45 * 87;
                    var zoomfactor = window.innerWidth / ww;
                    _self.find(".NavbarOuter").css({
                        "height": (87 + addHeight) * zoomfactor,
                        "top": window.pageYOffset + window.innerHeight - (87 + addHeight) * zoomfactor
                    })
                    _self.find(".NavbarMain").css({
                        "transform": "scale(" + zoomfactor + ")",
                        "-ms-transform": "scale(" + zoomfactor + ")",
                        "-webkit-transform": "scale(" + zoomfactor + ")",
                        "-o-transform": "scale(" + zoomfactor + ")",
                        "-moz-transform": "scale(" + zoomfactor + ")"
                    })
                    _self.find(".NavbarMain").css({
                        "left": window.pageXOffset - ((ww - window.innerWidth) / 2),
                        "top": 0 - ((87 - 87 * zoomfactor) / 2) + addHeight * zoomfactor,
                        "width": ww
                    })
                    var dw = 0, dl = 0;
                    _self.find(".NavbarMain > div").not(".slidercontainer").each(function () { dw += $(this).width() })
                    _self.find(".slidercontainer").prevAll().each(function () { dl += $(this).width() })
                    _self.find(".slidercontainer").css({
                        "right": dw - dl,
                        "width": "auto"
                    })
                    _self.find(".timeslider").css({
                        "left": (dl + 40) * zoomfactor + window.pageXOffset,
                        "top": window.pageYOffset + window.innerHeight - 61 * zoomfactor,
                        "height": 35 * zoomfactor,
                        "width": (ww - dw - 80) * zoomfactor
                    })
                    //_self.find(".ui-slider .ui-slider-handle").css({
                    //	"width": (45 * zoomfactor) + "px !important",
                    //	"height": (45 * zoomfactor) + "px !important"
                    //})
                    _self.find(".ui-slider .ui-slider-handle").get(0).style.setProperty("width", (45 * zoomfactor) + "px", "important");
                    _self.find(".ui-slider .ui-slider-handle").get(0).style.setProperty("height", (45 * zoomfactor) + "px", "important");
                    _self.find(".ui-slider .ui-slider-handle").css("background-size", (45 * zoomfactor) + "px " + (45 * zoomfactor) + "px");
                    _self.find(".ui-slider-horizontal .ui-slider-handle").css({
                        "margin-left": -22 * zoomfactor,
                        "top": -5 * zoomfactor
                    })
                } else {
                    var dw = 0, dl = 0;
                    _self.find(".NavbarMain > div").not(".slidercontainer").each(function () { dw += $(this).width() })
                    _self.find(".slidercontainer").prevAll().each(function () { dl += $(this).width() })
                    _self.find(".NavbarOuter").css({
                        "top": $(document.body).scrollTop() + document.body.clientHeight - 27 - addHeight,
                        "left": $(document.body).scrollLeft(),
                        "width": document.body.clientWidth >= dw + 100 ? document.body.clientWidth : dw + 100,
                        "height": 27 + addHeight
                    })
                    _self.find(".NavbarMain").css({
                        "width": "100%"
                    })
                    _self.find(".slidercontainer").css({
                        "left": dl,
                        "width": document.body.clientWidth >= dw + 100 ? document.body.clientWidth - dw : 100
                    })
                    _self.find(".timeslider").css({
                        "top": 8 + addHeight,
                        "left": dl + 25,
                        "width": document.body.clientWidth >= dw + 100 ? document.body.clientWidth - dw - 50 : 50
                    })
                }
                //alert(sw);
            }


            /// PRIVATE

            var _currentTime = 0, _endTime = 9999999, _volume = 100, _volumeMuted = false, _timeSliderDragged = false, hideTimer = 0, showVolume = false;
            var _keepHidden = false, _keepVisible = false, _visible = false;

            function getTime(t) {
                /// <summary>Converts time from ms to hh:mm:ss</summary>
                /// <param name="t" type="int">Time in milliseconds</param>
                /// <returns type="String" />
                var ret = "", seconds = 0, minutes = 0, hours = 0
                seconds = Math.floor((t / 1000) % 60);
                seconds = (seconds < 10 ? '0' : '') + seconds
                minutes = Math.floor((t / (1000 * 60)) % 60);
                //minutes = (minutes < 10 ? '0' : '') + minutes
                hours = Math.floor(t / (1000 * 60 * 60));
                //hours = (hours < 10 ? '0' : '') + hours
                if (hours || _endTime >= (1000 * 60 * 60)) { minutes = (minutes < 10 ? '0' : '') + minutes; }
                ret = ((hours || _endTime >= (1000 * 60 * 60)) ? hours + ':' : '') + minutes + ":" + seconds;
                return ret;
            }

            var classPostFix = _protected.options.ios ? '' : '_sm';
            var classPostFixIOS = _protected.options.ios ? '_ios' : '';
            var _self = _protected.create();
            _this.setEndTime(_endTime);
            //_this.setCurrentTime(444444)
            //_this.setEndTime(888888);
            _protected.scaleToWindow();
            //setTimeout(function () { _this.show(); }, 500)

            var scaleTimer = setInterval(function () { _protected.scaleToWindow() }, 100);

            /////////////////////////////////////////////////////////////////////////
            // ----------------------- Navbar auto hide --------------------------//
            /////////////////////////////////////////////////////////////////////////
            var hideTimerIV = setInterval(function () {
                if (_keepHidden) { return; }
                if (hideTimer <= 0 && !_keepVisible) {
                    _this.hide(true);
                }
                else if (!_timeSliderDragged && !_keepVisible) { hideTimer--; }
                if (showVolume) { _self.find('.volumeslidercontainer').show(); }
                else { _self.find('.volumeslidercontainer').hide(); }
            }, 250);

            _self.find('.ui-slider-handle').removeAttr("href");

            /////////////////////////////////////////////////////////////
            //////////-------------- Events ------------ ///////////////
            ////////////////////////////////////////////////////////////
            var _swipeinprogress = false;
            _self.bind('touchmove', function (e) {
                if (_self.find('.menucontainer').is(':visible'))
                    _swipeinprogress = true;
                if (!_swipeinprogress) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            })

            _self.bind('click', function (e) {
                if (_self.find('.menucontainer').is(':visible')) {
                    $(document).trigger('click', e);
                }
            })

            _self.find('.volumebutton').bind({
                'mouseenter': function (e) {
                    showVolume = true;
                    _self.find('.volumeslidercontainer').show();
                },
                'mouseover': function (e) {
                    showVolume = true;
                    _self.find('.volumeslidercontainer').show();
                }
            });
            var outHandler = function (e) {
                showVolume = false;
            }
            _self.find('.volumebutton').bind('mouseout', outHandler);

            _self.find('.volumeslidercontainer').bind({
                'mouseenter': function (e) {
                    showVolume = true;
                    _self.find('.volumeslidercontainer').show();
                },
                'mouseover': function (e) {
                    showVolume = true;
                    _self.find('.volumeslidercontainer').show();
                },
                'click': function () { return false; }
            });

            _self.find('.volumeslider').bind({
                'mousedown': function (e) {
                    _self.find('.volumebutton').unbind('mouseout', outHandler);
                    $(document).one("mouseup", function () {
                        showVolume = false;
                        _self.find('.volumebutton').bind('mouseout', outHandler);
                    })
                }
            })

            var eX, eY;
            $(document).bind({
                'touchmove': function (e) {
                    if (!_timeSliderDragged) { _this.hide(); }
                },
                'touchend': function (e) {
                    _swipeinprogress = false;
                    if (_keepHidden || hideTimer <= 0) { return; }
                    _this.show();
                },
                'click': function (e) {
                    _self.find('.menucontainer').hide();
                    if (_keepHidden) { return; }
                    _this.show();
                }
            });

            if (!_protected.options.ios) {
                $(document).bind({
                    'mousemove': function (e) {
                        if (eX == e.clientX && eY == e.clientY || _keepHidden) { return; }
                        _this.show();
                        eX = e.clientX;
                        eY = e.clientY;
                    }
                });
                _self.bind({
                    'mouseenter': function () {
                        _this.setKeepVisible(true);
                    },
                    'mouseleave': function () {
                        _this.setKeepVisible(false);
                    }
                })
            }

            /////////////////////////////////////////////////////////////////////////
            // ----------------- Fix for jquery ui touch events ------------------//
            /////////////////////////////////////////////////////////////////////////
            if (_protected.options.ios) {
                var _touchStarted = false, _moved = false;

                function simulateEvent(event, newType) {
                    if (event.originalEvent.touches.length > 1) {
                        return;
                    }
                    event.preventDefault();

                    var touch = event.originalEvent.changedTouches[0], newEvent = document.createEvent('MouseEvents');
                    newEvent.initMouseEvent(newType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                    event.target.dispatchEvent(newEvent);
                }

                function touchStart(event) {

                    if (_touchStarted) {
                        return;
                    }
                    _touchStarted = true;
                    _moved = false;

                    simulateEvent(event, 'mouseover');
                    simulateEvent(event, 'mousemove');
                    simulateEvent(event, 'mousedown');
                };

                function touchMove(event) {

                    if (!_touchStarted) {
                        return;
                    }
                    _moved = true;

                    simulateEvent(event, 'mousemove');
                };

                function touchEnd(event) {

                    if (!_touchStarted) {
                        return;
                    }

                    simulateEvent(event, 'mouseup');
                    simulateEvent(event, 'mouseout');
                    if (!_moved) {
                        simulateEvent(event, 'click');
                    }
                    _touchStarted = false;
                };

                _self.find('.ui-slider, .ui-slider *')
					.bind('touchstart', function (e) { touchStart(e) })
					.bind('touchmove', function (e) { touchMove(e) })
					.bind('touchend', function (e) { touchEnd(e) });
            }

            return _this;
        }
    }
})

upk.player.navBar.prototype = {
    /* event types: 
    onprev,
    onpausetoggle,
    onnext,
    onrefresh,
    onvolumechange (event.volume, event.muted),
    onsliderchange (event.time),
    onsliderslide (event.time),
    onmenu (event.item)
    */
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
