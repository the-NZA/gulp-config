import {strToConsole, divide, User} from './lib';

strToConsole('Hello World!');
console.log(divide(4, 2));

const anon = new User('Anon');
console.log(anon.sayName());
