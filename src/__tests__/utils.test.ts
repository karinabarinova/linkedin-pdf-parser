import {ITextProperties} from '../types/interfaces';
import {EDUCATION_SECTION, EXPERIENCE_SECTION, LANGUAGES_SECTION, LINKEDIN_LANGUAGE_LIST, SKILLS_SECTION, isPageSeparator, LANGUAGE_LEVEL, TIME_PERIOD_TRANSLATIONS, translateTimePeriods, translatePositionDuration, isCompany, isMultiplePosition, isTime, isPosition, isExperienceFull, isLocation, isCvSection, comparePages} from '../utils/index'

describe('isPageSeparator', () => {
    it('should return true if the input includes "Page "', () => {
        expect(isPageSeparator('Page 1')).toBe(true);
        expect(isPageSeparator('Page 2')).toBe(true);
        expect(isPageSeparator('This is a sentence.')).toBe(false);
    });
});

describe('translateTimePeriods', () => {
    it('should correctly translate time periods', () => {
        expect(translateTimePeriods('3 месяца')).toBe('3 months');
        expect(translateTimePeriods('1 год')).toBe('1 year');
        expect(translateTimePeriods('2 года 6 месяцев')).toBe('2 years 6 months');
        expect(translateTimePeriods('3 года')).toBe('3 years');
        expect(translateTimePeriods('6 месяцев')).toBe('6 months');
        expect(translateTimePeriods('20 января')).toBe('20 january');
    });
});

describe('constants', () => {
    it('should contain the correct values', () => {
        expect(SKILLS_SECTION).toEqual(['Основные навыки', 'Skills', 'Навички']);
        expect(EXPERIENCE_SECTION).toEqual(['Experience', 'Досвід', 'Опыт работы']);
        expect(EDUCATION_SECTION).toEqual(['Education', 'Освіта', 'Образование']);
        expect(LANGUAGES_SECTION).toEqual(['Languages', 'Мови', 'Языки']);
        expect(LINKEDIN_LANGUAGE_LIST).toContain('English');
        expect(LANGUAGE_LEVEL).toContain('(Native or Bilingual)');
        expect(Object.keys(TIME_PERIOD_TRANSLATIONS)).toContain('год');
    });
});

describe('translatePositionDuration', () => {
    test('translatePositionDuration should translate time periods to English', () => {
        const input = '(3 года 2 месяца)';
        const expectedOutput = '3 years 2 months';
        expect(translatePositionDuration(input)).toBe(expectedOutput);
    });
})

describe('isCompany', () => {
    test('isCompany should return true for correct fontSize and heigh values', () => {
        const companyMetadata: ITextProperties = {
            text: 'Trainee Full Stack Software Engineer',
            direction: 'ltr',
            width: 190.32500000000002,
            height: 12,
            top: 473.0280000699999,
            left: 223.56,
            transform: [11.5, 0, 0, 11.5, 223.56, 473.0280000699999],
            fontSize: 12,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[24, 24, 24]'
        }
        expect(isCompany(companyMetadata)).toBe(true)
    })
    test('isCompany should return false for wrong fontSize or height values', () => {
        const wrongCompanyMetadata: ITextProperties = {
            text: 'Trainee Full Stack Software Engineer',
            direction: 'ltr',
            width: 190.32500000000002,
            height: 11.5,
            top: 473.0280000699999,
            left: 223.56,
            transform: [11.5, 0, 0, 11.5, 223.56, 473.0280000699999],
            fontSize: 11.5,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[24, 24, 24]'
        }
        expect(isCompany(wrongCompanyMetadata)).toBe(false)
    })
})

describe('isMultiplePosition', () => {
    test('isMultiplePosition should return true for correct fontSize and color values', () => {
        const currentText: ITextProperties = {
            text: 'Namecheap, Inc',
            direction: 'ltr',
            width: 87.33599999999998,
            height: 12,
            top: 243.76099967999994,
            left: 223.56,
            transform: [12, 0, 0, 12, 223.56, 243.76099967999994],
            fontSize: 12,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[24,24,24]'
        }
        const nextText: ITextProperties = {
            text: '2 года 4 месяца',
            direction: 'ltr',
            width: 77.88899999999998,
            height: 10.5,
            top: 227.27500152999994,
            left: 223.56,
            transform: [10.5, 0, 0, 10.5, 223.56, 227.27500152999994],
            fontSize: 10.5,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[24,24,24]'
        }
        expect(isMultiplePosition(currentText, nextText)).toBe(true)
    })
    test('isMultiplePosition should return false for wrong fontSize or color values', () => {
        const currentText: ITextProperties = {
            text: 'Namecheap, Inc',
            direction: 'ltr',
            width: 87.33599999999998,
            height: 12,
            top: 243.76099967999994,
            left: 223.56,
            transform: [12, 0, 0, 12, 223.56, 243.76099967999994],
            fontSize: 14,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[24, 123, 24]'
        }
        const nextText: ITextProperties = {
            text: '2 года 4 месяца',
            direction: 'ltr',
            width: 77.88899999999998,
            height: 12,
            top: 227.27500152999994,
            left: 223.56,
            transform: [10.5, 0, 0, 10.5, 223.56, 227.27500152999994],
            fontSize: 10.5,
            fontName: 'g_d0_f1',
            fontOriginName: 'EAAAAA+ArialUnicodeMS',
            bold: false,
            italic: false,
            black: false,
            color: '[123, 24, 24]'
        }
        expect(isMultiplePosition(currentText, nextText)).toBe(false)
    })
})
