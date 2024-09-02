{
    const delay = (time = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    const closeCompany = async () => {
        const closeButton = document.querySelector('[data-test="closeButton"]')
        await delay(3000)
        console.log("🚀 ~ closeCompany ~ closeButton:", closeButton)
        closeButton.click()
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
        await closeCompany()
    }

    start()
}