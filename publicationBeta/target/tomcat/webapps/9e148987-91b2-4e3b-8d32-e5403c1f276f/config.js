// Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.

var TreeConfig = {
	AutoExpandLimit: 100,
	SearchResultLimit: 200,
	DefaultExpandLevel: 1
};

var PlayerConfig = {
	BaseUrl: "",
	TestItMode: false,
	AACIsAvailable: true,
	SeeItPlayBackSize: "FullSize",
	EnableCookies: true,
	EnableShare: true,
	DualMonitorSupport: false,
	DualMonitorFixedSize: false,
	StringInputAutoadvanceEnabled: true,
	StringInputLostFocusAutoadvanceEnabled: true,
	InfoWidth: 400,
	InfoHeight: 300,
	InfoWidth2: 640,
	InfoHeight2: 480,
	ShowScoreNeeded: true,
	PreloadScreenEnabled: true,
	HideClickMark: false,

	// If TrackFeedBack equals false, the scoring screen will not appear at the end of a topic:
	TrackFeedBack: true,
	MouseDelay: 100,
	MinMouseDelay: 50,
	BullseyeDelay: 150,
	InputDelay: 200,
	WheelDelay: 500,
	PausedDelay: 500,
	MouseSteps: 30,
	PanSpeed: 8,
	AllowRandomAnswersForMatchingQuestions: true,
	ShowFrameID: "Off",
	HideActionBordersInSeeIt: false,
	LaunchNewPlayerWindow: true
};

var LmsConfig = {

	// The AICC spec is unclear on what protocol should be used as the default when no protocol specified in the AICC_URL. The following can be configured to enable https configurations. Note that this is ignored if the LMS passes the protocol on the AICC_URL.
	AiccUrlProtocol: "http://",
	AiccVersion: 3.5,

	// The following can be used to solve cross domain problems encountered in Java when the LMS is on one host and the content on another. Move the file /scripts/GetHTTPPostData.class to a location on the LMS and configure the appletPath to point to the location of this file. Example: var appletPath = 'http://127.0.0.1:81';
	AiccAppletPath: "",

	// The following can be enabled to allow all LMS communication messages to be shown within the page. This can be used for diagnosing LMS -&gt; Content communication problems
	DebugMode: false,

	// Set the SCORM version for adapter searching.
	ScormVersion: "auto",

	// These two settings allow you to control what completion/sucess status is reported to the LMS on completion of a graded item (passed/failed/completed/incomplete).
	ReportOnPass: "passed",
	ReportOnFail: "failed"
};

var DoItConfig = {

	// Do it font and color
	DoItFont: {'font-size': '10pt', 'color': 'white', 'font-weight': 'bold', 'font-family': 'Arial, Helvetica, sans-serif'},

	// Do it header color
	DoItHeaderColor: { 'background-color': '#003366' },

	// Actions link color
	DoItActionsLinkColor: "#ccffff",

	// Actions dialog background color
	DoItActionsColor: { 'background-color': '#f7f7e7' },

	// Actions dialog border color
	DoItActionsBorderColor: { 'border-color': 'gray' },

	// Forced background color
	DoItBackgroundColor: "",

	// Do it border color
	DoItBorderColor: "black",

	// Do it header image (overrides header color)
	DoItHeaderImage: {},

	// Do it background
	DoItBackground: {},

	// Do it topic title font
	DoItTopicTitleFont: { 'font-family':'Times New Roman,Times,serif', 'font-size':'12pt', 'font-weight':'bold', 'color':'#003366' },

	// Test it status font
	TestItStatusFont: {}
};

var Debug = {
	EnableShowDiagnostics: false
};



function SetDefaultPreferences(){UserPrefs.PlayAudio="none";UserPrefs.ShowLeadIn="all";UserPrefs.MarqueeColor="#FF0000";UserPrefs.TryIt.EnableSkipping=true;UserPrefs.EnablePreferences=false;UserPrefs.TimeStamp="201709111134";UserPrefs.DoIt.HotKey.Ctrl="L";UserPrefs.DoIt.HotKey.Shift="N";UserPrefs.DoIt.HotKey.Alt="L";UserPrefs.DefaultPlayMode="T";UserPrefs.ApplicableOutlineDisplay="L";}