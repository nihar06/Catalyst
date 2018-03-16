package com.kbace.changemanagement.dao.impl;

import java.util.List;

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
	public Content saveModule(Content module) {
		Content oldModule = module;
		if (this.sessionFactory.getCurrentSession().get(Content.class, module.getContent_id()) != null) {
			oldModule = this.sessionFactory.getCurrentSession().get(Content.class, module.getContent_id());
			oldModule.setLast_updated(module.getLast_updated());
			oldModule.setTitle(module.getTitle());
		}
		this.sessionFactory.getCurrentSession().saveOrUpdate(oldModule);
		return oldModule;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> getContentList() {
		return this.sessionFactory.getCurrentSession().createQuery("from Content").list();
	}

	@Override
	public void deleteTitleById(String titleId) {
		Content content = this.sessionFactory.getCurrentSession().load(Content.class, titleId);
		this.sessionFactory.getCurrentSession().delete(content);
	}

	@Override
	public void updateContent(String titleID, String titleName, String contentType, String app) {
		Content content = this.sessionFactory.getCurrentSession().load(Content.class, titleID);
		content.setTitle(titleName);
		content.setContent_Type(contentType);
		content.setApplication(app);
		this.sessionFactory.getCurrentSession().saveOrUpdate(content);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Content> getAssignedContent(long userID) {
		String query = "SELECT c FROM Content c, ContentInUserGroup cug, UserGroup ug, UserInUserGroup uug, CatalystUser cu"
				+ " WHERE" + " ug.userGroup_id = cug.usergroup_ID" + " AND c.content_id = cug.Content_id"
				+ " AND ug.userGroup_id = uug.usergroup_ID" + " AND cu.user_id = uug.user_ID" + " AND cu.user_id = "
				+ userID + " GROUP BY"
				+ " c.content_id,  c.title, c.content_path, c.last_updated,  c.content_Type, c.application"
				+ " ORDER BY c.title";
		return this.sessionFactory.getCurrentSession().createQuery(query).list();
	}

	@Override
	public boolean checkAssignemnt(String contentID, Long userID) {
		String query = "SELECT c FROM Content c, ContentInUserGroup cug, UserGroup ug, UserInUserGroup uug, CatalystUser cu"
				+ " WHERE" + " ug.userGroup_id = cug.usergroup_ID" + " AND c.content_id = cug.Content_id"
				+ " AND ug.userGroup_id = uug.usergroup_ID" + " AND cu.user_id = uug.user_ID" + " AND cu.user_id = "
				+ userID + " AND c.content_id = '" + contentID + "'" + " GROUP BY"
				+ " c.content_id,  c.title, c.content_path, c.last_updated,  c.content_Type, c.application"
				+ " ORDER BY c.title";

		if (this.sessionFactory.getCurrentSession().createQuery(query).list().size() == 0)
			return false;

		return true;
	}

	@Override
	public void updatePath(String path, String contentID) {
		Content content = this.sessionFactory.getCurrentSession().load(Content.class, contentID);
		content.setContent_path(path);
		this.sessionFactory.getCurrentSession().update(content);

	}
}