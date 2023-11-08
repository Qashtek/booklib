// book constructor
function Book(title, author, isbn, status){

    const borrower = document.querySelector('#borrower').value;

    this.title = title;
    this.author =  author;
    this.isbn = isbn;
    this.status = `${status} ${borrower}`;
}



// ui constructor
function UInterface(){}

//UI proto method for adding book to list
UInterface.prototype.addBookToList = function(book){
    // booklist element
    const booklist = document.querySelector('#book-list');

    //add rows to booklist
    const row = document.createElement('tr');
    // adding columns into row
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.status}</td>
        <td><a href='#' class='delete'>X</a></td>
    `;

    // append row into booklist
    booklist.appendChild(row);

}


//show alert UI proto method
UInterface.prototype.showAlert = function(message, className){
    this.message = message;
    this.className = className;

    // form parent Element
    const container = document.querySelector('.container');
    //creating alert element
    const alertDiv = document.createElement('div');
    //adding class to alert element
    alertDiv.className = `alert ${this.className}`;
    //creating text node for alert message
    alertDiv.appendChild(document.createTextNode(message));
    // Inserting alert element before the form
    container.insertBefore(alertDiv, form);



    //Alert timeout
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);

}


// clear fields method
UInterface.prototype.clearFields = function(){
    document.querySelector('#book-title').value = '';
    document.querySelector('#book-author').value = '';
    document.querySelector('#book-isbn').value = '';
    document.querySelector('#borrower').value = '';
}

//UI method for removing book from List
UInterface.prototype.removeBook = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}




//Local Storage Object constructor
function Storage(){}

// STATIC METHODS FOR THE STORAGE OBJECT
// Fetch books from LS
Storage.fetchBooks = function(){
    let books;
    // check LS
    if(localStorage.getItem('books') === null){
        books = [];
    }else{
        books = JSON.parse(localStorage.getItem('books')); //parsing it as a JSON object
    }

    return books; // returns the value of books
}

//Display Books from LS
Storage.displayBooksFromLS = function(){
    const books = Storage.fetchBooks();

    // Loop through the books array
    books.forEach(function(book){
        // instantiate the UInterface object
        const ui = new UInterface;

        ui.addBookToList(book);
    });
}
    
// Adding book to LS
Storage.addBookToLS = function(book){
    const books = Storage.fetchBooks(); // to fetch books from LS, if any

    books.push(book); // to push the new book into the books array in LS

    localStorage.setItem('books', JSON.stringify(books)); //setting books back into LS

}

// removing book from LS
Storage.removeBookFromLS = function(isbn){
    const books = Storage.fetchBooks();

    // loop through the books array
    books.forEach(function(book, index){
        if(book.isbn === isbn ){
            books.splice(index,1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
}



// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', Storage.displayBooksFromLS); // display books from LS at page load

//Event for borrower's info
document.querySelector('#book-status').addEventListener('change', function(){
    if(document.querySelector('#book-status').value == 'Loaned to' || document.querySelector('#book-status').value == 'Borrowed from'){
        document.querySelector('#borrower').style.display = 'inline';
    }else{
        document.querySelector('#borrower').style.display = 'none';
    }
    
});







// Event Listener for adding book when form is submitted
const form = document.querySelector('#book-form');
form.addEventListener('submit', function(e){
    
    //Getting form values from the UI
    const title = document.querySelector('#book-title').value,
     author = document.querySelector('#book-author').value,
     isbn = document.querySelector('#book-isbn').value,
     status = document.querySelector('#book-status').value;

    //instantiating new book
    const book = new Book(title, author, isbn, status);

    // Instantiate UI
    const ui = new UInterface();
    
    if(title === '' || author === '' || isbn ===''){
        ui.showAlert('Add a Book and try again!', 'error')
    }else{
         //add to book to list
        ui.addBookToList(book);

        // Adding book to Local Storage
        Storage.addBookToLS(book);

        // show success alert
        ui.showAlert('Book Added!', 'success');

        //clear input fields
        ui.clearFields();
    }

    



    e.preventDefault();
});


//Event Listener for removing books
document.querySelector('#book-list').addEventListener('click', function(e){
    //instantiate UI
    const ui = new UInterface();

    // remove Book from UI
    ui.removeBook(e.target);

    // remove book from LS
    Storage.removeBookFromLS(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    //showAlert
    ui.showAlert('Book Removed!', 'success')
});