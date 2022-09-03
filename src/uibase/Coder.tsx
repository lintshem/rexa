import React from 'react'
import './Coder.scoped.css'

interface ICoder { modName: string }
const Coder = ({ modName }: ICoder) => {

    return (
        <div>Coder{modName}</div>
    )
}

export default Coder