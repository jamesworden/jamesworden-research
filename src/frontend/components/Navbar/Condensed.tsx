import React, {ReactElement} from 'react'

import {Container} from '../Container'
import {NavLink} from '../NavLink'

interface Condensed {
  children: ReactElement<typeof NavLink>[]
  id: string
}

const container: React.CSSProperties = {
  display: 'block'
}

export const Condensed: React.FC<Condensed> = ({children, id}) => {
  return (
    <div id={id} style={container}>
      <Container>{children}</Container>
    </div>
  )
}
