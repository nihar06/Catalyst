package com.kbace.changemanagement.authentication;

import java.sql.Date;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.Content;

public class UserImpl extends User {

	private static final long serialVersionUID = 692422664225009699L;
	private long user_id;
	private String firstname;
	private String lastname;
	private String active;
	private String customerName;
	private String email;
	private String account_type;
	private Date start_date;
	private Date end_date;
	private List<Content> contents;

	public UserImpl(CatalystUser user, Collection<? extends GrantedAuthority> authorities, List<Content> contents) {

		super(user.getUsername(), user.getPassword(), authorities);

		this.user_id = user.getUser_id();
		this.firstname = user.getFirstname();
		this.lastname = user.getLastname();
		this.active = user.getActive();
		this.customerName = user.getCustomerName();
		this.email = user.getEmail();
		this.account_type = user.getAccount_type();
		this.start_date = user.getStart_date();
		this.end_date = user.getEnd_date();
		this.contents = contents;
	}

	public long getUser_id() {
		return this.user_id;
	}

	public void setUser_id(long user_id) {
		this.user_id = user_id;
	}

	public String getFirstname() {
		return this.firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return this.lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getActive() {
		return this.active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public String getCustomerName() {
		return this.customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAccount_type() {
		return this.account_type;
	}

	public void setAccount_type(String account_type) {
		this.account_type = account_type;
	}

	public Date getStart_date() {
		return this.start_date;
	}

	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}

	public Date getEnd_date() {
		return this.end_date;
	}

	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}

	public List<Content> getContents() {
		return this.contents;
	}

	public void setContents(List<Content> contents) {
		this.contents = contents;
	}
}
