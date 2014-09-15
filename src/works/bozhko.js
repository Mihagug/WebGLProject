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
    "uniform struct Transform {",
    "   mat4 model;",
    "   mat4 world;",
    "   mat4 view;",
    "   mat4 projection;",
    "   mat4 normMatrix;",
    "   vec3 viewPosition;",
    "} transform;",
    "",
    "uniform struct PointLight {",
    "   vec4 position;",
    "   vec4 ambient;",
    "   vec4 diffuse;",
    "   vec4 specular;",
    "   vec3 attenuation;",
    "} light;",
    "",
    "varying vec3 normal;",
    "varying vec3 lightDir;",
    "varying vec3 viewDir;",
    "varying float distance;",
    "",
    "void main() {",
    "   mat4 MVP = transform.projection * transform.view * transform.world * transform.model;",
    "   gl_Position = MVP * vPos;",
    "",
    "   vec4 vertex = transform.world * transform.model * vPos;",
    "   lightDir = vec3(light.position - vertex);",
    "",
    "   normal = vec3(transform.normMatrix * vec4(vNormals, 0.0));",
    "   viewDir = transform.viewPosition - vec3(vertex);",
    "   distance = length(lightDir);",
    "}"
].join("\n");

var panelFShader = [
    "#version 100",
    "precision highp float;",
    "",
    "uniform vec3 color;",
    "",
    "uniform struct PointLight {",
    "   vec4 position;",
    "   vec4 ambient;",
    "   vec4 diffuse;",
    "   vec4 specular;",
    "   vec3 attenuation;",
    "} light;",
    "",
    "uniform struct Material {",
    "   vec4 ambient;",
    "   vec4 diffuse;",
    "   vec4 specular;",
    "   vec4 emission;",
    "   float shininess;",
    "} material;",
    "",
    "varying vec3 normal;",
    "varying vec3 lightDir;",
    "varying vec3 viewDir;",
    "varying float distance;",
    "",
    "void main() {",
    "   vec4 outColor;",
    "   vec3 outNormal = normalize(normal);",
    "   vec3 outLightDir = normalize(lightDir);",
    "   vec3 outViewDir = normalize(viewDir);",
    "",
    "   float attenuation = 1.0 / (light.attenuation.x + light.attenuation.y * distance + light.attenuation.z * distance * distance);",
    "   outColor = material.emission;",
    "   outColor += material.ambient * light.ambient * attenuation;",
    "   float NdotL = max(dot(outNormal, outLightDir), 0.0);",
    "   outColor += material.diffuse * light.diffuse * NdotL * attenuation;",
    "   float RdotVpow = max(pow(dot(reflect(-outLightDir, outNormal), outViewDir), material.shininess), 0.0);",
    "   outColor += material.specular * light.specular * RdotVpow * attenuation;",
    "   outColor *= vec4(color, 1.0);",
    "   gl_FragColor = outColor;",
    "}"
].join("\n");

function SpaceCraft(glContext) {
    this.mainBox = new Box(new Vector(0, 0, 0), new Vector(1.0, 1.0, 1.0), glContext);
    this.mainBox.setVertexShader(panelVShader);
    this.mainBox.setFragmentShader(panelFShader);
    this.mainBox.setColor(new Vector(1.0, 0.0, 0.0));
    
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
    
    draw: function(W, V, P) {
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
        this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "transform.normMatrix"), this.glContext.FALSE, transpose(inverse(multiplyMM(V, multiplyMM(W, this.mainBox.mModel)))).array);
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.mainBox.program.program, "transform.viewPosition"), [4.0, 4.0, 4.0]);
        /*//light parameters
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.position"), [4.0, 0.0, 0.0, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.ambient"), [0.1, 0.1, 0.1, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.diffuse"), [0.4, 0.4, 0.4, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.specular"), [0.7, 0.7, 0.7, 1.0]);
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.attenuation"), [0.1, 0.1, 0.1]);
        //material parameters
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.ambient"), [0.1, 0.1, 0.1, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.diffuse"), [0.6, 0.6, 0.6, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.specular"), [0.2, 0.2, 0.2, 1.0]);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.emission"), [1.0, 1.0, 1.0, 1.0]);
        this.glContext.uniform1f(this.glContext.getUniformLocation(this.mainBox.program.program, "material.shininess"), 0.5);*/
        
         //light parameters
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.position"), lightPos);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.ambient"), lightAmb);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.diffuse"), lightDiff);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.specular"), lightSpec);
        this.glContext.uniform3fv(this.glContext.getUniformLocation(this.mainBox.program.program, "light.attenuation"), lightAtten);
        //material parameters
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.ambient"), matAmb);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.diffuse"), matDiff);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.specular"), matSpec);
        this.glContext.uniform4fv(this.glContext.getUniformLocation(this.mainBox.program.program, "material.emission"), matEmiss);
        this.glContext.uniform1f(this.glContext.getUniformLocation(this.mainBox.program.program, "material.shininess"), matShine);
        
        this.mainBox.draw(W, V, P);
        for (var i = 0; i < 4; i++) {
            this.panels[i].setModelMatrix((panelsModelMats[i]));
            this.panels[i].getProgramObject().use();
            this.glContext.uniformMatrix4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "transform.normMatrix"), this.glContext.FALSE, transpose(inverse(multiplyMM(V, multiplyMM(W, this.panels[i].mModel)))).array);
            //light parameters
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "light.position"), lightPos);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "light.ambient"), lightAmb);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "light.diffuse"), lightDiff);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "light.specular"), lightSpec);
            this.glContext.uniform3fv(this.glContext.getUniformLocation(this.panels[i].program.program, "light.attenuation"), lightAtten);
            //material parameters
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "material.ambient"), matAmb);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "material.diffuse"), matDiff);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "material.specular"), matSpec);
            this.glContext.uniform4fv(this.glContext.getUniformLocation(this.panels[i].program.program, "material.emission"), matEmiss);
            this.glContext.uniform1f(this.glContext.getUniformLocation(this.panels[i].program.program, "material.shininess"), matShine);
            this.panels[i].draw(W, V, P);
        }
        
        this.j++;
    }
};