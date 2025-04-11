import styled from "styled-components"
import { PostTweetForm } from "../components/post-tweet-form"
import { TimeLine } from "../components/timeline"

const Wrapper = styled.section``

export const Home = () => {
  return <Wrapper>
  <PostTweetForm />  
  <TimeLine />
  </Wrapper>
}
