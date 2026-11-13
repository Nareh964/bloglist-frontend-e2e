import { useState } from 'react'
import styled from 'styled-components'

const FormContainer = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px 0;
`

const FormTitle = styled.h2`
  color: #333;
  margin-top: 0;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: bold;
`

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`

const StyledButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #0066cc;
  color: white;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background: #004c99;
  }
`

const CancelButton = styled(StyledButton)`
  background: #666;

  &:hover {
    background: #444;
  }
`

const BlogForm = ({ createBlog, hideForm }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    await createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <FormContainer>
      <FormTitle>create new blog</FormTitle>

      <StyledForm onSubmit={handleSubmit}>
        <FormField>
          title
          <StyledInput
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </FormField>

        <FormField>
          author
          <StyledInput
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </FormField>

        <FormField>
          url
          <StyledInput
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </FormField>

        <ButtonGroup>
          <StyledButton type="submit">create</StyledButton>
          <CancelButton type="button" onClick={hideForm}>
            cancel
          </CancelButton>
        </ButtonGroup>
      </StyledForm>
    </FormContainer>
  )
}

export default BlogForm
