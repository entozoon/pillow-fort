import Ammo from "ammojs-typed";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import * as BABYLON from "@babylonjs/core";
export default class Game {
  canvas!: HTMLCanvasElement;
  engine!: BABYLON.Engine;
  scene!: BABYLON.Scene;
  camera!: BABYLON.FreeCamera;
  ground!: BABYLON.Mesh;
  light!: BABYLON.HemisphericLight;
  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    Ammo()
      .then((api) => {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.enablePhysics(
          new BABYLON.Vector3(0, -9.81, 0),
          // Ammo as IPhysicsEnginePlugin
          new AmmoJSPlugin()
        );
      })
      .then(() => {
        this.light = new BABYLON.HemisphericLight(
          "hemlight",
          new BABYLON.Vector3(1, 1, 0),
          this.scene
        );
        this.light.intensity = 0.8;
        this.initGround();
        setInterval(() => {
          this.initBox(
            Math.round(Math.random() * 20 - 10),
            Math.round(Math.random() * 20 - 10)
          );
        }, 1000);
        var hero = BABYLON.Mesh.CreateBox("hero", 0.5, this.scene);
        hero.physicsImpostor = new BABYLON.PhysicsImpostor(
          hero,
          BABYLON.PhysicsImpostor.BoxImpostor,
          { mass: 10, restitution: 0.9, friction: 1 },
          this.scene
        );
        hero.position.y = 5;
        this.initCamera(hero);
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
        this.scene.onKeyboardObservable.add((kbInfo) => {
          if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
            const { key } = kbInfo.event;
            // const turnAmount = ["ArrowLeft", "a"].includes(key)
            //   ? -0.2
            //   : ["ArrowRight", "d"].includes(key)
            //   ? 0.2
            //   : 0;
            // const moveAmount = ["ArrowUp", "w"].includes(key)
            //   ? 0.7
            //   : ["ArrowDown", "s"].includes(key)
            //   ? -0.7
            //   : 0;
            // hero.rotation = new BABYLON.Vector3(
            //   0,
            //   hero.rotation.y + turnAmount,
            //   0
            // );
            // hero.position.z -= Math.cos(hero.rotation.y) * moveAmount;
            // hero.position.x -= Math.sin(hero.rotation.y) * moveAmount;
            // Argh, am I gonna have to write my own velocity functions
            if (["ArrowUp", "w"].includes(key)) {
              hero.physicsImpostor.applyImpulse(
                new BABYLON.Vector3(0, 0, -20),
                hero.getAbsolutePosition()
              );
            }
            if (key === " ") {
              hero.physicsImpostor.applyImpulse(
                new BABYLON.Vector3(0, 5, 0),
                hero.getAbsolutePosition()
              );
            }
          }
        });
      });
  }
  private initBox(x, z) {
    let box = BABYLON.MeshBuilder.CreateBox(
      "box",
      {
        width: 1,
        height: 0.2,
        depth: 1,
      },
      this.scene
    );
    box.position.y = 2;
    box.position.x = x;
    box.position.z = z;
    box.forceSharedVertices();
    box.increaseVertices(5);
    let material = new BABYLON.StandardMaterial("bricks", this.scene);
    material.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/bricktile.jpg",
      this.scene
    );
    material.diffuseColor = BABYLON.Color3.FromInts(
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255)
    );
    box.material = material;
    let softBoxOptions = {
      mass: 1,
      friction: 1,
      restitution: 0.3,
      pressure: 500,
      velocityIterations: 10,
      positionIterations: 10,
      stiffness: 0.95,
      damping: 0.05,
    };
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.SoftbodyImpostor,
      softBoxOptions,
      this.scene
    );
    setTimeout(() => {
      box.physicsImpostor.dispose();
    }, 2000);
    return box;
  }
  private initGround() {
    this.ground = BABYLON.MeshBuilder.CreateBox(
      "ground",
      { width: 10, depth: 10, height: 1 },
      this.scene
    );
    var material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseTexture = new BABYLON.Texture(
      "https://www.babylonjs-playground.com/textures/ground.jpg",
      this.scene
    );
    material.diffuseColor = BABYLON.Color3.FromHexString("#00ccff");
    this.ground.material = material;
    this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );
  }
  private initCamera(box: BABYLON.Mesh) {
    const camera = new BABYLON.FollowCamera(
      "FollowCam",
      new BABYLON.Vector3(-100, 0, 0),
      this.scene
    );
    camera.lockedTarget = box;
    camera.radius = 6;
  }
}
