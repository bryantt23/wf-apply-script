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
        await closeCompany()
    }

    start()
}