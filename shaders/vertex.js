const vertex = /* glsl */ `
varying vec2 vertexUV;

void main() {
    vertexUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export default vertex;