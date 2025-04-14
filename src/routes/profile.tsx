import styled from "styled-components"
import { DEFAULT_NICKNAME } from "../constants"
import { auth } from "../utils/firebase"
import { useState } from "react"

const Wrapper = styled.section``
const AvatarUpload = styled.section``
const AvatarImg = styled.img``
const AvatarInput = styled.input`
  display: none;
`
const Name = styled.span``

export const Profile = () => {
  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)

  return (
    <Wrapper>
      <AvatarUpload>
      </AvatarUpload>
      <AvatarInput type="file" accept="image/*" />
      <Name>
        {user?.displayName ? user.displayName : DEFAULT_NICKNAME}
      </Name>
    </Wrapper>
  )
}
