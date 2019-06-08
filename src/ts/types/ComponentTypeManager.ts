import { TypeHandler } from './TypeHandler'

export class ComponentTypeManager {
  private _types : Set<TypeHandler>
  private _dependencies : Map<TypeHandler, Set<TypeHandler>>

  public ComponentTypeManager () {
    this._types = new Set<TypeHandler>()
    this._dependencies = new Map<TypeHandler, Set<TypeHandler>>()
  }

  public component (dependencies : TypeHandler[] = []) {
    return (factory : TypeHandler) => {
      this._types.add(factory)

      if (!this._dependencies.has(factory)) {
        this._dependencies.set(factory, new Set<TypeHandler>())
      }

      const dependencySet : Set<TypeHandler> = this._dependencies.get(
        factory
      )

      for (const dependency of dependencies) dependencySet.add(dependency)
    }
  }

  public * dependencies (factory : TypeHandler) {
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
