import { ILayout } from "../components/Settings";
import { Module } from "./Module";


export class AppClass {
    name: string = ''
    modules: Module[] = []
    spaces: ILayout[] = []
    constructor(name: string, modules: Module[], spaces: ILayout[]) {
        this.name = name;
        this.modules = modules
        this.spaces = spaces
    }
    getModules() {
        return this.modules
    }
    static copy(app: AppClass) {
        return new AppClass(app.name, [...app.modules.map(m => Module.copy(m))], app.spaces)
    }
}