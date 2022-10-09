import React from 'react'
import "./SmallComps.scoped.css"

export const EmptyArea = ({message}:{message:string}) => {
    return (
        <div className='wa-empty' >
            <h2 className='wa-empty-text' >{message}</h2>
        </div>
    )
}

