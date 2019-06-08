import { ComponentHandler } from './ComponentHandler'

export class ComponentTypeManager {
  private _types : Set<ComponentHandler>
  private _dependencies : Map<ComponentHandler, Set<ComponentHandler>>

  public ComponentTypeManager () {
    this._types = new Set<ComponentHandler>()
    this._dependencies = new Map<ComponentHandler, Set<ComponentHandler>>()
  }

  public component (dependencies : ComponentHandler[] = []) {
    return (factory : ComponentHandler) => {
      this._types.add(factory)

      if (!this._dependencies.has(factory)) {
        this._dependencies.set(factory, new Set<ComponentHandler>())
      }

      const dependencySet : Set<ComponentHandler> = this._dependencies.get(
        factory
      )

      for (const dependency of dependencies) dependencySet.add(dependency)
    }
  }

  public * dependencies (factory : ComponentHandler) {
    yield * this._dependencies.get(factory)
  }

  public * types () {
    yield * this._types
  }

  public clear () : void {
    this._types.clear()
    this._dependencies.clear()
  }
}
