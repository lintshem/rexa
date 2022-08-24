import React, { useState } from 'react'
import "./Designer.scoped.css"
import { Child, Comp, Module } from './Module'
import { attribAtom, focusedCompAtom, isVoidElem, newTextAtom } from '../store/main'
import { useAtom, useAtomValue } from 'jotai'
import { receiveDrag } from '../util/utils'


interface IWrapper { comp: Comp, modId: string }

export const Wrapper = ({ comp, modId }: IWrapper) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(modId))
    const [NEW_TEXT] = useAtomValue(newTextAtom)
    const randomUpdate = useState(12)[1]
    const EditableText = ({ child, index }: { child: Child, index: number }) => {
        const editClicked = (e: React.MouseEvent) => {
            // e.stopPropagation()
        }
        const saveEdit = (e: React.FocusEvent<HTMLDivElement>) => {
            comp.children[index] = e.currentTarget.textContent || ''
        }
        return (
            <div contentEditable suppressContentEditableWarning
                onClick={editClicked} onBlur={saveEdit}
            >
                {child as string}
            </div>
        )
    }
    const getChildren = (comp: Comp) => {
        return comp.children.map((child, i) => {
            if (typeof child == 'string') {
                return <EditableText key={child} child={child} index={i} />
            } else {
                child = child as Comp
                return <Wrapper key={child.id} comp={child} modId={modId} />
            }
        })
    }
    const clicked = (e: React.MouseEvent) => {
        setFocused(comp.id)
        e.stopPropagation()
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
    const dragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }
    const drop = (e: React.DragEvent) => {
        const dragData = receiveDrag(e)
        e.preventDefault()
        e.stopPropagation()
        if (dragData.action === 'widget') {
            let newChild
            if (dragData.data === 'text') {
                newChild = NEW_TEXT + Math.random().toFixed(2)
            } else {
                newChild = new Comp(dragData.data, {}, [])
            }
            comp.addChild(newChild)
            if (newChild instanceof Comp) {
                setFocused(newChild.id)
            } else {
                randomUpdate(Math.random())
            }
            console.log(NEW_TEXT)
        }
        //Prevent content editable getting data
        return true
    }

    const Component = comp.elem as any
    const [styleProps, baseProps] = getStyles()
    //  console.log(comp.id,baseProps,styleProps,comp.props,comp.nonStyleProps )
    if (isVoidElem(comp.elem)) {
        return <Component className={classes} {...baseProps} style={styleProps}
            onClick={clicked}
            onDragOver={dragOver}
            onDrop={drop}
        />
    } else {
        return (
            <Component className={classes} {...baseProps} style={styleProps}
                onClick={clicked}
                onDragOver={dragOver}
                onDrop={drop}
            >
                {getChildren(comp)}
            </Component>
        )
    }
}

interface IEditProps {
    module: Module
}

const Designer = ({ module }: IEditProps) => {
    const [,] = useAtom(attribAtom)
    const getWrappedTree = (module: Module) => {
        return module.tree.map(c => <Wrapper key={c.id} comp={c} modId={module.name} />)
    }
    return (
        <div className='main'  >
            {getWrappedTree(module)}
        </div>
    )

}

export default Designer
