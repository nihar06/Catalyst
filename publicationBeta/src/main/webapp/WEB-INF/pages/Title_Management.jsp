<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
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
							<th>RESET LN</th>
						</tr>
					<tbody>
						<c:forEach items="${titleList}" var="title">
							<tr id="${title.getContent_id()}">
								<td id="contentName${title.getContent_id()}"
									data-label="TITLE NAME">${title.getTitle()}</td>
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
								<td data-label="RESET LINK"><input type="image"
									data-toggle="modal" data-target="#linkModal"
									src="${pageContext.request.contextPath}/resources/img/icons/editLink.png"
									onclick="setLinkInfo('${title.getContent_id()}', '${title.getContent_path()}')"></td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
				<div class="modal fade" id="linkModal" role="dialog">
					<div class="modal-dialog">
						<!-- Modal content-->
						<div class="modal-content">
							<div class="modal-header">
								<h4 class="modal-title">Edit Link</h4>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>
							<div class="modal-body">
								<p style="text-align: center;">
									Your current link is <span id="titleLink"></span> Please enter
									new Link
								</p>
								<form
									action="${pageContext.request.contextPath}/manager/updatePath"
									method="POST">
									New Link* <input type="text" id=newLink name="contentPath"
										required style="width: 100%;"><br> <br> <input
										type="hidden" name="titleID" value="" id="titleID"> <input
										type="submit" class="btn KBACE-btn-info btn-lg"
										value="Edit Link">
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>