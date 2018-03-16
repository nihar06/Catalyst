package com.kbace.changemanagement.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.UserGroupDAO;
import com.kbace.changemanagement.entity.UserGroup;

@Repository
@Transactional
public class UserGroupDAOImpl implements UserGroupDAO {

	private SessionFactory sessionFactory;

	@Autowired
	public UserGroupDAOImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void addUserGroup(UserGroup userGroup) {
		this.sessionFactory.getCurrentSession().persist(userGroup);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<UserGroup> getUserGroupList() {
		return this.sessionFactory.getCurrentSession().createQuery("from UserGroup").list();
	}

	@Override
	public void deleteUserGroup(long id) {
		this.sessionFactory.getCurrentSession().delete(this.sessionFactory.getCurrentSession().load(UserGroup.class, id));
	}
}