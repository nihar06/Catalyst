package com.kbace.changemanagement.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.UserDAO;
import com.kbace.changemanagement.entity.CatalystUser;

@Repository
@Transactional
public class UserDAOImpl implements UserDAO {

	private SessionFactory sessionFactory;

	@Autowired
	public UserDAOImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public CatalystUser getUser(String username) {
		String active = "yes";
		Session session = this.sessionFactory.getCurrentSession();
		Query finduser = session.createQuery("from CatalystUser where username = :username AND UPPER(active) = UPPER(:active) AND end_date >= SYSDATE");
		finduser.setParameter("username", username);
		finduser.setParameter("active", active.toUpperCase());
		return (CatalystUser) finduser.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<CatalystUser> getAllUsers() {
		Session session = this.sessionFactory.getCurrentSession();
		return session.createQuery("from CatalystUser").list();
	}

	@Override
	public void addUser(CatalystUser newUser) {
		Session session = this.sessionFactory.getCurrentSession();
		session.persist(newUser);
	}

	@Override
	public void deleteUser(long id) {
		Session session = this.sessionFactory.getCurrentSession();
		session.delete(session.load(CatalystUser.class, id));
	}

	@Override
	public void updateUser(CatalystUser updatedUser) {
		Session session = this.sessionFactory.getCurrentSession();
		session.update(updatedUser);
	}

	@Override
	public CatalystUser getUserInfoByID(long userID) {
		Session session = this.sessionFactory.getCurrentSession();
		Query finduser = session.createQuery("from CatalystUser where user_id=" + userID);
		return (CatalystUser) finduser.uniqueResult();
	}

	@Override
	public void resetPassword(long id, String password) {
		Session session = this.sessionFactory.getCurrentSession();
		CatalystUser user = session.load(CatalystUser.class, id);
		user.setPassword(password);
		session.update(user);
	}


}
