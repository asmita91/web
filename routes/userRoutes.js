//import
const router=require('express').Router();


const userController=require('../controllers/userControllers.js');

const {authGuard,authGuardAdmin } = require('../middleware/authGuard.js');


//all the routes for the user
router.post('/create', userController.createUser);
router.post('/login',userController.loginUser);


//get all products
router.get("/get_users",userController.getUsers)

//single product 
router.get("/get_user/:id", userController.getSingleUser)

//update product
router.put("/update_user/:id",authGuard,authGuardAdmin, userController.editProfile)

router.get('/my_profile', authGuard, userController.getMyProfile);

// Update the profile of the logged-in user
router.put('/update_my_profile', authGuard, userController.updateMyProfile);

//export
module.exports=router;