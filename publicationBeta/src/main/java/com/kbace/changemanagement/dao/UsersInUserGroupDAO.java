package com.kbace.changemanagement.dao;

import java.util.List;

import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.UserInUserGroup;

public interface UsersInUserGroupDAO {

	public List<CatalystUser> usersNotInUserGroup(long id);

	public List<CatalystUser> usersInUserGroup(long id);

	public void addUser(UserInUserGroup userinUserGroup);

	public void deleteUser(UserInUserGroup userinUserGroup);

}
