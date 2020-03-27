import { Entity } from './Entity';
export interface Component {
    /**
    * Identifier of this component if any.
    */
    readonly identifier: number;
    /**
    * Identifier of this component if any.
    */
    readonly entity: Entity;
    /**
    * @see Object.equals
    */
    equals(other: any): boolean;
}
