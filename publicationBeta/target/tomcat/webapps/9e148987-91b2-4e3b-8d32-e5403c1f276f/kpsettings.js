// Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
// This files contains variables that are determined by the launch 
// environment - like under UT, KPath or under a LMS. 
//
// Below are the default settings that will come out of publishing.  

// Not launching under KPath.
var Kpath_launch = false;

// Indicates that the launch was done as a UT tracking mode launch. 
// This variable can only be true when Kpath_launch is true.
// (Removed from spec, for now) 
//var Kpath_UT_mode = false;

//  Dummy API.html file that contains empty page
var Kpath_Runtime_API = "blank.html";


// URL to KPath login profile.  Should only be set if Kpath_UT_mode
// is also set to true.
var Kpath_profile_URL = "";

var Kpath_base_URL = ""
