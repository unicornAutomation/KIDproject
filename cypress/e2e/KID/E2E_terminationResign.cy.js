import { login } from '../../support/function'
const functions = require('../../support/function')
const employeeTermination = require('../../fixtures/employeeTermination.json')

describe("Recruitment E2E", () => {

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

    it('E2E 1',{keystrokeDelay:0}, () => {
        cy.visit('http://10.112.85.185:4000/portal/Login')
        functions.login('2000007','123456'),
        functions.assignTicketTerminationResignAssignment(),
        functions.logout('อิทธิพัทธ์ มั่นคง'),
        functions.login('2000006','123456'),
        functions.submitTerminationResignAdjustment()
    })
})