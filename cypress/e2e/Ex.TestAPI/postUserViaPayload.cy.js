/// <reference types="Cypress" />

const dataJson = require('../../fixtures/adduser.json')

describe('post user request', () => {
let accessToken = '007526d9efdbc07e084ff7a6d4cfcc90588fbe20641c00faebf45a7f3b2eaf33'

    it('Add user', () => {
            // create
        cy.request({
                method: 'POST',
                url: 'https://gorest.co.in/public/v1/users',
                headers: {
                    'Authorization': 'Bearer '+ accessToken
                },
                body: {
                    "name": dataJson.name,
                    "gender": dataJson.gender,
                    "email": dataJson.email,
                    "status":dataJson.status
                }
        }).then((res)=>{
                expect(res.status).to.eq(201)
                expect(res.body.data).has.property('email', dataJson.email)
                expect(res.body.data).has.property('name',dataJson.name)
                expect(res.body.data).has.property('status',dataJson.status)
                expect(res.body.data).has.property('gender',dataJson.gender)
            }).then((res)=> {
            // get id 
                const userId = res.body.data.id
                cy.log(res.body.data)
                cy.log("user id is: " + userId)
                    cy.request({
                        method : 'GET',
                        url : 'https://gorest.co.in/public/v1/users/'+userId,
                        headers : {
                            'Authorization': 'Bearer ' + accessToken
                        }
            
                    }).then((res)=>{
                            expect(res.status).to.eq(200)
                            expect(res.body.data).has.property('name', dataJson.name)
                        })
                    })

                
    })
})