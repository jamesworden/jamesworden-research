import * as React from 'react'

import {BLACK} from '../Colors'

interface A {
  children: string | string[]
  href: string
}

const aStyle: React.CSSProperties = {
  transition: 'ease-in-out 0.3s all',
  textDecoration: 'underline',
  color: BLACK
}

export const A: React.FC<A> = ({children, href}) => {
  return (
    <a href={href} style={aStyle}>
      {children}
    </a>
  )
}
