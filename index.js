var pdfParser = require('pdf-parser');
const util = require('util')
const pathToFile = './pdf.pdf'

const skillsSection = ['Основные навыки', 'Skills', 'Навички'];
const experienceSection = ['Experience', 'Досвід', 'Опыт работы'];
const educationSection = ['Education', 'Освіта', 'Образование'];
const languagesSection = ['Languages', 'Мови', 'Языки']

const linkedInLanguageList = [
    "Arabic",
    "Chinese",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Latin",
    "French",
    "German",
    "Hindi",
    "Indonesian",
    "Italian",
    "Japanese",
    "Korean",
    "Norwegian",
    "Polish",
    "Portuguese",
    "Malay",
    "Russian",
    "Romanian",
    "Spanish",
    "Swedish",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Арабська",
    "Китайська",
    "Чеська",
    "Датська",
    "Голландська",
    "Англійська",
    "Латинська",
    "Французька",
    "Німецька",
    "Хінді",
    "Індонезійська",
    "Італійська",
    "Японська",
    "Корейська",
    "Норвезька",
    "Польська",
    "Португальська",
    "Малайська",
    "Російська",
    "Румунська",
    "Іспанська",
    "Шведська",
    "Тайська",
    "Турецька",
    "Українська",
    "Арабский",
    "Китайский",
    "Чешский",
    "Датский",
    "Голландский",
    "Английский",
    "Латинский",
    "Французский",
    "Немецкий",
    "Хинди",
    "Индонезийский",
    "Итальянский",
    "Японский",
    "Корейский",
    "Норвежский",
    "Польский",
    "Португальский",
    "Малайский",
    "Русский",
    "Румынский",
    "Испанский",
    "Шведский",
    "Тайский",
    "Турецкий",
    "Украинский",
];

const languageLevel = ['(Native or Bilingual)', '(Full Professional)', '(Professional Working)', '(Elementary)', '(Limited Working)']

const timePeriodTranslations = {
    "год": "year",
    "года": "years",
    "рік": "year",
    "роки": "years",
    "месяц": "month",
    "месяца": "month",
    "месяцев": "months",
    "місяць": "month",
    "місяців": "months",
    "января": "january",
    "февраля": "february",
    "марта": "march",
    "апреля": "april",
    "мая": "may",
    "июня": "june",
    "июля": "july",
    "августа": "august",
    "сентября": "september",
    "октября": "october",
    "ноября": "november",
    "декабря": "december",
    "січня": "january",
    "лютого": "february",
    "березня": "march",
    "квітня": "april",
    "травня": "may",
    "червня": "june",
    "липня": "july",
    "серпня": "august",
    "вересня": "september",
    "жовтня": "october",
    "листопада": "november",
    "грудня": "december",
}

function getCompanyDurationTranslated(input) {
    const array = input.split(/(\s+)/);
    return array.map((el) => timePeriodTranslations[el] || el).join('');
}

function getPositionDurationTranslated(input) {
    console.log({hello: input.substring(
        input.indexOf("(") + 1,
        input.lastIndexOf(")")
    )})

    const duration = input.substring(
        input.indexOf("(") + 1,
        input.lastIndexOf(")")
    );
    const array = duration.split(" ");
    return array.map((el) => timePeriodTranslations[el] || el).join(' ');
}

const skills = [], education = [], languages = [];
let experience = []
const companyNameFontSize = 12;
const timeFontSize = 10.5;
const timeColor = "[24,24,24]";
const positionFontSize = 11.5;
const locationColor = "[176,176,176]";

function getDefaultCompanyInfo() {
    return {
        companyName: null,
        positions: [],
        location: null
    }
}

function isMultiplePosition(item, nextItem) {
    return item.fontSize === companyNameFontSize && nextItem.fontSize === timeFontSize && nextItem.color === timeColor;
}

function isCompany(item) {
    return item.fontSize === companyNameFontSize;
}

function isTime(item) {
    return item.fontSize === timeFontSize && item.color === timeColor;
}

function isPosition(item) {
    return item.fontSize === positionFontSize;
}

function isExperienceFull(experience, currentDuration, currentPeriod, currentPosition) {
    return !!experience.companyName && !!currentDuration && !!currentPeriod && !!currentPosition;
}

function isLocation(item) {
    return item.color === locationColor;
}

function isCvSection(input) {
    return experienceSection.includes(input) || languagesSection.includes(input) || educationSection.includes(input) || skillsSection.includes(input)
}

