import React, { useEffect, useState } from 'react'
import { receiveMessage } from '../util/utils'
import './Statusbar.scoped.css'

const Statusbar = () => {
    const [messages, setMessages] = useState([] as string[])
    useEffect(() => {
        const addMessage = ({ message, duration }: { message: string, duration: number }) => {
            setMessages([message])
        }
        const clean = receiveMessage('stat', addMessage)
        return clean
    }, [])
    return (
        <div>
            <div>Statusbar</div>
            <div>
                {messages.map(m => <div key={m} >{m}</div>)}
            </div>
        </div>
    )
}

export default Statusbar