const API_URL = 'http://localhost:3000'

const formInput = document.querySelector('.form-input')
const formBtn = document.querySelector('.form-btn')
const bookList = document.querySelector('.booklist')

let booksList = []
let formText = ''
let editMode = false

formInput.addEventListener('input', ({ target: { value } }) => {
    formText = value
})

formBtn.addEventListener('click', (event) => {
    event.preventDefault()

    if(!editMode) {
        const newBook = {
            title: formText,
            isCompleted: false
        }
    
        createBook(newBook)
        return
    } 
})

async function getBooks() {
    const url = `${API_URL}/books`
    const books = await makeRequest(url)
    console.log(books)
    booksList = books
    render()
}
 
async function createBook(book) {
    const url = `${API_URL}/books`
    const addedBook = await makeRequest(url, 'POST', book)
    booksList = [...booksList, addedBook]
    render()
    clearForm()
}

async function deleteBook(bookId) {
    const url = `${API_URL}/books/${bookId}`
    await makeRequest(url, 'DELETE')
}

function render() {
    if(!bookList.length) {
        bookList.innerHTML = 'Нет'
        return
    }

    bookList.innerHTML = ''

    bookList.forEach((book) => {
        const li = document.createElement('li')
        li.classList.add('book_list_item')

        if(book.isCompleted) {
            li.classList.add('is_completed')
        }

        li.innerHTML = `
            <input id="${book.id}" class="checkbox" type="checkbox" ${book.isCompleted ? 'checked' : ''}/>
            <span>${book.title}</span>
            <div class="actions_wrap">
                <button class="edit_btn" id="${book.id}">Изменить</button>
                <button class="delete_btn" id="${book.id}">Удалить</button>
            </div>
        `

        bookList.append(li)
    })
}

async function makeRequest(url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        })

        return await response.json()
    } catch(error) {
        console.log ('Inside error happend', 'error')
    }
}

function clearForm() {
    formText = ''
    formInput.value = ''
}