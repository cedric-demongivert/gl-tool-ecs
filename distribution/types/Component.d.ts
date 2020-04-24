import { ComponentType } from './ComponentType';
import { Entity } from './Entity';
export declare class Component<Data> {
    /**
    * Identifier of this component.
    */
    readonly identifier: number;
    /**
    * Identifier of this component entity.
    */
    readonly entity: Entity;
    /**
    * Type of this component.
    */
    readonly type: ComponentType<Data>;
    /**
    * Data stored into this component.
    */
    data: Data;
    /**
    * Instantiate a new component object.
    *
    * @param entity - Entity of the component to instantiate.
    * @param type - Type of component to instantiate.
    * @param identifier - Unique number associated to this new component.
    */
    constructor(entity: Entity, type: ComponentType<Data>, identifier: number);
    /**
    * @see Object.equals
    */
    equals(other: any): boolean;
}
