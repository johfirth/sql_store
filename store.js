var Sequelize = require('sequelize');
var inquirer = require("inquirer");
var sequelize = new Sequelize('sql_store', 'root', '',{
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});

const prompt = inquirer.prompt

sequelize
  .authenticate()
  .then(() => {
    var Product = sequelize.define('product', {
      product_name: Sequelize.STRING,
      department_name: Sequelize.STRING,
      price: Sequelize.FLOAT,
      stock_quantity: Sequelize.INTEGER
      
    });

    Product.sync({force: true}).then(()=> {
      Product.create({ 
        product_name: 'Tide',
        department_name: 'Home',
        price: 5.5 ,
        stock_quantity: 10
       })
       Product.create({ 
        product_name: 'Bottle Water',
        department_name: 'Groceries',
        price: 1.5 ,
        stock_quantity: 20
       })
       Product.create({ 
        product_name: 'Corn',
        department_name: 'Veggies',
        price: 2 ,
        stock_quantity: 15
       })
       Product.create({ 
        product_name: 'La Croix',
        department_name: 'Groceries',
        price: 4.75 ,
        stock_quantity: 12
       })
       Product.create({ 
        product_name: 'Blender',
        department_name: 'Appliances',
        price: 55.75 ,
        stock_quantity: 5
       })
       Product.create({ 
        product_name: 'Echo Show',
        department_name: 'Computers',
        price: 150 ,
        stock_quantity: 10
       })
       Product.create({ 
        product_name: 'Light Bulbs',
        department_name: 'Home',
        price: 8 ,
        stock_quantity: 14
       })
    }).then( function question() {
          inquirer.prompt([
            {
              type: 'list',
              name: 'doSomething',
              message: 'What would you like to do?',
              choices: ['View Items in Stock', 'Purchase Item']
              }
          ]).then(response => {
            if (response.doSomething === 'View Items in Stock'){
              Product.findAll().then( products => {
                products.forEach( items => {
                  let item = JSON.parse(JSON.stringify(items));
                  for (const key in item){
                    console.log(key +'      '+ item[key])
                  
                  }
                  console.log('______________________________________')
                })
              })
            question();
            }
              if (response.doSomething === 'Purchase Item'){
                inquirer.prompt([
                  {type:'input',
                   name: 'likeToPurchase',
                   message: 'Please type item ID:'},
                  {type:'input',
                   name: 'numberToPurchase',
                  message: 'How many would you like?'}  
                ]).then( itemChosen => {
                  let itemId = itemChosen.likeToPurchase;
                  let purchaseNumber = itemChosen.numberToPurchase

                  Product.findById(itemId).then(item => {
                    console.log('You would are purchasing '+ purchaseNumber + ' ' + item.product_name)

                    if (item.stock_quantity < purchaseNumber){
                      console.log ('Sorry we dont have that many in stock');
                      question();
                    }
                    if (item.stock_quantity > purchaseNumber){
                      let newItemQuantity = (item.stock_quantity - purchaseNumber);
                          item.update({
                          stock_quantity: newItemQuantity
                          });
                        question();
                    }
                  })
                })
              }
            })
        })



  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
