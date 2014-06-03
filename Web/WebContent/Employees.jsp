<?xml version='1.0' encoding='UTF-8'?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.sql.*"%>

<%	
	Connection conn = null;
	PreparedStatement stmt = null;
	ResultSet rs = null;
	ResultSet rsCount = null;
	try
	{
		Class.forName("org.apache.derby.jdbc.ClientDriver");
		conn = DriverManager.getConnection("jdbc:derby://localhost:1527/AjaxData");
		
		String sqlCount = "SELECT COUNT(EmployeeID) AS NumEmployees FROM Employees";
		String sqlEmployees = "SELECT FirstName, LastName, EmployeeID, Title, BirthDate, HireDate, Extension FROM Employees";
		stmt = conn.prepareStatement(sqlCount);
		rsCount = stmt.executeQuery();
		stmt = conn.prepareStatement(sqlEmployees);
		rs = stmt.executeQuery();
		
		response.setContentType("text/xml");
		
		rsCount.next();
		out.write("<Employees TotalRows='" + rsCount.getString("NumEmployees") + "'>");
	
		rs = stmt.executeQuery();
		while (rs.next())
		{
			out.write("<Employee id='" + rs.getString("EmployeeID") + "'>");
			out.write("<SalesPerson>" + rs.getString("FirstName") + " " + rs.getString("LastName") +"</SalesPerson>");
			out.write("<Title>" + rs.getString("Title") + "</Title>");
			out.write("<BirthDate>" + rs.getString("BirthDate") + "</BirthDate>");
			out.write("<HireDate>" + rs.getString("HireDate") + "</HireDate>");
			out.write("<Extension>" + rs.getString("Extension") + "</Extension>");
			out.write("</Employee>");
		}
		
		out.write("</Employees>");
	}
	catch (Exception e)
	{
		out.write(e.toString());
	}
	finally 
	{
		if (rsCount != null) rsCount.close();
		if (rs != null) rs.close();
		if (stmt != null) stmt.close();
		if (conn != null) conn.close();
	}
%>