import { login } from '../../support/function'
const functions = require('../../support/function')
const employee = require('../../fixtures/employeeRecruitment.json')

describe("Recruitment E2E", () => {

    before(() => {

        cy.request({
            method: 'POST',
            url: 'http://10.112.85.184:4001/kid-backend-api/auth/v1/staff/login',
            body: {
                "username": "2000007",
                "password": "123456"
            }

        }).then((res) => {
            expect(res.status).to.eq(200)
            Cypress.env('token_approval', res.body.result.token)
        })

        cy.request({
            method: 'POST',
            url: 'http://10.112.85.184:4001/kid-backend-api/auth/v1/staff/login',
            body: {
                "username": "2000008",
                "password": "123456"
            }

        }).then((res) => {
            expect(res.status).to.eq(200)
            Cypress.env('token_approve', res.body.result.token)
        })

    })

    it("create ticket",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/ticket/create',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : {
                "dcCode": "PTN",
                "requestTypeCode": "PART-TIME"
            }

        }).then((res)=>{
                expect(res.status).to.eq(200)
                Cypress.env('ticketNumber',res.body.result[0].ticketNumber)
                Cypress.env('dcCode',res.body.result[0].dcCode)
                cy.log(Cypress.env('ticketNumber'))
        })
                    
    })

    it("add manpower ticket",()=> {
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/ticket/item/add',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approval'),
                'Authorization':'Bearer '+ Cypress.env('token_approval')
            },
            body : [{
                "ticketNumber": Cypress.env('ticketNumber'),
                "dcCode": "PTN",
                "positionCode": employee.positionCode,
                "requestQty": 1
            }]
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it("update status",()=> {               
        cy.request({
            method : 'POST',
            url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/ticket/info/status/update',
            headers : {
                'API-Key':'Bearer '+ Cypress.env('token_approve'),
                'Authorization':'Bearer '+ Cypress.env('token_approve')
            },
            body : {
                "ticketNumber": Cypress.env('ticketNumber'),
                "dcCode": Cypress.env('dcCode'),
                "statusCode": "APPROVE"
            }
        }).then((res)=> {
            expect(res.status).to.eq(200)
            expect(res.body.description).to.contain("Success")
            })
    })

    it('E2E 1',{keystrokeDelay:0}, () => {
        cy.visit('http://10.112.85.185:4000/portal/Login')
        functions.login('2000007','123456'),
        functions.assignTicketAssignment(),
        functions.logout('อิทธิพัทธ์ มั่นคง'),
        functions.login('2000006','123456'),
        functions.recruiterAssignment(),
        functions.recruiter()
        functions.logout('อนิรุทธิ์ บานชื่น'),
        functions.login('2000007','123456'),
        functions.approvePR(),
        functions.addContract()
    })
})