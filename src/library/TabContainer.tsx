import { divide } from 'lodash';
import { title } from 'process';
import React, { useState } from 'react'
import "./TabContainer.scoped.css"


interface ITabHeader {
    titles: string[]
    width: number
    align: 'hor' | 'ver'
    setIndex: Function,
    index: number
}
const TabHeader = ({ titles, align, width = 20, setIndex, index = 0 }: ITabHeader) => {
    const getThStyles = () => {
        if (align === 'hor') {
            return {
                paddingLeft: 1,
            } as React.HTMLAttributes<HTMLDivElement>
        } else {
            return {
                flexDirection: 'column',
                paddingBottom: 1,
            } as React.HTMLAttributes<HTMLDivElement>
        }
    }
    const TitleElement = ({ title, index, selected = false }: {
        index: number, title: string, selected: boolean
    }) => {
        const getTeStyles = () => {
            if (align === 'hor') {
                return {
                    width: width,
                    paddingLeft: 1,
                } as React.HTMLAttributes<HTMLDivElement>
            } else {
                return {
                    flexDirection: 'column',
                    height: width,
                    paddingBottom: 1,
                    writingMode: 'sideways-lr',
                } as React.HTMLAttributes<HTMLDivElement>
            }
        }
        return (
            <div className={`the-main ${selected && 'the-selected'}`} style={getTeStyles()} onClick={() => setIndex(index)} >
                {title}
            </div>
        )
    }
    return (<div className='th-main' style={getThStyles()}>
        {titles.map((title, i) => {
            return <TitleElement key={title} title={title} index={i} selected={index === i} />
        })}
    </div>)
}
export interface ITabContainer {
    children: any[];
    titles: string[];
    headerWidth?: number;
    align?: 'ver' | 'hor'
    tab?: number
}
const TabContainer = ({ children, titles, headerWidth = 80, align = 'hor', tab = 0 }: ITabContainer) => {
    const [index, setIndex] = useState(tab)
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
    return (
        <div style={getStyles()} className='main' >
            <TabHeader width={headerWidth} titles={titles} align={align} setIndex={setIndex} index={index} />
            <div style={{ [align === 'ver' ? 'marginLeft' : '']: 20 }} >
                {children[index]}
            </div>
        </div>
    )
}

export default TabContainer