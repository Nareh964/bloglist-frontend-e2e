import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('5.16: form calls createBlog with the right details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox')

  await user.type(titleInput, 'Testing forms')
  await user.type(authorInput, 'Jack')
  await user.type(urlInput, 'http://example.com/forms')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Jack',
    url: 'http://example.com/forms',
  })
})