package com.kbace.changemanagement.util;

public interface DirectoryConstants {

	public static final String VIRTUAL_DIR="KData";
	public static final String PHYSICAL_DIR_NAME="KContent";
	
	// Constants for local
	/*
	public static final String UPLOAD_DIRECTORY = "C:/Users/641805.CTS/Desktop/Temp";
	public static final String UNZIP_DIRECTORY = "C:/Users/641805.CTS/Desktop/Temp/PlayerPackage";
	public static final String PHYSICAL_DIR = "C:/Users/641805.CTS/Desktop/Temp/KContant";
	public static final String CUSTOM_TOC_FILE = "C:/Users/641805.CTS/Desktop/Resource";
	public static final String ORIGINAL_TOC_DIRECTORY= "data";
	*/ 
	
	// Constants for Server	
	public static final String PHYSICAL_DIR="/usr/local/KContant";
	public static final String UPLOAD_DIRECTORY="/usr/local/KContant/Temp";
	public static final String UNZIP_DIRECTORY="/usr/local/KContant/Temp/PlayerPackage";
	public static final String CUSTOM_TOC_FILE = "/usr/local/KContant/resources/toc.html";
	public static final String ORIGINAL_TOC_DIRECTORY= "data/toc.html";
}