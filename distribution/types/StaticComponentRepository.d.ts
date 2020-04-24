import { Entity } from './Entity';
import { ComponentType } from './ComponentType';
import { Component } from './Component';
import { ComponentRepository } from './ComponentRepository';
export declare class StaticComponentRepository implements ComponentRepository {
    private _identifiers;
    private _components;
    /**
    * Create a new empty static component repository with a given capacity.
    *
    * @param [capacity = 2048] - Number of component to store.
    */
    constructor(capacity?: number);
    /**
    * @return The number of component that this repository can store.
    */
    readonly capacity: number;
    /**
    * @see ComponentRepository.size
    */
    readonly size: number;
    /**
    * Update the capacity of this component repository.
    *
    * @param capacity - The new number of component that this repository can store.
    */
    reallocate(capacity: number): void;
    /**
    * Fit this repository allocated memory to its content.
    */
    fit(): void;
    /**
    * @see ComponentRepository.create
    */
    create<Type>(entity: Entity, type: ComponentType<Type>): Component<Type>;
    /**
    * @see ComponentRepository.delete
    */
    delete(identifier: number): void;
    delete(component: Component<any>): void;
    /**
    * @see ComponentRepository.getNth
    */
    getNth(index: number): Component<any>;
    /**
    * @see ComponentRepository.indexOf
    */
    indexOf(component: Component<any>): number;
    /**
    * @see ComponentRepository.get
    */
    get(identifier: number): Component<any>;
    get<Type>(identifier: number, type: ComponentType<Type>): Component<Type>;
    /**
    * @see ComponentRepository.has
    */
    has(identifier: number): boolean;
    has(component: Component<any>): boolean;
    clone(): StaticComponentRepository;
    /**
    * @see ComponentRepository.clear
    */
    clear(): void;
    /**
    * @see Collection.iterator
    */
    [Symbol.iterator](): Iterator<Component<any>>;
    /**
    * @see Collection.equals
    */
    equals(other: any): boolean;
}
export declare namespace StaticComponentRepository {
    /**
    * Create a new empty static component repository with a given capacity.
    *
    * @param [capacity = 2048] - Number of component to store.
    *
    * @return The new empty static component repository.
    */
    function allocate(capacity?: number): StaticComponentRepository;
    /**
    * Copy an existing static component repository.
    *
    * @param toCopy - A static component repository to copy.
    *
    * @return A new repository that is a copy of the given one.
    */
    function copy(toCopy: StaticComponentRepository): StaticComponentRepository;
}
