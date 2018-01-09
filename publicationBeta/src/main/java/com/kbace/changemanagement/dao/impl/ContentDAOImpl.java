package com.kbace.changemanagement.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.dao.ContentDAO;
import com.kbace.changemanagement.entity.Content;

@Repository
@Transactional
public class ContentDAOImpl implements ContentDAO {

	private SessionFactory sessionFactory;

	@Autowired
	public ContentDAOImpl(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void saveModule(Content module) {
		Session session = this.sessionFactory.getCurrentSession();
		Content oldModule = module;
		if (session.get(Content.class, module.getContent_id()) != null) {
			oldModule = session.get(Content.class, module.getContent_id());
	//		oldModule.setContent_path(module.getContent_path());
			oldModule.setLast_updated(module.getLast_updated());
			oldModule.setTitle(module.getTitle());
		}
		session.saveOrUpdate(oldModule);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> getContentList() {
		Session session = this.sessionFactory.getCurrentSession();
		return session.createQuery("from Content").list();
	}

	@Override
	public void deleteTitleById(String titleId) {
		Session session = this.sessionFactory.getCurrentSession();
		Content content = session.load(Content.class, titleId);
		session.delete(content);
	}

	@Override
	public void updateContent(String titleID, String contentType, String app) {
		Session session = this.sessionFactory.getCurrentSession();
		Content content = session.load(Content.class, titleID);
		content.setContent_Type(contentType);
		content.setApplication(app);
		session.saveOrUpdate(content);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> getAssignedContent(long userID) {
		Session session = this.sessionFactory.getCurrentSession();
		String query = "SELECT c FROM Content c, ContentInUserGroup cug, UserGroup ug, UserInUserGroup uug, CatalystUser cu"
				+ " WHERE" + " ug.userGroup_id = cug.usergroup_ID" + " AND c.content_id = cug.Content_id"
				+ " AND ug.userGroup_id = uug.usergroup_ID" + " AND cu.user_id = uug.user_ID" + " AND cu.user_id = "
				+ userID + " GROUP BY"
				+ " c.content_id,  c.title, c.content_path, c.last_updated,  c.content_Type, c.application"
				+ " ORDER BY c.title";
		return session.createQuery(query).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean checkAssignemnt(String contentID, Long userID) {
		Session session = this.sessionFactory.getCurrentSession();
		String query = "SELECT c FROM Content c, ContentInUserGroup cug, UserGroup ug, UserInUserGroup uug, CatalystUser cu"
				+ " WHERE" + " ug.userGroup_id = cug.usergroup_ID" + " AND c.content_id = cug.Content_id"
				+ " AND ug.userGroup_id = uug.usergroup_ID" + " AND cu.user_id = uug.user_ID" + " AND cu.user_id = "
				+ userID + " AND c.content_id = '" + contentID + "'" + " GROUP BY"
				+ " c.content_id,  c.title, c.content_path, c.last_updated,  c.content_Type, c.application"
				+ " ORDER BY c.title";

		List<Content> contents = session.createQuery(query).list();
		if (contents.size() == 0)
			return false;

		return true;
	}
}