import {logger} from '../logger';
import {IExperience, IPage, ITextProperties} from '../types/interfaces'
import {RGB} from '../types/types'

import {promises as fs} from 'fs';
import {v4 as uuidv4} from 'uuid';

export const SKILLS_SECTION: string[] = ['Основные навыки', 'Skills', 'Навички']
export const EXPERIENCE_SECTION: string[] = ['Experience', 'Досвід', 'Опыт работы']
export const EDUCATION_SECTION = ['Education', 'Освіта', 'Образование']
export const LANGUAGES_SECTION: string[] = ['Languages', 'Мови', 'Языки']

export const LINKEDIN_LANGUAGE_LIST: string[] = [
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

export const timePeriodTranslations: {[key: string]: string} = {
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

export function isPageSeparator(text: string): boolean {
    return text.includes('Page ');
}

export function translateTimePeriods(input: string): string {
    const array = input.split(/(\s+)/)
    return array.map((el) => timePeriodTranslations[el] || el).join('')
}

export function translatePositionDuration(input: string): string {
    const duration = input.substring(input.indexOf('(') + 1, input.lastIndexOf(')'))
    const array = duration.split(' ')
    return array.map((el) => timePeriodTranslations[el] || el).join(' ')
}

const COMPANY_NAME_FONT_SIZE = 12
const TIME_FONT_SIZE = 10.5
const COMPANY_HEIGHT = 12
const TIME_COLOR: RGB = '[24,24,24]' as RGB
const POSITION_FONT_SIZE = 11.5
const POSITION_HEIGHT = 11.5
const LOCATION_COLOR: RGB = '[176,176,176]' as RGB

export function getDefaultCompanyInfo(): IExperience {
    return {
        companyName: '',
        positions: [],
        location: '',
        total: '',
    }
}

export function isMultiplePosition(currentText: ITextProperties, nextText: ITextProperties) {
    const {fontSize: currentFontSize} = currentText;
    const {fontSize: nextFontSize, color: nextColor} = nextText;

    return currentFontSize === COMPANY_NAME_FONT_SIZE &&
        nextFontSize === TIME_FONT_SIZE &&
        nextColor === TIME_COLOR;
}

export function isCompany(item: ITextProperties) {
    const {fontSize, height} = item;
    return fontSize === COMPANY_NAME_FONT_SIZE && height === COMPANY_HEIGHT
}

export function isTime(item: ITextProperties) {
    return item.fontSize === TIME_FONT_SIZE && item.color === TIME_COLOR
}

export function isPosition(item: ITextProperties) {
    const {fontSize, height} = item;
    return fontSize === POSITION_FONT_SIZE && height === POSITION_HEIGHT
}

/**
 * Checks if a work experience object is complete.
 * A work experience object is considered complete if it has a company name,
 * a current duration, a current period, a current position, and at least one position.
 */

export function isExperienceFull(
    experience: IExperience,
    currentDuration: string | null,
    currentPeriod: string | null,
    currentPosition: string | null
) {
    return !!experience.companyName && !!currentDuration && !!currentPeriod && !!currentPosition
}

export function isLocation(item: ITextProperties) {
    return item.color === LOCATION_COLOR
}

export function isCvSection(input: string) {
    return (
        EXPERIENCE_SECTION.includes(input) ||
        LANGUAGES_SECTION.includes(input) ||
        EDUCATION_SECTION.includes(input) ||
        SKILLS_SECTION.includes(input)
    )
}

export function comparePages(a: IPage, b: IPage) {
    const pageA = a.pageId
    const pageB = b.pageId

    return pageA > pageB ? 1 : pageA < pageB ? -1 : 0
}

export async function createFileFromBuffer(buffer: Buffer): Promise<string> {
    try {
        const fileName = uuidv4() + '.pdf';
        await fs.writeFile(fileName, buffer);
        return fileName;
    } catch (error) {
        logger.error('Error creating file from buffer:', error);
        throw error;
    }
}

export async function deleteFile(path: string) {
    try {
        await fs.unlink(path);
        logger.info(`File ${path} has been deleted.`);
    } catch (err) {
        logger.error(`Error deleting file ${path}:`, err);
    }
}
