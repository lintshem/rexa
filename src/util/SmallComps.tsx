import React from 'react'
import { toast } from 'react-toastify'
import "./SmallComps.scoped.css"

export const EmptyArea = ({ message }: { message: string }) => {
    return (
        <div className='wa-empty' >
            <h2 className='wa-empty-text' >{message}</h2>
        </div>
    )
}

export const showDialog = (action: Function, message: string = 'Are you sure?', options = ['yes', 'No']) => {
    toast(<div>
        <div>{message}</div>
        {options.map((p, i) => {
            return (
                <div key={p} className='rexa-button' onClick={(i == 0 ? action : undefined) as any}  >{p}</div>
            )
        })}
    </div>)
}
