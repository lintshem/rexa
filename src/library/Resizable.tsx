import _ from 'lodash';
import React, { useState } from 'react'
import { useBetterDimensions } from '../util/utils';
import "./Resizable.scoped.css"
//@ts-ignore
import { ReactSplitViews} from 'react-split-views'

const Split = ReactSplitViews
export interface IResizable {
    children: JSX.Element[],
    defRatio?: number[],
    align?: 'hor' | 'ver',
    minLength?: number,
    style?: any,
    className?: string,
    resizeDelta?: number,
}

const Splitter = ({ children, defRatio, align = 'hor', minLength = 30, style = {}, className = '', resizeDelta }: IResizable) => {
    const defValues = () => {
        let total = 0
        defRatio?.forEach(r => total += r)
        return (defRatio || []).map(m => (m / total) * 100)
    }
    const direction = (align === 'hor') ? 'horizontal' : 'vertical'
    return (
        <Split sizes={defValues()}
            direction={direction}
            minSize={20}
            style={style}
            className={'split resizable'}
        >
            {children}
        </Split>
    )
}

export const SplitterOld = ({ children, defRatio, align = 'hor', minLength = 30, style = {}, className = '', resizeDelta }: IResizable) => {
    if (!defRatio) {
        // use a ratio of 1s as default
        defRatio = [...Array(children.length)].map(e => 1)
    }
    const { observe, width: contWidth, height: contHeight, entry } = useBetterDimensions(resizeDelta)

    const [ratio, setRatio] = useState(defRatio)
    const dragId = _.uniqueId("resize")
    if (!_.isArray(children)) {
        return children
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
                    height: contHeight,
                    cursor: 'ew-resize',
                }
            } else {
                return {
                    height: dividerSize,
                    width: contWidth,
                    cursor: 'ns-resize',
                }
            }

        }
        const dragStart = (e: React.DragEvent) => {
            //e.preventDefault()
            e.dataTransfer.setData('divider', dragId + "," + i)

        }
        return (
            <div key={"divider" + i} style={dividerStyle()} className='re-divider' draggable={true} onDragStart={dragStart}  >

            </div>
        )
    }
    const dragOver = (e: React.DragEvent) => {
        const val = e.dataTransfer.getData('divider')
        if (!val) return
        e.preventDefault()

    }
    const drop = (e: React.DragEvent) => {
        const data = e.dataTransfer.getData('divider')
        if (!data && entry?.contentRect) return
        const dataParts = data.split(',')
        const droppedDragId = dataParts[0]
        if (droppedDragId !== dragId) return
        const val = dataParts[1]
        const divIndex = parseInt(val)
        const { x, y } = entry!.contentRect
        const length = align === 'hor' ? e.pageX - x : e.pageY - y
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
        const belowMin = newSizes.find(e => e < minLength)
        if (belowMin) {
            // TODO not correct
            setRatio(newSizes)
        }
    }
    return (
        <div className={`resizable ${className}`} ref={observe} style={{ ...style, ...getStyles() } as any} onDragOver={dragOver} onDrop={drop} >
            {children.map((c, i) => {
                return [
                    <div className='resizable-item' style={getMeasure(i)} >
                        {c}
                    </div>,
                    getDivider(i)
                ]
            })}
        </div>
    )
}

export default Splitter