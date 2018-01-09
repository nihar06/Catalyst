package com.kbace.changemanagement.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Content")
public class Content implements Serializable {

	private static final long serialVersionUID = -3111388178439326361L;

	private String content_id;
	private String title;
	private String content_path;
	private String content_Type;
	private Timestamp last_updated;
	private String application;

	@Id
	@Column(name = "Content_id", nullable = false)
	public String getContent_id() {
		return content_id;
	}

	public void setContent_id(String content_id) {
		this.content_id = content_id;
	}

	@Column(name = "CONTENT_TITLE", nullable = false)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "content_path", nullable = false)
	public String getContent_path() {
		return content_path;
	}

	public void setContent_path(String content_path) {
		this.content_path = content_path;
	}

	@Column(name = "content_type")
	public String getContent_Type() {
		return content_Type;
	}

	public void setContent_Type(String content_Type) {
		this.content_Type = content_Type;
	}

	@Column(name = "last_updated")
	public Timestamp getLast_updated() {
		return last_updated;
	}

	public void setLast_updated(Timestamp last_updated) {
		this.last_updated = last_updated;
	}

	@Column(name = "application")
	public String getApplication() {
		return application;
	}

	public void setApplication(String application) {
		this.application = application;
	}

}
