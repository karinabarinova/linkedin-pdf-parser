var pdfParser = require('pdf-parser');
const util = require('util')
const pathToFile = './pdf.pdf'

const skillsSection = ['Основные навыки', 'Skills', 'Навички'];
const experienceSection = ['Experience', 'Досвід', 'Опыт работы'];
const educationSection = ['Education', 'Освіта', 'Образование'];
const languagesSection = ['Languages', 'Мови', 'Языки']

const experienceBlockDraft = {
    companyName: null,
    positions: [
        // {
        //     positionName: null,
        //     period: null,
        //     duration: null
        // }
    ],
    location: null // can be null;
}

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
    const array = input.split(" ");
    return array.map((el) => timePeriodTranslations[el] || el).join(' ');
}

function getPositionDurationTranslated(input) {
    const duration = input.substring(
        input.indexOf("(") + 1,
        input.lastIndexOf(")")
    );
    // console.log({input})
    // console.log({duration})
    const array = duration.split(" ");
    // console.log({array})
    return array.map((el) => timePeriodTranslations[el] || el).join(' ');
}

function findDuration(string) {
    const duration = string.substring(
        string.indexOf("(") + 1,
        string.lastIndexOf(")")
    );
    return !!duration
}

function isPositionDuration(string) {
    return /([a-z]+)\s*((19|20)\d{2})/.test(string)
}

function isExperienceDuration(string) {
    const yearsRegex = /(\d+)\s*(year|го|р)/
    const monthsRegex = /(\d+)\s*(m|м)/

    return yearsRegex.test(string) || monthsRegex.test(string);
}

//
// let text = '';
// 							let parsingSkills = false;
// 							let parsingLanguages = false;
// 							let parsingEducation = false;
// 							let parsingExperience = false;
// 							let pageFound = 0;
// 							let companyInfo = {};
// 							let currentPosition = null;
// 							let currentPeriod = null;
// 							let tempCurrentPeriod = null;
// 							let multiplePositions = false;
// 							let countryCheck = false;
// 							for (let [key, item] of textContent.items.entries()) {
// 								if (item.str.includes('Page ')) {
// 									pageFound++;
// 								}
// 								if (pageFound) {
// 									pageFound++;
// 									if (pageFound >= 5) {
// 										pageFound = 0;
// 									}
// 									continue;
// 								}

// 								if (item.str.trim().length === 0 || item.str === '\n') {
// 									continue;
// 								}

// 								if (experienceSection.includes(item.str) || languagesSection.includes(item.str) || educationSection.includes(item.str) || skillsSection.includes(item.str)) {
// 									if (languagesSection.includes(item.str)) {
// 										parsingLanguages = true;
// 										parsingEducation = false;
// 										parsingExperience = false;
// 										parsingSkills = false;
// 										continue;
// 									}
// 									if (skillsSection.includes(item.str)) {
// 										parsingSkills = true;
// 										parsingEducation = false;
// 										parsingExperience = false;
// 										parsingLanguages = false;
// 										continue;
// 									}
// 									if (educationSection.includes(item.str)) {
// 										parsingEducation = true;
// 										parsingExperience = false;
// 										parsingLanguages = false;
// 										parsingSkills = false;
// 										continue;
// 									}
// 									if (experienceSection.includes(item.str)) {
// 										parsingExperience = true;
// 										parsingSkills = false;
// 										parsingEducation = false;
// 										parsingLanguages = false;
// 										continue;
// 									}
// 								}

// 								if (parsingSkills) {
// 									skills.push(item.str);
// 								}

