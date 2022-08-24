import React from 'react'
import "./Designer.scoped.css"
import { Child, Comp, Module } from './Module'
import { attribAtom, focusedComp } from '../store/main'
import { useAtom } from 'jotai'


interface IWrapper { comp: Comp, modId: string }

export const Wrapper = ({ comp, modId }: IWrapper) => {
    const [focused, setFocused] = useAtom(focusedComp(modId))
    const EditableText = ({ child, index }: { child: Child, index: number }) => {
        const editClicked = (e: React.MouseEvent) => {
            e.stopPropagation()
        }
        const saveEdit = (e: React.FocusEvent<HTMLDivElement>) => {
            comp.children[index] = e.currentTarget.textContent || ''
            
        }
        return (
            <div contentEditable
                suppressContentEditableWarning
                onClick={editClicked}
                onBlur={saveEdit}
            >
             {child as string}
            </div>
        )
    }
    const getChildren = (comp: Comp) => {
        return comp.children.map((child, i) => {
            if (typeof child == 'string') {
                return <EditableText child={child} index={i} />
            } else {
                return <Wrapper comp={child as Comp} modId={modId} />
            }
        })
    }
    const clicked = (e: React.MouseEvent) => {
        setFocused(comp.id)
        e.stopPropagation()
        console.log(module)
    }
    const classes = `wrap-main ${focused === comp.id ? 'wrap-focused' : ''} `
    const getStyles = () => {
        const allProps = { ...comp.props.style || {}, ...comp.props }
        //TODO remove delete after correcting the app
        delete allProps['style']
        const styleProps: { [key: string]: any } = {}
        const otherProps: { [key: string]: any } = {}
        for (const [key, val] of Object.entries(allProps)) {
            if (!comp.nonStyleProps.includes(key)) {
                styleProps[key] = val
            } else {
                otherProps[key] = val
            }
        }
        //console.table(styleProps)
        return [styleProps, otherProps]
    }
    const [styleProps, baseProps] = getStyles()
    return (
        <div className={classes} {...baseProps} style={styleProps}
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
