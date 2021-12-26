import {
  ArcRotateCamera,
  Engine,
  FreeCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
export default class Game {
  canvas!: HTMLCanvasElement;
  engine!: Engine;
  scene!: Scene;
  camera!: FreeCamera;
  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(Vector3.Zero());
    new HemisphericLight("hemlight", new Vector3(1, 1, 0), this.scene);
    MeshBuilder.CreateTiledGround(
      "floor",
      { xmin: -1, zmin: -1, xmax: 1, zmax: 1, subdivisions: { w: 1, h: 1 } },
      this.scene
    );
    let sphere = MeshBuilder.CreateSphere(
      "testSphere",
      { segments: 16, diameter: 1 },
      this.scene
    );
    let box = MeshBuilder.CreateBox("boxy", {
      size: 4,
    });
    box.position.y = 2;
    // let tiledBox = MeshBuilder.CreateBox("boxy", {
    //   sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    //   width: 6,
    //   height: 4,
    //   depth: 3,
    // });
    let material = new StandardMaterial("bricks", this.scene);
    material.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/bricktile.jpg",
      this.scene
    );
    box.material = material;
    let i = 0;
    // setInterval(() => {
    // }, 100);
    this.engine.runRenderLoop(() => {
      box.rotation = new Vector3(0, Math.sin(i / 100) * 2, 0);
      // sphere.position.y = Math.sin(i) * 2;
      i++;
      this.scene.render();
    });
  }
}
