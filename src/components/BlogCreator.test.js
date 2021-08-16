import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogCreator from './BlogCreator'

describe('<BlogCreator />', () => {
  let component
  let mockCreate

  beforeEach(() => {
    mockCreate = jest.fn()
    component = render(
      <BlogCreator
        createBlog={mockCreate}
      />
    )
  })

  test('create blog is called correctly', () => {
    const txtTitle = component.container.querySelector('#txtTitle')
    fireEvent.change(txtTitle, {
      target: { value: 'my new test blog' }
    })

    const txtAuthor = component.container.querySelector('#txtAuthor')
    fireEvent.change(txtAuthor, {
      target: { value: 'TestAuthor' }
    })

    const txtUrl = component.container.querySelector('#txtUrl')
    fireEvent.change(txtUrl, {
      target: { value: 'averylongurl.test' }
    })

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(mockCreate.mock.calls).toHaveLength(1)
    expect(mockCreate.mock.calls[0][0]).toEqual({
      title: 'my new test blog',
      author: 'TestAuthor',
      url: 'averylongurl.test'
    })
  })
})