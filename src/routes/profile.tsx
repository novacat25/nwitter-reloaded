import styled from "styled-components"
import { AVATAR_IMAGE_PATH, DB_COLLECTION_PATH, DEFAULT_NICKNAME, FETCH_LIMIT, FILE_SIZE_LIMIT } from "../constants"
import { auth, db, storage } from "../utils/firebase"
import { useEffect, useState } from "react"
import { DefaultUserIcon } from "../components/icons/DefaultUserIcon"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { ITweet } from "../types"
import { Tweet } from "../components/tweet"

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

const Tweets = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Profile = () => {
  const user = auth.currentUser
  const userPhotoURL = user?.photoURL
  const [avatar, setAvatar] = useState(userPhotoURL)
  const [tweets, setTweets] = useState<ITweet[]>([])
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, DB_COLLECTION_PATH),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT)
    )

    const snapshot = await getDocs(tweetsQuery)
    const tweets = snapshot.docs.map(doc => {
      const { tweet, createdAt, userId, username, photo } = doc.data()
      return { id: doc.id, tweet, createdAt, userId, username, photo }
    })
    setTweets(tweets)
  }

  useEffect(() => {
    fetchTweets()
  }, [tweets])
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!user) return

    const { files } = e?.target
    
    if(files && files.length === 1) {
      const targetFile = files[0]
        if(targetFile.size > FILE_SIZE_LIMIT) {
          alert("File size is too big!")
          setAvatar(userPhotoURL)
          return
        }

        const locationRef = ref(storage, `${AVATAR_IMAGE_PATH}/${user.uid}`)
        const uploadResult = await uploadBytes(locationRef, targetFile)
        const avatarUrl = await getDownloadURL(uploadResult.ref)
        const updatePhotoPayload = { photoURL: avatarUrl }
        await updateProfile(user, updatePhotoPayload)
        setAvatar(avatarUrl)
      }    
  }

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <DefaultUserIcon />}
      </AvatarUpload>
      <AvatarInput 
        id="avatar" 
        type="file" 
        accept="image/*" 
        onChange={onAvatarChange} 
      />
      <Name>
        {user?.displayName ? user.displayName : DEFAULT_NICKNAME}
      </Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  )
}
