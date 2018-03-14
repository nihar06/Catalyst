<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Landing Page - Start Bootstrap Theme</title>
</head>
<body>
	<%@ include file="../../includes/header.html"%>

	<!-- Masthead -->
	<header class="masthead text-white text-center">
		<%@ include file="../../includes/secondMenu.jsp"%>
		<%@ include file="../../includes/mainMenu.jsp"%>

		<div class="overlay"></div>
		<div class="container">
			<div class="row">
				<div class="col-xl-9 mx-auto">
					<h1 class="mb-5">Build a landing page for your business or
						project and generate more leads!</h1>
				</div>
				<div class="col-md-10 col-lg-8 col-xl-7 mx-auto">
					<form>
						<div class="form-row">
							<div class="col-12 col-md-9 mb-2 mb-md-0">
								<input type="email" class="form-control form-control-lg"
									placeholder="Enter your email...">
							</div>
							<div class="col-12 col-md-3">
								<button type="submit" class="btn btn-block btn-lg btn-primary">Sign
									up!</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>


	</header>
	
	<div class="row no-gutters"
		style="padding-left: 10px; padding-right: 10px;">
		<div class="col-md-1">&nbsp;</div>
		<div class="col-md-5 home_info">
			<div id="cloudtransactionaltraining-intro" style="">
				<p class=" font-bold KBACE-hr">CLOUD TRANSACTIONAL TRAINING</p>
				<p class="">
					KBACE takes pride in offering customers step-by-step transactional
					training to make the transition to Oracle Cloud Applications as
					seamless as possible. KBACE's Transactional Training isn't simply a
					recording of a transaction, but rather allows users to click in
					fields, enter data and select from menus just as they would in a
					live system! <br>Learning a new system is imperative to a
					successful implementation, and KBACE uses working Cloud Instances
					to record real world transactions meant to augment both
					implementation team and end user training.<br> Click the Cloud
					Transactional Training button to get your training started today!
				</p>
			</div>

			<div id="cloudrelesespotlight-intro" style="">
				<p class=" font-bold KBACE-hr">CLOUD RELEASE SPOTLIGHT</p>
				<p class="">
					KBACE recognizes the importance for customers to get up to speed on
					the latest cloud releases. <br>Spotlight videos and release
					information are valuable resources to evaluate how your
					organization can benefit from provided enhancements.<br> Click
					the Release Spotlight button to get started reviewing our available
					materials today!
				</p>
			</div>
			<div id="fsm-intro" style="">
				<p class=" font-bold KBACE-hr">CLOUD FUTURE-STATE MODELING</p>
				<p class="">Click the Cloud Future-State Modeling button to get
					started managing your organization's transformation activities!</p>
			</div>
		</div>
		<div class="col-md-6">&nbsp;</div>
	</div>
	<!-- Icons Grid -->
	<section class="features-icons bg-light text-center">
		<div class="container">
			<div class="row">
				<div class="col-lg-4">
					<div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
						<div class="features-icons-icon d-flex">
							<i class="icon-screen-desktop m-auto text-primary"></i>
						</div>
						<h3>Lorem Ipsum</h3>
						<p class="lead mb-0">Lorem Ipsum is simply dummy text!</p>
					</div>
				</div>
				<div class="col-lg-4">
					<div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
						<div class="features-icons-icon d-flex">
							<i class="icon-layers m-auto text-primary"></i>
						</div>
						<h3>Lorem Ipsum</h3>
						<p class="lead mb-0">Lorem Ipsum is simply dummy text</p>
					</div>
				</div>
				<div class="col-lg-4">
					<div class="features-icons-item mx-auto mb-0 mb-lg-3">
						<div class="features-icons-icon d-flex">
							<i class="icon-check m-auto text-primary"></i>
						</div>
						<h3>Lorem Ipsum</h3>
						<p class="lead mb-0">Lorem Ipsum is simply dummy text!</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Image Showcases -->
	<section class="showcase">
		<div class="container-fluid p-0">
			<div class="row no-gutters">
				<div class="col-lg-6 order-lg-2 text-white showcase-img"
					style="background-image: url('resources/img/bg-showcase-1.jpg');"></div>
				<div class="col-lg-6 order-lg-1 my-auto showcase-text">
					<h2>Lorem Ipsum is simply dummy text</h2>
					<p class="lead mb-0">Lorem Ipsum is simply dummy text of the
						printing and typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s, when an
						unknown printer took a galley of type and scrambled it to make a
						type specimen book.</p>
				</div>
			</div>
			<div class="row no-gutters">
				<div class="col-lg-6 text-white showcase-img"
					style="background-image: url('resources/img/bg-showcase-2.jpg');"></div>
				<div class="col-lg-6 my-auto showcase-text">
					<h2>Lorem Ipsum is simply dummy text</h2>
					<p class="lead mb-0">Lorem Ipsum is simply dummy text of the
						printing and typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s, when an
						unknown printer took a galley of type and scrambled it to make a
						type specimen book.</p>
				</div>
			</div>
			<div class="row no-gutters">
				<div class="col-lg-6 order-lg-2 text-white showcase-img"
					style="background-image: url('resources/img/bg-showcase-3.jpg');"></div>
				<div class="col-lg-6 order-lg-1 my-auto showcase-text">
					<h2>Lorem Ipsum is simply dummy text</h2>
					<p class="lead mb-0">Lorem Ipsum is simply dummy text of the
						printing and typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s, when an
						unknown printer took a galley of type and scrambled it to make a
						type specimen book.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="testimonials text-center bg-light">
		<div class="container">
			<h2 class="mb-5">What people are saying...</h2>
			<div class="row">
				<div class="col-lg-4">
					<div class="testimonial-item mx-auto mb-5 mb-lg-0">
						<img class="img-fluid rounded-circle mb-3"
							src="resources/img/testimonials-1.jpg" alt="">
						<h5>Margaret E.</h5>
						<p class="font-weight-light mb-0">Lorem Ipsum is simply dummy
							text of the printing and typesetting industry.</p>
					</div>
				</div>
				<div class="col-lg-4">
					<div class="testimonial-item mx-auto mb-5 mb-lg-0">
						<img class="img-fluid rounded-circle mb-3"
							src="resources/img/testimonials-2.jpg" alt="">
						<h5>Fred S.</h5>
						<p class="font-weight-light mb-0">Lorem Ipsum is simply dummy
							text of the printing and typesetting industry.</p>
					</div>
				</div>
				<div class="col-lg-4">
					<div class="testimonial-item mx-auto mb-5 mb-lg-0">
						<img class="img-fluid rounded-circle mb-3"
							src="resources/img/testimonials-3.jpg" alt="">
						<h5>Sarah W.</h5>
						<p class="font-weight-light mb-0">Lorem Ipsum is simply dummy
							text of the printing and typesetting industry.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<%@ include file="../../includes/Footer.html"%>
	<!-- Bootstrap core JavaScript -->
	<!-- <script src="vendor/jquery/jquery.min.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> -->

</body>

<c:forEach items="${contents}" var="content">
	<script>
		createMenu("${content.getContent_Type()}", "${content.getTitle()}",
				"${content.getContent_path()}", "${content.getApplication()}");
		showInfo("${content.getContent_Type()}");
	</script>
</c:forEach>

<script type="text/javascript">
	createLogout("${accountType}");
</script>

<script
	src="${pageContext.request.contextPath}/resources/js/kbaceHorizontalMenu.min.js"></script>

<script>
	$(function() {
		kbaceHorizontalMenu.init();
	});
</script>

</html>
