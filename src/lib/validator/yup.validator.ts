import {Validator} from "objection";

export class YupValidator extends Validator{
    constructor( private schema ) {
        super();
    }

    private readonly options = {
        strict: false,
        abortEarly: true,
        stripUnknown: true,
        recursive: true,
    };

    validate( json ) {
        if ( typeof json.json !== "undefined" ) {
            return this.schema.validateSync( json.json, this.options );
        }
    }
}

export const YupOptions = {
    strict: false,
    abortEarly: false,
    stripUnknown:  true,
    recursive: true,
}