package com.kbace.changemanagement.service;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import com.kbace.changemanagement.dao.ContentDAO;
import com.kbace.changemanagement.dao.ContentInUserGroupDAO;
import com.kbace.changemanagement.dao.UserDAO;
import com.kbace.changemanagement.dao.UserGroupDAO;
import com.kbace.changemanagement.dao.UsersInUserGroupDAO;
import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.Content;
import com.kbace.changemanagement.entity.ContentInUserGroup;
import com.kbace.changemanagement.entity.UserGroup;
import com.kbace.changemanagement.entity.UserInUserGroup;
import com.kbace.changemanagement.util.UnzipModule;
import com.kbace.changemanagement.util.FileUtilities;
import com.kbace.changemanagement.util.XMLReader;

import static com.kbace.changemanagement.util.DirectoryConstants.*;

@Transactional
@Service
public class ManagerService {

	@Autowired
	private UserDAO userDAO;
	@Autowired
	private PasswordEncoder passwordEncroder;
	@Autowired
	private UnzipModule unzipModule;
	@Autowired
	private FileUtilities fileUtilities;
	@Autowired
	private XMLReader xmlReader;
	@Autowired
	private ContentDAO contentDAO;
	@Autowired
	private UserGroupDAO userGroupDAO;
	@Autowired
	private UsersInUserGroupDAO userInUserGroupDAO;
	@Autowired
	private ContentInUserGroupDAO contentInUserGroupDAO;

	// add new user
	public void addNewUser(CatalystUser newUser) {
		newUser.setPassword(passwordEncroder.encode(newUser.getPassword()));
		userDAO.addUser(newUser);
	}

	public void deleteUser(long id) {
		userDAO.deleteUser(id);
	}

	public void resetPassword(long id, String password) {
	
		userDAO.resetPassword(id, passwordEncroder.encode(password));
	}

	// updates edited user. USER-ID AND PASSWORD ARE NOT UPDATED BY THIS METHOD.
	public void updateUser(CatalystUser updatedUser) {
		userDAO.updateUser(updatedUser);
	}

	// get details of all users.
	public List<CatalystUser> getUserList() {
		List<CatalystUser> users = userDAO.getAllUsers();
		return users;
	}

	// get user info by id. THIS IS USED IN ORDER TO UPDATE USER. USER-ID AND
	// PASSWORD ARE NOT UPDATED BY THIS METHOD.
	public CatalystUser getUserInfoByID(long userID) {
		return userDAO.getUserInfoByID(userID);
	}

	// upload content/title onserver. It uploads, unzip, and rename folder by ID.
	// Info is stored in database too.
	public void uploadContentModule(MultipartFile file) throws IOException, ParserConfigurationException, SAXException {
//		String filename = fileUtilities.uploadFile(file);
		unzipModule.unzip(UPLOAD_DIRECTORY + File.separator + fileUtilities.uploadFile(file), UNZIP_DIRECTORY);
//		Content content = xmlReader.getContentInfo(UNZIP_DIRECTORY);
		contentDAO.saveModule(xmlReader.getContentInfo(UNZIP_DIRECTORY));
	}

	// get list of all titles available
	public List<Content> getContentInfo() {
		List<Content> titleDetails = contentDAO.getContentList();
		return titleDetails;
	}

	// delete title. Also delete directory from server.
	public void deleteTitle(String titleID) {
		contentDAO.deleteTitleById(titleID);
		fileUtilities.deleteFile(titleID);
	}

	// add new UserGroup.
	public void addUserGroup(UserGroup userGroup) {
		userGroupDAO.addUserGroup(userGroup);
	}

	// add new UserGroup.
	public void deleteUserGroup(long userGroupID) {
		userGroupDAO.deleteUserGroup(userGroupID);
	}

	// get list of all UserGroup
	public List<UserGroup> getUserGroupList() {
		return userGroupDAO.getUserGroupList();
	}

	// get list of user which are not assigned to user group
	public List<CatalystUser> getUsersNotInUserGroup(long id) {
		return userInUserGroupDAO.usersNotInUserGroup(id);
	}

	// get list of user which are assigned to user group
	public List<CatalystUser> getUsersInUserGroup(long id) {
		return userInUserGroupDAO.usersInUserGroup(id);
	}

	// get list of user which are not assigned to user group
	public List<Content> getContentNotInUserGroup(long id) {
		return contentInUserGroupDAO.contentNotInUserGroup(id);
	}

	// get list of user which are assigned to user group
	public List<Content> getContentInUserGroup(long id) {
		return contentInUserGroupDAO.contentInUserGroup(id);
	}

	// update usergroup user and file assignment
	public void updateUserGroup(Long userGroupId, List<CatalystUser> oldUserList, HashSet<Long> newUserIds,
			List<Content> oldContentList, HashSet<String> newContentIds) {

		if (newUserIds == null) {
			newUserIds = new HashSet<>();
		}

		if (newContentIds == null) {
			newContentIds = new HashSet<>();
		}

		HashSet<Long> oldUserIds = new HashSet<>();
		for (CatalystUser user : oldUserList) {
			oldUserIds.add(user.getUser_id());
		}

		HashSet<String> oldContentIds = new HashSet<>();
		for (Content content : oldContentList) {
			oldContentIds.add(content.getContent_id());
		}

		HashSet<Long> tempUserids = new HashSet<>();
		tempUserids.addAll(oldUserIds);
		oldUserIds.removeAll(newUserIds);
		newUserIds.removeAll(tempUserids);

		for (Long id : oldUserIds) {
			userInUserGroupDAO.deleteUser(new UserInUserGroup(userGroupId, id));
		}
		for (Long id : newUserIds) {
			userInUserGroupDAO.addUser(new UserInUserGroup(userGroupId, id));
		}

		HashSet<String> tempContentids = new HashSet<>();
		tempContentids.addAll(oldContentIds);
		oldContentIds.removeAll(newContentIds);
		newContentIds.removeAll(tempContentids);
		for (String id : oldContentIds) {
			contentInUserGroupDAO.deleteContent(new ContentInUserGroup(userGroupId, id));
		}

		for (String id : newContentIds) {
			contentInUserGroupDAO.addContent(new ContentInUserGroup(userGroupId, id));
		}
	}

	// add contentType in Content table
	public void updateContent(String titleID, String contentType, String app) {
		contentDAO.updateContent(titleID, contentType, app);
	}
}