window.onload = function fetchBooksForModal() {
    fetch('/books/')
        .then(response => response.json())
        .then(data => {
            const booksTable = document.getElementById('modal-books-table');
            booksTable.innerHTML = '<thead class="table_header"><tr><th></th><th>タイトル</th><th>ジャンル</th><th>利用者</th><th>貸出状況</th></tr></thead>';
            const tbody = document.createElement('tbody');
            data.forEach(book => {
                const row = document.createElement('tr');
                // チェックボックスを1列目に挿入
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.id = 'checkbox' + book.id;
                checkbox.type = 'checkbox';
                checkbox.name = 'selectedBooks';
                checkbox.value = book.title; // 書籍のIDなどを設定
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);
                // タイトル、ジャンル、利用者、貸出状況を挿入
                row.innerHTML += `
                        <td>${book.title}</td>
                        <td>genre</td>
                        <td>${book.user}</td>
                        <td>${book.isborrow ? '貸出中' : '利用可能'}</td>
                    `;
                tbody.appendChild(row);
            });
            booksTable.appendChild(tbody);
            // applyFunctionToAllInputs 関数を呼び出す
            applyFunctionToAllInputs();
        })
        .catch(error => console.error('Error:', error));
}

function applyFunctionToAllInputs() {
    let inputs = document.querySelectorAll("input[name=selectedBooks]");
    inputs.forEach(function (input) {
        input.addEventListener('change', function () {
            console.log(this.checked + this.value); // 選択されたらtrue、選択解除はfalse
            if (this.checked) {
                document.querySelector('#borrow_book_title').innerHTML = this.value;
            } else {
                // チェックが外れた場合の処理をここに記述
                // 例えば、元のテキストを設定するなど
                document.querySelector('#borrow_book_title').innerHTML = '選択されていません';
            }
        });
    });
}

function filterBooks() {
    const searchQuery = document.getElementById('searchTitle').value.toLowerCase();
    const books = document.getElementById('modal-books-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < books.length; i++) {
        const title = books[i].getElementsByTagName('td')[1].textContent;
        if (title.toLowerCase().indexOf(searchQuery) > -1) {
            books[i].style.display = "";
        } else {
            books[i].style.display = "none";
        }
    }
}