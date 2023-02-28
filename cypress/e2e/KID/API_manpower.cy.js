{/* <reference types = "cypress"  />
const cypress = require('cypress') */}
const employeeManpower = require('../../fixtures/employeeManpower.json')

describe("E2E 1", ()=> {

    before(()=> {

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
                    "username": "2000006",
                    "password": "123456"
                }

            }).then((res) => {
                expect(res.status).to.eq(200)
                Cypress.env('token_reviewer', res.body.result.token)
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
                    "requestTypeCode": "FULL-TIME"
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
                    "positionCode": employeeManpower.positionCode,
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
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
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


        it("assign ticket to owner", ()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/ticket/v1/assign/owner',
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

        it("get ticket reviewer info",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/ticket/v1/reviewer/info',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber')
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                Cypress.env('itemID',res.body.result.items[0].itemID)
                })



        })

        it("assign manpower to list",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/ticket/v1/reviewer/assign',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "itemID": Cypress.env('itemID'),
                    "recruiterType": "ADHOC",
                    "assignQty": 5
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("assign employeeManpower to PR",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/pr/v1/item/add',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : 
                [
                    {
                    "ticketNumber": employeeManpower.ticketNumber,
                    "positionCode": employeeManpower.positionCode,
                    "contractNumber": employeeManpower.contractNumber,
                    "idcardNumber": employeeManpower.idcardNumber,
                    "mobilePhoneNumber": employeeManpower.mobilePhoneNumber,
                    "driverLicenseNumber": employeeManpower.driverLicenseNumber,
                    "carLicensePlateNumber": employeeManpower.carLicensePlateNumber,
                    "titleTh": employeeManpower.titleTh,
                    "titleEn": employeeManpower.titleEn,
                    "firstNameTh": employeeManpower.firstNameTh,
                    "firstNameEn": employeeManpower.firstNameEn,
                    "lastNameTh": employeeManpower.lastNameTh,
                    "lastNameEn": employeeManpower.lastNameEn
                    }
                ]
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
                })
        })

        it('get PR info',()=> {
            cy.request({
            method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/pr/v1/info',
                headers :  {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": employeeManpower.ticketNumber,
                    "positionCode": employeeManpower.positionCode
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
                Cypress.env('requestNo',res.body.result[0].staffRequestNumber)
                cy.log(Cypress.env('requestNo'))
            })
        })

        it("update Ticket Status",() => {
            cy.request({
            method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/pr/v1/status/Update',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : 
                    {
                        "positionCode": employeeManpower.positionCode,
                        "statusCode": "SUBMIT",
                        "ticketNumber": employeeManpower.ticketNumber
                    }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
                })
        })

        it("update Ticket Date",() => {
            cy.request({
            method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/pr/v1/item/onboarding/update',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : 
                    {
                        "ticketNumber": employeeManpower.ticketNumber,
                        "requestNumber": Cypress.env('requestNo'),
                        "onboardingDate": "2022-06-24"
                    }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
                })
        })

        it("Approval submit to onboarding",() => {
            cy.request({
            method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/ticket/v1/approval/submit',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : 
                    {
                        "ticketNumber": employeeManpower.ticketNumber,
                        "staffRequestNumber": Cypress.env('requestNo'),
                        "status": "APPROVE",
                    }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
                })
        })

        it("Confirm download document",() => {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/onboarding/document/download/confirm',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body :
                    {
                        "staffRequestNumber": Cypress.env('requestNo'),
                        "ticketNumber": employeeManpower.ticketNumber
                    }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
            })
        })

        it("Confirm update onboarding",() => {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/manpower/onboarding/status/update',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')   
                },
                body :
                    {
                        "staffRequestNumber": Cypress.env('requestNo'),
                        "onboardingStatus": "CONFIRM",
                        "actualOnboardingDate": "2022-09-21"
                    }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success") 
            })
        })
})



