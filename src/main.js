var gl;
var spaceCraft;
var areaWidth, areaHeight;

var lightPos = [];
var lightAmb = [];
var lightDiff = [];
var lightSpec = [];
var lightAtten = [];

var matAmb = [];
var matDiff = [];
var matSpec = [];
var matEmiss = [];
var matShine;

function showParameters(glContext) {
    var divTable = document.getElementById("GLParameters");
    divTable.innerHTML = "VENDOR: " + glContext.getParameter(glContext.VENDOR) + "<br />";
    divTable.innerHTML += "VERSION: " + glContext.getParameter(glContext.VERSION) + "<br />";
    divTable.innerHTML += "VIEWPORT: " + glContext.getParameter(glContext.VIEWPORT) + "<br />";
    divTable.innerHTML += "RENDERER: " + glContext.getParameter(glContext.RENDERER) + "<br />";
    divTable.innerHTML += "SHADING_LANGUAGE_VERSION: " + glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION) + "<br />";
    divTable.innerHTML += "MAX_RENDERBUFFER_SIZE: " + glContext.getParameter(glContext.MAX_RENDERBUFFER_SIZE) + "<br />";
    divTable.innerHTML += "MAX_VIEWPORT_DIMS: " + glContext.getParameter(glContext.MAX_VIEWPORT_DIMS)[0] + " " + 
                            glContext.getParameter(glContext.MAX_VIEWPORT_DIMS)[1] + "<br />";
}

window.onresize = function() {
    canvas = document.getElementById("GLCanvas");
    areaWidth = canvas.clientWidth;
    areaHeight = canvas.clientHeight;
    canvas.width = areaWidth;
    canvas.height = areaHeight;
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0, 0, areaWidth, areaHeight);
    //This is a test
}

window.onload = function () {
    canvas = document.getElementById("GLCanvas");
    areaWidth = canvas.clientWidth;
    areaHeight = canvas.clientHeight;
    canvas.width = areaWidth;
    canvas.height = areaHeight;
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0, 0, areaWidth, areaHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //showParameters(gl);
    
    spaceCraft = new SpaceCraft(gl);
    spaceCraft.init();
    
    rendering();
}

function rendering() {
    sleep(1000);
    
    lightPos = [document.getElementById("lXPos").value, document.getElementById("lYPos").value, document.getElementById("lZPos").value, 1.0];
    lightAmb = [document.getElementById("lAmbX").value, document.getElementById("lAmbY").value, document.getElementById("lAmbZ").value, 1.0];
    lightDiff = [document.getElementById("lDifX").value, document.getElementById("lDifY").value, document.getElementById("lDifZ").value, 1.0];
    lightSpec = [document.getElementById("lSpecX").value, document.getElementById("lSpecY").value, document.getElementById("lSpecZ").value, 1.0];
    lightAtten = [document.getElementById("lAttenX").value, document.getElementById("lAttenY").value, document.getElementById("lAttenZ").value];
    
    matAmb = [document.getElementById("mAmbX").value, document.getElementById("mAmbY").value, document.getElementById("mAmbZ").value, 1.0];
    matDiff = [document.getElementById("mDifX").value, document.getElementById("mDifY").value, document.getElementById("mDifZ").value, 1.0];
    matSpec = [document.getElementById("mSpecX").value, document.getElementById("mSpecY").value, document.getElementById("mSpecZ").value, 1.0];
    matEmiss = [document.getElementById("mEmissX").value, document.getElementById("mEmissY").value, document.getElementById("mEmissZ").value, 1.0];
    matShine = document.getElementById("mShine").value;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    var xRot = rotate(new Matrix(1.0), document.getElementById("xRot").value * Math.PI / 180.0, new Vector(1.0, 0.0, 0.0));
    var yRot = rotate(new Matrix(1.0), document.getElementById("yRot").value * Math.PI / 180.0, new Vector(0.0, 1.0, 0.0));
    var zRot = rotate(new Matrix(1.0), document.getElementById("zRot").value * Math.PI / 180.0, new Vector(0.0, 0.0, 1.0));
    
    var mRot = multiplyMM(xRot, multiplyMM(yRot, zRot));
    var mTranslate = translate(new Matrix(1.0), new Vector(0.0, 0.0, 0.0));
    var mWorld = multiplyMM(mTranslate, mRot);
    var mPerspective = perspective(60.0, areaWidth / areaHeight, 1.0, 100.0);
    var mView = lookAt(new Vector(4, 4, 4), new Vector(1, 1, 1), new Vector(0, 1, 0));
    
    spaceCraft.draw(mWorld, mView, mPerspective);
    //window.requestAnimFrame(rendering, canvas);
    setTimeout(function() {window.requestAnimFrame(rendering, canvas)}, 50);
}