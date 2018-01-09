package com.kbace.changemanagement.dao;

import java.util.List;

import com.kbace.changemanagement.entity.UserGroup;

public interface UserGroupDAO {
	
	public void addUserGroup(UserGroup userGroup);
	public List<UserGroup> getUserGroupList();
	public void deleteUserGroup(long id);
}
