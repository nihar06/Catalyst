package com.kbace.changemanagement.dao.impl;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.UserProfileDAO;

@Repository
@Transactional
public class UserProfileImpl implements UserProfileDAO {
	private SessionFactory sessionFactory;
	
	@Autowired
	public UserProfileImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void updateLastlogin(long userID) {
		Query updateTime = this.sessionFactory.getCurrentSession().createQuery("UPDATE UserProfile set Last_login=SYSDATE where user_id= :user_id");
		updateTime.setParameter("user_id", userID);
		updateTime.executeUpdate();
	}
}
