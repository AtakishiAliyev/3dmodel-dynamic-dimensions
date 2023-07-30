import React, { useCallback, useEffect, useRef, useState } from "react";

import "@google/model-viewer";

const Model = ({ model, toggle, play }) => {
  const modelViewer = useRef();
  const [dimLines, setDimLines] = useState();

  const drawLine = useCallback(
    (svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) => {
      if (dotHotspot1 && dotHotspot2) {
        svgLine.setAttribute("x1", dotHotspot1.canvasPosition.x);
        svgLine.setAttribute("y1", dotHotspot1.canvasPosition.y);
        svgLine.setAttribute("x2", dotHotspot2.canvasPosition.x);
        svgLine.setAttribute("y2", dotHotspot2.canvasPosition.y);

        // use provided optional hotspot to tie visibility of this svg line to
        if (dimensionHotspot && !dimensionHotspot.facingCamera) {
          svgLine.classList.add("hide");
        } else {
          svgLine.classList.remove("hide");
        }
      }
    },
    []
  );

  const renderSVG = useCallback(() => {
    if (dimLines) {
      drawLine(
        dimLines[0],
        modelViewer.current.queryHotspot("hotspot-dot+X-Y+Z"),
        modelViewer.current.queryHotspot("hotspot-dot+X-Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dim+X-Y")
      );
      drawLine(
        dimLines[1],
        modelViewer.current.queryHotspot("hotspot-dot+X-Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dot+X+Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dim+X-Z")
      );
      drawLine(
        dimLines[2],
        modelViewer.current.queryHotspot("hotspot-dot+X+Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dot-X+Y-Z")
      ); // always visible
      drawLine(
        dimLines[3],
        modelViewer.current.queryHotspot("hotspot-dot-X+Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dot-X-Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dim-X-Z")
      );
      drawLine(
        dimLines[4],
        modelViewer.current.queryHotspot("hotspot-dot-X-Y-Z"),
        modelViewer.current.queryHotspot("hotspot-dot-X-Y+Z"),
        modelViewer.current.queryHotspot("hotspot-dim-X-Y")
      );
    }
  }, [dimLines, drawLine, modelViewer]);

  useEffect(() => {
    const dimLines = modelViewer.current.querySelectorAll("line");
    setDimLines(dimLines);
  }, []);

  useEffect(() => {
    modelViewer.current.addEventListener("camera-change", () => {
      if (dimLines) {
        renderSVG();
      }
    });
  }, [dimLines, renderSVG]);

  useEffect(() => {
    modelViewer.current.addEventListener("load", () => {
      const center = modelViewer.current.getBoundingBoxCenter();
      const size = modelViewer.current.getDimensions();
      const x2 = size.x / 2;
      const y2 = size.y / 2;
      const z2 = size.z / 2;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot+X-Y+Z",
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
      });

      modelViewer.current.updateHotspot({
        name: "hotspot-dim+X-Y",
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
      });
      modelViewer.current.querySelector(
        'button[slot="hotspot-dim+X-Y"]'
      ).textContent = `${(size.z * 100).toFixed(0)} cm`;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot+X-Y-Z",
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
      });

      modelViewer.current.updateHotspot({
        name: "hotspot-dim+X-Z",
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
      });
      modelViewer.current.querySelector(
        'button[slot="hotspot-dim+X-Z"]'
      ).textContent = `${(size.y * 100).toFixed(0)} cm`;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot+X+Y-Z",
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
      });

      modelViewer.current.updateHotspot({
        name: "hotspot-dim+Y-Z",
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`,
      });
      modelViewer.current.querySelector(
        'button[slot="hotspot-dim+Y-Z"]'
      ).textContent = `${(size.x * 100).toFixed(0)} cm`;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot-X+Y-Z",
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
      });

      modelViewer.current.updateHotspot({
        name: "hotspot-dim-X-Z",
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
      });
      modelViewer.current.querySelector(
        'button[slot="hotspot-dim-X-Z"]'
      ).textContent = `${(size.y * 100).toFixed(0)} cm`;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot-X-Y-Z",
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
      });

      modelViewer.current.updateHotspot({
        name: "hotspot-dim-X-Y",
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
      });
      modelViewer.current.querySelector(
        'button[slot="hotspot-dim-X-Y"]'
      ).textContent = `${(size.z * 100).toFixed(0)} cm`;

      modelViewer.current.updateHotspot({
        name: "hotspot-dot-X-Y+Z",
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
      });

      if (drawLine) {
        renderSVG();
      }
    });
  }, [drawLine, renderSVG]);

  useEffect(() => {
    if (!play) {
      modelViewer.current.pause();
    }
  }, [play]);

  return (
    <div className="model-wrapper">
      <model-viewer
        ref={modelViewer}
        src={model}
        loading="eager"
        touch-action="pan-y"
        ar
        ar-scale="fixed"
        interpolation-decay="100"
        shadow-intensity="1"
        disable-tap="true"
        reveal="auto"
        camera-controls
        ar-status="not-presenting"
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        {...(play && { autoplay: "autoplay" })}
      >
        <button
          slot="hotspot-dot+X-Y+Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="1 -1 1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Y"
          className={`dim ${!toggle ? "hide" : null}`}
          data-position="1 -1 0"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X-Y-Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="1 -1 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Z"
          className={`dim ${!toggle ? "hide" : null}`}
          data-position="1 0 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X+Y-Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim+Y-Z"
          className={`dim ${!toggle ? "hide" : null}`}
          data-position="0 -1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dot-X+Y-Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="-1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim-X-Z"
          className={`dim ${!toggle ? "hide" : null}`}
          data-position="-1 0 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y-Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="-1 -1 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dim-X-Y"
          className={`dim ${!toggle ? "hide" : null}`}
          data-position="-1 -1 0"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y+Z"
          className={`dot ${!toggle ? "hide" : null}`}
          data-position="-1 -1 1"
          data-normal="-1 0 0"
        ></button>
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className={`dimensionLineContainer ${!toggle ? "hide" : null}`}
        >
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
        </svg>
      </model-viewer>
    </div>
  );
};

export default Model;
