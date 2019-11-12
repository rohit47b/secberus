/*
 * @Author: Virendra Patidar 
 * @Date: 2018-09-19 13:38:44 
 * @Last Modified by: Virendra Patidar
 * @Last Modified time: 2019-05-21 22:32:19
 * Description :- functions used for react virtulized cell renderer
 */

import React from "react"

import {
    SortIndicator,
    CellMeasurer,
    CellMeasurerCache
} from "react-virtualized"
import Switch from '@material-ui/core/Switch'
import Chip from '@material-ui/core/Chip'


import Checkbox from '@material-ui/core/Checkbox'
import { convertLongDateFormatWithDateTime,calculateAgoTimeByLongFormat,convertDateFormatWithDateTime, convertDateFormatWithTime, calculateAgoTime } from 'utils/dateFormat'

import { fetchServiceIconPath } from 'utils/serviceIcon'
export const sNoCellRenderer = ({ rowIndex }) => {
    return (
        <div>
            {rowIndex + 1}
        </div>
    );
};


export const statusCellRenderer = ({ rowData, cellData, rowIndex, statusChangeDialog }) => {
    let boxClass = ["switch-green"];
    if (cellData === undefined || cellData === true || cellData === null) {
        boxClass.push('active');
    }
    return (
        <div>
            <Switch className={boxClass.join(' ')} checked={cellData === undefined || cellData === null ? true : cellData} onChange={() => statusChangeDialog(rowIndex, rowData._id)} />
        </div>
    );
};

export const defaultCellRenderer = ({ cellData }) => {
    return (
        <div>
            {cellData}
        </div>
    );
};

export const serviceCellRenderer = ({ rowData, cellData }) => {
    return (
        <div className="service-icon" title={rowData.service_name ? rowData.service_name : cellData}>
            {cellData !== undefined && <img src={fetchServiceIconPath(cellData)} />} {rowData.service_name ? rowData.service_name : cellData}
        </div>
    );
};

export const yesNoIconCellRenderer = ({ rowData, cellData }) => {
    return (<div className="d-flex-imp">
        <span>
            {cellData}
        </span>
        {cellData === 'No' ? <span className='text-danger d-block mrL15'><i className="fa fa-times-circle fnt-16" aria-hidden="true"></i></span> : <span className="text-success d-block mrL10"><i className="fa fa-check-circle fnt-16" aria-hidden="true"></i></span>}
    </div>
    );
};

export const publicPrivateIconCellRenderer = ({ rowData, cellData }) => {
    return (<div className="d-flex-imp">
        <span>
            {cellData === 'Yes' ? 'Public' : 'Private'}
        </span>
        {cellData === 'Yes' ? <span className='text-danger d-block mrL15'><i className="fa fa-times-circle fnt-16" aria-hidden="true"></i></span> : <span className="text-success d-block mrL10"><i className="fa fa-check-circle fnt-16" aria-hidden="true"></i></span>}
    </div>
    );
};


export const headerRenderer = ({ dataKey, label, sortBy, sortDirection }) => {
    return (
        <div className="table-td">
            {dataKey === 'checkbox' &&
                <Checkbox
                    value="checkedA"
                    className="mt-checkbox white-checkbox"
                />}
            {dataKey !== 'checkbox' && label}
            {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
        </div>
    );
}

const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});

export const wrapTextCellRenderer = ({ cellData, columnIndex, key, parent, rowIndex, style }) => {
    return (
        <CellMeasurer
            cache={cache}
            columnIndex={columnIndex}
            key={key}
            parent={parent}
            rowIndex={rowIndex}
        >
            <div
                style={{
                    ...style,
                    whiteSpace: 'normal'
                }}
                title={cellData}
            >
                {cellData}
            </div>
        </CellMeasurer>
    );
}

export const wrapComponentCellRenderer = (params) => {
    return (
        <CellMeasurer
          cache={params.cache}
          columnIndex={params.columnIndex}
          key={params.dataKey}
          parent={params.parent}
          rowIndex={params.rowIndex}>
          <div
            className={"tableColumn"}
            style={{
              whiteSpace: 'normal',
            }}>
            {params.component}
          </div>
        </CellMeasurer>
      );
}

export const dateCellRenderer = ({ cellData }) => {
    return (
        <div>
            {convertDateFormatWithDateTime(cellData)}
        </div>
    );
};

export const longDateCellRenderer = ({ cellData }) => {
    return (
        <div>
            {convertLongDateFormatWithDateTime(cellData)}
        </div>
    );
};

export const timeCellRenderer = ({ cellData }) => {
    return (
        <div>
            {convertDateFormatWithTime(cellData)}
        </div>
    );
};

export const timeAgoCellRenderer = ({ cellData }) => {
    return (
        <div>
            {calculateAgoTime(cellData)}
        </div>
    );
};
export const timeAgoByLongTimeCellRenderer = ({ cellData }) => {
    return (
        <div>
            {calculateAgoTimeByLongFormat(cellData)}
        </div>
    );
};



export const noRowsRenderer = () => {
    return <div className="data-not-found">
        <span>Records Not Found</span>
    </div>
}

export const emptyCellRenderer = ({ cellData }) => {
    return (<div title={cellData}>
        {cellData === '' ? '-' : cellData}
    </div>)
}

export const arrayCellRenderer = ({ cellData }) => {
    return (<div title={cellData}>
        {
            cellData.map((item, index) => {
                return <div className='d-block' key={item}>{item} </div>
            })
        }
        {cellData.length==0 && "-"}
    </div>)
}

export const chipArrayCellRenderer = ({ cellData }) => {
    return (<div title={cellData}>
        {
            cellData.map((item, index) => {
                return   <Chip label={item} className="chip-gray" />
            })
        }
        {cellData.length==0 && "-"}
    </div>)
}