import * as React from 'react'

interface Container {
  children: JSX.Element | JSX.Element[]
}

const containerStyle: React.CSSProperties = {
  maxWidth: '36rem',
  margin: 'auto',
  paddingLeft: '1rem',
  paddingRight: '1rem'
}

export const Container: React.FC<Container> = ({children}) => {
  return <div style={containerStyle}>{children}</div>
}
