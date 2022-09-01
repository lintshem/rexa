import { useAtom } from "jotai"
import React, { useState } from "react"
import { CompType, Module } from "../models/Module"
import { attribAtom } from "../store/main"
import './Attrib.scoped.css'
import { focusedCompAtom } from "../store/main"
import { SketchPicker } from 'react-color'
import Popover from "../library/Popover"
import useDimensions  from "react-cool-dimensions"


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

    interface IHelper { type: CompType, updateValue: (val: any) => void }
    const Helper = ({ type, updateValue }: IHelper) => {
        const [, updateAttrib] = useAtom(attribAtom)
        const setColor = (col: any) => {
            comp.props[type.name] = col.hex
            updateAttrib(Math.random() * 1000)

        }
        const types = type.type.split(',');
        const isHelpable = type.type.split(',').filter(t => !['t','n'].includes(t)).length > 0;
        if (types.includes('c')) {
            return (
                <div>
                    <SketchPicker width='90%' color={comp.props[type.name] || ''}
                        onChange={setColor}
                    />
                </div>
            )
        }
        if (types.includes('s')) {
            const vals = type.vals
            const selectItem = (index: number) => {
                updateValue(vals[index])
            }
            interface ICombo { item: string, index: number }
            const ComboItem = ({ item, index }: ICombo) => {
                return <div className="combo-item" onClick={() => selectItem(index)} >{item}</div>
            }
            return (
                <div className="combo" >
                    {vals.map((v, i) => <ComboItem key={v} item={v} index={i} />)}
                </div>
            )
        } else {
            console.log(types)
            return <div>TYPE ERROR</div>
        }
    }
    const AttItem = ({ type }: { type: CompType }) => {
        const { observe , width} = useDimensions()
        const [showHelper, setShowHelper] = useState(false)
        const [, updateAttrib] = useAtom(attribAtom)
        const isHelpable = type.type.split(',').filter(t => !['t','n'].includes(t)).length > 0;
        const updateValue = (val: any) => {
            comp.props[type.name] = val
            updateAttrib(Math.random() * 1000)
        }
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            updateValue(val)
        }
        const doubleClick = () => {
            setShowHelper(true)
        }
        return (
            <div className='attrib-item' >
                <div className='at-name' >{type.name}</div>
                <div className='at-input' ref={observe} onDoubleClick={doubleClick} >
                    <input value={comp.props[type.name] || ''}
                        onChange={onChange}
                    />
                    <Popover open={isHelpable && showHelper} setOpen={setShowHelper} width={width-width*0.1} >
                        <Helper type={type} updateValue={updateValue} />
                    </Popover>
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