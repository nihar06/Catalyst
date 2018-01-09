
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
        var xmlname = n.attributes[0].nodeValue;
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

