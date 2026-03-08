import { ipcMain, ipcRenderer } from 'electron'

const instances = new Map<string, any>()
const exposedMethods = new Map<string, { instance: any; descriptor: PropertyDescriptor }>()

export function expose(className?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    // 如果提供了类名，使用提供的类名；否则使用 target.constructor.name
    const actualClassName = className || target.constructor.name
    const channel = `${actualClassName.toLowerCase()}:${propertyKey}`
    
    exposedMethods.set(channel, { instance: null, descriptor })
    
    return descriptor
  }
}

export function registerInstance<T>(instance: T, className: string): void {
  instances.set(className, instance)
  
  exposedMethods.forEach(({ descriptor }, channel) => {
    if (channel.startsWith(className.toLowerCase() + ':')) {
      if (typeof ipcMain !== 'undefined') {
        ipcMain.handle(channel, async (_, ...args: any[]) => {
          return descriptor.value.apply(instance, args)
        })
      }
    }
  })
}

export type ExposedMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? T[K] : never
}

export function createProxy<T extends object>(className: string, methods: (keyof T)[]): ExposedMethods<T> {
  const proxy: any = {}
  const classNameLower = className.toLowerCase()
  
  methods.forEach(methodName => {
    const channel = `${classNameLower}:${String(methodName)}`
    proxy[methodName] = (...args: any[]) => ipcRenderer.invoke(channel, ...args)
  })
  
  return proxy as ExposedMethods<T>
}
