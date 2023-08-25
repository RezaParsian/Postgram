import {web} from "../../router/web";
import {NextFunction, Request} from "express";

type options = {
    chain: (req: Request, res: Response, next: NextFunction) => void[],
}

export function Get(route: string, options?: options) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.get(route, descriptor.value);
    }
}

export function Post(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.post(route, descriptor.value);
    }
}

export function Put(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.put(route, descriptor.value);
    }
}

export function Delete(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.delete(route, descriptor.value);
    }
}

export function Patch(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.patch(route, descriptor.value);
    }
}

export function Options(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.options(route, descriptor.value);
    }
}

export function Head(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.head(route, descriptor.value);
    }
}

export function All(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        web.all(route, descriptor.value);
    }
}