const employeeManpower = require('../../fixtures/employeeManpower.json')

describe("E2E 1", ()=> {

    before(()=> {

        cy.request({
                method : 'POST',
                url : 'https://poc-it.th.kerryexpress.com/kservice/v1/auth/login',
                body : {
                        "username": "2000007", 
                        "password": "123456"
                }

            }).then((res)=>{
                    expect(res.status).to.eq(200)
                    Cypress.env('token_approval', res.body.result.accessToken)
        })

    })

        it("kservice/v1/manpower/ticket/create",()=> {
            cy.request({
                method : 'POST',
                url : 'https://poc-it.th.kerryexpress.com/kservice/v1/manpower/ticket/create',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "locationID": employeeManpower.dcCode,
                    "categoryValue": employeeManpower.typeStaff,
                    "items": [
                      {
                        "positionCode": employeeManpower.positionCode,
                        "qty": employeeManpower.qty
                      }
                    ]
                }

            }).then((res)=>{
                    expect(res.status).to.eq(200)
                    Cypress.env('ticketNumber', res.body.result.ticketNumber)
                    cy.log(Cypress.env('ticketNumber'))
            })
                        
        })

        
})



