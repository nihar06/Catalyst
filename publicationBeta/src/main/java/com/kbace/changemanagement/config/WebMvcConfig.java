package com.kbace.changemanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import static com.kbace.changemanagement.util.DirectoryConstants.*;

@Configuration
@EnableWebMvc
public class WebMvcConfig extends WebMvcConfigurerAdapter {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/resources/**")//
				.addResourceLocations("/resources/").setCachePeriod(31556926);

		//Maps content to physical directory, any path with KData** maps content here. KData works as virtual directory. 
		registry.addResourceHandler("/"+VIRTUAL_DIR+"/**").addResourceLocations("file:"+PHYSICAL_DIR+"/");
		
		registry.addResourceHandler("/"+PHYSICAL_DIR_NAME +"/**").addResourceLocations("file:"+PHYSICAL_DIR+"/");
	}

	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}
}