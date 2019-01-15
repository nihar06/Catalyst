package com.kbace.changemanagement.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.ContentInUserGroupDAO;
import com.kbace.changemanagement.entity.Content;
import com.kbace.changemanagement.entity.ContentInUserGroup;

@Repository
@Transactional
public class ContentInUserGroupDAOImpl implements ContentInUserGroupDAO {

	private SessionFactory sessionFactory;

	public ContentInUserGroupDAOImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> contentNotInUserGroup(long id) {

		return this.sessionFactory.getCurrentSession().createQuery("FROM Content WHERE Content_id NOT IN "
				+ "( SELECT Content_id FROM ContentInUserGroup WHERE usergroup_ID =" + id + " )").list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> contentInUserGroup(long id) {

		return this.sessionFactory.getCurrentSession().createQuery("FROM Content WHERE Content_id IN "
				+ "( SELECT Content_id FROM ContentInUserGroup WHERE usergroup_ID =" + id + " )").list();
	}

	@Override
	public void addContent(ContentInUserGroup contentinUserGroup) {
		this.sessionFactory.getCurrentSession().persist(contentinUserGroup);
	}

	@Override
	public void deleteContent(ContentInUserGroup contentinUserGroup) {
		this.sessionFactory.getCurrentSession().delete(contentinUserGroup);
	}

}