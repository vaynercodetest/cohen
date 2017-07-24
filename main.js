$(() => {
  const root = 'https://jsonplaceholder.typicode.com';

  $.when($.get(`${root}/users`), $.get(`${root}/albums`)).done((usersData, albumsData) => {
    const twoUsers = usersData[0].filter(user => user.id <= 2),
    userAlbums = albumsData[0].filter(album => album.userId <= 2);
    loadTable(twoUsers, userAlbums);
  })
})

let loadedUsers, currentAlbums;

const loadTable = (users, albums) => {
  loadedUsers = users;
  currentAlbums = albums;
  $('.container').empty();
  users.forEach(user => {
    const userAlbums = albums.filter(album => album.userId === user.id),
    userDiv = $(`<div class='user'></div>`),
    userName = $(`<h3>${user.name}</h3>`),
    table = $(`<div class='table' id='${user.id}' ondragover='allowDrop(event)' ondrop='drop(event)'></div>`),
    headerRow = $(`<div class='row striped'></div>`),
    idHeader = `<div class='column-id'>ID</div>`,
    titleHeader = `<div class='column-title'>Title</div>`,
    headerColumns = $(idHeader + titleHeader),
    tableBody = $(`<div class='table-body'></div>`);
    userDiv.append(userName);
    headerRow.append(headerColumns);
    table.append(headerRow);
    userAlbums.forEach((album, i) => {
      const rowClass = i % 2 ? 'album row striped' : 'album row',
      row = $(`<div class='${rowClass}' id='${album.id}' data-album='${album.title}' draggable='true' ondragstart='drag(event)'></div>`),
      idColumn = `<div class='column-id'>${album.id}</div>`,
      titleColumn = `<div class='column-title'>${album.title}</div>`,
      columns = $(idColumn + titleColumn);
      row.append(columns);
      tableBody.append(row);
    })
    table.append(tableBody);
    userDiv.append(table);
    $('.container').append(userDiv);
  })
}

const allowDrop = e => e.preventDefault();

const drag = e => e.dataTransfer.setData('text', e.target.id);

/*
There's one minor bug where the album 1 title becomes undefined when it's dragged to the other table. I'm going to work on this some more to solve it, but wanted to submit this in the meantime.
*/
const drop = e => {
  e.preventDefault();
  const rowId = e.dataTransfer.getData('text'),
  table = $(e.target).closest('.table'),
  tableId = table.attr('id'),
  row = document.getElementById(rowId),
  albumName = row.dataset.album;
  $.ajax({
    url: `https://jsonplaceholder.typicode.com/albums/${rowId}`,
    type: 'PUT',
    data: {userId: tableId, title: albumName}
  })
  .then(res => {
    currentAlbums = currentAlbums.map(album => album.id == rowId ? res : album);
    loadTable(loadedUsers, currentAlbums);
  })
}
