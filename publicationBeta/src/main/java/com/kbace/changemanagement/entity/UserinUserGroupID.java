package com.kbace.changemanagement.entity;

import java.io.Serializable;

public class UserinUserGroupID implements Serializable {
	private static final long serialVersionUID = 8963997883855245976L;

	protected long usergroup_ID;
	protected long user_ID;

	public UserinUserGroupID() {
	}

	public UserinUserGroupID(long usergroupID, long userID) {
		this.usergroup_ID = usergroupID;
		this.user_ID = userID;
	}
}
