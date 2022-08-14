
import { Comp, Module } from '../models/Module'
const Display = () => {
    const module = new Module()
    const comp2 = new Comp('div', { style: { color: 'yellow', width: 200, height: 300, background: 'green' } }, ['ok'])
    module.addComp(new Comp('div', {style:{ color: 'blue',display:'flex' }}, ['one', comp2]))

    module.setRoot(0)
    return (
        <div>
            {module.drawUi()}
        </div>
    )
}

export default Display