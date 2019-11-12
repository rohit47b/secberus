/**
 * External dependencies
 */
import React from 'react';

/**
 * row renderer for React-Virtualized Table that allows to show sub-rows in a drawer
 *	@return {React.element} the element to show in the row's drawer
 */
export default function RowRendererWithDrawer({
	rowData,
	className,
	columns,
	style,
	collapsedHeight,
	expandedHeight,
	drawerContent,
	expanded
}) {
	return (

		<div
			className={!expanded ? className : (className + " is-open")}
			style={{ ...style, display: 'block' }}
		>
			<div className="ReactVirtualized__Table__sub-row" style={{ display: 'flex' }}>
				{columns}
			</div>
			<div className="ReactVirtualized__Table__sub-row scroll-bar" style={{ display: 'flex', minHeight: expandedHeight - collapsedHeight  }}>
				{
					(expanded)
						? drawerContent
						: ''
				}
			</div>
		</div>
	);
}
