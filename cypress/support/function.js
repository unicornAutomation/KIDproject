const employee = require('../../cypress/fixtures/employeeRecruitment.json')

export const login = (username, password) => {
    cy.get('#inputUserName').type(username, {force:true})
    cy.get('#inputPassword').type(password, {force:true})
    cy.get('#btnLogin').click({force:true})

}

export const assignTicketAssignment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Ticket Assignment').click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff')
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').contains(Cypress.env('ticketNumber')).click()
    cy.get('#select2-owner-container').type(employee.selectOwner)
    cy.get('#select2-owner-results').click()
    cy.get('#btnDropdown').click()
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#Assign').click({force: true})
}

export const assignTicketTimeAssignment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Time Assignment').click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click()
    cy.get('#data > :nth-child(1) > :nth-child(1)').contains(Cypress.env('ticketNumber')).click()
    cy.get('#owner').select(employee.selectOwner)
    cy.get('#btnDropdown').click()
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#Assign').click()
}

export const assignTicketTransferAssignment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Location Assignment').click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilter').click()
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').contains(Cypress.env('ticketNumber')).click()
    cy.get('.card-body > .border').scrollIntoView()
    cy.get('#owner').select(employee.selectOwner)
    cy.get('#btnDropdown').scrollIntoView().wait(2000).click()
    cy.get('#selectStatus').scrollIntoView().contains('SUBMIT').click()
    cy.get('#Assign').click()
}

export const assignTicketTerminationResignAssignment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Terminate/Resign Assignment').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilter').click().wait(1000)
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').contains(Cypress.env('ticketNumber')).click().wait(1000)
    cy.get('.card-body > .border').scrollIntoView()
    cy.get('#owner').wait(1000).select('2000006')
    cy.get('#btnDropdown').scrollIntoView().wait(1000).click()
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#Assign').click()
}

export const logout = (user) => {
    cy.wait(1000)
    cy.get('#staffName').scrollIntoView().wait(3000)
    cy.get('.dropdown-toggle').contains(user).click()
    cy.get('[onclick="doLogout()"]').click()
}

export const recruiterAssignment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Recruiter Assignment').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click()
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').contains(Cypress.env('ticketNumber')).click()
    cy.get('#btnGotoAssign').scrollIntoView({ easing: 'linear' })
    cy.get('#btnGotoAssign').wait(1000).scrollIntoView().wait(1000).click()
    cy.get('#modalSuccess').find().should('not.exist')
    cy.get('#positionAssign').select(employee.positionCode)
    cy.get('#selectRecruiter').select(employee.recruiter)
    cy.get('#inputQTY').type(employee.qty)
    cy.get('#btnAssign').click()
    cy.get('#btnClickAssign').wait(1000).scrollIntoView().wait(1000).click()
    // cy.get('#modalSuccess').find().should('not.exist')

}

export const submitTimeAdjustment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Time Adjustment').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click().wait(1000)
    cy.get('#data > :nth-child(1) > :nth-child(1)').contains(Cypress.env('ticketNumber')).click()
    cy.get('#btnDropdown').click().wait(1000)
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#UpdateStatus').click().wait(1000)
    cy.get('#modalSuccess').find().should('not.exist')
}

export const submitLocationAdjustment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Location Adjustment').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilter').click().wait(1000)
    cy.get('#data > :nth-child(1) > :nth-child(1)').contains(Cypress.env('ticketNumber')).click()
    cy.get('#btnDropdown').click().wait(1000)
    cy.get('#selectStatus').contains('APPROVE').click()
    cy.get('#btnSubmit').click().wait(1000)
    cy.get('#modalSuccess').find().should('not.exist')
}

export const submitTerminationResignAdjustment = () => {
    cy.wait(6000)
    cy.get('#accordionSidebar').contains('Terminate/Resign Adjustment').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilter').click().wait(1000)
    cy.get('#data > :nth-child(1) > :nth-child(1)').contains(Cypress.env('ticketNumber')).click()
    cy.get('#btnDropdown').click().wait(1000)
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#Assign').click().wait(1000)
    cy.get('#modalSuccess').find().should('not.exist')
}

export const recruiter= () => {
    cy.wait(3000)
    cy.get('#navIndex2 > span').contains('Recruiter').wait(1000).scrollIntoView().wait(1000).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').contains(Cypress.env('ticketNumber')).click()
    cy.get('#btnAdd').contains(' Add Staff (เพิ่มพนักงาน)').wait(1000).scrollIntoView().wait(1000).click()
    cy.get('#filterStaff').type(employee.idcardNumber)
    cy.get('#btnFilterStaff').click()
    cy.wait(3000)
    cy.get('.form-check-input').click({force : true})
    cy.get('#saveTemp').click()
    // cy.get('#modalSuccess').find().should('not.exist')
    cy.wait(5000)
    cy.get('#checkStaffSubmit').click()
    cy.get('#btnDropdown').click()
    cy.get('#selectStatus').contains('SUBMIT').click()
    cy.get('#btnSubmit').click()
    cy.wait(5000)
    cy.log(Cypress.env('ticketNumber'))

}

export const approvePR = () => {
    cy.get('#navIndex2 > span').contains('PR Approval').wait(0).click()
    cy.get('input').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click()
    cy.get('#data > :nth-child(1) > :nth-child(1) > span').click()
    cy.get('#btnDropdown').click()
    cy.get('#selectStatus').contains('APPROVE').click()
    cy.get('#btnSubmit').click()
    cy.get('#modalSuccess').find().should('not.exist')
    // cy.wait(5000)

}

export const addContract = () => {
    cy.wait(3000)
    cy.get('#navIndex3 > span').contains('Staff Onboarding').click()
    cy.get('#filterStaff').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click()
    cy.get(':nth-child(11) > .btn').contains('Add contract').click({force : true})
    cy.get('#effectiveDateContract').type(employee.sDate)
    cy.get('#expireDateContract').type(employee.eDate)
    cy.get('#monthRental').type(employee.monthlyRental)
    cy.get('#dailyRental').type(employee.dailyRental)
    cy.get('#detuctByOut').type(employee.detuctByOut)
    cy.get('#detuctByLeft').type(employee.detuctByLeft)
    cy.get('#detuctBySticker').type(employee.detuctBySticker)
    cy.get('#requestContract').click()
    cy.wait(3000)
    cy.get('#filterStaff').type(Cypress.env('ticketNumber'))
    cy.get('#btnFilterStaff').click()
    cy.get('#data').find('button').should('be.disabled')
}