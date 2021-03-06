import { Request, Response, NextFunction } from 'express';
const AMN_STORE_CONST = 'amnrequeststore';
interface IStoreAccess {
    name: string;
    strict?: boolean;
}

declare interface AmnStoreRequest {
    store: Map<string, any>;
}

declare global {
    namespace Express {
        interface Request {
            [AMN_STORE_CONST]?: AmnStoreRequest;
        }
    }
}

const _checkSymbol = (object: Request | Response, name: string) => {
    const arr = Object.getOwnPropertyNames(object);
    return arr.indexOf(name) > -1;
};

const init = (req: Request, res: Response, next: NextFunction) => {
    if (_checkSymbol(req, AMN_STORE_CONST)) {
        delete req[AMN_STORE_CONST];
    }
    req[AMN_STORE_CONST] = {
        store: new Map(),
    };
    next();
};

/**
 * Store a JSON object into amn request
 * @param {object} req request object from express connect middleware
 * @param {string} name string name of a reference
 * @param {object} payload a JSON object to store
 */

const push = (
    req: Request,
    { name, payload }: { name: string; payload: any }
): void => {
    req[AMN_STORE_CONST]?.store.set(name, payload);
};

/**
 * get specific data object from req.amnin.data[object_name]
 *
 * @param {object} req request object from express connect middleware
 * @param {string} name object name
 * @param {boolean} strict strict mode, if object not found, raise an exception
 */

const pull = <T>(
    req: Request,
    { name, strict = true }: IStoreAccess
): undefined | T => {
    const isExists = req[AMN_STORE_CONST]?.store.has(name);
    if (strict && !isExists) {
        throw new Error(`AMN Store: key ${name} is not found in the store.`);
    }
    return !isExists ? undefined : (req[AMN_STORE_CONST]?.store.get(name) as T);
};

/**
 * get specific data object from req.amnin.data[object_name]
 * after data removes from store
 *
 * @param {object} req request object from express connect middleware
 * @param {string} name object name
 * @param {boolean} strict strict mode, if object not found, raise an exception
 */

const pop = <T>(
    req: Request,
    { name, strict = true }: IStoreAccess
): undefined | T => {
    const isExists = req[AMN_STORE_CONST]?.store.has(name);
    if (strict && !isExists) {
        throw new Error(`AMN Store: key ${name} is not found in the store.`);
    }
    const obj = req[AMN_STORE_CONST]?.store.get(name) as T;
    req[AMN_STORE_CONST]?.store.delete(name);
    return !isExists ? undefined : obj;
};

export default { init, push, pull, pop };
export { init, push, pull, pop };

// const pop = (
//     req: Request,
//     { name, strict = true }: IStoreAccess
// ): undefined | any => {
//     const isExists = req[AMN_STORE_CONST]?.store.has(name);
//     if (strict && !isExists) {
//         throw new Error(`AMN Store: key ${name} is not found in the store.`);
//     }
//     const obj = req[AMN_STORE_CONST]?.store.get(name);
//     req[AMN_STORE_CONST]?.store.delete(name);
//     return !isExists ? undefined : obj;
// };

// const pull = (
//     req: Request,
//     { name, strict = true }: IStoreAccess
// ): undefined | object => {
//     const isExists = req[AMN_STORE_CONST]?.store.has(name);
//     if (strict && !isExists) {
//         throw new Error(`AMN Store: key ${name} is not found in the store.`);
//     }
//     return !isExists ? undefined : req[AMN_STORE_CONST]?.store.get(name);
// };
