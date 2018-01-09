<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Manager - Title Management</title>
</head>
<body>
	<%@ include file="../../includes/header.html"%>
	<%@ include file="../../includes/managerMenu.jsp"%>
	<div class="container-fluid KBACE-container"
		style="padding-bottom: 50px; padding-top: 20px;">

		<div class="row">
			<div class="col-md-12">

				<a href="${pageContext.request.contextPath}/manager/importContent">Import
					Title.</a> <br> <br>
				<table class="KBACE-table" id="titleList">

					<thead style="line-height: 15px;">
						<tr>
							<th>TITLE NAME</th>
							<th>CONTENT TYPE</th>
							<th>APPLICATION</th>
							<th>UPDATED DATE</th>
							<th>EDIT/SAVE</th>
							<th>DELETE</th>
						</tr>
					<tbody>
						<c:forEach items="${titleList}" var="title">
							<tr id="${title.getContent_id()}">
								<td data-label="TITLE NAME">${title.getTitle()}</td>
								<td data-label="CONTENT TYPE"><select
									id="selectContentType${title.getContent_id()}" disabled
									style="border: none; -webkit-appearance: none;">
										<option value="${title.getContent_Type()}">
											${title.getContent_Type()}</option>

										<c:choose>
											<c:when test="${title.getContent_Type()!='FSM'}">
												<option value="FSM">FSM</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when
												test="${title.getContent_Type()!='Cloud Transactional Training'}">
												<option value="Cloud Transactional Training">Cloud
													Transactional Training</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when
												test="${title.getContent_Type()!='Cloud Spotlight release'}">
												<option value="Cloud Spotlight release">Cloud
													Spotlight Release</option>
											</c:when>
										</c:choose>
								</select></td>

								<td data-label="APPLCATION"><select
									id="selectApp${title.getContent_id()}" disabled
									style="border: none; -webkit-appearance: none;">
										<option value="${title.getApplication()}">
											${title.getApplication()}</option>
										<c:choose>
											<c:when test="${title.getApplication()!='HCM'}">
												<option value="HCM">HCM</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='PPM'}">
												<option value="PPM<">PPM</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='ERP'}">
												<option value="ERP">ERP</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='SCM'}">
												<option value="SCM">SCM</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='CX'}">
												<option value="CX">CX</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='IT'}">
												<option value="IT">IT</option>
											</c:when>
										</c:choose>
										<c:choose>
											<c:when test="${title.getApplication()!='Introduction'}">
												<option value="Introduction">Introduction</option>
											</c:when>
										</c:choose>
								</select></td>

								<td data-label="UPDATED DATE">${title.getLast_updated()}</td>

								<td data-label="EDIT/SAVE"><img
									id="edit-user${title.getContent_id()}"
									src="${pageContext.request.contextPath}/resources/img/icons/edit_icon.gif"
									onclick="enableToEditContent('${title.getContent_id()}')" /> <img
									src="${pageContext.request.contextPath}/resources/img/icons/save_icon.png"
									id="save-EditedUser${title.getContent_id()}"
									style="display: none"
									onclick="updateContent('${title.getContent_id()}')"></td>

								<td data-label="DELETE">
									<form
										action="${pageContext.request.contextPath}/manager/deleteTitle"
										method="POST">
										<input type="hidden" name="deleteID"
											value="${title.getContent_id()}"> <input type="image"
											src="${pageContext.request.contextPath}/resources/img/icons/delete_icon.png"
											alt="Submit">
									</form>
								</td>

							</tr>
						</c:forEach>

					</tbody>
				</table>
			</div>
		</div>
	</div>

</body>
</html>