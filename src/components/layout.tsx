import { Link, Outlet, useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { auth } from '../utils/firebase'
import { LOGOUT_CONFIRM_MESSAGE } from '../constants/message'
import { LogoutIcon } from './icons/LogoutIcon'
import { HomeIcon } from './icons/HomeIcon'
import { ProfileIcon } from './icons/ProfileIcon'

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
        <Link to="/profile">
          <MenuItem>
            <ProfileIcon />
          </MenuItem>
        </Link>
        <Link to="/">
          <MenuItem>
            <HomeIcon />
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogOut} className='log-out'>
          <LogoutIcon />
        </MenuItem>
      </Menu>
        <Outlet />
    </Wrapper>
  )
}
