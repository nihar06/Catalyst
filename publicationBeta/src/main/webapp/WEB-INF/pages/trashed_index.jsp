<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>Home</title>
</head>
<body>
	<%@ include file="../../includes/secondMenu.jsp"%>

	<div class="container-fluid KBACE-background"
		style="padding-bottom: 50px; padding-top: 20px;">

		<div class="row">
			<%@ include file="../../includes/SidebarMenu.jsp"%>
			<div class="col-md-4">
				<div>
					<p class="font-white font-bold KBACE-hr">CLOUD TRANSACTIONAL
						TRAINING</p>
					<p class="font-white">
						KBACE takes pride in offering customers step-by-step transactional
						training to make the transition to Oracle Cloud Applications as
						seamless as possible. KBACE's Transactional Training isn't simply
						a recording of a transaction, but rather allows users to click in
						fields, enter data and select from menus just as they would in a
						live system! <br>Learning a new system is imperative to a
						successful implementation, and KBACE uses working Cloud Instances
						to record real world transactions meant to augment both
						implementation team and end user training.<br> Click the
						Cloud Transactional Training button to get your training started
						today!
					</p>
				</div>

				<div>
					<p class="font-white font-bold KBACE-hr">CLOUD RELEASE
						SPOTLIGHT</p>
					<p class="font-white">
						KBACE recognizes the importance for customers to get up to speed
						on the latest cloud releases. <br>Spotlight videos and
						release information are valuable resources to evaluate how your
						organization can benefit from provided enhancements.<br>
						Click the Release Spotlight button to get started reviewing our
						available materials today!
					</p>
				</div>
				<div>
					<p class="font-white font-bold KBACE-hr">CLOUD FUTURE-STATE
						MODELING</p>
					<p class="font-white">
						KBACE recognizes the importance for customers to get up to speed
						on the latest cloud releases. <br>Spotlight videos and
						release information are valuable resources to evaluate how your
						organization can benefit from provided enhancements.<br>
						Click the Future-State Modeling button to get started managing
						your organization's transformation activities!
					</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="embed-responsive embed-responsive-70">
					<video class="embed-responsive-item" controls
						poster="${pageContext.request.contextPath}/resources/img/Slide5.png">
						<source
							src="http://transformation.kbace.com/training/Publishing%20Content/PlayerPackage/data/tpc/33cbda81-d7dc-4cdd-8108-7f80f14a0f68/Parts/KBACE_Methodology_Catalyst_Short.mp4"
							type="video/mp4">
					</video>
				</div>
			</div>
		</div>

	</div>
	<%@ include file="../../includes/Footer.html"%>
</body>
</html>