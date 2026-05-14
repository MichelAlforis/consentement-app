/// <reference types="@react-three/fiber" />
import 'react';

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    points: any;
    pointLight: any;
    ambientLight: any;
    directionalLight: any;
    spotLight: any;
    meshBasicMaterial: any;
    meshStandardMaterial: any;
    meshPhysicalMaterial: any;
    pointsMaterial: any;
    color: any;
    boxGeometry: any;
    planeGeometry: any;
    bufferGeometry: any;
    bufferAttribute: any;
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      points: any;
      pointLight: any;
      ambientLight: any;
      directionalLight: any;
      spotLight: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      pointsMaterial: any;
      color: any;
      boxGeometry: any;
      planeGeometry: any;
      bufferGeometry: any;
      bufferAttribute: any;
    }
  }
}
