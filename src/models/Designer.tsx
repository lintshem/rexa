import React, { useState } from 'react'
import "./Designer.scoped.css"
import { Child, Comp, Module } from './Module'
import { attribAtom, focusedCompAtom, isVoidElem, newTextAtom } from '../store/main'
import { useAtom, useAtomValue } from 'jotai'
import { receiveDrag } from '../util/utils'
import { Resizable } from 're-resizable'
import { ContextMenuTrigger } from '../library/ContextMenu'

interface IWrapper { comp: Comp, modId: string, module: Module }

export const Wrapper = ({ comp, modId, module }: IWrapper) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(modId))
    const [NEW_TEXT] = useAtomValue(newTextAtom)
    const randomUpdate = useState(12)[1]
    const isFocused = focused === comp.id
    const [resizing, setResizing] = useState(false)
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
                return <Wrapper key={child.id} comp={child} modId={modId} module={module} />
            }
        })
    }
    const clicked = (e: React.MouseEvent) => {
        setFocused(comp.id)
        e.stopPropagation()
    }
    const classes = `wrap-main ${isFocused ? 'wrap-focused' : ''} ${resizing ? 'wrap-resize' : ''} `
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
        }
        //Prevent content editable getting data
        return true
    }

    const Component = comp.elem as any
    const [styleProps, baseProps] = getStyles()
    //  console.log(comp.id,baseProps,styleProps,comp.props,comp.nonStyleProps )
    let componentParent = null
    if (isVoidElem(comp.elem)) {
        componentParent = <Component className={classes} {...baseProps} style={styleProps}
            onClick={clicked}
            onDragOver={dragOver}
            onDrop={drop}
        />
    } else {
        componentParent = (
            <Component className={classes} {...baseProps} style={styleProps}
                onClick={clicked}
                onDragOver={dragOver}
                onDrop={drop}
            >
                {getChildren(comp)}
            </Component>
        )
    }
    const getSize = () => {
        return { width: comp.props.width, height: comp.props.height }
    }

    const resized = (e: any, dir: any, ref: any, d: { width: number, height: number }) => {
        e.stopPropagation()
        setResizing(false)
        const size = getSize()
        size.width = Math.max(10, parseInt(size.width) + d.width) || Math.abs(d.width);
        size.height = Math.max(10, parseInt(size.height) + d.height) || Math.abs(d.height);
        module.setProp(comp.id, 'width', size.width)
        module.setProp(comp.id, 'height', size.height)
        randomUpdate(r => (r + 1) % 1000)
    }
    if (isFocused && componentParent != null) {
        return (
            <Resizable size={getSize()} onResizeStop={resized} className={`${resizing ? 'wrap-resizing' : ''}`}
                onResizeStart={() => setResizing(true)} >
                {componentParent}
            </Resizable>
        )
    } else {
        return componentParent
    }

}

interface IEditProps {
    module: Module
}

const Designer = ({ module }: IEditProps) => {
    const [,] = useAtom(attribAtom)
    const getWrappedTree = (module: Module) => {
        return module.tree.map(c => <Wrapper key={c.id} comp={c} modId={module.name} module={module} />)
    }
    return (
        <div className='main'  >
            <ContextMenuTrigger id="design-context"  >
                <div className='main-center'>
                    {getWrappedTree(module)}
                </div>
            </ContextMenuTrigger>
        </div>
    )

}

export default Designer
