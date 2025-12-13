import ui from "./ui.mjs";
import instructionsDocs from "./instructions.mjs";
import argumentsDocs from "./arguments.mjs";
import registersDocs from "./registers.mjs";

const docs = {}
docs[instructionsDocs.docs.name] = instructionsDocs.docs;
docs[argumentsDocs.docs.name] = argumentsDocs.docs;
docs[registersDocs.docs.name] = registersDocs.docs;

const urlParams = new URLSearchParams(window.location.search);
const paramItem = urlParams.get('item');

ui.renderDocList({
  title: 'instructions',
  items: []
});

ui.renderDocList({
  title: 'arguments',
  items: []
});

ui.renderDocList({
  title: 'registers',
  items: []
});

ui.renderDocContent(docs[paramItem])
