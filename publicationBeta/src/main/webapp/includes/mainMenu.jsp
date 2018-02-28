<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>

<nav id="KBACE-hrmenu" class="KBACE-hrmenu" style="position: absolute;">
	<ul id="upplerLevelMenu">
		<li class="dropdown" id="managerMenu" style="display: none"><a
			href="#" class="KBACE-menu dropdown-toggle">Manager</a>
			<div class="KBACE-hrsub">
				<div class="KBACE-hrsub-inner">
					<a class="dropdown-item"
						href="${pageContext.request.contextPath}/manager">Manage User</a>
					<a class="dropdown-item"
						href="${pageContext.request.contextPath}/manager/userGroup-management">Manage
						User Group</a> <a class="dropdown-item"
						href="${pageContext.request.contextPath}/manager/title-management">Manage
						Content</a> <a class="dropdown-item"
						href="${pageContext.request.contextPath}/manager/importContent">Import
						Content</a>
				</div>
			</div></li>

		<li class="dropdown" id="supportMenu"><a href="#"
			class="KBACE-menu dropdown-toggle">Support</a>
			<div class="KBACE-hrsub">
				<div class="KBACE-hrsub-inner">
					<a class="dropdown-item" href="#">Page 1</a> <a
						class="dropdown-item" href="#">Page 2</a>
				</div>
			</div></li>

		<li id="logout"><div>
				<a href="logout" class="KBACE-menu">Logout</a>
			</div></li>
	</ul>
</nav>