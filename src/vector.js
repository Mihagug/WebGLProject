function Vector(x, y, z) {
    this.arrayRep = [x || 0, y || 0, z || 0];
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.len = Math.sqrt(x*x + y*y + z*z);
}

function dot(vec1, vec2) {
    return (vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z);
}

function normalize(vec) {
    return new Vector(vec.x / vec.len, vec.y / vec.len, vec.z / vec.len);
}

function cross(vec1, vec2) {
    return new Vector(vec1.y * vec2.z - vec1.z * vec2.y, vec2.x * vec1.z - vec2.z * vec1.x, vec1.x * vec2.y - vec1.y * vec2.x);
}

function subVectors(vec1, vec2) {
    return new Vector(vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z);
}

function addVectors(vec1, vec2) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z);
}

function scaleVector(sFactor, vec) {
    return new Vector(vec.x * sFactor, vec.y * sFactor, vec.z * sFactor);
}

