import React, { useState } from 'react'
import "./Designer.scoped.css"
import { Child, Comp, Module } from './Module'
import { attribAtom, compsAtom, focusedCompAtom, isVoidElem, modulesAtom, newTextAtom, prevChangeAtom, prevSizeAtom } from '../store/main'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { receiveDrag } from '../util/utils'
import { Resizable } from 're-resizable'
import { ContextMenuTrigger } from '../library/ContextMenu'
import { Resizable as WrapResize } from 're-resizable'
import Constraint from '../components/Constraint'

interface IWrapper { comp: Comp, modId: string, module: Module, clickStop?: boolean, isConstChild?: boolean }

export const Wrapper = ({ comp, modId, module,  isConstChild = false }: IWrapper) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(modId))
    const [NEW_TEXT] = useAtomValue(newTextAtom)
    const randomUpdate = useState(12)[1]
    const isFocused = focused === comp.id
    const [resizing, setResizing] = useState(false)
    const prevUpdate = useSetAtom(prevChangeAtom(module.name))
    const [sComp, setSComp] = useAtom(compsAtom(`${modId},${comp.id}`))
    const EditableText = ({ child, index }: { child: Child, index: number }) => {
        const editClicked = (e: React.MouseEvent) => {
            // e.stopPropagation()
        }
        const saveEdit = (e: React.FocusEvent<HTMLDivElement>) => {
            const newComp = Comp.copy(sComp)
            newComp.children[index] = e.currentTarget.textContent || ''
            setSComp(newComp)
            // prevUpdate(p => p % 100 + 1)
        }
        return (
            <div contentEditable suppressContentEditableWarning
                onClick={editClicked} onBlur={saveEdit}
            >
                {child as string}
            </div>
        )
    }
    const getChildren = (comp: Comp, isConstChild = false) => {
        return comp.children.map((child, i) => {
            if (typeof child == 'string') {
                return <EditableText key={child} child={child} index={i} />
            } else {
                child = child as Comp
                return <Wrapper isConstChild={isConstChild} key={child.id} comp={child} modId={modId} module={module} clickStop={false} />
            }
        })
    }
    const clicked = (e: React.MouseEvent) => {
        setFocused(comp.id)
        if (!isConstChild) e.stopPropagation()
    }
    const classes = `wrap-main ${(isFocused && !isConstChild) ? 'wrap-focused' : ''} ${resizing ? 'wrap-resize' : ''} `
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
        console.log("drop")
        if (dragData.action === 'widget') {
            console.log("drop in widget")
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
    if (comp.isModule) {
        return comp.getDead(comp.module!)
    }
    if (comp.elem === 'const') {
        return (
            <Constraint comp={comp} update={randomUpdate} childs={getChildren(sComp, true)} modId={modId} stylingProps={getStyles()} />
        )
    }
    const Component = comp.elem as any
    const [styleProps, baseProps] = getStyles()
    //  console.log(comp.id,baseProps,styleProps,comp.props,comp.nonStyleProps )
    const calcStyles = isFocused ? { ...styleProps, width: '100%', height: '100%' } : styleProps
    let componentParent = null
    if (isVoidElem(comp.elem)) {
        componentParent = <Component className={classes} {...baseProps} style={calcStyles}
            onClick={clicked}
            onDragOver={dragOver}
            onDrop={drop}
        />
    } else {
        componentParent = (
            <Component className={classes} {...baseProps} style={calcStyles}
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
        prevUpdate(p => p % 100 + 1)
    }
    if (isFocused && !isConstChild) {
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

interface IDesign {
    modName: string
}

const Designer = ({ modName }: IDesign) => {
    const modules = useAtomValue(modulesAtom)
    const mod = modules.find(m => m.name === modName)
    const [,] = useAtom(attribAtom)
    const [size, setSize] = useAtom(prevSizeAtom('des' + modName))
    if (!mod) {
        return (
            <div>No Module</div>
        )
    }
    const getWrappedTree = (module: Module, active = true) => {
        return module.tree.map(c => <Wrapper key={c.id} comp={c} modId={module.name} module={module} />)
    }
    const updateSize = (e: any, dir: any, a: any, d: any) => {
        setSize({ width: size.width + d.width, height: size.height + d.height })
    }
    // console.log('redrawing')
    return (
        <div className='main'  >
            <ContextMenuTrigger id="design-context"  >
                <WrapResize className='resize-area' defaultSize={size} onResizeStop={updateSize}  >
                    <div className='main-center' >
                        {getWrappedTree(mod)}
                    </div>
                </WrapResize>
            </ContextMenuTrigger>
        </div>
    )

}

export default Designer
