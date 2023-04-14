import {IPage, IPosition, ITextProperties} from './types/interfaces'
import {
    comparePages,
    createFileFromBuffer,
    deleteFile,
    educationSection,
    experienceSection,
    getCompanyDurationTranslated,
    getDefaultCompanyInfo,
    getPositionDurationTranslated,
    isCompany,
    isCvSection,
    isExperienceFull,
    isLocation,
    isMultiplePosition,
    isPosition,
    isTime,
    languageLevel,
    languagesSection,
    linkedInLanguageList,
    skillsSection,
} from './utils'
import {logger} from './logger'

const pdfParser = require('pdf-parser')
const util = require('util')
const pathToFile = 'src/pdf.pdf'
const fs = require('fs').promises

function parseLinkedinPDF(textContent: ITextProperties[]) {
    const skills: string[] = []
    const education: string[] = []
    const languages: string[] = []
    let experience = []
    let parsingSkills = false
    let parsingLanguages = false
    let parsingEducation = false
    let parsingExperience = false
    let pageFound = 0
    let companyInfo = getDefaultCompanyInfo()
    let currentPosition = null
    let currentPeriod = null
    let currentDuration = null
    let multiplePositions = false
    let countryCheck = false

    for (const [key, item] of textContent.entries()) {
        if (item.text.includes('Page ')) {
            pageFound++
        }

        if (pageFound) {
            pageFound++
            if (pageFound >= 5) {
                pageFound = 0
            }
            continue
        }

        if (item.text.trim().length === 0 || item.text === '\n') {
            continue
        }

        if (isCvSection(item.text)) {
            if (languagesSection.includes(item.text)) {
                parsingLanguages = true
                parsingEducation = false
                parsingExperience = false
                parsingSkills = false
                continue
            }
            if (skillsSection.includes(item.text)) {
                parsingSkills = true
                parsingEducation = false
                parsingExperience = false
                parsingLanguages = false
                continue
            }
            if (educationSection.includes(item.text)) {
                parsingEducation = true
                parsingExperience = false
                parsingLanguages = false
                parsingSkills = false
                continue
            }
            if (experienceSection.includes(item.text)) {
                parsingExperience = true
                parsingSkills = false
                parsingEducation = false
                parsingLanguages = false
                continue
            }
        }

        if (parsingSkills) {
            skills.push(item.text)
        }

        if (parsingLanguages) {
            const languageItem = item.text.trim()
            if (linkedInLanguageList.includes(languageItem)) {
                languages.push(languageItem)
            }
            if (languageLevel.includes(languageItem)) {
                const languagesLength: number = languages.length
                languages[languagesLength - 1] = languages[languagesLength - 1].concat(' ', languageItem)
            }
        }
        if (parsingEducation) {
            const educationItem = item.text.trim()
            if (educationItem.includes('·')) {
                const educationLength: number = education.length
                education[educationLength - 1] = education[educationLength - 1].concat(' ', educationItem)
                continue
            }
            education.push(educationItem)
        }

        if (parsingExperience) {
            if (!isExperienceFull(companyInfo, currentDuration, currentPeriod, currentPosition)) {
                if (!companyInfo.companyName && isCompany(item)) {
                    const nextItem = textContent[key + 1]
                    multiplePositions = isMultiplePosition(item, nextItem)
                    companyInfo.companyName = item.text
                    continue
                }

                if (isPosition(item)) {
                    currentPosition = item.text
                }

                if (isCompany(textContent[key - 1]) && multiplePositions && isTime(item)) {
                    companyInfo.total = getCompanyDurationTranslated(item.text)
                    continue
                }

                if (isTime(item) && !isLocation(item)) {
                    const isNextTimeToo = isTime(textContent[key + 1])

                    if (isNextTimeToo) {
                        currentPeriod = getCompanyDurationTranslated(item.text)
                    }

                    if (currentPeriod === getCompanyDurationTranslated(textContent[key - 1].text)) {
                        currentDuration = getPositionDurationTranslated(item.text)
                    }
                }
            }

            if (isExperienceFull(companyInfo, currentDuration, currentPeriod, currentPosition) && !countryCheck) {
                if (isLocation(textContent[key + 1])) {
                    countryCheck = true
                    continue
                } else {
                    const position: IPosition = {
                        positionName: currentPosition,
                        duration: currentDuration,
                        period: currentPeriod,
                    }
                    if (isCompany(textContent[key + 1])) {
                        companyInfo.positions.push(position)
                        experience.push(companyInfo)
                        companyInfo = getDefaultCompanyInfo()
                        multiplePositions = false
                        currentDuration = null
                        currentPeriod = null
                        currentPosition = null
                    }
                    if (isPosition(textContent[key + 1])) {
                        companyInfo.positions.push(position)
                        currentDuration = null
                        currentPeriod = null
                        currentPosition = null
                    }
                    countryCheck = false
                }
            }

            if (isExperienceFull(companyInfo, currentDuration, currentPeriod, currentPosition) && countryCheck) {
                if (isLocation(item)) {
                    companyInfo.location = item.text
                    countryCheck = false
                }
                if (isCompany(textContent[key + 1])) {
                    const position = {
                        positionName: currentPosition,
                        duration: currentDuration,
                        period: currentPeriod,
                    }
                    companyInfo.positions.push(position)
                    experience.push(companyInfo)
                    currentDuration = null
                    currentPeriod = null
                    currentPosition = null
                    countryCheck = false
                    multiplePositions = false
                    companyInfo = getDefaultCompanyInfo()
                }
            }
        }

        continue
    }

    experience = experience.map((e) => {
        if (!e.total) {
            e.total = e.positions[0].duration
        }
        return e
    })

    return {
        skills,
        languages,
        education,
        experience,
    }
}

async function retrievePDFdata(path: string) {
    const parserPromise = util.promisify(pdfParser.pdf2json)
    const {pages}: {pages: IPage[]} = await parserPromise(path)
    if (!pages) {
        throw new Error('Failed to parse Linkedin PDF file.')
    }
    const sortedPages = pages.sort(comparePages)
    const pdfTextBlocks: ITextProperties[] = []
    sortedPages.forEach((page: IPage) => pdfTextBlocks.push(...page.texts))
    return parseLinkedinPDF(pdfTextBlocks)
}

async function main() {
    const buffer = await fs.readFile(pathToFile)
    const fileName = await createFileFromBuffer(buffer)
    const info = await retrievePDFdata(fileName)
    await deleteFile(fileName)
    return info
}

; (async () => {
    try {
        const expertInfo = await main()
        logger.info(expertInfo)
    } catch (e) {
        logger.error(e)
    }
})()
