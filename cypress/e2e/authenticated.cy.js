import { faker } from '@faker-js/faker/locale/en'

describe('Scenarios where authentication is a pre-condition', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()
  })

  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })

  it.skip('successfully submits the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest')
      .its('state')
      .should('be.equal', 'Complete')
  })

  it('logs out', () => {
    cy.visit('/')
    cy.wait('@getNotes')

    // Se a tela for menor que o breakpoint, expande o menu
    if (Cypress.config('viewportWidth') < Cypress.config('viewportWidthBreakpoint')) {
        cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click() // Expande o menu
      cy.get('.navbar-collapse') // Garante que o menu está expandido
      .should('have.class', 'in') // 'in' é geralmente a classe que indica o menu expandido
    }
  
    // Agora que o menu está visível, clica no link 'Logout'
    cy.contains('.nav a', 'Logout').click()
  
    // Verifica se o campo de email está visível após o logout
    cy.get('#email').should('be.visible')
  }) 

})
