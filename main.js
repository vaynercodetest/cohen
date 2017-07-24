$(() => {
  const root = 'https://jsonplaceholder.typicode.com';

  $.when($.get(`${root}/users`), $.get(`${root}/albums`)).done((usersData, albumsData) => {
    const twoUsers = usersData[0].filter(user => user.id <= 2),
    allAlbums = albumsData[0];
    loadTable(twoUsers, allAlbums);
    // twoUsers.forEach(user => {
    //   addUserName(user);
    //   const userAlbums = allAlbums[0].filter(album => album.userId === user.id);
    //   addUserAlbums(user, userAlbums);
    //})
  })
})

  const loadTable = (users, albums) => {
    users.forEach(user => {
      const userClass = `user user${user.id}`,
      userAlbums = albums.filter(album => album.userId === user.id);
      const userDiv = $(`<div class='${userClass}'></div>`),
      userName = $(`<h2>${user.name}</h2>`),
      table = $(`<div class='table' ondragover='allowDrop(event)' ondrop='drop(event)'></div>`),
      headerRow = $(`<div class='row striped'></div>`),
      idHeader = `<div class='column-id'>ID</div>`,
      titleHeader = `<div class='column-title'>Title</div>`,
      headerColumns = $(idHeader + titleHeader),
      albumRows = addUserAlbums(user, userAlbums);
      headerRow.append(headerColumns);
      table.append(headerRow);
      table.append(albumRows);
      userDiv.append(userName);
      userDiv.append(table);
      $('.container').append(userDiv);
    })
  }

  const addUserAlbums = (user, albums) => albums.forEach((album, i) => {
    const rowClass = i % 2 ? 'album row striped' : 'album row';
    const row = $(`<div class='${rowClass}' id='${album.id}' draggable='true' ondragstart='drag(event)'></div>`),
    idColumn = `<div class='column-id'>${album.id}</div>`,
    titleColumn = `<div class='column-title'>${album.title}</div>`,
    columns = $(idColumn + titleColumn);
    row.append(columns);
  })

  const allowDrop = e => e.preventDefault();

  const drag = e => e.dataTransfer.setData('text', e.target.id);

  const drop = e => {
    e.preventDefault();
    const rowId = e.dataTransfer.getData('text'),
    table = $(e.target).closest('.table');
    table.append(document.getElementById(rowId));
    $.ajax({
      url: `https://jsonplaceholder.typicode.com/albums/1`,
      type: 'PUT',
      data: {userId: 2}
    })
    .then(res => console.log(res))
  }



        // <div class='table' ondragover='allowDrop(event)' ondrop='drop(event)'>
        //   <div class='row striped'>
        //     <div class='column-id'>ID</div>
        //     <div class='column-title'>Title</div>
        //   </div>
        // </div>
