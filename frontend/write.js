async function handleSubmitForm(event) {
  event.preventDefault();
  const body = new FormData(form);
  //표준시로 보내줌(한국보다 9시간 느림)
  body.append("insertAt", new Date().getTime());
  try {
    const res = await fetch("/items", {
      method: "POST",
      body,
    });
    const data = await res.json();
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error("제출 중 에러 발생:", e);
  }
}

const form = document.getElementById("write-form");
form.addEventListener("submit", handleSubmitForm);
