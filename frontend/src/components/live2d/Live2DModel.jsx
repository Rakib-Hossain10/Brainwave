


import { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

window.PIXI = PIXI;

const Live2DDisplay = forwardRef(
  (
    {
      // position/sizing you can tweak per page
      topOffset = 72,                  // just below your fixed header (~64px + small gap)
      width = 220,                     // base size; component scales to this box
      height = 320,
      opacity = 0.85,                  // translucent so text stays readable
      modelSrc = "/models/Hiyori/Hiyori.model3.json",
    },
    ref
  ) => {
    const pixiContainerRef = useRef(null);
    const appRef = useRef(null);
    const modelRef = useRef(null);

    const EXPRESSIONS = {
      吐舌: "key2",
      黑脸: "key3",
      眼泪: "key4",
      脸红: "key5",
      "nn眼": "key6",
      生气瘪嘴: "key7",
      死鱼眼: "key8",
      生气: "key9",
      咪咪眼: "key10",
      嘟嘴: "key11",
      钱钱眼: "key12",
      爱心: "key16",
      泪眼: "key17",
    };

    useImperativeHandle(ref, () => ({
      showExpression: (expression, active = true) => {
        const m = modelRef.current;
        const id = EXPRESSIONS[expression];
        if (m && id) {
          m.internalModel.coreModel.setParameterValueById(id, active ? 1 : 0);
          setTimeout(() => {
            if (modelRef.current) {
              modelRef.current.internalModel.coreModel.setParameterValueById(id, 0);
            }
          }, 10000);
        }
      },
      setTracking: (enabled) => {
        const m = modelRef.current;
        if (m) {
          m.autoInteract = enabled;
          m.internalModel.motionManager.settings.autoAddRandomMotion = enabled;
        }
      },
    }));

    useLayoutEffect(() => {
      // clean any previous app
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      if (pixiContainerRef.current) {
        while (pixiContainerRef.current.firstChild) {
          pixiContainerRef.current.removeChild(pixiContainerRef.current.firstChild);
        }
      }
      if (!pixiContainerRef.current) return;

      // 🔑 Transparent canvas, auto-resizes to wrapper (no black rectangle)
      const app = new PIXI.Application({
        backgroundAlpha: 0,                 // <- transparent (replaces backgroundColor: 0x000000)
        antialias: true,
        resizeTo: pixiContainerRef.current, // <- canvas follows wrapper size
      });
      app.view.style.width = "100%";
      app.view.style.height = "100%";
      app.view.style.pointerEvents = "none";
      app.view.style.opacity = String(opacity);

      pixiContainerRef.current.appendChild(app.view);
      appRef.current = app;

      let destroyed = false;

      (async () => {
        try {
          const model = await Live2DModel.from(modelSrc);
          if (destroyed || !appRef.current) return;

          modelRef.current = model;
          // bottom-right anchor so the character hugs the corner
          model.anchor.set(1, 1);
          app.stage.addChild(model);

          const layout = () => {
            const a = appRef.current;
            const m = modelRef.current;
            if (!a || !m) return;
            const w = a.renderer.width;
            const h = a.renderer.height;
            m.x = w;
            m.y = h;
            // fit inside wrapper
            const s = Math.min(w / m.width, h / m.height);
            m.scale.set(s);
          };

          layout();
          // keep it pinned on resize
          const onResize = () => layout();
          window.addEventListener("resize", onResize);
          // store to remove on cleanup
          appRef.current._onResize = onResize;
        } catch (e) {
          console.error("Live2D load error:", e);
        }
      })();

      return () => {
        destroyed = true;
        if (appRef.current?._onResize) {
          window.removeEventListener("resize", appRef.current._onResize);
        }
        if (modelRef.current) {
          try { modelRef.current.destroy(); } catch {}
          modelRef.current = null;
        }
        if (appRef.current) {
          try { appRef.current.destroy(true, { children: true, texture: true, baseTexture: true }); } catch {}
          appRef.current = null;
        }
      };
    }, [modelSrc, opacity]);

    // fixed, top-right; never intercept clicks
    return (
      <div
        ref={pixiContainerRef}
        className="pointer-events-none fixed z-20 right-2 sm:right-4"
        style={{
          top: `${topOffset}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    );
  }
);

Live2DDisplay.displayName = "Live2DDisplay";
export default Live2DDisplay;







