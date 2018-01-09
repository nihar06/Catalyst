
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

/* swfobject.js */
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){try{var ab=Z.GetVariable("$version");}catch(er){}if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
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

/* iashelper.js */
window.ias=function(j){function o(a){var b={};if(a!=c)for(var k in a){var i=a[k];if(i!=c)b[k]=i}return b}function s(a){e=o(a);f.push(e);g=c}function t(a,b){if(b!=c)m[a]=b;else delete m[a];l=c}function w(a,b){return encodeURIComponent(a)+"="+encodeURIComponent(b)}function x(a,b){return encodeURIComponent(a)+(b==""?"":"="+encodeURIComponent(b))}function u(a,b){var k=b?x:w,i=[],n;for(n in a){var h=a[n];if(h&&h.push&&h.sort)for(var p=0;p<h.length;++p)i.push(k(n,h[p]));else h!=c&&i.push(k(n,h))}return i.join(";")}
var c=null,v=c,g=c,e={},f=[e],m={},l=c,q=[],r=[],d=window.ias||{};d.SetNamespace=function(a){v=a};d.SetContext=function(a){e=o(a);f[f.length-1]=e;g=c};d.SetContextPart=function(a,b){if(b!=c)e[a]=b;else delete e[a];g=c};d.ResetContext=function(a){f=[];s(a)};d.SetTag=t;d.SetTags=function(a){for(var b in a)t(b,a[b])};d.ResetTags=function(a){m=o(a);l=c};d.PushContext=s;d.PopContext=function(){f.pop();f.length||f.push({});e=f[f.length-1];g=c};d.AddDiscoveryCddUrl=function(a){q.push(a)};d.AddApplicableCddUrl=
function(a){r.push(a)};j.UPK_GetNamespace=function(){return v};j.UPK_GetContext=function(){if(g==c)g=u(e);return g};j.UPK_GetTags=function(){if(l==c)l=u(m,true);return l};j.UPK_GetDiscoveryCddUrls=function(){return q.length?q:c};j.UPK_GetApplicableCddUrls=function(){return r.length?r:c};return d}(window);ias.SetTag("upk-trait-nohelp","");

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

/* prefdlg.js */
/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var bSoundIsAvailable = true;
var bSeeItOnly = false;
//from prefmain.html
var bFlashInstalled = true;
var Orig_UserPrefs = new UserPreferences();
Orig_UserPrefs.Copy(UserPrefs);

var bIsModified = false;

function GetOpener() {
	var _opener;
	if (parent.opener)
		return parent.opener;
	if (parent.parent) {
		if (parent.parent.opener)
			return parent.parent.opener;
	}

	return 0;
}

function SetModified(bModified) {
	if (bModified != bIsModified) {
		bIsModified = bModified;
		//parent.prefcontrol.document.controlform.Apply.disabled = !bModified;
		document.controlform.Apply.disabled = !bModified;
	}
}

function UpdateModified() {
	if (!bIsModified)
		SetModified(UserPrefs.Compare(Orig_UserPrefs));
}

function UpdateForm() {
	$("#PlayAudio select").val(UserPrefs.PlayAudio);
	document.prefform.LeadInSelect.checked = (UserPrefs.ShowLeadIn != "toc");
	document.prefform.TryItEnableSkipping.checked = UserPrefs.TryIt.EnableSkipping;

	$("#MarqueeColor div").css('background-color', UserPrefs.MarqueeColor);
	if (!bFlashInstalled)
		$("#PlayAudio select").attr('disabled', 'disabled');

	$("#HotKeyCtrl").val(UserPrefs.DoIt.HotKey.Ctrl);
	$("#HotKeyShift").val(UserPrefs.DoIt.HotKey.Shift);
	$("#HotKeyAlt").val(UserPrefs.DoIt.HotKey.Alt);

	if (Debug.EnableShowDiagnostics == false)
		$("#ShowDiag").parent().hide();
	else
		document.prefform.ShowDiag.checked = UserPrefs.EnableShowDiagnostics;

	$("#DefPlayMode").val(UserPrefs.DefaultPlayMode);
}

function DoApply() {
	if (!bIsModified)
		return;

	SetModified(false);

	var cookie = UserPrefs.GetCookie();
	cookie.TimeStamp = UserPrefs.TimeStamp;
	cookie.PlayAudio = UserPrefs.PlayAudio;
	cookie.ShowLeadIn = UserPrefs.ShowLeadIn;
	cookie.MarqueeColor = UserPrefs.MarqueeColor;
	cookie.TryIt_EnableSkipping = UserPrefs.TryIt.EnableSkipping;
	cookie.DoIt_HotKey_Ctrl = UserPrefs.DoIt.HotKey.Ctrl;
	cookie.DoIt_HotKey_Shift = UserPrefs.DoIt.HotKey.Shift;
	cookie.DoIt_HotKey_Alt = UserPrefs.DoIt.HotKey.Alt;
	cookie.EnableShowDiagnostics = UserPrefs.EnableShowDiagnostics;
	cookie.DefaultPlayMode = UserPrefs.DefaultPlayMode;
	cookie.Store();

	var _opener = GetOpener();
	if (_opener) {
		if (_opener.OnUpdatePreferences)
			_opener.OnUpdatePreferences(UserPrefs);
		else if (_opener.UserPrefs)
			_opener.UserPrefs.Copy(UserPrefs);
	}

	Orig_UserPrefs.Copy(UserPrefs);
}

function ResetDefaults_onclick() {
	if (confirm(R_default_prefs)) {
		UserPrefs = new UserPreferences();
		if (window.SetDefaultPreferences) {
			SetDefaultPreferences();
		}
		if (bFlashInstalled == false) {
			UserPrefs.PlayAudio = "none";
		}
		UpdateForm();
		UpdateModified();
	}
}

function TryItEnableSkipping_onclick() {
	UserPrefs.TryIt.EnableSkipping = document.prefform.TryItEnableSkipping.checked;
	UpdateModified();
}

function LeadInSelect_onclick() {
	UserPrefs.ShowLeadIn = (document.prefform.LeadInSelect.checked ? "all" : "toc");
	UpdateModified();
}

function PlayAudio_onchange() {
	UserPrefs.PlayAudio = $("#PlayAudio select").val();
	UpdateModified();
}

function HotKey_Ctrl_onchange() {
	UserPrefs.DoIt.HotKey.Ctrl = $("#HotKeyCtrl").val();
	UpdateModified();
}

function HotKey_Shift_onchange() {
	UserPrefs.DoIt.HotKey.Shift = $("#HotKeyShift").val();
	UpdateModified();
}

function HotKey_Alt_onchange() {
	UserPrefs.DoIt.HotKey.Alt = $("#HotKeyAlt").val();
	UpdateModified();
}

function DefPlayMode_onchange() {
	UserPrefs.DefaultPlayMode = $("#DefPlayMode").val();
	UpdateModified();
}

function OnColorSelection(color) {
	UserPrefs.MarqueeColor = color;
	$("#MarqueeColor div").css('background-color', UserPrefs.MarqueeColor);
	UpdateModified();
}

function ChangeColor_onclick() {
	ShowColorTable();
}

function ShowDiag_onclick() {
	UserPrefs.EnableShowDiagnostics = document.prefform.ShowDiag.checked;
	UpdateModified();
}

function init_ui_elements() {
	$("[name='prefform'] .PrefTextHead").text(R_preferences_options);

	$("#MarqueeColor span").html(R_preferences_marquee);
	$("input[name='ChangeColor']").attr({ "value": R_preferences_changecolor, "title": R_preferences_changecolor_title });

	$("#PlayAudio label").html(R_preferences_playaudio);
	$("#PlayAudio").attr("title", R_preferences_audiotooltip);
	$("#PlayAudio option[value='none']").text(R_preferences_nosound);
	$("#PlayAudio option[value='demo']").text(R_preferences_keyboardsound);
	$("#PlayAudio option[value='all']").text(R_preferences_allsound);

	$("#FlashText span").text(R_preferences_flash);

	// sets the checkbox and its label in once
	$("#LeadInSelect").attr("title", R_preferences_showintroduction2).siblings("label[for='LeadInSelect']").attr("title", R_preferences_leadintooltip).text(R_preferences_showintroduction);

	$("#TryItEnableSkipping").attr("title", R_preferences_tryitenableskipping2).siblings("label[for='TryItEnableSkipping']").attr("title", R_preferences_skippingtooltip).text(R_preferences_tryitenableskipping);

	$("#keyCombinationsInDoIt").text(R_preferences_doitcombinations);

	$("#HotKeyCtrl").attr("title", R_preferences_ctrltooltip);
	$("#HotKeyCtrl option[value='L']").text(R_preferences_Lctrl);
	$("#HotKeyCtrl option[value='R']").text(R_preferences_Rctrl);
	$("#HotKeyCtrl option[value='N']").text(R_preferences_Nctrl);

	$("#HotKeyShift").attr("title", R_preferences_shifttooltip);
	$("#HotKeyShift option[value='L']").text(R_preferences_Lshift);
	$("#HotKeyShift option[value='R']").text(R_preferences_Rshift);
	$("#HotKeyShift option[value='N']").text(R_preferences_Nshift);

	$("#HotKeyAlt").attr("title", R_preferences_alttooltip);
	$("#HotKeyAlt option[value='L']").text(R_preferences_Lalt);
	$("#HotKeyAlt option[value='R']").text(R_preferences_Ralt);
	$("#HotKeyAlt option[value='N']").text(R_preferences_Nalt);

	$("#note1").text(R_preferences_note);
	$("#note2").text(R_preferences_note_text);

	$("#DefPlayModeLabel").text(R_preferences_defplaymode);
	$("#DefPlayMode option[value='S']").text(R_mode_seeit);
	$("#DefPlayMode option[value='T']").text(R_mode_tryit);
	$("#DefPlayMode option[value='K']").text(R_mode_knowit);
	$("#DefPlayMode option[value='D']").text(R_mode_doit);
	$("#DefPlayModeLabel2").text(R_preferences_defplaymodetext);

	$("#ShowDiag").attr("title", R_preferences_showdiagnostics).siblings("label[for='ShowDiag']").attr("title", R_preferences_showdiagnostics).text(R_preferences_showdiagnostics);

	$("input[name='ResetDefaults']").attr({ "value": R_preferences_defaults, "title": R_preferences_defaults_title });

	if (upk.browserInfo.isFF()) {
		$("input[type='button']").addClass("InstructTextButtonFF");
	}
	$("input[name='OK']").attr("value", R_preferences_OK);
	$("input[name='Cancel']").attr("value", R_preferences_cancel);
	$("input[name='Apply']").attr("value", R_preferences_apply);
	$("input[name='Help']").attr("value", R_preferences_help);
}

function DisableComboBoxes() {
	if (upk.browserInfo.isSafari())
		return;
	$("#prefmain :input").attr('disabled', 'disabled');
}

function EnableComboBoxes() {
	if (upk.browserInfo.isSafari())
		return;
	$("#prefmain :input").removeAttr('disabled'); // enabled every :input in #prefmain
	if (!bFlashInstalled)
		$("#PlayAudio select").attr('disabled', 'disabled'); // except #playaudio
}

function CheckFlash() {
	if (upk.browserInfo.isSoundSupported()) {
		$("#FlashText").css('display', 'none');
		bFlashInstalled = true;
	}
	else {
		bFlashInstalled = false;
		UserPrefs.PlayAudio = "none";
		Orig_UserPrefs.PlayAudio = "none";
		$("#PlayAudio select").val(UserPrefs.PlayAudio).attr('disabled', 'disabled');
	}
}

function Apply_onclick() {
	DoApply();
}

function OK_onclick() {
	Apply_onclick();
	close();
	if (parent.closeDialog)
		parent.closeDialog();
}

function Cancel_onclick() {
	close();
	//if (opener)
	//	opener.closeDialog();
	if (parent.closeDialog)
		parent.closeDialog();
}

//end from prefmain.html

function ShowColorTable() {
	//frames["preferences0"]["prefmain"].DisableComboBoxes();
	DisableComboBoxes();
	document.getElementById("preftrp").style.display = "inline";
	document.getElementById("prefcolor").style.display = "inline";
	frames["prefcolor"].focus();
}

function ColorSelected(s) {
	OnColorSelection(s);
	HideColorTable();
}

function HideColorTable() {
	document.getElementById("preftrp").style.display = "none";
	document.getElementById("prefcolor").style.display = "none";
	EnableComboBoxes();
}

function Click() {
	HideColorTable();
}

function InitPreferences() {
	document.title = R_preferences_title;
	var userProfileUrl = "";
	var strArgs = document.location.hash.substring(1).split("&");
	if (strArgs.length == 0 || strArgs[0] == "")
		strArgs = document.location.search.substring(1).split("&");
	if (strArgs.length > 0) {
		for (var i = 0; i < strArgs.length; i++) {
			var s = strArgs[i];
			if (s.toUpperCase() == "NOSOUND")
				bSoundIsAvailable = false;
			if (s.toUpperCase() == "SEEITONLY")
				bSeeItOnly = true;
			if (s.toUpperCase().substr(0, 15) == "USERPROFILEURL=")
				userProfileUrl = Escape.MyUnEscape(s.substr(15));
		}
	}


	// the pref tab button is always visible
	document.getElementById("prefTabButton").innerHTML = R_preferences_title;
	if (userProfileUrl != "") {
		// user profile page is also displayed
		document.getElementById("profileTabId").style.display = "block";
		document.getElementById("profileTabButton").innerHTML = R_userprofile_title;
		frames["profileFrame"].location.replace(userProfileUrl);
	}
	//prefmain init part
	if (bSeeItOnly) {
		$(".hidebyseeit").hide();
	}
	UpdateForm();
	$('.PrefControls').css("display", "block");
	window.focus();

	init_ui_elements();
	//end prefmain init
}

function window_onunload2() {
	try {
		if (opener) {
			if (opener.OnClosingPreferences)
				opener.OnClosingPreferences();
		}
	}
	catch (e) { };
}

$(function () {
	$("#prefTabs").tabs();
	CheckFlash();
	InitPreferences();
});


