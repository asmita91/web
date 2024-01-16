const { text } = require('body-parser');
const request=require('supertest');
const app=require('../index');

// Make collection of test cases
describe('API Endpoints Test',()=>{
    // Testing test route '/test'
    it('GET /test | Response should be text',async()=>{
        const response=await request(app).get('/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello from server');
    })

    // Testing fetch all products route 'api/product/get_products'

    it('GET /api/product/get_products | Response should be json',async()=>{
        const response=await request(app).get('/api/product/get_products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("All products fetched successfully!");

    })

    //creating user
    it("POST /api/user/create | Response with success message", async()=>{
        const response=await request(app).post('/api/user/create').send({
            firstName:"John",
            lastName:"katel",
            email:"asm@gmail.com",
            password:"123456",
        })
        if(response.body.success){
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("User Created Successfully");
        }
        else{
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("User already exists");
        }

    })
   
    it('Check user login', async()=>{
        const response=await request(app).post('/api/user/login').send({
            email:"asm@gmail.com",
            password:"123456"
        });
if(!response.body.success){
    expect(response.body.message).toEqual("User does not exists");

}
expect(response.statusCode).toBe(200);
expect(response.body.message).toEqual("User Logged in successfully");
    })

    //fetching single product
    it("/GET /api/product/get_product/:id | Response should be json", async()=>{
        const response=await request(app).get("/api/product/get_product/6596c78fd4e18cbebfc849a9");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('product');
    })

})