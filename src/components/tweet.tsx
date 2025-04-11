import styled from "styled-components"
import { ITweet } from "../types"
import { auth, db, storage } from "../utils/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { DB_COLLECTION_PATH } from "../constants"
import { deleteObject, ref } from "firebase/storage"
import { DELETE_CONFIRM_MESSAGE } from "../constants/message"

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

export const Tweet = ({ id, userId, username, photo, tweet }: ITweet) => {
    const user = auth.currentUser
    const isSameUser = () => (userId === user?.uid)
    
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

  return (
    <Wrapper>
        <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {isSameUser() && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
        </Column>
        <Column>
        {photo && <Photo src={photo} />}
        </Column>
    </Wrapper>
  )
}
