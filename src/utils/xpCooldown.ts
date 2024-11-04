const usersArray: string[] = [];
  
export function add(userId: string) {
    usersArray.push(userId);
}
  
export function remove(userId: string) {
    usersArray.splice(usersArray.indexOf(userId), 1);
}

export function has(userId: string) {
    return usersArray.includes(userId);
}

  