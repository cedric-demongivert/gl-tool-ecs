import { ComponentType } from '../../sources/ComponentType'

export function createComponentType () : ComponentType<any> {
  return {
    instantiate (entity : number, identifier : number) : any {
      return {
        entity,
        identifier,
        value: Math.random()
      }
    },
    copy (origin : any, target : any) : void {
      target.value = origin.value
    },
    clear (instance : any) : void {
      instance.value = Math.random()
    }
  }
}
