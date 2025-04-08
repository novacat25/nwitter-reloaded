import { auth } from "../utils/firebase"

export const Home = () => {
  const onClickLogout = () => {
    auth.signOut()
  }

  return (
    <h1>
      <button onClick={onClickLogout}>Logout</button>
    </h1>
  )
}
