//import
const router=require('express').Router();
const express = require("express");

const productController=require('../controllers/productControllers.js');

const {authGuard,authGuardAdmin } = require('../middleware/authGuard.js');


//all the routes for the product
router.post('/create_product',  productController.createProduct)

//get all products
router.get("/get_products",productController.getProducts)

//single product 
router.get("/get_product/:id", productController.getSingleProduct)

//update product
router.put("/update_product/:id", productController.updateProduct)

//delete product
router.delete("/delete_product/:id", productController.deleteProduct)


//pagination routes
router.get('/get_pagination',productController.getPagination)
//export
module.exports=router;
