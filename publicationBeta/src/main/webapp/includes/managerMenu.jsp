<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<nav id="KBACE-hrmenu" class="KBACE-hrmenu" style="display: block;">
	<ul id="managerMenu" style="display: inline;">
		<li style="display: inline;"><a href="${pageContext.request.contextPath}">Home</a></li>
		
		<li class="dropdown show" id="mMenu" style="display: inline;"><a href="#"
			class="KBACE-menu dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Manager</a>
			<div class="KBACE-manager-menu dropdown-menu" aria-labelledby="mMenu">
					<a class="dropdown-item" href="${pageContext.request.contextPath}/manager">Manage User</a>
					<a class="dropdown-item" href="${pageContext.request.contextPath}/manager/userGroup-management">Manage User Group</a> 
					<a class="dropdown-item" href="${pageContext.request.contextPath}/manager/title-management">Manage Content</a> 
					<a class="dropdown-item" href="${pageContext.request.contextPath}/manager/importContent">Import Content</a>
			</div></li>
		<li style="display: inline;"><a href="logout" class="KBACE-menu">Logout</a></li>
	</ul>
</nav>