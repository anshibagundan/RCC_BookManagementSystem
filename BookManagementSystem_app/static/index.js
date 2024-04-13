function fetchBooks() {
    fetch('/books/')
        .then(response => response.json())
        .then(data => {
            const booksTable = document.getElementById('books');
            booksTable.innerHTML = '';
            data.forEach(book => {
                const borrowStatus = book.isborrow ? '貸出中' : '利用可能';
                const borrower = book.isborrow ? book.user : 'なし'; // 貸出中なら貸出者を表示
                const row = `
                <tr>
                    <td>${book.title}</td>
                    <td> genre </td>
                    <td>${borrower}</td> <!-- 貸出者の情報を表示 -->
                    <td>${borrowStatus}</td> <!-- 貸出状態を表示 -->
                </tr>
            `;
                booksTable.innerHTML += row;
            });
        })
        .catch(error => console.error('Error:', error));
}
function showBorrowReturnModal() {
    document.getElementById('borrowReturnModal').style.display = 'block';
    fetchBooksForModal();
}
function closeModal() {
    document.getElementById('borrowReturnModal').style.display = 'none';
}
function toggleBorrowReturn(bookId, isBorrow) {
    document.getElementById('loadingPopup').style.display = 'block';
    let user = isBorrow ? prompt("貸出者の名前を入力してください:") : '';

    if (isBorrow && (user === null || user.trim() === '')) {
        alert('貸出者の名前が入力されていません。');
        document.getElementById('loadingPopup').style.display = 'none';
        return;
    }
    //
    fetch(`/books/update/${bookId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isborrow: isBorrow, user: user.trim() }), // user.trim() を使って空白を削除
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchBooksForModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('操作に失敗しました。');
        })
        .finally(() => {
            // すべてのポップアップを閉じる
            fetchBooks();
            document.getElementById('loadingPopup').style.display = 'none';
            closeModal(); // 貸出/返却モーダルを閉じる関数
        });
}


window.onload = function fetchBooksForModal() {
    fetch('/books/')
        .then(response => response.json())
        .then(data => {
            const booksTable = document.getElementById('modal-books-table');
            booksTable.innerHTML = '<thead><tr><th>タイトル</th><th>操作</th></tr></thead>';
            const tbody = document.createElement('tbody');
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${book.title}</td>`;
                const actionCell = document.createElement('td');
                const actionButton = document.createElement('button');
                actionButton.className = 'btn';
                actionButton.innerText = book.isborrow ? '返却' : '貸出';
                actionButton.onclick = function () { toggleBorrowReturn(book.id, !book.isborrow); };
                actionCell.appendChild(actionButton);
                row.appendChild(actionCell);
                tbody.appendChild(row);
            });
            booksTable.appendChild(tbody);
        })
        .catch(error => console.error('Error:', error));
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



