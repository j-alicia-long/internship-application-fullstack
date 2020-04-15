/**
  * Jennifer Long
  * Full-Stack Software Engineer Intern
  * Project requirements + Extra credit 1 & 2
 */


/**
 * Respond with one of two variant html pages
 * @param {Request} request
 */
const COOKIE_NAME = '__url'
async function handleRequest(request) {
  // try {
    // Fetch url list from given endpoint
    let url = 'https://cfw-takehome.developers.workers.dev/api/variants';
    let urlResponse = await fetch(url);
    let json = await urlResponse.json();
    let urlList = json.variants;

    var urlIndex;
    const cookie = getCookie(request, COOKIE_NAME)
    if (cookie) {
      // Get chosen url from cookie
      urlIndex = cookie
      console.log(urlIndex)
      // Fetch content from chosen URL
      let pageResponse = await fetch(urlList[urlIndex]);
    }
    else {
      // Select random URL
      urlIndex = Math.random() < 0.5 ? 0 : 1 // 50/50 split
      // Fetch content from chosen URL
      let res = await fetch(urlList[urlIndex]);
      // Save chosen URL as cookie for user
      var pageResponse = new Response(res.body, res);
      pageResponse.headers.append('Set-Cookie', `__url=${urlIndex}`)
    }
    // Return content to client
    return rewriter.transform(pageResponse);

  // } catch (e) {
  //   console.error(e);
  //   return new Response('The site is experiencing issues, try again later!', {
  //     headers: { 'content-type': 'text/plain' },
  //   });
  // }
}


// Extra Credit 1: Uses HTMLRewriter API to replace html attributes

class AttributeRewriter {
  constructor(elementName, attributeName) {
    this.elementName = elementName
    this.attributeName = attributeName
  }
  element(element) {
    if (this.elementName == 'title') {
      element.setInnerContent("Jennifer Long's take-home project")
    }
    else if (this.elementName == 'h1#title') {
      element.setInnerContent("Hi, I'm Jennifer!")
    }
    else if (this.elementName == 'p#description') {
      element.setInnerContent("This is my take-home project")
    }
    else if (this.elementName == 'a#url') {
      const attribute = element.getAttribute(this.attributeName)
      if (attribute) {
        element.setAttribute(
          this.attributeName,
          attribute.replace('https://cloudflare.com', 'https://j-alicia-long.github.io/me/')
        )
        element.setInnerContent("Check out my personal website")
      }
    }
  }
}

const rewriter = new HTMLRewriter()
  .on('title', new AttributeRewriter('title', ''))
  .on('h1#title', new AttributeRewriter('h1#title', ''))
  .on('p#description', new AttributeRewriter('p#description', ''))
  .on('a#url', new AttributeRewriter('a#url', 'href'));


// Extra Credit 2: Save chosen url for user as cookie
/**
 * Grabs the cookie with name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to grab
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
