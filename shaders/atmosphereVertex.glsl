varying vec3 vertexNormal;

void main(){
    vertexNormal = normalize(normalMatrix * normal);
    //WITHOUT THIS LINE OF CODE THE CUSTOM SHADER CANNOT BE DISPLAYED VVVV
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
