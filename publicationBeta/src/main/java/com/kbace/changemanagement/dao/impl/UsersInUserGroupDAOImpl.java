package com.kbace.changemanagement.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.UsersInUserGroupDAO;
import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.UserInUserGroup;

@Repository
@Transactional
public class UsersInUserGroupDAOImpl implements UsersInUserGroupDAO {

	private SessionFactory sessionFactory;

	@Autowired
	public UsersInUserGroupDAOImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<CatalystUser> usersNotInUserGroup(long id) {
		return this.sessionFactory.getCurrentSession().createQuery("FROM CatalystUser WHERE user_id NOT IN "
				+ "( SELECT user_ID FROM UserInUserGroup WHERE usergroup_ID =" + id + " )").list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<CatalystUser> usersInUserGroup(long id) {

		return this.sessionFactory.getCurrentSession().createQuery("FROM CatalystUser WHERE user_id IN "
				+ "( SELECT user_ID FROM UserInUserGroup WHERE usergroup_ID =" + id + " )").list();
	}

	@Override
	public void addUser(UserInUserGroup userinUserGroup) {
		this.sessionFactory.getCurrentSession().persist(userinUserGroup);
	}

	@Override
	public void deleteUser(UserInUserGroup userinUserGroup) {
		this.sessionFactory.getCurrentSession().delete(userinUserGroup);
	}
}