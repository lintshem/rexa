import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React from 'react'
import { sbLeftAtom, sbRightAtom, themeAtom } from '../store/main'
import "./Titlebar.scoped.css"
import { FaMoon, FaSun } from 'react-icons/fa'
import { BsLayoutSidebar, BsLayoutSidebarReverse } from 'react-icons/bs'
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
  const setRSB = useSetAtom(sbRightAtom)
  const setLSB = useSetAtom(sbLeftAtom)
  const toggleRSB = () => setRSB((e: boolean) => !e)
  const toggleLSB = () => setLSB((e: boolean) => !e)
  return (
    <div className='main' >
      <BsLayoutSidebarReverse className='sb-left' onClick={toggleLSB} />
      <div>Titlebar</div>
      <Settings />
      <ThemeButton />
      <ToastContainer position='bottom-left' pauseOnHover
        theme={theme === 'dark' ? theme : 'light'} autoClose={3000} newestOnTop
      />
      <BsLayoutSidebarReverse className='sb-right' onClick={toggleRSB} />
    </div>
  )
}

export default Titlebar