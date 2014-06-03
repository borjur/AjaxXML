<?xml version='1.0' encoding='UTF-8'?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.sql.*, java.net.URLEncoder"%>

<%	
	Connection conn = null;
	PreparedStatement stmt = null;
	ResultSet rs = null;
	ResultSet rsCount = null;
	try
	{
		Class.forName("org.apache.derby.jdbc.ClientDriver");
		conn = DriverManager.getConnection("jdbc:derby://localhost:1527/AjaxData");
		
		String sqlCount = "SELECT COUNT(OrderID) AS NumOrders FROM Orders";
		String sqlOrders = "SELECT e.FirstName, e.LastName, o.OrderID, o.OrderDate, c.CompanyName";
		sqlOrders += " FROM Employees e, Orders o, Customers c";
		sqlOrders += " WHERE e.EmployeeID = o.EmployeeID AND c.CustomerID = o.CustomerID";
		stmt = conn.prepareStatement(sqlCount);
		rsCount = stmt.executeQuery();
		stmt = conn.prepareStatement(sqlOrders);
		rs = stmt.executeQuery();
		
		response.setContentType("text/xml");
		
		rsCount.next();
		out.write("<Orders TotalRows='" + rsCount.getString("NumOrders") + "'>");
	
		while (rs.next())
		{
			String orderID = rs.getString("OrderID");
			out.write("<Order id='" + orderID + "'>");
			out.write("<SalesPerson>" + rs.getString("FirstName") + " " + rs.getString("LastName") + "</SalesPerson>");
			out.write("<Customer>" + URLEncoder.encode(rs.getString("CompanyName"), "UTF-8").replaceAll("\\+","%20") + "</Customer>");
			out.write("<OrderID>" + orderID + "</OrderID>");
			out.write("<OrderDate>" + rs.getString("OrderDate") + "</OrderDate>");
			out.write("</Order>");
		}
		out.write("</Orders>");
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