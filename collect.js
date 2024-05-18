collect()

const bannerClass = "emailFinderExtensionBanner"

// scan again for emails whenever the user interacts with the page
// (e.g. pulling up more emails w/o going to a new page)
document.addEventListener("click", event => {
    collect()
})

async function collect() {
    browser.storage.local.get({ emails: [] }).then(storage => {

        // remove existing banners we've already inserted
        [...document.getElementsByClassName(bannerClass)].forEach(banner => banner.remove())

        const emailRegex = /[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)+/g
        const pageEmails = [...document.body.innerText.match(emailRegex)]
        console.log({ pageEmails })

        const existingEmails = storage.emails

        var allEmails = existingEmails.concat(pageEmails)

        // uniq
        allEmails = [...new Set(allEmails)]

        // sort
        allEmails = allEmails.sort((a, b) => emailCompare(a, b))

        browser.storage.local.set({ emails: allEmails }).then(
            () => {
                const emailListId = "emailList"
                // XSS note: all interpolated values below are either constants, a length, or a string created from a length

                const banner = document.createElement("div")
                banner.className = bannerClass
                banner.style.backgroundColor = "red"
                banner.style.color = "white"
                banner.style.padding = "8px"

                const header = document.createElement("p")
                header.style.color = "white"
                header.style.fontSize = "2em"
                header.innerText = `Found ${pageEmails.length} email${pageEmails.length == 1 ? "" : "s"}`
                banner.appendChild(header)

                const list = document.createElement("p")
                list.style.color = "white"
                list.innerText = pageEmails.join(", ")
                banner.appendChild(list)

                document.body.insertAdjacentElement("afterbegin", banner)
            },
            error => {
                alert(`Error when saving emails: ${error}`)
            }
        )
    }, error => {
        alert(`Error while reading existing email list: ${error}`)
    })
}

/// Sort emails first by text after @, then text before @
function emailCompare(email1, email2) {
    if (typeof email1 != "string") {
        return 1 // put jank emails at the bottom
    } else if (typeof email2 != "string") {
        return -1
    }

    // console.log({email1, email2})
    const email1Parts = email1.split("@")
    const email2Parts = email2.split("@")
    if (email1Parts.length < 2) {
        return 1 // put jank emails at the bottom
    } else if (email2Parts.length < 2) {
        return -1
    }

    // first compare by text after @
    const comparison = caseInsensitiveCompare(email1Parts[1], email2Parts[1])
    if (comparison != 0) {
        return comparison
    } else {
        // then compare by text before @
        return caseInsensitiveCompare(email1Parts[0], email2Parts[0])
    }
}

function caseInsensitiveCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'accent' })
}
