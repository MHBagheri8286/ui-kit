import { CardWidgetStyle, ICardWidget, getCompatibleLayout } from "@ui-kit/widgets/index";
import { setKeyPascalCaseToDiffCase } from "@ui-kit/utilize";

export class CardWidgetController {

    private _conditions = {
        titleContainer: this.all(),
        descContainer: this.all(),
        titleItem: this.all(),
        descItem: [CardWidgetStyle.style4, CardWidgetStyle.style5, CardWidgetStyle.style6, CardWidgetStyle.style7],
        cardLink: [CardWidgetStyle.style1, CardWidgetStyle.style2, CardWidgetStyle.style3, CardWidgetStyle.style4, CardWidgetStyle.style5, CardWidgetStyle.style7],
        iconMode: [CardWidgetStyle.style1, CardWidgetStyle.style2, CardWidgetStyle.style3, CardWidgetStyle.style7],
        btnLink: [CardWidgetStyle.style6],
        alternate: [CardWidgetStyle.style6]
    }

    private _model: CardWidgetStyle;

    constructor(public dataSource: ICardWidget) {
        dataSource = this.dataSource;
        const style = dataSource.style?.replace(dataSource?.style[0], dataSource?.style[0].toLocaleLowerCase());
        this._model = Object.values(CardWidgetStyle).find(x => CardWidgetStyle[Number(x)] === style) as CardWidgetStyle ?? CardWidgetStyle.style1;
    }

    private all() {
        const condition = Object.values(CardWidgetStyle).map(x => Number(x));
        return condition;
    }

    public getClassName(): string {
        return setKeyPascalCaseToDiffCase("kebabCase", CardWidgetStyle[this._model]?.toString());
    }

    public handleCondition = (key: keyof typeof this._conditions) => {
        const result = this._conditions[key]?.some(condition => this._model === condition);
        return result;
    }

    public getModel = () => {
        return this._model;
    }

    public getRowCount = () => {
        return Math.floor(this.dataSource.items?.contentItems.length! / getCompatibleLayout(this.dataSource.layouts).columnCount!) ?? 0
    }
}