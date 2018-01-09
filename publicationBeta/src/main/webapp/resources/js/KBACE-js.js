function searchUser() {
	var td_Username, td_Firstname;
	var input = document.getElementById("searchUser").value.toUpperCase();
	var table = document.getElementById("usersList");
	var tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td_UserID = tr[i].getElementsByTagName("td")[0];
		td_Username = tr[i].getElementsByTagName("td")[1];
		td_Firstname = tr[i].getElementsByTagName("td")[2];
		td_Lastname = tr[i].getElementsByTagName("td")[3];
		td_Coustomername = tr[i].getElementsByTagName("td")[4];
		td_Active = tr[i].getElementsByTagName("td")[5];
		td_Email = tr[i].getElementsByTagName("td")[6];
		td_AccountType = tr[i].getElementsByTagName("td")[7];
		td_StartDate = tr[i].getElementsByTagName("td")[8];
		td_EndDate = tr[i].getElementsByTagName("td")[9];

		if (td_UserID || td_Username || td_Firstname || td_Lastname
				|| td_Coustomername || td_Active || td_Email || td_AccountType
				|| td_StartDate || td_EndDate) {
			if ((td_UserID.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Username.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Firstname.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Lastname.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Coustomername.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Active.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_Email.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_AccountType.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_StartDate.innerHTML.toUpperCase().indexOf(input) > -1)
					|| (td_EndDate.innerHTML.toUpperCase().indexOf(input) > -1)) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}

function showUserForm() {
	if (document.getElementById("adduser_form").style.display == "none") {
		document.getElementById("adduser_form").style.display = "block";
	} else {
		document.getElementById("adduser_form").style.display = "none";
	}
}

function enableToEdit(id) {

	document.getElementById(id).style.border = "solid red 2px";

	var trEdit = document.getElementById(id).children;

	for (var i = 1; i < trEdit.length - 3; i++) {
		trEdit[i].setAttribute("contenteditable", "true");
	}

	document.getElementById("save-EditedUser" + id).style.display = "initial";
	document.getElementById("edit-user" + id).style.display = "none";
	document.getElementById("startDate" + id).removeAttribute("readonly");
	document.getElementById("endDate" + id).removeAttribute("readonly");
}

function updateUserDetails(id) {

	var trUpdate = document.getElementById(id).children;

	var eDate = trUpdate[9].innerHTML;
	document.getElementById("usrId" + id).value = trUpdate[0].innerHTML;
	document.getElementById("usrName" + id).value = trUpdate[1].innerHTML;
	document.getElementById("useFirstname" + id).value = trUpdate[2].innerHTML;
	document.getElementById("usrLastname" + id).value = trUpdate[3].innerHTML;
	document.getElementById("usrCustomername" + id).value = trUpdate[4].innerHTML;
	document.getElementById("usrActive" + id).value = trUpdate[5].innerHTML;
	document.getElementById("usrEmail" + id).value = trUpdate[6].innerHTML;
	document.getElementById("usrAccountType" + id).value = trUpdate[7].innerHTML;
	document.getElementById("usrStartdate" + id).value = document
			.getElementById("startDate" + id).value
	document.getElementById("usrEnddate" + id).value = document
			.getElementById("endDate" + id).value

}

function getDataforUserGroup() {

	document.getElementById("edit-user-group").style.display = "block";

	var id = document.querySelector('input[name= "userGroup"]:checked').value;
	var userNotInUsergroup;
	var userInUsergroup;
	var i;
	var susersnotinusergroup = document.getElementById("usersnotinusergroup");
	var susersinusergroup = document.getElementById("usersinusergroup");

	var scontentnotinusergroup = document
			.getElementById("contentnotinusergroup");
	var scontentinusergroup = document.getElementById("contentinusergroup");

	document.getElementById('usersnotinusergroup').options.length = 0;
	document.getElementById('usersinusergroup').options.length = 0;

	document.getElementById('contentnotinusergroup').options.length = 0;
	document.getElementById('contentinusergroup').options.length = 0;

	$.ajax({
		type : "POST",
		url : "getUserGroupInfo",
		data : "usergroupID=" + id,
		dataType : 'json',
		success : function(data) {
			userNotInUsergroup = data[0];
			userInUsergroup = data[1];
			contentNotInUsergroup = data[2];
			contentInUsergroup = data[3];

			for (i = 0; i < userNotInUsergroup.length; i++) {
				var username = document.createElement("OPTION");

				username.value = userNotInUsergroup[i].user_id;
				username.text = userNotInUsergroup[i].username;
				susersnotinusergroup.add(username);
			}

			for (i = 0; i < userInUsergroup.length; i++) {
				var username = document.createElement("OPTION");

				username.value = userInUsergroup[i].user_id;
				username.text = userInUsergroup[i].username;
				susersinusergroup.add(username);
			}

			for (i = 0; i < contentNotInUsergroup.length; i++) {
				var contentname = document.createElement("OPTION");

				contentname.value = contentNotInUsergroup[i].content_id;
				contentname.text = contentNotInUsergroup[i].title;
				scontentnotinusergroup.add(contentname);
			}

			for (i = 0; i < contentInUsergroup.length; i++) {
				var contentname = document.createElement("OPTION");

				contentname.value = contentInUsergroup[i].content_id;
				contentname.text = contentInUsergroup[i].title;
				scontentinusergroup.add(contentname);
			}
		},
		error : function(e, errorMessage) {
			console.log('Error: ' + errorMessage);
		}
	});
}

function updateUsergroupAssignmentList(outgroupid, ingroupID) {

	var i;
	var val;
	var sinusergroup = document.getElementById(ingroupID);

	var value = document.getElementById(outgroupid)
			&& document.getElementById(outgroupid).options;
	var len = value.length;
	console.log("length======= " + len);
	var rem = [];

	for (i = 0; i < len; i++) {
		val = value[i];
		if (val.selected) {
			var name = document.createElement("OPTION");

			name.value = val.value;
			name.text = val.text;
			sinusergroup.add(name);

			rem.push(i);
		}
	}
	var remlen = rem.length;
	for (i = 0; i < remlen; i++) {
		// console.log(rem[i]);
		document.getElementById(outgroupid).remove(rem.pop());
	}
}

function updateUserGroup() {
	var i;
	var userGroupId = document
			.querySelector('input[name= "userGroup"]:checked').value;
	var users = document.getElementById("usersinusergroup")
			&& document.getElementById("usersinusergroup").options;

	var content = document.getElementById("contentinusergroup")
			&& document.getElementById("contentinusergroup").options;

	var userIDs = [];
	var contentIDS = [];

	for (i = 0; i < users.length; i++) {
		userIDs.push(users[i].value);
	}

	for (i = 0; i < content.length; i++) {
		contentIDS.push(content[i].value);
	}

	$.ajax({
		type : "POST",
		url : "updateUsers_UserGroup",
		data : {
			userList : userIDs,
			contentList : contentIDS,
			usergroupID : userGroupId

		},
		traditional : true,
		success : function() {
			window.location.href = "userGroup-management";
		},
		error : function(errorMessage) {
			console.log('Error: ' + errorMessage.responseText);
		}
	});
}

function setUserID(id) {
	document.getElementById("userID").value = id;
}

function enableToEditContent(id) {

	document.getElementById(id).style.border = "solid red 2px";
	document.getElementById("selectContentType" + id).removeAttribute(
			"disabled");
	document.getElementById("selectApp" + id).removeAttribute("disabled");
	document.getElementById("save-EditedUser" + id).style.display = "initial";
	document.getElementById("edit-user" + id).style.display = "none";
}

function updateContent(title) {
	console.log(title);

	var content = document.getElementById("selectContentType" + title);
	var application = document.getElementById("selectApp" + title);

	var contentType = content.options[content.selectedIndex].value;
	var app = application.options[application.selectedIndex].value;

	document.getElementById("save-EditedUser" + title).style.display = "none";
	document.getElementById("edit-user" + title).style.display = "initial";

	$.ajax({
		type : "POST",
		url : "updateContent",
		data : {
			title : title,
			contentType : contentType,
			app : app
		},
		traditional : true,
		success : function() {
			window.location.href = "title-management";
		},
		error : function(errorMessage) {
			console.log('Error: ' + errorMessage.responseText);
		}
	});
}

function createMenu(contentType, contentTitle, contentLink, contentApp) {
	// get upper level menu doc
	var upperLevelMenu = document.getElementById("upplerLevelMenu");

	// variable for display
	var type = contentType;
	var application = contentApp;
	var title = contentTitle;

	// make lower case and remove white space
	contentType = contentType.toLowerCase();
	contentTitle = contentTitle.toLowerCase();
	contentApp = contentApp.toLowerCase();

	contentType = contentType.replace(/\s+/g, '');
	contentTitle = contentTitle.replace(/\s+/g, '');
	contentApp = contentApp.replace(/\s+/g, '');

	// inti variables
	var hrsubDiv;
	var hrsubInnerDiv;
	var liType;
	var aType;
	var divApp;
	var header;
	var ul;
	// make link in menu if there is no Application type
	if (contentApp == "") {
		liType = document.createElement("li");
		liType.setAttribute("id", "contentType-" + contentType);
		var div = document.createElement("div");
		aType = document.createElement("a");

		// console.log(contentLink)

		aType.setAttribute("href", contentLink);
		aType.setAttribute("class", "KBACE-menu");
		aType.appendChild(document.createTextNode(title));

		div.appendChild(aType);
		liType.appendChild(div);
		upperLevelMenu.appendChild(liType);
		return;
	}

	// check if content menu is present
	if (document.getElementById("contentType-" + contentType) == null) {
		// create elements
		liType = document.createElement("li");
		liType.setAttribute("id", "contentType-" + contentType);

		aType = document.createElement("a");
		aType.setAttribute("class", "dropdown-toggle");
		aType.setAttribute("href", "#");
		aType.appendChild(document.createTextNode(type));

		hrsubDiv = document.createElement("div");
		hrsubDiv.setAttribute("class", "KBACE-hrsub");

		hrsubInnerDiv = document.createElement("div");
		hrsubInnerDiv.setAttribute("class", "KBACE-hrsub-inner");
	} else {
		// init values for aType, hrsubDiv, hrsubInnerDiv
		liType = document.getElementById("contentType-" + contentType);
		var nodes = liType.childNodes;
		aType = nodes[0];
		hrsubDiv = nodes[1];

		nodes = hrsubDiv.childNodes;
		hrsubInnerDiv = nodes[0];
	}
	// check if header is already available.
	if (document.getElementById("app-" + contentType + application) == null) {
		// create elements
		divApp = document.createElement("div");
		divApp.setAttribute("id", "app-" + contentType + application);
		divApp.setAttribute("class", "submenu-col");

		header = document.createElement("h5");
		header.appendChild(document.createTextNode(application
				+ " Cloud Transactional Support"));

		ul = document.createElement("ul");
		divApp.appendChild(header);
		divApp.appendChild(ul);
	} else {
		// init variables
		divApp = document.getElementById("app-" + contentType + application);
		var nodes = divApp.childNodes;
		header = nodes[0];
		ul = nodes[1];
	}

	var li = document.createElement("li");

	var a = document.createElement("a");
	a.setAttribute("href", contentLink);
	a.setAttribute("class", "dropdown-item padding-zero");
	a.appendChild(document.createTextNode(title));

	// append to parent
	li.appendChild(a);
	ul.appendChild(li);

	hrsubInnerDiv.appendChild(divApp);
	hrsubDiv.appendChild(hrsubInnerDiv);

	liType.appendChild(aType);
	liType.appendChild(hrsubDiv);
	upperLevelMenu.appendChild(liType);
}

function createLogout(accountType) {

	// get upper level menu doc
	var upperLevelMenu = document.getElementById("upplerLevelMenu");
	var liType = document.createElement("li");
	var div = document.createElement("div");
	var aType = document.createElement("a");

	aType.setAttribute("href", "logout");
	aType.setAttribute("class", "KBACE-menu");
	aType.appendChild(document.createTextNode("Logout"));

	div.appendChild(aType);
	liType.appendChild(div);

	upperLevelMenu.appendChild(document.getElementById("managerMenu"));
	upperLevelMenu.appendChild(document.getElementById("supportMenu"));
	upperLevelMenu.appendChild(liType);

	accountType = accountType.toLowerCase();
	if (accountType == "admin") {
		document.getElementById("managerMenu").style.display = "inline-block";
	}
	
	document.getElementById("supportMenu").style.display = "inline-block";
	
}

function showInfo(contentType) {
	contentType = contentType.toLowerCase();
	contentType = contentType.replace(/\s+/g, '');

	if (contentType.indexOf("fsm") > -1) {
		document.getElementById("fsm-intro").style.display = "flex";
	}
	if (contentType.indexOf("cloudtransactionaltraining") > -1) {
		document.getElementById("cloudtransactionaltraining-intro").style.display = "flex";

	}
	if (contentType.indexOf("cloudspotlightrelease ") > -1) {
		document.getElementById("cloudrelesespotlight-intro").style.display = "flex";
	}

}
