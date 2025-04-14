import styled from "styled-components"

const Wrapper = styled.div`
    cursor: pointer;
`

type Props = {
    width?: number
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>void
}

export const CancelIconButton = ({ width = 25, onClick }: Props) => {
  return (
    <Wrapper onClick={onClick}>
        <svg width={width} data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"></path>
        </svg>
    </Wrapper>
  )
}
