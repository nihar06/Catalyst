package com.kbace.changemanagement.dao;

import java.util.List;

import com.kbace.changemanagement.entity.CatalystUser;

public interface UserDAO {

	public CatalystUser getUser(String username);

	public List<CatalystUser> getAllUsers();

	public void addUser(CatalystUser newUser);

	public void deleteUser(long id);

	public void updateUser(CatalystUser updatedUser);

	public CatalystUser getUserInfoByID(long userID);
	
	public void resetPassword(long id, String password);
}