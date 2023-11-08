//Using es6 classes instead of the es5 constructor and prototype methods


// Book class
class Book{
    constructor(title, author, isbn, status){
        const borrower = document.querySelector('#borrower').value;

        this.title = title;
        this.author =  author;
        this.isbn = isbn;
        this.status = `${status} ${borrower}`;
    }
}


// UI class
class UInterface{

    //methods

    // Add Book to List
    addBookToList(book){
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

    // show alert
    showAlert(message, className){
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


    // clear fields
    clearFields(){
        document.querySelector('#book-title').value = '';
        document.querySelector('#book-author').value = '';
        document.querySelector('#book-isbn').value = '';
        document.querySelector('#borrower').value = '';
    }


    // remove Book
    removeBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }



}



//Local Storage class
class Storage{
    // get books
    static getBooksFromLS(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    // display books
    static displayBooksFromLS(){
        const books = Storage.getBooksFromLS();

        // loop through the books array
        books.forEach(function(book){
            //insantiate the UInterface object
            const ui = new UInterface;

            ui.addBookToList(book);
        });
    }

    // Add books
    static addBookToLS(book){
      const books = Storage.getBooksFromLS();

      books.push(book);

      localStorage.setItem('books', JSON.stringify(books));
    }

    // remove books
    static removeBookFromLS(isbn){
        const books = Storage.getBooksFromLS();

        // loop through the books array
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        // set LocalStorage again
        localStorage.setItem('books', JSON.stringify(books));

    }


}


// DOM Load event
document.addEventListener('DOMContentLoaded', Storage.displayBooksFromLS);


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

        // Add book to LS
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
    Storage.removeBookFromLS(e.target.parentElement.previousElementSibling.previousElementSibling.textContent); //to target the ISBN

    //showAlert
    ui.showAlert('Book Removed!', 'success')
});