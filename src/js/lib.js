export function strToConsole(str) {
    console.log(str);
}

export function divide(one, two) {
    return one / two;
}

export class User {
    constructor(name) {
        this.name = name;
    }

    sayName(){
        return this.name;
    }
}