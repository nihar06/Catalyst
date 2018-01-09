
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


/* lms_toc.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

// include lms_init.js
/*
document.write('<script type="text/javascript" src="./../config.js"></script>');
document.write('<script type="text/javascript" src="./../js/cookie.js"></script>');
document.write('<script type="text/javascript" src="./../js/lms_init.js"></script>');
*/
// callback functions from toc

var lms_TOCState = null;

function lms_LoadAdapterComplete() {
    __Ialert("lms_LoadAdapterComplete() called");

    var lmscom = document.LmsCom;
    lmscom.Begin();
    var parentlmscom = lmscom.ParentLmsCom;
    if (parentlmscom && parentlmscom.bigScoItemCount) {
        lmscom.OpenTOCStatus(parentlmscom.bigScoItemCount, parentlmscom.bigScoHash);
        lms_TOCState = lmscom.status_obj.getTocState();
        lmscom.bigsco = true;   // save/store asset stats differently
    } else
        lmscom.OpenBasicStatus();

    lms_UpdateUI(lmscom.status_obj.getStatus());
    lms_initialized = true;
    setTimeout(lms_store.callbackfunction, 1);
}

function GetChildLmsCom(child_store) {
    __Ialert("lms_GetChildLmsCom() called");
    var lmscom = document.LmsCom;
    var childlmscom = child_store.window.document.LmsCom = (Kpath_launch && child_store.cguid) ? new LmsComKPath() : new LmsComBase(lmscom);
    childlmscom.owner = child_store.window;
    var childindex = parseInt(child_store.childIndex, 10);
    childlmscom.SetOrdinalNumber(childindex);
    childlmscom.lesson_data = lms_TOCState ? (lms_TOCState.GetStatus(childindex) + lms_TOCState.GetChildren(childindex)) : "";
    lmscom.child = childlmscom;
    lmscom.lesson_location = child_store.childIndex;
}