function parseLinkedinPDF(textContent) {
    let text = '';
    let parsingSkills = false;
    let parsingLanguages = false;
    let parsingEducation = false;
    let parsingExperience = false;
    let pageFound = 0;
    let companyInfo = getDefaultCompanyInfo();
    let currentPosition = null;
    let currentPeriod = null;
    let currentDuration = null;
    let multiplePositions = false;
    let countryCheck = false;

    for (let [key, item] of textContent.entries()) {
        if (item.text.includes('Page ')) {
            pageFound++;
        }

        if (pageFound) {
            pageFound++;
            if (pageFound >= 5) {
                pageFound = 0;
            }
            continue;
        }

        if (item.text.trim().length === 0 || item.text === '\n') {
            continue;
        }

        if (isCvSection(item.text)) {
            if (languagesSection.includes(item.text)) {
                parsingLanguages = true;
                parsingEducation = false;
                parsingExperience = false;
                parsingSkills = false;
                continue;
            }
            if (skillsSection.includes(item.text)) {
                parsingSkills = true;
                parsingEducation = false;
                parsingExperience = false;
                parsingLanguages = false;
                continue;
            }
            if (educationSection.includes(item.text)) {
                parsingEducation = true;
                parsingExperience = false;
                parsingLanguages = false;
                parsingSkills = false;
                continue;
            }
            if (experienceSection.includes(item.text)) {
                parsingExperience = true;
                parsingSkills = false;
                parsingEducation = false;
                parsingLanguages = false;
                continue;
            }
        }

        if (parsingSkills) {
            skills.push(item.text);
        }

        if (parsingLanguages) {
            const languageItem = item.text.trim();
            if (linkedInLanguageList.includes(languageItem)) {
                languages.push(languageItem);
            }
            if (languageLevel.includes(languageItem)) {
                const languagesLength = languages.length;
                languages[languagesLength - 1] = languages[languagesLength - 1].concat(' ', languageItem);
            }
        }
        if (parsingEducation) {
            const educationItem = item.text.trim();
            if (educationItem.includes('·')) {
                const educationLength = education.length;
                education[educationLength - 1] = education[educationLength - 1].concat(' ', educationItem);
                continue;
            }
            education.push(educationItem);
        }

        if (parsingExperience) {
            if (!companyInfo.companyName) {
                const nextItem = textContent[key + 1];
                multiplePositions = isMultiplePosition(item, nextItem);
                companyInfo.companyName = item.text;
                continue;
            }

            if (isPosition(item)) {
                currentPosition = item.text;
            }

            if (isCompany(textContent[key - 1]) && multiplePositions && isTime(item)) {
                console.log("hey")
                companyInfo.total = getCompanyDurationTranslated(item.text)
                continue;
            }

            if (isTime(item) && !isLocation(item)) {
                const isNextTimeToo = isTime(textContent[key + 1]);

                if (isNextTimeToo) {
                    currentPeriod = getCompanyDurationTranslated(item.text);
                }

                if (currentPeriod === getCompanyDurationTranslated(textContent[key - 1].text)) {
                    console.log({duration: item.text})
                    currentDuration = getPositionDurationTranslated(item.text);
                }
            }

            if (isExperienceFull(companyInfo, currentDuration, currentPeriod, currentPosition) && !countryCheck) {
                if (isLocation(textContent[key + 1])) {
                    countryCheck = true;
                } else {
                    const position = {
                        positionName: currentPosition,
                        duration: currentDuration,
                        period: currentPeriod
                    }
                    companyInfo.positions.push(position);
                    if (isCompany(textContent[key + 1])) {
                        experience.push(companyInfo);
                        companyInfo = getDefaultCompanyInfo();
                        multiplePositions = false;
                    }
                    currentDuration = null;
                    currentPeriod = null;
                    currentPosition = null;
                    countryCheck = false;
                }
            }

            if (isExperienceFull(companyInfo, currentDuration, currentPeriod, currentPosition) && countryCheck) {
                if (isLocation(item)) {
                    const position = {
                        positionName: currentPosition,
                        duration: currentDuration,
                        period: currentPeriod
                    }
                    companyInfo.positions.push(position);
                    companyInfo.location = item.text;
                    experience.push(companyInfo);
                    currentDuration = null;
                    currentPeriod = null;
                    currentPosition = null;
                    countryCheck = false;
                    multiplePositions = false;
                    companyInfo = getDefaultCompanyInfo();
                }
            }
        }

        continue;
    }
    experience.forEach((e) => console.log({location: e.location, positions: e.positions}))

    experience = experience.map((e) => {
        if (!e.total) {
            e.total = e.positions[0].duration
        }
        return e;
    })


    console.log({ skills, languages, education, experience })

    return text;
}

function compare(a, b) {
    const pageA = a.pageId;
    const pageB = b.pageId;
  
    let comparison = 0;
    if (pageA > pageB) {
      comparison = 1;
    } else if (pageA < pageB) {
      comparison = -1;
    }
    return comparison;
  }

async function retrievePDFdata(path) {
    const parserPromise = util.promisify(pdfParser.pdf2json);
    const { pages } = await parserPromise(path);
    if (!pages) {
        throw new Error('Failed to parse Linkedin PDF file. Error: ', error);
    }
    const sortedPages = pages.sort(compare)
    const pdfTextBlocks = [];
    sortedPages.forEach((page) => pdfTextBlocks.push(...page.texts))
    return parseLinkedinPDF(pdfTextBlocks);
}

retrievePDFdata(pathToFile)
