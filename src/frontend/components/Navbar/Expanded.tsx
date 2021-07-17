import React, {ReactElement} from 'react'

import {Container} from '../Container'
import {NavLink} from '../NavLink'
import {Ul} from '../Ul'

interface Expanded {
  children: ReactElement<typeof NavLink>[]
  id: string
}

const container: React.CSSProperties = {
  display: 'none'
}

export const Expanded: React.FC<Expanded> = ({children, id}) => {
  return (
    <div id={id} style={container}>
      <Container>
        <Ul>{children}</Ul>
      </Container>
    </div>
  )
}
