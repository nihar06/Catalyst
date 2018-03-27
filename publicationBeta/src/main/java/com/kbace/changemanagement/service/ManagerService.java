package com.kbace.changemanagement.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
import com.opencsv.CSVReader;

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
		newUser.setPassword(this.passwordEncroder.encode(newUser.getPassword()));
		this.userDAO.addUser(newUser);
	}

	public void deleteUser(long id) {
		this.userDAO.deleteUser(id);
	}

	public void resetPassword(long id, String password) {
		this.userDAO.resetPassword(id, this.passwordEncroder.encode(password));
	}

	// updates edited user. USER-ID AND PASSWORD ARE NOT UPDATED BY THIS METHOD.
	public void updateUser(CatalystUser updatedUser) {
		this.userDAO.updateUser(updatedUser);
	}

	// get details of all users.
	public List<CatalystUser> getUserList() {
		return this.userDAO.getAllUsers();
	}

	// get user info by id. THIS IS USED IN ORDER TO UPDATE USER. USER-ID AND
	// PASSWORD ARE NOT UPDATED BY THIS METHOD.
	public CatalystUser getUserInfoByID(long userID) {
		return this.userDAO.getUserInfoByID(userID);
	}

	// upload content/title onserver. It uploads, unzip, rename folder by ID and
	// replace toc.html file with custom file.
	// Info is stored in database too.
	public void uploadContentModule(MultipartFile file) throws IOException, ParserConfigurationException, SAXException {
		// String filename = fileUtilities.uploadFile(file);
		if (this.unzipModule.unzip(UPLOAD_DIRECTORY + File.separator + this.fileUtilities.uploadFile(file),
				UNZIP_DIRECTORY)) {
			this.fileUtilities.replaceFile(
					this.contentDAO.saveModule(this.xmlReader.getContentInfo(UNZIP_DIRECTORY)).getContent_id());
		}
	}

	// get list of all titles available
	public List<Content> getContentInfo() {
		return this.contentDAO.getContentList();
	}

	// delete title. Also delete directory from server.
	public void deleteTitle(String titleID) {
		this.contentDAO.deleteTitleById(titleID);
		this.fileUtilities.deleteFile(UPLOAD_DIRECTORY + File.separator + titleID);
	}

	// add new UserGroup.
	public void addUserGroup(UserGroup userGroup) {
		this.userGroupDAO.addUserGroup(userGroup);
	}

	// add new UserGroup.
	public void deleteUserGroup(long userGroupID) {
		this.userGroupDAO.deleteUserGroup(userGroupID);
	}

	// get list of all UserGroup
	public List<UserGroup> getUserGroupList() {
		return this.userGroupDAO.getUserGroupList();
	}

	// get list of user which are not assigned to user group
	public List<CatalystUser> getUsersNotInUserGroup(long id) {
		return this.userInUserGroupDAO.usersNotInUserGroup(id);
	}

	// get list of user which are assigned to user group
	public List<CatalystUser> getUsersInUserGroup(long id) {
		return this.userInUserGroupDAO.usersInUserGroup(id);
	}

	// get list of user which are not assigned to user group
	public List<Content> getContentNotInUserGroup(long id) {
		return this.contentInUserGroupDAO.contentNotInUserGroup(id);
	}

	// get list of user which are assigned to user group
	public List<Content> getContentInUserGroup(long id) {
		return this.contentInUserGroupDAO.contentInUserGroup(id);
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
		// copying oldUser IDs
		HashSet<Long> oldUserIds = new HashSet<>();
		for (CatalystUser user : oldUserList) {
			oldUserIds.add(user.getUser_id());
		}
		// copying old User Content
		HashSet<String> oldContentIds = new HashSet<>();
		for (Content content : oldContentList) {
			oldContentIds.add(content.getContent_id());
		}

		// oldUserIds will contain ids to be deleted and newUserIds will contain ids to
		// be added
		HashSet<Long> tempUserids = new HashSet<>();
		tempUserids.addAll(oldUserIds);
		oldUserIds.removeAll(newUserIds);
		newUserIds.removeAll(tempUserids);

		// deleting old ids
		for (Long id : oldUserIds) {
			this.userInUserGroupDAO.deleteUser(new UserInUserGroup(userGroupId, id));
		}
		// adding new Ids
		for (Long id : newUserIds) {
			this.userInUserGroupDAO.addUser(new UserInUserGroup(userGroupId, id));
		}

		// oldContentIds will contain ids to be deleted and newContentIds will contain
		// ids to add
		HashSet<String> tempContentids = new HashSet<>();
		tempContentids.addAll(oldContentIds);
		oldContentIds.removeAll(newContentIds);
		newContentIds.removeAll(tempContentids);

		// deleting old ids
		for (String id : oldContentIds) {
			this.contentInUserGroupDAO.deleteContent(new ContentInUserGroup(userGroupId, id));
		}
		// adding new Ids
		for (String id : newContentIds) {
			this.contentInUserGroupDAO.addContent(new ContentInUserGroup(userGroupId, id));
		}
	}

	// add contentType in Content table
	public void updateContent(String titleID, String titleName, String contentType, String app) {
		this.contentDAO.updateContent(titleID, titleName, contentType, app);
	}

	// updates the content path.
	public void updateContentPath(String contentID, String path) {
		this.contentDAO.updatePath(path, contentID);
	}

	// import multiple users via csv file.
	public void importUsers(MultipartFile file) throws IOException, ParseException {
		try (CSVReader readFile = new CSVReader(
				Files.newBufferedReader(Paths.get(UPLOAD_DIRECTORY, this.fileUtilities.uploadFile(file))))) {
			String[] nextRecord;
			while ((nextRecord = readFile.readNext()) != null) {
				addNewUser(new CatalystUser(nextRecord[0], nextRecord[1], nextRecord[2], nextRecord[3], nextRecord[4],
						nextRecord[5], nextRecord[6], nextRecord[7],
						new Date(new SimpleDateFormat("MM/dd/yyyy").parse(nextRecord[8]).getTime()),
						new Date(new SimpleDateFormat("MM/dd/yyyy").parse(nextRecord[9]).getTime())));
			}
		}
	}
}