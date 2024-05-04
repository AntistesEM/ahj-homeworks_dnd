import Trello from "./Trello";

const container = document.querySelector(".container");
const trello = new Trello(container);

trello.init();
