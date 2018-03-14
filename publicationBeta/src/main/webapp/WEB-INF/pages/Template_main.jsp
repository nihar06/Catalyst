<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>Template</title>
</head>
<body>
	<%@ include file="../../includes/header.html"%>

	<div class="container-fluid KBACE-background KBACE-container"
		style="padding-bottom: 50px; padding-top: 20px;">

		<div class="row">
			<%@ include file="../../includes/SidebarMenu.jsp"%>
			<div class="col-md-4">&nbsp;</div>
			<div class="col-md-4">&nbsp;</div>
		</div>

	</div>
	<%@ include file="../../includes/Footer.html"%>
</body>
</html>