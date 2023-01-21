browser.storage.local.get({ emails: ["no emails have been captured"] /* default */ }).then(storage => {
    const storedEmails = storage.emails
    document.querySelector("textarea").innerText = storedEmails.join("\n")
}, err => console.log(err))


document.querySelector("reset").addEventListener("click", async () => {
    console.log("reset button pressed")
    if (confirm("Are you sure you want to clear all emails?")) {
        browser.storage.local.set({ emails: [] }).then(() => {
            document.querySelector("textarea").innerText = ""
        }).catch(err => {
            alert(`Error while resetting emails: ${err}`)
        })
    }
})
