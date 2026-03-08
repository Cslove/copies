import { ipcMain, ipcRenderer } from 'electron'

const instances = new Map<string, any>()

export function expose() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const className = target.constructor.name
    const channel = `${className.toLowerCase()}:${propertyKey}`
    
    if (typeof ipcMain !== 'undefined') {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        const instance = instances.get(className)
        if (!instance) {
          throw new Error(`Instance not found for ${className}`)
        }
        return descriptor.value.apply(instance, args)
      })
    }
    
    ;(descriptor.value as any).channel = channel
    return descriptor
  }
}

export function registerInstance<T>(instance: T, className: string): void {
  instances.set(className, instance)
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
