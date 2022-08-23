import React, { Component, useState } from 'react'
import "./Designer.scoped.css"
import { Child, Comp, Module } from './Module'
import { attribAtom, focusedComp } from '../store/main'
import { useAtom } from 'jotai'


interface IWrapper { comp: Comp, modId: string }

export const Wrapper = ({ comp, modId }: IWrapper) => {
    const [focused, setFocused] = useAtom(focusedComp(modId))
    const EditableText = ({ child }: { child: Child }) => {
        return (
            <div >
                ED: {child as string}
            </div>
        )
    }
    const getChildren = (comp: Comp) => {
        return comp.children.map(child => {
            if (typeof child == 'string') {
                return <EditableText child={child} />
            } else {
                return <Wrapper comp={child as Comp} modId={modId} />
            }
        })
    }
    const clicked = (e: React.MouseEvent) => {
        setFocused(comp.id)
        console.log(classes)
        e.stopPropagation()
    }
    const classes = `wrap-main ${focused == comp.id ? 'wrap-focused' : ''} `
    return (
        <div className={classes} style={(comp.props as any).style}
            onClick={clicked}
        >
            {getChildren(comp)}
        </div>
    )
}

interface IEditProps {
    module: Module
}

const Editable = ({ module }: IEditProps) => {
    const [,] = useAtom(attribAtom)
    const getWrappedTree = (module: Module) => {
        return module.tree.map(c => <Wrapper comp={c} modId={module.name} />)
    }
    return (
        <div className='main'>
            {getWrappedTree(module)}
        </div>
    )

}

export default Editable
