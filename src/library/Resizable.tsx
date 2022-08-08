import _ from 'lodash';
import React, { useState } from 'react'
import useDimensions from 'react-cool-dimensions'
import "./Resizable.scoped.css"
export interface IContainer {
    width: number;
    height: number;
}

export const ResizableContainer = ({ width, height }: IContainer) => {

    return (
        <div style={{ width, height }}  >
            ResizableContainer
        </div>
    )
}

export interface IResizable {
    children: any,
    defRatio?: number[],
    align?: 'hor' | 'ver',
    minLength?: number,
}

const Resizable = ({ children, defRatio = [3, 1, 2], align = 'hor', minLength = 30 }: IResizable) => {
    const { observe, width: contWidth, height: contHeight, entry } = useDimensions()
    const [ratio, setRatio] = useState(defRatio)

    if (!_.isArray(children)) {
        return <h1>Expects arrays</h1>
    }
    const count = children.length
    const totalRatio = ratio.reduce((p, c) => c + p, 0)

    const getWidthFromRatio = (index: number) => {
        const space = (align === 'hor' ? contWidth : contHeight)
        const val = ratio[index] / totalRatio * space
        return val
    }
    const getMeasure = (index: number) => {
        const val = getWidthFromRatio(index)
        if (align === 'hor') {
            return {
                width: val
            }
        } else {
            return {
                height: val
            }
        }
    }
    const getStyles = () => {
        if (align === 'hor') {
            return ({
                display: 'flex',
                flexDirection: 'row',
            })
        } else {
            return ({
                display: 'flex',
                flexDirection: 'column',
            })
        }

    }
    const getDivider = (i: number) => {
        if (i === count - 1) return
        const dividerSize = 5
        const dividerStyle = () => {
            if (align === 'hor') {
                return {
                    width: dividerSize,
                    height: '100%',
                    cursor:'ew-resize',
                }
            } else {
                return {
                    height: dividerSize,
                    width: '100%',
                    cursor:'ns-resize',
                }
            }

        }
        const dragStart = (e: React.DragEvent) => {
            //e.preventDefault()
            e.dataTransfer.setData('divider', "" + i)

        }
        return (
            <div style={dividerStyle()} className='re-divider' draggable={true} onDragStart={dragStart}  >

            </div>
        )
    }
    const dragOver = (e: React.DragEvent) => {
        const val = e.dataTransfer.getData('divider')
        //console.log(val, e,entry)
        if (!val) return
        e.preventDefault()


    }
    const drop = (e: React.DragEvent) => {
        const val = e.dataTransfer.getData('divider')
        if (!val && entry?.contentRect) return
        const divIndex = parseInt(val)
        console.log(e, entry)
        const { x, y } = entry!.contentRect
        const length = align == 'hor' ? e.pageX - x : e.pageY - y
        const sizes = [...Array(count).keys()].map((_, i) => getWidthFromRatio(i))
        let midline = 0
        for (let i = 0; i < divIndex + 1; i++) {
            midline += sizes[i]
        }
        const diff = Math.abs(length - midline)
        if (length > midline) {
            sizes[divIndex] += diff
            sizes[divIndex + 1] -= diff
        } else {
            sizes[divIndex] -= diff
            sizes[divIndex + 1] += diff
        }
        const totalSizes = sizes.reduce((e, i) => e + i, 0)
        const newSizes = sizes.map(e => e / totalSizes)
        console.log(sizes, newSizes)
        const belowMin = newSizes.find(e => e < minLength)
        if (belowMin) {
            // TODO not correct
            setRatio(newSizes)
        }
    }
    return (
        <div className='main' ref={observe} style={getStyles() as any} onDragOver={dragOver} onDrop={drop} >
            {children.map((c, i) => {
                return [
                    <div key={c} className='item' style={getMeasure(i)} >
                        {c}
                    </div>,
                    getDivider(i)
                ]
            })}
        </div>
    )
}

export default Resizable