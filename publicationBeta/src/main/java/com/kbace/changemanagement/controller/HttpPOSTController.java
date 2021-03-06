package com.kbace.changemanagement.controller;

import java.io.IOException;
import java.text.ParseException;

import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import com.kbace.changemanagement.service.ManagerService;
import com.kbace.changemanagement.service.UserService;

@Controller
public class HttpPOSTController {

	private ManagerService managerService;
	private UserService userService;

	@Autowired
	public HttpPOSTController(ManagerService managerService, UserService userService) {
		this.managerService = managerService;
		this.userService = userService;
	}

	@RequestMapping(value = { "/importContent" }, method = RequestMethod.POST)
	public ResponseEntity<Object> fileUpload(@RequestParam("file") MultipartFile file,
			@RequestParam("username") String username, @RequestParam("password") String password)
			throws IOException, ParserConfigurationException, SAXException {
		if (this.userService.isAdminUser(username, password)) {
			this.managerService.uploadContentModule(file);
			return new ResponseEntity<>("Done!!", HttpStatus.OK);
		}
		return new ResponseEntity<>("Fail!!", HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = { "/importUserData" }, method = RequestMethod.POST)
	public ResponseEntity<Object> bulkLoad_UserList(@RequestParam("usersList") MultipartFile usersCsvFile,
			@RequestParam("username") String username, @RequestParam("password") String password)
			throws IOException, ParseException {
		if (this.userService.isAdminUser(username, password)) {
			this.managerService.importUsers(usersCsvFile);
			return new ResponseEntity<>("Done!!", HttpStatus.OK);
		}
		return new ResponseEntity<>("Fail!!", HttpStatus.FORBIDDEN);
	}
}