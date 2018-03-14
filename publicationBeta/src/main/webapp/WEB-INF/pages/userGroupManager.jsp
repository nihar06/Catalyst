<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>Manager - UserGroup management</title>
</head>
<body>
	<%@ include file="../../includes/header.html"%>
	<%@ include file="../../includes/managerMenu.jsp"%>
	<div class="container-fluid KBACE-container"
		style="padding-bottom: 50px; padding-top: 20px;">
		<h2>User Group Manager</h2>
		<div class="row">
			<div class="col-md-12">
				<div style="margin-bottom: 10px;">

					<form
						action="${pageContext.request.contextPath}/manager/addUserGroup"
						method="POST">
						Add User Group: <input type="text" name="usergroup"
							style="margin-bottom: 1%;"> <input
							class="btn KBACE-btn-info btn-lg" type="submit"
							value="Add User Group">
					</form>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-4">
				<div style="margin-bottom: 10px; display: flow-root;">

					<h4>Available User Group</h4>
					<table class="KBACE-table" id="userGroupList">

						<thead style="line-height: 15px;">
							<tr>
								<th>User Group Name</th>
								<th>Edit</th>
								<th>Delete</th>
							</tr>
						<tbody>
							<c:forEach items="${userGroupList}" var="userGroup">
								<tr>
									<td data-label="User Group Name">${userGroup.getUserGroup_name()}</td>
									<td data-label="Edit"><input type="radio" name="userGroup"
										value="${userGroup.getUserGroup_id()}"
										onclick="getDataforUserGroup()"></td>
									<td data-label="Delete">
										<form
											action="${pageContext.request.contextPath}/manager/deleteUserGroup"
											method="POST">
											<input type="hidden" name="deleteID"
												value="${userGroup.getUserGroup_id()}"> <input
												type="image"
												src="${pageContext.request.contextPath}/resources/img/icons/delete_icon.png"
												alt="Submit">
										</form>
									</td>
							</c:forEach>
						</tbody>
					</table>
				</div>

			</div>
			<div id="edit-user-group" class="col-md-8"
				style="padding-right: 2%; margin-right: -1%; display: none">

				<h4>User Assignment</h4>
				<div class="row">
					<div class="col">
						<p class="select-label">User not Assigned</p>
						<select name="usersnotinusergroup" multiple
							id="usersnotinusergroup"
							style="width: 100%; border: 1px solid #808080; overflow: auto;">

						</select>
					</div>
					<div class="col">
						<p class="select-label">Assigned User</p>
						<select name="usersinusergroup" multiple id="usersinusergroup"
							style="width: 100%; border: 1px solid #808080; overflow: auto;">
						</select>
					</div>
				</div>
				<div class="row justify-content-center">
					<button class="btn border-radius"
						onclick="updateUsergroupAssignmentList('usersnotinusergroup','usersinusergroup')">
						<img
							src="${pageContext.request.contextPath}/resources/img/icons/forwardIcon.png"
							width="20" />
					</button>
					<button class="btn border-radius"
						onclick="updateUsergroupAssignmentList('usersinusergroup','usersnotinusergroup')">
						<img
							src="${pageContext.request.contextPath}/resources/img/icons/rewindIcon.png"
							width="20" />
					</button>
				</div>
				<h4>Content Assignment</h4>
				<div class="row">
					<div class="col">
						<p class="select-label">Content not Assigned</p>
						<select name="contentnotinusergroup" multiple
							id="contentnotinusergroup"
							style="width: 100%; border: 1px solid #808080; overflow: auto;">
						</select>
					</div>
					<div class="col">
						<p class="select-label">Assigned Content</p>
						<select name="contentinusergroup" multiple id="contentinusergroup"
							style="width: 100%; border: 1px solid #808080; overflow: auto;">
						</select>
					</div>
				</div>
				<div class="row justify-content-center">
					<button class="btn border-radius"
						onclick="updateUsergroupAssignmentList('contentnotinusergroup','contentinusergroup')">
						<img
							src="${pageContext.request.contextPath}/resources/img/icons/forwardIcon.png"
							width="20" />
					</button>
					<button class="btn border-radius"
						onclick="updateUsergroupAssignmentList('contentinusergroup','contentnotinusergroup')">
						<img
							src="${pageContext.request.contextPath}/resources/img/icons/rewindIcon.png"
							width="20" />
					</button>

				</div>
				<div class="row justify-content-end" style="padding-right: 15px;">
					<button class="btn KBACE-btn-info btn-lg"
						onclick="updateUserGroup()">Save</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>