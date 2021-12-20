import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "babylonjs";
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
    new HemisphericLight("hemlight", new Vector3(0, 1, 0), this.scene);
    let sphere = MeshBuilder.CreateSphere(
      "testSphere",
      { segments: 16, diameter: 1 },
      this.scene
    );
    MeshBuilder.CreateGround(
      "mainground",
      { width: 6, height: 6, subdivisions: 2 },
      this.scene
    );
    let i = 0;
    // setInterval(() => {
    // }, 100);
    this.engine.runRenderLoop(() => {
      sphere.position.y = Math.sin(i) * 2;
      i++;
      this.scene.render();
    });
  }
}
