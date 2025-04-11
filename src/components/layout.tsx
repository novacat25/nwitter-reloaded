import { Link, Outlet, useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { auth } from '../utils/firebase'
import { LOGOUT_CONFIRM_MESSAGE } from '../constants/message'

const Wrapper = styled.section`
display: grid;
gap: 20px;
grid-template-columns: 1fr 4fr;
height: 100px;
padding: 50px 0;
width: 100%;
max-width: 860px;
`

const Menu = styled.nav`
display: flex;
flex-direction: column;
align-items: center;
gap: 20px;
`
const MenuItem = styled.div`
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid white;
height: 50px;
width: 50px;
border-radius: 50%;
svg {
  width: 30px;
  fill: white;
}

&.log-out {
  border-color: tomato;
  svg {
    fill: tomato;
  }
}
`

export const Layout = () => {
  const navigate = useNavigate()
  const onLogOut = async () => {
    const ok = confirm(LOGOUT_CONFIRM_MESSAGE)
    
    if(ok){
      await auth.signOut()
      navigate("/login")
    }
  }

  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" />
            </svg>
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"></path>
            </svg>
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogOut} className='log-out'>
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z"></path>
          </svg>
        </MenuItem>
      </Menu>
        <Outlet />
    </Wrapper>
  )
}
