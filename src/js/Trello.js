export default class Trello {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.clear();
    // Восстановление элементов li при загрузке страницы
    window.addEventListener("DOMContentLoaded", () => {
      const cardsLists = document.querySelectorAll(".cards");
      cardsLists.forEach((item) => {
        item.innerHTML = "";
      });

      // Получаем объект Storage
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        const section = document.querySelector("." + key);
        const cardsText = JSON.parse(localStorage.getItem(key)) || [];
        cardsText.forEach((text) => {
          this.createLiElement(section, text);
        });
      });
    });

    // Создание нового элемента li при нажатии на кнопку "Add Card"
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-btn")) {
        if (e.target.classList.contains("add-btn-card")) {
          const parentSection = e.target.closest("section");
          this.createLiElement(parentSection);
          this.setHidden();
        } else {
          this.setHidden();
          e.target.textContent = "Add Card";
          e.target.classList.add("add-btn-card");
          const parentSection = e.target.closest("section");
          const doneHiddens = parentSection.querySelectorAll(".hidden");
          doneHiddens.forEach((element) => {
            element.removeAttribute("hidden");
          });
        }
      } else if (e.target.classList.contains("close-icon")) {
        this.setHidden();
        const parentSection = e.target.closest("section");
        const inputEl = parentSection.querySelector(".input-title");
        inputEl.value = "";
      } else if (e.target.classList.contains("close-btn")) {
        this.setHidden();
        const parentSection = e.target.closest("li");
        parentSection.remove();
      }
    });

    // Сохранение элементов li при закрытии страницы
    window.addEventListener("beforeunload", () => {
      localStorage.clear();
      const cardsLists = document.querySelectorAll("section");
      cardsLists.forEach((item) => {
        const title = item.classList.value;
        localStorage.setItem(title, JSON.stringify([]));
        const cardsItems = Array.from(item.querySelectorAll(".cards-item"));
        const cards = cardsItems.map((item) => item.textContent);
        localStorage.setItem(title, JSON.stringify(cards));
      });
    });
    window.addEventListener("DOMContentLoaded", () => {
      this.dargNdrop();
      // this.dnd();
    });
  }

  addEventsListCardsItems(list) {
    let draggedItem = null;
    const listCards = document.querySelectorAll(".cards");

    list.forEach((item) => {
      item.setAttribute("draggable", "true");

      item.addEventListener("dragstart", () => {
        draggedItem = item;
        setTimeout(() => {
          item.style.display = "none";
        }, 0);
      });

      item.addEventListener("dragend", () => {
        setTimeout(() => {
          item.style.display = "block";
          draggedItem = null;
        }, 0);
      });

      listCards.forEach((card) => {
        this.addEventsCard(card, draggedItem);
      });
    });
  }

  addEventsCard(card, draggedItem) {
    card.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    card.addEventListener("dragenter", function () {
      this.style.backgroundColor = "blue";
    });

    card.addEventListener("dragleave", function () {
      this.style.backgroundColor = "transparent";
    });

    card.addEventListener("drop", function () {
      this.style.backgroundColor = "transparent";
      this.append(draggedItem);
    });
  }

  dargNdrop() {
    const listCardsItems = this.container.querySelectorAll(".cards-item");
    if (listCardsItems.length > 0) {
      this.addEventsListCardsItems(listCardsItems);
    }
  }

  // Как в лекции
  dnd() {
    this.container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    this.container.addEventListener("drop", (e) => {
      e.preventDefault();
    });

    const cards = this.container.querySelectorAll(".cards");

    let actualElement;

    cards.forEach((element) => {
      const onMouseOver = (e) => {
        actualElement.style.top = e.clientY + "px";
        actualElement.style.left = e.clientX + "px";
      };

      const onMouseUp = (e) => {
        const mouseUpItem = e.target;

        element.insertBefore(actualElement, mouseUpItem);

        actualElement.classList.remove("dragged");
        actualElement = undefined;

        document.documentElement.removeEventListener("mouseup", onMouseUp);
        document.documentElement.removeEventListener("mouseover", onMouseOver);
      };

      element.addEventListener("mousedown", (e) => {
        e.preventDefault();

        actualElement = e.target;

        actualElement.classList.add("dragged");

        document.documentElement.addEventListener("mouseup", onMouseUp);
        document.documentElement.addEventListener("mouseover", onMouseOver);
      });
    });
  }

  setHidden() {
    const addBtns = this.container.querySelectorAll(".add-btn-card");

    if (addBtns) {
      addBtns.forEach((element) => {
        element.textContent = "+ Add another card";
        element.classList.remove("add-btn-card");
      });
    }

    const allHiddens = this.container.querySelectorAll(".hidden");

    allHiddens.forEach((element) => {
      element.setAttribute("hidden", "true");
    });
  }

  createLiElement(parent, value = "") {
    let inputValue;
    if (!value) {
      // Получаем ссылку на элемент <input> и значение value
      const inputEl = parent.querySelector(".input-title");
      inputValue = inputEl.value;

      // Проверяем, что значение не пустое
      if (!inputValue) {
        return;
      }

      // Очищаем значение Value
      inputEl.value = "";
    } else {
      inputValue = value;
    }

    // Получаем ссылку на элемент <ul>
    const cardsList = parent.querySelector(".cards");

    // Создаем новый элемент <li>
    const newCardItem = document.createElement("li");
    newCardItem.classList.add("cards-item");
    newCardItem.textContent = inputValue;
    newCardItem.setAttribute("draggable", "true");

    // Создаем кнопку <button>
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");

    // Добавляем кнопку внутрь элемента <li>
    newCardItem.appendChild(closeBtn);

    // Добавляем новый элемент <li> в <ul>
    cardsList.appendChild(newCardItem);
  }

  clear() {
    const btn = document.querySelector(".clear");
    btn.addEventListener("click", () => {
      const cardsLists = document.querySelectorAll(".cards");
      cardsLists.forEach((item) => {
        item.innerHTML = "";
      });
      localStorage.clear();
    });
  }
}
