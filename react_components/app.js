/* global module:true */

"use strict";

var React = require("react"),
	Sidebar = require("./sidebar");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			expanded: false
		};
	},
	toggle: function(event) {
		event.stopPropagation();

		this.setState({
			expanded: !this.state.expanded
		});
	},
	collapse : function() {
		this.setState({
			expanded: false
		});
	},
	render: function() {
		return React.createElement("div", {
				className: "app",
				onClick: this.collapse
			},
			React.createElement(Sidebar),
			React.createElement("div", {
					className: "main" + (this.state.expanded ? " expanded" : "")
				},
				React.createElement("div", {
						className: "toolbar"
					},
					React.createElement("a", {
							className: "sidebar-toggle hidden-md-up",
							onClick: this.toggle
						},
						React.createElement("i", {
							className: "fa fa-bars"
						})
					)
				),
				React.createElement("div", {
					className: "container"
				}, this.props.children)
			)
		);
	}
});
