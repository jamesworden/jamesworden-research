import * as React from 'react'

interface Section {
  children: JSX.Element | Array<JSX.Element>
  paddingTop?: boolean
}

const PADDING: string = '3rem'

export const Section: React.FC<Section> = ({children, paddingTop}) => {
  return (
    <section
      style={{
        paddingTop: paddingTop ? PADDING : 0
      }}
    >
      {children}
    </section>
  )
}
