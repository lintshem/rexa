import { Module } from "./Module";


export class AppClass {
    name: string = ''
    modules: Module[] = []
    constructor(name: string, modules: Module[]) {
        this.name = name;
        this.modules = modules
    }
    getModules() {
        return this.modules
    }
    static copy(app: AppClass) {
        return new AppClass(app.name, [...app.modules])
    }
}