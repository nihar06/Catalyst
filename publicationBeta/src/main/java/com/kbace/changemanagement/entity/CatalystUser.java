package com.kbace.changemanagement.entity;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "catalyst_user")
public class CatalystUser implements Serializable {

	private static final long serialVersionUID = 2346096033912142264L;

	private long user_id;
	private String username;
	private String password;
	private String firstname;
	private String lastname;
	private String active;
	private String customerName;
	private String email;
	private String account_type;
	private Date start_date;
	private Date end_date;

	public CatalystUser(String username, String password, String firstname, String lastname, String active,
			String customerName, String email, String account_type, Date start_date, Date end_date) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.active = active;
		this.customerName = customerName;
		this.email = email;
		this.account_type = account_type;
		this.start_date = start_date;
		this.end_date = end_date;
	}
	
	public CatalystUser() {
	}

	@Id
	@Column(name = "user_id", nullable = false)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "UserID_seq")
	@SequenceGenerator(name = "UserID_seq", sequenceName = "UserID_seq")
	public long getUser_id() {
		return this.user_id;
	}

	public void setUser_id(long user_id) {
		this.user_id = user_id;
	}

	@Column(name = "username", length = 50, nullable = false, unique = true)
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "password", length = 2000, nullable = false)
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "firstname", length = 20)
	public String getFirstname() {
		return this.firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	@Column(name = "lastname", length = 20)
	public String getLastname() {
		return this.lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	@Column(name = "active", length = 3, nullable = false)
	public String getActive() {
		return this.active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	@Column(name = "customer_name", length = 20)
	public String getCustomerName() {
		return this.customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Column(name = "email", length = 50)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "account_type")
	public String getAccount_type() {
		return this.account_type;
	}

	public void setAccount_type(String account_type) {
		this.account_type = account_type;
	}

	@Column(name = "start_date", nullable = true)
	public Date getStart_date() {
		return this.start_date;
	}

	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}

	@Column(name = "end_date", nullable = true)
	public Date getEnd_date() {
		return this.end_date;
	}

	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}
}
