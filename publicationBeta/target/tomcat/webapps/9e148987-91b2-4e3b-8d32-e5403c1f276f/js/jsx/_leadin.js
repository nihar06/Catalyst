
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
