<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>Manager - Upload Content</title>
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">
	$(function() {
		$('button[type=submit]')
				.click(
						function(e) {
							e.preventDefault();
							// Disable submit button
							$(this).prop('disabled', true);

							var form = document.forms[0];
							var formData = new FormData(form);

							// Ajax call for file uploaling
							var ajaxReq = $
									.ajax({
										url : 'importContent',
										type : 'POST',
										data : formData,
										cache : false,
										contentType : false,
										processData : false,
										xhr : function() {
											// Get XmlHttpRequest object
											var xhr = $.ajaxSettings.xhr();

											// Set onprogress event handler
											xhr.upload.onprogress = function(
													event) {
												var perc = Math
														.round((event.loaded / (2 * event.total)) * 100);
												$('#progressBar').text(
														perc + '%');
												$('#progressBar').css('width',
														perc + '%');
											};
											return xhr;
										},
										beforeSend : function(xhr) {
											// Reset alert message and progress bar
											$('#alertMsg').text('');
											$('#progressBar').text('');
											$('#progressBar')
													.css('width', '0%');
										}
									});

							// Called on success of file upload
							ajaxReq.done(function(msg) {
								$('#progressBar').text('100%');
								$('#progressBar').css('width', '100%');
								$('#alertMsg').text(msg);
								$('input[type=file]').val('');
								$('button[type=submit]')
										.prop('disabled', false);
							});

							// Called on failure of file upload
							ajaxReq.fail(function(jqXHR) {
								$('#alertMsg').text(
										jqXHR.responseText + '(' + jqXHR.status
												+ ' - ' + jqXHR.statusText
												+ ')');
								$('button[type=submit]')
										.prop('disabled', false);
							});
						});
	});
</script>

</head>
<body>
	<%@ include file="../../includes/header.html"%>
<%@ include file="../../includes/managerMenu.jsp"%>
	<div class="container-fluid KBACE-container"
		style="padding-bottom: 50px; padding-top: 20px;">

		<div class="row">

			<div class="col-md-12">

				<form action="uploadContent" method="post"
					enctype="multipart/form-data">
					<div class="form-group">
						<label>Please select a zipped package to import.</label><br>
						<input type="file" name="file" accept=".zip">
					</div>
					<div class="form-group">
						<button class="btn btn-primary" type="submit">Upload</button>
					</div>
				</form>
				<div class="progress">
					<div id="progressBar"
						class="KBACE-progress-bar progress-bar-success" role="progressbar"
						aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
						style="width: 0%"></div>
				</div>

				<div id="alertMsg" style="color: red; font-size: 18px;"></div>
			</div>
		</div>

	</div>
	
</body>
</html>