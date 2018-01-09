package com.kbace.changemanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kbace.changemanagement.authentication.UserImpl;
import com.kbace.changemanagement.service.UserService;

import static com.kbace.changemanagement.util.DirectoryConstants.*;

import javax.servlet.http.HttpServletResponse;

@Controller
public class UserController {

	@Autowired
	private UserService userServie;

	@RequestMapping(value = { "/" + VIRTUAL_DIR + "/{contentID}/**.html" }, method = RequestMethod.GET)
	public String retriveContent(@PathVariable String contentID, HttpServletResponse httpServletResponse) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserImpl user = (UserImpl) auth.getPrincipal();
		if (userServie.checkAssignemnt(contentID, user.getUser_id()))
			return "forward:/" + PHYSICAL_DIR_NAME + "/" + contentID + "/index.html";
		else
			return "redirect:/403";
	}

	@RequestMapping(value = { "/" + PHYSICAL_DIR_NAME + "/{contentID}/data/**.html" }, method = RequestMethod.GET)
	public String check(@PathVariable String contentID, HttpServletResponse httpServletResponse) {
		return "/403";
	}
	
	
	@RequestMapping(value = { "/" + VIRTUAL_DIR + "/{contentID}/{path}.js",
			"/" + VIRTUAL_DIR + "/{contentID}/{path}.js" }, method = RequestMethod.GET)
	public String redirectJS(@PathVariable String contentID, @PathVariable String path) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserImpl user = (UserImpl) auth.getPrincipal();
		if (userServie.checkAssignemnt(contentID, user.getUser_id()))
			return "forward:/" + PHYSICAL_DIR_NAME + "/" + contentID + "/" + path + ".js";
		else
			return "redirect:/403";
	}
}