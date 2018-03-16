package com.kbace.changemanagement.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "usergroup")
public class UserGroup implements Serializable {

	private static final long serialVersionUID = -974770717383262693L;

	private long userGroup_id;
	private String userGroup_name;

	public UserGroup(String userGroup_name) {
		this.userGroup_name = userGroup_name;
	}
	
	public UserGroup() {
	}

	@Id
	@Column(name = "usergroup_id", nullable = false)
	public long getUserGroup_id() {
		return this.userGroup_id;
	}

	public void setUserGroup_id(long userGroup_id) {
		this.userGroup_id = userGroup_id;
	}

	@Column(name = "usergroupname", nullable = false, unique = true)
	public String getUserGroup_name() {
		return this.userGroup_name;
	}

	public void setUserGroup_name(String userGroup_name) {
		this.userGroup_name = userGroup_name;
	}
}
