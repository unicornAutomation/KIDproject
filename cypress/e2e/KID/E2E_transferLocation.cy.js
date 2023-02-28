import { login } from '../../support/function'
const functions = require('../../support/function')
const employeeTransfer = require('../../fixtures/employeeTransfer.json')

describe("Recruitment E2E", () => {

    before(()=> {
        cy.visit('http://10.112.85.185:4000/portal/Login').viewport(1280, 800)

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

    it("create ticket",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/transfer/ticket/create',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "dcCode": "PTN",
            }

        }).then((res)=>{
                expect(res.status).to.eq(200)
                Cypress.env('ticketNumber',res.body.result.ticketNumber)
                Cypress.env('dcCode',res.body.result.dcCode)
                cy.log(Cypress.env('ticketNumber'))
        })
                    
    })

    it("add manpower transfer ticket",()=> {
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
                "reportToStaffID": employeeTransfer.reportToStaffID
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it("update status",()=> {               
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/transfer/ticket/status/update',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "dcCode": Cypress.env('dcCode'),
                "statusCode": "APPROVE-D"
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it('E2E 1',{keystrokeDelay:0}, () => {
        functions.login('2000007','123456'),
        functions.assignTicketTransferAssignment(),
        functions.logout('อิทธิพัทธ์ มั่นคง'),
        functions.login('2000006','123456'),
        functions.submitLocationAdjustment()
    })
})