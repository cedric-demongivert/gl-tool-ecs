import { TypeHandler } from '../../src/ts/types/TypeHandler'

export function createTypeHandler () : TypeHandler {
  return {
    instanciate () : any {
      return new Array<any>()
    },
    copy (origin : any, target : any) : void {
      target.length = origin.length
      for (let index = 0; index < origin.length; ++index) {
        target[index] = origin[index]
      }
    },
    reset (instance : any) : void {
      instance.length = 0
    }
  }
}
