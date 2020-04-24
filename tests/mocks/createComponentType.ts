import { ComponentType } from '../../sources/ComponentType'

export function createComponentType () : ComponentType<any> {
  return {
    instantiate () : any {
      return Math.random()
    },
    copy (origin : any, target : any) : void {
      target.value = origin.value
    },
    clear (instance : any) : void {
      instance.value = Math.random()
    }
  }
}
