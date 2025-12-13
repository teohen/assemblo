import ui from "./ui.mjs";
import instructionsDocs from "./instructions.mjs";
import argumentsDocs from "./arguments.mjs";
import registersDocs from "./registers.mjs";
import memoryDocs from "./memory.mjs";
import listDocs from "./lists.mjs";

const docs = {}
docs[instructionsDocs.docs.name] = instructionsDocs.docs;
docs[argumentsDocs.docs.name] = argumentsDocs.docs;
docs[registersDocs.docs.name] = registersDocs.docs;
docs[memoryDocs.docs.name] = memoryDocs.docs;
docs[listDocs.docs.name] = listDocs.docs;

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

ui.renderDocList({
  title: 'memory',
  items: []
});

ui.renderDocList({
  title: 'lists',
  items: []
});

ui.renderDocContent(docs[paramItem])
