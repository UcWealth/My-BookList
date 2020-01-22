// Book class: Represents a book
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI Tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // disapper after 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        },3000)
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
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
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', e => {
    // prevent default actual submit
    e.preventDefault();
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please Fill in all fields', 'danger');
    } 
    else 
    {
        // instantiate book
        const book = new Book(title,author,isbn);
    
        // Add book to list
        UI.addBookToList(book);

        // Add book to LocalStorage
        Store.addBook(book);

        // Clear fields after submission
        UI.clearFields();

        // Display successful message
        UI.showAlert('Book added successfully!', 'info')
    }

})

// Event: Remove book
document.querySelector('#book-list').addEventListener('click', e => {
    UI.deleteBook(e.target);
    UI.showAlert('Book deleted!', 'warning');
    // delte from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})