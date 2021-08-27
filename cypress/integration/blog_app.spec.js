describe('Blog app', function() {
  // reset database using api
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'testuser',
      username: 'testuser',
      password: 'testuser123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown by default', function() {
    cy.contains('log in to app')
    cy.contains('username')
    cy.contains('password')
  })

  describe('login functionality', function() {
    it('succeeds with correct creds', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('testuser123')
      cy.get('button').contains('login').click()

      cy.contains('testuser is logged in')
    })

    it('fails with incorrect creds', function() {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('incorrect')
      cy.get('button').contains('login').click()

      cy.get('.notification')
        .should('contain', 'invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})