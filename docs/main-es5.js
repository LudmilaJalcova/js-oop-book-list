window.onload = function() {
  // let list = document.getElementById('book-list');
  // list.innerHTML = localStorage.getItem('list');
  const store = new Store();
  store.displayBooks();
};

// book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

function Store() {}

Store.prototype.getBooks = function() {
  let books;
  const getLocalStorageData = localStorage.getItem('books');

  if (getLocalStorageData === null) {
    books = [];
  } else {
    books = JSON.parse(getLocalStorageData);
  }
  return books;
};

Store.prototype.addBook = function(book) {
  const store = new Store();
  const books = store.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

Store.prototype.removeBook = function(isbn) {
  const store = new Store();

  const books = store.getBooks();
  books.forEach((book, index) => {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
};

Store.prototype.removeAllBooks = function() {
  localStorage.clear();
};

Store.prototype.displayBooks = function() {
  const store = new Store();

  const books = store.getBooks();

  books.forEach(book => {
    const ui = new UI();
    ui.addBookToList(book);
  });
};

// UI constructor
function UI() {}

// Add book to list
UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');
  const row = document.createElement('tr');

  const positionNumber = list.childNodes.length - 1;
  row.innerHTML = `
    <th scope="row">${positionNumber}</th>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td>
      <button
        type="button"
        class="btn btn-danger"
        id="delete-${positionNumber}">
          Delete
      </button>
    </td>
  `;
  list.appendChild(row);

  // document
  //   .getElementById(`delete-${positionNumber}`)
  //   .addEventListener('click', e => {
  //     e.target.parentElement.parentElement.remove();
  //     const list = document.getElementById('book-list').innerHTML;
  //     localStorage.setItem('list', list);
  //   });

  /* 
    <tr>
      <th scope="row">1</th>
      <td>value</td>
      <td>value</td>
      <td>value</td>
    </tr>;
  */
  // console.log(book);
};

UI.prototype.deleteBook = function(target) {
  if (target.className === 'btn btn-danger') {
    target.parentElement.parentElement.remove();
  }
};

UI.prototype.deleteAllBooks = function() {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = null;
};

UI.prototype.showAlert = function(message, status) {
  const div = document.createElement('div');
  div.className = `alert alert-${status}`;
  div.role = 'alert';
  div.appendChild(document.createTextNode(message));
  const container = document.getElementsByClassName('container')[0];
  const form = document.getElementById('book-form');

  container.insertBefore(div, form);

  setTimeout(function() {
    document.getElementsByClassName('alert')[0].remove();
  }, 3000);
};

UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};

// kazda globalna funkcia ktora sa da volat z vonku by mala byt definovana vo vonkajsom scope
function createValidation(selector) {
  if (selector.value.length > 0) {
    selector.classList.add('is-valid');
  } else {
    selector.classList.add('is-invalid');
  }
}

function clearInputs(selector) {
  selector.addEventListener('keypress', () => {
    selector.classList.remove('is-invalid');
  });
}

document.getElementById('book-form').addEventListener('submit', function() {
  const title = document.getElementById('title'),
    author = document.getElementById('author'),
    isbn = document.getElementById('isbn');

  clearInputs(title);
  clearInputs(author);
  clearInputs(isbn);

  title.classList = 'form-control';
  author.classList = 'form-control';
  isbn.classList = 'form-control';

  createValidation(title);
  createValidation(author);
  createValidation(isbn);

  const ui = new UI();

  if (
    title.value.length > 0 &&
    author.value.length > 0 &&
    isbn.value.length > 0
  ) {
    const book = new Book(title.value, author.value, isbn.value);
    const store = new Store();

    ui.addBookToList(book);
    store.addBook(book);
    ui.showAlert(
      `Pridane: kniha - ${title.value}, autor - ${author.value}, isbn - ${isbn.value}`,
      'success'
    );
    ui.clearFields();

    title.classList = 'form-control';
    author.classList = 'form-control';
    isbn.classList = 'form-control';

    return;
  }

  if (
    title.value.length === 0 &&
    author.value.length === 0 &&
    isbn.value.length === 0
  ) {
    return ui.showAlert(`Vstupne hodnoty nie su definovane`, 'danger');
  }

  if (title.value.length === 0) {
    ui.showAlert(`Vstupna hodnota TITLE nie je definovana`, 'danger');
  }
  if (author.value.length === 0) {
    ui.showAlert(`Vstupna hodnota AUTHOR nie je definovana`, 'danger');
  }
  if (isbn.value.length === 0) {
    ui.showAlert(`Vstupna hodnota ISBN nie je definovana`, 'danger');
  }
});

document.getElementById('btn-delete').addEventListener('click', function() {
  const ui = new UI();
  const store = new Store();
  ui.deleteAllBooks();
  store.removeAllBooks();
  ui.showAlert(`Vsetky knihy boli zmazane!`, 'danger');
});

document.getElementById('book-list').addEventListener('click', function(e) {
  const ui = new UI();
  const store = new Store();
  ui.deleteBook(e.target);
  const isbn = e.target.parentElement.previousElementSibling.textContent;
  store.removeBook(isbn);
  ui.showAlert(`Kniha bola zmazana!`, 'danger');
  e.preventDefault();
});

// vytvor validaciu ktora bude fungovat takto
// 1. ak je nektori input prazdny  pri kliknuti submit pridas mi klasu is-invalid a tie ostatne ktore nie su prazdne bude mat pridanu classu is-valid
// 2. ak su vsetky inputy plne nedas im ziadnu classu
// 3. po spravnom vyplneni inputov ak sme v predoslom submite mali input nevalidny upravi ho na validny teda zmaze classu is-invalid

// 1. ak kliknem na submit td pridam knihu vybehne mi zeleny alert s informaciou
// kniha {title}, {author}, {iban} bola pridana
// tento element s info pridas do body

// 2. ak kliknem na delete button all books vybehne cerveny alert s textom vsetky knihi boli zmazane
//  tento element s info pridas do body

// 3. ak kliknem na delete button zobrazi sa mi alert s textom kniha {title}, {author}, {isban} bola zmazana
//  tento element s info pridas do body

// 4. ak kliknem na submit buttom a mama nevalidny input vybehnem mi alert cervenej farby zadana vstupna hodnota {title} nie je definovana
//  tento element s info pridas do body

// 5. ak mam vsetky nevalidne vybehne mi alert tri krat s info ohladom {title}, {athor}, {isban}
//  tento element s info pridas do body

// setTimeout(() => remove(), 3000)
