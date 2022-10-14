import { useAtom, useAtomValue } from "jotai"
import React, { useState } from "react"
import { Comp, CompType } from "../models/Module"
import { attribAtom, compsAtom, oneModAtom } from "../store/main"
import './Attrib.scoped.css'
import { focusedCompAtom } from "../store/main"
import { SketchPicker } from 'react-color'
import Popover from "../library/Popover"
import useDimensions from "react-cool-dimensions"
import Select from "../library/Select"
import { Module } from "../models/Module"

interface IAttItem { type: CompType, mod: Module, comp: Comp }

const AttItem = React.memo(({ type, mod, comp }: IAttItem) => {
    const { observe, width } = useDimensions()
    const [showHelper, setShowHelper] = useState(false)
    // const [, updateAttrib] = useAtom(attribAtom)
    // const prevUpdate = useSetAtom(prevChangeAtom(mod.name))
    const isHelpable = type.type.split(',').filter(t => !['t', 'n'].includes(t)).length > 0;
    const isNumberType = type.type.split(',').find(t => t === 'n') !== undefined;
    const isCheckType = type.type.split(',').find(t => t === 'b') !== undefined;
    const isTextType = type.type.split(',').find(t => t === 't') !== undefined;
    const [sComp, setSComp] = useAtom(compsAtom(`${mod.name},${comp.id}`))
    // console.log("atrrib c", sComp)
    // TODO change of type clears field 
    //const typeIsNum = /^\d+$/.test(comp.props[type.name])
    const typeIsNum = false
    interface IHelper { type: CompType, updateValue: (val: any) => void }
    const Helper = ({ type, updateValue }: IHelper) => {
        const [, updateAttrib] = useAtom(attribAtom)
        const setColor = (col: any) => {
            comp.props[type.name] = col.hex
            updateAttrib(Math.random() * 1000)
        }
        const types = type.type.split(',');
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
            return (
                <Select items={vals} onSelect={selectItem} />
            )
        } else {
            console.log(types)
            return <div>TYPE ERROR</div>
        }
    }

    const updateValue = (val: any) => {
        // comp.props[type.name] = val
        const newComp = Comp.copy(sComp)
        newComp.props[type.name] = val
        setSComp(newComp)
        console.log('updatevale', val, newComp)
        // updateAttrib(Math.random() * 1000)
        // prevUpdate(p => p % 100 + 1)
    }
    const getValue = (): any => {
        const val = sComp.props[type.name]
        if (val !== undefined) {
            return val
        } else {
            return ''
        }
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const oldVal = comp.props[type.name] || ''
        const val: string | number = e.target.value
        const isNum = /^\d+$/.test(val)
        if (isTextType && isNumberType) {
            if (isNum) {
                updateValue(Number(val))
            } else {
                updateValue(val)
            }
        } else if (isTextType) {
            updateValue(val)
        } else if (isNumberType) {
            if (isNum) {
                updateValue(Number(val))
            } else {
                if (val === '') {
                    updateValue('')
                } else {
                    updateValue(oldVal)
                }
            }
        }
        if (isCheckType) {
            updateValue(e.target.checked)
        }
    }
    const doubleClick = () => {
        setShowHelper(true)
    }
    //    console.log('AttribItem reloading',type, sComp.props, sComp.props[type.name])
    return (
        <div className='attrib-item' >
            <div className='at-name' >{type.name}</div>
            <div className='at-input' ref={observe} onDoubleClick={doubleClick} >
                <input className="input" value={getValue()} checked={getValue()}
                    type={typeIsNum ? 'number' : isCheckType ? 'checkbox' : 'text'}
                    onChange={(e) => onChange(e)}
                />
                <Popover open={isHelpable && showHelper} setOpen={setShowHelper} width={width - width * 0.1} >
                    <Helper type={type} updateValue={updateValue} />
                </Popover>
            </div>
        </div>
    )
}, (p1: IAttItem, p2: IAttItem) => {
    return p1.type.name === p2.type.name && p1.comp.id === p2.comp.id
})
export interface IAttributes { modName: string }
const Attributes = ({ modName }: IAttributes) => {
    const mod = useAtomValue(oneModAtom(modName))
    const [focused,] = useAtom(focusedCompAtom(mod?.name))
    const comp = mod.getChildWithId(focused)
    //  const [sComp, setSComp] = useAtom(compsAtom(JSON.stringify({ modName: mod?.name || '', compId: comp?.id || '' })))
    if (!mod) {
        return (
            <div>No Module</div>
        )
    }
    if (!comp) {
        return (<div>
            Select a Component
        </div>)
    }
    const types = comp.getTypes()


    console.log('atrsvs reloading')
    return (
        <div className="attrib-main" >
            <div>{comp.elem}</div>
            {types.map(type => <AttItem key={type.name} type={type} mod={mod} comp={comp} />)}
        </div>
    )
}

export default React.memo(Attributes)

