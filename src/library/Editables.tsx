import React, { useState } from 'react'
import { Child, Comp } from '../models/Module'
import { getPropFlat } from '../util/props'
import './Editables.scoped.css'

interface IEditableText { parent: Comp, pos: number }

export const EditableText = ({ parent, pos }: IEditableText) => {
    const [text,] = useState(parent.children[pos] as string)
    return (
        <div className='text-main' contentEditable >
            {text}
        </div>
    )
}
export const EditDiv = () => {
    return (
        <div className='div-main' tabIndex={0} >
            EditText
        </div>
    )
}
interface IPropState {
    [key: string]: any
}
export interface ITypeState {
    name: string,
    type: string,
    style: boolean,
}
export class EditContainer {
    comp: Comp
    props: IPropState
    pTypes: ITypeState[]
    styleTypes: string[]

    constructor(comp: Comp) {
        this.comp = comp
        const propsFlat = getPropFlat(comp.elem)
        this.pTypes = propsFlat.map(p => ({ name: p.name, type: p.type, style: p.style }))
        const rProps = {} as { [key: string]: any }
        const styleTypes: string[] = []
        propsFlat.forEach(p => {
            rProps[p.name] = p.def
            if (p.style) styleTypes.push(p.name)
        })
        this.styleTypes = styleTypes
        this.props = rProps
    }

    drawChildren(editId?: string, children: Child[] = []) {
        return children.map(child => {
            if ((child as any).id && (child as any).id === editId) {
                child = child as Comp
                return (
                    <div key={child.id} className='div-edit' tabIndex={0} >
                        <div style={{ ...this.getPropCat(true) }} {...this.getPropCat(false)} >
                            {this.draw(editId, child )}
                        </div>
                    </div>)
            } else {
                return Comp._drawItem(child)
            }
        })
    }
    getPropCat(style = true) {
        const rProps = {} as IPropState
        for (const [k, v] of Object.entries(this.props)) {
            if (style) {
                if (this.styleTypes.includes(k))
                    rProps[k] = v
            } else {
                if (!this.styleTypes.includes(k))
                    rProps[k] = v
            }
        }
        return rProps
    }
    draw(id?: string, comp?: Comp) {
        //return this.drawChildren(id)
        const curComp = comp || this.comp
        if (curComp.elem === 'div') {
            return (
                <div className='div-edit' tabIndex={0} >
                    <div style={{ ...this.getPropCat(true) }} {...this.getPropCat(false)} >
                        {this.drawChildren(id)}
                    </div>
                </div>)
        } else {
            return 'not' //   this.comp.draw()
        }
    }


}


