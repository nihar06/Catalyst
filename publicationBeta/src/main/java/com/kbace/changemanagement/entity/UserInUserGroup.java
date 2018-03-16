package com.kbace.changemanagement.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@IdClass(UserinUserGroupID.class)
@Table(name = "user_in_usergroup")
public class UserInUserGroup implements Serializable {

	private static final long serialVersionUID = -6629205041260561955L;
	@Id
	private long usergroup_ID;
	@Id
	private long user_ID;

	public UserInUserGroup() {
	}

	public UserInUserGroup(long usergroup_ID, long user_ID) {
		this.usergroup_ID = usergroup_ID;
		this.user_ID = user_ID;
	}

	@Column(name = "usergroup_id")
	public long getUsergroupID() {
		return this.usergroup_ID;
	}

	public void setUsergroupID(long usergroupID) {
		this.usergroup_ID = usergroupID;
	}

	@Column(name = "user_id")
	public long getUserID() {
		return this.user_ID;
	}

	public void setUserID(long userID) {
		this.user_ID = userID;
	}
}
