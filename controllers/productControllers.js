const cloudinary = require("cloudinary");
const Products = require("../model/productModel")

const createProduct = async (req,res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        productName, 
        productPrice,
        productDescription,
        productCategory,
    } = req.body;
    const {productImage} = req.files;

    // step 3 : Validate data
    if(!productName || !productPrice || !productDescription || !productCategory || !productImage){
        return res.json({
            success : false,
            message : "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            productImage.path,
            {
                folder : "products",
                crop : "scale"
            }
        )

        // Save to database
        const newProduct = new Products({
            productName : productName,
            productPrice : productPrice,
            productDescription : productDescription,
            productCategory : productCategory,
            productImageUrl : uploadedImage.secure_url
        })
        await newProduct.save();
        res.json({
            success : true,
            message : "Product created successfully",
            product : newProduct
        })


        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }

}


// get all products
const getProducts = async (req,res) => {
    try {
        const allProducts = await Products.find({});
        res.json({
            success : true,
            message : "All products fetched successfully!",
            products : allProducts
        })
        
    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }

}

// fetch single product
const getSingleProduct = async (req,res) => {
    const productId = req.params.id;
    try {
        const singleProduct = await Products.findById(productId);
        res.json({
            success : true,
            message : "Single product fetched successfully!",
            product : singleProduct
        })
        
    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }
}

// update product
const updateProduct = async (req,res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const {
        productName,
        productPrice,
        productDescription,
        productCategory
    } = req.body;
    const {productImage} = req.files;

    // validate data
    if( !productName 
        || !productPrice 
        || !productDescription 
        || !productCategory){
        return res.json({
            success : false,
            message : "Required fields are missing!"
        })
    }

    try {
        // case 1 : if there is image
        if(productImage){
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                productImage.path,
                {
                    folder : "products",
                    crop : "scale"
                }
            )

            // make updated json data
            const updatedData = {
                productName : productName,
                productPrice : productPrice,
                productDescription : productDescription,
                productCategory : productCategory,
                productImageUrl : uploadedImage.secure_url
            }

            // find product and update
            const productId = req.params.id;
            await Products.findByIdAndUpdate(productId, updatedData)
            res.json({
                success : true,
                message : "Product updated successfully with Image!",
                updatedProduct : updatedData
            })

        } else {
            // update without image
            const updatedData = {
                productName : productName,
                productPrice : productPrice,
                productDescription : productDescription,
                productCategory : productCategory,
            }

            // find product and update
            const productId = req.params.id;
            await Products.findByIdAndUpdate(productId, updatedData)
            res.json({
                success : true,
                message : "Product updated successfully without Image!",
                updatedProduct : updatedData
            })
        }
        
    } catch (error) {
        res.status(500).json({  
            success : false,
            message : "Internal server error"
        })
    }
}

// delete product
const deleteProduct = async (req,res) =>{
    const productId = req.params.id;

    try {
        await Products.findByIdAndDelete(productId);
        res.json({
            success : true,
            message : "Product deleted successfully!"
        })
        
    } catch (error) {
        res.json({
            success : false,
            message : "Server error!!"
        })
    }
}
//pagination route
const getPagination=async(req,res)=>{
//step:1 get the page user requested
const requestedPage=req.query.page;
//step:2 result per page
const resultPerPage=2;
try {
    //step3: Fetch all the products
    //result: (test1,test2,test3,test4,test5,test6)
    const products= await Products.find({})
    //step4: skip the data
.skip((requestedPage-1)*resultPerPage)
//limit per page data
.limit(resultPerPage)
if(products.length===0){
    return res,json({
        succes:false,
        message:"No products found!"
    })
}
res.json({
    success:true,
    products:products
})
                                           
} catch (error) {
    console.log(error)
    res.send("Error occured in pagination")
}
};


module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getPagination
}