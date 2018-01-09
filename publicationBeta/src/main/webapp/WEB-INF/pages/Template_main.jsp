<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
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