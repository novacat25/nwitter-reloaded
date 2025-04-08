import { useState } from "react"
import styled from "styled-components"

const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
     cursor: pointer;
     &:hover {
       opacity: 0.8;
     }
   }
`
const Title = styled.h1`
  font-size: 42px;
`

const Error = styled.span`
   font-weight: 600;
   color: #ed4848;
 `

export const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    switch (name) {
      case "name":
        setName(value)
        break
      case "email":
        setEmail(value)
        break
      case "password":
        setPassword(value)
        break
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      //Create an account
      //Set the name of the user.
      //Redirect to the home page.
    } catch (e) {
      //setError
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          placeholder="Name"
          onChange={onChange}
          type="text"
          required
        />
        <Input
          name="email"
          value={email}
          placeholder="Email"
          onChange={onChange}
          type="email"
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  )
}
