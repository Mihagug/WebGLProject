var boxVShader = [
    "#version 100",
    "precision highp float;",
    "attribute vec4 vPos;",
    "",
    "uniform struct Transform {",
    "   mat4 model;",
    "   mat4 world;",
    "   mat4 view;",
    "   mat4 projection;",
    "   mat3 normMatrix;",
    "   vec3 viewPosition;",
    "} transform;",
    "",
    "void main() {",
    "   mat4 MVP = transform.projection * transform.view * transform.world * transform.model;",
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
    this.vbn = this.glContext.createBuffer();
    
    this.shader = [];
    this.shader[0] = new Shader(this.glContext, this.glContext.VERTEX_SHADER);
    this.shader[1] = new Shader(this.glContext, this.glContext.FRAGMENT_SHADER);
    //Defaults shaders
    this.shader[0].loadShader(boxVShader);
    this.shader[1].loadShader(boxFShader);
    
    this.program = new Program(this.glContext);
    
    this.mModel = new Matrix(1.0);
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
            - this.dim.x / 2.0, + this.dim.y / 2.0, + this.dim.z / 2.0
        ];
        
        var indicies = [
            //rear
            0, 1, 2, 2, 3, 0,
            //forward
            4, 5, 6, 4, 6, 7,
            //top
            1, 7, 6, 1, 6, 2,
            //bottom
            4, 0, 3, 4, 3, 5,
            //left
            3, 2, 6, 3, 6, 5,
            //right
            4, 7, 1, 4, 1, 0
        ];
        
        var normals = [
            -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, 0.0, -1.0,
            
            -1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, -1.0,
            
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, -1.0,
            
            1.0, 0.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, 0.0, -1.0,
            
            -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            
            1.0, 0.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            
            -1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
        ]; 
        
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbo);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(verticies), this.glContext.STATIC_DRAW);
        this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vPos"), 3, this.glContext.FLOAT, false, 0, 0);
        this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
        
        if (this.glContext.getAttribLocation(this.program.program, "vNormals") > 0) {
            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbn);
            this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(normals), this.glContext.STATIC_DRAW);
            this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vNormals"), 3, this.glContext.FLOAT, false, 0, 0);
            this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vNormals"));
        }
        
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
    
    draw: function(W, V, P) {
        //var MVP = multiplyMM(WVP, this.mModel);
        
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.program.program, "color"), this.color.arrayRep);
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.program.program, "transform.projection"), false, P.array);
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.program.program, "transform.view"), false, V.array);
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.program.program, "transform.world"), false, W.array);
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.program.program, "transform.model"), false, this.mModel.array);
        
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbo);
        this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
        this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vPos"), 3, this.glContext.FLOAT, false, 0, 0);
        if (this.glContext.getAttribLocation(this.program.program, "vNormals") > 0) {
            this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vbn);
            this.glContext.vertexAttribPointer(this.glContext.getAttribLocation(this.program.program, "vNormals"), 3, this.glContext.FLOAT, false, 0, 0);
            this.glContext.enableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vNormals"));
        }
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.vbi);
        this.glContext.drawElements(this.glContext.TRIANGLES, 6 * 3 * 2, this.glContext.UNSIGNED_BYTE, 0);
        this.glContext.disableVertexAttribArray(this.glContext.getAttribLocation(this.program.program, "vPos"));
    },
    
    setModelMatrix: function(newModelMatrix) {
        this.mModel = newModelMatrix;
    },
    
    getProgramObject: function() {
        return this.program;
    },
    
    clear: function() {
        this.program.deleteProgram();
        this.glContext.deleteBuffer(this.vbo);
        this.glContext.deleteBuffer(this.vbi);
        this.glContext.deleteBuffer(this.vbn);
    }
};