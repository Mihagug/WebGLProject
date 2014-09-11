function Program(glContext) {
    this.glContext = glContext;
    this.program = glContext.createProgram();
    this.shaders = [];
}

Program.prototype = {
    addShader: function(shader) {
        this.shaders.push(shader);
    },
    link: function() {
        for (var i = 0; i < this.shaders.length; i++) {
            this.glContext.attachShader(this.program, this.shaders[i].getShaderRep());
            this.shaders[i].deleteShader();
        }
        this.glContext.linkProgram(this.program);
        var linkStatus = this.glContext.getProgramParameter(this.program, this.glContext.LINK_STATUS);
        if (!linkStatus) {
            var temp = this.glContext.getProgramInfoLog(this.program);
            console.log("An error has occured in program: " + temp);
            return;
        }
    },
    deleteProgram: function() {
        this.glContext.deleteProgram(this.program);
    },
    use: function() {
        this.glContext.useProgram(this.program);
    }
}