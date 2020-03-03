window.onload = () => {
  // let list = document.getElementById('book-list');
  // list.innerHTML = localStorage.getItem('list');
  Store.displayBooks;

  console.log(new Store());
  console.log(new Book('1', '2', '3'));
  console.log(new UI());
};
// to iste
// document.addEventListener('DOMContentLoaded', Store.displayBooks);

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class Store {
  static getBooks() {
    let books;
    const getLocalStorageData = localStorage.getItem('books');

    if (getLocalStorageData === null) {
      books = [];
    } else {
      books = JSON.parse(getLocalStorageData);
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeAllBooks() {
    localStorage.clear();
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }
}

class UI {
  addBookToList(book) {
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
  }

  deleteBook(target) {
    if (target.className === 'btn btn-danger') {
      target.parentElement.parentElement.remove();
    }
  }

  deleteAllBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = null;
  }

  showAlert(message, status) {
    const div = document.createElement('div');
    div.className = `alert alert-${status}`;
    div.role = 'alert';
    div.appendChild(document.createTextNode(message));
    const container = document.getElementsByClassName('container')[0];
    const form = document.getElementById('book-form');

    container.insertBefore(div, form);

    setTimeout(() => {
      document.getElementsByClassName('alert')[0].remove();
    }, 3000);
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  createValidation(selector) {
    if (selector.value.length > 0) {
      selector.classList.add('is-valid');
    } else {
      selector.classList.add('is-invalid');
    }
  }

  clearInputs(selector) {
    selector.addEventListener('keypress', () => {
      selector.classList.remove('is-invalid');
    });
  }
}

document.getElementById('book-form').addEventListener('submit', () => {
  const title = document.getElementById('title'),
    author = document.getElementById('author'),
    isbn = document.getElementById('isbn');

  const ui = new UI();

  ui.clearInputs(title);
  ui.clearInputs(author);
  ui.clearInputs(isbn);

  title.classList = 'form-control';
  author.classList = 'form-control';
  isbn.classList = 'form-control';

  ui.createValidation(title);
  ui.createValidation(author);
  ui.createValidation(isbn);

  if (
    title.value.length > 0 &&
    author.value.length > 0 &&
    isbn.value.length > 0
  ) {
    const book = new Book(title.value, author.value, isbn.value);

    ui.addBookToList(book);
    Store.addBook(book);
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

document.getElementById('btn-delete').addEventListener('click', () => {
  const ui = new UI();
  ui.deleteAllBooks();
  Store.removeAllBooks();
  ui.showAlert(`Vsetky knihy boli zmazane!`, 'danger');
});

document.getElementById('book-list').addEventListener('click', e => {
  const ui = new UI();
  ui.showAlert(`Kniha bola zmazana!`, 'danger');
  ui.deleteBook(e.target);
  const isbn = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbn);
  e.preventDefault();
});
