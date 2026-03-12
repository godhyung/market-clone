function clacTime(timestamp) {
  //한국은 영국인가 표준시에서 +9시간이 추가된 시간임. 따라서 맞춰줄 필요가 있음
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
  const time = new Date(curTime - timestamp);
  const hour = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  if (hour > 0) return `${hour}시간 전`;
  else if (min > 0) return `${min}분 전`;
  else if (sec > 0) return `${sec}초 전`;
  else return "방금 전";
}

const renderData = (data) => {
  const main = document.querySelector("main");

  //foreach는 for memo in memos와 같음. data.forEach((obj) => { ... })에서 {} 안에 함수가 들어가야함
  //[]는 순서 정해진 "배열(자바스크립트), 리스트(파이썬)" {}는 이름표가 붙은 "객체(자바스크립트), 딕셔너리(파이썬)"
  data
    .reverse()
    .sort((a, b) => a.Date)
    .forEach(async (obj) => {
      const Div = document.createElement("div");
      Div.className = "item-list";

      const imgDiv = document.createElement("div");
      imgDiv.className = "item-list__img";
      const img = document.createElement("img");
      const res = await fetch(`/images/${obj.id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      img.src = url;

      const InfoDiv = document.createElement("div");
      InfoDiv.className = "item-list__info";

      const InfoTitleDiv = document.createElement("div");
      InfoTitleDiv.className = "item-list__info-title";
      InfoTitleDiv.innerText = obj.title;

      const InfoMetaDiv = document.createElement("div");
      InfoMetaDiv.className = "item-list__info-meta";
      InfoMetaDiv.innerText = obj.place + " " + clacTime(obj.insertAt);

      const InfoPriceDiv = document.createElement("div");
      InfoPriceDiv.className = "item-list__info-price";
      InfoPriceDiv.innerText = obj.price;

      imgDiv.appendChild(img);

      InfoDiv.appendChild(InfoTitleDiv);
      InfoDiv.appendChild(InfoMetaDiv);
      InfoDiv.appendChild(InfoPriceDiv);

      Div.appendChild(imgDiv);
      Div.appendChild(InfoDiv);

      main.appendChild(Div);
    });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data);
};

fetchList();
