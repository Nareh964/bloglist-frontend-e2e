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
  gap: 15px;
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

const LoginButton = styled.button`
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

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin
}) => {
  return (
    <FormContainer>
      <FormTitle>Log in to application</FormTitle>

      <StyledForm onSubmit={handleLogin}>
        <FormField>
          username
          <StyledInput
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </FormField>

        <FormField>
          password
          <StyledInput
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </FormField>

        <LoginButton type="submit">login</LoginButton>
      </StyledForm>
    </FormContainer>
  )
}

export default LoginForm
