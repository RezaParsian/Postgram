export module ColorConsole {

    export function danger(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[31m%s\x1b[0m`, msg);
    }

    export function success(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[32m%s\x1b[0m`, msg);
    }

    export function warning(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[33m%s\x1b[0m`, msg);
    }

    export function primary(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[34m%s\x1b[0m`, msg);
    }

    export function love(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[35m%s\x1b[0m`, msg);
    }

    export function info(msg: any) {
        console.log(`[${new Date().toLocaleString()}]: \x1b[36m%s\x1b[0m`, msg);
    }
}