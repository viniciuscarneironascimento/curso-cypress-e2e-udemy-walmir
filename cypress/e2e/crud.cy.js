// cypress/e2e/crud.cy.js

import { faker } from '@faker-js/faker/locale/en'

describe('CRUD', () => {

  /*beforeEach(() => {
       cy.sessionLogin()
   });*/

  it.skip('CRUDs a note', () => {
    //Cria uma variável que recebe 4 palavras aleatórias do faker
    const noteDescription = faker.lorem.words(4)

    //Intercepata as requisições de GET (todas e específicas)
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')

    //Realiza o login e armazena na session
    cy.sessionLogin()

    //Visita a página de cadastro (com login feito anteriormente)
    cy.visit('/notes/new')

    //Preenche o campo e confirma
    cy.get('#content').type(noteDescription)
    cy.contains('button', 'Create').click()

    //Aguarda pelo retorno da requisição do intercept que lista todas as notações
    cy.wait('@getNotes')

    //Valida se a notação recém criada está listada. Clica nela. Uma nova tela é exibida (edição)
    cy.contains('.list-group-item', noteDescription)
      .should('be.visible')
      .click()

    //Aguarda pelo retorno da requisição do intercept (que foi clicada no passo anterior)
    cy.wait('@getNote')

    //Cria uma nova notação e salva na variável
    const updatedNoteDescription = faker.lorem.words(4)

    //Localiza o campo de texto e limpa o conteúdo
    cy.get('#content')
      .as('contentField')
      .clear()

    //Digita o texto da nova notação (edit) e clica em salvar
    cy.get('@contentField')
      .type(updatedNoteDescription)
    cy.contains('button', 'Save').click()

    //Mais uma vez aguarda o retorno da requisição GET que lista todas as notações criadas
    cy.wait('@getNotes')

    //Realiza as validações
    //Verifica que a descrição anterior não está mais visível
    cy.contains('.list-group-item', noteDescription).should('not.exist')
    //Verifica que a nova descrição está visível
    cy.contains('.list-group-item', updatedNoteDescription)
      .should('be.visible')
      .click()

    //Aguarda o retorno da notação selecionada no passo anterior para exclusão
    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()
    cy.wait('@getNotes')

    //Aqui verifica que existe pelo menos um item que é o botão
    cy.get('.list-group-item')
      .its('length')
      .should('be.at.least', 1)
    //Então por fim valida que o item foi escluído
    cy.contains('.list-group-item', updatedNoteDescription)
      .should('not.exist')
  })

  it.skip('Adicionando arquivo com selectile', () => {
    const noteDescription = faker.lorem.words(4)
    let attachFile = false

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.sessionLogin()

    cy.visit('/notes/new')
    cy.get('#content').type(noteDescription)

    if (attachFile) {
      cy.get('#file').selectFile('cypress/fixtures/example.json')
    }

    cy.contains('button', 'Create').click()

    cy.wait('@getNotes')
    cy.contains('.list-group-item', noteDescription)
      .should('be.visible')
      .click()
    cy.wait('@getNote')

    const updatedNoteDescription = faker.lorem.words(4)

    cy.get('#content')
      .as('contentField')
      .clear()
    cy.get('@contentField')
      .type(updatedNoteDescription)

    attachFile = true

    if (attachFile) {
      cy.get('#file').selectFile('cypress/fixtures/example.json')
    }

    cy.contains('button', 'Save').click()
    cy.wait('@getNotes')

    cy.contains('.list-group-item', noteDescription).should('not.exist')
    cy.contains('.list-group-item', updatedNoteDescription)
      .should('be.visible')
      .click()
    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()
    cy.wait('@getNotes')

    cy.get('.list-group-item')
      .its('length')
      .should('be.at.least', 1)
    cy.contains('.list-group-item', updatedNoteDescription)
      .should('not.exist')
  })

  it.only('CRUDs a note usando comandos customizados', () => {
    const noteDescription = faker.lorem.words(4)

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()

    cy.createNote(noteDescription)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })

  it.skip('visitando página chamando função sesssion para logar pela primeira vez (created)', () => {
    //Chama a função que realiza o login e armazena na sessão
    //As etapas de login são realizadas 
    //--cy.sessionLogin()
    cy.visit('/notes/new')
    cy.contains('Attachment').should('be.visible')
  });

  it.skip('visitando página com login session já criado (restored)', () => {
    // Não realiza o login pois restaura a sessão do CT antetior.
    // Aqui a execução é mais rápida pois pula a etapa de login novamente
    //A função cy.sessionLogin() deve ser chamada para funcionar usando o login restaurado
    //--cy.sessionLogin()
    cy.visit('/notes/new')
    cy.contains('Attachment').should('be.visible')
  });

  it.skip('visitando página sem login session', () => {
    //Apresenta erro pois não utilizou a chamada da session cy.sessionLogin()
    //OBS: a melhor forma de utilizar a session é usando BEFOREEACH (comente nos CTs anteriores as chamadas cy.sessionLogin())
    cy.visit('/notes/new')
    cy.contains('Attachment').should('be.visible')
  });


})
