/// <reference types = "cypress"  />

describe("Test GET method 101", ()=> {

    let accessToken = "d22e97d64957ba9785ca10d146993ca94e7854643349ed90cfa36fcbbaa26707"

    it("getInfo login",()=> {

        cy.request({
            method : 'GET',
            url : 'https://gorest.co.in/public-api/users',
            headers : {
                'authorization' : 'Bearer d22e97d64957ba9785ca10d146993ca94e7854643349ed90cfa36fcbbaa26707'
            }

        }).then((res)=>{
                expect(res.status).to.eq(200)
                expect(res.body.meta.pagination.limit).to.eq(200)
            })
    })

    it("getIdInfo login",()=> {

        cy.request({
            method : 'GET',
            url : 'https://gorest.co.in/public-api/users/2',
            header : {
                'authorization' : 'Bearer '+ accessToken
            }

        }).then((res)=>{
                expect(res.status).to.eq(200)
                expect(res.body.data.name).to.eq('Chandira Tagore')
            })
    })
})