import {LIGHT_GREY, WHITE} from '../../style-constants'
import React, {ReactElement} from 'react'

import {Condensed} from './Condensed'
import {Expanded} from './Expanded'
import {NavLink} from '../NavLink'
import Safe from 'react-safe'

interface Navbar {
  children: ReactElement<typeof NavLink>[]
}

const navContainer: React.CSSProperties = {
  width: '100%',
  overflow: 'hidden',
  borderBottom: `.05rem solid ${LIGHT_GREY}`,
  paddingBlock: '1rem',
  top: 0,
  position: 'sticky',
  backgroundColor: WHITE,
  zIndex: 1
}

export const Navbar: React.FC<Navbar> = ({children}) => {
  /** Injected */
  const NAVBAR_BREAKPOINT = 668

  /** Injected */
  const navMenuIds = {
    CONDENSED: 'condensedNav',
    EXPANDED: 'expandedNav'
  }

  /** Injected */
  function hideElement(element: HTMLElement) {
    element.setAttribute('style', 'display:none')
  }

  /** Injected */
  function showElement(element: HTMLElement) {
    element.setAttribute('style', 'display:block')
  }

  /** Injected */
  function handleResize() {
    const condensed = document.getElementById(navMenuIds.CONDENSED)
    const expanded = document.getElementById(navMenuIds.EXPANDED)

    if (window.innerWidth > NAVBAR_BREAKPOINT) {
      hideElement(condensed!)
      showElement(expanded!)
      return
    }

    showElement(condensed!)
    hideElement(expanded!)
  }

  function injectWindowResizeListener() {
    return (
      <>
        <Safe.script>{`window.addEventListener('resize', ${handleResize.toString()})`}</Safe.script>
        <Safe.script>{`window.addEventListener('load', ${handleResize.toString()})`}</Safe.script>
      </>
    )
  }

  function injectVisiblityFunctions() {
    return (
      <>
        <Safe.script>{hideElement.toString()}</Safe.script>
        <Safe.script>{showElement.toString()}</Safe.script>
      </>
    )
  }

  function injectNavMenuIds() {
    return (
      <Safe.script>{`const navMenuIds = ${JSON.stringify(
        navMenuIds
      )}`}</Safe.script>
    )
  }

  function injectNavbarBreakpoint() {
    return (
      <Safe.script>{`const NAVBAR_BREAKPOINT = ${NAVBAR_BREAKPOINT}`}</Safe.script>
    )
  }

  return (
    <nav style={navContainer}>
      <Condensed id={navMenuIds.CONDENSED}>{children}</Condensed>
      <Expanded id={navMenuIds.EXPANDED}>{children}</Expanded>
      {injectWindowResizeListener()}
      {injectVisiblityFunctions()}
      {injectNavMenuIds()}
      {injectNavbarBreakpoint()}
    </nav>
  )
}
