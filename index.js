/**
 * Jennifer Long
 * Full-Stack Software Engineer Intern
 */

/**
 * Respond with one of two variant html pages
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    // Fetch url list from given endpoint
    let url = 'https://cfw-takehome.developers.workers.dev/api/variants';
    let response = await fetch(url);
    let json = await response.json();
    let urlList = json.variants;

    // Select random URL
    var randomIndex = Math.round(Math.random());
    var randomUrl = urlList[randomIndex];

    // Fetch content from chosen URL
    let response2 = await fetch(randomUrl);

    // Return content to client
    return rewriter.transform(response2);

  } catch (e) {
    console.error(e);
    return new Response('The site is experiencing issues, try again later!', {
      headers: { 'content-type': 'text/plain' },
    });
  }
}

// Extra Credit: Uses HTMLRewriter API to replace html attributes

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



addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
