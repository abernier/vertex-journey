# Vertex journey

[Demo](https://abernier.github.io/vertex-journey)

> 🧳 The complete journey of a vertex, going from model coordinates to screen coordinates (in pixels) — or how to convert a point to screen

NB: our vertex (aka `point`) is represented by a 🟠 `sphere` added to our model 🟪 `cube`

![rendering-pipeline-v3](https://user-images.githubusercontent.com/76580/200901612-e5fd61bd-62ed-4d9a-91c0-e7e2b7d5e18b.png)
original: https://www.realtimerendering.com/blog/tag/pipeline/

```js
/*
 Our cube:
  - is 10x10x10 long
  - is positionned at (0, 5, 0) in the world

 Our sphere is positioned at (-5, 5 5) in the cube basis (ie: front-top-left corner)
*/

// cube.position.y = 5
// cube.add(sphere)
// sphere.position.set(-5, 5, 5)

const point = sphere.position.clone(); // (-5, 5, 5) aka relative to cube
console.log("point=", point);

//
// A: Model -> World
//

const M = cube.matrixWorld;
console.log("Model (World) Matrix", M);
point.applyMatrix4(M);
console.log("world-space point=", point);

//
// B: World -> Camera (aka View)
//

const V = camera.matrixWorldInverse;
console.log("View Matrix", V);
point.applyMatrix4(V);
console.log("view-space point=", point);

//
// C: Camera -> NDC
//

const P = camera.projectionMatrix;
console.log("Projection Matrix", P);
point.applyMatrix4(P);
console.log("clip coordinates", point);

//
// D: NDC -> Screen
//

const W = new THREE.Matrix4();
const { x: WW, y: WH } = renderer.getSize(new THREE.Vector2());
W.set(
  WW / 2, 0, 0, WW / 2,
  0, -WH / 2, 0, WH / 2,
  0, 0, 0.5, 0.5,
  0, 0, 0, 1
);
console.log("Window Matrix", W);
point.applyMatrix4(W);
console.log("window coordinates", point);
```

More conceptually, this is equivalent to:

[![Untitled (4)](https://user-images.githubusercontent.com/76580/200899430-209ec26e-42aa-4963-9a54-fbec17db66e9.png)](https://keasigmadelta.com/blog/warp3d-nova-3d-at-last-part-1/)

## Colophon

- https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-naming.html
- https://threejs.org/docs/#api/en/math/Matrix4
- https://jsantell.com/model-view-projection/
- ndc.z is not linear: https://discord.com/channels/685241246557667386/685241247233081362/1103672595280302131

  <img width="737" alt="image" src="https://user-images.githubusercontent.com/76580/236230266-27546c2e-b0c2-4f9d-9c21-d7184fb4871e.png">
  <a href="https://docs.google.com/spreadsheets/d/1V2rS8KPMnqZwhLb2yxFPUC4jFQoRVuNim0qjREQFR7o/edit#gid=3264016"><img height="150" alt="image" src="https://user-images.githubusercontent.com/76580/236227304-156e535e-c0e4-4cff-98ad-63027db0317f.png"></a>


## INSTALL

Pre-requisites:

- Node

```sh
$ npm ci
```

## Dev

```sh
$ npm start
```

## Build

```sh
$ npm run build
```
