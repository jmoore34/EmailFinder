browser.storage.local.get({ emails: ["no emails have been captured"] /* default */ }).then(storage => {
    const storedEmails = storage.emails
    document.querySelector("textarea").value = storedEmails.join("\r\n")
    document.querySelector("#status > span").innerText = `Total ${storedEmails.length} stored emails    `
}, err => console.log(err))


document.getElementById("reset").addEventListener("click", async () => {
    console.log("reset button pressed")
        browser.storage.local.set({ emails: [] }).then(() => {
            document.querySelector("textarea").value = ""
            document.querySelector("#status").innerText = "Stored emails have been cleared"
        }).catch(err => {
            alert(`Error while resetting emails: ${err}`)
        })
})
