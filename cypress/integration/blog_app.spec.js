describe('Blog app', function() {
  // reset database using api
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({ name: 'testuser', username: 'testuser', password: 'testuser123' })
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

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testuser123' })
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#txtTitle').type('this is a test blog')
      cy.get('#txtAuthor').type('test author')
      cy.get('#txtUrl').type('testurl.test')
      cy.get('#btnCreate').click()

      cy.contains('blog created successfully')
      cy.contains('this is a test blog')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'testing when blog exists', author: 'existence tester', url: 'testing.test' })
      })

      it('a blog can be liked', function() {
        cy.contains('testing when blog exists').parent().as('divBlog')
        cy.get('@divBlog').get('.btnToggler').click()
        cy.get('@divBlog').get('.blogDetails').as('divDetails')
        cy.get('@divDetails').contains('likes 0')

        cy.get('@divDetails').get('.btnLike').click()
        cy.get('@divDetails').contains('likes 1')
      })

      it('a blog can be deleted by its creator', function() {
        cy.contains('testing when blog exists').parent().as('divBlog')
        cy.get('@divBlog').find('.btnToggler').click()
        cy.get('@divBlog').find('.blogDetails').as('divDetails')

        cy.on('window:confirm', () => true)
        cy.get('@divDetails').find('.btnDelete').click()
        cy.get('html').should('not.contain', 'testing when blog exists')
      })

      it('users cannot delete each other\'s blogs', function() {
        cy.createBlog({ title: 'don\'t delete me', author: 'existence tester', url: 'testing.test' })
        cy.createUser({ name: 'someoneelse', username: 'someoneelse', password: 'else123' })
        cy.login({ username: 'someoneelse', password: 'else123' })

        cy.contains('don\'t delete me').parent().as('divBlog')
        cy.get('@divBlog').find('.btnToggler').click()
        cy.get('@divBlog').find('.blogDetails').as('divDetails')

        cy.on('window:confirm', () => true)
        cy.get('@divDetails').should('not.contain', '.btnDelete')
      })
    })

    describe('and many blogs exist', () => {
      beforeEach(function() {
        cy.createBlogNoVisit({ title: '1 of many', author: 'many tester', url: 'testing.test.many', likes: 1 })
        cy.createBlogNoVisit({ title: '2 of many', author: 'many tester', url: 'testing.test.many', likes: 2 })
        cy.createBlogNoVisit({ title: '3 of many', author: 'many tester', url: 'testing.test.many', likes: 3 })
        cy.createBlogNoVisit({ title: '4 of many', author: 'many tester', url: 'testing.test.many', likes: 4 })
        cy.createBlogNoVisit({ title: '5 of many', author: 'many tester', url: 'testing.test.many', likes: 5 })
        cy.createBlogNoVisit({ title: '6 of many', author: 'many tester', url: 'testing.test.many', likes: 6 })
        cy.createBlogNoVisit({ title: '7 of many', author: 'many tester', url: 'testing.test.many', likes: 7 })
        cy.createBlogNoVisit({ title: '8 of many', author: 'many tester', url: 'testing.test.many', likes: 8 })
        cy.visit('http://localhost:3000')
      })

      it('blogs are ordered by likes', function() {
        const likes = []
        cy.get('.btnToggler').then(buttons => {
          for (let i = 0; i < buttons.length; i++) {
            cy.wrap(buttons[i]).as('btnTemp')
            cy.get('@btnTemp').click()
            cy.get('@btnTemp').parent().parent().find('.blogDetails').find('.btnLike').parent()
              .then(p => likes.push(p[0].innerText.split(' ')[1] * 1))
          }
        }).then(likes => {
          let isOrdered = true
          for (let i = 1; i < likes.length; i++) {
            if(likes[i] < likes[i-1]) {
              isOrdered = false
              break
            }
          }
          expect(isOrdered).to.be.true
        })
      })
    })
  })
})