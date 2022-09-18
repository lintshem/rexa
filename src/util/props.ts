
interface IPropRow {
    name: string,
    def: any,
    type: string,
    notStyle?: true,
    vals?: any[],
}
export interface IProp {
    style: IPropRow[],
    className?: IPropRow,
    id?: IPropRow,
    draggable?: IPropRow,
}

export interface IProps {
    [elem: string]: IProp
}

export interface IPropItems { [key: string]: IPropRow[] }
export const propItems = {
    div: [
        { name: 'width', def: '', type: 't,n' },
        { name: 'height', def: '', type: 't,n' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'color', def: 'red', type: 't,c' },
        { name: 'display', def: '', type: 't,s', vals: ['', 'flex', 'block', 'float'] },
        { name: 'flexDirection', def: '', type: 't,s', vals: ['', 'column', 'row'] },
        { name: 'justifyContent', def: '', type: 't,s', vals: ['', 'center', 'space-around', 'space-between', 'space-evenly'] },
        { name: 'alignItem', def: '', type: 't,s', vals: ['', 'center', 'flex-start', 'flex-end'] },
        { name: 'flex', def: 1, type: 'n' },
        { name: 'flexWrap', def: '', type: 't,s', vals: ['', 'wrap', 'no-wrap'] },
        { name: 'overflow', def: '', type: 't,s', vals: ['', 'hidden', 'auto', 'scroll'] },
        { name: 'boxShadow', def: '', type: 't' },
        { name: 'border', def: '', type: 't' },
        { name: 'borderRadius', def: '', type: 't,n' },
    ],
    const: [
        { name: 'width', def: '', type: 't,n' },
        { name: 'height', def: '', type: 't,n' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'color', def: 'red', type: 't,c' },
        { name: 'display', def: '', type: 't,s', vals: ['', 'flex', 'block', 'float'] },
        { name: 'flexDirection', def: '', type: 't,s', vals: ['', 'column', 'row'] },
        { name: 'justifyContent', def: '', type: 't,s', vals: ['', 'center', 'space-around', 'space-between', 'space-evenly'] },
        { name: 'alignItem', def: '', type: 't,s', vals: ['', 'center', 'flex-start', 'flex-end'] },
        { name: 'flex', def: 1, type: 'n' },
        { name: 'flexWrap', def: '', type: 't,s', vals: ['', 'wrap', 'no-wrap'] },
        { name: 'overflow', def: '', type: 't,s', vals: ['', 'hidden', 'auto', 'scroll'] },
        { name: 'boxShadow', def: '', type: 't' },
        { name: 'border', def: '', type: 't' },
        { name: 'borderRadius', def: '', type: 't,n' },
    ],
    button: [
        { name: 'width', def: '100%', type: 't,n' },
        { name: 'height', def: 30, type: 't,n' },
        { name: 'borderRadius', def: '', type: 't,n' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'color', def: 'red', type: 't,c' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },
        { name: 'disabled', def: '', type: 'b', notStyle: true },
    ],
    img: [
        { name: 'src', def: '', type: 't', notStyle: true },
        { name: 'height', def: 50, type: 't,n' },
        { name: 'width', def: 50, type: 't,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't,c' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },
    ],
    input: [
        { name: 'height', def: 20, type: 't,n' },
        { name: 'width', def: 80, type: 't,n' },
        { name: "placeholder", def: '', type: 't', notStyle: true },
        { name: "value", def: '', type: 't', notStyle: true },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },

    ],
    p: [
        { name: 'width', def: '100%', type: 't,n' },
        { name: 'height', def: 20, type: 't,n' },
        { name: 'borderRadius', def: '', type: 't,n' },
        { name: 'background', def: '', type: 't,c' },
        { name: 'color', def: 'red', type: 't,c' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },
        { name: 'disabled', def: '', type: 'b', notStyle: true },
    ],
} as IPropItems
export interface IActionRow {
    name: string,
    func?: Function,
}
export interface IActionItems {
    [key: string]: IActionRow[],
}
export const actionItems = {
    div: [
        { name: 'onClick' },
        { name: 'onDrop' },
    ],
    button: [
        { name: 'onClick' },
        { name: 'onDoubleClick' },
    ],
} as IActionItems
export interface IPropType {
    name: string,
    type: string,
    def: any
    style: boolean,
}
export const getPropFlat = (element: string, tree: IPropItems | undefined = undefined): IPropType[] => {
    const rows = propItems[element].map(r => ({ ...r, style: !!r.notStyle }))
    return rows
}

export const getAction = (elem: string) => {
    return actionItems[elem]
}