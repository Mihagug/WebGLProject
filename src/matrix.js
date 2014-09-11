function Matrix(elements) {
    this.array = [];
    
    if (typeof elements == 'object' && elements.length == 16) {
        for (var i = 0; i < elements.length; i++)
            this.array[i] = elements[i];
    } else if (typeof elements == 'number') {
        for (var i = 0; i < 16; i++) {
            if (!(i % 5))
                this.array[i] = elements;
            else
                this.array[i] = 0.0;
        }
    } else {
        for (var i = 0; i < 16; i++) {
            if (!(i % 5))
                this.array[i] = 1.0;
            else
                this.array[i] = 0.0;
        }
    }
}

Matrix.prototype = {
    len: function() {
        return 4;
    },
    setIdentity: function() {
        for (var i = 0; i < 16; i++) {
            if (!(i % 5))
                this.array[i] = 1.0;
            else
                this.array[i] = 0.0;
        }
    },
    toString: function() {
        return  "[ " + this.array[0] + "," + this.array[1] + "," + this.array[2] + "," + this.array[3] + "] <br />" +
                "[ " + this.array[4] + "," + this.array[5] + "," + this.array[6] + "," + this.array[7] + "] <br />" +
                "[ " + this.array[8] + "," + this.array[9] + "," + this.array[10] + "," + this.array[11] + "] <br />" +
                "[ " + this.array[12] + "," + this.array[13] + "," + this.array[14] + "," + this.array[15] + "]. <br />";
    }
};

function transpose(mat) {
    var res = new Matrix(mat.array);
    
    for (var i = 0; i < mat.len(); i++) {
        for (var j = i; j < mat.len(); j++) {
            if (i != j) {
                var temp = res.array[i * mat.len() + j];
                res.array[i * mat.len() + j] = res.array[j * mat.len() + i];
                res.array[j * mat.len() + i] = temp;
            }
        }
    }
    
    return res;
}

function multiplyMM(mat1, mat2) {
    var len = mat1.len();
    var sum = 0.0;
    var res = [];
    
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            for (var k = 0; k < len; k++) 
                sum += mat1.array[i * len + k] * mat2.array[k * len + j];
            res[i * len + j] = sum;
            sum = 0.0;
        }
    }
    
    return new Matrix(res);
}

function addMatrices(mat1, mat2) {
    var res = new Matrix(1.0);
    
    for (var i = 0; i < mat1.len(); i++) {
        res.array[i] = mat1.array[i] + mat2.array[i];
    }
    
    return res;
}

function subMatrices(mat1, mat2) {
    var res = new Matrix(1.0);
    
    for (var i = 0; i < mat1.len(); i++) {
        res.array[i] = mat1.array[i] - mat2.array[i];
    }
    
    return res;
}

function translate(mat, vec) {
    var temp = new Matrix(1.0);
    temp.array[3] = vec.x;
    temp.array[7] = vec.y;
    temp.array[11] = vec.z;
    
    return multiplyMM(temp, mat);
}

function rotate(mat, angle, vec) {
    var     c = Math.cos(angle),
            s = Math.sin(angle),
            t = 1.0 - c;
    var     temp = new Matrix(1.0);
    var     x = vec.x, y = vec.y, z = vec.z;
    
    temp.array[0] = c + x*x*t; temp.array[1] = x*y*t - z*s; temp.array[2] = x*z*t + y*s; temp.array[3] = 0.0;
    temp.array[4] = x*y*t + z*s; temp.array[5] = c + y*y*t; temp.array[6] = y*z*t - x*s; temp.array[7] = 0.0;
    temp.array[8] = z*x*t - y*s; temp.array[9] = z*y*t + x*s; temp.array[10] = c + z*z*t; temp.array[11] = 0.0;
    temp.array[12] = 0.0; temp.array[13] = 0.0; temp.array[14] = 0.0; temp.array[15] = 1.0;
    
    return multiplyMM(temp, mat);
}

function matrixFromQuaternion(quaternion) {
    var     l1 = quaternion.l1,
            l2 = quaternion.l2,
            l3 = quaternion.l3,
            l4 = quaternion.l4;
    var     temp = new Matrix(1.0);
    
    temp.array[0] = 1 - 2*(l2*l2+l3*l3); temp.array[1] = 2*(l1*l2-l0*l3); temp.array[2] = 2*(l1*l3+l0*l2);  temp.array[3] = 0.0;
    temp.array[4] = 2*(l1*l2+l0*l3); temp.array[5] = 1 - 2*(l1*l1+l3*l3); temp.array[6] = 2*(l2*l3+l0*l1);  temp.array[7] = 0.0;
    temp.array[8] = 2*(l1*l3-l0*l2); temp.array[9] = 2*(l2*l3-l0*l1); temp.array[10] = 1 - 2*(l1*l1+l2*l2); temp.array[11] = 0.0;
    temp.array[12] = 0.0;            temp.array[13] = 0.0;            temp.array[14] = 0.0;                 temp.array[15] = 1.0;
    
    return multiplyMM(temp, new Matrix(1.0));
}

function perspective(angle, asRatio, zNear, zFar) {
    var fov = 1.0 / Math.tan(angle * Math.PI / 180.0 * 0.5);
    var res = new Matrix(0.0);
    
    res.array[0] = fov / asRatio;
    res.array[5] = fov;
    res.array[10] = - (zFar + zNear) / (zFar - zNear); res.array[11] = -1;
    res.array[14] = - 2 * zFar * zNear / (zFar - zNear);
    
    return res;
}

function lookAt(eye, point, vUp) {
    var z = normalize(subVectors(eye, point));
    var x = normalize(cross(vUp, z));
    var y = cross(z, x);
    var temp = new Matrix(0.0);
    
    temp.array[0] = x.x; temp.array[1] = y.x; temp.array[2] = z.x;
    temp.array[4] = x.y; temp.array[5] = y.y; temp.array[6] = z.y;
    temp.array[8] = x.z; temp.array[9] = y.z; temp.array[10] = z.z;
    temp.array[12] = - dot(x, eye); temp.array[13] = - dot(y, eye); temp.array[14] = - dot(z, eye);
    temp.array[15] = 1.0;
    
    return temp;
}