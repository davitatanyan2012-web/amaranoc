import React from 'react'
import Logo from './logo'
import Nav from './nav'
import Icons from './icons'
import Search from './search'
export default function Header() {
  return (
    <header>
        <Logo/>
        <Nav/>
        <Icons/>
        <Search/>
    </header>
  )
}
