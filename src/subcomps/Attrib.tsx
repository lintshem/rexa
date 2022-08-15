import { useAtom } from "jotai"
import React from "react"
import { EditContainer, ITypeState } from "../library/Editables"
import { attribAtom } from "../store/main"
import './Attrib.scoped.css'

export interface IAttributes { editable: EditContainer }
const Attributes = ({ editable }:IAttributes ) => {
    const propTypes = editable.pTypes
    interface IAttItem { type: ITypeState }
    const getValue = (name: string) => {
        return editable.props[name]
    }

    const AttItem = ({ type }: IAttItem) => {
        const [, setUpdate] = useAtom(attribAtom)
        const setPropValue = (name: string, val: any) => {
            editable.props[name] = val;
            setUpdate(p => (p + 1) % 1000)
        }
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setPropValue(type.name, e.target.value)
        }
        return (
            <div className='attrib-item' >
                <div className='at-name' >{type.name}</div>
                <div className='at-input' >
                    <input value={getValue(type.name)}
                        onChange={onChange}
                    /></div>
            </div>
        )
    }
    return (
        <div className="attrib-main" >
            {propTypes.map(pt => <AttItem key={pt.name} type={pt} />)}
        </div>
    )
}

export default Attributes 