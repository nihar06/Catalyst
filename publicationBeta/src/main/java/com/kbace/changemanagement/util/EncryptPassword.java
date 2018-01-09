package com.kbace.changemanagement.util;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class EncryptPassword extends BCryptPasswordEncoder {

	private final static int LOG_ROUNDS = 15;

	public EncryptPassword() {
		super(LOG_ROUNDS);
	}
}