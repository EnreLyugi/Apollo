"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.remove = remove;
exports.has = has;
const usersArray = [];
function add(userId) {
    usersArray.push(userId);
}
function remove(userId) {
    usersArray.splice(usersArray.indexOf(userId), 1);
}
function has(userId) {
    return usersArray.includes(userId);
}
