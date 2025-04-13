import { useEffect, useState } from "react"
import styled from "styled-components"
import { ITweet } from "../types"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../utils/firebase"
import { DB_COLLECTION_PATH, FETCH_LIMIT } from "../constants"
import { Tweet } from "./tweet"
import { Unsubscribe } from "firebase/auth"

const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
`

export const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null

    const fetchTweets = () => {
        const tweetsQuery = query(
        collection(db, DB_COLLECTION_PATH),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT)
        )

        unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
            const fetchedTweets = snapshot.docs.map(doc => {
                const { tweet, createdAt, userId, username, photo } = doc.data()
                return { id: doc.id, tweet, createdAt, userId, username, photo }
            })

            setTweets(fetchedTweets)
        })
    }
    fetchTweets()
    return () => {
        unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  )
}
