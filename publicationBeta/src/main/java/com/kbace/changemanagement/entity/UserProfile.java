package com.kbace.changemanagement.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userprofile")
public class UserProfile implements Serializable {

	private static final long serialVersionUID = -1470550047247844822L;

	private long user_id;
	private Timestamp last_login;

	@Id
	@Column(name = "user_id", nullable = false)
	public long getUser_id() {
		return user_id;
	}

	public void setUser_id(long user_id) {
		this.user_id = user_id;
	}

	@Column(name = "last_date")
	public Timestamp getLast_login() {
		return last_login;
	}

	public void setLast_login(Timestamp last_login) {
		this.last_login = last_login;
	}
}
