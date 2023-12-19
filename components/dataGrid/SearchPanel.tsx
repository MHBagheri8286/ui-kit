import Search, { ISearchProps } from "@components/Search";
import { FC } from "react";

export interface ISearchPanelProps extends ISearchProps {
    visible?: boolean
}

const SearchPanel: FC<ISearchPanelProps> = (props) => {
    return <div className="search-panel">
        <Search {...props} />
    </div>;
};

SearchPanel.defaultProps = {
    visible: true
}

SearchPanel.displayName = "SearchPanel";

export default SearchPanel;
