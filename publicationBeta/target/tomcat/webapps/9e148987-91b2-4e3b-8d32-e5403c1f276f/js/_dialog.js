/*
Copyright © 1998, 2014, Oracle and/or its affiliates.  All rights reserved.
*/
function keyPressHandler(a){if((window.event?event.keyCode:a.keyCode)==(window.event?27:a.DOM_VK_ESCAPE)){if(parent.parent.isOpenDialog)if(parent.parent.isOpenDialog()){parent.parent.closeDialog();return}parent.parent.parent.parent.isOpenDialog&&parent.parent.parent.parent.isOpenDialog()&&parent.parent.parent.parent.closeDialog()}}var upk=upk||{};
$.extend(true,upk,{contextHelper:function(){var a=null,c,d;this.SetContext=function(b,e){if(a)a.SetContext(b,e);else{d=c;c={view:b,subview:e};ias.SetContext(c)}};this.SetNamespace=function(b){a||ias.SetNamespace(b)};this.AddDiscoveryCddUrl=function(b){a||ias.AddDiscoveryCddUrl(b)};this.SetPrevContext=function(){if(a)a.SetPrevContext();else{c=d;ias.SetContext(c)}};try{if(self!=top&&typeof parent.ctxHelper==="object")a=parent.ctxHelper}catch(f){}return this}});window.ctxHelper=new upk.contextHelper;
