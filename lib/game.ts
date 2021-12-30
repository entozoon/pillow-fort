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
  KeyboardEventTypes,
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
        let box = this.initBox();
        setInterval(() => {
          this.initBox(Math.random() * 20 - 10, Math.random() * 20 - 10);
        }, 200);
        this.initCamera(box);
        let i = 0;
        this.engine.runRenderLoop(() => {
          // box.rotation = new Vector3(0, Math.sin(i / 1000) * 1, 0);
          // // box.position.x = Math.sin(i / 100) * 2;
          // i++;
          // if (i % 400 === 0) {
          //   box.applyImpulse(new Vector3(0, -10, 0), box.position);
          // }
          this.scene.render();
        });
        this.scene.onKeyboardObservable.add((kbInfo) => {
          if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
            const { key } = kbInfo.event;
            box.position.x +=
              key === "ArrowLeft" ? 1 : key === "ArrowRight" ? -1 : 0;
            box.position.z +=
              key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
          }
        });
      });
  }
  private initBox(x, z) {
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
    box.position.x = x;
    box.position.z = z;
    box.forceSharedVertices();
    box.increaseVertices(5);
    let material = new StandardMaterial("bricks", this.scene);
    material.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/bricktile.jpg",
      this.scene
    );
    box.material = material;
    let softBoxOptions = {
      mass: 10,
      friction: 1,
      restitution: 0.3,
      pressure: 1000,
      velocityIterations: 10,
      positionIterations: 10,
      stiffness: 0.5,
      damping: 0.05,
    };
    box.physicsImpostor = new PhysicsImpostor(
      box,
      PhysicsImpostor.SoftbodyImpostor,
      softBoxOptions,
      this.scene
    );
    setTimeout(() => {
      box.physicsImpostor.dispose();
    }, 4000);
    return box;
  }
  private initGround() {
    this.ground = MeshBuilder.CreateBox(
      "ground",
      { width: 10, depth: 10, height: 1 },
      this.scene
    );
    var material = new StandardMaterial("material", this.scene);
    material.diffuseTexture = new Texture(
      "https://www.babylonjs-playground.com/textures/ground.jpg",
      this.scene
    );
    material.diffuseColor = Color3.FromHexString("#00ccff");
    this.ground.material = material;
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
    camera.radius = 10;
  }
}
