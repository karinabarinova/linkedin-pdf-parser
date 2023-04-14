import {RGB} from "./types";

export interface ICompanyPositionStructure {
    companyName: string;
    location: string;
    positions: IPosition[];
    total: string | null;

}

export interface IPosition {
    positionName: string | null,
    duration: string | null,
    period: string | null
}

export interface IPage {
    width: number;
    height: number;
    pageId: number;
    texts: ITextProperties[]
}

export interface ITextProperties {
    text: string,
    direction: 'ltr' | 'rtl',
    width: number,
    height: number,
    top: number,
    left: number,
    transform: number[],
    fontSize: number,
    fontName: string,
    fontOriginName: string,
    bold: boolean,
    italic: boolean,
    black: boolean,
    color: RGB
}
