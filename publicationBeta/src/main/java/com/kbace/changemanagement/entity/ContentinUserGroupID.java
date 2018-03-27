package com.kbace.changemanagement.entity;

import java.io.Serializable;

public class ContentinUserGroupID implements Serializable {

	private static final long serialVersionUID = -3566322020467098762L;

	protected long usergroup_ID;
	protected String Content_id;

	public ContentinUserGroupID() {
	}

	public ContentinUserGroupID(long usergroup_ID, String content_ID) {
		this.usergroup_ID = usergroup_ID;
		this.Content_id = content_ID;
	}
}