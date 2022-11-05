// deepcopy an object
function dc(object) {
    return JSON.parse(JSON.stringify(object));
}