import React, { HtmlHTMLAttributes } from 'react'
import "./Button.scoped.css"

interface IButton { children?: any, style?: HtmlHTMLAttributes<HTMLButtonElement>, onClick?: React.MouseEventHandler }
const Button = ({ children, style, onClick }: IButton) => {
    return (
        <button style={style} className="main" onClick={onClick} >
            {children}
        </button>
    )
}

export default Button