import { useAtom } from 'jotai'
import React from 'react'
import { themeAtom } from '../store/main'
import "./Titlebar.scoped.css"
import { FaMoon, FaSun } from 'react-icons/fa'

export const ThemeButton = () => {
  const [theme, setTheme] = useAtom(themeAtom)
  const toggleTheme = () => {
    const rootElement = document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    rootElement.dataset.theme = newTheme;
    setTheme(newTheme)
  }
  return (
    <div className="theme" style={{ color: theme === 'dark' ? 'white' : 'black' }} onClick={toggleTheme} >
      {theme === 'light' ? <FaMoon className="icon" /> : <FaSun className="icon" />}
    </div>
  )
}

const Titlebar = () => {
  return (
    <div className='main' >
      Titlebar
      <ThemeButton />
    </div>
  )
}

export default Titlebar