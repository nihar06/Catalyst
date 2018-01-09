/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

var embedded = false;
var editable = true;
var browser = "";

$(document).ready(function () {
    if (opener && opener.isTestItOnTouchDevice)
        embedded = opener.isTestItOnTouchDevice();
    else if (parent && parent.isTestItOnTouchDevice)
        embedded = parent.isTestItOnTouchDevice();
    fillTestDate();
    Ready2()
});

function Ready2() {
    try {
        if (!R_testit_entertester) {
            setTimeout(Ready2, 100);
            return;
        }
    }
    catch (e) {
        setTimeout(Ready2, 100);
        return;
    }
    if (navigator) {
        if (navigator.userAgent) {
            if (navigator.userAgent.indexOf("Safari") > 0) {
                browser = "Safari";
            }
        }
    }
    if (opener && opener.GITestItReportReady) {
        opener.GITestItReportReady();
    }
    else if (parent && parent.GITestItReportReady) {
        opener = parent;
        parent.GITestItReportReady();
    }
}

function setEditable(e) {
	editable = e;
	if (editable) {
		$("*[name='ActualTime'] ~ p").attr('contentEditable', true)
		fillTestName(R_testit_entertester);
		fillTestNotes(R_testit_enternotes);
	}
	var o = $("*[name^='TestNotesFrameID']");
	o.parent().css('height', '100%');
	if (browser == "Safari" && editable) {
		o.parent().attr('contentEditable', true);
	}
	o.parent().html(function () {
		var tt = '<div id="' + $(this).find(o).attr("name") + '" style="width:100%; height:100%; cursor:text"' + ((browser != 'Safari' && editable) ? 'contenteditable' : ' ') + '><br></div>';
		return tt;
	});
}

function fillTestDate() {
    var d = new Date();
    $("*[name='TestDate'] ~ p").text(d.toDateString());
};

function fillTestName(s) {
	$("*[name='TestName'] ~ p").text(s);
	if (editable) { $("*[name='TestName'] ~ p").attr('contentEditable', true); }
}

function fillTestNotes(s) {
    $("*[name='TestNotes'] ~ p").text(s);
    if (editable) { $("*[name='TestNotes'] ~ p").attr('contentEditable', true); }
}

function fillTestResults(passed) {
    var o = $("*[name='TestResults'] ~ p");
    if (passed) {
        o.html("<img src='../../img/empty.gif' style='vertical-align:text-top' class='sum_passed'> " + R_testit_passed)
    }
    else {
        o.html("<img src='../../img/empty.gif' style='vertical-align:text-top' class='sum_failed'> " + R_testit_failed)
    }
}

function fillActualTime(s) {
    $("*[name='ActualTime'] ~ p").text(s);
}

function fillActionTesterNotes(fid, aid, s) {
    $("#TestNotesFrameID" + fid + "_" + aid).html(s);
}

function fillActionTestResult(fid, aid, s) {
    var o = $("*[name='TestResultFrameID" + fid + "_" + aid + "'] ~ p");
    switch (s) {
        case "passed":
            o.html("<img src='../../img/empty.gif' style='vertical-align:text-top' class='sum_passed'> " + R_testit_passed)
            break;
        case "failed":
            o.html("<img src='../../img/empty.gif' style='vertical-align:text-top' class='sum_failed'> " + R_testit_failed)
            break;
        case "skipped":
            o.html("<img src='../../img/empty.gif' style='vertical-align:text-top' class='sum_skipped'> " + R_testit_skipped)
            break;
    }
    //    $("*[name=TestResultFrameID" + fid + "_" + aid + "] ~ p").text(s);
}

