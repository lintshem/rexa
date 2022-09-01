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
export const props = {
    div: {
        style: [
            { name: 'width', def: '', type: 's,n' },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: 'red', type: 't' },
            { name: 'background', def: '', type: 't' },
            { name: 'flex', def: 1, type: 'n' },

        ],
        id: { name: 'id', def: '', type: 's,n' },
        className: { name: 'className', def: '', type: 's,n' },

    },
    divs: {
        style: [
            { name: 'width', def: '', type: 's,n' },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: '', type: 't' },
            { name: 'background', def: '', type: 't' },
        ],
    },
    button: {
        style: [
            { name: 'borderRadius', def: '', type: 't', },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: '', type: 't' },
            { name: 'background', def: '', type: 't' },
            { name: 'width', def: '', type: 's,n' },
        ],
    },


} as IProps

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
        { name: 'flex', def: 1, type: 't,n' },
        { name: 'flexWrap', def: '', type: 't' },
        { name: 'overflow', def: '', type: 't' },
        { name: 'boxShadow', def: '', type: 't' },
        { name: 'border', def: '', type: 't' },
        { name: 'borderRadius', def: '', type: 't' },
    ],
    button: [
        { name: 'height', def: '', type: 's,n' },
        { name: 'width', def: '', type: 's,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 's,n', },
        { name: 'margin', def: '', type: 's,n', },

    ],
    img: [
        { name: 'src', def: '', type: 't', notStyle: true },
        { name: 'height', def: '', type: 's,n' },
        { name: 'width', def: '', type: 's,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 's,n', },
        { name: 'margin', def: '', type: 's,n', },
    ],
    input: [
        { name: 'height', def: '', type: 's,n' },
        { name: 'width', def: '', type: 's,n' },
        { name: 'borderRadius', def: '', type: 't', },
        { name: 'color', def: '', type: 't' },
        { name: 'background', def: '', type: 't' },
        { name: 'padding', def: '', type: 's,n', },
        { name: 'margin', def: '', type: 's,n', },

    ],
} as IPropItems

export const getProps = (element: string): IProp | undefined => {
    return props[element]
}
export interface IPropType {
    name: string,
    type: string,
    def: any
    style: boolean,
}
export const getPropFlat = (element: string, tree = undefined): IPropType[] => {
    const ptypes: IPropType[] = []
    const propsElem = tree ? tree : props[element]
    for (let [key, val] of Object.entries(propsElem)) {
        if (key === 'style') {
            const types = getPropFlat(key, val)
            ptypes.push(...types)
        } else {
            val = (val as IPropRow)
            ptypes.push({ name: val.name, type: val.type, def: val.def, style: !!tree })
        }
    }
    return ptypes
}

