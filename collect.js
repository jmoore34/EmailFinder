document.body.style.border = "5px solid yellow";
const emailRegex = /[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*/g
const pageEmails = [...document.body.innerText.match(emailRegex)]
console.log({pageEmails})

browser.storage.local.get({emails: [] /* default to [] */ }).then(storage => {
    // console.log({storage})

    const existingEmails = storage.emails

    var allEmails = existingEmails.concat(pageEmails)

    // console.log({existingEmails, allEmails})

    // uniq
    allEmails = [...new Set(allEmails)]

    // sort
    allEmails = allEmails.sort((a,b) => emailCompare(a,b))

    browser.storage.local.set({ emails: allEmails }).then(
        () => {
            document.body.insertAdjacentHTML("afterbegin", `
                <div style="background-color: red; color: white; padding: 8px;">
                    <p style="color: white; font-size: 2em;">Found ${pageEmails.length} email${pageEmails.length == 1 ? "" : "s"}</h2>
                    <p style="color: white">${pageEmails.join(", ")}</p>
                </div>
            `)
            document.body.style.border = "5px solid red";
        },
        error => {
            alert(`Error when saving emails: ${error}`)
        }
    )
}, error => {
    alert(`Error while reading existing email list: ${error}`)
})

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