function ListenChildClose() {
    __alert("lms_ListenChildClose() called");

    if (!_sco)
        return;
    var lmscom = document.LmsCom;
    var childlmscom = lmscom.child;
    if (childlmscom.lesson_status === LMS_NOT_ATTEMPTED)
        return;
    var index = childlmscom.GetOrdinalNumber();
    var state = Lms2Stat(childlmscom.lesson_status);
    var score = childlmscom.score;
    var childrenstatus = childlmscom.lesson_data.substring(1);
    lms_TOCState.SetStatus(index, state);
    lms_TOCState.SetScore(index, score);
    lms_TOCState.SetChildren(index, childrenstatus);
    lms_ItemStatus_Changed(index);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Status handling in big sco


// get ordinal number of last item in toc visited
/*
function lms_getBookmark() {
__alert("lms_getBookmark called()");
var lmscom = document.LmsCom;
if (lmscom.lesson_location)
return parseInt(lmscom.lesson_location, 10);
else
return lmscom.GetBookmark(this.toc_hash);
}
*/

function lms_GetItemStatus(chindex) {
    return lms_TOCState.GetStatus(chindex);
}

function lms_SetItemStatus(chindex, value) {
    lms_TOCState.SetStatus(chindex, value);
}

function lms_ItemStatus_Changed(index) {
    UpdateItemStatus(index);
}

//----------------------------------------------------------------------------------------------/

var _lms_module_name = "lms_toc.js";
var _lms_show_alert = false;
var _lms_show_Ialert = false;
/* tocfunctions.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/// <reference path="jquery.d.ts" />
/// <reference path="resource_b.js" />
/// <reference path="../config.js" />
/// <reference path="../data/outline.js" />
/// <reference path="../data/toc/treeindex.js" />
/// <reference path="../data/toc/titles.js" />
/// <reference path="../data/uiconfig.js" />

/// <reference path="common.js" />
/// <reference path="dialog.js" />
/// <reference path="swfobject.js" />
/// <reference path="browser.js" />
/// <reference path="cookie.js" />
/// <reference path="escape.js" />
/// <reference path="xmlloader.js" />
/// <reference path="lms_toc.js" />

/// <reference path="query.js" />
/// <reference path="preferences.js" />
/// <-reference path="tree.js" />
/// <reference path="relativelink.js" />
/// <reference path="lmsapplet.js" />
/// <reference path="lmscomfactory.js" />
/// <reference path="lmscom.js" />
/// <reference path="lms_init.js" />
/// <reference path="playerlaunch.js" />
/// <reference path="sound.js" />
/// <reference path="ctxhelper.js" />
/// <reference path="iashelper.js" />
/// <reference path="tascriptsintoc.js" />

var ctxHelper;


var lastExpressionF = "";
var lastExpressionH = "";
var roleStatusChanged = false;

var viewApplicable = false;
var viewSearch = false;
var selectorMode = "A";
var actuallySelected;
var actuallySelectedFull;
var actuallyChildIndex;

var playerwindow;

// ODS variables
var toc_safeUriMode = false;
var playMode = "P";
var odsTopicID;

var _goToFlatMode = false;
var _lastSearchResultIsEmpty = false;

var urlParser;

var minConceptWidth = 0;

var separator;

//SCORM Runtime Communication
/*
var API_1484_11 = null;
var api = null;
var UserID = 1;
*/

function InitRoles(roleexpression) {
	if (roleexpression == "NOROLES") {
		setTimeout("Init1();", 10);
		return;
	}
	var ev = QueryParser.Parse("URI", roleexpression);
	if (ev) {
		QueryProcessor.Start(ev, Init0);
	}
}

function SetRoles(roleexpression) {
	SearchProcess_Show(true);

	modeDescA.treeCreated = false;
	modeDescF.treeCreated = false;
	modeDescH.treeCreated = false;
	modeDescFH.treeCreated = false;

	roleStatusChanged = true;
	if (roleexpression != "NOROLES") {
		var ev = QueryParser.Parse("URI", roleexpression);
		if (ev) {
			QueryProcessor.Start(ev, result_Roles_Search);
		}
	}
	else {
		SetTopicList("NOROLES", null, result_Search2);
	}
}

function Trim(s) {
	if (s.length == 0)
		return "";
	while (s.substr(0, 1) == " ") {
		s = s.substr(1);
		if (s.length == 0)
			return "";
	}
	while (s.substr(s.length - 1, 1) == " ") {
		s = s.substr(0, s.length - 1);
	}
	return s;
}

function IsFilteredChar(s) {
	var filters = ".,;:!?(){}[]\\\'";
	for (var i = 0; i < filters.length; i++) {
		if (s == filters.substr(i, 1))
			return " ";
	}
	return s;
}

function SearchStringFilter(s) {
	var sret = "";
	var inQuot = false;
	for (var i = 0; i < s.length; i++) {
		var c = s.substr(i, 1);
		if (c == '\"') {
			inQuot = !inQuot;
			sret += c;
		}
		else {
			sret += (inQuot == true ? c : IsFilteredChar(c));
		}
	}
	return { s: sret, r: inQuot == false };
}

function TrimQuotes(s) {
	if (s.length == 0)
		return s;
	var ss = s;
	if (s.substr(0, 1) == '\"')
		ss = ss.substr(1);
	if (s.substr(s.length - 1, 1) == '\"')
		ss = ss.substr(0, ss.length - 1);
	return ss;
}

function Select(k) {
	SearchProcess_Show(true);

	if (k == 0) {
		if (viewApplicable && viewSearch) {
			if (lastExpressionH == "" && lastExpressionF == "")
				k = 3;
		}
		else if (viewApplicable) {
			if (lastExpressionH == "")
				k = 2;
		}
		else if (viewSearch) {
			if (lastExpressionF == "")
				k = 1;
		}
	}

	if (k == 0)		// All view
	{
		if (viewApplicable && viewSearch) {
			selectorMode = "FH";
			setTimeout(ShowFilteredHemi, 0);
		}
		else if (viewApplicable) {
			selectorMode = "H";
			setTimeout(ShowHemi, 0);
		}
		else if (viewSearch) {
			selectorMode = "F";
			setTimeout(ShowFiltered, 0);
		}
		else {
			selectorMode = "A";
			setTimeout(ShowAll, 0);
		}
	}
	else if (k == 1)	// Filtered view
	{
		var sb = $("#searchbox");
		var stext = sb.val();
		var sret = SearchStringFilter(stext);
		if (!sret.r) {
			SearchProcess_Show(false);
			alert(R_Toc_search_expression_problem);
			return;
		}
		_lastChangeIsFilterOnly = false;
		stext = Trim(sret.s);
		sb.val(TrimQuotes(stext));
		if (stext.length == 0) {
			SearchProcess_Show(false);
			return;
		}
		var ks = stext.indexOf("\'");
		if (ks >= 0) {
			SearchProcess_Show(false);
			return;
		}
		selectorMode = "F";
		if (lastExpressionF != stext) {
			modeDescF.treeCreated = false;
			modeDescFH.treeCreated = false;
			lastExpressionF = stext;
			var ev = QueryParser.Parse("EXPR", stext);
			if (ev) {
				QueryProcessor.Start(ev, result_Search);
			}
		}
		else {
			if (viewApplicable)
				setTimeout(ShowFilteredHemi, 0);
			else
				setTimeout(ShowFiltered, 0);
		}
		return;
	}
	else if (k == 2)	// Hemi view
	{
		if (hemiParam == null && genericMode == true) {
			selectorMode = "H";
			ShowGenToc2();
			return;
		}
		var stext = hemiParam;
		if (stext.length == 0) {
			SearchProcess_Show(false);
			return;
		}
		selectorMode = "H";
		if (lastExpressionH != stext) {
			modeDescH.treeCreated = false;
			modeDescFH.treeCreated = false;
			lastExpressionH = stext;
			var ss = 'e' + stext;
			var ev = QueryParser.Parse("URI", ss);
			if (ev) {
				QueryProcessor.Start(ev, result_Search);
			}
		}
		else {
			if (viewApplicable)
				setTimeout(ShowFilteredHemi, 0);
			else
				setTimeout(ShowHemi, 0);
		}
		return;
	}
	else if (k == 3)	//Filtered Hemi view part 1
	{
		sb = $("#searchbox");
		stext = Trim(sb.val());
		sret = SearchStringFilter(stext);
		if (!sret.r) {
			SearchProcess_Show(false);
			alert(R_Toc_search_expression_problem);
			return;
		}
		stext = Trim(sret.s);
		modeDescF.treeCreated = false;
		lastExpressionF = stext;
		selectorMode = "FH1";
		var ev = QueryParser.Parse("EXPR", stext);
		if (ev) {
			QueryProcessor.Start(ev, result_Search);
		}
		return;
	}
	else if (k == 4)	// Filtered Hemi view part 2
	{
		if (hemiParam == null && genericMode == true) {
			selectorMode = "FH2";
			ShowGenToc2();
			return;
		}
		var stext = hemiParam;
		modeDescH.treeCreated = false;
		lastExpressionH = stext;
		ss = 'e' + stext;
		selectorMode = "FH2";
		var ev = QueryParser.Parse("URI", ss);
		if (ev) {
			QueryProcessor.Start(ev, result_Search);
		}
		return;
	}
	else if (k == 5)	// generic mode
	{
		selectorMode = "H";
		onTocLoaded = true;
	}
}

function result_Search2() {
	if (selectorMode == "F") {
		if (viewApplicable)
			setTimeout(ShowFilteredHemi, 0);
		else
			setTimeout(ShowFiltered, 0);
	}
	else if (selectorMode == "H") {
		if (viewSearch)
			setTimeout(ShowFilteredHemi, 0);
		else
			setTimeout(ShowHemi, 0);
	}
	else if (selectorMode == "FH1") {
		setTimeout(function () { Select(4) }, 0);
	}
	else if (selectorMode == "FH2" || selectorMode == "FH") {
		setTimeout(ShowFilteredHemi, 0);
	}
	else {
		setTimeout(ShowAll, 0);
	}
}

function result_Roles_Search(topiclist) {
	SetTopicList("ROLES", topiclist, result_Search2);
}

function result_Search(topiclist) {
	_lastSearchResultIsEmpty = (topiclist.length == 0);
	if (genericMode_SearchHemi == true) {
		ShowGenToc2(topiclist);
		return;
	}
	if (selectorMode == "F") {
		SetTopicList("FILTERED", topiclist, result_Search2);
	}
	else if (selectorMode == "H") {
		SetTopicList("HEMI", topiclist, result_Search2);
	}
	else if (selectorMode == "FH1") {
		SetTopicList("FILTERED", topiclist, result_Search2);
	}
	else if (selectorMode == "FH2") {
		SetTopicList("HEMI", topiclist, result_Search2);
	}
}

var _showBookmark = true;

var MyBookmark = new function () {
	function GetBookmarkCookie() {
		var c = new Cookie(document, "Bookmark_" + toc_hash, 30);
		c.Load();
		return c;
	}
	this.StoreBookmark = function (k) {
		var c = GetBookmarkCookie();
		c.Location = k;
		c.Store();
	}
	this.ReadBookmark = function () {
		var c = GetBookmarkCookie();
		if (typeof (c.Location) == "undefined")
			return 0;
		return parseInt(c.Location);
	}
}

function ShowAll() {
	var dA = document.getElementById("treeControlHostForAll");
	var dS = document.getElementById("treeControlHostForFiltered");
	var dSf = document.getElementById("flatControlHostForFiltered");
	var dH = document.getElementById("treeControlHostForHemi");
	var dHf = document.getElementById("flatControlHostForHemi");
	var dFH = document.getElementById("treeControlHostForFilteredHemi");
	var dFHf = document.getElementById("flatControlHostForFilteredHemi");
	dS.style.display = "none";
	dSf.style.display = "none";
	dH.style.display = "none";
	dHf.style.display = "none";
	dFH.style.display = "none";
	dFHf.style.display = "none";
	dA.style.display = "block";
	treeViewMode = "ALL";

	var troot = (_tree_root == "" ? titles[0] : _tree_root);
	if (_associated_content == false && _see_also == false && _showBookmark) {
		var bookmarkIndex = MyBookmark.ReadBookmark();
		var kb = troot.substr(37);
		if (_treeIndex >= 0) {
			bookmarkIndex = _treeIndex;
			kb = "0";
		}
		var chindex = null;
		try {
			chindex = parseInt(kb, 10) + bookmarkIndex;
		}
		catch (e) { };
		createTreeControl(troot, false, null, null, chindex);
	}
	else {
		createTreeControl(troot, false, null, _seealso_selecteditem, null);
	}
	SearchResult_Show(false);
	_showBookmark = false;
}

function ShowFiltered() {
	var dA = document.getElementById("treeControlHostForAll");
	var dS = document.getElementById("treeControlHostForFiltered");
	var dSf = document.getElementById("flatControlHostForFiltered");
	var dH = document.getElementById("treeControlHostForHemi");
	var dHf = document.getElementById("flatControlHostForHemi");
	var dFH = document.getElementById("treeControlHostForFilteredHemi");
	var dFHf = document.getElementById("flatControlHostForFilteredHemi");
	// hide other divs
	dA.style.display = "none";
	dH.style.display = "none";
	dHf.style.display = "none";
	dFH.style.display = "none";
	dFHf.style.display = "none";
	// determine view
	var _fm = GetActualFlatView();
	if (_goToFlatMode == true)
		_fm = true;
	// set filtered view
	dS.style.display = (_fm ? "none" : "block");
	dSf.style.display = (_fm ? "block" : "none");

	_goToFlatMode = false;
	treeViewMode = "FILTERED";
	createTreeControl(titles[0], _fm, null, null, null);
	SearchResult_Show(true);
	_showBookmark = false;
	document.getElementById("resulttext").innerHTML = filterHTML(lastExpressionF);
}

function ShowHemi() {
	var dA = document.getElementById("treeControlHostForAll");
	var dS = document.getElementById("treeControlHostForFiltered");
	var dSf = document.getElementById("flatControlHostForFiltered");
	var dH = document.getElementById("treeControlHostForHemi");
	var dHf = document.getElementById("flatControlHostForHemi");
	var dFH = document.getElementById("treeControlHostForFilteredHemi");
	var dFHf = document.getElementById("flatControlHostForFilteredHemi");
	// hide other divs
	dA.style.display = "none";
	dS.style.display = "none";
	dSf.style.display = "none";
	dFH.style.display = "none";
	dFHf.style.display = "none";
	// determine view
	var _fm = GetActualFlatView();
	if (_goToFlatMode == true)
		_fm = true;
	// set hemi view
	dH.style.display = (_fm ? "none" : "block");
	dHf.style.display = (_fm ? "block" : "none");
	_goToFlatMode = false;
	treeViewMode = "HEMI";
	createTreeControl(titles[0], _fm, null, null, null);
	SearchResult_Show(false);
	_showBookmark = false;
}

function ShowFilteredHemi() {
	var dA = document.getElementById("treeControlHostForAll");
	var dS = document.getElementById("treeControlHostForFiltered");
	var dSf = document.getElementById("flatControlHostForFiltered");
	var dH = document.getElementById("treeControlHostForHemi");
	var dHf = document.getElementById("flatControlHostForHemi");
	var dFH = document.getElementById("treeControlHostForFilteredHemi");
	var dFHf = document.getElementById("flatControlHostForFilteredHemi");

	// hide other divs
	dA.style.display = "none";
	dS.style.display = "none";
	dSf.style.display = "none";
	dH.style.display = "none";
	dHf.style.display = "none";
	// determine view
	var _fm = GetActualFlatView();
	if (_goToFlatMode == true)
		_fm = true;
	// set filtered hemi view
	dFH.style.display = (_fm ? "none" : "block");
	dFHf.style.display = (_fm ? "block" : "none");
	_goToFlatMode = false;
	treeViewMode = "FILTEREDHEMI";
	createTreeControl(titles[0], _fm, null, null, null);
	SearchResult_Show(true);
	_showBookmark = false;
	document.getElementById("resulttext").innerHTML = filterHTML(lastExpressionF);
}

function EmptyContent(hemi) {
	if (!hemi)
		hemi = false;
	if (hemi == true) {
		return '<div style="text-align: center; color: red; font-size: 16px;">' + R_no_results +
							'<br/><br/><a class="tocMyRoles" href="javascript:viewAll()">' + R_no_results_linkToAll + "</a></div>";
	}
	else {
		return '<div style="text-align: center; color: red; font-size: 16px;">' + R_toc_emptycontent + "</div>";
	}
}

function FastDoIt() {
	if (bypassToc == false)
		return;
	var p = topicDescriptorCache[actuallySelected];
	if (p == undefined) {
		setTimeout(function () { FastDoIt() }, 100);
		return;
	}
	if (p.playmodes.indexOf("D") >= 0) {
		HideToc();
		PlayFastDoIt();
	}
	bypassToc = false;
}

function TreeFinished(mode, isEmpty) {

	SetSelectionViewText(false);

	var FDI_called = false;
	if (bypassToc == true) {
		if (treeViewMode == "HEMI") {
			if (GetActualFlatView() == true) {
				if (GetActualFlatItemCounter() == 1) {
					FDI_called = true;
					setTimeout(FastDoIt, 0);
				}
			}
		}
	}
	if (FDI_called == false)
		bypassToc = false;

	if (!isEmpty) {
		EnableSelectionViewText(true);
		return;
	}
	var d;
	var dA = document.getElementById("treeControlHostForAll");
	var dS = document.getElementById("treeControlHostForFiltered");
	var dSf = document.getElementById("flatControlHostForFiltered");
	var dH = document.getElementById("treeControlHostForHemi");
	var dHf = document.getElementById("flatControlHostForHemi");
	var dFH = document.getElementById("treeControlHostForFilteredHemi");
	var dFHf = document.getElementById("flatControlHostForFilteredHemi");
	if (mode == "ALL") {
		dA.innerHTML = EmptyContent(false);
	}
	else if (mode == "FILTERED") {
		dS.innerHTML = EmptyContent(false);
		dSf.innerHTML = EmptyContent(false);
	}
	else if (mode == "HEMI") {
		dH.innerHTML = EmptyContent(true);
		dHf.innerHTML = EmptyContent(true);
	}
	else if (mode == "FILTEREDHEMI") {
		dFH.innerHTML = EmptyContent(true);
		dFHf.innerHTML = EmptyContent(true);
	}
	EnableSelectionViewText(false);

	Refresh(null);
}

var _tocHidden = false;

function HideToc() {
	return;
	/*
    _tocHidden = true;
    window.moveBy(-2000, 0);
    */
}

function ResumeToc() {
	return;
	/*
    if (_tocHidden == true) {
    window.moveBy(2000, 0);
    }
    _tocHidden = false;
    */
}

function DoItFinished(closeToc) {
	if (_closing)
		return;
	window.focus();
	ResumeToc();
	if (closeToc == true) {
		top.opener = null;      // top -> the toc can be included to gateway...
		top.open('', '_self');
		top.close();
	}
}

var topicDescriptorCache = new Array();

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

function _getFilteredStatus(guid) {
	return getFilteredStatus(guid);
}

function seeAlsoLink(type, title, guid) {
	this.type = type;
	this.title = title;
	this.guid = guid;
	this.filtered = false;
}

function JumpInPoint(label, frameid) {
	this.label = label;
	this.frame_id = frameid;
}

function CheckSeeAlso(tdesc) {
	if (_see_also == true)
		return false;
	return true;
}

var _playConceptSound = true;

function PlayConceptSound() {
	return _playConceptSound;
}

function SCO_Supported() {
	return _sco;
}

var _launchMode = "";
var _lastSelectedItem = "";
var _lastMode = "Init";
var _lastTpc = "Init";

function TreeItemSelected(tpc, mode) {
	_launchMode = "";
	if (tpc) {
		var kb = getBaseIndex();
		var ki = tpc.substr(37);
		var chIndex = ki - kb;
		if (selectorMode == "A")
			MyBookmark.StoreBookmark(chIndex);
		if (_lastMode != mode || _lastTpc != tpc)
			actuallyChildIndex = -2222;
		_lastMode = mode;
		_lastTpc = tpc;
		if (chIndex == actuallyChildIndex) {
			SearchProcess_Show(false);
			try {
				if (viewApplicable == true) {
					this.frames["myconceptframeToc"].SetCtxexParam(lastExpressionH);
				}
				else {
					this.frames["myconceptframeToc"].SetCtxexParam(null);
				}
			}
			catch (e) { };
			if (roleStatusChanged == true) {
				try {
					this.frames["myconceptframeToc"].RoleStatusChanged();
				}
				catch (e) { }
				roleStatusChanged = false;
			}
			if (tpc == null && mode == null)
				SetSelectionViewText(true);
			else
				SetSelectionViewText(false);
			EnableSelectionViewText(!_lastSearchResultIsEmpty);
			return;
		}
		actuallyChildIndex = ki - kb;
		//        alert(actuallyChildIndex);

		//        setTimeout("lms_ItemStatus_Changed('" + tpc + "')", 1000);

	}
	_lastMode = mode;
	_lastTpc = tpc;

	if (tpc == null && mode == null)
		SetSelectionViewText(true);
	else
		SetSelectionViewText(false);

	EnableSelectionViewText(!_lastSearchResultIsEmpty);
	if (mode == "HIDE") {
		SearchProcess_Show(false);
		return;
	}
	FocusToSearchField();
	if (tpc == null) {
		//    	SetSelectionViewText(true,true);
		Refresh(null);
		return;
	}
	var guid = tpc.substr(0, 36);
	actuallySelected = guid;
	actuallySelectedFull = tpc.split('#')[0];
	_playConceptSound = true;
	if (topicDescriptorCache[guid]) {
		Refresh(guid);
	}
	else {
		var s = "tpc/" + guid + "/descriptor.xml";
		LoadXMLDoc(s, TreeItemSelected_Returned_Descriptor, null, guid, false);
	}
}

function _StartTopic(lMode) {
	try {
		var s = this.frames["myconceptframeToc"].location.href;
		if (s.indexOf("lmstart.html") < 0) {
			setTimeout("_StartTopic('" + lMode + "')", 100);
			return;
		}
		s = this.frames["myconceptframeToc"].frames["myframe"].location.href;
		if (s.indexOf("lmsui.html") < 0) {
			setTimeout("_StartTopic('" + lMode + "')", 100);
			return;
		}
		if (!this.frames["myconceptframeToc"].frames["myframe"].launchTopic) {
			setTimeout("_StartTopic('" + lMode + "')", 100);
			return;
		}
		if (actuallySelected != this.frames["myconceptframeToc"].topicID) {
			setTimeout("_StartTopic('" + lMode + "')", 100);
			return;
		}
	}
	catch (e) {
		setTimeout("_StartTopic('" + lMode + "')", 100);
		return;
	}
	setTimeout("this.frames['myconceptframeToc'].StartTopic('" + lMode + "')", 100);
}

function TreeItemDoubleSelected() {
	var tdc = topicDescriptorCache[actuallySelected];

	try {
		if (tdc.type == "Topic") {
			UserPrefs.LoadCookie();
			var mode = UserPrefs.DefaultPlayMode;
			_playConceptSound = false;
			if (tdc.playmodes.indexOf(mode) >= 0) {
				//            PlayTopic(mode);
				_launchMode = mode;
				if (_lastSelectedItem == actuallySelected) {
					_StartTopic(_launchMode);
				}
			}
			else {
				var modestr = R_mode_seeit;
				switch (mode) {
					case "T":
						modestr = R_mode_tryit;
						break;
					case "K":
						modestr = R_mode_knowit;
						break;
					case "D":
						modestr = R_mode_doit;
						break;
					case "P":
						modestr = R_mode_printit;
						break;
					default:
						modestr = R_mode_seeit;
						break;
				}
				alert(R_not_playable1 + modestr + R_not_playable2);
			}
		}
	}
	catch (e) {
		setTimeout(TreeItemDoubleSelected, 0);
		return;
	}

}

function fixHTMLString(strHTMLString) {
	strHTMLString = replaceString("<", "&lt;", strHTMLString);
	strHTMLString = replaceString(">", "&gt;", strHTMLString);
	strHTMLString = replaceString("'", "&#39;", strHTMLString);
	strHTMLString = replaceString('"', "&#34;", strHTMLString);

	return strHTMLString;
}

function getDescriptorItem(req, itemname) {
	var item = "";
	try {
		var nodes = req.responseXML.getElementsByTagName(itemname);
		if (nodes.length > 0) {
			var n = nodes[0];
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

var firstrun = true;

function TreeItemSelected_Returned_Descriptor(req, id) {

	if (firstrun) {
		firstrun = false;
		window.scrollTo(0, 0);
	}

	var playmodes = getDescriptorItem(req, "PlayModes");

	var jumpInArray = new Array();
	var nodes = req.responseXML.getElementsByTagName("JumpIn");
	for (var i = 0; i < nodes.length; i++) {
		var n = nodes[i];
		if (n.textContent)
			var label = n.textContent;
		else if (n.text)
			label = n.text;
		else if (n.firstChild.data)
			label = n.firstChild.data;
		a = n.attributes[0];
		var frameid = a.value;
		jumpInArray[jumpInArray.length] = new JumpInPoint(fixHTMLString(label), frameid);
	}
	var _leadIn = "./../html/empty.html";
	nodes = req.responseXML.getElementsByTagName("Leadin");
	if (nodes.length > 0) {
		_leadIn = "./tpc/" + id + "/leadin.html";
	}
	var _concept = "";
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
	var _title = getDescriptorItem(req, "Title");
	var _type = getDescriptorItem(req, "Type");
	var _printitname = getDescriptorItem(req, "PrintItName");
	var _userdefined = getDescriptorItem(req, "UserDefined");

	var _remediation = getDescriptorItem(req, "Remediation");
	if (_remediation == "")
		_remediation = "Always";
	var _qreference = getDescriptorItem(req, "Reference");
	var _bigsco = getDescriptorItem(req, "BigSco");

	topicDescriptorCache[id] = new topicDescriptorObj(_title, _type, id, playmodes, jumpInArray, _leadIn, _concept, _printitname, _userdefined, _remediation, _qreference, _bigsco);

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
		topicDescriptorCache[id].seealsoroot = saroot;
	}

	nodes = req.responseXML.getElementsByTagName("SeeAlso");
	for (var i = 0; i < nodes.length; i++) {
		n = nodes[i];
		var type = "";
		var title = "";
		var guid = "";
		for (var j = 0; j < n.attributes.length; j++) {
			var a = n.attributes[j];
			if (a.nodeName == "Type")
				type = getTextContent(a);
			if (a.nodeName == "Title")
				title = getTextContent(a);
			if (a.nodeName == "Guid")
				guid = getTextContent(a);
		}
		if (type.length > 0 && title.length > 0) {
			topicDescriptorCache[id].seealsolinks[topicDescriptorCache[id].seealsolinks.length] = new seeAlsoLink(type, title, guid);
		}
	}

	Refresh(id);
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

var lastConcept = "";

var rcTimeout = null;

var nextConcept = "";

function EmptyHtmlLoaded() {
	this.frames["myconceptframeToc"].location.replace(urlParser.GetCorrectUrl(nextConcept));
}

function SetConceptLocation(s) {
	nextConcept = AbsUrl(s);
	EmptyHtmlLoaded();
	//    this.frames["myconceptframe"].location.replace(AbsUrl("./toc/empty.html?callback"));
}

function _RefreshConcept(noplaysound) {
	if (!noplaysound)
		noplaysound = false;
	if (lastConcept != "") {
		if (lastConcept.indexOf(".htm") > 0) {
			if (noplaysound == true)
				_playConceptSound = false;
			SetConceptLocation(lastConcept);
		}
	}
}

function RefreshConcept() {
	try {
		clearTimeout(rcTimeout);
	}
	catch (e) {
	}
	//    rcTimeout = setTimeout("_RefreshConcept();", 300);
}

function OnUpdatePreferences() {
	_RefreshConcept(true);
}

var psInit = null;

function PlaySound_Init() {
	try {
		this.frames["myconceptframeToc"].PlaySound_Init();
	}
	catch (e) { };
}

function ShowConcept(s) {
	if (s == lastConcept) {
		try {
			if (_playConceptSound == true)
				psInit = setTimeout(PlaySound_Init, 0);
			else
				clearTimeout(psInit);
		}
		catch (e) { };
		return;
	}
	lastConcept = s;
	SetConceptLocation(s);
}

/*
// I don't know what the assessment player is going to need yet, so these are just copied from the
// PlayerPackage sample referenced by "Assessments in the Player" [Alan Groupe]
function api_endcourse()
{
if (api != null)
{
api.SetValue("cmi.exit", "suspended"); // if completed, then exit=normal, else exit=suspended
api.SetValue("cmi.session_time", "PT1H5M") ;
api.SetValue("cmi.suspend_data", "suspend_data") ;
api.SetValue("cmi.completion_status", "incomplete") 
//if (assess || question || topic that has knowit) && TrackScore==true)
//{
//    api.SetValue("cmi.score.scaled") 
//    api.SetValue("cmi.score.raw") 
//    api.SetValue("cmi.score.min") 
//    api.SetValue("cmi.score.max") 
//}
api.Terminate("");
}
}

function api_Getparam()
{
if (api != null)
{
api.Initialize("");
var completionStatus = api.GetValue("cmi.completion_status")  
var suspendData = api.GetValue("cmi.suspend_data")	
var studendID = api.GetValue("cmi.student_id")
var studentName = api.GetValue("cmi.student_name")
}
}
*/


function Refresh(id) {
	//End Leaerner Session
	/*    
    if (apiframe.APIControl != undefined && apiframe.APIControl != null)
    {
    apiframe.APIControl.EndLearnerSession();
    }
    api=null;
    API_1484_11 = null;
    */
	//Continue to Launch new item
	if (id != null)
		TreeRefreshed(id.substr(0, 36));
	SearchProcess_Show(false);
	if (id == null || id == "null") {
		setTimeout('ShowConcept("./../html/empty.html")', 1);
		conceptVisible = false;
		Resize();
		return;
	}
	var desc = topicDescriptorCache[id];
	var concept = desc.concept;

	if (desc.type == "Outline" || desc.type == "Section" || desc.type == "Topic") {
		var mparam = "";
		if (_launchMode.length > 0) {
			mparam = "&mode=" + _launchMode;
		}
		if (desc.type == "Topic" && viewApplicable == true) {
			if (lastExpressionH.length > 0 || genericMode == true) {
				var i = actuallySelectedFull.split("#")[0];
				var ctx = getModeDesc(false).filteredGuids[i].context;
				var guid = getModeDesc(false).filteredGuids[i].guid.substr(0, 36);
				mparam += "&guid=" + guid + "&contextlist=" + ctx;
			}
		}
		var kparam = urlParser.GetParameter("guid");
		if (kparam != null)
			mparam += "&guid=" + kparam;
		kparam = urlParser.GetParameter("contextlist");
		if (kparam != null)
			mparam += "&contextlist=" + kparam;
		concept = "./tpc/" + id + "/lmstart.html?toc" + (_launchFromKPath ? "&launchFromKPath" : "") + "&lmsChildIndex=" + actuallyChildIndex + mparam;
	}

	if (desc.type == "Question") {
		concept = "./tpc/" + id + "/lmstart.html?toc" + (_launchFromKPath ? "&launchFromKPath" : "") + "&lmsChildIndex=" + actuallyChildIndex;
	}
	if (desc.type == "Assessment") {
		var ownerid = "";
		ownerid = getOwnerOfSelection().substr(0, 36);
		concept = "./tpc/" + id + "/lmstart.html?toc" + (_launchFromKPath ? "&launchFromKPath" : "") + "&owner=" + ownerid + "&lmsChildIndex=" + actuallyChildIndex;
	}
	_lastSelectedItem = actuallySelected;
	if (concept.length == 0)
		concept = desc.leadin;

	setTimeout('ShowConcept("' + concept + '")', 50);
	//	this.frames["myconceptframe"].location.href=AbsUrl(concept);
	conceptVisible = true;
	//	document.getElementById("concepttitle").innerHTML=desc.title;

	RolesRemoved();

	Resize();

	//    LoadRuntime(id);
}

function LoadRuntime(id) {
	var desc = topicDescriptorCache[id];
	var concept = desc.concept;

	/*	
    //SCORM get runtime
    if (desc.playmodes.length != 0 || concept.length != 0)
    {
    try
    {
    apiframe.LoadRuntime(UserID, id, 0, 0, 0);
    api = apiframe.API;            
    }
    catch(e)
    {
    api = null;
    }
    }
	
    if (desc.playmodes.length != 0) //Topic
    {
    api_Getparam();
    API_1484_11 = null;
    }
    else //Concept
    {    
    API_1484_11 = api; //Concept SCO tries to find API_1484_11 in parent window when it is launched.
    }
    */
	if (concept.length == 0)
		concept = desc.leadin;

	setTimeout('ShowConcept("' + concept + '")', 50);
	conceptVisible = true;
	RolesRemoved();

	Resize();
}

function GetBasePath() {
	var base = this.location.href;
	var k = base.indexOf('?');
	if (k < 0)
		k = base.indexOf('#');
	if (k >= 0)
		base = base.substr(0, k);
	k = base.lastIndexOf('/');
	var b = base.substr(0, k);
	return b;
}

function ClosePlayer() {
	try {
		if (playerwindow) {
			if (!playerwindow.closed) {
				playerwindow.close();
			}
		}
	}
	catch (e) { };
}

function PlayFastDoIt() {
	_playConceptSound = false;
	try {
		this.frames["myconceptframeToc"].Sound_Stop();
	}
	catch (e) { };

	var params = "mode=D";
	if (viewApplicable == true) {
		if (lastExpressionH.length > 0) {
			var i = actuallySelectedFull.split("#")[0];
			var ctx = getModeDesc(false).filteredGuids[i].context;
			var guid = getModeDesc(false).filteredGuids[i].guid.substr(0, 36);
			params += "&contextlist=" + ctx;
			params += "&guid=" + guid;
		}
	}
	var desc = topicDescriptorCache[actuallySelected];
	var k = desc.playmodes.indexOf("P");
	if (k >= 0 && desc.printitname.length > 0) {
		params += "&printitname=" + desc.printitname;
	}
	if (bypassToc == true) {
		params += "&fastdoit=true";
	}
	if (toc_safeUriMode == true) {
		params = "su=" + Escape.SafeUriEscape(params);
	}
	var b = GetBasePath();
	LaunchDoIt(b + "/tpc/" + actuallySelected + "/", params);
}

function OnQuestionContinue() {
	//    alert("next");
	GoToNext();

}

/**** moved here from toc0 *****************************************************************************/


var showParameters = false;
var searchParam = null;
var hemiParam = null;
var appParam = null;
var ctxParam = null;
var udvParam = null;
var shParam = null;
var XDTParam = null;
var genericMode = false;
var genericMode_SearchHemi = false;
var searchVisible = false;
var conceptVisible = false;
var allRoles = new Array();
var _rolesRemoved = false;
var ctxTopicList = new Array();
var ctxTopicList2 = new Array();
var onTocLoaded = false;
var showButtons = new Array();
var _tree_root = "";
var _sco = false;
var _associated_content = false;
var _see_also = false;
var _seealso_selecteditem = 0;
var isTocHtml = true;
var _selectedItemId = 0;
var _deviceDPI = 0;
var _launchFromKPath = false;
var _treeIndex = -1;
var _launchedFromSharedLink = false;

function IsReducedMode() {
	return (_tree_root.length > 0);
}

function NoWrap(s) {
	var ss = "";
	for (var i = 0; i < s.length; i++) {
		if (s.substr(i, 1) == " ") {
			ss += "&nbsp;";
		}
		else {
			ss += s.substr(i, 1);
		}
	}
	return ss;
}

function _getObjectById(owner, id) {
	for (var i = 0; i < owner.childNodes.length; i++) {
		var cni = owner.childNodes[i];
		if (cni.id == id) {
			return cni;
		}
		else {
			var obj = _getObjectById(cni, id);
			if (obj != null)
				return obj;
		}
	}
	return null;
}

function getObjectById(id) {
	return document.getElementById(id);
	//				return _getObjectById(document.body,id);
}

////////////////////////////////////////////////////////////////////////////

var _header1DivObj = null;
var _treeContainerObj = null;
var _searchResultObj = null;
var _pmTableObj = null;
var _ctTableObj = null;
var _searchBoxObj = null;
var _changeViewObj = null;
var _resulttextObj = null;
var _vbordersize = 5;
var _hbordersize = 5;
var _sbordersize = 5;

function getOffsetLeft(myobj) {
	var parentOffsets = 0;
	if (myobj.parentNode)
		parentOffsets = getOffsetLeft(myobj.parentNode);
	var offset = (myobj.offsetLeft ? myobj.offsetLeft : 0);
	return offset + parentOffsets;
}

function getOffsetTop(myobj) {
	var parentOffsets = 0;
	if (myobj.parentNode)
		parentOffsets = getOffsetTop(myobj.parentNode);
	var offset = (myobj.offsetTop ? myobj.offsetTop : 0);
	return offset + parentOffsets;
}

var _cover_dragged = false;
var treeWidth = 250;

function RefreshPdf() {
	if (upk.browserInfo.isiOS()) {
		var l = $("#contentdiv").position().left;
		setTimeout(function () {
			$("#contentdiv").css({ left: (l + 1) + "px" });
			setTimeout(function () {
				$("#contentdiv").css({ left: l + "px" });
			}, 100);
		}, 100);
	}
}

function SetFocusToTree() {
	$("#searchtopcontainer").focus();
}

function lmsUILoaded() {
	if (upk.browserInfo.isiOS()) {
		setTimeout(function () {
			RefreshPdf();
		}, 100);
	}
	for (var i = 1; i <= 4; i++) {
		setTimeout(function () {
			SetFocusToTree();
		}, 300 * i);
	}
}

function initSeparator() {
	var sepPrevX = 0, sepX = 0;
	var sepMoved = false, sepClick, sepClickTimer;
	var treeVisible = true, toggleInMove = false;
	var preventMove = true;

	$("#sepdiv").on('mousedown', sepD);
	$("#cover").on('mousemove', sepM);
	$("#cover").on('mouseup', sepU);
	if (IsTouchDevice()) {
		$("#sepbutton").on("touchstart", function (e) {
			sepD(e);
			e.preventDefault();
		})
		$(document).on("touchstart", function (e) {
			treeD(e);
		})
	} else {
		$("#sepbutton").on('click', function () { toggleTree(); });
	}

	function treeD(event) {
		if (toggleInMove) { event.preventDefault(); return false; }
		var e = event;
		if (IsTouchDevice()) { e = touch(e); }
		sepPrevX = sepX = e.pageX;
		preventMove = false;
		//if (e.pageX > 10) { return true; }
		//else {
		$(document).on("touchmove", function (e) {
			sepM(e);
		}).on("touchend", function (e) {
			sepU();
		});
		//event.preventDefault();
		return true;
		//}
	}

	function sepD(event) {
		minConceptWidth = getConceptPageWidth();
		var e = event;
		if (IsTouchDevice()) { e = touch(e); }
		_cover_dragged = true;
		sepMoved = false;
		sepClick = true;
		if (!treeVisible) {
			var w = e.clientX - $("#sepdiv").width() / 2;
			if (IsTouchDevice()) {
				w += window.pageXOffset + 4;
			}
			sepClickTimer = setTimeout(function () {
				sepClick = false;
				treeVisible = true;
				$("#sepbutton>.left").show();
				$("#sepbutton>.right").hide();
				$("#contentdiv").css({ left: w + "px" });
				$("#treeside").css({ width: w + "px", "-webkit-transform": "translate3d(0,0,0)" }).show();
			}, 250)
		}
		if (IsTouchDevice()) {
			$(document).on("touchmove", function (e) {
				sepM(e);
			}).on("touchend", function (e) {
				sepU();
			});
			sepPrevX = sepX = e.pageX;
		}
		$("#cover").show();
		var coverobj = document.getElementById("cover");
		if (coverobj.setCapture)
			coverobj.setCapture();
	}

	function sepM(event) {
		if (toggleInMove) { event.preventDefault(); return false; }
		var e = event;
		if (e == null) { e = window.event; }
		if (IsTouchDevice()) { e = touch(e); }
		if (!_cover_dragged) {
			if (sepX != e.pageX) sepPrevX = sepX;
			sepX = e.pageX;
			//var speed = sepPrevX - sepX;
			//if (preventMove || (speed > 10 && treeVisible) || (speed < -10 && !treeVisible)) {
			//	preventMove = true;
			//	event.preventDefault();
			//	return false;
			//}
			//else {
			//	//if (sepX != e.pageX) {
			//		$(document).off("touchmove").off("touchend");
			//	//}
			return true;
			//}
		}
		clearTimeout(sepClickTimer);
		if (e.pageX > sepX + 10 || e.pageX < sepX - 10) {
		sepMoved = true;
		}
		if (sepMoved) {
		var w = e.clientX - $("#sepdiv").width() / 2; //tree side width
		if (IsTouchDevice()) {
			w += window.pageXOffset + 4;
			if (sepX != e.pageX) sepPrevX = sepX;
			sepX = e.pageX;
			event.preventDefault();
		}
		if (w < $("#container").width() - minConceptWidth - $("#sepdiv").width()) {
			$("#contentdiv").css("left", (w) + "px");
			$("#treeside").css("width", (w) + "px");
		}
		if (!treeVisible) {
			$("#sepbutton>.left").show();
			$("#sepbutton>.right").hide();
			$("#treeside").css({ "-webkit-transform": "translate3d(0,0,0)" }).show();
			treeVisible = true;
		}
		if (_treeContainerObj == null)
			_treeContainerObj = getObjectById("treecontainer");
		w = _treeContainerObj.clientWidth - 40;
		setTimeout(_HResize, 1);
		}
	}

	function sepU() {
		$(document).off("touchmove").off("touchend");
		if (!_cover_dragged) {
			var speed = sepPrevX - sepX;
			if ((speed > 30 && treeVisible) || (speed < -30 && !treeVisible)) {
				toggleTree();
			}
			return true;
		}
		clearTimeout(sepClickTimer);
		_cover_dragged = false;
		$("#cover").hide();
		var coverobj = document.getElementById("cover");
		if (coverobj.releaseCapture) { coverobj.releaseCapture(); }
		if (document.frames) { document.frames[0].focus(); }
		var swipeTree = false;
		if (IsTouchDevice()) {
			if (!sepMoved && sepClick) { toggleTree(); return true; }
			var speed = sepPrevX - sepX;
			if ((speed > 30 && treeVisible) || (speed < -30 && !treeVisible)) {
				swipeTree = true;
			}
		}
		if (($("#treeside").width() < 125 && treeVisible) || swipeTree) {
			toggleTree();
		} else if (sepMoved) {
			treeWidth = $("#treeside").width();
			if (treeWidth < 125) { treeWidth = 125; }
			var c = new Cookie(document, "OnDemandToc", 365, null, null, false);
			c.Load();
			c.Separator = treeWidth;
			c.Store();
		}
	}

	function toggleTree() {
		if (toggleInMove) { return; }
		toggleInMove = true;
		var l = $("#contentdiv").position().left;
		$("#treeDiv").scrollLeft(0);
		if (treeVisible) {
			w = $("#treeside").width();
			$("#sepbutton>.left").hide();
			$("#sepbutton>.right").show();
			if (IsTouchDevice()) {
				$("#treeside, #sepbutton, #contentdiv").addClass("swipeanim");
				$("#treeside").css({ "-webkit-transform": "translate3d(" + (-(w)) + "px,0,0)" });
				$("#contentdiv").on("webkitTransitionEnd", function () {
					$("#contentdiv").off("webkitTransitionEnd");
					$("#treeside, #sepbutton, #contentdiv").removeClass("swipeanim");
					$("#treeside").css({ "width": (treeWidth) + "px", "-webkit-transform": "translate3d(" + (-(treeWidth)) + "px,0,0)" });
					$("#treeinner").css({ "border-left-width": "8px" });
					$("#contentdiv").css({ left: "7px", "-webkit-transform": "translate3d(0,0,0)" });
					toggleInMove = false;
				})
				$("#contentdiv").css({ "-webkit-transform": "translate3d(" + (-(w - 7)) + "px,0,0)" });
			} else {
				$("#treeside").animate({ width: "0" }, 300);
				$("#contentdiv").animate({
					left: "0"
				}, 300, function () {
					toggleInMove = false;
				})
			}
			treeVisible = false;
		} else {
			$("#sepbutton>.left").show();
			$("#sepbutton>.right").hide();
			if (IsTouchDevice()) {
				$("#treeside, #sepbutton, #contentdiv").addClass("swipeanim");
				$("#treeside").css({ "-webkit-transform": "translate3d(0,0,0)" });
				$("#contentdiv").on("webkitTransitionEnd", function () {
					$("#contentdiv").off("webkitTransitionEnd");
					$("#treeside, #sepbutton, #contentdiv").removeClass("swipeanim");
					$("#treeside").css({ "width": (treeWidth) + "px" });
					//$("#treeinner").css({ "border-left-width": "" });
					$("#contentdiv").css({ left: treeWidth + "px", "-webkit-transform": "translate3d(0,0,0)" });
					toggleInMove = false;
				})
				$("#contentdiv").css({ "-webkit-transform": "translate3d(" + treeWidth + "px,0,0)" });
			} else {
				$("#treeside").animate({ width: treeWidth + "px" }, 300);
				$("#contentdiv").animate({
					left: treeWidth + "px"
				}, 300, function () {
					toggleInMove = false;
				})
			}
			treeVisible = true;
		}
	}

	function isTreeVisible() {
		return treeVisible;
	}

	return { isTreeVisible: isTreeVisible };
}

////////////////////////////////////////////////////////////////////////////

function OpenSeeAlso(seeAlsoRoot, index) {
	this.frames["myconceptframeToc"].OpenSeeAlso(seeAlsoRoot, index);
	//			var base = GetBasePath();
	//			window.open(base + "/toc.html?seealso=" + seeAlsoRoot + "&selectitem=" + index);
}

function launchTopic(mode, frame_id, fromjumpin) {
	// launch topic (in lms.js)
	this.frames["myconceptframeToc"].StartTopic(mode, frame_id, fromjumpin);
}

function getConceptPageWidth() {
	// get concept width (from lms.js)
	return this.frames["myconceptframeToc"].getConceptPageWidth();
}

function ShowAbout() {
	// in pt (400x500px)
	if (this.frames["myconceptframeToc"].OnPrepareDialog)
		this.frames["myconceptframeToc"].OnPrepareDialog();
	var ctx = "about";
	setDlgCtx(ctx);
	showDialog(GetBasePath() + "/../html/about.html", -1, -1, 300, 375, true, _deviceDPI, null, false);
}

function TreeRefreshed(id) {
	_selectedItemId = id;
}

function ConnectionLostEvent(errText) {
	this.frames["myconceptframeToc"].ConnectionLostEvent(errText);
}

////////////////////////////////////////////////////////////////////////////

function SearchResult_Show(k) {
	if (_searchResultObj == null)
		_searchResultObj = getObjectById("searchresult");
	_searchResultObj.style.display = (k ? "" : "none");
	viewSearch = k;
	searchVisible = k;
	Resize();
}

function SearchProcess_Show(k) {
	if (k) {
		document.getElementById("coversearch").style.width = "100%";
		document.getElementById("coversearch").style.height = "100%";
		var sprd = document.getElementById("searchprdiv");
		sprd.style.display = "block";
		var w = Math.round((document.body.clientWidth / 2) - 60);
		var h = Math.round((document.body.clientHeight / 2) - 20);
		sprd.style.left = "" + w + "px";
		sprd.style.top = "" + h + "px";
	}
	else {
		document.getElementById("coversearch").style.width = "0px";
		document.getElementById("coversearch").style.height = "0px";
		document.getElementById("searchprdiv").style.display = "none";
	}
}

function Resize() {
	setTimeout(_Resize, 0);
}

function Resize0() {
	setTimeout(_Resize, 0);
}

function _HResize() {
	if (checkIEDPI() == false)
		return;
}

function _Resize() {
	if (checkIEDPI() == false)
		return;
	if (document.body.clientHeight < 100 || document.body.clientWidth < 100) {
		_HResize();
		return false;
	}
	if (hemiParam != null || XDTParam != null || (allRoles.length > 0 && PlayerConfig.EnableCookies == true)) {
		getObjectById("appandroles").className = 'tocSearchColor';
	}
	if (_header1DivObj == null)
		_header1DivObj = getObjectById("header1");
	if (_treeContainerObj == null)
		_treeContainerObj = getObjectById("treecontainer");
	if (_searchResultObj == null)
		_searchResultObj = getObjectById("searchresult");
	if (_changeViewObj == null)
		_changeViewObj = getObjectById("changeview");
	if (_pmTableObj == null)
		_pmTableObj = getObjectById("playmodetable");
	if (_ctTableObj == null)
		_ctTableObj = getObjectById("concepttitletable");

	_HResize();

	var h = $("#treeinner").height();

	if (upk.browserInfo.isSafari() || upk.browserInfo.isFF())
		h -= 2;

	h -= 8;

	var showChangeView = (viewApplicable || searchVisible);

	_changeViewObj.className = (showChangeView ? 'tocFrameText modebuttonshow' : 'tocFrameText modebuttonhide');

	var hh = 0;
	if (searchVisible)
		hh = _searchResultObj.clientHeight;

	if (showChangeView)
		hh += getObjectById("changeview").clientHeight;

	if (!IsTouchDevice()) {
		try {
			var _approles_correction = $("#searchtopcontainer").height() + $("#appandroles").height();
			_treeContainerObj.style.height = "" + (h - _approles_correction - hh) + "px";
		}
		catch (e) {
			_treeContainerObj.style.height = "0px";
		}
	}
	RefreshConcept();
}

function MyEventKeyDown(event) {
	if (!event)
		event = window.event;
	var code = event.keyCode;
	if (code == 27) {
		// todo: this must be handled in some way
		// probably dialog2.html should handle key events
		// this function is obsolete
		//				JumpIn_Show(null, null);
		try {
			if (parent.isOpenDialog()) {
				parent.closeDialog();
				return;
			}
		}
		catch (e) { };
	}
	if (code == 13 && _inputHasFocus == true) {
		Search_Click();
		return false;
	}
	if (upk.browserInfo.isSafari())
		EventKeyDown(event);
}

function FocusToSearchField() {
	return;
	/*
    try {
    var sb = getObjectById("searchbox");
    sb.focus();
    }
    catch (e) {
    }
    */
}

function applicable_Click() {
	if ($("#chapp").prop("checked")) {
		viewApplicable = true;
		_goToFlatMode = true;
		Select(0);
	}
	else {
		viewApplicable = false;
		Select(0);
	}
}

function applicable_Clear() {
	$("#chapp").prop("checked", false);
	applicable_Click();
}

function Search_Click() {
	if (_inputIsEmpty == true)
		return;
	viewSearch = true;
	_goToFlatMode = true;
	FocusToSearchField();
	if (IsTouchDevice()) {
		document.getElementById("searchcontainer2").focus();
	}
	SetSelectionViewText(true);
	Select(1);
}

function Search_Clear_Click() {
	$("#searchbox").val("");
	OnInputBlur();
	if (viewSearch == false)
		return;
	viewSearch = false;
	FocusToSearchField();
	Select(0);
	SearchProcess_Show(false);
}

function SetSelectionViewText(empty) {
	var flatMode = GetActualFlatView();
	if (!empty)
		empty = IsActualViewEmpty();
	if (empty == true) {
		document.getElementById("selectionviewtext").innerHTML = "";
	}
	else {
		document.getElementById("selectionviewtext").innerHTML = (flatMode ? R_toc_tree_view_in_outline : R_toc_tree_view_resultlist);
	}
}

function EnableSelectionViewText(enable) {
	//    if (viewApplicable)
	//        enable = true;
	if (enable) { $("selectionviewtext").show() }
	else { $("selectionviewtext").hide() }
	//	s = (enable ? 'visible' : 'hidden');
	//	document.getElementById("selectionviewtext").style.visibility = s;
}

function ChangeView_Click() {
	var flatMode = ChangeTreeView();
	_goToFlatMode = flatMode;
	SetSelectionViewText(false);
}

var _inputIsEmpty = true;
var _inputHasFocus = false;

function OnInputFocus() {
	_inputHasFocus = true;
	if (_inputIsEmpty == true) {
		var sb = $("#searchbox").val("").attr("class", "tocSearch");
	}
	_inputIsEmpty = false;
}

function OnInputBlur() {
	_inputHasFocus = false;
	var sb = $("#searchbox");
	if (sb.val() == "") {
		_inputIsEmpty = true;
		sb.val(R_Toc_search);
		sb.attr("class", "tocSearchBarText");
	}
	else {
		_inputIsEmpty = false;
		sb.attr("class", "tocSearch");
	}
}

function SearchFontSize(s) {
	for (var i = 1; i < document.styleSheets.length; i++) {
		var ss = document.styleSheets[i];
		var rules = ("rules" in ss) ? ss["rules"] : (("cssRules" in ss) ? ss["cssRules"] : []);
		for (var j = 0; j < rules.length; j++) {
			var rr = rules[j];
			if (rr.selectorText == s) {
				return rr.style.fontSize;
			}
		}
	}
	return "";
}

function getAbsoluteXPosInToc(nonabspos) {
	_sbordersize = $("#sepdiv").width();
	var ftcwidth = (separator.isTreeVisible()) ? $("#treeside").width() : 0;
	return ftcwidth + nonabspos + _vbordersize + _sbordersize;
}

function getAbsoluteYPosInToc(nonabspos) {
	// since #thorizontal1 has been removed, we cannot calculate with its height
	//_hbordersize = $("#thorizontal1").height();
	// todo: its replacement should go here, until then it is set to 0
	_hbordersize = 5;
	return _header1DivObj.clientHeight + _hbordersize + nonabspos;
}

function Toc_onCloseDialog() {
	if (upk.browserInfo.isExplorer()) {
		$("#searchbox").focus();
		$("#searchbox").blur();
	}
}

function viewAll() {
	if (applicable_Clear)
		applicable_Clear();
}

function loadResources() {
	$("*[data-value]").each(function () {
		$(this).text(function () {
			return window[$(this).attr("data-value")];
		})
	})
	$("*[data-alt]").each(function () {
		$(this).attr("alt", function () {
			return window[$(this).attr("data-alt")];
		})
	})
	$("*[data-title]").each(function () {
		$(this).attr("title", function () {
			return window[$(this).attr("data-title")];
		})
	})
}

$(function () { setTimeout(Init, 0); });

//if the player is in a hidden frame, - only in Firefox - the #treeside does not get display:block property, so when the frame is displayed, the tree remains empty, this is a fix or this bug
$(window).load(function () {
	if (/*$.browser.mozilla*/navigator.userAgent.indexOf("Firefox") >= 0) {
		$('#treeside').css('display', 'block');
	}
});

function Init() {
	loadResources();

	// Get the current device DPI
	if (_deviceDPI == 0)
		_deviceDPI = getDpiInfo();

	if (_deviceDPI == 0) {
		//if the player is in a hidden frame, it goes endless, because _deviceDPI = 0, see the fix in getDpiInfo
		setTimeout(Init, 100);
		return;
	}

	if (_deviceDPI != 96) {
		if (getDPICookie() == false) {
			this.location.replace("./../html/unsuppdpi.html?" + Escape.MyEscape(AbsUrl(this.location.href)));
			return;
		}
	}

	ctxHelper.SetContext("toc");

	setOnCloseEvent("parent.parent.Toc_onCloseDialog()");
	ParseArguments();

	if (_see_also == false && _associated_content == false)
		InitLmsMode("toc");
	var chindex = 0;
	if (_lmsMode != null)
		chindex = 0 - 1;
	if (_see_also == true || _associated_content == true)
		chindex = 0 - 1;

	try {
		if (soundIsExported == undefined)
			soundIsExported = false;
		if (soundIsExported == null)
			soundIsExported = false;
	}
	catch (e) {
		soundIsExported = false;
	}

	if (_lmsMode != null) {
		if (urlParser.GetParameter("nosound") == null) {
			if (Sound_Init(soundIsExported, UserPref_PlayAudio_Original, null, false, "../") == false)
				return;
		}
	}

	if (lms_initialized == false) {
		lms_InitPage(chindex, (_lmsMode == null ? window.opener : null), null, "Init()");
		return;
	}

	if (urlParser.GetParameter("nosound") != null) {
		SetNoSound(true);
	}

	if (IsTouchDevice()) {
		$("#container").addClass("ipad");
	}

	/*upk_Outline.*/tree_Init();

	//    this.frames["mytreeframe"].location.replace("./toc/outline-tree.html");
}

function Init_treeloaded() {
	/*
    if (!document.all) {
    bypassToc = false;
    }
    */
	//	 $("#header1").css("min-width",function (){
	//		var w = $("#header1table").width() + $("#bannerimg").width();
	//		return w;
	//	 });

	//    var h1 = getObjectById("header1table");
	//    h3img = getObjectById("bannerimg");
	//    w = h3img.clientWidth;
	//    h3img.style.height = "" + (h1.clientHeight) + "px";
	//    h3img.style.width = "" + w + "px";

	{
		var sbox = document.getElementById("searchbox");
		var fs = parseInt(SearchFontSize(".tocSearch"));
		var h = parseInt(sbox.style.height);
		var d = Math.floor((h - fs) / 2);
		sbox.style.height = "" + (h - d) + "px";
		sbox.style.paddingTop = "" + d + "px";
	}

	try {
		if (_sco == false) {
			var tpref = (UIComponents.TitlePrefix == true ? R_toc_title + " - " : "");
			document.title = tpref + UnescapeQuotes(moduleName);
		}
	}
	catch (e) {
		_Resize();
		//				alert("The content is empty");
		window.onresize = Resize0;
		//document.getElementById("cover").onmousemove = sepM;
		//$("#sepdiv").on('mousedown', sepD);
		//if (!IsTouchDevice()) { $("#sepbutton").on('click', function () { toggleTree(); }); }
		document.getElementById("searchbox").disabled = true;
		document.getElementById("contentisemptydiv").innerHTML = R_toc_content_empty;
		document.getElementById("treecontainer").style.verticalAlign = "top";
		document.getElementById("mytreeframe").style.display = "none";
		document.getElementById("contentisemptydiv").style.display = "block";
		return;
	}

	if (_resulttextObj == null)
		_resulttextObj = getObjectById("resulttext");
	if (document.all) {
		_resulttextObj.style.width = "100px";
	}

	//	Enable Preferences button
	if (PlayerConfig.EnableCookies == true && UserPrefs.EnablePreferences == true) {
		var o = getObjectById("prefsbutton");
		//				o.style.display = 'block';
	}

	LoadXMLDocArray("roles.xml", Roles_Returned, Roles_Error, "Role", false);

}

function RolesRemoved() {
	if (_rolesRemoved == true)
		alert(R_roles_all_removed);
	_rolesRemoved = false;
}

function Roles_Returned(ret) {

	if (UIComponents.Help === false) {
		ret = new Object();
		ret.length = 0;
	}

	for (var i = 0; i < ret.length; i++) {
		allRoles[i] = ret[i];
	}
	var o = getObjectById("hasrole");
	if (allRoles.length > 0 && PlayerConfig.EnableCookies == true) {
		o.style.display = 'inline';
		//					setTimeout("Init1()",50);
	}

	if (UIComponents.Help === false) {
		setTimeout(Init1, 50);
		return;
	}

	UserRoles.LoadCookie();
	var topLevelLmsMode = GetTopLevelLmsMode();
	if ((topLevelLmsMode != "Cookie") && (topLevelLmsMode != "KPT"))
		UserRoles.Filtering = false;
	if (_associated_content == true)
		UserRoles.Filtering = false;
	if (_launchedFromSharedLink == true)
		UserRoles.Filtering = false;
	if (UserRoles.Filtering == true && allRoles.length == 0) {
		UserRoles.Filtering = false;
		UserRoles.StoreCookie();
		_rolesRemoved = true;
	}
	$("#chroles").prop("checked", UserRoles.Filtering);
	if (UserRoles.Filtering == true) {
		InitRoles(GetRolesQueryString());
	}
	else {
		setTimeout(Init1, 50);
	}
}

function Roles_Error() {
	setTimeout(Init1, 50);
}

function Init0(topiclist) {
	SetTopicList("ROLES", topiclist, Init1);
}

function GetAllRoles() {
	return allRoles;
}

function onRoles() {
	if (this.frames["myconceptframeToc"].OnPrepareDialog)
		this.frames["myconceptframeToc"].OnPrepareDialog();
	var ctx = "roles";
	setDlgCtx(ctx);
	showDialog(GetBasePath() + "/../html/roles.html", -1, -1, 320, 290, true, _deviceDPI, null, false);
}

function roles_Click() {
	var o = $("#chroles");
	if (o.prop("checked") && UserRoles.Roles.length == 0) {
		o.prop("checked", false);
		onRoles();
		TocToTop(100);
		return;
	}
	UserRoles.Filtering = o.prop("checked");
	UserRoles.StoreCookie();
	setRoleFiltering();
	TocToTop(100);
}

function onUpdateRoles() {
	setRoleFiltering();
	TocToTop(200);
}

function TocToTop(k) {
	if (upk.browserInfo.isiOS()) {
		setTimeout(function () { window.scrollTo(0, 0); }, k);
	}
}

function GetRolesQueryString() {
	if (!UserRoles.Filtering) {
		return "NOROLES";
	}
	var l = UserRoles.Roles.length;
	if (l == 0) {
		return "NOROLES";
	}
	var s = "r";
	for (var i = 0; i < l; i++) {
		var rolestr = UserRoles.Roles[i];
		rolestr = Escape.MyUnEscape(rolestr);
		rolestr = rolestr.toLowerCase();
		rolestr = Escape.MyEscape(rolestr);
		s += "'" + rolestr + "'";
		if (i != (l - 1))
			s += "-";
	}
	return s;
}

function setRoleFiltering() {
	SetSelectionViewText(true)
	UserRoles.LoadCookie();
	$("#chroles").prop("checked", UserRoles.Filtering);
	var s = GetRolesQueryString();
	SetRoles(s);
}

var XdtTimeout = null;

function Init1() {
	if (window.parent !== window) {
		if (XDTParam != null) {
			XdtTimeout = setTimeout(function () {
				if (XdtTimeout != null) {
					clearTimeout(XdtTimeout);
					XdtTimeout = null;
					Init2();
				}
			}, 15 * 1000);
			XdTransfer.AddListener(
			this,
			function (messageName, messageData) {
				if (XdtTimeout == null)
					return;
				if (messageName == "oraupk-context") {
					clearTimeout(XdtTimeout);
					XdtTimeout = null;
					XdTransfer.PostMessage(window.parent, 'oraupk-debuginfo_searchexpression', { 'data': messageData }); //to the test page
					var ev = QueryParser.Parse("XDT", messageData);
					if (ev) {
						QueryProcessor.Start(ev, result_XDT);
					}
				}
			});
		}
		XdTransfer.PostMessage(this.parent, "oraupk-ready", null); //it is sent always from onload
	}
	Init2();
}

function result_XDT(topiclist) {
	hemiParam = null;
	genericMode = true;
	selectorMode = "H";
	ShowGenToc(topiclist);
}

function Init2() {
	if (upk.browserInfo.isSafari())
		document.onkeydown = MyEventKeyDown;
	else
		document.onkeypress = MyEventKeyDown;

	FocusToSearchField();

	if (hemiParam != null || genericMode == true || XDTParam == true) {
		sb = $("#hasapp");
		sb.css("display", "inline");
		sb.css("paddingLeft", "4px");
	}
	else {
		if (allRoles.length > 0 && PlayerConfig.EnableCookies == true) {
			sb = $("#hasrole");
			sb.css("paddingLeft", "4px");
		}
	}

	if (hemiParam == null && genericMode == false || XDTParam == false || allRoles.length == 0) {
		var sbox = document.getElementById("searchbox");
		if (upk.browserInfo.isFF3()) {
			sbox.style.marginTop = "" + (-2) + "px";
		}
		else if (upk.browserInfo.isSafari()) {
			sbox.style.marginTop = "" + (0) + "px";
		}
		else {
			sbox.style.marginTop = "" + (-1) + "px";
		}
	}

	var c = new Cookie(document, "OnDemandToc", 365, null, null, false);
	c.Load();
	treeWidth = c.Separator ? Number(c.Separator) : 250;
	$("#contentdiv").css("left", treeWidth + "px");
	$("#treeside").css("width", treeWidth + "px");

	$("#container").css("top", (Number($("#header1").height()) + 5) + "px");
	_Resize();
	window.onresize = Resize0;

	separator = initSeparator();
	$("#searchbox").val("");
	OnInputBlur();

	if (_tree_root != "") {
		document.getElementById("appandroles").style.display = "none";
		document.getElementById("searchcontainer1").style.display = "none";
		document.getElementById("searchcontainer2").style.display = "none";
		document.getElementById("searchcontainer3").style.display = "none";

		if (_associated_content == true) {
			document.getElementById("specialcontentdiv").style.display = "block";
			document.getElementById("specialcontenttext").innerHTML = R_toc_associated_content;
		}
		if (_see_also == true) {
			document.getElementById("specialcontentdiv").style.display = "block";
			document.getElementById("specialcontenttext").innerHTML = R_toc_see_also;
		}
		if (_sco == true) {
			document.getElementById("specialcontentdiv").style.display = "block";
			document.getElementById("specialcontenttext").innerHTML = "";
		}

		if (upk.browserInfo.isFF() || upk.browserInfo.isSafari()) {
			document.getElementById("specialcontentdiv").style.paddingTop = "5px";
		}

	}
	$("#treeside").show();
	if (genericMode == true || XDTParam == true)              // generic mode
	{
		OnInputBlur();
		var sb = $("#chapp");
		sb.prop("disabled", false);
		sb.prop("checked", true);
		InitApplicableOutlineDisplay();
		Select(viewApplicable ? 5 : 0);
	}
	else if (searchParam != null && hemiParam != null) // Filtered Hemi view
	{
		var sb = $("#searchbox");
		sb.val(searchParam);
		OnInputBlur();
		sb = $("#chapp");
		sb.prop("disabled", false);
		sb.prop("checked", true);
		InitApplicableOutlineDisplay();
		Select(viewApplicable ? 3 : 1);
	}
	else if (searchParam != null)	// Filtered view
	{
		sb = $("#searchbox");
		sb.val(searchParam);
		OnInputBlur();
		Select(1);
	}
	else if (hemiParam != null)	// Hemi view
	{
		sb = $("#chapp");
		sb.prop("disabled", false);
		sb.prop("checked", true);
		InitApplicableOutlineDisplay();
		Select(viewApplicable ? 2 : 0);
	}
	else	// All view
	{
		Select(0);
	};
}

function InitApplicableOutlineDisplay() {
	var k = UserPrefs.ApplicableOutlineDisplay;
	switch (k) {
		case ("A"):
			viewApplicable = false;
			break;
		case ("O"):
			viewApplicable = true;
			_goToFlatMode = false;
			break;
		default:
			viewApplicable = true;
			_goToFlatMode = true;
			break;
	}
	var o = $("#chapp");
	o.prop("checked", viewApplicable);
}

function UnescapeHemiParam(s) {
	return replaceString("%27", "'", s);
}

function ParseArguments() {
	if (showParameters == true) {
		var ss = document.location.hash.substring(1);
		var strArgs = ss.split("&");
		if (strArgs.length == 0 || strArgs[0] == "") {
			ss = document.location.search.substring(1);
		};
		alert(ss);
	}

	urlParser = new UrlParser();
	urlParser.Parse();
	toc_safeUriMode = urlParser.GetSafeMode();

	var k = null;
	if (searchParam = urlParser.GetParameter("search")) {
		_goToFlatMode = true;
	}
	if (hemiParam = urlParser.GetParameter("ctxex") || null) {
		hemiParam = UnescapeHemiParam(hemiParam);
		if (hemiParam == "" || hemiParam == "''") {
			hemiParam = null;
		}
		else {
			_goToFlatMode = true;
			appParam = urlParser.GetParameter("app");
			ctxParam = urlParser.GetParameter("ctx");
			udvParam = urlParser.GetParameter("udv");
			shParam = urlParser.GetParameter("sh");
		}
	}
	if (XDTParam = urlParser.GetParameter("XDT")) {
		XDTParam = true;
	}
	if (urlParser.GetParameter("genctx") != null) {
		genericMode = true;
		_goToFlatMode = true;
	}
	if (k = urlParser.GetParameter("sac") || "") {
		_tree_root = k;
		_associated_content = true;
	}
	if (k = urlParser.GetParameter("sco") || "") {
		_tree_root = k;
		_sco = true;
	}
	if (k = urlParser.GetParameter("seealso") || "") {
		_tree_root = k;
		_see_also = true;
	}
	var si;
	if (si = urlParser.GetParameter("selectitem")) {
		_seealso_selecteditem = parseInt(si, 10);
	}
	if (urlParser.GetParameter("launchfromkpath") != null) {
		_launchFromKPath = true;
	}
	if (genericMode == true) {
		searchParam = null;
	}
	if (k = urlParser.GetParameter("treeindex") || "") {
		_treeIndex = parseInt(k, 10);
	}
	if (k = urlParser.GetParameter("keep-alive-timer") != null) {
		KeepAlive_Init("../");
	}
	if (urlParser.GetParameter('treeindex') != null && urlParser.GetParameter('guid') != null && urlParser.GetParameter('bypasstoc') != null) {
		_launchedFromSharedLink = true;
	}
}

function IndexObject(index, score) {
	this.index = index;
	this.score = score;
}

function SortFunction(a, b) {
	var k = b.score - a.score;
	return k;
}

function ShowGenToc(x) {
	ctxTopicList = new Array();
	ctxTopicList2 = new Array();
	for (var i = 0; i < x.length; i++) {
		ctxTopicList[ctxTopicList.length] = new IndexObject(x[i].index, (typeof (x[i].score) != "undefined" ? x[i].score : x[i].weight));
	}
	ctxTopicList.sort(SortFunction);
	if (hemiParam == null) {
		ShowGenToc2(null);
	}
	else {
		genericMode_SearchHemi = true;
		Select(2);
	}
}

function ShowGenToc2(x) {
	genericMode_SearchHemi = false;
	if (x != null) {
		for (var i = 0; i < x.length; i++) {
			var ki = x[i].index;
			var _found = false;
			for (var j = 0; j < ctxTopicList.length; j++) {
				var kj = ctxTopicList[j].index;
				if (ki == kj) {
					_found = true;
					break;
				}
			}
			if (_found == false) {
				for (var j = 0; j < ctxTopicList2.length; j++) {
					var kj = ctxTopicList2[j].index;
					if (ki == kj) {
						_found = true;
						break;
					}
				}
			}

			if (_found == false) {
				ctxTopicList2[ctxTopicList2.length] = new IndexObject(ki, 1);
			}
		}
		if (ctxTopicList2.length > 0) {
			for (var i = 0; i < ctxTopicList.length; i++) {
				ctxTopicList2[ctxTopicList2.length] = ctxTopicList[i];
			}
			ctxTopicList = ctxTopicList2;
		}
	}
	result_Search(ctxTopicList);
}

function IsEmptyArgument(s, keywordlen) {
	if (s.length <= keywordlen)
		return true;
	if (s.length > keywordlen + 2)
		return false;
	var ss = s.substr(keywordlen);
	if (ss == '""' || ss == "''")
		return true;
	return false;
}

var _closing = false;

function Closing2() {
	if (!upk.browserInfo.isExplorer())
		Closing();
}

function Closing() {
	lms_ClosePage(false);
	_closing = true;
	ClosePlayer();
	KeepAlive_Close();
	var c = new Cookie(document, "OnDemandToc", 365, null, null, false);
	c.Load();
	if (window.screenLeft != null)	// IE
	{
		c.TocLeft = window.screenLeft - 4;
		c.TocTop = window.screenTop - 30;
		c.TocWidth = document.body.clientWidth;
		c.TocHeight = document.body.clientHeight;
	}
	else	// Mozilla
	{
		c.TocLeft = window.screenX;
		c.TocTop = window.screenY;
		c.TocWidth = window.innerWidth;
		c.TocHeight = window.innerHeight;
	}
	c.Store();
}

function NotSupportedYet() {
	alert("Coming soon ...");
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
/* tree.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

/// <reference path="jquery.d.ts" />
/// <reference path="resource_b.js" />
/// <reference path="../config.js" />
/// <reference path="../data/outline.js" />
/// <reference path="../data/toc/treeindex.js" />
/// <reference path="../data/toc/titles.js" />
/// <reference path="../data/uiconfig.js" />

/// <reference path="common.js" />
/// <reference path="dialog.js" />
/// <reference path="swfobject.js" />
/// <reference path="browser.js" />
/// <reference path="cookie.js" />
/// <reference path="escape.js" />
/// <reference path="xmlloader.js" />
/// <reference path="lms_toc.js" />
/// <-reference path="tocfunctions_.ts" />
/// <reference path="query.js" />
/// <reference path="preferences.js" />

/// <reference path="relativelink.js" />
/// <reference path="lmsapplet.js" />
/// <reference path="lmscomfactory.js" />
/// <reference path="lmscom.js" />
/// <reference path="lms_init.js" />
/// <reference path="playerlaunch.js" />
/// <reference path="sound.js" />
/// <reference path="ctxhelper.js" />
/// <reference path="iashelper.js" />
/// <reference path="tascriptsintoc.js" />

// common variables

//var upk_Outline = (function () {

var treeControlDB = false;
var bigsco = false;
var treeControl;

function ModeDesc(k) {
    this.treeCreated = false;
    this.lastSelected = null;
    this.filteredGuids = new Array();
    this.filteredGuidList = new Array();
    this.filteredTopicCount = 0;
    this.guidsForFlat = new Array();
    this.lastSelectedFlat = null;
    this.flatMode = false;
    this.modeLetter = k;
    this.treeControl = null;
    this.flatControl = null;
    this.loadedGuids = new Array();
    this.foundItemMap = new Array();
}

var modeDescA = new ModeDesc("A");
var modeDescF = new ModeDesc("F");
var modeDescH = new ModeDesc("H");
var modeDescFH = new ModeDesc("X");

var treeViewMode = "ALL"; 			// view mode ("ALL" or "FILTERED" or "HEMI" or "FILTEREDHEMI")
var treeIsEmpty;
var _rootData = "";

function GetJunctionId(s) {
    var k = s.indexOf('_');
    var kk = s.indexOf('_', k + 1)
    return s.substr(0, kk);
}

////////////////////////////////////
// filtering support

var filteredGuidsR = new Array(); // associative array contains all guid to show
var filteredTopicCountR = 0; 	// number of filtered topics (ROLES)
var rolefilter_enabled = false;

var selection_need = 0;
var stl_mode = "ALL";
var stl_callback;
var stl_myTopicArray = new Array();
var stl_myscoresArray = new Array();
var stl_i = 0;
var seeAlsoSelection = 0;

var _lastChangeIsFilterOnly = false;

function AddToFoundItemMap(_guid, _ordinal, _cindexobject) {
    var md = modeDescA;
    if (md.foundItemMap[_guid] == null) {
        md.foundItemMap[_guid] = new Object({ guid: _guid, ordinal: _ordinal, cindexes: new Array() });
    }
    md.foundItemMap[_guid].cindexes.push(_cindexobject);
}

function SetTopicList(mode, topicarray0, callbackfn) {

    function isNewItem(pp) {
        for (var i = 0; i < topicarray.length; i++) {
            if (pp.r[0] == topicarray[i].index)
                return false;
        }
        return true;
    }

    function _sortfn(a, b) {
        var aw = a.weight || a.score || 0;
        var bw = b.weight || b.score || 0;
        if (aw != bw)
            return bw - aw;
        return a.index - b.index;
    }

    var topicarray = new Array();
    modeDescA.foundItemMap = new Array();
    if (topicarray0) {
        for (var i = 0; i < topicarray0.length; i++) {
            topicarray.push(topicarray0[i]);
            upk_tocTreeData.getByCIndex(topicarray0[i].index,
            function (p1, t1, o1) {
                var pp1 = p1[p1.length - 1];
                AddToFoundItemMap(pp1.g, pp1.o, new Object({ cindex: topicarray0[i].index, nullindex: pp1.r[0], score: topicarray0[i].weight || topicarray0[i].score }));
                if (pp1.d) {
                    var dups = pp1.d.split(",");
                    for (var k = 0; k < dups.length; k++) {
                        upk_tocTreeData.getPathByOrdinal(dups[k],
                            function (p2, t2, o2) {
                                var pp2 = p2[p2.length - 1];
                                var di = topicarray0[i].index - pp1.r[0];
                                AddToFoundItemMap(pp2.g, pp2.o, new Object({ cindex: pp2.r[0] + di, nullindex: pp2.r[0], score: topicarray0[i].weight || topicarray0[i].score }));
                                topicarray.push(new Object({ index: pp2.r[0] + di, weight: topicarray0[i].weight || topicarray0[i].score }));
                            });
                    }
                }
                if (mode == "ROLES") {
                    upk_tocTreeData.getSeeAlsoReferences(pp1, function (p1) {
                        for (var k = 0; k < p1.length; k++) {
                            if (isNewItem(p1[k])) {
                                AddToFoundItemMap(p1[k].g, p1[k].o, new Object({ cindex: p1[k].r[0], nullindex: p1[k].r[0], score: topicarray0[i].weight || topicarray0[i].score }));
                                topicarray.push(new Object({ index: p1[k].r[0], weight: topicarray0[i].weight || topicarray0[i].score }));
                            }
                        }
                    });
                }
            }, mode == "ROLES");
        }
    }
    topicarray.sort(_sortfn);
    stl_mode = mode;
    stl_callback = callbackfn;
    _lastChangeIsFilterOnly = false;
    getModeDesc().loadedGuids = new Array();
    if (mode == "FILTERED") {
        modeDescF.filteredGuids = new Array();
        modeDescF.filteredGuidList = new Array();
        modeDescF.filteredTopicCount = topicarray.length;
        modeDescF.guidsForFlat = new Array();
        modeDescF.flatMode = true;
    }
    else if (mode == "HEMI") {
        modeDescH.filteredGuids = new Array();
        modeDescH.filteredGuidList = new Array();
        modeDescH.filteredTopicCount = topicarray.length;
        modeDescH.guidsForFlat = new Array();
        modeDescH.flatMode = true;
    }
    else if (mode == "ROLES") {
        filteredGuidsR = new Array();
        filteredTopicCountR = topicarray.length;
        rolefilter_enabled = true;
        _lastChangeIsFilterOnly = true;
    }
    else	// "NOROLES"
    {
        rolefilter_enabled = false;
        _lastChangeIsFilterOnly = true;
        stl_callback();
        return;
    }
    stl_myTopicArray = new Array();
    stl_myTopicArray = topicarray;
    stl_myscoresArray = new Array();
    if (topicarray.length > 0) {
        try {
            var a = topicarray[0].index;
            if (a) {
                stl_myTopicArray = new Array();
                for (var i = 0; i < topicarray.length; i++) {
                    stl_myTopicArray[stl_myTopicArray.length] = topicarray[i].index;
                    stl_myscoresArray[topicarray[i].index] = topicarray[i].score;
                }
            }
        }
        catch (e) {
        }
    }
    stl_i = 0;
    SetTopicList_Next();
}

function SetTopicList_Next() {
    var fTC = modeDescF.filteredTopicCount;
    if (stl_mode == "HEMI")
        fTC = modeDescH.filteredTopicCount;
    if (stl_mode == "ROLES")
        fTC = filteredTopicCountR;
    if (!(stl_i < fTC)) {
        stl_callback();
        return;
    }
    var j = stl_myTopicArray[stl_i];
    upk_tocTreeData.getByCIndex(j, SetTopicList_Next2, stl_mode == "ROLES");
}

function ItemDesc(type, title, empty) {
    this.type = type;
    this.title = title;
    this.empty = empty;
    this.found = false;
    this.parentguid = null;
    this.openable = new Array();
    this.treeitemdiv = null;
    this.loaded = false;
}

function AddItemdesc(o, array, sss, type, title, empty, found, topicguid, parentguid) {
    var l = false;
    var _ss = sss.split("#");
    var ss = _ss[0];
    try {
        l = array[ss].title.length > 0;
    }
    catch (e) { };
    if (!l) {
        array[ss] = new ItemDesc(type, title, empty);
        if (o)
            o.filteredGuidList[o.filteredGuidList.length] = ss;
        AddToIndexMap(ss);
    }
    array[ss].parentguid = parentguid;
    if (found == true)
        array[ss].found = true;
    if (topicguid.length > 0)
        array[ss].openable[array[ss].openable.length] = topicguid;
    if (array[ss].guid == undefined) {
        array[ss].guid = ss;
        array[ss].context = _ss[1];
    }
    else {
        array[ss].context += _ss[1];
    }
}

function AddTreeItemToItemDesc(guid, itemdiv) {
    var md = getModeDesc(false);
    try {
        if (treeViewMode == "FILTEREDHEMI") {
            if (!md.filteredGuids)
                md.filteredGuids = new Array();
            if (!md.filteredGuids[guid]) {
                md.filteredGuids[guid] = new ItemDesc("", "", false);
                md.filteredGuidList[md.filteredGuidList.length] = guid;
            }
            AddToIndexMap(guid);
        }
        md.filteredGuids[guid].treeitemdiv = itemdiv;
    }
    catch (e) { }
    saveModeDesc(md);
}

function GetTreeItemOfItemDesc(guid) {
    var md = getModeDesc(false);
    var _item = null;
    try {
        _item = md.filteredGuids[guid].treeitemdiv;
    }
    catch (e) { }
    return _item;
}

function FlatItemDesc(type, title, empty, guid, isroot, score) {
    this.type = type;
    this.title = title;
    this.empty = empty;
    this.guid = guid;
    this.isroot = isroot;
    if (!score)
        score = 0;
    this.score = score;
}

function AddFlatItemdesc(array, guid, type, title, empty, isroot, score) {
    var k = guid.indexOf('#');
    var guid = k < 0 ? guid : guid.substring(0, k);
    for (var i = 0; i < array.length; i++) {
        if (array[i].guid == guid)
            return;
        if (array[i].guid.substr(0, 36) == guid.substr(0, 36))
            return;
    }
    array[array.length] = new FlatItemDesc(type, title, empty, guid, isroot, score);
}

function SetTopicList_Next2(path, title, _type, relcindex) {
    var k, i, s, _empty = false, type, ss;
    var pathwid = [];
    for (i = 0; i < path.length; i++)
        pathwid.push(path[i].g + "_" + path[i].o);
    s = pathwid.join("/");
    var _tguid = pathwid[pathwid.length - 1];
    switch (_type) {
        case "S": type = "Section"; break;
        case "E": type = "Section"; _empty = true; break;
        case "T": type = "Topic"; break;
        case "Q": type = "Question"; break;
        case "A": type = "Assessment"; break;
    };
    var _concept = path[path.length - 1].c;
    s += relcindex > 0 ? "#C" + relcindex : "";

    k = s.indexOf('/');
    var _pguid = null;
    if (_type == "T" || _concept == 1 || _type == "Q" || _type == "A") {
        while (k >= 0) {
            ss = "" + s.substr(0, k);
            if (stl_mode == "FILTERED") {
                //  			filteredGuidsF[ss]=itemdesc;
                //  			filteredGuidsF[ss.substr(0,36)]=itemdesc;
                AddItemdesc(modeDescF, modeDescF.filteredGuids, ss, type, title, _empty, false, _tguid, _pguid);
                AddItemdesc(modeDescF, modeDescF.filteredGuids, ss.substr(0, 36), type, title, _empty, false, _tguid, _pguid);
            }
            else if (stl_mode == "HEMI") {
                //  			filteredGuidsH[ss]=itemdesc;
                AddItemdesc(modeDescH, modeDescH.filteredGuids, ss, type, title, _empty, false, _tguid, _pguid);
                AddItemdesc(modeDescH, modeDescH.filteredGuids, ss.substr(0, 36), type, title, _empty, false, _tguid, _pguid);
            }
            else	// "ROLES"
            {
                //  			filteredGuidsR[ss]=itemdesc;
                AddItemdesc(null, filteredGuidsR, ss, type, title, _empty, false, _tguid, null);
                AddItemdesc(null, filteredGuidsR, ss.substr(0, 36), type, title, _empty, false, _tguid, null);
            }
            _pguid = ss;
            ss = s.substr(k + 1);
            s = ss;
            k = s.indexOf('/');
        }
        if (s.length > 0) {
            ss = s;
            k = s.indexOf('#');
            if (k < 0)
                ss += "#";
            if (stl_mode == "FILTERED") {
                //  			filteredGuidsF[ss]=itemdesc;
                AddItemdesc(modeDescF, modeDescF.filteredGuids, ss, type, title, _empty, true, "", _pguid);
                AddFlatItemdesc(modeDescF.guidsForFlat, ss, type, title, _empty, false, 0);
            }
            else if (stl_mode == "HEMI") {
                //  			filteredGuidsH[ss]=itemdesc;
                AddItemdesc(modeDescH, modeDescH.filteredGuids, ss, type, title, _empty, true, "", _pguid);
                var _score = stl_myscoresArray[stl_myTopicArray[stl_i]];
                AddFlatItemdesc(modeDescH.guidsForFlat, ss, type, title, _empty, false, _score);
            }
            else {
                //  			filteredGuidsR[ss]=itemdesc;
                AddItemdesc(null, filteredGuidsR, ss, type, title, _empty, true, "", null);
                AddItemdesc(null, filteredGuidsR, ss.substr(0, 36), type, title, _empty, true, "", null);
            }
        }
    }
    stl_i++;
    SetTopicList_Next();
}

//////////////////////////////////////////////////////////////////////////////

function TreeViewModeLetter() {
    if (treeViewMode == "FILTEREDHEMI")
        return "X";
    return treeViewMode.substr(0, 1);
}

function IsFiltered(guid, tMode) // true if the guid must be show
{
    var k;
    var l = 0;
    try {
        l = filteredGuidsR[guid].title.length;
    }
    catch (e) { };

    var roles = 0; //not enabled
    if (rolefilter_enabled) {
        roles = (l > 0 ? 1 : 2); // 1 -> found, 2 -> not found
    }

    if (tMode == "ALL") {
        if (roles == 0) {
            treeIsEmpty = false;
            return true;
        }
        else if (roles == 1) {
            var ll = false;
            try {
                ll = (filteredGuidsR[guid].openable.length > 0 || filteredGuidsR[guid].found);
            }
            catch (e) { };
            if (ll)
                treeIsEmpty = false;
            return ll;
        }
        else {
            return false;
        }


    }
    else if (tMode == "FILTERED") {
        l = 0;
        try {
            l = modeDescF.filteredGuids[guid].title.length;
        }
        catch (e) { };
        if (l == 0)
            return false;

        if (roles == 0) {
            treeIsEmpty = false;
            return true;
        }
        else if (roles == 1) {
            ll = false;
            try {
                ll = Cut(modeDescF.filteredGuids[guid].openable, filteredGuidsR[guid].openable) ||
							(modeDescF.filteredGuids[guid].found && filteredGuidsR[guid].found);
            }
            catch (e) { };
            if (ll)
                treeIsEmpty = false;
            return ll;
        }
        else {
            return false;
        }
    }
    else if (tMode == "HEMI") {
        l = 0;
        try {
            l = modeDescH.filteredGuids[guid].title.length;
        }
        catch (e) { };
        if (l == 0)
            return false;

        if (roles == 0) {
            treeIsEmpty = false;
            return true;
        }
        else if (roles == 1) {
            ll = false;
            try {
                ll = Cut(modeDescH.filteredGuids[guid].openable, filteredGuidsR[guid].openable) ||
							(modeDescH.filteredGuids[guid].found && filteredGuidsR[guid].found);
            }
            catch (e) { };
            if (ll)
                treeIsEmpty = false;
            return ll;
        }
        else {
            return false;
        }
    }
    else	// FILTEREDHEMI
    {
        if (roles == 0) {
            ll = false;
            try {
                ll = Cut(modeDescF.filteredGuids[guid].openable, modeDescH.filteredGuids[guid].openable) ||
							(modeDescF.filteredGuids[guid].found && modeDescH.filteredGuids[guid].found);
            }
            catch (e) { };
            if (ll)
                treeIsEmpty = false;
            return ll;
        }
        else if (roles == 1) {
            ll = false;
            try {
                ll = Cut3(modeDescF.filteredGuids[guid].openable, modeDescH.filteredGuids[guid].openable, filteredGuidsR[guid].openable) ||
							(modeDescF.filteredGuids[guid].found && modeDescH.filteredGuids[guid].found && filteredGuidsR[guid].found);
            }
            catch (e) { };
            if (ll)
                treeIsEmpty = false;
            return ll;

        }
        else {
            return false;
        }
    }
}

function Cut(array1, array2) {
    if (array2 == null) {
        return array1.length > 0;
    }
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] == array2[j])
                return true;
        }
    }
    return false;
}

function Cut3(array1, array2, array3) {
    if (array3 == null)
        return Cut(array1, array2);
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            for (var k = 0; k < array3.length; k++) {
                if (array1[i] == array2[j] && array2[j] == array3[k])
                    return true;
            }
        }
    }
    return false;
}

function IsOpenable(guid) {
    var roleArray = null;
    if (rolefilter_enabled == true) {
        roleArray = filteredGuidsR[guid].openable;
    }

    if (treeViewMode == "ALL") {
        if (rolefilter_enabled) {
            var l = false;
            try {
                l = roleArray.length > 0;
            } catch (e) { };
            return l;
        }
        return true;
    }
    else if (treeViewMode == "FILTERED") {
        l = true;
        try {
            l = Cut(modeDescF.filteredGuids[guid].openable, roleArray);
        }
        catch (e) { };
        return l;
    }
    else if (treeViewMode == "HEMI") {
        l = true;
        try {
            l = Cut(modeDescH.filteredGuids[guid].openable, roleArray);
        }
        catch (e) { };
        return l;
    }
    else		// FILTEREDHEMI
    {
        l = Cut3(modeDescF.filteredGuids[guid].openable, modeDescH.filteredGuids[guid].openable, roleArray);
        return l;
    }
}

var _expandLevel = -1;

function IsAutoExpand(element, needOpen)	// true if the tree must be appear expanded
{
    if (GetActualFlatView() == true) {
        if (treeViewMode == "FILTERED")
            return (modeDescF.filteredTopicCount < TreeConfig.AutoExpandLimit)
        else if (treeViewMode == "FILTEREDHEMI")
            return (modeDescF.filteredTopicCount < TreeConfig.AutoExpandLimit)
        else	//"HEMI"
            return (modeDescH.filteredTopicCount < TreeConfig.AutoExpandLimit)
    }
    else {
        var md = getModeDesc();
        var tpc = GetTpcAttribute(element);
        if (tpc == null && element.i) {
            tpc = element.i;
        }
        if (tpc == null && element.d) {
            tpc = element.d;
        }
        if (tpc == null && element.id) {
            var e = element.id;
            if (e[8] == '-' && e[13] == '-' && e[18] == '-' && e[36] == '_') {
                var k1 = e.indexOf('_');
                var k2 = e.lastIndexOf('_');
                if (k1 == k2)
                    tpc = e;
                else
                    tpc = e.substr(0, k2);
            }
        }
        var depth = 0;
        while (tpc in md.filteredGuids) {
            depth++;
            tpc = md.filteredGuids[tpc].parentguid;
        }
        if (_expandLevel < 0) {
            try {
                _expandLevel = parseInt(TreeConfig.DefaultExpandLevel, 10);
            }
            catch (e) {
                _expandLevel = 1;
            }
            if (_expandLevel < 1)
                _expandLevel = 1;
            _expandLevel--;
        }
        if (!needOpen)
            return (depth <= _expandLevel)
        return (depth < _expandLevel);
    }
}

function Queue_Next(t)	// load next section html file
{
    if (_childItem_found) {
        _childItem_found = false;
        createTreeControl(null, false, null, null, null);
    }
    else {
        if (selection_need > 0) {
            var sel = false;
            if (_lastSelectedGlobal.length > 0) {
                if (rolefilter_enabled == true) {
                    var l = 0;
                    try {
                        l = filteredGuidsR[_lastSelectedGlobal].title.length;
                    }
                    catch (e) { };
                    if (l > 0) {
                        sel = true;
                    }
                }
                else {
                    sel = true;
                }
            }

            if (sel == true) {
                selection_need = 0;
                if (ChangeTreeView_CallBack() == true)
                    return;
            }
            t.SelectFirstItem();
        }
        if (TreeFinished) {
            TreeFinished(treeViewMode, treeIsEmpty);
        }
    }
}

function SelectionCallBack(_item) {
    var t;
    var md = getModeDesc(false);
    switch (treeViewMode) {
        case "ALL":
            if (_lastSelectedItem_tree != null) {
                if (_lastSelectedItem_tree.startAction == true) {
                    _lastSelectedItem_tree.startAction = false;
                }
                else {
                    _lastSelectedItem_tree.startAction = true;
                    ChangeTreeView_CallBack()
                    return;
                }
            }
            t = (_item == null ? md.lastSelected : _item);
            break;
        default:
            if (md.flatMode == true) {
                SetFlatSelection();
                return;
            }
            t = ((md.flatMode == true) ? md.lastSelectedFlat : (_item == null ? md.lastSelected : _item));
            break;
    }

    if (t == null) {
        if (TreeItemSelected)
            TreeItemSelected(null, null);
        return;
    };
    var tpc = t.getAttribute("tpc");
    if (tpc == null)
        tpc = t.parentNode.getAttribute("tpc");
    if (tpc == null)
        tpc = t.parentNode.parentNode.getAttribute("tpc");
    if (md.flatMode == false) {
        ChangeSelection(t);
        window.scrollTo(0, (t.parentNode.offsetTop / 2) + 10);
    }
    if (tpc != null)
        SetLastSelected(tpc, treeViewMode, false);
    if (TreeItemSelected)
        TreeItemSelected(tpc, treeViewMode);
}

function ClearDescriptor(md, fm) {
    md.treeCreated = true;
    md.lastSelected = null;
    md.lastSelectedFlat = null;
    //	if (_lastChangeIsFilterOnly==false)
    md.flatMode = fm;
    for (var i = 0; i < md.filteredGuidList.length; i++) {
        var s = md.filteredGuidList[i];
        md.filteredGuids[s].treeitem = null;
        md.filteredGuids[s].treeitemdiv = null;
        md.filteredGuids[s].loaded = false;
    }
    md.loadedGuids = new Array();
}

function LastSelectedItem(guid, mode) {
    this.guid = guid;
    this.mode = mode;
    this.startAction = false;
    this.firsdBuild = false;
}

var _lastSelectedItem_tree = null;
var _lastSelectedGlobal = "";
var _lastSelectedGlobalMode = "";

function SetLastSelected(guid, mode, force) {
    _lastSelectedGlobal = guid;
    _lastSelectedGlobalMode = mode;
    if (!force) {
        if (treeViewMode == "ALL")
            return;
    }
    _lastSelectedItem_tree = new LastSelectedItem(guid, mode);
}

function GetTpcAttribute(obj) {
    var tpc = null;
    while (tpc == null) {
        try {
            tpc = obj.getAttribute("tpc");
        }
        catch (e) {
            return null;
        }
        if (tpc == null)
            obj = obj.parentNode;
    }
    return tpc;
}

var _childItem = null;
var _childItem2 = null;
var _childItem_found = false;

function createTreeControl(rootData, flatmode, _item, selection, childitem) {
    if (rootData)
        _rootData = rootData;
    try {
        bigsco = SCO_Supported();
    }
    catch (e) { }
    InitTocStates();
    if (selection)
        seeAlsoSelection = selection;
    if (childitem) {
        _childItem = childitem;
        _childItem2 = childitem;
    }
    var fm = (flatmode == true ? true : false);
    selection_need = 1;
    if (treeViewMode == "ALL") {
        if (modeDescA.treeCreated == true) {
            SelectionCallBack(_item);
            return;
        }
        ClearDescriptor(modeDescA, false);
        if (_lastSelectedItem_tree != null) {
            _lastSelectedItem_tree.startAction = true;
            _lastSelectedItem_tree.firstBuild = true;
        }
        else {
            selection_need = 2;
        }
    }
    else if (treeViewMode == "FILTERED") {
        if (modeDescF.treeCreated == true) {
            //			if (fm==true && _lastChangeIsFilterOnly==false)
            //				modeDescF.flatMode=true;
            modeDescF.flatMode = fm;
            SelectionCallBack(_item);
            return;
        }
        ClearDescriptor(modeDescF, fm);
    }
    else if (treeViewMode == "FILTEREDHEMI") {
        if (modeDescFH.treeCreated == true) {
            //			if (fm==true && _lastChangeIsFilterOnly==false)
            //				modeDescFH.flatMode=true;
            modeDescFH.flatMode = fm;
            SelectionCallBack(_item);
            return;
        }
        ClearDescriptor(modeDescFH, fm);
    }
    else	//"HEMI"
    {
        if (modeDescH.treeCreated == true) {
            //			if (fm==true && _lastChangeIsFilterOnly==false)
            //				modeDescH.flatMode=true;
            modeDescH.flatMode = fm;
            SelectionCallBack(_item);
            return;
        }
        ClearDescriptor(modeDescH, fm);
    }
    treeIsEmpty = true;
    if (treeViewMode == "ALL")
        treeControl = new TreeControl(document.getElementById("treeControlHostForAll"), rootData);
    else if (treeViewMode == "FILTERED") {
        treeControl = new TreeControl(document.getElementById("treeControlHostForFiltered"), rootData);
        modeDescF.flatControl = new FlatControl("flatControlHostForFiltered");
        modeDescF.flatControl.Load();
        selection_need = (modeDescF.flatMode == true ? 0 : 1);
    }
    else if (treeViewMode == "FILTEREDHEMI") {
        treeControl = new TreeControl(document.getElementById("treeControlHostForFilteredHemi"), rootData);
        modeDescFH.flatControl = new FlatControl("flatControlHostForFilteredHemi");
        modeDescFH.flatControl.Load();
        selection_need = (modeDescFH.flatMode == true ? 0 : 1);
    }
    else	//"HEMI"
    {
        treeControl = new TreeControl(document.getElementById("treeControlHostForHemi"), rootData);
        modeDescH.flatControl = new FlatControl("flatControlHostForHemi");
        modeDescH.flatControl.Load();
        selection_need = (modeDescH.flatMode == true ? 0 : 1);
    }

    treeControl.LoadScript(treeControl.rootData, treeControl.treeHost.id);
}

function TreeControl(host, rootData) {
    this.host = host;
    this.rootData = rootData;

    host.innerHTML = "";
    this.treeHost = document.createElement("div");
    this.treeHost.id = rootData + "_" + TreeViewModeLetter();
    this.treeHost.className = "treeControlNode";
    this.treeHost.onclick = this.OnClick;
    this.treeHost.onmouseup = this.OnMouseUp;
    this.treeHost.ondblclick = this.OnDoubleClick;
    this.host.appendChild(this.treeHost);
}

TreeControl.prototype.LoadScript = function (src, indexedSrc) {
    setTimeout(function () { treeControl.LoadScriptInternal(src, indexedSrc); }, 0);
}

TreeControl.prototype.LoadScriptInternal = function (src, indexedSrc) {
    treeControlDB = true;
    upk_tocTreeData.getByOrdinal(parseInt(src.substring(37)), function (id, c) {
        // convert to legacy data format
        var lc = [];
        for (var i = 0; i < c.length; i++) {
            lc[i] = { t: c[i].t, y: c[i].y };
            lc[i][(c[i].y == "S" || c[i].y == "E" ? "d" : "i")] = c[i].g + "_" + c[i].o;
        }
        treeControl.Bind({ c: lc }, indexedSrc);
    });
}

TreeControl.prototype.Bind = function (data, indexedSrc) {
    if (treeControlDB) {
        treeControlDB = false;
        this.TraverseChildren(data.c, document.getElementById(indexedSrc));
        _childNode_Loaded(null);
    }
    if (directMode == true)
        ChangeTreeView_CallBack()
    else
        Queue_Next(this);
}

function GetClassNameFromFile(filename) {

    var mytool_array = filename.split("/");
    var cname = mytool_array[mytool_array.length - 1];
    return cname.replace(".gif", "");
}

TreeControl.prototype.TraverseNode = function (node, parentElement, image, last) {
    var md = getModeDesc();
    var guid = (node.i ? node.i : node.d);
    var hasChildren = node.c || node.d;
    var _openable = (node.d ? IsOpenable(node.d) : false)
    if (guid in md.filteredGuids) {
        if (md.filteredGuids[guid].loaded == true) {
            if (hasChildren && _openable) {
                if (node.d) {
                    return node.d + "_" + TreeViewModeLetter(); ;
                }
            }
            else
                return null;
        }
        md.filteredGuids[guid].loaded = true;
    }
    var e, f, g;
    var _empty = node.y == "E";
    if (treeViewMode == "ALL") {
        var pGuid = parentElement.getAttribute("id");
        var k = pGuid.lastIndexOf("_");
        pGuid = pGuid.substr(0, k);
        var iGuid = (node.d ? node.d : node.i);
        AddItemdesc(modeDescA, modeDescA.filteredGuids, iGuid, "", "-", _empty, false, "", pGuid);
        AddTreeItemToItemDesc(iGuid, true);
    }
    node.element = document.createElement("div");
    f = node.element;
    f.className = "treeControlNode";

    g = f.appendChild(document.createElement("div"));
    g.setAttribute("tpc", guid);

    e = g.appendChild(document.createElement("img"));
    e.setAttribute("srcroot", "../img/outl_" + image);
    if (_empty || (node.d && !_openable)) {
        var esrc = e.getAttribute("srcroot") + ".gif";
        e.className = GetClassNameFromFile(esrc);
        e.openable = false;
        e.src = "../img/empty.gif";
    }
    else {
        esrc = e.getAttribute("srcroot") + (hasChildren ? (IsAutoExpand(e) ? "o.gif" : "c.gif") : ".gif");
        e.className = GetClassNameFromFile(esrc);
        e.src = "../img/empty.gif";
        e.openable = (hasChildren ? (IsAutoExpand(e) ? true : true) : false);
    }

    e = g.appendChild(document.createElement("img"));
    if (bigsco) {
        var stat = GetItemStatus(guid);
        e.className = _GetItemStatusFile(stat);
        e.src = "../img/empty.gif";
        e.title = _GetItemStatusTitle(stat);
        e.alt = _GetItemStatusTitle(stat);
    }
    else {
        e.src = "../img/empty.gif";
        e.className = "sco_empty";
    }

    e = g.appendChild(document.createElement("img"));

    if (_empty) {
        esrc = "../img/emptysection.gif";
        e.className = GetClassNameFromFile(esrc);
        e.src = "../img/empty.gif";

    }
    else {
        esrc = (hasChildren ? ((IsAutoExpand(e) && _openable) ? "../img/module_o.gif" : "../img/module_c.gif") :
							"../img/topic.gif");
        e.src = "../img/empty.gif";
        e.className = GetClassNameFromFile(esrc);

        if (node.y == "Q") {
            e.className = "question_player"; // GetClassNameFromFile("../img/question.gif");
        }
        if (node.y == "A") {
            e.className = "assessment_player"; // GetClassNameFromFile("../img/assessment.gif");
        }

    }
    e = g.appendChild(document.createElement("span"));
    var ee = e.appendChild(document.createElement("a"));
    ee.className = "";
    ee.style.cursor = "pointer";
    ee.onmouseover = this.OnOverItem;
    ee.onmouseout = this.OnOutItem;
    ee.appendChild(document.createTextNode(UnescapeQuotes(node.t)));
    AddTreeItemToItemDesc(guid, ee);

    parentElement.appendChild(f);

    if (hasChildren && _openable && node.y.toUpperCase() != "E") {
        e = node.element.appendChild(document.createElement("table"));
        e.className = "treeControlChildren" + (!IsAutoExpand(node) ? "H" : "V");
        e.cellSpacing = 0;
        e = e.appendChild(document.createElement("tbody"));
        e = e.appendChild(document.createElement("tr"));
        f = e.appendChild(document.createElement("td"));
        //f.className = "treeControlLine" + (last ? "H" : "V") + (bigsco ? "W" : "");
        f.className = (last ? "horz_line" : "vert_line") + (bigsco ? "_wide" : "");
        f = f.appendChild(document.createElement("img"));
        f.src = "../img/empty.gif";
        f.className = "s";  // class for s.gif

        f = e.appendChild(document.createElement("td"));
        if (node.c)
            this.TraverseChildren(node.c, f);
        if (node.d) {
            f.id = node.d + "_" + TreeViewModeLetter();
            return f.id;
        }
    }
    return null;
}

TreeControl.prototype.TraverseChildren = function (children, parentElement) {
    if (!children)
        return;

    var md = getModeDesc();
    var guid = (children[0].d ? children[0].d : children[0].i);
    if (md.loadedGuids[guid])
        return;
    md.loadedGuids[guid] = true;

    var children2 = new Array();
    var childrendivs = new Array();

    for (var c = 0; c < children.length; c++) {
        guid = (children[c].d ? children[c].d : children[c].i);
        if (IsFiltered(guid, treeViewMode))
            children2[children2.length] = children[c];
    }

    if (children2.length > 0) {
        if (parentElement.className == "treeControlNode") {
            if (children2.length == 1) {
                childrendivs[0] = this.TraverseNode(children2[0], parentElement, "r", true);
            }
            else {
                childrendivs[0] = this.TraverseNode(children2[0], parentElement, "f", false);
                var lasti = children2.length - 1;
                for (var i = 1; i < lasti; i++)
                    childrendivs[i] = this.TraverseNode(children2[i], parentElement, "m", false);
                childrendivs[lasti] = this.TraverseNode(children2[lasti], parentElement, "l", true);
            }
        }
        else {
            var lasti = children2.length - 1;
            for (var i = 0; i < lasti; i++)
                childrendivs[i] = this.TraverseNode(children2[i], parentElement, "m", false);
            childrendivs[lasti] = this.TraverseNode(children2[lasti], parentElement, "l", true);
        }
    }

    if (children2.length > 0) {
        if (IsAutoExpand(parentElement, true)) {
            for (var j = 0; j < children2.length; j++) {
                if (children2[j].d && children2[j].y == "S")
                    this.LoadScript(children2[j].d, childrendivs[j])
            }
        }
    }

    for (var j = 0; j < children2.length; j++) {
        var chindex = (children2[j].d ? children2[j].d.substr(37) : children2[j].i.substr(37));
        try {
            chindex = parseInt(chindex, 10);
        }
        catch (e) { };
        if (chindex == _childItem2) {
            _childItem = _childItem2;
            _childItem_found = false;
        }
    }

    if (_childItem != null) {
        var maxindex = children2.length - 1;
        for (var j = 0; j < children2.length; j++) {
            var chindex = (children2[j].d ? children2[j].d.substr(37) : children2[j].i.substr(37));
            try {
                chindex = parseInt(chindex, 10);
            }
            catch (e) { };
            if (chindex > _childItem && j == 0) {
                _childItem = null;
                // FAILED
                break;
            }
            else if (chindex < _childItem && j == maxindex) {
                if (children2[j].d) {
                    this.LoadScript(children2[j].d, childrendivs[j]);
                    break;
                }
                else {
                    _childItem = null;
                    // FAILED
                    break;
                }

            }
            else if (chindex == _childItem) {
                _childItem = null;
                _childItem_found = true;
                SetLastSelected(children2[j].d ? children2[j].d : children2[j].i, "ALL", true);
                // FOUND
                break;
            }
            else if (chindex > _childItem) {
                if (children2[j - 1].d) {
                    this.LoadScript(children2[j - 1].d, childrendivs[j - 1]);
                    break;
                }
                else {
                    _childItem = null;
                    // FAILED
                    break;
                }
            }
        }
    }

}

TreeControl.prototype.OnOverItem = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    if (target.className == "tselected")
        return;
    target.className = "thover";
}

TreeControl.prototype.OnOutItem = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    if (target.className == "tselected")
        return;
    target.className = "";
}

TreeControl.prototype.OnMouseUp = function (event) {
    try {
        if (event.target.nodeName == "A") {
            event.target.focus();
        }
    }
    catch (e) { };
}

TreeControl.prototype.OnClick = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    treeControl.OnClickHandler(event, target);
}

TreeControl.prototype.OnDoubleClick = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    if (!target.tagName)
        target = target.parentNode;
    if (target.tagName == "A" || target.tagName == "IMG") {
        if (target.tagName == "IMG") {
            // todo: prior statement converted to check classes instead of image file names, should be checked whether the statement itself is OK!
            var cl = target.className;
            if (cl.indexOf("topic") < 0 && cl.indexOf("question") < 0 && cl.indexOf("assessment") < 0)
                return;
        }
        var t = target.parentNode.parentNode.firstChild;
        target = t;
        treeControl.OnClickHandler(event, target);
        if (TreeItemDoubleSelected)
            TreeItemDoubleSelected();
    }
    clearTextSelection();
}

function ChangeSelection(e) {
    var ee = (e.tagName == "A" ? e : e.childNodes[0]);
    SetLastSelected(GetTpcAttribute(ee), treeViewMode, false);
    if (treeViewMode == "ALL") {
        if (modeDescA.lastSelected) {
            modeDescA.lastSelected.className = "";
        }
        modeDescA.lastSelected = ee;
        modeDescA.lastSelected.className = "tselected";
    }
    else if (treeViewMode == "FILTERED") {
        if (modeDescF.lastSelected) {
            modeDescF.lastSelected.className = "";
        }
        modeDescF.lastSelected = ee;
        modeDescF.lastSelected.className = "tselected";
    }
    else if (treeViewMode == "FILTEREDHEMI") {
        if (modeDescFH.lastSelected) {
            modeDescFH.lastSelected.className = "";
        }
        modeDescFH.lastSelected = ee;
        modeDescFH.lastSelected.className = "tselected";
    }
    else	//"HEMI"
    {
        if (modeDescH.lastSelected) {
            modeDescH.lastSelected.className = "";
        }
        modeDescH.lastSelected = ee;
        modeDescH.lastSelected.className = "tselected";
    }
}

TreeControl.prototype.SelectFirstItem = function () {
    var hostname = "";
    if (treeViewMode == "ALL")
        hostname = "treeControlHostForAll";
    else if (treeViewMode == "FILTERED")
        hostname = "treeControlHostForFiltered";
    else if (treeViewMode == "FILTEREDHEMI")
        hostname = "treeControlHostForFilteredHemi";
    else	//"HEMI"
        hostname = "treeControlHostForHemi";
    var tpc = "";
    var span;
    var f = document.getElementById(hostname).firstChild;

    if (seeAlsoSelection >= f.childNodes.length) {
        f = f.firstChild;
    }
    else {
        f = f.childNodes[seeAlsoSelection];
    }

    while (tpc == "") {
        try {
            var t = f.getAttribute("tpc");
        }
        catch (e) {
            return;
        }
        if (t) {
            tpc = t;
            span = f.lastChild;
        }
        f = f.firstChild;
    }
    ChangeSelection(span);
    var mode = treeViewMode;
    if (selection_need == 1) {
        mode = "HIDE";
    }
    selection_need = 0;
    if (TreeItemSelected)
        TreeItemSelected(tpc, treeViewMode);
}

TreeControl.prototype.OnClickHandler = function (event, t) {
    var realselect = false;
    var callback = true;
    //	var t = event.target;
    if (!t.tagName)
        t = t.parentNode;
    if (t.tagName == "IMG") {
        var e = t.parentNode.parentNode.lastChild;
        if (e.tagName == "TABLE") // section icon
        {
            var f = t.parentNode.firstChild;

            if (t.openable || f.openable || e.openable) {
                if (e.className == "treeControlChildrenV") {
                    var fsrc = f.getAttribute("srcroot") + "c.gif";
                    f.src = "../img/empty.gif";
                    f.className = GetClassNameFromFile(fsrc);
                    f = f.nextSibling;
                    f = f.nextSibling;
                    f.src = "../img/empty.gif";
                    f.className = GetClassNameFromFile("../img/module_c.gif");
                    e.className = "treeControlChildrenH";
                    _go_closed = true;
                }
                else {
                    fsrc = f.getAttribute("srcroot") + "o.gif";
                    f.src = "../img/empty.gif";
                    f.className = GetClassNameFromFile(fsrc);
                    f = f.nextSibling;
                    f = f.nextSibling;
                    f.src = "../img/empty.gif";
                    f.className = GetClassNameFromFile("../img/module_o.gif");
                    e.className = "treeControlChildrenV";
                    var g = e.firstChild.firstChild.lastChild;
                    if (!g.firstChild) {
                        var goriginal = (g.id.length > 36 ? GetJunctionId(g.id) : g.id);
                        callback = false;
                        treeControl.LoadScript(goriginal, g.id);
                    }
                }
            }
        }
        else	// topic icon
        {
            var e = t.parentNode.lastChild;
            if (e.tagName == "IMG")
                return;
            ChangeSelection(e);
            realselect = true;
        }
    }
    if (t.tagName == "A") // text field in <A> tag
    {
        ChangeSelection(t);
        realselect = true;
    }

    var tpc = t.parentNode.getAttribute("tpc");
    if (tpc == null)
        tpc = t.parentNode.parentNode.getAttribute("tpc");
    if (realselect && TreeItemSelected)
        TreeItemSelected(tpc, treeViewMode);
    if (callback) {
        var n = null;
        try {
            n = f.parentNode.childNodes[f.parentNode.childNodes.length - 1].childNodes[0];
        }
        catch (e) { };
        _childNode_Loaded(n);
    }
}

function GetTableItemForThis(_item) {
    var _tItem = _item.parentNode;
    if (_tItem == null)
        return null;
    while (_tItem.tagName != "TABLE") {
        _tItem = _tItem.parentNode;
        if (_tItem == null)
            return null;
    }
    return _tItem;
}

function ShowTreeItem(guid) {
    var mdActual = getModeDesc(false);
    var mdSource = getModeDesc(true);
    var _item = GetTreeItemOfItemDesc(guid);
    if (_item == null) {
        while (_item == null) {
            var Item = null;
            Item = mdSource.filteredGuids[guid];
            if (Item == null)
                Item = modeDescF.filteredGuids[guid];
            if (Item == null)
                Item = modeDescH.filteredGuids[guid];
            if (Item == null)
                return false;
            guid = Item.parentguid;
            if (guid == null)
                return false;
            _item = GetTreeItemOfItemDesc(guid);
        }
        treeControl.LoadScript(guid, guid + "_" + mdActual.modeLetter);
    }
    return true;
}

function OpenItem(_tItem) {
    if (_tItem.className == "treeControlChildrenH") {
        var f = _tItem.parentNode.firstChild.firstChild;
        f.src = "../img/empty.gif";
        var fscr = f.getAttribute("srcroot") + "o.gif";
        f.className = GetClassNameFromFile(fscr);
        f = f.nextSibling;
        f = f.nextSibling;
        f.src = "../img/empty.gif";
        f.className = GetClassNameFromFile("../img/module_o.gif");
        _tItem.className = "treeControlChildrenV";
    }
}

function ChangeTreeView() {
    var retvalue = false;
    var dA = document.getElementById("treeControlHostForAll");
    var dS = document.getElementById("treeControlHostForFiltered");
    var dSf = document.getElementById("flatControlHostForFiltered");
    var dH = document.getElementById("treeControlHostForHemi");
    var dHf = document.getElementById("flatControlHostForHemi");
    var dFH = document.getElementById("treeControlHostForFilteredHemi");
    var dFHf = document.getElementById("flatControlHostForFilteredHemi");

    if (treeViewMode == "FILTERED") {
        modeDescF.flatMode = !modeDescF.flatMode;
        retvalue = modeDescF.flatMode;
        dS.style.display = (modeDescF.flatMode ? "none" : "block");
        dSf.style.display = (modeDescF.flatMode ? "block" : "none");
    }
    else if (treeViewMode == "HEMI") {
        modeDescH.flatMode = !modeDescH.flatMode;
        retvalue = modeDescH.flatMode;
        dH.style.display = (modeDescH.flatMode ? "none" : "block");
        dHf.style.display = (modeDescH.flatMode ? "block" : "none");
    }
    else	// FILTEREDHEMI
    {
        modeDescFH.flatMode = !modeDescFH.flatMode;
        retvalue = modeDescFH.flatMode;
        dFH.style.display = (modeDescFH.flatMode ? "none" : "block");
        dFHf.style.display = (modeDescFH.flatMode ? "block" : "none");
    }
    ChangeTreeView_CallBack();
    return retvalue;
}

var directMode = false;

function _rec_SearchAInFlat(obj, tpc) {
    if (obj.nodeName == "IMG") {
        var attr = obj.getAttribute("tpc");
        if (attr == tpc) {
            return obj;
        }
    }
    for (var i = 0; i < obj.childNodes.length; i++) {
        var r = _rec_SearchAInFlat(obj.childNodes[i], tpc);
        if (r != null)
            return r;
    }
    return null;
}

function _rec_GetFirstObjInFlat(obj) {
    if (obj.nodeName == "IMG") {
        return obj;
    }
    for (var i = 0; i < obj.childNodes.length; i++) {
        var r = _rec_GetFirstObjInFlat(obj.childNodes[i]);
        if (r != null)
            return r;
    }
    return null;
}

function SetFlatSelection() {
    var mdActual = getModeDesc(false);
    var obj = _rec_SearchAInFlat(mdActual.flatControl.host, _lastSelectedGlobal);
    if (obj == null)
        obj = _rec_GetFirstObjInFlat(mdActual.flatControl.host);
    if (obj != null) {
        mdActual.flatControl.OnClickHandler(null, obj);
        return;
    }
    if (TreeItemSelected)
        TreeItemSelected(null, null);
}

function ChangeTreeView_CallBack() {
    var mdActual = getModeDesc(false);
    var mdSource = getModeDesc(true);
    var _item = null;
    if (mdActual.flatMode == true) {
        SetFlatSelection();
        return true;
    }
    if (mdActual.flatMode == false || treeViewMode == "ALL") {
        var guid = null;
        //	    if (treeViewMode=="ALL")
        //	    {
        //	        guid=_lastSelectedItem.guid;
        //	    }
        //	    else
        //	    {
        //		    guid=mdSource.lastSelectedFlat.getAttribute("tpc");
        //		}
        guid = _lastSelectedGlobal;
        _item = GetTreeItemOfItemDesc(guid);
        if (_item == null) {
            if (!IsFiltered(guid, treeViewMode)) {
                return false;
            }
            directMode = true;
            return ShowTreeItem(guid);
        }
        if (_item != null) {
            var _tItem = GetTableItemForThis(_item);
            while (_tItem != null) {
                OpenItem(_tItem);
                _tItem = GetTableItemForThis(_tItem);
            }
        }
    }
    directMode = false;
    createTreeControl(null, mdActual.flatMode, _item, null, null);
    return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FLAT VIEW
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function FlatControl(hostname) {
    this.host = document.getElementById(hostname);
    this.document = (this.host.document ? this.host.document : this.host.ownerDocument);
}

function showOnFlat(desc) {
    var k = parseInt(desc.guid.split("_")[1]);
    if (desc.isroot == true && k == 1)
        return false;
    if (rolefilter_enabled == false)
        return true;
    var ret = false;
    if (typeof (filteredGuidsR[desc.guid]) != "undefined") {
        ret = filteredGuidsR[desc.guid].found;
    }
    return ret;
}

function isInOutline(mydesc, guid) {
    if (mydesc.filteredGuids.length == 0)
        return true;
    var p = mydesc.filteredGuids[guid].parentguid;
    if (p == null)
        return false;
    var a = p.split("_");
    if (a[1] == "1")
        return true;
    else
        return isInOutline(mydesc, p);
}

function getModeDesc(source) {
    if (source == null)
        source = false;
    var mode = (source == true ? _lastSelectedGlobalMode : treeViewMode);
    if (mode == "ALL") {
        return modeDescA;
    }
    else if (mode == "FILTERED") {
        return modeDescF;
    }
    else if (mode == "HEMI") {
        return modeDescH;
    }
    else if (mode == "FILTEREDHEMI") {
        modeDescFH.guidsForFlat = new Array();
        for (var i = 0; i < modeDescF.guidsForFlat.length; i++) {
            var guidF = modeDescF.guidsForFlat[i];
            for (var j = 0; j < modeDescH.guidsForFlat.length; j++) {
                var guidH = modeDescH.guidsForFlat[j];
                if (guidF.guid == guidH.guid) {
                    modeDescFH.guidsForFlat[modeDescFH.guidsForFlat.length] = guidF;
                }
            }
        }
        modeDescFH.filteredGuids = new Array();
        modeDescFH.filteredGuidList = new Array();
        for (var i = 0; i < modeDescF.filteredGuidList.length; i++) {
            guidF = modeDescF.filteredGuidList[i]
            for (var j = 0; j < modeDescH.filteredGuidList.length; j++) {
                guidH = modeDescH.filteredGuidList[j];
                if (guidF.guid == guidH.guid) {
                    if (modeDescFH.filteredGuids[guidF] == undefined)
                        modeDescFH.filteredGuids[guidF] = new Object();
                    modeDescFH.filteredGuids[guidF].guid = guidF;
                    modeDescFH.filteredGuids[guidF].context = modeDescH.filteredGuids[guidH].context;
                    modeDescFH.filteredGuidList.push(guidF);
                }
            }
        }
        return modeDescFH;
    }
    return null;
}

function saveModeDesc(md) {
    if (treeViewMode == "ALL") {
        modeDescA = md;
    }
    else if (treeViewMode == "FILTERED") {
        modeDescF = md;
    }
    else if (treeViewMode == "HEMI") {
        modeDescH = md;
    }
    else if (treeViewMode == "FILTEREDHEMI") {
        modeDescFH = md;
    }
}

FlatControl.prototype.Load = function () {
    var myDesc = getModeDesc(false);
    this.host.innerHTML = "";

    var div = this.host.appendChild(this.document.createElement("div"));
    div.className = "treeControlNode";
    div.onclick = this.OnClick;
    div.ondblclick = this.OnDoubleClick;
    div.onmouseup = this.OnMouseUp;
    var table = div.appendChild(this.document.createElement("table"));
    table.cellSpacing = 0;
    var first = true;
    var showCt = 0;
    var z = [];
    UserPrefs.LoadCookie();
    var SHOWDEBUG = (Debug.EnableShowDiagnostics == true && UserPrefs.EnableShowDiagnostics == true) || Debug.is_ta_debug;
    //Debug.is_ta_debug is a hidden way to get the test data, when no access to the config.js
    for (var i = 0; i < myDesc.guidsForFlat.length; i++) {
        var itemdesc = myDesc.guidsForFlat[i];
        if (showOnFlat(itemdesc) && isInOutline(myDesc, itemdesc.guid)) {
            showCt++;
            if (showCt > TreeConfig.SearchResultLimit)
                continue;
            myDesc.actualFlatCounter = showCt;
            var tr = table.appendChild(this.document.createElement("tbody"));
            tr = tr.appendChild(this.document.createElement("tr"));
            var td = tr.appendChild(this.document.createElement("td"));
            var img = td.appendChild(this.document.createElement("img"));
            var esrc = (itemdesc.type == "Topic" ? "../img/topic.gif" : (itemdesc.empty ? "../img/emptysection.gif" : "../img/module_c.gif"));
            img.className = GetClassNameFromFile(esrc);
            img.src = "../img/empty.gif";
            img.setAttribute("tpc", itemdesc.guid);
            td = tr.appendChild(this.document.createElement("td"));
            td.className = "treeControlNode flatControl";
            var a = td.appendChild(this.document.createElement("a"));
            if (first == true) {
                myDesc.lastSelectedFlat = a;
                saveModeDesc(myDesc);
            }
            a.className = (first == true ? "tselected" : "");
            if (first == true && _lastChangeIsFilterOnly == false) {
                SetLastSelected(itemdesc.guid, treeViewMode, false);
            }
            first = false;
            a.style.cursor = "pointer";
            a.setAttribute("tpc", itemdesc.guid);
            a.onmouseover = this.OnOverItem;
            a.onmouseout = this.OnOutItem;
            var str = itemdesc.title;
            if (SHOWDEBUG && treeViewMode == "HEMI") {
                var q = CreateItemStr(itemdesc);
                z.push(q);
                str += ' [';
                for (var k = 0; k < q['info'].length; k++) {
                    str += '{a:' + q['info'][k].a + ' c:' + q['info'][k].c + ' w:' + parseInt(q['info'][k].w * 100) + '} ';
                }
                str += ' {' + q['o'] + '}]';
            }
            a.appendChild(this.document.createTextNode(str));
        }
    }

    if (SHOWDEBUG) {
        XdTransfer.PostMessage(window.parent, 'oraupk-debuginfo_outlinedata', { 'data': z });
    }

    if (myDesc.flatMode == true) {
        SetFlatSelection();
    }
    var tpc = null;
    try {
        tpc = myDesc.lastSelectedFlat.getAttribute("tpc");
    }
    catch (e) { };
    if (TreeItemSelected)
        TreeItemSelected(tpc, treeViewMode);

    function CreateItemStr(itemdesc) {
        var q = { 'o': itemdesc.guid, 'info': [], 't': itemdesc.title };
        var g = itemdesc.guid.split("_")[0];
        var d = modeDescA.foundItemMap[g];
        if (d != null) {
            for (var i = 0; i < d.cindexes.length; i++) {
                var z = {};
                z['a'] = d.cindexes[i].cindex;
                z['c'] = d.cindexes[i].cindex - d.cindexes[i].nullindex;
                z['w'] = d.cindexes[i].score;
                q['info'].push(z);
            }
        }
        return q;
    }
}

FlatControl.prototype.OnOverItem = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    if (target.className == "tselected")
        return;
    target.className = "thover";
}

FlatControl.prototype.OnOutItem = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    if (target.className == "tselected")
        return;
    target.className = "";
}

FlatControl.prototype.OnMouseUp = function (event) {
    try {
        if (event.target.nodeName == "A") {
            event.target.focus();
        }
    }
    catch (e) { };
}

FlatControl.prototype.OnClick = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    var mdActual = getModeDesc(false);
    mdActual.flatControl.OnClickHandler(event, target);
}

FlatControl.prototype.OnDoubleClick = function (event) {
    if (!event)
        event = window.event;
    var target = event.target;
    if (!target)
        target = event.srcElement;
    var mdActual = getModeDesc(false);
    mdActual.flatControl.OnClickHandler(event, target);
    if (TreeItemDoubleSelected)
        TreeItemDoubleSelected();
}

FlatControl.prototype.OnClickHandler = function (event, target) {
    var a = target;
    var t = GetTpcAttribute(a);
    if (t != null)
        SetLastSelected(t, treeViewMode, false);
    if (target.tagName != "A" && target.tagName != "IMG")
        return;
    if (target.tagName != "A") {
        var tr = target.parentNode.parentNode;
        for (var i = 0; i < tr.childNodes.length; i++) {
            var k = tr.childNodes[i].childNodes[0];
            if (k.tagName == "A") {
                a = k;
                continue;
            }
        }
    }
    if (treeViewMode == "FILTERED") {
        modeDescF.lastSelectedFlat.className = "";
    }
    else if (treeViewMode == "HEMI") {
        modeDescH.lastSelectedFlat.className = "";
    }
    else	// FILTEREDHEMI
    {
        modeDescFH.lastSelectedFlat.className = "";
    }
    a.className = "tselected";
    if (treeViewMode == "FILTERED") {
        modeDescF.lastSelectedFlat = a;
    }
    else if (treeViewMode == "HEMI") {
        modeDescH.lastSelectedFlat = a;
    }
    else	// FILTEREDHEMI
    {
        modeDescFH.lastSelectedFlat = a;
    }
    var tpc = a.getAttribute("tpc");
    if (TreeItemSelected)
        TreeItemSelected(tpc, treeViewMode);
}

function GetActualFlatView() {
    var md = getModeDesc(false);
    return md.flatMode;
}

function GetActualFlatItemCounter() {
    var md = getModeDesc(false);
    return md.actualFlatCounter;
}

function IsActualViewEmpty() {
    var md = getModeDesc(false);
    if (md.filteredGuidList.length == 0)
        return true;
    if (md.flatMode == true && $("#chroles").prop("checked") == true) {
        for (var i = 0; i < md.guidsForFlat.length; i++) {
            var g = md.guidsForFlat[i].guid;
            var ret = false;
            if (typeof (filteredGuidsR[g]) != "undefined") {
                ret = filteredGuidsR[g].found;
            }
            if (ret == true)
                return false;
        }
        return true;
    }
    return false;
}

//////////////////////////////////////////////////////////////////////////////////////////

function getActualIndex_Flat() {
    var md = getModeDesc(false);
    if (md.flatMode == true) {
        for (var i = 0; i < md.flatControl.host.firstChild.firstChild.childNodes.length; i++) {
            if (md.flatControl.host.firstChild.firstChild.childNodes[i].firstChild.childNodes[1].firstChild.className == "tselected") {
                return i;
            }
        }
    }
    return -1;
}

function getActualIndex_Tree(ls, md) {
    for (var i = 0; i < ls.length; i++) {
        if (ls[i].firstChild.childNodes[3].firstChild.className == "tselected") {
            return i;
        }
    }
    if (md.lastSelected != null) {
        var _tpc = md.lastSelected.parentNode.parentNode.getAttribute("tpc");
        for (var i = 0; i < ls.length; i++) {
            if (ls[i].firstChild.getAttribute("tpc") == _tpc)
                return i;
        }
    }
    return -1;
}

function getTargetForIndex_Flat(md, i) {
    return md.flatControl.host.firstChild.firstChild.childNodes[i].firstChild.firstChild.firstChild;
}

var ls;

function getTargetForIndex_Tree(i) {
    return ls[i].firstChild.childNodes[3].firstChild;
}

function getActualImageObj_Tree(md) {
    return md.lastSelected.parentNode.parentNode.firstChild;
}

function getSpecifiedImageObj_Tree(ls, k) {
    return ls[k].firstChild.firstChild;
}

function getOwnerOfSelection() {
    var md = getModeDesc(false);
    var myid = md.lastSelected.parentNode.parentNode.parentNode.childNodes[0].getAttribute("tpc");
    var owner = md.filteredGuids[myid].parentguid;
    return owner;
}

function getOpenedStatus(obj) {
    /*
    s = obj.getAttribute("src");
    k = s.indexOf(".gif");
    c = s.substr(k - 1, 1);
    */
    var s = obj.className;
    var c = s.substr(s.length - 1, 1);
    return (c == "o");
}

function getFilteredStatus(guid) {
    var r = IsFiltered(guid, "ALL");
    return !r;
}

function _getLinearStructure_Recursive(o, a) {
    a[a.length] = o;
    var _imgObj = o.firstChild.firstChild;
    if (getOpenedStatus(_imgObj) == true) {
        for (var i = 0; i < o.childNodes[1].firstChild.firstChild.childNodes[1].childNodes.length; i++) {
            _getLinearStructure_Recursive(o.childNodes[1].firstChild.firstChild.childNodes[1].childNodes[i], a);
        }
    }
}

function getRoot(o) {
    if (o.tagName == "DIV" && o.id.substr(0, 15) == "treeControlHost")
        return o.firstChild;
    return getRoot(o.parentNode);
}

function getLinearStructure_Tree(md) {
    var oArray = new Array();
    var root = getRoot(md.lastSelected);
    //    root = treeControl.host.firstChild;
    for (var i = 0; i < root.childNodes.length; i++) {
        _getLinearStructure_Recursive(root.childNodes[i], oArray);
    }
    return oArray;
}

function EventKeyDown(event) {
    if (event == null)
        event = window.event;
    var code = event.which ? event.which : event.keyCode;
    if (code == 13) {
        if (TreeItemDoubleSelected && _inputHasFocus != true)
            TreeItemDoubleSelected();
        return;
    }
    var md = getModeDesc(false);
    if (md.flatMode == true) {
        var index = getActualIndex_Flat();
        if (code == 38) {  // up
            if (index > 0) {
                var t = getTargetForIndex_Flat(md, index - 1);
                md.flatControl.OnClickHandler(null, t);
            }
        }
        else if (code == 40) {  // down
            if (index < md.actualFlatCounter - 1) {
                t = getTargetForIndex_Flat(md, index + 1);
                md.flatControl.OnClickHandler(null, t);
            }
        }
    }
    else {
        var imgObj = getActualImageObj_Tree(md);
        var _isOpenable = (imgObj.openable ? imgObj.openable : imgObj.getAttribute("openable"));
        var _isOpened = getOpenedStatus(imgObj);
        ls = getLinearStructure_Tree(md);
        index = getActualIndex_Tree(ls, md);
        if (code == 37) {  // left
            if (_isOpenable == true) {
                if (_isOpened == true) {
                    treeControl.OnClickHandler(null, imgObj);
                    return false;
                }
            }
        }
        else if (code == 38) {  // up
            if (index > 0) {
                t = getTargetForIndex_Tree(index - 1);
                treeControl.OnClickHandler(null, t);
            }
        }
        else if (code == 39) {  // right
            if (_isOpenable == true) {
                if (_isOpened == false) {
                    treeControl.OnClickHandler(null, imgObj);
                    return false;
                }
            }
        }
        else if (code == 40) {  // down
            if (index < ls.length - 1) {
                t = getTargetForIndex_Tree(index + 1);
                treeControl.OnClickHandler(null, t);
            }
        }
    }
}

function tree_SetFocus() {
    document.frames[0].document.childNodes[1].childNodes[1].focus();
}

function tree_Init() {
    document.onkeydown = EventKeyDown;
    if (Init_treeloaded)
        Init_treeloaded();
}

function clearTextSelection() {
    if (document.selection)
        document.selection.empty();
    if (window.getSelection)
        window.getSelection().removeAllRanges();
}

function GoToNext() {
    var md = getModeDesc(false);
    if (md.flatMode == true) {
        var index = getActualIndex_Flat();
        if (index < md.actualFlatCounter - 1) {
            var t = getTargetForIndex_Flat(md, index + 1);
            md.flatControl.OnClickHandler(null, t);
        }
    }
    else {
        var imgObj = getActualImageObj_Tree(md);
        var _isOpenable = (imgObj.openable ? imgObj.openable : imgObj.getAttribute("openable"));
        var _isOpened = getOpenedStatus(imgObj);
        ls = getLinearStructure_Tree(md);
        index = getActualIndex_Tree(ls, md);
        if (index < ls.length - 1) {
            t = getTargetForIndex_Tree(index + 1);
            treeControl.OnClickHandler(null, t);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function TreeNavigator() {
    this.GoForward = function () {
        Navigation_Down();
    }
    this.GoBack = function () {
        Navigation_Up();
    }
    this.isForwardEnabled = function () {
        return !isLastItem();
    }
    this.isBackEnabled = function () {
        return !isFirstItem();
    }
}
var treeNavigator = new TreeNavigator();

var _go_next = false;
var _go_prev = false;
var _go_closed = false;

function Navigation_Up() {
    var md = getModeDesc(false);
    if (md.flatMode == false) {
        ls = getLinearStructure_Tree(md);
        var index = getActualIndex_Tree(ls, md);
        var prevImgObj = getSpecifiedImageObj_Tree(ls, index - 1);
        var _isOpenable = Bool(prevImgObj.openable != undefined ? prevImgObj.openable : prevImgObj.getAttribute("openable"));
        var _isOpened = getOpenedStatus(prevImgObj);
        if (_isOpenable && !_isOpened) {
            _go_prev = true;
            treeControl.OnClickHandler(null, prevImgObj);
            return;
        }
    }

    var e = { keyCode: 38 };
    EventKeyDown(e);
}

function Navigation_Down() {
    var md = getModeDesc(false);
    if (md.flatMode == false) {
        var imgObj = getActualImageObj_Tree(md);
        var _isOpenable = Bool(imgObj.openable != undefined ? imgObj.openable : imgObj.getAttribute("openable"));
        var _isOpened = getOpenedStatus(imgObj);
        if (_isOpenable && !_isOpened) {
            _go_next = true;
            var e = { keyCode: 39 };
            EventKeyDown(e);
            return;
        }
    }
    var e = new Object();
    e.keyCode = 40;
    EventKeyDown(e);
}

function isFirstItem() {
    var md = getModeDesc(false);
    if (md.flatMode == true) {
        var index = getActualIndex_Flat();
    }
    else {
        if (md.lastSelected == null)
            return true;
        ls = getLinearStructure_Tree(md);
        index = getActualIndex_Tree(ls, md);
    }
    return (index == 0);
}

function isLastItem() {
    var md = getModeDesc(false);
    if (md.flatMode == true) {
        var index = getActualIndex_Flat();
        return (index == md.filteredTopicCount - 1);
    }
    else {
        if (md.lastSelected == null)
            return false;
        ls = getLinearStructure_Tree(md);
        index = getActualIndex_Tree(ls, md);
        if (index == ls.length - 1) {
            var imgObj = getActualImageObj_Tree(md);
            var _isOpenable = imgObj.openable;
            return (_isOpenable == false);
        }
        return false;
    }
}

function _childNode_Loaded(node) {
    if (_go_next == true) {
        _go_next = false;
        Navigation_Down();
    }
    if (_go_prev == true) {
        var md = getModeDesc(false);
        if (md.flatMode == false) {
            ls = getLinearStructure_Tree(md);
            var index = getActualIndex_Tree(ls, md);
            var prevImgObj = getSpecifiedImageObj_Tree(ls, index - 1);
            var _isOpenable = Bool(prevImgObj.openable != undefined ? prevImgObj.openable : prevImgObj.getAttribute("openable"));
            var _isOpened = getOpenedStatus(prevImgObj);
            if (_isOpenable && !_isOpened) {
                _go_prev = true;
                treeControl.OnClickHandler(null, prevImgObj);
                return;
            }
            else {
                _go_prev = false;
                Navigation_Up();
            }
        }
    }
    if (_go_closed == true) {
        _go_closed = false;
        md = getModeDesc(false);
        if (md.flatMode == false) {
            ls = getLinearStructure_Tree(md);
            index = getActualIndex_Tree(ls, md);
            if (index == -1) {
                treeControl.OnClickHandler(null, node);
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

var indexMap = new Array();
var treeIndex = new Array();

function AddToIndexMap(s) {
    if (bigsco == false)
        return;
    if (s.length <= 36)
        return;
    var guid = s.substr(0, 36);
    var index = s.substr(37);
    indexMap[index] = guid;
}

var _tocStates2 = null;
var _tocStates_initialized = false;

function InitTocStates() {
    if (_tocStates_initialized)
        return;
    _tocStates_initialized = true;
    if (bigsco == false)
        return;

    for (var i = 0; i < parentIndex.length; i++) {
        treeIndex[i] = new Array();
        treeIndex[i][0] = parentIndex[i];
    }
    for (var i = 0; i < parentIndex.length; i++) {
        var v = parentIndex[i];
        treeIndex[v][treeIndex[v].length] = i;
    }

    _tocStates2 = new Array();
    for (var i = 0; i < lms_TOCState.NodeCounter; i++) {
        _tocStates2[i] = lms_GetItemStatus(i);
    }
    InitOneItemState(childIndexLocal2Global(0));
    var a = lms_GetItemStatus(0);
    var b = _tocStates2[0];
    if (a != b) {
        lms_SetItemStatus(0, b);
    }
    updateTreeTrace()
}

// global index parameter
function InitOneItemState(k) {
    var ch = index_getChildList(k, false);
    for (var i = 0; i < ch.length; i++) {
        InitOneItemState(ch[i]);
    }
    var x = childIndexGlobal2Local(k);
    if (k != 0)
        _tocStates2[k] = BuildItemStatus(k);
}

function GetItemStatus(guid) {
    var g_index = guid.substr(37);
    var l_index = childIndexGlobal2Local(g_index);
    var s = BuildItemStatus(g_index);
    _tocStates2[l_index] = s;
    return s;
}

function _GetItemStatusFile(status) {
    var base = "";
    switch (status) {
        case "N": return base + "sco_notstarted";
        case "I": return base + "sco_incomplete";
        case "C": return base + "sco_completed";
        case "P": return base + "sco_passed";
        case "F": return base + "sco_failed";
    }
    return "";
}

function _GetItemStatusTitle(status) {
    switch (status) {
        case "N": return R_status_tree_notstarted;
        case "I": return R_status_tree_inprogress;
        case "C": return R_status_tree_complete;
        case "P": return R_status_tree_passed;
        case "F": return R_status_tree_failed;
    }
    return "";
}

// local index parameter
function UpdateItemStatus(index) {
    _tocStates2[index] = lms_GetItemStatus(index);
    var i = childIndexLocal2Global(index);
    var guid = indexMap[i] + "_" + i;
    RefreshItemStatus(guid);
    BuildRootItemStatus();
    updateTreeTrace();
}

function RefreshItemStatus(guid) {
    if (bigsco == false)
        return;
    var md = getModeDesc(guid);

    var item = md.filteredGuids[guid];
    if (item == null)
        return;

    var stat = GetItemStatus(guid);
    item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("src", "../img/empty.gif");
    var _itemState = _GetItemStatusFile(stat);
    item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("class", _itemState); // for FF, Chrome, Safari
    item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("className", _itemState); // for IE
    item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("title", _GetItemStatusTitle(stat));
    item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("alt", _GetItemStatusTitle(stat));

    if (item.parentguid == null)
        return;
    RefreshParentItemStatus(item.parentguid);
}

function RefreshParentItemStatus(guid) {
    var g_index = guid.substr(37);
    var l_index = childIndexGlobal2Local(g_index);
    var st0 = _tocStates2[l_index];
    var st1 = BuildItemStatus(g_index);
    if (l_index == 0) {
        if (st1 == "N") {
            return;
        }
    }
    if (st1 != st0) {
        //        parent.lms_SetItemStatus(l_index, st1);
        _tocStates2[l_index] = st1;
        if (l_index == 0) {
            lms_SetItemStatus(0, st1);
        }
        updateTreeTrace();
        var md = getModeDesc(guid);
        var item = md.filteredGuids[guid];
        if (item == null)
            return;
        item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("src", "../img/empty.gif");
        var _itemState = _GetItemStatusFile(st1);
        item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("class", _itemState); // for FF, Chrome, Safari
        item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("className", _itemState); // for IE
        item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("title", _GetItemStatusTitle(st1));
        item.treeitemdiv.parentNode.parentNode.childNodes[1].setAttribute("alt", _GetItemStatusTitle(st1));
        if (item.parentguid != null)
            RefreshParentItemStatus(item.parentguid);
    }
}

function getBaseIndex() {
    return parseInt(_rootData.substr(37));
}

function childIndexLocal2Global(x) {
    return (parseInt(x) + getBaseIndex());
}

function childIndexGlobal2Local(x) {
    return (x - getBaseIndex());
}

function index_getParent(x) {
    if (!index_checkIndex(x))
        return -1;
    return treeIndex[x][0];
}

function index_getChildList(x, f) {
    if (!index_checkIndex(x))
        return [];
    var a0 = treeIndex[x];
    var a = new Array();
    for (var i = 1; i < a0.length; i++) {
        if (!f)
            a[i - 1] = a0[i];
        else if (f != a0[i])
            a[i - 1] = a0[i];
    }
    return a;
}

function index_hasChildren(x) {
    if (!index_checkIndex(x))
        return -1;
    var a0 = treeIndex[x];
    return (a0.length > 1);
}

function index_checkIndex(x) {
    if (x > treeIndex.length - 1)
        return false;
    return (treeIndex[x].length > 0);
}

// global index parameter
function BuildItemStatus(x) {
    var l_x = childIndexGlobal2Local(x);
    var s = BuildItemStatus2(x, l_x);
    return s;
}

function BuidStatus(s, haschild) {
    if (s.indexOf("I") >= 0)
        return "I";
    if (s.indexOf("N") >= 0) {
        if (s.indexOf("C") >= 0 || s.indexOf("F") >= 0 || s.indexOf("P") >= 0)
            return "I";
        else
            return "N";
    }
    if (s.indexOf("F") >= 0) {
        if (haschild == false)
            return "F";
        else
            return "C";
    }
    if (s.indexOf("P") >= 0) {
        if (haschild == false)
            return "P";
        else
            return "C";
    }
    return "C";
}

function BuildItemStatus2(x, l_x) {
    var ch = index_getChildList(x, false);
    var s = "";
    if (l_x != 0) {
        if (conceptIndex[x] > 0)
            s += lms_GetItemStatus(l_x);
    }
    for (var i = 0; i < ch.length; i++) {
        s += _tocStates2[childIndexGlobal2Local(ch[i])];
    }
    var _stat = BuidStatus(s, ch.length > 0);
    return _stat;
}

function BuildRootItemStatus() {
    var x = childIndexLocal2Global(0);
    var ch = index_getChildList(x, false);
    var s = "";
    for (var i = 0; i < ch.length; i++) {
        s += _tocStates2[childIndexGlobal2Local(ch[i])];
    }
    var _stat = BuidStatus(s, ch.length > 0);
    _tocStates2[0] = _stat;
}

/************************************************************************************/

var treeTraceOn = false;
var treeTraceWnd = null;

function updateTreeTrace() {
    try {
        if (!treeTraceOn)
            return;
        if (treeTraceWnd == null)
            treeTraceWnd = window.open();
        treeTraceWnd.document.body.innerHTML = "";
        for (var i = 0; i < _tocStates2.length; i++) {
            treeTraceWnd.document.write(" " + i + ": " + _tocStates2[i] + " - " + lms_GetItemStatus(i) + "<br/>");
        }
    }
    catch (e) { };
}

/*
return {
tree_Init: tree_Init
};

})();
*/

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

/* tascriptsintoc.js */
var XdTransfer=function(){function $(a){if(a==null)return a===void 0?"undefined":"null";var b=typeof a;if(typeof a=="object"&&a.join!=void 0&&a.push!=void 0&&a.length!=void 0)return"object Array";if(b!="object"||a.constructor==null||a.constructor.toString==null)return b;a=/function\s+([^\(]*)\(/.exec(a.constructor.toString());return b+(a&&a.length>1&&a[1].length>0?" "+a[1]:"")}function aa(a){return typeof a=="function"||a!=null&&a.constructor===Function}function I(a){return a!=null&&typeof a=="object"&&
a.constructor!==String&&a.constructor!==Number&&a.constructor!==Boolean&&a.constructor!==Array&&a.constructor!==Date}function ba(){function a(f){f=f.toString(16);switch(f.length){case 1:return"\\u000"+f;case 2:return"\\u00"+f;case 3:return"\\u0"+f;case 4:return"\\u"+f}return"?"}function b(f){return'"'+String(f).replace(/(["\\])/g,"\\$1").replace(/([\x00-\x1F])/g,function(l){l=l.charCodeAt(0);var n=p.charAt(l);return n=="?"?a(l):"\\"+n})+'"'}function c(f){return f<10?"0"+f:f}function d(f,l){var n=
typeof f;if(n!="object"){if(n=="string")return b(f);if(n=="number")return isFinite(f)?String(f):"null";if(n=="boolean")return f?"true":"false"}else{if(f===null)return"null";if(f.constructor===String)return b(f);if(f.constructor===Number)return isFinite(f)?String(f):"null";if(f.constructor===Boolean)return f?"true":"false";if(f.constructor===Date)return"".concat(f.getUTCFullYear(),"-",c(f.getUTCMonth()),"-",c(f.getUTCDate()),"T",c(f.getUTCHours()),":",c(f.getUTCMinutes()),":",c(f.getUTCSeconds()),
"Z");if(f.constructor!==Function){if(j(l,f))throw h;n=[];l.push(f);if(f.constructor===Array){for(var t=0,v=f.length;t<v;++t){var G=f[t];G==null||k(G)?n.push("null"):n.push(d(G,l,String(t)))}l.pop();return"["+n.join()+"]"}for(t in f){v=f[t];if(v==null||k(v))v===null&&n.push(b(t)+":null");else if((v=d(v,l,t))!=null)n.push(b(t)+":"+v)}l.pop();return"{"+n.join()+"}"}}}var e=/[^",:\{\}\[\] \t\r\n]|"""|"[ \t\r\n]+"]|[\}\]][ \t\r\n]*[:\{\[]|[\{\[][ \t\r\n]*[,:]|[,:][ \t\r\n]*[,:\}\]]/,g=/"(?:[^"\\\x00-\x1F]|\\["\\\/bnfrt]|\\u[0-9a-fA-F]{4})*"|null|true|false|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+\-]?[0-9]+)?/g,
h=Error(""),k=aa,j;(function(){try{if(typeof[].indexOf=="function"&&[1,2,3,4].indexOf(3)==2){j=function(l,n){return l.indexOf(n)!=-1};return}}catch(f){}j=function(l,n){for(var t=0,v=l.length;t<v;++t)if(l[t]===n)return true;return false}})();var p="????????btn?fr??????????????????";A.EncodeObject=function(f){if(f==null||k(f)){if(f===null)return"null"}else try{return d(f,[],"")}catch(l){if(l!==h)throw l;}};A.DecodeObject=function(f){try{if(f!=null&&!e.test(f.replace(g,'""')))return eval("("+f+")")}catch(l){}}}
function U(a,b,c){try{if(a&&c)a.addEventListener?a.addEventListener(b,c,false):a.attachEvent("on"+b,c)}catch(d){}}function w(){this.params=[];this.safemode=false}function ca(){var a=document.title;if(!a)try{if(_sco==false)a=(UIComponents.TitlePrefix==true?R_toc_title+" - ":"")+moduleName.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}catch(b){}return a}function da(a){var b=$(a),c=b;if(a!=void 0&&b!="[function]"&&b!="[object Function]"){var d;try{d=A.EncodeObject(a)}catch(e){}c+=":"+
(d==void 0?"(complex object)":d)}return c}function y(a){if(a==null)return"(null)";var b=[],c;for(c in a)b.push(c+"="+da(a[c]));return b.join(", ")}function ea(a){this.name="ApplicationError";this.message=a;this.toString=function(){return this.message}}function R(a,b){if(a!==b){if(b==null)return a===void 0?b:a;if(b.constructor===String||b.constructor===Number||b.constructor===Boolean||b.constructor===Function)return b;if(b.constructor===Date)return new Date(b.getTime());a=new b.constructor;V(a,b)}return a}
function V(a,b){for(var c in b)if(a[c]!==b[c])a[c]=R(a[c],b[c])}function W(a,b){if(a==void 0||!I(a))a={};for(var c=0,d=b.length,e;c<d;++c){e=b[c];if(I(e)&&a!==e)for(var g in e)a[g]=e[g]}return a}function fa(a){if(a!==!!a)return W(arguments[0],[].slice.call(arguments,1));if(a){var b=arguments[1],c=[].slice.call(arguments,2);if(b==void 0||!I(b))b={};for(var d=0,e=c.length,g;d<e;++d){g=c[d];I(g)&&b!==g&&V(b,g)}return b}return W(arguments[1],[].slice.call(arguments,2))}function r(a,b){this.Node=a;this.Key=
b}function m(a,b){this.url=a;var c=b||{};this.options=c;this.method=c.method?c.method.toUpperCase():"GET";this.asynchronous=!!c.asynchronous;this.contentType=c.contentType||"application/x-www-form-urlencoded";this.parameters=S.Extend({},c.parameters||{});if(c.forceGet)this.parameters._=(new Date).getTime();this.id=E.Next("AjaxRequest");this.queryParams=m.$CreateQueryString(this.parameters);if(this.method!="POST"&&this.queryParams.length>0)this.url+=(this.url.indexOf("?")>=0?"&":"?")+this.queryParams;
this.body=this.method=="POST"?this.queryParams:null;this.request=null;this.$completed=this.aborted=false;if(window.XMLHttpRequest)this.request=new XMLHttpRequest;else if(window.ActiveXObject&&!(this.request=new ActiveXObject("Msxml2.XMLHTTP")))this.request=new ActiveXObject("Microsoft.XMLHTTP");if(!this.request)throw Error("AjaxRequest, no transport");this.$DoRequest()}function T(a){return a.replace(/^\s+|\s+$/g,"")}function J(a,b,c,d,e,g,h){b||(b=a);if(b&&/~$/.test(b)){h=1;b=b.replace(/~$/,"")}this.Name=
a;this.NsName=b;this.Version=c;this.Language=d;this.RawContext=e;this.RawTags=g;this.EnableSM=h?1:0}function K(a,b,c,d,e){this.Name=a;this.Caption=b;this.UseNameAsPrefix=c;this.Searchable=d;this.MultiPart=e}function C(a,b,c,d,e,g,h,k){this.Key=a||null;this.Name=b||null;this.NsName=c||b||null;this.Version=d||null;this.Language=e||null;this.TagList=g||null;this.Parts=h||null;this.EnableSM=k||0}function X(){}function q(a,b){if(ga)try{if(window.console)window.console.log(a+(b?":"+b:""))}catch(c){}}var z=
{Unknown:-1,MicrosoftInternetExplorer:1,MozillaFirefox:2,GoogleChrome:3,Safari:4},L={Type:0,_:void 0},F={IsIE:function(){return F.IsType(z.MicrosoftInternetExplorer)},IsFirefox:function(){return F.IsType(z.MozillaFirefox)},IsChrome:function(){return F.IsType(z.GoogleChrome)},IsSafari:function(){return F.IsType(z.Safari)},IsType:function(a){return L.Type?L.Type==a:F.Detect(a)},Detect:function(a){L.Type=/MSIE|Trident\//.test(navigator.userAgent)?z.MicrosoftInternetExplorer:navigator.userAgent.indexOf("Firefox")!=
-1?z.MozillaFirefox:navigator.userAgent.indexOf("Chrome")!=-1?z.GoogleChrome:/Safari/.test(navigator.userAgent)&&/Apple Computer/.test(navigator.vendor)?z.Safari:z.Unknown;return L.Type==a},GetVersion:function(){var a=parseInt;var b=navigator.userAgent,c={},d=b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i)||[];if(/trident/i.test(d[1])){b=/\brv[ :]+(\d+(\.\d+)?)/g.exec(b)||[];c.Browser="IE";c.Version=b[1]||""}else{d=d[2]?[d[1],d[2]]:[navigator.appName,navigator.appVersion,
"-?"];if((b=b.match(/version\/([\.\d]+)/i))!=null)d[2]=b[1];c.Browser=d[0];c.Version=d[1]}return a(c.Version)}},ha={Indent:"  "},A={EncodeObject:function(a,b){try{return JSON.stringify(a,null,b?ha.Indent:null)}catch(c){if(typeof TypeError=="undefined"||!c||c.constructor!==TypeError)throw c;}},DecodeObject:function(a){if(a!=null)try{return JSON.parse(a)}catch(b){}}};(function(){if(typeof window.JSON!="undefined"&&typeof(JSON.stringify&&JSON.parse)!="undefined")try{var a={a:"",b:0.1,c:null,d:true,e:false,
f:[[{},{g:function(){return 1},h:1},new Function("return 0;"),function(){return 1},1]]},b=JSON.stringify(a);if(b=='{"a":"","b":0.1,"c":null,"d":true,"e":false,"f":[[{},{"h":1},null,null,1]]}'&&b==JSON.stringify(JSON.parse('{"a":"","b":0.1,"c":null,"d":true,"e":false,"f":[[{},{"h":1},null,null,1]]}'))&&/2345-12-23T12:34:56(?:\.789[0]*)?Z/.test(JSON.stringify(new Date(Date.UTC(2345,11,23,12,34,56,789)))))return}catch(c){}ba()})();var M={DecodeMessage:function(a){if((a=A.DecodeObject(a))&&a.length==
2&&/^oraupk-/.test(a[0]))return a},ProxyPostMessage:function(a,b){if(M.DecodeMessage(b.data))try{a&&a.postMessage(b.data,"*")}catch(c){}},MessageReceived:function(a,b){var c=M.DecodeMessage(b.data);if(c){var d=c[0];c=c[1];var e=b.source,g=b.origin;try{a(d,c,e,g)}catch(h){}}}},N={AddListener:function(a,b){function c(d){M.MessageReceived(b,d)}U(a,"message",c);return c},RemoveListener:function(a,b){try{if(a&&b)a.removeEventListener?a.removeEventListener("message",b,false):a.detachEvent("onmessage",b)}catch(c){}},
PostMessage:function(a,b,c){if(c===void 0)c=null;b=A.EncodeObject([b,c]);try{a&&a.postMessage(b,"*")}catch(d){}},SetProxy:function(a,b,c){b!==c&&U(a,"message",function(d){var e;if(d.source===b){if(a!==c)e=c}else if(d.source===c)if(a!==b)e=b;e&&M.ProxyPostMessage(e,d)})}},O=function(){function a(e,g){for(var h="",k=0;k<e.length;k++){var j=e.substr(k,1),p;if(g==0)p=j>="0"&&j<="9"||j>="a"&&j<="z"||j>="A"&&j<="Z";else{a:{p=d.length;for(var f=0;f<p;f++)if(j==d[f]){p=true;break a}p=j==c?true:false}p=!p}if(p)h+=
j;else{j=e.charCodeAt(k);j="0000"+j.toString(16).toUpperCase();h+=(g==0?"$":c)+j.substr(j.length-4)}}return h}function b(e,g){for(var h="",k=false,j=0;j<e.length;j++){var p;if(k){p=e.substr(j,4);h+=String.fromCharCode(parseInt("0x"+p));j+=3;k=false}else{p=e.substr(j,1);if(p==(g==0?"$":c))k=true;else h+=p}}return h}var c="/",d=["<",">",'"',"'","%",";","(",")","&","+"];return{SafeUriEscape:function(e){return a(e,1)},SafeUriUnEscape:function(e){return b(e,1)},MyEscape:function(e){return a(e,0)},MyUnEscape:function(e){return b(e,
0)}}}();w.prototype.Clone=function(){var a=new w;a.params=[];a.safemode=this.safemode;for(var b in this.params)if(this.params[b]!=null)a.params[b]=this.params[b];return a};w.prototype.Parse=function(){var a,b;a=document.location.hash.substring(1);a=a.split("&");if(a.length==0||a[0]==""){a=document.location.search.substring(1);a=a.split("&")}if(a.length>0)if(a[0].toLowerCase().substr(0,3)=="su="){this.safemode=true;a=a[0].substr(3);a=O.SafeUriUnEscape(a);a=a.split("&")}for(var c=0;c<a.length;c++){b=
a[c];if(b.length!=0){var d=b.split("=");if(d.length==2)this.params[d[0].toLowerCase()]=d[1];else if(d.length<2)this.params[d[0].toLowerCase()]="";else this.params[d[0].toLowerCase()]=b.substr(d[0].length+1)}}};w.prototype.GetSafeMode=function(){return this.safemode};w.prototype.SetSafeMode=function(a){this.safemode=a};w.prototype.GetParameter=function(a){return this.params[a.toLowerCase()]};w.prototype.AddParameter=function(a,b){this.params[a.toLowerCase()]=b};w.prototype.RemoveParameter=function(a){this.params[a.toLowerCase()]=
null};w.prototype.ClearParameterList=function(){this.params=null;this.params=[]};w.prototype.BuildParameterList=function(a){a="";var b=true,c;for(c in this.params){var d=this.params[c];if(d!=null){if(b==false)a+="&";b=false;a+=d.length==0?c:c+"="+this.params[c]}}if(this.safemode)a="su="+O.MyEscape(a);return a};w.prototype.GetCorrectUrl=function(a,b){if(!this.safemode)return a;var c,d=a.indexOf("#");if(d==-1)d=a.indexOf("?");if(d>=0){var e=a.substring(d+1);c=e.split("&");if(c[0].toLowerCase().substr(0,
3)=="su=")return a;return a.substring(0,d+1)+"su="+O.SafeUriEscape(e)}else return a+(b?"":"?su=")};N.AddListener(window,function(a,b){if(a=="oraupk-gatewayinfo"){if(b.debug)if(window.Debug)window.Debug.is_ta_debug=true;N.PostMessage(window.parent,"oraupk-playerinfo",{title:ca(),diagnostics:window.UserPrefs.EnableShowDiagnostics||window.Debug&&window.Debug.is_ta_debug})}});var D=function(a,b,c){throw new ea((a?a+": ":"")+("Failed: "+(b?b:"")+(b&&c?", ":"")+(c?c:"")));};D.NotImplemented=function(a){D(a,
"Not implemented.",null,2)};D.Exception=function(a,b){D(a,"Exception: "+b.message,null,2)};r.FindPath=function(a,b){if(a){for(var c=0,d=b.length;c<d;++c)if((a=a[b[c]])===void 0)return;return a}};r.FindKey=function(a,b){return b&&b.length?r.FindPath(a,b.split("/")):a};r.CreatePath=function(a,b){for(var c=0,d=b.length;c<d;++c){var e=a[b[c]];if(e===void 0){for(;c<d;){a=a[b[c]]=e={};++c}break}a=e}return a};r.CreateKey=function(a,b){return r.CreatePath(a,b.split("/"))};r.prototype={GetRoot:function(){return this.Node},
CreateKey:function(a){return new r(r.CreateKey(this.Node,a),this.GetAbsoluteKey(a))},OpenKey:function(a){var b=r.FindKey(this.Node,a);return new r(b,this.GetAbsoluteKey(a))},TryOpenKey:function(a){var b=r.FindKey(this.Node,a);return b?new r(b,this.GetAbsoluteKey(a)):null},GetValue:function(a){return this.Node[a]},TryGetValue:function(a,b){var c=this.Node[a];return c===void 0?b:c},GetValueByKey:function(a){return r.FindKey(this.Node,a)},TryGetValueByKey:function(a,b){var c=r.FindKey(this.Node,a);return c===
void 0?b:c},GetAbsoluteKey:function(a){return this.Key?this.Key+(a?"/"+a:""):a},Extend:function(a){if(this.Node==null)this.Node={};fa(true,this.Node,a)},Delete:function(a){delete this.Node[a]}};var S={FromArray:function(a,b){if(b==void 0)b=true;for(var c={},d=0,e=a.length;d<e;++d)c[a[d]]=b;return c},AddNewItem:function(a,b,c){var d=a[b]===void 0;if(d)a[b]=c;return d},Extend:function(a,b){for(var c in b)a[c]=b[c];return a},AddNewItems:function(a,b){for(var c in b)if(a[c]===void 0)a[c]=b[c]},GetKeys:function(a){var b=
[],c;for(c in a)b.push(c);return b},GetValues:function(a){var b=[],c;for(c in a)b.push(a[c]);return b},FromKeys:function(a,b){if(b==void 0)b=true;var c={},d;for(d in a)c[d]=b;return c},Equals:function(a,b){if(a==null)return b==null;else if(b==null)return false;var c=0,d;for(d in a)++c;for(d in b){--c;if(a[d]!=b[d])return false}return c==0},FindMembers:function(a,b,c){if(c==void 0)c=b.length;for(var d=0,e=b.length;d<e;++d)if(typeof a[b[d]]!="undefined")if(--c==0)return true;return false}},E={_uid:{},
Next:function(a){var b=a==void 0?"__uid__":a;b=E._uid[b]===void 0?E._uid[b]=1:++E._uid[b];return a==void 0?b:a+b},Reset:function(a){var b=a==void 0?"__uid__":a,c=E._uid[b]||0;E._uid[b]=0;return a==void 0?c:a+c}};m.PingUrl=function(a,b){var c=b||{};c.method="HEAD";c.asynchronous=false;return(new m(a,c)).Success()};m.Load=function(a,b){var c=b||{};c.asynchronous=false;return new m(a,c)};m.LoadText=function(a,b){return m.Load(a,b).GetResponseText()};m.LoadXml=function(a,b){return m.Load(a,b).GetResponseXML()};
m.LoadJson=function(a,b){var c=m.Load(a,b).GetResponseText();return A.DecodeObject(c)};m.States=["Unsent","Opened","HeadersReceived","Loading","Done"];m.Nop=function(){};m.$CreateQueryString=function(a){if(a==void 0)a={};var b=[],c;for(c in a){var d=a[c];b.push(d==void 0?c:c+"="+encodeURIComponent(String(d)))}return b.join("&")};m.prototype.$OnReadyStateChange=function(){if(!this.$completed){var a=this.request.readyState,b=m.States[a];if(a==4)this.$completed=true;try{var c=this.options["On"+b];c&&
c(this)}catch(d){this.options.OnException?this.options.OnException(this,d):D("AjaxRequest.$OnReadyStateChange",d)}if(this.$completed){this.request.onreadystatechange=function(){};try{var e=this.options["On"+(this.Success()?"Success":"Failure")];e&&e(this)}catch(g){this.options.OnException?this.options.OnException(this,g):D("AjaxRequest.$OnReadyStateChange","IE memory leak code",g)}}}};m.prototype.$DoRequest=function(){try{var a=this;this.request.onreadystatechange=function(){a.$OnReadyStateChange()};
this.request.open(this.method,this.url,this.asynchronous);this.$SetHeaders();this.request.send(this.body);this.asynchronous||a.$OnReadyStateChange()}catch(b){this.options.OnException?this.options.OnException(this,b):D("AjaxRequest.$DoRequest",b)}};m.prototype.$SetHeaders=function(){var a={Accept:"text/plain, text/javascript, text/html, text/xml, application/xml, */*"};if(this.method=="POST"){if(this.contentType)a["Content-type"]=this.contentType+"; charset=UTF-8";if(this.request.overrideMimeType&&
(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005)a.Connection="close"}if(this.options.header)for(var b in this.options.header)a[b]=this.options.header[b];for(b in a)this.request.setRequestHeader(b,a[b])};m.prototype.Abort=function(){this.$completed||this.request.abort()};m.prototype.Success=function(){var a=this.GetStatus();return!a||a>=200&&a<300};m.prototype.GetStatus=function(){try{return this.request.status||0}catch(a){return 0}};m.prototype.GetResponseHeader=function(a){try{return this.request.getResponseHeader(a)||
null}catch(b){return null}};m.prototype.GetResponseText=function(){return this.Success()?this.request.responseText:null};m.prototype.GetResponseXML=function(){return this.Success()?this.request.responseXML:null};var x={Unwrap:function(a){return a},TryCall:function(a,b){a=x.Unwrap(a);try{if(a[b])return a[b].call(a)}catch(c){}},TryCallWithArguments:function(a,b,c){a=x.Unwrap(a);try{if(a[b])return a[b].apply(a,c)}catch(d){}},TryGet:function(a,b){a=x.Unwrap(a);try{return a[b]}catch(c){}},TryAccess:function(a){try{return a&&
a.location&&a.location.href&&1}catch(b){}return 0},CloseWindow:function(a){if(F.IsIE())try{a.open("","_parent","")}catch(b){}a.close()},OpenWindow:function(a,b,c){return window.open(a,b,c)},Focus:function(a){a.focus()},GetOpener:function(a){try{if(a.opener&&x.TryAccess(a.opener))return a.opener}catch(b){}},HasParent:function(a){return a.parent!==a},SD_OpenAndFocus:function(a,b,c){function d(k){var j;try{j=a.open(k,c)}catch(p){}return j}var e=d(""),g;a:{try{if(e&&e.document.URL=="about:blank"){g=true;
break a}}catch(h){}g=false}if(g)e.location.replace(b);else{a.focus();e&&x.CloseWindow(e);e=d(b);setTimeout(function(){var k;a:{try{if(e&&e.document.URL){k=true;break a}}catch(j){}k=false}if(!k){e&&x.CloseWindow(e);d(b)}},1E3)}}};J.ToObject=function(a){return a?[a.Name,a.NsName,a.Version,a.Language,a.RawContext,a.RawTags,a.EnableSM]:null};J.FromObject=function(a){return a?new J(a[0],a[1],a[2],a[3],a[4],a[5],a[6]):null};var P={ApplicationNameFromNsName:function(a){if(!a)return a;a=a.replace(/~$/,"");
var b=a.indexOf(".");return b!=-1?a.substr(0,b):a},CreateInfo:function(a,b,c){for(var d=a==null?[""]:a.split(";");d.length<3;)d.push(null);a=T(d[0]).toUpperCase();var e=/~$/.test(a);if(e)a=a.replace(/~$/,"");var g=P.ApplicationNameFromNsName(a);d.shift();var h=d[0]?T(d[0]):null;if(!h||/^[0-9@]/.test(h))d.shift();else h=null;d=d[0]?T(d[0]).replace("_","-").toLowerCase():null;return new J(g,a,h,d,b||null,c||null,e)}},H={ApplicationNameFromNsName:function(a){return P.ApplicationNameFromNsName(a)},ApplicationInfoFromParams:function(a){var b=
a.namespace,c=a.context;a=a.tags;return b||c||a?P.CreateInfo(b,c,a):null},TokensFromWindow:function(a){var b=null,c=null,d=null;try{var e=!!x.TryGet(a,"UPK_GetNamespace"),g=!!x.TryGet(a,"UPK_GetTags"),h=!!x.TryGet(a,"UPK_GetContext"),k=function(n){if(n==null)return null;return String(n)};b=e&&k(x.TryCall(a,"UPK_GetNamespace"))||null;c=g&&k(x.TryCall(a,"UPK_GetTags"))||null;if(!b||!c||!h){var j=a.document.getElementsByTagName("meta");a=0;for(var p=j.length;a<p;++a){var f=j[a].name;if(/^upk-/.test(f))if(b==
null&&f=="upk-namespace")b=j[a].content;else if(c==null&&f=="upk-tags")c=j[a].content;else if(d==null&&f=="upk-context")d=j[a].content}}}catch(l){}return b||c||d?[b,d,c]:null},ApplicationInfoFromWindow:function(a){a=H.TokensFromWindow(a);if(!a)return null;return P.CreateInfo(a[0],a[1],a[2])},_DecodeDelimitedString:function(a){a=a.split(";");for(var b=[],c=0,d=a.length;c<d;++c){var e=a[c];e&&b.push(decodeURIComponent(e))}return b},_DecodeAndSort:function(a){a=H._DecodeDelimitedString(a);a.sort();return a},
DecodeContext:function(a,b){if(a==null)return null;if(!b)return decodeURIComponent(a);return H._DecodeAndSort(a)},DecodeTags:function(a){if(a==null)return null;return H._DecodeAndSort(a)},DecodeSp:function(a){return a?a.toLowerCase().split(/\s*(?:;\s*)+/):[]}},Q={CreateValue:function(a,b,c,d,e){return[a,b,c==void 0?true:c,d==void 0?true:d,e==void 0?false:e]},CreateMeta:function(a){return["MC."+a,a,false,false,false]},HasMultipleParts:function(a){return!!a[4]}},Y={NoContext:0,Absolute:1,TopRelative:2,
SmartMatch:3,Hybrid:4};K.Create=function(a){return new K(a[0],a[1],a[2],a[3],a[4])};var ia={Escape:function(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},EscapeAttribute:function(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},Unescape:function(a){return String(a).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")},DecodeEntities:function(a){var b=document.createElement("div");b.innerHTML=
String(a).replace(/</g,"&lt;").replace(/>/g,"&gt;");return b.firstChild.nodeValue}};C.ClassId="OraUpk.ApplicationContext;3";C.FromObject=function(a){return new C(a.Key,a.Name,a.NsName,a.Version,a.Language,a.TagList,a.Parts,a.EnableSM)};C.FromJson=function(a){return C.FromObject(A.DecodeObject(a))};C.prototype={AddPart:function(a,b){b&&b.length&&this.Parts.push([a,b])},ToObject:function(){return{ClassId:C.ClassId,Key:this.Key,Name:this.Name,NsName:this.NsName,Language:this.Language,Version:this.Version,
TagList:this.TagList,Parts:this.Parts,EnableSM:this.EnableSM}},ToJson:function(){return A.EncodeObject(this.ToObject())},ToXml:function(a){function b(l,n,t,v,G,ja){l.push('<property name="'+n+'" caption="'+v+'" usenameasprefix="'+G+'" searchable="'+ja+'">');l.push("<prop_string>"+ia.Escape(t)+"</prop_string>");l.push("</property>")}var c=this.NsName,d=this.EnableSM,e=['<?xml version="1.0"?><propertyset>'],g=this.Name;if(a){g+=d?";SM":"";g+=";V"+a.ContextVersion;g+=";R12.1.0.1";var h,k;if(a.ContextType==
Y.Hybrid){h=a.A.PartMap;k=this.Parts&&this.Parts.length&&this.Parts[0][0]=="A"?this.Parts[0][1]:null}else{h=a.PartMap;k=this.Parts}if(k){a=0;for(d=k.length;a<d;++a){var j=k[a],p=j[0],f=h[p];if(/^MC\./.test(p))g+=";"+f.Caption+j[1];else b(e,j[0],j[1],f.Caption,f.UseNameAsPrefix,f.Searchable)}}}c!=null&&c.indexOf(".")!=-1&&b(e,"MA",c,"Application Name",true,true);b(e,"MC",g,"Context Info",true,false);this.Version!=null&&b(e,"MV",this.Version,"Application Version",true,false);if(this.TagList!=null){c=
this.TagList;a=0;for(d=c.length;a<d;++a)b(e,"MT",c[a],"Application Tag",true,true)}e.push("</propertyset>");return e.join("")}};X.prototype={Key:null,Name:"$UNKNOWN",ConfigDefaults:{ContentMap:[],GatewayTitle:"",GatewayLinksTitle:"Links",GatewayLinks:[],GatewayPages:[],GatewayRememberTab:1},SupportedFeatures:{ExactMatch:"X",SmartMatch:"S"}.ExactMatch,ContextType:Y.Absolute,ContextDiscovery:false,ContextVersion:0,ContextParts:[Q.CreateValue("C","Context ID")],ContextStdPartsMap:{MA:Q.CreateValue("MA",
"Application Name"),MT:Q.CreateValue("MT","Application Tag",true,true,true)},PartMap:null,CombineExactAndSmart:1,CreatePartsFromValues:function(a){var b=this.ContextParts,c=[];if(a){var d,e;d=0;for(e=a.length;d<e;++d){var g=a[d];if(g!=null)if(Q.HasMultipleParts(b[d])){if(g.length!=0)for(var h=0;h<g.length;++h){var k=g[h];k!=""&&c.push([b[d][0],k])}}else g!=""&&c.push([b[d][0],g])}}return c},IntegrateParts:function(a){for(var b=[],c={},d=0,e=a.length;d<e;++d){var g=a[d];if(g)for(var h=0,k=g.length;h<
k;++h)S.AddNewItem(c,g[h][0]+g[h][1],true)&&b.push(g[h])}return b.length?b:null},Initialize:function(){if(!this.HintOverrideName)this.HintOverrideName=this.Name;if(!this.Key)this.Key=this.Name+":"+this.SupportedFeatures;var a={},b,c,d;b=this.ContextStdPartsMap;for(c in b){d=b[c];a[d[0]]=K.Create(d)}var e=this.ContextParts;b=0;for(c=e.length;b<c;++b){d=e[b];a[d[0]]=K.Create(d)}this.PartMap=a}};var u={Keys:[],Names:[],AppByKey:{},AppsByName:{},Register:function(a){a.Initialize();var b=a.Key;u.AppByKey[b]=
a;u.Keys.push(b);b=a.Name;var c=u.AppsByName[b];if(c)c.push(a);else{u.Names.push(b);u.AppsByName[b]=[a]}},TryGetApplicationByKey:function(a){return u.AppByKey[a]||null},TryGetApplicationsByName:function(a){return u.AppsByName[a]||null},TryGetApplication:function(a){return(a=u.AppsByName[a]||null)?a[0]:null},GetApplication:function(a,b){var c;if(b)c=(c=u.GetApplicationKey(a,b))?u.TryGetApplicationByKey(c):null;else c=u.TryGetApplication(a);return c},GetApplicationName:function(a){if(!a)return"";return a.split(":")[0]},
GetApplicationKey:function(a,b){var c=u.TryGetApplicationsByName(a);if(!c)return null;if(!b)return c[0];for(var d=0;d<c.length;++d){var e=c[d],g,h=b.length;for(g=0;g<h;++g)if(e.SupportedFeatures.indexOf(b[g])==-1)break;if(g==h)return e.Key}return null}},o={ContentUrl:"../../",Root:null,RootLoaded:false,PublishDataLoaded:false,_Cache:null,Reset:function(){o.ContentUrl="../../";o.Root=new r({});o.RootLoaded=false;o.PublishDataLoaded=false;o._Cache={}},Request:function(a){if(!a)return null;a=/^~\//.test(a)?
a.substr(2):o.ContentUrl+a;return m.LoadJson(a)},Load:function(a){if(!a)return null;var b=o._Cache[a];if(b===void 0){b=o.Request(a);o._Cache[a]=b||null}return b}},s={GetPublishDataLocation:function(){return"publishdata.json.js"},GetApplicationConfigDataLocation:function(){return"~/configdata.json.js"},GetApplicationKey:function(a){return"Applications/"+a},SetContentUrl:function(a){o.Reset();o.ContentUrl=a},LoadPublishData:function(){return o.Load(s.GetPublishDataLocation())},LoadApplicationConfigData:function(a){return o.Load(s.GetApplicationConfigDataLocation(a))},
GetValueByKey:function(a){var b=o.Root.TryGetValueByKey(a);if(b===void 0)return(a=s.OpenKey(a))?a.Node:void 0;return b},OpenKey:function(a){return o.Root.TryOpenKey(a)||s._LoadKey(a)},GetApplicationConfig:function(a,b){return o.Root.TryOpenKey(s.GetApplicationKey(a))||s._LoadAndCacheApplicationConfig(a,b)},GetApplicationList:function(){var a=s.GetValueByKey("PublishData.Applications");if(a)return S.GetKeys(a);return[]},GetDisabledApplicationList:function(){var a=[],b=s.GetValueByKey("PublishData.Applications");
if(b)for(var c in b){var d=b[c].Enabled;d!==void 0&&!d&&a.push(c)}return a},Reset:function(){o.Reset()},_LoadKey:function(a){if(/^Applications\//.test(a)){var b=a.split("/")[1];s._LoadAndCacheApplicationConfig(b)}else if(/^PublishData(?:\/.+)?$/.test(a))s._LoadAndCachePublishData();else return null;return o.Root.TryOpenKey(a)},_LoadAndCachePublishData:function(){o.PublishDataLoaded=true;var a=o.Load(s.GetPublishDataLocation());a&&o.Root.CreateKey("PublishData").Extend(a)},_LoadAndCacheApplicationConfig:function(a,
b){var c=s.GetApplicationKey(a),d=o.Root.CreateKey(c),e=H.ApplicationNameFromNsName(a),g=u.TryGetApplication(e);d.Extend(g?g.ConfigDefaults:X.prototype.ConfigDefaults);b=b!=null?b+"configdata.json.js":s.GetApplicationConfigDataLocation(e);if(e=o.Load(b)){(c=r.FindKey(e,c))&&d.Extend(c);d.CreateKey("ConfigData").Extend(e)}return d}};if(!Function.prototype.bind)Function.prototype.bind=function(a){if(typeof this!=="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};d.prototype=this.prototype;e.prototype=new d;return e};var ga=false,Z={callBack:null,appName:"",appExtName:"",parts:[],originalResultSet:{rs:{}},currentResultSet:{},currentResultSetBeforeCutOff:{},indexMap:{},index:0,partNumber:0,published:false,weight:100,StartSearch:function(a,b,c,d){if(d)this.callBack=d;this.appName=a;this.appExtName=
b;s.SetContentUrl("../");this.published=s.GetValueByKey("PublishData/Applications/"+this.appExtName)?true:false;if(!this.published){q("SearchProcessor.StartSearch","not published: "+this.appName);return this._Finish()}this.parts=c;this.partNumber=this.parts.length;this.weight=Math.round(100/this.partNumber);this.index<this.partNumber&&this.ProcessPart()},_Finish:function(){this.currentResultSetBeforeCutOff.rs=[];this.currentResultSet.rs=[];this.Finish()},ProcessPart:function(){var a=this.appName+
"$"+O.MyEscape(this.parts[this.index]);q("SearchProcessor.ProcessPart","parts["+this.index+"] = "+a);try{SearchDBs.g.Search(a,true,this.SearchEnded.bind(this))}catch(b){q("SearchProcessor.ProcessPart","SearchDBs['g'].Search exception = "+b.message?b.message:b)}},SearchEnded:function(a){q("SearchProcessor.SearchEnded","original result = "+y(a.rs));var b=R(void 0,a);q("SearchProcessor.SearchEnded","this.index = "+this.index);if(!this.currentResultSet.rs)this.currentResultSet=b;if(this.currentResultSet.rs.length==
0&&a.rs.length>0)for(var c=0;c<b.rs.length;c++)b.rs[c].weight=this.weight;q("SearchProcessor.SearchEnded","before combine = "+y(this.currentResultSet.rs));this.currentResultSet.Combine(b,this.weight);q("SearchProcessor.SearchEnded","after combine = "+y(this.currentResultSet.rs));this.originalResultSet.rs[this.parts[this.index]]=a.rs;q("SearchProcessor.SearchEnded","originalresultset = "+y(this.originalResultSet.rs));this.index++;this.index<this.partNumber?this.ProcessPart():this.EndSearch()},EndSearch:function(){q("SearchProcessor.EndSearch",
"Final Result = "+y(this.currentResultSet.rs));this.currentResultSetBeforeCutOff=R(void 0,this.currentResultSet);var a=s.GetValueByKey("PublishData/Applications/"+this.appExtName+"/SmartMatch");q("SearchProcessor.EndSearch","appSection = "+y(a));this.MaxSearch=a.MaxSearch;this.Threshold=a.Threshold;this.MinScore=a.MinScore;q("SearchProcessor.EndSearch","maxSearch = "+this.MaxSearch+" threshold = "+this.Threshold+" minScore = "+this.MinScore);this.HighScore=this.currentResultSet.GetMaxWeight();q("SearchProcessor.EndSearch",
"highScore = "+this.HighScore);this.CutOffLimit=Math.round(Math.max(this.MinScore,this.Threshold/100*this.HighScore));q("SearchProcessor.EndSearch","cutofflimit = "+this.CutOffLimit);this.currentResultSet.CutOffByLimit(this.CutOffLimit);q("SearchProcessor.EndSearch","Final Result after cutoff = "+y(this.currentResultSet.rs));q("SearchProcessor.EndSearch","Original Result = "+y(this.originalResultSet.rs));this.Finish()},ShowTestResults:function(){var a={};a.Application=this.appName;a.MinScore=this.MinScore;
a.MaxSearch=this.MaxSearch;a.Threshold=this.Threshold;a.CutOffLimit=this.CutOffLimit;a.currentResultSetBeforeCutOff=this.currentResultSetBeforeCutOff;a.partNumber=this.partNumber;a.parts=this.parts;a.published=this.published;a.originalResultSet=this.originalResultSet;N.PostMessage(window.parent,"oraupk-debuginfo_searchresult",{data:a})},Finish:function(){B.CheckTestMode(this);if(this.callBack){for(var a=0;a<this.currentResultSet.rs.length;a++)this.currentResultSet.rs[a].weight/=100;SearchProcess_Show(false);
this.callBack(this.currentResultSet)}},__:void 0},B={_timer:null,loadCounter:0,searchproc:null,CheckTestMode:function(a){this.searchproc=a;this.loadCounter=0;B._timer=setInterval(function(){B.loadCounter++;if(B.loadCounter>100)clearInterval(B._timer);else if(window.UserPrefs)if(window.UserPrefs&&window.UserPrefs.EnableShowDiagnostics||window.Debug&&window.Debug.is_ta_debug){clearInterval(B._timer);B.searchproc&&B.searchproc.ShowTestResults()}},100)},__:void 0};window.SearchSM=function(a,b){q("SearchSM",
"node = "+y(a));q("SearchSM","callBack = "+b);var c=a?a[0].App:null,d=a?a[0].AppExt||c:null,e=a?a.slice(1):null;if(!c&&!d){q("SearchSM","invalid data");return Z._Finish()}q("SearchSM","appName = "+c+" appExtName = "+d);q("SearchSM","parts = "+y(e));Z.StartSearch(c,d,e,b)};return N}();
