package com.kbace.changemanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.ContentDAO;
import com.kbace.changemanagement.dao.UserDAO;
import com.kbace.changemanagement.dao.UserProfileDAO;
import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.Content;

@Transactional
@Service
public class UserService {

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private ContentDAO contentDAO;

	@Autowired
	private UserProfileDAO userProfileDAO;

	@Autowired
	private PasswordEncoder passwordEncroder;

	public CatalystUser findUser(String username) {
		return userDAO.getUser(username);
	}

	public void updateLastLogin(long userID) {
		userProfileDAO.updateLastlogin(userID);
	}

	// get all assigned content for user
	public List<Content> getAssignedContent(long userID) {
		return contentDAO.getAssignedContent(userID);
	}

	// check is user is assigned to requested contentID
	public boolean checkAssignemnt(String contentID, long userID) {
		return contentDAO.checkAssignemnt(contentID, userID);
	}

	public boolean isAdminUser(String username, String password) {
		CatalystUser catalystUser = findUser(username);
		if (passwordEncroder.matches(password, catalystUser.getPassword())) {
			if (catalystUser.getAccount_type().equalsIgnoreCase("ADMIN"))
				return true;
		}
		return false;

	}

}
