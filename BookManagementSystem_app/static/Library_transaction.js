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
                checkbox.className = book.id;
                checkbox.type = 'checkbox';
                checkbox.name = 'selectedBooks';
                checkbox.value = book.title; // 書籍のIDなどを設定
                // book.isborrow が true の場合、チェックボックスを無効化
                if (book.isborrow) {
                    checkbox.disabled = true;
                }
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);
                // タイトル、ジャンル、利用者、貸出状況を挿入
                row.innerHTML += `
                    <td>${book.title}</td>
                    <td>${book.genre_id === 1 ? 'Python' : (book.genre_id === 2 ? 'Java' : book.genre_id)}</td>
                    <td>${book.user_id}</td>
                    <td>${book.isborrow ? '貸出中' : '利用可能'}</td>
                `;

                tbody.appendChild(row);
            });
            booksTable.appendChild(tbody);


            const gridContainer = document.getElementById('grid-books-table');
            data.forEach(book => {
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');

                gridItem.style.boxShadow = '0px 0px 2px rgba(0, 0, 0, 0.5)';
                gridItem.style.backgroundColor = 'aliceblue';

                const checkboxDiv = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.className = book.id;
                checkbox.type = 'checkbox';
                checkbox.name = 'selectedBooks';
                checkbox.value = book.title; // 書籍のIDなどを設定
                // book.isborrow が true の場合、チェックボックスを無効化
                if (book.isborrow) {
                    checkbox.disabled = true;
                }
                checkboxDiv.appendChild(checkbox);
                gridItem.appendChild(checkboxDiv);

                // タイトルを追加
                const titleDiv = document.createElement('div');
                titleDiv.textContent = book.title;
                gridItem.appendChild(titleDiv);

                // ジャンルを追加
                const genreDiv = document.createElement('div');
                genreDiv.textContent = book.genre_id === 1 ? 'Python' : (book.genre_id === 2 ? 'Java' : book.genre_id);
                gridItem.appendChild(genreDiv);

                // 利用者を追加
                const userDiv = document.createElement('div');
                userDiv.textContent = book.user_id !== null ? book.user_id : 'null';
                gridItem.appendChild(userDiv);


                // 貸出状況を追加
                const statusDiv = document.createElement('div');
                statusDiv.textContent = book.isborrow ? '貸出中' : '利用可能';
                gridItem.appendChild(statusDiv);

                gridContainer.appendChild(gridItem);
            });

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
                let selectedBooks = document.querySelector('#borrow_book_title');
                if (selectedBooks.innerHTML !== '選択されていません') {
                    selectedBooks.innerHTML += '<br>';
                    selectedBooks.innerHTML += this.value;
                } else {
                    selectedBooks.innerHTML = this.value;
                }
            } else {
                let selectedBooks = document.querySelector('#borrow_book_title');
                // チェックが外れた場合、対応する <br> も減らす
                let newValue = selectedBooks.innerHTML.replace(this.value, '');
                let brCount = (newValue.match(/<br>/g) || []).length;
                if (brCount > 0) {
                    newValue = newValue.replace(/<br>/, '');
                }
                selectedBooks.innerHTML = newValue;

                // テキストが空になった場合に '選択されていません' を表示
                if (newValue.trim() === '') {
                    selectedBooks.innerHTML = '選択されていません';
                }
            }

        });
    });
}

function filterBooks() {
    const searchQuery = document.getElementById('searchTitle').value.toLowerCase();
    const selectedGenre = document.getElementById('genre').value;
    const selectedCando = document.getElementById('can_do').value;

    // テーブル内の書籍をフィルタリング
    const tableBooks = document.getElementById('modal-books-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < tableBooks.length; i++) {
        const title = tableBooks[i].getElementsByTagName('td')[1].textContent;
        const genre = tableBooks[i].getElementsByTagName('td')[2].textContent;
        const can_do = tableBooks[i].getElementsByTagName('td')[4].textContent;

        // タイトルとジャンル、貸出状況の両方が検索クエリと一致する場合のみ表示
        if (title.toLowerCase().indexOf(searchQuery) > -1 && (selectedGenre === 'All' || genre === selectedGenre) && (selectedCando === 'All' || can_do === selectedCando)) {
            tableBooks[i].style.display = "";
        } else {
            tableBooks[i].style.display = "none";
        }
    }

    // グリッド内の書籍をフィルタリング
    const gridBooks = document.querySelectorAll('.grid-item');
    gridBooks.forEach(book => {
        const title = book.querySelector('div:nth-child(2)').textContent; // タイトルの要素を取得
        const genre = book.querySelector('div:nth-child(3)').textContent; // ジャンルの要素を取得
        const can_do = book.querySelector('div:nth-child(5)').textContent; // 貸出状況の要素を取得

        // タイトルとジャンル、貸出状況の両方が検索クエリと一致する場合のみ表示
        if (title.toLowerCase().indexOf(searchQuery) > -1 && (selectedGenre === 'All' || genre === selectedGenre) && (selectedCando === 'All' || can_do === selectedCando)) {
            book.style.display = "";
        } else {
            book.style.display = "none";
        }
    });
}

function toggleTable(type) {
    if (type === 'list') {
        document.getElementById('modal-books-table').style.display = 'table';
        document.getElementById('grid-books-table').style.display = 'none';
    } else if (type === 'grid') {
        document.getElementById('modal-books-table').style.display = 'none';
        document.getElementById('grid-books-table').style.display = 'grid';
    }
}



// ダイアログを表示する関数
function openModal() {
    document.getElementById('borrowReturnModal').style.display = 'block';

    // チェックされた書籍を取得
    const checkedBooksContainer = document.getElementById('checked_books');
    checkedBooksContainer.innerHTML = ''; // 以前の内容をクリア

    const checkboxes = document.querySelectorAll('input[name="selectedBooks"]:checked');
    checkboxes.forEach(checkbox => {
        const bookId = checkbox.className.replace('checkbox', '');
        const bookTitle = checkbox.value;

        const bookInfo = document.createElement('p');
        bookInfo.textContent = `ID: ${bookId}, タイトル: ${bookTitle}`;
        checkedBooksContainer.appendChild(bookInfo);
        // toggleBorrowReturn(bookId, true);
    });
}

// ダイアログを閉じる関数
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
    fetch(`/books/update/${bookId}/`, {
        method: 'POST',
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