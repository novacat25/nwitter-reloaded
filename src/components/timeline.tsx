import { useEffect, useState } from "react"
import styled from "styled-components"
import { ITweet } from "../types"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../utils/firebase"
import { DB_COLLECTION_PATH } from "../constants"
import { Tweet } from "./tweet"

const Wrapper = styled.section``

export const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([])

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, DB_COLLECTION_PATH),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(tweetsQuery)
    const fetchedTweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data()
      return { id: doc.id, tweet, createdAt, userId, username, photo }
    })

    setTweets(fetchedTweets)
  }

  useEffect(() => {
    fetchTweets()
  }, [])

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  )
}
