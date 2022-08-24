import { useAtom } from "jotai"
import React, { useState } from "react"
import { CompType, Module } from "../models/Module"
import { attribAtom } from "../store/main"
import './Attrib.scoped.css'
import { focusedCompAtom } from "../store/main"
import { SketchPicker } from 'react-color'


export interface IAttributes { mod: Module }
const Attributes = ({ mod }: IAttributes) => {
    const [focused,] = useAtom(focusedCompAtom(mod.name))
    const comp = mod.getChildWithId(focused)
    if (!comp) {
        return (<div>
            Select a Component
        </div>)
    }
    const types = comp.getTypes()

    interface IHelper { type: CompType}
    const Helper = ({ type }: IHelper) => {
        const [, updateAttrib] = useAtom(attribAtom)
        const setColor = (col: any) => {
            comp.props[type.name] = col.hex
            updateAttrib(Math.random() * 1000)

        }
        return (
            <div>
                <SketchPicker width='80%' color={comp.props[type.name] || ''}
                    onChange={setColor}
                />
            </div>
        )
    }
    const AttItem = ({ type }: { type: CompType }) => {
        const [showHelper, setShowHelper] = useState(false)
        const [, updateAttrib] = useAtom(attribAtom)
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            comp.props[type.name] = val
            updateAttrib(Math.random() * 1000)
        }
        const doubleClick = () => {
            setShowHelper(true)
        }
        return (
            <div className='attrib-item' >
                <div className='at-name' >{type.name}</div>
                <div className='at-input' onDoubleClick={doubleClick} >
                    <input value={comp.props[type.name] || ''}
                        onChange={onChange}
                    />
                    {showHelper && <Helper type={type} />}
                    </div>
            </div>
                )
    }
                return (
                <div className="attrib-main" >
                    {types.map(type => <AttItem key={type.name} type={type} />)}
                </div>
                )
}

                export default Attributes 