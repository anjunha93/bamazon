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
	if (err) throw err;

	listProducts(function() {
		promptCustomer();
	});
});

//This function loads the list of products from the database to the console
function listProducts(callback) {
	var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
		if (err) throw err;
		
		var inventory = [];
		for (var i = 0; i < res.length; i++) {
			inventory.push({
				item: res[i].item_id,
				product: res[i].product_name,
				price: res[i].price,
				quantity: res[i].stock_quantity
			})
		}
		//console.table draws out a table with the response (res).
		console.table(inventory);
		callback(inventory);
  });
}

//Will prompt user to choose the id of the product they would like to purchase and the quantity
function promptCustomer() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "productID",
				message: "What is the ID of the item you would like to purchase?"
			},
			{
				type: "input",
				name: "quantity",
				message: "How many units would you like to purchase?"
			}
		])
	.then(function(inquirerResponse){
		checkQuantity(inquirerResponse.productID, function(quantity, price){
			if(inquirerResponse.quantity > quantity) {
					console.log("Not enough in inventory.")
					listProducts(function() {
						promptCustomer();
					});
			} else {
					quantity -= inquirerResponse.quantity;
					updateQuantity(inquirerResponse.productID, quantity);
					var total = inquirerResponse.quantity * price;
					productSales(inquirerResponse.productID, total);
					console.log("The total amount due is: " + total);
					listProducts(function() {
						promptCustomer();
				});
			}
		});
	});
}

function checkQuantity(item_id, callback) {
	connection.query('SELECT * FROM `products` WHERE `item_id` = ?',
	[item_id],
	function(err, res) {
		if (err) throw err;
		callback(res[0].stock_quantity, res[0].price)
	});
}

function updateQuantity(item_id, quantity) {
	var query = connection.query(
		'UPDATE products SET ? WHERE ?',
		[
			{
				stock_quantity: quantity
			},
			{
				item_id: item_id
			}
		],
		function(err, res) {
		}
	);
}

function productSales(item_id, total) {
  var query = connection.query(
    "UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?",
    [total, item_id],
    function(err, res) {
    }
  );
}