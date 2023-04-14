import { ICompanyPositionStructure, IPage, ITextProperties } from '../types/interfaces'
import { RGB } from '../types/types'

const fs = require('fs').promises
const { v4: uuidv4 } = require('uuid')

export const skillsSection: string[] = ['Основные навыки', 'Skills', 'Навички']
export const experienceSection: string[] = ['Experience', 'Досвід', 'Опыт работы']
export const educationSection = ['Education', 'Освіта', 'Образование']
export const languagesSection: string[] = ['Languages', 'Мови', 'Языки']

export const linkedInLanguageList: string[] = [
    'Arabic',
    'Chinese',
    'Czech',
    'Danish',
    'Dutch',
    'English',
    'Latin',
    'French',
    'German',
    'Hindi',
    'Indonesian',
    'Italian',
    'Japanese',
    'Korean',
    'Norwegian',
    'Polish',
    'Portuguese',
    'Malay',
    'Russian',
    'Romanian',
    'Spanish',
    'Swedish',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Арабська',
    'Китайська',
    'Чеська',
    'Датська',
    'Голландська',
    'Англійська',
    'Латинська',
    'Французька',
    'Німецька',
    'Хінді',
    'Індонезійська',
    'Італійська',
    'Японська',
    'Корейська',
    'Норвезька',
    'Польська',
    'Португальська',
    'Малайська',
    'Російська',
    'Румунська',
    'Іспанська',
    'Шведська',
    'Тайська',
    'Турецька',
    'Українська',
    'Арабский',
    'Китайский',
    'Чешский',
    'Датский',
    'Голландский',
    'Английский',
    'Латинский',
    'Французский',
    'Немецкий',
    'Хинди',
    'Индонезийский',
    'Итальянский',
    'Японский',
    'Корейский',
    'Норвежский',
    'Польский',
    'Португальский',
    'Малайский',
    'Русский',
    'Румынский',
    'Испанский',
    'Шведский',
    'Тайский',
    'Турецкий',
    'Украинский',
]

export const languageLevel: string[] = [
    '(Native or Bilingual)',
    '(Full Professional)',
    '(Professional Working)',
    '(Elementary)',
    '(Limited Working)',
]

export const timePeriodTranslations: { [key: string]: string } = {
    год: 'year',
    года: 'years',
    рік: 'year',
    роки: 'years',
    месяц: 'month',
    месяца: 'month',
    месяцев: 'months',
    місяць: 'month',
    місяців: 'months',
    января: 'january',
    февраля: 'february',
    марта: 'march',
    апреля: 'april',
    мая: 'may',
    июня: 'june',
    июля: 'july',
    августа: 'august',
    сентября: 'september',
    октября: 'october',
    ноября: 'november',
    декабря: 'december',
    січня: 'january',
    лютого: 'february',
    березня: 'march',
    квітня: 'april',
    травня: 'may',
    червня: 'june',
    липня: 'july',
    серпня: 'august',
    вересня: 'september',
    жовтня: 'october',
    листопада: 'november',
    грудня: 'december',
}

export function getCompanyDurationTranslated(input: string): string {
    const array = input.split(/(\s+)/)
    return array.map((el) => timePeriodTranslations[el] || el).join('')
}

export function getPositionDurationTranslated(input: string): string {
    const duration = input.substring(input.indexOf('(') + 1, input.lastIndexOf(')'))
    const array = duration.split(' ')
    return array.map((el) => timePeriodTranslations[el] || el).join(' ')
}

const companyNameFontSize = 12
const timeFontSize = 10.5
const companyHeight = 12
const timeColor: RGB = '[24,24,24]' as RGB
const positionFontSize = 11.5
const positionHeight = 11.5
const locationColor: RGB = '[176,176,176]' as RGB

export function getDefaultCompanyInfo(): ICompanyPositionStructure {
    return {
        companyName: '',
        positions: [],
        location: '',
        total: '',
    }
}

export function isMultiplePosition(item: ITextProperties, nextItem: ITextProperties) {
    return item.fontSize === companyNameFontSize && nextItem.fontSize === timeFontSize && nextItem.color === timeColor
}

export function isCompany(item: ITextProperties) {
    return item.fontSize === companyNameFontSize && item.height === companyHeight
}

export function isTime(item: ITextProperties) {
    return item.fontSize === timeFontSize && item.color === timeColor
}

export function isPosition(item: ITextProperties) {
    return item.fontSize === positionFontSize && item.height === positionHeight
}

export function isExperienceFull(
    experience: ICompanyPositionStructure,
    currentDuration: string | null,
    currentPeriod: string | null,
    currentPosition: string | null
) {
    return !!experience.companyName && !!currentDuration && !!currentPeriod && !!currentPosition
}

export function isLocation(item: ITextProperties) {
    return item.color === locationColor
}

export function isCvSection(input: string) {
    return (
        experienceSection.includes(input) ||
        languagesSection.includes(input) ||
        educationSection.includes(input) ||
        skillsSection.includes(input)
    )
}

export function comparePages(a: IPage, b: IPage) {
    const pageA = a.pageId
    const pageB = b.pageId

    let comparison = 0
    if (pageA > pageB) {
        comparison = 1
    } else if (pageA < pageB) {
        comparison = -1
    }
    return comparison
}

export async function createFileFromBuffer(buffer: string) {
    const fileName = uuidv4() + '.pdf'
    await fs.writeFile(fileName, buffer)
    return fileName
}

export async function deleteFile(path: string) {
    await fs.unlink(path)
}
