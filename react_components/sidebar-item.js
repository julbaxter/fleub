"use strict";

var React = require("react"),
	actions = require("../react_stores/actions"),
	panelStore = require("../react_stores/panel-store"),
	$ = require("jquery");

module.exports = React.createClass({
	handleClick: function(e) {
		// Prevent the root component to hide the panel.
		e.stopPropagation();

		var position = this.refs.item.getDOMNode().getBoundingClientRect().top;
		actions.togglePanel(position, this.props.content);
	},
	onPanelChange: function(isActivated, position, content) {
		if(isActivated && content === this.props.content) {
			$(this.refs.item.getDOMNode()).addClass("selected");
		} else {
			$(this.refs.item.getDOMNode()).removeClass("selected");
		}
	},
	componentDidMount: function() {
		this.unsubscribe = panelStore.listen(this.onPanelChange);
	},
	componentWillUnmount: function() {
		this.unsubscribe();
	},
	render: function() {
		return React.createElement("li", {
				ref: "item",
				onClick: this.handleClick,
				className: "menu-item"
			},
			React.createElement("a", null,
				React.createElement("div", null, React.createElement("i", {
					className: "fa " + this.props.icon
				})),
				React.createElement("div", null, this.props.caption)
			)
		);
	}
});
