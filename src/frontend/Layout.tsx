import * as React from 'react'

import {A} from './components/A'
import {Container} from './components/Container'
import {FOOTER_HEIGHT} from './style-constants'
import {Footer} from './components/Footer'
import {NavLink} from './components/NavLink'
import {Navbar} from './components/Navbar/Navbar'

interface Layout {
  title: string
  children: JSX.Element | Array<JSX.Element>
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'neue-haas-grotesk-text',
  margin: 0,
  padding: 0,
  position: 'relative',
  minHeight: '100vh'
}

const contentStyle: React.CSSProperties = {
  paddingBottom: FOOTER_HEIGHT
}

export const Layout: React.FC<Layout> = ({children, title}) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://use.typekit.net/tbs8oug.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"></meta>
        <meta charSet="utf-8"></meta>
        <meta
          name="description"
          property="og:description"
          content="Research with Dr. Erald Troja and James Worden exploring how we can verify locations based on visual cues in the surrounding enviornment. We leverage optical character recognition to extract text from imagery at given locations."></meta>
        <meta property="og:title" content={title} />
        <meta
          name="keywords"
          content="ocr, text, spoofing, gps, coordinate, research, api"></meta>
        <meta name="author" content="James Worden"></meta>
        <meta property="og:url" content="//research.jamesworden.com/" />
        <meta
          name="image"
          property="og:image"
          content="https://cdn.pixabay.com/photo/2019/05/02/04/52/gps-4172635_1280.png"></meta>
      </head>
      <body style={bodyStyle}>
        <Navbar>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/docs">Docs</NavLink>
          <NavLink href="https://github.com/users/jamesworden/projects/5">
            Backlog
          </NavLink>
          <NavLink href="https://github.com/jamesworden/jamesworden-research">
            Source Code
          </NavLink>
        </Navbar>
        <div style={contentStyle}>
          <Container>{children}</Container>
        </div>
        <Footer>
          <A href="https://www.jamesworden.com/">
            James Worden &copy; {new Date().getFullYear().toString()}
          </A>
        </Footer>
      </body>
    </html>
  )
}