// 								if (parsingLanguages) {
// 									const languageItem = item.str.trim();
// 									if (linkedInLanguageList.includes(languageItem)) {
// 										languages.push(languageItem);
// 									}
// 									if (languageLevel.includes(languageItem)) {
// 										const languagesLength = languages.length;
// 										languages[languagesLength - 1] = languages[languagesLength - 1].concat(' ', languageItem);
// 									}
// 								}
// 								if (parsingEducation) {
// 									const educationItem = item.str.trim();
// 									if (educationItem.includes('·')) {
// 										const educationLength = education.length;
// 										education[educationLength - 1] = education[educationLength - 1].concat(' ', educationItem);
// 										continue;
// 									}
// 									education.push(educationItem);
// 								}
// 								if (parsingExperience) {
// 									console.log('item', item.str);
// 									// console.log({ companyInfo })
// 									if (!companyInfo?.companyName) {
// 										companyInfo.companyName = item.str;
// 										if (isExperienceDuration(textContent.items[key + 1])) {
// 											multiplePositions = true;
// 										}
// 										if (!multiplePositions) {
// 											companyInfo.period = getPositionDurationTranslated(item.str);
// 										}
// 										continue;
// 									}

// 									if (multiplePositions && companyInfo.companyName && currentPosition && currentPeriod) {
// 										const position = {
// 											positionName: currentPosition,
// 											period: currentPeriod
// 										}
// 										companyInfo.positions.push(position);
// 									}

// 									if (countryCheck) {
// 										countryCheck = false;
// 										continue;
// 									}

// 									if (!multiplePositions && companyInfo.companyName && currentPosition && currentPeriod) {
// 										//here we want to push the data;
// 										const position = {
// 											positionName: currentPosition,
// 											period: currentPeriod
// 										}
// 										companyInfo.positions.push(position);
// 										currentPosition = null;
// 										currentPeriod = null;
// 										tempCurrentPeriod = null;
// 										const companyCopy = Object.assign({}, companyInfo);
// 										experience.push(companyCopy);
// 										companyInfo = {};
// 										countryCheck = true;
// 										continue;
// 									}

// 									if (multiplePositions && companyInfo.companyName && currentPosition && currentPeriod) {
// 										const position = {
// 											positionName: currentPosition,
// 											period: currentPeriod
// 										}
// 										companyInfo.positions.push(position);
// 										currentPosition = null;
// 										currentPeriod = null;
// 										tempCurrentPeriod = null;
// 										// if ()
// 										const companyCopy = Object.assign({}, companyInfo);
// 										// experience.push(companyCopy);
// 										// companyInfo = {};
// 										countryCheck = true;
// 										continue;
// 									}

// 									if (companyInfo?.companyName) {
// 										const isCompanyWorkingPeriod = !companyInfo?.period && isExperienceDuration(item.str);
// 										const tempExperienceDuration = isCompanyWorkingPeriod && getCompanyDurationTranslated(item.str);
// 										const isPositionPeriod = isPositionDuration(getCompanyDurationTranslated(item.str));
// 										// console.log({ isPositionPeriod, str: item.str })
// 										const tempPositionDuration = isPositionPeriod && getPositionDurationTranslated(item.str);
// 										if (isCompanyWorkingPeriod) {
// 											companyInfo.period = tempExperienceDuration;
// 										} else if (isPositionPeriod) {
// 											if (!companyInfo?.positions) {
// 												companyInfo.positions = [];
// 											}
// 											currentPeriod = tempPositionDuration;
// 											// const position = {
// 											// 	positionName: currentPosition,
// 											// 	period: tempPositionDuration
// 											// }
// 											// companyInfo.positions.push(position);
// 											// currentPosition = null;





// 											// if (!isPositionDuration(textContent.items[key + 3])) {
// 											// 	experience.push(companyInfo);
// 											// 	companyInfo = {};
// 											// }




// 										} else if (!isPositionDuration && findDuration(textContent.items[key + 1])) {
// 											continue;
// 										} else {
// 											currentPosition = item.str;
// 										}
// 									}
// 									console.log({ companyInfo })



