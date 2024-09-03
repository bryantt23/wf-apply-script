{
    const delay = (time = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    const closeCompany = async () => {
        const closeButton = document.querySelector('[data-test="closeButton"]')
        if (closeButton) {
            closeButton.click()
        }
        else {
            console.error("Close button not found");
        }
    }

    const start = async () => {
        const companies = document.querySelectorAll('[data-test="StartupResult"]');
        for (let i = 0; i < 3; i++) {
            await showCompanyJobs(companies[i])
        }
    }

    async function showCompanyJobs(element) {
        const links = element.querySelectorAll("a")
        console.log("🚀 ~ showCompanyJobs ~ links:", links)
        links[0].click()
        await delay(1000); // Give it 1 second to load the job details
        await applyForJob()
        await closeCompany()
    }

    const clickOnJobLink = async (jobLinks) => {
        if (jobLinks.length === 1) {
            await clickApplyButton(jobLinks[0])
        }
        else {
            const frontEndLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("front"))
            const fullStackLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("full"))
            const softwareLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("software"))

            if (frontEndLinks.length > 0) {
                await clickApplyButton(frontEndLinks[0])
            }
            else if (fullStackLinks.length > 0) {
                await clickApplyButton(fullStackLinks[0])
            }
            else if (softwareLinks) {
                await clickApplyButton(softwareLinks[0])
            }
            else {
                await clickApplyButton(jobLinks[0])
            }
        }
    }

    const clickApplyButton = async (element) => {
        const parentDiv = element.closest('div')
        if (parentDiv) {
            console.log(`🚀 ~ Parent Div of Link ${element}:`, parentDiv);

            // Now find the sibling div that contains the buttons                
            const siblingDiv = parentDiv.nextElementSibling

            if (siblingDiv) {
                console.log("🚀 ~ clickApplyButton ~ siblingDiv:", siblingDiv)
                const buttons = siblingDiv.querySelectorAll("button")
                console.log("🚀 ~ clickApplyButton ~ buttons:", buttons)
                buttons[1].click()
                await delay(3000); // Give it 1 second to load

                let clickedApply = false
                const allButtons = document.querySelectorAll('button')
                for (const button of allButtons) {
                    if (button.textContent.trim() === 'Send application') {
                        console.log("🚀 ~ clickApplyButton ~ Sending application...");
                        button.click()
                        clickedApply = true
                        break
                    }
                }
                if (!clickedApply) {
                    console.log("🚀 ~ clickApplyButton ~ Could not apply...");
                }
            } else {
                console.log("Sibling div not found.");
            }

        }

    }

    const applyForJob = async () => {
        await delay(1000)
        const modal = document.querySelector('.ReactModal__Content ')
        await delay(1000)
        const links = modal.querySelectorAll('a')
        const jobLinks = Array.from(links).filter(link => link.hasAttribute('href') && link.getAttribute("href").startsWith("/jobs"))
        // debugger
        await clickOnJobLink(jobLinks)
    }

    start()
}