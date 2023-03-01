const employeeTimeAdjustment = require('../../fixtures/employeeTimeAssignment.json')

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
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/time-attendance/clock/ticket/create',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "dcCode": employeeTimeAdjustment.dcCode
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
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/time-attendance/clock/ticket/item/add',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : [{
                    "staffID": employeeTimeAdjustment.staffID,
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "clockDate": employeeTimeAdjustment.clockDate,
                    "clockInDateTime": employeeTimeAdjustment.clockInDateTime,
                    "clockOutDateTime": employeeTimeAdjustment.clockOutDateTime,
                    "reasonCode": employeeTimeAdjustment.reasonCode
                }]
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("update Ticket Status Approve (Interface API)",()=> {               
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/time-attendance/clock/ticket/info/status/update',
                headers : {
                    'API-Key':'Bearer '+ Cypress.env('token_approval'),
                    'Authorization':'Bearer '+ Cypress.env('token_approval')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "dcCode": employeeTimeAdjustment.dcCode,
                    "statusCode": employeeTimeAdjustment.statusCode
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })

        it("assign Ticket To Owner (2000006)", ()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/clockio/v1/timeadjustment/assign/owner',
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

        it("get Ticket ID for add item (Backend-api)",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/clockio/v1/timeadjustment/info',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                Cypress.env('timeAdjustmentTicketID',res.body.result.items[0].timeAdjustmentTicketID)
                cy.log(Cypress.env('timeAdjustmentTicketID'))
                expect(res.body.description).to.contain("Success")

                })
        }) 

        it("update item (Backend-api)",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4001/kid-backend-api/clockio/v1/timeadjustment/update/item',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "items": [
                      {
                        "timeAdjustmentTicketID": Cypress.env('timeAdjustmentTicketID'),
                        "adjustmentClockInTime": employeeTimeAdjustment.adjustmentClockInTime,
                        "adjustmentClockOutTime": employeeTimeAdjustment.adjustmentClockOutTime
                      }
                    ]
                  }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })  

        it("update Ticket Status Approve (Backend-api)",()=> {
            cy.request({
                method : 'POST',
                url : 'http://10.112.85.184:4002/kid-api/interface/v1/time-attendance/clock/ticket/info/status/update',
                headers : {
                    // 'x-api-key':'Bearer '+ Cypress.env('token_reviewer'),
                    'Authorization':'Bearer '+ Cypress.env('token_reviewer')
                },
                body : {
                    "ticketNumber": Cypress.env('ticketNumber'),
                    "dcCode": employeeTimeAdjustment.dcCode,
                    "statusCode": "APPROVE"
                }
            }).then((res)=> {
                expect(res.status).to.eq(200)
                expect(res.body.description).to.contain("Success")
                })
        })    
    

})



