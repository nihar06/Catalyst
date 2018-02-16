<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Catalyst Manager - Users List</title>
</head>
<body>
<%@ include file="../../includes/header.html"%>
<%@ include file="../../includes/managerMenu.jsp"%>
	<div class="container-fluid KBACE-container"
		style="padding-bottom: 50px; padding-top: 20px;">
		<div></div>
		<div class="row">

			<div class="col-md-12">
				<div style="margin-bottom: 10px; display: flow-root;">

					<span class="hand-hover" onclick="showUserForm()"> <img
						alt=""
						src="${pageContext.request.contextPath}/resources/img/icons/AddUser.png"><label
						class="hand-hover">&nbsp;Add User</label>
					</span> <input type="text" id="searchUser" class="searchInput"
						placeholder="Search for User.." onkeyup="searchUser()">
				</div>
				<div style="margin-bottom: 10px; display: none" id="adduser_form">
					<form action="${pageContext.request.contextPath}/manager/addUser"
						method="POST">
						<h5>
							<b>Enter User details:</b>
						</h5>
						<table class="form-table">
							<tbody>
								<tr>
									<td>User Name*</td>
									<td><input type="text" name="username" required>
									<td>Password*</td>
									<td><input type="text" name="password" required>
								</tr>
								<tr>
									<td>First Name</td>
									<td><input type="text" name="firstname">
									<td>Last Name</td>
									<td><input type="text" name="lastname">
								</tr>
								<tr>
									<td>Active</td>
									<td><select name="active">
											<option value="Yes">Yes</option>
											<option value="No">No</option>
									</select>
									<td>Customer Name</td>
									<td><input type="text" name="customerName">
								</tr>
								<tr>
									<td>Email</td>
									<td><input type="email" name="email">
									<td>Account Type</td>
									<td><select name="accounttype">
											<option value="Admin">Admin</option>
											<option value="Evaluation">Evaluation</option>
											<option value="Implementation">Implementation</option>
											<option value="Internal">Internal</option>
											<option value="Sales">Sales</option>
											<option value="Subscription">Subscription</option>
									</select>
								</tr>
								<tr>
									<td>Start Date</td>
									<td><input type="date" name="startdate"></td>

									<td>End Date</td>
									<td><input type="date" name="enddate">
								</tr>
								<tr>
									<td><input type="submit" class="btn KBACE-btn-info btn-lg"
										value="Save"></td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
				<table class="KBACE-table" id="usersList">
					<thead>
						<tr style="line-height: 15px;">
							<th scope="col">USER-ID</th>
							<th scope="col">USERNAME</th>
							<th scope="col">FIRSTNAME</th>
							<th scope="col">LASTNAME</th>
							<th scope="col">COUSTOMER NAME</th>
							<th scope="col">ACTIVE</th>
							<th scope="col">EMAIL</th>
							<th scope="col">ACCOUNT TYPE</th>
							<th scope="col">START DATE</th>
							<th scope="col">END DATE</th>
							<th scope="col">EDIT/SAVE</th>
							<th scope="col">DELETE</th>
							<th scope="col">RESET PW</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach items="${users}" var="user">
							<tr id="${user.getUser_id()}">
								<td data-label="USER-ID">${user.getUser_id()}</td>
								<td data-label="USERNAME">${user.getUsername()}</td>
								<td data-label="FIRSTNAME">${user.getFirstname()}</td>
								<td data-label="LASTNAME">${user.getLastname()}</td>
								<td data-label="COUSTOMER NAME">${user.getCustomerName()}</td>
								<td data-label="ACTIVE">${user.getActive()}</td>
								<td data-label="EMAIL">${user.getEmail()}</td>
								<td data-label="ACCOUNT TYPE">${user.getAccount_type()}</td>
								<td data-label="START DATE"><input class="KBACE-input"
									id="startDate${user.getUser_id()}" type="date" name="startdate"
									value="${user.getStart_date()}" readonly></td>
								<td data-label="END DATE"><input class="KBACE-input"
									id="endDate${user.getUser_id()}" type="date" name="enddate"
									value="${user.getEnd_date()}" readonly></td>
								<td data-label="EDIT/SAVE">
									<form
										action="${pageContext.request.contextPath}/manager/updateUser"
										method="POST"
										onsubmit="updateUserDetails(${user.getUser_id()})">
										<img id="edit-user${user.getUser_id()}"
											src="${pageContext.request.contextPath}/resources/img/icons/edit_icon.gif"
											onclick="enableToEdit(${user.getUser_id()})" /> <input
											type="hidden" name="usrId" value=""
											id="usrId${user.getUser_id()}"> <input type="hidden"
											name="username" value="" id="usrName${user.getUser_id()}">
										<input type="hidden" name="firstname" value=""
											id="useFirstname${user.getUser_id()}"> <input
											type="hidden" name="lastname" value=""
											id="usrLastname${user.getUser_id()}"> <input
											type="hidden" name="active" value=""
											id="usrActive${user.getUser_id()}"> <input
											type="hidden" name="customerName" value=""
											id="usrCustomername${user.getUser_id()}"> <input
											type="hidden" name="email" value=""
											id="usrEmail${user.getUser_id()}"> <input
											type="hidden" name="accounttype" value=""
											id="usrAccountType${user.getUser_id()}"> <input
											type="hidden" name="startdate" value=""
											id="usrStartdate${user.getUser_id()}"> <input
											type="hidden" name="enddate" value=""
											id="usrEnddate${user.getUser_id()}">
										<!-- 
										<input type="submit" value="save" id="save-EditedUser${user.getUser_id()}" style="display: none;"> 
										 -->
										<input type="image"
											src="${pageContext.request.contextPath}/resources/img/icons/save_icon.png"
											id="save-EditedUser${user.getUser_id()}"
											style="display: none" alt="Submit">
									</form>
								</td>
								<td data-label="DELETE">
									<form
										action="${pageContext.request.contextPath}/manager/deleteUser"
										method="POST">
										<input type="hidden" name="deleteID"
											value="${user.getUser_id()}"> <input type="image"
											src="${pageContext.request.contextPath}/resources/img/icons/delete_icon.png"
											alt="Submit">
									</form>
								</td>
								<td data-label="RESET PW"><input type="image"
									data-toggle="modal" data-target="#passModal"
									src="${pageContext.request.contextPath}/resources/img/icons/password-reset.png"
									onclick="setUserID(${user.getUser_id()})"></td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
				<div class="modal fade" id="passModal" role="dialog">
					<div class="modal-dialog">
						<!-- Modal content-->
						<div class="modal-content">
							<div class="modal-header">
								<h4 class="modal-title">Reset Password</h4>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>
							<div class="modal-body">
								<p>Please enter new password</p>
								<form
									action="${pageContext.request.contextPath}/manager/resetPassword"
									method="POST">
									Password* <input type="text" name="password" required><br>
									<br> <input type="hidden" name="userID" value="" id="userID"> <input
										type="submit" class="btn KBACE-btn-info btn-lg"
										value="Reset password">
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