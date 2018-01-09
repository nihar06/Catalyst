<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<body class="">
	<%@ include file="../../includes/header.html"%>

	<div class="container-fluid KBACE-background KBACE-container"
		style="padding-bottom: 20px; padding-top: 10px; min-height: calc(100vh - 170px);">
		<div class="row justify-content-end"
			style="padding-right: 5px; padding-left: 5px;">

			<div>
				<form style="margin-bottom: 5px;"
					action="${pageContext.request.contextPath}/j_spring_security_check"
					method='POST'>
					<input type="text" name="username" id="username" class=""
						placeholder="Username" style="line-height: 1"> <input
						type="password" style="line-height: 1" name="password"
						id="password" class="" placeholder="Password"
						style="margin-bottom: 5px;"> <input type="submit"
						class="btn KBACE-btn-info btn-lg" value="Login">
				</form>
				<c:if test="${param.error == 'true'}">
					<div style="color: red; margin: 10px 0px;">Login Invalid.
						Please verify your Username and Password.</div>

				</c:if>
			</div>

		</div>
		<div class="row">
			<div class="col-md-1">&nbsp;</div>
			<div class="col-md-5">
				<h3 class="font-white">Welcome to Catalyst</h3>
				<p class="font-white">
					Catalyst is a proprietary service offered by KBACE offering
					training, education and change management solutions. The Catalyst
					system is extremely easy to navigate and is accessible from any
					device at work or at home, and allows immediate exposure and
					familiarity with Oracle Cloud Applications <br> <br> <span
						class="font-KBACE-Green">Transactional Training</span> - Access
					step-by-step instructions on performing specific actions in Oracle
					Cloud Applications
				<hr class="KBACE-footer-hr">
				<span class="font-KBACE-Green">Questions?</span><br>
				<p class="font-white">
					Email us at <span><a class="font-KBACE-Green"
						href="mailto:catalyst@kbace.com">catalyst@kbace.com</a></span>
				</p>
			</div>

			<div class="col-md-5  justify-content-center"
				style="display: inline-flex;">
				<div class="embed-responsive embed-responsive-70"
					style="width: 60%;">
					<video class="embed-responsive-item" controls
						poster="${pageContext.request.contextPath}/resources/img/Slide5.png">
						<source
							src="http://transformation.kbace.com/training/Publishing%20Content/PlayerPackage/data/tpc/33cbda81-d7dc-4cdd-8108-7f80f14a0f68/Parts/KBACE_Methodology_Catalyst_Short.mp4"
							type="video/mp4">
					</video>
				</div>
			</div>

			<div class="col-md-1">&nbsp;</div>
		</div>
	</div>


	<%@ include file="../../includes/Footer.html"%>
</body>
</html>