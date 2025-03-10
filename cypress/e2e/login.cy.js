describe('Login', () => {
    it('successfully logs in', () => {
      cy.intercept('GET', '**/notes').as('getNotes')
  
      cy.visit('/login')
      cy.get('#email').type(Cypress.env('USER_EMAIL'))
      cy.get('#password').type(Cypress.env('USER_PASSWORD'), {log: false})
      cy.contains('button', 'Login').click()
      cy.wait('@getNotes')
 
      cy.contains('h1', 'Your Notes').should('be.visible')
      cy.contains('a', 'Create a new note').should('be.visible')
    })

    it('Usando comando customizado', () => {
        
        /*//Login 1
        cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'), {log: false})
        .then(() => {
            cy.contains('h1', 'Your Notes').should('be.visible')
            cy.contains('a', 'Create a new note').should('be.visible')
        })*/

        /*//Login 2
       cy.login()
       cy.contains('a', 'Create a new note').should('be.visible')*/

       //Login 3
       cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'), {log: false})
       cy.contains('h1', 'Your Notes').should('be.visible')
       cy.contains('a', 'Create a new note').should('be.visible')
    })

    //Ecercicio 3: SESSION
    it.only('Session do login', () => {
        cy.sessionLogin()
        cy.log(cy.sessionLogin())
    });
    
})