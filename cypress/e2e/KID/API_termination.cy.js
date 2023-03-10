// /// <reference types = "cypress"  />
// const cypress = require('cypress')
const employeeTermination = require('../../fixtures/employeeTermination.json')

describe("E2E 1", ()=> {

    before(()=> {

        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4001/kid-backend-api/auth/v1/staff/login',
            body : {
                    "username": "2000007", 
                    "password": "123456"
            }

            }).then((res)=>{
                    expect(res.status).to.eq(200)
                    Cypress.env('token_approval', res.body.result.token)
        })

        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4001/kid-backend-api/auth/v1/staff/login',
            body : {
                    "username": "2000006", 
                    "password": "123456"
            }

            }).then((res)=>{
                    expect(res.status).to.eq(200)
                    Cypress.env('token_reviewer', res.body.result.token)
        })
    })

    it("create Ticket Termination",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/terminate-resign/ticket/create',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "dcCode": employeeTermination.dcCode,
                "requestTypeCode": employeeTermination.requestTypeCodeTerminate,
                "requestTypeCodeDetail": employeeTermination.requestTypeCodeDetailTerminate
            }
        }).then((res)=>{
                expect(res.status).to.eq(200)
                Cypress.env('ticketNumber',res.body.result.ticketNumber)
                Cypress.env('dcCode',res.body.result.dcCode)
                cy.log(Cypress.env('ticketNumber'))
        })
                    
    })

    it("add Item To Ticket",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/terminate-resign/ticket/item/add',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "staffID": employeeTermination.staffID,
                "effectiveDate": employeeTermination.effectiveDate,
                "lastWorkingDate": employeeTermination.lastWorkingDate,
                "reasons": [
                  {
                    "reasonCode": employeeTermination.reasonCodeTerminate
                  }
                ]
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it("update Ticket Status Approve (Interface API)",()=> {               
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/terminate-resign/ticket/status/update',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "dcCode": employeeTermination.dcCode,
                "statusCode": employeeTermination.statusCode
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it("assign Ticket To Owner (2000006)", ()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4001/kid-backend-api/resign-terminate/v1/assign/owner',
            headers : {
                'x-api-key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "ownerStaffID": "2000006"
            }
        }).then((res)=> {
            cy.log(Cypress.env('ticketNumber'))
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it("update Ticket Status Approve (Backend-api)",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4001/kid-backend-api/resign-terminate/v1/update/status',
            headers : {
                // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                'Authorization':'Bearer '+ Cypress.env('token_reviewer')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "status": employeeTermination.status
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    }) 

        
})



