import Ammo from "ammojs-typed";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import {
  ArcRotateCamera,
  Engine,
  FreeCamera,
  HemisphericLight,
  Mesh,
  FollowCamera,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  PhysicsImpostor,
  Color3,
} from "@babylonjs/core";
export default class Game {
  canvas!: HTMLCanvasElement;
  engine!: Engine;
  scene!: Scene;
  camera!: FreeCamera;
  ground!: Mesh;
  light!: HemisphericLight;
  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    Ammo()
      .then((api) => {
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.scene.enablePhysics(
          new Vector3(0, -9.81, 0),
          // Ammo as IPhysicsEnginePlugin
          new AmmoJSPlugin()
        );
      })
      .then(() => {
        this.light = new HemisphericLight(
          "hemlight",
          new Vector3(1, 1, 0),
          this.scene
        );
        this.light.intensity = 0.8;
        this.initGround();
        let box = MeshBuilder.CreateBox(
          "box",
          {
            width: 1,
            height: 1,
            depth: 1,
          },
          this.scene
        );
        box.position.y = 8;
        box.forceSharedVertices();
        box.increaseVertices(5);
        let material = new StandardMaterial("bricks", this.scene);
        material.diffuseTexture = new Texture(
          "https://assets.babylonjs.com/environments/bricktile.jpg",
          this.scene
        );
        box.material = material;
        let softBoxOptions = {
          mass: 1,
          friction: 1,
          restitution: 0.3,
          pressure: 1000,
          velocityIterations: 10,
          positionIterations: 10,
          stiffness: 0.5,
          damping: 0.05,
        };
        this.scene.enablePhysics(null, new AmmoJSPlugin());
        box.physicsImpostor = new PhysicsImpostor(
          box,
          PhysicsImpostor.SoftbodyImpostor,
          softBoxOptions,
          this.scene
        );
        this.initCamera(box);
        let i = 0;
        this.engine.runRenderLoop(() => {
          box.rotation = new Vector3(0, Math.sin(i / 100) * 2, 0);
          // box.position.x = Math.sin(i / 100) * 2;
          i++;
          if (i % 400 === 0) {
            box.applyImpulse(new Vector3(0, -10, 0), box.position);
          }
          this.scene.render();
        });
      });
  }
  private initGround() {
    this.ground = MeshBuilder.CreateBox(
      "ground",
      { width: 10, depth: 10, height: 1 },
      this.scene
    );
    var bleh = new StandardMaterial("bleh", this.scene);
    bleh.diffuseTexture = new Texture(
      "https://www.babylonjs-playground.com/textures/ground.jpg",
      this.scene
    );
    bleh.diffuseColor = Color3.Red();
    this.ground.material = bleh;
    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );
  }
  private initCamera(box: Mesh) {
    const camera = new FollowCamera(
      "FollowCam",
      new Vector3(-100, 0, 0),
      this.scene
    );
    camera.lockedTarget = box;
    camera.radius = 5;
  }
}
