package com.kbace.changemanagement.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.kbace.changemanagement.dao.UserDAO;
import com.kbace.changemanagement.dao.impl.UserDAOImpl;

@Configuration
@ComponentScan("com.kbace.changemanagement.*")
@EnableTransactionManagement
@PropertySource("classpath:datasource-cfg.properties")
public class ApplicationContextConfig {

	@Autowired
	private Environment env;

	@Bean
	public ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource rb = new ResourceBundleMessageSource();
		// Load property in message/validator.properties
		rb.setBasenames(new String[] { "messages/validator" });
		return rb;
	}

	@Bean(name = "viewResolver")
	public InternalResourceViewResolver getViewResolver() {
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setPrefix("/WEB-INF/pages/");
		viewResolver.setSuffix(".jsp");
		return viewResolver;
	}

	@Bean(name = "dataSource")
	public DataSource getDataSource() {

		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		// See: datasource-cfg.properties
		dataSource.setDriverClassName(this.env.getProperty("ds.database-driver"));
		dataSource.setUrl(this.env.getProperty("ds.url"));
		dataSource.setUsername(this.env.getProperty("ds.username"));
		dataSource.setPassword(this.env.getProperty("ds.password"));
		return dataSource;
	}

	@Autowired
	@Bean(name = "sessionFactory")
	public SessionFactory getSessionFactory(DataSource dataSource) throws Exception {
		Properties properties = new Properties();

		// See: ds-hibernate-cfg.properties
		properties.put("hibernate.dialect", this.env.getProperty("hibernate.dialect"));
		properties.put("hibernate.show_sql", this.env.getProperty("hibernate.show_sql"));
		properties.put("current_session_context_class", this.env.getProperty("current_session_context_class"));

		LocalSessionFactoryBean factoryBean = new LocalSessionFactoryBean();
		factoryBean.setPackagesToScan(new String[] { "com.kbace.changemanagement.entity" });
		factoryBean.setDataSource(dataSource);
		factoryBean.setHibernateProperties(properties);
		factoryBean.afterPropertiesSet();
		return factoryBean.getObject();
	}

	@Autowired
	@Bean(name = "transactionManager")
	public HibernateTransactionManager getTransactionManager(SessionFactory sessionFactory) {
		HibernateTransactionManager transactionManager = new HibernateTransactionManager(sessionFactory);
		return transactionManager;
	}

	
	@Bean(name = "userDAO")
	public UserDAO getUserDAO() throws Exception {
		return new UserDAOImpl(getSessionFactory(getDataSource()));
	}

	@Bean
	public MultipartResolver multipartResolver() {
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
		multipartResolver.setMaxUploadSize(10485760000L); // 10000MB 10GB
		multipartResolver.setMaxUploadSizePerFile(1048576000L); // 1000MB 1GB
		return multipartResolver;
	}

}
