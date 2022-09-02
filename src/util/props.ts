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
        { name: 'background', def: '', type: 't' },
        { name: 'color', def: 'red', type: 'c' },
        { name: 'display', def: '', type: 's',vals:['','flex','block','float'] },
        { name: 'flexDirection', def: '', type: 't' },
        { name: 'justifyContent', def: '', type: 's', vals: ['one', 'two', 'three', 'four'] },
        { name: 'alignItem', def: '', type: 't',vals:[] },
        { name: 'flex', def: 1, type: 'n' },
        { name: 'flexWrap', def: '', type: 't' },
        { name: 'overflow', def: '', type: 't' },
        { name: 'boxShadow', def: '', type: 't' },
        { name: 'border', def: '', type: 't' },
        { name: 'borderRadius', def: '', type: 't' },
    ],
    button: [
        { name: 'height', def: '', type: 't,n' },
        { name: 'width', def: '', type: 't,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },
        { name: 'disabled', def: '', type: 'b',notStyle:true  },

    ],
    img: [
        { name: 'src', def: '', type: 't', notStyle: true },
        { name: 'height', def: 50, type: 't,n' },
        { name: 'width', def: 50, type: 't,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },
    ],
    input: [
        { name: 'height', def: '', type: 't,n' },
        { name: 'width', def: '', type: 't,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 't,n', },
        { name: 'margin', def: '', type: 't,n', },

    ],
} as IPropItems

// export const getProps = (element: string): IProp | undefined => {
//     return props[element]
// }
export interface IPropType {
    name: string,
    type: string,
    def: any
    style: boolean,
}
export const getPropFlat = (element: string,tree:IPropItems|undefined=undefined): IPropType[] => {
    const rows = propItems[element].map(r=>({...r,style:!!r.notStyle}))
    return rows
}

