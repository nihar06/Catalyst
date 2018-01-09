/*--
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
--*/

$(document).ready(function () {
    if (opener && opener.GITestItReportLoad) {
            opener.GITestItReportLoad();
    }
    else if (parent && parent.GITestItReportLoad) {
        parent.GITestItReportLoad();
    }
});

