function Shader(glContext, type) {
    this.shader = 0;
    this.type = type;
    this.glContext = glContext;
}

Shader.prototype = {
    loadShader: function(src) {
        this.shader = this.glContext.createShader(this.type);
        this.glContext.shaderSource(this.shader, src);
        this.glContext.compileShader(this.shader);
        var compileStatus = this.glContext.getShaderParameter(this.shader, this.glContext.COMPILE_STATUS);
        if (!compileStatus) {
            var temp = this.glContext.getShaderInfoLog(this.shader);
            console.log("An error is occured in shader type: " + (this.type == this.glContext.VERTEX_SHADER ? "'Vertex shader'" : "'Fragment shader'" +                         ": " + temp));
            return;
        }
    },
    deleteShader: function() {
        this.glContext.deleteShader(this.shader);
    },
    getShaderRep: function() {
        return this.shader;
    }
};