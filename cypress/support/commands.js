Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
    cy.wait('@getNotes')
  })
})

Cypress.Commands.add('login',
  (username = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD')) => {

    cy.intercept('GET', '**/notes').as('getNotes')

    cy.visit('/login')
    cy.get('#email').type(username)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()

    cy.wait('@getNotes')

    cy.contains('h1', 'Your Notes').should('be.visible')
  })

Cypress.Commands.add('sessionLogin2', () => {
  const sessionLogin = () => cy.login()
  cy.session('sessionLogin', sessionLogin)
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.login(username, password)
  cy.session(username, login)
})

//Novo modelo proposto pelo ChatGpt substituindo a versão acima
Cypress.Commands.add('sessionLogin3', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  // Verifica se username e password são válidos
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('O username e password devem ser strings válidas.');
  }

  const login = () => cy.login(username, password);

  // Usar `username` diretamente como uma chave de sessão
  cy.session(username, login, {
    validate() {
      // Função de validação para garantir que a sessão seja reutilizada se já estiver válida
      cy.get('body').should('exist');  // Exemplo: validação básica, você pode adicionar algo mais complexo aqui
    }
  });
});


//Variável que recebe uma função para anexar um arquivo (selectile)
const attachFileHandler = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

//COmando customizado que recebe uma notação como argumento e "anexar = false"
Cypress.Commands.add('createNote', (note, attachFile = false) => {
  //Visita a página (a chamada da session de login deve ser chamada antes desta função customizada)
  cy.visit('/notes/new')
  //Insere o texto da notação passada por parâmetro
  cy.get('#content').type(note)

  //Se "attachFile = true", ou seja, se "anexar = true" (indico por parâmetro que quero anexar um arquivo)
  if (attachFile) {
    //Basta chamar a variável (que é uma função) para executar os comandos dela
    attachFileHandler()
  }

  cy.contains('button', 'Create').click()

  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newNoteValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')

  cy.get('#content')
    .as('contentField')
    .clear()
  cy.get('@contentField')
    .type(newNoteValue)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', newNoteValue).should('be.visible')
  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)
  cy.contains('.list-group-item', note)
    .should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})