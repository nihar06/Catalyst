package com.kbace.changemanagement.dao;

import java.util.List;

import com.kbace.changemanagement.entity.Content;
import com.kbace.changemanagement.entity.ContentInUserGroup;

public interface ContentInUserGroupDAO {
	
	public List<Content> contentNotInUserGroup(long id);

	public List<Content> contentInUserGroup(long id);

	public void addContent(ContentInUserGroup userinUserGroup);

	public void deleteContent(ContentInUserGroup userinUserGroup);

}
