
import styled from 'styled-components'

const BlogContainer = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin: 20px 0;
  max-width: 600px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

const BlogTitle = styled.h2`
  color: #263238;
  margin-top: 0;
  margin-bottom: 18px;
`

const BlogDetail = styled.p`
  color: #455a64;
  margin: 12px 0;
  overflow-wrap: anywhere;
`

const BlogUrl = styled.a`
  color: #0066cc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`

const LikeButton = styled.button`
  background: #00897b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #00695c;
  }
`

const RemoveButton = styled.button`
  background: #e53935;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c62828;
  }
`

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const blogUserId = typeof blog.user === 'object'
    ? blog.user?.id
    : blog.user

  const isLoggedIn = user !== null
  const isCreator = isLoggedIn && blogUserId === user.id

  return (
    <BlogContainer data-testid="blog">
      <BlogTitle>{blog.title} {blog.author}</BlogTitle>

      <BlogDetail>
        <BlogUrl href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </BlogUrl>
      </BlogDetail>

      <BlogDetail>
        likes {blog.likes}
      </BlogDetail>

      <BlogDetail>
        added by {blog.user?.name || 'Unknown user'}
      </BlogDetail>

      <ButtonGroup>
        {isLoggedIn && (
          <LikeButton onClick={() => likeBlog(blog)}>
            like
          </LikeButton>
        )}

        {isCreator && (
          <RemoveButton onClick={() => deleteBlog(blog)}>
            remove
          </RemoveButton>
        )}
      </ButtonGroup>
    </BlogContainer>
  )
}

export default Blog
