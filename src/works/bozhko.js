/**
*    This works blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*    blah-blah-blah blah-blah-blah
*/

var panelVShader = [
    "#version 100",
    "precision highp float;",
    "attribute vec4 vPos;",
    "attribute vec3 vNormals;",
    "",
    "uniform mat4 MVP;",
    "uniform mat4 normMatrix;",
    "",
    "varying vec3 vDefNormals;",
    "",
    "void main() {",
    "   gl_Position = MVP * vPos;",
    "   vDefNormals = (normMatrix * vec4(vNormals, 0.0)).xyz;",
    "}"
].join("\n");

var panelFShader = [
    "#version 100",
    "precision highp float;",
    "uniform vec3 color;",
    "varying vec3 vDefNormals;",
    "struct DirLight {",
    "   vec3 vColor;",
    "   vec3 vDirection;",
    "   float ambientIntensity;",
    "};",
    "",
    "uniform DirLight sunLight;",
    "void main() {",
    "   float fDiffuseIntensity = max(0.0, dot(normalize(vDefNormals), -sunLight.vDirection));",
    "   gl_FragColor = vec4(color, 1.0) * vec4(sunLight.vColor * (sunLight.ambientIntensity + fDiffuseIntensity), 1.0);",
    "   //gl_FragColor = vec4(color, 1.0);",
    "}"
].join("\n");

function SpaceCraft(glContext) {
    this.mainBox = new Box(new Vector(0, 0, 0), new Vector(1.0, 1.0, 1.0), glContext);
    this.mainBox.setVertexShader(panelVShader);
    this.mainBox.setFragmentShader(panelFShader);
    
    this.panels = [];
    this.panels[0] = new Box(new Vector(0, 0, 0.0), new Vector(1.0, 0.01, 1.0), glContext);
    this.panels[1] = new Box(new Vector(1.03, -0.5, -1.03), new Vector(1.0, 0.01, 1.0), glContext);
    this.panels[2] = new Box(new Vector(1.03, -0.5, 1.03), new Vector(1.0, 0.01, 1.0), glContext);
    this.panels[3] = new Box(new Vector(2.06, -0.5, 0.0), new Vector(1.0, 0.01, 1.0), glContext);
    
    for(var i = 0; i < 4; i++) {
        this.panels[i].setVertexShader(panelVShader);
        this.panels[i].setFragmentShader(panelFShader);
        this.panels[i].setColor(new Vector(0.4, 0.4, 1.0));
    }
    
    this.glContext = glContext;
    this.j = 0;
}

SpaceCraft.prototype = {
    init: function() {
        this.mainBox.init();
        for (var i = 0; i < 4; i++) {
            this.panels[i].init();
        }
    },
    
    draw: function(WVP) {
        if (this.j == resultsSpaceCraft.length - 1)
            this.j = 0;
        
        //var t1, t2, t3, t4;
        var panelsModelMats = [];
        
        //first panel
        panelsModelMats[0] = translate(new Matrix(1.0), new Vector(0.5, 0.0, 0.0));
        panelsModelMats[0] = rotate(panelsModelMats[0], -resultsSpaceCraft[this.j][0], new Vector(0.0, 0.0, 1.0));
        panelsModelMats[0] = translate(panelsModelMats[0], new Vector(0.53, -0.5, 0.0));
        //second panel
        panelsModelMats[1] = translate(new Matrix(1.0), new Vector(0.5, 0.0, 0.0));
        panelsModelMats[1] = translate(panelsModelMats[1], new Vector(0.0, 0.0, -0.5));
        panelsModelMats[1] = rotate(panelsModelMats[1], -resultsSpaceCraft[this.j][1], new Vector(1.0, 0.0, 0.0));
        panelsModelMats[1] = rotate(panelsModelMats[1], -resultsSpaceCraft[this.j][0], new Vector(0.0, 0.0, 1.0));
        panelsModelMats[1] = translate(panelsModelMats[1], new Vector(0.53, -0.5, -0.53));
        //third panel
        panelsModelMats[2] = translate(new Matrix(1.0), new Vector(0.5, 0.0, 0.0));
        panelsModelMats[2] = translate(panelsModelMats[2], new Vector(0.0, 0.0, 0.5));
        panelsModelMats[2] = rotate(panelsModelMats[2], -resultsSpaceCraft[this.j][2], new Vector(1.0, 0.0, 0.0));
        panelsModelMats[2] = rotate(panelsModelMats[2], -resultsSpaceCraft[this.j][0], new Vector(0.0, 0.0, 1.0));
        panelsModelMats[2] = translate(panelsModelMats[2], new Vector(0.53, -0.5, 0.53));
        //fourth panel
        panelsModelMats[3] = translate(new Matrix(1.0), new Vector(0.5, 0.0, 0.0));
        panelsModelMats[3] = rotate(panelsModelMats[3], -resultsSpaceCraft[this.j][3], new Vector(0.0, 0.0, 1.0));
        panelsModelMats[3] = translate(panelsModelMats[3], new Vector(1.0, 0.0, 0.0));
        panelsModelMats[3] = rotate(panelsModelMats[3], -resultsSpaceCraft[this.j][0], new Vector(0.0, 0.0, 1.0));
        panelsModelMats[3] = translate(panelsModelMats[3], new Vector(0.56, -0.5, 0.0));

        this.mainBox.getProgramObject().use();
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "normMatrix"), this.glContext.FALSE, transpose(inverse(WV)).array);
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.mainBox.program.program, "sunLight.vColor"), [0.2, 0.2, 0.2]);
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.mainBox.program.program, "sunLight.vDirection"), [0.0, 10.0, 0.0]);
        this.glContext.uniform1f(this.glContext.getUniformLocation(this.mainBox.program.program, "sunLight.ambientIntention"), 0.1);
        this.mainBox.draw(WVP);
        for (var i = 0; i < 4; i++) {
            this.panels[i].setModelMatrix((panelsModelMats[i]));
            this.panels[i].getProgramObject().use();
            this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "normMatrix"), this.glContext.FALSE, transpose(inverse(WV)).array);
            this.glContext.uniform3fv(this.glContext.getUniformLocation(this.panels[i].program.program, "sunLight.vColor"), [0.2, 0.2, 0.2]);
            this.glContext.uniform3fv(this.glContext.getUniformLocation(this.panels[i].program.program, "sunLight.vDirection"), [0.0, 10.0, 0.0]);
            this.glContext.uniform1f(this.glContext.getUniformLocation(this.panels[i].program.program, "sunLight.ambientIntention"), 0.1);
            this.panels[i].draw(WVP);
        }
        
        this.j++;
    }
};