// 									// console.log({ companyInfo })
// 									// if (!companyInfo?.companyName) {
// 									// 	companyInfo.companyName = item.str;
// 									// 	continue;
// 									// }
// 									// if (companyInfo?.companyName) {
// 									// 	const isCompanyWorkingPeriod = !companyInfo?.period && isExperienceDuration(item.str);
// 									// 	const tempExperienceDuration = isCompanyWorkingPeriod && getCompanyDurationTranslated(item.str);
// 									// 	const isPositionPeriod = isPositionDuration(getCompanyDurationTranslated(item.str));
// 									// 	console.log({isPositionPeriod, str: item.str})
// 									// 	const tempPositionDuration = isPositionPeriod && getPositionDurationTranslated(item.str);
// 									// 	if (isCompanyWorkingPeriod) {
// 									// 		companyInfo.period = tempExperienceDuration;
// 									// 	} else if (isPositionPeriod) {
// 									// 		if (!companyInfo?.positions) {
// 									// 			companyInfo.positions = [];
// 									// 		}
// 									// 		const position = {
// 									// 			positionName: currentPosition,
// 									// 			period: tempPositionDuration
// 									// 		}
// 									// 		companyInfo.positions.push(position);
// 									// 		currentPosition = null;
// 									// 		if (!isPositionDuration(textContent.items[key + 2])) {
// 									// 			experience.push(companyInfo);
// 									// 			companyInfo = {};
// 									// 		}

// 									// 	} else {											
// 									// 		currentPosition = item.str;
// 									// 	}
// 									// }


// 								}

// 								continue;
// 							}
// 							return text;
//


const skills = [], education = [], languages = [], experience = [];
const companyNameFontSize = 12;
const timeFontSize = 10.5;
const positionFontSize = 11.5;
const locationColor = "[176,176,176]";

function isMultiplePosition(item, nextItem) {
    return item.fontSize === companyNameFontSize && nextItem.fontSize === timeFontSize;
}

function isCompany(item) {
    return item.fontSize === companyNameFontSize;
}

function isSinglePosition(item, nextItem) {
    return item.fontSize === companyNameFontSize && nextItem.fontSize === timeFontSize;
}

function isStartPositionPeriod(item, nextItem) {
    return item.fontSize === timeFontSize && nextItem.fontSize === timeFontSize;
}

function isEndPositionPeriod(item, prevItem) {
    return item.fontSize === timeFontSize && prev.fontSize === timeFontSize;
}

function isTime(item) {
    return item.fontSize === timeFontSize;
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

function parseLinkedinPDF(textContent) {
    let text = '';
    let parsingSkills = false;
    let parsingLanguages = false;
    let parsingEducation = false;
    let parsingExperience = false;
    let pageFound = 0;
    let companyInfo = experienceBlockDraft;
    let currentPosition = null;
    let currentPeriod = null;
    let currentDuration = null;
    // let tempCurrentPeriod = null;
    let multiplePositions = false;
    let countryCheck = false;


    //TODO: remove elements of pages


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
        // console.log({ item: item.text })

        if (experienceSection.includes(item.text) || languagesSection.includes(item.text) || educationSection.includes(item.text) || skillsSection.includes(item.text)) {
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

            if (isTime(item) && !isLocation(item)) {
                const isNextTimeToo = isTime(textContent[key + 1]);
                const isPrevTimeToo = isTime(textContent[key - 1]);
                const isPrevPosition = isPosition(textContent[key - 1]);
                if (isNextTimeToo) {
                    currentPeriod = item.text;
                }
                if (currentPeriod === textContent[key - 1].text) {
                    currentDuration = item.text;
                }
                console.log('===')
                console.log({text: item.text, isNextTimeToo, isPrevPosition, isPrevTimeToo})
                console.log({currentDuration, currentPeriod});
                console.log('===')
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
                        companyInfo = experienceBlockDraft;
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
                    companyInfo.location = item;
                    experience.push(companyInfo);
                    currentDuration = null;
                    currentPeriod = null;
                    currentPosition = null;
                    countryCheck = false;
                    multiplePositions = false;
                    companyInfo = experienceBlockDraft;
                }
            }

            // console.log({companyPositions: companyInfo.positions})

            // if (isExperienceFull(companyInfo)) {

            // }
        }

        continue;
    }

    console.log({ skills, languages, education, experience })
    experience.forEach((e) => console.log({positions: e.positions}))

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
