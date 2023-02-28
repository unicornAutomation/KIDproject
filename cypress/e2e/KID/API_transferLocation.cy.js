// /// <reference types = "cypress"  />
// const cypress = require('cypress')
const employeeTransfer = require('../../fixtures/employeeTransfer.json')

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

        it("create Ticket Transfer",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/transfer/ticket/create',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "dcCode": "PTN"
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
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/transfer/ticket/item/add',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "dcCurrent": employeeTransfer.dcCurrent,
                    "dcDestination": employeeTransfer.dcDestination,
                    "transferedStaffID": employeeTransfer.transferedStaffID,
                    "transferType": employeeTransfer.transferType,
                    "effectiveDateFrom": employeeTransfer.effectiveDateFrom,
                    "effectiveDateTo": employeeTransfer.effectiveDateTo,
                    "reportToStaffID": employeeTransfer.reportToStaffID,
                    "reason": employeeTransfer.reason
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("update Ticket Status Approve-D (Interface API)",()=> {               
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/transfer/ticket/status/update',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "dcCode": employeeTransfer.dcCurrent,
                    "statusCode": "APPROVE-D"
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("assign Ticket To Owner (2000006)", ()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/manpower/v1/transfer/assign/owner',
                headers : {
                    'x-api-key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "ownerStaffID": "2000006"
                  }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("update Ticket Status Approve (Backend-api)",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/manpower/v1/transfer/update/status',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "status": "APPROVE"
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        
})



