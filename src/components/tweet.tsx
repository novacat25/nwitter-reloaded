import styled from "styled-components"
import { ITweet } from "../types"
import { auth, db, storage } from "../utils/firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { DB_COLLECTION_PATH, FILE_SIZE_LIMIT, TWEET_MAX_LENGTH } from "../constants"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { DELETE_CONFIRM_MESSAGE } from "../constants/message"
import { useState } from "react"

const Wrapper = styled.article`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    margin: 8px 0;
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 15px;
`

const Column = styled.div``
const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50px;
`

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`
const Payload = styled.p`
    margin: 10px 0;
    font-size: 18px;
`

const EditButton = styled.button`
    background-color: skyblue;
    color: #fff;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 12px;

    &:hover {
        opacity: 0.8;
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    width: 80%;
`

const Input = styled.input`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
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

const DeleteButton = styled.button`
    background-color: tomato;
    color: #fff;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`

const CancelButton = styled.button`
    background-color: tomato;
    color: #fff;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
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

export const Tweet = ({ id, userId, username, photo, tweet }: ITweet) => {
    const [isLoading, setIsLoading] = useState(false)
    const [editTweet, setEditTweet] = useState(tweet)
    const [editFile, setEditFile] = useState<File | null>(null)

    const [isEditMode, setIsEditMode] = useState(false)
    const user = auth.currentUser
    const isSameUser = () => (userId === user?.uid)

    const toggleEditMode = () => setIsEditMode((prev) => !prev)
    const onClickCancelEdit = () => {
        setIsEditMode(false)
        setEditTweet(tweet)
    }
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTweet(e.target.value)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e?.target
        if(files && files.length === 1) {
            const targetFile = files[0]
            if(targetFile.size > FILE_SIZE_LIMIT) {
                alert("File size is too big!")
                setEditFile(null)
                return
            }

            setEditFile(targetFile)
        }
    }
    
    const DisplayTweet = () => (
        <>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            <EditButton onClick={toggleEditMode}>Edit</EditButton>
            {isSameUser() && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
        </>
    )

    const EditTweet = () => (
        <>
        <Form id="edit-form" name="edit-form" onSubmit={onEditSubmit}>
                <Input
                    maxLength={TWEET_MAX_LENGTH}
                    value={editTweet}
                    onChange={onChange}
                    placeholder="What is happening?"
                    autoFocus
                    required 
                />
                <AttachFileButton htmlFor="edit-file">{editFile ? "Photo Added ✅" : "Edit photo"}</AttachFileButton>
                <AttachFileInput 
                    type="file" 
                    id="edit-file" 
                    onChange={onFileChange}
                    accept="image/*" 
                />
                <SubmitButton 
                    type="submit" 
                    value={isLoading ? "Posting..." : "Edit Tweet"} 
                />
            </Form>
            <CancelButton onClick={onClickCancelEdit}>Cancel</CancelButton>
        </>
    )    
    
    const onDelete = async () => {
        if(user?.uid !== userId) {
            alert("Unauthorised Action!")
            return
        }

        const ok = confirm(DELETE_CONFIRM_MESSAGE)
        if(ok) {
            try {
                await deleteDoc(doc(db, DB_COLLECTION_PATH, id))

                if(photo) {
                    const photoRef = ref(storage, `${DB_COLLECTION_PATH}/${user.uid}-${username}/${id}`)
                    await deleteObject(photoRef)
                }
            } catch (err) {
                console.error(err)
            } finally {

            }
        }
    }

    const onEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(user?.uid !== userId) {
            alert("Unauthorised Action!")
            return
        }

        if(!tweet || !editTweet || editTweet.length > TWEET_MAX_LENGTH) return
        try {
            setIsLoading(true)
            const editTweetPayload = {tweet: editTweet}
            await updateDoc(doc(db, DB_COLLECTION_PATH, id), editTweetPayload)

            if(editFile) {
                const locationRef = ref(storage, `${DB_COLLECTION_PATH}/${user.uid}-${user.displayName}/${id}`)
                const uploadResult = await uploadBytes(locationRef, editFile)
                const downloadURL = await getDownloadURL(uploadResult.ref)
                const updatePhotoPayload = { photo: downloadURL }
                await updateDoc(doc(db, DB_COLLECTION_PATH, id), updatePhotoPayload)
                setEditFile(null)                
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
            toggleEditMode()
        }
    }

  return (
    <Wrapper>
        <Column>
            {isEditMode ? <EditTweet /> : <DisplayTweet />}
        </Column>
        <Column>
        {photo && <Photo src={photo} />}
        </Column>
    </Wrapper>
  )
}
