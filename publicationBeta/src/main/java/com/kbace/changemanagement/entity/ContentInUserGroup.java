package com.kbace.changemanagement.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@IdClass(ContentinUserGroupID.class)
@Table(name = "content_in_usergroup")
public class ContentInUserGroup implements Serializable {

	private static final long serialVersionUID = 1949965029617760253L;

	@Id
	private long usergroup_ID;
	@Id
	private String Content_id;

	public ContentInUserGroup() {
	}

	public ContentInUserGroup(long usergroup_ID, String Content_id) {
		this.usergroup_ID = usergroup_ID;
		this.Content_id = Content_id;
	}
	
	
	@Column(name = "usergroup_id")
	public long getUsergroup_ID() {
		return this.usergroup_ID;
	}

	public void setUsergroup_ID(long usergroup_ID) {
		this.usergroup_ID = usergroup_ID;
	}

	@Column(name = "content_id")
	public String getContent_ID() {
		return this.Content_id;
	}

	public void setContent_ID(String content_ID) {
		this.Content_id = content_ID;
	}
}