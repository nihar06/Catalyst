package com.kbace.changemanagement.authentication;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.kbace.changemanagement.entity.CatalystUser;
import com.kbace.changemanagement.entity.Content;
import com.kbace.changemanagement.service.UserService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	UserService userService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		CatalystUser user = this.userService.findUser(username);
 		if (user == null) {
			throw new UsernameNotFoundException("User " + username + " was not found in the database");
		}
		String role = user.getAccount_type().toUpperCase();
		List<Content> contents= this.userService.getAssignedContent(user.getUser_id());
		List<GrantedAuthority> grantList = new ArrayList<>();
		grantList.add(new SimpleGrantedAuthority("ROLE_" + role));
		UserDetails userDetails = (UserDetails) new UserImpl(user, grantList, contents);
		this.userService.updateLastLogin(user.getUser_id());
		return userDetails;
	}
}