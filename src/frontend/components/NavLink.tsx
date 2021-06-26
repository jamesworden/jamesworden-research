import {BLACK} from '../colors'
import {NavIcon} from './NavIcon'
import React from 'react'

interface NavLink {
  children: string
  href: string
}

const aStyle: React.CSSProperties = {
  display: 'block',
  color: BLACK,
  textAlign: 'center',
  textDecoration: 'none',
  paddingLeft: '.5rem'
}

const liStyle: React.CSSProperties = {
  marginRight: '1rem',
  display: 'flex',
  flexDirection: 'row'
}

export const NavLink: React.FC<NavLink> = ({children, href}) => {
  return (
    <li style={liStyle}>
      <NavIcon />
      <a style={aStyle} href={href}>
        {children}
      </a>
    </li>
  )
}
