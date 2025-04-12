import { addDoc, collection, updateDoc } from "firebase/firestore"
import { useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../utils/firebase"
import { DB_COLLECTION_PATH, DEFAULT_NICKNAME, FILE_SIZE_LIMIT, TWEET_MAX_LENGTH } from "../constants"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const Form = styled.form`
display: flex;
flex-direction: column;
gap: 10px;
`

const TextArea = styled.textarea`
border: 2px solid white;
padding: 20px;
border-radius: 20px;
font-size: 16px;
color: white;
background-color: black;
resize: none;
 font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
&::placeholder {
    font-size: 16px;           
}
&::focus {
    outline: none;
    border-color: #1d9bf0;
}
`

const AttachFileButton = styled.label`
padding: 10px 0;
color: #1d9bf0;
text-align: center;
border-radius: 20px;
border: 1px solid #1d9bf0;
font-size: 14px;
font-weight: 600;
cursor: pointer;
`
const AttachFileInput = styled.input`
display: none;
`
const SubmitButton = styled.input`
background-color: #1d9bf0;
color: white;
border: none;
padding: 10px 0;
border-radius: 20px;
font-size: 16px;
cursor: pointer;
&:hover, &:active {
    opacity: 0.8;
}
`

export const PostTweetForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [tweet, setTweet] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = auth.currentUser

        if(!user || isLoading || !tweet || tweet.length > TWEET_MAX_LENGTH) return

        try {
            setIsLoading(true)
            const tweetObj = {
                tweet: tweet,
                createdAt: Date.now(),
                username: user.displayName || DEFAULT_NICKNAME,
                userId: user.uid
            }

            const tweetDoc = await addDoc(collection(db, DB_COLLECTION_PATH), tweetObj)

            if (file) {
                const locationRef = ref(storage, `${DB_COLLECTION_PATH}/${user.uid}-${user.displayName}/${tweetDoc.id}`)
                const uploadResult = await uploadBytes(locationRef, file)
                const downloadURL = await getDownloadURL(uploadResult.ref)
                const updatePhotoPayload = { photo: downloadURL }
                await updateDoc(tweetDoc, updatePhotoPayload)
                setFile(null)
            }
            setTweet("")
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e?.target
        if(files && files.length === 1) {
            const targetFile = files[0]
            if(targetFile.size > FILE_SIZE_LIMIT) {
                alert("File size is too big!")
                setFile(null)
                return
            }

            setFile(targetFile)
        }
    }

  return (
    <Form onSubmit={onSubmit}>
        <TextArea 
            rows={5}
            maxLength={TWEET_MAX_LENGTH}
            value={tweet}
            onChange={onChange}
            placeholder="What is happening?"
            required 
        />
        <AttachFileButton htmlFor="file">{file ? "Photo Added ✅" : "Add photo"}</AttachFileButton>
        <AttachFileInput 
            type="file" 
            id="file" 
            onChange={onFileChange}
            accept="image/*" 
        />
        <SubmitButton 
            type="submit" 
            value={isLoading ? "Posting..." : "Post Tweet"} 
        />
    </Form>
  )
}
