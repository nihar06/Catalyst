package com.kbace.changemanagement.controller;

import java.io.IOException;

import javax.servlet.http.HttpSession;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.xml.sax.SAXException;

import com.kbace.changemanagement.authentication.UserImpl;
import com.kbace.changemanagement.service.ManagerService;
import com.kbace.changemanagement.service.UserService;

@Controller
public class MainController {

	@Autowired
	private ManagerService managerservice;
	@Autowired
	private UserService userservice;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public ModelAndView login(Model model, HttpSession session) {
		ModelAndView mav = new ModelAndView("login");

		// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (!(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {
			mav.setViewName("redirect:/");
		}
		return mav;
	}

	@RequestMapping(value = { "/", "/home" }, method = RequestMethod.GET)
	public ModelAndView home(Model model, HttpSession session) {
		ModelAndView mav = new ModelAndView("Home");

		// Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (!SecurityContextHolder.getContext().getAuthentication().getName().equals("admin1")) {
			UserImpl user = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			mav.addObject("contents", user.getContents());
			mav.addObject("accountType", user.getAccount_type());
		}
		return mav;
	}

	@RequestMapping("/403")
	public String AccessDenied(Model model) {
		System.out.println("Access denied..");
		return "403";
	}

	@RequestMapping("/index")
	public String Index(Model model) {
		System.out.println("Access denied..");
		return "index";
	}

	@RequestMapping(value = { "/importContent" }, method = RequestMethod.POST)
	public ResponseEntity<Object> fileUpload(@RequestParam("file") MultipartFile file,
			@RequestParam("username") String username, @RequestParam("password") String password)
			throws IOException, ParserConfigurationException, SAXException {
		if (userservice.isAdminUser(username, password)) {
			managerservice.uploadContentModule(file);
			return new ResponseEntity<>("Done!!", HttpStatus.OK);
		}
		return new ResponseEntity<>("Fail!!", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}