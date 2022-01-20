/**
 *  @file
 *
 *  Cookies are data, stored in small text files, on your computer.
 *  <p>
 *  When a web server has sent a web page to a browser, the connection is shut down, and the server forgets everything about the user.
 *  </p>
 *  Cookies were invented to solve the problem "how to remember information about the user":
 *  <p>
 *  When a user visits a web page, his/her name can be stored in a cookie.
 *  Next time the user visits the page, the cookie "remembers" his/her name.<br>
 *  Cookies are saved in name-value pairs like:
 *  </p>
 *  username = John Doe
 *  <p>
 *  When a browser requests a web page from a server, cookies belonging to the page are added to the request. <br>
 *  This way the server gets the necessary data to "remember" information about users.
 *  </p>
 *  @author Paulo Roma.
 *  @since 05/05/2021
 *  @see https://www.w3schools.com/js/js_cookies.asp
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 *  @see https://alightanalytics.com/alight-insights/safari-first-party-cookies/
 *  @see <a href="../../7-mysql/showcode.php?f=8.7">php</a>
 */

/** A Function to Set a Cookie.
 *
 *  @param {String} cname name of the cookie.
 *  @param {String} cvalue the value of the cookie.
 *  @param {Number} exdays the number of days until the cookie should expire.
 *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 */
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  // Default at 365 days.
  exdays = exdays || 365;
  // Get unix milliseconds at current time plus number of days
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  // cvalue must be encoded because it can be utf-8
  document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};SameSite=Lax`; // cname + "=" + cvalue + ";" + expires + ";path=/";
  // console.log(document.cookie);
  // username=Paulo Roma; __utma=30314110.38272483.1627839402.1627839402.1627839402.1; __utmc=30314110; __utmz=30314110.1627839402.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)
}

/** Deleting a cookie is very simple.
 *
 *  You don't have to specify a cookie value when you delete a cookie.
 *  Just set the expires parameter to a passed date.
 *
 *  @param {String} cname name of the cookie.
 */
function deleteCookie(cname) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  // console.log(document.cookie);
}

/** <p>A function that returns the value of a specified cookie.</p>
 *
 * console.log(decodeURIComponent(document.cookie).split(';'));<br>
 * Array (4)
 * <ul style="list-style-type:none;">
 *  <li> 0 "username=Paulo Roma" </li>
 *  <li> 1 " __utma=30314110.38272483.1627839402.1627839402.1627839402.1" </li>
 *  <li> 2 " __utmc=30314110" </li>
 *  <li> 3 " __utmz=30314110.1627839402.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)" </li>
 * </ul>
 *
 *  @param {String} cname name of the cookie.
 *  @return {String} the value of the cookie.
 *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
 *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
 *  @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
function getCookie(cname) {
  var name = cname.trimStart() + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");

  let cookie = ca.find((row) => row.trim().startsWith(name));
  return cookie == undefined ? "" : cookie.split("=")[1];
}

/** A Function to check a Cookie.
 *  If the cookie is set it will display a greeting.
 *  <p>
 *  If the cookie is not set, it will display a prompt box, asking for the value of the cookie,
 *  and stores the cookie for 30 days, by calling the setCookie function.
 *  </p>
 * @param {String} cname name of the cookie.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend
 */
function checkCookie(cname) {
  var user = getCookie(cname);
  if (user != "") {
    //alert(`Welcome back ${user}`);
    let div = document.getElementsByClassName("square")[0];
    const para = document.createElement("h2");
    const node = document.createTextNode(`Welcome back ${user}`);
    para.appendChild(node);
    div.prepend(para);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie(cname, user, 30);
      displayAllCookies();
    }
  }
}

/**
 * Display all cookies.
 */
function displayCookies() {
  var ca = document.cookie.split(";");

  document.write('<div class="square">');
  document.write("<p>Press ctrl-Esc to delete the 'username' cookie!</p>");
  document.write(
    `<h2>Found the following ${ca.length} cookies:</h2>\n<ul style="margin-left:em;">`
  );
  for (c of ca) {
    let cookie = c.split("=")[0].trimStart();
    let value = getCookie(cookie);
    if (cookie == "username")
      document.write(`<li style="color: red;">${cookie}: ${value}</li>`);
    else document.write(`<li>${cookie}: ${value}</li>`);
  }
  document.write("</ul>");
  if (ca.length > 0) {
    document.write(`<p>Click <a href=${window.location.pathname}>here</a> to go back
        and <a href="https://klauslaube.com.br/2012/04/05/entendendo-os-cookies-e-sessoes.html">here</a> to know more.</p>`);
  }
  document.write("</div>");
}

/**
 * Display all cookies by creating new DOM nodes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 */
function displayAllCookies() {
  var ca = document.cookie.split(";");

  let div = document.getElementsByClassName("square")[0];
  let newdiv = document.createElement("div");
  if (div == undefined) document.body.appendChild(newdiv);
  else document.body.replaceChild(newdiv, div);
  newdiv.className = "square";
  newdiv.innerHTML += "<p>Press ctrl-Esc to delete the 'username' cookie!</p>";
  newdiv.innerHTML += `<h2>Found the following ${ca.length} cookies:</h2>\n<ul style="margin-left:em;">`;
  for (c of ca) {
    let cookie = c.split("=")[0].trimStart();
    let value = getCookie(cookie);
    if (cookie == "username")
      newdiv.innerHTML += `<li style="color: red;">${cookie}: ${value}</li>`;
    else newdiv.innerHTML += `<li>${cookie}: ${value}</li>`;
  }
  if (ca.length > 0) {
    newdiv.innerHTML += `<p>Click <a href=${window.location.pathname}>here</a> 
      to go back and <a href="https://klauslaube.com.br/2012/04/05/entendendo-os-cookies-e-sessoes.html">here</a> 
      to know more.</p>`;
  }
}
