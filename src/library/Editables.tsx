import React, { useState } from 'react'
import { Comp } from '../models/Module'
import { getProps, IProp } from '../util/props'
import './Editables.scoped.css'

interface IEditableText { parent: Comp, pos: number }

export const EditableText = ({ parent, pos }: IEditableText) => {
    const [text, setText] = useState(parent.children[pos] as string)
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
    style: {
        [key: string]: any
    },
    [key: string]: any
}
export class EditContainer {
    comp: Comp
    props: IPropState
    propTypes: IProp | undefined
    constructor(comp: Comp) {
        this.comp = comp
        const propTypes = getProps(comp.elem)
        this.propTypes = propTypes
        let defProps = {} as any
        // convert style array to object of props
        if (propTypes) {
            defProps = JSON.parse(JSON.stringify(propTypes))
            for (const [key, val] of Object.entries(defProps)) {
                if (key === 'style') {
                    const styles = [...val as any]
                    defProps.style = {}
                    for (const styleProp of styles) {
                        defProps.style[styleProp.name] = styleProp.def
                    }
                }
            }
        }
        this.props = defProps
    }
    drawChildren() {
        return this.comp.children.map(child => this.comp._drawItem(child))
    }
    draw(): any {
        console.log(this.props.style)
        if (this.comp.elem == 'div') {
            return (
                <div className='div-edit' tabIndex={0} >
                    <div  {...this.props} >
                        {this.drawChildren()}
                    </div>
                </div>)
        } else {
            return 'not' //   this.comp.draw()
        }
    }
    getType(propName: string): string {
        if (!this.propTypes) {
            console.warn('Lacks prop types')
            return ''
        }
        for (const prop of this.propTypes.style) {
            if (prop.name === propName) {
                return prop.type
            }
        }
        return ''
    }
    setProp(name: string, val: any) {
        this.props[name] = val
    }

}


