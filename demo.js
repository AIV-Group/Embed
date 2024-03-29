function init(t, e, l = "450px", s = "550px") {
  let i = `https://gptsalebot.com/chat-app/${t}`,
    o =
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-circle-2-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5.821 4.91c3.898 -2.765 9.469 -2.539 13.073 .536c3.667 3.127 4.168 8.238 1.152 11.897c-2.842 3.447 -7.965 4.583 -12.231 2.805l-.232 -.101l-4.375 .931l-.075 .013l-.11 .009l-.113 -.004l-.044 -.005l-.11 -.02l-.105 -.034l-.1 -.044l-.076 -.042l-.108 -.077l-.081 -.074l-.073 -.083l-.053 -.075l-.065 -.115l-.042 -.106l-.031 -.113l-.013 -.075l-.009 -.11l.004 -.113l.005 -.044l.02 -.11l.022 -.072l1.15 -3.451l-.022 -.036c-2.21 -3.747 -1.209 -8.392 2.411 -11.118l.23 -.168z" stroke-width="0" fill="currentColor"></path></svg>',
    r = document.createElement("div");
  (r.style.position = "fixed"),
    (r.style.bottom = "20px"),
    (r.style.right = "20px"),
    (r.style.width = "60px"),
    (r.style.height = "60px"),
    (r.style.zIndex = "1357"),
    (r.style.backgroundColor = e),
    (r.style.borderRadius = "50%"),
    (r.style.color = "#fff"),
    (r.style.display = "flex"),
    (r.style.justifyContent = "center"),
    (r.style.alignItems = "center"),
    (r.style.cursor = "pointer"),
    (r.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px"),
    (r.innerHTML = o),
    r.setAttribute("tabindex", "-1");

  let $ = document.createElement("iframe");
  ($.style.zIndex = "999"),
    ($.style.position = "fixed"),
    ($.style.bottom = "100px"),
    ($.style.right = "20px"),
    ($.style.width = l),
    ($.style.height = s),
    ($.style.border = "1px solid #ffffff00"),
    ($.style.display = "none"),
    ($.style.borderRadius = "10px"),
    ($.style.boxShadow =
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"),
    ($.style.opacity = "0"),
    ($.style.transition = "opacity 0.2s ease-in-out"),
    ($.style.userSelect = "none"),
    ($.style.maxHeight = "65vh"),
    ($.style.maxWidth = "90vw"),
    $.style.setProperty("-moz-user-select", "none"),
    $.style.setProperty("-webkit-user-select", "none"),
    $.style.setProperty("-khtml-user-select", "none"),
    ($.src = i);
  let a = !1;
  r.addEventListener("click", () => {
    a
      ? (($.style.opacity = "0"),
        setTimeout(() => {
          $.style.display = "none";
        }, 200),
        (a = !1),
        (r.innerHTML = o))
      : (($.style.display = "block"),
        setTimeout(() => {
          $.style.opacity = "1";
        }, 0),
        (a = !0),
        (r.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>'));
  }),
    document.body.appendChild(r),
    document.body.appendChild($);
}
function ready(t) {
  if ("loading" !== document.readyState) {
    t();
    return;
  }
  document.addEventListener("DOMContentLoaded", t);
}
!(function () {
  let t = document
      .querySelector('script[data-chat-service="Salebot"][data-bot-id]')
      .getAttribute("data-bot-id"),
    e =
      document
        .querySelector('script[data-chat-service="Salebot"][data-bubble-color]')
        ?.getAttribute("data-bubble-color") ?? "rgb(57 186 248)",
    l =
      document
        .querySelector('script[data-chat-service="Salebot"][data-chat-width]')
        ?.getAttribute("data-chat-width") ?? "450px",
    s =
      document
        .querySelector('script[data-chat-service="Salebot"][data-chat-height]')
        ?.getAttribute("data-chat-height") ?? "550px";
  ready(() => init(t, e, l, s));
})();
