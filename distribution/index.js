!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("@cedric-demongivert/gl-tool-collection")):"function"==typeof define&&define.amd?define(["@cedric-demongivert/gl-tool-collection"],e):"object"==typeof exports?exports["@cedric-demongivert/gl-tool-ecs"]=e(require("@cedric-demongivert/gl-tool-collection")):t["@cedric-demongivert/gl-tool-ecs"]=e(t["@cedric-demongivert/gl-tool-collection"])}(window,function(t){return function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/",i(i.s=1)}([function(e,i){e.exports=t},function(t,e,i){t.exports=i(2)},function(t,e,i){"use strict";i.r(e);var s,n=i(0);class r{constructor(t=1024,e=256){this._entities=t,this._entitiesByTag=n.Pack.any(e),this._entitiesViewByTag=n.Pack.any(e);for(let i=0;i<e;++i){const e=n.IdentifierSet.allocate(t);this._entitiesByTag.set(i,e),this._entitiesViewByTag.set(i,e.view())}}get entities(){return this._entities}get tags(){return this._entitiesByTag.size}reallocate(t,e){const i=this._entitiesByTag.size;this._entitiesByTag.size=e,this._entitiesViewByTag.size=e;for(let s=0,n=Math.min(i,e);s<n;++s)this._entitiesByTag[s].reallocate(t);for(let s=i;s<e;++s){const e=n.IdentifierSet.allocate(t);this._entitiesByTag.set(s,e),this._entitiesViewByTag.set(s,e.view())}this._entities=t}getEntitiesWithTag(t){return this._entitiesViewByTag.get(t)}attachTagToEntity(t,e){this._entitiesByTag.get(t).add(e)}detachTagFromEntity(t,e){this._entitiesByTag.get(t).delete(e)}detachAllTagsFromEntity(t){for(let e=0,i=this._entitiesByTag.size;e<i;++e)this._entitiesByTag.get(e).delete(t)}detachTagFromItsEntities(t){this._entitiesByTag.get(t).clear()}clear(){for(let t=0,e=this._entitiesByTag.size;t<e;++t)this._entitiesByTag.get(t).clear()}equals(t){if(null==t)return!1;if(t===this)return!0;if(t instanceof r){if(t.tags!==this.tags||t.entities!==this._entities)return!1;for(let e=0,i=this.tags;e<i;++e)if(!t.getEntitiesWithTag(e).equals(this._entitiesByTag[e]))return!1;return!0}return!1}}!function(t){t.create=function(e=1024,i=256){return new t(e,i)},t.copy=function(e){const i=new t(e.entities,e.tags);for(let t=0,s=e.tags;t<s;++t){const s=e.getEntitiesWithTag(t);for(let e=0,n=s.size;e<n;++e)i.attachTagToEntity(t,s.get(e))}return i}}(r||(r={}));class o{constructor(){this.sequence=null,this.index=0}collection(){return this.sequence}hasNext(){return this.sequence&&this.index<this.sequence.size}next(){this.index+=1}forward(t){this.index+=t}end(){this.index=this.sequence?this.sequence.size-1:0}hasPrevious(){return this.sequence&&this.index>0}previous(){this.index-=1}backward(t){this.index-=t}start(){this.index=0}get(){return this.sequence.get(this.index)}move(t){if(!(t instanceof o))throw new Error("Trying to move to a location described by an unsupported type of iterator");this.sequence=t.sequence,this.index=t.index}go(t){this.index=t}copy(t){this.sequence=t.sequence,this.index=t.index}clone(){const t=new o;return t.copy(this),t}equals(t){return null!=t&&(t===this||t instanceof o&&(t.sequence===this.sequence&&t.index===this.index))}}!function(t){t.copy=function(t){return null==t?t:t.clone()}}(s||(s={}));class a{constructor(t,e){this._source=t,this._mapping=e}get size(){return this._source.size}get(t){return this._mapping.get(this._source.get(t))}get last(){return this.size<=0?void 0:this.get(this.size-1)}get lastIndex(){return this.size<=0?0:this.size-1}get first(){return this.size<=0?void 0:this.get(0)}get firstIndex(){return 0}has(t){return this._source.has(this._mapping.get(t))}indexOf(t){throw this._source.indexOf(this._mapping.get(t))}iterator(){const t=new o;return t.sequence=this,t}view(){return this}clone(){return new a(this._source,this._mapping)}*[Symbol.iterator](){for(let t=0,e=this._source.size;t<e;++t)yield this._mapping.get(this._source.get(t))}equals(t){return null!=t&&(t===this||t instanceof a&&(t._mapping===this._mapping&&t._source===this._source))}}class h{constructor(){this.sequence=null,this.index=0}collection(){return this.sequence}hasNext(){return this.sequence&&this.index<this.sequence.size}next(){this.index+=1}forward(t){this.index+=t}end(){this.index=this.sequence?this.sequence.size-1:0}hasPrevious(){return this.sequence&&this.index>0}previous(){this.index-=1}backward(t){this.index-=t}start(){this.index=0}get(){return this.sequence.get(this.index)}move(t){if(!(t instanceof h))throw new Error("Trying to move to a location described by an unsupported type of iterator");this.sequence=t.sequence,this.index=t.index}go(t){this.index=t}copy(t){this.sequence=t.sequence,this.index=t.index}clone(){const t=new h;return t.copy(this),t}equals(t){return null!=t&&(t===this||t instanceof h&&(t.sequence===this.sequence&&t.index===this.index))}}!function(t){(h||(h={})).copy=function(t){return null==t?t:t.clone()}}();class y{constructor(t){this.repository=t}get size(){return this.repository.size}get(t){return this.repository.getNth(t)}get last(){return this.repository.size<=0?void 0:this.repository.getNth(this.repository.size-1)}get lastIndex(){return this.repository.size<=0?0:this.repository.size-1}get first(){return this.repository.size<=0?void 0:this.repository.getNth(0)}get firstIndex(){return 0}has(t){return this.repository.has(t)}indexOf(t){throw this.repository.indexOf(t)}iterator(){const t=new h;return t.sequence=this,t}view(){return this}clone(){return new y(this.repository)}*[Symbol.iterator](){for(let t=0,e=this.repository.size;t<e;++t)yield this.repository.getNth(t)}equals(t){return null!=t&&(t===this||t instanceof y&&t.repository===this.repository)}}class c{constructor(t=2048){this._identifiers=n.IdentifierSet.allocate(t),this._components=n.Pack.any(t),this._types=n.Pack.any(t)}get capacity(){return this._identifiers.capacity}get size(){return this._identifiers.size}reallocate(t){this._components.reallocate(t),this._identifiers.reallocate(t),this._types.reallocate(t)}fit(){this._identifiers.fit(),this._components.reallocate(this._identifiers.capacity),this._types.reallocate(this._identifiers.capacity)}create(t,e){const i=this._identifiers.next(),s=e.instantiate(t,i);return this._components.set(i,s),this._types.set(i,e),s}delete(t){const e="number"==typeof t?t:t.identifier;this._components.set(e,void 0),this._types.set(e,void 0),this._identifiers.delete(e)}getNth(t){return this._components.get(this._identifiers.get(t))}indexOf(t){return this._identifiers.indexOf(t.identifier)}get(t,e){return null==e||this._types.get(t)===e?this._components.get(t):void 0}getType(t){return this._types.get("number"==typeof t?t:t.identifier)}has(t){return this._identifiers.has("number"==typeof t?t:t.identifier)}clone(){const t=new c(this.capacity);for(let e=0,i=this._identifiers.size;e<i;++e){const i=this._identifiers.get(e),s=this._components.get(i),n=this._types.get(i),r=n.instantiate(s.entity,i);n.copy(s,r),t._identifiers.add(i),t._components.set(i,r),t._types.set(i,n)}return t}clear(){for(;this._components.size>0;)this.delete(this._components.get(0))}*[Symbol.iterator](){for(const t of this._identifiers)yield this._components.get(t)}equals(t){if(null==t)return!1;if(t===this)return!0;if(t instanceof c){if(t.size!==this._identifiers.size)return!1;for(let e=0,i=this._identifiers.size;e<i;++e){const i=this._identifiers.get(e);if(!t.has(i)||this._types.get(i)!==t.getType(i)||!this._components.get(i).equals(t.get(i)))return!1}return!0}return!1}}!function(t){t.allocate=function(e=2048){return new t(e)},t.copy=function(t){return null==t?t:t.clone()}}(c||(c={}));class d{constructor(t,e){this._index=n.Pack.uint32(e*t),this._typesByEntity=n.Pack.any(t),this._typesViewByEntity=n.Pack.any(t),this._entitiesByType=n.Pack.any(e),this._entitiesViewByType=n.Pack.any(e);for(let i=0;i<t;++i){const t=n.IdentifierSet.allocate(e);this._typesByEntity.set(i,t),this._typesViewByEntity.set(i,t.view())}for(let i=0;i<e;++i){const e=n.IdentifierSet.allocate(t);this._entitiesByType.set(i,e),this._entitiesViewByType.set(i,e.view())}}get entities(){return this._typesByEntity.size}get types(){return this._entitiesViewByType.size}reallocate(t,e){const i=this._index,s=this._typesByEntity.size,r=Math.min(t,s),o=this._entitiesViewByType.size,a=Math.min(e,o);this._index=n.Pack.uint32(e*t);for(let t=0;t<r;++t)for(let s=0;s<a;++s)this._index.set(t*e+s,i.get(t*o+s));this._typesByEntity.size=t,this._typesViewByEntity.size=t,this._entitiesByType.size=e,this._entitiesViewByType.size=e;for(let t=0;t<r;++t)this._typesByEntity.get(t).reallocate(e);for(let e=0;e<a;++e)this._entitiesByType.get(e).reallocate(t);for(let i=s;i<t;++i){const t=n.IdentifierSet.allocate(e);this._typesByEntity.set(i,t),this._typesViewByEntity.set(i,t.view())}for(let t=o;t<e;++t){const i=n.IdentifierSet.allocate(e);this._entitiesByType.set(t,i),this._entitiesViewByType.set(t,i.view())}}delete(t,e){this._typesByEntity.get(t).delete(e),this._entitiesByType.get(e).delete(t),this._index.set(t*this._entitiesViewByType.size+e,0)}set(t,e,i){this._index.set(t*this._entitiesViewByType.size+e,i),this._typesByEntity.get(t).add(e),this._entitiesByType.get(e).add(t)}get(t,e){return this._typesByEntity.get(t).has(e)?this._index.get(t*this._entitiesViewByType.size+e):void 0}has(t,e){return this._typesByEntity.get(t).has(e)}getTypesOfEntity(t){return this._typesViewByEntity.get(t)}getEntitiesWithType(t){return this._entitiesViewByType.get(t)}clear(){this._index.fill(0);for(let t=0;t<this._typesByEntity.size;++t)this._typesByEntity.get(t).clear();for(let t=0;t<this._entitiesByType.size;++t)this._entitiesByType.get(t).clear()}equals(t){if(null==t)return!1;if(t===this)return!0;if(t instanceof d){const e=t.entities;if(e!==this._typesByEntity.size)return!1;if(t.types!==this._entitiesByType.size)return!1;for(let i=0;i<e;++i){const e=t.getTypesOfEntity(i);if(this.getTypesOfEntity(i).size!==e.size)return!1;for(let s=0,n=e.size;s<n;++s){const n=e.get(s);if(this.get(i,n)!==t.get(i,n))return!1}}return!0}return!1}}!function(t){t.copy=function(e){const i=e.entities,s=new t(i,e.types);for(let t=0;t<i;++t){const i=e.getTypesOfEntity(t);for(let n=0,r=i.size;n<r;++n){const r=i.get(n);s.set(t,r,e.get(t,r))}}return s}}(d||(d={}));class l{constructor(){this.sequence=null,this.index=0}collection(){return this.sequence}hasNext(){return this.sequence&&this.index<this.sequence.size}next(){this.index+=1}forward(t){this.index+=t}end(){this.index=this.sequence?this.sequence.size-1:0}hasPrevious(){return this.sequence&&this.index>0}previous(){this.index-=1}backward(t){this.index-=t}start(){this.index=0}get(){return this.sequence.get(this.index)}move(t){if(!(t instanceof l))throw new Error("Trying to move to a location described by an unsupported type of iterator");this.sequence=t.sequence,this.index=t.index}go(t){this.index=t}copy(t){this.sequence=t.sequence,this.index=t.index}clone(){const t=new l;return t.copy(this),t}equals(t){return null!=t&&(t===this||t instanceof l&&(t.sequence===this.sequence&&t.index===this.index))}}!function(t){t.copy=function(t){return null==t?t:t.clone()}}(l||(l={}));class g{constructor(t){this.mapping=t}get size(){return this.mapping.size}get(t){return this.mapping.getNth(t)}get last(){return this.mapping.size<=0?void 0:this.mapping.getNth(this.mapping.size-1)}get lastIndex(){return this.mapping.size<=0?0:this.mapping.size-1}get first(){return this.mapping.size<=0?void 0:this.mapping.getNth(0)}get firstIndex(){return 0}has(t){return this.mapping.has(t)}indexOf(t){throw this.mapping.indexOf(t)}iterator(){const t=new l;return t.sequence=this,t}view(){return this}clone(){return new g(this.mapping)}*[Symbol.iterator](){for(let t=0,e=this.mapping.size;t<e;++t)yield this.mapping.getNth(t)}equals(t){return null!=t&&(t===this||t instanceof g&&t.mapping===this.mapping)}}class p{constructor(t){this._identifiers=n.IdentifierSet.allocate(t),this._typeByIdentifier=n.Pack.any(t),this._identifierByType=new Map,this.types=new g(this)}get capacity(){return this._identifiers.capacity}get size(){return this._identifiers.size}add(t){const e=this._identifierByType.get(t);if(null==e){const e=this._identifiers.next();return this._typeByIdentifier.set(e,t),this._identifierByType.set(t,e),e}return e}delete(t){if("number"==typeof t){const e=this._typeByIdentifier.get(t);this._identifiers.delete(t),this._typeByIdentifier.set(t,void 0),this._identifierByType.delete(e)}else{const e=this._identifierByType.get(t);this._identifiers.delete(e),this._typeByIdentifier.set(e,void 0),this._identifierByType.delete(t)}}has(t){return"number"==typeof t?this._identifiers.has(t):this._identifierByType.has(t)}getNth(t){return this._typeByIdentifier.get(this._identifiers.get(t))}indexOf(t){return this._identifiers.indexOf(this._identifierByType.get(t))}get(t){return"number"==typeof t?this._typeByIdentifier.get(t):this._identifierByType.get(t)}clear(){this._identifiers.clear(),this._typeByIdentifier.clear(),this._identifierByType.clear()}}class m{constructor(){this._entities=1024,this._tags=16,this._types=256,this._components=4096}build(){return new _(this)}get entities(){return this._entities}set entities(t){this._entities=t}get tags(){return this._tags}set tags(t){this._tags=t}get types(){return this._types}set types(t){this._types=t}get components(){return this._components}set components(t){this._components=t}equals(t){return null!=t&&(t===this||t instanceof m&&(t.entities===this._entities&&t.tags===this._tags&&t.types===this._types&&t.components===this._components))}}class _{constructor(t=new m){this._entities=n.IdentifierSet.allocate(t.entities),this.entities=this._entities.view(),this._tags=n.IdentifierSet.allocate(t.tags),this._relationshipsOfTags=new r(t.entities,t.tags),this.tags=this._tags.view(),this._types=new p(t.types),this.types=this._types.types,this._components=new c(t.components),this._componentsIndex=new d(t.entities,t.types),this.components=new y(this._components),this._systems=n.Pack.any(32),this.systems=this._systems.view(),this._typesByEntity=n.Pack.any(t.entities);for(let e=0;e<t.entities;++e)this._typesByEntity.set(e,new a(this._componentsIndex.getTypesOfEntity(e),this._types));this._capacity=Object.freeze({entities:t.entities,tags:t.tags,components:t.components,types:t.types})}get capacity(){return this._capacity}createEntity(){if(this._entities.capacity===this._entities.size)throw new Error("Unable to create a new entity into this entity-component-system because this entity-component-system can't handle more than "+this._capacity.entities+" entities, please reallocate this entity-component-system in order to augment its inner capacity.");const t=this._entities.get(this._entities.size);return this.willAddEntity(t),this._entities.add(t),this.didAddEntity(t),t}addEntity(t){if(this._entities.has(t))throw new Error("Unable to register the entity #"+t+" into this entity-component-system because the given entity already exists into it.");if(t>=this._capacity.entities)throw new Error("Unable to register the entity #"+t+" into this entity-component-system because the given entity exceed the current entity capacity of this system "+this._capacity.entities+", please reallocate this entity-component-system in order to augment its inner capacity.");this.willAddEntity(t),this._entities.add(t),this.didAddEntity(t)}deleteEntity(t){if(!this._entities.has(t))throw new Error("Unable to delete the entity "+t+" from this entity-component-system because the given entity does not exists into it.");const e=this._componentsIndex.getTypesOfEntity(t);for(;e.size>0;)this.deleteComponentByIdentifier(this._componentsIndex.get(t,e.first));this.detachAllTagsFromEntity(t),this.willDeleteEntity(t),this._entities.delete(t),this.didDeleteEntity(t)}getEntitiesWithTag(t){return this._relationshipsOfTags.getEntitiesWithTag(t)}getEntitiesWithType(t){return this._componentsIndex.getEntitiesWithType(this._types.get(t))}clearEntities(){const t=this._entities;for(;t.size>0;)this.deleteEntity(t.get(0))}willAddEntity(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillAddEntity(t)}didAddEntity(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidAddEntity(t)}willDeleteEntity(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillDeleteEntity(t)}didDeleteEntity(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidDeleteEntity(t)}createTag(){if(this._tags.capacity===this._tags.size)throw new Error("Unable to create a new tag because this entity-component-system can't handle more than "+this._capacity.tags+" tags, please reallocate  this entity-component-system in order to augment is inner capacity.");const t=this._tags.get(this._tags.size);return this.willAddTag(t),this._tags.add(t),this.didAddTag(t),t}addTag(t){if(this._tags.has(t))throw new Error("Unable to add the tag #"+t+" to this entity-component-system because the given tag already exists into it.");if(t>=this._capacity.tags)throw new Error("Unable to add the tag #"+t+" to this entity-component-system because the given tag exceed its inner capacity of "+this._capacity.tags+" tags, please reallocate this entity-component-system in order to augment is inner capacity.");this.willAddTag(t),this._tags.add(t),this.didAddTag(t)}deleteTag(t){if(!this._tags.has(t))throw new Error("Unable to delete the tag #"+t+" from this entity-component-system because the given tag does not exists into it.");this.detachTagFromItsEntities(t),this.willDeleteTag(t),this._tags.delete(t),this.didDeleteTag(t)}attachTagToEntity(t,e){if(!this._tags.has(t))throw new Error("Unable to attach the tag #"+t+" to entity #"+e+" because the given tag does not exists into this entity-component-system.");if(!this._entities.has(e))throw new Error("Unable to attach the tag #"+t+" to entity #"+e+" because the given entity does not exists into this entity-component-system.");if(this._relationshipsOfTags.getEntitiesWithTag(t).has(e))throw new Error("Unable to attach the tag #"+t+" to entity #"+e+" because the given tag is already attached to the given entity.");this.willAttachTagToEntity(t,e),this._relationshipsOfTags.attachTagToEntity(t,e),this.didAttachTagToEntity(t,e)}detachTagFromEntity(t,e){if(!this._tags.has(t))throw new Error("Unable to detach the tag #"+t+" from entity #"+e+" because the given tag does not exists into this entity-component-system.");if(!this._entities.has(e))throw new Error("Unable to detach the tag #"+t+" from entity #"+e+" because the given entity does not exists into this entity-component-system.");if(!this._relationshipsOfTags.getEntitiesWithTag(t).has(e))throw new Error("Unable to detach the tag #"+t+" to entity #"+e+" because the given tag is not attached to the given entity.");this.willDetachTagFromEntity(t,e),this._relationshipsOfTags.detachTagFromEntity(t,e),this.didDetachTagFromEntity(t,e)}detachAllTagsFromEntity(t){if(!this._entities.has(t))throw new Error("Unable to detach all tags of entity #"+t+" because the given entity does not exists into this entity-component-system.");const e=this._tags;for(let i=0,s=e.size;i<s;++i){const s=e.get(i);this._relationshipsOfTags.getEntitiesWithTag(s).has(t)&&(this.willDetachTagFromEntity(s,t),this._relationshipsOfTags.detachTagFromEntity(s,t),this.didDetachTagFromEntity(s,t))}}detachTagFromItsEntities(t){if(!this._tags.has(t))throw new Error("Unable to detach the tag #"+t+" from its entities because the given tag does not exists into this entity-component-system.");const e=this._relationshipsOfTags.getEntitiesWithTag(t);for(;e.size>0;){const i=e.get(0);this.willDetachTagFromEntity(t,i),this._relationshipsOfTags.detachTagFromEntity(t,i),this.didDetachTagFromEntity(t,i)}}clearTags(){const t=this._tags;for(;t.size>0;)this.deleteTag(t.get(0))}willAddTag(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillAddTag(t)}didAddTag(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidAddTag(t)}willDeleteTag(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillDeleteTag(t)}didDeleteTag(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidDeleteTag(t)}willAttachTagToEntity(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerWillAttachTagToEntity(t,e)}didAttachTagToEntity(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerDidAttachTagToEntity(t,e)}willDetachTagFromEntity(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerWillDetachTagFromEntity(t,e)}didDetachTagFromEntity(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerDidDetachTagFromEntity(t,e)}addType(t){if(this._types.has(t))throw new Error("Unable to register the type "+t+" because the given type already exists.");if(this._types.size===this._types.capacity)throw new Error("Unable to register the type "+t+" because it will exceed the type capacity of this entity-component-system that is of "+this._types.capacity+", please reallocate this entity-component-system in order to expand its inner capacity.");this.willAddType(t),this._types.add(t),this.didAddType(t)}deleteType(t){if(!this._types.has(t))throw new Error("Unable to delete the type "+t+" because the given type does not exists into this entity-component-system.");const e=this._types.get(t),i=this._componentsIndex.getEntitiesWithType(e);for(;i.size>0;)this.deleteComponentByIdentifier(this._componentsIndex.get(i.first,e));this.willDeleteType(t),this._types.delete(t),this.didDeleteType(t)}clearTypes(){const t=this.types;for(;t.size>0;)this.deleteType(t.get(0))}getTypesOfEntity(t){return this._typesByEntity.get(t)}willAddType(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillAddType(t)}didAddType(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidAddType(t)}willDeleteType(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillDeleteType(t)}didDeleteType(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidDeleteType(t)}createComponent(t,e){if(!this._entities.has(t))throw new Error("Unable to create a component of type "+e+" on entity #"+t+" because the given entity does not exists into this entity-component-system.");if(!this._types.has(e))throw new Error("Unable to create a component of type "+e+" on entity #"+t+" because the handler does not have a type assigned to it.");const i=this._types.get(e);if(this._componentsIndex.has(t,i))throw new Error("Unable to create a component of type "+e+" on entity #"+t+" because a component of the given type is already assigned to the given entity.");if(this._components.size===this._components.capacity)throw new Error("Unable to create a component of type "+e+" on entity #"+t+" because it will exceed the component capacity of "+this._components.capacity+" of this entity-component-system, please reallocate this entity-component-system in order to expand its component capacity.");this.willAddComponent(t,e);const s=this._components.create(t,e);return this._componentsIndex.set(t,i,s.identifier),this.didAddComponent(s,e),s}getTypeOfComponent(t){return this._components.getType(t)}getComponent(t,e){return this._components.get(t,e)}getComponentOfEntity(t,e){return this._components.get(this._componentsIndex.get(t,this._types.get(e)),e)}hasComponent(t,e){return this._componentsIndex.has(t,this._types.get(e))}deleteComponent(t,e){if(!this._entities.has(t))throw new Error("Unable to delete component of type "+e+" from entity #"+t+" because the given entity does not exists into this entity-component-system.");if(!this._types.has(e))throw new Error("Unable to delete component of type "+e+" from entity #"+t+" because the handler is not attached to a type of this entity-component-system.");const i=this._types.get(e);if(!this._componentsIndex.has(t,i))throw new Error("Unable to delete component of type "+e+" from entity #"+t+" because the given component does not exists in this entity-component-system.");const s=this._components.get(this._componentsIndex.get(t,i));this.willDeleteComponent(s,e),this._componentsIndex.delete(t,i),this._components.delete(s.identifier),this.didDeleteComponent(s,e)}deleteComponentByIdentifier(t){if(!this._components.has(t))throw new Error("Unable to delete the component #"+t+" because the given component does not exists into this entity-component-system.");const e=this._components.get(t),i=this._components.getType(t);this.willDeleteComponent(e,i),this._componentsIndex.delete(e.entity,this._types.get(i)),this._components.delete(t),this.didDeleteComponent(e,i)}clearComponents(){const t=this.components;for(;t.size>0;)this.deleteComponentByIdentifier(t.get(0).identifier)}willAddComponent(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerWillAddComponent(t,e)}didAddComponent(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerDidAddComponent(t,e)}willDeleteComponent(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerWillDeleteComponent(t,e)}didDeleteComponent(t,e){for(let i=0,s=this._systems.size;i<s;++i)this._systems.get(i).managerDidDeleteComponent(t,e)}addSystem(t){if(this._systems.indexOf(t)>=0)throw new Error("Unable to add the system instance "+t+" to this entity-component-system because the given system was already added to it.");this._systems.push(t),t.attach(this),t.initialize()}requireSystem(t){const e=this.firstSystem(t);if(null==e)throw new Error("No system of type "+t.name+" found in this entity-component system.");return e}firstSystem(t){for(let e=0,i=this._systems.size;e<i;++e){const i=this._systems.get(e);if(i instanceof t)return i}return null}deleteSystem(t){const e=this._systems.indexOf(t);if(e<0)throw new Error("Unable to delete the system instance "+t+" from this entity-component-system because the given system does not exists.");t.destroy(),this._systems.delete(e),t.detach()}hasSystem(t){return this._systems.indexOf(t)>=0}update(t){for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerWillUpdate(t);for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).update(t);for(let e=0,i=this._systems.size;e<i;++e)this._systems.get(e).managerDidUpdate(t)}clearSystems(){const t=this._systems;for(;t.size>0;){const e=t.last;e.destroy(),this._systems.pop(),e.detach()}}clear(){this.clearSystems(),this.clearComponents(),this.clearTypes(),this.clearEntities(),this.clearTags()}}class u{constructor(){this._manager=null}get manager(){return this._manager}initialize(){}managerWillAddEntity(t){}managerDidAddEntity(t){}managerWillDeleteEntity(t){}managerDidDeleteEntity(t){}managerWillAddTag(t){}managerDidAddTag(t){}managerWillDeleteTag(t){}managerDidDeleteTag(t){}managerWillAttachTagToEntity(t,e){}managerDidAttachTagToEntity(t,e){}managerWillDetachTagFromEntity(t,e){}managerDidDetachTagFromEntity(t,e){}managerWillAddType(t){}managerDidAddType(t){}managerWillDeleteType(t){}managerDidDeleteType(t){}managerWillAddComponent(t,e){}managerDidAddComponent(t,e){}managerWillDeleteComponent(t,e){}managerDidDeleteComponent(t,e){}managerWillUpdate(t){}update(t){}managerDidUpdate(t){}destroy(){}attach(t){this._manager!==t&&(this._manager&&this.detach(),this._manager=t,this._manager.hasSystem(this)||this._manager.addSystem(this))}detach(){if(null!=this._manager&&this._manager.hasSystem(this)){const t=this._manager;this._manager=null,t.hasSystem(this)&&t.deleteSystem(this)}}}class f{constructor(t,e){this._identifier=null==e?t.createEntity():e,this._manager=t,this._manager.entities.has(e)||this._manager.addEntity(e)}get identifier(){return this._identifier}get manager(){return this._manager}get types(){return this._manager.getTypesOfEntity(this._identifier)}hasTag(t){return this._manager.getEntitiesWithTag(t).has(this._identifier)}addTag(t){this._manager.attachTagToEntity(t,this._identifier)}deleteTag(t){this._manager.detachTagFromEntity(t,this._identifier)}clearTags(){this._manager.detachAllTagsFromEntity(this._identifier)}hasComponent(t){return this._manager.hasComponent(this._identifier,t)}getComponent(t){return this._manager.getComponentOfEntity(this._identifier,t)}createComponent(t){return this._manager.createComponent(this._identifier,t)}deleteComponent(t){this._manager.deleteComponent(this._identifier,t)}equals(t){return null!=t&&(t==this||t instanceof f&&(t.identifier===this._identifier&&t.manager===this._manager))}toString(){return`MetaEntity ${this._identifier}`}}i.d(e,"EntityComponentSystem",function(){return _}),i.d(e,"System",function(){return u}),i.d(e,"EntityComponentSystemBuilder",function(){return m}),i.d(e,"MetaEntity",function(){return f})}])});