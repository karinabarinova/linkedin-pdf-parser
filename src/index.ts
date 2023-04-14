import {IPage, IParsedData, IPosition, ITextProperties} from './types/interfaces'
import {
    comparePages,
    createFileFromBuffer,
    deleteFile,
    EDUCATION_SECTION,
    EXPERIENCE_SECTION,
    translateTimePeriods,
    getDefaultCompanyInfo,
    translatePositionDuration,
    isCompany,
    isCvSection,
    isExperienceFull,
    isLocation,
    isMultiplePosition,
    isPosition,
    isTime,
    LANGUAGE_LEVEL,
    LANGUAGES_SECTION,
    LINKEDIN_LANGUAGE_LIST,
    SKILLS_SECTION,
    isPageSeparator,
} from './utils'
import {logger} from './logger'

/* tslint:disable */
const pdfParser = require('pdf-parser')
/* tslint:enable */
import {promisify} from 'util';

const pathToFile = 'src/pdf.pdf'
import {promises as fs} from 'fs';

function isParsingLanguages(item: ITextProperties) {
    return LANGUAGES_SECTION.indexOf(item.text) !== -1;
}

function isParsingSkills(item: ITextProperties) {
    return SKILLS_SECTION.indexOf(item.text) !== -1;
}

function isParsingEducation(item: ITextProperties) {
    return EDUCATION_SECTION.indexOf(item.text) !== -1;
}

function isParsingExperience(item: ITextProperties) {
    return EXPERIENCE_SECTION.indexOf(item.text) !== -1;
}

const PAGE_SEPARATOR_THRESHOLD = 5;
function parseLinkedinPDF(textContent: ITextProperties[]): IParsedData {
    const skills: string[] = []
    const education: string[] = []
    const languages: string[] = []
    const experience = []

    let parsingSkills = false
    let parsingLanguages = false
    let parsingEducation = false
    let parsingExperience = false
    let pageFound = 0
    let companyInfo = getDefaultCompanyInfo()
    let currentPosition: string | null = null
    let currentPeriod: string | null = null
    let currentDuration: string | null = null
    let multiplePositions = false
    let countryCheck = false

    function parseSkills(text: string) {
        skills.push(text);
    }

    function parseLanguages(text: string) {
        const languageItem = text.trim();
        if (LINKEDIN_LANGUAGE_LIST.includes(languageItem)) {
            languages.push(languageItem);
        }
        if (LANGUAGE_LEVEL.includes(languageItem)) {
            const lastLanguage = languages[languages.length - 1];
            languages[languages.length - 1] = `${lastLanguage} ${languageItem}`;
        }
    }

    function parseEducation(text: string) {
        const educationItem = text.trim();
        if (educationItem.includes('·')) {
            const lastEducation = education[education.length - 1];
            education[education.length - 1] = `${lastEducation} ${educationItem}`;
            return;
        }
        education.push(educationItem);
    }

    for (const [key, item] of textContent.entries()) {
        if (isPageSeparator(item.text)) {
            pageFound++
        }

        if (pageFound) {
            pageFound++
            if (pageFound >= PAGE_SEPARATOR_THRESHOLD) {
                pageFound = 0
            }
            continue
        }

        if (item.text.trim().length === 0 || item.text === '\n') {
            continue
        }

        if (isCvSection(item.text)) {
            if (isParsingLanguages(item)) {
                parsingLanguages = true
                parsingEducation = false
                parsingExperience = false
                parsingSkills = false
                continue
            }
            if (isParsingSkills(item)) {
                parsingSkills = true
                parsingEducation = false
                parsingExperience = false
                parsingLanguages = false
                continue
            }
            if (isParsingEducation(item)) {
                parsingEducation = true
                parsingExperience = false
                parsingLanguages = false
                parsingSkills = false
                continue
            }
            if (isParsingExperience(item)) {
                parsingExperience = true
                parsingSkills = false
                parsingEducation = false
                parsingLanguages = false
                continue
            }
        }

        if (parsingSkills) {
            parseSkills(item.text)
        }

        if (parsingLanguages) {
            parseLanguages(item.text)
        }
        if (parsingEducation) {
            parseEducation(item.text)
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
                    companyInfo.total = translateTimePeriods(item.text)
                    continue
                }

                if (isTime(item) && !isLocation(item)) {
                    const isNextTimeToo = isTime(textContent[key + 1])

                    if (isNextTimeToo) {
                        currentPeriod = translateTimePeriods(item.text)
                    }

                    if (currentPeriod === translateTimePeriods(textContent[key - 1].text)) {
                        currentDuration = translatePositionDuration(item.text)
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

    experience.forEach((e) => {
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
    try {
        const parserPromise = promisify(pdfParser.pdf2json)
        const {pages}: {pages: IPage[]} = await parserPromise(path)
        if (!pages) {
            throw new Error('Failed to parse Linkedin PDF file.')
        }
        const sortedPages = pages.sort(comparePages)
        const pdfTextBlocks: ITextProperties[] = []
        sortedPages.forEach((page: IPage) => pdfTextBlocks.push(...page.texts))
        return parseLinkedinPDF(pdfTextBlocks)
    } catch (error) {
        logger.error(error)
        throw new Error('Failed to retrieve LinkedIn PDF data.')
    }
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
