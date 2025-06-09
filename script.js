const tg = window.Telegram.WebApp;
tg.expand();

const markerList = [];
const markerUl = document.getElementById('marker-list');
const form = document.getElementById('marker-form');
const addBtn = document.getElementById('add-marker-btn');
const setBtn = document.getElementById('set-marker-btn');

addBtn.onclick = () => {
  form.style.display = 'block';
};

setBtn.onclick = () => {
  const city = document.getElementById('city-select').value;
  const comment = document.getElementById('marker-comment').value;
  const user = tg.initDataUnsafe?.user?.username || 'demo_user';
  const timestamp = new Date().toLocaleString();

  if (!city || !comment) {
    alert('Выберите город и введите комментарий.');
    return;
  }

  const marker = { city, comment, timestamp, user, id: Date.now(), replies: [] };
  markerList.push(marker);
  renderMarkers();
  form.style.display = 'none';
  document.getElementById('marker-comment').value = '';
};

function renderMarkers() {
  markerUl.innerHTML = '';
  markerList.forEach(marker => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${marker.city}</b> (${marker.timestamp}) [${marker.user}]:<br/>
      ${marker.comment}
      <div>
        <input type="text" placeholder="Ответ..." id="reply-${marker.id}"/>
        <button onclick="replyToMarker(${marker.id})">Комментировать</button>
      </div>
      <ul>
        ${marker.replies.map(r => `<li>${r.time} [${r.user}]: ${r.text}</li>`).join('')}
      </ul>
    `;
    markerUl.appendChild(li);
  });
}

window.replyToMarker = function(id) {
  const input = document.getElementById(`reply-${id}`);
  const text = input.value;
  if (!text) return;

  const marker = markerList.find(m => m.id === id);
  marker.replies.push({
    text,
    user: tg.initDataUnsafe?.user?.username || 'demo_user',
    time: new Date().toLocaleTimeString()
  });
  renderMarkers();
};
