package com.kbace.changemanagement.controller;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;
import com.kbace.changemanagement.authentication.UserImpl;
import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.Content;
import com.kbace.changemanagement.entity.UserGroup;
import com.kbace.changemanagement.service.ManagerService;
import com.kbace.changemanagement.service.UserService;

@Controller
public class ManagerController {

	@Autowired
	private ManagerService managerservice;

	@Autowired
	UserService userService;

	private List<CatalystUser> userinUserGroupList;
	private List<Content> contentinUserGroupList;

	@RequestMapping(value = { "/manager", "/manager/user" })
	public ModelAndView manager(ModelAndView mav) {
		// ModelAndView mav = new ModelAndView();
		mav.setViewName("manager");
		List<CatalystUser> users = this.managerservice.getUserList();
		mav.addObject("users", users);
		return mav;
	}

	@RequestMapping(value = { "/manager/addUser" }, method = RequestMethod.POST)
	public ModelAndView addUser(@RequestParam("username") String username, @RequestParam("password") String password,
			@RequestParam("firstname") String firstname, @RequestParam("lastname") String lastname,
			@RequestParam("active") String active, @RequestParam("customerName") String customerName,
			@RequestParam("email") String email, @RequestParam("accounttype") String accounttype,
			@RequestParam("startdate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date startdate,
			@RequestParam("enddate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date enddate) {
		ModelAndView mav = new ModelAndView();

		this.managerservice.addNewUser(new CatalystUser(username, password, firstname, lastname, active, customerName, email,
				accounttype, new Date(startdate.getTime()), new Date(enddate.getTime())));
		mav.setViewName("redirect:/manager");
		return mav;
	}

	@RequestMapping(value = { "/manager/deleteUser" }, method = RequestMethod.POST)
	public ModelAndView deleteUser(ModelAndView mav, @RequestParam("deleteID") long userID) {
		mav.setViewName("redirect:/manager");
		this.managerservice.deleteUser(userID);
		return mav;
	}

	@RequestMapping(value = { "/manager/resetPassword" }, method = RequestMethod.POST)
	public ModelAndView resetUserPassword(ModelAndView mav, @RequestParam("userID") long userID,
			@RequestParam("password") String password) {
		mav.setViewName("redirect:/manager");
		this.managerservice.resetPassword(userID, password);
		return mav;
	}

	@RequestMapping(value = { "/manager/updateUser" }, method = RequestMethod.POST, produces = "application/json")
	public ModelAndView updateUser(@RequestParam("usrId") long usrId, @RequestParam("username") String username,
			@RequestParam("firstname") String firstname, @RequestParam("lastname") String lastname,
			@RequestParam("active") String active, @RequestParam("customerName") String customerName,
			@RequestParam("email") String email, @RequestParam("accounttype") String accounttype,
			@RequestParam("startdate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date sdate,
			@RequestParam("enddate") @DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date edate)
			throws ParseException {

		ModelAndView mav = new ModelAndView("redirect:/manager");
		CatalystUser updatedUser = this.managerservice.getUserInfoByID(usrId);

		// SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		updatedUser.setUser_id(usrId);
		updatedUser.setUsername(username);
		updatedUser.setFirstname(firstname);
		updatedUser.setLastname(lastname);
		updatedUser.setActive(active);
		updatedUser.setCustomerName(customerName);
		updatedUser.setEmail(email);
		updatedUser.setAccount_type(accounttype);
		updatedUser.setStart_date(new Date(sdate.getTime()));
		updatedUser.setEnd_date(new Date(edate.getTime()));
		/*
		 * if (sdate != "") { java.util.Date stemp = sdf.parse(sdate); Date startdate =
		 * new Date(stemp.getTime()); updatedUser.setStart_date(startdate); }
		 */
		/*
		 * if (edate != "") { java.util.Date etemp = sdf.parse(edate); Date enddate =
		 * new Date(etemp.getTime()); updatedUser.setEnd_date(enddate); }
		 */
		this.managerservice.updateUser(updatedUser);
		return mav;
	}

	@RequestMapping(value = { "/manager/importContent" }, method = RequestMethod.GET)
	public ModelAndView fileUpload() {
		return new ModelAndView("uploadContent");
	}

	@RequestMapping(value = { "/manager/importContent" }, method = RequestMethod.POST)
	public ResponseEntity<Object> fileUpload(@RequestParam("file") MultipartFile file)
			throws IOException, ParserConfigurationException, SAXException {
		this.managerservice.uploadContentModule(file);
		// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserImpl user = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		user.setContents(this.userService.getAssignedContent(user.getUser_id()));

		return new ResponseEntity<>("done!!", HttpStatus.OK);
	}

	@RequestMapping(value = { "/manager/title-management" })
	public ModelAndView titleManager(ModelAndView mav) {
		mav.setViewName("Title_Management");
		mav.addObject("titleList", this.managerservice.getContentInfo());
		return mav;
	}

	@RequestMapping(value = { "/manager/deleteTitle" }, method = RequestMethod.POST)
	public ModelAndView deletetitle(ModelAndView mav, @RequestParam("deleteID") String deleteID) {
		mav.setViewName("redirect:/manager/title-management");
		this.managerservice.deleteTitle(deleteID);
		return mav;
	}

	@RequestMapping(value = { "/manager/userGroup-management" })
	public ModelAndView userGroupManager(ModelAndView mav) {
		mav.setViewName("userGroupManager");
		mav.addObject("userGroupList", this.managerservice.getUserGroupList());
		return mav;
	}

	@RequestMapping(value = { "/manager/addUserGroup" }, method = RequestMethod.POST)
	public ModelAndView addUserGroup(ModelAndView mav, @RequestParam("usergroup") String usergroupname) {
		mav.setViewName("redirect:/manager/userGroup-management");
		this.managerservice.addUserGroup(new UserGroup(usergroupname));
		return mav;
	}

	@RequestMapping(value = { "/manager/deleteUserGroup" }, method = RequestMethod.POST)
	public ModelAndView deleteUserGroup(ModelAndView mav, @RequestParam("deleteID") long userGroupID) {
		mav.setViewName("redirect:/manager/userGroup-management");
		this.managerservice.deleteUserGroup(userGroupID);
		// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (!SecurityContextHolder.getContext().getAuthentication().getName().equals("admin1")) {
			UserImpl user = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			user.setContents(this.userService.getAssignedContent(user.getUser_id()));
		}
		return mav;
	}

	@RequestMapping(value = { "/manager/getUserGroupInfo" }, method = RequestMethod.POST)
	public void getUserGroupInfo(HttpServletResponse response, @RequestParam("usergroupID") long id)
			throws IOException {
		this.userinUserGroupList = this.managerservice.getUsersInUserGroup(id);
		this.contentinUserGroupList = this.managerservice.getContentInUserGroup(id);

		ArrayList<Object> userGroupInfo = new ArrayList<>();
		userGroupInfo.add(this.managerservice.getUsersNotInUserGroup(id));
		userGroupInfo.add(this.userinUserGroupList);
		userGroupInfo.add(this.managerservice.getContentNotInUserGroup(id));
		userGroupInfo.add(this.contentinUserGroupList);

		Gson gson = new Gson();
		JsonElement element = gson.toJsonTree(userGroupInfo, new TypeToken<ArrayList<Object>>() {
		}.getType());
		JsonArray info = element.getAsJsonArray();
		response.setContentType("application/json");
		response.getWriter().print(info);
	}

	@RequestMapping(value = { "/manager/updateUsers_UserGroup" }, method = RequestMethod.POST)
	public void UserGroupInfo(HttpServletResponse response, @RequestParam("usergroupID") long usergroupID,
			@RequestParam(required = false, name = "contentList") HashSet<String> updatedContentIDList,
			@RequestParam(required = false, name = "userList") HashSet<Long> updatedUserIDList) {

		this.managerservice.updateUserGroup(usergroupID, this.userinUserGroupList, updatedUserIDList, this.contentinUserGroupList,
				updatedContentIDList);
		if (!SecurityContextHolder.getContext().getAuthentication().getName().equals("admin1")) {
			UserImpl user = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			user.setContents(this.userService.getAssignedContent(user.getUser_id()));
		}
	}

	@RequestMapping(value = { "/manager/updateContent" }, method = RequestMethod.POST)
	public void contentUpdate(HttpServletResponse response, @RequestParam("titleID") String titleID,
			@RequestParam("titleName") String titleName, @RequestParam("contentType") String contentType,
			@RequestParam("app") String app) {
		this.managerservice.updateContent(titleID, titleName, contentType, app);
	}

	@RequestMapping(value = { "/manager/updatePath" }, method = RequestMethod.POST)
	public ModelAndView updateContentPath(ModelAndView mav, HttpServletResponse response,
			@RequestParam("titleID") String titleID, @RequestParam("contentPath") String path) {
		this.managerservice.updateContentPath(titleID, path);
		mav.setViewName("redirect:/manager/title-management");
		return mav;
	}
}