var gl;
var spaceCraft;
var areaWidth, areaHeight;
var WV;

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    var xRot = rotate(new Matrix(1.0), document.getElementById("xRot").value * Math.PI / 180.0, new Vector(1.0, 0.0, 0.0));
    var yRot = rotate(new Matrix(1.0), document.getElementById("yRot").value * Math.PI / 180.0, new Vector(0.0, 1.0, 0.0));
    var zRot = rotate(new Matrix(1.0), document.getElementById("zRot").value * Math.PI / 180.0, new Vector(0.0, 0.0, 1.0));
    
    var mRot = multiplyMM(xRot, multiplyMM(yRot, zRot));
    var mTranslate = translate(new Matrix(1.0), new Vector(0.0, 0.0, 0.0));
    var mWorld = multiplyMM(mTranslate, mRot);
    var mPerspective = perspective(60.0, areaWidth / areaHeight, 1.0, 100.0);
    var mView = lookAt(new Vector(4, 4, 4), new Vector(1, 1, 1), new Vector(0, 1, 0));
    var WVP = transpose(multiplyMM(transpose(mPerspective), multiplyMM(transpose(mView), mWorld)));
    WV = multiplyMM(transpose(mView), mWorld);
    
    spaceCraft.draw(WVP);
    //window.requestAnimFrame(rendering, canvas);
    setTimeout(function() {window.requestAnimFrame(rendering, canvas)}, 50);
}