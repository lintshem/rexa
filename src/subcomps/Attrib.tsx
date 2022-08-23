import { useAtom } from "jotai"
import React from "react"
import { CompType, Module } from "../models/Module"
import { attribAtom } from "../store/main"
import './Attrib.scoped.css'
import { focusedComp } from "../store/main"

export interface IAttributes { mod: Module }
const Attributes = ({ mod }: IAttributes) => {
    const [focused,] = useAtom(focusedComp(mod.name))
    const comp = mod.getChildWithId(focused)
    if (!comp) {
        return (<div>
            Select a Component
        </div>)
    }
    const types = comp.getTypes()

    const AttItem = ({ type }: { type: CompType }) => {
        const [, updateAttrib] = useAtom(attribAtom)
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            comp.props[type.name] = val
            updateAttrib(Math.random() * 1000)
        }
        return (
            <div className='attrib-item' >
                <div className='at-name' >{type.name}</div>
                <div className='at-input' >
                    <input value={comp.props[type.name]}
                        onChange={onChange}
                    />
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