var popupbox=document.querySelector(".popup-box");
var popupoverlay=document.querySelector(".popup-overlay");
var addpopupbutton=document.getElementById("add-popup-button");
var cancelpopup=document.getElementById("cancel-popup");
addpopupbutton.addEventListener("click",function()
{
    popupbox.style.display="block";
    popupoverlay.style.display="block";

});
cancelpopup.addEventListener("click",function(event)
{
    event.preventDefault();
    popupbox.style.display="none";
    popupoverlay.style.display="none";

})
//select over sll container

// book container ,add -book button, 
// input book title, author input,book description 

var container=document.querySelector(".container")

var addbook=document.getElementById("add-book")
var booktitleinput=document.getElementById("book-title-input");
var bookauthorinput=document.getElementById("book-author-input");
var bookdescriptioninput=document.getElementById("short-description-input");
var deletebook=document.getElementById("del");

var div=document.createElement("div");
div.setAttribute("class","book-container");

async function fetchNotes() {
     console.log("Fetching books...");
 try{
        const response= await fetch('https://684a131e45f4c0f5ee738fee.mockapi.io/Booksky')
         const books=await response.json();
          console.log(books);
         return books;
       
   } 
   catch(error)
   {
    console.log(error.message);
   }

}

async function populate(books) {
    console.log(books);

books.forEach(book => {
    div=document.createElement("div");
    div.setAttribute("class","book-container"); 
     div.innerHTML=`
    <h2>${book.booktitle}</h2>
    <h5>${book.bookauthor}</h5>
    <p>${book.bookdescription}</p>
    <button class="delete-book" id="${book.id}">Delete</button>`;
    container.append(div);
});


}

(async()=>
{
    books =await fetchNotes();
    localStorage.setItem('books',JSON.stringify(books));  
    await populate(books);
   
})();
//Add Button click
addbook.addEventListener("click",function(event){
    event.preventDefault();
    let newBook={
        id: Date.now().toString(),
        booktitle: booktitleinput.value,
        bookauthor: bookauthorinput.value,
        bookdescription: bookdescriptioninput.value
    }
    div=document.createElement("div");
    div.setAttribute("class","book-container"); 
    div.setAttribute("data-id",newBook.id);
    div.innerHTML=`
    <h2>${newBook.booktitle}</h2>
    <h5>${newBook.bookauthor}</h5>
    <p>${newBook.bookdescription}</p>
    <button class="delete-book" id="${newBook.id}">Delete</button>`;
    container.append(div);

    fetch('https://684a131e45f4c0f5ee738fee.mockapi.io/Booksky', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    })
        .then(savedBook => {
       console.log(savedBook); 
        div.setAttribute("data-id", savedBook.id);
        div.querySelector(".delete-book").setAttribute("data-id", savedBook.id);
        // Save to localStorage
        const books = JSON.parse(localStorage.getItem("books")) || [];
        books.push(savedBook);
        localStorage.setItem("books", JSON.stringify(books));

        alert('Note created successfully!');
        })
        .catch(error => {
            alert('Note creation failed, Try Again!:', error.message);
        })
    
    booktitleinput.value = "";
    bookauthorinput.value = "";
    bookdescriptioninput.value = "";
    popupoverlay.style.display="none";
    popupbox.style.display="none";
})

//Delete Button Click
function renderFromLocalStorage() {
    container.innerHTML = ""; 
    const books = JSON.parse(localStorage.getItem("books")) || [];
    populate(books); 
}

container.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON" && event.target.classList.contains("delete-book")) {
        const delid= event.target.getAttribute("id");
        console.log(delid);
        let option=confirm('Are you sure do you want to delete?');
        console.log(option);
        if(option)
        {
                fetch(`https://684a131e45f4c0f5ee738fee.mockapi.io/Booksky/${delid}`,
                 {
                            method:'DELETE',
                         
                 })
                .then(()=>
                {
                    let books = JSON.parse(localStorage.getItem("books")) || [];
                    books=books.filter(book=>book.id!=delid);
                    localStorage.setItem("books", JSON.stringify(books));
                    renderFromLocalStorage();
                    alert('note deleted');

                })
                .catch(()=>
                {
                    alert('note delete failed');
                })
        }
        else
        {
            return;
        }      
    }
});
