import styled from "styled-components"
import { ITweet } from "../types"

const Wrapper = styled.article`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    margin: 24px 0;
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

export const Tweet = ({ username, photo, tweet }: ITweet) => {
  return (
    <Wrapper>
        <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
        </Column>
        {photo && (
            <Column>
                <Photo src={photo} />
            </Column>
            )
        }
    </Wrapper>
  )
}
