import { atom, useAtom } from 'jotai'
import React, { useState } from 'react'
import { atomFamily } from 'jotai/utils'
import "./TabContainer.scoped.css"
import _ from 'lodash'

const tabsFamilyAtoms = atomFamily(param => atom(0))

interface ITabHeader {
    titles: string[]
    width: number
    align: 'hor' | 'ver'
    setIndex: Function,
    index: number
    fullWidth: boolean
    onAction?: Function
}
const TabHeader = ({ titles, align, width = 20, setIndex, index = 0, fullWidth, onAction }: ITabHeader) => {
    const getThStyles = () => {
        if (align === 'hor') {
            return {
                width: '100%',
            } as React.HTMLAttributes<HTMLDivElement>
        } else {
            return {
                flexDirection: 'column',
                height: '100%',
            } as React.HTMLAttributes<HTMLDivElement>
        }
    }
    const TitleElement = ({ title, index, selected = false, strictWidth = true }: {
        index: number, title: string, selected: boolean, strictWidth?: boolean
    }) => {
        const getTeStyles = () => {
            if (align === 'hor') {
                return {
                    width: strictWidth && width,
                    flex: strictWidth ? 1 : undefined,
                } as React.HTMLAttributes<HTMLDivElement>
            } else {
                return {
                    flexDirection: 'column',
                    height: strictWidth && width,
                    width: 20,
                    writingMode: 'sideways-lr',
                } as React.HTMLAttributes<HTMLDivElement>
            }
        }
        const callAction = () => {
            if (onAction) {
                onAction(index)
            }
        }
        const classes = `action-base ${onAction ? 'the-action' : ''}`
        return (
            <div className={`the-main ${selected && 'the-selected'}`} style={{ ...getTeStyles() }}
                onClick={() => setIndex(index)} >
                {title}
                <div className={classes} onClick={callAction} >X</div>
            </div>
        )
    }
    return (<div className='th-main' style={getThStyles()}>
        {titles.map((title, i) => {
            return <TitleElement key={title} title={title} index={i} selected={index === i} strictWidth={!fullWidth} />
        })}
    </div>)
}
export interface ITabContainer {
    children: any[];
    titles: string[];
    headerWidth?: number;
    align?: 'ver' | 'hor'
    tab?: number
    position?: 'start' | 'end'
    style?: React.HTMLAttributes<HTMLDivElement>
    className?: string,
    fullWidth?: boolean,
    onAction?: Function,
    id: any,
}
const TabContainer = ({ children, titles, headerWidth = 80, align = 'hor', position = 'start', tab = 0,
    className, style, fullWidth = false, onAction, id }: ITabContainer) => {
    const [index, setIndex] = useAtom(tabsFamilyAtoms(id))
    if (titles.length !== children.length) {
        console.warn("Got wrong no titles", titles)
    }
    const getStyles = (): React.HTMLAttributes<HTMLDivElement> => {
        if (align === 'ver') {
            return {

            } as React.HTMLAttributes<HTMLDivElement>
        } else {
            return {
                flexDirection: 'column',
            } as React.HTMLAttributes<HTMLDivElement>
        }
    }
    const getHeader = (pos: string) => {
        if (pos === position) {
            return <TabHeader width={headerWidth} titles={titles} align={align} setIndex={setIndex} index={index} fullWidth={fullWidth}
                onAction={onAction} />
        }
        return null
    }
    return (
        <div style={{ ...style, ...getStyles() }} className={`main ${className}`}  >
            {getHeader('start')}
            <div style={{ flex: 1 }} >
                {children[index]}
            </div>
            {getHeader('end')}
        </div>
    )
}

export default TabContainer