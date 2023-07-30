import { useState } from "react";

import Controller from "./components/Controller";
import Model from "./components/Model";

import Chair from "./assets/models/Chair.glb";
import Lima from "./assets/models/Lima.glb";
import model from "./assets/models/model.glb";
import model_play from "./assets/models/model_play.glb";

const models = [
  {
    name: "Chair",
    src: Chair,
  },
  {
    name: "Lima",
    src: Lima,
  },
  {
    name: "Model",
    src: model,
  },
  {
    name: "Model animation",
    src: model_play,
  },
];

function App() {
  const [model, setModel] = useState(models[0].src);
  const [toggle, setToggle] = useState(true);
  const [play, setPlay] = useState(false);

  return (
    <main className="model-viewer-wrapper">
      <Controller
        models={models}
        setModel={setModel}
        toggle={toggle}
        setToggle={setToggle}
        play={play}
        setPlay={setPlay}
      />
      <Model model={model} toggle={toggle} play={play} />
    </main>
  );
}

export default App;
