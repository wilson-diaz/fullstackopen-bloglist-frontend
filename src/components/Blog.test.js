import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockUpdate
  let mockDelete

  beforeEach(() => {
    const blogObj = {
      title: 'this is a test blog',
      author: 'TestAuthor',
      url: 'longurl.test',
      user: { username: 'TestCreator' }
    }
    mockUpdate = jest.fn()
    mockDelete = jest.fn()

    component = render(
      <Blog
        blog={blogObj}
        updateBlog={mockUpdate}
        username='testUser'
        deleteBlog={mockDelete}
      />
    )
  })

  test('only title and author rendered initially', () => {
    expect(component.container).toHaveTextContent(
      'this is a test blog TestAuthor'
    )

    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('clicking view button displays details', () => {
    const toggler = component.container.querySelector('.btnToggler')
    fireEvent.click(toggler)

    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogDetails).not.toHaveStyle('display: none')
  })

  test('multiple likes are registered', () => {
    const liker = component.container.querySelector('.btnLike')
    fireEvent.click(liker)
    fireEvent.click(liker)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})