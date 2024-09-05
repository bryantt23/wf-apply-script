{
    const COMPANIES_TO_APPLY_TO = 21
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
        for (let i = 0; i < COMPANIES_TO_APPLY_TO; i++) {
            await showCompanyJobs(companies[i])
        }
    }

    async function showCompanyJobs(element) {
        const links = element.querySelectorAll("a")
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
            else if (softwareLinks.length > 0) {
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
            // Now find the sibling div that contains the buttons                
            const siblingDiv = parentDiv.nextElementSibling

            if (siblingDiv) {
                const buttons = siblingDiv.querySelectorAll("button")
                buttons[1].click()

                let clickedApply = false
                let attempts = 0
                while (!clickedApply && attempts < 3) {
                    const allButtons = document.querySelectorAll('button')
                    for (const button of allButtons) {
                        if (button.textContent.trim() === 'Send application') {
                            console.log("🚀 ~ clickApplyButton ~ Attempting to click Send application button...");
                            button.click()
                            clickedApply = true
                            break
                        }
                    }
                    if (!clickedApply) {
                        console.log(`🚀 ~ clickApplyButton ~ Could not apply... Retry attempt ${attempts + 1}`);
                        attempts++
                        await delay(1000)
                    }
                }
            } else {
                console.log("Sibling div not found.");
            }
        }
    }

    const applyForJob = async () => {
        let attempts = 0
        let jobLinks = []
        while (jobLinks.length === 0 && attempts < 3) {
            await delay(1000)
            const modal = document.querySelector('.ReactModal__Content ')
            const links = modal ? modal.querySelectorAll('a') : []
            jobLinks = Array.from(links).filter(link => link.hasAttribute('href') && link.getAttribute("href").startsWith("/jobs"))
            attempts++
        }
        console.log("🚀 ~ applyForJob ~ jobLinks:", jobLinks)

        if (jobLinks.length > 0) {
            await clickOnJobLink(jobLinks)
        }
        else {
            console.log("🚀 ~ applyForJob ~ No job links found after 3 attempts, moving to the next job...");
        }
    }

    start()
}