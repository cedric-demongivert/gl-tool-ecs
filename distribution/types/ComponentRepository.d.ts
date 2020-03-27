import { Component } from './Component';
import { ComponentType } from './ComponentType';
export interface ComponentRepository {
    /**
    * @return The number of component stored into this repository.
    */
    readonly size: number;
    /**
    * Create a component of the given type into this repository.
    *
    * @param entity - The parent entity of the component to create.
    * @param type - The type of component to create.
    *
    * @return The new component instance.
    */
    create<Type extends Component>(entity: number, type: ComponentType<Type>): Type;
    /**
    * Remove the component with the given identifier from this collection.
    *
    * @param identifier - Identifier of the component to delete.
    */
    delete(identifier: number): void;
    /**
    * Remove the given component from this collection.
    *
    * @param component - The component to delete.
    */
    delete(component: Component): void;
    /**
    * Get the component at the given index.
    *
    * @param index - The identifier of a component to get.
    *
    * @return The component at the given index.
    */
    getNth(index: number): Component;
    /**
    * Return the index of the given component in the sequence described by this repository.
    *
    * @param component - A component to search.
    *
    * @return The index of the given component in the sequence described by this repository.
    */
    indexOf(component: Component): number;
    /**
    * Get a component by using it's identifier.
    *
    * @param identifier - The identifier of a component to get.
    *
    * @return The component with the given identifier.
    */
    get(identifier: number): Component;
    /**
    * Get a component of the given type by using it's identifier.
    *
    * @param identifier - The identifier of a component to get.
    * @param type - Expected type of the component to get.
    *
    * @return The component of the given type with the given identifier.
    */
    get<Type extends Component>(identifier: number, type: ComponentType<Type>): Type;
    /**
    * Return true if the given component exists into this repository.
    *
    * @param component - A component to search for.
    *
    * @return True if the given component exists into this repository.
    */
    has(component: Component): boolean;
    /**
    * Return true if a component with the given identifier exists into this repository.
    *
    * @param identifier - Identifier of a component to search.
    *
    * @return True if a component with the given identifier exists into this repository.
    */
    has(identifier: number): boolean;
    /**
    * Return the type of the component with the given identifier.
    *
    * @param identifier - Identifier of the component to search for.
    *
    * @return The type of the given component.
    */
    getType(identifier: number): ComponentType<any>;
    /**
    * Return the type of the given component.
    *
    * @param component - The component to search for.
    *
    * @return The type of the given component.
    */
    getType<Type extends Component>(component: Type): ComponentType<Type>;
    /**
    * Empty this component repository.
    */
    clear(): void;
}
