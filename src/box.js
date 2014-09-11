var boxVShader = [
    "#version 100",
    "precision highp float;",
    "attribute vec4 vPos;",
    "uniform mat4 MVP;",
    "void main() {",
    "   gl_Position = MVP * vPos;",
    "}"
].join("\n");
var boxFShader = [
    "#version 100",
    "precision highp float;",
    "uniform vec3 color;",
    "void main() {",
    "   gl_FragColor = vec4(color, 1.0);",
    "}"
].join("\n");

//Это все дело необходимо оптимизировать!!!

function Box(pos, dim, glContext) {
    this.pos = pos;
    this.dim = dim;
    this.color = new Vector(0.5, 0.5, 0.5);
    
    this.glContext = glContext;
    
    this.vbo = this.glContext.createBuffer();
    this.vbi = this.glContext.createBuffer();
    
    this.shader = [];
    this.shader[0] = new Shader(this.glContext, this.glContext.VERTEX_SHADER);
    this.shader[1] = new Shader(this.glContext, this.glContext.FRAGMENT_SHADER);
    //Defaults shaders
    this.shader[0].loadShader(boxVShader);
    this.shader[1].loadShader(boxFShader);
    
    this.program = new Program(this.glContext);
    
    this.mModel = new Matrix(1.0);
    this.mTranslate = translate(new Matrix(1.0), pos);
    this.mRotate = new Matrix(1.0);
}

Box.prototype = {
    init: function() {
        this.program.addShader(this.shader[0]);
        this.program.addShader(this.shader[1]);
        this.program.link();
        
        var verticies = [
            - this.dim.x / 2.0, - this.dim.y / 2.0, - this.dim.z / 2.0,
            - this.dim.x / 2.0, + this.dim.y / 2.0, - this.dim.z / 2.0,
            + this.dim.x / 2.0, + this.dim.y / 2.0, - this.dim.z / 2.0,
            + this.dim.x / 2.0, - this.dim.y / 2.0, - this.dim.z / 2.0,
            
            - this.dim.x / 2.0, - this.dim.y / 2.0, + this.dim.z / 2.0,
            + this.dim.x / 2.0, - this.dim.y / 2.0, + this.dim.z / 2.0,
            + this.dim.x / 2.0, + this.dim.y / 2.0, + this.dim.z / 2.0,
            - this.dim.x / 2.0, + this.dim.y / 2.0, + this.dim.z / 2.0,
        ];
        

        var indicies = [
            //rear
            0, 1, 2, 0, 3,
            //forward
            4, 5, 6, 4, 7,
            //top
            5, 1, 2, 5, 6,
            //bottom
            4, 7, 3, 3, 0,
            //left
            0, 4, 5, 0, 1,
            //right
            7, 6, 2, 7, 3
        ];
        
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbo);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(verticies), this.glContext.STATIC_DRAW);
        this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vPos"), 3, this.glContext.FLOAT, false, 0, 0);
        this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
        
        
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.vbi);
        this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicies), this.glContext.STATIC_DRAW);
    },
    
    setVertexShader: function(src) {
        this.shader[0].loadShader(src);
    },
    
    setFragmentShader: function(src) {
        this.shader[1].loadShader(src);
    },
    
    setColor: function(vec3OfColor) {
        this.color = vec3OfColor;
    },
    
    draw: function(WVP) {
        this.mModel = multiplyMM(this.mTranslate, this.mRotate);
        var lMVP = transpose(multiplyMM(transpose(WVP), this.mModel));
        
        this.program.use();
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.program.program, "color"), this.color.arrayRep);
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.program.program, "MVP"), false, lMVP.array);
        
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbo);
        this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
        this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vPos"), 3, this.glContext.FLOAT, false, 0, 0);
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.vbi);
        this.glContext.drawElements(this.glContext.TRIANGLE_STRIP, 6*5, this.glContext.UNSIGNED_BYTE, 0);
        this.glContext.disableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
    },
    
    rotateM: function(mRot) {
        this.mRotate = mRot;
    },
    
    translateM: function(mTrans) {
        this.mTranslate = mTrans;
    },
    
    clear: function() {
        this.program.deleteProgram();
        this.glContext.deleteBuffer(this.vbo);
        this.glContext.deleteBuffer(this.vbi);
    }
};