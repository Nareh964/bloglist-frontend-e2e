
import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: 'b1',
  title: 'Component testing is done with react-testing-library',
  author: 'Jack Tester',
  url: 'http://example.com/testing',
  likes: 7,
  user: { id: 'u1', username: 'jack', name: 'Jack' },
}

const creator = { id: 'u1', username: 'jack', name: 'Jack' }
const otherUser = { id: 'u2', username: 'other', name: 'Other' }

describe('<Blog />', () => {
  test('logged out user sees blog details and likes but no buttons', () => {
    render(
      <Blog
        blog={blog}
        user={null}
        likeBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    expect(screen.getByText(/Component testing is done/)).toBeInTheDocument()
    expect(screen.getByText(/Jack Tester/)).toBeInTheDocument()
    expect(screen.getByText('http://example.com/testing')).toBeInTheDocument()
    expect(screen.getByText(/likes 7/)).toBeInTheDocument()

    expect(screen.queryByRole('button')).toBeNull()
  })

  test('logged in user who is not the creator sees only the like button', () => {
    render(
      <Blog
        blog={blog}
        user={otherUser}
        likeBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('creator sees both like and remove buttons', () => {
    render(
      <Blog
        blog={blog}
        user={creator}
        likeBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  })
})
