var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

//Connects to the mysql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) {
    console.error("error connecting: " + err.stack);
  }

	listProducts();
});

//This function loads the list of products from the database to the console
function listProducts() {
	var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
		if (err) {
			console.error("error connecting: " + err.stack);
		}
		//console.table draws out a table with the response (res).
		console.table(res);
		
  });
}
