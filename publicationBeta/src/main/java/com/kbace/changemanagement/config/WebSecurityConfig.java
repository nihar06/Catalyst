package com.kbace.changemanagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.kbace.changemanagement.authentication.UserDetailsServiceImpl;
import com.kbace.changemanagement.util.EncryptPassword;

@Configuration
@EnableWebSecurity
@Transactional
@EnableGlobalMethodSecurity(prePostEnabled = true)

public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsServiceImpl userDetailsServiceimpl;

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

		// Users in memory.
		auth.inMemoryAuthentication().withUser("user1").password("12345").roles("USER");
		auth.inMemoryAuthentication().withUser("admin1").password("12345").roles("ADMIN");

		// For User in database.
		auth.userDetailsService(userDetailsServiceimpl);
		auth.authenticationProvider(authProvider());
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new EncryptPassword();
	}

	@Bean
	public DaoAuthenticationProvider authProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsServiceimpl);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.csrf().disable();
		http.headers().frameOptions().sameOrigin().httpStrictTransportSecurity().disable();

		http.authorizeRequests().antMatchers("/login").permitAll();

		// If no login, it will redirect to /login page.
		http.authorizeRequests().antMatchers("/", "/home", "/KData*/**").authenticated();

		// For ADMIN only.
		http.authorizeRequests().antMatchers("/manager*/**").access("hasRole('ROLE_ADMIN')");

		// AccessDeniedException will throw.
		http.authorizeRequests().and().exceptionHandling().accessDeniedPage("/403");

		http.authorizeRequests().and().formLogin().loginProcessingUrl("/j_spring_security_check").loginPage("/login")
				.defaultSuccessUrl("/").failureUrl("/login?error=true").usernameParameter("username")//
				.passwordParameter("password").and().logout().logoutUrl("/logout").logoutSuccessUrl("/login");

	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		//web.ignoring().antMatchers("/KData/**");
	}
}
