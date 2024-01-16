
const { response } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../model/userModel");
const User = require("../model/userModel");
 
const createUser = async (req,res) => {
  // step 1 : Check if data is coming or not
  console.log(req.body);

  // step 2 : Destructure the data
  const { firstName, lastName, email, password } = req.body;

  // step 3 : validate the incomming data
  if(!firstName || !lastName || !email || !password){
      return res.json({
          success : false,
          message : "Please enter all the fields."
      })
  }

  // step 4 : try catch block
  try {
      // step 5 : Check existing user
      const existingUser = await Users.findOne({email: email})
      if(existingUser){
          return res.json({
              success : false,
              message : "User already exists."
          })
      }

      // password encryption
      const randomSalt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password,randomSalt)

      // step 6 : create new user
      const newUser = new Users({
          // fieldname : incomming data name
          firstName : firstName,
          lastName : lastName,
          email : email,
          password : encryptedPassword,
      })

      // step 7 : save user and response
      await newUser.save();
      res.status(200).json({
          success : true,
          message : "User created successfully."
      })

      
  } catch (error) {
      console.log(error);
      res.status(500).json("Server Error")
  }

  
}
 
const loginUser = async (req, res) => {
  // Step 1: Check incoming data
  console.log(req.body);
 
  // Destruction
  const { email, password } = req.body;
 
  // Validation
  if (!email || !password) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
 
  // try catch block
  try {
    //  finding users
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }
 
    // User exist
    // Comparing Password
    const databasePassword = user.password;
    const isMatched = await bcrypt.compare(password, databasePassword);
 
    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
 
    // Create token
    const token = await jwt.sign({ id: user._id, isAdmin:user.isAdmin }, process.env.JWT_SECRET);
 
    //  response
    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server error",
      error: error,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    // Fetch user details except the password
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Build a user object
  let userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;

  try {
    let user = await Users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user
    user = await Users.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    );

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUsers = async (req,res) => {
  try {
      const allUsers = await User.find({});
      res.json({
          success : true,
          message : "All users fetched successfully!",
          products : allUsers
      })
      
  } catch (error) {
      console.log(error);
      res.send("Internal server error")
  }
}
const getSingleUser = async (req,res) => {
  const userId = req.params.id;
  try {
      const singleUser = await User.findById(userId);
      res.json({
          success : true,
          message : "Single user fetched successfully!",
          product : singleUser
      })
      
  } catch (error) {
      console.log(error);
      res.send("Internal server error")
  }
}
const getMyProfile = async (req, res) => {
  try {
    // Fetch user details except the password using the ID from JWT token
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to update the profile of the logged-in user
const updateMyProfile = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const userFields = { firstName, lastName, email };
  try {
    let user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Update the user profile
    user = await Users.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select('-password');
    // localStorage.setItem("user", JSON.stringify(res.data.user));

    res.json({ success: true, message: "Profile updated successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// update product
// const editProfile = async (req,res) => {
//   // step 1 : check incomming data
//   console.log(req.body);
//   console.log(req.files);

//   // destructuring data
//   const {
//       firstName,
//       lastName,
//       email,
     
//   } = req.body;
 

//   // validate data
//   if( !firstName 
//       || !lastName 
//       || !email 
//      ){
//       return res.json({
//           success : false,
//           message : "Required fields are missing!"
//       })
//   }

//   try {
//           // make updated json data
//           const updatedData = {
//             firstName : firstName,
//             lastName : lastName,
//             email : email,
//           }

//           // find product and update
//           const userId = req.params.id;
//           await Users.findByIdAndUpdate(userId, updatedData)
//           res.json({
//               success : true,
//               message : "User Profile updated successfully ",
//               updatedUser : updatedData
//           })
//   } catch (error) {
//       res.status(500).json({  
//           success : false,
//           message : "Internal server error"
//       })
//   }
// }

 
module.exports = {
  createUser,
  loginUser,
  getProfile,
  editProfile,
  getSingleUser,
  getUsers, getMyProfile, updateMyProfile
};
