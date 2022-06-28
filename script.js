let bookArray = [];
const EVENT_CUSTOM = "render-books";
const DATA_BUKU = "data_buku";
const SAVED_BOOK = "saved_buku";
const LOAD_BOOK = "load_buku";
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");

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

const span = document.querySelector("span");
const checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("change", function (e) {
  if (e.target.checked) {
    span.innerText = "Selesai dibaca";
  } else {
    span.innerText = "Sudah Selesai dibaca";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const simpanBuku = document.getElementById("inputBook");
  simpanBuku.addEventListener("submit", function (e) {
    e.preventDefault();
    addNewBook();
    simpanBuku.reset();
  });

  const search = document.getElementById("searchBook");
  search.addEventListener("keyup", function (e) {
    e.preventDefault();
    cariBuku();
  });

  search.addEventListener("submit", function (e) {
    e.preventDefault();
    cariBuku();
  });

  if (checkStorage()) {
    loadDataFromStorage();
  }

});

document.addEventListener(SAVED_BOOK, () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener(LOAD_BOOK, () => {
  refreshDataFromBooks();
});

function addNewBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const checked = document.getElementById("inputBookIsComplete").checked;

  const generateBookID = generateBookId();
  const object = bookObject(generateBookID, title, author, year, checked);

  bookArray.push(object);

  document.dispatchEvent(new Event(EVENT_CUSTOM));
  updateDataToStorage();
}

function makeNewBook(object) {
  const { id, title, author, year, isCompleted } = object;

  const buatJudul = document.createElement("h3");
  buatJudul.innerText = title;

  const buatPenulis = document.createElement("p");
  buatPenulis.innerText = "Penulis: " + author;

  const buatTahun = document.createElement("p");
  buatTahun.innerText = "Tahun: " + year;

  const greenBtn = document.createElement("button");
  greenBtn.classList.add("green");

  const redBtn = document.createElement("button");
  redBtn.classList.add("red");
  redBtn.innerText = "Hapus buku";
  redBtn.addEventListener("click", function () {
    hapusBuku(id);
  });

  const div = document.createElement("div");
  div.classList.add("action");
  div.append(greenBtn, redBtn);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(buatJudul, buatPenulis, buatTahun, div);

  if (isCompleted) {
    greenBtn.innerText = "Belum selesai dibaca";
    greenBtn.addEventListener("click", function () {
      belumSelesai(id);
    });
    completeBookshelfList.append(article);
  } else {
    greenBtn.innerText = "Selesai dibaca";
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

function hapusBuku(idBuku) {
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
  const searchBook = document.getElementById("searchBookTitle");
  const filter = searchBook.value.toUpperCase();
  const bookItem = document.querySelectorAll(
    "section.book_shelf > .book_list > .book_item"
  );

    for (let i = 0; i < bookItem.length; i++) {
        let txtValue;
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

const checkStorage = () => {
  if (typeof Storage === undefined) {
    alert("Your Browser not support web storage");
    return false;
  }

  return true;
};

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

const updateDataToStorage = () => {
  if (checkStorage()) simpanData();
};

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

document.addEventListener(EVENT_CUSTOM, function () {
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
});  
