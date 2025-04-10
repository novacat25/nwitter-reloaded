import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../utils/firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "@firebase/util"
import { Input, Switcher, Title, Wrapper, Form, Error } from "../components/auth-components"
import { GitHubButton } from "../components/github-button"
import { GoogleButton } from "../components/google-button"

export const CreateAccount = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const initialState = {
    name: "",
    email: "",
    password: "",
  }

  const [formData, setFormData] = useState(initialState)

  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(isLoading || !formData.name || !formData.email || !formData.password) return
    try {
      setIsLoading(true)
      setError("")
      const credentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await updateProfile(credentials.user, { displayName: formData.name })
      navigate("/")
    } catch (err) {
      if(err instanceof FirebaseError) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={onChange}
          type="text"
          required
        />
        <Input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={onChange}
          type="email"
          required
        />
        <Input
          name="password"
          value={formData.password}
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
      <Switcher>
        Already have an account? <Link to="/login">Login →</Link>
      </Switcher>     
      <GitHubButton /> 
      <GoogleButton />
    </Wrapper>
  )
}
