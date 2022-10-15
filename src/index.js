let bookArray = [];
const EVENT_CUSTOM = "render-books";
const DATA_BUKU = "data_buku";
const SAVED_BOOK = "saved_buku";
const LOAD_BOOK = "load_buku";
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");
const span = document.querySelector("span");
const checkbox = document.getElementById("inputBookIsComplete");
const title = document.getElementById("inputBookTitle");
const author = document.getElementById("inputBookAuthor");
const year = document.getElementById("inputBookYear");
const checked = document.getElementById("inputBookIsComplete");
const addBookButton = document.getElementById("addBookButton");
const formInputSection = document.getElementById("formInputSection");
const search = document.getElementById("searchBook");
const simpanBuku = document.getElementById("inputBook");
const searchBookTitle = document.querySelector("#searchBookTitle");

function showFormInput() {
  formInputSection.classList.remove("hidden");
}

function generateBookId() {
  return +new Date();
}

function bookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function keyUpHandler(e) {
  e.preventDefault();
  cariBuku();
}
function searchButtonHandler(e) {
  e.preventDefault();
  cariBuku();
}

function inputBookHandler(e) {
  e.preventDefault();
  addNewBook();
  simpanBuku.reset();
}

function submitBookHandler() {
  if (checkStorage()) {
    loadDataFromStorage();
  }
}

function refreshed() {
  refreshDataFromBooks();
}

function closeForm() {
  formInputSection.classList.add("hidden");
}

function addNewBook() {
  const titles = title.value;
  const authors = author.value;
  const years = Number(year.value);
  const isCompleted = checked.checked;

  const generateBookID = generateBookId();
  const object = bookObject(
    generateBookID,
    titles,
    authors,
    years,
    isCompleted
  );

  bookArray.push(object);

  document.dispatchEvent(new Event(EVENT_CUSTOM));
  updateDataToStorage();
}

function makeNewBook(object) {
  const { id, title, author, year, isCompleted } = object;

  const buatJudul = document.createElement("h3");
  buatJudul.classList.add("book_item_title");
  buatJudul.innerText = title;

  const buatPenulis = document.createElement("em");
  buatPenulis.innerText = `- ${author}`;

  const buatTahun = document.createElement("p");
  buatTahun.innerText = year;

  const greenBtn = document.createElement("button");

  const redBtn = document.createElement("button");
  redBtn.classList.add("deleteBtn");
  redBtn.innerText = "Delete";
  redBtn.addEventListener("click", function () {
    deleteBookHandler(id);
  });

  const div = document.createElement("div");
  div.classList.add("action");
  div.append(greenBtn, redBtn);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(buatJudul, buatPenulis, buatTahun, div);

  if (isCompleted) {
    greenBtn.innerText = "Undone";
    greenBtn.classList.add("undoneBtn");
    greenBtn.addEventListener("click", function () {
      belumSelesai(id);
    });
    completeBookshelfList.append(article);
  } else {
    greenBtn.innerText = "Done";
    greenBtn.classList.add("doneBtn");
    greenBtn.addEventListener("click", function () {
      sudahSelesai(id);
    });
    incompleteBookshelfList.append(article);
  }

  return article;
}

function findIndexBuku(idBuku) {
  for (const index in bookArray) {
    if (bookArray[index].id === idBuku) {
      return index;
    }
  }
  return -1;
}

function findBook(idBuku) {
  for (const bookItem of bookArray) {
    if (bookItem.id === idBuku) {
      return bookItem;
    }
  }
  return null;
}

function belumSelesai(idBuku) {
  const bukuTarget = findBook(idBuku);
  if (bukuTarget == null) return;
  bukuTarget.isCompleted = false;
  document.dispatchEvent(new Event(EVENT_CUSTOM));
  updateDataToStorage();
}

function deleteBookHandler(idBuku) {
  const bukuTarget = findIndexBuku(idBuku);
  if (bukuTarget === -1) return;
  bookArray.splice(bukuTarget, 1);
  document.dispatchEvent(new Event(EVENT_CUSTOM));
  updateDataToStorage();
}

function sudahSelesai(idBuku) {
  const bukuTarget = findBook(idBuku);
  if (bukuTarget == null) {
    return;
  }
  bukuTarget.isCompleted = true;
  document.dispatchEvent(new Event(EVENT_CUSTOM));
  updateDataToStorage();
}

function cariBuku() {
  const bookTitle = searchBookTitle.value.toLowerCase();
  const buku = document.querySelectorAll(".book_item");
  for (const book of buku) {
    const judulBuku = book.querySelector(".book_item_title").innerText;
    if (judulBuku.toLowerCase().indexOf(bookTitle) != -1) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  }
}

function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Your Browser not support web storage");
    return false;
  }

  return true;
}

function simpanData() {
  const simpan = JSON.stringify(bookArray);
  localStorage.setItem(DATA_BUKU, simpan);
  document.dispatchEvent(new Event(SAVED_BOOK));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(DATA_BUKU);
  let data = JSON.parse(serializedData);
  if (data !== null) bookArray = data;
  document.dispatchEvent(new Event(LOAD_BOOK));
}

function updateDataToStorage() {
  if (checkStorage()) simpanData();
}

function refreshDataFromBooks() {
  for (let book of bookArray) {
    const newBook = makeNewBook(book);
    if (book.isCompleted === true) {
      completeBookshelfList.append(newBook);
    } else {
      incompleteBookshelfList.append(newBook);
    }
  }
}

function evenCustomHandlers() {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";
  for (const bookItem of bookArray) {
    const elemenBuku = makeNewBook(bookItem);
    if (bookItem.isCompleted === false) {
      incompleteBookshelfList.append(elemenBuku);
    } else {
      completeBookshelfList.append(elemenBuku);
    }
  }
}

simpanBuku.addEventListener("submit", inputBookHandler);
search.addEventListener("keyup", keyUpHandler);
search.addEventListener("submit", searchButtonHandler);
document.addEventListener("DOMContentLoaded", submitBookHandler);
document.addEventListener(SAVED_BOOK, closeForm);
document.addEventListener(LOAD_BOOK, refreshed);
addBookButton.addEventListener("click", showFormInput);
document.addEventListener(EVENT_CUSTOM, evenCustomHandlers);
