/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.47
 * Generated at: 2017-09-05 17:39:33 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class index_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  static {
    _jspx_dependants = new java.util.HashMap<java.lang.String,java.lang.Long>(4);
    _jspx_dependants.put("/../../includes/SidebarMenu.jsp", Long.valueOf(1503602784946L));
    _jspx_dependants.put("/includes/secondMenu.jsp", Long.valueOf(1503602545963L));
    _jspx_dependants.put("/includes/../../includes/header.html", Long.valueOf(1502825900881L));
    _jspx_dependants.put("/includes/Footer.html", Long.valueOf(1504193635753L));
  }

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=ISO-8859-1");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">\r\n");
      out.write("<title>Home</title>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t");
      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("<head>\r\n");
      out.write("\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">\r\n");
      out.write("<title>Catalyst</title>\r\n");
      out.write("\r\n");
      out.write("<link\r\n");
      out.write("\thref=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/css/bootstrap.css\"\r\n");
      out.write("\trel=\"stylesheet\" type='text/css' media='all'>\r\n");
      out.write("<link\r\n");
      out.write("\thref=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/css/KbaceStyles.css\"\r\n");
      out.write("\trel=\"stylesheet\" type='text/css' media='all'>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/dist/js/tether.min.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/jquery/jquery.min.js\"\r\n");
      out.write("\ttype=\"text/javascript\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/popper/popper.js\"\r\n");
      out.write("\ttype=\"text/javascript\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/js/bootstrap.min.js\"\r\n");
      out.write("\ttype=\"text/javascript\"></script>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("\r\n");
      out.write("<nav class=\"d-flex justify-content-between bg-banner\">\r\n");
      out.write("\t<div class=\"p-2\">\r\n");
      out.write("\t\t<a class=\"navbar-brand\" href=\"#\"> <img\r\n");
      out.write("\t\t\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/img/catalyst.gif\"\r\n");
      out.write("\t\t\tclass=\"d-inline-block align-top img-fluid\" alt=\"\">\r\n");
      out.write("\t\t</a>\r\n");
      out.write("\t</div>\r\n");
      out.write("\r\n");
      out.write("\t<div class=\"p-2\">\r\n");
      out.write("\t\t<a class=\"navbar-brand \" href=\"#\"> <img\r\n");
      out.write("\t\t\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/img/banner_image.png\"\r\n");
      out.write("\t\t\tclass=\"d-inline-block align-top img-fluid\" alt=\"\">\r\n");
      out.write("\t\t</a>\r\n");
      out.write("\t</div>\r\n");
      out.write("</nav>");
      out.write("\r\n");
      out.write("<div class=\"KBACE-second-menu\">\r\n");
      out.write("\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\"\r\n");
      out.write("\t\tdata-target=\"#navbarToggleExternalContent\"\r\n");
      out.write("\t\taria-controls=\"navbarToggleExternalContent\" aria-expanded=\"false\"\r\n");
      out.write("\t\taria-label=\"Toggle navigation\">\r\n");
      out.write("\t\t<span onclick=\"\" class=\"navbar-toggler-icon KBACE-toggler-icon\"></span>\r\n");
      out.write("\t</button>\r\n");
      out.write("</div>");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t<div class=\"container-fluid KBACE-background\"\r\n");
      out.write("\t\tstyle=\"padding-bottom: 50px; padding-top: 20px;\">\r\n");
      out.write("\r\n");
      out.write("\t\t<div class=\"row\">\r\n");
      out.write("\t\t\t");
      out.write("\r\n");
      out.write("<!DOCTYPE html >\r\n");
      out.write("<div id=\"navbarToggleExternalContent\"\r\n");
      out.write("\tclass=\" col-md-4 KBACE-sidebar collapse\">\r\n");
      out.write("\t<a class=\"btn KBACE-menu-btn-header btn-lg\"> HOME\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Introduction and overview of\r\n");
      out.write("\t\t\tCatalyst</div>\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\"> CLOUD TRANSACTIONAL\r\n");
      out.write("\t\tTRAINING\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Learn Oracle Applications\r\n");
      out.write("\t\t\tthrough interactive step-by-step training</div>\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\"> CLOUD RELEASE\r\n");
      out.write("\t\tSPOTLIGHT\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Explore the differences between\r\n");
      out.write("\t\t\tOracle Cloud releases</div>\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\"> CLOUD FUTURE-STATE\r\n");
      out.write("\t\tMODELING\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Learn how to effectively\r\n");
      out.write("\t\t\ttransform your business model</div>\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\"> Answer a Question<br>\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Answer questions as the\r\n");
      out.write("\t\t\tassigned subject matter expert</div>\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\">Reports &amp; Manager\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">View reports on Knowledge\r\n");
      out.write("\t\t\tCenter usage, access manager utilities &amp; settings -\r\n");
      out.write("\t\t\tAdministrators Only</div>\r\n");
      out.write("\r\n");
      out.write("\t</a> <a class=\"btn KBACE-menu-btn-header btn-lg\"> LOGOUT\r\n");
      out.write("\t\t<div class=\"KBACE-menu-btn-info\">Bye..</div>\r\n");
      out.write("\t</a>\r\n");
      out.write("</div>");
      out.write("\r\n");
      out.write("\t\t\t<div class=\"col-md-4\">\r\n");
      out.write("\t\t\t\t<div>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white font-bold KBACE-hr\">CLOUD TRANSACTIONAL\r\n");
      out.write("\t\t\t\t\t\tTRAINING</p>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white\">\r\n");
      out.write("\t\t\t\t\t\tKBACE takes pride in offering customers step-by-step transactional\r\n");
      out.write("\t\t\t\t\t\ttraining to make the transition to Oracle Cloud Applications as\r\n");
      out.write("\t\t\t\t\t\tseamless as possible. KBACE's Transactional Training isn't simply\r\n");
      out.write("\t\t\t\t\t\ta recording of a transaction, but rather allows users to click in\r\n");
      out.write("\t\t\t\t\t\tfields, enter data and select from menus just as they would in a\r\n");
      out.write("\t\t\t\t\t\tlive system! <br>Learning a new system is imperative to a\r\n");
      out.write("\t\t\t\t\t\tsuccessful implementation, and KBACE uses working Cloud Instances\r\n");
      out.write("\t\t\t\t\t\tto record real world transactions meant to augment both\r\n");
      out.write("\t\t\t\t\t\timplementation team and end user training.<br> Click the\r\n");
      out.write("\t\t\t\t\t\tCloud Transactional Training button to get your training started\r\n");
      out.write("\t\t\t\t\t\ttoday!\r\n");
      out.write("\t\t\t\t\t</p>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t<div>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white font-bold KBACE-hr\">CLOUD RELEASE\r\n");
      out.write("\t\t\t\t\t\tSPOTLIGHT</p>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white\">\r\n");
      out.write("\t\t\t\t\t\tKBACE recognizes the importance for customers to get up to speed\r\n");
      out.write("\t\t\t\t\t\ton the latest cloud releases. <br>Spotlight videos and\r\n");
      out.write("\t\t\t\t\t\trelease information are valuable resources to evaluate how your\r\n");
      out.write("\t\t\t\t\t\torganization can benefit from provided enhancements.<br>\r\n");
      out.write("\t\t\t\t\t\tClick the Release Spotlight button to get started reviewing our\r\n");
      out.write("\t\t\t\t\t\tavailable materials today!\r\n");
      out.write("\t\t\t\t\t</p>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white font-bold KBACE-hr\">CLOUD FUTURE-STATE\r\n");
      out.write("\t\t\t\t\t\tMODELING</p>\r\n");
      out.write("\t\t\t\t\t<p class=\"font-white\">\r\n");
      out.write("\t\t\t\t\t\tKBACE recognizes the importance for customers to get up to speed\r\n");
      out.write("\t\t\t\t\t\ton the latest cloud releases. <br>Spotlight videos and\r\n");
      out.write("\t\t\t\t\t\trelease information are valuable resources to evaluate how your\r\n");
      out.write("\t\t\t\t\t\torganization can benefit from provided enhancements.<br>\r\n");
      out.write("\t\t\t\t\t\tClick the Future-State Modeling button to get started managing\r\n");
      out.write("\t\t\t\t\t\tyour organization's transformation activities!\r\n");
      out.write("\t\t\t\t\t</p>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t\t<div class=\"col-md-4\">\r\n");
      out.write("\t\t\t\t<div class=\"embed-responsive embed-responsive-70\">\r\n");
      out.write("\t\t\t\t\t<video class=\"embed-responsive-item\" controls\r\n");
      out.write("\t\t\t\t\t\tposter=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (javax.servlet.jsp.PageContext)_jspx_page_context, null, false));
      out.write("/resources/img/Slide5.png\">\r\n");
      out.write("\t\t\t\t\t\t<source\r\n");
      out.write("\t\t\t\t\t\t\tsrc=\"http://transformation.kbace.com/training/Publishing%20Content/PlayerPackage/data/tpc/33cbda81-d7dc-4cdd-8108-7f80f14a0f68/Parts/KBACE_Methodology_Catalyst_Short.mp4\"\r\n");
      out.write("\t\t\t\t\t\t\ttype=\"video/mp4\">\r\n");
      out.write("\t\t\t\t\t</video>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\r\n");
      out.write("\t</div>\r\n");
      out.write("\t");
      out.write("<!DOCTYPE html>\r\n");
      out.write("\r\n");
      out.write("<body>\r\n");
      out.write("\t<footer id=\"KBACE-footer\">\r\n");
      out.write("\t\t<div class=\"container-fluid bg-footer KBACE-footer-container\">\r\n");
      out.write("\t\t\t<div class=\"row\">\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">FEATURED OFFERING\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle Cloud Cloud</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Subscription Services</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Payroll and Time</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Compensation and Benefits</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Financials</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">SUPPORT SERVICES\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Cloud Subscription Services</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Managed Support</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">DBA Services</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Managed Hosting</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Customer Support</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">LEARNING\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Training</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Education</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">ANALYTICS\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">KBX</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">KBI</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">OBIEE</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">POPULAR LINKS\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Careers</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Mentor</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle Cloud</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Cloud Subscription Services</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t\t<div class=\"col-md-2\">\r\n");
      out.write("\t\t\t\t\t<p class=\"footer-p\">RELATED ORACLE SITES\r\n");
      out.write("\t\t\t\t\t<ul class=\"footer-ul\">\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle UPK Product Page</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle HCM Cloud</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle ERP Cloud</a></li>\r\n");
      out.write("\t\t\t\t\t\t<li><a href=\"#\">Oracle Taleo Cloud</a></li>\r\n");
      out.write("\t\t\t\t\t</ul>\r\n");
      out.write("\t\t\t\t</div>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t\t<div class=\"row\" style=\"margin-left: 0px;\">\r\n");
      out.write("\t\t\t\t<p>\r\n");
      out.write("\t\t\t\t\t<a href=\"#\" class=\"font-KBACE-Green\">Catalyst </a>| <a href=\"#\"\r\n");
      out.write("\t\t\t\t\t\tclass=\"font-KBACE-Green\">Contact Us</a> | <a href=\"#\"\r\n");
      out.write("\t\t\t\t\t\tclass=\"font-KBACE-Green\">Safe Harbor Privacy</a>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t\t<div style=\"margin-left: 0px;\">\r\n");
      out.write("\t\t\t\t<p style=\"color: white;\">© KBACE, A Cognizant Company</p>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t\t<hr class=\"KBACE-footer-hr\">\r\n");
      out.write("\t\t\t<div class=\"row justify-content-center\">\r\n");
      out.write("\t\t\t\t<p align=\"center\" style=\"color: white;\">Unauthorized use of this\r\n");
      out.write("\t\t\t\t\tapplication is prohibited and may be subject to civil and criminal\r\n");
      out.write("\t\t\t\t\tprosecution.\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t</footer>\r\n");
      out.write("</body>\r\n");
      out.write("\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
