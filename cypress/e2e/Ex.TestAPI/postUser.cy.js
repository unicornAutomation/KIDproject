/// <reference types="cypress" />
describe("Test POST method 101", ()=> {

    let accessToken = "007526d9efdbc07e084ff7a6d4cfcc90588fbe20641c00faebf45a7f3b2eaf33"

    it("Add user",()=> {

        cy.request({
            method : 'POST',
            url : 'https://gorest.co.in/public/v1/users',
            headers : {
                'authorization' : 'Bearer '+ accessToken
                    
            },
            body : {
                "name":"Test Automation Labs",
                "gender":"female",
                "email": "nntest19900@gmail.com",
                "status":"active"
            }
        }).then((res)=>{
                expect(res.status).to.eq(201)
                expect(res.body.data).has.property('name','Test Automation Labs')
            })
    })
})
