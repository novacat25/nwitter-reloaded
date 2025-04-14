import styled from "styled-components"
import { DEFAULT_NICKNAME } from "../constants"
import { auth } from "../utils/firebase"
import { useState } from "react"
import { DefaultUserIcon } from "../components/icons/DefaultUserIcon"

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`

const AvatarImg = styled.img`
  width: 100%;
`

const AvatarInput = styled.input`
  display: none;
`
const Name = styled.span`
  font-size: 22px;
`

export const Profile = () => {
  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <DefaultUserIcon />}
      </AvatarUpload>
      <AvatarInput id="avatar" type="file" accept="image/*" />
      <Name>
        {user?.displayName ? user.displayName : DEFAULT_NICKNAME}
      </Name>
    </Wrapper>
  )
}
