import { useNavigate } from "react-router-dom"
import { auth } from "../utils/firebase"

export const Home = () => {
  const navigate = useNavigate()

  const onClickLogout = async () => {
    try {
      await auth.signOut()
      navigate("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <h1>
      <button onClick={onClickLogout}>Logout</button>
    </h1>
  )
}
