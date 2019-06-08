import { System } from '../../src/ts/systems/System'


export function createSystem () : System {
  const system : System = new System()

  system.initialize = jest.fn()
  system.managerWillAddEntity = jest.fn((entity : number) => { })
  system.managerDidAddEntity = jest.fn((entity : number) => { })
  system.managerWillDeleteEntity = jest.fn((entity : number) => { })
  system.managerDidDeleteEntity = jest.fn((entity : number) => { })
  system.managerWillAddTag = jest.fn((tag : number) => { })
  system.managerDidAddTag = jest.fn((tag : number) => { })
  system.managerWillDeleteTag = jest.fn((tag : number) => { })
  system.managerDidDeleteTag = jest.fn((tag : number) => { })
  system.managerWillAttachTagToEntity = jest.fn(
    (tag : number, entity : number) => { }
  )
  system.managerDidAttachTagToEntity = jest.fn(
    (tag : number, entity : number) => { }
  )
  system.managerWillDetachTagFromEntity = jest.fn(
    (tag : number, entity : number) => { }
  )
  system.managerDidDetachTagFromEntity = jest.fn(
    (tag : number, entity : number) => { }
  )
  system.managerWillAddType = jest.fn((type : number) => { })
  system.managerDidAddType = jest.fn((type : number) => { })
  system.managerWillDeleteType = jest.fn((type : number) => { })
  system.managerDidDeleteType = jest.fn((type : number) => { })
  system.managerWillAddComponent = jest.fn((
    component : number,
    entity : number,
    type : number
  ) => { })
  system.managerDidAddComponent = jest.fn((component : number) => { })
  system.managerDidAddComponent = jest.fn((component : any) => { })
  system.managerWillDeleteComponent = jest.fn((component : any) => { })
  system.managerDidDeleteComponent = jest.fn((
    component : any,
    entity : number,
    type : number
  ) => { })
  system.managerWillUpdate = jest.fn((delta : number) => { })
  system.update = jest.fn((delta : number) => { })
  system.managerDidUpdate = jest.fn((delta : number) => { })
  system.destroy = jest.fn(() => { })

  return system
}
