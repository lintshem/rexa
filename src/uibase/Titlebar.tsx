import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { themeAtom } from '../store/main'
import "./Titlebar.scoped.css"
import { FaMoon, FaSun } from 'react-icons/fa'
import Settings from '../components/Settings'
import { ToastContainer } from 'react-toastify'

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
  const theme = useAtomValue(themeAtom)
  return (
    <div className='main' >
      Titlebar
      <Settings  />
      <ThemeButton />
      <ToastContainer position='bottom-left' pauseOnHover
        theme={theme === 'dark' ? theme : 'light'} autoClose={3000} newestOnTop
      />
    </div>
  )
}

export default Titlebar