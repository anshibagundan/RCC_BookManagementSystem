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
                checkbox.value = book.id; // 書籍のIDなどを設定
                console.log(checkbox.id = 'checkbox' + book.id);
                checkbox.addEventListener('click', function() {
                    Check(this.checked, book.title); // チェックボックスの状態が変わったときに Check 関数を呼び出す
                });
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
        })
        .catch(error => console.error('Error:', error));
}

function Check(checked, title) {
    console.log(1);
    if (checked) {
        document.querySelector('#borrow_book_title').innerHTML = title;
    } else {
        // チェックが外れた場合の処理をここに記述
        // 例えば、元のテキストを設定するなど
        document.querySelector('#borrow_book_title').innerHTML = '選択されていません';
    }
}



function filterBooks() {
    const searchQuery = document.getElementById('searchTitle').value.toLowerCase();
    const books = document.getElementById('modal-books-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < books.length; i++) {
        const title = books[i].getElementsByTagName('td')[0].textContent;
        if (title.toLowerCase().indexOf(searchQuery) > -1) {
            books[i].style.display = "";
        } else {
            books[i].style.display = "none";
        }
    }
}