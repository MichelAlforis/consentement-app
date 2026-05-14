/// <reference types="@react-three/fiber" />
import 'react';

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    pointLight: any;
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      pointLight: any;
    }
  }
}
