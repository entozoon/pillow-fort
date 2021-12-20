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
    const cameraPos = new Vector3(0, 5, -10);
    this.camera = new FreeCamera("maincam", cameraPos, this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, false);
    const lightPos = new Vector3(0, 1, 0);
    new HemisphericLight("hemlight", lightPos, this.scene);
    const sphereOpts = { segments: 16, diameter: 1 };
    let sphere = MeshBuilder.CreateSphere("mainsphere", sphereOpts, this.scene);
    sphere.position.y = 1;
    const groundOpts = { width: 6, height: 6, subdivisions: 2 };
    MeshBuilder.CreateGround("mainground", groundOpts, this.scene);
    this.animate();
  }
  animate() {
    this.engine.runRenderLoop(() => this.scene.render());
  }
}
